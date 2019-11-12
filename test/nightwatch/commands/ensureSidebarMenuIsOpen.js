/**
 * Created by jakubniezgoda on 2017-10-02.
 */

exports.command = function() {
    return this.isVisible('.sidebarContainer div.sidebar.menu', result => {
        if (!result.value) {
            return this.log('Opening sidebar menu.')
                .clickElement('i.sidebar-button')
                .waitForElementVisible('.sidebarContainer div.sidebar.menu.open');
        }
        return this.log('Sidebar menu is already open.');
    });
};
