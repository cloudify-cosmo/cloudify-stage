/**
 * Created by kinneretzin on 11/09/2016.
 */

import React from 'react';
import { connect } from 'react-redux';
import Page from '../components/Page';
import {renamePage} from '../actions/page';
import {selectPage} from '../actions/page';
import {removePage} from '../actions/page';
import {updatePageDescription} from '../actions/page';
import {changeWidgetGridData} from '../actions/widgets';

const buildPagesList = (pages,selectedPageId) => {
    var pagesMap = _.keyBy(pages,'id');
    var pagesList = [];


    var _r = (page) => {
        if (!page)
        {
            page = pagesMap["0"];
        }
        pagesList.push({id:page.id, name:page.name, description:page.description});
        if (!page.parent) {
            return;
        }
        return _r(pagesMap[page.parent]);
    };

    _r(pagesMap[selectedPageId]);

    return pagesList;

};

const mapStateToProps = (state, ownProps) => {
    var pagesMap = _.keyBy(state.pages,'id');
    var page = pagesMap[ownProps.pageId];
    var pageId = "0";
    if (page)
    {
        pageId = page.id;
    }
    var pageData = _.clone(_.find(state.pages,{id:pageId}));
    var widgets = _.map(pageData.widgets,(wd)=>{
        var w = _.clone(wd);
        w.definition = _.find(state.widgetDefinitions,{id:w.definition});
        return w;
    });
    pageData.widgets = widgets;
    pageData.name = ownProps.pageName || pageData.name;

    var pagesList = buildPagesList(state.pages,pageId);
    pagesList[0].name = pageData.name;
    return {
        page: pageData,
        pagesList: pagesList,
        isEditMode: state.config.isEditMode || false
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onPageNameChange: (pageId,newName)=> {
            dispatch(renamePage(pageId,newName));
        },
        onPageDescriptionChange: (pageId,newDescription)=> {
            dispatch(updatePageDescription(pageId,newDescription));
        },
        onPageSelected: (page) => {
            dispatch(selectPage(page.id,page.isDrillDown));
        },
        onPageRemoved: (page) => {
            dispatch(removePage(page.id));
        },
        onWidgetsGridDataChange: (pageId,widgetId,gridData)=>{
            dispatch(changeWidgetGridData(pageId,widgetId,gridData));
        }
    }
};

const PageW = connect(
    mapStateToProps,
    mapDispatchToProps
)(Page);


export default PageW
