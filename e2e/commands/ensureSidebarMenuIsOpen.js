/**
 * Created by jakubniezgoda on 2017-10-02.
 */

exports.command = function() {
    return this.isPresent('.sidebarContainer div.sidebar.menu.open', result => {
        if (!result.value) {
            return this.log('Opening sidebar menu.')
                .clickElement('i.sidebar-button')
                .waitForElementVisible('.sidebarContainer div.sidebar.menu.open');
        } else {
            return this.log('Sidebar menu is already open.');
        }
    });
};