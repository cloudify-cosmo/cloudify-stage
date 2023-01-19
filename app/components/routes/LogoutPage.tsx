import React, { useEffect } from 'react';
import i18n from 'i18next';
import { useDispatch, useSelector } from 'react-redux';

import type { ReduxThunkDispatch } from '../../configureStore';
import type { LogoutAction } from '../../actions/manager/auth';
import { logout } from '../../actions/manager/auth';
import type { ReduxState } from '../../reducers';
import { Header, Message, MessageContainer } from '../basic';
import SplashLoadingScreen from '../../utils/SplashLoadingScreen';
import LinkToLogin from './LinkToLogin';

export default function LogoutPage() {
    const error = useSelector((state: ReduxState) => state.app.error);
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

    return null;
}
