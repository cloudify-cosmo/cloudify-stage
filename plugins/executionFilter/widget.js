(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by kinneretzin on 27/10/2016.
 */

var DataFetcher = function () {
    function DataFetcher() {
        _classCallCheck(this, DataFetcher);
    }

    _createClass(DataFetcher, null, [{
        key: 'fetch',
        value: function fetch(managerUrl) {
            return Promise.all([this.fetchBlueprints(managerUrl), this.fetchDeployments(managerUrl), this.fetchExecutions(managerUrl)]).then(function (data) {
                return Promise.resolve({
                    blueprints: data[0],
                    deployments: data[1],
                    executions: data[2]
                });
            });
        }
    }, {
        key: 'fetchBlueprints',
        value: function fetchBlueprints(managerUrl) {
            return new Promise(function (resolve, reject) {
                $.get({
                    url: managerUrl + '/api/v2.1/blueprints?_include=id',
                    dataType: 'json'
                }).done(resolve).fail(reject);
            });
        }
    }, {
        key: 'fetchDeployments',
        value: function fetchDeployments(managerUrl) {
            return new Promise(function (resolve, reject) {
                $.get({
                    url: managerUrl + '/api/v2.1/deployments?_include=id,blueprint_id',
                    dataType: 'json'
                }).done(resolve).fail(reject);
            });
        }
    }, {
        key: 'fetchExecutions',
        value: function fetchExecutions(managerUrl) {
            return new Promise(function (resolve, reject) {
                $.get({
                    url: managerUrl + '/api/v2.1/executions?_include=id,blueprint_id,deployment_id,workflow_id',
                    dataType: 'json'
                }).done(resolve).fail(reject);
            });
        }
    }]);

    return DataFetcher;
}();

exports.default = DataFetcher;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by kinneretzin on 27/10/2016.
 */

var ExecutionFilter = function (_React$Component) {
    _inherits(ExecutionFilter, _React$Component);

    function ExecutionFilter(props, context) {
        _classCallCheck(this, ExecutionFilter);

        var _this = _possibleConstructorReturn(this, (ExecutionFilter.__proto__ || Object.getPrototypeOf(ExecutionFilter)).call(this, props, context));

        _this.state = {};
        return _this;
    }

    _createClass(ExecutionFilter, [{
        key: '_refreshData',
        value: function _refreshData() {
            this.props.context.refresh();
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.props.context.getEventBus().on('blueprints:refresh', this._refreshData, this);
            this.props.context.getEventBus().on('deployments:refresh', this._refreshData, this);
            this.props.context.getEventBus().on('executions:refresh', this._refreshData, this);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.props.context.getEventBus().off('blueprints:refresh', this._refreshData);
            this.props.context.getEventBus().off('deployments:refresh', this._refreshData);
            this.props.context.getEventBus().off('executions:refresh', this._refreshData);
        }

        //_selectEvent(item) {
        //    var oldSelectedEventId = this.props.context.getValue('eventId');
        //    this.props.context.setValue('eventId',item.id === oldSelectedEventId ? null : item.id);
        //}

    }, {
        key: '_selectBlueprint',
        value: function _selectBlueprint(blueprintId) {
            //value,text,$choise) {
            this.props.context.setValue('blueprintId', blueprintId);
        }
    }, {
        key: '_selectDeployment',
        value: function _selectDeployment(deploymentId) {
            this.props.context.setValue('deploymentId', deploymentId);
        }
    }, {
        key: '_selectExecution',
        value: function _selectExecution(executionId) {
            this.props.context.setValue('executionId', executionId);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            return React.createElement(
                'div',
                null,
                this.state.error ? React.createElement(
                    'div',
                    { className: 'ui error message', style: { "display": "block" } },
                    React.createElement(
                        'div',
                        { className: 'header' },
                        'Error Occured'
                    ),
                    React.createElement(
                        'p',
                        null,
                        this.state.error
                    )
                ) : '',
                React.createElement(
                    'div',
                    { className: 'ui equal width form' },
                    React.createElement(
                        'div',
                        { className: 'fields' },
                        React.createElement(
                            'div',
                            { className: 'field' },
                            React.createElement(
                                'div',
                                { className: 'ui search selection dropdown', ref: function ref(select) {
                                        return $(select).dropdown({ onChange: _this2._selectBlueprint.bind(_this2) });
                                    } },
                                React.createElement('input', { type: 'hidden', name: 'blueprint' }),
                                React.createElement('i', { className: 'dropdown icon' }),
                                React.createElement(
                                    'div',
                                    { className: 'default text' },
                                    'Select Blueprint'
                                ),
                                React.createElement(
                                    'div',
                                    { className: 'menu' },
                                    React.createElement(
                                        'div',
                                        { className: 'item', 'data-value': '' },
                                        'Select Blueprint'
                                    ),
                                    this.props.data.blueprints.items.map(function (blueprint) {
                                        return React.createElement(
                                            'div',
                                            { key: blueprint.id, className: 'item', 'data-value': blueprint.id },
                                            blueprint.id
                                        );
                                    })
                                )
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'field' },
                            React.createElement(
                                'div',
                                { className: 'ui search selection dropdown', ref: function ref(select) {
                                        return $(select).dropdown({ onChange: _this2._selectDeployment.bind(_this2) });
                                    } },
                                React.createElement('input', { type: 'hidden', name: 'deployment' }),
                                React.createElement('i', { className: 'dropdown icon' }),
                                React.createElement(
                                    'div',
                                    { className: 'default text' },
                                    'Select Deployment'
                                ),
                                React.createElement(
                                    'div',
                                    { className: 'menu' },
                                    React.createElement(
                                        'div',
                                        { className: 'item', 'data-value': '' },
                                        'Select Deployment'
                                    ),
                                    this.props.data.deployments.items.map(function (deployment) {
                                        return React.createElement(
                                            'div',
                                            { key: deployment.id, className: 'item', 'data-value': deployment.id },
                                            deployment.id
                                        );
                                    })
                                )
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'field' },
                            React.createElement(
                                'div',
                                { className: 'ui search selection dropdown', ref: function ref(select) {
                                        return $(select).dropdown({ onChange: _this2._selectExecution.bind(_this2) });
                                    } },
                                React.createElement('input', { type: 'hidden', name: 'deployment' }),
                                React.createElement('i', { className: 'dropdown icon' }),
                                React.createElement(
                                    'div',
                                    { className: 'default text' },
                                    'Select Execution'
                                ),
                                React.createElement(
                                    'div',
                                    { className: 'menu' },
                                    React.createElement(
                                        'div',
                                        { className: 'item', 'data-value': '' },
                                        'Select Execution'
                                    ),
                                    this.props.data.executions.items.map(function (execution) {
                                        return React.createElement(
                                            'div',
                                            { key: execution.id, className: 'item', 'data-value': execution.id },
                                            execution.id + '-' + execution.workflow_id
                                        );
                                    })
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return ExecutionFilter;
}(React.Component);

exports.default = ExecutionFilter;

},{}],3:[function(require,module,exports){
'use strict';

var _DataFetcher = require('./DataFetcher');

var _DataFetcher2 = _interopRequireDefault(_DataFetcher);

var _ExecutionFilter = require('./ExecutionFilter');

var _ExecutionFilter2 = _interopRequireDefault(_ExecutionFilter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by kinneretzin on 07/09/2016.
 */

Stage.addPlugin({
    id: 'executionFilter',
    name: "Execution Filters",
    description: 'Adds a filter section for executions list',
    initialWidth: 5,
    initialHeight: 4,
    color: "yellow",
    showHeader: false,
    showBorder: false,
    fetchData: function fetchData(plugin, context, pluginUtils) {
        return _DataFetcher2.default.fetch(context.getManagerUrl());
    },

    isReact: true,
    initialConfiguration: [{ id: "FilterByExecutions", name: "Should show execution filter", placeHolder: "True of false if to show execution filter as well", default: "true" }],

    render: function render(widget, data, error, context, pluginUtils) {
        if (_.isEmpty(data)) {
            return pluginUtils.renderReactLoading();
        }

        if (error) {
            return pluginUtils.renderReactError(error);
        }

        return React.createElement(_ExecutionFilter2.default, { widget: widget, data: data, context: context, utils: pluginUtils });
    }
});

},{"./DataFetcher":1,"./ExecutionFilter":2}]},{},[1,3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwbHVnaW5zL2V4ZWN1dGlvbkZpbHRlci9zcmMvRGF0YUZldGNoZXIuanMiLCJwbHVnaW5zL2V4ZWN1dGlvbkZpbHRlci9zcmMvRXhlY3V0aW9uRmlsdGVyLmpzIiwicGx1Z2lucy9leGVjdXRpb25GaWx0ZXIvc3JjL3dpZGdldC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7QUNBQTs7OztJQUlxQixXOzs7Ozs7OzhCQUNKLFUsRUFBWTtBQUNyQixtQkFBTyxRQUFRLEdBQVIsQ0FBWSxDQUNmLEtBQUssZUFBTCxDQUFxQixVQUFyQixDQURlLEVBRWYsS0FBSyxnQkFBTCxDQUFzQixVQUF0QixDQUZlLEVBR2YsS0FBSyxlQUFMLENBQXFCLFVBQXJCLENBSGUsQ0FBWixFQUlKLElBSkksQ0FJRSxnQkFBTTtBQUNYLHVCQUFPLFFBQVEsT0FBUixDQUFnQjtBQUNuQixnQ0FBWSxLQUFLLENBQUwsQ0FETztBQUVuQixpQ0FBYSxLQUFLLENBQUwsQ0FGTTtBQUduQixnQ0FBWSxLQUFLLENBQUw7QUFITyxpQkFBaEIsQ0FBUDtBQUtILGFBVk0sQ0FBUDtBQVdIOzs7d0NBRXNCLFUsRUFBWTtBQUMvQixtQkFBTyxJQUFJLE9BQUosQ0FBYSxVQUFDLE9BQUQsRUFBUyxNQUFULEVBQW9CO0FBQ3BDLGtCQUFFLEdBQUYsQ0FBTTtBQUNGLHlCQUFLLGFBQWEsa0NBRGhCO0FBRUYsOEJBQVU7QUFGUixpQkFBTixFQUdHLElBSEgsQ0FHUSxPQUhSLEVBR2lCLElBSGpCLENBR3NCLE1BSHRCO0FBSUgsYUFMTSxDQUFQO0FBT0g7Ozt5Q0FFdUIsVSxFQUFZO0FBQ2hDLG1CQUFPLElBQUksT0FBSixDQUFhLFVBQUMsT0FBRCxFQUFTLE1BQVQsRUFBb0I7QUFDcEMsa0JBQUUsR0FBRixDQUFNO0FBQ0YseUJBQUssYUFBYSxnREFEaEI7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SSxpQkFEUTtBQUVaLFVBQU0sbUJBRk07QUFHWixpQkFBYSwyQ0FIRDtBQUlaLGtCQUFjLENBSkY7QUFLWixtQkFBZSxDQUxIO0FBTVosV0FBTyxRQU5LO0FBT1osZ0JBQVksS0FQQTtBQVFaLGdCQUFZLEtBUkE7QUFTWixlQUFXLG1CQUFTLE1BQVQsRUFBZ0IsT0FBaEIsRUFBd0IsV0FBeEIsRUFBcUM7QUFDNUMsZUFBTyxzQkFBWSxLQUFaLENBQWtCLFFBQVEsYUFBUixFQUFsQixDQUFQO0FBQ0gsS0FYVzs7QUFhWixhQUFTLElBYkc7QUFjWiwwQkFDSSxDQUNJLEVBQUMsSUFBSSxvQkFBTCxFQUEwQixNQUFNLDhCQUFoQyxFQUFnRSxhQUFhLG1EQUE3RSxFQUFrSSxTQUFTLE1BQTNJLEVBREosQ0FmUTs7QUFtQlosWUFBUSxnQkFBUyxNQUFULEVBQWdCLElBQWhCLEVBQXFCLEtBQXJCLEVBQTJCLE9BQTNCLEVBQW1DLFdBQW5DLEVBQWdEO0FBQ3BELFlBQUksRUFBRSxPQUFGLENBQVUsSUFBVixDQUFKLEVBQXFCO0FBQ2pCLG1CQUFPLFlBQVksa0JBQVosRUFBUDtBQUNIOztBQUVELFlBQUksS0FBSixFQUFXO0FBQ1AsbUJBQU8sWUFBWSxnQkFBWixDQUE2QixLQUE3QixDQUFQO0FBQ0g7O0FBRUQsZUFDSSxpREFBaUIsUUFBUSxNQUF6QixFQUFpQyxNQUFNLElBQXZDLEVBQTZDLFNBQVMsT0FBdEQsRUFBK0QsT0FBTyxXQUF0RSxHQURKO0FBSUg7QUFoQ1csQ0FBaEIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGtpbm5lcmV0emluIG9uIDI3LzEwLzIwMTYuXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGF0YUZldGNoZXJ7XG4gICAgc3RhdGljIGZldGNoKG1hbmFnZXJVcmwpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgIHRoaXMuZmV0Y2hCbHVlcHJpbnRzKG1hbmFnZXJVcmwpLFxuICAgICAgICAgICAgdGhpcy5mZXRjaERlcGxveW1lbnRzKG1hbmFnZXJVcmwpLFxuICAgICAgICAgICAgdGhpcy5mZXRjaEV4ZWN1dGlvbnMobWFuYWdlclVybClcbiAgICAgICAgXSkudGhlbiggZGF0YT0+e1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgYmx1ZXByaW50czogZGF0YVswXSxcbiAgICAgICAgICAgICAgICBkZXBsb3ltZW50czogZGF0YVsxXSxcbiAgICAgICAgICAgICAgICBleGVjdXRpb25zOiBkYXRhWzJdXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBzdGF0aWMgZmV0Y2hCbHVlcHJpbnRzKG1hbmFnZXJVcmwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAocmVzb2x2ZSxyZWplY3QpID0+IHtcbiAgICAgICAgICAgICQuZ2V0KHtcbiAgICAgICAgICAgICAgICB1cmw6IG1hbmFnZXJVcmwgKyAnL2FwaS92Mi4xL2JsdWVwcmludHM/X2luY2x1ZGU9aWQnLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICAgICAgICAgIH0pLmRvbmUocmVzb2x2ZSkuZmFpbChyZWplY3QpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIHN0YXRpYyBmZXRjaERlcGxveW1lbnRzKG1hbmFnZXJVcmwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAocmVzb2x2ZSxyZWplY3QpID0+IHtcbiAgICAgICAgICAgICQuZ2V0KHtcbiAgICAgICAgICAgICAgICB1cmw6IG1hbmFnZXJVcmwgKyAnL2FwaS92Mi4xL2RlcGxveW1lbnRzP19pbmNsdWRlPWlkLGJsdWVwcmludF9pZCcsXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJ1xuICAgICAgICAgICAgfSkuZG9uZShyZXNvbHZlKS5mYWlsKHJlamVjdClcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGZldGNoRXhlY3V0aW9ucyhtYW5hZ2VyVXJsKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUscmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAkLmdldCh7XG4gICAgICAgICAgICAgICAgdXJsOiBtYW5hZ2VyVXJsICsgJy9hcGkvdjIuMS9leGVjdXRpb25zP19pbmNsdWRlPWlkLGJsdWVwcmludF9pZCxkZXBsb3ltZW50X2lkLHdvcmtmbG93X2lkJyxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgICAgICAgICB9KS5kb25lKHJlc29sdmUpLmZhaWwocmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGtpbm5lcmV0emluIG9uIDI3LzEwLzIwMTYuXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXhlY3V0aW9uRmlsdGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xuICAgICAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XG5cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9yZWZyZXNoRGF0YSgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LnJlZnJlc2goKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LmdldEV2ZW50QnVzKCkub24oJ2JsdWVwcmludHM6cmVmcmVzaCcsIHRoaXMuX3JlZnJlc2hEYXRhLCB0aGlzKTtcbiAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LmdldEV2ZW50QnVzKCkub24oJ2RlcGxveW1lbnRzOnJlZnJlc2gnLCB0aGlzLl9yZWZyZXNoRGF0YSwgdGhpcyk7XG4gICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5nZXRFdmVudEJ1cygpLm9uKCdleGVjdXRpb25zOnJlZnJlc2gnLCB0aGlzLl9yZWZyZXNoRGF0YSwgdGhpcyk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5nZXRFdmVudEJ1cygpLm9mZignYmx1ZXByaW50czpyZWZyZXNoJywgdGhpcy5fcmVmcmVzaERhdGEpO1xuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQuZ2V0RXZlbnRCdXMoKS5vZmYoJ2RlcGxveW1lbnRzOnJlZnJlc2gnLCB0aGlzLl9yZWZyZXNoRGF0YSk7XG4gICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5nZXRFdmVudEJ1cygpLm9mZignZXhlY3V0aW9uczpyZWZyZXNoJywgdGhpcy5fcmVmcmVzaERhdGEpO1xuICAgIH1cblxuXG4gICAgLy9fc2VsZWN0RXZlbnQoaXRlbSkge1xuICAgIC8vICAgIHZhciBvbGRTZWxlY3RlZEV2ZW50SWQgPSB0aGlzLnByb3BzLmNvbnRleHQuZ2V0VmFsdWUoJ2V2ZW50SWQnKTtcbiAgICAvLyAgICB0aGlzLnByb3BzLmNvbnRleHQuc2V0VmFsdWUoJ2V2ZW50SWQnLGl0ZW0uaWQgPT09IG9sZFNlbGVjdGVkRXZlbnRJZCA/IG51bGwgOiBpdGVtLmlkKTtcbiAgICAvL31cblxuICAgIF9zZWxlY3RCbHVlcHJpbnQoYmx1ZXByaW50SWQpeyAvL3ZhbHVlLHRleHQsJGNob2lzZSkge1xuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQuc2V0VmFsdWUoJ2JsdWVwcmludElkJyxibHVlcHJpbnRJZCk7XG4gICAgfVxuXG4gICAgX3NlbGVjdERlcGxveW1lbnQoZGVwbG95bWVudElkKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5zZXRWYWx1ZSgnZGVwbG95bWVudElkJyxkZXBsb3ltZW50SWQpO1xuICAgIH1cblxuICAgIF9zZWxlY3RFeGVjdXRpb24oZXhlY3V0aW9uSWQpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LnNldFZhbHVlKCdleGVjdXRpb25JZCcsZXhlY3V0aW9uSWQpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmVycm9yID9cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgZXJyb3IgbWVzc2FnZVwiIHN0eWxlPXt7XCJkaXNwbGF5XCI6XCJibG9ja1wifX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoZWFkZXJcIj5FcnJvciBPY2N1cmVkPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+e3RoaXMuc3RhdGUuZXJyb3J9PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgICAgICAnJ1xuICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBlcXVhbCB3aWR0aCBmb3JtXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdmaWVsZHMnPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2ZpZWxkJz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIHNlYXJjaCBzZWxlY3Rpb24gZHJvcGRvd25cIiByZWY9eyhzZWxlY3QpPT4kKHNlbGVjdCkuZHJvcGRvd24oe29uQ2hhbmdlOiB0aGlzLl9zZWxlY3RCbHVlcHJpbnQuYmluZCh0aGlzKX0pfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiYmx1ZXByaW50XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJkcm9wZG93biBpY29uXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlZmF1bHQgdGV4dFwiPlNlbGVjdCBCbHVlcHJpbnQ8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZW51XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0naXRlbScgZGF0YS12YWx1ZT1cIlwiPlNlbGVjdCBCbHVlcHJpbnQ8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmRhdGEuYmx1ZXByaW50cy5pdGVtcy5tYXAoKGJsdWVwcmludCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDxkaXYga2V5PXtibHVlcHJpbnQuaWR9IGNsYXNzTmFtZT1cIml0ZW1cIiBkYXRhLXZhbHVlPXtibHVlcHJpbnQuaWR9PntibHVlcHJpbnQuaWR9PC9kaXY+O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZmllbGQnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgc2VhcmNoIHNlbGVjdGlvbiBkcm9wZG93blwiIHJlZj17KHNlbGVjdCk9PiQoc2VsZWN0KS5kcm9wZG93bih7b25DaGFuZ2U6IHRoaXMuX3NlbGVjdERlcGxveW1lbnQuYmluZCh0aGlzKX0pfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiZGVwbG95bWVudFwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZHJvcGRvd24gaWNvblwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZWZhdWx0IHRleHRcIj5TZWxlY3QgRGVwbG95bWVudDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lbnVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdpdGVtJyBkYXRhLXZhbHVlPVwiXCI+U2VsZWN0IERlcGxveW1lbnQ8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmRhdGEuZGVwbG95bWVudHMuaXRlbXMubWFwKChkZXBsb3ltZW50KT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gPGRpdiBrZXk9e2RlcGxveW1lbnQuaWR9IGNsYXNzTmFtZT1cIml0ZW1cIiBkYXRhLXZhbHVlPXtkZXBsb3ltZW50LmlkfT57ZGVwbG95bWVudC5pZH08L2Rpdj47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdmaWVsZCc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBzZWFyY2ggc2VsZWN0aW9uIGRyb3Bkb3duXCIgcmVmPXsoc2VsZWN0KT0+JChzZWxlY3QpLmRyb3Bkb3duKHtvbkNoYW5nZTogdGhpcy5fc2VsZWN0RXhlY3V0aW9uLmJpbmQodGhpcyl9KX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImRlcGxveW1lbnRcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImRyb3Bkb3duIGljb25cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVmYXVsdCB0ZXh0XCI+U2VsZWN0IEV4ZWN1dGlvbjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lbnVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdpdGVtJyBkYXRhLXZhbHVlPVwiXCI+U2VsZWN0IEV4ZWN1dGlvbjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuZGF0YS5leGVjdXRpb25zLml0ZW1zLm1hcCgoZXhlY3V0aW9uKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gPGRpdiBrZXk9e2V4ZWN1dGlvbi5pZH0gY2xhc3NOYW1lPVwiaXRlbVwiIGRhdGEtdmFsdWU9e2V4ZWN1dGlvbi5pZH0+e2V4ZWN1dGlvbi5pZCArICctJyArIGV4ZWN1dGlvbi53b3JrZmxvd19pZH08L2Rpdj47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cblxuXG5cblxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufSIsIi8qKlxuICogQ3JlYXRlZCBieSBraW5uZXJldHppbiBvbiAwNy8wOS8yMDE2LlxuICovXG5cbmltcG9ydCBEYXRhRmV0Y2hlciBmcm9tICcuL0RhdGFGZXRjaGVyJztcbmltcG9ydCBFeGVjdXRpb25GaWx0ZXIgZnJvbSAnLi9FeGVjdXRpb25GaWx0ZXInO1xuXG5TdGFnZS5hZGRQbHVnaW4oe1xuICAgIGlkOiAnZXhlY3V0aW9uRmlsdGVyJyxcbiAgICBuYW1lOiBcIkV4ZWN1dGlvbiBGaWx0ZXJzXCIsXG4gICAgZGVzY3JpcHRpb246ICdBZGRzIGEgZmlsdGVyIHNlY3Rpb24gZm9yIGV4ZWN1dGlvbnMgbGlzdCcsXG4gICAgaW5pdGlhbFdpZHRoOiA1LFxuICAgIGluaXRpYWxIZWlnaHQ6IDQsXG4gICAgY29sb3I6IFwieWVsbG93XCIsXG4gICAgc2hvd0hlYWRlcjogZmFsc2UsXG4gICAgc2hvd0JvcmRlcjogZmFsc2UsXG4gICAgZmV0Y2hEYXRhOiBmdW5jdGlvbihwbHVnaW4sY29udGV4dCxwbHVnaW5VdGlscykge1xuICAgICAgICByZXR1cm4gRGF0YUZldGNoZXIuZmV0Y2goY29udGV4dC5nZXRNYW5hZ2VyVXJsKCkpO1xuICAgIH0sXG5cbiAgICBpc1JlYWN0OiB0cnVlLFxuICAgIGluaXRpYWxDb25maWd1cmF0aW9uOlxuICAgICAgICBbXG4gICAgICAgICAgICB7aWQ6IFwiRmlsdGVyQnlFeGVjdXRpb25zXCIsbmFtZTogXCJTaG91bGQgc2hvdyBleGVjdXRpb24gZmlsdGVyXCIsIHBsYWNlSG9sZGVyOiBcIlRydWUgb2YgZmFsc2UgaWYgdG8gc2hvdyBleGVjdXRpb24gZmlsdGVyIGFzIHdlbGxcIiwgZGVmYXVsdDogXCJ0cnVlXCJ9XG4gICAgICAgIF0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKHdpZGdldCxkYXRhLGVycm9yLGNvbnRleHQscGx1Z2luVXRpbHMpIHtcbiAgICAgICAgaWYgKF8uaXNFbXB0eShkYXRhKSkge1xuICAgICAgICAgICAgcmV0dXJuIHBsdWdpblV0aWxzLnJlbmRlclJlYWN0TG9hZGluZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gcGx1Z2luVXRpbHMucmVuZGVyUmVhY3RFcnJvcihlcnJvcik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPEV4ZWN1dGlvbkZpbHRlciB3aWRnZXQ9e3dpZGdldH0gZGF0YT17ZGF0YX0gY29udGV4dD17Y29udGV4dH0gdXRpbHM9e3BsdWdpblV0aWxzfS8+XG4gICAgICAgICk7XG5cbiAgICB9XG59KTsiXX0=
