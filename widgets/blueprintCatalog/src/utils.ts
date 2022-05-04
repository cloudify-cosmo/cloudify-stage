import { WidgetlessToolbox } from '../../../app/utils/StageAPI';
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

export default {
    getWidgetTranslation,
    setUploadingBlueprintAcrossCatalogTabs,
    getUploadingBlueprintFromCatalogTabs,
    isUploadingBlueprintOnAnotherCatalogTab
};
