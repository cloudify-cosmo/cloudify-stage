/**
 * Created by jakub.niezgoda on 16/08/2018.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class NoResourceMessage extends Component {

    static propTypes = {
        resourceName: PropTypes.string.isRequired
    };

    render() {
        let {Message} = Stage.Basic;
        const {resourceName} = this.props;

        return (
            <Message success icon='checkmark'
                     header={`No ${resourceName} required`}
                     content='You can go to the next step.'
            />
        );
    }
}