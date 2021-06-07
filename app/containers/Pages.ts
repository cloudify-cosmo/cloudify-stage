/**
 * Created by kinneretzin on 29/08/2016.
 */

import { connect } from 'react-redux';

import PagesList from '../components/PagesList';
import { selectPage, removePage, reorderPage, createPagesMap } from '../actions/page';

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
            const pagesMap = createPagesMap(pages);
            const selectedRootPageId = findSelectedRootPageId(pagesMap, ownProps.pageId);

            // Check if user removes current page
            if (selectedRootPageId === page.id) {
                // Check if current page is home page
                if (selectedRootPageId === ownProps.homePageId) {
                    dispatch(selectPage(pages[1].id, false));
                } else {
                    dispatch(selectPage(ownProps.homePageId, false));
                }
            }

            dispatch(removePage(page));
        },
        onPageReorder: (pageIndex, newPageIndex) => {
            dispatch(reorderPage(pageIndex, newPageIndex));
        }
    };
};

const Pages = connect(mapStateToProps, mapDispatchToProps, mergeProps)(PagesList);

export default Pages;
