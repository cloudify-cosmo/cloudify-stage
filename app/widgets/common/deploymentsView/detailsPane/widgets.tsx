import type { FunctionComponent } from 'react';
import React from 'react';
import styled from 'styled-components';
import pageLayout from './pageLayout.json';
import { PageContent } from '../../../../components/shared/widgets';

const WidgetsPaneWrapper = styled.div`
    overflow: auto;
`;

const DetailsPaneWidgets: FunctionComponent = () => {
    return (
        <WidgetsPaneWrapper>
            <PageContent page={pageLayout as any} />
        </WidgetsPaneWrapper>
    );
};
export default DetailsPaneWidgets;
