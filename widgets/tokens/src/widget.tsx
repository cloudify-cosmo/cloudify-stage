import TokensTable from './TokensTable';
import type { TokensWidget } from './types';
import _ from 'lodash';

Stage.defineWidget<never, TokensWidget.Data, TokensWidget.Configuration>({
    id: 'tokens',
    name: 'Tokens',
    initialWidth: 12,
    initialHeight: 16,
    isReact: true,
    hasReadme: true,
    fetchUrl: '[manager]/tokens[params]',
    // permission: Stage.GenericConfig.WIDGET_PERMISSION('tokens'),

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        {
            id: 'showExpiredTokens',
            name: 'Show expired tokens',
            type: Stage.Basic.GenericField.BOOLEAN_TYPE,
            default: false,
            description: 'Defines if expired tokens should be listed'
        }
    ],

    render(_widget, data, _error, toolbox) {
        const { Loading } = Stage.Basic;

        if (_.isEmpty(data)) {
            return <Loading />;
        }

        return <TokensTable data={data} toolbox={toolbox} />;
    }
});

export {};
