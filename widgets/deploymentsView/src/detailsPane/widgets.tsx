import { noop } from 'lodash';
import type { FunctionComponent } from 'react';

import pageLayout from './pageLayout.json';

const DetailsPaneWidgets: FunctionComponent = () => {
    const { PageContent } = Stage.Shared.Widgets;

    return (
        <div className="detailsPaneWidgets">
            <PageContent
                isEditMode={false}
                page={pageLayout as any}
                // NOTE: No need to handle the events below since edit mode is always off
                onWidgetRemoved={noop}
                onWidgetUpdated={noop}
                onTabAdded={noop}
                onTabRemoved={noop}
                onTabUpdated={noop}
                onTabMoved={noop}
                onWidgetAdded={noop}
                onLayoutSectionAdded={noop}
                onLayoutSectionRemoved={noop}
            />
        </div>
    );
};
export default DetailsPaneWidgets;
