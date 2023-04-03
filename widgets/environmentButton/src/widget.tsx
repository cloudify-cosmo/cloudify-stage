import type { ButtonConfiguration } from 'app/widgets/common/configuration/buttonConfiguration';
import EnvironmentButton from './EnvironmentButton';
import type { EnvironmentButtonWidget } from './widget.types';

const translate = Stage.Utils.getT('widgets.environmentButton');
const SearchActions = Stage.Common.Actions.Search;
const FilterActions = Stage.Common.Filters.Actions;
const environmentFilterId = 'csys-environment-filter';

Stage.defineWidget<never, EnvironmentButtonWidget.Data, ButtonConfiguration>({
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

    async fetchData(_widget, toolbox) {
        const searchActions = new SearchActions(toolbox);
        const filterActions = new FilterActions(toolbox);

        try {
            const filterRules = await filterActions.doGet(environmentFilterId);
            return searchActions.doListBlueprints(filterRules.value || [], {
                _include: 'id',
                _size: 1
            });
        } catch (err) {
            log.error(err);
            return {};
        }
    },

    render(widget, data, _error, toolbox) {
        const disableEnvironmentButton = Stage.Utils.isEmptyWidgetData(data) || data!.items.length === 0;

        return (
            <EnvironmentButton
                toolbox={toolbox}
                configuration={widget.configuration}
                disabled={disableEnvironmentButton}
            />
        );
    }
});
