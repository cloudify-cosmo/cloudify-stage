/**
 * Created by pposel on 11/08/2017.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Segment, Icon, Divider, List, Message, PopupConfirm } from '../basic';

export default class PageList extends Component {
    static propTypes = {
        pages: PropTypes.any.isRequired,
        onDelete: PropTypes.func,
        custom: PropTypes.bool,
        style: PropTypes.any
    };

    render() {
        return (
            <Segment style={this.props.style}>
                <Icon name="block layout" /> Pages
                <Divider />
                <List divided relaxed verticalAlign="middle" className="light">
                    {this.props.pages.map(item => {
                        return (
                            <List.Item key={item}>
                                {item}

                                {this.props.custom && _.size(this.props.pages) > 1 && (
                                    <PopupConfirm
                                        trigger={
                                            <Icon
                                                link
                                                name="remove"
                                                className="right floated"
                                                onClick={e => e.stopPropagation()}
                                            />
                                        }
                                        content="Are you sure to remove this page from template?"
                                        onConfirm={() => this.props.onDelete(item)}
                                    />
                                )}
                            </List.Item>
                        );
                    })}

                    {_.isEmpty(this.props.pages) && <Message content="No pages available" />}
                </List>
            </Segment>
        );
    }
}
