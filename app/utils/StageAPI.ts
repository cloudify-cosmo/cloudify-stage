import type { ComponentType, ReactElement, ReactNode } from 'react';
// NOTE: the file contains only types and is undetectable for ESLint
// eslint-disable-next-line import/no-unresolved
import type { SemanticCOLORS } from 'semantic-ui-react/dist/commonjs/generic';

import type * as BasicComponents from '../components/basic';
import type * as SharedComponents from '../components/shared';
import type * as StagePropTypes from './props';
import type * as StageHooks from './hooks';
import type GenericConfigType from './GenericConfig';
import type StageUtils from './stageUtils';
import type WidgetContext from './Context';
import type EventBus from './EventBus';
import type Manager from './Manager';
import type Internal from './Internal';
import type External from './External';
// NOTE: make sure the types are registered globally
import './types';

type StagePropTypes = typeof StagePropTypes;
type StageHooks = typeof StageHooks;

/** @see https://docs.cloudify.co/developer/writing_widgets/widget-apis/#toolbox-object */
interface StageToolbox {
    drillDown(
        widget: StageWidget,
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
    getWidget(): StageWidget;
    getWidgetBackend(): any;
    goToHomePage(): void;
    goToPage(pageName: string, context: any): void;
    goToParentPage(): void;
    loading(isLoading: boolean): void;
    refresh(params?: any): void;
}
export type { StageToolbox as Toolbox };

interface StageWidget<Configuration = Record<string, unknown>> {
    id: string;
    name: string;
    height: number;
    width: number;
    x: number;
    y: number;
    configuration: Configuration;
    definition: StageWidgetDefinition;
    drillDownPages: Record<string, string>;
    maximized: boolean;
}
export type { StageWidget as Widget };

/**
 * @see https://docs.cloudify.co/developer/writing_widgets/widget-definition/
 */
type StageWidgetDefinition<Params = any, Data = any, Configuration = Record<string, unknown>> = CommonWidgetDefinition<
    Params,
    Data,
    Configuration
> &
    (ReactWidgetDefinitionPart<Data, Configuration> | HTMLWidgetDefinitionPart<Data, Configuration>);
export type { StageWidgetDefinition as WidgetDefinition };

type ObjectKeys<T extends Record<string, any>> = T[keyof T];

interface StageWidgetConfigurationDefinition {
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
export type { StageWidgetConfigurationDefinition as WidgetConfigurationDefinition };

interface CommonWidgetDefinition<Params, Data, Configuration> {
    id: string;
    name: string;
    categories: ObjectKeys<typeof GenericConfigType['CATEGORY']>[];
    color: SemanticCOLORS;
    description?: string;
    /** @see https://docs.cloudify.co/developer/writing_widgets/widget-definition/#fetchurl */
    fetchUrl?: string | Record<string, string>;
    /** @see https://docs.cloudify.co/developer/writing_widgets/widget-definition/#fetchparams-widget-toolbox */
    fetchParams?: (widget: StageWidget<Configuration>, toolbox: StageToolbox) => Params;
    hasReadme: boolean;
    hasStyle: boolean;
    hasTemplate: boolean;
    helpUrl?: string;
    /** @see https://docs.cloudify.co/developer/writing_widgets/widget-definition/#initialconfiguration */
    initialConfiguration: StageWidgetConfigurationDefinition[];
    initialHeight: number;
    initialWidth: number;
    permission: ObjectKeys<typeof GenericConfigType['CUSTOM_WIDGET_PERMISSIONS']> | string;
    showBorder: boolean;
    showHeader: boolean;
    supportedEditions: string[];

    readme?: string;
    template?: string;
    isCustom?: boolean;

    init?: () => void;
    /** @see https://docs.cloudify.co/developer/writing_widgets/widget-definition/#fetchdata-widget-toolbox-params */
    fetchData?: (widget: StageWidget<Configuration>, toolbox: StageToolbox, params: Params) => Promise<Data>;
}

/**
 * The empty object is the default value
 */
type StageWidgetData<D> = D | Record<string, never> | undefined;
export type { StageWidgetData as WidgetData };

export function isEmptyWidgetData(data: unknown): data is Record<string, never> | undefined {
    return (
        data === undefined ||
        (typeof data === 'object' && data !== null && !Array.isArray(data) && Object.keys(data).length === 0)
    );
}

type RenderCallback<Data, Output, Configuration> = (
    widget: StageWidget<Configuration>,
    data: StageWidgetData<Data>,
    error: any,
    toolbox: StageToolbox
) => Output;

interface ReactWidgetDefinitionPart<Data, Configuration> {
    isReact?: true;
    render: RenderCallback<Data, ReactNode, Configuration>;
}

interface HTMLWidgetDefinitionPart<Data, Configuration> {
    isReact: false;
    render: RenderCallback<Data, string, Configuration>;

    /** @see https://docs.cloudify.co/developer/writing_widgets/widget-definition/#postrender-container-widget-data-toolbox */
    postRender?: (
        container: any,
        widget: StageWidget<Configuration>,
        data: StageWidgetData<Data>,
        toolbox: StageToolbox
    ) => void;
}

interface CommonOrPropTypeDefinition<Obj, Name extends keyof Obj> {
    name: Name;
    common: Obj[Name];
}

/** User-facing WidgetDefinition used for defining new widgets */
type StageInitialWidgetDefinition<Params, Data, Configuration> = Stage.Types.WithOptionalProperties<
    /**
     * NOTE: cannot use `WidgetDefinition` directly because `isReact` stops being a discriminant property
     * which breaks type safety for `render`.
     *
     * Thus, the duplication of combining `Common`, `React`, and `HTMLWidgetDefinitionPart`s is necessary
     */
    Omit<CommonWidgetDefinition<Params, Data, Configuration>, 'readme' | 'template' | 'isCustom'>,
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
> &
    (ReactWidgetDefinitionPart<Data, Configuration> | HTMLWidgetDefinitionPart<Data, Configuration>);
export type { StageInitialWidgetDefinition as InitialWidgetDefinition };

declare global {
    namespace Stage {
        const Basic: typeof BasicComponents;
        const defineWidget: <Params, Data, Configuration>(
            widgetDefinition: StageInitialWidgetDefinition<Params, Data, Configuration>
        ) => void;
        const Shared: typeof SharedComponents;
        const ComponentToHtmlString: (element: ReactElement) => string;
        const GenericConfig: typeof GenericConfigType;
        const Utils: typeof StageUtils;

        // NOTE: Common items are defined in widgets
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface Common {}
        /** Common widget utilities */
        const Common: Common;
        const defineCommon: <Name extends keyof Common>(definition: CommonOrPropTypeDefinition<Common, Name>) => void;

        // NOTE: Additional PropTypes are defined in widgets
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface PropTypes extends StagePropTypes {}
        const PropTypes: PropTypes;
        const definePropType: <Name extends keyof PropTypes>(
            definition: CommonOrPropTypeDefinition<PropTypes, Name>
        ) => void;

        // NOTE: Additional hooks are defined in widgets
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface Hooks extends StageHooks {}
        /** Reusable utility hooks */
        const Hooks: Hooks;
        const defineHook: (definition: Partial<Hooks>) => void;

        const i18n: typeof import('i18next').default;

        /**
         * A namespace that exists for storing reusable TypeScript types
         */
        namespace Types {
            type Toolbox = StageToolbox;
            type Widget<Configuration = Record<string, unknown>> = StageWidget<Configuration>;
            type WidgetDefinition<
                Params = any,
                Data = any,
                Configuration = Record<string, unknown>
            > = StageWidgetDefinition<Params, Data, Configuration>;
            type WidgetConfigurationDefinition = StageWidgetConfigurationDefinition;
            type WidgetData<D> = StageWidgetData<D>;
            type InitialWidgetDefinition<Params, Data, Configuration> = StageInitialWidgetDefinition<
                Params,
                Data,
                Configuration
            >;
        }
    }
}
