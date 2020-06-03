### Nodes List
Displays a list of the existing nodes in the current tenant, according to the user’s permissions. The node’s blueprint and deployment, type, connected nodes, number of instances, and nodes groups of which the node is part are displayed.

The nodes are listed by name. When you select a node, either by clicking its name in the table or by clicking it in the Topology pane, additional data about the node’s instances is displayed: The instances names, statuses, relationships and runtime properties. 

Node type hierarchy can be shown by hovering over type hierarchy icon (![type-hierarchy-icon](https://docs.cloudify.co/staging/dev/images/ui/icons/type-hierarchy-icon.png)).

![nodes-list](https://docs.cloudify.co/staging/dev/images/ui/widgets/nodes-list-2.png)

#### Widget Settings
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 10 seconds
* `List of fields to show in the table` - You can choose which fields to present. By default, all of these fields are presented:
   * Icon
   * Name
   * Type
   * Blueprint
   * Deployment
   * Contained in
   * Connected to 
   * Host
   * Creator - name of the user who created the deployment 
   * \# instances - number of existing instances of this node
   * Groups - nodes groups which the node is part of