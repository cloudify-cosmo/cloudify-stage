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
        const { canLicenseManagement, license, onHide, onLicenseManagment, open, version } = this.props;
        const { Button, CancelButton, Divider, Header, Modal } = Stage.Basic;

        return (
            <Modal open={open} onClose={onHide}>
                <Modal.Header className="mainBackgroundColor" style={{ padding: 0, paddingLeft: 10 }}>
                    <Banner hideOnSmallScreen={false} />
                </Modal.Header>

                <Modal.Content>
                    <Header>Version Details</Header>
                    <Divider />
                    <CurrentVersion version={version} />

                    <Header>License Details</Header>
                    <Divider />
                    <CurrentLicense license={license} />

                    <EulaLink />
                </Modal.Content>

                <Modal.Actions>
                    {canLicenseManagement && (
                        <Button content="License Management" icon="key" color="yellow" onClick={onLicenseManagment} />
                    )}
                    <CancelButton content="Close" onClick={onHide} />
                </Modal.Actions>
            </Modal>
        );
    }
}
