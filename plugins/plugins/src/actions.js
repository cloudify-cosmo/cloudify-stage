/**
 * Created by kinneretzin on 30/11/2016.
 */


export default class {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doDelete(plugin) {
        return this.toolbox.getManager().doDelete(`/plugins/${plugin.id}`);

    }

    doUpload(file) {
        return this.toolbox.getManager().doUpload(`/plugins`,null,file,'post');
    }
}