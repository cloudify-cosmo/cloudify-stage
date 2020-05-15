/**
 * Created by pposel on 8/17/17.
 */

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import Consts from '../utils/consts';
import LinkToLogin from '../containers/LinkToLogin';
import { Header, Message } from './basic';
import { MessageContainer } from './shared';

export default class ErrorPage extends Component {
    render() {
        const { error } = this.props;
        return _.isEmpty(error) ? (
            <Redirect to={Consts.LOGOUT_PAGE_PATH} />
        ) : (
            <MessageContainer>
                <Header as="h2">Unexpected Error Occurred</Header>
                <Message content={error} error />
                <LinkToLogin />
            </MessageContainer>
        );
    }
}
