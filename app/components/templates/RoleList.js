/**
 * Created by pposel on 11/08/2017.
 */

import React, { Component, PropTypes } from 'react';
import Const from '../../utils/consts';

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

    render () {
        let {Segment, Icon, Divider, List, Message, PopupConfirm} = Stage.Basic;

        var moreThenOne = _.size(this.props.roles) > 1;

        return (
            <Segment style={this.props.style}>
                <Icon name="student"/> Roles
                <Divider/>
                <List divided relaxed verticalAlign='middle' className="light">
                    {
                        this.props.roles.map((item) => {
                            return (
                                <List.Item key={item}>
                                    {item === Const.DEFAULT_ALL ? 'all' : item}

                                    {this.props.custom && moreThenOne &&
                                    <PopupConfirm trigger={<Icon link name='remove' className="right floated" onClick={e => e.stopPropagation()}/>}
                                                  content='Are you sure to remove this role from template?'
                                                  onConfirm={() => this.props.onDelete(item)}/>
                                    }
                                </List.Item>
                            );
                        })
                    }
                    {_.isEmpty(this.props.roles) && <Message content="No roles available"/>}
                </List>
            </Segment>
        );
    }
}
