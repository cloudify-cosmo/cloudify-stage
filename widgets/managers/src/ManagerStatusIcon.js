/**
 * Created by jakub.niezgoda on 25/10/2018.
 */

import PropTypes from 'prop-types';
import React from 'react';

export default class ManagerStatusIcon extends React.Component {

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
    static numberOfServices = ManagerStatusIcon.knownServices.length;

    static managerStatusRunning = 'running';
    static managerStatusStopped = 'stopped';
    static managerStatusError = 'error';
    static managerStatusUnknown = 'unknown';

    static statusParameters = {
        [ManagerStatusIcon.managerStatusRunning]: {
            icon: 'signal',
            color: 'green',
            text: 'Running'
        },
        [ManagerStatusIcon.managerStatusStopped]: {
            icon: 'signal',
            color: 'orange',
            text: 'Stopped'
        },
        [ManagerStatusIcon.managerStatusError]: {
            icon: 'signal',
            color: 'red',
            text: 'Error'
        },
        [ManagerStatusIcon.managerStatusUnknown]: {
            icon: 'question',
            color: 'yellow',
            text: 'Unknown'
        }
    };

    static okStatusString = 'OK';

    getServices() {
        return _.pick(this.props.status, ManagerStatusIcon.knownServices);
    };

    getStatus() {
        const services = this.getServices();

        if (!_.isEmpty(this.props.error)) {
            return ManagerStatusIcon.managerStatusError
        }

        if (_.size(services) === ManagerStatusIcon.numberOfServices) {
            if (!!_.find(services, (service) => service !== ManagerStatusIcon.okStatusString)) {
                return ManagerStatusIcon.managerStatusStopped;
            } else {
                return ManagerStatusIcon.managerStatusRunning;
            }
        } else {
            return ManagerStatusIcon.managerStatusUnknown;
        }

    }

    render() {
        let {Icon, Message, Popup, Table} = Stage.Basic;
        const status = ManagerStatusIcon.statusParameters[this.getStatus()];
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
                                                <Icon name={status === ManagerStatusIcon.okStatusString ? 'checkmark' : 'warning'}
                                                      color={status === ManagerStatusIcon.okStatusString ? 'green' : 'red'}/>
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

