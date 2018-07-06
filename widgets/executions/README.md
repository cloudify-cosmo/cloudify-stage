### Executions

Displays data about the executions in the current tenant, according to the user’s permissions. By default, the presented details include the blueprint and deployment of the execution, the time that it was created, its status and more. 

![executions](https://docs.cloudify.co/staging/next/images/ui/widgets/executions.png)

#### Widget Settings
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 5 seconds
* `List of fields to show in the table` You can choose which fields to present. By default, these are the fields presented:
  * Blueprint
  * Deployment
  * Workflow
  * Created 
  * Creator
  * System
  * Params
  * Status
      
You can also choose to add the following columns from the list:
* `ID` , which will present the execution id. By default this value is not presented as a column in the table, but as a pop up shown by hovering over ID label. 
* `Ended` , which will present the execution id. By default this value is not presented as a column in the table, but as a pop up shown  by clicking on a specific execution. 
![executions](https://docs.cloudify.co/staging/next/images/ui/widgets/executions_copy_id.png)
* `Show system executions`- allow to include or exclude executions of system workflows in the list. Default: On