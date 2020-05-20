/**
 * Created by kinneretzin on 29/08/2016.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';

import AddPageButton from '../containers/AddPageButton';
import AddWidget from '../containers/AddWidget';
import Const from '../utils/consts';
import { Message, Sidebar, Button } from './basic';

export default class EditModeBubble extends Component {
    static propTypes = {
        page: PropTypes.object.isRequired,
        onDismiss: PropTypes.func.isRequired,
        isVisible: PropTypes.bool.isRequired,
        pageManagementMode: PropTypes.string,
        onPageSave: PropTypes.func
    };

    render() {
        const { isVisible, onDismiss, onPageSave, page, pageManagementMode } = this.props;
        let header;
        let content;

        if (pageManagementMode) {
            if (pageManagementMode === Const.PAGE_MANAGEMENT_EDIT) {
                header = 'Page management';
                content = (
                    <Message.Content className="alignCenter">
                        <AddWidget className="compactBlock" pageId={page.id} pageManagementMode={pageManagementMode} />
                        <Button basic content="Save" icon="save" onClick={() => onPageSave(page)} />
                        <Button basic content="Cancel" icon="remove" onClick={onDismiss} />
                    </Message.Content>
                );
            } else {
                header = 'Page preview';
                content = (
                    <Message.Content className="alignCenter">
                        <Button basic content="Exit" icon="sign out" onClick={onDismiss} />
                    </Message.Content>
                );
            }
        } else {
            header = 'Edit mode';
            content = (
                <Message.Content className="alignCenter">
                    <AddWidget className="compactBlock" pageId={page.id} />
                    <AddPageButton />
                    <Button basic content="Exit" icon="sign out" onClick={onDismiss} />
                </Message.Content>
            );
        }

        return (
            <Sidebar
                as={Message}
                animation="overlay"
                direction="bottom"
                visible={isVisible}
                className="editModeSidebar"
            >
                <Message color="yellow" onDismiss={onDismiss}>
                    <Message.Header className="alignCenter" content={header} />
                    {content}
                </Message>
            </Sidebar>
        );
    }
}
