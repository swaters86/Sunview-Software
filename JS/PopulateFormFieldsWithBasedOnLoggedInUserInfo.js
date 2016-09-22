/*

**Use Case***

Use this when you want fields in an End-User form to populate with a value during an on load event.
The JavaScript will  select the fields defined in the personFieldsToGet array in the CG_Person table
and then populate the corresponding fields that are defined in the fieldsToUpdate function. 

This JS code is actually the equivalent to the following moduledef code which doesn't work for
end user forms since the moduledef code only populates field during an on change value event
which isn't fired when an end-user form is loaded for the first time. 

<Module name="Incident" ...

PersonFieldsToGetOnRequesterChange="Email;PhoneNumber;DeptName;LocationName;UDF_Company;UDF_City;UDF_UserID" 
FormFieldsToUpdateOnRequesterChange="EmailPIT;PhonePIT;DepartmentNamePIT;LocationNamePIT;UDF_Company;UDF_City;UDF_UserID"

</Module>

**Setup**

This can be used for other modules (just swap out the references and be sure to add the factory on form load).

You might want to remove the above moduledef references so this function isn't duplicate in two spots.

*/

function IIncidentRequest_OnFormLoad_Custom() {

    // Table we want to pull values from 
    var tableName = "IPerson";

    // Columns where we want to pull values from in the table
    var personFieldsToGet = "Email;PhoneNumber;DeptName;LocationName;UDF_Company;UDF_City;UDF_UserID";

    // Method that returns the values
    PageMethods.GetEntityFieldValues(loggedInUserId, tableName, personFieldsToGet, onGetRequesterInfoSucceeded, onGetRequesterInfoFailed);

    // Sets the Requester text field values into IR form fields if successful
    function onGetRequesterInfoSucceeded(result, userContext, methodName) {

        var fieldsToUpdate = ["EmailPIT", "PhonePIT", "DepartmentNamePIT", "LocationNamePIT", "UDF_Company", "UDF_City", "UDF_UserID"];

        var personFieldsValues = result.split(";");

        if (fieldsToUpdate.length == personFieldsValues.length) {
            for (var i = 0; i < fieldsToUpdate.length; i++) {
                if (personFieldsValues[i] != "") {
                    SetFormFieldValue(fieldsToUpdate[i], personFieldsValues[i]);
                }
            }
        }
    }

    //Notifies the user if the Requester record cannot be loaded
    function onGetRequesterInfoFailed(error, userContext, methodName) {
        alert("Error while loading Requester's info: " + error.get_message());
    }

}