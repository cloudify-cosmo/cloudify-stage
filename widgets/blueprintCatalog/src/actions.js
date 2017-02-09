/**
 * Created by pposel on 07/02/2017.
 */

export default class {

    constructor(toolbox, username, password) {
        this.toolbox = toolbox;
        this.username = username;
        if (password) {
            this.credentials = btoa(`${username}:${password}`);
        }
    }

    getUsername() {
        return this.username;
    }

    doGetRepos(params) {
        return this.toolbox.getExternal(this.credentials).doGet(`https://api.github.com/users/${this.username}/repos`, params);
    }

    doGetRepoTree(repo) {
        return this.toolbox.getExternal(this.credentials).doGet(`https://api.github.com/repos/${this.username}/${repo}/git/trees/master`);
    }

    doUpload(blueprintName, blueprintFileName, blueprintUrl) {
        var params = {};

        params['blueprint_archive_url'] = blueprintUrl;

        if (!_.isEmpty(blueprintFileName)) {
            params['application_file_name'] = blueprintFileName;
        }

        return this.toolbox.getManager().doPut(`/blueprints/${blueprintName}`, params);
    }
}