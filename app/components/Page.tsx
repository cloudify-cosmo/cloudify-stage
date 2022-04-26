import { cloneDeep, isEqual } from 'lodash';
import React, { Component } from 'react';
import i18n from 'i18next';
import { connect, ConnectedProps } from 'react-redux';
import type { ThunkDispatch } from 'redux-thunk';
import type { AnyAction } from 'redux';

import styled from 'styled-components';
import Breadcrumbs from './Breadcrumbs';
import EditModeBubble from './EditModeBubble';
import { Button, EditableLabel } from './basic';
import { PageContent } from './shared/widgets';
import {
    addLayoutSectionToPage,
    addTab,
    changePageDescription,
    LayoutSection,
    moveTab,
    PageDefinition,
    removeLayoutSectionFromPage,
    removeTab,
    updateTab
} from '../actions/page';
import { changePageMenuItemName, createPagesMap, selectPage } from '../actions/pageMenu';
import { addWidget, removeWidget, updateWidget } from '../actions/widgets';
import { setDrilldownContext } from '../actions/drilldownContext';
import { setEditMode } from '../actions/config';
import type { ReduxState } from '../reducers';
import type { WidgetDefinition } from '../utils/StageAPI';
import type { DrilldownContext } from '../reducers/drilldownContextReducer';
import StageUtils from '../utils/stageUtils';
import { collapsedSidebarWidth } from './sidebar/SideBar';

export interface PageOwnProps {
    pageId: string;
    pageName: string;
}

type PageProps = PageOwnProps & PropsFromRedux;

const StyledContainer = styled.div`
    .widget.maximize {
        margin-left: ${collapsedSidebarWidth};
    }
`;

class Page extends Component<PageProps, never> {
    shouldComponentUpdate(nextProps: PageProps) {
        const { isEditMode, page } = this.props;
        return !isEqual(page, nextProps.page) || isEditMode !== nextProps.isEditMode;
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
        const hasMaximizedWidget =
            _(page.layout).flatMap('content').find({ maximized: true }) ||
            _(page.layout).flatMap('content').flatMap('widgets').find({ maximized: true });

        document.body.style.overflow = hasMaximizedWidget ? 'hidden' : 'inherit';
        window.scroll(0, 0);

        return (
            <StyledContainer
                className={StageUtils.combineClassNames('fullHeight', hasMaximizedWidget && 'maximizeWidget')}
            >
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
            </StyledContainer>
        );
    }
}

export interface PageDefinitionWithContext extends PageDefinition {
    context: any;
}

const buildPagesList = (
    pagesMap: Record<string, PageDefinition>,
    startingPage: PageDefinition,
    drilldownContextArray: DrilldownContext[],
    selectedPageId: string
) => {
    const pagesList: PageDefinitionWithContext[] = [];
    /**
     * NOTE: drilldownContextArray is from outermost to innermost pages
     * pagesList should be from innermost to outermost pages.
     * Thus, the order is reversed.
     */
    // TODO(RD-1982): build the pages list in the same order as drilldownContextArray

    const updatePagesListWith = (page: PageDefinition, drilldownContextIndex: number) => {
        const basePage = !page ? startingPage : page;
        const pageDrilldownContext = drilldownContextIndex >= 0 ? drilldownContextArray[drilldownContextIndex] : null;

        pagesList.unshift({
            ...basePage,
            name: pageDrilldownContext?.pageName || basePage.name,
            context: pageDrilldownContext?.context
        });

        if (basePage.parent) {
            updatePagesListWith(pagesMap[basePage.parent], drilldownContextIndex - 1);
        }
    };

    updatePagesListWith(pagesMap[selectedPageId], drilldownContextArray.length - 1);

    return pagesList;
};

const mapStateToProps = (state: ReduxState, ownProps: PageOwnProps) => {
    const { pages } = state;
    const pagesMap = createPagesMap(pages);
    const selectedPage = pagesMap[ownProps.pageId];
    const homePageId = pages[0].id;
    const selectedPageId = selectedPage ? selectedPage.id : homePageId;
    const pageData: PageDefinition = cloneDeep(pagesMap[selectedPageId]);

    pageData.name = ownProps.pageName || pageData.name;

    const pagesList = buildPagesList(
        pagesMap,
        pages.find(page => page.type === 'page') as PageDefinition,
        state.drilldownContext,
        selectedPageId
    );

    // eslint-disable-next-line
    console.log(pagesList);

    return {
        page: pageData,
        pagesList,
        isEditMode: state.config.isEditMode || false
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<ReduxState, never, AnyAction>, ownProps: PageOwnProps) => {
    return {
        onPageNameChange: (page: PageDefinition, newName: string) => {
            dispatch(changePageMenuItemName(page.id, newName));
        },
        onPageDescriptionChange: (pageId: string, newDescription: string) => {
            dispatch(changePageDescription(pageId, newDescription));
        },
        onPageSelected: (page: PageDefinitionWithContext, pagesList: PageDefinitionWithContext[], index: number) => {
            // TODO: Adjust that functionality
            // NOTE: the pagesList are from outermost to innermost
            const drilldownContext = pagesList.slice(0, index).map(
                (pageInList): DrilldownContext => ({
                    pageName: pageInList.name,
                    context: pageInList.context
                })
            );
            dispatch(setDrilldownContext(drilldownContext));
            dispatch(selectPage(page.id, page.isDrillDown, page.context, page.name));
        },
        onWidgetAdded: (layoutSection: number, name: string, widgetDefinition: WidgetDefinition, tabIndex: number) => {
            dispatch(addWidget(ownProps.pageId, layoutSection, tabIndex, { name }, widgetDefinition));
        },
        onTabAdded: (layoutSection: number) => dispatch(addTab(ownProps.pageId, layoutSection)),
        onTabRemoved: (layoutSection: number, tabIndex: number) =>
            dispatch(removeTab(ownProps.pageId, layoutSection, tabIndex)),
        onTabUpdated: (layoutSection: number, tabIndex: number, name: string, isDefault: boolean) =>
            dispatch(updateTab(ownProps.pageId, layoutSection, tabIndex, name, isDefault)),
        onTabMoved: (layoutSection: number, oldTabIndex: number, newTabIndex: number) =>
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
        onLayoutSectionRemoved: (layoutSection: number) =>
            dispatch(removeLayoutSectionFromPage(ownProps.pageId, layoutSection))
    };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Page);
