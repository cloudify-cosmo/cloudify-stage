/**
 * Created by pawelposel on 2017-05-31.
 */

exports.command = function(deploymentName) {
    var filter = this.page.filter();

    return this.isWidgetPresent(filter.props.widgetId, result => {
            this.log('selecting', deploymentName, 'deployment');

            if (!result.value) {
                this.moveToEditMode()
                    .addWidget(filter.props.widgetId)
                    .moveOutOfEditMode();
            }

            filter.selectOptionInDropdown('@deploymentSearch', deploymentName);
        });
};