/**
 * Created by kinneretzin on 26/09/2016.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { Button, ErrorMessage, Header, Icon, Popup, Table } from './basic/index';

export default class Services extends Component {
    static propTypes = {
        services: PropTypes.array,
        isFetching: PropTypes.bool,
        fetchingError: PropTypes.string,
        onStatusRefresh: PropTypes.func.isRequired
    };

    static defaultProps = {
        services: []
    };

    render() {
        const { services, isFetching, fetchingError, onStatusRefresh } = this.props;
        const activeServiceStatus = 'Active';
        const inactiveServiceStatus = 'Inactive';

        return (
            <Table celled basic="very" collapsing className="servicesData">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell colSpan="2">
                            <Header floated="left" style={{ width: 'auto', marginTop: '4px' }} size="medium">
                                <Icon name="settings" />
                                Manager Services Status
                            </Header>
                            <Button
                                floated="right"
                                className="refreshButton"
                                onClick={onStatusRefresh}
                                loading={isFetching}
                                disabled={isFetching}
                                circular
                                icon="refresh"
                            />
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {isFetching ? null : fetchingError ? (
                        <ErrorMessage error={fetchingError} header="Failed to fetch status" />
                    ) : (
                        _.map(services, service => {
                            const { description, isExternal, name, status } = service;

                            let iconName = 'question';
                            let iconColor = 'grey';
                            if (status === activeServiceStatus) {
                                iconName = 'checkmark';
                                iconColor = 'green';
                            } else if (status === inactiveServiceStatus) {
                                iconName = 'remove';
                                iconColor = 'red';
                            }

                            return (
                                <Table.Row key={name}>
                                    <Table.Cell collapsing>
                                        <Header size="tiny">
                                            <Header.Content>
                                                {name}&nbsp;
                                                {isExternal && (
                                                    <Popup>
                                                        <Popup.Trigger>
                                                            <Icon name="external square" />
                                                        </Popup.Trigger>
                                                        <Popup.Content>External</Popup.Content>
                                                    </Popup>
                                                )}
                                                {description && <Header.Subheader>{description}</Header.Subheader>}
                                            </Header.Content>
                                        </Header>
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                        <Icon name={iconName} color={iconColor} />
                                        {status}
                                    </Table.Cell>
                                </Table.Row>
                            );
                        })
                    )}
                </Table.Body>
            </Table>
        );
    }
}
