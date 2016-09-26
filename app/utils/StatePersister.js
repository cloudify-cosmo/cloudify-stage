/**
 * Created by kinneretzin on 01/09/2016.
 */

export default class StatePersister{
    static save(state){
        try {
            var sState = JSON.stringify({
                pages: state.pages,
                managers: state.managers
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

            return JSON.parse(pState);
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }
}
