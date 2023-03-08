import { noop } from 'lodash';
import React from 'react';
import i18n from 'i18next';
import { Segment, Icon, Divider, List, Message, PopupConfirm } from '../../basic';
import type { CommonListProps } from './types';

interface RoleListProps extends CommonListProps {
    roles: string[];
}

export default function RoleList({ custom = false, onDelete = noop, roles = [], style }: RoleListProps) {
    return (
        <Segment style={style}>
            <Icon name="student" /> Roles
            <Divider />
            <List divided relaxed verticalAlign="middle" className="light">
                {roles.map(role => {
                    return (
                        <List.Item key={role}>
                            {role}

                            {custom && _.size(roles) > 1 && (
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
                                        'templates.templateManagement.roleList.removeConfirm',
                                        'Are you sure to remove this role from template?'
                                    )}
                                    onConfirm={() => onDelete(role)}
                                />
                            )}
                        </List.Item>
                    );
                })}
                {_.isEmpty(roles) && <Message content={i18n.t('templates.templateManagement.roleList.noRoles')} />}
            </List>
        </Segment>
    );
}
