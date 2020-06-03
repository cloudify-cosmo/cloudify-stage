/**
 * Created by kinneretzin on 29/08/2016.
 */

import React from 'react';
import { connect } from 'react-redux';
import { addPage } from '../actions/page';
import { Button } from '../components/basic/index';
import EditModeButton from '../components/EditModeButton';

let nameIndex = 0;

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onClick: () => {
            dispatch(addPage(`Page_${nameIndex++}`));
        }
    };
};

const AddPageButton = ({ onClick }) => {
    return (
        <EditModeButton
            icon="add"
            labelPosition="left"
            basic
            onClick={onClick}
            content="Add Page"
            className="addPageBtn"
        />
    );
};

const AddPage = connect(
    null,
    mapDispatchToProps
)(AddPageButton);

export default AddPage;
