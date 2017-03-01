/**
 * Created by addihorowitz on 19/09/2016.
 */

import React from 'react';
import { connect } from 'react-redux';
import Home from '../components/Home';
import {clearContext,setValue} from '../actions/context';

const mapStateToProps = (state, ownProps) => {
    var selectedPageId = ownProps.params.pageId;
    var pages = state.pages;

    return {
        selectedPage : _.find(pages,{id:selectedPageId}),
        pageId: selectedPageId,
        contextParams: ownProps.location.query
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onClearContext: ()=>{
            dispatch(clearContext());
        },
        onSetContextValue: (key,value)=>{
            dispatch(setValue(key,value));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
