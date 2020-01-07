### User Group Management
Displays the list of user groups and enables their management. This widget is only available to admin users.
 
The widget displays the following information regarding each of the user groups:

* **Name**
* **LDAP group** When working with an ldap-based external authentication system, this fields identifies the LDAP user group which is connected to the current Cloudify user-group. 
* **Admin** If checked, all users who are members of this groups will have the role of sys-admins on the manager. 
* **# Users** number of users who are members of the group
* **# Tenants** number of tenants the user-group is assigned with.
 
The hamburger menu on the right of every tenant allows performing the following operations:

* **Adding/removing users to/from the group** available only if managing the users in Cloudify itself
* **Adding/removing user groups to/from the tenant**
* **Deleting the user groups** - possible only if there are no users who are members in the groups, and the group is not assigned with any tenants. 
Also, using the “Add” button on the right top corner of the widget, you will be able to create new user groups. 

![manage-usergroups](https://docs.cloudify.co/5.0.5/images/ui/widgets/manage-usergroups.png)

#### Widget Settings 
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 30 seconds.
