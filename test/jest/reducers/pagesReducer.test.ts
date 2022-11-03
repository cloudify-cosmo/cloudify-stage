import type { AnyAction, Reducer, ReducersMapObject } from 'redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import type { ReduxState } from 'reducers';
import { parse } from 'query-string';
import type { ThunkDispatch } from 'redux-thunk';
import type { CallHistoryMethodAction } from 'connected-react-router';

import { ActionType } from 'actions/types';
import type { AddDrilldownPageAction } from 'actions/drilldownPage';
import { drillDownToPage } from 'actions/drilldownPage';
import type { PageDefinition, SimpleWidgetObj } from 'actions/page';
import { changePageDescription } from 'actions/page';
import type { CreateDrilldownPageAction } from 'actions/pageMenu';
import { changePageMenuItemName, removePageWithChildren } from 'actions/pageMenu';
import drilldownContextReducer from 'reducers/drilldownContextReducer';
import pageReducer from 'reducers/pageReducer';
import type { TemplatePageDefinition } from 'reducers/templatesReducer';
import type { Widget } from 'utils/StageAPI';
import GenericConfig from 'utils/GenericConfig';
import type { AddWidgetAction, MinimizeTabWidgetsAction } from 'actions/widgets';
import type { SetDrilldownContextAction } from 'actions/drilldownContext';
import type { ClearWidgetDataAction } from 'actions/widgetData';
import type { EnhancedWidgetDefinition } from 'actions/widgetDefinitions';
import type { ReduxStore } from 'configureStore';

const mockStore = configureMockStore<Partial<ReduxState>, ThunkDispatch<ReduxState, never, AnyAction>>([thunk]);

jest.mock('utils/widgetDefinitionsLoader', () => ({
    loadWidget: () => ({ id: 'widget1' })
}));

function createTestStore(
    reducers: ReducersMapObject,
    initialState: Partial<ReduxState>
): ReduxStore<Partial<ReduxState>> {
    return createStore(combineReducers(reducers), initialState, applyMiddleware(thunk));
}

function createPageObject(pageDefinition: Partial<PageDefinition>): PageDefinition {
    return {
        id: '',
        type: 'page',
        name: '',
        description: '',
        isDrillDown: false,
        layout: [],
        ...pageDefinition
    };
}
function createWidgetObject(widget?: Partial<SimpleWidgetObj>): SimpleWidgetObj {
    return {
        id: '1',
        name: 'some widget',
        definition: 'widget1',
        height: 1,
        width: 1,
        x: 1,
        y: 1,
        configuration: {},
        drillDownPages: {},
        maximized: false,
        ...widget
    };
}

function createWidgetDefinitionObject(): EnhancedWidgetDefinition {
    return {
        id: 'widget1',
        name: 'widget',
        color: 'blue',
        categories: [],
        hasReadme: false,
        hasStyle: false,
        hasTemplate: false,
        initialHeight: 10,
        initialWidth: 10,
        permission: '',
        showBorder: false,
        showHeader: false,
        supportedEditions: ['premium'],
        loaded: true,
        initialConfiguration: [GenericConfig.PAGE_SIZE_CONFIG(5)],
        isReact: true,
        render: () => null,
        isCustom: true
    };
}

function getWidgetForDrilldown(simpleWidgetObj: SimpleWidgetObj): Widget<unknown> {
    return {
        ...simpleWidgetObj,
        definition: createWidgetDefinitionObject()
    };
}

describe('(Reducer) Pages', () => {
    describe('Drilldown to page actions', () => {
        it('create a drilldown page if it doesnt exist', async () => {
            const initialState: Partial<ReduxState> = {
                widgetDefinitions: [createWidgetDefinitionObject()],
                drilldownContext: []
            };

            const store = mockStore(initialState);
            const widget = createWidgetObject();

            const expectedActions: [
                CreateDrilldownPageAction,
                AddWidgetAction,
                AddDrilldownPageAction,
                SetDrilldownContextAction,
                ClearWidgetDataAction,
                MinimizeTabWidgetsAction,
                CallHistoryMethodAction
            ] = [
                {
                    type: ActionType.CREATE_DRILLDOWN_PAGE,
                    payload: {
                        page: {
                            name: 'tmp1',
                            icon: 'circle',
                            layout: [
                                {
                                    type: 'widgets',
                                    content: [widget]
                                }
                            ]
                        },
                        newPageId: 'tmp_1'
                    }
                },
                {
                    type: ActionType.ADD_WIDGET,
                    payload: {
                        layoutSectionIndex: 0,
                        tabIndex: null,
                        pageId: 'tmp_1',
                        widgetDefinition: initialState.widgetDefinitions![0],
                        widget
                    }
                },
                {
                    type: ActionType.ADD_DRILLDOWN_PAGE,
                    payload: {
                        widgetId: '1',
                        drillDownName: 'tmp1',
                        drillDownPageId: 'tmp_1'
                    }
                },
                { type: ActionType.SET_DRILLDOWN_CONTEXT, payload: [{ context: undefined }] },
                { type: ActionType.WIDGET_DATA_CLEAR },
                { type: ActionType.MINIMIZE_TAB_WIDGETS },
                { type: '@@router/CALL_HISTORY_METHOD', payload: { method: '' } }
            ];

            const pageDef: TemplatePageDefinition = {
                name: 'tmp1',
                icon: 'circle',
                layout: [
                    {
                        type: 'widgets',
                        content: [widget]
                    }
                ]
            };

            await store.dispatch(drillDownToPage(getWidgetForDrilldown(widget), pageDef, {}, ''));

            const storeActions = store.getActions();

            expect(storeActions).toHaveLength(expectedActions.length);
            storeActions.pop(); // remove last cause we want to ignore it

            storeActions.forEach((action, index) => {
                const expectedAction = expectedActions[index];
                expect(action).toEqual(expectedAction);
            });
        });

        it('move to an existing drilldown', () => {
            const parentPage: PageDefinition = {
                id: '0',
                children: ['1'],
                name: 'page',
                isDrillDown: false,
                type: 'page',
                layout: [
                    {
                        type: 'widgets',
                        content: [createWidgetObject({ drillDownPages: { tmp1: '1' } })]
                    }
                ]
            };

            const drilldownPage: PageDefinition = {
                id: '1',
                parent: '0',
                name: 'tmp1',
                isDrillDown: true,
                type: 'page',
                layout: [
                    {
                        type: 'widgets',
                        content: [createWidgetObject({ id: '2', name: 'some widget' })]
                    }
                ]
            };

            const initialState: Partial<ReduxState> = {
                templates: {
                    templatesDef: {},
                    pagesDef: {},
                    pageGroupsDef: {}
                },
                context: {},
                drilldownContext: [],
                widgetDefinitions: [createWidgetDefinitionObject()],
                pages: [parentPage, drilldownPage]
            };

            const store = mockStore(initialState);

            const expectedActions = [
                { type: ActionType.WIDGET_DATA_CLEAR },
                { type: ActionType.SET_DRILLDOWN_CONTEXT, payload: [{ context: undefined }] },
                { type: ActionType.MINIMIZE_TAB_WIDGETS },
                { type: 'router action' }
            ];

            const widget = getWidgetForDrilldown(parentPage.layout[0].content[0] as SimpleWidgetObj);

            store.dispatch(drillDownToPage(widget, drilldownPage, {}, ''));

            const storeActions = store.getActions();

            expect(storeActions).toHaveLength(expectedActions.length);
        });

        it('Pass drilldown context', () => {
            const widget1 = createWidgetObject({
                id: '1',
                name: 'widget1',
                definition: 'widget1',
                drillDownPages: { tmp1: '1' }
            });
            const widget2 = createWidgetObject({
                id: '2',
                name: 'some widget',
                definition: 'widget1'
            });
            const parentPage: PageDefinition = {
                id: '0',
                children: ['1'],
                name: 'page',
                icon: 'circle',
                type: 'page',
                isDrillDown: false,
                layout: [
                    {
                        type: 'widgets',
                        content: [widget1]
                    }
                ]
            };
            const drilldownPage: PageDefinition = {
                id: '1',
                parent: '0',
                name: 'tmp1',
                icon: 'circle',
                type: 'page',
                isDrillDown: true,
                layout: [
                    {
                        type: 'widgets',
                        content: [widget2]
                    }
                ]
            };
            const initialState: Partial<ReduxState> = {
                templates: {
                    templatesDef: {},
                    pagesDef: {},
                    pageGroupsDef: {}
                },
                context: {},
                drilldownContext: [],
                widgetDefinitions: [createWidgetDefinitionObject()],
                pages: [parentPage, drilldownPage]
            };

            const store = mockStore(initialState);

            const widget = getWidgetForDrilldown(widget1);

            store.dispatch(
                drillDownToPage(
                    widget,
                    drilldownPage,
                    {
                        contextValue: 'kuku'
                    },
                    'boo'
                )
            );

            const storeActions = store.getActions();
            const routeAction = storeActions[3];

            expect(routeAction.payload.args).toHaveLength(1);
            const query = parse(routeAction.payload.args[0].search);
            expect(query.c).toBe('[{"context":{"contextValue":"kuku"},"pageName":"boo"}]');
        });
    });

    describe('Drilldown to page state', () => {
        async function setUp() {
            const widget = createWidgetObject();
            const page: PageDefinition = {
                id: '0',
                name: 'page',
                type: 'page',
                layout: [
                    {
                        type: 'widgets',
                        content: [widget]
                    }
                ],
                isDrillDown: false
            };
            const initialState: Partial<ReduxState> = {
                widgetDefinitions: [createWidgetDefinitionObject()],
                pages: [page],
                drilldownContext: []
            };

            const store = createTestStore(
                {
                    pages: pageReducer,
                    drilldownContext: drilldownContextReducer as Reducer,
                    widgetDefinitions: pageReducer
                },
                initialState
            );

            const pageDef: TemplatePageDefinition = {
                name: 'tmp1',
                icon: 'circle',
                layout: [
                    {
                        type: 'widgets',
                        content: [createWidgetObject()]
                    }
                ]
            };

            await store.dispatch(drillDownToPage(getWidgetForDrilldown(widget), pageDef, {}, 'drilldownPage'));

            const { pages } = store.getState();
            const parentPage = pages![0] as PageDefinition;
            const drillDownPage = pages![1] as PageDefinition;
            store.getState();

            return { pages, drillDownPage, parentPage };
        }

        it('Should have a drilldown page', async () => {
            const { pages, drillDownPage } = await setUp();
            expect(pages).toHaveLength(2);
            expect(drillDownPage.id).not.toBeUndefined();
            expect(drillDownPage.id).not.toBeNull();
        });

        it('Drilldown page should have the right page definition data', async () => {
            const { parentPage, drillDownPage } = await setUp();
            const expectedPage: PageDefinition = {
                id: drillDownPage.id,
                icon: 'circle',
                name: 'tmp1',
                type: 'page',
                isDrillDown: true,
                description: '',
                parent: parentPage.id,
                layout: [
                    {
                        type: 'widgets',
                        content: [
                            createWidgetObject({
                                id: (drillDownPage.layout[0].content[0] as SimpleWidgetObj).id,
                                configuration: { pageSize: 5 }
                            })
                        ]
                    }
                ]
            };

            expect(drillDownPage).toEqual(expectedPage);
        });

        it('Drilldown parent widget should have the expected drillDownPage', async () => {
            const { parentPage, drillDownPage } = await setUp();
            expect((parentPage.layout[0].content[0] as SimpleWidgetObj).drillDownPages.tmp1).toBe(drillDownPage.id);
        });

        it('Should link parent and child pages properly', async () => {
            const { parentPage, drillDownPage } = await setUp();
            expect(parentPage.children).toHaveLength(1);
            expect(parentPage.children![0]).toBe(drillDownPage.id);

            expect(drillDownPage.parent).toBe(parentPage.id);
        });
    });

    describe('Drilldown to 2 pages from the same widget', () => {
        async function setUp() {
            const widget = createWidgetObject();
            const initialState: Partial<ReduxState> = {
                pages: [
                    {
                        id: '0',
                        name: 'page',
                        icon: 'circle',
                        isDrillDown: false,
                        type: 'page',
                        layout: [
                            {
                                type: 'widgets',
                                content: [widget]
                            }
                        ]
                    }
                ],
                drilldownContext: []
            };

            const store = createTestStore(
                { pages: pageReducer, drilldownContext: drilldownContextReducer as Reducer },
                initialState
            );

            const pageDef1: TemplatePageDefinition = {
                name: 'tmp1',
                icon: 'circle',
                layout: [
                    {
                        type: 'widgets',
                        content: [widget]
                    }
                ]
            };
            const pageDef2: TemplatePageDefinition = {
                name: 'tmp2',
                icon: 'circle',
                layout: [
                    {
                        type: 'widgets',
                        content: [createWidgetObject({ name: 'some widget2' })]
                    }
                ]
            };
            const widgetForDrilldown = getWidgetForDrilldown(widget);
            await store.dispatch(drillDownToPage(widgetForDrilldown, pageDef1, {}, ''));
            await store.dispatch(drillDownToPage(widgetForDrilldown, pageDef2, {}, ''));

            const pages = store.getState().pages!;
            const parentPage = pages[0] as PageDefinition;
            const drillDownPage1 = pages[1] as PageDefinition;
            const drillDownPage2 = pages[2] as PageDefinition;
            return { parentPage, drillDownPage1, drillDownPage2 };
        }

        it('The 2 pages should exist in the drilldown pages list', async () => {
            const { parentPage } = await setUp();
            const widgetDrilldownPages = (parentPage.layout[0].content[0] as SimpleWidgetObj).drillDownPages;
            expect(widgetDrilldownPages.tmp1).not.toBeUndefined();
            expect(widgetDrilldownPages.tmp1).not.toBeNull();
            expect(widgetDrilldownPages.tmp2).not.toBeUndefined();
            expect(widgetDrilldownPages.tmp2).not.toBeNull();
        });

        it('Drilldown pages should have the right IDs', async () => {
            const { parentPage, drillDownPage1, drillDownPage2 } = await setUp();
            const widgetDrilldownPages = (parentPage.layout[0].content[0] as SimpleWidgetObj).drillDownPages;
            expect(widgetDrilldownPages.tmp1).toBe(drillDownPage1.id);
            expect(widgetDrilldownPages.tmp2).toBe(drillDownPage2.id);
        });
    });

    describe('Page removal', () => {
        const dashboardPage = createPageObject({
            id: 'dashboard',
            name: 'Dashboard'
        });
        const localBlueprintsPage = createPageObject({
            id: 'local_blueprints',
            name: 'Local Blueprints',
            children: ['local_blueprints_blueprint']
        });
        const deploymentsPage = createPageObject({
            id: 'deployments',
            name: 'Deployments',
            children: ['deployments_deployment']
        });
        const deploymentDrillDownPage = createPageObject({
            isDrillDown: true,
            id: 'deployments_deployment',
            name: 'Deployment',
            parent: 'deployments'
        });
        const blueprintDrillDownPage = createPageObject({
            isDrillDown: true,
            id: 'local_blueprints_blueprint',
            name: 'Blueprint',
            parent: 'local_blueprints',
            children: ['local_blueprints_blueprint_hello_world_deployment']
        });
        const deploymentDrillDownPageFromBlueprintDrillDownPage = createPageObject({
            isDrillDown: true,
            id: 'local_blueprints_blueprint_hello_world_deployment',
            name: 'Deployment',
            parent: 'local_blueprints_blueprint'
        });

        const initialState: Partial<ReduxState> = {
            pages: [
                dashboardPage,
                localBlueprintsPage,
                deploymentsPage,
                deploymentDrillDownPage,
                blueprintDrillDownPage,
                deploymentDrillDownPageFromBlueprintDrillDownPage
            ]
        };

        it('Single page should not exist when page without children is being removed', () => {
            const store = createTestStore({ pages: pageReducer }, initialState);

            store.dispatch(removePageWithChildren(dashboardPage));

            const { pages } = store.getState();
            expect(pages).toEqual([
                localBlueprintsPage,
                deploymentsPage,
                deploymentDrillDownPage,
                blueprintDrillDownPage,
                deploymentDrillDownPageFromBlueprintDrillDownPage
            ]);
        });

        it('All pages in page hierarchy should not exist when page with children is being removed', () => {
            const store = createTestStore({ pages: pageReducer }, initialState);

            store.dispatch(removePageWithChildren(localBlueprintsPage));

            const { pages } = store.getState();
            expect(pages).toEqual([dashboardPage, deploymentsPage, deploymentDrillDownPage]);
        });
    });

    describe('Page update', () => {
        const dashboardPage = createPageObject({
            id: 'dashboard',
            name: 'Dashboard',
            description: 'DevOps control panel'
        });
        const initialState: Partial<ReduxState> = {
            pages: [dashboardPage]
        };

        it('Changing page name should affect only name property and not id', () => {
            const store = createTestStore({ pages: pageReducer }, initialState);

            store.dispatch(changePageMenuItemName(dashboardPage.id, 'Control Panel'));

            const pages = store.getState().pages!;
            expect(pages[0]).toEqual({ ...dashboardPage, name: 'Control Panel' });
        });

        it('Changing page description should affect only description property', () => {
            const store = createTestStore({ pages: pageReducer }, initialState);

            store.dispatch(changePageDescription(dashboardPage.id, 'Widgets for controlling the world'));

            const pages = store.getState().pages!;
            expect(pages[0]).toEqual({ ...dashboardPage, description: 'Widgets for controlling the world' });
        });
    });
});
