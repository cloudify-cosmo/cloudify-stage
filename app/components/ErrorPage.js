/**
 * Created by pposel on 8/17/17.
 */

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import { Header, Message } from './basic';
import MessageContainer from './MessageContainer';
import LinkToLogin from '../containers/LinkToLogin';
import Consts from '../utils/consts';

export default class ErrorPage extends Component {
    render () {
        return _.isEmpty(this.props.error)
            ?
                <Redirect to={Consts.LOGOUT_PAGE_PATH} />
            :
                <MessageContainer>
                    <Header as='h2'>Unexpected Error Occurred</Header>
                    <Message content={this.props.error} error/>
                    <LinkToLogin/>
                </MessageContainer>
    }
}
