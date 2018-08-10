/**
 * Created by jakub.niezgoda on 02/08/2018.
 */

import React, { Component } from 'react';

import StepContent from './StepContent';
import StepActions from './StepActions';

export function createWizardStep(id,
                                 title = '',
                                 description = '',
                                 ContentComponent = StepContent,
                                 ActionsComponent = StepActions)
{
    return {
        id,
        title,
        description,
        Content: class extends Component {
            constructor(props) {
                super(props);

                this.state = {
                };
            }

            componentDidMount() {
            }

            componentWillUnmount() {
            }

            render() {
                return <ContentComponent id={id} {...this.props} />;
            }
        },
        Actions: class extends Component {
            constructor(props) {
                super(props);

                this.state = {
                };
            }

            componentDidMount() {
            }

            componentWillUnmount() {
            }

            render() {
                return <ActionsComponent id={id} {...this.props} />;
            }
        }
    }
}

export default {
    createWizardStep
}