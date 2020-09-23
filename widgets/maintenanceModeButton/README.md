# Maintenance Mode button
This Button allows to activate Maintenance Mode.


Maintenance Mode can only be activated by `admin` users.


![maintenance-mode-button](https://docs.cloudify.co/5.1/images/ui/widgets/maintenance-mode-button.png)

You can activate Maintenance Mode by clicking **Activate Maintenance Mode** button. To enter Maintenance Mode, click **Yes** in the *Are you sure you want to enter maintenance mode?* dialog.

In order for Maintenance Mode to be activated, all running workflows must be stopped.
During the Maintenance Mode activation process, Cloudify Manager waits for all running executions to finish. 
During this time, you can see all running executions and cancel them manually, if necessary.

![Remaining executions](https://docs.cloudify.co/5.1/images/ui/widgets/maintenance-mode-button_remaining-executions.png)

When Maintenance Mode is active, all Cloudify Management Console pages are not available and you are redirected to Maintenance Mode status page:

![Maintenance Mode status page](https://docs.cloudify.co/5.1/images/ui/widgets/maintenance-mode-button_status-page.png)

To exit Maintenance Mode, click **Deactivate Maintenance Mode** button and click **Yes** when you are prompted to confirm that you want to exit Maintenance mode.

More about Maintenance Mode you can find [here](https://docs.cloudify.co/5.1/working_with/manager/maintenance-mode).


## Settings

None
