/**
 * Created by kinneretzin on 29/08/2016.
 */

import PropTypes from 'prop-types';

import React from 'react';
import { Message, Sidebar } from './basic';

export default function EditModeBubble({ onDismiss, header, children }) {
    return (
        <>
            <div className="gridStackBottomSpace" />
            <Sidebar visible as={Message} animation="overlay" direction="bottom" className="editModeSidebar">
                <Message color="yellow" onDismiss={onDismiss}>
                    <Message.Header className="alignCenter" content={header} />
                    <Message.Content className="alignCenter">{children}</Message.Content>
                </Message>
            </Sidebar>
        </>
    );
}

EditModeBubble.propTypes = {
    onDismiss: PropTypes.func.isRequired,
    header: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]).isRequired
};
