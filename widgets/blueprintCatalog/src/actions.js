/**
 * Created by pposel on 07/02/2017.
 */

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
                .getExternal()
                .doGet(this.jsonPath)
                .then(data => {
                    const numberOfBlueprints = data.length;
                    const startOffset = Math.min(params.per_page * (params.page - 1), numberOfBlueprints);
                    const endOffset = Math.min(params.per_page * params.page, numberOfBlueprints);
                    return Promise.resolve({
                        items: _.slice(data, startOffset, endOffset),
                        total_count: numberOfBlueprints,
                        source: Consts.JSON_DATA_SOURCE
                    });
                });
        }
        // GitHub API
        return this.toolbox
            .getInternal()
            .doGet(`/github/search/repositories?q=user:${this.username} ${this.filter}`, params, false)
            .then(response => Promise.resolve(response.json()))
            .then(data => Promise.resolve({ ...data, source: Consts.GITHUB_DATA_SOURCE }));
    }

    doGetReadme(repo, readmeUrl) {
        return this.toolbox.getInternal().doGet(readmeUrl);
    }

    doGetRepoTree(repo) {
        return this.toolbox.getInternal().doGet(`/github/repos/${this.username}/${repo}/git/trees/master`);
    }

    doListYamlFiles(blueprintUrl) {
        return this.blueprintActions.doListYamlFiles(blueprintUrl);
    }

    doUpload(blueprintName, blueprintFileName, zipUrl, imageUrl, visibility) {
        const params = { visibility, blueprint_archive_url: zipUrl };

        if (!_.isEmpty(blueprintFileName)) {
            params.application_file_name = blueprintFileName;
        }

        return this.toolbox
            .getManager()
            .doPut(`/blueprints/${blueprintName}`, params)
            .then(() =>
                this.toolbox
                    .getInternal()
                    .doPost(`/ba/image/${blueprintName}`, { imageUrl: Stage.Utils.Url.url(imageUrl) })
            );
    }

    doFindImage(repo, defaultImage) {
        return this.doGetRepoTree(repo).then(tree => {
            return _.findIndex(tree.tree, { path: Consts.BLUEPRINT_IMAGE_FILENAME }) < 0
                ? Promise.resolve(defaultImage)
                : Promise.resolve(Consts.GITHUB_BLUEPRINT_IMAGE_URL(this.getUsername(), repo));
        });
    }
}
