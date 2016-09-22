
// Executes when an incident type is chosen
function IIncidentRequest_IncidentRequestType_OnValueChange_Custom(sender, args) {

  // Gets the OID value of the incident type    
  var IncidentRequestTypeOID = GetTreeDropDownValue("IncidentRequestType");

  // Defines which table we want to pull a value from
  var tableName = "IIncidentRequestType";

  // Defines which value we want to pull from a table. In this case, we want to get the name of the incident type.
  var incidentRequestTypeFieldsToGet = "Name";

  // Method for doing a lookup in the database. We're passing in the OID for the incident type, table name, and name of the column we want to grab a value from   
  PageMethods.GetEntityFieldValues(IncidentRequestTypeOID, tableName, incidentRequestTypeFieldsToGet, OnGetIncidentRequestTypeInfoSucceeded, OnGetIncidentRequestTypeInfoFailed);

}


// If the DB lookup method above is SUCCESSFUL then this function is called: 
function OnGetIncidentRequestTypeInfoSucceeded(result, userContext, methodName) {

  // We're removing the number and dash prefixes from parent incident types. This replacement doesn't occur for child items.
  var incidentTypeText = escape(result.replace(/[0-9-]/gi, ''));

  // Method for opening up the KB search window , we're passing in the incident type name to the value parameter for the URl
  window.open("/CGWeb/MainUI/KB/KB.aspx?search=true&field=CommonFields&value=" + incidentTypeText + "&view=Search Result&ModuleName=Knowledge Base", "_blank", "left=200,top=200,width=800, height=600");

}


// If the DB lookup method FAILS then this function is called: 
function OnGetIncidentRequestTypeInfoFailed(error, userContext, methodName) {

  alert("Error while retrieving the incident type name from the database.");

}