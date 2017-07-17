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
            return this.waitForElementPresent(".filterWidget #blueprintFilterField select")
                       .isPresent('.filterWidget #blueprintFilterField select option[value="' + blueprint + '"]', callback);
        },
        isDeploymentPresent: function(deployment, callback) {
            return this.waitForElementPresent(".filterWidget #deploymentFilterField select")
                       .isPresent('.filterWidget #deploymentFilterField select option[value="' + deployment + '"]', callback);
        },
        waitForBlueprintPresent: function(blueprint) {
            return this.waitForElementPresent('.filterWidget #blueprintFilterField select option[value="' + blueprint + '"]', 10000);
        },
        waitForBlueprintNotPresent: function(blueprint) {
            return this.waitForElementNotPresent('.filterWidget #blueprintFilterField select option[value="' + blueprint + '"]', 10000);
        },
        waitForDeploymentPresent: function(deployment) {
            return this.waitForElementPresent('.filterWidget #deploymentFilterField select option[value="' + deployment + '"]', 10000);
        },
        waitForDeploymentNotPresent: function(deployment) {
            return this.waitForElementNotPresent('.filterWidget #deploymentFilterField select option[value="' + deployment + '"]', 10000);
        }
    }],
    props: {
        widgetId: "filter"
    }
};
