/**
 * Created by kinneretzin on 29/08/2016.
 */


import React, { Component, PropTypes } from 'react';

import AddPageButton from '../containers/AddPageButton';
import AddWidget from '../containers/AddWidget';
import Const from '../utils/consts';
import {Message, Sidebar, Button} from './basic';

export default class EditModeBubble extends Component {

    static propTypes = {
        page: PropTypes.object.isRequired,
        onDismiss: PropTypes.func.isRequired,
        isVisible: PropTypes.bool.isRequired,
        pageManagementMode: PropTypes.string,
        onPageSave: PropTypes.func
    };

    render() {
        var header, content;

        if (this.props.pageManagementMode) {
            if (this.props.pageManagementMode === Const.PAGE_MANAGEMENT_EDIT) {

                header = 'Page management';
                content =
                    <Message.Content className='alignCenter'>
                        <AddWidget className='compactBlock' pageId={this.props.page.id}
                                   pageManagementMode={this.props.pageManagementMode}/>
                        <Button basic content="Save" icon="save" onClick={() => this.props.onPageSave(this.props.page)}/>
                        <Button basic content="Cancel" icon="remove" onClick={this.props.onDismiss}/>
                    </Message.Content>

            } else {

                header = 'Page preview';
                content =
                    <Message.Content className='alignCenter'>
                        <Button basic content="Exit" icon="sign out" onClick={this.props.onDismiss}/>
                    </Message.Content>

            }
        } else {

            header = 'Edit mode';
            content =
                <Message.Content className='alignCenter'>
                    <AddWidget className='compactBlock' pageId={this.props.page.id}/>
                    <AddPageButton/>
                    <Button basic content="Exit" icon="sign out" onClick={this.props.onDismiss}/>
                </Message.Content>

        }

        return (
            <Sidebar as={Message} animation='overlay' direction='bottom' visible={this.props.isVisible} className='editModeSidebar'>
                <Message color='yellow' onDismiss={this.props.onDismiss}>
                    <Message.Header className='alignCenter' content={header}/>
                    {content}
                </Message>
            </Sidebar>
        );
    }
}
