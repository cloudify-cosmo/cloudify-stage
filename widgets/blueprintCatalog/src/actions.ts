// @ts-nocheck File not migrated fully to TS

import Consts from './consts';

export default class Actions {
    constructor(toolbox, username, filter, jsonPath) {
        this.toolbox = toolbox;
        this.username = username;
        this.filter = filter;
        this.jsonPath = jsonPath;
        this.blueprintActions = new Stage.Common.BlueprintActions(this.toolbox);
    }

    getUsername() {
        return this.username;
    }

    doGetRepos(params) {
        if (!_.isEmpty(this.jsonPath)) {
            // JSON URL
            return this.toolbox
                .getInternal()
                .doGet('/external/content', { params: { url: this.jsonPath }, parseResponse: false })
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
            .then(response => Promise.resolve(response.json()))
            .then(data => Promise.resolve({ ...data, source: Consts.GITHUB_DATA_SOURCE }));
    }

    doGetReadme(repo, readmeUrl): Promise<string> {
        return this.toolbox.getInternal().doGet(readmeUrl);
    }

    doGetRepoTree(repo) {
        return this.toolbox.getInternal().doGet(`/github/repos/${this.username}/${repo}/git/trees/master`);
    }

    doListYamlFiles(blueprintUrl) {
        return this.blueprintActions.doListYamlFiles(blueprintUrl);
    }

    doFindImage(repo, defaultImage): Promise<string> {
        return this.doGetRepoTree(repo).then(tree => {
            return _.findIndex(tree.tree, { path: Consts.BLUEPRINT_IMAGE_FILENAME }) < 0
                ? Promise.resolve(defaultImage)
                : Promise.resolve(Consts.GITHUB_BLUEPRINT_IMAGE_URL(this.getUsername(), repo));
        });
    }
}
