/**
 * Created by kinneretzin on 11/09/2016.
 */

import _ from 'lodash';
import { connect } from 'react-redux';

import Page from '../components/Page';
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

const buildPagesList = (pages, drilldownContextArray, selectedPageId) => {
    const pagesMap = createPagesMap(pages);
    const pagesList = [];
    let index = drilldownContextArray.length - 1;

    const updatePagesListWith = page => {
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

const mapStateToProps = (state, ownProps) => {
    const { pages } = state;

    const pagesMap = createPagesMap(pages);
    const page = pagesMap[ownProps.pageId];
    const homePageId = pages[0].id;
    const pageId = page ? page.id : homePageId;

    const pageData = _.cloneDeep(_.find(pages, { id: pageId }));

    function assignWidgetDefinition(widget) {
        widget.definition = _.find(state.widgetDefinitions, {
            id: widget.definition
        });
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

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onPageNameChange: (page, newName) => {
            dispatch(changePageName(page, newName));
        },
        onPageDescriptionChange: (pageId, newDescription) => {
            dispatch(changePageDescription(pageId, newDescription));
        },
        onPageSelected: (page, pagesList, index) => {
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
        onWidgetAdded: (layoutSection, name, widgetDefinition, tabIndex) => {
            dispatch(addWidget(ownProps.pageId, layoutSection, tabIndex, { name }, widgetDefinition));
        },
        onTabAdded: layoutSection => dispatch(addTab(ownProps.pageId, layoutSection)),
        onTabRemoved: (layoutSection, tabIndex) => dispatch(removeTab(ownProps.pageId, layoutSection, tabIndex)),
        onTabUpdated: (layoutSection, tabIndex, name, isDefault) =>
            dispatch(updateTab(ownProps.pageId, layoutSection, tabIndex, name, isDefault)),
        onTabMoved: (layoutSection, oldTabIndex, newTabIndex) =>
            dispatch(moveTab(ownProps.pageId, layoutSection, oldTabIndex, newTabIndex)),
        onEditModeExit: () => {
            dispatch(setEditMode(false));
        },
        onWidgetUpdated: (widgetId, params) => {
            dispatch(updateWidget(ownProps.pageId, widgetId, params));
        },
        onWidgetRemoved: widgetId => {
            dispatch(removeWidget(ownProps.pageId, widgetId));
        },
        onLayoutSectionAdded: layoutSection => dispatch(addLayoutSectionToPage(ownProps.pageId, layoutSection)),
        onLayoutSectionRemoved: layoutSection => dispatch(removeLayoutSectionFromPage(ownProps.pageId, layoutSection))
    };
};

const PageW = connect(mapStateToProps, mapDispatchToProps)(Page);

export default PageW;
