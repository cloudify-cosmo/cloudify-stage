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

            var FilterByExecutionsConfig = this.props.widget.configuration ? _.find(this.props.widget.configuration, { id: 'FilterByExecutions' }) : {};
            var shouldShowExecutionsFilter = FilterByExecutionsConfig && FilterByExecutionsConfig.value === 'true';
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
                        shouldShowExecutionsFilter ? React.createElement(
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
                        ) : ''
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
    initialWidth: 12,
    initialHeight: 1,
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

},{"./DataFetcher":1,"./ExecutionFilter":2}]},{},[1,2,3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwbHVnaW5zL2V4ZWN1dGlvbkZpbHRlci9zcmMvRGF0YUZldGNoZXIuanMiLCJwbHVnaW5zL2V4ZWN1dGlvbkZpbHRlci9zcmMvRXhlY3V0aW9uRmlsdGVyLmpzIiwicGx1Z2lucy9leGVjdXRpb25GaWx0ZXIvc3JjL3dpZGdldC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7QUNBQTs7OztJQUlxQixXOzs7Ozs7OzhCQUNKLFUsRUFBWTtBQUNyQixtQkFBTyxRQUFRLEdBQVIsQ0FBWSxDQUNmLEtBQUssZUFBTCxDQUFxQixVQUFyQixDQURlLEVBRWYsS0FBSyxnQkFBTCxDQUFzQixVQUF0QixDQUZlLEVBR2YsS0FBSyxlQUFMLENBQXFCLFVBQXJCLENBSGUsQ0FBWixFQUlKLElBSkksQ0FJRSxnQkFBTTtBQUNYLHVCQUFPLFFBQVEsT0FBUixDQUFnQjtBQUNuQixnQ0FBWSxLQUFLLENBQUwsQ0FETztBQUVuQixpQ0FBYSxLQUFLLENBQUwsQ0FGTTtBQUduQixnQ0FBWSxLQUFLLENBQUw7QUFITyxpQkFBaEIsQ0FBUDtBQUtILGFBVk0sQ0FBUDtBQVdIOzs7d0NBRXNCLFUsRUFBWTtBQUMvQixtQkFBTyxJQUFJLE9BQUosQ0FBYSxVQUFDLE9BQUQsRUFBUyxNQUFULEVBQW9CO0FBQ3BDLGtCQUFFLEdBQUYsQ0FBTTtBQUNGLHlCQUFLLGFBQWEsa0NBRGhCO0FBRUYsOEJBQVU7QUFGUixpQkFBTixFQUdHLElBSEgsQ0FHUSxPQUhSLEVBR2lCLElBSGpCLENBR3NCLE1BSHRCO0FBSUgsYUFMTSxDQUFQO0FBT0g7Ozt5Q0FFdUIsVSxFQUFZO0FBQ2hDLG1CQUFPLElBQUksT0FBSixDQUFhLFVBQUMsT0FBRCxFQUFTLE1BQVQsRUFBb0I7QUFDcEMsa0JBQUUsR0FBRixDQUFNO0FBQ0YseUJBQUssYUFBYSxnREFEaEI7QUFFRiw4QkFBVTtBQUZSLGlCQUFOLEVB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Q29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ3JlYXRlZCBieSBraW5uZXJldHppbiBvbiAyNy8xMC8yMDE2LlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERhdGFGZXRjaGVye1xuICAgIHN0YXRpYyBmZXRjaChtYW5hZ2VyVXJsKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICB0aGlzLmZldGNoQmx1ZXByaW50cyhtYW5hZ2VyVXJsKSxcbiAgICAgICAgICAgIHRoaXMuZmV0Y2hEZXBsb3ltZW50cyhtYW5hZ2VyVXJsKSxcbiAgICAgICAgICAgIHRoaXMuZmV0Y2hFeGVjdXRpb25zKG1hbmFnZXJVcmwpXG4gICAgICAgIF0pLnRoZW4oIGRhdGE9PntcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe1xuICAgICAgICAgICAgICAgIGJsdWVwcmludHM6IGRhdGFbMF0sXG4gICAgICAgICAgICAgICAgZGVwbG95bWVudHM6IGRhdGFbMV0sXG4gICAgICAgICAgICAgICAgZXhlY3V0aW9uczogZGF0YVsyXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgc3RhdGljIGZldGNoQmx1ZXByaW50cyhtYW5hZ2VyVXJsKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUscmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAkLmdldCh7XG4gICAgICAgICAgICAgICAgdXJsOiBtYW5hZ2VyVXJsICsgJy9hcGkvdjIuMS9ibHVlcHJpbnRzP19pbmNsdWRlPWlkJyxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgICAgICAgICB9KS5kb25lKHJlc29sdmUpLmZhaWwocmVqZWN0KTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBzdGF0aWMgZmV0Y2hEZXBsb3ltZW50cyhtYW5hZ2VyVXJsKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUscmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAkLmdldCh7XG4gICAgICAgICAgICAgICAgdXJsOiBtYW5hZ2VyVXJsICsgJy9hcGkvdjIuMS9kZXBsb3ltZW50cz9faW5jbHVkZT1pZCxibHVlcHJpbnRfaWQnLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICAgICAgICAgIH0pLmRvbmUocmVzb2x2ZSkuZmFpbChyZWplY3QpXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHN0YXRpYyBmZXRjaEV4ZWN1dGlvbnMobWFuYWdlclVybCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIChyZXNvbHZlLHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgJC5nZXQoe1xuICAgICAgICAgICAgICAgIHVybDogbWFuYWdlclVybCArICcvYXBpL3YyLjEvZXhlY3V0aW9ucz9faW5jbHVkZT1pZCxibHVlcHJpbnRfaWQsZGVwbG95bWVudF9pZCx3b3JrZmxvd19pZCcsXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJ1xuICAgICAgICAgICAgfSkuZG9uZShyZXNvbHZlKS5mYWlsKHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsIi8qKlxuICogQ3JlYXRlZCBieSBraW5uZXJldHppbiBvbiAyNy8xMC8yMDE2LlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV4ZWN1dGlvbkZpbHRlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcbiAgICAgICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xuXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfcmVmcmVzaERhdGEoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5yZWZyZXNoKCk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5nZXRFdmVudEJ1cygpLm9uKCdibHVlcHJpbnRzOnJlZnJlc2gnLCB0aGlzLl9yZWZyZXNoRGF0YSwgdGhpcyk7XG4gICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5nZXRFdmVudEJ1cygpLm9uKCdkZXBsb3ltZW50czpyZWZyZXNoJywgdGhpcy5fcmVmcmVzaERhdGEsIHRoaXMpO1xuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQuZ2V0RXZlbnRCdXMoKS5vbignZXhlY3V0aW9uczpyZWZyZXNoJywgdGhpcy5fcmVmcmVzaERhdGEsIHRoaXMpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQuZ2V0RXZlbnRCdXMoKS5vZmYoJ2JsdWVwcmludHM6cmVmcmVzaCcsIHRoaXMuX3JlZnJlc2hEYXRhKTtcbiAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LmdldEV2ZW50QnVzKCkub2ZmKCdkZXBsb3ltZW50czpyZWZyZXNoJywgdGhpcy5fcmVmcmVzaERhdGEpO1xuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQuZ2V0RXZlbnRCdXMoKS5vZmYoJ2V4ZWN1dGlvbnM6cmVmcmVzaCcsIHRoaXMuX3JlZnJlc2hEYXRhKTtcbiAgICB9XG5cblxuICAgIC8vX3NlbGVjdEV2ZW50KGl0ZW0pIHtcbiAgICAvLyAgICB2YXIgb2xkU2VsZWN0ZWRFdmVudElkID0gdGhpcy5wcm9wcy5jb250ZXh0LmdldFZhbHVlKCdldmVudElkJyk7XG4gICAgLy8gICAgdGhpcy5wcm9wcy5jb250ZXh0LnNldFZhbHVlKCdldmVudElkJyxpdGVtLmlkID09PSBvbGRTZWxlY3RlZEV2ZW50SWQgPyBudWxsIDogaXRlbS5pZCk7XG4gICAgLy99XG5cbiAgICBfc2VsZWN0Qmx1ZXByaW50KGJsdWVwcmludElkKXsgLy92YWx1ZSx0ZXh0LCRjaG9pc2UpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LnNldFZhbHVlKCdibHVlcHJpbnRJZCcsYmx1ZXByaW50SWQpO1xuICAgIH1cblxuICAgIF9zZWxlY3REZXBsb3ltZW50KGRlcGxveW1lbnRJZCkge1xuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQuc2V0VmFsdWUoJ2RlcGxveW1lbnRJZCcsZGVwbG95bWVudElkKTtcbiAgICB9XG5cbiAgICBfc2VsZWN0RXhlY3V0aW9uKGV4ZWN1dGlvbklkKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5zZXRWYWx1ZSgnZXhlY3V0aW9uSWQnLGV4ZWN1dGlvbklkKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHZhciBGaWx0ZXJCeUV4ZWN1dGlvbnNDb25maWcgPSB0aGlzLnByb3BzLndpZGdldC5jb25maWd1cmF0aW9uID8gXy5maW5kKHRoaXMucHJvcHMud2lkZ2V0LmNvbmZpZ3VyYXRpb24se2lkOidGaWx0ZXJCeUV4ZWN1dGlvbnMnfSkgOiB7fTtcbiAgICAgICAgdmFyIHNob3VsZFNob3dFeGVjdXRpb25zRmlsdGVyID0gRmlsdGVyQnlFeGVjdXRpb25zQ29uZmlnICYmIEZpbHRlckJ5RXhlY3V0aW9uc0NvbmZpZy52YWx1ZSA9PT0gJ3RydWUnO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuZXJyb3IgP1xuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBlcnJvciBtZXNzYWdlXCIgc3R5bGU9e3tcImRpc3BsYXlcIjpcImJsb2NrXCJ9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhlYWRlclwiPkVycm9yIE9jY3VyZWQ8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD57dGhpcy5zdGF0ZS5lcnJvcn08L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICcnXG4gICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIGVxdWFsIHdpZHRoIGZvcm1cIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2ZpZWxkcyc+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZmllbGQnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgc2VhcmNoIHNlbGVjdGlvbiBkcm9wZG93blwiIHJlZj17KHNlbGVjdCk9PiQoc2VsZWN0KS5kcm9wZG93bih7b25DaGFuZ2U6IHRoaXMuX3NlbGVjdEJsdWVwcmludC5iaW5kKHRoaXMpfSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJibHVlcHJpbnRcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImRyb3Bkb3duIGljb25cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVmYXVsdCB0ZXh0XCI+U2VsZWN0IEJsdWVwcmludDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lbnVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdpdGVtJyBkYXRhLXZhbHVlPVwiXCI+U2VsZWN0IEJsdWVwcmludDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuZGF0YS5ibHVlcHJpbnRzLml0ZW1zLm1hcCgoYmx1ZXByaW50KT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gPGRpdiBrZXk9e2JsdWVwcmludC5pZH0gY2xhc3NOYW1lPVwiaXRlbVwiIGRhdGEtdmFsdWU9e2JsdWVwcmludC5pZH0+e2JsdWVwcmludC5pZH08L2Rpdj47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdmaWVsZCc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBzZWFyY2ggc2VsZWN0aW9uIGRyb3Bkb3duXCIgcmVmPXsoc2VsZWN0KT0+JChzZWxlY3QpLmRyb3Bkb3duKHtvbkNoYW5nZTogdGhpcy5fc2VsZWN0RGVwbG95bWVudC5iaW5kKHRoaXMpfSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJkZXBsb3ltZW50XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJkcm9wZG93biBpY29uXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlZmF1bHQgdGV4dFwiPlNlbGVjdCBEZXBsb3ltZW50PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVudVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2l0ZW0nIGRhdGEtdmFsdWU9XCJcIj5TZWxlY3QgRGVwbG95bWVudDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuZGF0YS5kZXBsb3ltZW50cy5pdGVtcy5tYXAoKGRlcGxveW1lbnQpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiA8ZGl2IGtleT17ZGVwbG95bWVudC5pZH0gY2xhc3NOYW1lPVwiaXRlbVwiIGRhdGEtdmFsdWU9e2RlcGxveW1lbnQuaWR9PntkZXBsb3ltZW50LmlkfTwvZGl2PjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3VsZFNob3dFeGVjdXRpb25zRmlsdGVyID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2ZpZWxkJz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgc2VhcmNoIHNlbGVjdGlvbiBkcm9wZG93blwiIHJlZj17KHNlbGVjdCk9PiQoc2VsZWN0KS5kcm9wZG93bih7b25DaGFuZ2U6IHRoaXMuX3NlbGVjdEV4ZWN1dGlvbi5iaW5kKHRoaXMpfSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImRlcGxveW1lbnRcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZHJvcGRvd24gaWNvblwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlZmF1bHQgdGV4dFwiPlNlbGVjdCBFeGVjdXRpb248L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lbnVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2l0ZW0nIGRhdGEtdmFsdWU9XCJcIj5TZWxlY3QgRXhlY3V0aW9uPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuZGF0YS5leGVjdXRpb25zLml0ZW1zLm1hcCgoZXhlY3V0aW9uKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiA8ZGl2IGtleT17ZXhlY3V0aW9uLmlkfSBjbGFzc05hbWU9XCJpdGVtXCIgZGF0YS12YWx1ZT17ZXhlY3V0aW9uLmlkfT57ZXhlY3V0aW9uLmlkICsgJy0nICsgZXhlY3V0aW9uLndvcmtmbG93X2lkfTwvZGl2PjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cblxuXG5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn0iLCIvKipcbiAqIENyZWF0ZWQgYnkga2lubmVyZXR6aW4gb24gMDcvMDkvMjAxNi5cbiAqL1xuXG5pbXBvcnQgRGF0YUZldGNoZXIgZnJvbSAnLi9EYXRhRmV0Y2hlcic7XG5pbXBvcnQgRXhlY3V0aW9uRmlsdGVyIGZyb20gJy4vRXhlY3V0aW9uRmlsdGVyJztcblxuU3RhZ2UuYWRkUGx1Z2luKHtcbiAgICBpZDogJ2V4ZWN1dGlvbkZpbHRlcicsXG4gICAgbmFtZTogXCJFeGVjdXRpb24gRmlsdGVyc1wiLFxuICAgIGRlc2NyaXB0aW9uOiAnQWRkcyBhIGZpbHRlciBzZWN0aW9uIGZvciBleGVjdXRpb25zIGxpc3QnLFxuICAgIGluaXRpYWxXaWR0aDogMTIsXG4gICAgaW5pdGlhbEhlaWdodDogMSxcbiAgICBjb2xvcjogXCJ5ZWxsb3dcIixcbiAgICBzaG93SGVhZGVyOiBmYWxzZSxcbiAgICBzaG93Qm9yZGVyOiBmYWxzZSxcbiAgICBmZXRjaERhdGE6IGZ1bmN0aW9uKHBsdWdpbixjb250ZXh0LHBsdWdpblV0aWxzKSB7XG4gICAgICAgIHJldHVybiBEYXRhRmV0Y2hlci5mZXRjaChjb250ZXh0LmdldE1hbmFnZXJVcmwoKSk7XG4gICAgfSxcblxuICAgIGlzUmVhY3Q6IHRydWUsXG4gICAgaW5pdGlhbENvbmZpZ3VyYXRpb246XG4gICAgICAgIFtcbiAgICAgICAgICAgIHtpZDogXCJGaWx0ZXJCeUV4ZWN1dGlvbnNcIixuYW1lOiBcIlNob3VsZCBzaG93IGV4ZWN1dGlvbiBmaWx0ZXJcIiwgcGxhY2VIb2xkZXI6IFwiVHJ1ZSBvZiBmYWxzZSBpZiB0byBzaG93IGV4ZWN1dGlvbiBmaWx0ZXIgYXMgd2VsbFwiLCBkZWZhdWx0OiBcInRydWVcIn1cbiAgICAgICAgXSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24od2lkZ2V0LGRhdGEsZXJyb3IsY29udGV4dCxwbHVnaW5VdGlscykge1xuICAgICAgICBpZiAoXy5pc0VtcHR5KGRhdGEpKSB7XG4gICAgICAgICAgICByZXR1cm4gcGx1Z2luVXRpbHMucmVuZGVyUmVhY3RMb2FkaW5nKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBwbHVnaW5VdGlscy5yZW5kZXJSZWFjdEVycm9yKGVycm9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8RXhlY3V0aW9uRmlsdGVyIHdpZGdldD17d2lkZ2V0fSBkYXRhPXtkYXRhfSBjb250ZXh0PXtjb250ZXh0fSB1dGlscz17cGx1Z2luVXRpbHN9Lz5cbiAgICAgICAgKTtcblxuICAgIH1cbn0pOyJdfQ==
