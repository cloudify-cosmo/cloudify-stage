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

        hopscotchTour.onClose = ['removeClickEventsListener'];
        hopscotchTour.onStart = ['addClickEventsListener'];
        hopscotchTour.steps =  _.map(hopscotchTour.steps, (step, index) => {
            if(!_.isUndefined(step.onNextRedirectTo)){
                const nextStep = hopscotchTour.steps[index + 1];
                const url
                    = _.isArray(step.onNextRedirectTo)
                    ? step.onNextRedirectTo[0]
                    : step.onNextRedirectTo;
                const pageName
                    = _.isArray(step.onNextRedirectTo) && step.onNextRedirectTo.length > 1
                    ? step.onNextRedirectTo[1]
                    : url;
                const noTargetErrorTitle
                    = _.isArray(step.onNextRedirectTo) && step.onNextRedirectTo.length > 2
                    ? step.onNextRedirectTo[2]
                    : undefined;
                const noTargetErrorMessage
                    = _.isArray(step.onNextRedirectTo) && step.onNextRedirectTo.length > 3
                    ? step.onNextRedirectTo[3]
                    : undefined;
                if (!_.isUndefined(nextStep)) {
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