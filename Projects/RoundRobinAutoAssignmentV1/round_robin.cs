//////////////////---------- STARTING ROUND ROBIN CODE -----------------------------------------
/* 
   Name: Round Robin
   Description: This is the C# (aka Run Code) for assigning tickets to users based in a round robin fashion
   Author: Steven Waters
   CoAuthor: Barry Collins 
   Last Modified: 20151117
   ChangeLog: 
    - XXX yyyymmdd String of Text Describing Changes. XXX should be your initials  
    - XXX yyyymmdd String of Text Describing Changes. XXX should be your initials
*/

/* 
    Declaring EntityHandler and PersistanceManager objects for the IR 
*/
ApplicationInterfaces.EntityHandlers.IEntityHandler eh = UserSession.GetHandlerForType(typeof(IIncidentRequest));

ApplicationInterfaces.Persistence.IPersistenceManager pMgr = ApplicationManager.Instance.GetHandlerForType(typeof(IIncidentRequest)).PersistenceManager;

/*
    Starting a TRY statement which will do the following: 
        - Declare several variables for building a query string
        - Pass the ID of the current requester for the ticket (item) to the GetNextAssignee SP 
        - Pass a specified team name to the GetNextAsisgnee SP
        - Create a new variable for storing the results of an executed query 
        - Take the result, which will be similar to 'Entity ID 107 of type Person', and set it the AssignTo Field 
        - Write the string "yes" or another specified string value into a custom field with an ID of "UDF_RoundRobin"
*/
try {

    // Initializing variables for building a query string
    System.Text.StringBuilder query = new System.Text.StringBuilder();

    IList queryResults = null;

    IList columnList = null;

    // Removing the previous query or all of the items added to the query list that is defined below
    query.Clear();

    int currentRequester = Item.Requester.ID;

    sLogger.Info("Requester is: " + currentRequester);

    // Defining the SQL query
    query.Append(string.Format(@"EXEC GetNextAssignee @Team='Round Robin Team', @RequesterID=" + currentRequester));

    // Execute the query and assigning the results to a variable
    queryResults = pMgr.ExecuteQuery(UserSession, query, null, DateTime.MinValue, false, out columnList);


    // In this case the query returns only one result, fetch the result from the query list
    using(ApplicationInterfaces.Persistence.IUnitOfWork unitOfWork = ApplicationServices.SessionManager.Instance.ServerSession.CreateUnitOfWork()) {

        foreach(object[] ci in queryResults) {

            // Splitting the query results
            string joined = string.Join("", ci);

            // Printing out the result of the query - can comment this out
            sLogger.Info(joined);

            // Converting the result to an integer for insertion into an int field in the ticket
            int val1 = Convert.ToInt32(joined);

            // Printing out the assignee's OID value that will be used for this
            sLogger.Info("Round Robin assignee OID is: " + val1);

            // Declaring a new object for storing information about the assignee. This class is doing a lookup in the CG_Pricipal table. 
            IPrincipal assignee = (IPrincipal) ApplicationServices.SessionManager.Instance.ServerSession.GetHandlerForType(typeof(IPrincipal)).Find(ApplicationServices.SessionManager.Instance.ServerSession, unitOfWork, typeof(IPrincipal), val1, false);
           
            // If the query doesn't return an integer (aka the an OID value for the assignee) then nothing will happen from this point forward
            if (val1 != null) {

                // Declaring a variable for storing the name of the "AssignedTo" field which will contain the name of the next assignee
                string fieldName1 = "AssignedTo";

                // Declaring a variable that will store a character or a string , this will let SQL script know that the ticket was processed by the Round Robin system
                string fieldName2 = "UDF_RoundRobin";

                // Declaring another variable for storing the character or string that will be written to the field that is assigned to the fieldName2 variable
                string val2 = "yes";

                // Printing out the value being used for the lookup the user - can comment this out
                sLogger.Info("value1 = " + val1);

                // Printing out the value that will written to the custom field that is assigned to fieldName2 variable
                sLogger.Info("value2 = " + val2);

                // Passing the name of the AssignedTo field to this method so we can get it's properties
                System.Reflection.PropertyInfo fieldInfo1 = Item.GetType().GetProperty(fieldName1);

                // Passing the name of the custom field to this method so we can get it's properties
                System.Reflection.PropertyInfo fieldInfo2 = Item.GetType().GetProperty(fieldName2);

                // Setting a character or string value to the custom field so the round robin system will know which tickets it's processed 
                fieldInfo2.SetValue(Item, val2, null);

                // If the AssignedTo field isn't found on the ticket form then an error should be thrown
                if (fieldInfo1 == null) {

                    // Printing out an error when AssignedTo field doesn't have any properties
                    sLogger.Error(string.Format("Could not find a property '{0}' in table 'I{1}'", fieldName1, Item.GetType().Name));

                } // End If

                // If the AssignedTo field is found and if ChangeGear can write to it then person's information can be saved to the assigned to field
                if (fieldInfo1 != null && fieldInfo1.CanWrite) {
                    
                    // Inserting the team member's information into the ticket into the AssignTo field
                    fieldInfo1.SetValue(Item, assignee, null);

                    // Printing out the OID value for the team member based on what this script found in the cg_Principal table
                    sLogger.Info(assignee.ID);

                    // Printing out the assignee's information from the CG_Principal 
                    sLogger.Info(assignee);

                    // Printing out the type of module the ticket was submitted in
                    sLogger.Info(Item.GetType().Name);

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