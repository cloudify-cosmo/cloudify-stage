import type { ButtonConfiguration } from 'app/widgets/common/configuration/buttonConfiguration';
import EnvironmentButton from './EnvironmentButton';

const translate = Stage.Utils.getT('widgets.environmentButton');

Stage.defineWidget<never, never, ButtonConfiguration>({
    id: 'environmentButton',
    initialWidth: 2,
    initialHeight: 3,
    showHeader: false,
    showBorder: false,
    hasReadme: false,
    initialConfiguration: [
        ...Stage.Common.Configuration.Button.getInitialConfiguration({
            icon: 'add',
            label: translate('buttonLabel')
        })
    ],
    permission: Stage.GenericConfig.WIDGET_PERMISSION('environmentButton'),
    categories: [Stage.GenericConfig.CATEGORY.DEPLOYMENTS, Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],

    render(widget, _data, _error, toolbox) {
        return <EnvironmentButton toolbox={toolbox} configuration={widget.configuration} />;
    }
});
