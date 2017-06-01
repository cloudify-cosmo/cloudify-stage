/**
 * Created by pawelposel on 2017-05-31.
 */

exports.command = function(name) {
    if (!name) {
        name = this.page.blueprints().props.testBlueprint;
    }

    return this.page.page()
        .section.page
        .isWidgetPresent("filter", result => {
            console.log("-- selecting " + name + " blueprint");

            if (!result.value) {
                this.moveToEditMode().addWidget("filter").moveOutOfEditMode();
            }

            var filterWidget = this.page.filter();
            filterWidget.setValue('@blueprintSearch', [name, this.Keys.ENTER]);
        });
};