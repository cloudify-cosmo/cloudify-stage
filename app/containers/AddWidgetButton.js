/**
 * Created by kinneretzin on 01/09/2016.
 */

import React from 'react';
import { connect } from 'react-redux'
import {addWidget} from '../actions/widgets'
import AddButton from '../components/AddButton'

let nameIndex = 0;

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onClick: () => {
            dispatch(addWidget('Widget_'+(nameIndex++)))
        }
    }
};

let AddWidgetButton = ({onClick}) => {
    return (
        <AddButton onClick={onClick}>Add Widget</AddButton>
    );
};

const AddWidget = connect(
    null,
    mapDispatchToProps
)(AddWidgetButton);


export default AddWidget
