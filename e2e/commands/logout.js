/**
 * Created by jakubniezgoda on 02/08/2017.
 */

exports.command =  function() {
    var userMenu = this.page.page().section.userMenu;

    return userMenu
        .clickElement('@userName')
        .waitForElementVisible('@userDropdownMenu')
        .clickElement('@logoutMenuItem');
}