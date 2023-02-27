import { castArray } from 'lodash';
import type { PollingTimeConfiguration } from 'app/utils/GenericConfig';
import type { BlueprintInfoData } from './types';
import BlueprintInfo from './BlueprintInfo';
import Actions from './actions';

const widgetId = 'blueprintInfo';
const translate = Stage.Utils.getT('widgets.blueprintInfo');

interface BlueprintInfoParams {
    /* eslint-disable camelcase */
    blueprint_id?: string;
    deployment_id?: string | null;
    /* eslint-enable camelcase */
}

interface BlueprintInfoConfiguration extends PollingTimeConfiguration {
    blueprintId?: string;
}

Stage.defineWidget<BlueprintInfoParams, BlueprintInfoData, BlueprintInfoConfiguration>({
    id: widgetId,
    initialWidth: 3,
    initialHeight: 14,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION(widgetId),
    categories: [Stage.GenericConfig.CATEGORY.BLUEPRINTS, Stage.GenericConfig.CATEGORY.CHARTS_AND_STATISTICS],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        {
            id: 'blueprintId',
            name: translate('configuration.blueprintId.name'),
            placeHolder: translate('configuration.blueprintId.placeholder'),
            type: Stage.Basic.GenericField.STRING_TYPE
        }
    ],

    fetchParams(widget, toolbox) {
        // TODO(RD-2130): Use common utility function to get only the first ID
        let blueprintId = castArray(toolbox.getContext().getValue('blueprintId'))[0];

        blueprintId = widget.configuration.blueprintId ?? blueprintId;

        // TODO(RD-2130): Use common utility function to get only the first ID
        const deploymentId = castArray(toolbox.getContext().getValue('deploymentId'))[0];

        return {
            blueprint_id: blueprintId,
            deployment_id: deploymentId
        };
    },

    fetchData(_widget, toolbox, params) {
        const actions = new Actions(toolbox);

        const blueprintId = params.blueprint_id;
        const deploymentId = params.deployment_id;

        let promise = Promise.resolve({ blueprint_id: blueprintId });
        if (!blueprintId && deploymentId) {
            promise = actions.doGetBlueprintId(deploymentId);
        }

        return promise.then(({ blueprint_id: id }) =>
            id
                ? Promise.all([actions.doGetBlueprintDetails(id), actions.doGetBlueprintDeployments(id)]).then(
                      data => ({
                          ...data[0],
                          created_at: Stage.Utils.Time.formatTimestamp(data[0].created_at),
                          updated_at: Stage.Utils.Time.formatTimestamp(data[0].updated_at),
                          deployments: data[1].items[0]?.deployments || 0
                      })
                  )
                : Promise.reject(translate('noBlueprintError'))
        );
    },

    render(_widget, data, _error, toolbox) {
        const { Loading } = Stage.Basic;

        if (Stage.Utils.isEmptyWidgetData(data)) {
            return <Loading />;
        }

        return <BlueprintInfo data={data} toolbox={toolbox} />;
    }
});
