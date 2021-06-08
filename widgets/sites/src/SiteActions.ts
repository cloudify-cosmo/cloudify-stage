// @ts-nocheck File not migrated fully to TS
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
        return this.toolbox.getManager().doPut(`/sites/${name}`, { body: { location, visibility } });
    }

    doUpdate(name, visibility, location = null, newName = null) {
        const body = _.omitBy({ location, visibility, new_name: newName }, _.isNil);
        return this.toolbox.getManager().doPost(`/sites/${name}`, { body });
    }
}
