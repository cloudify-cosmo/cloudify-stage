import PropTypes from 'prop-types';
import WidgetsList from './WidgetsList';
import { Tab } from './basic';
import AddWidget from '../containers/AddWidget';

export default function PageContent({ onWidgetUpdated, onWidgetRemoved, onWidgetAdded, page, isEditMode }) {
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
            {isEditMode && <AddWidget onWidgetAdded={onWidgetAdded} />}
            {createWidgetList(page.widgets)}
            {!_.isEmpty(page.tabs) && (
                <Tab
                    panes={_.map(page.tabs, (tab, tabIndex) => ({
                        menuItem: tab.name,
                        render: () => (
                            <>
                                {isEditMode && (
                                    <div style={{ paddingTop: 15 }}>
                                        <AddWidget onWidgetAdded={(...params) => onWidgetAdded(...params, tabIndex)} />
                                    </div>
                                )}
                                {createWidgetList(tab.widgets, tabIndex)}
                            </>
                        )
                    }))}
                />
            )}
        </>
    );
}

PageContent.propTypes = {
    onWidgetUpdated: PropTypes.func.isRequired,
    onWidgetRemoved: PropTypes.func.isRequired,
    onWidgetAdded: PropTypes.func.isRequired,
    page: PropTypes.shape({
        widgets: PropTypes.arrayOf(PropTypes.shape({})),
        tabs: PropTypes.arrayOf(PropTypes.shape({}))
    }).isRequired,
    isEditMode: PropTypes.bool.isRequired
};
