/**
 * Created by kinneretzin on 11/09/2016.
 */

import React from 'react';
import { connect } from 'react-redux';
import Page from '../components/Page';

const mapStateToProps = (state, ownProps) => {
    var pageData = _.clone(_.find(state.pages,{id:ownProps.pageId}));
    var widgets = _.map(pageData.widgets,(wd)=>{
        var w = _.clone(wd);
        w.plugin = _.find(state.plugins.items,{name:w.plugin});
        return w;
    });
    pageData.widgets = widgets;

    return {
        page: pageData
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    }
};

const PageW = connect(
    mapStateToProps,
    mapDispatchToProps
)(Page);


export default PageW
