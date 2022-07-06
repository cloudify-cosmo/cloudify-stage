import React from 'react';
import { get, isEmpty, isNil } from 'lodash';
import i18n from 'i18next';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import PropTypes from 'prop-types';
import EditTabModal from './EditTabModal';
import EditModeButton from './EditModeButton';
import { Confirm, Menu } from './basic';
import AddWidget from '../containers/AddWidget';
import WidgetsList from './shared/widgets/WidgetsList';
import useWidgetsFilter from './useWidgetsFilter';
import { useBoolean, useResettableState } from '../utils/hooks';
import EmptyContainerMessage from './EmptyContainerMessage';
import useDefaultTabIndex from './useDefaultTabIndex';
import type { SimpleWidgetObj, TabContent } from '../actions/page';

const SortableMenu = SortableContainer(Menu);
const SortableMenuItem = SortableElement(Menu.Item);

// TODO Norbert: Update interface
interface TabsProps {
    tabs: TabContent[];
    isEditMode: any;
    onTabMoved: any;
    onTabUpdated: any;
    onTabAdded: any;
    onTabRemoved: any;
    onWidgetAdded: any;
    onWidgetRemoved: any;
    onWidgetUpdated: any;
    onLayoutSectionRemoved: any;
}

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
}: TabsProps) {
    const [activeTabIndex, setActiveTabIndex] = useDefaultTabIndex(tabs);
    const [tabIndexToRemove, setTabIndexToRemove, resetTabIndexToRemove] = useResettableState(-1);
    const [isTabsRemovalDialogShown, showTabsRemovalDialog, hideTabsRemovalDialog] = useBoolean();

    const filterWidgets = useWidgetsFilter();

    function removeTab(tabIndex: number) {
        if (tabIndex < activeTabIndex || (tabIndex === activeTabIndex && tabs.length - 1 === activeTabIndex)) {
            setActiveTabIndex(activeTabIndex - 1);
        }
        onTabRemoved(tabIndex);
    }

    const activeTabWidgets = filterWidgets(tabs[activeTabIndex].widgets);

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
                    if (oldIndex === activeTabIndex) setActiveTabIndex(newIndex);
                    else if (oldIndex < activeTabIndex && newIndex >= activeTabIndex)
                        setActiveTabIndex(activeTabIndex - 1);
                    else if (oldIndex > activeTabIndex && newIndex <= activeTabIndex)
                        setActiveTabIndex(activeTabIndex + 1);
                }}
                style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '1em 0' }}
            >
                {tabs.map((tab, tabIndex) => (
                    <SortableMenuItem
                        // eslint-disable-next-line react/no-array-index-key
                        key={`${tabs.length}_${tabIndex}`}
                        index={tabIndex}
                        active={activeTabIndex === tabIndex}
                        onClick={() => setActiveTabIndex(tabIndex)}
                        disabled={!isEditMode}
                        style={{
                            marginBottom: '-1px',
                            borderBottom: activeTabIndex === tabIndex ? 'none' : '1px solid #d4d4d5'
                        }}
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
                                            if (isEmpty(tab.widgets)) removeTab(tabIndex);
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
                        <EditModeButton
                            icon="add"
                            onClick={onTabAdded}
                            title={i18n.t('editMode.tabs.add', 'Add new tab')}
                        />
                        &nbsp;
                        <EditModeButton
                            icon="remove"
                            onClick={showTabsRemovalDialog}
                            title={i18n.t('editMode.removeTabsContainer', 'Remove tabs container')}
                        />
                    </Menu.Item>
                )}
            </SortableMenu>
            <span className="tabContent">
                {isEditMode && (
                    <div style={{ paddingTop: 15 }}>
                        <AddWidget
                            addButtonTitle={i18n.t('editMode.addWidget.addToTabButtonTitle', 'Add widget to this tab')}
                            // @ts-ignore AddWidget not yet fully migrated to TS
                            onWidgetAdded={(...params) => onWidgetAdded(...params, activeTabIndex)}
                        />
                    </div>
                )}
                {isEmpty(activeTabWidgets) ? (
                    <EmptyContainerMessage isEditMode={isEditMode} containerTypeLabel="tab" />
                ) : (
                    <WidgetsList
                        widgets={activeTabWidgets as SimpleWidgetObj[]}
                        onWidgetUpdated={onWidgetUpdated}
                        onWidgetRemoved={onWidgetRemoved}
                        isEditMode={isEditMode}
                    />
                )}
            </span>
            <Confirm
                open={!isNil(tabIndexToRemove)}
                onCancel={() => resetTabIndexToRemove()}
                onConfirm={() => {
                    removeTab(tabIndexToRemove);
                    resetTabIndexToRemove();
                }}
                header={i18n.t('editMode.tabs.removeModal.header', `Are you sure you want to remove tab {{tabName}}?`, {
                    tabName: get(tabs, [tabIndexToRemove, 'name'])
                })}
                content={i18n.t(
                    'editMode.tabs.removeModal.message',
                    'All widgets present in this tab will be removed as well'
                )}
            />
            <Confirm
                open={isTabsRemovalDialogShown}
                onCancel={hideTabsRemovalDialog}
                onConfirm={() => {
                    onLayoutSectionRemoved();
                    hideTabsRemovalDialog();
                }}
                header={i18n.t(
                    'editMode.tabRemovalModal.header',
                    'Are you sure you want to remove this tabs container?'
                )}
                content={i18n.t(
                    'editMode.tabRemovalModal.message',
                    'All tabs and widgets present in this container will be removed'
                )}
            />
        </>
    );
}

Tabs.propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.shape({ widgets: PropTypes.arrayOf(PropTypes.shape({})) })).isRequired,
    onWidgetUpdated: PropTypes.func,
    onWidgetRemoved: PropTypes.func.isRequired,
    onWidgetAdded: PropTypes.func.isRequired,
    onTabAdded: PropTypes.func.isRequired,
    onTabRemoved: PropTypes.func.isRequired,
    onTabUpdated: PropTypes.func.isRequired,
    onTabMoved: PropTypes.func.isRequired,
    onLayoutSectionRemoved: PropTypes.func.isRequired,
    isEditMode: PropTypes.bool.isRequired
};

Tabs.defaultProps = {
    onWidgetUpdated: undefined
};
