// @ts-nocheck File not migrated fully to TS
/**
 * Created by kinneretzin on 29/08/2016.
 */

import { connect } from 'react-redux';

import { find } from 'lodash';
import PagesList from '../components/PagesList';
import {
    selectPage,
    removePageWithChildren,
    reorderPage,
    createPagesMap,
    removeSinglePageMenuItem
} from '../actions/page';

const findSelectedRootPageId = (pagesMap, selectedPageId) => {
    const getParentPageId = page => {
        if (!page.parent) {
            return page.id;
        }
        return getParentPageId(pagesMap[page.parent]);
    };

    return getParentPageId(pagesMap[selectedPageId]);
};

const mapStateToProps = (state, ownProps) => {
    const { pages } = state;
    const pagesMap = createPagesMap(pages);
    const page = pagesMap[ownProps.pageId];
    const homePageId = pages[0].id;
    const pageId = page ? page.id : homePageId;
    const selected = pages && pages.length > 0 ? findSelectedRootPageId(pagesMap, pageId) : null;

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
        onItemRemoved: pageListItem => {
            dispatchProps.onItemRemoved(pageListItem, stateProps.pages);
        }
    };
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onPageSelected: page => {
            dispatch(selectPage(page.id, page.isDrillDown));
        },
        onItemRemoved: (pageListItem, pages) => {
            const pagesMap = createPagesMap(pages);
            const selectedRootPageId = findSelectedRootPageId(pagesMap, ownProps.pageId);

            if (pageListItem.type === 'page') {
                // Check if user removes current page
                if (selectedRootPageId === pageListItem.id) {
                    // Check if current page is home page
                    if (selectedRootPageId === ownProps.homePageId) {
                        dispatch(selectPage(pages[1].id, false));
                    } else {
                        dispatch(selectPage(ownProps.homePageId, false));
                    }
                }

                dispatch(removePageWithChildren(pageListItem));
            } else {
                // Check if current page is in group being removed
                if (includes(pageListItem.pages, selectedRootPageId)) {
                    // Select first page that is not in the group
                    dispatch(selectPage(find(pagesMap, page => !includes(pageListItem.pages, selectedRootPageId)).id));
                }

                dispatch(removeSinglePageMenuItem(pageListItem));
            }
        },
        onPageReorder: (pageIndex, newPageIndex) => {
            dispatch(reorderPage(pageIndex, newPageIndex));
        }
    };
};

const Pages = connect(mapStateToProps, mapDispatchToProps, mergeProps)(PagesList);

export default Pages;
