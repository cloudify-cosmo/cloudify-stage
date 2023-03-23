import styled from 'styled-components';

export const DeploymentsViewContainer = styled.div`
    height: 100%;
    display: grid;
    grid-template-areas:
        'header'
        'map'
        'table-with-details';
    grid-template-rows: min-content min-content minmax(250px, 1fr);
`;

export const DeploymentsViewHeaderContainer = styled.div`
    grid-area: header;
    margin-bottom: 1em;
    display: flex;
    justify-content: flex-end;
    position: absolute;
    right: 0;
    z-index: 1;
`;

export const DeploymentsMapLayoutContainer = styled.div<{ height: number }>`
    height: ${props => props.height}px;
    grid-area: map;
    margin-bottom: 1em;
`;

export const DeploymentsMasterDetailViewContainer = styled.div`
    grid-area: table-with-details;
`;

export const DeploymentsTableContainer = styled.div`
    height: 100%;
    overflow: auto;

    .gridTable {
        height: 100%;
        overflow: auto;

        // NOTE: scroll only the table, not the searchbox
        > div:nth-child(2) {
            // NOTE: 48px - the offset of table in the parent
            height: calc(100% - 48px);
            overflow: auto;
        }
    }
`;

export const DeploymentDetailsContainer = styled.div`
    height: 100%;
    overflow: auto;
`;
