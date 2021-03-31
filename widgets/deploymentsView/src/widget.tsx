/* eslint-disable react/prop-types */
import { find } from 'lodash';
import { FunctionComponent, useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';

import { deploymentsViewColumnDefinitions, DeploymentsViewColumnId, deploymentsViewColumnIds } from './columns';
import { i18nPrefix } from './common';
import DetailsPane from './detailsPane';
import renderDeploymentRow from './renderDeploymentRow';
import './styles.scss';
import type { Deployment } from './types';

type DeploymentsResponse = Stage.Types.PaginatedResponse<Deployment>;

interface DeploymentsViewWidgetConfiguration {
    /** In milliseconds */
    customPollingTime: number;
    filterId?: string;
    filterByParentDeployment: boolean;
    fieldsToShow: DeploymentsViewColumnId[];
    pageSize: number;
    sortColumn: string;
    sortAscending: string;
}

// TODO(RD-1226): remove environment check
if (process.env.NODE_ENV === 'development' || process.env.TEST) {
    Stage.defineWidget<never, never, DeploymentsViewWidgetConfiguration>({
        id: 'deploymentsView',
        name: Stage.i18n.t(`${i18nPrefix}.name`),
        description: Stage.i18n.t(`${i18nPrefix}.description`),
        initialWidth: 12,
        initialHeight: 40,
        color: 'purple',
        categories: [Stage.GenericConfig.CATEGORY.DEPLOYMENTS],

        initialConfiguration: [
            {
                ...Stage.GenericConfig.POLLING_TIME_CONFIG(10),
                // NOTE: polling is handled by react-query, thus, use a different ID
                id: 'customPollingTime'
            },
            {
                id: 'filterId',
                // TODO(RD-1851): add autocomplete instead of plain text input
                type: Stage.Basic.GenericField.STRING_TYPE,
                name: Stage.i18n.t(`${i18nPrefix}.configuration.filterId.name`)
            },
            {
                // TODO(RD-1853): handle filtering by parent deployment
                id: 'filterByParentDeployment',
                type: Stage.Basic.GenericField.BOOLEAN_TYPE,
                name: Stage.i18n.t(`${i18nPrefix}.configuration.filterByParentDeployment.name`),
                description: Stage.i18n.t(`${i18nPrefix}.configuration.filterByParentDeployment.description`),
                default: false
            },
            // TODO(RD-1225): add map configuration
            {
                id: 'fieldsToShow',
                name: Stage.i18n.t(`${i18nPrefix}.configuration.fieldsToShow.name`),
                placeHolder: Stage.i18n.t(`${i18nPrefix}.configuration.fieldsToShow.placeholder`),
                items: deploymentsViewColumnIds.map(columnId => ({
                    name: deploymentsViewColumnDefinitions[columnId].name,
                    value: columnId
                })),
                default: deploymentsViewColumnIds.filter(columnId => columnId !== 'environmentType'),
                type: Stage.Basic.GenericField.MULTI_SELECT_LIST_TYPE
            },
            Stage.GenericConfig.PAGE_SIZE_CONFIG(100),
            Stage.GenericConfig.SORT_COLUMN_CONFIG('created_at'),
            Stage.GenericConfig.SORT_ASCENDING_CONFIG(false)
        ],
        isReact: true,
        hasReadme: true,
        hasStyle: false,
        permission: Stage.GenericConfig.WIDGET_PERMISSION('deploymentsView'),

        render(widget, _data, _error, toolbox) {
            return <DeploymentsView widget={widget} toolbox={toolbox} />;
        }
    });
}

interface DeploymentsViewProps {
    widget: Stage.Types.Widget<DeploymentsViewWidgetConfiguration>;
    toolbox: Stage.Types.Toolbox;
}

const TableContainer = styled.div`
    position: relative;
`;
const TableLoadingIndicator = styled(Stage.Basic.Loader)`
    // Increase specificity to override existing styling
    // See https://styled-components.com/docs/faqs#how-can-i-override-styles-with-higher-specificity
    && {
        right: 0;
        top: 0;
        left: unset;
        transform: translate(-50%, 0);
    }
`;

const DeploymentsView: FunctionComponent<DeploymentsViewProps> = ({ widget, toolbox }) => {
    const { DataTable, Loading, ErrorMessage } = Stage.Basic;
    const { fieldsToShow, pageSize, filterId, customPollingTime } = widget.configuration;
    const manager = toolbox.getManager();
    const filterRulesUrl = `/filters/deployments/${filterId}`;
    const filterRulesResult = useQuery(
        filterRulesUrl,
        ({ queryKey: url }) =>
            filterId ? manager.doGet(url).then(filtersResponse => filtersResponse.value as unknown[]) : [],
        { refetchOnWindowFocus: false }
    );
    const [gridParams, setGridParams] = useState<Stage.Types.ManagerGridParams>();
    const deploymentsUrl = '/searches/deployments';
    const deploymentsResult = useQuery(
        [deploymentsUrl, gridParams, filterRulesResult.data],
        (): Promise<DeploymentsResponse> =>
            manager.doPost(deploymentsUrl, gridParams, { filter_rules: filterRulesResult.data }),
        {
            enabled: filterRulesResult.isSuccess,
            onSuccess: data => {
                const context = toolbox.getContext();
                // TODO(RD-1830): detect if deploymentId is not present in the current page and reset it.
                // Do that only if `fetchData` was called from `DataTable`. If it's just polling,
                // then don't reset it (because user may be interacting with some other component)
                if (context.getValue('deploymentId') === undefined && data.items.length > 0) {
                    context.setValue('deploymentId', data.items[0].id);
                }
            },
            refetchInterval: customPollingTime * 1000,
            keepPreviousData: true
        }
    );

    // TODO: extract messages to en.json
    if (filterRulesResult.isLoading) {
        return <Loading message="Loading filter rules" />;
    }
    if (filterRulesResult.isError) {
        log.error(filterRulesResult.error);
        return <ErrorMessage header="Error loading data" error="Cannot fetch filter rules" />;
    }

    if (deploymentsResult.isLoading || deploymentsResult.isIdle) {
        return <Loading message="Loading deployments" />;
    }
    if (deploymentsResult.isError) {
        return <ErrorMessage header="Error loading data" error="Cannot fetch deployments" />;
    }

    const deployment = find(deploymentsResult.data.items, {
        // NOTE: type assertion since lodash has problems receiving string[] in the object
        id: toolbox.getContext().getValue('deploymentId') as string | undefined
    });

    return (
        <div className="grid">
            <TableContainer>
                <TableLoadingIndicator active={filterRulesResult.isFetching || deploymentsResult.isFetching} />
                <DataTable
                    fetchData={(params: { gridParams: Stage.Types.GridParams }) =>
                        setGridParams(Stage.Utils.mapGridParamsToManagerGridParams(params.gridParams))
                    }
                    pageSize={pageSize}
                    selectable
                    sizeMultiplier={20}
                    // TODO(RD-1787): adjust `noDataMessage` to show the image
                    noDataMessage={Stage.i18n.t(`${i18nPrefix}.noDataMessage`)}
                    totalSize={deploymentsResult.data.metadata.pagination.total}
                    searchable
                >
                    {deploymentsViewColumnIds.map(columnId => {
                        const columnDefinition = deploymentsViewColumnDefinitions[columnId];
                        return (
                            <DataTable.Column
                                key={columnId}
                                name={columnDefinition.sortFieldName}
                                label={columnDefinition.label}
                                width={columnDefinition.width}
                                tooltip={columnDefinition.tooltip}
                                show={fieldsToShow.includes(columnId)}
                            />
                        );
                    })}

                    {deploymentsResult.data.items.flatMap(renderDeploymentRow(toolbox, fieldsToShow))}
                </DataTable>
            </TableContainer>
            <DetailsPane deployment={deployment} />
        </div>
    );
};
