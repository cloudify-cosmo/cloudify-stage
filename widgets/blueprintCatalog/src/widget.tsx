import RepositoryList from './RepositoryList';
import UploadingMessage from './UploadingMessage';
import Actions from './actions';
import Consts from './consts';
import Utils from './utils';

import type {
    Blueprint,
    BlueprintCatalogPayload,
    BlueprintCatalogWidgetConfiguration,
    WidgetParameters
} from './types';
import './widget.css';

const t = Utils.getWidgetTranslation('');

const defaultFieldsToShowItems = [
    t('configuration.fieldsToShow.items.name'),
    t('configuration.fieldsToShow.items.description')
];

const fieldsToShowItems = [
    ...defaultFieldsToShowItems,
    t('configuration.fieldsToShow.items.created'),
    t('configuration.fieldsToShow.items.updated')
];

Stage.defineWidget<WidgetParameters, BlueprintCatalogPayload | Error, BlueprintCatalogWidgetConfiguration>({
    hasTemplate: false,
    id: Consts.WIDGET_ID,
    initialWidth: 8,
    initialHeight: 20,
    hasReadme: true,
    showHeader: false,
    showBorder: false,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('blueprintCatalog'),
    categories: [Stage.GenericConfig.CATEGORY.BLUEPRINTS],

    initialConfiguration: [
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        {
            id: 'jsonPath',
            name: t('configuration.jsonPath.label'),
            placeholder: t('configuration.jsonPath.placeholder'),
            description: t('configuration.jsonPath.description'),
            default: Stage.i18n.t('widgets.common.urls.blueprintsCatalog'),
            type: Stage.Basic.GenericField.STRING_TYPE
        },
        {
            id: 'username',
            name: t('configuration.username.label'),
            placeholder: t('configuration.username.placeholder'),
            description: t('configuration.username.description'),
            default: 'cloudify-examples',
            type: Stage.Basic.GenericField.STRING_TYPE
        },
        {
            id: 'filter',
            name: t('configuration.filter.label'),
            placeholder: t('configuration.filter.placeholder'),
            description: t('configuration.filter.description'),
            default: 'blueprint in:name NOT local',
            type: Stage.Basic.GenericField.STRING_TYPE
        },
        {
            id: 'displayStyle',
            name: t('configuration.displayStyle.label'),
            items: [
                { name: t('configuration.displayStyle.option.catalog'), value: 'catalog' },
                { name: t('configuration.displayStyle.option.table'), value: 'table' }
            ],
            default: 'catalog',
            type: Stage.Basic.GenericField.LIST_TYPE
        },
        {
            id: 'fieldsToShow',
            name: t('configuration.fieldsToShow.label'),
            placeholder: t('configuration.fieldsToShow.placeholder'),
            items: fieldsToShowItems,
            default: defaultFieldsToShowItems,
            type: Stage.Basic.GenericField.MULTI_SELECT_LIST_TYPE
        },
        {
            id: 'sortByName',
            name: t('configuration.sortByName.label'),
            description: t('configuration.sortByName.description'),
            default: false,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        }
    ],

    mapGridParams(gridParams) {
        return {
            page: gridParams.currentPage,
            per_page: gridParams.pageSize
        };
    },

    fetchData(widget, toolbox, params) {
        const blueprintActions = new Stage.Common.Blueprints.Actions(toolbox);

        const actions = new Actions(
            toolbox,
            widget.configuration.username,
            widget.configuration.filter,
            widget.configuration.jsonPath
        );
        return Promise.all([actions.doGetRepos(params), blueprintActions.doGetUploadedBlueprints()])
            .then(([data, uploadedBlueprintsResp]) => {
                const uploadedBlueprints = uploadedBlueprintsResp.items.map(({ id }: Partial<Blueprint>) => id);
                let repos: Blueprint[] = data.items;
                const { source } = data;
                const total = data.total_count;
                if (source === Consts.GITHUB_DATA_SOURCE) {
                    // @ts-ignore TODO(RD-5993) Types should be improved once new Blueprint Marketplace API is ready
                    const isAuthenticated = data.isAuth;

                    const fetches = _.map(repos, repo =>
                        actions
                            .doFindImage(repo.name)
                            .then(imageUrl => Promise.resolve(Object.assign(repo, { image_url: imageUrl })))
                    );

                    return Promise.all(fetches).then(items =>
                        Promise.resolve({ items, total, source, isAuthenticated, uploadedBlueprints })
                    );
                }

                if (_.get(widget.configuration, 'sortByName', false)) {
                    repos = _.sortBy(repos, 'name');
                }

                return Promise.resolve({ items: repos, total, source, uploadedBlueprints });
            })
            .catch(e => (e instanceof Error ? e : Error(e)));
    },

    render(widget, data, _error, toolbox) {
        const { Common, Basic } = Stage;
        const isUploadingBlueprintFromAnotherTab = Utils.blueprintCatalogContext.isUploadingBlueprint(toolbox);

        if (isUploadingBlueprintFromAnotherTab) {
            const uploadingBlueprintName = Utils.blueprintCatalogContext.getUploadingBlueprint(toolbox);
            return <UploadingMessage blueprintName={uploadingBlueprintName} />;
        }

        if (data instanceof Error) {
            return <Common.Components.NoDataMessage error={data} repositoryName="blueprints" />;
        }

        if (_.isEmpty(data)) {
            return <Basic.Loading />;
        }

        const selectedBlueprintId = toolbox.getContext().getValue(Consts.CONTEXT_KEY.SELECTED_BLUEPRINT_ID);
        const formattedData = {
            ...data,
            items: data?.items.map(item => {
                return {
                    ...item,
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    url: item.url,
                    created_at: Stage.Utils.Time.formatTimestamp(item.created_at),
                    updated_at: Stage.Utils.Time.formatTimestamp(item.updated_at),
                    image_url: item.image_url,
                    readme_url:
                        data.source === Consts.GITHUB_DATA_SOURCE
                            ? `/github/content/${widget.configuration.username}/${item.name}/master/README.md`
                            : `/external/content?url=${encodeURIComponent(item.readme_url)}`,
                    zip_url:
                        data.source === Consts.GITHUB_DATA_SOURCE
                            ? `https://github.com/${widget.configuration.username}/${item.name}/archive/master.zip`
                            : item.zip_url,
                    isSelected: selectedBlueprintId === item.id
                };
            })
        };

        const actions = new Actions(toolbox, widget.configuration.username, widget.configuration.password, undefined);
        return (
            <RepositoryList
                widget={widget}
                data={formattedData as BlueprintCatalogPayload}
                toolbox={toolbox}
                actions={actions}
            />
        );
    }
});
