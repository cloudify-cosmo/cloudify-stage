### Cloudify Managers Management

Displays the list of the deployments created using [Cloudify Manager of Managers plugin](https://github.com/Cloudify-PS/manager-of-managers) in the current tenant, according to the user’s permissions. The data is displayed in a table.

![managers](https://docs.cloudify.co/staging/dev/images/ui/widgets/managers.png)

##### Presented data

You can see IP addresses, names 
and status of all managers in the cluster. 

Detailed status about specific is presented after hovering the status icon:

![managers](https://docs.cloudify.co/staging/dev/images/ui/widgets/managers-widget-manager-status.png)
 
##### User actions

You can perform the following actions:

* **Open Console** (![Open Console icon](https://docs.cloudify.co/staging/dev/images/ui/icons/open-console-icon.png)) of master (leader) nodes
* **Refresh Status** (![Refresh Status icon](https://docs.cloudify.co/staging/dev/images/ui/icons/refresh-status-icon.png)) of all nodes in the cluster 
* **Execute Workflow** (![Execute Workflow icon](https://docs.cloudify.co/staging/dev/images/ui/icons/execute-workflow-icon.png)) on master (leader) nodes 

You can also refresh status or execute any workflow available on the Cloudify Manager of Managers deployment on multiple managers using bulk operations. To do so, select deployments using checkboxes in the left column and click one of the buttons above the table - **Refresh Status** or **Execute Workflow**.

#### Widget Settings
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 10 seconds
* `List of fields to show in the table` - You can choose which fields to present. By default, all of these fields are presented:
   * Deployment
   * IP
   * Last Execution
   * Status
   * Actions