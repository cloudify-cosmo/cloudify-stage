// @ts-nocheck File not migrated fully to TS
/**
 * Created by pposel on 11/08/2017.
 */

import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import i18n from 'i18next';
import { Segment, Icon, Divider, List, Message, PopupConfirm } from '../basic';

export default function PageList({ custom, onDelete, pages, style }) {
    return (
        <Segment style={style}>
            <Icon name="block layout" /> Pages
            <Divider />
            <List divided relaxed verticalAlign="middle" className="light">
                {pages.map(({ id: item }) => {
                    return (
                        <List.Item key={item}>
                            {item}

                            {custom && _.size(pages) > 1 && (
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
                                        'templates.templateManagement.pageList.removeConfirm',
                                        'Are you sure to remove this page from template?'
                                    )}
                                    onConfirm={() => onDelete(item)}
                                />
                            )}
                        </List.Item>
                    );
                })}

                {_.isEmpty(pages) && (
                    <Message content={i18n.t('templates.templateManagement.pageList.noPages', 'No pages available')} />
                )}
            </List>
        </Segment>
    );
}

PageList.propTypes = {
    pages: PropTypes.arrayOf(PropTypes.string).isRequired,
    onDelete: PropTypes.func,
    custom: PropTypes.bool,
    style: PropTypes.shape({})
};

PageList.defaultProps = {
    onDelete: _.noop,
    custom: false,
    style: {}
};
