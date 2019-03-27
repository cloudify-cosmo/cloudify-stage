/**
 * Created by pposel on 26/05/2017.
 */

module.exports = {
    elements: {
        blueprintSearch: '.filterWidget #blueprintFilterField',
        deploymentSearch: '.filterWidget #deploymentFilterField',
    },
    commands: [{
        isBlueprintPresent: function(blueprint, callback) {
            return this.waitForElementPresent('.filterWidget #blueprintFilterField div[role="listbox"]')
                       .isPresent('.filterWidget #blueprintFilterField div[option-value="' + blueprint + '"]', callback);
        },
        isDeploymentPresent: function(deployment, callback) {
            return this.waitForElementPresent('.filterWidget #deploymentFilterField div[role="listbox"]')
                       .isPresent('.filterWidget #deploymentFilterField div[option-value="' + deployment + '"]', callback);
        },
        waitForBlueprintPresent: function(blueprint) {
            return this.waitForElementPresent('.filterWidget #blueprintFilterField div[option-value="' + blueprint + '"]');
        },
        waitForBlueprintNotPresent: function(blueprint) {
            return this.waitForElementNotPresent('.filterWidget #blueprintFilterField div[option-value="' + blueprint + '"]');
        },
        waitForDeploymentPresent: function(deployment) {
            return this.waitForElementPresent('.filterWidget #deploymentFilterField div[option-value="' + deployment + '"]');
        },
        waitForDeploymentNotPresent: function(deployment) {
            return this.waitForElementNotPresent('.filterWidget #deploymentFilterField div[option-value="' + deployment + '"]');
        }
    }],
    props: {
        widgetId: 'filter'
    }
};
