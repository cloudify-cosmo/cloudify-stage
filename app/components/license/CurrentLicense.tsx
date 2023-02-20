import i18n from 'i18next';
import { constant, isEmpty, join, map } from 'lodash';
import type { FunctionComponent } from 'react';
import React from 'react';
import type { SemanticICONS } from 'semantic-ui-react';
import type { LicenseResponse } from 'backend/handler/AuthHandler.types';
import styled from 'styled-components';
import StageUtils from '../../utils/stageUtils';
import { Header, Icon, Table } from '../basic';

export const StyledIcon = styled(Icon)`
    &&&& {
        display: inline-block;
        float: left;
        color: #65adff;
        font-size: 18px;
    }
`;
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
        <Table basic compact>
            <Table.Body>
                {map(fields, field => {
                    const value = license[field.name];

                    return !!field.hide && field.hide(value) ? null : (
                        <Table.Row key={field.header}>
                            <Table.Cell width={5}>
                                <Header as="h4">
                                    <StyledIcon name={field.icon} />
                                    <Header.Content>{field.header}</Header.Content>
                                </Header>
                            </Table.Cell>
                            <Table.Cell>{field.format(license[field.name])}</Table.Cell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table>
    );
};
export default CurrentLicense;
