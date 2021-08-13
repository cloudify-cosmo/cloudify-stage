import type { FunctionComponent } from 'react';

import pageLayout from './pageLayout.json';

const DetailsPaneWidgets: FunctionComponent = () => {
    const { PageContent } = Stage.Shared.Widgets;

    return (
        <div className="detailsPaneWidgets">
            <PageContent page={pageLayout as any} />
        </div>
    );
};
export default DetailsPaneWidgets;
