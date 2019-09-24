/**
 * Created by pposel on 11/08/2017.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Segment, Icon, Divider, List, Message, PopupConfirm } from '../basic';

export default class RoleList extends Component {
    static propTypes = {
        roles: PropTypes.any.isRequired,
        onDelete: PropTypes.func,
        custom: PropTypes.bool,
        style: PropTypes.any
    };

    static defaultProps = {
        roles: []
    };

    render() {
        return (
            <Segment style={this.props.style}>
                <Icon name="student" /> Roles
                <Divider />
                <List divided relaxed verticalAlign="middle" className="light">
                    {this.props.roles.map(item => {
                        return (
                            <List.Item key={item}>
                                {item}

                                {this.props.custom && _.size(this.props.roles) > 1 && (
                                    <PopupConfirm
                                        trigger={
                                            <Icon
                                                link
                                                name="remove"
                                                className="right floated"
                                                onClick={e => e.stopPropagation()}
                                            />
                                        }
                                        content="Are you sure to remove this role from template?"
                                        onConfirm={() => this.props.onDelete(item)}
                                    />
                                )}
                            </List.Item>
                        );
                    })}
                    {_.isEmpty(this.props.roles) && <Message content="No roles available" />}
                </List>
            </Segment>
        );
    }
}
