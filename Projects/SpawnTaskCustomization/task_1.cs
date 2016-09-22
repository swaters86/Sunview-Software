/* Task 1 */

// Get all of the fields for a task item
Hashtable ht = new Hashtable();

// Set the TaskStatus field to "New"
ht["TaskStatus"] = "New";

// Sets the "Description" field to the summary of the parent ticket
ht["Description"] = Item.Summary;


// Gets the id value of the item selected in the LocationTeamAssociation lookup list
int locationTeamItemID = (((I_UDT_IncidentRequest_Extended)Item).UDF_LocationTeamAssociation.ID);

/*
    Sets the AssignedTo field to the OID value of the item selected in 
    the LocationTeamAssocaition lookup list
*/
switch (locationTeamItemID) {

    case 1:
        ht["AssignedTo"] = 61;
        break;
    case 2:
        ht["AssignedTo"] = 62;
        break;
    default:
        sLogger.Info("AssignedTo not Set");
        break;

}


// Gets the id value of the item selected in the IncidentRequestType lookup list
int incidentRequestTypeID = Item.IncidentRequestType.ID;

/*
    Sets the Type field to the OID value of the item selected in 
    the IncidentRequestType lookup list
*/
switch (incidentRequestTypeID) {

    case 136:
        ht["Type"] = 1;
        break;
    case 137:
        ht["Type"] = 2;
        break;
    default:
        sLogger.Info("Type not Set");
        break;

}

// Method for creating a task item
WorkFlowUtilities.CreateTask(UserSession,Item,ht); 