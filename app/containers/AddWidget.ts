// @ts-nocheck File not migrated fully to TS
import type { ComponentProps, ComponentType } from 'react';
import { connect } from 'react-redux';
import { checkIfWidgetIsUsed, installWidget, replaceWidget, uninstallWidget } from '../actions/widgets';
import AddWidgetModal from '../components/AddWidgetModal';
import Consts from '../utils/consts';
import stageUtils from '../utils/stageUtils';

const mapStateToProps = (state, ownProps) => {
    const widgetDefinitions = state.widgetDefinitions.filter(definition => {
        const isLoadingDefinition = !definition.loaded;
        const isUserAuthorized = stageUtils.isUserAuthorized(definition.permission, state.manager);
        const isWidgetPermitted = stageUtils.isWidgetPermitted(definition.supportedEditions, state.manager);
        return isLoadingDefinition || (isUserAuthorized && isWidgetPermitted);
    });
    const canInstallWidgets = stageUtils.isUserAuthorized(Consts.permissions.STAGE_INSTALL_WIDGETS, state.manager);

    return {
        widgetDefinitions,
        pageId: ownProps.pageId,
        canInstallWidgets
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onWidgetInstalled: (widgetFile, widgetUrl) => {
            return dispatch(installWidget(widgetFile, widgetUrl));
        },
        onWidgetUninstalled: widgetId => {
            return dispatch(uninstallWidget(widgetId));
        },
        onWidgetUpdated: (widgetId, widgetFile, widgetUrl) => {
            return dispatch(replaceWidget(widgetId, widgetFile, widgetUrl));
        },
        onWidgetUsed: widgetId => {
            return dispatch(checkIfWidgetIsUsed(widgetId));
        }
    };
};

// NOTE: TypeScript did not like that `AddWidgetModal` is wrapped and exported in this file
// without explicit typing. The type annotation should be removed once the modal is fully
// transformed to TypeScript.
export default connect(mapStateToProps, mapDispatchToProps)(AddWidgetModal) as ComponentType<
    Omit<
        ComponentProps<typeof AddWidgetModal>,
        keyof ReturnType<typeof mapStateToProps> | keyof ReturnType<typeof mapDispatchToProps>
    >
>;
