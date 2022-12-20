import i18n from 'i18next';
import { constant, isEmpty, join, map } from 'lodash';
import type { FunctionComponent } from 'react';
import React from 'react';
import type { SemanticICONS } from 'semantic-ui-react';
import type { LicenseResponse } from 'backend/handler/AuthHandler.types';
import StageUtils from '../../utils/stageUtils';
import { Header, Icon, Segment, Table } from '../basic';

interface CurrentLicenseProps {
    license: LicenseResponse | null;
}

const CurrentLicense: FunctionComponent<CurrentLicenseProps> = ({ license }) => {
    if (!license || isEmpty(license)) {
        return null;
    }

    const formatExpirationDate = (date: string) =>
        isEmpty(date)
            ? i18n.t('licenseManagement.expirationDateNever', 'Never')
            : StageUtils.formatLocalTimestamp(date, 'DD-MM-YYYY');
    const formatVersion = (version: string) =>
        isEmpty(version) ? i18n.t('licenseManagement.allVersions', 'All') : String(version);
    const formatCapabilities = (capabilities: string[]) => join(capabilities, ', ');
    const isFalse = (value: boolean) => !value;

    type Field = {
        name: keyof LicenseResponse;
        header: string;
        icon: SemanticICONS;
        format: (value: any) => string;
        hide?: (value: any) => boolean;
    };
    const fields: Field[] = [
        {
            name: 'expiration_date',
            header: i18n.t('licenseManagement.expirationDate', 'Expiration Date'),
            icon: 'clock',
            format: formatExpirationDate
        },
        {
            name: 'cloudify_version',
            header: i18n.t('licenseManagement.validForVersion', 'Valid For Version'),
            icon: 'thumbs up',
            format: formatVersion
        },
        {
            name: 'license_edition',
            header: i18n.t('licenseManagement.licenseEdition', 'License Edition'),
            icon: 'file alternate outline',
            format: String
        },
        {
            name: 'capabilities',
            header: i18n.t('licenseManagement.capabilities', 'Capabilities'),
            icon: 'wrench',
            format: formatCapabilities,
            hide: isEmpty
        },
        {
            name: 'trial',
            header: i18n.t('licenseManagement.trial', 'Trial'),
            icon: 'lab',
            format: constant(i18n.t('licenseManagement.trialYes', 'Yes')),
            hide: isFalse
        },
        {
            name: 'customer_id',
            header: i18n.t('licenseManagement.licensedTo', 'Licensed To'),
            icon: 'handshake',
            format: String,
            hide: isEmpty
        }
    ];

    return (
        <Segment>
            <Table basic="very" size="large" celled>
                <Table.Body>
                    {map(fields, field => {
                        const value = license[field.name];

                        return !!field.hide && field.hide(value) ? null : (
                            <Table.Row key={field.header}>
                                <Table.Cell width={5}>
                                    <Header as="h4">
                                        <Icon
                                            name={field.icon}
                                            size="large"
                                            style={{ display: 'inline-block', float: 'left' }}
                                        />
                                        <Header.Content>{field.header}</Header.Content>
                                    </Header>
                                </Table.Cell>
                                <Table.Cell>{field.format(license[field.name])}</Table.Cell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table>
        </Segment>
    );
};
export default CurrentLicense;
