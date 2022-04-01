import i18n from 'i18next';
import _ from 'lodash';
import React from 'react';
import type { FunctionComponent } from 'react';
import type { SemanticICONS } from 'semantic-ui-react';
import StageUtils from '../../utils/stageUtils';
import { Icon, Header, Segment, Table } from '../basic';
import type { LicenseData } from '../../reducers/managerReducer';

interface CurrentLicenseProps {
    license: LicenseData;
}

const CurrentLicense: FunctionComponent<CurrentLicenseProps> = ({ license }) => {
    if (_.isEmpty(license)) {
        return null;
    }

    const formatExpirationDate = (stringDate: string) =>
        _.isEmpty(stringDate)
            ? i18n.t('licenseManagement.expirationDateNever', 'Never')
            : StageUtils.formatLocalTimestamp(stringDate, 'DD-MM-YYYY');
    const formatVersion = (version: string) =>
        _.isEmpty(version) ? i18n.t('licenseManagement.allVersions', 'All') : String(version);
    const formatCapabilities = (capabilities: string[]) => _.join(capabilities, ', ');
    const isFalse = (boolValue: boolean) => !boolValue;

    type Field = {
        name: keyof LicenseData;
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
            hide: _.isEmpty
        },
        {
            name: 'trial',
            header: i18n.t('licenseManagement.trial', 'Trial'),
            icon: 'lab',
            format: _.constant(i18n.t('licenseManagement.trialYes', 'Yes')),
            hide: isFalse
        },
        {
            name: 'customer_id',
            header: i18n.t('licenseManagement.licensedTo', 'Licensed To'),
            icon: 'handshake',
            format: String,
            hide: _.isEmpty
        }
    ];

    return (
        <Segment>
            <Table basic="very" size="large" celled>
                <Table.Body>
                    {_.map(fields, field => {
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
