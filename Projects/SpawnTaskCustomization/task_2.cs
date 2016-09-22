/* Task 2 - Assigns the task to the SD - SDCC Team */

// Get all of the fields for a task item
Hashtable ht = new Hashtable();

// Set the TaskStatus field to "New"
ht["TaskStatus"] = "New";

// Sets the "Description" field to the summary of the parent ticket
ht["Description"] = Item.Summary;

// Sets the AssignedTo field to a predetermined value
ht["AssignedTo"] = 60;

// Method for creating a task item
WorkFlowUtilities.CreateTask(UserSession,Item,ht); 
