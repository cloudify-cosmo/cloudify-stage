/**
 * Created by pposel on 11/08/2017.
 */

import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import i18n from 'i18next';
import Const from '../../utils/consts';
import { Segment, Icon, Divider, List, Message, PopupConfirm } from '../basic';

export default function TenantList({ custom, onDelete, style, tenants }) {
    return (
        <Segment style={style}>
            <Icon name="male" /> Tenants
            <Divider />
            <List divided relaxed verticalAlign="middle" className="light">
                {tenants.map(item => {
                    return (
                        <List.Item key={item}>
                            {item === Const.DEFAULT_ALL ? 'all' : item}

                            {custom && _.size(tenants) > 1 && (
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
                                        'templates.templateManagement.tenantsList.removeConfirm',
                                        'Are you sure to remove this tenant from template?'
                                    )}
                                    onConfirm={() => onDelete(item)}
                                />
                            )}
                        </List.Item>
                    );
                })}
                {_.isEmpty(tenants) && (
                    <Message
                        content={i18n.t('templates.templateManagement.tenantsList.noTenants', 'No tenants available')}
                    />
                )}
            </List>
        </Segment>
    );
}

TenantList.propTypes = {
    custom: PropTypes.bool,
    onDelete: PropTypes.func,
    style: PropTypes.shape({}),
    tenants: PropTypes.arrayOf(PropTypes.string)
};

TenantList.defaultProps = {
    custom: false,
    onDelete: _.noop,
    style: {},
    tenants: []
};
