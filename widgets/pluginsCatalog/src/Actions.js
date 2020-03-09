/**
 * Created by Tamer on 30/07/2017.
 */

/**
 * @class Actions
 */
export default class Actions {
    /**
     * Creates an instance of Actions.
     *
     * @param {object}
     * @memberof Actions
     * @access public
     */
    constructor(o) {
        this.toolbox = o.toolbox;
        this.jsonPath = o.jsonPath;
    }

    /**
     * get plugins list
     *
     * @returns Promise(json)
     * @access public
     */
    doGetPluginsList() {
        return this.toolbox
            .getInternal()
            .doGet('/external/content', { url: this.jsonPath }, false)
            .then(response => response.json());
    }

    /**
     * upload plugins to api
     *
     * @param {any} archiveUrl
     * @param {boolean} [privateResource=false]
     * @access public
     */
    doUpload(wagonUrl, yamlUrl, visibility) {
        const params = {
            visibility,
            wagonUrl,
            yamlUrl
        };

        return this.toolbox.getInternal().doUpload('/plugins/upload', params, null, 'post');
    }
}
