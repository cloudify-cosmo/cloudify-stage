### Topology

Displays the topology of a selected blueprint or deployment.

The blueprint or deployment ID must be selected in one of the following ways: 

* By placing the widget in the blueprints/deployments drill-down page, meaning the blueprint/deployment has been selected before entering the page, and its id is included in the page’s context. 
* By adding to the page a widget allowing to select blueprints or deployments, such as the resources filter, the blueprints list or the blueprint deployments.  

![Topology](https://docs.cloudify.co/5.1/images/ui/widgets/topology.png)

## Features

### Presentation

Each of the blueprint's nodes is displayed as a square container that can contain other nodes. 
Each node has a name, and an icon to indicate its [node type](https://docs.cloudify.co/5.1/developer/blueprints/spec-node-types).

[Relationships](https://docs.cloudify.co/5.1/developer/blueprints/spec-relationships) between nodes are indicated with arrows that start at the connected node and end at the target node.

The number of node instances is marked in a bullet beside the node's type icon.
   

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
