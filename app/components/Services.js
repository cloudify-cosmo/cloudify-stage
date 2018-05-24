/**
 * Created by kinneretzin on 26/09/2016.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {Table, Icon, Header, Button, ErrorMessage} from './basic/index';

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
        return (
            <Table celled basic='very' collapsing className='servicesData'>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell colSpan='2'>
                            <Header floated='left' style={{width: 'auto', marginTop: '4px'}} size="medium"><Icon name='settings'/>Server Services Status</Header>
                            <Button floated='right' className='refreshButton' onClick={this.props.onStatusRefresh} loading={this.props.isFetching} disabled={this.props.isFetching} circular icon='refresh' />
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {
                        this.props.isFetching?
                            null
                        :
                        this.props.fetchingError ?
                            <ErrorMessage error={this.props.fetchingError} header="Failed to fetch status"/>
                        :
                            this.props.services.map((item)=>{
                                let instance = item.instances[0];
                                return (
                                    <Table.Row key={instance.Id}>
                                        <Table.Cell collapsing>
                                            <Header size="tiny">
                                                {item.display_name}
                                            <Header.Subheader>
                                            {instance.Description}
                                            </Header.Subheader>
                                            </Header>
                                        </Table.Cell>
                                        <Table.Cell textAlign="center">
                                            <Icon name={instance.state === 'running' ? 'checkmark' : 'warning'}/>
                                            {instance.state}
                                        </Table.Cell>
                                    </Table.Row>
                                );
                            })
                    }
                </Table.Body>
            </Table>
        );
    }
}

