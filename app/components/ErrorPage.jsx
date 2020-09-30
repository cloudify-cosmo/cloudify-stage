/**
 * Created by pposel on 8/17/17.
 */

import PropTypes from 'prop-types';
import React from 'react';
import { Redirect } from 'react-router-dom';

import Consts from '../utils/consts';
import LinkToLogin from '../containers/LinkToLogin';
import { Header, Message, MessageContainer } from './basic';
import SplashLoadingScreen from '../utils/SplashLoadingScreen';

export default function ErrorPage({ error }) {
    return _.isEmpty(error) ? (
        <Redirect to={Consts.LOGOUT_PAGE_PATH} />
    ) : (
        <MessageContainer onRender={SplashLoadingScreen.turnOff}>
            <Header as="h2">Unexpected Error Occurred</Header>
            <Message content={error} error />
            <LinkToLogin />
        </MessageContainer>
    );
}

ErrorPage.propTypes = {
    error: PropTypes.node.isRequired
};
