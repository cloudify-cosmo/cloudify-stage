/**
 * Created by kinneretzin on 29/08/2016.
 */

import React from 'react';
import { connect } from 'react-redux';
import PagesList from '../components/PagesList';
import {selectPage} from '../actions/page';
import { push } from 'react-router-redux';

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

    var selected = findSelectedRootPage(state.pages,ownProps.pageId);

    return {
        pages: state.pages,
        selected :selected
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onPageSelected: (page) => {
            dispatch(selectPage(page.id));
        }
    }
};

const Pages = connect(
    mapStateToProps,
    mapDispatchToProps
)(PagesList);


export default Pages