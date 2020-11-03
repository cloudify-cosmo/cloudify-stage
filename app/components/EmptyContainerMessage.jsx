import React from 'react';
import PropTypes from 'prop-types';
import { Container, Header } from './basic';

export default function EmptyContainerMessage({ isEditMode, containerTypeLabel }) {
    return (
        <Container className="emptyPage alignCenter" style={{ padding: '10rem 0' }}>
            {isEditMode ? (
                <Header size="large">
                    This {containerTypeLabel} is empty, <br />
                    don&apos;t be shy, give it a meaning!
                </Header>
            ) : (
                <Header size="large">This {containerTypeLabel} is empty</Header>
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
