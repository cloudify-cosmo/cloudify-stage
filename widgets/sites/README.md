# Sites

Displays the list of sites and enables their management.

![Sites widget](https://docs.cloudify.co/latest/images/ui/widgets/sites.png)

## Features

### Site basic information

The widget provides the following information:

* **Name**
* **Visibility level** - Represented by the icon next to the name. Permitted users (the sites’s creator, sys admins or tenant managers of the current tenant) can set the site’s visibility by clicking on this icon.
* **Location** - The location of the site, represented by latitude and longitude. On hovering aim icon you can see popup with map and marked location.
* **Creation time**
* **Creator**
* **Tenant** - The name of the tenant the site belongs to (if the site is global, it might belong to a tenant different than the current one).
* **Number of deployments assigned to the site**

You can use the **Search** input to filter the sites list.


### Site actions

The right column of the table allows permitted users to edit the site or delete it.
Also, using the “Create” button on the right top corner of the widget, you will be able to create new sites.


#### Creating a Site

![Create Site](https://docs.cloudify.co/latest/images/ui/widgets/sites_create-site.png)

1. Click the **Create** button.
2. Enter a name for the site. The name must be unique in the scope of the site (tenant/global).
3. (Optional) Choose the visibility level (the icon of the green man), default: tenant.
4. (Optional) Enter the location of the site. Expected format: latitude, longitude such as 32.071072, 34.787274. Click on the aim icon to get coordinates by clicking on the world map.
5. Click **Create**.

The site is added to the list.


#### Updating a Site

1. Click **Update site** icon on the right side of the site row.
2. Enter a new name or location for the site.
3. Click **Update**.

![Update Site](https://docs.cloudify.co/latest/images/ui/widgets/sites_update-site.png)


#### Deleting a Site

Deleting a site will remove the assignment of this site from all assigned deployments.

1. Click **Delete site** icon on the right side of the site row.
2. When prompted to verify that you want to remove the site, click **Yes**.


## Settings

* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 30 seconds.
