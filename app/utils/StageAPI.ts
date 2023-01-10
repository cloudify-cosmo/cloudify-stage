import type { DrilldownHandler } from 'cloudify-ui-components/toolbox';
import type { GenericFieldType } from 'cloudify-ui-components';
import type { JSXElementConstructor, ReactElement, ReactNode, SyntheticEvent } from 'react';
// NOTE: the file contains only types and is undetectable for ESLint
// eslint-disable-next-line import/no-unresolved
import type { SemanticCOLORS } from 'semantic-ui-react';
import type { WidgetDefinition } from 'backend/handler/templates/types';
import type { PaginatedResponse as CloudifyPaginatedResponse } from 'backend/types';
import type * as BasicComponents from '../components/basic';
import type * as SharedComponents from '../components/shared';
import type WidgetContext from './Context';
import type EventBus from './EventBus';
import type External from './External';
import type GenericConfigType from './GenericConfig';
import type * as StageHooks from './hooks';
import type Internal from './Internal';
import type Manager from './Manager';
import type * as StagePropTypes from './props';
import type StageUtils from './stageUtils';
// NOTE: make sure the types are registered globally
import './types';
import type { ManagerData } from '../reducers/managerReducer';
import type StageCommon from '../widgets/common';
import type { ObjectKeys } from './types';

type StagePropTypes = typeof StagePropTypes;
type StageHooks = typeof StageHooks;

/** Toolbox without widget-related methods. Can be created before widgets are rendered */
interface StageWidgetlessToolbox {
    drillDown(
        widget: StageWidget<unknown>,
        defaultTemplate: string,
        drilldownContext: Record<string, any>,
        drilldownPageName?: any
    ): void;
    getDrilldownHandler(): DrilldownHandler;
    getContext(): WidgetContext;
    getEventBus(): typeof EventBus;
    getExternal(basicAuth: unknown): External;
    getInternal(): Internal;
    getManager(): Manager;
    getManagerState(): ManagerData;
    getNewManager(ip: unknown): any;
    goToHomePage(): void;
    goToPage(pageName: string, context: any): void;
    goToParentPage(): void;
}

/** @see https://docs.cloudify.co/developer/writing_widgets/widget-apis/#toolbox-object */
interface StageToolbox extends StageWidgetlessToolbox {
    getWidget(): StageWidget;
    getWidgetBackend(): any;
    loading(isLoading: boolean): void;
    refresh(params?: any): void;
}
export type { StageToolbox as Toolbox, StageWidgetlessToolbox as WidgetlessToolbox };

interface StageWidget<Configuration = Record<string, unknown>>
    extends Omit<WidgetDefinition, 'configuration' | 'definition'> {
    id: string;
    configuration: Configuration;
    // TODO(RD-1649): consider renaming the field to resolvedDefinition
    definition: StageWidgetDefinition;
    /**
     * A mapping between the names (keys) and the IDs (values) of the pages
     * that are possible to drill-down to from the widget.
     *
     * Added automatically when calling `toolbox.drillDown`
     *
     * @see {StageToolbox}
     */
    drillDownPages: Record<string, string>;
    maximized: boolean;
}
// TODO(RD-1645): rename Widget to ResolvedWidget
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

interface StageCustomConfigurationComponentProps<T> {
    name: string;
    idPrefix?: string;
    index?: number;
    value: T;
    onChange: (
        event: SyntheticEvent<HTMLElement, Event> | undefined,
        field: {
            name?: string;
            value: T;
            checked?: boolean;
        }
    ) => void;
    widgetlessToolbox: StageWidgetlessToolbox;
}
export type { StageCustomConfigurationComponentProps as CustomConfigurationComponentProps };

// TODO(RD-2792): use a discriminated union for different types of configuration
interface StageWidgetConfigurationDefinition {
    id: string;
    name?: string;
    description?: ReactNode;
    type: GenericFieldType;
    default?: any;
    placeHolder?: string;
    hidden?: boolean;
    component?: JSXElementConstructor<StageCustomConfigurationComponentProps<any>>;
    /** Used for lists */
    items?: (string | { name: string; value: string })[];
    [key: string]: any;
}
export type { StageWidgetConfigurationDefinition as WidgetConfigurationDefinition };

export interface CommonWidgetDefinition<Params, Data, Configuration> {
    id: string;
    name: string;
    categories: ObjectKeys<typeof GenericConfigType['CATEGORY']>[];
    color?: SemanticCOLORS;
    description?: string;
    /** @see https://docs.cloudify.co/developer/writing_widgets/widget-definition/#fetchurl */
    fetchUrl?: string | Record<string, string>;
    mapGridParams?: (params: Stage.Types.GridParams) => Record<string, any>;
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
    loaded: boolean;

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
        (typeof data === 'object' &&
            data !== null &&
            !Array.isArray(data) &&
            Object.keys(data).length === 0 &&
            !(data instanceof Error))
    );
}

type RenderCallback<Data, Output, Configuration> = (
    widget: StageWidget<Configuration>,
    data: StageWidgetData<Data>,
    error: any,
    toolbox: StageToolbox
) => Output;

export interface ReactWidgetDefinitionPart<Data, Configuration> {
    isReact?: true;
    render: RenderCallback<Data, ReactNode, Configuration>;
}

export interface HTMLWidgetDefinitionPart<Data, Configuration> {
    isReact: false;
    render: RenderCallback<Data, string, Configuration>;

    /** @see https://docs.cloudify.co/developer/writing_widgets/widget-definition/#postrender-container-widget-data-toolbox */
    postRender?: (
        container: HTMLElement,
        widget: StageWidget<Configuration>,
        data: StageWidgetData<Data>,
        toolbox: StageToolbox
    ) => void;
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
    | 'loaded'
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
        const Common: typeof StageCommon;
        const PropTypes: typeof StagePropTypes;
        const Hooks: typeof StageHooks;

        /**
         * Well-known entries that can be stored in the widgets' context.
         * TODO: (RD-6559) narrow down any-s
         */
        interface ContextEntries {
            deploymentId: string | string[] | null;
            blueprintId: any;
            nodeId: any;
            executionId: any;
            nodeInstanceId: any;
            executionStatus: any;
            siteName: any;
        }

        const i18n: typeof import('i18next').default;
        const styled: typeof import('styled-components').default;

        /**
         * A namespace that exists for storing reusable TypeScript types
         */
        namespace Types {
            type Toolbox = StageToolbox;
            type WidgetlessToolbox = StageWidgetlessToolbox;
            // TODO(RD-1645): rename Widget to ResolvedWidget
            type Widget<Configuration = Record<string, unknown>> = StageWidget<Configuration>;
            type WidgetDefinition<
                Params = any,
                Data = any,
                Configuration = Record<string, unknown>
            > = StageWidgetDefinition<Params, Data, Configuration>;
            type WidgetConfigurationDefinition = StageWidgetConfigurationDefinition;
            type CustomConfigurationComponentProps<T> = StageCustomConfigurationComponentProps<T>;
            type WidgetData<D> = StageWidgetData<D>;
            type InitialWidgetDefinition<Params, Data, Configuration> = StageInitialWidgetDefinition<
                Params,
                Data,
                Configuration
            >;
            type PaginatedResponse<ResponseItem> = CloudifyPaginatedResponse<ResponseItem>;
            type ReduxState = import('../reducers').ReduxState;
        }
    }
}
