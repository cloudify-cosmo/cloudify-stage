/**
 * Created by jakub.niezgoda on 15/03/2019.
 */

import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import { Button, CancelButton, Divider, Header, Modal } from './basic';
import Banner from '../containers/banner/Banner';
import CurrentLicense from './license/CurrentLicense';
import CurrentVersion from './license/CurrentVersion';
import EulaLink from './license/EulaLink';

export default function AboutModal({ canLicenseManagement, license, onHide, onLicenseManagement, open, version }) {
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
                    <Button content="License Management" icon="key" color="yellow" onClick={onLicenseManagement} />
                )}
                <CancelButton content="Close" onClick={onHide} />
            </Modal.Actions>
        </Modal>
    );
}

AboutModal.propTypes = {
    canLicenseManagement: PropTypes.bool.isRequired,
    open: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    version: PropTypes.shape({}).isRequired,
    license: PropTypes.shape({}),
    onLicenseManagement: PropTypes.func
};

AboutModal.defaultProps = {
    license: {},
    onLicenseManagement: _.noop
};
