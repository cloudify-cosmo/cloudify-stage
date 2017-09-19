/**
 * Created by pposel on 11/08/2017.
 */

import React, { Component, PropTypes } from 'react';

export default class PageList extends Component {

    static propTypes = {
        pages: PropTypes.any.isRequired,
        onDelete: PropTypes.func,
        custom: PropTypes.bool,
        style: PropTypes.any
    };

    render () {
        let {Segment, Icon, Divider, List, Message, PopupConfirm} = Stage.Basic;

        var moreThenOne = _.size(this.props.pages) > 1;

        return (
            <Segment style={this.props.style}>
                <Icon name="block layout"/> Pages
                <Divider/>
                <List divided relaxed verticalAlign='middle' className="light">
                    {
                        this.props.pages.map((item) => {
                            return (
                                <List.Item key={item}>
                                    {item}

                                    {this.props.custom && moreThenOne &&
                                    <PopupConfirm trigger={<Icon link name='remove' className="right floated" onClick={e => e.stopPropagation()}/>}
                                        content='Are you sure to remove this page from template?'
                                        onConfirm={() => this.props.onDelete(item)}/>
                                    }
                                </List.Item>
                            );
                        })
                    }

                    {_.isEmpty(this.props.pages) && <Message content="No pages available"/>}
                </List>
            </Segment>
        );
    }
}