(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ExecuteWorkflow = require('./ExecuteWorkflow');

var _ExecuteWorkflow2 = _interopRequireDefault(_ExecuteWorkflow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by kinneretzin on 18/10/2016.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var _class = function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class(props, context) {
        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props, context));

        _this.state = {
            confirmDelete: false
        };
        return _this;
    }

    _createClass(_class, [{
        key: '_selectDeployment',
        value: function _selectDeployment(item) {
            this.props.context.setValue('deploymentId', item.id);
            this.props.context.drillDown(this.props.widget, 'deployment');
        }
    }, {
        key: '_deleteDeploymentConfirm',
        value: function _deleteDeploymentConfirm(item, event) {
            event.stopPropagation();

            this.setState({
                confirmDelete: true,
                item: item
            });
        }
    }, {
        key: '_deleteDeployment',
        value: function _deleteDeployment() {
            if (!this.state.item) {
                this.setState({ error: 'Something went wrong, no deployment was selected for delete' });
                return;
            }

            var thi$ = this;
            $.ajax({
                url: thi$.props.context.getManagerUrl() + '/api/v2.1/deployments/' + this.state.item.id,
                "headers": { "content-type": "application/json" },
                method: 'delete'
            }).done(function () {
                thi$.setState({ confirmDelete: false });
                thi$.props.context.getEventBus().trigger('deployments:refresh');
            }).fail(function (jqXHR, textStatus, errorThrown) {
                thi$.setState({ confirmDelete: false });
                thi$.setState({ error: jqXHR.responseJSON && jqXHR.responseJSON.message ? jqXHR.responseJSON.message : errorThrown });
            });
        }
    }, {
        key: '_refreshData',
        value: function _refreshData() {
            this.props.context.refresh();
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.props.context.getEventBus().on('deployments:refresh', this._refreshData, this);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.props.context.getEventBus().off('deployments:refresh', this._refreshData);
        }
    }, {
        key: '_initDropdown',
        value: function _initDropdown(dropdown) {
            var thi$ = this;
            $(dropdown).dropdown({
                onChange: function onChange(value, text, $choice) {
                    thi$.props.context.setValue('filterDep' + thi$.props.widget.id, value);
                }
            });

            var filter = this.props.context.getValue('filterDep' + this.props.widget.id);
            if (filter) {
                $(dropdown).dropdown('set selected', filter);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var Confirm = Stage.Basic.Confirm;

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
                    null,
                    React.createElement(
                        'div',
                        { className: 'ui selection dropdown fluid', ref: this._initDropdown.bind(this) },
                        React.createElement('input', { type: 'hidden', name: 'statusFilter' }),
                        React.createElement(
                            'div',
                            { className: 'default text' },
                            'Filter by status'
                        ),
                        React.createElement('i', { className: 'dropdown icon' }),
                        React.createElement(
                            'div',
                            { className: 'menu' },
                            React.createElement(
                                'div',
                                { className: 'item', 'data-value': 'ok' },
                                React.createElement('i', { className: 'check circle icon inverted green' }),
                                'OK'
                            ),
                            React.createElement(
                                'div',
                                { className: 'item', 'data-value': 'error' },
                                React.createElement('i', { className: 'remove circle icon inverted red' }),
                                'Error'
                            )
                        )
                    )
                ),
                React.createElement(
                    'table',
                    { className: 'ui very compact table deploymentTable' },
                    React.createElement(
                        'thead',
                        null,
                        React.createElement(
                            'tr',
                            null,
                            React.createElement(
                                'th',
                                null,
                                'Name'
                            ),
                            React.createElement(
                                'th',
                                null,
                                'Blueprint'
                            ),
                            React.createElement(
                                'th',
                                null,
                                'Created'
                            ),
                            React.createElement(
                                'th',
                                null,
                                'Updated'
                            ),
                            React.createElement(
                                'th',
                                null,
                                'Status'
                            ),
                            React.createElement('th', null)
                        )
                    ),
                    React.createElement(
                        'tbody',
                        null,
                        this.props.data.items.map(function (item) {
                            return React.createElement(
                                'tr',
                                { key: item.id, className: 'row', onClick: _this2._selectDeployment.bind(_this2, item) },
                                React.createElement(
                                    'td',
                                    null,
                                    React.createElement(
                                        'div',
                                        null,
                                        React.createElement(
                                            'a',
                                            { className: 'deploymentName', href: 'javascript:void(0)' },
                                            item.id
                                        )
                                    )
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    item.blueprint_id
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    item.created_at
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    item.updated_at
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    item.status === 'ok' ? React.createElement('i', { className: 'check circle icon inverted green' }) : React.createElement('i', { className: 'remove circle icon inverted red' })
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    React.createElement(
                                        'div',
                                        { className: 'rowActions' },
                                        React.createElement(_ExecuteWorkflow2.default, { item: item }),
                                        React.createElement('i', { className: 'write icon link bordered', title: 'Edit deployment' }),
                                        React.createElement('i', { className: 'trash icon link bordered', title: 'Delete deployment', onClick: _this2._deleteDeploymentConfirm.bind(_this2, item) })
                                    )
                                )
                            );
                        })
                    )
                ),
                React.createElement(Confirm, { title: 'Are you sure you want to remove this deployment?',
                    show: this.state.confirmDelete,
                    onConfirm: this._deleteDeployment.bind(this),
                    onCancel: function onCancel() {
                        return _this2.setState({ confirmDelete: false });
                    } })
            );
        }
    }]);

    return _class;
}(React.Component);

exports.default = _class;

},{"./ExecuteWorkflow":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by kinneretzin on 19/10/2016.
 */

var _class = function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class(props, context) {
        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props, context));

        _this.state = {};
        return _this;
    }

    _createClass(_class, [{
        key: "render",
        value: function render() {
            return React.createElement("i", { className: "road icon link bordered", title: "Execute workflow" });
        }
    }]);

    return _class;
}(React.Component);

exports.default = _class;

},{}],3:[function(require,module,exports){
'use strict';

var _DeploymentsTable = require('./DeploymentsTable');

var _DeploymentsTable2 = _interopRequireDefault(_DeploymentsTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Stage.addPlugin({
    id: "deployments",
    name: 'Blueprint deployments',
    description: 'blah blah blah',
    initialWidth: 8,
    initialHeight: 6,
    color: "purple",
    fetchUrl: '[manager]/api/v2.1/deployments',
    isReact: true,

    render: function render(widget, data, error, context, pluginUtils) {

        if (!data) {
            return pluginUtils.renderReactLoading();
        }

        if (error) {
            return pluginUtils.renderReactError(error);
        }

        var formattedData = Object.assign({}, data);
        var blueprintId = context.getValue('blueprintId');
        var filter = context.getValue('filterDep' + widget.id);
        if (blueprintId) {
            formattedData.items = _.filter(data.items, { blueprint_id: blueprintId });
        }
        formattedData = Object.assign({}, formattedData, {
            items: _.map(formattedData.items, function (item) {
                return Object.assign({}, item, {
                    created_at: pluginUtils.moment(item.created_at, 'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'), //2016-07-20 09:10:53.103579
                    updated_at: pluginUtils.moment(item.updated_at, 'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'),
                    status: item.status || 'ok'
                });
            })
        });

        if (filter) {
            formattedData.items = _.filter(formattedData.items, { status: filter });
        }

        formattedData.blueprintId = blueprintId;

        return React.createElement(
            'div',
            null,
            React.createElement(_DeploymentsTable2.default, { widget: widget, data: formattedData, context: context, utils: pluginUtils })
        );
    }
}); /**
     * Created by kinneretzin on 07/09/2016.
     */

},{"./DeploymentsTable":1}]},{},[1,3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwbHVnaW5zL2RlcGxveW1lbnRzL3NyYy9EZXBsb3ltZW50c1RhYmxlLmpzIiwicGx1Z2lucy9kZXBsb3ltZW50cy9zcmMvRXhlY3V0ZVdvcmtmbG93LmpzIiwicGx1Z2lucy9kZXBsb3ltZW50cy9zcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUNJQTs7Ozs7Ozs7OzsrZUFKQTs7Ozs7OztBQU9JLG9CQUFZLEtBQVosRUFBa0IsT0FBbEIsRUFBMkI7QUFBQTs7QUFBQSxvSEFDakIsS0FEaUIsRUFDWCxPQURXOztBQUd2QixjQUFLLEtBQUwsR0FBYTtBQUNULDJCQUFjO0FBREwsU0FBYjtBQUh1QjtBQU0xQjs7OzswQ0FFaUIsSSxFQUFNO0FBQ3BCLGlCQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLFFBQW5CLENBQTRCLGNBQTVCLEVBQTJDLEtBQUssRUFBaEQ7QUFDQSxpQkFBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixTQUFuQixDQUE2QixLQUFLLEtBQUwsQ0FBVyxNQUF4QyxFQUErQyxZQUEvQztBQUNIOzs7aURBRXdCLEksRUFBSyxLLEVBQU07QUFDaEMsa0JBQU0sZUFBTjs7QUFFQSxpQkFBSyxRQUFMLENBQWM7QUFDViwrQkFBZ0IsSUFETjtBQUVWLHNCQUFNO0FBRkksYUFBZDtBQUlIOzs7NENBRW1CO0FBQ2hCLGdCQUFJLENBQUMsS0FBSyxLQUFMLENBQVcsSUFBaEIsRUFBc0I7QUFDbEIscUJBQUssUUFBTCxDQUFjLEVBQUMsT0FBTyw2REFBUixFQUFkO0FBQ0E7QUFDSDs7QUFFRCxnQkFBSSxPQUFPLElBQVg7QUFDQSxjQUFFLElBQUYsQ0FBTztBQUNILHFCQUFLLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsYUFBbkIsS0FBcUMsd0JBQXJDLEdBQThELEtBQUssS0FBTCxDQUFXLElB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QixRQUFRLE1BQTFCLEVBQWtDLE1BQU0sYUFBeEMsRUFBdUQsU0FBUyxPQUFoRSxFQUF5RSxPQUFPLFdBQWhGO0FBREosU0FESjtBQUtIO0FBaERXLENBQWhCLEUsQ0FOQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENyZWF0ZWQgYnkga2lubmVyZXR6aW4gb24gMTgvMTAvMjAxNi5cbiAqL1xuXG5pbXBvcnQgRXhlY3V0ZVdvcmtmbG93IGZyb20gJy4vRXhlY3V0ZVdvcmtmbG93JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzLGNvbnRleHQpIHtcbiAgICAgICAgc3VwZXIocHJvcHMsY29udGV4dCk7XG5cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIGNvbmZpcm1EZWxldGU6ZmFsc2VcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9zZWxlY3REZXBsb3ltZW50KGl0ZW0pIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LnNldFZhbHVlKCdkZXBsb3ltZW50SWQnLGl0ZW0uaWQpO1xuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQuZHJpbGxEb3duKHRoaXMucHJvcHMud2lkZ2V0LCdkZXBsb3ltZW50Jyk7XG4gICAgfVxuXG4gICAgX2RlbGV0ZURlcGxveW1lbnRDb25maXJtKGl0ZW0sZXZlbnQpe1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGNvbmZpcm1EZWxldGUgOiB0cnVlLFxuICAgICAgICAgICAgaXRlbTogaXRlbVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBfZGVsZXRlRGVwbG95bWVudCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLml0ZW0pIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2Vycm9yOiAnU29tZXRoaW5nIHdlbnQgd3JvbmcsIG5vIGRlcGxveW1lbnQgd2FzIHNlbGVjdGVkIGZvciBkZWxldGUnfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdGhpJCA9IHRoaXM7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IHRoaSQucHJvcHMuY29udGV4dC5nZXRNYW5hZ2VyVXJsKCkgKyAnL2FwaS92Mi4xL2RlcGxveW1lbnRzLycrdGhpcy5zdGF0ZS5pdGVtLmlkLFxuICAgICAgICAgICAgXCJoZWFkZXJzXCI6IHtcImNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIn0sXG4gICAgICAgICAgICBtZXRob2Q6ICdkZWxldGUnXG4gICAgICAgIH0pXG4gICAgICAgICAgICAuZG9uZSgoKT0+IHtcbiAgICAgICAgICAgICAgICB0aGkkLnNldFN0YXRlKHtjb25maXJtRGVsZXRlOiBmYWxzZX0pO1xuICAgICAgICAgICAgICAgIHRoaSQucHJvcHMuY29udGV4dC5nZXRFdmVudEJ1cygpLnRyaWdnZXIoJ2RlcGxveW1lbnRzOnJlZnJlc2gnKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKT0+e1xuICAgICAgICAgICAgICAgIHRoaSQuc2V0U3RhdGUoe2NvbmZpcm1EZWxldGU6IGZhbHNlfSk7XG4gICAgICAgICAgICAgICAgdGhpJC5zZXRTdGF0ZSh7ZXJyb3I6IChqcVhIUi5yZXNwb25zZUpTT04gJiYganFYSFIucmVzcG9uc2VKU09OLm1lc3NhZ2UgPyBqcVhIUi5yZXNwb25zZUpTT04ubWVzc2FnZSA6IGVycm9yVGhyb3duKX0pXG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBfcmVmcmVzaERhdGEoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5yZWZyZXNoKCk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5nZXRFdmVudEJ1cygpLm9uKCdkZXBsb3ltZW50czpyZWZyZXNoJyx0aGlzLl9yZWZyZXNoRGF0YSx0aGlzKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LmdldEV2ZW50QnVzKCkub2ZmKCdkZXBsb3ltZW50czpyZWZyZXNoJyx0aGlzLl9yZWZyZXNoRGF0YSk7XG4gICAgfVxuXG4gICAgX2luaXREcm9wZG93bihkcm9wZG93bikge1xuICAgICAgICB2YXIgdGhpJCA9IHRoaXM7XG4gICAgICAgICQoZHJvcGRvd24pLmRyb3Bkb3duKHtcbiAgICAgICAgICAgIG9uQ2hhbmdlOiAodmFsdWUsIHRleHQsICRjaG9pY2UpID0+IHtcbiAgICAgICAgICAgICAgICB0aGkkLnByb3BzLmNvbnRleHQuc2V0VmFsdWUoJ2ZpbHRlckRlcCcrdGhpJC5wcm9wcy53aWRnZXQuaWQsdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgZmlsdGVyID0gdGhpcy5wcm9wcy5jb250ZXh0LmdldFZhbHVlKCdmaWx0ZXJEZXAnK3RoaXMucHJvcHMud2lkZ2V0LmlkKTtcbiAgICAgICAgaWYgKGZpbHRlcikge1xuICAgICAgICAgICAgJChkcm9wZG93bikuZHJvcGRvd24oJ3NldCBzZWxlY3RlZCcsZmlsdGVyKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHZhciBDb25maXJtID0gU3RhZ2UuQmFzaWMuQ29uZmlybTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuZXJyb3IgP1xuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBlcnJvciBtZXNzYWdlXCIgc3R5bGU9e3tcImRpc3BsYXlcIjpcImJsb2NrXCJ9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhlYWRlclwiPkVycm9yIE9jY3VyZWQ8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD57dGhpcy5zdGF0ZS5lcnJvcn08L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICcnXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBzZWxlY3Rpb24gZHJvcGRvd24gZmx1aWRcIiByZWY9e3RoaXMuX2luaXREcm9wZG93bi5iaW5kKHRoaXMpfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cInN0YXR1c0ZpbHRlclwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVmYXVsdCB0ZXh0XCI+RmlsdGVyIGJ5IHN0YXR1czwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZHJvcGRvd24gaWNvblwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVudVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaXRlbVwiIGRhdGEtdmFsdWU9XCJva1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJjaGVjayBjaXJjbGUgaWNvbiBpbnZlcnRlZCBncmVlblwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT0tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIml0ZW1cIiBkYXRhLXZhbHVlPVwiZXJyb3JcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwicmVtb3ZlIGNpcmNsZSBpY29uIGludmVydGVkIHJlZFwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRXJyb3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJ1aSB2ZXJ5IGNvbXBhY3QgdGFibGUgZGVwbG95bWVudFRhYmxlXCI+XG4gICAgICAgICAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk5hbWU8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkJsdWVwcmludDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+Q3JlYXRlZDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+VXBkYXRlZDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+U3RhdHVzPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aC8+XG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5kYXRhLml0ZW1zLm1hcCgoaXRlbSk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHIga2V5PXtpdGVtLmlkfSBjbGFzc05hbWU9J3Jvdycgb25DbGljaz17dGhpcy5fc2VsZWN0RGVwbG95bWVudC5iaW5kKHRoaXMsaXRlbSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT0nZGVwbG95bWVudE5hbWUnIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj57aXRlbS5pZH08L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPntpdGVtLmJsdWVwcmludF9pZH08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPntpdGVtLmNyZWF0ZWRfYXR9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57aXRlbS51cGRhdGVkX2F0fTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBpdGVtLnN0YXR1cyA9PT0gJ29rJyA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImNoZWNrIGNpcmNsZSBpY29uIGludmVydGVkIGdyZWVuXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cInJlbW92ZSBjaXJjbGUgaWNvbiBpbnZlcnRlZCByZWRcIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93QWN0aW9uc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8RXhlY3V0ZVdvcmtmbG93IGl0ZW09e2l0ZW19Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwid3JpdGUgaWNvbiBsaW5rIGJvcmRlcmVkXCIgdGl0bGU9XCJFZGl0IGRlcGxveW1lbnRcIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cInRyYXNoIGljb24gbGluayBib3JkZXJlZFwiIHRpdGxlPVwiRGVsZXRlIGRlcGxveW1lbnRcIiBvbkNsaWNrPXt0aGlzLl9kZWxldGVEZXBsb3ltZW50Q29uZmlybS5iaW5kKHRoaXMsaXRlbSl9PjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgICAgIDxDb25maXJtIHRpdGxlPSdBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcmVtb3ZlIHRoaXMgZGVwbG95bWVudD8nXG4gICAgICAgICAgICAgICAgICAgICAgICAgc2hvdz17dGhpcy5zdGF0ZS5jb25maXJtRGVsZXRlfVxuICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ29uZmlybT17dGhpcy5fZGVsZXRlRGVwbG95bWVudC5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2FuY2VsPXsoKT0+dGhpcy5zZXRTdGF0ZSh7Y29uZmlybURlbGV0ZSA6IGZhbHNlfSl9IC8+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICApO1xuICAgIH1cbn1cbiIsIi8qKlxuICogQ3JlYXRlZCBieSBraW5uZXJldHppbiBvbiAxOS8xMC8yMDE2LlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcyxjb250ZXh0KSB7XG4gICAgICAgIHN1cGVyKHByb3BzLGNvbnRleHQpO1xuXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXIgKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwicm9hZCBpY29uIGxpbmsgYm9yZGVyZWRcIiB0aXRsZT1cIkV4ZWN1dGUgd29ya2Zsb3dcIj48L2k+XG4gICAgICAgICk7XG4gICAgfVxufVxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGtpbm5lcmV0emluIG9uIDA3LzA5LzIwMTYuXG4gKi9cblxuaW1wb3J0IERlcGxveW1lbnRzVGFibGUgZnJvbSAnLi9EZXBsb3ltZW50c1RhYmxlJztcblxuU3RhZ2UuYWRkUGx1Z2luKHtcbiAgICBpZDogXCJkZXBsb3ltZW50c1wiLFxuICAgIG5hbWU6ICdCbHVlcHJpbnQgZGVwbG95bWVudHMnLFxuICAgIGRlc2NyaXB0aW9uOiAnYmxhaCBibGFoIGJsYWgnLFxuICAgIGluaXRpYWxXaWR0aDogOCxcbiAgICBpbml0aWFsSGVpZ2h0OiA2LFxuICAgIGNvbG9yIDogXCJwdXJwbGVcIixcbiAgICBmZXRjaFVybDogJ1ttYW5hZ2VyXS9hcGkvdjIuMS9kZXBsb3ltZW50cycsXG4gICAgaW5pdGlhbENvbmZpZ3VyYXRpb246IHtmaWx0ZXJfYnk6IFwiXCJ9LFxuICAgIGlzUmVhY3Q6IHRydWUsXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKHdpZGdldCxkYXRhLGVycm9yLGNvbnRleHQscGx1Z2luVXRpbHMpIHtcblxuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiBwbHVnaW5VdGlscy5yZW5kZXJSZWFjdExvYWRpbmcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIHBsdWdpblV0aWxzLnJlbmRlclJlYWN0RXJyb3IoZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZvcm1hdHRlZERhdGEgPSBPYmplY3QuYXNzaWduKHt9LGRhdGEpO1xuICAgICAgICB2YXIgYmx1ZXByaW50SWQgPSBjb250ZXh0LmdldFZhbHVlKCdibHVlcHJpbnRJZCcpO1xuICAgICAgICB2YXIgZmlsdGVyID0gY29udGV4dC5nZXRWYWx1ZSgnZmlsdGVyRGVwJyt3aWRnZXQuaWQpO1xuICAgICAgICBpZiAoYmx1ZXByaW50SWQpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZERhdGEuaXRlbXMgPSBfLmZpbHRlcihkYXRhLml0ZW1zLHtibHVlcHJpbnRfaWQ6Ymx1ZXByaW50SWR9KTtcbiAgICAgICAgfVxuICAgICAgICBmb3JtYXR0ZWREYXRhID0gT2JqZWN0LmFzc2lnbih7fSxmb3JtYXR0ZWREYXRhLHtcbiAgICAgICAgICAgIGl0ZW1zOiBfLm1hcCAoZm9ybWF0dGVkRGF0YS5pdGVtcywoaXRlbSk9PntcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSxpdGVtLHtcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlZF9hdDogcGx1Z2luVXRpbHMubW9tZW50KGl0ZW0uY3JlYXRlZF9hdCwnWVlZWS1NTS1ERCBISDptbTpzcy5TU1NTUycpLmZvcm1hdCgnREQtTU0tWVlZWSBISDptbScpLCAvLzIwMTYtMDctMjAgMDk6MTA6NTMuMTAzNTc5XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZWRfYXQ6IHBsdWdpblV0aWxzLm1vbWVudChpdGVtLnVwZGF0ZWRfYXQsJ1lZWVktTU0tREQgSEg6bW06c3MuU1NTU1MnKS5mb3JtYXQoJ0RELU1NLVlZWVkgSEg6bW0nKSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBpdGVtLnN0YXR1cyB8fCAnb2snXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChmaWx0ZXIpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZERhdGEuaXRlbXMgPSBfLmZpbHRlcihmb3JtYXR0ZWREYXRhLml0ZW1zLHtzdGF0dXM6ZmlsdGVyfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3JtYXR0ZWREYXRhLmJsdWVwcmludElkID0gYmx1ZXByaW50SWQ7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPERlcGxveW1lbnRzVGFibGUgd2lkZ2V0PXt3aWRnZXR9IGRhdGE9e2Zvcm1hdHRlZERhdGF9IGNvbnRleHQ9e2NvbnRleHR9IHV0aWxzPXtwbHVnaW5VdGlsc30vPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufSk7XG4iXX0=
