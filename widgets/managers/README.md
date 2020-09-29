# Spire Manager

Displays the list of the deployments created using [Cloudify Spire plugin](https://github.com/cloudify-cosmo/cloudify-spire-plugin) in the current tenant, according to the user’s permissions. The data is displayed in a table.

<div class="ui message info">
Spire Manager can only be used on Cloudify with Spire license edition.
</div>


![Spire Manager](https://docs.cloudify.co/5.1/images/ui/widgets/spire-manager.png)

## Features

### Presented data

You can see IP addresses, names and status of the cluster created by Spire deployment. 

Detailed status about specific cluster is presented after hovering the status icon:

![Spire Manager - status](https://docs.cloudify.co/5.1/images/ui/widgets/spire-manager-status.png)

Similarly to Deployments widget you can see detailed information about last execution by hovering the cell in Last Execution column:

![Spire Manager - last execution](https://docs.cloudify.co/5.1/images/ui/widgets/spire-manager-last-execution.png) 


### User actions

You can perform the following actions:

* **Open Console** (![Open Console icon](https://docs.cloudify.co/5.1/images/ui/icons/open-console-icon.png)) of Cloudify Manager created by selected Spire deployment,
* **Refresh Status** (![Refresh Status icon](https://docs.cloudify.co/5.1/images/ui/icons/refresh-status-icon.png)) of Cloudify Manager created by selected Spire deployment,
* **Execute Workflow** (![Execute Workflow icon](https://docs.cloudify.co/5.1/images/ui/icons/execute-workflow-icon.png)) on selected Spire deployment. 

You can also refresh status or execute any workflow available on the Spire deployment on multiple managers using bulk operations. 
To do so, select Spire deployments using checkboxes in the left column and click one of the buttons above the table - **Refresh Status** or **Execute Workflow**.


## Settings

* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 10 seconds
* `List of fields to show in the table` - You can choose which fields to present. By default, all of these fields are presented:
   * Deployment
   * IP
   * Last Execution
   * Status
   * Actions
