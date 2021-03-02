import type { ComponentType, ReactNode } from 'react';
import type i18n from 'i18next';
// NOTE: the file contains only types and is undetectable for ESLint
// eslint-disable-next-line import/no-unresolved
import type { SemanticCOLORS } from 'semantic-ui-react/dist/commonjs/generic';

import type * as BasicComponents from '../components/basic';
import type * as SharedComponents from '../components/shared';
import type * as StagePropTypes from './props';
import type * as StageHooks from './hooks';
import type GenericConfig from './GenericConfig';
import type StageUtils from './stageUtils';
import type WidgetContext from './Context';
import type EventBus from './EventBus';
import type Manager from './Manager';
import type Internal from './Internal';
import type External from './External';
import type { WithOptionalProperties } from './types';

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
    getExternal(basicAuth: unknown): External;
    getInternal(): Internal;
    getManager(): Manager;
    getManagerState(): any;
    getNewManager(ip: unknown): any;
    getWidget(): Widget;
    getWidgetBackend(): any;
    goToHomePage(): void;
    goToPage(pageName: string, context: any): void;
    goToParentPage(): void;
    loading(isLoading: boolean): void;
    refresh(params?: any): void;
}

export interface Widget<Configuration = Record<string, unknown>> {
    id: string;
    name: string;
    height: number;
    width: number;
    x: number;
    y: number;
    configuration: Configuration;
    definition: WidgetDefinition;
    drillDownPages: any[];
    maximized: boolean;
}

/**
 * @see https://docs.cloudify.co/developer/writing_widgets/widget-definition/
 */
export type WidgetDefinition<
    Params = any,
    Data = any,
    Configuration = Record<string, unknown>
> = CommonWidgetDefinition<Params, Data, Configuration> &
    (ReactWidgetDefinitionPart<Data, Configuration> | HTMLWidgetDefinitionPart<Data, Configuration>);

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

interface CommonWidgetDefinition<Params, Data, Configuration> {
    id: string;
    name: string;
    categories: ObjectKeys<typeof GenericConfig['CATEGORY']>[];
    color: SemanticCOLORS;
    description?: string;
    /** @see https://docs.cloudify.co/developer/writing_widgets/widget-definition/#fetchurl */
    fetchUrl?: string | Record<string, string>;
    /** @see https://docs.cloudify.co/developer/writing_widgets/widget-definition/#fetchparams-widget-toolbox */
    fetchParams?: (widget: Widget<Configuration>, toolbox: Toolbox) => Params;
    hasReadme: boolean;
    hasStyle: boolean;
    hasTemplate: boolean;
    helpUrl?: string;
    /** @see https://docs.cloudify.co/developer/writing_widgets/widget-definition/#initialconfiguration */
    initialConfiguration: WidgetConfigurationDefinition[];
    initialHeight: number;
    initialWidth: number;
    permission: ObjectKeys<typeof GenericConfig['CUSTOM_WIDGET_PERMISSIONS']> | string;
    showBorder: boolean;
    showHeader: boolean;
    supportedEditions: string[];

    readme?: string;

    init?: () => void;
    /** @see https://docs.cloudify.co/developer/writing_widgets/widget-definition/#fetchdata-widget-toolbox-params */
    fetchData?: (widget: Widget<Configuration>, toolbox: Toolbox, params: Params) => Promise<Data>;
}

/**
 * The empty object is the default value
 */
export type WidgetData<D> = D | Record<string, never> | undefined;

export function isEmptyWidgetData(data: unknown): data is Record<string, never> | undefined {
    return (
        data === undefined ||
        (typeof data === 'object' && data !== null && !Array.isArray(data) && Object.keys(data).length === 0)
    );
}

type RenderCallback<Data, Output, Configuration> = (
    widget: Widget<Configuration>,
    data: WidgetData<Data>,
    error: any,
    toolbox: Toolbox
) => Output;

interface ReactWidgetDefinitionPart<Data, Configuration> {
    isReact?: true;
    render: RenderCallback<Data, ReactNode, Configuration>;
}

interface HTMLWidgetDefinitionPart<Data, Configuration> {
    isReact: false;
    render: RenderCallback<Data, string, Configuration>;

    /** @see https://docs.cloudify.co/developer/writing_widgets/widget-definition/#postrender-container-widget-data-toolbox */
    postRender?: (container: any, widget: Widget<Configuration>, data: WidgetData<Data>, toolbox: Toolbox) => void;
}

interface CommonOrPropTypeDefinition {
    name: string;
    common: any;
}

type WidgetDefinitionForDefining<Params, Data, Configuration> = WithOptionalProperties<
    Omit<WidgetDefinition<Params, Data, Configuration>, 'readme'>,
    | 'color'
    | 'categories'
    | 'hasReadme'
    | 'hasStyle'
    | 'hasTemplate'
    | 'initialConfiguration'
    | 'initialHeight'
    | 'initialWidth'
    | 'permission'
    | 'showBorder'
    | 'showHeader'
    | 'supportedEditions'
>;

export interface StageAPI {
    Basic: typeof BasicComponents;
    defineWidget: <Params, Data, Configuration>(
        widgetDefinition: WidgetDefinitionForDefining<Params, Data, Configuration>
    ) => void;
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
