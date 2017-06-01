/**
 * Created by pawelposel on 2017-05-31.
 */

exports.command = function() {
    var section = this.page.page().section.sidebar;

    return section.getText("@lastPage", function(result) {
        if (result.value === section.props.lastPageLabel) {
            section.moveToElement('@lastPageRemoveButton', 10, 10)
                .waitForElementVisible('@lastPageRemoveButton')
                .click('@lastPageRemoveButton');
        }
    });
};