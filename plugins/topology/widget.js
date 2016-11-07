(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by kinneretzin on 07/11/2016.
 */

var AngularAppManager = function () {
    function AngularAppManager() {
        _classCallCheck(this, AngularAppManager);

        this.appName = null;
        this.app = null;
        this.container = null;
    }

    _createClass(AngularAppManager, [{
        key: 'start',
        value: function start(container, appName) {
            if (this.app) {
                this.destroy();
            }

            if (container) {
                this.appName = appName;
                this.container = container;
                this.app = angular.bootstrap(this.container, [this.appName]);
                this.$rootScope = this.app.get('$rootScope');
            }
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            //var $rootScope = this.app.get('$rootScope');
            this.$rootScope.$destroy();

            this.app = null;
            this.appName = null;
            this.container = null;
        }
    }, {
        key: 'fireEvent',
        value: function fireEvent(eventName, data) {
            if (this.app && this.$rootScope) {
                this.$rootScope.$broadcast(eventName, data);
            }
        }
    }]);

    return AngularAppManager;
}();

exports.default = AngularAppManager;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AngularAppManager = require('./AngularAppManager');

var _AngularAppManager2 = _interopRequireDefault(_AngularAppManager);

require('./TopologyAngularApp.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by kinneretzin on 06/11/2016.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var angularAppManager = new _AngularAppManager2.default();

var Topology = function (_React$Component) {
    _inherits(Topology, _React$Component);

    function Topology(props, context) {
        _classCallCheck(this, Topology);

        // We use this property to clear the angular directive (inorder to destroy the application)
        var _this = _possibleConstructorReturn(this, (Topology.__proto__ || Object.getPrototypeOf(Topology)).call(this, props, context));

        _this.state = {
            initialized: props.data !== null && props.data !== undefined
        };
        return _this;
    }

    _createClass(Topology, [{
        key: 'componentDidMount',
        value: function componentDidMount() {

            angularAppManager.start(this.refs.topologyContainer, 'topologyApp');
            this._setStyle();

            // Set the first time data
            angularAppManager.fireEvent('updateData', this.props.data);
        }
    }, {
        key: '_setStyle',
        value: function _setStyle() {
            // Set the container's size (its only available after loading the template)
            $(this.refs.topologyContainer).find('.topologyContainer').css({
                "position": "absolute",
                "left": "10px",
                "top": "10px",
                "bottom": "10px",
                "right": "10px"
            });

            // Change the loading indication to be our loading indication (only available after bootstraping angular component - defined in the directive)
            $(this.refs.topologyContainer).find('.loading').html(this.props.utils.renderLoading());
        }

        // If we are getting new props and configuration have changed, we need to first clear the content of the component so it will
        // fully destory the angular application. This is why we set the 'initialized' state to false. It will make the render not draw
        // the directive , in 'componentDidUpdate' we will set it back to initialized causeing the 'render' to be called again, and
        // re-initialize the angular application

    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (this.props.data.topologyConfig && (this.props.data.topologyConfig.enableNodeClick !== nextProps.data.topologyConfig.enableNodeClick || this.props.data.topologyConfig.enableGroupClick !== nextProps.data.topologyConfig.enableGroupClick || this.props.data.topologyConfig.enableZoom !== nextProps.data.topologyConfig.enableZoom || this.props.data.topologyConfig.enableDrag !== nextProps.data.topologyConfig.enableDrag || this.props.data.topologyConfig.showToolbar !== nextProps.data.topologyConfig.showToolbar)) {

                angularAppManager.destroy();
                this.setState({ initialized: false });
            }
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps, prevState) {
            // If the application was now intialized (was false before) we need to bootstrap the angular app
            if (this.state.initialized && !prevState.initialized) {
                angularAppManager.start(this.refs.topologyContainer, 'topologyApp');
                this._setStyle();

                angularAppManager.fireEvent('updateData', this.props.data);

                // If a deployment Id or blueprint Id has changed, need to re-fetch the topology data
            } else if (this.props.data.blueprintId !== prevProps.data.blueprintId || this.props.data.deploymentId !== prevProps.data.deploymentId) {

                angularAppManager.fireEvent('setLoading');
                this.props.context.refresh();

                // Check if configuration has changed, if so , set the initialized to true, to cause it to render again, but now it
                // will re-create the angular directive.
            } else if (this.props.data.topologyConfig && (this.props.data.topologyConfig.enableNodeClick !== prevProps.data.topologyConfig.enableNodeClick || this.props.data.topologyConfig.enableGroupClick !== prevProps.data.topologyConfig.enableGroupClick || this.props.data.topologyConfig.enableZoom !== prevProps.data.topologyConfig.enableZoom || this.props.data.topologyConfig.enableDrag !== prevProps.data.topologyConfig.enableDrag || this.props.data.topologyConfig.showToolbar !== prevProps.data.topologyConfig.showToolbar)) {

                this.setState({ initialized: true });
            } else {
                {
                    // TODO maybe need to check if the data was actually changed, because soemthing else in the context might have changed...
                    // Else it means that a new topology data was fetched, need to redraw
                    angularAppManager.fireEvent('updateData', this.props.data);
                }
            }
        }
    }, {
        key: 'render',
        value: function render() {
            // Not render the directive incase initialized is false
            if (!this.state.initialized) {
                return this.props.utils.renderReactLoading();
            }

            return React.createElement(
                'div',
                { ref: 'topologyParentContainer' },
                React.createElement('div', { ref: 'topologyContainer', dangerouslySetInnerHTML: { __html: this.props.template } })
            );
        }
    }]);

    return Topology;
}(React.Component);

exports.default = Topology;

},{"./AngularAppManager":1,"./TopologyAngularApp.js":3}],3:[function(require,module,exports){
'use strict';

/**
 * Created by kinneretzin on 07/11/2016.
 */

// Define the angular application
angular.module('topologyApp', ['cfy.topology']).controller('topologyController', ['$scope', 'DataProcessingService', function ($scope, DataProcessingService) {

    $scope.topologyData = {
        scale: 0.75,
        offset: [0, 0]
    };
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
            $scope.topologyData = {
                scale: 0.75,
                offset: [0, 0]
            };
        }
        $scope.topologyLoading = false;
        $scope.$apply();
    };

    $scope.setLoading = function () {
        $scope.topologyLoading = true;
        $scope.$apply();
    };

    $scope.$on('setLoading', function () {
        $scope.setLoading();
    });

    $scope.$on('updateData', function (event, newData) {
        $scope.dataUpdated(newData);
    });
}]);

},{}],4:[function(require,module,exports){
'use strict';

var _Topology = require('./Topology');

var _Topology2 = _interopRequireDefault(_Topology);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getConfig = function getConfig(widgetConfig, id) {
    var conf = widgetConfig ? _.find(widgetConfig, { id: id }) : {};
    return conf && conf.value === 'true';
}; /**
    * Created by kinneretzin on 07/09/2016.
    */

Stage.addPlugin({
    id: 'topology',
    name: "Topology",
    description: 'Shows topology (blueprint or deployment)',
    initialWidth: 8,
    initialHeight: 4,
    color: "yellow",
    isReact: true,
    initialConfiguration: [{ id: 'enableNodeClick', name: 'Enable node click', placeHolder: "true of false", default: "true" }, { id: 'enableGroupClick', name: 'Enable group click', placeHolder: "true of false", default: "true" }, { id: 'enableZoom', name: 'Enable zoom', placeHolder: "true of false", default: "true" }, { id: 'enableDrag', name: 'Enable drag', placeHolder: "true of false", default: "true" }, { id: 'showToolbar', name: 'Show toolbar', placeHolder: "true of false", default: "true" }],

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

        var topologyConfig = {
            enableNodeClick: getConfig(widget.configuration, 'enableNodeClick'),
            enableGroupClick: getConfig(widget.configuration, 'enableGroupClick'),
            enableZoom: getConfig(widget.configuration, 'enableZoom'),
            enableDrag: getConfig(widget.configuration, 'enableDrag'),
            showToolbar: getConfig(widget.configuration, 'showToolbar')
        };

        var topologyTemplate = _.template(widget.plugin.template)(topologyConfig);
        var deploymentId = context.getValue('deploymentId');
        var blueprintId = context.getValue('blueprintId');

        var formattedData = Object.assign({}, data, {
            deploymentId: deploymentId,
            blueprintId: blueprintId,
            topologyConfig: topologyConfig
        });
        return React.createElement(_Topology2.default, { template: topologyTemplate,
            widget: widget, data: formattedData, context: context, utils: pluginUtils });
    }

});

},{"./Topology":2}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwbHVnaW5zL3RvcG9sb2d5L3NyYy9Bbmd1bGFyQXBwTWFuYWdlci5qcyIsInBsdWdpbnMvdG9wb2xvZ3kvc3JjL1RvcG9sb2d5LmpzIiwicGx1Z2lucy90b3BvbG9neS9zcmMvVG9wb2xvZ3lBbmd1bGFyQXBwLmpzIiwicGx1Z2lucy90b3BvbG9neS9zcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztBQ0FBOzs7O0lBSXFCLGlCO0FBRWpCLGlDQUFlO0FBQUE7O0FBQ1gsYUFBSyxPQUFMLEdBQWUsSUFBZjtBQUNBLGFBQUssR0FBTCxHQUFXLElBQVg7QUFDQSxhQUFLLFNBQUwsR0FBaUIsSUFBakI7QUFDSDs7Ozs4QkFFTSxTLEVBQVUsTyxFQUFTO0FBQ3RCLGdCQUFJLEtBQUssR0FBVCxFQUFjO0FBQ1YscUJBQUssT0FBTDtBQUNIOztBQUVELGdCQUFJLFNBQUosRUFBZTtBQUNYLHFCQUFLLE9BQUwsR0FBZSxPQUFmO0FBQ0EscUJBQUssU0FBTCxHQUFpQixTQUFqQjtBQUNBLHFCQUFLLEdBQUwsR0FBVyxRQUFRLFNBQVIsQ0FBa0IsS0FBSyxTQUF2QixFQUFpQyxDQUFDLEtBQUssT0FBTixDQUFqQyxDQUFYO0FBQ0EscUJBQUssVUFBTCxHQUFrQixLQUFLLEdBQUwsQ0FBUyxHQUFULENBQWEsWUFBYixDQUFsQjtBQUNIO0FBQ0o7OztrQ0FFUztBQUNOO0FBQ0EsaUJBQUssVUFBTCxDQUFnQixRQUFoQjs7QUFFQSxpQkFBSyxHQUFMLEdBQVcsSUFBWDtBQUNBLGlCQUFLLE9BQUwsR0FBZSxJQUFmO0FBQ0EsaUJBQUssU0FBTCxHQUFpQixJQUFqQjtBQUNIOzs7a0NBRVMsUyxFQUFVLEksRUFBTTtBQUN0QixnQkFBSSxLQUFLLEdBQUwsSUFBWSxLQUFLLFVBQXJCLEVBQWlDO0FBQzdCLHFCQUFL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LE9BQU8sYUFBakIsRUFBK0IsYUFBL0I7QUFMSSxTQUFyQjs7QUFRQSxZQUFJLG1CQUFtQixFQUFFLFFBQUYsQ0FBVyxPQUFPLE1BQVAsQ0FBYyxRQUF6QixFQUFtQyxjQUFuQyxDQUF2QjtBQUNBLFlBQUksZUFBZSxRQUFRLFFBQVIsQ0FBaUIsY0FBakIsQ0FBbkI7QUFDQSxZQUFJLGNBQWMsUUFBUSxRQUFSLENBQWlCLGFBQWpCLENBQWxCOztBQUVBLFlBQUksZ0JBQWdCLE9BQU8sTUFBUCxDQUFjLEVBQWQsRUFBaUIsSUFBakIsRUFBc0I7QUFDdEMsc0NBRHNDO0FBRXRDLG9DQUZzQztBQUd0QztBQUhzQyxTQUF0QixDQUFwQjtBQUtBLGVBQU8sMENBQVUsVUFBVSxnQkFBcEI7QUFDVSxvQkFBUSxNQURsQixFQUMwQixNQUFNLGFBRGhDLEVBQytDLFNBQVMsT0FEeEQsRUFDaUUsT0FBTyxXQUR4RSxHQUFQO0FBR0g7O0FBaEVXLENBQWhCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ3JlYXRlZCBieSBraW5uZXJldHppbiBvbiAwNy8xMS8yMDE2LlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFuZ3VsYXJBcHBNYW5hZ2Vye1xuXG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICB0aGlzLmFwcE5hbWUgPSBudWxsO1xuICAgICAgICB0aGlzLmFwcCA9IG51bGw7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gbnVsbDtcbiAgICB9XG5cbiAgICBzdGFydCAoY29udGFpbmVyLGFwcE5hbWUpIHtcbiAgICAgICAgaWYgKHRoaXMuYXBwKSB7XG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb250YWluZXIpIHtcbiAgICAgICAgICAgIHRoaXMuYXBwTmFtZSA9IGFwcE5hbWU7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgICAgICAgICAgIHRoaXMuYXBwID0gYW5ndWxhci5ib290c3RyYXAodGhpcy5jb250YWluZXIsW3RoaXMuYXBwTmFtZV0pO1xuICAgICAgICAgICAgdGhpcy4kcm9vdFNjb3BlID0gdGhpcy5hcHAuZ2V0KCckcm9vdFNjb3BlJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgICAvL3ZhciAkcm9vdFNjb3BlID0gdGhpcy5hcHAuZ2V0KCckcm9vdFNjb3BlJyk7XG4gICAgICAgIHRoaXMuJHJvb3RTY29wZS4kZGVzdHJveSgpO1xuXG4gICAgICAgIHRoaXMuYXBwID0gbnVsbDtcbiAgICAgICAgdGhpcy5hcHBOYW1lID0gbnVsbDtcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBudWxsO1xuICAgIH1cblxuICAgIGZpcmVFdmVudChldmVudE5hbWUsZGF0YSkge1xuICAgICAgICBpZiAodGhpcy5hcHAgJiYgdGhpcy4kcm9vdFNjb3BlKSB7XG4gICAgICAgICAgICB0aGlzLiRyb290U2NvcGUuJGJyb2FkY2FzdChldmVudE5hbWUsZGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGtpbm5lcmV0emluIG9uIDA2LzExLzIwMTYuXG4gKi9cblxuaW1wb3J0IEFuZ3VsYXJBcHBNYW5hZ2VyIGZyb20gJy4vQW5ndWxhckFwcE1hbmFnZXInO1xuaW1wb3J0ICcuL1RvcG9sb2d5QW5ndWxhckFwcC5qcyc7XG5cbmxldCBhbmd1bGFyQXBwTWFuYWdlciA9IG5ldyBBbmd1bGFyQXBwTWFuYWdlcigpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUb3BvbG9neSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcbiAgICAgICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xuXG4gICAgICAgIC8vIFdlIHVzZSB0aGlzIHByb3BlcnR5IHRvIGNsZWFyIHRoZSBhbmd1bGFyIGRpcmVjdGl2ZSAoaW5vcmRlciB0byBkZXN0cm95IHRoZSBhcHBsaWNhdGlvbilcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIGluaXRpYWxpemVkIDogcHJvcHMuZGF0YSAhPT0gbnVsbCAmJiBwcm9wcy5kYXRhICE9PSB1bmRlZmluZWRcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuXG4gICAgICAgIGFuZ3VsYXJBcHBNYW5hZ2VyLnN0YXJ0KHRoaXMucmVmcy50b3BvbG9neUNvbnRhaW5lciwndG9wb2xvZ3lBcHAnKTtcbiAgICAgICAgdGhpcy5fc2V0U3R5bGUoKTtcblxuICAgICAgICAvLyBTZXQgdGhlIGZpcnN0IHRpbWUgZGF0YVxuICAgICAgICBhbmd1bGFyQXBwTWFuYWdlci5maXJlRXZlbnQoJ3VwZGF0ZURhdGEnLHRoaXMucHJvcHMuZGF0YSk7XG4gICAgfVxuXG4gICAgX3NldFN0eWxlKCkge1xuICAgICAgICAvLyBTZXQgdGhlIGNvbnRhaW5lcidzIHNpemUgKGl0cyBvbmx5IGF2YWlsYWJsZSBhZnRlciBsb2FkaW5nIHRoZSB0ZW1wbGF0ZSlcbiAgICAgICAgJCh0aGlzLnJlZnMudG9wb2xvZ3lDb250YWluZXIpLmZpbmQoJy50b3BvbG9neUNvbnRhaW5lcicpLmNzcyh7XG4gICAgICAgICAgICBcInBvc2l0aW9uXCI6IFwiYWJzb2x1dGVcIixcbiAgICAgICAgICAgIFwibGVmdFwiOiBcIjEwcHhcIixcbiAgICAgICAgICAgIFwidG9wXCI6IFwiMTBweFwiLFxuICAgICAgICAgICAgXCJib3R0b21cIjogXCIxMHB4XCIsXG4gICAgICAgICAgICBcInJpZ2h0XCI6IFwiMTBweFwiXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIENoYW5nZSB0aGUgbG9hZGluZyBpbmRpY2F0aW9uIHRvIGJlIG91ciBsb2FkaW5nIGluZGljYXRpb24gKG9ubHkgYXZhaWxhYmxlIGFmdGVyIGJvb3RzdHJhcGluZyBhbmd1bGFyIGNvbXBvbmVudCAtIGRlZmluZWQgaW4gdGhlIGRpcmVjdGl2ZSlcbiAgICAgICAgJCh0aGlzLnJlZnMudG9wb2xvZ3lDb250YWluZXIpLmZpbmQoJy5sb2FkaW5nJykuaHRtbCh0aGlzLnByb3BzLnV0aWxzLnJlbmRlckxvYWRpbmcoKSk7XG5cbiAgICB9XG5cbiAgICAvLyBJZiB3ZSBhcmUgZ2V0dGluZyBuZXcgcHJvcHMgYW5kIGNvbmZpZ3VyYXRpb24gaGF2ZSBjaGFuZ2VkLCB3ZSBuZWVkIHRvIGZpcnN0IGNsZWFyIHRoZSBjb250ZW50IG9mIHRoZSBjb21wb25lbnQgc28gaXQgd2lsbFxuICAgIC8vIGZ1bGx5IGRlc3RvcnkgdGhlIGFuZ3VsYXIgYXBwbGljYXRpb24uIFRoaXMgaXMgd2h5IHdlIHNldCB0aGUgJ2luaXRpYWxpemVkJyBzdGF0ZSB0byBmYWxzZS4gSXQgd2lsbCBtYWtlIHRoZSByZW5kZXIgbm90IGRyYXdcbiAgICAvLyB0aGUgZGlyZWN0aXZlICwgaW4gJ2NvbXBvbmVudERpZFVwZGF0ZScgd2Ugd2lsbCBzZXQgaXQgYmFjayB0byBpbml0aWFsaXplZCBjYXVzZWluZyB0aGUgJ3JlbmRlcicgdG8gYmUgY2FsbGVkIGFnYWluLCBhbmRcbiAgICAvLyByZS1pbml0aWFsaXplIHRoZSBhbmd1bGFyIGFwcGxpY2F0aW9uXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyAobmV4dFByb3BzKSB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLmRhdGEudG9wb2xvZ3lDb25maWcgJiZcbiAgICAgICAgICAgICh0aGlzLnByb3BzLmRhdGEudG9wb2xvZ3lDb25maWcuZW5hYmxlTm9kZUNsaWNrICE9PSBuZXh0UHJvcHMuZGF0YS50b3BvbG9neUNvbmZpZy5lbmFibGVOb2RlQ2xpY2sgfHxcbiAgICAgICAgICAgIHRoaXMucHJvcHMuZGF0YS50b3BvbG9neUNvbmZpZy5lbmFibGVHcm91cENsaWNrICE9PSBuZXh0UHJvcHMuZGF0YS50b3BvbG9neUNvbmZpZy5lbmFibGVHcm91cENsaWNrIHx8XG4gICAgICAgICAgICB0aGlzLnByb3BzLmRhdGEudG9wb2xvZ3lDb25maWcuZW5hYmxlWm9vbSAhPT0gbmV4dFByb3BzLmRhdGEudG9wb2xvZ3lDb25maWcuZW5hYmxlWm9vbSB8fFxuICAgICAgICAgICAgdGhpcy5wcm9wcy5kYXRhLnRvcG9sb2d5Q29uZmlnLmVuYWJsZURyYWcgIT09IG5leHRQcm9wcy5kYXRhLnRvcG9sb2d5Q29uZmlnLmVuYWJsZURyYWcgfHxcbiAgICAgICAgICAgIHRoaXMucHJvcHMuZGF0YS50b3BvbG9neUNvbmZpZy5zaG93VG9vbGJhciAhPT0gbmV4dFByb3BzLmRhdGEudG9wb2xvZ3lDb25maWcuc2hvd1Rvb2xiYXIpKSB7XG5cbiAgICAgICAgICAgIGFuZ3VsYXJBcHBNYW5hZ2VyLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2luaXRpYWxpemVkOiBmYWxzZX0pO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzLCBwcmV2U3RhdGUpIHtcbiAgICAgICAgLy8gSWYgdGhlIGFwcGxpY2F0aW9uIHdhcyBub3cgaW50aWFsaXplZCAod2FzIGZhbHNlIGJlZm9yZSkgd2UgbmVlZCB0byBib290c3RyYXAgdGhlIGFuZ3VsYXIgYXBwXG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmluaXRpYWxpemVkICYmICFwcmV2U3RhdGUuaW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgICAgIGFuZ3VsYXJBcHBNYW5hZ2VyLnN0YXJ0KHRoaXMucmVmcy50b3BvbG9neUNvbnRhaW5lciwndG9wb2xvZ3lBcHAnKTtcbiAgICAgICAgICAgIHRoaXMuX3NldFN0eWxlKCk7XG5cbiAgICAgICAgICAgIGFuZ3VsYXJBcHBNYW5hZ2VyLmZpcmVFdmVudCgndXBkYXRlRGF0YScsdGhpcy5wcm9wcy5kYXRhKTtcblxuICAgICAgICAgICAgLy8gSWYgYSBkZXBsb3ltZW50IElkIG9yIGJsdWVwcmludCBJZCBoYXMgY2hhbmdlZCwgbmVlZCB0byByZS1mZXRjaCB0aGUgdG9wb2xvZ3kgZGF0YVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMuZGF0YS5ibHVlcHJpbnRJZCAhPT0gcHJldlByb3BzLmRhdGEuYmx1ZXByaW50SWQgfHxcbiAgICAgICAgICAgIHRoaXMucHJvcHMuZGF0YS5kZXBsb3ltZW50SWQgIT09IHByZXZQcm9wcy5kYXRhLmRlcGxveW1lbnRJZCkge1xuXG4gICAgICAgICAgICBhbmd1bGFyQXBwTWFuYWdlci5maXJlRXZlbnQoJ3NldExvYWRpbmcnKTtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5yZWZyZXNoKCk7XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGlmIGNvbmZpZ3VyYXRpb24gaGFzIGNoYW5nZWQsIGlmIHNvICwgc2V0IHRoZSBpbml0aWFsaXplZCB0byB0cnVlLCB0byBjYXVzZSBpdCB0byByZW5kZXIgYWdhaW4sIGJ1dCBub3cgaXRcbiAgICAgICAgICAgIC8vIHdpbGwgcmUtY3JlYXRlIHRoZSBhbmd1bGFyIGRpcmVjdGl2ZS5cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLmRhdGEudG9wb2xvZ3lDb25maWcgJiZcbiAgICAgICAgICAgICh0aGlzLnByb3BzLmRhdGEudG9wb2xvZ3lDb25maWcuZW5hYmxlTm9kZUNsaWNrICE9PSBwcmV2UHJvcHMuZGF0YS50b3BvbG9neUNvbmZpZy5lbmFibGVOb2RlQ2xpY2sgfHxcbiAgICAgICAgICAgIHRoaXMucHJvcHMuZGF0YS50b3BvbG9neUNvbmZpZy5lbmFibGVHcm91cENsaWNrICE9PSBwcmV2UHJvcHMuZGF0YS50b3BvbG9neUNvbmZpZy5lbmFibGVHcm91cENsaWNrIHx8XG4gICAgICAgICAgICB0aGlzLnByb3BzLmRhdGEudG9wb2xvZ3lDb25maWcuZW5hYmxlWm9vbSAhPT0gcHJldlByb3BzLmRhdGEudG9wb2xvZ3lDb25maWcuZW5hYmxlWm9vbSB8fFxuICAgICAgICAgICAgdGhpcy5wcm9wcy5kYXRhLnRvcG9sb2d5Q29uZmlnLmVuYWJsZURyYWcgIT09IHByZXZQcm9wcy5kYXRhLnRvcG9sb2d5Q29uZmlnLmVuYWJsZURyYWcgfHxcbiAgICAgICAgICAgIHRoaXMucHJvcHMuZGF0YS50b3BvbG9neUNvbmZpZy5zaG93VG9vbGJhciAhPT0gcHJldlByb3BzLmRhdGEudG9wb2xvZ3lDb25maWcuc2hvd1Rvb2xiYXIpKSB7XG5cbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2luaXRpYWxpemVkOiB0cnVlfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy8gVE9ETyBtYXliZSBuZWVkIHRvIGNoZWNrIGlmIHRoZSBkYXRhIHdhcyBhY3R1YWxseSBjaGFuZ2VkLCBiZWNhdXNlIHNvZW10aGluZyBlbHNlIGluIHRoZSBjb250ZXh0IG1pZ2h0IGhhdmUgY2hhbmdlZC4uLlxuICAgICAgICAgICAgICAgIC8vIEVsc2UgaXQgbWVhbnMgdGhhdCBhIG5ldyB0b3BvbG9neSBkYXRhIHdhcyBmZXRjaGVkLCBuZWVkIHRvIHJlZHJhd1xuICAgICAgICAgICAgICAgIGFuZ3VsYXJBcHBNYW5hZ2VyLmZpcmVFdmVudCgndXBkYXRlRGF0YScsdGhpcy5wcm9wcy5kYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZW5kZXIgKCkge1xuICAgICAgICAvLyBOb3QgcmVuZGVyIHRoZSBkaXJlY3RpdmUgaW5jYXNlIGluaXRpYWxpemVkIGlzIGZhbHNlXG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5pbml0aWFsaXplZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMudXRpbHMucmVuZGVyUmVhY3RMb2FkaW5nKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiByZWY9J3RvcG9sb2d5UGFyZW50Q29udGFpbmVyJz5cbiAgICAgICAgICAgICAgICA8ZGl2IHJlZj0ndG9wb2xvZ3lDb250YWluZXInIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7X19odG1sOiB0aGlzLnByb3BzLnRlbXBsYXRlIH19PjwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG5cbiAgICB9XG59XG5cbiIsIi8qKlxuICogQ3JlYXRlZCBieSBraW5uZXJldHppbiBvbiAwNy8xMS8yMDE2LlxuICovXG5cbi8vIERlZmluZSB0aGUgYW5ndWxhciBhcHBsaWNhdGlvblxuYW5ndWxhclxuICAgIC5tb2R1bGUoJ3RvcG9sb2d5QXBwJywgWydjZnkudG9wb2xvZ3knXSlcbiAgICAuY29udHJvbGxlcigndG9wb2xvZ3lDb250cm9sbGVyJywgWyckc2NvcGUnLCdEYXRhUHJvY2Vzc2luZ1NlcnZpY2UnLCBmdW5jdGlvbigkc2NvcGUsRGF0YVByb2Nlc3NpbmdTZXJ2aWNlKSB7XG5cbiAgICAgICAgJHNjb3BlLnRvcG9sb2d5RGF0YSA9IHtcbiAgICAgICAgICAgIHNjYWxlOiAwLjc1LFxuICAgICAgICAgICAgb2Zmc2V0OiBbMCwgMF1cbiAgICAgICAgfTtcbiAgICAgICAgJHNjb3BlLnRvcG9sb2d5TG9hZGluZyA9IHRydWU7XG5cblxuICAgICAgICAkc2NvcGUuZGF0YVVwZGF0ZWQgPSAobmV3RGF0YSkgPT4ge1xuICAgICAgICAgICAgaWYgKG5ld0RhdGEgJiYgbmV3RGF0YS5pdGVtcyAmJiBuZXdEYXRhLml0ZW1zWzBdKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRvcG9sb2d5RGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogbmV3RGF0YS5pdGVtc1swXSxcbiAgICAgICAgICAgICAgICAgICAgc2NhbGU6IDAuNzUsXG4gICAgICAgICAgICAgICAgICAgIG9mZnNldDogWzAsIDBdXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAkc2NvcGUudG9wb2xvZ3lEYXRhID0gRGF0YVByb2Nlc3NpbmdTZXJ2aWNlLmVuY29kZVRvcG9sb2d5RnJvbVJlc3QodG9wb2xvZ3lEYXRhKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnRvcG9sb2d5RGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgc2NhbGU6IDAuNzUsXG4gICAgICAgICAgICAgICAgICAgIG9mZnNldDogWzAsIDBdXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICRzY29wZS50b3BvbG9neUxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuc2V0TG9hZGluZyA9ICgpID0+IHtcbiAgICAgICAgICAgICRzY29wZS50b3BvbG9neUxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS4kb24oJ3NldExvYWRpbmcnLCgpPT57XG4gICAgICAgICAgICAkc2NvcGUuc2V0TG9hZGluZygpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUuJG9uKCd1cGRhdGVEYXRhJywoZXZlbnQsbmV3RGF0YSk9PntcbiAgICAgICAgICAgICRzY29wZS5kYXRhVXBkYXRlZChuZXdEYXRhKTtcbiAgICAgICAgfSk7XG4gICAgfV0pO1xuXG4iLCIvKipcbiAqIENyZWF0ZWQgYnkga2lubmVyZXR6aW4gb24gMDcvMDkvMjAxNi5cbiAqL1xuXG5pbXBvcnQgVG9wb2xvZ3kgZnJvbSAnLi9Ub3BvbG9neSc7XG5cblxubGV0IGdldENvbmZpZyA9ICh3aWRnZXRDb25maWcsaWQpID0+e1xuICAgIHZhciBjb25mID0gd2lkZ2V0Q29uZmlnID8gXy5maW5kKHdpZGdldENvbmZpZyx7aWQ6aWR9KSA6IHt9O1xuICAgIHJldHVybiAoY29uZiAmJiBjb25mLnZhbHVlID09PSAndHJ1ZScpO1xufTtcblxuU3RhZ2UuYWRkUGx1Z2luKHtcbiAgICBpZDogJ3RvcG9sb2d5JyxcbiAgICBuYW1lOiBcIlRvcG9sb2d5XCIsXG4gICAgZGVzY3JpcHRpb246ICdTaG93cyB0b3BvbG9neSAoYmx1ZXByaW50IG9yIGRlcGxveW1lbnQpJyxcbiAgICBpbml0aWFsV2lkdGg6IDgsXG4gICAgaW5pdGlhbEhlaWdodDogNCxcbiAgICBjb2xvcjogXCJ5ZWxsb3dcIixcbiAgICBpc1JlYWN0OiB0cnVlLFxuICAgIGluaXRpYWxDb25maWd1cmF0aW9uOiBbXG4gICAgICAgIHtpZDogJ2VuYWJsZU5vZGVDbGljaycsIG5hbWU6ICdFbmFibGUgbm9kZSBjbGljaycgLHBsYWNlSG9sZGVyOlwidHJ1ZSBvZiBmYWxzZVwiLCBkZWZhdWx0OlwidHJ1ZVwifSxcbiAgICAgICAge2lkOiAnZW5hYmxlR3JvdXBDbGljaycsIG5hbWU6ICdFbmFibGUgZ3JvdXAgY2xpY2snICxwbGFjZUhvbGRlcjpcInRydWUgb2YgZmFsc2VcIiwgZGVmYXVsdDpcInRydWVcIn0sXG4gICAgICAgIHtpZDogJ2VuYWJsZVpvb20nLCBuYW1lOiAnRW5hYmxlIHpvb20nICxwbGFjZUhvbGRlcjpcInRydWUgb2YgZmFsc2VcIiwgZGVmYXVsdDpcInRydWVcIn0sXG4gICAgICAgIHtpZDogJ2VuYWJsZURyYWcnLCBuYW1lOiAnRW5hYmxlIGRyYWcnICxwbGFjZUhvbGRlcjpcInRydWUgb2YgZmFsc2VcIiwgZGVmYXVsdDpcInRydWVcIn0sXG4gICAgICAgIHtpZDogJ3Nob3dUb29sYmFyJywgbmFtZTogJ1Nob3cgdG9vbGJhcicgLHBsYWNlSG9sZGVyOlwidHJ1ZSBvZiBmYWxzZVwiLCBkZWZhdWx0OlwidHJ1ZVwifVxuICAgIF0sXG5cbiAgICBmZXRjaERhdGE6IGZ1bmN0aW9uKHBsdWdpbixjb250ZXh0LHBsdWdpblV0aWxzKSB7XG4gICAgICAgIHZhciBkZXBsb3ltZW50SWQgPSBjb250ZXh0LmdldFZhbHVlKCdkZXBsb3ltZW50SWQnKTtcbiAgICAgICAgdmFyIGJsdWVwcmludElkID0gY29udGV4dC5nZXRWYWx1ZSgnYmx1ZXByaW50SWQnKTtcblxuICAgICAgICBpZiAoXy5pc0VtcHR5KGRlcGxveW1lbnRJZCkgJiYgXy5pc0VtcHR5KGJsdWVwcmludElkKSkge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7fSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGVwbG95bWVudElkKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHt9KTtcbiAgICAgICAgfSBlbHNlIGlmIChibHVlcHJpbnRJZCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAocmVzb2x2ZSxyZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBwbHVnaW5VdGlscy5qUXVlcnkuZ2V0KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBjb250ZXh0LmdldE1hbmFnZXJVcmwoKSArICcvYXBpL3YyLjEvYmx1ZXByaW50cz9pZD0nK2JsdWVwcmludElkLFxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmRvbmUoKGJsdWVwcmludCk9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGJsdWVwcmludClcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmZhaWwocmVqZWN0KVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlbmRlcjogZnVuY3Rpb24od2lkZ2V0LGRhdGEsZXJyb3IsY29udGV4dCxwbHVnaW5VdGlscykge1xuICAgICAgICBpZiAoIXdpZGdldC5wbHVnaW4udGVtcGxhdGUpIHtcbiAgICAgICAgICAgIHJldHVybiAnVG9wb2xvZ3k6IG1pc3NpbmcgdGVtcGxhdGUnO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB2YXIgdG9wb2xvZ3lDb25maWcgPSB7XG4gICAgICAgICAgICBlbmFibGVOb2RlQ2xpY2s6IGdldENvbmZpZyh3aWRnZXQuY29uZmlndXJhdGlvbiwnZW5hYmxlTm9kZUNsaWNrJyksXG4gICAgICAgICAgICBlbmFibGVHcm91cENsaWNrOiBnZXRDb25maWcod2lkZ2V0LmNvbmZpZ3VyYXRpb24sJ2VuYWJsZUdyb3VwQ2xpY2snKSxcbiAgICAgICAgICAgIGVuYWJsZVpvb206IGdldENvbmZpZyh3aWRnZXQuY29uZmlndXJhdGlvbiwnZW5hYmxlWm9vbScpLFxuICAgICAgICAgICAgZW5hYmxlRHJhZzogZ2V0Q29uZmlnKHdpZGdldC5jb25maWd1cmF0aW9uLCdlbmFibGVEcmFnJyksXG4gICAgICAgICAgICBzaG93VG9vbGJhcjogZ2V0Q29uZmlnKHdpZGdldC5jb25maWd1cmF0aW9uLCdzaG93VG9vbGJhcicpXG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHRvcG9sb2d5VGVtcGxhdGUgPSBfLnRlbXBsYXRlKHdpZGdldC5wbHVnaW4udGVtcGxhdGUpKHRvcG9sb2d5Q29uZmlnKTtcbiAgICAgICAgdmFyIGRlcGxveW1lbnRJZCA9IGNvbnRleHQuZ2V0VmFsdWUoJ2RlcGxveW1lbnRJZCcpO1xuICAgICAgICB2YXIgYmx1ZXByaW50SWQgPSBjb250ZXh0LmdldFZhbHVlKCdibHVlcHJpbnRJZCcpO1xuXG4gICAgICAgIHZhciBmb3JtYXR0ZWREYXRhID0gT2JqZWN0LmFzc2lnbih7fSxkYXRhLHtcbiAgICAgICAgICAgIGRlcGxveW1lbnRJZCxcbiAgICAgICAgICAgIGJsdWVwcmludElkLFxuICAgICAgICAgICAgdG9wb2xvZ3lDb25maWdcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiA8VG9wb2xvZ3kgdGVtcGxhdGU9e3RvcG9sb2d5VGVtcGxhdGV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgd2lkZ2V0PXt3aWRnZXR9IGRhdGE9e2Zvcm1hdHRlZERhdGF9IGNvbnRleHQ9e2NvbnRleHR9IHV0aWxzPXtwbHVnaW5VdGlsc30vPjtcblxuICAgIH1cblxufSk7Il19
