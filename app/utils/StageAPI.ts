import type { ComponentType, ReactNode } from 'react';
import type i18n from 'i18next';

import type * as BasicComponents from '../components/basic';
import type * as SharedComponents from '../components/shared';
import type * as StagePropTypes from './props';
import type * as StageHooks from './hooks';
import type GenericConfig from './GenericConfig';
import type StageUtils from './stageUtils';
import type WidgetContext from './Context';
import type EventBus from './EventBus';

/** @see https://docs.cloudify.co/developer/writing_widgets/widget-apis/#toolbox-object */
export interface Toolbox {
    drillDown(
        widget: Widget,
        defaultTemplate: string,
        drilldownContext: Record<string, any>,
        drilldownPageName?: any
    ): void;
    getContext(): WidgetContext;
    getEventBus(): typeof EventBus;
    getExternal(basicAuth: unknown): any;
    getInternal(): any;
    getManager(): any;
    getManagerState(): any;
    getNewManager(ip: unknown): any;
    getWidget(): Widget;
    getWidgetBackend(): any;
    goToHomePage(): void;
    goToPage(pageName: string, context: any): void;
    goToParentPage(): void;
    loading(isLoading: boolean): void;
    refresh(): void;
}

export interface Widget {
    id: string;
    name: string;
    height: number;
    width: number;
    x: number;
    y: number;
    configuration: Record<string, any>;
    definition: WidgetDefinition;
    drillDownPages: any[];
    maximized: boolean;
}

/**
 * @see https://docs.cloudify.co/developer/writing_widgets/widget-definition/
 */
export type WidgetDefinition<Params = any, Data = any> = CommonWidgetDefinition<Params, Data> &
    (ReactWidgetDefinitionPart<Data> | HTMLWidgetDefinitionPart<Data>);

type ObjectKeys<T extends Record<string, any>> = T[keyof T];

export interface WidgetConfigurationDefinition {
    id: string;
    name?: string;
    description?: string;
    // TODO(RD-1296): add individual interfaces for different types. Use TypeScript discriminated unions
    type: string;
    default?: any;
    placeHolder?: string;
    hidden?: boolean;
    component?: ComponentType<any>;
    /** Used for lists */
    items?: (string | { name: string; value: string })[];

    // TODO(RD-1296): add concrete types for each possible key and remove the line below
    [key: string]: any;
}

interface CommonWidgetDefinition<Params, Data> {
    id: string;
    name: string;
    categories?: ObjectKeys<typeof GenericConfig['CATEGORY']>[];
    color?: string;
    description?: string;
    /** @see https://docs.cloudify.co/developer/writing_widgets/widget-definition/#fetchurl */
    fetchUrl?: string | Record<string, string>;
    /** @see https://docs.cloudify.co/developer/writing_widgets/widget-definition/#fetchparams-widget-toolbox */
    fetchParams?: (widget: Widget, toolbox: Toolbox) => Params;
    hasReadme?: boolean;
    hasStyle?: boolean;
    hasTemplate?: boolean;
    helpUrl?: string;
    /** @see https://docs.cloudify.co/developer/writing_widgets/widget-definition/#initialconfiguration */
    initialConfiguration?: WidgetConfigurationDefinition[];
    initialHeight?: number;
    initialWidth?: number;
    permission?: ObjectKeys<typeof GenericConfig['CUSTOM_WIDGET_PERMISSIONS']> | string;
    showBorder?: boolean;
    showHeader?: boolean;
    supportedEditions?: string[];

    init?: () => void;
    /** @see https://docs.cloudify.co/developer/writing_widgets/widget-definition/#fetchdata-widget-toolbox-params */
    fetchData?: (widget: Widget, toolbox: Toolbox, params: Params) => Promise<Data>;
}

type RenderCallback<Data, Output> = (widget: Widget, data: Data | null, error: any, toolbox: Toolbox) => Output;

interface ReactWidgetDefinitionPart<Data> {
    isReact?: true;
    render: RenderCallback<Data, ReactNode>;
}

interface HTMLWidgetDefinitionPart<Data> {
    isReact: false;
    render: RenderCallback<Data, string>;

    /** @see https://docs.cloudify.co/developer/writing_widgets/widget-definition/#postrender-container-widget-data-toolbox */
    postRender?: (container: any, widget: Widget, data: Data | null, toolbox: Toolbox) => void;
}

interface CommonOrPropTypeDefinition {
    name: string;
    common: any;
}

export interface StageAPI {
    Basic: typeof BasicComponents;
    defineWidget: <Params, Data>(widgetConfiguration: WidgetDefinition<Params, Data>) => void;
    Shared: typeof SharedComponents;
    ComponentToHtmlString: (element: ReactNode) => string;
    GenericConfig: typeof GenericConfig;
    Utils: typeof StageUtils;

    Common: Record<string, unknown>;
    defineCommon: (definition: CommonOrPropTypeDefinition) => void;

    PropTypes: typeof StagePropTypes & Record<string, any>;
    definePropType: (definition: CommonOrPropTypeDefinition) => void;

    Hooks: typeof StageHooks & Record<string, any>;
    defineHook: (definition: any) => void;

    i18n: typeof i18n;
}
