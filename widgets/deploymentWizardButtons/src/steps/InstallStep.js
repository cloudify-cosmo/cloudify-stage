/**
 * Created by jakub.niezgoda on 31/07/2018.
 */

import { Component } from 'react';

const installStepId = 'install';

class InstallStepActions extends Component {

    static propTypes = Stage.Basic.Wizard.Step.Actions.propTypes;

    render() {
        let {Wizard} = Stage.Basic;
        return <Wizard.Step.Actions {...this.props} nextLabel='Install' nextIcon='download' />
    }
}

class InstallStepContent extends Component {

    static propTypes = Stage.Basic.Wizard.Step.Content.propTypes;

    render() {
        let {Wizard} = Stage.Basic;
        return (
            <Wizard.Step.Content {...this.props}>
                To be done
            </Wizard.Step.Content>
        );
    }
}

export default Stage.Basic.Wizard.Utils.createWizardStep(installStepId, 'Install', 'Confirm installation', InstallStepContent, InstallStepActions);