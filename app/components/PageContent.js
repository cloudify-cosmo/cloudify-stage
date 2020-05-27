import PropTypes from 'prop-types';
import WidgetsList from './WidgetsList';
import { Tab } from './basic';

export default function PageContent({ onWidgetUpdated, onWidgetRemoved, page, isEditMode }) {
    function createWidgetList(widgets, tab) {
        return (
            <WidgetsList
                tab={tab}
                widgets={widgets}
                onWidgetUpdated={onWidgetUpdated}
                onWidgetRemoved={onWidgetRemoved}
                isEditMode={isEditMode}
            />
        );
    }

    return (
        <>
            {createWidgetList(page.widgets)}
            {!_.isEmpty(page.tabs) && (
                <Tab
                    panes={_.map(page.tabs, (tab, tabIndex) => ({
                        menuItem: tab.name,
                        render: () => createWidgetList(tab.widgets, tabIndex)
                    }))}
                />
            )}
        </>
    );
}

PageContent.propTypes = {
    onWidgetUpdated: PropTypes.func.isRequired,
    onWidgetRemoved: PropTypes.func.isRequired,
    page: PropTypes.shape({
        widgets: PropTypes.arrayOf(PropTypes.shape({})),
        tabs: PropTypes.arrayOf(PropTypes.shape({}))
    }).isRequired,
    isEditMode: PropTypes.bool.isRequired
};
