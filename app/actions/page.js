/**
 * Created by kinneretzin on 30/08/2016.
 */


import * as types from './types';
import { push } from 'react-router-redux';
import {v4} from 'node-uuid';
import {clearContext} from './context';
import {addWidget} from './widgets';

export function createPage(name, newPageId) {
    return {
        type: types.ADD_PAGE,
        name,
        newPageId
    };
}

export function addPage(name) {
    return function (dispatch) {
        var newPageId = v4();
        dispatch(createPage(name, newPageId));
        dispatch(selectPage(newPageId,false))
    }
}

export function createDrilldownPage(newPageId,name) {
    return {
        type: types.CREATE_DRILLDOWN_PAGE,
        newPageId,
        name
    }

}

export function renamePage(pageId,newName) {
    return {
        type: types.RENAME_PAGE,
        pageId,
        name: newName
    }
}

export function updatePageDescription(pageId,newDescription) {
    return {
        type: types.UPDATE_PAGE_DESCRIPTION,
        pageId,
        description: newDescription
    }

}
export function selectPage(pageId,isDrilldown) {
    return function (dispatch) {

        if (!isDrilldown) {
            dispatch(clearContext());
        }
        dispatch(push('/page/'+pageId));
    }
}

export function removePage(pageId) {
    return {
        type: types.REMOVE_PAGE,
        pageId: pageId
        }
}

export function createPageFromInitialTemplate(initialTemplate,templates,plugins) {
    return function (dispatch) {

        let idIndex = 0;

        _.each(initialTemplate,(templateName)=>{
            var template = templates[templateName];
            if (!template) {
                console.error('Cannot find template : '+templateName + ' Skipping... ');
                return;
            }

            var currId = idIndex.toString();
            dispatch(createPage(template.name,currId));
            _.each(template.widgets,(widget)=>{
                var plugin = _.find(plugins,{id:widget.plugin});
                dispatch(addWidget(currId,widget.name,plugin,widget.width,widget.height,widget.x,widget.y,widget.configuration));
            });
            idIndex++;
        });
    }
}

