/**
 * Created by jakub.niezgoda on 31/07/2018.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class StepContent extends Component {
    constructor(props, context) {
        super(props);

        this.state = {
        }
    }

    static propTypes = {
        id: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        onError: PropTypes.func.isRequired,
        onLoading: PropTypes.func.isRequired,
        onReady: PropTypes.func.isRequired,
        stepData: PropTypes.object.isRequired,
        wizardData: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        toolbox: PropTypes.object.isRequired
    };

    static defaultProps = {

    };

    render() {
        return (
            <React.Fragment>
                {this.props.children}
            </React.Fragment>
        );
    }
}
