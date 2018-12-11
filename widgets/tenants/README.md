### Tenant Management
Displays a list of tenants on the Manager and enables tenant management. This widget is only available to admin users.
The widget displays the following information regarding each of the tenants:

* **Name**
* **Number of user-groups assigned to the tenant**
* **Number of users directly assigned to the tenant** (not as part of groups)
 
The hamburger menu on the right of every tenant allows performing the following operations:

* Adding/removing users to/from the tenant
* Adding/removing user-groups to/from the tenant 
* Deleting the tenant - possible only if the tenant has no users. User-groups or resources associated with it. 

Also, using the “Add” button on the right top corner of the widget, you will be able to create new tenants. 


![tenants-list](https://docs.cloudify.co/staging/dev/images/ui/widgets/tenants-list.png)

#### Widget Settings 
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 30 seconds.
