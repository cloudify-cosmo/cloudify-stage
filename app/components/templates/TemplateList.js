/**
 * Created by pposel on 11/08/2017.
 */

import React, { Component, PropTypes } from 'react';

export default class TemplateList extends Component {

    static propTypes = {
        templates: PropTypes.any.isRequired,
        style: PropTypes.any
    };

    static defaultProps = {
        tenants: []
    };

    render () {
        let {Segment, Icon, Divider, List, Message} = Stage.Basic;

        return (
            <Segment style={this.props.style}>
                <Icon name="list layout"/> Templates
                <Divider/>
                <List divided relaxed verticalAlign='middle' className="light">
                    {
                        this.props.templates.map((item) => {
                            return (
                                <List.Item key={item}>
                                    {item}
                                </List.Item>
                            );
                        })
                    }
                    {_.isEmpty(this.props.templates) && <Message content="Page not used by any template"/>}
                </List>
            </Segment>
        );
    }
}
