import { noop } from 'lodash';
import React from 'react';
import i18n from 'i18next';
import Const from '../../../utils/consts';
import { Segment, Icon, Divider, List, Message, PopupConfirm } from '../../basic';
import type { CommonListProps } from './types';

interface TenantListProps extends CommonListProps {
    tenants: string[];
}

export default function TenantList({ custom = false, onDelete = noop, style, tenants = [] }: TenantListProps) {
    return (
        <Segment style={style}>
            <Icon name="male" /> Tenants
            <Divider />
            <List divided relaxed verticalAlign="middle" className="light">
                {tenants.map(tenant => {
                    return (
                        <List.Item key={tenant}>
                            {tenant === Const.DEFAULT_ALL ? 'all' : tenant}

                            {custom && _.size(tenants) > 1 && (
                                <PopupConfirm
                                    trigger={
                                        <Icon
                                            link
                                            name="remove"
                                            className="right floated"
                                            onClick={(event: Event) => event.stopPropagation()}
                                        />
                                    }
                                    content={i18n.t(
                                        'templates.templateManagement.tenantsList.removeConfirm',
                                        'Are you sure to remove this tenant from template?'
                                    )}
                                    onConfirm={() => onDelete(tenant)}
                                />
                            )}
                        </List.Item>
                    );
                })}
                {_.isEmpty(tenants) && (
                    <Message content={i18n.t('templates.templateManagement.tenantsList.noTenants')} />
                )}
            </List>
        </Segment>
    );
}
