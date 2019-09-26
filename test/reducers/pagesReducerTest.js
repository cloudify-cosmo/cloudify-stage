/**
 * Created by kinneretzin on 11/12/2016.
 */
import { expect } from 'chai';
import { parse } from 'query-string';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { applyMiddleware, combineReducers, createStore } from 'redux';

import pageReducer from '../../app/reducers/pageReducer';

import { drillDownToPage } from '../../app/actions/widgets';
import { changePageName, changePageDescription, removePage } from '../../app/actions/page';

import * as types from '../../app/actions/types';

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
                { type: types.CREATE_DRILLDOWN_PAGE, newPageId: '0', name: 'tmp1' },
                {
                    type: types.ADD_WIDGET,
                    pageId: '0',
                    name: 'some widget',
                    widgetDefinition: initialState.widgetDefinitions[0],
                    width: 1,
                    height: 1,
                    x: 1,
                    y: 1,
                    configuration: undefined
                },
                { type: types.ADD_DRILLDOWN_PAGE, widgetId: '1', drillDownPageId: '0', drillDownName: 'tmp1' },
                { type: types.WIDGET_DATA_CLEAR },
                { type: 'router action' }
            ];

            const widget = initialState.pages[0].widgets[0];
            const defaultTemplate = initialState.templates.templatesDef.tmp1;
            const { widgetDefinitions } = initialState;

            store.dispatch(drillDownToPage(widget, defaultTemplate, widgetDefinitions));

            const storeActions = store.getActions();

            expect(storeActions).to.have.length(expectedActions.length);
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

                expect(action).to.eql(expectedAction);
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
            const { widgetDefinitions } = initialState;

            store.dispatch(drillDownToPage(widget, defaultTemplate, widgetDefinitions));

            const storeActions = store.getActions();

            expect(storeActions).to.have.length(expectedActions.length);
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
            const { widgetDefinitions } = initialState;

            store.dispatch(drillDownToPage(widget, defaultTemplate, widgetDefinitions, { contextValue: 'kuku' }));

            const storeActions = store.getActions();
            const routeAction = storeActions[1];

            expect(routeAction.payload.args).to.have.length(1);
            const query = parse(routeAction.payload.args[0].search);
            expect(query.c).to.equal('[{"context":{"contextValue":"kuku"}}]');
        });
    });

    describe('Drilldown to page state', () => {
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

        const store = createStore(pageReducer, initialState.pages, applyMiddleware(thunk));

        const widget = initialState.pages[0].widgets[0];
        const defaultTemplate = initialState.templates.templatesDef.tmp1;
        const { widgetDefinitions } = initialState;

        store.dispatch(drillDownToPage(widget, defaultTemplate, widgetDefinitions));

        const state = store.getState();
        const parentPage = state[0];
        const drillDownPage = state[1];

        it('Should have a drilldown page', () => {
            expect(state).to.have.length(2);
            expect(drillDownPage.id).to.exist;
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
                ]
            };
            // Set ids data so can compare (i dont want to delete values from the store inorder to compare)
            pageAccordingToTemplate.id = drillDownPage.id;
            pageAccordingToTemplate.parent = parentPage.id;
            pageAccordingToTemplate.widgets[0].id = drillDownPage.widgets[0].id;

            expect(drillDownPage).to.eql(pageAccordingToTemplate);
        });

        it('Drilldown parent widget should have the expected drillDownPage', () => {
            expect(parentPage.widgets[0].drillDownPages.tmp1).to.equal(drillDownPage.id);
        });

        it('Should link parent and child pages properly', () => {
            expect(parentPage.children).to.have.length(1);
            expect(parentPage.children[0]).to.equal(drillDownPage.id);

            expect(drillDownPage.parent).to.equal(parentPage.id);
        });
    });

    describe('Drilldown to 2 pages from the same widget', () => {
        const initialState = {
            templates: {
                templatesDef: {
                    tmp1: {
                        name: 'tmp1',
                        widgets: [{ name: 'some widget', definition: 'widget1', width: 1, height: 1, x: 1, y: 1 }]
                    },
                    tmp2: {
                        name: 'tmp2',
                        widgets: [{ name: 'some widget2', definition: 'widget1', width: 1, height: 1, x: 1, y: 1 }]
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

        const store = createStore(pageReducer, initialState.pages, applyMiddleware(thunk));

        const widget = initialState.pages[0].widgets[0];
        const defaultTemplate1 = initialState.templates.templatesDef.tmp1;
        const defaultTemplate2 = initialState.templates.templatesDef.tmp2;
        const { widgetDefinitions } = initialState;

        store.dispatch(drillDownToPage(widget, defaultTemplate1, widgetDefinitions));
        store.dispatch(drillDownToPage(widget, defaultTemplate2, widgetDefinitions));

        const state = store.getState();
        const parentPage = state[0];
        const drillDownPage1 = state[1];
        const drillDownPage2 = state[2];

        it('The 2 pages should exist in the drilldown pages list', () => {
            expect(parentPage.widgets[0].drillDownPages.tmp1).to.exist;
            expect(parentPage.widgets[0].drillDownPages.tmp2).to.exist;
        });

        it('Drilldown pages should have the right IDs', () => {
            expect(parentPage.widgets[0].drillDownPages.tmp1).to.equal(drillDownPage1.id);
            expect(parentPage.widgets[0].drillDownPages.tmp2).to.equal(drillDownPage2.id);
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
            expect(pages).to.deep.equal([
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
            expect(pages).to.deep.equal([dashboardPage, deploymentsPage, deploymentDrillDownPage]);
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
            expect(pages[0]).to.deep.equal({
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
            expect(pages[0]).to.deep.equal({
                id: 'dashboard',
                name: 'Dashboard',
                description: 'Widgets for controlling the world',
                widgets: []
            });
        });
    });
});
