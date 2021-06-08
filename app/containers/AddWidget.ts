// @ts-nocheck File not migrated fully to TS
import { connect } from 'react-redux';
import type { ComponentProps, ComponentType } from 'react';
import { checkIfWidgetIsUsed, installWidget, uninstallWidget, updateWidgetDefinition } from '../actions/widgets';
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

const mapDispatchToProps = dispatch => {
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

// NOTE: TypeScript did not like that `AddWidgetModal` is wrapped and exported in this file
// without explicit typing. The type annotation should be removed once the modal is fully
// transformed to TypeScript.
export default connect(mapStateToProps, mapDispatchToProps)(AddWidgetModal) as ComponentType<
    Omit<
        ComponentProps<typeof AddWidgetModal>,
        keyof ReturnType<typeof mapStateToProps> | keyof ReturnType<typeof mapDispatchToProps>
    >
>;
