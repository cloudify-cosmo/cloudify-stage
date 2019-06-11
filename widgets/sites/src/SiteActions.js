
export default class SiteActions {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doGet(name) {
        return this.toolbox.getManager().doGet(`/sites/${name}`);
    }

    doDelete(name) {
        return this.toolbox.getManager().doDelete(`/sites/${name}`);
    }

    doCreate(name, visibility, location) {
        return this.toolbox.getManager().doPut(`/sites/${name}`, null, {location, visibility});
    }

    doUpdate(name, visibility, location=null, newName=null) {
        let site_data = _.pickBy({location, visibility, 'new_name': newName});
        return this.toolbox.getManager().doPost(`/sites/${name}`, null, site_data);
    }
}
