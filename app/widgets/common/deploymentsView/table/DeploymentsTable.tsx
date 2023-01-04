import type { FunctionComponent } from 'react';
import React from 'react';
import styled from 'styled-components';

import type { DeploymentsViewColumnId } from './columns';
import { deploymentsViewColumnIds, getDeploymentsViewColumnDefinitions } from './columns';
import { i18nPrefix } from '../common';
import renderDeploymentRow from './renderDeploymentRow';
import type { Deployment } from '../types';
import noDataImage from './no-data-image.png';
import { DataTable, Loader } from '../../../../components/basic';
import StageUtils from '../../../../utils/stageUtils';
import mapGridParamsToManagerGridParams from '../../../../utils/shared/mapGridParamsToManagerGridParams';
import type { FetchParams } from '../../types';

const TableContainer = styled.div`
    position: relative;
    height: 100%;
`;
const TableLoadingIndicator = styled(Loader)`
    // Increase specificity to override existing styling
    // See https://styled-components.com/docs/faqs#how-can-i-override-styles-with-higher-specificity
    && {
        right: 0;
        top: 0;
        left: unset;
        transform: translate(-50%, 0);
    }
`;
const NoDataMessageTextWrapper = styled.p`
    // NOTE: increases specificity to override Semantic UI's style
    && {
        margin-top: 1rem;
    }
`;

interface DeploymentsTableProps {
    setGridParams: (params: Stage.Types.ManagerGridParams) => void;
    toolbox: Stage.Types.Toolbox;
    loadingIndicatorVisible: boolean;
    deployments: Deployment[];
    pageSize: number;
    totalSize: number;
    fieldsToShow: DeploymentsViewColumnId[];
    keysOfLabelsToShow: string[];
    selectedDeployment: Deployment | undefined;
}

const tMessage = StageUtils.getT(`${i18nPrefix}.messages`);

const DeploymentsTable: FunctionComponent<DeploymentsTableProps> = ({
    setGridParams,
    toolbox,
    loadingIndicatorVisible,
    deployments,
    fieldsToShow,
    keysOfLabelsToShow,
    pageSize,
    totalSize,
    selectedDeployment
}) => {
    return (
        <TableContainer>
            <TableLoadingIndicator active={loadingIndicatorVisible} />
            <DataTable
                fetchData={(params: FetchParams) => setGridParams(mapGridParamsToManagerGridParams(params.gridParams))}
                pageSize={pageSize}
                selectable
                sizeMultiplier={20}
                noDataMessage={
                    <>
                        <NoDataMessageTextWrapper>{tMessage('noData')}</NoDataMessageTextWrapper>
                        <img src={noDataImage} alt={tMessage('noDataImageAlt')} />
                    </>
                }
                totalSize={totalSize}
                searchable
            >
                {deploymentsViewColumnIds.map(columnId => {
                    const columnDefinition = getDeploymentsViewColumnDefinitions()[columnId];
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

                {keysOfLabelsToShow.map(labelKey => (
                    <DataTable.Column key={labelKey} name={labelKey} label={labelKey} />
                ))}

                {deployments.flatMap(
                    renderDeploymentRow(toolbox, fieldsToShow, selectedDeployment, keysOfLabelsToShow)
                )}
            </DataTable>
        </TableContainer>
    );
};
export default DeploymentsTable;
