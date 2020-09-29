/**
 * Created by kinneretzin on 11/12/2016.
 */
import { parse } from 'query-string';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { applyMiddleware, combineReducers, createStore } from 'redux';

import pageReducer from 'reducers/pageReducer';

import { drillDownToPage } from 'actions/drilldownPage';
import { changePageName, changePageDescription, removePage } from 'actions/page';

import * as types from 'actions/types';

const mockStore = configureMockStore([thunk]);

describe('(Reducer) Pages', () => {
    describe('Drilldown to page actions', () => {
        it('create a drilldown page if it doesnt exist', () => {
            const initialState = {
                templates: {
                    templatesDef: {
                        tmp1: {
                            name: 'tmp1',
                            widgets: [{ name: 'some widget', definition: 'widget1', width: 1, height: 1, x: 1, y: 1 }]
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
                        name: 'page',
                        widgets: [{ id: '1', name: 'widget1', definition: 'widget1', drillDownPages: {} }]
                    }
                ]
            };
            const store = mockStore(initialState);

            const expectedActions = [
                {
                    type: types.CREATE_DRILLDOWN_PAGE,
                    newPageId: '0',
                    page: {
                        name: 'tmp1',
                        widgets: [
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
                },
                {
                    type: types.ADD_WIDGET,
                    pageId: '0',
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
                { type: types.ADD_DRILLDOWN_PAGE, widgetId: '1', drillDownPageId: '0', drillDownName: 'tmp1' },
                { type: types.WIDGET_DATA_CLEAR },
                { type: 'router action' }
            ];

            const widget = initialState.pages[0].widgets[0];
            const defaultTemplate = initialState.templates.templatesDef.tmp1;

            store.dispatch(drillDownToPage(widget, defaultTemplate));

            const storeActions = store.getActions();

            expect(storeActions).toHaveLength(expectedActions.length);
            storeActions.pop(); // remove last cause we want to ignore it

            _.each(storeActions, (action, index) => {
                const expectedAction = expectedActions[index];
                const actualAction = action;
                delete expectedAction.newPageId;
                delete expectedAction.pageId;
                delete expectedAction.drillDownPageId;
                delete actualAction.newPageId;
                delete actualAction.pageId;
                delete actualAction.drillDownPageId;

                expect(action).toEqual(expectedAction);
            });
        });

        it('move to an existing drilldown ', () => {
            const initialState = {
                templates: {
                    templatesDef: {
                        tmp1: {
                            name: 'tmp1',
                            widgets: [{ name: 'some widget', definition: 'widget1', width: 1, height: 1, x: 1, y: 1 }]
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
                        widgets: [{ id: '1', name: 'widget1', definition: 'widget1', drillDownPages: { tmp1: '1' } }]
                    },
                    {
                        id: '1',
                        parent: '0',
                        name: 'tmp1',
                        isDrillDown: true,
                        widgets: [
                            { id: '2', name: 'some widget', definition: 'widget1', width: 1, height: 1, x: 1, y: 1 }
                        ]
                    }
                ]
            };

            const store = mockStore(initialState);

            const expectedActions = [{ type: types.WIDGET_DATA_CLEAR }, { type: 'router action' }];

            const widget = initialState.pages[0].widgets[0];
            const defaultTemplate = initialState.templates.templatesDef.tmp1;

            store.dispatch(drillDownToPage(widget, defaultTemplate));

            const storeActions = store.getActions();

            expect(storeActions).toHaveLength(expectedActions.length);
        });

        it('Pass drilldown context', () => {
            const initialState = {
                templates: {
                    templatesDef: {
                        tmp1: {
                            name: 'tmp1',
                            widgets: [{ name: 'some widget', definition: 'widget1', width: 1, height: 1, x: 1, y: 1 }]
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
                        widgets: [{ id: '1', name: 'widget1', definition: 'widget1', drillDownPages: { tmp1: '1' } }]
                    },
                    {
                        id: '1',
                        parent: '0',
                        name: 'tmp1',
                        isDrillDown: true,
                        widgets: [
                            { id: '2', name: 'some widget', definition: 'widget1', width: 1, height: 1, x: 1, y: 1 }
                        ]
                    }
                ]
            };

            const store = mockStore(initialState);

            const widget = initialState.pages[0].widgets[0];
            const defaultTemplate = initialState.templates.templatesDef.tmp1;

            store.dispatch(drillDownToPage(widget, defaultTemplate, { contextValue: 'kuku' }));

            const storeActions = store.getActions();
            const routeAction = storeActions[1];

            expect(routeAction.payload.args).toHaveLength(1);
            const query = parse(routeAction.payload.args[0].search);
            expect(query.c).toBe('[{"context":{"contextValue":"kuku"}}]');
        });
    });

    describe('Drilldown to page state', () => {
        const initialState = {
            widgetDefinitions: [{ id: 'widget1' }],
            pages: [
                {
                    id: '0',
                    name: 'page',
                    widgets: [{ id: '1', name: 'widget1', definition: 'widget1', drillDownPages: {} }]
                }
            ]
        };

        const store = createStore(
            combineReducers({ pages: pageReducer, widgetDefinitions: pageReducer }),
            initialState,
            applyMiddleware(thunk)
        );

        const widget = initialState.pages[0].widgets[0];
        const defaultTemplate = {
            name: 'tmp1',
            widgets: [{ name: 'some widget', definition: 'widget1', width: 1, height: 1, x: 1, y: 1 }]
        };

        store.dispatch(drillDownToPage(widget, defaultTemplate));

        const { pages } = store.getState();
        const parentPage = pages[0];
        const drillDownPage = pages[1];
        store.getState();

        it('Should have a drilldown page', () => {
            expect(pages).toHaveLength(2);
            expect(drillDownPage.id).not.toBeUndefined();
            expect(drillDownPage.id).not.toBeNull();
        });

        it('Drilldown page should have the right template data', () => {
            const pageAccordingToTemplate = {
                name: 'tmp1',
                isDrillDown: true,
                description: '',
                widgets: [
                    {
                        name: 'some widget',
                        definition: 'widget1',
                        width: 1,
                        height: 1,
                        x: 1,
                        y: 1,
                        configuration: {},
                        drillDownPages: {}
                    }
                ],
                tabs: []
            };
            // Set ids data so can compare (i dont want to delete values from the store inorder to compare)
            pageAccordingToTemplate.id = drillDownPage.id;
            pageAccordingToTemplate.parent = parentPage.id;
            pageAccordingToTemplate.widgets[0].id = drillDownPage.widgets[0].id;

            expect(drillDownPage).toEqual(pageAccordingToTemplate);
        });

        it('Drilldown parent widget should have the expected drillDownPage', () => {
            expect(parentPage.widgets[0].drillDownPages.tmp1).toBe(drillDownPage.id);
        });

        it('Should link parent and child pages properly', () => {
            expect(parentPage.children).toHaveLength(1);
            expect(parentPage.children[0]).toBe(drillDownPage.id);

            expect(drillDownPage.parent).toBe(parentPage.id);
        });
    });

    describe('Drilldown to 2 pages from the same widget', () => {
        const initialState = {
            pages: [
                {
                    id: '0',
                    name: 'page',
                    widgets: [{ id: '1', name: 'widget1', definition: 'widget1', drillDownPages: {} }]
                }
            ]
        };

        const store = createStore(combineReducers({ pages: pageReducer }), initialState, applyMiddleware(thunk));

        const widget = initialState.pages[0].widgets[0];
        const defaultTemplate1 = {
            name: 'tmp1',
            widgets: [{ name: 'some widget', definition: 'widget1', width: 1, height: 1, x: 1, y: 1 }]
        };
        const defaultTemplate2 = {
            name: 'tmp2',
            widgets: [{ name: 'some widget2', definition: 'widget1', width: 1, height: 1, x: 1, y: 1 }]
        };
        store.dispatch(drillDownToPage(widget, defaultTemplate1));
        store.dispatch(drillDownToPage(widget, defaultTemplate2));

        const { pages } = store.getState();
        const parentPage = pages[0];
        const drillDownPage1 = pages[1];
        const drillDownPage2 = pages[2];

        it('The 2 pages should exist in the drilldown pages list', () => {
            expect(parentPage.widgets[0].drillDownPages.tmp1).not.toBeUndefined();
            expect(parentPage.widgets[0].drillDownPages.tmp1).not.toBeNull();
            expect(parentPage.widgets[0].drillDownPages.tmp2).not.toBeUndefined();
            expect(parentPage.widgets[0].drillDownPages.tmp2).not.toBeNull();
        });

        it('Drilldown pages should have the right IDs', () => {
            expect(parentPage.widgets[0].drillDownPages.tmp1).toBe(drillDownPage1.id);
            expect(parentPage.widgets[0].drillDownPages.tmp2).toBe(drillDownPage2.id);
        });
    });

    describe('Page removal', () => {
        const initialState = {
            pages: [
                {
                    id: 'dashboard',
                    name: 'Dashboard',
                    description: '',
                    widgets: []
                },
                {
                    id: 'local_blueprints',
                    name: 'Local Blueprints',
                    description: '',
                    widgets: [],
                    children: ['local_blueprints_blueprint']
                },
                {
                    id: 'deployments',
                    name: 'Deployments',
                    description: '',
                    widgets: [],
                    children: ['deployments_deployment']
                },
                {
                    isDrillDown: true,
                    id: 'deployments_deployment',
                    name: 'Deployment',
                    description: '',
                    widgets: [],
                    parent: 'deployments'
                },
                {
                    isDrillDown: true,
                    id: 'local_blueprints_blueprint',
                    name: 'Blueprint',
                    description: '',
                    widgets: [],
                    parent: 'local_blueprints',
                    children: ['local_blueprints_blueprint_hello_world_deployment']
                },
                {
                    isDrillDown: true,
                    id: 'local_blueprints_blueprint_hello_world_deployment',
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

            store.dispatch(removePage(dashboardPage));

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

            store.dispatch(removePage(localBlueprintsPage));

            const { pages } = store.getState();
            expect(pages).toEqual([dashboardPage, deploymentsPage, deploymentDrillDownPage]);
        });
    });

    describe('Page update', () => {
        const initialState = {
            pages: [
                {
                    id: 'dashboard',
                    name: 'Dashboard',
                    description: 'DevOps control panel',
                    widgets: []
                }
            ]
        };
        const dashboardPage = initialState.pages[0];

        it('Changing page name should affect only name property and not id', () => {
            const store = createStore(combineReducers({ pages: pageReducer }), initialState, applyMiddleware(thunk));

            store.dispatch(changePageName(dashboardPage, 'Control Panel'));

            const { pages } = store.getState();
            expect(pages[0]).toEqual({
                id: 'dashboard',
                name: 'Control Panel',
                description: 'DevOps control panel',
                widgets: []
            });
        });

        it('Changing page description should affect only description property', () => {
            const store = createStore(combineReducers({ pages: pageReducer }), initialState, applyMiddleware(thunk));

            store.dispatch(changePageDescription(dashboardPage.id, 'Widgets for controlling the world'));

            const { pages } = store.getState();
            expect(pages[0]).toEqual({
                id: 'dashboard',
                name: 'Dashboard',
                description: 'Widgets for controlling the world',
                widgets: []
            });
        });
    });
});
