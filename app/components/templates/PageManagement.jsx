/**
 * Created by pposel on 19/09/2017.
 */

import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { push } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import v4 from 'uuid/v4';
import { arrayMove } from 'react-sortable-hoc';
import { Alert, Breadcrumb, Button, Divider, EditableLabel, ErrorMessage, Menu, Segment, Sidebar } from '../basic';
import EditModeBubble from '../EditModeBubble';
import PageContent from '../PageContent';
import { createPageId, drillDownWarning, savePage, setActive, setPageEditMode } from '../../actions/templateManagement';
import StageUtils from '../../utils/stageUtils';
import { useErrors } from '../../utils/hooks';
import { forEachWidget } from '../../actions/page';

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
    const { errors, setMessageAsError, clearErrors, setErrors } = useErrors();

    useEffect(() => {
        const managedPage = _.cloneDeep(pageDefs[pageId]) || {};
        managedPage.id = pageId;

        const invalidWidgetNames = [];

        function toWidgetInstance(widget) {
            const widgetDefinition = _.find(widgetDefinitions, { id: widget.definition });

            if (widgetDefinition) {
                widget.id = v4();
                widget.configuration = { ...StageUtils.buildConfig(widgetDefinition), ...widget.configuration };
                widget.definition = widgetDefinition;
                widget.width = widget.width || widgetDefinition.initialWidth;
                widget.height = widget.height || widgetDefinition.initialHeight;
                return widget;
            }
            invalidWidgetNames.push(widget.name);
            return null;
        }

        forEachWidget(managedPage, toWidgetInstance);

        if (invalidWidgetNames.length) {
            setErrors(`Page template contains invalid widgets definitions: ${_.join(invalidWidgetNames, ', ')}`);
        }

        setPage(managedPage);
    }, [pageId]);

    if (!page) {
        return null;
    }

    function findWidget(criteria) {
        return (
            _(page.layout).flatMap('content').find(criteria) ||
            _(page.layout).flatMap('content').flatMap('widgets').find(criteria)
        );
    }

    function updatePage() {
        setPage(_.clone(page));
    }

    const onWidgetUpdated = (id, params) => {
        const widget = findWidget({ id });
        Object.assign(widget, params);
        updatePage();
    };
    const onTemplateNavigate = () => dispatch(push('/template_management'));
    const onWidgetAdded = (layoutSection, name, widgetDefinition, tabIndex) => {
        const widgetInstance = {
            id: v4(),
            name,
            width: widgetDefinition.initialWidth,
            height: widgetDefinition.initialHeight,
            configuration: StageUtils.buildConfig(widgetDefinition),
            definition: widgetDefinition
        };
        if (!_.isNil(tabIndex)) {
            page.layout[layoutSection].content[tabIndex].widgets.push(widgetInstance);
        } else {
            page.layout[layoutSection].content.push(widgetInstance);
        }
        updatePage();
    };
    const onWidgetRemoved = id => {
        forEachWidget(page, widget => (widget.id === id ? null : widget));
        updatePage();
    };
    const onPageSave = () => {
        dispatch(savePage(page)).catch(setMessageAsError);
    };
    const onPageNameChange = pageName => {
        page.name = pageName;
        if (!page.oldId) {
            page.oldId = page.id;
            page.id = createPageId(pageName, pageDefs);
        }
        updatePage();
    };
    const onCloseDrillDownWarning = () => {
        dispatch(drillDownWarning(false));
    };
    const onTabAdded = layoutSection => {
        page.layout[layoutSection].content.push({ name: 'New Tab', widgets: [] });
        updatePage();
    };
    const onTabRemoved = (layoutSection, tabIndex) => {
        page.layout[layoutSection].content = _.without(
            page.layout[layoutSection].content,
            _.nth(page.layout[layoutSection].content, tabIndex)
        );
        updatePage();
    };
    const onTabUpdated = (layoutSection, tabIndex, name, isDefault) => {
        const tabs = page.layout[layoutSection].content;
        if (isDefault) {
            _.each(tabs, tab => {
                tab.isDefault = false;
            });
        }
        Object.assign(tabs[tabIndex], { name, isDefault });
        updatePage();
    };
    const onTabMoved = (layoutSection, oldTabIndex, newTabIndex) => {
        page.layout[layoutSection].content = arrayMove(page.layout[layoutSection].content, oldTabIndex, newTabIndex);
        updatePage();
    };
    const onLayoutSectionRemoved = layoutSection => {
        page.layout = _.without(page.layout, _.nth(page.layout, layoutSection));
        updatePage();
    };
    const onLayoutSectionAdded = layoutSection => {
        page.layout.push(layoutSection);
        updatePage();
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

                    <ErrorMessage error={errors} onDismiss={clearErrors} />

                    <PageContent
                        onTabAdded={onTabAdded}
                        onTabRemoved={onTabRemoved}
                        onTabUpdated={onTabUpdated}
                        onWidgetUpdated={onWidgetUpdated}
                        onWidgetRemoved={onWidgetRemoved}
                        onWidgetAdded={onWidgetAdded}
                        onTabMoved={onTabMoved}
                        onLayoutSectionRemoved={onLayoutSectionRemoved}
                        onLayoutSectionAdded={onLayoutSectionAdded}
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
