import StageUtils from '../../../utils/stageUtils';

interface DefaultConfiguration {
    label?: string;
    color?: string;
    icon?: string;
    basic?: boolean;
}
export function getInitialConfiguration(defaultConfiguration: DefaultConfiguration = {}) {
    const { label, color, icon, basic } = defaultConfiguration;
    const translate = StageUtils.getT(`widgets.common.configuration`);

    return [
        {
            id: 'label',
            name: translate('label.name'),
            description: translate('label.description'),
            default: label || translate('label.default'),
            type: Stage.Basic.GenericField.STRING_TYPE
        },
        {
            id: 'color',
            name: translate('color.name'),
            description: translate('color.description'),
            default: color || 'blue',
            component: Stage.Common.Components.SemanticColorDropdown,
            type: Stage.Basic.GenericField.CUSTOM_TYPE
        },
        {
            id: 'icon',
            name: translate('icon.name'),
            description: translate('icon.description'),
            default: icon || 'external',
            component: Stage.Shared.SemanticIconDropdown,
            type: Stage.Basic.GenericField.CUSTOM_TYPE
        },
        {
            id: 'basic',
            name: translate('basic.name'),
            description: translate('basic.description'),
            default: !!basic,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        }
    ];
}

export default {
    getInitialConfiguration
};
