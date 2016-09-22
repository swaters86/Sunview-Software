/*
    The purpose of this script is to update a assigned to field with the name of the person signed in. 
*/

try {

using(ApplicationInterfaces.Persistence.IUnitOfWork unitOfWork = ApplicationServices.SessionManager.Instance.ServerSession.CreateUnitOfWork()) {

	int assigneeID = UserSession.GetCurrentUser(SubItem.UnitOfWork).ID;

	IPrincipal assignee = (IPrincipal) ApplicationServices.SessionManager.Instance.ServerSession.GetHandlerForType(typeof(IPrincipal)).Find(ApplicationServices.SessionManager.Instance.ServerSession, unitOfWork, typeof(IPrincipal), assigneeID, false);

	string assigneToField = "AssignedTo";

	System.Reflection.PropertyInfo assigneToFieldInfo = Item.GetType().GetProperty(assigneToField);

	if (assigneToFieldInfo == null) {

		sLogger.Error(string.Format("Could not find a property '{0}' in table 'I{1}'", assigneToField, Item.GetType().Name));

	} 

	if (assigneToFieldInfo != null && assigneToFieldInfo.CanWrite) {

		assigneToFieldInfo.SetValue(SubItem, assignee, null);

	}

}

} catch(Exception ex) {

	string msg = String.Format("Exception happened when trying to perform workflow action on update the values in the Incident ticket");

	sLogger.Error(msg, ex);

}