/**
 * Created by kinneretzin on 11/09/2016.
 */

import { connect } from 'react-redux';

import Page from '../components/Page';
import { changePageDescription, changePageName, removePage, selectPage } from '../actions/page';
import { changeWidgetGridData } from '../actions/widgets';
import { setDrilldownContext } from '../actions/drilldownContext';
import { setEditMode } from '../actions/config';

const buildPagesList = (pages, drilldownContextArray, selectedPageId) => {
    const pagesMap = _.keyBy(pages, 'id');
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

    const pagesMap = _.keyBy(pages, 'id');
    const page = pagesMap[ownProps.pageId];
    const homePageId = pages[0].id;
    const pageId = page ? page.id : homePageId;

    const pageData = _.clone(_.find(pages, { id: pageId }));
    pageData.widgets = _.map(pageData.widgets, wd => {
        const w = _.clone(wd);
        w.definition = _.find(state.widgetDefinitions, { id: w.definition });
        return w;
    });
    pageData.name = ownProps.pageName || pageData.name;

    const pagesList = buildPagesList(pages, state.drilldownContext, pageId);
    return {
        page: pageData,
        pagesList,
        isEditMode: state.config.isEditMode || false
    };
};

const mapDispatchToProps = dispatch => {
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
                drilldownContext.push({ pageName: pagesList[i].name, context: pagesList[i].context });
            }
            dispatch(setDrilldownContext(drilldownContext));
            dispatch(selectPage(page.id, page.isDrillDown, page.context, page.name));
        },
        onPageRemoved: page => {
            dispatch(removePage(page.id));
        },
        onWidgetsGridDataChange: (pageId, widgetId, gridData) => {
            dispatch(changeWidgetGridData(pageId, widgetId, gridData));
        },
        onEditModeExit: () => {
            dispatch(setEditMode(false));
        }
    };
};

const PageW = connect(
    mapStateToProps,
    mapDispatchToProps
)(Page);

export default PageW;
