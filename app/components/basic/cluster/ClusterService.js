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
        <div style={{ verticalAlign: 'middle', padding: 10, overflow: 'auto' }}>
            <Header floated="left" style={{ margin: 0 }}>
                <Icon name={icon} size="large" /> {clusterServiceName[name]}
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
