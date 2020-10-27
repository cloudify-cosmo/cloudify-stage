/**
 * Created by kinneretzin on 29/08/2016.
 */

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { addPage } from '../actions/page';
import EditModeButton from '../components/EditModeButton';

let nameIndex = 0;

const mapDispatchToProps = dispatch => {
    return {
        onClick: () => {
            dispatch(addPage(`Page_${nameIndex}`));
            nameIndex += 1;
        }
    };
};

const AddPageButton = ({ onClick }) => {
    return (
        <EditModeButton icon="add" labelPosition="left" onClick={onClick} content="Add Page" className="addPageBtn" />
    );
};

AddPageButton.propTypes = {
    onClick: PropTypes.func.isRequired
};

const AddPage = connect(null, mapDispatchToProps)(AddPageButton);

export default AddPage;
