import React, { useEffect } from 'react';
import i18n from 'i18next';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import SmartRedirect from './SmartRedirect';
import Consts from '../../utils/consts';
import type { ReduxThunkDispatch } from '../../configureStore';
import type { LogoutAction } from '../../actions/manager/auth';
import { logout } from '../../actions/manager/auth';
import type { ReduxState } from '../../reducers';
import { Header, Message, MessageContainer } from '../basic';
import SplashLoadingScreen from '../../utils/SplashLoadingScreen';
import LinkToLogin from './LinkToLogin';

export default function LogoutPage() {
    const error = useSelector((state: ReduxState) => state.app.error);
    const isLocalIdp = useSelector((state: ReduxState) => state.config.app.auth.type === 'local');
    const portalUrl = useSelector((state: ReduxState) => state.config.app.auth.portalUrl);
    const dispatch: ReduxThunkDispatch<LogoutAction> = useDispatch();

    useEffect(() => {
        dispatch(logout());
    }, []);

    if (error) {
        return (
            <MessageContainer onRender={SplashLoadingScreen.turnOff}>
                <Header as="h2">{i18n.t('errors.header')}</Header>
                <Message content={error} error />
                <LinkToLogin />
            </MessageContainer>
        );
    }
    return isLocalIdp ? <Redirect to={Consts.PAGE_PATH.LOGIN} /> : <SmartRedirect url={portalUrl} />;
}
