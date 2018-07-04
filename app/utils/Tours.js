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

    static parseTour(tour) {
        let hopscotchTour =  _.omit(_.cloneDeep(tour), ['name', 'startAt']);

        hopscotchTour.onClose = ['onTourClose'];
        hopscotchTour.onStart = ['onTourStart'];
        hopscotchTour.steps =  _.map(hopscotchTour.steps, (step, index) => {
            if(!_.isUndefined(step.onNextRedirectTo)){
                const nextStep = hopscotchTour.steps[index + 1];

                if (!_.isUndefined(nextStep)) {
                    const [url, pageName, noTargetErrorTitle, noTargetErrorMessage]
                        = _.isArray(step.onNextRedirectTo)
                        ? step.onNextRedirectTo
                        : [step.onNextRedirectTo, step.onNextRedirectTo, undefined, undefined];

                    step.showCTAButton = true;
                    step.ctaLabel = 'Next (change page)';
                    step.onCTA = ['redirectTo', url, pageName, nextStep.target, noTargetErrorTitle, noTargetErrorMessage];
                    step.showNextButton = false;
                }
                return _.omit(step, 'onNextRedirectTo');
            }
            return step;
        });

        return hopscotchTour;
    }
}