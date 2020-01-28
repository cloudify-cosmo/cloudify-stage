import StepActions from './StepActions';
import StepContent from './StepContent';

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function createStepContent(ContentComponent, id) {
    class StepContentComponent extends React.Component {
        constructor(props) {
            super(props);
        }

        static propTypes = _.omit(StepContent.propTypes, 'id');

        render() {
            return <ContentComponent id={id} {...this.props} />;
        }
    }

    StepContentComponent.displayName = `StepContent(${getDisplayName(ContentComponent)})`;

    return StepContentComponent;
}

function createStepActions(ActionsComponent, id) {
    class StepActionsComponent extends React.Component {
        constructor(props) {
            super(props);
        }

        static propTypes = _.omit(StepActions.propTypes, 'id');

        render() {
            return <ActionsComponent id={id} {...this.props} />;
        }
    }

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
