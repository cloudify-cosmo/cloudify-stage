/**
 * Created by kinneretzin on 16/01/2017.
 */

import GenericConfig from './GenericConfig';

export default class WidgetDefinition {
    constructor(data) {
        // Set default values for optional properties
        this.color = 'blue';
        this.categories = [GenericConfig.CATEGORY.OTHERS];
        // this.description = undefined;
        // this.fetchUrl = undefined;
        this.hasReadme = false;
        this.hasStyle = false;
        this.hasTemplate = false;
        // this.helpUrl = undefined;
        this.initialConfiguration = [];
        this.initialHeight = 12;
        this.initialWidth = 3;
        this.isReact = true;
        this.permission = GenericConfig.CUSTOM_WIDGET_PERMISSIONS.CUSTOM_ALL;
        this.showBorder = true;
        this.showHeader = true;

        // By default don't check the supported editions and keep backwards compatibility
        this.supportedEditions = [];

        // Override defaults with data
        Object.assign(this, data);

        if (!this.name) {
            console.error('Missing widget name. Widget data is :', data);
        }
        if (!this.id) {
            console.error('Missing widget id. Widget data is :', data);
        }
    }
}
