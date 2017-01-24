/**
 * Created by kinneretzin on 16/01/2017.
 */

export default class WidgetDefinition {

    constructor(data) {
        // Set default
        this.showHeader = true;
        this.showBorder = true;
        this.initialWidth = 3;
        this.initialHeight = 3;
        this.color = "blue";
        this.initialConfiguration = [];
        this.keepOnTop = false;

        // Override defaults with data
        Object.assign(this,data);

        this.zIndex = this.keepOnTop ? 5 : 0;

        if (!this.name) {
            throw new Error('Missing widget name. Widget data is :',data);
        }
        if (!this.id) {
            throw new Error('Missing widget id. Widget data is :',data);
        }
    }

}