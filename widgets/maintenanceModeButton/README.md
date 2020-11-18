# Maintenance Mode button
This Button allows to activate Maintenance Mode.

<div class="ui message info">
Maintenance Mode can only be activated by `admin` users.
</div>

![maintenance-mode-button]( /images/ui/widgets/maintenance-mode-button.png )

You can activate Maintenance Mode by clicking **Activate Maintenance Mode** button. To enter Maintenance Mode, click **Yes** in the *Are you sure you want to enter maintenance mode?* dialog.

In order for Maintenance Mode to be activated, all running workflows must be stopped.
During the Maintenance Mode activation process, the {{< param cfy_manager_name >}} waits for all running executions to finish. 
During this time, you can see all running executions and cancel them manually, if necessary.

![Remaining executions]( /images/ui/widgets/maintenance-mode-button_remaining-executions.png )

When Maintenance Mode is active, all {{< param cfy_console_name >}} pages are not available and you are redirected to Maintenance Mode status page:

![Maintenance Mode status page]( /images/ui/widgets/maintenance-mode-button_status-page.png )

To exit Maintenance Mode, click **Deactivate Maintenance Mode** button and click **Yes** when you are prompted to confirm that you want to exit Maintenance mode.

More about Maintenance Mode you can find [here](/working_with/manager/maintenance-mode).


## Settings

None
