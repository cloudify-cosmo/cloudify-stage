/**
 * Created by jakubniezgoda on 08/08/2017.
 */

import Consts from './consts';

export default class InitialTemplate {
    static DEFAULT_KEY = '*';
    static getName(config, manager) {
        var name = null;

        var mode = _.get(config, 'mode', Consts.MODE_MAIN);
        var role = _.get(manager,'auth.role');
        var tenant = _.get(manager, 'tenants.selected', InitialTemplate.DEFAULT_KEY);

        var initialTemplateObj = _.get(config, 'app.initialTemplate');
        var initialTemplateModeRole = initialTemplateObj[mode === Consts.MODE_MAIN ? role : mode];

        if (_.isObject(initialTemplateModeRole)) {
            name = _.get(initialTemplateModeRole, tenant, initialTemplateObj[InitialTemplate.DEFAULT_KEY]);
        } else if (_.isString(initialTemplateModeRole)) {
            name = initialTemplateModeRole;
        } else {
            console.error(`Error in configuration. Initial template for (mode=${mode}, role=${role}, tenant=${tenant}) invalid.`);
        }

        console.debug('Calculated initial template name:', name);
        return name;
    }
}
