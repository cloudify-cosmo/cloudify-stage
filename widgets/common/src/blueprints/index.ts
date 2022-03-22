import Actions from './BlueprintActions';
import UploadForm from './UploadBlueprintForm';
import UploadModal from './UploadBlueprintModal';

const BlueprintsCommon = {
    Actions,
    UploadForm,
    UploadModal
};

declare global {
    namespace Stage.Common {
        const Blueprints: typeof BlueprintsCommon;
    }
}

Stage.defineCommon({
    name: 'Blueprints',
    common: BlueprintsCommon
});
