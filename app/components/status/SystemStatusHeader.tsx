import React from 'react';
import i18n from 'i18next';
import type { ButtonProps } from 'semantic-ui-react';
import { Button, Header } from '../basic';
import SystemStatusIcon from '../../containers/status/SystemStatusIcon';

interface SystemStatusHeaderProps {
    onStatusRefresh: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: ButtonProps) => void;
    isFetching: boolean;
}

export default function SystemStatusHeader({ onStatusRefresh, isFetching }: SystemStatusHeaderProps) {
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
