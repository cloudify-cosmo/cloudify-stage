/**
 * Created by edenp on 8/17/17.
 */

import React, { Component } from 'react';

import LinkToLogin from '../containers/LinkToLogin';
import { Header, Message, MessageContainer } from './basic';

export default class NoTenants extends Component {
    render () {
        return (
            <MessageContainer>
                <Header as='h2'>User is not associated with any tenants.</Header>
                <Message>
                    Unfortunately you cannot login since your account is not
                    associated with any tenants. Please ask the administrator to assign
                    at least one tenant to your account.
                </Message>
                <LinkToLogin />
            </MessageContainer>
        );
    }
}
