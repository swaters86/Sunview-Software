
DECLARE db_cursor CURSOR FOR  

select oid, UDF_ProcTaskModelVersSTR1
from ChangeGear_SteveVMA_Catholic_20160413.dbo.CG_Flex2Task
where UDF_ProcTaskModelVersSTR1 is not null and ISNUMERIC(UDF_ProcTaskModelVersSTR1) <> 1


OPEN db_cursor  

DECLARE @oid int

DECLARE @name varchar(max)

FETCH NEXT FROM db_cursor INTO @oid, @name
WHILE @@FETCH_STATUS = 0  

BEGIN  

BEGIN TRY
update ChangeGear_SteveVMA_Catholic_20160413.dbo.CG_Flex2Task
set UDF_ProcTaskModelVersSTR1 = (


	  	select oid
		from ChangeGear_SteveVMA_Catholic_20160413.dbo.CG_managedResource
		where name = @name or description = @name

) 
where oid = @oid

END TRY 
BEGIN CATCH 
FETCH NEXT FROM db_cursor INTO @oid, @name 
END CATCH 
      
FETCH NEXT FROM db_cursor INTO @oid, @name 

END  

CLOSE db_cursor  

DEALLOCATE db_cursor 
