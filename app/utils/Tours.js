/**
 * Created by edenp on 15/04/2018.
 */

import Internal from './Internal';
import Consts from './consts';

export default class Tours {
    static load(manager) {
        console.log('Load tours');

        const tenant = _.get(manager, 'tenants.selected', Consts.DEFAULT_ALL);

        const internal = new Internal(manager);
        return internal.doGet('/tours', { tenant }).then(tours => {
            return tours;
        });
    }

    static parseTour(tour) {
        const hopscotchTour = _.omit(_.cloneDeep(tour), ['name', 'startAt']);

        hopscotchTour.onClose = ['onTourClose'];
        hopscotchTour.onStart = ['onTourStart'];
        hopscotchTour.onError = ['showError'];
        hopscotchTour.skipIfNoElement = false;
        hopscotchTour.steps = _.map(hopscotchTour.steps, (step, index) => {
            const nextStep = hopscotchTour.steps[index + 1];
            if (!_.isUndefined(nextStep)) {
                step.showCTAButton = true;
                step.showNextButton = false;
                step.ctaLabel = 'Next';
                step.onCTA = ['redirectTo', nextStep.target];
                if (!_.isUndefined(step.onNextRedirectTo)) {
                    const [url, pageName, noTargetErrorTitle, noTargetErrorMessage] = _.isArray(step.onNextRedirectTo)
                        ? step.onNextRedirectTo
                        : [step.onNextRedirectTo, step.onNextRedirectTo, undefined, undefined];
                    step.ctaLabel = 'Next (change page)';
                    step.onCTA = [
                        'redirectTo',
                        nextStep.target,
                        url,
                        pageName,
                        noTargetErrorTitle,
                        noTargetErrorMessage
                    ];
                    step = _.omit(step, 'onNextRedirectTo');
                }
            }

            return step;
        });

        return hopscotchTour;
    }
}
