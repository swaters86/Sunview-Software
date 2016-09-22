function IIncidentRequest_OnFormLoad_Custom() 
{

/*This method will show/hide groups with a unique Caption
groupCaption - the caption of the group to hide
hide - true if trying to hide a group*/
function ShowHideGroupWithCaption(groupCaption, hide) 
{
    if (hide) 
    {
        $('.LayoutGroupHeader').find('span').each(function () {
            if (this.innerText == groupCaption) {
                $(this).parent().parent().hide();
            }
        });
    }
    else 
    {
        $('.LayoutGroupHeader').find('span').each(function () {
            if (this.innerText == groupCaption) {
                $(this).parent().parent().show();
            }
        });
    }
}



 $('.LayoutGroupHeader').find('span').each(function () {
            if (this.innerText == "New Account-Employee" || "New Account-Consultant/Temp") {
                $(this).parent().parent().hide();
            }
});



}


// Function for setting the total time spent on a ticket (it's a roll up of 3 fields) 
function setTotalTime(){

	var totalTimeField = "UDF_TotalPlannedEffortSP";

	effortFieldValue1 = Number(GetFormFieldValue("UDF_BAPlannedEffortSP"));

	effortFieldValue2 = Number(GetFormFieldValue("UDF_DevelopmentPlannedEffortSP"));

	effortFieldValue3 = Number(GetFormFieldValue("UDF_AdministratorPlannedEffortSP"));

	var sum = effortFieldValue1 + effortFieldValue2 + effortFieldValue3;

	SetFormFieldValue (totalTimeField,sum);

}


// UDF_BAPlannedEffortSP
function IChangeManagementTicket_UDF_BAPlannedEffortSP_OnValueChange_Custom(sender, args) {

	setTotalTime();
	
}

// UDF_DevelopmentPlannedEffortSP
function IChangeManagementTicket_UDF_DevelopmentPlannedEffortSP_OnValueChange_Custom(sender, args)
{

	setTotalTime();
	
}

// UDF_AdministratorPlannedEffortSP
function IChangeManagementTicket_UDF_AdministratorPlannedEffortSP_OnValueChange_Custom(sender, args) {

	setTotalTime();
	
}


function IChangeManagementTicket_OnFormLoad_Custom() 
{
	
	setTotalPlannedTimeForProject();
	
	setTotalActualTimeForProject();
	
}



// Function for setting the total time spent on a projects (it's a roll up 2 fields) 
function setTotalPlannedTimeForProject(){

	var totalTimePlannedField = "UDF_TotalProjectPlannedAll";

	effortFieldValue1 = Number(GetFormFieldValue("UDF_TotalPlannedEffortSP"));

	effortFieldValue2 = Number(GetFormFieldValue("UDF_TotalProjectPlannedEffortSP"));

	var sum = effortFieldValue1 + effortFieldValue2;

	SetFormFieldValue (totalTimePlannedField,sum);

}


// Function for setting the total time spent on a projects (it's a roll up 2 fields) 
function setTotalActualTimeForProject(){

	var totalTimeActualField = "UDF_TotalProjectActualAll";

	effortFieldValue1 = Number(GetFormFieldValue("UDF_TotalActualEffortSP"));

	effortFieldValue2 = Number(GetFormFieldValue("UDF_TotalProjectActualEffortSP"));

	var sum = effortFieldValue1 + effortFieldValue2;

	SetFormFieldValue (totalTimeActualField,sum);
	
}

// UDF_TotalPlannedEffortSP
function IChangeManagementTicket_UDF_TotalPlannedEffortSP_OnValueChange_Custom(sender, args) {

	setTotalPlannedTimeForProject();
	
}

// UDF_TotalActualEffortSP
function IChangeManagementTicket_UDF_TotalActualEffortSP_OnValueChange_Custom(sender, args) {

	setTotalActualTimeForProject();
	
}

















  


// The OnValueChange function for the Employee type dropdownlist
function IIncidentRequest_UDF_EmploymentStatus_OnValueChange_Custom(sender, args) {

    // Get numeric value of the dropdown list item 
    var employeeChangeField = GetFormFieldValue("UDF_EmploymentStatus");

console.log(employeeChangeField);
console.log(employeeChangeField == 1);
    if (employeeChangeField == 1) {
	
		
        // Hide New Hire Section and show Existing hire section
        ShowHideGroupWithCaption("New Account-Employee", 0);
        ShowHideGroupWithCaption("New Account-Consultant/Temp", 1);
        
    } else {
	
       
        // Show New Hire Section and hide Existing hire section	
        ShowHideGroupWithCaption("New Account-Employee", 1);
        ShowHideGroupWithCaption("New Account-Consultant/Temp", 0);
                                 
    }

}

function I_UDT_SoftwareGrid_UDF_SoftwareInventory_OnValueChange_Custom(sender, args) //Substitute any user picker field here.  IE, IIncidentRequest_UDF_PersonPicker_OnValueChange_Custom
{
	var entId = GetFormFieldValue("UDF_SoftwareInventory"); //Enter the Name of the Person Picker field.  IE UDF_PersonPicker
	var tableName = "I_UDT_SoftwareInventory"; //Table you are querying, almost always IPerson for Person Picker fields
	var personFieldsToGet = "UDF_SoftwareCost"; //Semi Colon Delimited list of fields from the user's profile
	PageMethods.GetEntityFieldValues(entId, tableName, personFieldsToGet, OnGetContactSucceeded, OnGetContactFailed);
}
 
function OnGetContactSucceeded(result, userContext, methodName) 
{     
    var ContactFieldsToUpdate = ["UDF_SoftwareCost"]; //Comma delimited, seperated by field values in double quotes
    var entityFieldsValues = result.split(";"); 
    if (entityFieldsValues.length > 0)
    {
        for (var i = 0; i < entityFieldsValues.length; i++)
        {    
            if (entityFieldsValues[i] != "")
                {
                    SetFormFieldValue(ContactFieldsToUpdate[i], entityFieldsValues[i]);
                }
        }
    }
}

//Notifies the user if the record cannot be loaded
function OnGetContactFailed(error, userContext, methodName) 
{
    alert("Error while loading Software Cost : " + error.get_message()); //Error shown to the user if there are any problems
}



function I_UDT_TimeCardRFC_OnFormLoad_Custom() 

{

SetFormFieldValue ("UDF_ResourceTimeEntry", loggedInUserId);


//This code will change the default time variable to the current time.
//When selecting a date in the datefield listed, the time will default to current time.

var currentDate = new Date();
var dueDateControl = GetDateTimeControl("UDF_TimeEntryDate");
dueDateControl.SetDate(currentDate);

}