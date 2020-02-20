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
                return this.waitForElementPresent('.filterWidget .blueprintFilterField div[role="listbox"]').isPresent(
                    `.filterWidget .blueprintFilterField div[option-value="${blueprint}"]`,
                    callback
                );
            },
            isDeploymentPresent(deployment, callback) {
                return this.waitForElementPresent('.filterWidget .deploymentFilterField div[role="listbox"]').isPresent(
                    `.filterWidget .deploymentFilterField div[option-value="${deployment}"]`,
                    callback
                );
            },
            waitForBlueprintPresent(blueprint) {
                return this.waitForElementPresent(
                    `.filterWidget .blueprintFilterField div[option-value="${blueprint}"]`
                );
            },
            waitForBlueprintNotPresent(blueprint) {
                return this.waitForElementNotPresent(
                    `.filterWidget .blueprintFilterField div[option-value="${blueprint}"]`
                );
            },
            waitForDeploymentPresent(deployment) {
                return this.waitForElementPresent(
                    `.filterWidget .deploymentFilterField div[option-value="${deployment}"]`
                );
            },
            waitForDeploymentNotPresent(deployment) {
                return this.waitForElementNotPresent(
                    `.filterWidget .deploymentFilterField div[option-value="${deployment}"]`
                );
            }
        }
    ],
    props: {
        widgetId: 'filter'
    }
};
