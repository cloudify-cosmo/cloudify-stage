/**
 * Created by kinneretzin on 30/11/2016.
 */


export default class {
    constructor(context) {
        this.context = context;
    }

    doDelete(plugin) {
        return this.context.getManager().doDelete(`/plugins/${plugin.id}`);

    }

    doUpload(file) {
        return this.context.getManager().doUpload(`/plugins`,null,file,'post');
    }
}