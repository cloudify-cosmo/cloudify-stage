/**
 * Created by jakub.niezgoda on 25/10/2018.
 */

import PropTypes from 'prop-types';
import React from 'react';

export default class StatusIcon extends React.Component {

    constructor(props, context){
        super(props, context);
    }

    static propTypes = {
        status: PropTypes.object,
        error: PropTypes.string
    };

    static defaultProps = {
        status: {},
        error: ''
    };

    static knownServices = ['database', 'consul', 'cloudify services', 'heartbeat'];
    static numberOfServices = StatusIcon.knownServices.length;

    static managerStatusRunning = 'running';
    static managerStatusStopped = 'stopped';
    static managerStatusError = 'error';
    static managerStatusUnknown = 'unknown';

    static statusParameters = {
        [StatusIcon.managerStatusRunning]: {
            icon: 'signal',
            color: 'green',
            text: 'Running'
        },
        [StatusIcon.managerStatusStopped]: {
            icon: 'signal',
            color: 'orange',
            text: 'Stopped'
        },
        [StatusIcon.managerStatusError]: {
            icon: 'signal',
            color: 'red',
            text: 'Error'
        },
        [StatusIcon.managerStatusUnknown]: {
            icon: 'question',
            color: 'yellow',
            text: 'Unknown'
        }
    };

    static okStatusString = 'OK';

    getServices() {
        return _.pick(this.props.status, StatusIcon.knownServices);
    };

    getStatus() {
        const services = this.getServices();

        if (!_.isEmpty(this.props.error)) {
            return StatusIcon.managerStatusError
        }

        if (_.size(services) === StatusIcon.numberOfServices) {
            if (!!_.find(services, (service) => service !== StatusIcon.okStatusString)) {
                return StatusIcon.managerStatusStopped;
            } else {
                return StatusIcon.managerStatusRunning;
            }
        } else {
            return StatusIcon.managerStatusUnknown;
        }

    }

    render() {
        let {Icon, Message, Popup, Table} = Stage.Basic;
        const status = StatusIcon.statusParameters[this.getStatus()];
        const services = this.getServices();
        const error = this.props.error;

        return (
            <Popup on='hover' wide trigger={<Icon name={status.icon} color={status.color} circular inverted />}>
                <Popup.Header>
                    Status: {status.text}
                </Popup.Header>
                <Popup.Content>
                    {
                        !_.isEmpty(error) &&
                            <Message error>{error}</Message>
                    }
                    {
                        !_.isEmpty(services) &&
                        <Table celled basic='very' collapsing className='servicesData'>
                            <Table.Body>
                                {
                                    _.map(services, (status, service) =>
                                        <Table.Row key={service}>
                                            <Table.Cell collapsing>
                                                {_.upperFirst(service)}
                                            </Table.Cell>
                                            <Table.Cell textAlign="center">
                                                <Icon name={status === StatusIcon.okStatusString ? 'checkmark' : 'warning'}
                                                      color={status === StatusIcon.okStatusString ? 'green' : 'red'}/>
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                }
                            </Table.Body>
                        </Table>
                    }
                </Popup.Content>
            </Popup>
        );
    }
}

