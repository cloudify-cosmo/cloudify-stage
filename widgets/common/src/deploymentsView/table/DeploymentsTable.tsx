import type { FunctionComponent } from 'react';
import styled from 'styled-components';

import type { DeploymentsViewColumnId } from './columns';
import { deploymentsViewColumnDefinitions, deploymentsViewColumnIds } from './columns';
import { i18nPrefix } from '../common';
import renderDeploymentRow from './renderDeploymentRow';
import type { Deployment } from '../types';
import noDataImage from './no-data-image.png';

const TableContainer = styled.div`
    position: relative;
    height: 100%;
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

const tMessage = Stage.Utils.getT(`${i18nPrefix}.messages`);

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

                {keysOfLabelsToShow.map(labelKey => (
                    <DataTable.Column key={labelKey} name={labelKey} label={labelKey} />
                ))}

                {deployments.flatMap(renderDeploymentRow(toolbox, fieldsToShow, selectedDeployment, keysOfLabelsToShow))}
            </DataTable>
        </TableContainer>
    );
};
export default DeploymentsTable;
