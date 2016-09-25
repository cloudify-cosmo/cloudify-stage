/**
 * Created by kinneretzin on 11/09/2016.
 */

import React from 'react';
import { connect } from 'react-redux';
import Page from '../components/Page';
import {renamePage} from '../actions/page';
import {selectPage} from '../actions/page';
import {changeWidgetGridData} from '../actions/widgets';

const buildPagesList = (pages,selectedPageId) => {
    var pagesMap = _.keyBy(pages,'id');
    var pagesList = [];

    var _r = (page) => {
        pagesList.push({id:page.id,name:page.name});
        if (!page.parent) {
            return;
        }
        return _r(pagesMap[page.parent]);
    };

    _r(pagesMap[selectedPageId]);

    return pagesList;

};

const mapStateToProps = (state, ownProps) => {
    var pageData = _.clone(_.find(state.pages,{id:ownProps.pageId}));
    var widgets = _.map(pageData.widgets,(wd)=>{
        var w = _.clone(wd);
        w.plugin = _.find(state.plugins.items,{id:w.plugin});
        return w;
    });
    pageData.widgets = widgets;

    return {
        page: pageData,
        pagesList: buildPagesList(state.pages,ownProps.pageId),
        isEditMode: state.header.isEditMode
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onPageNameChange: (pageId,newName)=> {
            dispatch(renamePage(pageId,newName));
        },
        onPageSelected: (page) => {
            dispatch(selectPage(page.id));
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
