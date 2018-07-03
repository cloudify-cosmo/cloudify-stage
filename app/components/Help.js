/**
 * Created by jakubniezgoda on 26/02/2018.
 */

import React, { Component } from 'react';

export default class Help extends Component {

    constructor(props,context) {
        super(props,context);
    }

    render() {
        let {Dropdown, Icon} = Stage.Basic;

        const helpMenuTrigger = (
            <Icon name='help circle' />
        );

        const ExternalLink = (url, text, icon='external') => (
            <a href={url} target='_blank' className='ui text'>
                <Icon name={icon} /> {text}
            </a>
        );

        return (
            <Dropdown item trigger={helpMenuTrigger} className='helpMenu' scrolling>
                <Dropdown.Menu>
                    <Dropdown.Item content={ExternalLink('https://docs.cloudify.co', 'Documentation', 'book')} />
                    <Dropdown.Item content={ExternalLink('https://cloudify.co/academy', 'Tutorials', 'video camera')} />
                    <Dropdown.Item content={ExternalLink('https://cloudify.co/knowledge-base/', 'Knowledge Base', 'student')} />
                    <Dropdown.Item content={ExternalLink('https://cloudify.co/community', 'Contact Us', 'comments')} />
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}
