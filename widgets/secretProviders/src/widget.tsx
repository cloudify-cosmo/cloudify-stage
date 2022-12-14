import type { SecretProvidersWidget } from './widget.types';
import SecretProvidersTable from './SecretProvidersTable';
import { translateSecretProviders } from './widget.utils';

Stage.defineWidget<never, SecretProvidersWidget.Data, SecretProvidersWidget.Configuration>({
    id: 'secretProviders',
    name: translateSecretProviders('name'),
    description: translateSecretProviders('description'),
    initialWidth: 12,
    initialHeight: 16,
    isReact: true,
    hasReadme: true,
    fetchUrl: '[manager]/secrets-providers[params]',
    permission: Stage.GenericConfig.WIDGET_PERMISSION('secretProviders'),
    supportedEditions: [Stage.Common.Consts.licenseEdition.premium, Stage.Common.Consts.licenseEdition.spire],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(5),
        Stage.GenericConfig.SORT_COLUMN_CONFIG('id'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(true)
    ],

    render(widget, data, _error, toolbox) {
        if (Stage.Utils.isEmptyWidgetData(data)) {
            const { Loading } = Stage.Basic;
            return <Loading />;
        }

        return <SecretProvidersTable configuration={widget.configuration} data={data} toolbox={toolbox} />;
    }
});
