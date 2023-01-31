import React from 'react';
import { useDispatch } from 'react-redux';
import i18n from 'i18next';
import { addPage } from '../../../actions/pageMenu';
import EditModeButton from './EditModeButton';

let nameIndex = 0;

export const buttonWidth = 146;

const AddPageButton = () => {
    const dispatch = useDispatch();

    function onClick() {
        dispatch(addPage(i18n.t('editMode.defaultPageName', 'Page_{{index}}', { index: nameIndex })));
        nameIndex += 1;
    }

    return (
        <EditModeButton
            icon="add"
            labelPosition="left"
            onClick={onClick}
            content={i18n.t('editMode.addPage', 'Add Page')}
            className="addPageBtn"
            style={{ width: buttonWidth }}
        />
    );
};

export default AddPageButton;
