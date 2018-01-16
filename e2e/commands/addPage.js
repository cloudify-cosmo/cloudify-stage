/**
 * Created by pawelposel on 2017-05-31.
 */

exports.command = function() {
    return this.page.page().section.editModeSidebar
        .clickElement('@addPageButton')
        .waitForElementPresent('div.emptyPage');
};