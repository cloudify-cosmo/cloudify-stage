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
     * @param {object} o
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
     * @param wagonUrl
     * @param yamlUrl
     * @param visibility
     * @access public
     */
    doUpload({ url: wagonUrl, yamlUrl, icon: iconUrl, title }, visibility) {
        const params = {
            visibility,
            wagonUrl,
            yamlUrl,
            iconUrl,
            title
        };

        return this.toolbox.getInternal().doUpload('/plugins/upload', params, null, 'post');
    }
}
