/**
 * Created by kinneretzin on 29/08/2016.
 */

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import i18n from 'i18next';
import { addPage } from '../actions/page';
import EditModeButton from '../components/EditModeButton';

let nameIndex = 0;

const mapDispatchToProps = dispatch => {
    return {
        onClick: () => {
            dispatch(addPage(i18n.t('editMode.defaultPageName', 'Page_{{index}}', { index: nameIndex })));
            nameIndex += 1;
        }
    };
};

const AddPageButton = ({ onClick }) => {
    return (
        <EditModeButton
            icon="add"
            labelPosition="left"
            onClick={onClick}
            content={i18n.t('editMode.addPage', 'Add Page')}
            className="addPageBtn"
        />
    );
};

AddPageButton.propTypes = {
    onClick: PropTypes.func.isRequired
};

const AddPage = connect(null, mapDispatchToProps)(AddPageButton);

export default AddPage;
