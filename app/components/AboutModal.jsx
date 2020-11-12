/**
 * Created by jakub.niezgoda on 15/03/2019.
 */

import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { HeaderBar } from 'cloudify-ui-components';

import { Button, CancelButton, Divider, Header, Modal } from './basic';
import Banner from './banner/Banner';
import CurrentLicense from './license/CurrentLicense';
import CurrentVersion from './license/CurrentVersion';
import EulaLink from './license/EulaLink';

export default function AboutModal({ canLicenseManagement, license, onHide, onLicenseManagement, open, version }) {
    const theme = useContext(ThemeContext);
    return (
        <Modal open={open} onClose={onHide}>
            <Modal.Header style={{ padding: 0, backgroundColor: theme.mainColor }}>
                <HeaderBar>
                    <Banner hideOnSmallScreen={false} />
                </HeaderBar>
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
