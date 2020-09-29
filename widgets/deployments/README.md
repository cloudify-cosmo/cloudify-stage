# Blueprint deployments
Displays the list of the deployments in the current tenant, according to the user’s permissions. The data can be displayed as a table or list. 

![Blueprint Deployments widget](https://docs.cloudify.co/5.1/images/ui/widgets/blueprint-deployments.png)


## Features

### Deployment basic information

The Deployments widget displays a list of deployments in the current tenant. The displayed information is: Deployment name, 
the blueprint which the deployment is derived from, the deployments creation and last update dates, 
the name of the user who created the deployment, and the number of node instances per state.


### Last execution status

You can also quickly check status and logs of the last workflow executed on the deployment by hovering over the status icon in the top left corner of deployment. Depending on the type of the execution there are additional action buttons there.

![Last Execution Status](https://docs.cloudify.co/5.1/images/ui/widgets/blueprint-deployments_last-execution-status.png) 

The last execution status is indicated as follows:

* ![Failed Execution Icon](https://docs.cloudify.co/5.1/images/ui/icons/execution-failed-icon.png) - **Failed** - execution has failed
* ![Execution In Progress Icon](https://docs.cloudify.co/5.1/images/ui/icons/execution-in-progress-icon.png) - **In Progress** - execution is in progress (meaning that it is in one of the following states: pending, started, cancelling, force_cancelling, kill_cancelling)
* ![Cancelled Execution Icon](https://docs.cloudify.co/5.1/images/ui/icons/execution-cancelled-icon.png) - **Cancelled** - execution has been cancelled
* ![Waiting Execution Icon](https://docs.cloudify.co/5.1/images/ui/icons/execution-waiting-icon.png) - **Waiting** - execution has been either scheduled or queued and it is waiting
* ![Completed Execution Icon](https://docs.cloudify.co/5.1/images/ui/icons/execution-completed-icon.png) - **Completed** - execution has been completed


### Node instances status

The status of the deployments' node instances is indicated as follows:

![Node Instance Statuses](https://docs.cloudify.co/5.1/images/ui/widgets/blueprint-deployments_node-statuses.png)

* **Blue** - the number of node instances that are not initialized
* **Yellow** - the number of node instances that are in active state (one of: initializing, creating, created, configuring, configured, starting, stopping, stopped and deleting)
* **Green** - the number of node instances that are started
* **Black** - the number of node instances that are deleted


### Deployment actions

The hamburger menu on the right of every deployment allows performing the following operations:

* Execute workflow on deployment
* Install/Uninstall deployment
* Update deployment
* Set site for deployment
* Delete deployment
 
![Deployment actions menu](https://docs.cloudify.co/5.1/images/ui/widgets/blueprint-deployments_action-menu.png)


#### Executing a Workflow

1. Go to **Execute workflow** section in the menu and click the workflow you want to execute.
2. Provide values for workflow parameters. 
3. Click **Execute**.

You can also use **Install** or **Uninstall** menu options to execute those specific workflows.
For these two workflows you will also be able to track the progress of the execution as at the bottom of the deployment row there will be thin line visible. Progress is calculated based on number of node instances installed (in case of install workflow) or deleted (in case of uninstall workflow). 
 
![Deployment progress](https://docs.cloudify.co/5.1/images/ui/widgets/blueprint-deployments_progress-bar.png)

The color of the line indicates the status of the execution:

* **Green** - succeeded
* **Yellow** - in progress
* **Red** - failed


Each of the default workflows are described in detail [here](https://docs.cloudify.co/5.1/working_with/workflows/built-in-workflows).


#### Updating a Deployment

1. Click **Update** in the action menu.
2. Select the blueprint for the updated deployment.
3. Select the inputs file for the blueprint or provide values for the inputs.
4. Set actions to be performed during the update or use defaults.  
5. Click **Update**.

For more information about updating a deployment, [click here](https://docs.cloudify.co/5.1/working_with/manager/update-deployment).

For more information about creating custom workflows, [click here](https://docs.cloudify.co/5.1/working_with/workflows/creating-your-own-workflow).


#### Setting a Site

1. Click **Set Site** in the action menu.
2. Select a new site for the deployment. The selected site must be in the same visibility context as the deployment or in a higher visibility context. (i.e. both site and deployment are in the same tenant or the site is defined as global) 
3. Click **Update**.

For detaching the current site, leave the `Site name` input empty and toggle the `Detach` button.

![Set Site](https://docs.cloudify.co/5.1/images/ui/widgets/blueprint-deployments_set-site.png)


#### Deleting a Deployment

1. Click **Delete** or **Force Delete** in the action menu.
2. When prompted for deployment removal confirmation, click **Yes**.


### Deployments details

Clicking on a deployment's name will bring us to deployment's drill-down page, 
which provides additional data about the deployment.

![Deployment page](https://docs.cloudify.co/5.1/images/ui/widgets/blueprint-deployments_deployment-page.png)

By default, that page displays the following: 

* [Deployment Info widget](https://docs.cloudify.co/5.1/working_with/console/widgets/deploymentInfo)
* [Deployment Action Buttons widget](https://docs.cloudify.co/5.1/working_with/console/widgets/deploymentActionButtons)
* 3 tabs with deployment details:
  1. **Last Execution** tab with the following widgets:
      * [Executions](https://docs.cloudify.co/5.1/working_with/console/widgets/executions) (configured to display only task graph of the last execution)
      * [Deployment Events/Logs filter](https://docs.cloudify.co/5.1/working_with/console/widgets/eventsFilter)
      * [Deployment Events/Logs](https://docs.cloudify.co/5.1/working_with/console/widgets/events)
  2. **Deployment Info** tab with the following widgets:
      * [Deployment Topology](https://docs.cloudify.co/5.1/working_with/console/widgets/topology)
      * [Deployment Outputs/Capabilities](https://docs.cloudify.co/5.1/working_with/console/widgets/outputs)
      * [Deployment Inputs](https://docs.cloudify.co/5.1/working_with/console/widgets/inputs)
      * [Deployment Nodes](https://docs.cloudify.co/5.1/working_with/console/widgets/nodes)
      * [Deployment Sources](https://docs.cloudify.co/5.1/working_with/console/widgets/blueprintSources)
  3. **History** tab with the following widgets:
      * [Executions](https://docs.cloudify.co/5.1/working_with/console/widgets/executions) (configured to display list of executions)
      * [Deployment Events/Logs filter](https://docs.cloudify.co/5.1/working_with/console/widgets/eventsFilter)
      * [Deployment Events/Logs](https://docs.cloudify.co/5.1/working_with/console/widgets/events)
  

## Settings

* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 10 seconds
* `Enable click to drill down` - This option enables redirecting to the deployment’s drill down page upon clicking on a specific deployments. Default: On
* `Show execution status label` - Allows showing last execution workflow ID and status near last execution status icon. Default: Off
* `Blueprint ID to filter by` - Allows filtering the deployments in this list to those derived from a specific blueprint, by providing its ID (the blueprint ID is its name). Default: empty
* `Display style` - Can be either list or table. The deployments status column is only available in list mode.  Default: List
