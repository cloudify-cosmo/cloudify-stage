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
 * Created by kinneretzin on 20/10/2016.
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
        key: '_refreshData',
        value: function _refreshData() {
            this.props.context.refresh();
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.props.context.getEventBus().on('executions:refresh', this._refreshData, this);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.props.context.getEventBus().off('executions:refresh', this._refreshData);
        }
    }, {
        key: 'render',
        value: function render() {
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
                    'table',
                    { className: 'ui very compact table executionsTable' },
                    React.createElement(
                        'thead',
                        null,
                        React.createElement(
                            'tr',
                            null,
                            React.createElement(
                                'th',
                                null,
                                'Blueprint'
                            ),
                            React.createElement(
                                'th',
                                null,
                                'Deployment'
                            ),
                            React.createElement(
                                'th',
                                null,
                                'Workflow'
                            ),
                            React.createElement(
                                'th',
                                null,
                                'Id'
                            ),
                            React.createElement(
                                'th',
                                null,
                                'Created'
                            ),
                            React.createElement(
                                'th',
                                null,
                                'Is System'
                            ),
                            React.createElement(
                                'th',
                                null,
                                'Status'
                            )
                        )
                    ),
                    React.createElement(
                        'tbody',
                        null,
                        this.props.data.items.map(function (item) {
                            return React.createElement(
                                'tr',
                                { key: item.id, className: 'row' },
                                React.createElement(
                                    'td',
                                    null,
                                    item.blueprint_id
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    item.deployment_id
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    item.workflow_id
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    item.id
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    item.created_at
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    item.is_system_workflow ? 'true' : 'false'
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    item.status,
                                    _.isEmpty(item.error) ? React.createElement('i', { className: 'check circle icon inverted green' }) : React.createElement('i', { className: 'remove circle icon inverted red' })
                                )
                            );
                        })
                    )
                )
            );
        }
    }]);

    return _class;
}(React.Component);

exports.default = _class;

},{}],2:[function(require,module,exports){
'use strict';

var _ExecutionsTable = require('./ExecutionsTable');

var _ExecutionsTable2 = _interopRequireDefault(_ExecutionsTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Stage.addPlugin({
    id: "executions",
    name: 'Deployment executions',
    description: 'This plugin shows the deployment executions',
    initialWidth: 8,
    initialHeight: 6,
    color: "purple",
    fetchUrl: '[manager]/api/v2.1/executions',
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
        var deploymentId = context.getValue('deploymentId');

        if (blueprintId) {
            formattedData.items = _.filter(data.items, { blueprint_id: blueprintId });
        }

        if (deploymentId) {
            formattedData.items = _.filter(data.items, { deployment_id: deploymentId });
        }

        formattedData = Object.assign({}, formattedData, {
            items: _.map(formattedData.items, function (item) {
                return Object.assign({}, item, {
                    created_at: pluginUtils.moment(item.created_at, 'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm') //2016-07-20 09:10:53.103579
                });
            })
        });

        return React.createElement(_ExecutionsTable2.default, { widget: widget, data: formattedData, context: context, utils: pluginUtils });
    }
}); /**
     * Created by kinneretzin on 20/10/2016.
     */

},{"./ExecutionsTable":1}]},{},[1,2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwbHVnaW5zL2V4ZWN1dGlvbnMvc3JjL0V4ZWN1dGlvbnNUYWJsZS5qcyIsInBsdWdpbnMvZXhlY3V0aW9ucy9zcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7OztBQUtJLG9CQUFZLEtBQVosRUFBbUIsT0FBbkIsRUFBNEI7QUFBQTs7QUFBQSxvSEFDbEIsS0FEa0IsRUFDWCxPQURXOztBQUd4QixjQUFLLEtBQUwsR0FBYSxFQUFiO0FBSHdCO0FBSzNCOzs7O3VDQUVjO0FBQ1gsaUJBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsT0FBbkI7QUFDSDs7OzRDQUVtQjtBQUNoQixpQkFBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixXQUFuQixHQUFpQyxFQUFqQyxDQUFvQyxvQkFBcEMsRUFBMEQsS0FBSyxZQUEvRCxFQUE2RSxJQUE3RTtBQUNIOzs7K0NBRXNCO0FBQ25CLGlCQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLFdBQW5CLEdBQWlDLEdBQWpDLENBQXFDLG9CQUFyQyxFQUEyRCxLQUFLLFlBQWhFO0FBQ0g7OztpQ0FHUTtBQUNMLG1CQUNJO0FBQUE7QUFBQTtBQUVRLHFCQUFLLEtBQUwsQ0FBVyxLQUFYLEdBQ0k7QUFBQTtBQUFBLHNCQUFLLFdBQVUsa0JBQWYsRUFBa0MsT0FBTyxFQUFDLFdBQVUsT0FBWCxFQUF6QztBQUNJO0FBQUE7QUFBQSwwQkFBSyxXQUFVLFFBQWY7QUFBQTtBQUFBLHFCQURKO0FBRUk7QUFBQTtBQUFBO0FBQUksNkJBQUssS0FBTCxDQUFXO0FBQWY7QUFGSixpQkFESixHQU1JLEVBUlo7QUFXSTtBQUFBO0FBQUEsc0JBQU8sV0FBVSx1Q0FBakI7QUFDSTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFDSTtBQUFBO0FBQUE7QUFBQTtBQUFBLDZC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SSxpREFBaUIsUUFBUSxNQUF6QixFQUFpQyxNQUFNLGFBQXZDLEVBQXNELFNBQVMsT0FBL0QsRUFBd0UsT0FBTyxXQUEvRSxHQURKO0FBR0g7QUE3Q1csQ0FBaEIsRSxDQU5BIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ3JlYXRlZCBieSBraW5uZXJldHppbiBvbiAyMC8xMC8yMDE2LlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xuICAgICAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XG5cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9yZWZyZXNoRGF0YSgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LnJlZnJlc2goKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LmdldEV2ZW50QnVzKCkub24oJ2V4ZWN1dGlvbnM6cmVmcmVzaCcsIHRoaXMuX3JlZnJlc2hEYXRhLCB0aGlzKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LmdldEV2ZW50QnVzKCkub2ZmKCdleGVjdXRpb25zOnJlZnJlc2gnLCB0aGlzLl9yZWZyZXNoRGF0YSk7XG4gICAgfVxuXG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5lcnJvciA/XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIGVycm9yIG1lc3NhZ2VcIiBzdHlsZT17e1wiZGlzcGxheVwiOlwiYmxvY2tcIn19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVhZGVyXCI+RXJyb3IgT2NjdXJlZDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPnt0aGlzLnN0YXRlLmVycm9yfTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgJydcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPVwidWkgdmVyeSBjb21wYWN0IHRhYmxlIGV4ZWN1dGlvbnNUYWJsZVwiPlxuICAgICAgICAgICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5CbHVlcHJpbnQ8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkRlcGxveW1lbnQ8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPldvcmtmbG93PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5JZDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+Q3JlYXRlZDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+SXMgU3lzdGVtPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5TdGF0dXM8L3RoPlxuICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuZGF0YS5pdGVtcy5tYXAoKGl0ZW0pPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyIGtleT17aXRlbS5pZH0gY2xhc3NOYW1lPSdyb3cnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPntpdGVtLmJsdWVwcmludF9pZH08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPntpdGVtLmRlcGxveW1lbnRfaWR9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57aXRlbS53b3JrZmxvd19pZH08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPntpdGVtLmlkfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e2l0ZW0uY3JlYXRlZF9hdH08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPntpdGVtLmlzX3N5c3RlbV93b3JrZmxvdyA/ICd0cnVlJyA6ICdmYWxzZSd9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7aXRlbS5zdGF0dXN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBfLmlzRW1wdHkoaXRlbS5lcnJvcikgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJjaGVjayBjaXJjbGUgaWNvbiBpbnZlcnRlZCBncmVlblwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJyZW1vdmUgY2lyY2xlIGljb24gaW52ZXJ0ZWQgcmVkXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGtpbm5lcmV0emluIG9uIDIwLzEwLzIwMTYuXG4gKi9cblxuaW1wb3J0IEV4ZWN1dGlvbnNUYWJsZSBmcm9tICcuL0V4ZWN1dGlvbnNUYWJsZSc7XG5cblN0YWdlLmFkZFBsdWdpbih7XG4gICAgaWQ6IFwiZXhlY3V0aW9uc1wiLFxuICAgIG5hbWU6ICdEZXBsb3ltZW50IGV4ZWN1dGlvbnMnLFxuICAgIGRlc2NyaXB0aW9uOiAnVGhpcyBwbHVnaW4gc2hvd3MgdGhlIGRlcGxveW1lbnQgZXhlY3V0aW9ucycsXG4gICAgaW5pdGlhbFdpZHRoOiA4LFxuICAgIGluaXRpYWxIZWlnaHQ6IDYsXG4gICAgY29sb3IgOiBcInB1cnBsZVwiLFxuICAgIGZldGNoVXJsOiAnW21hbmFnZXJdL2FwaS92Mi4xL2V4ZWN1dGlvbnMnLFxuICAgIGlzUmVhY3Q6IHRydWUsXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKHdpZGdldCxkYXRhLGVycm9yLGNvbnRleHQscGx1Z2luVXRpbHMpIHtcblxuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiBwbHVnaW5VdGlscy5yZW5kZXJSZWFjdExvYWRpbmcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIHBsdWdpblV0aWxzLnJlbmRlclJlYWN0RXJyb3IoZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZvcm1hdHRlZERhdGEgPSBPYmplY3QuYXNzaWduKHt9LGRhdGEpO1xuXG4gICAgICAgIHZhciBibHVlcHJpbnRJZCA9IGNvbnRleHQuZ2V0VmFsdWUoJ2JsdWVwcmludElkJyk7XG4gICAgICAgIHZhciBkZXBsb3ltZW50SWQgPSBjb250ZXh0LmdldFZhbHVlKCdkZXBsb3ltZW50SWQnKTtcblxuICAgICAgICBpZiAoYmx1ZXByaW50SWQpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZERhdGEuaXRlbXMgPSBfLmZpbHRlcihkYXRhLml0ZW1zLHtibHVlcHJpbnRfaWQ6Ymx1ZXByaW50SWR9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkZXBsb3ltZW50SWQpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZERhdGEuaXRlbXMgPSBfLmZpbHRlcihkYXRhLml0ZW1zLHtkZXBsb3ltZW50X2lkOmRlcGxveW1lbnRJZH0pO1xuICAgICAgICB9XG5cblxuICAgICAgICBmb3JtYXR0ZWREYXRhID0gT2JqZWN0LmFzc2lnbih7fSxmb3JtYXR0ZWREYXRhLHtcbiAgICAgICAgICAgIGl0ZW1zOiBfLm1hcCAoZm9ybWF0dGVkRGF0YS5pdGVtcywoaXRlbSk9PntcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSxpdGVtLHtcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlZF9hdDogcGx1Z2luVXRpbHMubW9tZW50KGl0ZW0uY3JlYXRlZF9hdCwnWVlZWS1NTS1ERCBISDptbTpzcy5TU1NTUycpLmZvcm1hdCgnREQtTU0tWVlZWSBISDptbScpIC8vMjAxNi0wNy0yMCAwOToxMDo1My4xMDM1NzlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxFeGVjdXRpb25zVGFibGUgd2lkZ2V0PXt3aWRnZXR9IGRhdGE9e2Zvcm1hdHRlZERhdGF9IGNvbnRleHQ9e2NvbnRleHR9IHV0aWxzPXtwbHVnaW5VdGlsc30vPlxuICAgICAgICApO1xuICAgIH1cbn0pO1xuIl19
