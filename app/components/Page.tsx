import _ from 'lodash';
import React, { Component } from 'react';
import i18n from 'i18next';
import { connect, ConnectedProps } from 'react-redux';
import type { ThunkDispatch } from 'redux-thunk';
import type { AnyAction } from 'redux';

import Breadcrumbs from './Breadcrumbs';
import EditModeBubble from './EditModeBubble';
import { Button, EditableLabel } from './basic';
import { PageContent } from './shared/widgets';
import {
    addLayoutSectionToPage,
    addTab,
    changePageDescription,
    changePageName,
    createPagesMap,
    LayoutSection,
    moveTab,
    PageDefinition,
    removeLayoutSectionFromPage,
    removeTab,
    selectPage,
    updateTab
} from '../actions/page';
import { addWidget, removeWidget, updateWidget } from '../actions/widgets';
import { setDrilldownContext } from '../actions/drilldownContext';
import { setEditMode } from '../actions/config';
import type { ReduxState } from '../reducers';
import type { WidgetDefinition } from '../utils/StageAPI';
import type { DrilldownContext } from '../reducers/drilldownContextReducer';

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

interface PageDefinitionWithContext extends PageDefinition {
    context: any;
}

const buildPagesList = (pages: PageDefinition[], drilldownContextArray: DrilldownContext[], selectedPageId: string) => {
    const pagesMap = createPagesMap(pages);
    const pagesList: PageDefinitionWithContext[] = [];
    let index = drilldownContextArray.length - 1;
    /**
     * NOTE: drilldownContextArray is from outermost to innermost pages
     * pagesList should be from innermost to outermost pages.
     * Thus, the order is reversed.
     */
    // TODO(RD-1982): build the pages list in the same order as drilldownContextArray

    const updatePagesListWith = (page: PageDefinition) => {
        const basePage = !page ? pages[0] : page;
        const pageDrilldownContext = index >= 0 ? drilldownContextArray[index] : null;
        index -= 1;

        pagesList.push({
            ...basePage,
            name: pageDrilldownContext?.pageName || basePage.name,
            context: pageDrilldownContext?.context
        });

        if (basePage.parent) {
            updatePagesListWith(pagesMap[basePage.parent]);
        }
    };

    updatePagesListWith(pagesMap[selectedPageId]);

    return pagesList;
};

const mapStateToProps = (state: ReduxState, ownProps: PageOwnProps) => {
    const { pages } = state;

    const pagesMap = createPagesMap(pages);
    const page = pagesMap[ownProps.pageId];
    const homePageId = pages[0].id;
    const pageId = page ? page.id : homePageId;

    // NOTE: assume page will always be found
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const pageData: PageDefinition = _.cloneDeep(_.find(pages, { id: pageId })!);

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
            // NOTE: the pagesList are from outermost to innermost
            const drilldownContext: DrilldownContext[] = [];
            // Skip the last page, because we are sending the context of this one to the select page
            for (let i = 0; i <= index - 1; i += 1) {
                drilldownContext.push({
                    pageName: pagesList[i].name,
                    context: pagesList[i].context
                });
            }
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
