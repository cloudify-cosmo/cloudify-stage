import type { Secret } from 'app/widgets/common/secrets/SecretActions';
import { isEmpty } from 'lodash';
import SecretsTable from './SecretsTable';
import type { SecretsWidget } from './widget.types';

interface FormattedSecrets {
    items: Secret[];
    total: number;
}

Stage.defineWidget<never, SecretsWidget.Data, SecretsWidget.Configuration>({
    id: 'secrets',
    initialWidth: 5,
    initialHeight: 16,
    fetchUrl: '[manager]/secrets[params]',
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('secrets'),
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(30),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        Stage.GenericConfig.SORT_COLUMN_CONFIG('key'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(true)
    ],

    render(widget, data, _error, toolbox) {
        const { Loading } = Stage.Basic;

        if (!data || isEmpty(data)) {
            return <Loading />;
        }
        const formattedData: FormattedSecrets = {
            items: data.items.map(item => {
                return {
                    ...item,
                    created_at: Stage.Utils.Time.formatTimestamp(item.created_at),
                    updated_at: Stage.Utils.Time.formatTimestamp(item.updated_at)
                };
            }),
            total: data.metadata.pagination.total
        };

        return <SecretsTable widget={widget} data={formattedData} toolbox={toolbox} />;
    }
});
