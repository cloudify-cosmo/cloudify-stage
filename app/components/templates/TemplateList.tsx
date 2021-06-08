// @ts-nocheck File not migrated fully to TS
/**
 * Created by pposel on 11/08/2017.
 */

import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import i18n from 'i18next';
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
                {_.isEmpty(templates) && (
                    <Message
                        content={i18n.t('templates.templateManagement.pageNotUsed', 'Page not used by any template')}
                    />
                )}
            </List>
        </Segment>
    );
}

TemplateList.propTypes = {
    templates: PropTypes.arrayOf(PropTypes.string),
    style: PropTypes.shape({})
};

TemplateList.defaultProps = {
    templates: [],
    style: {}
};
