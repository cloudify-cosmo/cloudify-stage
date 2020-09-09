### Deployment Outputs

Presents the names and values of the outputs and capabilities of a specific deployment. The deployment can be selected in one of the following ways: 

* By placing the deployment outputs widget in the deployments drill-down page, meaning the deployment has been selected before entering the page, and its id is included in the page’s context. 
* By adding to the page a widget allowing to select deployments, such as the resources filter or the blueprint deployments.   

If only a blueprint was selected, the widget will present the default values for the outputs, defined in the blueprint itself. 

![deployment-outputs](https://docs.cloudify.co/staging/dev/images/ui/widgets/deployment-outputs.png)

#### Widget Settings
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 10 seconds
* `Show capabilities` - Specify if deployment capabilities should be visible in table. Default: true 
