### Sites
Displays the list of sites and enables their management.
The widget provides the following information:

* **Name**
* **Visibility level** - Represented by the icon next to the name. Permitted users (the sites’s creator, sys admins or tenant managers of the current tenant) can set the site’s visibility by clicking on this icon.
* **Location** - The location of the site, represented by latitude and longitude.
* **Creation time**
* **Creator**
* **Tenant** - The name of the tenant the site belongs to (if the site is global, it might belong to a tenant different than the current one).
* **Number of deployments assigned to the site**

You can use the **Search** input to filter the sites list.
The right column of the table allows permitted users to edit the site or delete it.
Also, using the “Create” button on the right top corner of the widget, you will be able to create new sites.

![manage-users](https://docs.cloudify.co/staging/dev/images/ui/widgets/sites.png)

#### Widget Settings 
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 30 seconds.
