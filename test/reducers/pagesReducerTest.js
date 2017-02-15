/**
 * Created by kinneretzin on 03/01/2017.
 */

'use strict';

/**
 * Created by kinneretzin on 11/12/2016.
 */
import {expect} from 'chai';
import sinon from 'sinon';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { createStore,applyMiddleware } from 'redux'

import PagesReducer from '../../app/reducers/pageReducer';

import {drillDownToPage} from '../../app/actions/widgets';

import * as types from '../../app/actions/types.js';

const mockStore = configureMockStore([ thunk ]);

describe('(Reducer) Pages - drilldown process', () => {

    describe('Drilldown to page actions',()=>{

        it('create a drilldown page if it doesnt exist', () => {
            var initialState = {
                templates: {
                    'tmp1' : {
                        name: 'tmp1',
                        widgets: [{name: 'some widget',definition: 'widget1',width:1,height:1,x:1,y:1}]
                    }
                },
                manager : {
                    ip: '1.1.1.1'
                },
                conetxt: {},
                widgetDefinitions: [{id: 'widget1'}],
                pages: [
                    {id: '0',name:'page',widgets: [{id:'1',name:'widget1',definition:'widget1'}]}
                ]
            };
            const store = mockStore(initialState);

            const expectedActions = [
                {type: types.CREATE_DRILLDOWN_PAGE, newPageId: '0', name: 'tmp1'},
                {type: types.ADD_WIDGET, pageId: '0', name: 'some widget', widgetDefinition: initialState.widgetDefinitions[0],width:1,height:1,x:1,y:1,configuration:undefined},
                {type : types.SET_DRILLDOWN_PAGE,widgetId: '1',drillDownPageId: '0'},
                {type: 'router action'}
            ];

            var widget = initialState.pages[0].widgets[0];
            var defaultTemplate = initialState.templates.tmp1;
            var widgetDefinitions = initialState.widgetDefinitions;

            store.dispatch(drillDownToPage(widget,defaultTemplate,widgetDefinitions));

            var storeActions = store.getActions();

            expect(storeActions).to.have.length(expectedActions.length);
            storeActions.pop(); // remove last cause we want to ignore it

            _.each(storeActions,(action,index)=>{
                var expectedAction = expectedActions[index];
                delete expectedAction.newPageId;
                delete expectedAction.pageId;
                delete expectedAction.drillDownPageId;
                delete action.newPageId;
                delete action.pageId;
                delete action.drillDownPageId;

                expect(action).to.eql(expectedAction);
            });
        });

        it('move to an existing drilldown ', () => {
            var initialState = {
                templates: {
                    'tmp1' : {
                        name: 'tmp1',
                        widgets: [{name: 'some widget',definition: 'widget1',width:1,height:1,x:1,y:1}]
                    }
                },
                manager : {
                    ip: '1.1.1.1'
                },
                conetxt: {},
                widgetDefinitions: [{id: 'widget1'}],
                pages: [
                    {id: '0',children: ['1'], name:'page',widgets: [{id:'1',name:'widget1',definition:'widget1',drillDownPageId:'1'}]},
                    {id: '1',parent: '0', name:'tmp1',isDrillDown: true,widgets: [{id:'2',name:'some widget',definition:'widget1',width:1,height:1,x:1,y:1}]}
                ]
            };

            const store = mockStore(initialState);

            const expectedActions = [
                {type: 'router action'}
            ];

            var widget = initialState.pages[0].widgets[0];
            var defaultTemplate = initialState.templates.tmp1;
            var widgetDefinitions = initialState.widgetDefinitions;

            store.dispatch(drillDownToPage(widget,defaultTemplate,widgetDefinitions));

            var storeActions = store.getActions();

            expect(storeActions).to.have.length(expectedActions.length);
        });

        it('Pass drilldown context', () => {
            var initialState = {
                templates: {
                    'tmp1' : {
                        name: 'tmp1',
                        widgets: [{name: 'some widget',definition: 'widget1',width:1,height:1,x:1,y:1}]
                    }
                },
                manager : {
                    ip: '1.1.1.1'
                },
                conetxt: {},
                widgetDefinitions: [{id: 'widget1'}],
                pages: [
                    {id: '0',children: ['1'], name:'page',widgets: [{id:'1',name:'widget1',definition:'widget1',drillDownPageId:'1'}]},
                    {id: '1',parent: '0', name:'tmp1',isDrillDown: true,widgets: [{id:'2',name:'some widget',definition:'widget1',width:1,height:1,x:1,y:1}]}
                ]
            };

            const store = mockStore(initialState);

            var widget = initialState.pages[0].widgets[0];
            var defaultTemplate = initialState.templates.tmp1;
            var widgetDefinitions = initialState.widgetDefinitions;

            store.dispatch(drillDownToPage(widget,defaultTemplate,widgetDefinitions,{contextValue:'kuku'}));

            var storeActions = store.getActions();
            var routeAction = storeActions[0];

            expect(routeAction.payload.args).to.have.length(1);
            expect(routeAction.payload.args[0].query.contextValue).to.equal('kuku');

        });
    });

    describe('Drilldown to page state',()=>{

        var initialState = {
            templates: {
                'tmp1' : {
                    name: 'tmp1',
                    widgets: [{name: 'some widget',definition: 'widget1',width:1,height:1,x:1,y:1}]
                }
            },
            manager : {
                ip: '1.1.1.1'
            },
            conetxt: {},
            widgetDefinitions: [{id: 'widget1'}],
            pages: [
                {id: '0',name:'page',widgets: [{id:'1',name:'widget1',definition:'widget1'}]}
            ]
        };

        const store = createStore(PagesReducer,initialState.pages,applyMiddleware(thunk));

        var widget = initialState.pages[0].widgets[0];
        var defaultTemplate = initialState.templates.tmp1;
        var widgetDefinitions = initialState.widgetDefinitions;

        store.dispatch(drillDownToPage(widget,defaultTemplate,widgetDefinitions));

        var state = store.getState();
        var parentPage = state[0];
        var drillDownPage = state[1];

        it('Should have a drilldown page',()=>{
           expect(state).to.have.length(2);
           expect(drillDownPage.id).to.exist;
        });

        it('Drilldown page should have the right template data',()=>{
            var pageAccordingToTemplate ={name:'tmp1',isDrillDown: true,description:'' ,widgets: [{name:'some widget',definition:'widget1',width:1,height:1,x:1,y:1,configuration:{}}]};
            // Set ids data so can compare (i dont want to delete values from the store inorder to compare)
            pageAccordingToTemplate.id = drillDownPage.id;
            pageAccordingToTemplate.parent = parentPage.id;
            pageAccordingToTemplate.widgets[0].id = drillDownPage.widgets[0].id;

            expect(drillDownPage).to.eql(pageAccordingToTemplate);
        });

        it ('Drilldown parent widget should have the expected drillDownPageId',()=>{
            expect(parentPage.widgets[0].drillDownPageId).to.equal(drillDownPage.id);
        });

        it('Should link parent and child pages properly',()=>{
            expect(parentPage.children).to.have.length(1);
            expect(parentPage.children[0]).to.equal(drillDownPage.id);

            expect(drillDownPage.parent).to.equal(parentPage.id);
        });

    });

});
