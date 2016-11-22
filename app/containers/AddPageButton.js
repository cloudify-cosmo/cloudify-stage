/**
 * Created by kinneretzin on 29/08/2016.
 */

import React from 'react';
import { connect } from 'react-redux'
import {addPage} from '../actions/page'
import AddButton from '../components/AddButton'

//const mapStateToProps = (state, ownProps) => {
//    return {
//        active: ownProps.filter === state.visibilityFilter
//    }
//};

let nameIndex = 0;

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onClick: () => {
            dispatch(addPage('Page_'+(nameIndex++)))
        }
    }
};

let AddPageButton = ({onClick}) => {
    return (
        <AddButton onClick={onClick}>Add Page</AddButton>
    );
};

const AddPage = connect(
    null,
    mapDispatchToProps
)(AddPageButton);


export default AddPage