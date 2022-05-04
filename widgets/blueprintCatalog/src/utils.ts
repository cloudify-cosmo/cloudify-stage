import { WidgetlessToolbox } from '../../../app/utils/StageAPI';
import Consts from './consts';

const widgetTranslation = Stage.Utils.getT(`widgets.${Consts.WIDGET_ID}`);

const getWidgetTranslation = (translationPath = '') => Stage.Utils.composeT(widgetTranslation, translationPath);

const setUploadingBlueprintInContext = (toolbox: WidgetlessToolbox, blueprintName: string) => {
    toolbox.getContext().setValue(Consts.CONTEXT_KEY.UPLOADING_BLUEPRINT, blueprintName);
};

const getUploadingBlueprintFromContext = (toolbox: WidgetlessToolbox) => {
    return toolbox.getContext().getValue(Consts.CONTEXT_KEY.UPLOADING_BLUEPRINT);
};

export default {
    getWidgetTranslation,
    setUploadingBlueprintInContext,
    getUploadingBlueprintFromContext
};
