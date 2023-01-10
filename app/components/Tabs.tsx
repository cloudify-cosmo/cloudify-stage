import React from 'react';
import { get, isEmpty } from 'lodash';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import type { ButtonProps } from 'semantic-ui-react';

import EditTabModal from './EditTabModal';
import EditModeButton from './EditModeButton';
import { Confirm, Menu } from './basic';
import AddWidgetModal from './AddWidgetModal';
import WidgetsList from './shared/widgets/WidgetsList';
import useWidgetsFilter from './useWidgetsFilter';
import { useBoolean, useResettableState } from '../utils/hooks';
import EmptyContainerMessage from './EmptyContainerMessage';
import useDefaultTabIndex from './useDefaultTabIndex';
import type { SimpleWidgetObj, TabContent } from '../actions/page';
import type { WidgetOwnProps } from './shared/widgets/Widget';
import type { WidgetDefinition } from '../utils/StageAPI';
import StageUtils from '../utils/stageUtils';

const SortableMenu = SortableContainer(Menu);
const SortableMenuItem = SortableElement(Menu.Item);

const t = StageUtils.getT('editMode');

export interface TabsProps {
    tabs: TabContent[];
    isEditMode: boolean;
    onTabMoved: (oldIndex: number, newIndex: number) => void;
    onTabUpdated: (index: number, name: string, isDefault: boolean) => void;
    onTabAdded: ButtonProps['onClick'];
    onTabRemoved: (index: number) => void;
    onWidgetAdded: (name: string, widget: WidgetDefinition, activeTabIndex: number) => void;
    onWidgetRemoved: WidgetOwnProps<unknown>['onWidgetRemoved'];
    onWidgetUpdated: WidgetOwnProps<unknown>['onWidgetUpdated'];
    onLayoutSectionRemoved: () => void;
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
                        <EditModeButton icon="add" onClick={onTabAdded} title={t('tabs.add')} />
                        &nbsp;
                        <EditModeButton
                            icon="remove"
                            onClick={showTabsRemovalDialog}
                            title={t('removeTabsContainer')}
                        />
                    </Menu.Item>
                )}
            </SortableMenu>
            <span className="tabContent">
                {isEditMode && (
                    <div style={{ paddingTop: 15 }}>
                        <AddWidgetModal
                            addButtonTitle={t('addWidget.addToTabButtonTitle')}
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
                open={tabIndexToRemove >= 0}
                onCancel={() => resetTabIndexToRemove()}
                onConfirm={() => {
                    removeTab(tabIndexToRemove);
                    resetTabIndexToRemove();
                }}
                header={t('tabs.removeModal.header', {
                    tabName: get(tabs, [tabIndexToRemove, 'name'])
                })}
                content={t('tabs.removeModal.message')}
            />
            <Confirm
                open={isTabsRemovalDialogShown}
                onCancel={hideTabsRemovalDialog}
                onConfirm={() => {
                    onLayoutSectionRemoved();
                    hideTabsRemovalDialog();
                }}
                header={t('tabRemovalModal.header')}
                content={t('tabRemovalModal.message')}
            />
        </>
    );
}
