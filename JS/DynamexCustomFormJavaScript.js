function ShowHideGroupWithCaption(groupCaption, hide) 
{
    // This function is a modification of the code to the ShowHideGroupWithCaptionFunction
    // It is to allow the function to work independent of browser version
    // General documentation on how the below functions work is in the layoutmanager.js file
    if (hide) 
    {
        $('.LayoutGroupHeader').find('span').each(function () {
            if (this.outerText == groupCaption) {
                $(this).parent().parent().hide();
            }
        });
    }
    if (hide) 
    {
        $('.LayoutGroupHeader').find('span').each(function () {
            if (this.textContent == groupCaption) {
                $(this).parent().parent().hide();
            }
        });
    }
    else 
    {
        $('.LayoutGroupHeader').find('span').each(function () {
            if (this.outerText == groupCaption) {
                $(this).parent().parent().show();
            }
        });
    }
}


function IIncidentRequest_OnFormLoad_Custom(sender, args) {

    ShowHideGroupWithCaption("New Employee", true);
	ShowHideGroupWithCaption("New Consultant or Contractor", true);
    
}
         
function IIncidentRequest_UDF_UserAccountType_OnValueChange_Custom(sender, args) 
{

    //Gets the value of the selected Entity Picker
    var entID = GetFormFieldValue("UDF_UserAccountType");  

    switch(entID) {
        case "1":
        ShowHideGroupWithCaption("New Employee",false);
		ShowHideGroupWithCaption("New Consultant or Contractor", true);
        break;
		case "2":
        ShowHideGroupWithCaption("New Consultant or Contractor",false);
		ShowHideGroupWithCaption("New Employee", true);
        break; 
        default: 
        console.log("nothing happened");
     }

}


