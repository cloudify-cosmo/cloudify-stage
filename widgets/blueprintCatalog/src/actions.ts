import type { GetExternalContentQueryParams } from 'backend/routes/External.types';
import type { GetGitHubReposTreesResponse, GetGitHubSearchRepositoriesResponse } from 'backend/routes/GitHub.types';
import Consts from './consts';
import type { WidgetParameters } from './types';

export default class Actions {
    private toolbox: Stage.Types.WidgetlessToolbox;

    private username: string;

    private filter: string;

    private jsonPath?: string;

    constructor(toolbox: Stage.Types.WidgetlessToolbox, username: string, filter: string, jsonPath?: string) {
        this.toolbox = toolbox;
        this.username = username;
        this.filter = filter;
        this.jsonPath = jsonPath;
    }

    getUsername() {
        return this.username;
    }

    doGetRepos(params: WidgetParameters) {
        if (this.jsonPath) {
            // JSON URL
            return this.toolbox
                .getInternal()
                .doGet<Response, GetExternalContentQueryParams>('/external/content', {
                    params: { url: this.jsonPath },
                    parseResponse: false
                })
                .then(response => response.json())
                .then(data =>
                    Promise.resolve({
                        items: data,
                        total_count: data.length,
                        source: Consts.JSON_DATA_SOURCE
                    })
                );
        }
        // GitHub API
        return this.toolbox
            .getInternal()
            .doGet(`/github/search/repositories?q=user:${this.username} ${this.filter}`, {
                params,
                parseResponse: false
            })
            .then(response => Promise.resolve(response.json() as GetGitHubSearchRepositoriesResponse))
            .then(data => Promise.resolve({ ...data, source: Consts.GITHUB_DATA_SOURCE }));
    }

    doGetReadme(readmeUrl: string) {
        return this.toolbox.getInternal().doGet<string>(readmeUrl);
    }

    doGetRepoTree(repositoryName: string) {
        return this.toolbox
            .getInternal()
            .doGet<GetGitHubReposTreesResponse>(`/github/repos/${this.username}/${repositoryName}/git/trees/master`);
    }

    doFindImage(repositoryName: string): Promise<string> {
        return this.doGetRepoTree(repositoryName).then(tree => {
            return _.findIndex(tree.tree, { path: Consts.BLUEPRINT_IMAGE_FILENAME }) < 0
                ? Promise.resolve('')
                : Promise.resolve(Consts.GITHUB_BLUEPRINT_IMAGE_URL(this.getUsername(), repositoryName));
        });
    }
}
