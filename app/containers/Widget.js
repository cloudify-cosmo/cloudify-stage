/**
 * Created by kinneretzin on 11/09/2016.
 */

import React from 'react';
import { connect } from 'react-redux';
import Widget from '../components/Widget';
import {renameWidget} from '../actions/widgets';
import {setValue} from '../actions/context';

const mapStateToProps = (state, ownProps) => {
    return {
        context: state.context
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onWidgetNameChange: (pageId,widgetId,newName)=> {
            dispatch(renameWidget(pageId,widgetId,newName));
        },
        setContextValue: (key,value) => {
            dispatch(setValue(key,value));
        }
    }
};

const WidgetW = connect(
    mapStateToProps,
    mapDispatchToProps
)(Widget);


export default WidgetW
