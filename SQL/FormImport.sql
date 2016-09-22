/* Confirm comment layout type is missing from the database */
select * 
from ChangeGear.dbo.CG_EntityLayoutDefinitionType (nolock)

/*If there is no records that have "Comment" in the name field then it is missing. */


/* Insert the record for the entity definition, so this defines the comment entity in ChangeGear */ 
set identity_insert changegear.dbo.cg_entitylayoutdefinitiontype on; 
insert into changegear.dbo.cg_entitylayoutdefinitiontype
(
OID, 
InstanceOperations,
Creator,CreatedDateTime,
LastModifiedDateTime,
EditorLayout, 
LastModifiedBy, 
LastAccessedBy, 
Name, 
Description, 
OptimisticLockField, 
GCRecord,
OwningOrganization
) 
values (3,
18446744073709551615,
1,
'2015-09-22 00:00:00.000',
' 2015-09-22 00:00:00.00', 
NULL, 
1, 
1, 
'Comment', 
'Form type for the Comment popups shown when saving the item.', 
0, 
NULL, 
NULL)

/* Set the LaytoutType field to 3 for the comment forms which tells ChangeGear that they comment entities*/
update changegear.dbo.CG_EntityLayoutDefinition
set LayoutType=3
where name='CloseTypeComment' or name='comment'

