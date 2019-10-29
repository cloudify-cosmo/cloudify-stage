import React from 'react';
import PropTypes from 'prop-types';
import { Header, Icon, Label } from 'semantic-ui-react';

import { clusterServiceEnum, clusterServices, clusterServiceName } from './consts';

export default function ClusterService({ name, isExternal }) {
    const icon = {
        [clusterServiceEnum.manager]: 'settings',
        [clusterServiceEnum.db]: 'database',
        [clusterServiceEnum.broker]: 'comments'
    }[name];

    return (
        <div style={{ verticalAlign: 'middle' }}>
            {isExternal && (
                <Label color="black" style={{ float: 'right' }}>
                    External
                </Label>
            )}
            <Header style={{ marginTop: 0 }}>
                <Icon name={icon} /> {clusterServiceName[name]}
            </Header>
        </div>
    );
}

ClusterService.propTypes = {
    name: PropTypes.oneOf(clusterServices).isRequired,
    isExternal: PropTypes.bool.isRequired
};
