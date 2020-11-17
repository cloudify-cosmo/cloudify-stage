import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import { clusterServiceEnum, clusterServices } from './consts';
import { Header, Icon, Label } from '../../basic';

export default function ClusterService({ name, isExternal }) {
    const icon = {
        [clusterServiceEnum.manager]: 'settings',
        [clusterServiceEnum.db]: 'database',
        [clusterServiceEnum.broker]: 'comments'
    }[name];

    return (
        <div style={{ verticalAlign: 'middle', padding: 10, overflow: 'auto' }}>
            <Header floated="left" style={{ margin: 0 }}>
                <Icon name={icon} size="large" /> {i18n.t(`cluster.${name}`)}
            </Header>
            {isExternal && (
                <Label color="black" style={{ marginLeft: 10, float: 'right' }}>
                    External
                </Label>
            )}
        </div>
    );
}

ClusterService.propTypes = {
    name: PropTypes.oneOf(clusterServices).isRequired,
    isExternal: PropTypes.bool.isRequired
};
