import { isEmpty } from 'lodash';
import React from 'react';
import { SemanticICONS } from 'semantic-ui-react';

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

const t = Stage.Utils.getT('widgets.deploymentNum');

Stage.defineWidget<unknown, WidgetData, DeploymentNumWidgetConfiguration>({
    id: 'deploymentNum',
    name: t('name'),
    description: t('description'),
    initialWidth: 2,
    initialHeight: 8,
    color: 'green',
    showHeader: false,
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('deploymentNum'),
    categories: [Stage.GenericConfig.CATEGORY.DEPLOYMENTS, Stage.GenericConfig.CATEGORY.CHARTS_AND_STATISTICS],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        {
            id: 'label',
            name: t('configuration.label.name'),
            description: t('configuration.label.description'),
            default: 'Deployments',
            type: Stage.Basic.GenericField.STRING_TYPE
        },
        {
            id: 'icon',
            name: t('configuration.icon.name'),
            description: t('configuration.icon.description'),
            default: 'cube',
            component: Stage.Common.SemanticIconDropdown,
            type: Stage.Basic.GenericField.CUSTOM_TYPE
        },
        {
            id: 'imageSrc',
            name: t('configuration.imageSrc.name'),
            description: t('configuration.imageSrc.description'),
            default: '',
            type: Stage.Basic.GenericField.STRING_TYPE
        },
        {
            id: 'filterId',
            name: t('configuration.filterId.name'),
            description: t('configuration.filterId.description'),
            type: Stage.Basic.GenericField.CUSTOM_TYPE,
            default: '',
            component: Stage.Common.Filters.FilterIdDropdown
        },
        {
            id: 'page',
            name: t('configuration.page.name'),
            description: t('configuration.page.description'),
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

        const deploymentActions = new Stage.Common.DeploymentActions(toolbox);
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
