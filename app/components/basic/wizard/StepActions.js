/**
 * Created by jakub.niezgoda on 31/07/2018.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {Button} from './../index';

export default class StepActions extends Component {

    constructor(props) {
        super(props);
    }

    static propTypes = {
        id: PropTypes.string.isRequired,
        onStartOver: PropTypes.func.isRequired,
        onPrev: PropTypes.func.isRequired,
        onNext: PropTypes.func.isRequired,
        onError: PropTypes.func.isRequired,
        onLoading: PropTypes.func.isRequired,
        onReady: PropTypes.func.isRequired,
        fetchData: PropTypes.func.isRequired,
        wizardData: PropTypes.object.isRequired,
        toolbox: PropTypes.object.isRequired,
        disabled: PropTypes.bool,
        startOverLabel: PropTypes.string,
        startOverIcon: PropTypes.string,
        showStartOver: PropTypes.bool,
        resetDataOnStartOver: PropTypes.bool,
        prevLabel: PropTypes.string,
        prevIcon: PropTypes.string,
        showPrev: PropTypes.bool,
        nextLabel: PropTypes.string,
        nextIcon: PropTypes.string,
        showNext: PropTypes.bool,
    };

    static defaultProps = {
        disabled: false,
        startOverLabel: 'Start Over',
        startOverIcon: 'undo',
        showStartOver: false,
        resetDataOnStartOver: false,
        prevLabel: 'Back',
        prevIcon: 'arrow left',
        showPrev: true,
        nextLabel: 'Next',
        nextIcon: 'arrow right',
        showNext: true
    };

    onStartOver() {
        return this.props.onStartOver(this.props.resetDataOnStartOver);
    }

    onPrev() {
        return this.props.onPrev(this.props.id);
    }

    onNext() {
        return this.props.onNext(this.props.id);
    }

    render() {
        return (
            <React.Fragment>
                {this.props.children}
                {
                    this.props.showStartOver &&
                    <Button icon={this.props.startOverIcon} content={this.props.startOverLabel} disabled={this.props.disabled}
                            labelPosition='left' onClick={this.onStartOver.bind(this)} />
                }
                {
                    this.props.showPrev &&
                    <Button icon={this.props.prevIcon} content={this.props.prevLabel} disabled={this.props.disabled}
                            labelPosition='left' onClick={this.onPrev.bind(this)} />
                }
                {
                    this.props.showNext &&
                    <Button icon={this.props.nextIcon} content={this.props.nextLabel} disabled={this.props.disabled}
                            labelPosition='right' onClick={this.onNext.bind(this)} />
                }
            </React.Fragment>
        );
    }
}
