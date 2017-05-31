/**
 * Created by pposel on 26/05/2017.
 */

module.exports = {
    elements: {
        blueprintFilter: '.filterWidget #blueprintFilterField',
        blueprintSearch: '.filterWidget #blueprintFilterField input.search',
        testBlueprint: '.filterWidget #blueprintFilterField select option[value="blueprint"]'
    },

    commands: [{
        isBlueprintPresent: function(blueprint, callback) {
            return this.isPresent('.filterWidget #blueprintFilterField select option[value="' + blueprint + '"]', callback);
        },
        waitForBlueprintPresent: function(blueprint) {
            return this.waitForElementPresent('.filterWidget #blueprintFilterField select option[value="' + blueprint + '"]', 10000);
        },
        waitForBlueprintNotPresent: function(blueprint) {
            return this.waitForElementNotPresent('.filterWidget #blueprintFilterField select option[value="' + blueprint + '"]', 10000);
        }
    }]

};
