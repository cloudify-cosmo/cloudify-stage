/**
 * Created by kinneretzin on 29/08/2016.
 */

import React from 'react';
import { connect } from 'react-redux';
import PagesList from '../components/PagesList';
import {selectPage} from '../actions/page';
import { push } from 'react-router-redux';
import {removePage} from '../actions/page';

const findSelectedRootPage = (pages,selectedPageId) => {
    var pagesMap = _.keyBy(pages,'id');

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
    var pageId = "0";
    if (page)
    {
        pageId = page.id;
    }
    var selected = findSelectedRootPage(state.pages,pageId);

    return {
        pages: state.pages,
        selected :selected
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onPageSelected: (page) => {
            dispatch(selectPage(page.id));
        },
        onPageRemoved: (page) => {
            dispatch(removePage(page.id));
        }
    }
};

const Pages = connect(
    mapStateToProps,
    mapDispatchToProps
)(PagesList);


export default Pages