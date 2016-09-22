//////////////////---------- STARTING ROUND ROBIN CODE -----------------------------------------
/* 
   Name: Round Robin
   Description: This is the C# (aka Run Code) for assigning tickets to users based in a round robin fashion
   Author: Steven Waters
   CoAuthor: Barry Collins 
   Created: 20151117
   ChangeLog: 
    - SSW 20160201 String of Text Describing Changes. XXX should be your initials  
    - ZZZ yyyymmdd String of Text Describing Changes. ZZZ should be your initials
*/

/* 
    Declaring EntityHandler and PersistanceManager objects for the IR 
*/
ApplicationInterfaces.EntityHandlers.IEntityHandler eh = UserSession.GetHandlerForType(typeof(IIncidentRequest));

ApplicationInterfaces.Persistence.IPersistenceManager pMgr = ApplicationManager.Instance.GetHandlerForType(typeof(IIncidentRequest)).PersistenceManager;

/*
    Starting a TRY statement which will do the following: 
        - Build a query string
        - Pass the ID of the current requester for the ticket (item) to a SQL script
        - Pass a specified team name to a SQL script
        - Create a new variable for storing the results of an executed query 
        - Takes the result, which will be an OID value, and set it the AssignTo Field 
        - Assigns a value of "true" to a variable for the "UDF_RoundRobin" field 
          so that field is set to true after the script executes
*/

try {

    // Initializing variables for building a query string
    System.Text.StringBuilder query = new System.Text.StringBuilder();

    // Setting variable for debug settings
    bool debug = false; 

    IList queryResults = null;

    IList columnList = null;

    // Removing the previous query or all of the items added to the query list that is defined below
    query.Clear();

    query.Append(string.Format(@"
     /*
        First we are creating a temporary table to store the users who are logged in and who are not deleted in the system. 
        This block of code contains 3 SELECT statements. The outermost SELECT inserts records into a temporary table. The inner 
        SELECT statement (the inner SELECT statement below the outermost SELECT statement, selects records from the CG_UserLog 
        table based on the innermost SELECT statement. The innermost SELECT statement selects users who are logged in 
        and who are not deleted. It returns the data in the LoggedIn column for each record using the MAX() function and it 
        also groups the data by the UserID column data so only distinct records are selected
      */
      SELECT * 
      INTO   #temp1
      FROM (
      
            SELECT aa.UserID, 
                    aa.LoggedIn 
            FROM cg_UserLog aa
            WHERE LoggedIn in (
                                SELECT MAX(LoggedIn) 
                                FROM CG_UserLog bb
                                WHERE bb.UserLoggedIn = 1
                                    AND bb.GCRecord IS NULL
                                GROUP BY bb.UserID
                              )

            )a
    
       /* 
        Temporary table for storing users who are in a certain team, who are logged into the system, and who
        have the round robin rotation field checked for their user profile. The inner SELECT returns results like this:
            OID RowN
            107 1
            62  2
            74  3 
        So if user with an OID of 62 was assigned the last ticket, then the script will assign the next ticket to the
        user with an OID of 74. If  user 74 signs out and signs back in then she will be at the top of the list and will 
        still get the next ticket which means the user with an OID of 62 will be at the bottom of the list. 
        Everyone will get a ticket before user 62. Some users in this list might be skipped over depending if they were manually assigned a ticket.  
      */
      SELECT *
      INTO   #temp2
      FROM   (

              SELECT aa.OID AS OID,
                     Row_number()
                       OVER ( 
                         ORDER BY bb.LoggedIn DESC) AS RowN, bb.LoggedIn
              FROM   CG_Person aa
                     JOIN #temp1 bb
                             ON aa.OID = bb.UserID
              WHERE  aa.UDF_RoundRobinRotation = 1
              GROUP  BY aa.OID,
                        bb.LoggedIn

            )b


      /* 
        Taking the results from the #temp2 and join them to the selected results from the CG_IncidentRequest table.
        This is to get the last submitted incident and row number (from the #temp1 table) of the assignee for it.  
      */
      SELECT *
      INTO   #temp3
      FROM   (

              SELECT TOP 1 CASE
                             WHEN bb.RowN IS NULL THEN 1
                             ELSE bb.RowN
                           END AS RowN
              FROM   CG_IncidentRequest aa
                     FULL OUTER JOIN #temp2 bb
                                  ON aa.AssignedTo = bb.OID
              WHERE  aa.UDF_RoundRobin = 1
                     AND aa.AssignedTo IS NOT NULL
                     AND aa.GCRecord IS NULL
              ORDER  BY aa.SubmitDate DESC

            )c
        
      /* Declaring a local variable for storing the number of rows in the #temp2 table */
      DECLARE @TotRow INT

      SET @TotRow = (
                        SELECT Count(RowN)
                        FROM   #temp2
                    )

    
      /* 
        Finding out if the person last assigned is the last person in the #temp3 table, 
        if so set the row number @ID to 1 
      */
      DECLARE @ID INT

      SET @ID = (
                    SELECT 
                        CASE
                            WHEN RowN < ( @TotRow ) THEN RowN + 1
                            ELSE 1
                        END
                    FROM   #temp3
                )
        

      /* 
        Returning the OID of the team member who should be assigned to the ticket 
        This SELECT statement should always return only one record and a single column or value for that record.
        The value in the record should an integer value since the run code expects a integer value
      */
      SELECT  OID AS AssignedTo
      FROM   #temp2
      WHERE  RowN = @ID 

      /* Dropping temporary tables so the script will have fresh data during the next submit/create action that is fired */

      DROP TABLE #temp1

      DROP TABLE #temp2

      DROP TABLE #temp3

"));



    // Execute the query and assigning the results to a variable
    queryResults = pMgr.ExecuteQuery(UserSession, query, null, DateTime.MinValue, false, out columnList);


    // In this case the query returns only one result, fetch the result from the query list
    using(ApplicationInterfaces.Persistence.IUnitOfWork unitOfWork = ApplicationServices.SessionManager.Instance.ServerSession.CreateUnitOfWork()) {

        foreach(object[] ci in queryResults) {

            // Splitting the query results
            string joined = string.Join("", ci);

            // Printing out the result of the query - can comment this out
            if(debug==true){sLogger.Info(joined);}

            // Converting the result to an integer for insertion into an int field in the ticket
            int assigneeID = Convert.ToInt32(joined);

            // Printing out the assignee's OID value that will be used for this
            if(debug==true){sLogger.Info("Round Robin assignee OID is: " + assigneeID);}

            // Declaring a new object for storing information about the assignee. This class is doing a lookup in the CG_Pricipal table. 
            IPrincipal assignee = (IPrincipal) ApplicationServices.SessionManager.Instance.ServerSession.GetHandlerForType(typeof(IPrincipal)).Find(ApplicationServices.SessionManager.Instance.ServerSession, unitOfWork, typeof(IPrincipal), assigneeID, false);
           
            // If the query doesn't return an integer (aka the an OID value for the assignee) then nothing will happen from this point forward
            if (assigneeID != null) {

                // Declaring a variable for storing the name of the "AssignedTo" field which will contain the name of the next assignee
                string assigneToField = "AssignedTo";

                // Printing out the value being used for the lookup the user - can comment this out
                if(debug==true){sLogger.Info("value1: " + assigneeID);}

                // Passing the name of the AssignedTo field to this method so we can get it's properties
                System.Reflection.PropertyInfo assigneToFieldInfo = Item.GetType().GetProperty(assigneToField);

                // Setting RoundRobin field boolean value 
                (((I_UDT_IncidentRequest_Extended)Item).UDF_RoundRobin) = true;

                // If the AssignedTo field isn't found on the ticket form then an error should be thrown
                if (assigneToFieldInfo == null) {

                    // Printing out an error when AssignedTo field doesn't have any properties
                    sLogger.Error(string.Format("Could not find a property '{0}' in table 'I{1}'", assigneToField, Item.GetType().Name));

                } // End If

                // If the AssignedTo field is found and if ChangeGear can write to it then person's information can be saved to the assigned to field
                if (assigneToFieldInfo != null && assigneToFieldInfo.CanWrite) {
                    
                    // Inserting the team member's information into the ticket into the AssignTo field
                    assigneToFieldInfo.SetValue(Item, assignee, null);

                    // Printing out the OID value for the team member based on what this script found in the cg_Principal table
                    if(debug==true){sLogger.Info(assignee.ID);}

                    // Printing out the assignee's information from the CG_Principal 
                    if(debug==true){sLogger.Info(assignee);}

                    // Printing out the type of module the ticket was submitted in
                    if(debug==true){sLogger.Info(Item.GetType().Name);}

                } // End If
            } 
        }

    } // End Using

    // Save the ticket
    eh.Save(UserSession, Item, null);

} catch (Exception ex) {

    // Declaring a new string variable for storing an error message when the workflow action can't be performed
    string msg = String.Format("Exception happened when trying to perform workflow action on update the values in the Incident ticket");

    // Printing out the error message in the log file
    sLogger.Error(msg, ex);

} // End Try/Catch

//////////////////---------- ENDING ROUND ROBIN CODE -----------------------------------------