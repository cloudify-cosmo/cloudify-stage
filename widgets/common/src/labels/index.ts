import DuplicationErrorPopup from './DuplicationErrorPopup';
import Input from './LabelsInput';
import Modal from './LabelsModal';
import ManageModal from './ManageLabelsModal';
import ValidationErrorPopup from './ValidationErrorPopup';
import { sortLabels } from './common';
import type { Label as LabelType } from './types';

const Labels = {
    DuplicationErrorPopup,
    Input,
    Modal,
    ManageModal,
    ValidationErrorPopup,
    sortLabels
};

// NOTE: alias name to avoid name shadowing inside the namespace
const LabelsAlias = Labels;
declare global {
    namespace Stage.Common {
        namespace Labels {
            type Label = LabelType;
        }
        const Labels: typeof LabelsAlias;
    }
}

Stage.defineCommon({
    name: 'Labels',
    common: Labels
});
