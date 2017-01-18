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

        this.initPollingTime();

        if (!this.name) {
            throw new Error('Missing widget name. Widget data is :',data);
        }
        if (!this.id) {
            throw new Error('Missing widget id. Widget data is :',data);
        }
    }

    initPollingTime() {
        const pollingTimeOption = {
            id: "pollingTime",
            name: "Refresh time interval",
            placeHolder: "Enter time interval in seconds",
            description: "Data of the widget will be refreshed per provided interval time in seconds",
            default: 0,
            type: Stage.Basic.Field.NUMBER_TYPE
        };

        let option = _.find(this.initialConfiguration,{id:"pollingTime"});
        if (option) {
            Object.assign(option, Object.assign({}, pollingTimeOption, option));
        } else {
            this.initialConfiguration.unshift(pollingTimeOption);
        }
    }
}