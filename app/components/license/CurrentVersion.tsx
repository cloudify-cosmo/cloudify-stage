import type { SemanticICONS } from 'semantic-ui-react';
import i18n from 'i18next';
import { capitalize, compact, isEmpty, join, map, startCase } from 'lodash';
import React from 'react';

import type { VersionResponse } from 'backend/handler/AuthHandler.types';
import { Header, Message, Table } from '../basic';
import { StyledIcon } from './CurrentLicense';

interface ExtendedVersion extends Partial<VersionResponse> {
    distro: string;
    // eslint-disable-next-line camelcase
    full_version: string;
}

interface CurrentVersionProps {
    version: Partial<VersionResponse>;
}

interface VersionField {
    name: keyof ExtendedVersion;
    header: string;
    icon: SemanticICONS;
    format: (string?: string) => string;
    hide?: (value?: string) => boolean;
}

export default function CurrentVersion({ version }: CurrentVersionProps) {
    const extendedVersion: ExtendedVersion = {
        ...version,
        distro: join([version.distribution, version.distro_release], ' '),
        full_version: `${join(compact([version.version, version.build, version.date, version.commit]), ' ')}
         (${capitalize(version.edition)})`
    };

    const fields: VersionField[] = [
        { name: 'full_version', header: i18n.t('licenseManagement.version', 'Version'), icon: 'star', format: String },
        {
            name: 'distro',
            header: i18n.t('licenseManagement.distribution', 'Distribution'),
            icon: 'linux',
            format: startCase,
            hide: isEmpty
        }
    ];

    return !isEmpty(version) ? (
        <Table basic compact>
            <Table.Body>
                {map(fields, field => {
                    const value = extendedVersion[field.name];

                    return !!field.hide && field.hide(value) ? null : (
                        <Table.Row key={field.header}>
                            <Table.Cell width={5}>
                                <Header as="h4">
                                    <StyledIcon name={field.icon} />
                                    <Header.Content>{field.header}</Header.Content>
                                </Header>
                            </Table.Cell>
                            <Table.Cell>{field.format(value)}</Table.Cell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table>
    ) : (
        <Message>{i18n.t('licenseManagement.noVersion', 'There is no version data.')}</Message>
    );
}
