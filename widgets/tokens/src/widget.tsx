import _ from 'lodash';
import TokensTable from './TokensTable';
import type { TokensWidget } from './widget.types';
import { widgetId } from './widget.consts';
import { translateWidget } from './widget.utils';

const isTokenExpired = (token: TokensWidget.DataItem): boolean => {
    return moment(token.expiration_date).isBefore();
};

const omitExpiredTokens = (tokens?: TokensWidget.DataItem[]) => {
    return tokens?.filter(token => !isTokenExpired(token));
};

const mapFetchedData = (data: TokensWidget.Data, showExpiredTokens: boolean): TokensWidget.Data => {
    return showExpiredTokens
        ? data
        : ({
              ...data,
              items: omitExpiredTokens(data?.items)
          } as TokensWidget.Data);
};

Stage.defineWidget<never, TokensWidget.Data, TokensWidget.Configuration>({
    id: widgetId,
    initialWidth: 12,
    initialHeight: 16,
    hasReadme: true,
    fetchUrl: '[manager]/tokens[params]',
    permission: Stage.GenericConfig.WIDGET_PERMISSION(widgetId),

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(5),
        {
            id: 'showExpiredTokens',
            name: translateWidget('configuration.showExpiredTokens.name'),
            type: Stage.Basic.GenericField.BOOLEAN_TYPE,
            default: false,
            description: translateWidget('configuration.showExpiredTokens.description')
        }
    ],

    render(widget, fetchedData, _error, toolbox) {
        const { Loading } = Stage.Basic;
        const { showExpiredTokens } = widget.configuration;
        const data = mapFetchedData(fetchedData, showExpiredTokens);

        if (_.isEmpty(data)) {
            return <Loading />;
        }

        return <TokensTable configuration={widget.configuration} data={data} toolbox={toolbox} />;
    }
});

export {};
