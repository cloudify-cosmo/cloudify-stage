/**
 * Created by edenp on 8/17/17.
 */

import React from 'react';

import i18n from 'i18next';
import LinkToLogin from '../containers/LinkToLogin';
import { Header, Message, MessageContainer } from './basic';
import SplashLoadingScreen from '../utils/SplashLoadingScreen';

export default function NoTenants() {
    return (
        <MessageContainer onRender={SplashLoadingScreen.turnOff}>
            <Header as="h2">{i18n.t('login.noTenants.header', 'User is not associated with any tenants.')}</Header>
            <Message>
                {i18n.t(
                    'login.noTenants.message',
                    'Unfortunately you cannot login since your account is not associated with any tenants. Please ask the administrator to assign at least one tenant to your account.'
                )}
            </Message>
            <LinkToLogin />
        </MessageContainer>
    );
}
