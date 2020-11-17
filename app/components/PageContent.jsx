import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import i18n from 'i18next';
import WidgetsList from './WidgetsList';
import { Confirm } from './basic';
import AddWidget from '../containers/AddWidget';
import './PageContent.css';
import Tabs from './Tabs';
import useWidgetsFilter from './useWidgetsFilter';
import EditModeButton from './EditModeButton';
import { useResettableState } from '../utils/hooks';
import LayoutPropType from '../utils/props/LayoutPropType';
import Consts from '../utils/consts';
import EmptyContainerMessage from './EmptyContainerMessage';

export default function PageContent({
    onWidgetUpdated,
    onWidgetRemoved,
    onWidgetAdded,
    onTabAdded,
    onTabRemoved,
    onTabUpdated,
    onTabMoved,
    onLayoutSectionAdded,
    onLayoutSectionRemoved,
    page,
    isEditMode
}) {
    const filterWidgets = useWidgetsFilter();
    const [layoutSectionToRemove, setLayoutSectionToRemove, resetLayoutSectionToRemove] = useResettableState();

    return (
        <>
            {_.isEmpty(page.layout) ? (
                <EmptyContainerMessage isEditMode={isEditMode} containerTypeLabel="page" />
            ) : (
                _.map(page.layout, (layoutSection, layoutSectionIdx) => (
                    <>
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
                                                content: _.map(new Array(2), () => ({ name: 'New Tab', widgets: [] }))
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
                                            <AddWidget
                                                addButtonTitle={i18n.t(
                                                    'editMode.addWidget.addToContainerButtonTitle',
                                                    'Add widget to this widgets container'
                                                )}
                                                onWidgetAdded={_.wrap(layoutSectionIdx, onWidgetAdded)}
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
                                    onTabAdded={_.wrap(layoutSectionIdx, onTabAdded)}
                                    onTabMoved={_.wrap(layoutSectionIdx, onTabMoved)}
                                    onTabRemoved={_.wrap(layoutSectionIdx, onTabRemoved)}
                                    onTabUpdated={_.wrap(layoutSectionIdx, onTabUpdated)}
                                    onWidgetUpdated={onWidgetUpdated}
                                    onWidgetRemoved={onWidgetRemoved}
                                    onWidgetAdded={_.wrap(layoutSectionIdx, onWidgetAdded)}
                                    onLayoutSectionRemoved={_.wrap(layoutSectionIdx, onLayoutSectionRemoved)}
                                />
                            )}
                        </div>
                    </>
                ))
            )}
            {isEditMode && (
                <>
                    <EditModeButton
                        icon="add"
                        labelPosition="left"
                        content={i18n.t('editMode.addWidgetsContainer', 'Add Widgets Container')}
                        onClick={() =>
                            onLayoutSectionAdded({ type: Consts.LAYOUT_TYPE.WIDGETS, content: [] }, _.size(page.layout))
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
                                    content: _.map(new Array(2), () => ({
                                        name: i18n.t('editMode.tabs.newTab', 'New Tab'),
                                        widgets: []
                                    }))
                                },
                                _.size(page.layout)
                            )
                        }
                    />
                </>
            )}
            <Confirm
                open={!_.isNil(layoutSectionToRemove)}
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
    onTabMoved: PropTypes.func.isRequired,
    onLayoutSectionAdded: PropTypes.func.isRequired,
    onLayoutSectionRemoved: PropTypes.func.isRequired,
    page: PropTypes.shape({
        id: PropTypes.string,
        layout: LayoutPropType
    }).isRequired,
    isEditMode: PropTypes.bool.isRequired
};
