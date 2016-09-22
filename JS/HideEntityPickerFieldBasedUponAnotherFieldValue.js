/*

Use Case
This JavaScript is used hide a entity picker field based upon a value selected in another entity picker field.

Setup
Set the OnValueChange property for the IncidentRequestType field to true and add a dropdown field called "UDF_LocationTeamAssociation"
Update the entID values in the script so they reference valid values. 
 
Notes
Both controls must be entity pickers.

*/


function IIncidentRequest_IncidentRequestType_OnValueChange_Custom(sender, args) 
{

   //Gets the value of the selected Entity Picker
   var entId = GetFormFieldValue("IncidentRequestType");  

	if(entId == 154 || entId == 155)
	{
	 ShowHideControlByName("UDF_LocationTeamAssociation", false);
	}
	else
	{
	 ShowHideControlByName("UDF_LocationTeamAssociation", true);
	}

}
