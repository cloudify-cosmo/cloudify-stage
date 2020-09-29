# Topology

Displays the topology of a selected blueprint or deployment.

The blueprint or deployment ID must be selected in one of the following ways: 

* By placing the widget in the blueprints/deployments drill-down page, meaning the blueprint/deployment has been selected before entering the page, and its id is included in the page’s context. 
* By adding to the page a widget allowing to select blueprints or deployments, such as the resources filter, the blueprints list or the blueprint deployments.  

![Topology](https://docs.cloudify.co/5.1/images/ui/widgets/topology.png)

## Features

### Presentation

Each of the blueprint's nodes is displayed as a square container that can contain other nodes. 
Each node has a name, and an icon (upper right corner) to indicate its [node type](https://docs.cloudify.co/5.1/developer/blueprints/spec-node-types). 

[Relationships](https://docs.cloudify.co/5.1/developer/blueprints/spec-relationships) between nodes are indicated with arrows that start at the connected node and end at the target node.

The number of node instances is marked in a bullet beside the node's type icon.

Each node is provided with an icon (top left corner). For built-in node types it is Cloudify logo. For node types coming from [plugins](https://docs.cloudify.co/5.1/developer/blueprints/spec-plugins) it is an icon selected during plugin upload (setting plugin icon is optional, by default a plug icon is used). 
See [Plugins widget](https://docs.cloudify.co/5.1/working_with/console/widgets/plugins) or [Plugins Catalog widget](https://docs.cloudify.co/5.1/working_with/console/widgets/pluginsCatalog) for more details.

For **Component** nodes you can also see bottom right corner icons showing all plugins used by the component's internal nodes. 

![Topology - multi plugins](https://docs.cloudify.co/5.1/images/ui/widgets/topology-widget_multi-plugins.png)

Node types used in [service composition](https://docs.cloudify.co/5.1/working_with/service_composition/index.html) are displayed in special way which allows user to expand it (display internal nodes) or drill-down to deployment (opens node's deployment page).

![Topology - service composition](https://docs.cloudify.co/5.1/images/ui/widgets/topology-widget_component-node.png)


### Actions

In Topology widget you can:
 
* Pan around the view (drag'n'drop outside node)
* Change location of the nodes (drag'n'drop inside node)
* Zoom in/out (using mouse wheel)     


There is also a toolbar in the right upper corner:

![Topology - toolbar](https://docs.cloudify.co/5.1/images/ui/widgets/topology-widget_toolbar.png)

It allows you to make changes in the view:

* **Zoom in** the topology
* **Zoom out** the topology
* **Fit topology to screen**
* **Save layout** - save location of the nodes (the location is saved per blueprint per user) 
* **Revert layout changes** - revert the location of the nodes to the previous state
* **Auto layout** - automatically distribute the nodes on the canvas


### Terraform support 

Terraform nodes created using [Terraform plugin](https://docs.cloudify.co/5.1/working_with/official_plugins/orchestration/terraform)
are treated in a special way. There are dedicated action icons in the bottom left corner of such nodes:

* **Info** - shows Terraform node details in tabular view
* **Expand / Collapse** - opens/closes a view of the Terraform embedded topology, similar to the views presented for Component and SharedResource nodes.


Terraform node collapsed:

![Topology - Terraform node collapsed](https://docs.cloudify.co/5.1/images/ui/widgets/topology-widget_terraform-node.png)

Terraform node expanded:

![Topology - Terraform node expanded](https://docs.cloudify.co/5.1/images/ui/widgets/topology-widget_terraform-node-expanded.png)

Terraform node info table:

![Topology - Terraform node info](https://docs.cloudify.co/5.1/images/ui/widgets/topology-widget_terraform-info.png)


### Badges

When executing a workflow for a deployment (e.g. the `install` workflow), the topology nodes show badges that reflect the workflow execution state.

* Install state - The workflow execution is in progress for this node
* Done state - The workflow execution was completed successfully for this node
* Alerts state - The workflow execution was partially completed for this node
* Failed state - The workflow execution failed for this node

![Deployment Topology Node Badges](https://docs.cloudify.co/5.1/images/ui/widgets/topology-widget-badges.png)

When you hover over the badge and the topology is displayed for specific deployment (not a blueprint), then you will see summary of node instances states related to specific node:

![Deployment Topology Node Instances Details](https://docs.cloudify.co/5.1/images/ui/widgets/topology-widget-node-instances-details.png)
 

#### Workflow states represented by badges

* A deployment before any workflow was executed

    ![Deployment Topology](https://docs.cloudify.co/5.1/images/ui/widgets/topology-widget-1.png)

* A deployment with a workflow execution in progress

    ![Deployment Topology Execution In Progress](https://docs.cloudify.co/5.1/images/ui/widgets/topology-widget-2.png)

* A deployment with a workflow execution in progress, partially completed

    ![Deployment Topology Execution Partially Completed](https://docs.cloudify.co/5.1/images/ui/widgets/topology-widget-3.png)

* A deployment with a workflow execution completed successfully

    ![Deployment Topology Execution Completed Successfully](https://docs.cloudify.co/5.1/images/ui/widgets/topology-widget-4.png)

* A deployment with a workflow execution partially completed successfully with some alerts

    ![Deployment Topology Execution Completed Partially Alerts](https://docs.cloudify.co/5.1/images/ui/widgets/topology-widget-5.png)

* A deployment with a workflow execution that partially failed

    ![Deployment Topology Execution Completed Partially Errors](https://docs.cloudify.co/5.1/images/ui/widgets/topology-widget-6.png)

* A deployment with a workflow execution that failed

    ![Deployment Topology Execution Completed Errors](https://docs.cloudify.co/5.1/images/ui/widgets/topology-widget-7.png)


## Settings 

* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 10 seconds.

The following settings allow changing the presentation of the widget in different aspects, and are by default marked as “on”: 

* `Enable node click` 
* `Enable group click` 
* `Enable zoom` 
* `Enable drag` 
* `Show toolbar` 
