/**
 * Created by edenp on 8/17/17.
 */

import React, { Component } from 'react';

import { Header, Message } from './basic';
import LinkToLogin from '../containers/LinkToLogin';
import MessageContainer from './MessageContainer';

export default class NoTenants extends Component {
    render () {
        return (
            <MessageContainer>
                <Header as='h2'>User don't have any tenants</Header>
                <Message>
                    Unfortunately you cannot login since you don't have any tenants.
                    Ask the admin to assign you to a tenant.
                </Message>
                <LinkToLogin />
            </MessageContainer>
        );
    }
}