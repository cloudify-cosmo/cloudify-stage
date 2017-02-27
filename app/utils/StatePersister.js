/**
 * Created by kinneretzin on 01/09/2016.
 */

export default class StatePersister{
    static save(state,mode){
        try {
            var sState = JSON.stringify({
                manager: state.manager
            });
            localStorage.setItem('state-'+mode,sState);
        } catch(e){
            console.error(e);
        }
    }

    static load(mode){
        try {
            var pState = localStorage.getItem('state-'+mode);
            if (pState === null) { return undefined; }

            var state = JSON.parse(pState);
            return {
                manager: state.manager
            };
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }
}
