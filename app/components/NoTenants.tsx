import React from 'react';
import i18n from 'i18next';
import LinkToLogin from './LinkToLogin';
import { Header, Message, MessageContainer } from './basic';
import SplashLoadingScreen from '../utils/SplashLoadingScreen';

export default function NoTenants() {
    return (
        <MessageContainer onRender={SplashLoadingScreen.turnOff}>
            <Header as="h2">{i18n.t('login.noTenants.header')}</Header>
            <Message>{i18n.t('login.noTenants.message')}</Message>
            <LinkToLogin />
        </MessageContainer>
    );
}
