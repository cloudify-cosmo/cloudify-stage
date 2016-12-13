/**
 * Created by kinneretzin on 01/09/2016.
 */

export default class StatePersister{
    static save(state){
        try {
            var sState = JSON.stringify({
                pages: state.pages,
                manager: state.manager
            });
            localStorage.setItem('state',sState);
        } catch(e){
            console.error(e);
        }
    }

    static load(){
        try {
            var pState = localStorage.getItem('state');
            if (pState === null) { return undefined; }

            var state = JSON.parse(pState);
            return {
                pages: state.pages,
                manager: state.manager
            };
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }
}
