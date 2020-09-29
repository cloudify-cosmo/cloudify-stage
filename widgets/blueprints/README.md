# Blueprints

Displays all the blueprints on the tenant, according to the user’s permissions and the blueprints visibility levels. 
 The data can be displayed as a table or a catalog.
 
## Features

### Blueprint basic information

The following information is displayed: 

* **Icon image file**
* **Name**
* **Visibility level**
* **Creation time**
* **Last update time**
* **Creator user-name**
* **Main blueprint file name** (as the blueprint archive can contain multiple files)
* **Number of deployments derived from the blueprint**

![blueprints-list](https://docs.cloudify.co/5.1/images/ui/widgets/blueprints-list.png)


### Blueprint actions

There are also action buttons to upload a blueprint, create deployment, delete blueprint or edit blueprint copy in [Cloudify Composer](https://docs.cloudify.co/5.1/developer/composer/).


#### Uploading a Blueprint

1. Click the **Upload** button.
2. In the Upload Blueprint dialog, provide the URL of the remote archive in which the blueprint is located or select a local blueprint archive. 
3. Enter the `Blueprint name` and `Blueprint YAML file`.   
   `Blueprint name` is the name with which you want to identify this blueprint on the Cloudify Manager instance.<br>
   `Blueprint YAML file` is the name of the YAML file in the archive that you want to upload as the main blueprint - as there can be multiple files in the archive. If a blueprint filename field is omitted, the default `blueprint.yaml` filename is used, but if a file under that name does not exist in the archive, an error message will appear.    
4. (Optional) Provide a .png file URL or select a local one, to appear as an icon in the catalog or table view next to the blueprint name.   
5. Choose the blueprint's visibility by clicking on the icon in the top right corner:<br>
![Resource visibility](https://docs.cloudify.co/5.1/images/ui/icons/tenant-wide-resource-icon.png).<br>
The default visibility is "Tenant", and according to the logged-in user's permissions you can also choose other levels of [resource visibilities](https://docs.cloudify.co/5.1/working_with/manager/resource-visibility).<br>
6. Click **Upload**.


#### Deploying a Blueprint

1. Click the deploy icon ![Deploy icon](https://docs.cloudify.co/5.1/images/ui/icons/deploy-icon.png).   
2. In the Deploy Blueprint dialog, specify a name for your deployment.
3. Specify the required deployment inputs.   
   The names of the default input values appear in the inputs fields. You can leave these defaults or override them with new values. 
   Input's description (on hovering help icon ![Help icon](https://docs.cloudify.co/5.1/images/ui/icons/help-icon.png)) might help you understand how to fill-in the proper value. 
   An alternative for providing the inputs is to specify a .yaml file containing the relevant values. 
4. Click **Deploy** to deploy the blueprint or **Deploy & Install** to deploy and execute `install` workflow on it.

![Create a deployment](https://docs.cloudify.co/5.1/images/ui/widgets/blueprints_deployment_creation.png)


#### Deleting a Blueprint

Click the delete icon ![Delete icon](https://docs.cloudify.co/5.1/images/ui/icons/delete-icon.png) and confirm deletion in the displayed dialog.


### Blueprint details

When you click the blueprint row (element) in the blueprints table (catalog), a blueprint-specific page opens (it's also called blueprint's drill-down page).
 
The page displays the following widgets with details about the selected blueprint:

* [Blueprint Action Buttons](https://docs.cloudify.co/5.1/working_with/console/widgets/blueprintActionButtons)
* [Blueprint Topology](https://docs.cloudify.co/5.1/working_with/console/widgets/topology)
* [Blueprint Deployments](https://docs.cloudify.co/5.1/working_with/console/widgets/deployments)
* [Blueprint Inputs](https://docs.cloudify.co/5.1/working_with/console/widgets/inputs)
* [Blueprint Outputs/Capabilities](https://docs.cloudify.co/5.1/working_with/console/widgets/outputs)
* [Blueprint Sources](https://docs.cloudify.co/5.1/working_with/console/widgets/blueprintSources)

See Settings section for details on how to turn on/off this feature.


## Settings

* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 10 seconds
* `Enable click to drill down` - This option enables redirecting to the blueprint’s drill-down page upon clicking on a specific blueprint. Default: True
* `Display style` - Can be either Catalog or table. The deployments status column is only available in list mode.  Default: table 
