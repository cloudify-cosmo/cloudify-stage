import React from 'react';
import { connect } from 'react-redux';
import i18n from 'i18next';
import type { MouseEvent } from 'react';
import type { ButtonProps } from 'semantic-ui-react';
import { getClusterStatus } from '../../actions/manager/clusterStatus';
import { Button, Header } from '../basic';
import SystemStatusIcon from './SystemStatusIcon';
import type { ReduxState } from '../../reducers';
import type { ReduxThunkDispatch } from '../../configureStore';

export interface SystemStatusHeaderProps {
    onStatusRefresh: ButtonProps['onClick'];
    isFetching?: boolean;
}

function SystemStatusHeader({ onStatusRefresh, isFetching }: SystemStatusHeaderProps) {
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

const mapStateToProps = (state: ReduxState) => {
    const { isFetching, error: fetchingError } = state.manager.clusterStatus;
    return { isFetching, fetchingError };
};

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => {
    return {
        onStatusRefresh: (event: MouseEvent) => {
            event.stopPropagation();
            dispatch(getClusterStatus());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SystemStatusHeader);
