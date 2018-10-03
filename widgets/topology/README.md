### Topology
Displays the topology of a selected blueprint or deployment.
The blueprint or deployment ID must be selected in one of the following ways: 

* By placing the widget in the blueprints/deployments drill-down page, meaning the blueprint/deployment has been selected before entering the page, and its id is included in the page’s context. 
* By adding to the page a widget allowing to select blueprints or deployments, such as the resources filter, the blueprints list or the blueprint deployments.  

![show-topology](https://docs.cloudify.co/4.5.0/images/ui/widgets/show-topology.png)

When executing a `Workflow` for a `Deployment` (e.g. the `install` workflow), the topology nodes show badges that reflect the workflow execution state.
    

#### Badges

* Install state - The workflow execution is in progress for this node
* Done state - The workflow execution was completed successfully for this node
* Alerts state - The workflow execution was partially completed for this node
* Failed state - The workflow execution failed for this node

![Deployment Topology Node Badges](https://docs.cloudify.co/4.5.0/images/ui/ui-deployment-topology-badges.png)

#### Workflow states represented by badges

* A deployment before any workflow was executed

    ![Deployment Topology](https://docs.cloudify.co/4.5.0/images/ui/ui-deployment-topology-1.png)

* A deployment with a workflow execution in progress

    ![Deployment Topology Execution In Progress](https://docs.cloudify.co/4.5.0/images/ui/ui-deployment-topology-2.png)

* A deployment with a workflow execution in progress, partially completed

    ![Deployment Topology Execution Partially Completed](https://docs.cloudify.co/4.5.0/images/ui/ui-deployment-topology-3.png)

* A deployment with a workflow execution completed successfully

    ![Deployment Topology Execution Completed Successfully](https://docs.cloudify.co/4.5.0/images/ui/ui-deployment-topology-4.png)

* A deployment with a workflow execution partially completed successfully with some alerts

    ![Deployment Topology Execution Completed Partially Alerts](https://docs.cloudify.co/4.5.0/images/ui/ui-deployment-topology-5.png)

* A deployment with a workflow execution that partially failed

    ![Deployment Topology Execution Completed Partially Errors](https://docs.cloudify.co/4.5.0/images/ui/ui-deployment-topology-6.png)

* A deployment with a workflow execution that failed

    ![Deployment Topology Execution Completed Errors](https://docs.cloudify.co/4.5.0/images/ui/ui-deployment-topology-7.png)

#### Widget Settings 
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 10 seconds.

The following settings allow changing the presentation of the widget in different aspects, and are by default marked as “on”: 

* `Enable group click` 
* `Enable zoom` 
* `Enable drag` 
* `Show toolbar` 
