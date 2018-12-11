/**
 * Created by jakub.niezgoda on 03/08/2018.
 */

import StepActions from './StepActions';
import StepContent from './StepContent';
import WizardModal from './WizardModal';
import wizardUtils from './wizardUtils';

export default {
    Step: {
        Actions: StepActions,
        Content: StepContent
    },
    Modal: WizardModal,
    Utils: wizardUtils
}
