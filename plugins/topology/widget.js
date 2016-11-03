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
                $scope.topologyLoading = false;

                $scope.dataUpdated = function (newData) {
                    if (newData && newData.items && newData.items[0]) {
                        var topologyData = {
                            data: newData.items[0],
                            scale: 0.75,
                            offset: [0, 29]
                        };
                        $scope.topologyData = DataProcessingService.encodeTopologyFromRest(topologyData);
                        $scope.$apply();
                    }
                };
                binder.$scope = $scope;
            }]);

            angular.bootstrap(this.refs.topologyContainer, ['topologyApp']);
        }

        //_refreshData() {
        //    this.props.context.refresh();
        //}

    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps, prevState) {
            if (this.props.data.blueprintId !== prevProps.data.blueprintId || this.props.data.deploymentId !== prevProps.data.deploymentId) {
                this.props.context.refresh();
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

        if (!deploymentId && !blueprintId) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwbHVnaW5zL3RvcG9sb2d5L3NyYy93aWRnZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0FDQUE7Ozs7SUFJTSxROzs7Ozs7Ozs7Ozs0Q0FDa0I7QUFDaEIsaUJBQUssTUFBTCxHQUFjLEVBQWQ7QUFDQSxnQkFBSSxTQUFTLEtBQUssTUFBbEI7O0FBRUEsb0JBQ0ssTUFETCxDQUNZLGFBRFosRUFDMkIsQ0FBQyxjQUFELENBRDNCLEVBRUssVUFGTCxDQUVnQixvQkFGaEIsRUFFc0MsQ0FBQyxRQUFELEVBQVUsdUJBQVYsRUFBbUMsVUFBUyxNQUFULEVBQWdCLHFCQUFoQixFQUF1Qzs7QUFFeEcsdUJBQU8sWUFBUCxHQUFzQixFQUF0QjtBQUNBLHVCQUFPLGVBQVAsR0FBeUIsS0FBekI7O0FBR0EsdUJBQU8sV0FBUCxHQUFxQixVQUFDLE9BQUQsRUFBYTtBQUM5Qix3QkFBSSxXQUFXLFFBQVEsS0FBbkIsSUFBNEIsUUFBUSxLQUFSLENBQWMsQ0FBZCxDQUFoQyxFQUFrRDtBQUM5Qyw0QkFBSSxlQUFlO0FBQ2Ysa0NBQU0sUUFBUSxLQUFSLENBQWMsQ0FBZCxDQURTO0FBRWYsbUNBQU8sSUFGUTtBQUdmLG9DQUFRLENBQUMsQ0FBRCxFQUFJLEVBQUo7QUFITyx5QkFBbkI7QUFLQSwrQkFBTyxZQUFQLEdBQXNCLHNCQUFzQixzQkFBdEIsQ0FBNkMsWUFBN0MsQ0FBdEI7QUFDQSwrQkFBTyxNQUFQO0FBQ0g7QUFDSixpQkFWRDtBQVdBLHVCQUFPLE1BQVAsR0FBZ0IsTUFBaEI7QUFHSCxhQXBCaUMsQ0FGdEM7O0FBd0JBLG9CQUFRLFNBQVIsQ0FBa0IsS0FBSyxJQUFMLENBQVUsaUJBQTVCLEVBQStDLENBQUMsYUFBRCxDQUEvQztBQUNIOztBQUVEO0FBQ0E7QUFDQTs7OzsyQ0FFbUIsUyxFQUFXLFMsRUFBVztBQUNyQyxnQkFBSSxLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLFdBQWhCLEtBQWdDLFVBQVUsSUFBVixDQUFlLFdBQS9DLElBQ0EsS0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixZQUFoQixLQUFpQyxVQUFVLElBQVYsQ0FBZSxZQURwRCxFQUVNO0FBQ0YscUJBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsT0FBbkI7QUFDSCxhQUpELE1BSU87QUFDSCxxQkFBSyxNQUFMLENBQVksTUFBWixDQUFtQixXQUFuQixDQUErQixLQUFLLEtBQUwsQ0FBVyxJQUExQztBQUNIO0FBQ0o7OztpQ0FDUztBQUNOLG1CQUNRLDZCQUFLLEtBQUksbUJBQVQsRUFBNkIseUJBQXlCLEVBQUMsUUFBUSxLQUFLLEtBQUwsQ0FBVyxRQUFwQixFQUF0RCxHQURSO0FBSUg7Ozs7RUFsRGtCLE1BQU0sUzs7QUFxRDdCLE1BQU0sU0FBTixDQUFnQjtBQUNaLFFBQUksVUFEUTtBQUVaLFVBQU0sVUFGTTtBQUdaLGlCQUFhLGdCQUhEO0FBSVosa0JBQWMsQ0FKRjtBQUtaLG1CQUFlLENBTEg7QUFNWixXQUFPLFFBTks7QUFPWixhQUFTLElBUEc7QUFRWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFXLG1CQUFTLE1BQVQsRUFBZ0IsT0FBaEIsRUFBd0IsV0FBeEIsRUFBcUM7QUFDNUMsWUFBSSxlQUFlLFFBQVEsUUFBUixDQUFpQixjQUFqQixDQUFuQjtBQUNBLFlBQUksY0FBYyxRQUFRLFFBQVIsQ0FBaUIsYUFBakIsQ0FBbEI7O0FBRUEsWUFBSSxDQUFDLFlBQUQsSUFBaUIsQ0FBQyxXQUF0QixFQUFtQztBQUMvQixtQkFBTyxRQUFRLE9BQVIsQ0FBZ0IsRUFBaEIsQ0FBUDtBQUNIOztBQUVELFlBQUksWUFBSixFQUFrQjtBQUNkLG1CQUFPLFFBQVEsT0FBUixDQUFnQixFQUFoQixDQUFQO0FBQ0gsU0FGRCxNQUVPLElBQUksV0FBSixFQUFpQjtBQUNwQixtQkFBTyxJQUFJLE9BQUosQ0FBYSxVQUFDLE9BQUQsRUFBUyxNQUFULEVBQW9CO0FBQ3BDLDRCQUFZLE1BQVosQ0FBbUIsR0FBbkIsQ0FBdUI7QUFDbkIseUJBQUssUUFBUSxhQUFSLEtBQTBCLDBCQUExQixHQUFxRCxXQUR2QztBQUVuQiw4QkFBVTtBQUZTLGlCQUF2QixFQUlLLElBSkwsQ0FJVSxVQUFDLFNBQUQsRUFBYztBQUNoQiw0QkFBUSxTQUFSO0FBQ0gsaUJBTkwsRUFPSyxJQVBMLENBT1UsTUFQVjtBQVFILGFBVE0sQ0FBUDtBQVVIO0FBQ0osS0E3Q1c7QUE4Q1osWUFBUSxnQkFBUyxNQUFULEVBQWdCLElBQWhCLEVBQXFCLEtBQXJCLEVBQTJCLE9BQTNCLEVBQW1DLFdBQW5DLEVBQWdEO0FBQ3BELFlBQUksQ0FBQyxPQUFPLE1BQVAsQ0FBYyxRQUFuQixFQUE2QjtBQUN6QixtQkFBTyw0QkFBUDtBQUNIOztBQUVELFlBQUksbUJBQW1CLEVBQUUsUUFBRixDQUFXLE9BQU8sTUFBUCxDQUFjLFFBQXpCLEdBQXZCO0FBQ0EsWUFBSSxlQUFlLFFBQVEsUUFBUixDQUFpQixjQUFqQixDQUFuQjtBQUNBLFlBQUksY0FBYyxRQUFRLFFBQVIsQ0FBaUIsYUFBakIsQ0FBbEI7O0FBRUEsWUFBSSxnQkFBZ0IsT0FBTyxNQUFQLENBQWMsRUFBZCxFQUFpQixJQUFqQixFQUFzQjtBQUN0QyxzQ0FEc0M7QUFFdEM7QUFGc0MsU0FBdEIsQ0FBcEI7QUFJQSxlQUFPLG9CQUFDLFFBQUQsSUFBVSxVQUFVLGdCQUFwQjtBQUNVLG9CQUFRLE1BRGxCLEVBQzBCLE1BQU0sYUFEaEMsRUFDK0MsU0FBUyxPQUR4RCxFQUNpRSxPQUFPLFdBRHhFLEdBQVA7QUFHSDs7QUE5RFcsQ0FBaEIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGtpbm5lcmV0emluIG9uIDA3LzA5LzIwMTYuXG4gKi9cblxuY2xhc3MgVG9wb2xvZ3kgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICB0aGlzLmJpbmRlciA9IHt9O1xuICAgICAgICB2YXIgYmluZGVyID0gdGhpcy5iaW5kZXI7XG5cbiAgICAgICAgYW5ndWxhclxuICAgICAgICAgICAgLm1vZHVsZSgndG9wb2xvZ3lBcHAnLCBbJ2NmeS50b3BvbG9neSddKVxuICAgICAgICAgICAgLmNvbnRyb2xsZXIoJ3RvcG9sb2d5Q29udHJvbGxlcicsIFsnJHNjb3BlJywnRGF0YVByb2Nlc3NpbmdTZXJ2aWNlJywgZnVuY3Rpb24oJHNjb3BlLERhdGFQcm9jZXNzaW5nU2VydmljZSkge1xuXG4gICAgICAgICAgICAgICAgJHNjb3BlLnRvcG9sb2d5RGF0YSA9IHt9O1xuICAgICAgICAgICAgICAgICRzY29wZS50b3BvbG9neUxvYWRpbmcgPSBmYWxzZTtcblxuXG4gICAgICAgICAgICAgICAgJHNjb3BlLmRhdGFVcGRhdGVkID0gKG5ld0RhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld0RhdGEgJiYgbmV3RGF0YS5pdGVtcyAmJiBuZXdEYXRhLml0ZW1zWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdG9wb2xvZ3lEYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IG5ld0RhdGEuaXRlbXNbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGU6IDAuNzUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0OiBbMCwgMjldXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnRvcG9sb2d5RGF0YSA9IERhdGFQcm9jZXNzaW5nU2VydmljZS5lbmNvZGVUb3BvbG9neUZyb21SZXN0KHRvcG9sb2d5RGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGJpbmRlci4kc2NvcGUgPSAkc2NvcGU7XG5cblxuICAgICAgICAgICAgfV0pO1xuXG4gICAgICAgIGFuZ3VsYXIuYm9vdHN0cmFwKHRoaXMucmVmcy50b3BvbG9neUNvbnRhaW5lciwgWyd0b3BvbG9neUFwcCddKTtcbiAgICB9XG5cbiAgICAvL19yZWZyZXNoRGF0YSgpIHtcbiAgICAvLyAgICB0aGlzLnByb3BzLmNvbnRleHQucmVmcmVzaCgpO1xuICAgIC8vfVxuXG4gICAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcywgcHJldlN0YXRlKSB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLmRhdGEuYmx1ZXByaW50SWQgIT09IHByZXZQcm9wcy5kYXRhLmJsdWVwcmludElkIHx8XG4gICAgICAgICAgICB0aGlzLnByb3BzLmRhdGEuZGVwbG95bWVudElkICE9PSBwcmV2UHJvcHMuZGF0YS5kZXBsb3ltZW50SWRcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LnJlZnJlc2goKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYmluZGVyLiRzY29wZS5kYXRhVXBkYXRlZCh0aGlzLnByb3BzLmRhdGEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlbmRlciAoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGRpdiByZWY9J3RvcG9sb2d5Q29udGFpbmVyJyBkYW5nZXJvdXNseVNldElubmVySFRNTD17e19faHRtbDogdGhpcy5wcm9wcy50ZW1wbGF0ZSB9fT48L2Rpdj5cbiAgICAgICAgICAgICk7XG5cbiAgICB9XG59XG5cblN0YWdlLmFkZFBsdWdpbih7XG4gICAgaWQ6ICd0b3BvbG9neScsXG4gICAgbmFtZTogXCJ0b3BvbG9neVwiLFxuICAgIGRlc2NyaXB0aW9uOiAnYmxhaCBibGFoIGJsYWgnLFxuICAgIGluaXRpYWxXaWR0aDogOCxcbiAgICBpbml0aWFsSGVpZ2h0OiA0LFxuICAgIGNvbG9yOiBcInllbGxvd1wiLFxuICAgIGlzUmVhY3Q6IHRydWUsXG4gICAgLy9pbml0OiBmdW5jdGlvbigpIHtcbiAgICAvLyAgICBhbmd1bGFyXG4gICAgLy8gICAgICAgIC5tb2R1bGUoJ3RvcG9sb2d5QXBwJywgWydjZnkudG9wb2xvZ3knXSlcbiAgICAvLyAgICAgICAgLmNvbnRyb2xsZXIoJ3RvcG9sb2d5Q29udHJvbGxlcicsIFsnJHNjb3BlJywnRGF0YVByb2Nlc3NpbmdTZXJ2aWNlJywgZnVuY3Rpb24oJHNjb3BlLERhdGFQcm9jZXNzaW5nU2VydmljZSkge1xuICAgIC8vXG4gICAgLy8gICAgICAgICAgICB2YXIgdG9wb2xvZ3lEYXRhID0ge1xuICAgIC8vICAgICAgICAgICAgICAgIGRhdGE6IHtcIm5vZGVfdGVtcGxhdGVzXCIgOiB7fX0sXG4gICAgLy8gICAgICAgICAgICAgICAgbGF5b3V0OiB7XCJub2Rlc1wiOiBbXSwgXCJjb25uZWN0b3JzXCI6IFtdfSAsXG4gICAgLy8gICAgICAgICAgICAgICAgaGllcmFyY2h5OiB7fVxuICAgIC8vICAgICAgICAgICAgfTtcbiAgICAvL1xuICAgIC8vICAgICAgICAgICAgJHNjb3BlLnRvcG9sb2d5RGF0YSA9IERhdGFQcm9jZXNzaW5nU2VydmljZS5lbmNvZGVUb3BvbG9neSh0b3BvbG9neURhdGEpO1xuICAgIC8vICAgICAgICAgICAgJHNjb3BlLnRvcG9sb2d5TG9hZGluZyA9IGZhbHNlO1xuICAgIC8vICAgICAgICB9XSk7XG4gICAgLy99LFxuICAgIGZldGNoRGF0YTogZnVuY3Rpb24ocGx1Z2luLGNvbnRleHQscGx1Z2luVXRpbHMpIHtcbiAgICAgICAgdmFyIGRlcGxveW1lbnRJZCA9IGNvbnRleHQuZ2V0VmFsdWUoJ2RlcGxveW1lbnRJZCcpO1xuICAgICAgICB2YXIgYmx1ZXByaW50SWQgPSBjb250ZXh0LmdldFZhbHVlKCdibHVlcHJpbnRJZCcpO1xuXG4gICAgICAgIGlmICghZGVwbG95bWVudElkICYmICFibHVlcHJpbnRJZCkge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7fSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGVwbG95bWVudElkKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHt9KTtcbiAgICAgICAgfSBlbHNlIGlmIChibHVlcHJpbnRJZCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAocmVzb2x2ZSxyZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBwbHVnaW5VdGlscy5qUXVlcnkuZ2V0KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBjb250ZXh0LmdldE1hbmFnZXJVcmwoKSArICcvYXBpL3YyLjEvYmx1ZXByaW50cz9pZD0nK2JsdWVwcmludElkLFxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmRvbmUoKGJsdWVwcmludCk9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGJsdWVwcmludClcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmZhaWwocmVqZWN0KVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlbmRlcjogZnVuY3Rpb24od2lkZ2V0LGRhdGEsZXJyb3IsY29udGV4dCxwbHVnaW5VdGlscykge1xuICAgICAgICBpZiAoIXdpZGdldC5wbHVnaW4udGVtcGxhdGUpIHtcbiAgICAgICAgICAgIHJldHVybiAnVG9wb2xvZ3k6IG1pc3NpbmcgdGVtcGxhdGUnO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRvcG9sb2d5VGVtcGxhdGUgPSBfLnRlbXBsYXRlKHdpZGdldC5wbHVnaW4udGVtcGxhdGUpKCk7XG4gICAgICAgIHZhciBkZXBsb3ltZW50SWQgPSBjb250ZXh0LmdldFZhbHVlKCdkZXBsb3ltZW50SWQnKTtcbiAgICAgICAgdmFyIGJsdWVwcmludElkID0gY29udGV4dC5nZXRWYWx1ZSgnYmx1ZXByaW50SWQnKTtcblxuICAgICAgICB2YXIgZm9ybWF0dGVkRGF0YSA9IE9iamVjdC5hc3NpZ24oe30sZGF0YSx7XG4gICAgICAgICAgICBkZXBsb3ltZW50SWQsXG4gICAgICAgICAgICBibHVlcHJpbnRJZFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIDxUb3BvbG9neSB0ZW1wbGF0ZT17dG9wb2xvZ3lUZW1wbGF0ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICB3aWRnZXQ9e3dpZGdldH0gZGF0YT17Zm9ybWF0dGVkRGF0YX0gY29udGV4dD17Y29udGV4dH0gdXRpbHM9e3BsdWdpblV0aWxzfS8+O1xuXG4gICAgfVxuXG5cbn0pOyJdfQ==
