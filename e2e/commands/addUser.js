/**
 * Created by jakubniezgoda on 2017-08-02.
 */

exports.command = function(userName, password, role = 'user', tenant = 'default_tenant') {
    var users = this.page.userManagement();

    return this.isWidgetPresent(users.props.widgetId, result => {
        this.log('adding', userName, 'user');

        if (!result.value) {
            this.moveToEditMode()
                .addWidget(users.props.widgetId)
                .moveOutOfEditMode();
        }

        users.add(userName, password, role, tenant);
    });
};