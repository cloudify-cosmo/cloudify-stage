import DuplicationErrorPopup from './DuplicationErrorPopup';
import Input from './LabelsInput';
import Modal from './LabelsModal';
import ManageModal from './ManageLabelsModal';
import ValidationErrorPopup from './ValidationErrorPopup';
import { sortLabels } from './common';

const Labels = {
    DuplicationErrorPopup,
    Input,
    Modal,
    ManageModal,
    ValidationErrorPopup,
    sortLabels
};

Stage.defineCommon({
    name: 'Labels',
    common: Labels
});
