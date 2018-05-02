/**
 * Created by edenp on 15/04/2018.
 */


import Internal from './Internal';
import Consts from './consts';

export default class Tours {

    static load(manager) {
        console.log('Load tours');

        var tenant = _.get(manager, 'tenants.selected', Consts.DEFAULT_ALL);

        var internal = new Internal(manager);
        return internal.doGet('/tours', {tenant}).then(tours => {
            return tours;
        });
    }

    static shouldRedirectBeforeStarting(tour, startAt) {
        var startAt = _.get(tour, 'startAt', null);
        return !_.isNil(startAt) && window.location.pathname !== startAt;
    }

    static parseTour(tour) {
        var hopscotchTour =  _.omit(_.cloneDeep(tour), 'name');
        hopscotchTour = _.omit(hopscotchTour, 'startAt');
        hopscotchTour.steps =  _.map(hopscotchTour.steps, (step) => {
            if(!_.isUndefined(step.onNextRedirectTo)){
                var redirectionUrl = step.onNextRedirectTo;
                step.onNext = () => {
                    window.location = redirectionUrl;
                };
                step.multipage = true;
                return _.omit(step, 'onNextRedirectTo');
            }
            return step;
        });
        return hopscotchTour;
    }
}