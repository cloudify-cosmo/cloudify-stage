// @ts-nocheck File not migrated fully to TS

import React from 'react';
import { Link } from 'react-router-dom';
import i18n from 'i18next';
import Consts from '../../utils/consts';
import { Header, Label, Message, MessageContainer } from '../basic';
import SplashLoadingScreen from '../../utils/SplashLoadingScreen';

export default function NotFoundPage() {
    return (
        <MessageContainer onRender={SplashLoadingScreen.turnOff}>
            <Header as="h2">
                <Label horizontal size="massive" color="blue">
                    404
                </Label>{' '}
                {i18n.t('notFound.header', 'Page Not Found')}
            </Header>
            <Message>
                {i18n.t('notFound.message', "We are sorry, but the page you are looking for doesn't exist.")}
            </Message>
            <Link to={Consts.PAGE_PATH.HOME}>{i18n.t('notFound.homepageLink', 'Go to the Homepage')}</Link>
        </MessageContainer>
    );
}
