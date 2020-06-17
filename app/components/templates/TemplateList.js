/**
 * Created by pposel on 11/08/2017.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Segment, Icon, Divider, List, Message } from '../basic';

export default function TemplateList({ style, templates }) {
    return (
        <Segment style={style}>
            <Icon name="list layout" /> Templates
            <Divider />
            <List divided relaxed verticalAlign="middle" className="light">
                {templates.map(item => {
                    return <List.Item key={item}>{item}</List.Item>;
                })}
                {_.isEmpty(templates) && <Message content="Page not used by any template" />}
            </List>
        </Segment>
    );
}

TemplateList.propTypes = {
    templates: PropTypes.arrayOf(PropTypes.shape({})),
    style: PropTypes.shape({})
};

TemplateList.defaultProps = {
    templates: [],
    style: {}
};
