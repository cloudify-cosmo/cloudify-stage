# Blueprint deployments
Displays the list of the deployments in the current tenant, according to the user’s permissions. The data can be displayed as a table or list.

![Blueprint Deployments widget]( /images/ui/widgets/blueprint-deployments.png )


## Features

### Deployment basic information

The Deployments widget displays a list of deployments in the current tenant. The displayed information is: Deployment name,
the blueprint which the deployment is derived from, the deployments creation and last update dates,
the name of the user who created the deployment, and the number of node instances per state.


### Last execution status

You can also quickly check status and logs of the last workflow executed on the deployment by hovering over the status icon in the top left corner of deployment. Depending on the type of the execution there are additional action buttons there.

![Last Execution Status]( /images/ui/widgets/blueprint-deployments_last-execution-status.png )

The last execution status is indicated as follows:

* ![Failed Execution Icon]( /images/ui/icons/execution-failed-icon.png ) - **Failed** - execution has failed
* ![Execution In Progress Icon]( /images/ui/icons/execution-in-progress-icon.png ) - **In Progress** - execution is in progress (meaning that it is in one of the following states: pending, started, cancelling, force_cancelling, kill_cancelling)
* ![Cancelled Execution Icon]( /images/ui/icons/execution-cancelled-icon.png ) - **Cancelled** - execution has been cancelled
* ![Waiting Execution Icon]( /images/ui/icons/execution-waiting-icon.png ) - **Waiting** - execution has been either scheduled or queued and it is waiting
* ![Completed Execution Icon]( /images/ui/icons/execution-completed-icon.png ) - **Completed** - execution has been completed


### Node instances status

The status of the deployments' node instances is indicated as follows:

![Node Instance Statuses]( /images/ui/widgets/blueprint-deployments_node-statuses.png )

* **Blue** - the number of node instances that are not initialized
* **Yellow** - the number of node instances that are in active state (one of: initializing, creating, created, configuring, configured, starting, stopping, stopped and deleting)
* **Green** - the number of node instances that are started
* **Black** - the number of node instances that are deleted


### Executing an action

The hamburger menu (![list icon]( /images/ui/icons/list-icon.png )) 
on the right of every deployment allows performing the following operations:

* Install/Uninstall deployment
* Deploy blueprint on deployment - this option is only available when the deployment is containing `csys-obj-type: environment` label
* Update deployment
* Set site for deployment
* Manage deployment labels
* Delete or Force Delete deployment

![Deployment actions menu]( /images/ui/widgets/blueprint-deployments_action-menu.png )


#### Updating a Deployment

1. Click **Update** in the action menu.
2. Select the blueprint for the updated deployment.
3. Select the inputs file for the blueprint or provide values for the inputs.
4. Set actions to be performed during the update or use defaults.  
5. Click **Update**.

For more information about updating a deployment, [click here](/working_with/manager/update-deployment).

For more information about creating custom workflows, [click here](/working_with/workflows/creating-your-own-workflow).


#### Setting a Site

1. Click **Set Site** in the action menu.
2. Select a new site for the deployment. The selected site must be in the same visibility context as the deployment or in a higher visibility context. (i.e. both site and deployment are in the same tenant or the site is defined as global)
3. Click **Update**.

For detaching the current site, leave the `Site name` input empty and toggle the `Detach` button.

![Set Site]( /images/ui/widgets/blueprint-deployments_set-site.png )


#### Managing Labels

1. Click **Manage Labels** in the action menu.
2. Add/Remove labels to/from the deployment. 
   NOTE: New labels (not existing in the system) are marked with blue color.
3. Click **Apply**.

![Manage Labels]( /images/ui/widgets/blueprint-deployments_manage-labels.png )

You can learn more about labels [here](/cli/orch_cli/deployments#labels).


#### Deleting a Deployment

1. Click **Delete** or **Force Delete** in the action menu.
2. When prompted for deployment removal confirmation, click **Yes**.


### Executing a workflow

1. Click the cogs icon (![cogs icon]( /images/ui/icons/execute-workflow-icon.png ))  
   and select the workflow you want to execute.
2. Provide values for workflow parameters.
3. Click **Execute**.

![Execute workflows menu]( /images/ui/widgets/blueprint-deployments_workflows-menu.png )

You will also be able to track the progress of the execution as
at the bottom of the deployment row, there will be a thin line visible. 
Progress is calculated based on the number of execution operations finished.
Check [workflow execution model](/developer/execution_model) 
to get more details about workflows execution. 

![Deployment progress]( /images/ui/widgets/blueprint-deployments_progress-bar.png )

The color of the line indicates the status of the execution:

* **Green** - succeeded
* **Yellow** - in progress
* **Red** - failed


Each of the default workflows is described in detail [here](/working_with/workflows/built-in-workflows).

### Deployments details

Clicking on a deployment's name will bring us to deployment's drill-down page,
which provides additional data about the deployment.

![Deployment page]( /images/ui/widgets/blueprint-deployments_deployment-page.png )

By default, that page displays the following:

* [Deployment Info widget](/working_with/console/widgets/deploymentInfo)
* [Deployment Action Buttons widget](/working_with/console/widgets/deploymentActionButtons)
* 3 tabs with deployment details:
  1. **Last Execution** tab with the following widgets:
      * [Executions](/working_with/console/widgets/executions) (configured to display only task graph of the last execution)
      * [Deployment Events/Logs filter](/working_with/console/widgets/eventsFilter)
      * [Deployment Events/Logs](/working_with/console/widgets/events)
  2. **Deployment Info** tab with the following widgets:
      * [Deployment Topology](/working_with/console/widgets/topology)
      * [Deployment Outputs/Capabilities](/working_with/console/widgets/outputs)
      * [Deployment Labels](/working_with/console/widgets/labels)
      * [Deployment Inputs](/working_with/console/widgets/inputs)
      * [Deployment Nodes](/working_with/console/widgets/nodes)
      * [Deployment Sources](/working_with/console/widgets/blueprintSources)
  3. **History** tab with the following widgets:
      * [Executions](/working_with/console/widgets/executions) (configured to display list of executions)
      * [Deployment Events/Logs filter](/working_with/console/widgets/eventsFilter)
      * [Deployment Events/Logs](/working_with/console/widgets/events)


## Settings

* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 10 seconds
* `Enable click to drill down` - This option enables redirecting to the deployment’s drill down page upon clicking on a specific deployments. Default: On
* `Show execution status label` - Allows showing last execution workflow ID and status near last execution status icon. Default: Off
* `Show first user journey buttons` - When there are no deployments, it presents a simplified view, as shown below.
![First user journey buttons]( /images/ui/widgets/blueprint-deployments_first_user_journey.png)  
There are 2 buttons in the view:
    - `Create new Deployment` - redirects to Blueprint Marketplace page
    ![Blueprint marketplace page]( /images/ui/widgets/blueprint-marketplace-page.png)  
    - `Upload from Terraform` - shows Create blueprint from Terraform modal 
    
* `Blueprint ID to filter by` - Allows filtering the deployments in this list to those derived from a specific blueprint, by providing its ID (the blueprint ID is its name). Default: empty
* `Display style` - Can be either list or table. The deployments status column is only available in list mode.  Default: List
