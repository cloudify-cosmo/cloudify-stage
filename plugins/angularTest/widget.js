/**
 * Created by kinneretzin on 07/09/2016.
 */


addPlugin({
    id: "angularTest",
    name: 'Some angular test',
    description: 'see if we can load shit with angular',
    initialWidth: 4,
    initialHeight: 2,
    color: "violet",
    showHeader: false,
    init: function(pluginUtils) {
        var angular = pluginUtils.angular;

        angular
            .module('angularTestApp', [])
            .controller('Controller', ['$scope', function($scope) {
                $scope.name1 = { name: 'Naomi'};
                $scope.name2 = { name: 'Vojta'};
                $scope.name3 = { name: 'abc'};
                $scope.name4 = { name: 'kuku'};
                $scope.name5 = { name: 'asdfasdfsdf'};

            }])
            .directive('try1', () => {
                return {
                    template: 'This is my name: {{name.name}}',
                    scope: {
                        name: '=name'
                    }
                };
            });
    },
    render: function(widget,data,context,pluginUtils) {
        var d = {
            name: 'name'+ Math.floor((Math.random() * 5) + 1)
        };
        return pluginUtils.buildFromTemplate(widget.plugin.template,d);
    },
    postRender: function(el,plugin,data,context,pluginUtils) {
        var e = el.find('.angularTestContainer');
        pluginUtils.angular.bootstrap(e[0], ['angularTestApp'])
    }
});