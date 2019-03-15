/**
 * Created by jakub.niezgoda on 06/03/19.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Consts from '../utils/consts';
import StageUtils from '../utils/stageUtils';
import Manager from '../utils/Manager';
import {Button, Form, Grid, Header, Icon, Message, Segment, Table} from './basic';
import MessageContainer from './MessageContainer';
import Banner from '../containers/banner/Banner';
import FullScreenSegment from './layout/FullScreenSegment';
import Logo from './banner/Logo';


function CurrentLicense({license}) {
    const formatTrial = (isTrial) => isTrial ? 'Yes' : 'No';
    const formatExpirationDate = StageUtils.formatLocalTimestamp;
    const formatVersion = (version) => _.isEmpty(version) ? 'All' : String(version);
    const formatCapabilities = (capabilities) => _.join(capabilities, ', ');
    const isFalse = (boolValue) => !boolValue;

    const fields = [
        {name: 'expiration_date', header: 'Expiration Date', icon: 'clock', format: formatExpirationDate},
        {name: 'cloudify_version', header: 'Valid For Version', icon: 'thumbs up', format: formatVersion},
        {name: 'license_edition', header: 'License Edition', icon: 'file alternate outline', format: String},
        {name: 'capabilities', header: 'Capabilities', icon: 'wrench', format: formatCapabilities, hide: _.isEmpty},
        {name: 'trial', header: 'Trial', icon: 'lab', format: formatTrial, hide: isFalse},
        {name: 'customer_id', header: 'Licensed To', icon: 'handshake', format: String, hide: _.isEmpty},
    ];

    return !_.isEmpty(license)
        ?
        <Table basic='very' size='large' celled >
            <Table.Body>
                {
                    _.map(fields, (field) => {
                        const value = license[field.name];

                        return !!field.hide && field.hide(value)
                        ?
                            null
                        :
                            <Table.Row key={field.header}>
                                <Table.Cell width={5}>
                                    <Header as='h4'>
                                        <Icon name={field.icon} size='large'
                                                   style={{display: 'inline-block', float: 'left'}}/>
                                        <Header.Content>
                                            {field.header}
                                        </Header.Content>
                                    </Header>
                                </Table.Cell>
                                <Table.Cell>
                                    {field.format(license[field.name])}
                                </Table.Cell>
                            </Table.Row>
                    })
                }
            </Table.Body>
        </Table>
        :
        <Message>There is no license.</Message>
}

function UploadLicense({error, isLoading, license, onChange, onErrorDismiss, onUpload}) {
    return (
        <Form errors={error} errorMessageHeader='License error' onErrorsDismiss={onErrorDismiss}>
            <Form.TextArea name='license' autoHeight placeholder='License in YAML format' error={!!error}
                           value={license} onChange={onChange} disabled={isLoading} />

            <Button content='Upload' icon='upload' color='yellow' labelPosition='left'
                    disabled={_.isEmpty(license)} loading={isLoading} onClick={onUpload} />
        </Form>

    );
}

function LicenseSwitchButton({isEditLicenseActive, onClick, color}) {
    return (
        <Button content={isEditLicenseActive ? 'Show License' : 'Edit License'} floated='right'
                icon={isEditLicenseActive ? 'text file' : 'edit'}
                color={color} labelPosition='left' onClick={onClick} />
    )
}

function DescriptionMessage({isTrial, isEditLicenseActive, onLicenseButtonClick, status}) {
    const commonMessageProps = {icon: true};

    switch (status) {
        case Consts.LICENSE.EMPTY:
            return (
                <Message negative {...commonMessageProps}>
                    <Icon name='ban' />
                    <Message.Content>
                        <Message.Header>No active license</Message.Header>
                        If you don't have license, please visit&nbsp;
                        <a target='_blank'>Cloudify site</a>, register the product and get the email with license.
                    </Message.Content>
                </Message>
            );
        case Consts.LICENSE.EXPIRED:
            return isTrial
                ?
                    <Message negative {...commonMessageProps}>
                        <Icon name='clock outline' />
                        <Message.Content>
                            <LicenseSwitchButton isEditLicenseActive={isEditLicenseActive} onClick={onLicenseButtonClick} color='red' />
                            <Message.Header>Your trial license has expired</Message.Header>
                            Please upload new license to continue using product.
                        </Message.Content>
                    </Message>
                :
                    <Message warning {...commonMessageProps}>
                        <Icon name='clock outline' />
                        <Message.Content>
                            <LicenseSwitchButton isEditLicenseActive={isEditLicenseActive} onClick={onLicenseButtonClick} color='brown' />
                            <Message.Header>Your license has expired</Message.Header>
                            Please upload new license.
                        </Message.Content>
                    </Message>;
        case Consts.LICENSE.ACTIVE:
            return (
                <Message positive {...commonMessageProps}>
                    <Icon name='checkmark' />
                    <Message.Content>
                        <LicenseSwitchButton isEditLicenseActive={isEditLicenseActive} onClick={onLicenseButtonClick} color='green' />
                        <Message.Header>License is valid and active</Message.Header>
                        No action required.
                    </Message.Content>
                </Message>
            );
    }
}

export default class LicensePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null,
            license: '',
            isLoading: false,
            isEditLicenseActive: false
        };

        this.onErrorDismiss = this.onErrorDismiss.bind(this);
        this.onLicenseButtonClick = this.onLicenseButtonClick.bind(this);
        this.onLicenseEdit = this.onLicenseEdit.bind(this);
        this.onLicenseUpload = this.onLicenseUpload.bind(this);
    }

    static propTypes = {
        manager: PropTypes.object.isRequired,
        isProductOperational: PropTypes.bool.isRequired,
        license: PropTypes.object.isRequired,
        status: PropTypes.oneOf([Consts.LICENSE.ACTIVE, Consts.LICENSE.EMPTY, Consts.LICENSE.EXPIRED]),
    };

    static defaultProps = {};

    componentDidMount() {
        if (_.isEmpty(this.props.license)) {
            this.setState({isEditLicenseActive: true})
        }
    }

    onErrorDismiss() {
        this.setState({error: null});
    }

    onLicenseEdit(proxy, field) {
        this.setState(Form.fieldNameValue(field));
    }

    onLicenseUpload() {
        this.setState({isLoading: true});

        const managerAccessor = new Manager(this.props.manager);
        return managerAccessor.doPut('/license', null, this.state.license)
            .then((data) => {
                this.setState({isLoading: false, error: null, isEditLicenseActive: false});
                this.props.onLicenseUpload(data);
            })
            .catch((error) => this.setState({isLoading: false, error: error.message}))
    }

    onLicenseButtonClick() {
        this.setState({isEditLicenseActive: !this.state.isEditLicenseActive});
    }

    render () {
        const {license: licenseObject, isProductOperational, onGoToApp, status} = this.props;
        const {license: licenseString, error, isLoading, isEditLicenseActive} = this.state;

        const isTrial = !_.isEmpty(licenseObject) ? licenseObject.trial : false;

        return (
            <FullScreenSegment>
                <Banner />

                <MessageContainer wide size='large' textAlign='left' loading={isLoading}>
                    <Header as='h2'><Icon name='key' /> License Management</Header>

                    <DescriptionMessage isTrial={isTrial} status={status} isEditLicenseActive={isEditLicenseActive}
                                        onLicenseButtonClick={this.onLicenseButtonClick} />

                    <Segment>
                        {
                            isEditLicenseActive
                            ?
                                <UploadLicense error={error} isLoading={isLoading} license={licenseString}
                                            onChange={this.onLicenseEdit} onErrorDismiss={this.onErrorDismiss}
                                            onUpload={this.onLicenseUpload} />
                            :
                                <CurrentLicense license={licenseObject}/>
                        }
                    </Segment>

                    <Grid columns={'equal'}>
                        <Grid.Column textAlign='left' verticalAlign='middle'>
                            <a href='https://cloudify.co/license' target='_blank'> End User License Agreement</a>
                        </Grid.Column>

                        <Grid.Column textAlign='right' verticalAlign='middle'>
                            <Button content='Go to app' icon='arrow right' color='green' labelPosition='right' fluid={false}
                                    disabled={!isProductOperational} onClick={onGoToApp} />
                        </Grid.Column>
                    </Grid>

                </MessageContainer>
            </FullScreenSegment>
        );
    }
}
