/**
 * Created by kinneretzin on 08/09/2016.
 */


import React from 'react';
import { connect } from 'react-redux'
import AddWidgetButton from '../components/AddWidgetButton';
import {addWidget} from '../actions/widgets';
import AddWidgetModal from '../components/AddWidgetModal';

const mapStateToProps = (state, ownProps) => {
    return {
        plugins: state.plugins,
        pageId: ownProps.pageId
    }
};

let nameIndex = 0;

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onWidgetAdded: (plugin) => {
            dispatch(addWidget(ownProps.pageId,plugin.name || 'Widget_'+(nameIndex++),plugin));
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
            <AddWidgetModal plugins={plugins} onWidgetAdded={onWidgetAdded} onPluginInstalled={onPluginInstalled}/>
        </div>
    );
};

const AddWidget = connect(
    mapStateToProps,
    mapDispatchToProps
)(AddWidgetComponent);


export default AddWidget