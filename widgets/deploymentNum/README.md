# Number of deployments
Displays the total number of deployments in the tenant, according to the user’s permissions and the blueprints’ visibility levels.

The widget is clickable, and upon clicking will redirect by default to
[the Services page](/working_with/console/pages/services-page). 
You can set the widget’s configuration to lead to a different
page. If the page contains Deployments View widget, then deployments will be
filtered according to the filter selected in widget's configuration.

The label and image displayed along with deployments count are configurable.

![number_of_deployments]( /images/ui/widgets/num_of_deployments.png )


## Settings

* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 10 seconds.
* `Label` - The label displayed under deployments count. Default: 'Deployments'
* `Icon` - Name of the icon displayed on the left side of the deployments count. Available icons list can be found 
  at: [Icon - Semantic UI React](https://react.semantic-ui.com/elements/icon). Default: 'cube'
* `Image URL` - URL of the image displayed on the left side of the deployments count. Default: ''
* `Filter ID` - Name of the saved filter to apply on deployments. Default: ''
* `Page to open on click` -  The name of the page to be redirected to upon clicking on the widget. Default: 'Services'
