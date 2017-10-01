/**
 * Created by kinneretzin on 16/01/2017.
 */

export default class WidgetDefinition {

    constructor(data) {
        // Set default
        this.showHeader = true;
        this.showBorder = true;
        this.initialWidth = 3;
        this.initialHeight = 12;
        this.color = 'blue';
        this.initialConfiguration = [];
        this.hasStyle = false;

        // Override defaults with data
        Object.assign(this,data);

        if (!this.name) {
            throw new Error('Missing widget name. Widget data is :',data);
        }
        if (!this.id) {
            throw new Error('Missing widget id. Widget data is :',data);
        }
        if (!this.permission){
            console.warn('Missing widget permission. No user would be authorized for this widget.')
        }
    }

}