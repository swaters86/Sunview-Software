--
/* 
Execute the below stored procedure statement to see the assignee value that will be returned to the run code 
exec GetNextAssignee @Team='Round Robin Team', @RequesterID=1
*/ 

USE [ChangeGear]
GO
/****** Object:  StoredProcedure [dbo].[GetNextAssignee]    Script Date: 11/20/2015 11:12:18 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROC [dbo].[GetNextAssignee]
	@Team NVARCHAR(30), 
	@RequesterID INT
AS
  BEGIN
   
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
			OID	RowN
			107	1
			62	2
			74	3 
		So if user with an OID of 62 was assigned the last ticket, then the script will assign the next ticket to the
		user with an OID of 74. If  user 74 signs out and signs back in then she will be at the top of the list and will 
		still get the next ticket which means the user with an OID of 62 will be at the bottom of the list. 
		Everyone will get a ticket before user 62. Some users in this list might be skipped over depending if they were manually assigned a ticket.  
      */
      SELECT *
      INTO   #temp2
      FROM   (

			  SELECT aa.Person AS OID,
                     Row_number()
                       OVER ( 
                         ORDER BY cc.LoggedIn DESC) AS RowN, cc.LoggedIn
              FROM   VCG_PersonToTeam_Grid_View aa
                     JOIN CG_Person bb
                             ON aa.Person = bb.OID
                     JOIN #temp1 cc
                             ON aa.Person = cc.UserID
              WHERE  bb.UDF_RoundRobinRotation = 1
                     AND aa.Teamname = @team
                     AND aa.GCRecord IS NULL
              GROUP  BY aa.Person,
                        cc.LoggedIn

			)b
      
	  /*  Run this get a list of logged in users who qualify for the round robin assignment
		  SELECT *
		  INTO   #temp2
		  FROM   (

				  SELECT aa.Person AS OID,
                     Row_number()
                       OVER ( 
                         ORDER BY cc.LoggedIn DESC) AS RowN, cc.LoggedIn
				  FROM   VCG_PersonToTeam_Grid_View aa
						 JOIN CG_Person bb
								 ON aa.Person = bb.OID
						 JOIN #temp1 cc
								 ON aa.Person = cc.UserID
				  WHERE  bb.UDF_RoundRobinRotation = 1
						 AND aa.Teamname = 'Round Robin Team'
						 AND aa.GCRecord IS NULL
				  GROUP  BY aa.Person,
							cc.LoggedIn

			)b
	  */


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
              WHERE  aa.UDF_RoundRobin ='yes'
                     AND aa.AssignedTo IS NOT NULL
                     AND aa.GCRecord IS NULL
              ORDER  BY aa.SubmitDate DESC

			)c
		
			/*
			  SELECT *
			  INTO   #temp3
			  FROM   (

					  SELECT TOP 1 CASE
									 WHEN bb.RowN IS NULL THEN 1
									 ELSE bb.RowN
								   END AS RowN, aa.oid, aa.assignedto, aa.submitdate, aa.UDF_RoundRobin
					  FROM   CG_IncidentRequest aa
							 FULL OUTER JOIN #temp2 bb
										  ON aa.AssignedTo = bb.OID
					  WHERE  aa.UDF_RoundRobin='yes'
							 AND aa.AssignedTo IS NOT NULL
							 AND aa.GCRecord IS NULL
					  ORDER  BY aa.SubmitDate ASC

					)c
			  */
 

      /* Delcaring a local variable for storing the number of rows in the #temp2 table */
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
		Declaring a variable for storing the the ID of the team name that is passed to the query 
		so we can select from the CG_PersonToTeam table 
	  */
	  DECLARE 	@TeamID int 

	  SET @TeamID = ( 

						SELECT TOP(1) Team 
						FROM VCG_PersonToTeam_Grid_View 
						WHERE TeamName = @Team

					)


	  /* 
		Declaring variable for storing a boolean value. The SELECT statement determines if the current requester 
		of the ticket is part of the supplied team. If they are, then variable set to 1 because it will return a 
		record using the COUNT() function. Otherwise, it will be set to 0, because no records were found
	  */
	  
	  DECLARE @IsRequesterPartOfRoundRobinTeam int 

	  

	  SET @IsRequesterPartOfRoundRobinTeam = ( 

												 SELECT COUNT(*)
												 FROM CG_Person aa
												 INNER JOIN CG_PersonToTeam bb
												 ON aa.OID = bb.Person
												 WHERE aa.OID = @RequesterID
													   AND bb.Team = @TeamID
													   AND bb.GCRecord IS NULL	
													   		   
											  ) 		
      /* 
        Returning the OID of the team member who should be assigned to the ticket 
        This SELECT statement should always return only one record and a single column or value for that record.
		The value in the record should an integer value since the run code expects a integer value
      */
	  SELECT (CASE 
				 WHEN @IsRequesterPartOfRoundRobinTeam = 1 THEN @RequesterID 
				 ELSE OID END) 
				 AS AssignedTo
      FROM   #temp2
      WHERE  RowN = @ID 

      /* Dropping temporary tables so the script will have fresh data during the next submit/create action that is fired */

	  DROP TABLE #temp1

      DROP TABLE #temp2

      DROP TABLE #temp3

  END 
