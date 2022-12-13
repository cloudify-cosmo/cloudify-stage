import React from 'react';
import { isEmpty, map, noop, wrap } from 'lodash';
import i18n from 'i18next';
import WidgetsList from './WidgetsList';
import { Confirm } from '../../basic';
import type { AddWidgetModalProps } from '../../AddWidgetModal';
import AddWidgetModal from '../../AddWidgetModal';
import './PageContent.css';
import type { TabsProps } from '../../Tabs';
import Tabs from '../../Tabs';
import useWidgetsFilter from '../../useWidgetsFilter';
import EditModeButton from '../../EditModeButton';
import { useResettableState } from '../../../utils/hooks';
import Consts from '../../../utils/consts';
import EmptyContainerMessage from '../../EmptyContainerMessage';
import type { PageProps } from '../../Page';
import type { TemplatePageDefinition } from '../../../actions/templateManagement/pages';

export interface PageContentProps {
    onWidgetUpdated?: PageProps['onWidgetUpdated'];
    onWidgetRemoved?: PageProps['onWidgetRemoved'];
    onWidgetAdded?: PageProps['onWidgetAdded'];
    onTabAdded?: PageProps['onTabAdded'];
    onTabRemoved?: PageProps['onTabRemoved'];
    onTabUpdated?: PageProps['onTabUpdated'];
    onTabMoved?: PageProps['onTabMoved'];
    onLayoutSectionAdded?: PageProps['onLayoutSectionAdded'];
    onLayoutSectionRemoved?: PageProps['onLayoutSectionRemoved'];
    page: TemplatePageDefinition;
    isEditMode?: PageProps['isEditMode'];
}

export default function PageContent({
    onWidgetUpdated = noop,
    onWidgetRemoved = noop,
    onWidgetAdded = noop,
    onTabAdded = noop,
    onTabRemoved = noop,
    onTabUpdated = noop,
    onTabMoved = noop,
    onLayoutSectionAdded = noop,
    onLayoutSectionRemoved = noop,
    page,
    isEditMode = false
}: PageContentProps) {
    const filterWidgets = useWidgetsFilter();
    const [layoutSectionToRemove, setLayoutSectionToRemove, resetLayoutSectionToRemove] = useResettableState<
        number | null
    >(null);

    return (
        <>
            {isEmpty(page.layout) ? (
                <EmptyContainerMessage isEditMode={isEditMode} containerTypeLabel="page" />
            ) : (
                map(page.layout, (layoutSection, layoutSectionIdx) => (
                    <React.Fragment key={layoutSectionIdx}>
                        {isEditMode && (
                            <div style={{ marginBottom: 15 }}>
                                <EditModeButton
                                    icon="add"
                                    labelPosition="left"
                                    content={i18n.t('editMode.insertWidgetsContainer', 'Insert Widgets Container')}
                                    onClick={() =>
                                        onLayoutSectionAdded(
                                            { type: Consts.LAYOUT_TYPE.WIDGETS, content: [] },
                                            layoutSectionIdx
                                        )
                                    }
                                />
                                <EditModeButton
                                    icon="add"
                                    labelPosition="left"
                                    content={i18n.t('editMode.insertTabsContainer', 'Insert Tabs Container')}
                                    onClick={() =>
                                        onLayoutSectionAdded(
                                            {
                                                type: Consts.LAYOUT_TYPE.TABS,
                                                content: map(new Array(2), () => ({ name: 'New Tab', widgets: [] }))
                                            },
                                            layoutSectionIdx
                                        )
                                    }
                                />
                            </div>
                        )}
                        <div style={{ marginBottom: 15, border: isEditMode ? '1px dashed' : 'none' }}>
                            {layoutSection.type === Consts.LAYOUT_TYPE.WIDGETS ? (
                                <>
                                    {isEditMode && (
                                        <>
                                            <AddWidgetModal
                                                addButtonTitle={i18n.t(
                                                    'editMode.addWidget.addToContainerButtonTitle',
                                                    'Add widget to this widgets container'
                                                )}
                                                onWidgetAdded={(
                                                    ...args: Parameters<AddWidgetModalProps['onWidgetAdded']>
                                                ) => onWidgetAdded(layoutSectionIdx, ...args, null)}
                                            />
                                            <EditModeButton
                                                icon="remove"
                                                onClick={() => setLayoutSectionToRemove(layoutSectionIdx)}
                                                title={i18n.t(
                                                    'editMode.removeWidgetsContainer',
                                                    'Remove widgets container'
                                                )}
                                                style={{ float: 'right', margin: 1 }}
                                            />
                                        </>
                                    )}
                                    <WidgetsList
                                        widgets={filterWidgets(layoutSection.content)}
                                        onWidgetUpdated={onWidgetUpdated}
                                        onWidgetRemoved={onWidgetRemoved}
                                        isEditMode={isEditMode}
                                    />
                                </>
                            ) : (
                                <Tabs
                                    tabs={layoutSection.content}
                                    isEditMode={isEditMode}
                                    onTabAdded={() => onTabAdded(layoutSectionIdx)}
                                    onTabMoved={wrap(layoutSectionIdx, onTabMoved)}
                                    onTabRemoved={wrap(layoutSectionIdx, onTabRemoved)}
                                    onTabUpdated={(...args: Parameters<TabsProps['onTabUpdated']>) =>
                                        onTabUpdated(layoutSectionIdx, ...args)
                                    }
                                    onWidgetUpdated={onWidgetUpdated}
                                    onWidgetRemoved={onWidgetRemoved}
                                    onWidgetAdded={(...args: Parameters<TabsProps['onWidgetAdded']>) =>
                                        onWidgetAdded(layoutSectionIdx, ...args)
                                    }
                                    onLayoutSectionRemoved={wrap(layoutSectionIdx, onLayoutSectionRemoved)}
                                />
                            )}
                        </div>
                    </React.Fragment>
                ))
            )}
            {isEditMode && (
                <>
                    <EditModeButton
                        icon="add"
                        labelPosition="left"
                        content={i18n.t('editMode.addWidgetsContainer', 'Add Widgets Container')}
                        onClick={() =>
                            onLayoutSectionAdded({ type: Consts.LAYOUT_TYPE.WIDGETS, content: [] }, page.layout.length)
                        }
                    />
                    <EditModeButton
                        icon="add"
                        labelPosition="left"
                        content={i18n.t('editMode.addTabsContainer', 'Add Tabs Container')}
                        onClick={() =>
                            onLayoutSectionAdded(
                                {
                                    type: Consts.LAYOUT_TYPE.TABS,
                                    content: map(new Array(2), () => ({
                                        name: i18n.t('editMode.tabs.newTab', 'New Tab'),
                                        widgets: []
                                    }))
                                },
                                page.layout.length
                            )
                        }
                    />
                </>
            )}
            {layoutSectionToRemove !== null && (
                <Confirm
                    open
                    onCancel={resetLayoutSectionToRemove}
                    onConfirm={() => {
                        onLayoutSectionRemoved(layoutSectionToRemove);
                        resetLayoutSectionToRemove();
                    }}
                    header={i18n.t(
                        'editMode.containerRemovalModal.header',
                        'Are you sure you want to remove this widgets container?'
                    )}
                    content={i18n.t(
                        'editMode.containerRemovalModal.message',
                        'All widgets present in this container will be removed'
                    )}
                />
            )}
        </>
    );
}
