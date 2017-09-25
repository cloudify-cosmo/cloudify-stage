/**
 * Created by pposel on 11/08/2017.
 */

import React, { Component, PropTypes } from 'react';
import Const from '../../utils/consts';

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

    render () {
        let {Segment, Icon, Divider, List, Message, PopupConfirm} = Stage.Basic;

        return (
            <Segment style={this.props.style}>
                <Icon name="male"/> Tenants
                <Divider/>
                <List divided relaxed verticalAlign='middle' className="light">
                    {
                        this.props.tenants.map((item) => {
                            return (
                                <List.Item key={item}>
                                    {item === Const.DEFAULT_ALL ? 'all' : item}

                                    {item !== Const.DEFAULT_ALL && this.props.custom &&
                                    <PopupConfirm trigger={<Icon link name='remove' className="right floated" onClick={e => e.stopPropagation()}/>}
                                                  content='Are you sure to remove this tenant from template?'
                                                  onConfirm={() => this.props.onDelete(item)}/>
                                    }
                                </List.Item>
                            );
                        })
                    }
                    {_.isEmpty(this.props.tenants) && <Message content="No tenants available"/>}
                </List>
            </Segment>
        );
    }
}
