/**
 * Created by jakub.niezgoda on 15/03/2019.
 */
import i18n from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import { Icon, Header, Message, Segment, Table } from '../basic';

export default function CurrentVersion({ version = {} }) {
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
                        const value = version[field.name];

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
                                <Table.Cell>{field.format(version[field.name])}</Table.Cell>
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

CurrentVersion.propTypes = {
    version: PropTypes.shape({
        build: PropTypes.string,
        commit: PropTypes.string,
        date: PropTypes.string,
        distribution: PropTypes.string,
        distro_release: PropTypes.string,
        edition: PropTypes.string,
        version: PropTypes.string
    }).isRequired
};
