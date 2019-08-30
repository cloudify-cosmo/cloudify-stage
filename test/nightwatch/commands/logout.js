/**
 * Created by jakubniezgoda on 02/08/2017.
 */

exports.command = function() {
    const { userMenu } = this.page.page().section;

    return userMenu
        .clickElement('@userName')
        .waitForElementVisible('@userDropdownMenu')
        .clickElement('@logoutMenuItem');
};
