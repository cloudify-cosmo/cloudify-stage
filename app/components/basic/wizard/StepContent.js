/**
 * Created by jakub.niezgoda on 31/07/2018.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * StepContent component is interface for components implementing step content for {@link WizardModal}
 *
 * ## Access
 * `Stage.Basic.Wizard.Step.Content`
 */
export default class StepContent extends Component {
    constructor(props) {
        super(props);
    }

    /**
     * @property {string} id step ID
     * @property {function} onChange function calling wizard to update data
     * @property {function} onError function setting wizard in error state
     * @property {function} onLoading function setting wizard in loading state
     * @property {function} onReady function setting wizard in ready state
     * @property {Object} stepData step data object
     * @property {Object} wizardData wizard data object
     * @property {Object} errors errors object
     * @property {Object} toolbox Toolbox object
     */
    static propTypes = {
        id: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        onError: PropTypes.func.isRequired,
        onLoading: PropTypes.func.isRequired,
        onReady: PropTypes.func.isRequired,
        stepData: PropTypes.object.isRequired,
        wizardData: PropTypes.object.isRequired,
        errors: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        toolbox: PropTypes.object.isRequired
    };

    render() {
        return this.props.children || null;
    }
}
