# Create deployment button
Allows creating a deployment of a chosen blueprint.   
After choosing:
 
  * a name for the deployment
  * the desired blueprint
  * parent on which the desired blueprint should be deployed on - this option is presented only when the selected blueprint is using [get_environment_capability](/developer/blueprints/spec-intrinsic-functions#get_environment_capability) intrinsic function
  * the visibility of the deployment (private/tenant)
  
  a screen will open, allowing to specify values for the inputs required by the chosen blueprint.

![create_deployment_button]( /images/ui/widgets/create_deployment_button.png )


## Settings

* `label` - The label displayed in the button. Default: 'Create deployment'
* `Color` - The color of the button. Available colors list can be found
  at: [Theming - Semantic UI React](https://react.semantic-ui.com/layouts/theming). Default: 'blue'
* `Icon` - Name of the icon displayed in the button. Available icons list can be found
  at: [Icon - Semantic UI React](https://react.semantic-ui.com/elements/icon). Default: 'rocket'
* `Basic button` - Allows to change button appearence, basic button is less pronounced. Default: No
* `Label filter rules` - Allows to define blueprint labels' filter rules. See [blueprint filters](/cli/orch_cli/blueprints#blueprint-filters) for more details. Default: empty
