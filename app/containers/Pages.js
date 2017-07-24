/**
 * Created by kinneretzin on 29/08/2016.
 */

import React from 'react';
import { connect } from 'react-redux';
import PagesList from '../components/PagesList';
import {selectPage, removePage, reorderPage} from '../actions/page';

const findSelectedRootPage = (pagesMap,selectedPageId) => {
    var _r = (page) => {
        if (!page.parent) {
            return page.id;
        }
        return _r(pagesMap[page.parent]);
    };

    return _r(pagesMap[selectedPageId]);
};

const mapStateToProps = (state, ownProps) => {
    var pagesMap = _.keyBy(state.pages,'id');
    var page = pagesMap[ownProps.pageId];
    var homePageId = state.pages[0].id;
    var pageId = page ? page.id : homePageId;
    var selected = state.pages && state.pages.length > 0 ? findSelectedRootPage(pagesMap,pageId) : null;

    return {
        pages: state.pages,
        selected :selected
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onPageSelected: (page) => {
            dispatch(selectPage(page.id,page.isDrillDown));
        },
        onPageRemoved: (page) => {
            dispatch(removePage(page.id));

            // If user removes current page, then navigate to home page
            if (ownProps.pageId === page.id) {
                dispatch(selectPage(ownProps.homePageId,false));
            }
        },
        onPageReorder: (pageIndex, newPageIndex) => {
            dispatch(reorderPage(pageIndex, newPageIndex));
        }
    }
};

const Pages = connect(
    mapStateToProps,
    mapDispatchToProps
)(PagesList);


export default Pages