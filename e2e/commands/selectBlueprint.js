/**
 * Created by pawelposel on 2017-05-31.
 */

exports.command = function(blueprintName) {
    if (!blueprintName) {
        blueprintName = this.page.blueprints().props.testBlueprint;
    }

    var filter = this.page.filter();

    return this.isWidgetPresent(filter.props.widgetId, result => {
            this.log("selecting", blueprintName, "blueprint");

            if (!result.value) {
                this.moveToEditMode()
                    .addWidget(filter.props.widgetId)
                    .moveOutOfEditMode();
            }

            filter.selectOptionInDropdown('@blueprintSearch', blueprintName);
        });
};