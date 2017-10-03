/**
 * Created by kinneretzin on 29/08/2016.
 */


import React, { Component, PropTypes } from 'react';

import AddPageButton from '../containers/AddPageButton';
import AddWidget from '../containers/AddWidget';
import {Message, Sidebar, Button} from './basic';

export default class EditModeBubble extends Component {

    static propTypes = {
        page: PropTypes.object.isRequired,
        onDismiss: PropTypes.func.isRequired,
        isVisible: PropTypes.bool.isRequired,
        isPageManagement: PropTypes.bool,
        isPagePreview: PropTypes.bool,
        onPageSave: PropTypes.func
    };

    render() {
        var header, content;

        if (this.props.isPageManagement) {

            header = 'Page management';
            content =
                <Message.Content className='alignCenter'>
                    <div className="leftFloated">
                        <AddWidget className='compactBlock' pageId={this.props.page.id}
                                   isPageManagement={this.props.isPageManagement}/>
                    </div>
                    <div className="rightFloated">
                        <Button basic content="Save" icon="save" onClick={() => this.props.onPageSave(this.props.page)}/>
                        <Button basic content="Cancel" icon="remove" onClick={this.props.onDismiss}/>
                    </div>
                </Message.Content>

        } else if (this.props.isPagePreview) {

            header = 'Page preview';
            content =
                <Message.Content className='alignCenter'>
                    <Button basic content="Exit" icon="sign out" onClick={this.props.onDismiss}/>
                </Message.Content>

        } else {

            header = 'Edit mode';
            content =
                <Message.Content className='alignCenter'>
                    <div className="leftFloated">
                        <AddWidget className='compactBlock' pageId={this.props.page.id}/>
                        <AddPageButton/>
                    </div>
                    <div className="rightFloated">
                        <Button basic content="Exit" icon="sign out" onClick={this.props.onDismiss}/>
                    </div>
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
