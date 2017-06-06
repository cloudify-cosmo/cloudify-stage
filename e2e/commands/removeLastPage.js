/**
 * Created by pawelposel on 2017-05-31.
 */

exports.command = function() {
    var section = this.page.page().section.sidebar;

    return section.getText("@lastPage", function(result) {
        if (result.value === section.props.lastPageLabel) {
            section.moveToElement('@lastPage', 10, 10)
                .waitForElementVisible('@lastPageRemoveButton')
                .click('@lastPageRemoveButton');
        }
    });
};