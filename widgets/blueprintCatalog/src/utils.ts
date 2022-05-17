import type { WidgetlessToolbox } from '../../../app/utils/StageAPI';
import Consts from './consts';

const widgetTranslation = Stage.Utils.getT(`widgets.${Consts.WIDGET_ID}`);

const getWidgetTranslation = (translationPath = '') => Stage.Utils.composeT(widgetTranslation, translationPath);

// NOTE: Functions provided inside the class below are being used to share values across the marketplace tabs
class BlueprintCatalogContext {
    static setUploadingBlueprint(toolbox: WidgetlessToolbox, blueprintName: string) {
        toolbox.getContext().setValue(Consts.CONTEXT_KEY.UPLOADING_BLUEPRINT, blueprintName);
    }

    static getUploadingBlueprint(toolbox: WidgetlessToolbox) {
        return toolbox.getContext().getValue(Consts.CONTEXT_KEY.UPLOADING_BLUEPRINT);
    }

    static isUploadingBlueprint(toolbox: WidgetlessToolbox) {
        return !!BlueprintCatalogContext.getUploadingBlueprint(toolbox);
    }

    static resetUploadingBlueprint(toolbox: WidgetlessToolbox) {
        BlueprintCatalogContext.setUploadingBlueprint(toolbox, '');
    }

    static setUploadingBlueprintError(toolbox: WidgetlessToolbox, blueprintName?: string) {
        toolbox.getContext().setValue(Consts.CONTEXT_KEY.UPLOADING_BLUEPRINT_ERROR, blueprintName);
    }

    static getUploadingBlueprintError(toolbox: WidgetlessToolbox) {
        return toolbox.getContext().getValue(Consts.CONTEXT_KEY.UPLOADING_BLUEPRINT_ERROR);
    }

    static resetUploadingBlueprintError(toolbox: WidgetlessToolbox) {
        BlueprintCatalogContext.setUploadingBlueprintError(toolbox);
    }
}

export default {
    getWidgetTranslation,
    blueprintCatalogContext: BlueprintCatalogContext
};
