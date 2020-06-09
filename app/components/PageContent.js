import PropTypes from 'prop-types';
import { useState } from 'react';
import WidgetsList from './WidgetsList';
import { Confirm, Menu, Tab } from './basic';
import AddWidget from '../containers/AddWidget';
import EditModeButton from './EditModeButton';
import EditTabModal from './EditTabModal';

export default function PageContent({
    onWidgetUpdated,
    onWidgetRemoved,
    onWidgetAdded,
    onTabAdded,
    onTabRemoved,
    onTabUpdated,
    page,
    isEditMode
}) {
    const [activeTab, setActiveTab] = useState(Math.max(_.findIndex(page.tabs, { isDefault: true }), 0));
    const [tabIndexToRemove, setTabIndexToRemove] = useState();

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

    function removeTab(tabIndex) {
        if (tabIndex < activeTab || (tabIndex === activeTab && page.tabs.length - 1 === activeTab)) {
            setActiveTab(activeTab - 1);
        }
        onTabRemoved(tabIndex);
    }

    const panes = _.map(page.tabs, (tab, tabIndex) => ({
        menuItem: (
            <Menu.Item key={`${page.tabs.length}_${tabIndex}`}>
                {tab.name}
                {isEditMode && (
                    <>
                        <EditTabModal
                            tab={tab}
                            onTabUpdate={(name, isDefault) => onTabUpdated(tabIndex, name, isDefault)}
                            trigger={<EditModeButton style={{ padding: 3, marginLeft: 3 }} icon="edit" basic />}
                        />
                        <EditModeButton
                            style={{ padding: 3, marginLeft: 3 }}
                            icon="remove"
                            basic
                            onClick={e => {
                                e.stopPropagation();
                                if (_.isEmpty(tab.widgets)) removeTab(tabIndex);
                                else setTabIndexToRemove(tabIndex);
                            }}
                        />
                    </>
                )}
            </Menu.Item>
        ),
        render: () => (
            <span className="tabContent">
                {isEditMode && (
                    <div style={{ paddingTop: 15 }}>
                        <AddWidget onWidgetAdded={(...params) => onWidgetAdded(...params, tabIndex)} />
                    </div>
                )}
                {createWidgetList(tab.widgets, tabIndex)}
            </span>
        )
    }));

    if (isEditMode) {
        panes.push({
            menuItem: (
                <Menu.Item key="add">
                    <EditModeButton icon="add" basic onClick={onTabAdded} />
                </Menu.Item>
            )
        });
    }

    return (
        <>
            {isEditMode && <AddWidget onWidgetAdded={onWidgetAdded} />}
            {createWidgetList(page.widgets)}
            <div style={{ height: 15 }} />
            {!_.isEmpty(page.tabs) && (
                <Tab
                    panes={panes}
                    activeIndex={activeTab}
                    onTabChange={(e, { activeIndex }) => setActiveTab(activeIndex)}
                />
            )}
            {_.isEmpty(page.tabs) && isEditMode && (
                <EditModeButton
                    icon="add"
                    labelPosition="left"
                    basic
                    content="Add Tabs"
                    onClick={() => {
                        onTabAdded();
                        onTabAdded();
                        setActiveTab(0);
                    }}
                />
            )}
            <Confirm
                open={!_.isNil(tabIndexToRemove)}
                onCancel={() => setTabIndexToRemove(null)}
                onConfirm={() => {
                    removeTab(tabIndexToRemove);
                    setTabIndexToRemove(null);
                }}
                header={`Are you sure you want to remove tab ${_.get(page.tabs, [tabIndexToRemove, 'name'])}?`}
                content="All widgets present in this tab will be removed as well"
            />
        </>
    );
}

PageContent.propTypes = {
    onWidgetUpdated: PropTypes.func.isRequired,
    onWidgetRemoved: PropTypes.func.isRequired,
    onWidgetAdded: PropTypes.func.isRequired,
    onTabAdded: PropTypes.func.isRequired,
    onTabRemoved: PropTypes.func.isRequired,
    onTabUpdated: PropTypes.func.isRequired,
    page: PropTypes.shape({
        widgets: PropTypes.arrayOf(PropTypes.shape({})),
        tabs: PropTypes.arrayOf(PropTypes.shape({}))
    }).isRequired,
    isEditMode: PropTypes.bool.isRequired
};
