/*
    The purpose of this script is to perform a workflow action against a parent ticket when all of the 
    tasks for it are closed 
    This script can be applied to the task closed action for the incident task management workflow. 
    This script could also be applied be applied against other actions as well but it has been tested for that. 
*/

// Begin Try 
try {

    // Gets an array of task items 
    ArrayList list =  new ArrayList(((IIncidentRequest)Item).IncidentRequestTasks);

    // Declares a variable for storing the number of closed tasks and assigns a default value of 0 to it
    int closedTaskCount = 0;

    // Checks to see if the list of task items is null or greater than or equal to 0
    if (list != null && list.Count >= 0) {

        // If there are tasks items then loop through them 
        foreach (IIncidentRequestTask IncidentTask in list) {

            // If the task's status is "task closed" then add 1 to the closed task count variable    
            if (IncidentTask.Status.ToLower() == "task closed") {

                closedTaskCount += 1; 

                // If all of the tasks are closed then perform a workflow action 
                if (closedTaskCount == list.Count) {

                     string action1 = "Resolve";
                
                     WorkFlowUtilities.TriggerWorkflowAction(UserSession, action1, Item, wfVariables);
                
                } // End If statement performing workflow count 

            } // End If statement for closed tasks 
           
        } // End foreach statement for looping through each task

     } // End If statement for list count

} catch (Exception ex) {

  /* User friendly error message */
  sLogger.Info("Could not perform workflow action or something went terribly wrong. Check task workflow for more details.");
  
  /* Error message for Sunview staff */
  //sLogger.Error(ex);

}



            



    