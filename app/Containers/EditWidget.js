/**
 * Created by kinneretzin on 08/09/2016.
 */


import React from 'react';
import { connect } from 'react-redux'
import EditWidgetIcon from '../components/EditWidgetIcon';
import EditWidgetModal from '../components/EditWidgetModal';

const mapStateToProps = (state, ownProps) => {
    return {
        plugins: state.plugins.items
    }
};

let nameIndex = 0;

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onWidgetEdited: (widgetDef) => {
            //dispatch(addPage('Page_'+(nameIndex++)))
        },
        onPluginInstalled : ()=> {
            // dispatch

        }
    }
};

let EditWidgetComponent = ({plugins,onWidgetEdited,onPluginInstalled}) => {
    return (
        <div>
            <EditWidgetIcon/>
            <EditWidgetModal plugins={plugins} onWidgetEdited={onWidgetEdited} onPluginInstalled={onPluginInstalled}/>
        </div>
    );
};

const EditWidget = connect(
    mapStateToProps,
    mapDispatchToProps
)(EditWidgetComponent);


export default EditWidget