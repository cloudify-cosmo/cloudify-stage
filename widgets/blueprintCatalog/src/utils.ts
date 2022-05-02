import Consts from './consts';

const widgetTranslation = Stage.Utils.getT(`widgets.${Consts.WIDGET_ID}`);

export default {
    getWidgetTranslation: (translationPath = '') => Stage.Utils.composeT(widgetTranslation, translationPath)
};
