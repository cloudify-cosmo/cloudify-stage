/**
 * Created by kinneretzin on 26/09/2016.
 */

import React, { Component, PropTypes } from 'react';
import {Table, Icon, Header} from './basic/index';

export default class Services extends Component {

    static propTypes = {
        services: PropTypes.array
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
                            <Header style={{"marginTop":"1rem"}} size="medium"><Icon name='settings'/>Server Services Status</Header>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {
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
                                        <Icon name={instance.state==='running'?'checkmark':'warning'}/>
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

