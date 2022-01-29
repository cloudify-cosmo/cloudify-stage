# Executions

Displays data about the executions in the current tenant, according to the user’s permissions.

## Features

### Executions list

By default, the presented details include the blueprint and deployment of the execution, name of the workflow, the time that it was created and ended, execution creator, execution attributes, its status and actions menu.

![executions]( /images/ui/widgets/executions.png )

#### Attributes

In **Attributes** column you can see one of these icons:

* ![Dry Run icon]( /images/ui/icons/dry-run-icon.png ) - [Dry-run execution](/working_with/workflows/dry-run)
* ![System Workflow icon]( /images/ui/icons/system-workflow-icon.png ) - [System-wide execution](/working_with/workflows/index.html)

#### Actions

In the actions menu on the right side of the execution row (click ![List icon]( /images/ui/icons/list-icon.png ) to open) you can perform additional actions on the execution:

* `Show Execution Parameters` - shows details in modal window about execution parameters,    
* `Show Update Details` - shows details in modal window about blueprint and inputs change (available only for 
  executions triggered by the [deployment update](/working_with/manager/update-deployment)),
* `Show Error Details` - shows error details in modal window (available only for failed executions),
* `Resume` - resume the execution (available only for cancelled or failed executions)
* `Cancel` - cancels the execution (available only for active executions),
* `Force Cancel` - enforces cancellation of the execution (available only for active executions),
* `Kill Cancel` - the process executing the workflow is forcefully stopped, even if it is stuck or unresponsive.

 For details about cancelling executions, see [cancelling workflow executions](/working_with/workflows/cancelling-execution)


### Execution task graph

Workflow defines tasks that can be executed on a node or a group of nodes. Most workflows are implemented with a tasks graph. When the workflow is being executed, the state of the tasks graph, and each operation in it, is persisted to storage. When the workflow is resumed, the tasks graph is reconstructed, and the execution continues.

See [Workflow Execution Model](//developer/execution_model) for deeper understanding of how executions and task graphs are designed.

#### Visualization modes

Visualization of the workflow execution task graph can be displayed in Executions widget in two ways depending on `Show most recent execution only` parameter value (see [Settings](#settings) for details):

* **Off** - default view (Executions list) - after selecting an execution by clicking its row in the table a corresponding task graph is displayed
  ![executions]( /images/ui/widgets/executions-tasks-graph.png )

* **On** - single execution view - the last execution for the selected deployment is displayed
  ![executions]( /images/ui/widgets/executions-tasks-graph-single.png )

#### Task state

Each graph node represents a task that is part of the execution. Each node is colored depending on task state:

* **White** - pending
* **Yellow** - executing
* **Green** - completed
* **Red** - failed

#### Actions

In the upper right corner you can see a toolbar:

![executions]( /images/ui/widgets/executions-tasks-graph-toolbar.png )

By clicking icons from the toolbar you can:

* Enter **Play mode** in which the view tracks the progress by following tasks in progress
* **Fit to view** to display entire graph inside widget borders
* **Open in window** to display graph in modal view with miniature view for extremely large workflows

A task node may contain an icon in the bottom right corner:

![executions]( /images/ui/widgets/executions-tasks-graph-task.png )

It allows you to automatically set an operation in [Events/Log Filter widget](/working_with/console/widgets/eventsFilter) related to that task and filter logs in [Events/Logs widget](/working_with/console/widgets/events) to display only those which are relevant for the selected task.


## Settings

* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 5 seconds
* `List of fields to show in the table` You can choose which fields to present. By default, these are the fields presented:
    * Blueprint
    * Deployment
    * Deployment ID
    * Workflow
    * Created
    * Ended
    * Creator
    * Attributes
    * Status
    * Actions
    * Scheduled

    You can also choose to add `Id` column from the list, which will present the execution id. By default this value is not presented as a column in the table, but as a pop up shown by hovering over ID label.
* `Show system executions`- allow to include or exclude executions of system workflows in the list. Default: On
* `Show most recent execution only` - if enabled the widget only shows a tasks graph for the most recent execution. Default: Off
