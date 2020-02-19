/**
 * Created by pposel on 26/05/2017.
 */

module.exports = {
    elements: {
        blueprintSearch: '.filterWidget #dynamicDropdown1',
        deploymentSearch: '.filterWidget #dynamicDropdown2'
    },
    commands: [
        {
            isBlueprintPresent(blueprint, callback) {
                return this.waitForElementPresent('.filterWidget #dynamicDropdown1 div[role="listbox"]').isPresent(
                    `.filterWidget #dynamicDropdown1 div[option-value="${blueprint}"]`,
                    callback
                );
            },
            isDeploymentPresent(deployment, callback) {
                return this.waitForElementPresent('.filterWidget #dynamicDropdown2 div[role="listbox"]').isPresent(
                    `.filterWidget #dynamicDropdown2 div[option-value="${deployment}"]`,
                    callback
                );
            },
            waitForBlueprintPresent(blueprint) {
                return this.waitForElementPresent(`.filterWidget #dynamicDropdown1 div[option-value="${blueprint}"]`);
            },
            waitForBlueprintNotPresent(blueprint) {
                return this.waitForElementNotPresent(
                    `.filterWidget #dynamicDropdown1 div[option-value="${blueprint}"]`
                );
            },
            waitForDeploymentPresent(deployment) {
                return this.waitForElementPresent(`.filterWidget #dynamicDropdown2 div[option-value="${deployment}"]`);
            },
            waitForDeploymentNotPresent(deployment) {
                return this.waitForElementNotPresent(
                    `.filterWidget #dynamicDropdown2 div[option-value="${deployment}"]`
                );
            }
        }
    ],
    props: {
        widgetId: 'filter'
    }
};
