/**
 * Created by jakubniezgoda on 26/02/2018.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { HeaderMenu } from 'cloudify-ui-components';

import { Dropdown, Icon } from './basic';
import StageUtils from '../utils/stageUtils';

export default function Help({ onAbout, version }) {
    const { redirectToPage } = StageUtils.Url;

    return (
        <HeaderMenu trigger={<Icon name="help circle" style={{ margin: 0 }} />} className="helpMenu">
            <Dropdown.Item
                icon="book"
                text="Documentation"
                onClick={() => redirectToPage(`https://docs.cloudify.co/${version}`)}
            />
            <Dropdown.Item
                icon="comments"
                text="Contact Us"
                onClick={() => redirectToPage('https://cloudify.co/contact')}
            />
            <Dropdown.Divider />

            <Dropdown.Item icon="info circle" text="About" onClick={onAbout} />
        </HeaderMenu>
    );
}

Help.propTypes = {
    onAbout: PropTypes.func.isRequired,
    version: PropTypes.string.isRequired
};
