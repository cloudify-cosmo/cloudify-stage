// @ts-nocheck File not migrated fully to TS
import { drillDownToPage } from 'actions/drilldownPage';
import { changePageDescription } from 'actions/page';
import { changePageMenuItemName, removePageWithChildren } from 'actions/pageMenu';

import * as types from 'actions/types';
import { parse } from 'query-string';
import drilldownContextReducer from 'reducers/drilldownContextReducer';

import pageReducer from 'reducers/pageReducer';

import { applyMiddleware, combineReducers, createStore } from 'redux';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import type { ReduxState } from 'reducers';

const mockStore = configureMockStore([thunk]);

jest.mock('utils/widgetDefinitionsLoader', () => ({
    loadWidget: () => ({ id: 'widget1' })
}));

describe('(Reducer) Pages', () => {
    describe('Drilldown to page actions', () => {
        it('create a drilldown page if it doesnt exist', async () => {
            const initialState = { widgetDefinitions: [{ id: 'widget1' }], drilldownContext: [] };

            const store = mockStore(initialState);

            const expectedActions = [
                {
                    type: types.CREATE_DRILLDOWN_PAGE,
                    page: {
                        name: 'tmp1',
                        layout: [
                            {
                                type: 'widgets',
                                content: [
                                    {
                                        definition: 'widget1',
                                        height: 1,
                                        name: 'some widget',
                                        width: 1,
                                        x: 1,
                                        y: 1
                                    }
                                ]
                            }
                        ]
                    }
                },
                {
                    type: types.ADD_WIDGET,
                    layoutSection: 0,
                    tab: null,
                    widgetDefinition: initialState.widgetDefinitions[0],
                    widget: {
                        definition: 'widget1',
                        height: 1,
                        name: 'some widget',
                        width: 1,
                        x: 1,
                        y: 1
                    }
                },
                {
                    type: types.ADD_DRILLDOWN_PAGE,
                    widgetId: '1',
                    drillDownName: 'tmp1'
                },
                { type: types.SET_DRILLDOWN_CONTEXT, drilldownContext: [{ context: undefined }] },
                { type: types.WIDGET_DATA_CLEAR },
                { type: types.MINIMIZE_TAB_WIDGETS },
                { type: 'router action' }
            ];

            const widget = {
                id: '1',
                name: 'widget1',
                definition: 'widget1',
                drillDownPages: {}
            };
            const pageDef = {
                name: 'tmp1',
                layout: [
                    {
                        type: 'widgets',
                        content: [
                            {
                                name: 'some widget',
                                definition: 'widget1',
                                width: 1,
                                height: 1,
                                x: 1,
                                y: 1
                            }
                        ]
                    }
                ]
            };

            await store.dispatch(drillDownToPage(widget, pageDef, {}));

            const storeActions = store.getActions();

            expect(storeActions).toHaveLength(expectedActions.length);
            storeActions.pop(); // remove last cause we want to ignore it

            storeActions.forEach((action, index) => {
                const expectedAction = expectedActions[index];
                const actualAction = action;
                delete actualAction.newPageId;
                delete actualAction.pageId;
                delete actualAction.drillDownPageId;

                expect(action).toEqual(expectedAction);
            });
        });

        it('move to an existing drilldown', () => {
            const initialState = {
                templates: {
                    templatesDef: {
                        tmp1: {
                            name: 'tmp1',
                            widgets: [
                                {
                                    name: 'some widget',
                                    definition: 'widget1',
                                    width: 1,
                                    height: 1,
                                    x: 1,
                                    y: 1
                                }
                            ]
                        }
                    }
                },
                manager: {
                    ip: '1.1.1.1'
                },
                context: {},
                drilldownContext: [],
                widgetDefinitions: [{ id: 'widget1' }],
                pages: [
                    {
                        id: '0',
                        children: ['1'],
                        name: 'page',
                        widgets: [
                            {
                                id: '1',
                                name: 'widget1',
                                definition: 'widget1',
                                drillDownPages: { tmp1: '1' }
                            }
                        ]
                    },
                    {
                        id: '1',
                        parent: '0',
                        name: 'tmp1',
                        isDrillDown: true,
                        widgets: [
                            {
                                id: '2',
                                name: 'some widget',
                                definition: 'widget1',
                                width: 1,
                                height: 1,
                                x: 1,
                                y: 1
                            }
                        ]
                    }
                ]
            };

            const store = mockStore(initialState);

            const expectedActions = [
                { type: types.WIDGET_DATA_CLEAR },
                { type: types.SET_DRILLDOWN_CONTEXT, drilldownContext: [{ context: undefined }] },
                { type: types.MINIMIZE_TAB_WIDGETS },
                { type: 'router action' }
            ];

            const widget = initialState.pages[0].widgets[0];
            const defaultTemplate = initialState.templates.templatesDef.tmp1;

            store.dispatch(drillDownToPage(widget, defaultTemplate, {}));

            const storeActions = store.getActions();

            expect(storeActions).toHaveLength(expectedActions.length);
        });

        it('Pass drilldown context', () => {
            const initialState = {
                templates: {
                    templatesDef: {
                        tmp1: {
                            name: 'tmp1',
                            widgets: [
                                {
                                    name: 'some widget',
                                    definition: 'widget1',
                                    width: 1,
                                    height: 1,
                                    x: 1,
                                    y: 1
                                }
                            ]
                        }
                    }
                },
                manager: {
                    ip: '1.1.1.1'
                },
                context: {},
                drilldownContext: [],
                widgetDefinitions: [{ id: 'widget1' }],
                pages: [
                    {
                        id: '0',
                        children: ['1'],
                        name: 'page',
                        widgets: [
                            {
                                id: '1',
                                name: 'widget1',
                                definition: 'widget1',
                                drillDownPages: { tmp1: '1' }
                            }
                        ]
                    },
                    {
                        id: '1',
                        parent: '0',
                        name: 'tmp1',
                        isDrillDown: true,
                        widgets: [
                            {
                                id: '2',
                                name: 'some widget',
                                definition: 'widget1',
                                width: 1,
                                height: 1,
                                x: 1,
                                y: 1
                            }
                        ]
                    }
                ]
            };

            const store = mockStore(initialState);

            const widget = initialState.pages[0].widgets[0];
            const defaultTemplate = initialState.templates.templatesDef.tmp1;

            store.dispatch(
                drillDownToPage(widget, defaultTemplate, {
                    contextValue: 'kuku'
                })
            );

            const storeActions = store.getActions();
            const routeAction = storeActions[3];

            expect(routeAction.payload.args).toHaveLength(1);
            const query = parse(routeAction.payload.args[0].search);
            expect(query.c).toBe('[{"context":{"contextValue":"kuku"}}]');
        });
    });

    describe('Drilldown to page state', () => {
        async function setUp() {
            const initialState: Partial<ReduxState> = {
                widgetDefinitions: [{ id: 'widget1' }],
                pages: [
                    {
                        id: '0',
                        name: 'page',
                        type: 'page',
                        layout: [
                            {
                                type: 'widgets',
                                content: [
                                    {
                                        id: '1',
                                        name: 'widget1',
                                        definition: 'widget1',
                                        drillDownPages: {}
                                    }
                                ]
                            }
                        ]
                    }
                ],
                drilldownContext: []
            };

            const store = createStore(
                combineReducers({
                    pages: pageReducer,
                    drilldownContext: drilldownContextReducer,
                    widgetDefinitions: pageReducer
                }),
                initialState,
                applyMiddleware(thunk)
            );

            const widget = initialState.pages[0].layout[0].content[0];
            const pageDef = {
                name: 'tmp1',
                layout: [
                    {
                        type: 'widgets',
                        content: [
                            {
                                name: 'some widget',
                                definition: 'widget1',
                                width: 1,
                                height: 1,
                                x: 1,
                                y: 1
                            }
                        ]
                    }
                ]
            };

            await store.dispatch(drillDownToPage(widget, pageDef, {}));

            const { pages } = store.getState();
            const parentPage = pages[0];
            const drillDownPage = pages[1];
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
            const expectedPage = {
                name: 'tmp1',
                type: 'page',
                isDrillDown: true,
                description: '',
                layout: [
                    {
                        type: 'widgets',
                        content: [
                            {
                                name: 'some widget',
                                definition: 'widget1',
                                width: 1,
                                height: 1,
                                x: 1,
                                y: 1,
                                configuration: {},
                                drillDownPages: {},
                                maximized: false
                            }
                        ]
                    }
                ]
            };
            // Set ids data so can compare (i dont want to delete values from the store inorder to compare)
            expectedPage.id = drillDownPage.id;
            expectedPage.parent = parentPage.id;
            expectedPage.layout[0].content[0].id = drillDownPage.layout[0].content[0].id;

            expect(drillDownPage).toEqual(expectedPage);
        });

        it('Drilldown parent widget should have the expected drillDownPage', async () => {
            const { parentPage, drillDownPage } = await setUp();
            expect(parentPage.layout[0].content[0].drillDownPages.tmp1).toBe(drillDownPage.id);
        });

        it('Should link parent and child pages properly', async () => {
            const { parentPage, drillDownPage } = await setUp();
            expect(parentPage.children).toHaveLength(1);
            expect(parentPage.children[0]).toBe(drillDownPage.id);

            expect(drillDownPage.parent).toBe(parentPage.id);
        });
    });

    describe('Drilldown to 2 pages from the same widget', () => {
        async function setUp() {
            const initialState = {
                pages: [
                    {
                        id: '0',
                        name: 'page',
                        layout: [
                            {
                                type: 'widgets',
                                content: [
                                    {
                                        id: '1',
                                        name: 'widget1',
                                        definition: 'widget1',
                                        drillDownPages: {}
                                    }
                                ]
                            }
                        ]
                    }
                ],
                drilldownContext: []
            };

            const store = createStore(
                combineReducers({ pages: pageReducer, drilldownContext: drilldownContextReducer }),
                initialState,
                applyMiddleware(thunk)
            );

            const widget = initialState.pages[0].layout[0].content[0];
            const pageDef1 = {
                name: 'tmp1',
                layout: [
                    {
                        type: 'widgets',
                        content: [
                            {
                                name: 'some widget',
                                definition: 'widget1',
                                width: 1,
                                height: 1,
                                x: 1,
                                y: 1
                            }
                        ]
                    }
                ]
            };
            const pageDef2 = {
                name: 'tmp2',
                layout: [
                    {
                        type: 'widgets',
                        content: [
                            {
                                name: 'some widget2',
                                definition: 'widget1',
                                width: 1,
                                height: 1,
                                x: 1,
                                y: 1
                            }
                        ]
                    }
                ]
            };
            await store.dispatch(drillDownToPage(widget, pageDef1, {}));
            await store.dispatch(drillDownToPage(widget, pageDef2, {}));

            const { pages } = store.getState();
            const parentPage = pages[0];
            const drillDownPage1 = pages[1];
            const drillDownPage2 = pages[2];
            return { parentPage, drillDownPage1, drillDownPage2 };
        }

        it('The 2 pages should exist in the drilldown pages list', async () => {
            const { parentPage } = await setUp();
            expect(parentPage.layout[0].content[0].drillDownPages.tmp1).not.toBeUndefined();
            expect(parentPage.layout[0].content[0].drillDownPages.tmp1).not.toBeNull();
            expect(parentPage.layout[0].content[0].drillDownPages.tmp2).not.toBeUndefined();
            expect(parentPage.layout[0].content[0].drillDownPages.tmp2).not.toBeNull();
        });

        it('Drilldown pages should have the right IDs', async () => {
            const { parentPage, drillDownPage1, drillDownPage2 } = await setUp();
            expect(parentPage.layout[0].content[0].drillDownPages.tmp1).toBe(drillDownPage1.id);
            expect(parentPage.layout[0].content[0].drillDownPages.tmp2).toBe(drillDownPage2.id);
        });
    });

    describe('Page removal', () => {
        const initialState = {
            pages: [
                {
                    id: 'dashboard',
                    type: 'page',
                    name: 'Dashboard',
                    description: '',
                    widgets: []
                },
                {
                    id: 'local_blueprints',
                    type: 'page',
                    name: 'Local Blueprints',
                    description: '',
                    widgets: [],
                    children: ['local_blueprints_blueprint']
                },
                {
                    id: 'deployments',
                    type: 'page',
                    name: 'Deployments',
                    description: '',
                    widgets: [],
                    children: ['deployments_deployment']
                },
                {
                    isDrillDown: true,
                    id: 'deployments_deployment',
                    type: 'page',
                    name: 'Deployment',
                    description: '',
                    widgets: [],
                    parent: 'deployments'
                },
                {
                    isDrillDown: true,
                    id: 'local_blueprints_blueprint',
                    type: 'page',
                    name: 'Blueprint',
                    description: '',
                    widgets: [],
                    parent: 'local_blueprints',
                    children: ['local_blueprints_blueprint_hello_world_deployment']
                },
                {
                    isDrillDown: true,
                    id: 'local_blueprints_blueprint_hello_world_deployment',
                    type: 'page',
                    name: 'Deployment',
                    description: '',
                    widgets: [],
                    parent: 'local_blueprints_blueprint'
                }
            ]
        };
        const dashboardPage = initialState.pages[0];
        const localBlueprintsPage = initialState.pages[1];
        const deploymentsPage = initialState.pages[2];
        const deploymentDrillDownPage = initialState.pages[3];
        const blueprintDrillDownPage = initialState.pages[4];
        const deploymentDrillDownPageFromBlueprintDrillDownPage = initialState.pages[5];

        it('Single page should not exist when page without children is being removed', () => {
            const store = createStore(combineReducers({ pages: pageReducer }), initialState, applyMiddleware(thunk));

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
            const store = createStore(combineReducers({ pages: pageReducer }), initialState, applyMiddleware(thunk));

            store.dispatch(removePageWithChildren(localBlueprintsPage));

            const { pages } = store.getState();
            expect(pages).toEqual([dashboardPage, deploymentsPage, deploymentDrillDownPage]);
        });
    });

    describe('Page update', () => {
        const initialState = {
            pages: [
                {
                    id: 'dashboard',
                    type: 'page',
                    name: 'Dashboard',
                    description: 'DevOps control panel',
                    widgets: []
                }
            ]
        };
        const dashboardPage = initialState.pages[0];

        it('Changing page name should affect only name property and not id', () => {
            const store = createStore(combineReducers({ pages: pageReducer }), initialState, applyMiddleware(thunk));

            store.dispatch(changePageMenuItemName(dashboardPage.id, 'Control Panel'));

            const { pages } = store.getState();
            expect(pages[0]).toEqual({ ...dashboardPage, name: 'Control Panel' });
        });

        it('Changing page description should affect only description property', () => {
            const store = createStore(combineReducers({ pages: pageReducer }), initialState, applyMiddleware(thunk));

            store.dispatch(changePageDescription(dashboardPage.id, 'Widgets for controlling the world'));

            const { pages } = store.getState();
            expect(pages[0]).toEqual({ ...dashboardPage, description: 'Widgets for controlling the world' });
        });
    });
});
