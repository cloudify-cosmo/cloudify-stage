/**
 * Created by kinneretzin on 29/08/2016.
 */

import React from 'react';
import { connect } from 'react-redux';
import WidgetsList from '../components/WidgetsList';

const mapStateToProps = (state, ownProps) => {

    // Attach the relevant plugin object to the widget (according to plugin name)
    var widgetsData = state.selectedPage && state.selectedPage.widgets ? state.selectedPage.widgets : [] && state.isEditMode;
    var widgets = _.map(widgetsData,(wd)=>{
        var w = _.clone(wd);
        w.plugin = _.find(state.plugins.items,{name:w.plugin});
        return w;
    });
    return {
        widgets: widgets
    };
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