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
        license: PropTypes.object.isRequired,
        open: PropTypes.bool.isRequired,
        onHide: PropTypes.func.isRequired,
        version: PropTypes.object.isRequired,
        onLicenseManagment: PropTypes.func
    };

    static defaultProps = {
        onLicenseManagment: _.noop
    };

    render() {
        var {Button, CancelButton, Divider, Header, Modal} = Stage.Basic;

        return (
            <Modal open={this.props.open} onClose={this.props.onHide}>

                <Modal.Header className='mainBackgroundColor'>
                    <Banner />
                </Modal.Header>

                <Modal.Content>
                    <Header>
                        Version Details
                    </Header>
                    <Divider />
                    <CurrentVersion version={this.props.version} />

                    <Header>
                        License Details
                    </Header>
                    <Divider />
                    <CurrentLicense license={this.props.license} />

                    <EulaLink />
                </Modal.Content>

                <Modal.Actions>
                    <Button content='License Management' icon='key' color='yellow' onClick={this.props.onLicenseManagment} />
                    <CancelButton content='Close' onClick={this.props.onHide} />
                </Modal.Actions>
            </Modal>
        );
    }
}
