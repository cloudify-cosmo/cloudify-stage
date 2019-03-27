/**
 * Created by pawelposel on 2017-05-31.
 */

exports.command = function() {
    let section = this.moveToEditMode().page.page().section.sidebar;

    return section.moveToElement('@lastPage', 10, 10)
            .clickElement('@lastPageRemoveButton');
};