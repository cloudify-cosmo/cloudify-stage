### Blueprint deployments
Displays the list of the deployments in the current tenant, according to the user’s permissions. The data can be displayed as a table or list. 

![blueprint-deployments](https://docs.cloudify.co/dev/staging/images/ui/widgets/blueprint-deployments.png)

Each deployment in the list includes details about the attached blueprint, when the deployment was created (if it was updated icon indicating that will be shown near creation date),
which site it is assigned to and the nodes on which it is deployed.

You can also quickly check status and logs of the last workflow executed on the deployment by hovering over the status icon in the top left corner of deployment. Depending on the type of the execution there are additional action buttons there.

![Last Execution Status](https://docs.cloudify.co/dev/staging/images/ui/widgets/blueprint-deployments_last-execution-status.png) 

The last execution status is indicated as follows:

* ![Failed Execution Icon](https://docs.cloudify.co/dev/staging/images/ui/icons/execution-failed-icon.png) - **Failed** - execution has failed
* ![Execution In Progress Icon](https://docs.cloudify.co/dev/staging/images/ui/icons/execution-in-progress-icon.png) - **In Progress** - execution is in progress (meaning that it is in one of the following states: pending, started, cancelling, force_cancelling, kill_cancelling)
* ![Cancelled Execution Icon](https://docs.cloudify.co/dev/staging/images/ui/icons/execution-cancelled-icon.png) - **Cancelled** - execution has been cancelled
* ![Waiting Execution Icon](https://docs.cloudify.co/dev/staging/images/ui/icons/execution-waiting-icon.png) - **Waiting** - execution has been either scheduled or queued and it is waiting
* ![Completed Execution Icon](https://docs.cloudify.co/dev/staging/images/ui/icons/execution-completed-icon.png) - **Completed** - execution has been completed


The status of the deployments' node instances is indicated as follows:

![Node Instance Statuses](https://docs.cloudify.co/dev/staging/images/ui/widgets/blueprint-deployments_node-statuses.png)

* **Blue** - the number of node instances that are not initialized
* **Yellow** - the number of node instances that are in active state (one of: initializing, creating, created, configuring, configured, starting, stopping, stopped and deleting)
* **Green** - the number of node instances that are started
* **Black** - the number of node instances that are deleted

#### Widget Settings
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 10 seconds
* `Enable click to drill down` - This option enables redirecting to the deployment’s drill down page upon clicking on a specific deployments. Default: On
* `Show execution status label` - Allows showing last execution workflow ID and status near last execution status icon. Default: Off
* `Blueprint ID to filter by` - Allows filtering the deployments in this list to those derived from a specific blueprint, by providing its ID (the blueprint ID is its name). Default: empty
* `Display style` - Can be either list or table. The deployments status column is only available in list mode.  Default: List
