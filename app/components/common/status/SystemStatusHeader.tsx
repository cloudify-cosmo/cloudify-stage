import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import i18n from 'i18next';
import type { MouseEvent } from 'react';
import { getClusterStatus } from '../../../actions/manager/clusterStatus';
import { Button, Header } from '../../basic';
import SystemStatusIcon from './SystemStatusIcon';
import type { ReduxState } from '../../../reducers';

export default function SystemStatusHeader() {
    const isFetching = useSelector((state: ReduxState) => state.manager.clusterStatus.isFetching);
    const dispatch = useDispatch();

    const onStatusRefresh = (event: MouseEvent) => {
        event.stopPropagation();
        dispatch(getClusterStatus());
    };
    return (
        <div style={{ verticalAlign: 'middle', overflow: 'hidden' }}>
            <Header floated="left" style={{ width: 'auto', marginTop: '4px' }} size="medium">
                <SystemStatusIcon />
                {i18n.t('cluster.systemStatus')}
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
