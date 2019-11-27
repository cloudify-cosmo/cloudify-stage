import React from 'react';
import PropTypes from 'prop-types';

import { Button, Header } from './basic/index';
import SystemStatusIcon from '../containers/SystemStatusIcon';

export default function SystemStatusHeader({ onStatusRefresh, isFetching }) {
    return (
        <div style={{ height: 36 }}>
            <Header floated="left" style={{ width: 'auto', marginTop: '4px' }} size="medium">
                <SystemStatusIcon />
                System Status
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
