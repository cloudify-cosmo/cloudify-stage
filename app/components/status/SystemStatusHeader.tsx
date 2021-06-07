import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import { Button, Header } from '../basic';
import SystemStatusIcon from '../../containers/status/SystemStatusIcon';

export default function SystemStatusHeader({ onStatusRefresh, isFetching }) {
    return (
        <div style={{ verticalAlign: 'middle', overflow: 'hidden' }}>
            <Header floated="left" style={{ width: 'auto', marginTop: '4px' }} size="medium">
                <SystemStatusIcon />
                {i18n.t('cluster.systemStatus', 'System Status')}
            </Header>
            <Button
                floated="right"
                className="refreshButton"
                onClick={onStatusRefresh}
                loading={isFetching}
                disabled={isFetching}
                circular
                icon="refresh"
            />
        </div>
    );
}
SystemStatusHeader.propTypes = {
    onStatusRefresh: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired
};
