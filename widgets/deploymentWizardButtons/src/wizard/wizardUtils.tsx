// @ts-nocheck File not migrated fully to TS
import StepActions from './StepActions';
import StepContentPropTypes from '../steps/StepContentPropTypes';

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function createStepContent(ContentComponent, id) {
    function StepContentComponent(props) {
        return <ContentComponent id={id} {...props} />;
    }

    StepContentComponent.propTypes = _.omit(StepContentPropTypes, 'id');

    StepContentComponent.displayName = `StepContent(${getDisplayName(ContentComponent)})`;

    return StepContentComponent;
}

function createStepActions(ActionsComponent, id) {
    function StepActionsComponent(props) {
        return <ActionsComponent id={id} {...props} />;
    }

    StepActionsComponent.propTypes = _.omit(StepActions.propTypes, 'id');

    StepActionsComponent.displayName = `StepActions(${getDisplayName(ActionsComponent)})`;

    return StepActionsComponent;
}

/**
 * Function creating step object.
 *
 * @param {string} id step ID
 * @param {string} title step name to be shown in header part (top) of the wizard
 * @param {string} description step description to be shown in header part (top) of the wizard
 * @param {React.Component} ContentComponent step component to be shown in content part (middle) of the wizard. Check {@link StepContent} for details about necessary props to provide
 * @param {React.Component} ActionsComponent step component to be shown in action part (bottom) of the wizard. Check {@link StepActions} for details about necessary props to provide
 *
 * @returns {{id: string, title: string, description: string, Content: React.Component, Actions: React.Component}}
 * object describing step compatible with {@link WizardModal} steps prop
 */
export function createWizardStep(id, title, description, ContentComponent, ActionsComponent) {
    return {
        id,
        title,
        description,
        Content: createStepContent(ContentComponent, id),
        Actions: createStepActions(ActionsComponent, id)
    };
}

export default {
    createWizardStep
};
