  //this will catch the callback ends by update panels (used by multiselect)
 function EndRequestHandler(sender, args)
{
   if (args.get_error() != null)
   {
	   var errorName = args.get_error().name;
	   if (errorName.length > 0 )
	   {
		  args.set_errorHandled(true);
		  alert('error');
	   }
   }
   else
   {
		//just making sure the callbks is by multiselect control
		if((sender._activeElement != null || sender._activeElement != undefined))
		{
			if (formName == "AdvancedComponents" || formName == "DesignDevelopment" || formName == "MoldingAssembly")
			{
				var filter = "UDF_" + formName + "=1";
				var HireLocation = GetEntityPickerText('UDF_NewHireLocation');
				if (HireLocation != null && HireLocation != undefined && HireLocation != '') 
				{
					filter = filter + " AND UDF_" + HireLocation + "=1";
				}
				var fullId = sender._activeElement.id;
				//get the field name from the activeElement
				//for now this will only work with UDF fields
				//we would need to adjust it for the factory fields
				//will get something like: DynamicLayoutControl1_ctl317_ctl62_UDF_Software_irc_55_MultiselectUpdatePanel
				var from = fullId.indexOf("UDF_");
				var id = fullId.substring(from+4);
				var to = id.indexOf("_");
				var id = id.substring(0, to);
				switch (id) {
				case "Software":
					Filter_MultiLookups('UDF_Software','AllSoftware','I_UDT_Software',filter);
					break;
				case "BuildingAccess":
					Filter_MultiLookups('UDF_BuildingAccess','BuildingAccess','I_UDT_BuildingAccess',filter);
					break;
				case "BuildingAlarms":
					Filter_MultiLookups('UDF_BuildingAlarms','BuildingAlarm','I_UDT_BuildingAlarm',filter);
					break;
				case "DistributionList":
					Filter_MultiLookups('UDF_DistributionList', 'DistributionLists','I_UDT_DistributionLists',filter);
					break;
				case "Hardware":
					Filter_MultiLookups('UDF_Hardware', 'Hardware','I_UDT_Hardware',filter);
					break;
				case "Systems":
					Filter_MultiLookups('UDF_Systems', 'Systems','I_UDT_Systems',filter);
					break;
				}
			}
			
		}
   }
   
}
 function GetEntityPickerText(fieldName)
{
    var entityPicker = GetEntityPickerControl(fieldName);
    if (entityPicker != null)
    {
        var item = entityPicker.get_selectedItem();
        if (item != null)
        {
            return item.get_text();
        }
    }
    return null;
}


 function IFlex1Ticket_OnFormLoad_Custom() 
 {
	Sys.WebForms.PageRequestManager.getInstance().add_endRequest(EndRequestHandler);
	IFlex1Ticket_OnFormLoad_Factory();
	 if (entityId  == null)
    {
        var tableName = "IPerson";
        var personFieldsToGet = "Title;UDF_Division;MobilePhone";   
   
        PageMethods.GetEntityFieldValues(loggedInUserId, tableName, personFieldsToGet, OnGetRequesterInfoSucceeded, OnGetRequesterInfoFailed);
    }
	
	var formName = GetFormFieldValue('EditorLayout');
	if (formName == "AdvancedComponents" || formName == "DesignDevelopment" || formName == "MoldingAssembly")
	{
		var filter = "UDF_" + formName + "=1";
		var HireLocation = GetEntityPickerText('UDF_NewHireLocation');
		if (HireLocation != null && HireLocation != undefined && HireLocation != '') 
		{
			filter = filter + " AND UDF_" + HireLocation + "=1";
		}
			
			Filter_MultiLookups('UDF_Software','AllSoftware','I_UDT_Software',filter);
			//ClearFieldValues('UDF_Software');
			Filter_MultiLookups('UDF_BuildingAccess','BuildingAccess','I_UDT_BuildingAccess',filter);
			//ClearFieldValues('UDF_BuildingAccess');
			Filter_MultiLookups('UDF_BuildingAlarms','BuildingAlarm','I_UDT_BuildingAlarm',filter);
			//ClearFieldValues('UDF_BuildingAlarms');
			Filter_MultiLookups('UDF_DistributionList', 'DistributionLists','I_UDT_DistributionLists',filter);
			//ClearFieldValues('UDF_DistributionList');
			Filter_MultiLookups('UDF_Hardware', 'Hardware','I_UDT_Hardware',filter);
			//ClearFieldValues('UDF_Hardware');
			Filter_MultiLookups('UDF_Systems', 'Systems','I_UDT_Systems',filter);
			//ClearFieldValues('UDF_Systems');
	}
 }

 
 function IFlex1Ticket_UDF_NewHireLocation_OnValueChange_Custom(sender, args)
 {
	var HireLocation = args._item.get_text();
	cnt=0;
	
	var formName = GetFormFieldValue('EditorLayout');
	var filter = "UDF_" + formName + "=1";
	var filter = "UDF_"+HireLocation+"=1";
	if(HireLocation.length > 0)
	{
		
		Filter_MultiLookups('UDF_Software','AllSoftware','I_UDT_Software',filter);
		ClearFieldValues('UDF_Software');
		Filter_MultiLookups('UDF_BuildingAccess','BuildingAccess','I_UDT_BuildingAccess',filter);
		ClearFieldValues('UDF_BuildingAccess');
		Filter_MultiLookups('UDF_BuildingAlarms','BuildingAlarm','I_UDT_BuildingAlarm',filter);
		ClearFieldValues('UDF_BuildingAlarms');
		Filter_MultiLookups('UDF_DistributionList', 'DistributionLists','I_UDT_DistributionLists',filter);
		ClearFieldValues('UDF_DistributionList');
		Filter_MultiLookups('UDF_Hardware', 'Hardware','I_UDT_Hardware',filter);
		ClearFieldValues('UDF_Hardware');
		Filter_MultiLookups('UDF_Systems', 'Systems','I_UDT_Systems',filter);
		ClearFieldValues('UDF_Systems');
	}	
 }
 
 
 function Filter_MultiLookups(fieldName, ViewName, TableName, filter)
 {
		var context = {};
		context.fieldName = fieldName;
 		PageMethods.GetFieldValuesFromViewWithCriteria(ViewName, TableName, 'ID;Name', '%CRITERIA%', filter,
							function(result){GetFieldValuesFromViewWithCriteriaSucceeded(result, context, '')},
							GetFieldValuesFromViewWithCriteriaFailed);
 }
  
 
 function GetFieldValuesFromViewWithCriteriaSucceeded(result, userContext, methodName)
 {
	 
	 var fieldName = userContext.fieldName;
 

	var mCtrl = GetMultiSelectControl(fieldName);
	
	
	if(mCtrl != null)
	{
	
		var ddId = mCtrl.get_id()+ '_i0_EntityChooserDD_EntityRadComboBox';
		var dd = $find(ddId);
        if (dd != null) 
		{
		
			//disablind auto load
			dd._enableLoadOnDemand = false;
			//clearing the items in the dropdownlist
			dd.clearItems();
			//hiding the more results button which loads more items
			var moreRes = dd.get_moreResultsBoxElement();
			$(moreRes).hide();
		
			for (var i = 0; i < result.length; i++)
			{ 
				//creating new items that are received as a result of the query executed above
				var ciItem = new Telerik.Web.UI.RadComboBoxItem();
				ciItem.set_value(result[i].split("|")[0]);
				ciItem.set_text(result[i].split("|")[1]);
				dd.get_items().add(ciItem);
			}
		}
	}
 }
 
  function GetFieldValuesFromViewWithCriteriaFailed(error, userContext, methodName)
 {
	alert("Error: " + error.get_message());
 }
 
 //Sets the Requester text field values into SR form fields.
function OnGetRequesterInfoSucceeded(result, userContext, methodName)
{    

    var FieldsToUpdate = ["UDF_TitlePIT" ,"UDF_DivisionPIT","UDF_MobilePIT"];
    var personFieldsValues = result.split(";");
    if (FieldsToUpdate.length == personFieldsValues.length)
    {
        for (var i = 0; i < FieldsToUpdate.length; i++)
        {   
            if (personFieldsValues[i] != "")
                {
                    SetFormFieldValue(FieldsToUpdate[i], personFieldsValues[i]);
                }
        }
    }
}

//Notifies the user if the Requester record cannot be loaded
function OnGetRequesterInfoFailed(error, userContext, methodName)
{
    alert("Error while loading Requester's info: " + error.get_message());
}



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
 
