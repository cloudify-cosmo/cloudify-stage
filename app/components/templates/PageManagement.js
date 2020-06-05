/**
 * Created by pposel on 19/09/2017.
 */

import React, { useEffect, useState } from 'react';
import { push } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import v4 from 'uuid/v4';
import { Alert, Breadcrumb, Button, Divider, EditableLabel, ErrorMessage, Menu, Segment, Sidebar } from '../basic';
import EditModeBubble from '../EditModeBubble';
import PageContent from '../PageContent';
import { createPageId, drillDownWarning, savePage, setActive, setPageEditMode } from '../../actions/templateManagement';
import StageUtils from '../../utils/stageUtils';

export default function PageManagement({ pageId, isEditMode }) {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setActive(true));
        return () => dispatch(setActive(false));
    }, []);

    useEffect(() => {
        dispatch(setPageEditMode(isEditMode));
        return () => dispatch(setPageEditMode(false));
    }, []);

    const showDrillDownWarn = useSelector(state => !!state.templateManagement.showDrillDownWarn);
    const pageDefs = useSelector(state => state.templates.pagesDef);
    const widgetDefinitions = useSelector(state => state.widgetDefinitions);

    const [page, setPage] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        const managedPage = _.cloneDeep(pageDefs[pageId]) || {};
        managedPage.id = pageId;

        const invalidWidgetNames = [];

        function toWidgetInstances(widgets) {
            const widgetInstances = [];

            _.each(widgets, widget => {
                const widgetDefinition = _.find(widgetDefinitions, { id: widget.definition });

                if (widgetDefinition) {
                    widget.id = v4();
                    widget.configuration = { ...StageUtils.buildConfig(widgetDefinition), ...widget.configuration };
                    widget.definition = widgetDefinition;
                    widget.width = widget.width || widgetDefinition.initialWidth;
                    widget.height = widget.height || widgetDefinition.initialHeight;
                    widgetInstances.push(widget);
                } else {
                    invalidWidgetNames.push(widget.name);
                }
            });

            return widgetInstances;
        }

        managedPage.widgets = toWidgetInstances(managedPage.widgets);
        _.each(managedPage.tabs, tab => {
            tab.widgets = toWidgetInstances(tab.widgets);
        });

        if (invalidWidgetNames.length) {
            setError(`Page template contains invalid widgets definitions: ${_.join(invalidWidgetNames, ', ')}`);
        }

        setPage(managedPage);
    }, [pageId]);

    if (!page) {
        return null;
    }

    function findWidget(criteria) {
        return (
            _.find(page.widgets, criteria) ||
            _(page.tabs)
                .flatMap('widgets')
                .find(criteria)
        );
    }

    const onWidgetUpdated = (id, params) => {
        const updatedPage = _.clone(page);
        const widget = findWidget({ id });
        Object.assign(widget, params);
        setPage(updatedPage);
    };
    const onTemplateNavigate = () => dispatch(push('/template_management'));
    const onWidgetAdded = (name, widgetDefinition, tabIndex) => {
        const widgetInstance = {
            id: v4(),
            name,
            width: widgetDefinition.initialWidth,
            height: widgetDefinition.initialHeight,
            configuration: StageUtils.buildConfig(widgetDefinition),
            definition: widgetDefinition
        };
        if (!_.isNil(tabIndex)) {
            page.tabs[tabIndex].widgets.push(widgetInstance);
        } else {
            page.widgets.push(widgetInstance);
        }
        setPage(_.clone(page));
    };
    const onWidgetRemoved = id => {
        const updatedPage = _.clone(page);
        updatedPage.widgets = _.reject(updatedPage.widgets, { id });
        _.each(updatedPage.tabs, tab => {
            tab.widgets = _.reject(tab.widgets, { id });
        });
        setPage(updatedPage);
    };
    const onPageSave = () => {
        dispatch(savePage(page));
    };
    const onPageNameChange = pageName => {
        const updatedPage = _.clone(page);
        updatedPage.name = pageName;
        if (!updatedPage.oldId) {
            updatedPage.oldId = updatedPage.id;
            updatedPage.id = createPageId(pageName, pageDefs);
        }
        setPage(updatedPage);
    };
    const onCloseDrillDownWarning = () => {
        dispatch(drillDownWarning(false));
    };
    const onTabAdded = () => {
        const updatedPage = _.cloneDeep(page);
        updatedPage.tabs = updatedPage.tabs || [];
        updatedPage.tabs.push({ name: 'New Tab', widgets: [] });
        if (updatedPage.tabs.length === 1) {
            updatedPage.tabs.push({ name: 'New Tab', widgets: [] });
        }
        setPage(updatedPage);
    };
    const onTabRemoved = tabIndex => {
        const updatedPage = _.clone(page);
        updatedPage.tabs = _.without(updatedPage.tabs, _.nth(updatedPage.tabs, tabIndex));
        setPage(updatedPage);
    };
    const onTabUpdated = (tabIndex, name, isDefault) => {
        let tabs = [...page.tabs];
        if (isDefault) {
            tabs = _.map(tabs, tab => ({ ...tab, isDefault: false }));
        }
        tabs[tabIndex] = { ...tabs[tabIndex], name, isDefault };
        setPage({ ...page, tabs });
    };

    const isWidgetMaximized = findWidget({ maximized: true });

    $('body')
        .css({ overflow: isWidgetMaximized ? 'hidden' : 'inherit' })
        .scrollTop(0);

    return (
        <div className="main">
            <div className="sidebarContainer">
                <Sidebar visible as={Menu} vertical size="small">
                    <div className="pages">
                        <Menu.Item link className="pageMenuItem">
                            {page.name}
                        </Menu.Item>
                        <Menu.Item link className="pageMenuItem" />
                    </div>
                </Sidebar>
            </div>

            <div className="page">
                <Segment basic className={`fullHeight ${isWidgetMaximized ? 'maximizeWidget' : ''}`}>
                    <div>
                        <Breadcrumb className="breadcrumbLineHeight">
                            <Breadcrumb.Section onClick={onTemplateNavigate}>Template management</Breadcrumb.Section>
                            <Breadcrumb.Divider />
                            <Breadcrumb.Section active>
                                <EditableLabel
                                    value={page.name}
                                    placeHolder="You must fill a page name"
                                    className="section active pageTitle"
                                    enabled={isEditMode}
                                    onChange={onPageNameChange}
                                />
                            </Breadcrumb.Section>
                        </Breadcrumb>
                    </div>
                    <Divider />

                    <ErrorMessage error={error} />

                    <PageContent
                        onTabAdded={onTabAdded}
                        onTabRemoved={onTabRemoved}
                        onTabUpdated={onTabUpdated}
                        onWidgetUpdated={onWidgetUpdated}
                        onWidgetRemoved={onWidgetRemoved}
                        onWidgetAdded={onWidgetAdded}
                        page={page}
                        isEditMode={isEditMode}
                    />

                    <EditModeBubble
                        onDismiss={onTemplateNavigate}
                        header={isEditMode ? 'Page management' : 'Page preview'}
                    >
                        {isEditMode ? (
                            <>
                                <Button basic content="Save" icon="save" onClick={onPageSave} />
                                <Button basic content="Cancel" icon="remove" onClick={onTemplateNavigate} />
                            </>
                        ) : (
                            <Button basic content="Exit" icon="sign out" onClick={onTemplateNavigate} />
                        )}
                    </EditModeBubble>
                </Segment>
            </div>

            <Alert
                open={showDrillDownWarn}
                content="Drill down action is not available in the template management"
                onDismiss={onCloseDrillDownWarning}
            />
        </div>
    );
}

PageManagement.propTypes = {
    pageId: PropTypes.string.isRequired,
    isEditMode: PropTypes.bool
};

PageManagement.defaultProps = {
    isEditMode: false
};
