/* Start Access Requirements Grouping for New Consultant or Contractor Section */

int consultantRemoteAccess = (((I_UDT_IncidentRequest_Extended)Item).UDF_ConsultantRemoteAccess).ID;

int consultantQuickViewDashboardAcess = (((I_UDT_IncidentRequest_Extended)Item).UDF_ConsultantQuickViewDashboardAcess).ID;

int consultantLongDistanceCode = (((I_UDT_IncidentRequest_Extended)Item).UDF_ConsultantLongDistanceCode).ID;


/* Start Access Requirements Grouping for New Employee Section */

int remoteAccess = (((I_UDT_IncidentRequest_Extended)Item).UDF_RemoteAccess).ID;

int companyWiFiAccess = (((I_UDT_IncidentRequest_Extended)Item).UDF_CompanyWiFiAccess).ID;

int officePhoneVoicemail = (((I_UDT_IncidentRequest_Extended)Item).UDF_OfficePhoneVoicemail).ID;

int longDistanceCode = (((I_UDT_IncidentRequest_Extended)Item).UDF_LongDistanceCode).ID;

int ciscoCallAgentSetup = (((I_UDT_IncidentRequest_Extended)Item).UDF_CiscoCallAgentSetup).ID;

int concurTravelAccess = (((I_UDT_IncidentRequest_Extended)Item).UDF_ConcurTravelAccess).ID;

int qlikviewDashboardAccess = (((I_UDT_IncidentRequest_Extended)Item).UDF_QlikviewDashboardAccess).ID;

int aPPortalAccess = (((I_UDT_IncidentRequest_Extended)Item).UDF_APPortalAccess).ID;

int cRM = (((I_UDT_IncidentRequest_Extended)Item).UDF_CRM).ID;

int conferencingBridge = (((I_UDT_IncidentRequest_Extended)Item).UDF_ConferencingBridge).ID;


Hashtable htFields = new Hashtable();

htFields.Add("consultantRemoteAccess",consultantRemoteAccess);

htFields.Add("consultantQuickViewDashboardAcess",consultantQuickViewDashboardAcess);

htFields.Add("consultantLongDistanceCode",consultantLongDistanceCode);

htFields.Add("remoteAccess",remoteAccess);

htFields.Add("companyWiFiAccess",companyWiFiAccess);

htFields.Add("officePhoneVoicemail",officePhoneVoicemail);

htFields.Add("longDistanceCode",longDistanceCode);

htFields.Add("ciscoCallAgentSetup",ciscoCallAgentSetup);

htFields.Add("concurTravelAccess",concurTravelAccess);

htFields.Add("qlikviewDashboardAccess",qlikviewDashboardAccess);

htFields.Add("aPPortalAccess",aPPortalAccess);

htFields.Add("cRM",cRM);

htFields.Add("conferencingBridge",conferencingBridge);



ICollection fieldNames = htFields.Keys;

ICollection fieldValues = htFields.Values;


foreach (string fieldName in fieldNames) {


    int fieldValue = (int)htFields[fieldName];
    //sLogger.Info(fieldValue);

   if (fieldValue == 1) {

    Hashtable ht1 = new Hashtable();
    ht1["TaskStatus"] = "New";
    ht1["AssignedTo"] = 1;
    ht1["Type"] = 1;

       switch(fieldName) {

            case "consultantRemoteAccess":
                ht1["Description"] = "Please Advise";
            break;

            case "consultantQuickViewDashboardAcess": 
                ht1["Description"] = "Please Advise";
            break;

            case "consultantLongDistanceCode": 
                ht1["Description"] = "Please Advise";
            break;

            case "remoteAccess": 
                ht1["Description"] = "Please Advise";
            break;

            case "companyWiFiAccess": 
                ht1["Description"] = "Please Advise";
            break;

            case "officePhoneVoicemail": 
                ht1["Description"] = "Please Advise";
            break;

            case "longDistanceCode": 
                ht1["Description"] = "Please Advise";
            break;

            case "ciscoCallAgentSetup": 
                ht1["Description"] = "Please Advise";
            break;

            case "concurTravelAccess": 
                ht1["Description"] = "Please Advise";
            break;

            case "qlikviewDashboardAccess": 
                ht1["Description"] = "Please Advise";
            break;

            case "aPPortalAccess": 
                ht1["Description"] = "Please Advise";
            break;

            case "cRM": 
                ht1["Description"] = "Please Advise";
            break;

            case "conferencingBridge": 
                ht1["Description"] = "Please Advise";
            break;

            default: 
            sLogger.Info("No Tasks Spawned for New Hires. Were access requirement fields used?");
            break;

       } // End Switch 

    WorkFlowUtilities.CreateTask(UserSession,Item,ht1);
       
   } // End If


} // End For Each


/* Email Distribution List Fields */ 

string consultantEmailDistributionList = (((I_UDT_IncidentRequest_Extended)Item).UDF_ConsultantEmailDistributionList);

if (consultantEmailDistributionList != "") {

    Hashtable ht2 = new Hashtable();
    ht2["TaskStatus"] = "New";
    ht2["Description"] = "Please Include: " + consultantEmailDistributionList;
    ht2["AssignedTo"] = 1;
    ht2["Type"] = 1;
    WorkFlowUtilities.CreateTask(UserSession,Item,ht2);

}


/* Email Distribution List */ 
string emailDistributionList = (((I_UDT_IncidentRequest_Extended)Item).UDF_EmailDistributionList);

if (emailDistributionList != "") {

    Hashtable ht3 = new Hashtable();
    ht3["TaskStatus"] = "New";
    ht3["Description"] = "Please Include: " + emailDistributionList;
    ht3["AssignedTo"] = 1;
    ht3["Type"] = 1;
    WorkFlowUtilities.CreateTask(UserSession,Item,ht3);
    
}