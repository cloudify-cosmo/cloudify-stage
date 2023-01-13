import type { FunctionComponent } from 'react';
import React from 'react';
import styled from 'styled-components';
import pageLayout from './pageLayout.json';
import type { TemplatePageDefinition } from '../../../../actions/templateManagement/pages';
import { PageContent } from '../../../../components/application/content';

const WidgetsPaneWrapper = styled.div`
    overflow: auto;
`;

const DetailsPaneWidgets: FunctionComponent = () => {
    return (
        <WidgetsPaneWrapper>
            <PageContent page={pageLayout as TemplatePageDefinition} />
        </WidgetsPaneWrapper>
    );
};
export default DetailsPaneWidgets;
