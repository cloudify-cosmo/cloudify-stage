import DuplicationErrorPopup from './DuplicationErrorPopup';
import Input from './LabelsInput';
import Modal from './LabelsModal';
import ManageModal from './ManageLabelsModal';
import ValidationErrorPopup from './ValidationErrorPopup';

const Labels = {
    DuplicationErrorPopup,
    Input,
    Modal,
    ManageModal,
    ValidationErrorPopup
};

Stage.defineCommon({
    name: 'Labels',
    common: Labels
});
