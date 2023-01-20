import type { FunctionComponent } from 'react';
import React from 'react';
import styled from 'styled-components';

import i18n from 'i18next';

import { useDispatch } from 'react-redux';
import EditModeButton from './EditModeButton';
import { addPageGroup } from '../../../actions/pageMenu';
import { buttonWidth } from './AddPageButton';

let nameIndex = 0;

const StyledEditModeButton = styled(EditModeButton)`
    // Bump specificity to override built-in Semantic UI style
    &&&&&& {
        margin-top: 10px;
        padding-right: 5px !important;
        padding-left: 40px !important;
        width: ${buttonWidth}px;
    }
`;

const AddPageGroupButton: FunctionComponent = () => {
    const dispatch = useDispatch();

    function handleClick() {
        dispatch(addPageGroup(i18n.t('editMode.defaultPageGroupName', { index: nameIndex })));
        nameIndex += 1;
    }

    return (
        <StyledEditModeButton
            icon="add"
            labelPosition="left"
            content={i18n.t('editMode.addPageGroup')}
            onClick={handleClick}
        />
    );
};

export default AddPageGroupButton;
