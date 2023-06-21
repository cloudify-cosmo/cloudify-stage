import { isEmpty } from 'lodash';
import React from 'react';
import type { SemanticICONS } from 'semantic-ui-react';

interface WidgetData {
    metadata?: {
        pagination?: {
            total?: number;
        };
    };
}

interface DeploymentNumWidgetConfiguration {
    icon: SemanticICONS;
    imageSrc: string;
    label: string;
    page: string;
    filterId: string;
}

const translate = Stage.Utils.getT('widgets.deploymentNum');

Stage.defineWidget<unknown, WidgetData, DeploymentNumWidgetConfiguration>({
    id: 'deploymentNum',
    initialWidth: 2,
    initialHeight: 8,
    showHeader: false,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('deploymentNum'),
    categories: [Stage.GenericConfig.CATEGORY.DEPLOYMENTS, Stage.GenericConfig.CATEGORY.CHARTS_AND_STATISTICS],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        {
            id: 'label',
            name: translate('configuration.label.name'),
            description: translate('configuration.label.description'),
            default: 'Deployments',
            type: Stage.Basic.GenericField.STRING_TYPE
        },
        {
            id: 'icon',
            name: translate('configuration.icon.name'),
            description: translate('configuration.icon.description'),
            default: 'cube',
            component: Stage.Shared.SemanticIconDropdown,
            type: Stage.Basic.GenericField.CUSTOM_TYPE
        },
        {
            id: 'imageSrc',
            name: translate('configuration.imageSrc.name'),
            description: translate('configuration.imageSrc.description'),
            default: '',
            type: Stage.Basic.GenericField.STRING_TYPE
        },
        {
            id: 'filterId',
            name: translate('configuration.filterId.name'),
            description: translate('configuration.filterId.description'),
            type: Stage.Basic.GenericField.CUSTOM_TYPE,
            default: '',
            component: Stage.Common.Filters.FilterIdDropdown
        },
        {
            id: 'page',
            name: translate('configuration.page.name'),
            description: translate('configuration.page.description'),
            type: Stage.Basic.GenericField.CUSTOM_TYPE,
            default: 'services',
            component: Stage.Shared.PageFilter
        }
    ],

    fetchData(widget, toolbox) {
        const { filterId } = widget.configuration;
        const params = {
            _filter_id: filterId,
            _include: 'id',
            _size: 1
        };

        const deploymentActions = new Stage.Common.Deployments.Actions(toolbox.getManager());
        return deploymentActions.doGetDeployments(params);
    },

    render(widget, data) {
        const { Loading } = Stage.Basic;

        if (isEmpty(data)) {
            return <Loading />;
        }

        const { KeyIndicator } = Stage.Basic;
        const { Link } = Stage.Shared;
        const { filterIdQueryParameterName } = Stage.Common.Filters;

        const { icon, imageSrc, label, filterId, page } = widget.configuration;
        const num = data?.metadata?.pagination?.total ?? 0;
        const to = (() => {
            let path = page ? `/page/${page}` : '/';
            if (filterId) path += `?${filterIdQueryParameterName}=${filterId}`;
            return path;
        })();

        return (
            <Link to={to}>
                <KeyIndicator title={label} icon={icon} imageSrc={imageSrc} number={num} />
            </Link>
        );
    }
});
