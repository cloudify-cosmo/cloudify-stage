/**
 * Created by jakub.niezgoda on 15/03/2019.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';

import Banner from '../containers/banner/Banner';
import CurrentLicense from './license/CurrentLicense';
import CurrentVersion from './license/CurrentVersion';
import EulaLink from './license/EulaLink';

export default class AboutModal extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        open: PropTypes.bool.isRequired,
        onHide: PropTypes.func.isRequired,
        version: PropTypes.object.isRequired,
        license: PropTypes.object,
        onLicenseManagment: PropTypes.func
    };

    static defaultProps = {
        onLicenseManagment: _.noop
    };

    render() {
        const { Button, CancelButton, Divider, Header, Modal } = Stage.Basic;

        return (
            <Modal open={this.props.open} onClose={this.props.onHide}>
                <Modal.Header className="mainBackgroundColor" style={{ padding: 0, paddingLeft: 10 }}>
                    <Banner hideOnSmallScreen={false} />
                </Modal.Header>

                <Modal.Content>
                    <Header>Version Details</Header>
                    <Divider />
                    <CurrentVersion version={this.props.version} />

                    <Header>License Details</Header>
                    <Divider />
                    <CurrentLicense license={this.props.license} />

                    <EulaLink />
                </Modal.Content>

                <Modal.Actions>
                    {this.props.canLicenseManagement && (
                        <Button
                            content="License Management"
                            icon="key"
                            color="yellow"
                            onClick={this.props.onLicenseManagment}
                        />
                    )}
                    <CancelButton content="Close" onClick={this.props.onHide} />
                </Modal.Actions>
            </Modal>
        );
    }
}
