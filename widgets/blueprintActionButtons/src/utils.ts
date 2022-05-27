import Consts from './consts';

const widgetTranslation = Stage.Utils.getT(Consts.WIDGET_TRANSLATION_PATH);

const getWidgetTranslation = (translationPath = '') => Stage.Utils.composeT(widgetTranslation, translationPath);

export default {
    getWidgetTranslation
};
