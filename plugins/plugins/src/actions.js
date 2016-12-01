/**
 * Created by kinneretzin on 30/11/2016.
 */


export default class {
    constructor(context) {
        this.context = context;
    }

    //doDownload(blueprint) {
    //}
    doDelete(plugin) {
        return this.context.getManager().doDelete(`/plugins/${plugin.id}`);
        //    url: thi$.props.context.getManagerUrl(`/api/v2.1/plugins/${this.state.item.id}`),

    }

    doUpload(file) {
        return this.context.getManager().doUpload(`/plugins`,null,file,'post');
    }
}