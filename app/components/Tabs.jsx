import React, { useState } from 'react';
import _ from 'lodash';

import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import PropTypes from 'prop-types';
import EditTabModal from './EditTabModal';
import EditModeButton from './EditModeButton';
import { Confirm, Menu, Container, Header } from './basic';
import AddWidget from '../containers/AddWidget';
import WidgetsList from './WidgetsList';
import useWidgetsFilter from './useWidgetsFilter';
import { useBoolean } from '../utils/hooks';

const SortableMenu = SortableContainer(Menu);
const SortableMenuItem = SortableElement(Menu.Item);

export default function Tabs({
    tabs,
    isEditMode,
    onTabMoved,
    onTabUpdated,
    onTabAdded,
    onTabRemoved,
    onWidgetAdded,
    onWidgetRemoved,
    onWidgetUpdated,
    onLayoutSectionRemoved
}) {
    const [activeTab, setActiveTab] = useState(Math.max(_.findIndex(tabs, { isDefault: true }), 0));
    const [tabIndexToRemove, setTabIndexToRemove] = useState();
    const [isTabsRemovalDialogShown, showTabsRemovalDialog, hideTabsRemovalDialog] = useBoolean();

    const filterWidgets = useWidgetsFilter();

    function removeTab(tabIndex) {
        if (tabIndex < activeTab || (tabIndex === activeTab && tabs.length - 1 === activeTab)) {
            setActiveTab(activeTab - 1);
        }
        onTabRemoved(tabIndex);
    }

    const activeTabWidgets = filterWidgets(tabs[activeTab].widgets);

    return (
        <>
            <SortableMenu
                axis="x"
                lockAxis="x"
                tabular
                distance={1}
                helperClass="draggedTab"
                onSortEnd={({ oldIndex, newIndex }) => {
                    onTabMoved(oldIndex, newIndex);
                    if (oldIndex === activeTab) setActiveTab(newIndex);
                    else if (oldIndex < activeTab && newIndex >= activeTab) setActiveTab(activeTab - 1);
                    else if (oldIndex > activeTab && newIndex <= activeTab) setActiveTab(activeTab + 1);
                }}
                style={{ position: 'relative' }}
            >
                {_.map(tabs, (tab, tabIndex) => (
                    <SortableMenuItem
                        key={`${tabs.length}_${tabIndex}`}
                        index={tabIndex}
                        active={activeTab === tabIndex}
                        onClick={() => setActiveTab(tabIndex)}
                        disabled={!isEditMode}
                    >
                        {tab.name}
                        {isEditMode && (
                            <>
                                <EditTabModal
                                    tab={tab}
                                    onTabUpdate={(name, isDefault) => onTabUpdated(tabIndex, name, isDefault)}
                                    trigger={<EditModeButton style={{ padding: 3, marginLeft: 3 }} icon="edit" />}
                                />
                                {tabs.length > 1 && (
                                    <EditModeButton
                                        style={{ padding: 3, marginLeft: 3 }}
                                        icon="remove"
                                        onClick={e => {
                                            e.stopPropagation();
                                            if (_.isEmpty(tab.widgets)) removeTab(tabIndex);
                                            else setTabIndexToRemove(tabIndex);
                                        }}
                                    />
                                )}
                            </>
                        )}
                    </SortableMenuItem>
                ))}
                {isEditMode && (
                    <Menu.Item key="actions" style={{ right: 0, position: 'absolute', padding: '6px 0 0 0' }}>
                        <EditModeButton icon="add" onClick={onTabAdded} title="Add new tab" />
                        &nbsp;
                        <EditModeButton icon="remove" onClick={showTabsRemovalDialog} title="Remove tabs container" />
                    </Menu.Item>
                )}
            </SortableMenu>
            <span className="tabContent">
                {isEditMode && (
                    <div style={{ paddingTop: 15 }}>
                        <AddWidget
                            addButtonTitle="Add widget to this tab"
                            onWidgetAdded={(...params) => onWidgetAdded(...params, activeTab)}
                        />
                    </div>
                )}
                {_.isEmpty(activeTabWidgets) ? (
                    <Container className="emptyPage alignCenter" style={{ padding: '10rem 0' }}>
                        {isEditMode ? (
                            <Header size="large">
                                This tab is empty, <br />
                                don&apos;t be shy, give it a meaning!
                            </Header>
                        ) : (
                            <Header size="large">This tab is empty</Header>
                        )}
                    </Container>
                ) : (
                    <WidgetsList
                        widgets={activeTabWidgets}
                        onWidgetUpdated={onWidgetUpdated}
                        onWidgetRemoved={onWidgetRemoved}
                        isEditMode={isEditMode}
                    />
                )}
            </span>
            <Confirm
                open={!_.isNil(tabIndexToRemove)}
                onCancel={() => setTabIndexToRemove(null)}
                onConfirm={() => {
                    removeTab(tabIndexToRemove);
                    setTabIndexToRemove(null);
                }}
                header={`Are you sure you want to remove tab ${_.get(tabs, [tabIndexToRemove, 'name'])}?`}
                content="All widgets present in this tab will be removed as well"
            />
            <Confirm
                open={isTabsRemovalDialogShown}
                onCancel={hideTabsRemovalDialog}
                onConfirm={() => {
                    onLayoutSectionRemoved();
                    hideTabsRemovalDialog();
                }}
                header="Are you sure you want to remove this tabs container?"
                content="All tabs and widgets present in this container will be removed"
            />
        </>
    );
}

Tabs.propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.shape({ widgets: PropTypes.arrayOf(PropTypes.shape({})) })).isRequired,
    onWidgetUpdated: PropTypes.func.isRequired,
    onWidgetRemoved: PropTypes.func.isRequired,
    onWidgetAdded: PropTypes.func.isRequired,
    onTabAdded: PropTypes.func.isRequired,
    onTabRemoved: PropTypes.func.isRequired,
    onTabUpdated: PropTypes.func.isRequired,
    onTabMoved: PropTypes.func.isRequired,
    onLayoutSectionRemoved: PropTypes.func.isRequired,
    isEditMode: PropTypes.bool.isRequired
};
