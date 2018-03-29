/**
 * Created by edenp on 08/11/2017.
 */

import hopscotch from 'hopscotch';

var tours = [
    {
        id: "hello-cloudify",
        steps: [
            {
                title: "The future is HERE!",
                content: `Cloudify is Future Technology. We found a wormhole in the galaxy and hijacked a brain chip from the year 2074.
                <br/><br/>
                It took some time to crack the encryption but when we did we uncovered the code to automate thoughts. Until the hardware for thought-automation is developed, we found that we can implement this technology in the Cloudify Console to orchestrate cloud environments!`,
                target: ".logo",
                placement: "bottom"
            },
            {
                title: "Take the tour!",
                content: "This tour shows you how to use Cloudify Console, but don’t get any ideas about hacking into someone’s brain!",
                target: ".logo",
                placement: "bottom"
            },
            {
                title: "Pages of the console",
                content: `Cloudify Console is divided into pages, just as the brain is divided into lobes. Each page is responsible for a set of Console capabilities, such as blueprints or deployments.
                You can create customized pages that match your operational needs. You can’t do that with a brain… YET!`,
                target: ".pages .pageMenuItem",
                placement: "right"
            },
            {
                title: "Widgets on the pages",
                content: `On each page is a set of widgets. Each widget shows can either configure or report on Cloudify Manager operations, much like the frontal lobe of your brain can show emotions or communicate with words.
                You can add and remove widgets on the pages to create the best experience for your Cloudify users to do what they need to do.`,
                target: ".widgetItem",
                placement: "bottom"
            },
            {
                title: "Cloudify Manager vital signs",
                content: `We replaced the brain function indicators with indicators that show the active services on the Cloudify Manager.
                The brain chip we found tried to influx a rabbit to the celery of Mr. Riemann but it postgressed into a rest-service so he got logstashed with the stage composer. ;-)`,
                target: ".right.menu .item",
                placement: "bottom"
            },
            {
                title: "Multi-tenant personalities",
                content: `Based the multiple-personality mode, you can switch to a different tenant. The pages and widgets are saved for each tenant so, when you switch tenants, the Console can have a totally different personality.`,
                target: ".right.menu .tenantsMenu",
                placement: "bottom",
                xOffset: -200,
                arrowOffset: 250
            },
            {
                title: "Where to go for HELP",
                content: `When you have trouble using the Console, you can find links to documentation and videos.
                We wish we could use this function today with brains. Imagine… if someone is giving you trouble, you just give him a light tap on the head and you get usage instructions. Guess we’ll have to wait.`,
                target: ".right.menu .helpMenu",
                placement: "bottom",
                xOffset: -200,
                arrowOffset: 210
            },
            {
                title: "User Configuration and Logout",
                content: `To do all of the customization that we mentioned, you need to go to the user menu. This menu lets you edit the pages and widgets; manage page templates per tenant; and reset the templates. This is also where you logout.
                Oh, and if you want the manager to take a break from working, use maintenance mode. It’s like telling the manager to take a time out!`,
                target: ".right.menu .usersMenu",
                placement: "bottom",
                xOffset: -230,
                arrowOffset: 250
            }
        ]
    }
];

function getTourById(tourId) {
    return _.find(tours, {'id': tourId});
}

export function welcomeTour() {
    return function (dispatch) {
        hopscotch.startTour(getTourById('hello-cloudify'));
    }
}

export function continueTour() {
    return function (dispatch) {
        var tour = hopscotch.getState();
        if(tour){
            hopscotch.startTour(getTourById(tour.split(':')[0]));
        }
    }
}