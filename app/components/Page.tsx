import _ from 'lodash';
import React, { Component } from 'react';
import i18n from 'i18next';
import { connect, ConnectedProps } from 'react-redux';
import type { ThunkDispatch } from 'redux-thunk';
import type { AnyAction } from 'redux';

import Breadcrumbs from './Breadcrumbs';
import EditModeBubble from './EditModeBubble';
import { Button, EditableLabel } from './basic';
import PageContent from './PageContent';
import {
    addLayoutSectionToPage,
    addTab,
    changePageDescription,
    changePageName,
    createPagesMap,
    forEachWidget,
    moveTab,
    removeLayoutSectionFromPage,
    removeTab,
    selectPage,
    updateTab
} from '../actions/page';
import { addWidget, removeWidget, updateWidget } from '../actions/widgets';
import { setDrilldownContext } from '../actions/drilldownContext';
import { setEditMode } from '../actions/config';
import type { ReduxState } from '../reducers';
import type { Widget, WidgetDefinition } from '../utils/StageAPI';

export interface PageOwnProps {
    pageId: string;
    pageName: string;
}

type PageProps = PageOwnProps & PropsFromRedux;

class Page extends Component<PageProps, never> {
    shouldComponentUpdate(nextProps: PageProps) {
        const { isEditMode, page } = this.props;
        return !_.isEqual(page, nextProps.page) || isEditMode !== nextProps.isEditMode;
    }

    render() {
        const {
            isEditMode,
            onEditModeExit,
            onPageDescriptionChange,
            onPageNameChange,
            onPageSelected,
            onWidgetAdded,
            onWidgetUpdated,
            onWidgetRemoved,
            onTabAdded,
            onTabRemoved,
            onTabUpdated,
            onTabMoved,
            onLayoutSectionAdded,
            onLayoutSectionRemoved,
            page,
            pagesList
        } = this.props;
        const maximizeWidget =
            _(page.layout).flatMap('content').find({ maximized: true }) ||
            _(page.layout).flatMap('content').flatMap('widgets').find({ maximized: true });

        document.body.style.overflow = maximizeWidget ? 'hidden' : 'inherit';
        window.scroll(0, 0);

        return (
            <div className={`fullHeight ${maximizeWidget ? 'maximizeWidget' : ''}`}>
                <Breadcrumbs
                    pagesList={pagesList}
                    onPageNameChange={onPageNameChange}
                    isEditMode={isEditMode}
                    onPageSelected={onPageSelected}
                />
                <div>
                    <EditableLabel
                        value={page.description}
                        placeholder={i18n.t('page.description', 'Page description')}
                        className="pageDescription"
                        enabled={isEditMode}
                        onChange={newDesc => onPageDescriptionChange(page.id, newDesc)}
                        inputSize="mini"
                    />
                </div>
                <div className="ui divider" />
                <PageContent
                    page={page}
                    onWidgetUpdated={onWidgetUpdated}
                    onWidgetRemoved={onWidgetRemoved}
                    onWidgetAdded={onWidgetAdded}
                    onTabAdded={onTabAdded}
                    onTabRemoved={onTabRemoved}
                    onTabUpdated={onTabUpdated}
                    onTabMoved={onTabMoved}
                    onLayoutSectionAdded={onLayoutSectionAdded}
                    onLayoutSectionRemoved={onLayoutSectionRemoved}
                    isEditMode={isEditMode || false}
                />
                {isEditMode && (
                    <EditModeBubble onDismiss={onEditModeExit} header="Edit mode">
                        <Button
                            basic
                            content={i18n.t('editMode.exit', 'Exit')}
                            icon="sign out"
                            onClick={onEditModeExit}
                        />
                    </EditModeBubble>
                )}
            </div>
        );
    }
}

// NOTE: these should be extracted to appropriate reducers when those are migrated to TS
interface LayoutSection {
    type: 'widgets' | 'tabs';
    content: SimpleWidgetObj[];
}

interface PageDefinition {
    id: string;
    name: string;
    description: string;
    layout: LayoutSection[];
    isDrillDown: boolean;
    parent?: string;
}

interface PageDefinitionWithContext extends PageDefinition {
    context: any;
}

interface DrilldownContext {
    pageName?: string;
    context?: Record<string, any>;
}

const buildPagesList = (pages: PageDefinition[], drilldownContextArray: DrilldownContext[], selectedPageId: string) => {
    const pagesMap: Record<string, PageDefinition> = createPagesMap(pages);
    const pagesList: PageDefinitionWithContext[] = [];
    let index = drilldownContextArray.length - 1;

    const updatePagesListWith = (page: PageDefinition) => {
        const basePage = !page ? pages[0] : page;
        const pageDrilldownContext = index >= 0 ? drilldownContextArray[index] : {};
        index -= 1;

        pagesList.push({
            ...basePage,
            name: pageDrilldownContext.pageName || basePage.name,
            context: pageDrilldownContext.context
        });

        if (basePage.parent) {
            updatePagesListWith(pagesMap[basePage.parent]);
        }
    };

    updatePagesListWith(pagesMap[selectedPageId]);

    return pagesList;
};

type SimpleWidgetObj = Omit<Widget, 'definition'> & { definition: string };

const mapStateToProps = (state: ReduxState, ownProps: PageOwnProps) => {
    const { pages } = state;

    const pagesMap = createPagesMap(pages);
    const page = pagesMap[ownProps.pageId];
    const homePageId = pages[0].id;
    const pageId = page ? page.id : homePageId;

    const pageData = _.cloneDeep(_.find(pages, { id: pageId }));

    function assignWidgetDefinition(widget: SimpleWidgetObj) {
        // NOTE: assume the definition is always valid
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ((widget as unknown) as Widget).definition = _.find(state.widgetDefinitions, {
            id: widget.definition
        })!;
        return widget;
    }

    forEachWidget(pageData, assignWidgetDefinition);

    pageData.name = ownProps.pageName || pageData.name;

    const pagesList = buildPagesList(pages, state.drilldownContext, pageId);
    return {
        page: pageData,
        pagesList,
        isEditMode: state.config.isEditMode || false
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<ReduxState, never, AnyAction>, ownProps: PageOwnProps) => {
    return {
        onPageNameChange: (page: PageDefinition, newName: string) => {
            dispatch(changePageName(page, newName));
        },
        onPageDescriptionChange: (pageId: string, newDescription: string) => {
            dispatch(changePageDescription(pageId, newDescription));
        },
        onPageSelected: (page: PageDefinitionWithContext, pagesList: PageDefinitionWithContext[], index: number) => {
            const drilldownContext = [];
            // Starting from 1 cause the first page doesnt have any context and shouldnt be in the context array (only drilldown pages)
            // and also skip the last page, because we are sending the context of this one to the select page
            for (let i = 1; i <= index - 1; i += 1) {
                drilldownContext.push({
                    pageName: pagesList[i].name,
                    context: pagesList[i].context
                });
            }
            dispatch(setDrilldownContext(drilldownContext));
            dispatch(selectPage(page.id, page.isDrillDown, page.context, page.name));
        },
        onWidgetAdded: (
            layoutSection: LayoutSection,
            name: string,
            widgetDefinition: WidgetDefinition,
            tabIndex: number
        ) => {
            dispatch(addWidget(ownProps.pageId, layoutSection, tabIndex, { name }, widgetDefinition));
        },
        onTabAdded: (layoutSection: LayoutSection) => dispatch(addTab(ownProps.pageId, layoutSection)),
        onTabRemoved: (layoutSection: LayoutSection, tabIndex: number) =>
            dispatch(removeTab(ownProps.pageId, layoutSection, tabIndex)),
        onTabUpdated: (layoutSection: LayoutSection, tabIndex: number, name: string, isDefault: boolean) =>
            dispatch(updateTab(ownProps.pageId, layoutSection, tabIndex, name, isDefault)),
        onTabMoved: (layoutSection: LayoutSection, oldTabIndex: number, newTabIndex: number) =>
            dispatch(moveTab(ownProps.pageId, layoutSection, oldTabIndex, newTabIndex)),
        onEditModeExit: () => {
            dispatch(setEditMode(false));
        },
        onWidgetUpdated: (widgetId: string, params: Record<string, any>) => {
            dispatch(updateWidget(ownProps.pageId, widgetId, params));
        },
        onWidgetRemoved: (widgetId: string) => {
            dispatch(removeWidget(ownProps.pageId, widgetId));
        },
        onLayoutSectionAdded: (layoutSection: LayoutSection, position: number) =>
            dispatch(addLayoutSectionToPage(ownProps.pageId, layoutSection, position)),
        onLayoutSectionRemoved: (layoutSection: LayoutSection) =>
            dispatch(removeLayoutSectionFromPage(ownProps.pageId, layoutSection))
    };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Page);
