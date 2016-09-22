/*

**Use Case

This JavaScript customization will allow users to email the following data for an incident ticket to any user 
using an email client like Outlook: 

Incident Number 
Created Date
Priority
Due Date
Incident Type 
Assignees First and Last Name (The code for this field can be used for getting the first and last name of the Requester) 
Summary field 
A URL to the ticket 

**Setup 

1. In the entity editor, add a label to the form where you want to have an email link to appear. This email link should call the setEmailLink() function. 

2. Right-click on the label and choose "Change Caption"

3. Add the following code in the label and save your changes

<a href="#" id="email-incident-link"  onclick="setIncidentEmailLink();">Email Ticket</a>

2. Add the below code to your CustomFormScripts.js file

3. Hit F5 in your browser (should work in Chrome) to load the new JavaScript in your browser or update the Patchlevel Key in the web.config file for your site and then reset IIS

4. Load the form in question in your browser. Clicking the "Email Ticket" link should summon a popup window for your default mail client with the data described above. 

*/





// This function is fired when someone clicks on an "Email Ticket" link in a web form 
  function setIncidentEmailLink() {

    // Function for adding leading 0s to the entityID value for making the ticket id look more user friendly
    // This is from this function http://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript
    function pad(n, width, z) {
      z = z || '0';
      n = n + '';
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    // Function for checking if a field is empty, if it is then generic mess should be returned
    function isEmpty(value) {
      if (!value) {
        return "N/A";
      } else {
        return value;
      }
    }

    // Defining ticket id
    if (entityId) {
      var ticketID = "#" + pad(entityId, 7);
    } else {
      ticketID = "N/A";
    }

    // Getting Summary value from Summary field 
    var summary = GetFormFieldValue("Summary");

    // Getting Device value from Summary field 
    var deviceID = GetFormFieldValue("UDF_DeviceID"); 

    // Getting control for the Priority field
    var priorityControl = GetFormControlByFieldName("Priority");

    // Getting Priority Name based on the selected index (i.e. the item that is selected)
    var priorityName = priorityControl[priorityControl.selectedIndex].innerText;

    // Getting CreatedDateTime value from CreatedDateTime field
    var createdDateTime = $("input[id*=CreatedDateTime]")[0].value;

    // Getting First Name & Last Name for the Requester from the Requester field 
    var requester = GetPersonPickerText("Requester");

    // Getting DueDate value from DueDate field 
    var dueDate = $("input[id*=DueDate_Date]")[1].value;

    // Getting Location Value from Location field
    //var departmentNames = $("input[id*=UDF_DepartmentNames1]")[1].value;

    // Getting Department value from Department value
    //var locationNames = $("input[id*=UDF_LocationNames1]")[1].value;

    // Getting Department value from Department value
    //var incidentRequestAssociationName = GetFormFieldValue("UDF_IncidentSubjectAssociation");

    // Getting First Name & Last Name for the Assignee from the AssignedTo field 
    var assignee = GetPersonPickerText("AssignedTo");

    // Getting text from the IncidentRequestType dropdown field
    var incidentTypeText = $("input[id*=IncidentRequestType]")[1].value;

    // Setting ChangeGear domain 
    var hostname = "proserv03";

    // Defining which module this is for
    var moduleName = "Incident";

    // Setting ChangeGear URL
    var ticketURL = escape("http://" + hostname + "/CGWeb/MainUI/MainFrame.aspx?ID=" + entityId + "&moduleName=" + moduleName);

    var emailSubject = "Incident " + ticketID + " - " + isEmpty(summary) + " - " + isEmpty(deviceID);

    var emailBody = 

      "Incident Number: " + ticketID + "%0A" +
      "Date Entered: " + isEmpty(createdDateTime) + "%0A" +
      "Entered By: " + isEmpty(requester) + "%0A" +
      "%0A %0A" +

      "Priority: " + isEmpty(priorityName) + "%0A" +
      "Due Date: " + isEmpty(dueDate) + "%0A" +
      "%0A %0A" +


      "Type: " + isEmpty(incidentTypeText.trim()) + "%0A" +
      //"System: " + isEmpty(incidentRequestAssociationName) + "%0A" +
      "%0A %0A" +

      //"Location: " + isEmpty(locationNames) + "%0A" +
      //"Department: " + isEmpty(departmentNames) + "%0A" +
      //"%0A %0A" +

      "Assign To: " + isEmpty(assignee) + "%0A" +
      "Summary: " + isEmpty(summary) + "%0A" +
      "%0A %0A" +

      ticketURL

    ;

    var emailHREF = "mailto:?subject=" + emailSubject + "&body=" + emailBody;

    var emailLink = document.getElementById("email-incident-link");

    emailLink.href = emailHREF;

  }

  setIncidentEmailLink();