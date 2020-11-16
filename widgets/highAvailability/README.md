# Cluster Status

Displays the status of the Cloudify Manager cluster divided into 3 cluster services:

* Manager,
* Database,
* Message Broker.

![cluster-status-widget](https://docs.cloudify.co/latest/images/ui/widgets/cluster-status.png)      

Cluster services can have the following statuses:

* **OK** - service type cell background is green,
* **Degraded** - service type cell background is yellow,
* **Fail** - service type cell background is red.

Each cluster node is presented with:

* **Node Name**,
* **Status** - on hovering status icon you can see popup with details, you can copy raw info about node status to clipboard to get even more details,
* **Private IP**,
* **Public IP / Load Balancer IP** - in case of Manager node, you can click on the IP to go to Cloudify Management Console of that specific node,
* **Version**.

![cluster-status-widget](https://docs.cloudify.co/latest/images/ui/widgets/cluster-status-node-status.png)


## Settings

None
