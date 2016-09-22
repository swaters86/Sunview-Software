/*
	1. Make sure to back up the CG_Principal Table. This table should be discarded 
		once you believe everything is working properly. 
*/
SELECT * INTO CG_Principal20160101 FROM CG_Principal 


/* 
    2. Run the following UPDATE statement to update the CG_Principal table. 
    	This UPDATE statement strips out the the domain part from the usernames in 
    	the name field for the CG_Principal table.
*/
UPDATE CG_Principal 
SET name = (
CASE
/* 
	**** Important **** 
	The below lines are specific to a customer. These should be changed.  

	Note: you could try using the LEFT() function here instead of the REPLACE()
	function... 

	The below lines say: when the name field starts with "na", then replace the 
	first 3 characters with an empty string. Note: 0-based numbering is used here. 
	So if the user name is 'na\swaters' the  'na\' will be replaced with ''. 
	This will then result in a value of 'swaters' for the name field.

*/ 
WHEN name like 'na\%' THEN REPLACE(name,SUBSTRING(name, 0,4),'')
WHEN name like 'eap\%' THEN REPLACE(name,SUBSTRING(name, 0,5),'') 
WHEN name like 'graphicpkg\%' THEN REPLACE(name,SUBSTRING(name, 0,12),'') 
WHEN name like '%GLD6D3272\%' THEN REPLACE(name,SUBSTRING(name, 0,11),'')
WHEN name like '%GLD6LJNC9Z71\%' THEN REPLACE(name,SUBSTRING(name, 0,14),'')
WHEN name like '%GLD6L419ZBC1\%' THEN REPLACE(name,SUBSTRING(name, 0,14),'')
WHEN name like '%altivity\%' THEN REPLACE(name,SUBSTRING(name, 0,10),'')
WHEN name like '%REM6L276711U\%' THEN REPLACE(name,SUBSTRING(name, 0,14),'')
WHEN name like '%REM7LGKC95R1\%' THEN  REPLACE(name,SUBSTRING(name, 0,14),'')
WHEN name like '%GPIB150G12\%' THEN REPLACE(name,SUBSTRING(name, 0,12),'')
ELSE 
name 
END  
)
/*
	This tells the UPDATE statement to not select records with the following 
	values in the name field. This is so important accounts are not touched 
	by this script. 
*/
WHERE name IS NOT NULL 
AND name NOT LIKE '%changegear%' 
AND name NOT LIKE '%sunview%' 
AND name NOT LIKE '%services%' 
AND name NOT LIKE '%administrator%'
AND name NOT LIKE '%cgadmin%'
AND name NOT LIKE '%changeg%'


/* 
	Test to see how many characters should be stripped out from the name field
	in the CG_Principal. Note, you could try using LEFT() instead of REPLACE()
	here.
*/

SELECT REPLACE(name,SUBSTRING(name, 0,4),'') as newName FROM CG_Principal 
where name like 'na\%' 

SELECT REPLACE(name,SUBSTRING(name, 0,5),'') as newName FROM CG_Principal 
where name like 'eap\%' 

SELECT REPLACE(name,SUBSTRING(name, 0,12),'') as newName FROM CG_Principal  
where name like 'graphicpkg\%'

SELECT REPLACE(name,SUBSTRING(name, 0,11),'') as newName FROM CG_Principal  
where name like '%GLD6D3272\%'

SELECT REPLACE(name,SUBSTRING(name, 0,14),'') as newName FROM CG_Principal  
where name like '%GLD6LJNC9Z71\%'

SELECT REPLACE(name,SUBSTRING(name, 0,14),'') as newName FROM CG_Principal  
where name like '%GLD6L419ZBC1\%'

SELECT REPLACE(name,SUBSTRING(name, 0,10),'') as newName FROM CG_Principal  
where name like '%altivity\%'

SELECT REPLACE(name,SUBSTRING(name, 0,14),'') as newName FROM CG_Principal  
where name like '%REM6L276711U\%'

SELECT REPLACE(name,SUBSTRING(name, 0,14),'') as newName FROM CG_Principal  
where name like '%REM7LGKC95R1\%'

SELECT REPLACE(name,SUBSTRING(name, 0,12),'') as newName FROM CG_Principal  
where name like '%GPIB150G12\%'


/* 
	3. The following cursor will do the following: 

		a. Loop through records in the CG_Person table

		b. Fetches the OID and name values in each record that 
			is in the the CG_Person table (That is not filtered out by the WHERE  clause)

		c. Updates each record in CG_Person by selecting records with the OID values that were fetched 
			and it sets the PWDHash field to an encrypted value for "Passoword01!", which will be a 
			temporary password. 

		d. Converts the user to a WINDOWS authenticated user by setting the ExternalAccountUID field to 
			cg:// plus the user's name in the fetched name value. 
*/
DECLARE @externalaccountuid_prefix varchar(10) 

DECLARE @username varchar(max) 

SET @externalaccountuid_prefix = 'cg://'

DECLARE db_cursor CURSOR FOR  

SELECT oid, name
FROM cg_principal where 
name IS NOT NULL 
/* 
	**** Important **** 
	Make sure this WHERE clause is the same 
	as the WHERE clause in the first update statement. 
*/
AND name NOT LIKE '%changegear%' 
AND name NOT LIKE '%sunview%' 
AND name NOT LIKE '%services%' 
AND name NOT LIKE '%administrator%'
AND name NOT LIKE '%cgadmin%'
AND name NOT LIKE '%changeg%'

OPEN db_cursor  

DECLARE @oid int

FETCH NEXT FROM db_cursor INTO @oid, @username
WHILE @@FETCH_STATUS = 0  

BEGIN  

	  UPDATE CG_Person
	  SET ExternalAccountUID=@externalaccountuid_prefix + @username,PwdHash='NOWCD4pqp9UMEw5l4UZvBKi5xy3fp5Ko94/iZ4r910QYQpbEABr4yquZ9s5uVswd/pMkrhTWoLamch54Ufw4EmD7z6o='
	  WHERE oid=@oid 	
      
FETCH NEXT FROM db_cursor INTO @oid, @username 

END  

CLOSE db_cursor  

DEALLOCATE db_cursor 


/*
	4. Verify the data in the CG_Person field. All of the values in the ExternalAccountUID field
		should look like this:
			cg:\\swaters
		And all of the values in the PWDHash field should look like this: 
			NOWCD4pqp9UMEw5l4UZvBKi5xy3fp5Ko94/iZ4r910QYQpbEABr4yquZ9s5uVswd/pMkrhTWoLamch54Ufw4EmD7z6o=
*/

SELECT externalaccountuid, pwdhash,firstname,lastname
FROM CG_Person


