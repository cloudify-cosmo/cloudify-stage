/**
 * Created by pawelposel on 2017-05-31.
 */

exports.command = function() {
    this.page.page().section.editModeSidebar
        .clickElement('@addPageButton');

    return this.pause(2000);
};