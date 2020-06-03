### User Management
Displays the list of users and enables their management. This widget is only available to admin users.
 
The widget displays the following information regarding each of the user groups:

* **Username**
* **Last login timestamp**
* **Admin** - whether or not the user is sys admin on the Cloudify manager (you can check and uncheck this filed to make changes)
* **Active** - whether or not the user is active (you can check and uncheck this field to make changes) 
* **# Groups** - number of groups the user is a member of
* **# Tenants** - number of tenants the user is assigned with
 
The hamburger menu on the right of every tenant allows performing the following operations:

* **Setting the user’s password**
* **Adding/removing the user to/from user groups**
* **Assigning/Unassigning the user with/from the tenant** 
* **Deleting the user** - possible only if the user does not belong to any groups, assigned to any tenants and is the creator of any resources on the manager. 
 
Also, using the “Add” button on the right top corner of the widget, you will be able to create new users.
Please notice that if you choose to  authenticate the users in front of an external user management system, you will not be able to create or delete the users in cloudify, nor to assigned them to Cloudify user groups,  to prevent conflicts between the two systems which might cause security problems. 

![manage-users](https://docs.cloudify.co/dev/staging/images/ui/widgets/manage-users.png)

#### Widget Settings 
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 30 seconds.
