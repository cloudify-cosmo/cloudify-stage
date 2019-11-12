/**
 * Created by jakubniezgoda on 24/05/2018.
 */

import PropTypes from 'prop-types';

import { Component } from 'react';
import { Button } from '../index';

export default class extends Component {
    static props = {
        activate: PropTypes.bool.isRequired,
        onClick: PropTypes.func.isRequired
    };

    render() {
        const content = this.props.activate ? 'Activate Maintenance Mode' : 'Dectivate Maintenance Mode';

        return (
            <Button
                color="orange"
                icon="doctor"
                content={content}
                className="widgetButton"
                labelPosition="left"
                onClick={this.props.onClick}
            />
        );
    }
}
