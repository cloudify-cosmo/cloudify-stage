/**
 * Created by jakubniezgoda on 26/02/2018.
 */

import React, { Component, PropTypes } from 'react';

export default class Help extends Component {

    static propTypes = {
    };

    render() {
        let {Dropdown, Icon} = Stage.Basic;

        const helpMenuTrigger = (
            <Icon name='question' />
        );

        const ExternalLink = (url, text) => (
            <div>
                <Icon name='external' />
                <a href={url} target='_blank' className='ui text'>{text}</a>
            </div>
        );

        return (
            <Dropdown item trigger={helpMenuTrigger} className='helpMenu' scrolling>
                <Dropdown.Menu>
                    <Dropdown.Item content={ExternalLink('https://docs.cloudify.co', 'Documentation')} />
                    <Dropdown.Item content={ExternalLink('https://cloudify.co/academy', 'Tutorials')} />
                    <Dropdown.Item content={ExternalLink('https://cloudify.co/knowledge-base/', 'Knowledge Base')} />
                    <Dropdown.Item content={ExternalLink('https://cloudify.co/community', 'Contact Us')} />
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}
