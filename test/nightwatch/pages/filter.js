/**
 * Created by pposel on 26/05/2017.
 */

module.exports = {
    elements: {
        blueprintSearch: '.filterWidget .blueprintFilterField',
        deploymentSearch: '.filterWidget .deploymentFilterField'
    },
    commands: [
        {
            isBlueprintPresent(blueprint, callback) {
                this.clickElement('.filterWidget .blueprintFilterField')
                    .waitForElementNotPresent('.filterWidget .blueprintFilterField .loader')
                    .setValue('.filterWidget .blueprintFilterField input', blueprint)
                    .waitForElementNotPresent('.filterWidget .blueprintFilterField div[option-value="undefined"]')
                    .isPresent(`.filterWidget .blueprintFilterField div[option-value="${blueprint}"]`, callback);
            },
            isDeploymentPresent(deployment, callback) {
                this.clickElement('.filterWidget .deploymentFilterField')
                    .waitForElementNotPresent('.filterWidget .deploymentFilterField .loader')
                    .setValue('.filterWidget .deploymentFilterField input', deployment)
                    .waitForElementNotPresent('.filterWidget .deploymentFilterField div[option-value="undefined"]')
                    .isPresent(`.filterWidget .deploymentFilterField div[option-value="${deployment}"]`, callback);
            }
        }
    ],
    props: {
        widgetId: 'filter'
    }
};
