/*
1. There are two ways to read and set fields: 
*/

try {

	string customFieldName = "UDF_ACustomField";

	System.Reflection.PropertyInfo customFieldInfo = Item.GetType().GetProperty(customFieldName);

	string requesterField = "Requester";

	System.Reflection.PropertyInfo requesterFieldInfo = Item.GetType().GetProperty(requesterField);

	/* Properties and methods can be found here: https://msdn.microsoft.com/en-us/library/system.reflection.propertyinfo%28v=vs.110%29.aspx */

	sLogger.Info("Attributes: " + customFieldInfo.Attributes);	// Attributes: None

	sLogger.Info("CanRead: " + customFieldInfo.CanRead); // CanRead: True

	sLogger.Info("CanWrite: " + customFieldInfo.CanWrite);	// CanWrite: True

	sLogger.Info("CustomAttributes: " + customFieldInfo.CustomAttributes);	// CustomAttributes: System.Collections.ObjectModel.ReadOnlyCollection`1[System.Reflection.CustomAttributeData]

	sLogger.Info("DeclaringType: " + customFieldInfo.DeclaringType);	// DeclaringType: SDServices.Entities._UDT_IncidentRequest_Extended

	sLogger.Info("GetMethod: " + customFieldInfo.GetMethod);	// GetMethod: System.String get_UDF_ACustomField()

	sLogger.Info("IsSpecialName: " + customFieldInfo.IsSpecialName); // IsSpecialName: False	

	sLogger.Info("MemberType: " + customFieldInfo.MemberType);	// MemberType: Property

	sLogger.Info("MetadataToken: " + customFieldInfo.MetadataToken); // MetadataToken: 385876019

	sLogger.Info("Module: " + customFieldInfo.Module);	// Module: CustomEntityServices.dll

	sLogger.Info("Name: " + customFieldInfo.Name);	// Name: UDF_ACustomField

	sLogger.Info("PropertyType: " + customFieldInfo.PropertyType);	// PropertyType: System.String

	sLogger.Info("ReflectedType: " + customFieldInfo.ReflectedType);	// ReflectedType: SDServices.Entities._UDT_IncidentRequest_Extended

	sLogger.Info("SetMethod: " + customFieldInfo.SetMethod); // SetMethod: Void set_UDF_ACustomField(System.String)

	sLogger.Info("GetValue: " + customFieldInfo.GetValue(Item)); // GetValue: test123 - if the value entered in the field is 'test123'

	customFieldInfo.SetValue(Item,"hello world",null); // Will set the value of the custom field to "hello world"

	// Works in incident module 

	using(ApplicationInterfaces.Persistence.IUnitOfWork unitOfWork = ApplicationServices.SessionManager.Instance.ServerSession.CreateUnitOfWork()) {

		IPrincipal assignee = (IPrincipal) ApplicationServices.SessionManager.Instance.ServerSession.GetHandlerForType(typeof(IPrincipal)).Find(ApplicationServices.SessionManager.Instance.ServerSession, unitOfWork, typeof(IPrincipal), 2, false);

		requesterFieldInfo.SetValue(Item,assignee,null);
		
	}

} catch (Exception ex) {

	sLogger.Info(ex);

}





/*

Which way is best or what is their purpose and what are the pros and cons of them? 


2. 

WorkFlowUtilities.CreateTicket()
WorkFlowUtilities.CreateTask()
WorkFlowUtilities.ApplyExpression()
*/


