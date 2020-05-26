/**
 * Created by kinneretzin on 08/09/2016.
 */

import React from 'react';
import { connect } from 'react-redux';
import { addWidget, checkIfWidgetIsUsed, installWidget, uninstallWidget, updateWidgetDefinition } from '../actions/widgets';
import AddWidgetModal from '../components/AddWidgetModal';
import stageUtils from '../utils/stageUtils';
import Consts from '../utils/consts';

const mapStateToProps = (state, ownProps) => {
    const widgetDefinitions = state.widgetDefinitions.filter(definition => {
        return (
            stageUtils.isUserAuthorized(definition.permission, state.manager) &&
            stageUtils.isWidgetPermitted(definition.supportedEditions, state.manager)
        );
    });
    const canInstallWidgets = stageUtils.isUserAuthorized(Consts.permissions.STAGE_INSTALL_WIDGETS, state.manager);

    return {
        widgetDefinitions,
        pageId: ownProps.pageId,
        canInstallWidgets
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onWidgetInstalled: (widgetFile, widgetUrl) => {
            return dispatch(installWidget(widgetFile, widgetUrl));
        },
        onWidgetUninstalled: widgetId => {
            return dispatch(uninstallWidget(widgetId));
        },
        onWidgetUpdated: (widgetId, widgetFile, widgetUrl) => {
            return dispatch(updateWidgetDefinition(widgetId, widgetFile, widgetUrl));
        },
        onWidgetUsed: widgetId => {
            return dispatch(checkIfWidgetIsUsed(widgetId));
        }
    };
};

const AddWidget = connect(
    mapStateToProps,
    mapDispatchToProps
)(AddWidgetModal);

export default AddWidget;
