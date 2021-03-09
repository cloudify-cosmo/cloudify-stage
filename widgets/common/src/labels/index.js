import Input from './LabelsInput';
import Modal from './LabelsModal';
import ManageModal from './ManageLabelsModal';
import ValidationErrorPopup from './ValidationErrorPopup';

const Labels = {
    Input,
    Modal,
    ManageModal,
    ValidationErrorPopup
};

Stage.defineCommon({
    name: 'Labels',
    common: Labels
});
