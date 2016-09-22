/*

Author: Sunview Software
Created date: 03312016
Description: Updates a custom field with a rollup value of
			 related CI types for a given CI.
*/

CREATE TRIGGER Relationship_Type_Count_Trigger ON dbo.CG_ManagedResourceLink FOR INSERT, UPDATE AS

BEGIN

	DECLARE db_cursor CURSOR FOR  

		/* 
			Finding CIs that were last modified within the last 10 minutes 
			These are the records that th script will touch 
		*/ 
		SELECT OID FROM CG_ManagedResource
		WHERE LastModifiedDateTime > DATEADD(minute, -10, GETDATE())

	OPEN db_cursor  

	DECLARE @oid int

	/* Fetching the OID for a CI that the script will touch */ 
	FETCH NEXT FROM db_cursor INTO @oid
	WHILE @@FETCH_STATUS = 0  

	BEGIN  

			DECLARE @installed_on_count int 

			/* 
				We got a OID, so we are passing it to the SQL statement for getting the installed on count 
				and then we are assigning it a variable called @installed_on count
			*/
			SET @installed_on_count = (
				SELECT COUNT(*) as InstalledOnCount
				FROM CG_ManagedResourceLink
				WHERE RelationshipType=10 AND ManagedResourceDependencyLinks=@oid
			)

	 		/* 
		 		 We are selecting a CI and updating a UDF field with the
		 		 number of installed on CIs for it
	 		*/ 
			UPDATE CG_ManagedResource
			SET UDF_MyCustomField = CAST(@installed_on_count as varchar(max))
			WHERE OID = @oid

		/* Getting next CI to update */ 
		FETCH NEXT FROM db_cursor INTO @oid

	END  

	CLOSE db_cursor  

	DEALLOCATE db_cursor 

END

