(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
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

            //var thi$ = this;
            //$.ajax({
            //    url: thi$.props.context.getManagerUrl() + '/api/v2.1/blueprints/'+this.state.item.id,
            //    "headers": {"content-type": "application/json"},
            //    method: 'delete'
            //})
            //    .done(()=> {
            //        thi$.setState({confirmDelete: false});
            //        thi$.props.context.getEventBus().trigger('blueprints:refresh');
            //    })
            //    .fail((jqXHR, textStatus, errorThrown)=>{
            //        thi$.setState({confirmDelete: false});
            //        thi$.setState({error: (jqXHR.responseJSON && jqXHR.responseJSON.message ? jqXHR.responseJSON.message : errorThrown)})
            //    });
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
                                        React.createElement('i', { className: 'road icon link bordered', title: 'Execute workflow' }),
                                        React.createElement('i', { className: 'write icon link bordered', title: 'Edit deployment' }),
                                        React.createElement('i', { className: 'trash icon link bordered', title: 'Delete deployment', onClick: _this2._deleteDeploymentConfirm.bind(_this2, item) })
                                    )
                                )
                            );
                        })
                    )
                ),
                React.createElement(Confirm, { title: 'Are you sure you want to remove this blueprint?',
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

},{}],2:[function(require,module,exports){
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
    initialConfiguration: { filterBy: "" },
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

},{"./DeploymentsTable":1}]},{},[1,2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwbHVnaW5zL2RlcGxveW1lbnRzL3NyYy9EZXBsb3ltZW50c1RhYmxlLmpzIiwicGx1Z2lucy9kZXBsb3ltZW50cy9zcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7OztBQUtJLG9CQUFZLEtBQVosRUFBa0IsT0FBbEIsRUFBMkI7QUFBQTs7QUFBQSxvSEFDakIsS0FEaUIsRUFDWCxPQURXOztBQUd2QixjQUFLLEtBQUwsR0FBYTtBQUNULDJCQUFjO0FBREwsU0FBYjtBQUh1QjtBQU0xQjs7OzswQ0FFaUIsSSxFQUFNO0FBQ3BCLGlCQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLFFBQW5CLENBQTRCLGNBQTVCLEVBQTJDLEtBQUssRUFBaEQ7QUFDQSxpQkFBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixTQUFuQixDQUE2QixLQUFLLEtBQUwsQ0FBVyxNQUF4QyxFQUErQyxZQUEvQztBQUNIOzs7aURBRXdCLEksRUFBSyxLLEVBQU07QUFDaEMsa0JBQU0sZUFBTjs7QUFFQSxpQkFBSyxRQUFMLENBQWM7QUFDViwrQkFBZ0IsSUFETjtBQUVWLHNCQUFNO0FBRkksYUFBZDtBQUlIOzs7NENBRW1CO0FBQ2hCLGdCQUFJLENBQUMsS0FBSyxLQUFMLENBQVcsSUFBaEIsRUFBc0I7QUFDbEIscUJBQUssUUFBTCxDQUFjLEVBQUMsT0FBTyw2REFBUixFQUFkO0FBQ0E7QUFDSDs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7Ozt1Q0FFYztBQUNYLGlCQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLE9BQW5CO0FBQ0g7Ozs0Q0FFbUI7QUFDaEIsaUJBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsV0FBbkIs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Qjs7QUFVQSxZQUFJLE1BQUosRUFBWTtBQUNSLDBCQUFjLEtBQWQsR0FBc0IsRUFBRSxNQUFGLENBQVMsY0FBYyxLQUF2QixFQUE2QixFQUFDLFFBQU8sTUFBUixFQUE3QixDQUF0QjtBQUNIOztBQUVELHNCQUFjLFdBQWQsR0FBNEIsV0FBNUI7O0FBRUEsZUFDSTtBQUFBO0FBQUE7QUFDSSw4REFBa0IsUUFBUSxNQUExQixFQUFrQyxNQUFNLGFBQXhDLEVBQXVELFNBQVMsT0FBaEUsRUFBeUUsT0FBTyxXQUFoRjtBQURKLFNBREo7QUFLSDtBQWhEVyxDQUFoQixFLENBTkEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGtpbm5lcmV0emluIG9uIDE4LzEwLzIwMTYuXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzLGNvbnRleHQpIHtcbiAgICAgICAgc3VwZXIocHJvcHMsY29udGV4dCk7XG5cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIGNvbmZpcm1EZWxldGU6ZmFsc2VcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9zZWxlY3REZXBsb3ltZW50KGl0ZW0pIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LnNldFZhbHVlKCdkZXBsb3ltZW50SWQnLGl0ZW0uaWQpO1xuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQuZHJpbGxEb3duKHRoaXMucHJvcHMud2lkZ2V0LCdkZXBsb3ltZW50Jyk7XG4gICAgfVxuXG4gICAgX2RlbGV0ZURlcGxveW1lbnRDb25maXJtKGl0ZW0sZXZlbnQpe1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGNvbmZpcm1EZWxldGUgOiB0cnVlLFxuICAgICAgICAgICAgaXRlbTogaXRlbVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBfZGVsZXRlRGVwbG95bWVudCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLml0ZW0pIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2Vycm9yOiAnU29tZXRoaW5nIHdlbnQgd3JvbmcsIG5vIGRlcGxveW1lbnQgd2FzIHNlbGVjdGVkIGZvciBkZWxldGUnfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvL3ZhciB0aGkkID0gdGhpcztcbiAgICAgICAgLy8kLmFqYXgoe1xuICAgICAgICAvLyAgICB1cmw6IHRoaSQucHJvcHMuY29udGV4dC5nZXRNYW5hZ2VyVXJsKCkgKyAnL2FwaS92Mi4xL2JsdWVwcmludHMvJyt0aGlzLnN0YXRlLml0ZW0uaWQsXG4gICAgICAgIC8vICAgIFwiaGVhZGVyc1wiOiB7XCJjb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJ9LFxuICAgICAgICAvLyAgICBtZXRob2Q6ICdkZWxldGUnXG4gICAgICAgIC8vfSlcbiAgICAgICAgLy8gICAgLmRvbmUoKCk9PiB7XG4gICAgICAgIC8vICAgICAgICB0aGkkLnNldFN0YXRlKHtjb25maXJtRGVsZXRlOiBmYWxzZX0pO1xuICAgICAgICAvLyAgICAgICAgdGhpJC5wcm9wcy5jb250ZXh0LmdldEV2ZW50QnVzKCkudHJpZ2dlcignYmx1ZXByaW50czpyZWZyZXNoJyk7XG4gICAgICAgIC8vICAgIH0pXG4gICAgICAgIC8vICAgIC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pPT57XG4gICAgICAgIC8vICAgICAgICB0aGkkLnNldFN0YXRlKHtjb25maXJtRGVsZXRlOiBmYWxzZX0pO1xuICAgICAgICAvLyAgICAgICAgdGhpJC5zZXRTdGF0ZSh7ZXJyb3I6IChqcVhIUi5yZXNwb25zZUpTT04gJiYganFYSFIucmVzcG9uc2VKU09OLm1lc3NhZ2UgPyBqcVhIUi5yZXNwb25zZUpTT04ubWVzc2FnZSA6IGVycm9yVGhyb3duKX0pXG4gICAgICAgIC8vICAgIH0pO1xuICAgIH1cblxuICAgIF9yZWZyZXNoRGF0YSgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LnJlZnJlc2goKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LmdldEV2ZW50QnVzKCkub24oJ2RlcGxveW1lbnRzOnJlZnJlc2gnLHRoaXMuX3JlZnJlc2hEYXRhLHRoaXMpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQuZ2V0RXZlbnRCdXMoKS5vZmYoJ2RlcGxveW1lbnRzOnJlZnJlc2gnLHRoaXMuX3JlZnJlc2hEYXRhKTtcbiAgICB9XG5cbiAgICBfaW5pdERyb3Bkb3duKGRyb3Bkb3duKSB7XG4gICAgICAgIHZhciB0aGkkID0gdGhpcztcbiAgICAgICAgJChkcm9wZG93bikuZHJvcGRvd24oe1xuICAgICAgICAgICAgb25DaGFuZ2U6ICh2YWx1ZSwgdGV4dCwgJGNob2ljZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaSQucHJvcHMuY29udGV4dC5zZXRWYWx1ZSgnZmlsdGVyRGVwJyt0aGkkLnByb3BzLndpZGdldC5pZCx2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBmaWx0ZXIgPSB0aGlzLnByb3BzLmNvbnRleHQuZ2V0VmFsdWUoJ2ZpbHRlckRlcCcrdGhpcy5wcm9wcy53aWRnZXQuaWQpO1xuICAgICAgICBpZiAoZmlsdGVyKSB7XG4gICAgICAgICAgICAkKGRyb3Bkb3duKS5kcm9wZG93bignc2V0IHNlbGVjdGVkJyxmaWx0ZXIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdmFyIENvbmZpcm0gPSBTdGFnZS5CYXNpYy5Db25maXJtO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5lcnJvciA/XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIGVycm9yIG1lc3NhZ2VcIiBzdHlsZT17e1wiZGlzcGxheVwiOlwiYmxvY2tcIn19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVhZGVyXCI+RXJyb3IgT2NjdXJlZDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPnt0aGlzLnN0YXRlLmVycm9yfTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgJydcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIHNlbGVjdGlvbiBkcm9wZG93biBmbHVpZFwiIHJlZj17dGhpcy5faW5pdERyb3Bkb3duLmJpbmQodGhpcyl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwic3RhdHVzRmlsdGVyXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZWZhdWx0IHRleHRcIj5GaWx0ZXIgYnkgc3RhdHVzPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJkcm9wZG93biBpY29uXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZW51XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpdGVtXCIgZGF0YS12YWx1ZT1cIm9rXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImNoZWNrIGNpcmNsZSBpY29uIGludmVydGVkIGdyZWVuXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPS1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaXRlbVwiIGRhdGEtdmFsdWU9XCJlcnJvclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJyZW1vdmUgY2lyY2xlIGljb24gaW52ZXJ0ZWQgcmVkXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBFcnJvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT1cInVpIHZlcnkgY29tcGFjdCB0YWJsZSBkZXBsb3ltZW50VGFibGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+TmFtZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+Qmx1ZXByaW50PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5DcmVhdGVkPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5VcGRhdGVkPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5TdGF0dXM8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoLz5cbiAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmRhdGEuaXRlbXMubWFwKChpdGVtKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ciBrZXk9e2l0ZW0uaWR9IGNsYXNzTmFtZT0ncm93JyBvbkNsaWNrPXt0aGlzLl9zZWxlY3REZXBsb3ltZW50LmJpbmQodGhpcyxpdGVtKX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPSdkZXBsb3ltZW50TmFtZScgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPntpdGVtLmlkfTwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e2l0ZW0uYmx1ZXByaW50X2lkfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e2l0ZW0uY3JlYXRlZF9hdH08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPntpdGVtLnVwZGF0ZWRfYXR9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGl0ZW0uc3RhdHVzID09PSAnb2snID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiY2hlY2sgY2lyY2xlIGljb24gaW52ZXJ0ZWQgZ3JlZW5cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwicmVtb3ZlIGNpcmNsZSBpY29uIGludmVydGVkIHJlZFwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dBY3Rpb25zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cInJvYWQgaWNvbiBsaW5rIGJvcmRlcmVkXCIgdGl0bGU9XCJFeGVjdXRlIHdvcmtmbG93XCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJ3cml0ZSBpY29uIGxpbmsgYm9yZGVyZWRcIiB0aXRsZT1cIkVkaXQgZGVwbG95bWVudFwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwidHJhc2ggaWNvbiBsaW5rIGJvcmRlcmVkXCIgdGl0bGU9XCJEZWxldGUgZGVwbG95bWVudFwiIG9uQ2xpY2s9e3RoaXMuX2RlbGV0ZURlcGxveW1lbnRDb25maXJtLmJpbmQodGhpcyxpdGVtKX0+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICAgICAgPENvbmZpcm0gdGl0bGU9J0FyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byByZW1vdmUgdGhpcyBibHVlcHJpbnQ/J1xuICAgICAgICAgICAgICAgICAgICAgICAgIHNob3c9e3RoaXMuc3RhdGUuY29uZmlybURlbGV0ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICBvbkNvbmZpcm09e3RoaXMuX2RlbGV0ZURlcGxveW1lbnQuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICBvbkNhbmNlbD17KCk9PnRoaXMuc2V0U3RhdGUoe2NvbmZpcm1EZWxldGUgOiBmYWxzZX0pfSAvPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkga2lubmVyZXR6aW4gb24gMDcvMDkvMjAxNi5cbiAqL1xuXG5pbXBvcnQgRGVwbG95bWVudHNUYWJsZSBmcm9tICcuL0RlcGxveW1lbnRzVGFibGUnO1xuXG5TdGFnZS5hZGRQbHVnaW4oe1xuICAgIGlkOiBcImRlcGxveW1lbnRzXCIsXG4gICAgbmFtZTogJ0JsdWVwcmludCBkZXBsb3ltZW50cycsXG4gICAgZGVzY3JpcHRpb246ICdibGFoIGJsYWggYmxhaCcsXG4gICAgaW5pdGlhbFdpZHRoOiA4LFxuICAgIGluaXRpYWxIZWlnaHQ6IDYsXG4gICAgY29sb3IgOiBcInB1cnBsZVwiLFxuICAgIGZldGNoVXJsOiAnW21hbmFnZXJdL2FwaS92Mi4xL2RlcGxveW1lbnRzJyxcbiAgICBpbml0aWFsQ29uZmlndXJhdGlvbjoge2ZpbHRlcl9ieTogXCJcIn0sXG4gICAgaXNSZWFjdDogdHJ1ZSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24od2lkZ2V0LGRhdGEsZXJyb3IsY29udGV4dCxwbHVnaW5VdGlscykge1xuXG4gICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIHBsdWdpblV0aWxzLnJlbmRlclJlYWN0TG9hZGluZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gcGx1Z2luVXRpbHMucmVuZGVyUmVhY3RFcnJvcihlcnJvcik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZm9ybWF0dGVkRGF0YSA9IE9iamVjdC5hc3NpZ24oe30sZGF0YSk7XG4gICAgICAgIHZhciBibHVlcHJpbnRJZCA9IGNvbnRleHQuZ2V0VmFsdWUoJ2JsdWVwcmludElkJyk7XG4gICAgICAgIHZhciBmaWx0ZXIgPSBjb250ZXh0LmdldFZhbHVlKCdmaWx0ZXJEZXAnK3dpZGdldC5pZCk7XG4gICAgICAgIGlmIChibHVlcHJpbnRJZCkge1xuICAgICAgICAgICAgZm9ybWF0dGVkRGF0YS5pdGVtcyA9IF8uZmlsdGVyKGRhdGEuaXRlbXMse2JsdWVwcmludF9pZDpibHVlcHJpbnRJZH0pO1xuICAgICAgICB9XG4gICAgICAgIGZvcm1hdHRlZERhdGEgPSBPYmplY3QuYXNzaWduKHt9LGZvcm1hdHRlZERhdGEse1xuICAgICAgICAgICAgaXRlbXM6IF8ubWFwIChmb3JtYXR0ZWREYXRhLml0ZW1zLChpdGVtKT0+e1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LGl0ZW0se1xuICAgICAgICAgICAgICAgICAgICBjcmVhdGVkX2F0OiBwbHVnaW5VdGlscy5tb21lbnQoaXRlbS5jcmVhdGVkX2F0LCdZWVlZLU1NLUREIEhIOm1tOnNzLlNTU1NTJykuZm9ybWF0KCdERC1NTS1ZWVlZIEhIOm1tJyksIC8vMjAxNi0wNy0yMCAwOToxMDo1My4xMDM1NzlcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlZF9hdDogcGx1Z2luVXRpbHMubW9tZW50KGl0ZW0udXBkYXRlZF9hdCwnWVlZWS1NTS1ERCBISDptbTpzcy5TU1NTUycpLmZvcm1hdCgnREQtTU0tWVlZWSBISDptbScpLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IGl0ZW0uc3RhdHVzIHx8ICdvaydcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGZpbHRlcikge1xuICAgICAgICAgICAgZm9ybWF0dGVkRGF0YS5pdGVtcyA9IF8uZmlsdGVyKGZvcm1hdHRlZERhdGEuaXRlbXMse3N0YXR1czpmaWx0ZXJ9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcm1hdHRlZERhdGEuYmx1ZXByaW50SWQgPSBibHVlcHJpbnRJZDtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8RGVwbG95bWVudHNUYWJsZSB3aWRnZXQ9e3dpZGdldH0gZGF0YT17Zm9ybWF0dGVkRGF0YX0gY29udGV4dD17Y29udGV4dH0gdXRpbHM9e3BsdWdpblV0aWxzfS8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59KTtcbiJdfQ==
