/**
 * Created by pposel on 11/08/2017.
 */

import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { selectHomePage } from '../../actions/page';
import {
    changePageWidgetGridData,
    savePage,
    updatePageName,
    clearPageContext,
    drillDownWarning
} from '../../actions/templateManagement';
import PageManagement from '../../components/templates/PageManagement';

const mapStateToProps = (state, ownProps) => {
    const templateManagement = state.templateManagement || {};

    const pageData = _.clone(templateManagement.page);
    const widgets = _.map(pageData.widgets, wd => {
        const w = _.clone(wd);
        w.definition = _.find(state.widgetDefinitions, { id: w.definition });
        return w;
    });
    pageData.widgets = widgets;

    return {
        error: templateManagement.error,
        isPageEditMode: templateManagement.isPageEditMode,
        showDrillDownWarn: templateManagement.showDrillDownWarn,
        page: pageData
    };
};

const mapDispatchToProps = (dispatch, getState, ownProps) => {
    return {
        onClose: () => dispatch(selectHomePage()),
        onClear: () => dispatch(clearPageContext()),
        onTemplateNavigate: () => dispatch(push('/template_management')),
        onWidgetsGridDataChange: (pageId, widgetId, gridData) => {
            dispatch(changePageWidgetGridData(widgetId, gridData));
        },
        onPageSave: page => {
            dispatch(savePage(page));
        },
        onPageNameChange: pageName => {
            dispatch(updatePageName(pageName));
        },
        onCloseDrillDownWarning: () => {
            dispatch(drillDownWarning(false));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PageManagement);
