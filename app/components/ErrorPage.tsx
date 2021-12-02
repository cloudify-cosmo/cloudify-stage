// @ts-nocheck File not migrated fully to TS

import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Redirect } from 'react-router-dom';
import i18n from 'i18next';

import Consts from '../utils/consts';
import LinkToLogin from '../containers/LinkToLogin';
import { Header, Message, MessageContainer } from './basic';
import SplashLoadingScreen from '../utils/SplashLoadingScreen';

export default function ErrorPage({ error }) {
    return _.isEmpty(error) ? (
        <Redirect to={Consts.LOGOUT_PAGE_PATH} />
    ) : (
        <MessageContainer onRender={SplashLoadingScreen.turnOff}>
            <Header as="h2">{i18n.t('unexpectedError', 'Unexpected Error Occurred')}</Header>
            <Message content={error} error />
            <LinkToLogin />
        </MessageContainer>
    );
}

ErrorPage.propTypes = {
    error: PropTypes.node.isRequired
};
