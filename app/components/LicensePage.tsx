// @ts-nocheck File not migrated fully to TS

import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { HeaderBar } from 'cloudify-ui-components';

import Banner from './banner/Banner';
import Consts from '../utils/consts';
import StageUtils from '../utils/stageUtils';
import { Button, Form, FullScreenSegment, Grid, Header, Icon, Message, MessageContainer } from './basic';
import CurrentLicense from './license/CurrentLicense';
import EulaLink from './license/EulaLink';
import UploadLicense from './license/UploadLicense';
import SplashLoadingScreen from '../utils/SplashLoadingScreen';

const t = StageUtils.getT('licenseManagement');

function LicenseSwitchButton({ color, isEditLicenseActive, onClick }) {
    return (
        <Button
            content={isEditLicenseActive ? t('showLicense') : t('editLicense')}
            floated="right"
            icon={isEditLicenseActive ? 'text file' : 'edit'}
            color={color}
            labelPosition="left"
            onClick={onClick}
        />
    );
}

LicenseSwitchButton.propTypes = {
    color: PropTypes.string.isRequired,
    isEditLicenseActive: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
};

function DescriptionMessage({ canUploadLicense, isTrial, isEditLicenseActive, onLicenseButtonClick, status }) {
    switch (status) {
        case Consts.LICENSE.EMPTY:
            return (
                <Message negative icon>
                    <Icon name="ban" />
                    <Message.Content>
                        <Message.Header>{t('subheader.noLicense')}</Message.Header>
                        {canUploadLicense ? (
                            <span
                                // eslint-disable-next-line react/no-danger
                                dangerouslySetInnerHTML={{
                                    __html: t('action.canUpload.noLicense')
                                }}
                            />
                        ) : (
                            <span>{t('action.cannotUpload.noLicense')}</span>
                        )}
                    </Message.Content>
                </Message>
            );
        case Consts.LICENSE.EXPIRED:
            return isTrial ? (
                <Message negative icon>
                    <Icon name="clock outline" />
                    <Message.Content>
                        {canUploadLicense && (
                            <LicenseSwitchButton
                                isEditLicenseActive={isEditLicenseActive}
                                onClick={onLicenseButtonClick}
                                color="red"
                            />
                        )}
                        <Message.Header>{t('subheader.trialLicenseExpired')}</Message.Header>
                        {canUploadLicense ? (
                            <span
                                // eslint-disable-next-line react/no-danger
                                dangerouslySetInnerHTML={{
                                    __html: t('action.canUpload.trialLicenseExpired')
                                }}
                            />
                        ) : (
                            <span>{t('action.cannotUpload.common')}</span>
                        )}
                    </Message.Content>
                </Message>
            ) : (
                <Message warning icon>
                    <Icon name="clock outline" />
                    <Message.Content>
                        {canUploadLicense && (
                            <LicenseSwitchButton
                                isEditLicenseActive={isEditLicenseActive}
                                onClick={onLicenseButtonClick}
                                color="brown"
                            />
                        )}

                        <Message.Header>{t('subheader.regularLicenseExpired')}</Message.Header>
                        {canUploadLicense ? (
                            <span
                                // eslint-disable-next-line react/no-danger
                                dangerouslySetInnerHTML={{
                                    __html: t('action.canUpload.regularLicenseExpired')
                                }}
                            />
                        ) : (
                            <span>{t('action.cannotUpload.common')}</span>
                        )}
                    </Message.Content>
                </Message>
            );
        case Consts.LICENSE.ACTIVE:
            return (
                <Message positive icon>
                    <Icon name="checkmark" />
                    <Message.Content>
                        {canUploadLicense && (
                            <LicenseSwitchButton
                                isEditLicenseActive={isEditLicenseActive}
                                onClick={onLicenseButtonClick}
                                color="green"
                            />
                        )}
                        <Message.Header>{t('subheader.activeLicense')}</Message.Header>
                        <span>{t('action.activeLicense')}</span>
                    </Message.Content>
                </Message>
            );
        default:
            return null;
    }
}

DescriptionMessage.propTypes = {
    canUploadLicense: PropTypes.bool.isRequired,
    isTrial: PropTypes.bool.isRequired,
    isEditLicenseActive: PropTypes.bool.isRequired,
    onLicenseButtonClick: PropTypes.func.isRequired,
    status: PropTypes.oneOf([Consts.LICENSE.EMPTY, Consts.LICENSE.EXPIRED, Consts.LICENSE.ACTIVE]).isRequired
};

export default class LicensePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null,
            isLoading: false,
            isEditLicenseActive: false,
            license: ''
        };

        this.onErrorDismiss = this.onErrorDismiss.bind(this);
        this.onLicenseButtonClick = this.onLicenseButtonClick.bind(this);
        this.onLicenseEdit = this.onLicenseEdit.bind(this);
        this.onLicenseUpload = this.onLicenseUpload.bind(this);
    }

    componentDidMount() {
        const { manager, onLicenseChange } = this.props;
        this.setState({ isLoading: true });
        return manager
            .doGet('/license')
            .then(data => {
                const license = _.get(data, 'items[0]', {});
                this.setState({ isLoading: false, error: null, isEditLicenseActive: _.isEmpty(license) });
                onLicenseChange(license);
            })
            .catch(error => this.setState({ isLoading: false, error: error.message }));
    }

    onErrorDismiss() {
        this.setState({ error: null });
    }

    onLicenseEdit(proxy, field) {
        this.setState(Form.fieldNameValue(field));
    }

    onLicenseUpload() {
        const { manager, onLicenseChange } = this.props;
        const { license } = this.state;
        this.setState({ isLoading: true });

        return manager
            .doPut('/license', { body: license })
            .then(data => {
                this.setState({ isLoading: false, error: null, isEditLicenseActive: false });
                onLicenseChange(data);
            })
            .catch(error => this.setState({ isLoading: false, error: error.message }));
    }

    onLicenseButtonClick() {
        const { isEditLicenseActive } = this.state;
        this.setState({ isEditLicenseActive: !isEditLicenseActive });
    }

    render() {
        const { license: licenseObject, canUploadLicense, isProductOperational, onGoToApp, status } = this.props;
        const { license: licenseString, error, isLoading, isEditLicenseActive } = this.state;

        const isTrial = !_.isEmpty(licenseObject) ? licenseObject.trial : false;
        const { redirectToPage } = StageUtils.Url;

        return (
            <FullScreenSegment>
                <HeaderBar>
                    <Banner hideOnSmallScreen={false} />
                </HeaderBar>

                <MessageContainer
                    wide
                    size="large"
                    textAlign="left"
                    loading={isLoading}
                    onRender={SplashLoadingScreen.turnOff}
                >
                    <Header as="h2">
                        <Icon name="key" /> {t('header')}
                    </Header>

                    <DescriptionMessage
                        isTrial={isTrial}
                        status={status}
                        canUploadLicense={canUploadLicense}
                        isEditLicenseActive={isEditLicenseActive}
                        onLicenseButtonClick={this.onLicenseButtonClick}
                    />

                    {canUploadLicense && isEditLicenseActive ? (
                        <UploadLicense
                            error={error}
                            isLoading={isLoading}
                            license={licenseString}
                            onChange={this.onLicenseEdit}
                            onErrorDismiss={this.onErrorDismiss}
                            onUpload={this.onLicenseUpload}
                        />
                    ) : (
                        <CurrentLicense license={licenseObject} />
                    )}

                    <Grid columns="equal">
                        <Grid.Column textAlign="left" verticalAlign="middle">
                            <EulaLink />
                        </Grid.Column>

                        <Grid.Column textAlign="right" verticalAlign="middle">
                            {status !== 'no_license' && (
                                <Button
                                    content={t('getLicense')}
                                    icon="external"
                                    color="green"
                                    labelPosition="right"
                                    fluid={false}
                                    onClick={() => redirectToPage(t('getLicenseLink'))}
                                    style={{ marginRight: '0.5rem' }}
                                />
                            )}
                            <Button
                                content={t('goToApp')}
                                icon="arrow right"
                                color="green"
                                labelPosition="right"
                                fluid={false}
                                disabled={!isProductOperational}
                                onClick={onGoToApp}
                            />
                        </Grid.Column>
                    </Grid>
                </MessageContainer>
            </FullScreenSegment>
        );
    }
}

LicensePage.propTypes = {
    canUploadLicense: PropTypes.bool.isRequired,
    isProductOperational: PropTypes.bool.isRequired,
    license: PropTypes.shape({ trial: PropTypes.bool }).isRequired,
    onLicenseChange: PropTypes.func.isRequired,
    onGoToApp: PropTypes.func.isRequired,
    status: PropTypes.oneOf([Consts.LICENSE.ACTIVE, Consts.LICENSE.EMPTY, Consts.LICENSE.EXPIRED]).isRequired,
    manager: PropTypes.shape({ doGet: PropTypes.func, doPut: PropTypes.func }).isRequired
};
