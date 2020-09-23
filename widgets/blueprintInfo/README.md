### Blueprint Info
Displays the following information about a specific blueprint: 

* **Picture**
* **Name**
* **Visibility level**
* **Creation time**
* **Last update time**
* **Creator user-name**
* **Main blueprint file name** (as the blueprint archive can contain multiple files)

![blueprint-info](https://docs.cloudify.co/5.1/images/ui/widgets/blueprint-info.png)


## Settings

* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 10 seconds
* `Blueprint ID` - The blueprint ID must be passed to the widget. This can be done either by placing the widget in a blueprint’s drill-down page (in which case the blueprint ID is automatically passed in the page’s context), or by specifying the blueprint ID in this configuration field. The blueprint ID is its name.
