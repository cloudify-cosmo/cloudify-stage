/**
 * Created by pposel on 26/05/2017.
 */

module.exports = {
    sections: {
        noData: {
            selector: '.blueprintInfoWidget',
            elements: {
                message: '.widgetContent .ui.info.message'
            }
        },

        info: {
            selector: '.blueprintInfoWidget',
            elements: {
                blueprintName: '.blueprintInfoName'
            }
        }
    },
    props: {
        widgetId: 'blueprintInfo'
    }
};
