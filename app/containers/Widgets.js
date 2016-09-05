/**
 * Created by kinneretzin on 29/08/2016.
 */

import React from 'react';
import { connect } from 'react-redux';
import WidgetsList from '../components/WidgetsList';

const mapStateToProps = (state, ownProps) => {
    return {
        widgets: state.selectedPage.widgets
    }
};

//const mapDispatchToProps = (dispatch, ownProps) => {
//    return {
//        onPageSelected: (page) => {
//            dispatch(selectPage(page));
//            dispatch(push('/page/'+page.id));
//        }
//    }
//};

const Widgets = connect(
    mapStateToProps,
    {}//mapDispatchToProps
)(WidgetsList);


export default Widgets