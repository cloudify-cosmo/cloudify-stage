/**
 * Created by pposel on 19/09/2017.
 */

import React, { useEffect, useState } from 'react';
import { push } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import v4 from 'uuid/v4';
import Const from '../../utils/consts';
import { Alert, Breadcrumb, Button, Divider, EditableLabel, ErrorMessage, Segment } from '../basic';
import EditModeBubble from '../EditModeBubble';
import PageContent from '../PageContent';
import { createPageId, drillDownWarning, savePage, setActive, setPageEditMode } from '../../actions/templateManagement';
import StageUtils from '../../utils/stageUtils';
import AddWidget from '../../containers/AddWidget';

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
        const managedPage = _.cloneDeep(pageDefs[pageId]);
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
                    widgetInstances.push(widget);
                } else {
                    invalidWidgetNames.push(widget.name);
                }
            });

            return widgetInstances;
        }

        managedPage.widdgets = toWidgetInstances(managedPage.widgets);
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
    const onWidgetAdded = (name, widgetDefinition) => {
        const updatedPage = _.clone(page);
        updatedPage.widgets.push({
            id: v4(),
            name,
            width: widgetDefinition.initialWidth,
            height: widgetDefinition.initialHeight,
            configuration: StageUtils.buildConfig(widgetDefinition),
            definition: widgetDefinition
        });
        setPage(updatedPage);
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

    const isWidgetMaximized = findWidget({ maximized: true });

    $('body')
        .css({ overflow: isWidgetMaximized ? 'hidden' : 'inherit' })
        .scrollTop(0);

    return (
        <div className="main">
            <div className="sidebarContainer">
                <div className="ui visible left vertical sidebar menu small basic">
                    <div className="pages">
                        <div className="item link pageMenuItem">{page.name}</div>
                        <div className="item link pageMenuItem" />
                    </div>
                </div>
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
                        onWidgetUpdated={onWidgetUpdated}
                        onWidgetRemoved={onWidgetRemoved}
                        page={page}
                        isEditMode={isEditMode}
                    />

                    <EditModeBubble
                        onDismiss={onTemplateNavigate}
                        header={isEditMode ? 'Page management' : 'Page preview'}
                    >
                        {isEditMode ? (
                            <>
                                <AddWidget onWidgetAdded={onWidgetAdded} />
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
