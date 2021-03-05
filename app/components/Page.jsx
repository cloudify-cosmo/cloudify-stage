/**
 * Created by kinneretzin on 29/08/2016.
 */

import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import i18n from 'i18next';
import { connect } from 'react-redux';

import Breadcrumbs from './Breadcrumbs';
import EditModeBubble from './EditModeBubble';
import { Button, EditableLabel } from './basic';
import PageContent from './PageContent';
import LayoutPropType from '../utils/props/LayoutPropType';
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

class Page extends Component {
    shouldComponentUpdate(nextProps) {
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

        $('body')
            .css({ overflow: maximizeWidget ? 'hidden' : 'inherit' })
            .scrollTop(0);

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

Page.propTypes = {
    page: PropTypes.shape({
        id: PropTypes.string,
        description: PropTypes.string,
        layout: LayoutPropType
    }).isRequired,
    pagesList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    onPageNameChange: PropTypes.func.isRequired,
    onPageDescriptionChange: PropTypes.func.isRequired,
    onWidgetUpdated: PropTypes.func.isRequired,
    onWidgetRemoved: PropTypes.func.isRequired,
    onWidgetAdded: PropTypes.func.isRequired,
    onTabAdded: PropTypes.func.isRequired,
    onTabRemoved: PropTypes.func.isRequired,
    onTabUpdated: PropTypes.func.isRequired,
    onTabMoved: PropTypes.func.isRequired,
    onPageSelected: PropTypes.func.isRequired,
    onEditModeExit: PropTypes.func.isRequired,
    onLayoutSectionRemoved: PropTypes.func.isRequired,
    onLayoutSectionAdded: PropTypes.func.isRequired,
    isEditMode: PropTypes.bool.isRequired
};

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
        onLayoutSectionAdded: (layoutSection, position) =>
            dispatch(addLayoutSectionToPage(ownProps.pageId, layoutSection, position)),
        onLayoutSectionRemoved: layoutSection => dispatch(removeLayoutSectionFromPage(ownProps.pageId, layoutSection))
    };
};

const PageW = connect(mapStateToProps, mapDispatchToProps)(Page);

export default PageW;
