/* eslint-disable react/prop-types */
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { deploymentsViewColumnDefinitions, DeploymentsViewColumnId, deploymentsViewColumnIds } from './columns';
import { i18nPrefix } from '../common';
import renderDeploymentRow from './renderDeploymentRow';
import type { Deployment } from '../types';

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

interface DeploymentsTableProps {
    setGridParams: (params: Stage.Types.ManagerGridParams) => void;
    toolbox: Stage.Types.Toolbox;
    loadingIndicatorVisible: boolean;
    deployments: Deployment[];
    pageSize: number;
    totalSize: number;
    fieldsToShow: DeploymentsViewColumnId[];
}

const DeploymentsTable: FunctionComponent<DeploymentsTableProps> = ({
    setGridParams,
    toolbox,
    loadingIndicatorVisible,
    deployments,
    fieldsToShow,
    pageSize,
    totalSize
}) => {
    const { DataTable } = Stage.Basic;

    return (
        <TableContainer>
            <TableLoadingIndicator active={loadingIndicatorVisible} />
            <DataTable
                fetchData={(params: { gridParams: Stage.Types.GridParams }) =>
                    setGridParams(Stage.Utils.mapGridParamsToManagerGridParams(params.gridParams))
                }
                pageSize={pageSize}
                selectable
                sizeMultiplier={20}
                // TODO(RD-1787): adjust `noDataMessage` to show the image
                noDataMessage={Stage.i18n.t(`${i18nPrefix}.messages.noData`)}
                totalSize={totalSize}
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

                {deployments.flatMap(renderDeploymentRow(toolbox, fieldsToShow))}
            </DataTable>
        </TableContainer>
    );
};
export default DeploymentsTable;
