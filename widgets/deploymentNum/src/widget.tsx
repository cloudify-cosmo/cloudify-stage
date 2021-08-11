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
    icon: string;
    imageSrc: string;
    label: string;
    page: string;
    filterId: string;
}

Stage.defineWidget<unknown, WidgetData, DeploymentNumWidgetConfiguration>({
    id: 'deploymentNum',
    name: 'Number of deployments',
    description: 'Number of deployments',
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
            name: 'Label',
            description: 'Label displayed under deployments count',
            default: 'Deployments',
            type: Stage.Basic.GenericField.STRING_TYPE
        },
        {
            id: 'icon',
            name: 'Icon',
            description: (
                <>
                    Name of the icon displayed on the left side of the deployments count. Available icons list can be
                    found at: <a href="https://react.semantic-ui.com/elements/icon">Icon - Semantic UI React</a>
                </>
            ),
            default: 'cube',
            type: Stage.Basic.GenericField.STRING_TYPE
        },
        {
            id: 'imageSrc',
            name: 'Image URL',
            description: 'URL of the image displayed on the left side of the deployments count',
            default: '',
            type: Stage.Basic.GenericField.STRING_TYPE
        },
        {
            id: 'filterId',
            name: 'Filter ID',
            description: 'Name of the saved filter to apply on deployments',
            type: Stage.Basic.GenericField.CUSTOM_TYPE,
            default: '',
            component: Stage.Common.Filters.FilterIdDropdown
        },
        {
            id: 'page',
            name: 'Page to open on click',
            description: 'Page to open when user clicks on widget content',
            type: Stage.Basic.GenericField.CUSTOM_TYPE,
            default: 'deployments',
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
                <KeyIndicator title={label} icon={icon as SemanticICONS} imageSrc={imageSrc} number={num} />
            </Link>
        );
    }
});
