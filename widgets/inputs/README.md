### Deployment Inputs

Presents the names and values of the inputs of a specific deployment. The deployment can be selected in one of the following ways: 

* By placing the deployment inputs widget in the deployments drill-down page, meaning the deployment has been selected before entering the page, and its id is included in the page’s context. 
* By adding to the page a widget allowing to select deployments, such as the resources filter or the blueprint deployments.  

If only a blueprint was selected, the widget will present the default values for the inputs, defined in the blueprint itself. 

![deployment-inputs](https://docs.cloudify.co/dev/staging/images/ui/widgets/deployment-inputs.png)

#### Widget Settings
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 30 seconds
