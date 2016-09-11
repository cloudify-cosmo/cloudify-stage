/**
 * Created by kinneretzin on 08/09/2016.
 */


import React from 'react';
import { connect } from 'react-redux'
import AddWidgetButton from '../components/AddWidgetButton';
import AddWidgetPopup from '../components/AddWidgetPopup';

const mapStateToProps = (state, ownProps) => {
    return {
        plugins: state.plugins.items
    }
};

let nameIndex = 0;

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onWidgetAdded: (widgetDef) => {
            //dispatch(addPage('Page_'+(nameIndex++)))
        },
        onPluginInstalled : ()=> {
            // dispatch

        }
    }
};

let AddWidgetComponent = ({plugins,onWidgetAdded,onPluginInstalled}) => {
    return (
        <div>
            <AddWidgetButton/>
            <AddWidgetPopup plugins={plugins} onWidgetAdded={onWidgetAdded} onPluginInstalled={onPluginInstalled}/>
        </div>
    );
};

const AddWidget = connect(
    mapStateToProps,
    mapDispatchToProps
)(AddWidgetComponent);


export default AddWidget