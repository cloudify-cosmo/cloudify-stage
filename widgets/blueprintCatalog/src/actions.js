/**
 * Created by pposel on 07/02/2017.
 */

const GITHUB_API="https://api.github.com";

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
        return this.toolbox.getExternal(this.credentials)
            .doGet(`${GITHUB_API}/users/${this.username}/repos`, params, false)
            .then(response=>{

                var link = response.headers.get("link");

                var total = 0;
                if (link) {
                    const reg = /page=([0-9]+)&per_page=([0-9]+)>; rel="([a-z]+)"/g;

                    var page = 0, per_page = 0, match;
                    while (match = reg.exec(link)) {
                        if (match[3] === "last") {
                            page = parseInt(match[1]);
                            per_page = parseInt(match[2]);
                            break;
                        } else if (match[3] === "prev") {
                            page = parseInt(match[1]) + 1;
                            per_page = parseInt(match[2]);
                        }
                    }

                    total = page * per_page;
                }

                return Promise.all([response.json(), Promise.resolve(total)]);
            });
    }

    doGetRepoTree(repo) {
        return this.toolbox.getExternal(this.credentials).doGet(`${GITHUB_API}/repos/${this.username}/${repo}/git/trees/master`);
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