# Sites Map
Displays the world map with defined sites marked. Only sites with defined location are displayed on the map.

![sitesMap](https://docs.cloudify.co/5.1/images/ui/widgets/sitesMap.png)

<div class="ui message info">
The widget is available only when Premium or Spire license is activated on the Cloudify Manager.
</div>


## Site markers

The color of the site marker on the map indicates the site's health. It is derived from the status of the deployments attached to the site.

After clicking the site marker on the map, the user is presented with a popup with the status breakdown of the deployments assigned with the site.

![sitesMap](https://docs.cloudify.co/5.1/images/ui/widgets/sitesMap_siteDetails.png)

Site details contain information about deployments' statuses, indicated as follows:

* **Green** - the number of deployments with all nodes successfully started.
* **Yellow** - the number of deployments in which active workflow execution is performed.
* **Blue** - the number of deployments with non-started nodes.
* **Red** - the number of deployments with failed workflow execution.


## Map provider

Sites Map widget uses [Leaflet](https://leafletjs.com/) library for displaying interactive map. 
The library can display various types of maps from different providers.
The list of all supported providers can be found in [leaflet-providers](https://github.com/leaflet-extras/leaflet-providers) repository.

Sites Map widget with default configuration displays map tiles provided by [Stadia Maps](https://stadiamaps.com/).
You can change the provider in [User Configuration](https://docs.cloudify.co/5.1/working_with/console/customization/user-configuration). 


## Settings

* `Refresh time interval` - Time interval in which widget’s data will be refreshed, in seconds. Default: 10 seconds.
* `Show all the site labels` - If set, then all sites will be displayed with site details popup opened.
