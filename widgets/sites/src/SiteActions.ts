// @ts-nocheck File not migrated fully to TS
import { isNil, omitBy } from 'lodash';

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
        const body = omitBy({ location, visibility, new_name: newName }, isNil);
        return this.toolbox.getManager().doPost(`/sites/${name}`, { body });
    }
}
