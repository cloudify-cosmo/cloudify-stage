/**
 * Created by jakub.niezgoda on 02/08/2018.
 */

import React, { Component } from 'react';

import StepActions from './StepActions';
import StepContent from './StepContent';

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function createStepContent(ContentComponent, id) {

    class StepContentComponent extends Component {

        constructor(props) {
            super(props);
        }

        static propTypes = StepContent.propTypes;

        render() {
            return <ContentComponent id={id} {...this.props} />;
        }
    }

    StepContentComponent.displayName = `StepContent(${getDisplayName(ContentComponent)})`;

    return StepContentComponent;
}

function createStepActions(ActionsComponent, id) {

    class StepActionsComponent extends Component {

        constructor(props) {
            super(props);
        }

        static propTypes = StepActions.propTypes;

        render() {
            return <ActionsComponent id={id} {...this.props} />;
        }
    }

    StepActionsComponent.displayName = `StepActions(${getDisplayName(ActionsComponent)})`;

    return StepActionsComponent;
}

export function createWizardStep(id,
                                 title,
                                 description,
                                 ContentComponent,
                                 ActionsComponent)
{
    return {
        id,
        title,
        description,
        Content: createStepContent(ContentComponent, id),
        Actions: createStepActions(ActionsComponent, id)
    }
}

export default {
    createWizardStep
}