import styled from 'styled-components';

export const DeploymentsViewContainer = styled.div`
    height: 100%;
    display: grid;
    grid-template-columns: minmax(50%, 1fr) 1fr;
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
