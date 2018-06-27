/**
 * Created by pposel on 07/02/2017.
 */

import Consts from './consts';

export default class Actions {

    constructor(toolbox, username, filter) {
        this.toolbox = toolbox;
        this.username = username;
        this.filter = filter;
    }

    getUsername() {
        return this.username;
    }

    doGetRepos(params) {
        return this.toolbox.getInternal()
            .doGet(`/github/search/repositories?q=user:${this.username} ${this.filter}`, params, false)
            .then(response => Promise.resolve(response.json()))
            .then(data => Promise.resolve({...data, source: Consts.GITHUB_DATA_SOURCE}));
    }

    doGetReposFromJson(jsonPath, params) {
        return this.toolbox.getExternal()
            .doGet(jsonPath, null, false)
            .then(response => Promise.resolve(response.json()))
            .then(data => {
                const numberOfBlueprints = data.length;
                const startOffset = Math.min(params.per_page * (params.page - 1), numberOfBlueprints);
                const endOffset = Math.min(params.per_page * params.page, numberOfBlueprints);
                return Promise.resolve({items: _.slice(data, startOffset, endOffset), total: numberOfBlueprints, source: Consts.JSON_DATA_SOURCE});
            })
            .catch(err => Promise.reject({message: `Cannot fetch data from ${jsonPath}.`}));
    }

    doGetReadme(repo, readmeUrl){
        return this.toolbox.getInternal().doGet(readmeUrl);
    }

    doGetRepoTree(repo) {
        return this.toolbox.getInternal().doGet(`/github/repos/${this.username}/${repo}/git/trees/master`);
    }

    doListYamlFiles(blueprintUrl, includeFilename=false) {
        return this.toolbox.getInternal().doPut('/source/list/yaml', {url: blueprintUrl, includeFilename});
    }

    doUpload(blueprintName, blueprintFileName, zipUrl, imageUrl, visibility) {
        var params = {visibility, blueprint_archive_url: zipUrl};

        if (!_.isEmpty(blueprintFileName)) {
            params['application_file_name'] = blueprintFileName;
        }

        return this.toolbox.getManager().doPut(`/blueprints/${blueprintName}`, params)
            .then(() => this.toolbox.getInternal().doPost(`/ba/image/${blueprintName}`, {imageUrl: Stage.Utils.url(imageUrl)}));
    }

    doFindImage(repo, defaultImage) {
        return this.doGetRepoTree(repo)
            .then(tree => { return _.findIndex(tree.tree, {'path': Consts.BLUEPRINT_IMAGE_FILENAME})<0?
                Promise.resolve(defaultImage):
                Promise.resolve(Consts.GITHUB_BLUEPRINT_IMAGE_URL(this.getUsername(), repo))});
    }

}