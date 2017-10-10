/**
 * Created by jakubniezgoda on 2017-10-10.
 */

exports.command = function() {
    var section = this.page.page().section.userMenu;

    return section.clickElement('@userName')
        .waitForElementVisible('@userDropdownMenu')
        .clickElement('@resetMenuItem')
        .parent.section.resetTemplateConfirmModal
        .clickElement('@yesButton')
        .waitForSplashPageNotVisible();
};