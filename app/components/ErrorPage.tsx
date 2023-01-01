import { isEmpty } from 'lodash';
import type { FunctionComponent, ReactNode } from 'react';
import React from 'react';
import { Redirect } from 'react-router-dom';
import i18n from 'i18next';
import { connect } from 'react-redux';

import Consts from '../utils/consts';
import LinkToLogin from './LinkToLogin';
import { Header, Message, MessageContainer } from './basic';
import SplashLoadingScreen from '../utils/SplashLoadingScreen';
import type { ReduxState } from '../reducers';

interface ErrorPageProps {
    error: ReactNode;
}
const ErrorPage: FunctionComponent<ErrorPageProps> = ({ error }) =>
    isEmpty(error) ? (
        <Redirect to={Consts.PAGE_PATH.LOGOUT} />
    ) : (
        <MessageContainer onRender={SplashLoadingScreen.turnOff}>
            <Header as="h2">{i18n.t('unexpectedError', 'Unexpected Error Occurred')}</Header>
            <Message content={error} error />
            <LinkToLogin />
        </MessageContainer>
    );

const mapStateToProps = (state: ReduxState) => ({
    error: state.app.error
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ErrorPage);
