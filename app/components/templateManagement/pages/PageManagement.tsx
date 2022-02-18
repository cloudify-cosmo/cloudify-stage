import i18n from 'i18next';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { push } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import v4 from 'uuid/v4';
import { arrayMove } from 'react-sortable-hoc';
import type { ThunkDispatch } from 'redux-thunk';
import type { AnyAction } from 'redux';

import { SemanticICONS } from 'semantic-ui-react';
import styled from 'styled-components';
import { Alert, Breadcrumb, Button, Divider, EditableLabel, ErrorMessage, Menu, Segment, Sidebar } from '../../basic';
import EditModeBubble from '../../EditModeBubble';
import { PageContent } from '../../shared/widgets';
import { setTemplateManagementActive } from '../../../actions/templateManagement';
import { savePage, setDrillDownWarningActive, setPageEditMode } from '../../../actions/templateManagement/pages';
import StageUtils from '../../../utils/stageUtils';
import { useErrors } from '../../../utils/hooks';
import {
    forEachWidget,
    getWidgetDefinitionById,
    LayoutSection,
    SimpleWidgetObj,
    TabContent
} from '../../../actions/page';
import type { ReduxState } from '../../../reducers';
import type { WidgetDefinition } from '../../../utils/StageAPI';
import type { TemplatePageDefinition } from '../../../reducers/templatesReducer';
import useCreatePageId from './useCreatePageId';
import IconSelection from '../../sidebar/IconSelection';
import { expandedSidebarWidth } from '../../sidebar/SideBar';

export interface PageManagementProps {
    pageId: string;
    isEditMode?: boolean;
}

const StyledPageContainer = styled.div`
    margin-left: ${expandedSidebarWidth};
    .widget.maximize {
        margin-left: ${expandedSidebarWidth};
    }
`;

export default function PageManagement({ pageId, isEditMode = false }: PageManagementProps) {
    const dispatch = useDispatch<ThunkDispatch<ReduxState, never, AnyAction>>();
    const createPageId = useCreatePageId();

    useEffect(() => {
        dispatch(setTemplateManagementActive(true));
        // NOTE: use void to return `undefined` from the cleanup handler (fix a type error)
        return () => void dispatch(setTemplateManagementActive(false));
    }, []);

    useEffect(() => {
        dispatch(setPageEditMode(isEditMode));
        // NOTE: use void to return `undefined` from the cleanup handler (fix a type error)
        return () => void dispatch(setPageEditMode(false));
    }, []);

    const showDrillDownWarn = useSelector((state: ReduxState) => !!state.templateManagement.showDrillDownWarn);
    const pageDefs = useSelector((state: ReduxState) => state.templates.pagesDef);
    const widgetDefinitions = useSelector((state: ReduxState) => state.widgetDefinitions);

    /** NOTE: page may not match `TemplatePageDefinition` exactly: it may have an `id` property */
    const [page, setPage] = useState<TemplatePageDefinition & { id: string; oldId?: string }>();
    const { errors, setMessageAsError, clearErrors, setErrors } = useErrors();

    useEffect(() => {
        const managedPage = { ..._.cloneDeep(pageDefs[pageId]), id: pageId } || {};

        const invalidWidgetNames: string[] = [];

        function toWidgetInstance(widget: SimpleWidgetObj) {
            const widgetDefinition = getWidgetDefinitionById(widget.definition, widgetDefinitions);

            if (widgetDefinition) {
                widget.id = v4();
                widget.configuration = { ...StageUtils.buildConfig(widgetDefinition), ...widget.configuration };
                widget.width = widget.width || widgetDefinition.initialWidth;
                widget.height = widget.height || widgetDefinition.initialHeight;
                return widget;
            }
            invalidWidgetNames.push(widget.name);
            return null;
        }

        forEachWidget(managedPage, toWidgetInstance);

        if (invalidWidgetNames.length) {
            setErrors(
                i18n.t(
                    'templates.pageManagement.invalidWidgets',
                    `Page template contains invalid widgets definitions: {{widgetsList}}`,
                    { widgetsList: _.join(invalidWidgetNames, ', ') }
                )
            );
        }

        setPage(managedPage);
    }, [pageId]);

    if (!page) {
        return null;
    }

    function findWidget(criteria: any) {
        return (
            _(page?.layout).flatMap('content').find(criteria) ||
            _(page?.layout).flatMap('content').flatMap('widgets').find(criteria)
        );
    }

    function updatePage() {
        setPage(_.clone(page));
    }

    const onWidgetUpdated = (id: string, params: Partial<SimpleWidgetObj>) => {
        const widget = findWidget({ id });
        Object.assign(widget, params);
        updatePage();
    };
    const onTemplateNavigate = () => dispatch(push('/template_management'));
    const onWidgetAdded = (
        layoutSection: number,
        name: string,
        widgetDefinition: WidgetDefinition,
        tabIndex: number
    ) => {
        const widgetInstance: SimpleWidgetObj = {
            id: v4(),
            name,
            width: widgetDefinition.initialWidth,
            height: widgetDefinition.initialHeight,
            configuration: StageUtils.buildConfig(widgetDefinition),
            definition: widgetDefinition.id,
            x: 0,
            y: 0,
            drillDownPages: {},
            maximized: false
        };
        if (!_.isNil(tabIndex)) {
            (page.layout[layoutSection].content[tabIndex] as TabContent).widgets.push(widgetInstance);
        } else {
            (page.layout[layoutSection].content as SimpleWidgetObj[]).push(widgetInstance);
        }
        updatePage();
    };
    const onWidgetRemoved = (id: string) => {
        forEachWidget(page, widget => (widget.id === id ? null : widget));
        updatePage();
    };
    const onPageSave = () => {
        dispatch(savePage(page)).catch(setMessageAsError);
    };
    const onPageNameChange = (pageName: string) => {
        page.name = pageName;
        // NOTE: a single variable of type `any` to avoid typing `as any` multiple times
        const overridablePage: any = page;
        if (!overridablePage.oldId) {
            overridablePage.oldId = overridablePage.id;
            overridablePage.id = createPageId(pageName);
        }
        updatePage();
    };
    const onPageIconChange = (icon?: SemanticICONS) => {
        page.icon = icon;
        updatePage();
    };
    const onCloseDrillDownWarning = () => {
        dispatch(setDrillDownWarningActive(false));
    };
    const onTabAdded = (layoutSection: number) => {
        (page.layout[layoutSection].content as TabContent[]).push({
            name: i18n.t('editMode.tabs.newTab'),
            widgets: []
        });
        updatePage();
    };
    const onTabRemoved = (layoutSection: number, tabIndex: number) => {
        page.layout[layoutSection].content = _.without(
            page.layout[layoutSection].content,
            page.layout[layoutSection].content[tabIndex]
        ) as TabContent[] | SimpleWidgetObj[];
        updatePage();
    };
    const onTabUpdated = (layoutSection: number, tabIndex: number, name: string, isDefault: number) => {
        const tabs = page.layout[layoutSection].content as TabContent[];
        if (isDefault) {
            _.each(tabs, tab => {
                tab.isDefault = false;
            });
        }
        Object.assign(tabs[tabIndex], { name, isDefault });
        updatePage();
    };
    const onTabMoved = (layoutSection: number, oldTabIndex: number, newTabIndex: number) => {
        page.layout[layoutSection].content = arrayMove(
            page.layout[layoutSection].content as TabContent[],
            oldTabIndex,
            newTabIndex
        );
        updatePage();
    };
    const onLayoutSectionRemoved = (layoutSection: number) => {
        page.layout = _.without(page.layout, page.layout[layoutSection]);
        updatePage();
    };
    const onLayoutSectionAdded = (layoutSection: LayoutSection, position: number) => {
        page.layout = [..._.slice(page.layout, 0, position), layoutSection, ..._.slice(page.layout, position)];
        updatePage();
    };

    const isWidgetMaximized = findWidget({ maximized: true });

    document.body.style.overflow = isWidgetMaximized ? 'hidden' : 'inherit';
    window.scroll(0, 0);

    return (
        <div className="main">
            <div className="sidebarContainer">
                <Sidebar visible as={Menu} vertical size="small" style={{ width: expandedSidebarWidth }}>
                    <div className="pages">
                        <Menu.Item link className="pageMenuItem">
                            <IconSelection value={page.icon} onChange={onPageIconChange} enabled={isEditMode} />
                            {page.name}
                        </Menu.Item>
                        <Menu.Item link className="pageMenuItem" />
                    </div>
                </Sidebar>
            </div>

            <StyledPageContainer className="page">
                <Segment basic className={`fullHeight ${isWidgetMaximized ? 'maximizeWidget' : ''}`}>
                    <div>
                        <Breadcrumb className="breadcrumbLineHeight">
                            <Breadcrumb.Section onClick={onTemplateNavigate}>
                                {i18n.t('templates.pageManagement.breadcrumb', 'Template management')}
                            </Breadcrumb.Section>
                            <Breadcrumb.Divider />
                            <Breadcrumb.Section active>
                                <EditableLabel
                                    value={page.name}
                                    placeholder={i18n.t(
                                        'templates.pageManagement.pageNamePlaceholder',
                                        'You must fill a page name'
                                    )}
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
                        header={
                            isEditMode
                                ? i18n.t('templates.pageManagement.editHeader', 'Page management')
                                : i18n.t('templates.pageManagement.previewHeader', 'Page preview')
                        }
                    >
                        {isEditMode ? (
                            <>
                                <Button
                                    basic
                                    content={i18n.t('templates.pageManagement.save', 'Save')}
                                    icon="save"
                                    onClick={onPageSave}
                                />
                                <Button
                                    basic
                                    content={i18n.t('templates.pageManagement.cancel', 'Cancel')}
                                    icon="remove"
                                    onClick={onTemplateNavigate}
                                />
                            </>
                        ) : (
                            <Button
                                basic
                                content={i18n.t('templates.pageManagement.exit', 'Exit')}
                                icon="sign out"
                                onClick={onTemplateNavigate}
                            />
                        )}
                    </EditModeBubble>
                </Segment>
            </StyledPageContainer>

            <Alert
                open={showDrillDownWarn}
                content={i18n.t<string>(
                    'templates.pageManagement.drillDownWarning',
                    'Drill down action is not available in the template management'
                )}
                onDismiss={onCloseDrillDownWarning}
            />
        </div>
    );
}

PageManagement.propTypes = {
    pageId: PropTypes.string.isRequired,
    isEditMode: PropTypes.bool
};
