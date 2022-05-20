import Consts from './consts';

const widgetTranslation = Stage.Utils.getT(Consts.WIDGET_TRANSLATION_PATH);

// TODO: Add to utils a dedicated method for the purpose of getting the translation method for the specific widget

const getWidgetTranslation = (translationPath = '') => Stage.Utils.composeT(widgetTranslation, translationPath);

export default {
    getWidgetTranslation
};
