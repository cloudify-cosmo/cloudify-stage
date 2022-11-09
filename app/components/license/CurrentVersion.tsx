import type { SemanticICONS } from 'semantic-ui-react';
import i18n from 'i18next';
import _ from 'lodash';
import React from 'react';

import { Icon, Header, Message, Segment, Table } from '../basic';
import type { VersionResponse } from '../../../backend/handler/AuthHandler.types';

interface Version extends VersionResponse {
    distro: string;
    // eslint-disable-next-line camelcase
    full_version: string;
}

interface CurrentVersionProps {
    version: Version;
}

export default function CurrentVersion({ version }: CurrentVersionProps) {
    version.distro = _.join([version.distribution, version.distro_release], ' ');
    version.full_version = `${_.join(_.compact([version.version, version.build, version.date, version.commit]), ' ')}
         (${_.capitalize(version.edition)})`;

    const fields = [
        { name: 'full_version', header: i18n.t('licenseManagement.version', 'Version'), icon: 'star', format: String },
        {
            name: 'distro',
            header: i18n.t('licenseManagement.distribution', 'Distribution'),
            icon: 'linux',
            format: _.startCase,
            hide: _.isEmpty
        }
    ];

    return !_.isEmpty(version) ? (
        <Segment>
            <Table basic="very" size="large" celled>
                <Table.Body>
                    {_.map(fields, field => {
                        const value = version[field.name as keyof Version];

                        return !!field.hide && field.hide(value) ? null : (
                            <Table.Row key={field.header}>
                                <Table.Cell width={5}>
                                    <Header as="h4">
                                        <Icon
                                            name={field.icon as SemanticICONS}
                                            size="large"
                                            style={{ display: 'inline-block', float: 'left' }}
                                        />
                                        <Header.Content>{field.header}</Header.Content>
                                    </Header>
                                </Table.Cell>
                                <Table.Cell>{field.format(value)}</Table.Cell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table>
        </Segment>
    ) : (
        <Message>{i18n.t('licenseManagement.noVersion', 'There is no version data.')}</Message>
    );
}
