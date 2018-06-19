/**
 * Created by edenp on 15/04/2018.
 */


import Internal from './Internal';
import Consts from './consts';

export default class Tours {

    static load(manager) {
        console.log('Load tours');

        let tenant = _.get(manager, 'tenants.selected', Consts.DEFAULT_ALL);

        let internal = new Internal(manager);
        return internal.doGet('/tours', {tenant}).then(tours => {
            return tours;
        });
    }

    static parseTour(tour, dispatch) {
        let hopscotchTour =  _.omit(_.cloneDeep(tour), 'name');

        hopscotchTour = _.omit(hopscotchTour, 'startAt');
        hopscotchTour.steps =  _.map(hopscotchTour.steps, (step, index) => {
            if(!_.isUndefined(step.onNextRedirectTo)){
                let nextStep = hopscotchTour.steps[index + 1];
                if (!_.isUndefined(nextStep)) {
                    step.showCTAButton = true;
                    step.ctaLabel = 'Next (change page)';
                    step.onCTA = ['redirectTo', step.onNextRedirectTo, nextStep.target];
                    step.showNextButton = false;
                }
                return _.omit(step, 'onNextRedirectTo');
            }
            return step;
        });
        return hopscotchTour;
    }
}