import type { WidgetlessToolbox } from '../../../app/utils/StageAPI';
import Consts from './consts';

const widgetTranslation = Stage.Utils.getT(`widgets.${Consts.WIDGET_ID}`);

const getWidgetTranslation = (translationPath = '') => Stage.Utils.composeT(widgetTranslation, translationPath);

const setUploadingBlueprintAcrossCatalogTabs = (toolbox: WidgetlessToolbox, blueprintName: string) => {
    toolbox.getContext().setValue(Consts.CONTEXT_KEY.UPLOADING_BLUEPRINT, blueprintName);
};

const getUploadingBlueprintFromCatalogTabs = (toolbox: WidgetlessToolbox) => {
    return toolbox.getContext().getValue(Consts.CONTEXT_KEY.UPLOADING_BLUEPRINT);
};

const isUploadingBlueprintOnAnotherCatalogTab = (toolbox: WidgetlessToolbox): boolean => {
    return !!getUploadingBlueprintFromCatalogTabs(toolbox);
};

const resetUploadingBlueprintAcrossCatalogTabs = (toolbox: WidgetlessToolbox) => {
    setUploadingBlueprintAcrossCatalogTabs(toolbox, '');
};

export default {
    getWidgetTranslation,
    blueprintCatalogContext: {
        setUploadingBlueprint: setUploadingBlueprintAcrossCatalogTabs,
        getUploadingBlueprint: getUploadingBlueprintFromCatalogTabs,
        isUploadingBlueprint: isUploadingBlueprintOnAnotherCatalogTab,
        resetUploadingBlueprint: resetUploadingBlueprintAcrossCatalogTabs
    }
};
