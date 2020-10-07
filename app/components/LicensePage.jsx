/**
 * Created by jakub.niezgoda on 06/03/19.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Banner from '../containers/banner/Banner';
import Consts from '../utils/consts';
import { Button, Form, FullScreenSegment, Grid, Header, Icon, Message, MessageContainer } from './basic';
import CurrentLicense from './license/CurrentLicense';
import EulaLink from './license/EulaLink';
import UploadLicense from './license/UploadLicense';
import SplashLoadingScreen from '../utils/SplashLoadingScreen';

function LicenseSwitchButton({ color, isEditLicenseActive, onClick }) {
    return (
        <Button
            content={isEditLicenseActive ? 'Show License' : 'Edit License'}
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
    const SpanMessage = ({ children }) => <span>{children}</span>;
    SpanMessage.propTypes = {
        children: PropTypes.node.isRequired
    };

    switch (status) {
        case Consts.LICENSE.EMPTY:
            return (
                <Message negative icon>
                    <Icon name="ban" />
                    <Message.Content>
                        <Message.Header>No active license</Message.Header>
                        {canUploadLicense ? (
                            <SpanMessage>
                                To activate this product, please enter the license key provided by Cloudify below and
                                press update. Visit the Cloudify{' '}
                                <a target="_blank" rel="noopener noreferrer" href="https://cloudify.co">
                                    web site
                                </a>{' '}
                                &nbsp;to learn more and acquire a free&nbsp;
                                <a target="_blank" rel="noopener noreferrer" href="https://cloudify.co/download/#trial">
                                    trial license
                                </a>
                                .
                            </SpanMessage>
                        ) : (
                            <SpanMessage>
                                To activate this product, please contact your Cloudify administrator.
                            </SpanMessage>
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
                        <Message.Header>The trial license has expired</Message.Header>
                        {canUploadLicense ? (
                            <SpanMessage>
                                Please contact{' '}
                                <a target="_blank" rel="noopener noreferrer" href="https://cloudify.co/contact">
                                    Cloudify
                                </a>
                                &nbsp;to obtain a license key.
                            </SpanMessage>
                        ) : (
                            <SpanMessage>Please contact your Cloudify administrator.</SpanMessage>
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

                        <Message.Header>Product license has expired</Message.Header>
                        {canUploadLicense ? (
                            <SpanMessage>
                                Please contact{' '}
                                <a target="_blank" rel="noopener noreferrer" href="https://cloudify.co/support">
                                    Cloudify support
                                </a>
                                &nbsp;to obtain a new license key.
                            </SpanMessage>
                        ) : (
                            <SpanMessage>Please contact your Cloudify administrator.</SpanMessage>
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
                        <Message.Header>License is valid</Message.Header>
                        <SpanMessage>No action required.</SpanMessage>
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
            .doPut('/license', null, license)
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

        return (
            <FullScreenSegment>
                <Banner />

                <MessageContainer
                    wide
                    size="large"
                    textAlign="left"
                    loading={isLoading}
                    onRender={SplashLoadingScreen.turnOff}
                >
                    <Header as="h2">
                        <Icon name="key" /> License Management
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
                            <Button
                                content="Go to app"
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
