/**
 * Created by pposel on 11/08/2017.
 */

import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { selectHomePage } from '../../actions/page';
import { changePageWidgetGridData, savePage, updatePageName } from '../../actions/templateManagement';
import PageManagement from '../../components/templates/PageManagement';

const mapStateToProps = (state, ownProps) => {
    var templateManagement = state.templateManagement || {};

    var pageData = _.clone(templateManagement.page);
    var widgets = _.map(pageData.widgets,(wd)=>{
        var w = _.clone(wd);
        w.definition = _.find(state.widgetDefinitions,{id:w.definition});
        return w;
    });
    pageData.widgets = widgets;

    return {
        error: templateManagement.error,
        isEditMode: templateManagement.isEditMode,
        page: pageData,
    };
};

const mapDispatchToProps = (dispatch, getState, ownProps) => {
    return {
        onClose: () => dispatch(selectHomePage()),
        onTemplateNavigate: () => dispatch(push('template_management')),
        onWidgetsGridDataChange: (pageId,widgetId,gridData) => {
            dispatch(changePageWidgetGridData(widgetId,gridData));
        },
        onPageSave: (page) => {
            dispatch(savePage(page));
            dispatch(push('template_management'));
        },
        onPageNameChange: (pageName) => {
            dispatch(updatePageName(pageName));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PageManagement);
