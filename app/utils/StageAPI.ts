import type { ReactNode } from 'react';

import * as BasicComponents from '../components/basic';
import * as SharedComponents from '../components/shared';
import type GenericConfig from './GenericConfig';
import type StageUtils from './stageUtils';

type WidgetDefinition<Params = any, Data = any> = CommonWidgetDefinition<Params, Data> &
    (ReactWidgetDefinitionPart<Data> | HTMLWidgetDefinitionPart<Data>);

type ObjectKeys<T extends Record<string, any>> = T[keyof T];

interface CommonWidgetDefinition<Params, Data> {
    id: string;
    name: string;
    categories?: ObjectKeys<typeof GenericConfig['CATEGORY']>[];
    color?: string;
    description?: string;
    /** @see https://docs.cloudify.co/developer/writing_widgets/widget-definition/#fetchurl */
    fetchUrl?: string | Record<string, string>;
    /** @see https://docs.cloudify.co/developer/writing_widgets/widget-definition/#inclusive-params */
    fetchParams?: (widget: any, toolbox: any) => Params;
    hasReadme?: boolean;
    hasStyle?: boolean;
    hasTemplate?: boolean;
    helpUrl?: string;
    /** @see https://docs.cloudify.co/developer/writing_widgets/widget-definition/#initialconfiguration */
    initialConfiguration?: any[];
    initialHeight?: number;
    initialWidth?: number;
    permission?: ObjectKeys<typeof GenericConfig['CUSTOM_WIDGET_PERMISSIONS']>[];
    showBorder?: boolean;
    showHeader?: boolean;
    supportedEditions?: string[];

    init?: () => void;
    // TODO: fill in the types
    postRender?: (container: any, widget: any, data: Data | null, toolbox: any) => void;
    // TODO: fill in the types
    fetchData?: (widget: any, toolbox: any, params: Params) => Promise<Data>;
}

interface ReactWidgetDefinitionPart<Data> {
    isReact?: true;
    render: (widget: any, data: Data | null, error: any, toolbox: any) => ReactNode;
}
interface HTMLWidgetDefinitionPart<Data> {
    isReact: false;
    render: (widget: any, data: Data | null, error: any, toolbox: any) => string;
}
function defineWidg<P, D>(def: WidgetDefinition<P, D>) {}
defineWidg<{ param: boolean }, number>({
    id: 'ab',
    name: 'ab',

    categories: ['All'],
    permission: ['widget_custom_admin'],
    isReact: false,
    fetchParams: () => ({
        param: true
    }),
    fetchData: (widget, toolbox, params): Promise<number> => {
        return Promise.resolve(5);
    },

    render: (a, b, c, d) => {
        return 'hi';
    }
});
defineWidg({
    id: 'ab',
    name: 'ab',

    categories: ['All'],
    permission: ['widget_custom_admin'],
    isReact: true,

    render: (a, b, c, d) => {
        return React.createElement('div');
    }
});

export interface StageAPI {
    Basic: typeof BasicComponents;
    defineWidget: (widgetConfiguration: any) => void;
    Shared: typeof SharedComponents;
    ComponentToHtmlString: (element: ReactNode) => void;
    GenericConfig: GenericConfig;
    Utils: StageUtils;
    Common: Record<string, unknown>;
    defineCommon: (definition: any) => void;
    PropTypes: any;
    definePropType: (definition: any) => void;
    Hooks: any;
    defineHook: (definition: any) => void;
    i18n: any;
}
