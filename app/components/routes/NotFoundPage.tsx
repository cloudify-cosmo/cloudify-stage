import React from 'react';
import { Link } from 'react-router-dom';
import Consts from '../../utils/consts';
import { Header, Label, Message } from '../basic';
import StageUtils from '../../utils/stageUtils';
import LogoPage from './LogoPage';

const translate = StageUtils.getT('notFound');

export default function NotFoundPage() {
    return (
        <LogoPage>
            <Header as="h2">
                <Label horizontal size="massive" color="blue">
                    404
                </Label>{' '}
                {translate('header')}
            </Header>
            <Message>{translate('message')}</Message>
            <Link to={Consts.PAGE_PATH.HOME}>{translate('homepageLink')}</Link>
        </LogoPage>
    );
}
