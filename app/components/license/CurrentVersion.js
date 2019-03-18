/**
 * Created by jakub.niezgoda on 15/03/2019.
 */

import React from 'react';

import {Icon, Header, Message, Table} from '../basic';

export default function CurrentVersion({version = {}}) {
    version.distro = _.join([version.distribution, version.distro_release], ' ');
    version.full_version =
        `${_.join(_.compact([version.version, version.build, version.date, version.commit]), ' ')}
         (${_.capitalize(version.edition)})`;

    const fields = [
        {name: 'full_version', header: 'Version', icon: 'star', format: String},
        {name: 'distro', header: 'Distribution', icon: 'linux', format: _.startCase, hide: _.isEmpty}
    ];

    return !_.isEmpty(version)
        ?
        <Table basic='very' size='large' celled >
            <Table.Body>
                {
                    _.map(fields, (field) => {
                        const value = version[field.name];

                        return !!field.hide && field.hide(value)
                            ?
                            null
                            :
                            <Table.Row key={field.header}>
                                <Table.Cell width={5}>
                                    <Header as='h4'>
                                        <Icon name={field.icon} size='large'
                                              style={{display: 'inline-block', float: 'left'}}/>
                                        <Header.Content>
                                            {field.header}
                                        </Header.Content>
                                    </Header>
                                </Table.Cell>
                                <Table.Cell>
                                    {field.format(version[field.name])}
                                </Table.Cell>
                            </Table.Row>
                    })
                }
            </Table.Body>
        </Table>
        :
        <Message>There is no version data.</Message>
}