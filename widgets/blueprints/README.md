### Blueprints

Displays all the blueprints on the tenant, according to the user’s permissions and the blueprints visibility levels. The following information is displayed: 

* **Icon image file**
* **Name**
* **Visibility level**
* **Creation time**
* **Last update time**
* **Creator user-name**
* **Main blueprint file name** (as the blueprint archive can contain multiple files)
* **Number of deployments derived from the blueprint**

![blueprints-list](https://docs.cloudify.co/staging/dev/images/ui/widgets/blueprints-list.png)

#### Widget Settings
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 10 seconds
* `Enable click to drill down` - This option enables redirecting to the blueprint’s drill-down page upon clicking on a specific blueprint. Default: True
* `Display style` - Can be either Catalog or table. The deployments status column is only available in list mode.  Default: table 
