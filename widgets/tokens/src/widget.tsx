import _ from 'lodash';
import TokensTable from './TokensTable';
import type { TokensWidget } from './widget.types';
import { translationPath } from './widget.consts';

const t = Stage.Utils.getT(translationPath);

Stage.defineWidget<never, TokensWidget.Data, TokensWidget.Configuration>({
    id: 'tokens',
    name: t('name'),
    initialWidth: 12,
    initialHeight: 16,
    isReact: true,
    hasReadme: true,
    fetchUrl: '[manager]/tokens[params]',
    permission: Stage.GenericConfig.WIDGET_PERMISSION('tokens'),

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        {
            id: 'showExpiredTokens',
            name: t('configuration.showExpiredTokens.name'),
            type: Stage.Basic.GenericField.BOOLEAN_TYPE,
            default: false,
            description: t('configuration.showExpiredTokens.description')
        }
    ],

    render(widget, data, _error, toolbox) {
        const { Loading } = Stage.Basic;

        if (_.isEmpty(data)) {
            return <Loading />;
        }

        return <TokensTable data={data} toolbox={toolbox} widgetConfiguration={widget.configuration} />;
    }
});

export {};
