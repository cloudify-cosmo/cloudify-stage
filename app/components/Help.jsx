/**
 * Created by jakubniezgoda on 26/02/2018.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { HeaderMenu } from 'cloudify-ui-components';

import i18n from 'i18next';
import { Dropdown, Icon } from './basic';
import StageUtils from '../utils/stageUtils';

export default function Help({ onAbout, version }) {
    const { redirectToPage } = StageUtils.Url;

    return (
        <HeaderMenu trigger={<Icon name="help circle" style={{ margin: 0 }} />}>
            <Dropdown.Item
                icon="book"
                text={i18n.t('help.documentation', 'Documentation')}
                onClick={() => redirectToPage(i18n.t('help.documentationLink', { version }))}
            />
            <Dropdown.Item
                icon="comments"
                text={i18n.t('help.contact', 'Contact Us')}
                onClick={() => redirectToPage(i18n.t('help.contactLink'))}
            />
            <Dropdown.Divider />

            <Dropdown.Item icon="info circle" text={i18n.t('help.about', 'About')} onClick={onAbout} />
        </HeaderMenu>
    );
}

Help.propTypes = {
    onAbout: PropTypes.func.isRequired,
    version: PropTypes.string.isRequired
};
