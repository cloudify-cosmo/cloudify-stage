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

![blueprints-list]( /images/ui/widgets/blueprints-list.png)


### Blueprint actions

There are also action buttons to upload a blueprint, create deployment, delete blueprint or edit blueprint copy in [{{< param cfy_composer_name >}}]({{< param cfy_composer_link >}}).


#### Uploading a Blueprint

##### Using marketplace

1. Click the **Upload** button.
2. In the menu, click **Upload from Marketplace** option.
3. In the Blueprint Marketplace modal, click **Upload** button on one of the blueprints shown in a table.

##### Using blueprint package

1. Click the **Upload** button.
2. In the menu, click **Upload a blueprint package** option.
3. In the Upload Blueprint dialog, provide the URL of the remote archive in which the blueprint is located or select a local blueprint archive.
4. Enter the `Blueprint name` and `Blueprint YAML file`.   
   `Blueprint name` is the name with which you want to identify this blueprint once uploaded.<br>
   `Blueprint YAML file` is the name of the YAML file in the archive that you want to upload as the main blueprint - as there can be multiple files in the archive. If a blueprint filename field is omitted, the default `blueprint.yaml` filename is used, but if a file under that name does not exist in the archive, an error message will appear.    
4. (Optional) Provide a .png file URL or select a local one, to appear as an icon in the catalog or table view next to the blueprint name.   
5. Choose the blueprint's visibility by clicking on the icon in the top right corner:<br>
![Resource visibility]( /images/ui/icons/tenant-wide-resource-icon.png ).<br>
The default visibility is "Tenant", and according to the logged-in user's permissions you can also choose other levels of [resource visibilities](/working_with/manager/resource-visibility).<br>
6. Click **Upload**.

##### Using Terraform module
1. Click the **Upload** button.
2. In the menu, click **Upload from Terraform module** option.
3. **Create blueprint from Terraform** modal will appear.
4. Enter the `Blueprint name`   
   `Blueprint name` is the name with which you want to identify this blueprint once uploaded.
5. Select `Terraform version` (by default, one of the Terraform versions will be selected).
6. Provide `Blueprint main information`, which consists of:
   - `URL to a zip archive that contains the Terraform module`.
   - `Terraform folder in the archive` - selectable field from which you can select Terraform module contained in the zip file.<br />
   By default this field is disabled, until the `URL to a zip archive that contains the Terraform module` is provided.
   - (Optional) Credentials required for accessing `URL to a zip archive that contains the Terraform module`.
7. (Optional) To add `Variables` or `Environment variables`:   
   1. Click the `Variables` or `Environment variables` section.
   2. Click the **Add** button.
   3. Fill the row fields:
      - `Variable` - name of the variable.
      - `Source` - type of the variable, which may be selected from a dropdown.<br />
         Currently available values are: `Secret`, `Input`, `Static`.
      - `Value / Secret key / Input name` - value of the variable (related to the selected `Source`).<br />
         Selecting `Static` as a `Source` enables to type a value. <br />
         Selecting `Input` as a `Source` enables to type a value. <br />
         Selecting `Secret` enables to choose one of the stored secrets as the variable value source or to manually enter secret key, which may not be defined in the secret store yet.
8. (Optional) To add `Outputs`:   
   1. Click the `Outputs` section.
   2. Click the **Add** button.
   3. Fill the row fields:
      - `Output` - name of the output.
      - `Output type` - type of the output, which may be selected from a dropdown.<br />
         Currently available values are: `Output`, `Capability`.
      - `Terraform output` - value of the output, which will be added to the generated blueprint.
9. Click **Upload**.

##### Using {{< param cfy_composer_name >}}

1. Click the **Upload** button.
2. In the menu, click **Generate in the Composer** option.
3. {{< param cfy_composer_name >}} will be opened in a new tab and there you can create a blueprint.

#### Deploying a Blueprint

1. Click the deploy icon ![Deploy icon]( /images/ui/icons/deploy-icon.png ).   
2. In the Deploy Blueprint dialog, specify a name for your deployment.
3. Specify the required deployment inputs.   
   The names of the default input values appear in the inputs fields. You can leave these defaults or override them with new values.
   Input's description (on hovering help icon ![Help icon]( /images/ui/icons/help-icon.png )) might help you understand how to fill-in the proper value.
   An alternative for providing the inputs is to specify a .yaml file containing the relevant values.
4. Select **Deploy** in the drop-down to deploy the blueprint or click **Install** to deploy and execute `install` workflow on it.

![Create a deployment]( /images/ui/widgets/blueprints_deployment_creation.png )


#### Deleting a Blueprint

Click the delete icon ![Delete icon]( /images/ui/icons/delete-icon.png ) and confirm deletion in the displayed dialog.


### Blueprint details

When you click the blueprint row (element) in the blueprints table (catalog), a blueprint-specific page opens (it's also called blueprint's drill-down page).

The page displays the following widgets with details about the selected blueprint:

* [Blueprint Action Buttons](/working_with/console/widgets/blueprintActionButtons)
* [Blueprint Topology](/working_with/console/widgets/topology)
* [Blueprint Deployments](/working_with/console/widgets/deployments)
* [Blueprint Inputs](/working_with/console/widgets/inputs)
* [Blueprint Outputs/Capabilities](/working_with/console/widgets/outputs)
* [Blueprint Sources](/working_with/console/widgets/blueprintSources)

See Settings section for details on how to turn on/off this feature.


## Settings

* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 10 seconds
* `Enable click to drill down` - Enables redirecting to the blueprint’s drill-down page upon clicking on a specific blueprint. Default: Yes
* `Display style` - Defines how the blueprints list should be displayed. Can be either Catalog or Table. Default: Table
* `Hide failed blueprints` - Allows to hide blueprints not uploaded successfully. Default: Off
* `Show Composer options` - Allows to show {{< param cfy_composer_name >}} options in menu and in the blueprints list. Default: No
* `Label filter rules` - Allows to define blueprint labels' filter rules. See [blueprint filters](/cli/orch_cli/blueprints#blueprint-filters) for more details. Default: empty
* `Marketplace tabs` - Allows to define multiple sources from which blueprints are taken to populate Blueprint Marketplace modal. User can define a name and URL for each tab.
* `Marketplace display style` - Defines how the Blueprints Marketplace modal should be displayed. Can be either Catalog or Table.  Default: Table
* `List of fields to show in the marketplace table` - Allow to change the list of visible columns in the Blueprint Marketplace modal. Works only when Marketplace display style is set to Table. Default: Name, Description.
