/**
 * Created by kinneretzin on 29/08/2016.
 */

import React from 'react';
import { connect } from 'react-redux';
import PagesList from '../components/PagesList';
import {selectPage} from '../actions/page';
import { push } from 'react-router-redux';

const mapStateToProps = (state, ownProps) => {
    return {
        pages: state.pages,
        selected :ownProps.pageId
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onPageSelected: (page) => {
            dispatch(selectPage(page));
            dispatch(push('/page/'+page.id));
        }
    }
};

const Pages = connect(
    mapStateToProps,
    mapDispatchToProps
)(PagesList);


export default Pages