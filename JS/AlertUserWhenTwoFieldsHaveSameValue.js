// Defining the comapreFields() function which will be called during each on value change event
function compareFields() {

  // Define field 1 
  var field1 = GetFormFieldValue("AssignedTo");

  // Define field 2 
  var field2 = GetFormFieldValue("UDF_TicketValidator");

  // Condition for comparing each field together
  if (field1 == field2)
    alert("Assigned To and Validator fields cannot be the same.");

}


function IChangeManagementTicket_AssignedTo_OnValueChange_Custom(sender, args) {

  compareFields();

}


function IChangeManagementTicket_UDF_TicketValidator_OnValueChange_Custom(sender, args) {

  compareFields();

}

