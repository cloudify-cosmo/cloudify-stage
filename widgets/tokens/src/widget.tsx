import _ from 'lodash';
import TokensTable from './TokensTable';
import type { TokensWidget } from './widget.types';
import { translationPath } from './widget.consts';

const t = Stage.Utils.getT(translationPath);

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
    id: 'tokens',
    name: t('name'),
    initialWidth: 12,
    initialHeight: 16,
    isReact: true,
    hasReadme: true,
    fetchUrl: '[manager]/tokens[params]',

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

    render(widget, fetchedData, _error, toolbox) {
        const { Loading } = Stage.Basic;
        const { showExpiredTokens } = widget.configuration;
        const data = mapFetchedData(fetchedData, showExpiredTokens);

        if (_.isEmpty(data)) {
            return <Loading />;
        }

        return <TokensTable data={data} toolbox={toolbox} />;
    }
});

export {};
