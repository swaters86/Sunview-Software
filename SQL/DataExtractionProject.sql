
/* DirectTV Data Export Script for IRs */
select
   aa.ItemID as TicketID,
   (select 
    CONVERT(varchar,bb.LastModifiedDateTime,120) + ' By ' + cc.FirstName + ' ' + cc.LastName + CHAR(10)  as Byline,
	bb.Comment  + CHAR(10) as Comment
    from ChangeGear.dbo.CG_IncidentRequestHistoryRecord bb
    join ChangeGear.dbo.CG_Person cc
    on (bb.Creator = cc.OID)
    where aa.OID = bb.IncidentRequestHistoryRecords
    and bb.Comment not like '%Processed by ChangeGear Mobile.'
    and bb.Action = 'Description'
    order by bb.CreatedDateTime desc
    for xml path(''))
from ChangeGear.dbo.CG_IncidentRequest aa
where GCRecord is null

select COUNT(*)
from ChangeGear.dbo.CG_IncidentRequest aa
where GCRecord is null



select
   aa.ItemID as TicketID,
   (select 
    CONVERT(varchar,bb.LastModifiedDateTime,120) + ' By ' + cc.FirstName + ' ' + cc.LastName + '\\'  as Byline,
	bb.Comment  + CHAR(10) as Comment
    from ChangeGear.dbo.CG_IncidentRequestHistoryRecord bb
    join ChangeGear.dbo.CG_Person cc
    on (bb.Creator = cc.OID)
    where aa.OID = bb.IncidentRequestHistoryRecords
    and bb.Comment not like '%Processed by ChangeGear Mobile.'
    and bb.Action = 'Description'
    order by bb.CreatedDateTime desc
    for xml path(''))
from ChangeGear.dbo.CG_IncidentRequest aa
where GCRecord is null

select COUNT(*)
from ChangeGear.dbo.CG_IncidentRequest aa
where GCRecord is null

select 6181 * 2




select COUNT(*)
from ChangeGear.dbo.CG_IncidentRequest aa (nolock) 
join ChangeGear.dbo.CG_IncidentRequestHistoryRecord bb (nolock)
on (aa.OID = bb.IncidentRequestHistoryRecords)
join ChangeGear.dbo.CG_Person cc
on (bb.Creator = cc.OID)
where aa.OID = bb.IncidentRequestHistoryRecords
and bb.Comment not like '%Processed by ChangeGear Mobile.'
    and bb.Action = 'Description'
    and aa.GCRecord is null




select ItemID
from ChangeGear.dbo.CG_IncidentRequest aa (nolock) 
join ChangeGear.dbo.CG_IncidentRequestHistoryRecord bb (nolock)
on (aa.OID = bb.IncidentRequestHistoryRecords)
join ChangeGear.dbo.CG_Person cc
on (bb.Creator = cc.OID)
where aa.OID = bb.IncidentRequestHistoryRecords and ItemID='IR-0000002'
and bb.Comment not like '%Processed by ChangeGear Mobile.'
    and bb.Action = 'Description'
    and aa.GCRecord is null
    order by bb.CreatedDateTime desc
    
    
    
    
    
    
    select GCRecord
    from CG_IncidentRequest (nolock) 
    where ItemID='IR-0000002'





/* Good - 2015-9-25*/

select top(500)
   aa.ItemID as TicketID,
   (select 
    CONVERT(varchar,bb.LastModifiedDateTime,120) + ' By ' + cc.FirstName + ' ' + cc.LastName + CHAR(10)  as Byline,
	bb.Comment  + CHAR(10) as Comment
    from ChangeGear.dbo.CG_IncidentRequestHistoryRecord bb
    join ChangeGear.dbo.CG_Person cc
    on (bb.Creator = cc.OID)
    where aa.OID = bb.IncidentRequestHistoryRecords
    and bb.Comment not like '%Processed by ChangeGear Mobile.'
    and bb.Action = 'Description'
    order by bb.CreatedDateTime desc
    for xml path(''), type)
from ChangeGear.dbo.CG_IncidentRequest aa
where GCRecord is null

select COUNT(*)
from ChangeGear.dbo.CG_IncidentRequest aa (nolock) 
join ChangeGear.dbo.CG_IncidentRequestHistoryRecord bb (nolock)
on (aa.OID = bb.IncidentRequestHistoryRecords)
where aa.OID = bb.IncidentRequestHistoryRecords
and bb.Comment not like '%Processed by ChangeGear Mobile.'
    and bb.Action = 'Description'

	/*test*/
	
select top(500)
   aa.ItemID as TicketID,
   (select 
    CONVERT(varchar,bb.LastModifiedDateTime,120) + ' By ' + cc.FirstName + ' ' + cc.LastName + CHAR(10)  as Byline,
	bb.Comment  + CHAR(10) as Comment
    from ChangeGear.dbo.CG_IncidentRequestHistoryRecord bb
    join ChangeGear.dbo.CG_Person cc
    on (bb.Creator = cc.OID)
    where aa.OID = bb.IncidentRequestHistoryRecords
    and bb.Comment not like '%Processed by ChangeGear Mobile.'
    and bb.Action = 'Description'
    order by bb.CreatedDateTime desc
    for xml path(''))
from ChangeGear.dbo.CG_IncidentRequest aa
where GCRecord is null

select COUNT(*)
from ChangeGear.dbo.CG_IncidentRequest aa (nolock) 
join ChangeGear.dbo.CG_IncidentRequestHistoryRecord bb (nolock)
on (aa.OID = bb.IncidentRequestHistoryRecords)
where aa.OID = bb.IncidentRequestHistoryRecords
and bb.Comment not like '%Processed by ChangeGear Mobile.'
    and bb.Action = 'Description'





/*
select aa.oid, aa.ItemID, aa.Summary, bb.Comment
from ChangeGear.dbo.CG_IncidentRequest aa (nolock) 
join ChangeGear.dbo.CG_IncidentRequestHistoryRecord bb (nolock) 
on (aa.OID=bb.IncidentRequestHistoryRecords)
where aa.OID=41
*/



/*
select * 
from ChangeGear.dbo.CG_IncidentRequestHistoryRecord (nolock) 
where Comment='Hello this is a test<br />'
*/


select aa.ItemID TicketID, bb.Comment as TicketComment, cc.FirstName + ' ' + cc.LastName as CreatorFullName, aa.CreatedDateTime as CreatedDate 
from ChangeGear.dbo.CG_IncidentRequest aa (nolock) 
 join ChangeGear.dbo.CG_IncidentRequestHistoryRecord bb (nolock) 
on (aa.OID=bb.IncidentRequestHistoryRecords) 
join ChangeGear.dbo.CG_Person cc (nolock) 
on (bb.Creator = cc.oid)
where aa.OID=41




select 
   aa.ItemID as TicketID, 
   (select   Comment
    from ChangeGear.dbo.CG_IncidentRequestHistoryRecord bb
    join ChangeGear.dbo.CG_Person cc
    on (bb.Creator = cc.OID)
    where aa.OID = bb.IncidentRequestHistoryRecords
    for xml path('')) Comments
from ChangeGear.dbo.CG_IncidentRequest aa
where aa.itemid='IR-0000041'
order by aa.createddatetime desc


exec searchalltables '2015-09-25' 



2014-01-16 12:53:55.057












select oid, Summary,Creator
from ChangeGear.dbo.CG_IncidentRequest
where oid=41




select oid, FirstName, Email
from ChangeGear.dbo.CG_Person 
where oid=1









exec SearchAllTables 'Hello this is a test'