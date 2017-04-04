/**
 * Created by pposel on 07/02/2017.
 */

const BLUEPRINT_IMAGE_FILENAME = "blueprint.png";
const GITHUB_BLUEPRINT_IMAGE_URL = (user,repo)=>`/github/content/${user}/${repo}/master/${BLUEPRINT_IMAGE_FILENAME}`;
const UPLOAD_URL = (user,repo)=>`https://api.github.com/repos/${user}/${repo}/zipball/master`;

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
        return this.toolbox.getExternal()
            .doGet(`/github/search/repositories?q=user:${this.username} ${this.filter}`, params, false)
            .then(response => Promise.resolve(response.json()));
    }

    doGetRepoTree(repo) {
        return this.toolbox.getExternal().doGet(`/github/repos/${this.username}/${repo}/git/trees/master`);
    }

    doUpload(blueprintName, blueprintFileName, repo) {
        var params = {};

        params['blueprint_archive_url'] = UPLOAD_URL(this.getUsername(), repo);

        if (!_.isEmpty(blueprintFileName)) {
            params['application_file_name'] = blueprintFileName;
        }

        return this.toolbox.getManager().doPut(`/blueprints/${blueprintName}`, params)
            .then(()=>this.doFindImage(repo))
            .then(imageUrl=> imageUrl ? this.toolbox.getExternal().doPost(`/ba/image/${blueprintName}`, {imageUrl}) : Promise.resolve());
    }

    doFindImage(repo, defaultImage) {
        return this.doGetRepoTree(repo)
            .then(tree => { return _.findIndex(tree.tree, {"path":BLUEPRINT_IMAGE_FILENAME})<0?
                Promise.resolve(defaultImage):
                Promise.resolve(GITHUB_BLUEPRINT_IMAGE_URL(this.getUsername(), repo))});
    }

}