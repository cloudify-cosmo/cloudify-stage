const resourceTypes = {
    WIDGET: 'widget' as const,
    TEMPLATE: 'template' as const,
    PAGE: 'page' as const,

    get values() {
        return [this.WIDGET, this.TEMPLATE, this.PAGE];
    }
} as const;

export default resourceTypes;

export type ResourceType = typeof resourceTypes.WIDGET | typeof resourceTypes.TEMPLATE | typeof resourceTypes.PAGE;
