### Secrets Store Management
Displays all the secrets visible to the logged-in user in the current tenant (including global secrets). The widget provides the following information:

* **Secret key**
* **Secret visibility level** represented by the icon next to the key. Permitted users (the secret’s creator, sys admins or tenant managers of the current tenant) can set the secret’s visibility by clicking on this icon. 
* **Secret Value** If the secret’s value is not hidden from the logged-in user, clicking on the “eye” icon will present its value, like in the following example, in which the logged-in user is a sys admin:


![hidden-value-admin](https://docs.cloudify.co/4.5.0/images/ui/widgets/hidden_secret_admin.png)

If the secret’s value is hidden and the logged-in user isn’t the secret’s creator or has admin/manager permissions in the tenant, then the same clicking will result in a red “restricted” sign, as seen here:

![hidden-value-user](https://docs.cloudify.co/4.5.0/images/ui/widgets/hidden_secret_unauth_user.png)


* **Hidden Value** Indicates if the secret’s value is hidden of not. If the logged-in user is the secret’s creator, or has admin/manager permissions in the tenant, checking/unchecking  this field will be enabled, and will make the secret hidden/non-hidden. 
* **Creation time**
* **Last update time**
* **Creator**
* **Tenant** The name of the tenant the secret belongs to (if the secret is global, it might belong to a tenant different than the current one). 
 
The right column of the table allows permitted users (secret creator, sys admin or tenant managers) to edit the secret’s value or delete it.
Even if the secret’s value is hidden from users, they might still be able to use the secret by providing its key in the blueprint. To better understand how secrets work in Cloudify, go to [Using the secret store](https://docs.cloudify.co/4.5.0/developer/blueprints/spec-secretstore)

#### Widget Settings 
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 30 seconds.
