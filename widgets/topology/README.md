# Topology

Displays the topology of a selected blueprint or deployment.

The blueprint or deployment ID must be selected in one of the following ways:

* By placing the widget in the blueprints/deployments drill-down page, meaning the blueprint/deployment has been selected before entering the page, and its id is included in the page’s context.
* By adding to the page a widget allowing to select blueprints or deployments, such as the resources filter, the blueprints list or the blueprint deployments.  

![Topology]( /images/ui/widgets/topology.png )

## Features

### Presentation

Each of the blueprint's nodes is displayed as a square container that can contain other nodes.
Each node has a name, and an icon (upper right corner) to indicate its [node type](/developer/blueprints/spec-node-types).

[Relationships](/developer/blueprints/spec-relationships) between nodes are indicated with arrows that start at the connected node and end at the target node.

The number of node instances is marked in a bullet beside the node's type icon.

Each node is provided with an icon (top left corner). For built-in node types it is the {{< param product_name >}} logo. For node types coming from [plugins](/developer/blueprints/spec-plugins) it is an icon selected during plugin upload (setting plugin icon is optional, by default a plug icon is used). 
See [Plugins widget](/working_with/console/widgets/plugins) or [Plugins Catalog widget](/working_with/console/widgets/pluginsCatalog) for more details.

For **Component** nodes you can also see bottom right corner icons showing all plugins used by the component's internal nodes.

![Topology - multi plugins]( /images/ui/widgets/topology-widget_multi-plugins.png )

Node types used in [service composition](/working_with/service_composition/index.html) are displayed in special way which allows user to expand it (display internal nodes) or drill-down to deployment (opens node's deployment page).

![Topology - service composition]( /images/ui/widgets/topology-widget_component-node.png )


### Actions

In Topology widget you can:

* Pan around the view (drag'n'drop outside node)
* Change location of the nodes (drag'n'drop inside node)
* Zoom in/out (using mouse wheel)     


There is also a toolbar in the right upper corner:

![Topology - toolbar]( /images/ui/widgets/topology-widget_toolbar.png )

It allows you to make changes in the view:

* **Zoom in** the topology
* **Zoom out** the topology
* **Fit topology to screen**
* **Save layout** - save location of the nodes (the location is saved per blueprint per user)
* **Revert layout changes** - revert the location of the nodes to the previous state
* **Auto layout** - automatically distribute the nodes on the canvas


### Terraform support

Terraform nodes created using [Terraform plugin](/working_with/official_plugins/orchestration/terraform)
are treated in a special way. There are dedicated action icons in the bottom left corner of such nodes:

* **Info** - shows Terraform node details in tabular view
* **Expand / Collapse** - opens/closes a view of the Terraform embedded topology, similar to the views presented for Component and SharedResource nodes.


Terraform node collapsed:

![Topology - Terraform node collapsed]( /images/ui/widgets/topology-widget_terraform-node.png )

Terraform node expanded:

![Topology - Terraform node expanded]( /images/ui/widgets/topology-widget_terraform-node-expanded.png )

Terraform node info table:

![Topology - Terraform node info]( /images/ui/widgets/topology-widget_terraform-info.png )


### Badges

When executing a workflow for a deployment (e.g. the `install` workflow), the topology nodes show badges that reflect the workflow execution state.<br/>

* Install state - The workflow execution is in progress for this node
* Done state - The workflow execution was completed successfully for this node
* Alerts state - The workflow execution was partially completed for this node
* Failed state - The workflow execution failed for this node

![Deployment Topology Node Badges]( /images/ui/widgets/topology-widget-badges.png )

When you hover over the badge and the topology is displayed for specific deployment (not a blueprint), then you will see summary of node instances states related to specific node:

![Deployment Topology Node Instances Details]( /images/ui/widgets/topology-widget-node-instances-details.png )


#### Workflow states represented by badges

* A deployment before any workflow was executed

    ![Deployment Topology]( /images/ui/widgets/topology-widget-1.png )

* A deployment with a workflow execution in progress

    ![Deployment Topology Execution In Progress]( /images/ui/widgets/topology-widget-2.png )

* A deployment with a workflow execution in progress, partially completed

    ![Deployment Topology Execution Partially Completed]( /images/ui/widgets/topology-widget-3.png )

* A deployment with a workflow execution completed successfully

    ![Deployment Topology Execution Completed Successfully]( /images/ui/widgets/topology-widget-4.png )

* A deployment with a workflow execution partially completed successfully with some alerts

    ![Deployment Topology Execution Completed Partially Alerts]( /images/ui/widgets/topology-widget-5.png )

* A deployment with a workflow execution that partially failed

    ![Deployment Topology Execution Completed Partially Errors]( /images/ui/widgets/topology-widget-6.png )

* A deployment with a workflow execution that failed

    ![Deployment Topology Execution Completed Errors]( /images/ui/widgets/topology-widget-7.png )


## Settings

* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 10 seconds.

The following settings allow changing the presentation of the widget in different aspects, and are by default marked as “on”:

* `Enable node click`
* `Enable group click`
* `Enable zoom`
* `Enable drag`
* `Show toolbar`
