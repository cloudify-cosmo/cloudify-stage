/**
 * Created by kinneretzin on 16/01/2017.
 */

export default class WidgetDefinition {

    constructor(data) {
        // Set default values for optional properties
        this.color = 'blue';
        this.categories = [Stage.GenericConfig.CATEGORY.OTHERS];
        //this.description = undefined;
        //this.fetchUrl = undefined;
        this.hasReadme = false;
        this.hasStyle = false;
        this.hasTemplate = false;
        //this.helpUrl = undefined;
        this.initialConfiguration = [];
        this.initialHeight = 12;
        this.initialWidth = 3;
        this.showBorder = true;
        this.showHeader = true;

        // Override defaults with data
        Object.assign(this,data);

        if (!this.name) {
            throw new Error('Missing widget name. Widget data is :',data);
        }
        if (!this.id) {
            throw new Error('Missing widget id. Widget data is :',data);
        }
        if (!this.permission){
            throw new Error('Missing widget permission. No user would be authorized for this widget.')
        }
    }

}