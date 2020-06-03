### Executions

Displays data about the executions in the current tenant, according to the user’s permissions. By default, the presented details include the blueprint and deployment of the execution, name of the workflow, the time that it was created and ended, execution creator, execution attributes, its status and actions menu.

In **Attributes** column you can see one of these icons:

* ![Dry Run icon](https://docs.cloudify.co/dev/staging/images/ui/icons/dry-run-icon.png) - **Dry Run** 
* ![System Workflow icon](https://docs.cloudify.co/dev/staging/images/ui/icons/system-workflow-icon.png) - **System Workflow**

In the actions menu on the right side of the execution row (click ![List icon](https://docs.cloudify.co/dev/staging/images/ui/icons/list-icon.png) to open) you can perform additional actions on the execution:

* `Show Execution Parameters` - shows details in modal window about execution parameters,    
* `Show Update Details` - shows details in modal window about blueprint and inputs change (available only for 'update' executions),
* `Show Error Details` - shows error details in modal window (available only for failed executions), 
* `Resume` - resume the execution (available only for cancelled or failed executions)
* `Cancel` - cancels the execution (available only for active executions),
* `Force Cancel` - enforces cancellation of the execution (available only for active executions), 
* `Kill Cancel` - the process executing the workflow is forcefully stopped, even if it is stuck or unresponsive.
 
 For details about cancelling executions, see [cancelling workflow executions](https://docs.cloudify.co/dev/staging/working_with/workflows/cancelling-execution)

![executions](https://docs.cloudify.co/dev/staging/images/ui/widgets/executions.png)

#### Widget Settings
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 5 seconds
* `List of fields to show in the table` You can choose which fields to present. By default, these are the fields presented:
  * Blueprint
  * Deployment
  * Workflow
  * Created
  * Ended 
  * Creator
  * Attributes
  * Status
  * Actions
      
You can also choose to add `Id` column from the list, which will present the execution id. By default this value is not presented as a column in the table, but as a pop up shown by hovering over ID label.

* `Show system executions`- allow to include or exclude executions of system workflows in the list. Default: On
