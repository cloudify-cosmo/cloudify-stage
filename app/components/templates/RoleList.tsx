/**
 * Created by pposel on 11/08/2017.
 */

import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import i18n from 'i18next';
import { Segment, Icon, Divider, List, Message, PopupConfirm } from '../basic';

export default function RoleList({ custom, onDelete, roles, style }) {
    return (
        <Segment style={style}>
            <Icon name="student" /> Roles
            <Divider />
            <List divided relaxed verticalAlign="middle" className="light">
                {roles.map(item => {
                    return (
                        <List.Item key={item}>
                            {item}

                            {custom && _.size(roles) > 1 && (
                                <PopupConfirm
                                    trigger={
                                        <Icon
                                            link
                                            name="remove"
                                            className="right floated"
                                            onClick={e => e.stopPropagation()}
                                        />
                                    }
                                    content={i18n.t(
                                        'templates.templateManagement.roleList.removeConfirm',
                                        'Are you sure to remove this role from template?'
                                    )}
                                    onConfirm={() => onDelete(item)}
                                />
                            )}
                        </List.Item>
                    );
                })}
                {_.isEmpty(roles) && (
                    <Message content={i18n.t('templates.templateManagement.roleList.noRoles', 'No roles available')} />
                )}
            </List>
        </Segment>
    );
}

RoleList.propTypes = {
    custom: PropTypes.bool,
    onDelete: PropTypes.func,
    roles: PropTypes.arrayOf(PropTypes.string),
    style: PropTypes.shape({})
};

RoleList.defaultProps = {
    custom: false,
    onDelete: _.noop,
    roles: [],
    style: {}
};
