/**
 * Created by kinneretzin on 29/08/2016.
 */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Consts from '../utils/consts';
import { Header, Label, Message, MessageContainer } from './basic';

export default class NotFound extends Component {
    render() {
        return (
            <MessageContainer>
                <Header as="h2">
                    <Label horizontal size="massive" color="blue">
                        404
                    </Label>{' '}
                    Page Not Found
                </Header>
                <Message>We are sorry, but the page you are looking for doesn't exist.</Message>
                <Link to={Consts.HOME_PAGE_PATH}>Go to the Homepage</Link>
            </MessageContainer>
        );
    }
}
