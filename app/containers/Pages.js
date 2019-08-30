/**
 * Created by kinneretzin on 29/08/2016.
 */

import React from 'react';
import { connect } from 'react-redux';
import PagesList from '../components/PagesList';
import { selectPage, removePage, reorderPage } from '../actions/page';
import { toogleSidebar } from '../actions/app';

const findSelectedRootPage = (pagesMap, selectedPageId) => {
    var _r = page => {
        if (!page.parent) {
            return page.id;
        }
        return _r(pagesMap[page.parent]);
    };

    return _r(pagesMap[selectedPageId]);
};

const mapStateToProps = (state, ownProps) => {
    const { pages } = state;
    const pagesMap = _.keyBy(pages, 'id');
    const page = pagesMap[ownProps.pageId];
    const homePageId = pages[0].id;
    const pageId = page ? page.id : homePageId;
    const selected = pages && pages.length > 0 ? findSelectedRootPage(pagesMap, pageId) : null;

    return {
        pages,
        selected
    };
};

function mergeProps(stateProps, dispatchProps, ownProps) {
    return {
        ...ownProps,
        ...dispatchProps,
        ...stateProps,
        onPageRemoved: page => {
            dispatchProps.onPageRemoved(page, stateProps.pages);
        }
    };
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onPageSelected: page => {
            dispatch(selectPage(page.id, page.isDrillDown));
        },
        onPageRemoved: (page, pages) => {
            dispatch(removePage(page.id));

            // If user removes current page, then navigate to home page
            if (ownProps.pageId === page.id) {
                if (ownProps.pageId === ownProps.homePageId) {
                    dispatch(selectPage(pages[1].id, false));
                } else {
                    dispatch(selectPage(ownProps.homePageId, false));
                }
            }
        },
        onPageReorder: (pageIndex, newPageIndex) => {
            dispatch(reorderPage(pageIndex, newPageIndex));
        },
        onSidebarClose: () => {
            dispatch(toogleSidebar());
        }
    };
};

const Pages = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(PagesList);

export default Pages;
