import type { FunctionComponent } from 'react';
import styled from 'styled-components';
import pageLayout from './pageLayout.json';

const WidgetsPaneWrapper = styled.div`
    overflow: auto;
`;

const DetailsPaneWidgets: FunctionComponent = () => {
    const { PageContent } = Stage.Shared.Widgets;

    return (
        <WidgetsPaneWrapper>
            <PageContent page={pageLayout as any} />
        </WidgetsPaneWrapper>
    );
};
export default DetailsPaneWidgets;
