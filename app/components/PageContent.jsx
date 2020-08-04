import PropTypes from 'prop-types';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import WidgetsList from './WidgetsList';
import { Confirm, Container, Header, Menu } from './basic';
import AddWidget from '../containers/AddWidget';
import EditModeButton from './EditModeButton';
import EditTabModal from './EditTabModal';
import './PageContent.css';
import stageUtils from '../utils/stageUtils';

const SortableMenu = SortableContainer(Menu);
const SortableMenuItem = SortableElement(Menu.Item);

export default function PageContent({
    onWidgetUpdated,
    onWidgetRemoved,
    onWidgetAdded,
    onTabAdded,
    onTabRemoved,
    onTabUpdated,
    onTabMoved,
    page,
    isEditMode
}) {
    const manager = useSelector(state => state.manager);

    const [activeTab, setActiveTab] = useState(0);
    const [tabIndexToRemove, setTabIndexToRemove] = useState();

    const updateActiveTab = () => setActiveTab(Math.max(_.findIndex(page.tabs, { isDefault: true }), 0));

    useEffect(() => {
        updateActiveTab();
    }, []);

    useEffect(() => {
        if (!isEditMode) updateActiveTab();
    }, [page]);

    function filterWidgets(widgetsContainer) {
        return _.chain(widgetsContainer)
            .get('widgets')
            .filter(
                widget =>
                    widget.definition &&
                    stageUtils.isUserAuthorized(widget.definition.permission, manager) &&
                    stageUtils.isWidgetPermitted(widget.definition.supportedEditions, manager)
            )
            .value();
    }

    function createWidgetList(widgets) {
        return (
            <WidgetsList
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

    const pageWidgets = filterWidgets(page);
    const activeTabWidgets = filterWidgets(_.nth(page.tabs, activeTab));

    return (
        <>
            {isEditMode && <AddWidget onWidgetAdded={onWidgetAdded} />}
            {_.isEmpty(pageWidgets) && _.isEmpty(page.tabs) ? (
                <Container className="emptyPage alignCenter" style={{ padding: '10rem 0' }}>
                    {isEditMode ? (
                        <Header size="large">
                            This page is empty, <br />
                            don&apos;t be shy, give it a meaning!
                        </Header>
                    ) : (
                        <Header size="large">This page is empty</Header>
                    )}
                </Container>
            ) : (
                createWidgetList(pageWidgets)
            )}
            <div style={{ height: 15 }} />
            {!_.isEmpty(page.tabs) && (
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
                    >
                        {_.map(page.tabs, (tab, tabIndex) => (
                            <SortableMenuItem
                                key={`${page.tabs.length}_${tabIndex}`}
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
                                            trigger={
                                                <EditModeButton style={{ padding: 3, marginLeft: 3 }} icon="edit" />
                                            }
                                        />
                                        <EditModeButton
                                            style={{ padding: 3, marginLeft: 3 }}
                                            icon="remove"
                                            onClick={e => {
                                                e.stopPropagation();
                                                if (_.isEmpty(tab.widgets)) removeTab(tabIndex);
                                                else setTabIndexToRemove(tabIndex);
                                            }}
                                        />
                                    </>
                                )}
                            </SortableMenuItem>
                        ))}
                        {isEditMode && (
                            <Menu.Item key="add">
                                <EditModeButton icon="add" onClick={onTabAdded} />
                            </Menu.Item>
                        )}
                    </SortableMenu>
                    <span className="tabContent">
                        {isEditMode && (
                            <div style={{ paddingTop: 15 }}>
                                <AddWidget onWidgetAdded={(...params) => onWidgetAdded(...params, activeTab)} />
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
                            createWidgetList(activeTabWidgets)
                        )}
                    </span>
                </>
            )}
            {_.isEmpty(page.tabs) && isEditMode && (
                <EditModeButton
                    icon="add"
                    labelPosition="left"
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
    onTabMoved: PropTypes.func.isRequired,
    page: PropTypes.shape({
        widgets: PropTypes.arrayOf(PropTypes.shape({})),
        tabs: PropTypes.arrayOf(PropTypes.shape({ widgets: PropTypes.arrayOf(PropTypes.shape({})) }))
    }).isRequired,
    isEditMode: PropTypes.bool.isRequired
};
