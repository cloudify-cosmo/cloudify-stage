import Modal from './LabelsModal';
import ManageModal from './ManageLabelsModal';
import ValidationErrorPopup from './ValidationErrorPopup';

const Labels = {
    Modal,
    ManageModal,
    ValidationErrorPopup
};

Stage.defineCommon({
    name: 'Labels',
    common: Labels
});
