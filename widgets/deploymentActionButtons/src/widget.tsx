import { castArray } from 'lodash';
import DeploymentActionButtons from './DeploymentActionButtons';
import { fetchedDeploymentFields, widgetId } from './widget.consts';
import { translateWidget } from './widget.utils';
import type { FetchedDeployment, FetchedDeploymentState } from './widget.types';

interface WidgetParams {
    id: string | null | undefined;
}
type WidgetData = FetchedDeployment | Error;
interface WidgetConfiguration {
    preventRedirectToParentPageAfterDelete?: boolean;
}

Stage.defineWidget<WidgetParams, WidgetData, WidgetConfiguration>({
    id: widgetId,
    initialWidth: 5,
    initialHeight: 5,
    showHeader: false,
    showBorder: false,
    categories: [Stage.GenericConfig.CATEGORY.DEPLOYMENTS, Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(5),
        {
            // NOTE: for programmatic use only, not exposed in the UI
            type: Stage.Basic.GenericField.BOOLEAN_TYPE,
            hidden: true,
            id: 'preventRedirectToParentPageAfterDelete',
            default: false
        }
    ],
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('deploymentActionButtons'),

    fetchData(_widget, toolbox, { id }) {
        if (!id) {
            return Promise.resolve(new Error(translateWidget('errors.fetchData')));
        }

        const DeploymentActions = Stage.Common.Deployments.Actions;
        const actions = new DeploymentActions(toolbox.getManager());

        return actions.doGet<keyof FetchedDeployment>(
            { id },
            {
                _include: fetchedDeploymentFields.join(',')
            }
        );
    },

    fetchParams(_widget, toolbox): WidgetParams {
        return { id: getDeploymentIdFromContext(toolbox) };
    },

    render(widget, data, _error, toolbox) {
        // eslint-disable-next-line no-nested-ternary
        const fetchedDeploymentState: FetchedDeploymentState = Stage.Utils.isEmptyWidgetData(data)
            ? { status: 'loading' }
            : data instanceof Error
            ? { status: 'error', error: data }
            : { status: 'success', data };

        return (
            <DeploymentActionButtons
                deploymentId={getDeploymentIdFromContext(toolbox)}
                fetchedDeploymentState={fetchedDeploymentState}
                toolbox={toolbox}
                redirectToParentPageAfterDelete={!widget.configuration.preventRedirectToParentPageAfterDelete}
            />
        );
    }
});

const getDeploymentIdFromContext = (toolbox: Stage.Types.Toolbox) => {
    const deploymentId = toolbox.getContext().getValue('deploymentId');
    // Deployment Actions Buttons widget does not support multiple actions, thus picking only one deploymentId
    const firstDeploymentId = castArray(deploymentId)[0] as WidgetParams['id'];

    return firstDeploymentId;
};
