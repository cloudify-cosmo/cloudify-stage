/**
 * Created by kinneretzin on 11/09/2016.
 */

import React from 'react';
import { connect } from 'react-redux';
import Page from '../components/Page';
import {changePageName} from '../actions/page';
import {selectPage} from '../actions/page';
import {removePage} from '../actions/page';
import {updatePageDescription} from '../actions/page';
import {changeWidgetGridData} from '../actions/widgets';
import {setDrilldownContext} from '../actions/drilldownContext';
import {setEditMode} from '../actions/config';
import {minimizeWidgets} from '../actions/widgets';

const buildPagesList = (pages,drilldownContextArray,selectedPageId) => {
    var pagesMap = _.keyBy(pages,'id');
    var pagesList = [];
    var index = drilldownContextArray.length-1;

    var _r = (page) => {
        if (!page) {
            page = pages[0];
        }
        var pageDrilldownContext = index>=0 ? drilldownContextArray[index--] : {};
        pagesList.push(Object.assign({},page,{name:pageDrilldownContext.pageName || page.name, context:pageDrilldownContext.context}));
        if (!page.parent) {
            return;
        }
        return _r(pagesMap[page.parent]);
    };

    _r(pagesMap[selectedPageId]);

    return pagesList;

};

const mapStateToProps = (state, ownProps) => {
    var pages = state.pages;

    var pagesMap = _.keyBy(pages,'id');
    var page = pagesMap[ownProps.pageId];
    var homePageId = pages[0].id;
    var pageId = page ? page.id : homePageId;

    var pageData = _.clone(_.find(pages,{id:pageId}));
    var widgets = _.map(pageData.widgets,(wd)=>{
        var w = _.clone(wd);
        w.definition = _.find(state.widgetDefinitions,{id:w.definition});
        return w;
    });
    pageData.widgets = widgets;
    pageData.name = ownProps.pageName || pageData.name;

    var pagesList = buildPagesList(pages,state.drilldownContext,pageId);
    return {
        page: pageData,
        pagesList: pagesList,
        isEditMode: state.config.isEditMode || false
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onPageNameChange: (page,newName)=> {
            dispatch(changePageName(page,newName));
        },
        onPageDescriptionChange: (pageId,newDescription)=> {
            dispatch(updatePageDescription(pageId,newDescription));
        },
        onPageSelected: (page,pagesList,index) => {
            var drilldownContext = [];
            // Starting from 1 cause the first page doesnt have any context and shouldnt be in the context array (only drilldown pages)
            // and also skip the last page, because we are sending the context of this one to the select page
            for (var i=1;i<=index-1;++i) {
                drilldownContext.push({pageName: pagesList[i].name, context: pagesList[i].context});
            }
            dispatch(setDrilldownContext(drilldownContext));
            dispatch(selectPage(page.id,page.isDrillDown,page.context,page.name));
        },
        onPageRemoved: (page) => {
            dispatch(removePage(page.id));
        },
        onWidgetsGridDataChange: (pageId,widgetId,gridData)=>{
            dispatch(changeWidgetGridData(pageId,widgetId,gridData));
        },
        onEditModeExit: () => {
            dispatch(setEditMode(false));
        },
    }
};

const PageW = connect(
    mapStateToProps,
    mapDispatchToProps
)(Page);


export default PageW
