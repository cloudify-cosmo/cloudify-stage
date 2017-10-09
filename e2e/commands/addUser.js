/**
 * Created by jakubniezgoda on 2017-08-02.
 */

exports.command = function(userName, password, role = 'user - Regular user', tenant = 'default_tenant') {
    var users = this.page.userManagement();

    this.log('adding', userName, 'user')
        .moveToEditMode()
        .addPage();

    return this.isWidgetPresent(users.props.widgetId, result => {
        if (!result.value) {
            this.addWidget(users.props.widgetId)
        }

        users.add(userName, password, role, tenant)
             .moveOutOfEditMode();
    });
};