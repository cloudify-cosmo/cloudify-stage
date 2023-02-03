import React, { useEffect } from 'react';
import i18n from 'i18next';
import { useDispatch, useSelector } from 'react-redux';

import type { ReduxThunkDispatch } from '../../configureStore';
import type { LogoutAction } from '../../actions/manager/auth';
import { logout } from '../../actions/manager/auth';
import type { ReduxState } from '../../reducers';
import { Header, Message } from '../basic';
import LogoPage from './LogoPage';
import LinkToLogin from './LinkToLogin';
import SmartRedirect from './SmartRedirect';

export default function LogoutPage() {
    const error = useSelector((state: ReduxState) => state.app.error);
    const afterLogoutUrl = useSelector((state: ReduxState) => state.config.app.auth.afterLogoutUrl);
    const dispatch: ReduxThunkDispatch<LogoutAction> = useDispatch();

    useEffect(() => {
        dispatch(logout());
    }, []);

    if (error) {
        return (
            <LogoPage>
                <Header as="h2">{i18n.t('errors.header')}</Header>
                <Message content={error} error />
                <LinkToLogin />
            </LogoPage>
        );
    }

    return <SmartRedirect url={afterLogoutUrl} />;
}
