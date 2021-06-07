import i18n from 'i18next';
import React from 'react';
import PropTypes from 'prop-types';
import { Container, Header } from './basic';

export default function EmptyContainerMessage({ isEditMode, containerTypeLabel }) {
    return (
        <Container className="emptyPage alignCenter" style={{ padding: '10rem 0' }}>
            {isEditMode ? (
                <Header size="large">
                    {i18n.t('editMode.emptyContainer.line1', 'This {{containerType}} is empty,', {
                        containerType: containerTypeLabel
                    })}
                    <br />
                    {i18n.t('editMode.emptyContainer.line2', "don't be shy, give it a meaning!")}
                </Header>
            ) : (
                <Header size="large">
                    {i18n.t('page.emptyContainer', 'This {{containerType}} is empty', {
                        containerType: containerTypeLabel
                    })}
                </Header>
            )}
        </Container>
    );
}

EmptyContainerMessage.propTypes = {
    isEditMode: PropTypes.bool,
    containerTypeLabel: PropTypes.string.isRequired
};

EmptyContainerMessage.defaultProps = {
    isEditMode: false
};
