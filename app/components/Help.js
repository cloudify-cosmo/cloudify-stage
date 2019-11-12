/**
 * Created by jakubniezgoda on 26/02/2018.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Dropdown, Icon } from './basic';
import StageUtils from '../utils/stageUtils';

export default class Help extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        onAbout: PropTypes.func.isRequired
    };

    render() {
        const { redirectToPage } = StageUtils.Url;

        return (
            <Dropdown item pointing="top right" trigger={<Icon name="help circle" />} className="helpMenu">
                <Dropdown.Menu>
                    <Dropdown.Item
                        icon="book"
                        text="Documentation"
                        onClick={redirectToPage.bind(this, 'https://docs.cloudify.co')}
                    />
                    <Dropdown.Item
                        icon="video camera"
                        text="Tutorials"
                        onClick={redirectToPage.bind(this, 'https://cloudify.co/academy')}
                    />
                    <Dropdown.Item
                        icon="student"
                        text="Knowledge Base"
                        onClick={redirectToPage.bind(this, 'https://cloudify.co/knowledge-base')}
                    />
                    <Dropdown.Item
                        icon="comments"
                        text="Contact Us"
                        onClick={redirectToPage.bind(this, 'https://cloudify.co/community')}
                    />
                    <Dropdown.Divider />
                    <Dropdown.Item icon="info circle" text="About" onClick={this.props.onAbout} />
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}
