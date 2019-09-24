/**
 * Created by pposel on 11/08/2017.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Const from '../../utils/consts';
import { Segment, Icon, Divider, List, Message, PopupConfirm } from '../basic';

export default class TenantList extends Component {
    static propTypes = {
        tenants: PropTypes.any.isRequired,
        onDelete: PropTypes.func,
        custom: PropTypes.bool,
        style: PropTypes.any
    };

    static defaultProps = {
        tenants: []
    };

    render() {
        return (
            <Segment style={this.props.style}>
                <Icon name="male" /> Tenants
                <Divider />
                <List divided relaxed verticalAlign="middle" className="light">
                    {this.props.tenants.map(item => {
                        return (
                            <List.Item key={item}>
                                {item === Const.DEFAULT_ALL ? 'all' : item}

                                {this.props.custom && _.size(this.props.tenants) > 1 && (
                                    <PopupConfirm
                                        trigger={
                                            <Icon
                                                link
                                                name="remove"
                                                className="right floated"
                                                onClick={e => e.stopPropagation()}
                                            />
                                        }
                                        content="Are you sure to remove this tenant from template?"
                                        onConfirm={() => this.props.onDelete(item)}
                                    />
                                )}
                            </List.Item>
                        );
                    })}
                    {_.isEmpty(this.props.tenants) && <Message content="No tenants available" />}
                </List>
            </Segment>
        );
    }
}
