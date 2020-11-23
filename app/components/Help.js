/**
 * Created by jakubniezgoda on 26/02/2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

import { Dropdown, Icon } from './basic';
import StageUtils from '../utils/stageUtils';

export default function Help({ onAbout, version }) {
    const { redirectToPage } = StageUtils.Url;

    return (
        <Dropdown item pointing="top right" trigger={<Icon name="help circle" />} className="helpMenu">
            <Dropdown.Menu>
                <Dropdown.Item
                    icon="book"
                    text="Documentation"
                    onClick={() => redirectToPage(`https://operator.windriver.com/docs/latest/`)}
                />
                <Dropdown.Item
                    icon="comments"
                    text="Contact Us"
                    onClick={() => redirectToPage('https://www.windriver.com/company/contact/')}
                />
                <Dropdown.Divider />
                <Dropdown.Item icon="info circle" text="About" onClick={onAbout} />
            </Dropdown.Menu>
        </Dropdown>
    );
}

Help.propTypes = {
    onAbout: PropTypes.func.isRequired,
    version: PropTypes.string.isRequired
};
