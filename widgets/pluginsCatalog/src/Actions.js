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
  constructor (o) {
    this.toolbox = o.toolbox;
    this.jsonPath = o.jsonPath;
  }

  /**
   * get plugins list
   * 
   * @returns Promise(json)
   * @access public
   */
  doGetPluginsList () {
    return this.toolbox.getExternal ().doGet (this.jsonPath);
  }

  /**
   * upload plugins to api
   * 
   * @param {any} archiveUrl 
   * @param {boolean} [privateResource=false] 
   * @access public
   */
  doUpload (archiveUrl, privateResource = false) {
    let params = {
      private_resource: privateResource,
      plugin_archive_url: archiveUrl,
    };

    return this.toolbox.getManager ().doPost ('/plugins', params);
  }
}
