import React from 'react';
import { Link } from 'react-router-dom';
import Consts from '../../utils/consts';
import { FullScreenSegment, Header, Label, Logo, Message, MessageContainer } from '../basic';
import SplashLoadingScreen from '../../utils/SplashLoadingScreen';
import StageUtils from '../../utils/stageUtils';

const translate = StageUtils.getT('notFound');

export default function NotFoundPage() {
    return (
        <FullScreenSegment>
            <Logo />
            <MessageContainer onRender={SplashLoadingScreen.turnOff}>
                <Header as="h2">
                    <Label horizontal size="massive" color="blue">
                        404
                    </Label>{' '}
                    {translate('header')}
                </Header>
                <Message>{translate('message')}</Message>
                <Link to={Consts.PAGE_PATH.HOME}>{translate('homepageLink')}</Link>
            </MessageContainer>
        </FullScreenSegment>
    );
}
