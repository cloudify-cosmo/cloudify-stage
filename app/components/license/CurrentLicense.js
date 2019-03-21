/**
 * Created by jakub.niezgoda on 15/03/2019.
 */

import React from 'react';
import StageUtils from '../../utils/stageUtils';

import {Icon, Header, Segment, Table} from '../basic';

export default function CurrentLicense({license}) {
    const formatTrial = (isTrial) => isTrial ? 'Yes' : 'No';
    const formatExpirationDate = StageUtils.formatLocalTimestamp;
    const formatVersion = (version) => _.isEmpty(version) ? 'All' : String(version);
    const formatCapabilities = (capabilities) => _.join(capabilities, ', ');
    const isFalse = (boolValue) => !boolValue;

    const fields = [
        {name: 'expiration_date', header: 'Expiration Date', icon: 'clock', format: formatExpirationDate},
        {name: 'cloudify_version', header: 'Valid For Version', icon: 'thumbs up', format: formatVersion},
        {name: 'license_edition', header: 'License Edition', icon: 'file alternate outline', format: String},
        {name: 'capabilities', header: 'Capabilities', icon: 'wrench', format: formatCapabilities, hide: _.isEmpty},
        {name: 'trial', header: 'Trial', icon: 'lab', format: formatTrial, hide: isFalse},
        {name: 'customer_id', header: 'Licensed To', icon: 'handshake', format: String, hide: _.isEmpty},
    ];

    return !_.isEmpty(license) &&
        <Segment>
            <Table basic='very' size='large' celled >
                <Table.Body>
                    {
                        _.map(fields, (field) => {
                            const value = license[field.name];

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
                                        {field.format(license[field.name])}
                                    </Table.Cell>
                                </Table.Row>
                        })
                    }
                </Table.Body>
            </Table>
        </Segment>
}