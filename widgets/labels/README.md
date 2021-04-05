# Labels

Displays the list of labels defined for the deployment which is currently in the context (see [notes](/working_with/console/widgets/index.html) for more information on resource context).
The table has 3 columns:

* **Key** - label key
* **Value** - label value
* Actions column, containing value edit and label delete action icons, available only to users with `deployment_create` permission

![labels]( /images/ui/widgets/labels.png )

By clicking buttons above the table you can execute the following operations:

* `Add` - opens the labels add modal, available only to users with `deployment_create` permission
* `Export` - export the table content into a JSON file

You can learn more about labels [here](/cli/orch_cli/deployments#labels).

## Settings

* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 30 seconds
