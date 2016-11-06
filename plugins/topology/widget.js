(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by kinneretzin on 07/09/2016.
 */

var Topology = function (_React$Component) {
    _inherits(Topology, _React$Component);

    function Topology() {
        _classCallCheck(this, Topology);

        return _possibleConstructorReturn(this, (Topology.__proto__ || Object.getPrototypeOf(Topology)).apply(this, arguments));
    }

    _createClass(Topology, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.binder = {};
            var binder = this.binder;

            angular.module('topologyApp', ['cfy.topology']).controller('topologyController', ['$scope', 'DataProcessingService', function ($scope, DataProcessingService) {

                $scope.topologyData = {};
                $scope.topologyLoading = true;

                $scope.dataUpdated = function (newData) {
                    if (newData && newData.items && newData.items[0]) {
                        var topologyData = {
                            data: newData.items[0],
                            scale: 0.75,
                            offset: [0, 0]
                        };
                        $scope.topologyData = DataProcessingService.encodeTopologyFromRest(topologyData);
                    } else {
                        $scope.topologyData = {};
                    }
                    $scope.topologyLoading = false;
                    $scope.$apply();
                };

                $scope.setLoading = function () {
                    $scope.topologyLoading = true;
                    $scope.$apply();
                };

                binder.$scope = $scope;
            }]);

            angular.bootstrap(this.refs.topologyContainer, ['topologyApp']);
            this._setStyle();

            // Set the first time data
            this.binder.$scope.dataUpdated(this.props.data);
        }

        //_refreshData() {
        //    this.props.context.refresh();
        //}

    }, {
        key: '_setStyle',
        value: function _setStyle() {
            $(this.refs.topologyContainer).find('.topologyContainer').css({
                "position": "absolute",
                "left": "10px",
                "top": "10px",
                "bottom": "10px",
                "right": "10px"
            });

            $(this.refs.topologyContainer).find('.loading').html(this.props.utils.renderLoading());
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps, prevState) {
            if (this.props.data.blueprintId !== prevProps.data.blueprintId || this.props.data.deploymentId !== prevProps.data.deploymentId) {
                this.binder.$scope.setLoading();
                this.props.context.refresh();

                // It was set to empty
                //if (!this.props.data.blueprintId && !this.props.data.deploymentId) {
                //    this.binder.$scope.dataUpdated(this.props.data);
                //} else {
                //    this.binder.$scope.setLoading();
                //    this.props.context.refresh();
                //}
            } else {
                this.binder.$scope.dataUpdated(this.props.data);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement('div', { ref: 'topologyContainer', dangerouslySetInnerHTML: { __html: this.props.template } });
        }
    }]);

    return Topology;
}(React.Component);

Stage.addPlugin({
    id: 'topology',
    name: "topology",
    description: 'blah blah blah',
    initialWidth: 8,
    initialHeight: 4,
    color: "yellow",
    isReact: true,
    //init: function() {
    //    angular
    //        .module('topologyApp', ['cfy.topology'])
    //        .controller('topologyController', ['$scope','DataProcessingService', function($scope,DataProcessingService) {
    //
    //            var topologyData = {
    //                data: {"node_templates" : {}},
    //                layout: {"nodes": [], "connectors": []} ,
    //                hierarchy: {}
    //            };
    //
    //            $scope.topologyData = DataProcessingService.encodeTopology(topologyData);
    //            $scope.topologyLoading = false;
    //        }]);
    //},
    fetchData: function fetchData(plugin, context, pluginUtils) {
        var deploymentId = context.getValue('deploymentId');
        var blueprintId = context.getValue('blueprintId');

        if (_.isEmpty(deploymentId) && _.isEmpty(blueprintId)) {
            return Promise.resolve({});
        }

        if (deploymentId) {
            return Promise.resolve({});
        } else if (blueprintId) {
            return new Promise(function (resolve, reject) {
                pluginUtils.jQuery.get({
                    url: context.getManagerUrl() + '/api/v2.1/blueprints?id=' + blueprintId,
                    dataType: 'json'
                }).done(function (blueprint) {
                    resolve(blueprint);
                }).fail(reject);
            });
        }
    },
    render: function render(widget, data, error, context, pluginUtils) {
        if (!widget.plugin.template) {
            return 'Topology: missing template';
        }

        var topologyTemplate = _.template(widget.plugin.template)();
        var deploymentId = context.getValue('deploymentId');
        var blueprintId = context.getValue('blueprintId');

        var formattedData = Object.assign({}, data, {
            deploymentId: deploymentId,
            blueprintId: blueprintId
        });
        return React.createElement(Topology, { template: topologyTemplate,
            widget: widget, data: formattedData, context: context, utils: pluginUtils });
    }

});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwbHVnaW5zL3RvcG9sb2d5L3NyYy93aWRnZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0FDQUE7Ozs7SUFJTSxROzs7Ozs7Ozs7Ozs0Q0FDa0I7QUFDaEIsaUJBQUssTUFBTCxHQUFjLEVBQWQ7QUFDQSxnQkFBSSxTQUFTLEtBQUssTUFBbEI7O0FBRUEsb0JBQ0ssTUFETCxDQUNZLGFBRFosRUFDMkIsQ0FBQyxjQUFELENBRDNCLEVBRUssVUFGTCxDQUVnQixvQkFGaEIsRUFFc0MsQ0FBQyxRQUFELEVBQVUsdUJBQVYsRUFBbUMsVUFBUyxNQUFULEVBQWdCLHFCQUFoQixFQUF1Qzs7QUFFeEcsdUJBQU8sWUFBUCxHQUFzQixFQUF0QjtBQUNBLHVCQUFPLGVBQVAsR0FBeUIsSUFBekI7O0FBR0EsdUJBQU8sV0FBUCxHQUFxQixVQUFDLE9BQUQsRUFBYTtBQUM5Qix3QkFBSSxXQUFXLFFBQVEsS0FBbkIsSUFBNEIsUUFBUSxLQUFSLENBQWMsQ0FBZCxDQUFoQyxFQUFrRDtBQUM5Qyw0QkFBSSxlQUFlO0FBQ2Ysa0NBQU0sUUFBUSxLQUFSLENBQWMsQ0FBZCxDQURTO0FBRWYsbUNBQU8sSUFGUTtBQUdmLG9DQUFRLENBQUMsQ0FBRCxFQUFJLENBQUo7QUFITyx5QkFBbkI7QUFLQSwrQkFBTyxZQUFQLEdBQXNCLHNCQUFzQixzQkFBdEIsQ0FBNkMsWUFBN0MsQ0FBdEI7QUFDSCxxQkFQRCxNQU9PO0FBQ0gsK0JBQU8sWUFBUCxHQUFzQixFQUF0QjtBQUNIO0FBQ0QsMkJBQU8sZUFBUCxHQUF5QixLQUF6QjtBQUNBLDJCQUFPLE1BQVA7QUFDSCxpQkFiRDs7QUFlQSx1QkFBTyxVQUFQLEdBQW9CLFlBQU07QUFDdEIsMkJBQU8sZUFBUCxHQUF5QixJQUF6QjtBQUNBLDJCQUFPLE1BQVA7QUFDSCxpQkFIRDs7QUFL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QUFDSixLQTdDVztBQThDWixZQUFRLGdCQUFTLE1BQVQsRUFBZ0IsSUFBaEIsRUFBcUIsS0FBckIsRUFBMkIsT0FBM0IsRUFBbUMsV0FBbkMsRUFBZ0Q7QUFDcEQsWUFBSSxDQUFDLE9BQU8sTUFBUCxDQUFjLFFBQW5CLEVBQTZCO0FBQ3pCLG1CQUFPLDRCQUFQO0FBQ0g7O0FBRUQsWUFBSSxtQkFBbUIsRUFBRSxRQUFGLENBQVcsT0FBTyxNQUFQLENBQWMsUUFBekIsR0FBdkI7QUFDQSxZQUFJLGVBQWUsUUFBUSxRQUFSLENBQWlCLGNBQWpCLENBQW5CO0FBQ0EsWUFBSSxjQUFjLFFBQVEsUUFBUixDQUFpQixhQUFqQixDQUFsQjs7QUFFQSxZQUFJLGdCQUFnQixPQUFPLE1BQVAsQ0FBYyxFQUFkLEVBQWlCLElBQWpCLEVBQXNCO0FBQ3RDLHNDQURzQztBQUV0QztBQUZzQyxTQUF0QixDQUFwQjtBQUlBLGVBQU8sb0JBQUMsUUFBRCxJQUFVLFVBQVUsZ0JBQXBCO0FBQ1Usb0JBQVEsTUFEbEIsRUFDMEIsTUFBTSxhQURoQyxFQUMrQyxTQUFTLE9BRHhELEVBQ2lFLE9BQU8sV0FEeEUsR0FBUDtBQUdIOztBQTlEVyxDQUFoQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENyZWF0ZWQgYnkga2lubmVyZXR6aW4gb24gMDcvMDkvMjAxNi5cbiAqL1xuXG5jbGFzcyBUb3BvbG9neSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIHRoaXMuYmluZGVyID0ge307XG4gICAgICAgIHZhciBiaW5kZXIgPSB0aGlzLmJpbmRlcjtcblxuICAgICAgICBhbmd1bGFyXG4gICAgICAgICAgICAubW9kdWxlKCd0b3BvbG9neUFwcCcsIFsnY2Z5LnRvcG9sb2d5J10pXG4gICAgICAgICAgICAuY29udHJvbGxlcigndG9wb2xvZ3lDb250cm9sbGVyJywgWyckc2NvcGUnLCdEYXRhUHJvY2Vzc2luZ1NlcnZpY2UnLCBmdW5jdGlvbigkc2NvcGUsRGF0YVByb2Nlc3NpbmdTZXJ2aWNlKSB7XG5cbiAgICAgICAgICAgICAgICAkc2NvcGUudG9wb2xvZ3lEYXRhID0ge307XG4gICAgICAgICAgICAgICAgJHNjb3BlLnRvcG9sb2d5TG9hZGluZyA9IHRydWU7XG5cblxuICAgICAgICAgICAgICAgICRzY29wZS5kYXRhVXBkYXRlZCA9IChuZXdEYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXdEYXRhICYmIG5ld0RhdGEuaXRlbXMgJiYgbmV3RGF0YS5pdGVtc1swXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRvcG9sb2d5RGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBuZXdEYXRhLml0ZW1zWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiAwLjc1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldDogWzAsIDBdXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnRvcG9sb2d5RGF0YSA9IERhdGFQcm9jZXNzaW5nU2VydmljZS5lbmNvZGVUb3BvbG9neUZyb21SZXN0KHRvcG9sb2d5RGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudG9wb2xvZ3lEYXRhID0ge307XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnRvcG9sb2d5TG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICRzY29wZS5zZXRMb2FkaW5nID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUudG9wb2xvZ3lMb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBiaW5kZXIuJHNjb3BlID0gJHNjb3BlO1xuXG5cbiAgICAgICAgICAgIH1dKTtcblxuICAgICAgICBhbmd1bGFyLmJvb3RzdHJhcCh0aGlzLnJlZnMudG9wb2xvZ3lDb250YWluZXIsIFsndG9wb2xvZ3lBcHAnXSk7XG4gICAgICAgIHRoaXMuX3NldFN0eWxlKCk7XG5cbiAgICAgICAgLy8gU2V0IHRoZSBmaXJzdCB0aW1lIGRhdGFcbiAgICAgICAgdGhpcy5iaW5kZXIuJHNjb3BlLmRhdGFVcGRhdGVkKHRoaXMucHJvcHMuZGF0YSk7XG4gICAgfVxuXG4gICAgLy9fcmVmcmVzaERhdGEoKSB7XG4gICAgLy8gICAgdGhpcy5wcm9wcy5jb250ZXh0LnJlZnJlc2goKTtcbiAgICAvL31cblxuICAgIF9zZXRTdHlsZSgpIHtcbiAgICAgICAgJCh0aGlzLnJlZnMudG9wb2xvZ3lDb250YWluZXIpLmZpbmQoJy50b3BvbG9neUNvbnRhaW5lcicpLmNzcyh7XG4gICAgICAgICAgICAgICAgXCJwb3NpdGlvblwiOiBcImFic29sdXRlXCIsXG4gICAgICAgICAgICAgICAgXCJsZWZ0XCI6IFwiMTBweFwiLFxuICAgICAgICAgICAgICAgIFwidG9wXCI6IFwiMTBweFwiLFxuICAgICAgICAgICAgICAgIFwiYm90dG9tXCI6IFwiMTBweFwiLFxuICAgICAgICAgICAgICAgIFwicmlnaHRcIjogXCIxMHB4XCJcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICQodGhpcy5yZWZzLnRvcG9sb2d5Q29udGFpbmVyKS5maW5kKCcubG9hZGluZycpLmh0bWwodGhpcy5wcm9wcy51dGlscy5yZW5kZXJMb2FkaW5nKCkpO1xuXG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcywgcHJldlN0YXRlKSB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLmRhdGEuYmx1ZXByaW50SWQgIT09IHByZXZQcm9wcy5kYXRhLmJsdWVwcmludElkIHx8XG4gICAgICAgICAgICB0aGlzLnByb3BzLmRhdGEuZGVwbG95bWVudElkICE9PSBwcmV2UHJvcHMuZGF0YS5kZXBsb3ltZW50SWRcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHRoaXMuYmluZGVyLiRzY29wZS5zZXRMb2FkaW5nKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LnJlZnJlc2goKTtcblxuICAgICAgICAgICAgLy8gSXQgd2FzIHNldCB0byBlbXB0eVxuICAgICAgICAgICAgLy9pZiAoIXRoaXMucHJvcHMuZGF0YS5ibHVlcHJpbnRJZCAmJiAhdGhpcy5wcm9wcy5kYXRhLmRlcGxveW1lbnRJZCkge1xuICAgICAgICAgICAgLy8gICAgdGhpcy5iaW5kZXIuJHNjb3BlLmRhdGFVcGRhdGVkKHRoaXMucHJvcHMuZGF0YSk7XG4gICAgICAgICAgICAvL30gZWxzZSB7XG4gICAgICAgICAgICAvLyAgICB0aGlzLmJpbmRlci4kc2NvcGUuc2V0TG9hZGluZygpO1xuICAgICAgICAgICAgLy8gICAgdGhpcy5wcm9wcy5jb250ZXh0LnJlZnJlc2goKTtcbiAgICAgICAgICAgIC8vfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5iaW5kZXIuJHNjb3BlLmRhdGFVcGRhdGVkKHRoaXMucHJvcHMuZGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVuZGVyICgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8ZGl2IHJlZj0ndG9wb2xvZ3lDb250YWluZXInIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7X19odG1sOiB0aGlzLnByb3BzLnRlbXBsYXRlIH19PjwvZGl2PlxuICAgICAgICAgICAgKTtcblxuICAgIH1cbn1cblxuU3RhZ2UuYWRkUGx1Z2luKHtcbiAgICBpZDogJ3RvcG9sb2d5JyxcbiAgICBuYW1lOiBcInRvcG9sb2d5XCIsXG4gICAgZGVzY3JpcHRpb246ICdibGFoIGJsYWggYmxhaCcsXG4gICAgaW5pdGlhbFdpZHRoOiA4LFxuICAgIGluaXRpYWxIZWlnaHQ6IDQsXG4gICAgY29sb3I6IFwieWVsbG93XCIsXG4gICAgaXNSZWFjdDogdHJ1ZSxcbiAgICAvL2luaXQ6IGZ1bmN0aW9uKCkge1xuICAgIC8vICAgIGFuZ3VsYXJcbiAgICAvLyAgICAgICAgLm1vZHVsZSgndG9wb2xvZ3lBcHAnLCBbJ2NmeS50b3BvbG9neSddKVxuICAgIC8vICAgICAgICAuY29udHJvbGxlcigndG9wb2xvZ3lDb250cm9sbGVyJywgWyckc2NvcGUnLCdEYXRhUHJvY2Vzc2luZ1NlcnZpY2UnLCBmdW5jdGlvbigkc2NvcGUsRGF0YVByb2Nlc3NpbmdTZXJ2aWNlKSB7XG4gICAgLy9cbiAgICAvLyAgICAgICAgICAgIHZhciB0b3BvbG9neURhdGEgPSB7XG4gICAgLy8gICAgICAgICAgICAgICAgZGF0YToge1wibm9kZV90ZW1wbGF0ZXNcIiA6IHt9fSxcbiAgICAvLyAgICAgICAgICAgICAgICBsYXlvdXQ6IHtcIm5vZGVzXCI6IFtdLCBcImNvbm5lY3RvcnNcIjogW119ICxcbiAgICAvLyAgICAgICAgICAgICAgICBoaWVyYXJjaHk6IHt9XG4gICAgLy8gICAgICAgICAgICB9O1xuICAgIC8vXG4gICAgLy8gICAgICAgICAgICAkc2NvcGUudG9wb2xvZ3lEYXRhID0gRGF0YVByb2Nlc3NpbmdTZXJ2aWNlLmVuY29kZVRvcG9sb2d5KHRvcG9sb2d5RGF0YSk7XG4gICAgLy8gICAgICAgICAgICAkc2NvcGUudG9wb2xvZ3lMb2FkaW5nID0gZmFsc2U7XG4gICAgLy8gICAgICAgIH1dKTtcbiAgICAvL30sXG4gICAgZmV0Y2hEYXRhOiBmdW5jdGlvbihwbHVnaW4sY29udGV4dCxwbHVnaW5VdGlscykge1xuICAgICAgICB2YXIgZGVwbG95bWVudElkID0gY29udGV4dC5nZXRWYWx1ZSgnZGVwbG95bWVudElkJyk7XG4gICAgICAgIHZhciBibHVlcHJpbnRJZCA9IGNvbnRleHQuZ2V0VmFsdWUoJ2JsdWVwcmludElkJyk7XG5cbiAgICAgICAgaWYgKF8uaXNFbXB0eShkZXBsb3ltZW50SWQpICYmIF8uaXNFbXB0eShibHVlcHJpbnRJZCkpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe30pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRlcGxveW1lbnRJZCkge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7fSk7XG4gICAgICAgIH0gZWxzZSBpZiAoYmx1ZXByaW50SWQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUscmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgcGx1Z2luVXRpbHMualF1ZXJ5LmdldCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogY29udGV4dC5nZXRNYW5hZ2VyVXJsKCkgKyAnL2FwaS92Mi4xL2JsdWVwcmludHM/aWQ9JytibHVlcHJpbnRJZCxcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5kb25lKChibHVlcHJpbnQpPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShibHVlcHJpbnQpXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5mYWlsKHJlamVjdClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICByZW5kZXI6IGZ1bmN0aW9uKHdpZGdldCxkYXRhLGVycm9yLGNvbnRleHQscGx1Z2luVXRpbHMpIHtcbiAgICAgICAgaWYgKCF3aWRnZXQucGx1Z2luLnRlbXBsYXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gJ1RvcG9sb2d5OiBtaXNzaW5nIHRlbXBsYXRlJztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0b3BvbG9neVRlbXBsYXRlID0gXy50ZW1wbGF0ZSh3aWRnZXQucGx1Z2luLnRlbXBsYXRlKSgpO1xuICAgICAgICB2YXIgZGVwbG95bWVudElkID0gY29udGV4dC5nZXRWYWx1ZSgnZGVwbG95bWVudElkJyk7XG4gICAgICAgIHZhciBibHVlcHJpbnRJZCA9IGNvbnRleHQuZ2V0VmFsdWUoJ2JsdWVwcmludElkJyk7XG5cbiAgICAgICAgdmFyIGZvcm1hdHRlZERhdGEgPSBPYmplY3QuYXNzaWduKHt9LGRhdGEse1xuICAgICAgICAgICAgZGVwbG95bWVudElkLFxuICAgICAgICAgICAgYmx1ZXByaW50SWRcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiA8VG9wb2xvZ3kgdGVtcGxhdGU9e3RvcG9sb2d5VGVtcGxhdGV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgd2lkZ2V0PXt3aWRnZXR9IGRhdGE9e2Zvcm1hdHRlZERhdGF9IGNvbnRleHQ9e2NvbnRleHR9IHV0aWxzPXtwbHVnaW5VdGlsc30vPjtcblxuICAgIH1cblxuXG59KTsiXX0=
