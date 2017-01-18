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
            this.props.toolbox.refresh();
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.props.toolbox.getEventBus().on('events:refresh', this._refreshData, this);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.props.toolbox.getEventBus().off('events:refresh', this._refreshData);
        }
    }, {
        key: '_selectEvent',
        value: function _selectEvent(item) {
            var oldSelectedEventId = this.props.toolbox.getContext().getValue('eventId');
            this.props.toolbox.getContext().setValue('eventId', item.id === oldSelectedEventId ? null : item.id);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var ErrorMessage = Stage.Basic.ErrorMessage;

            return React.createElement(
                'div',
                null,
                React.createElement(ErrorMessage, { error: this.state.error }),
                React.createElement(
                    'table',
                    { className: 'ui very compact table logsTable' },
                    React.createElement(
                        'thead',
                        null,
                        React.createElement(
                            'tr',
                            null,
                            !this.props.data.blueprintId && !this.props.data.deploymentId && !this.props.data.executionId ? React.createElement(
                                'th',
                                null,
                                'Blueprint'
                            ) : '',
                            !this.props.data.deploymentId && !this.props.data.executionId ? React.createElement(
                                'th',
                                null,
                                'Deployment'
                            ) : '',
                            !this.props.data.executionId ? React.createElement(
                                'th',
                                null,
                                'Workflow'
                            ) : '',
                            React.createElement(
                                'th',
                                null,
                                'Log Level'
                            ),
                            React.createElement(
                                'th',
                                null,
                                'Timestamp'
                            ),
                            React.createElement(
                                'th',
                                null,
                                'Operation'
                            ),
                            React.createElement(
                                'th',
                                null,
                                'Node Name'
                            ),
                            React.createElement(
                                'th',
                                null,
                                'Node Id'
                            ),
                            React.createElement(
                                'th',
                                null,
                                'Message'
                            )
                        )
                    ),
                    React.createElement(
                        'tbody',
                        null,
                        this.props.data.items.map(function (item) {
                            return React.createElement(
                                'tr',
                                { key: item.id, className: 'row ' + (item.isSelected ? 'active' : ''), onClick: _this2._selectEvent.bind(_this2, item) },
                                !_this2.props.data.blueprintId && !_this2.props.data.deploymentId && !_this2.props.data.executionId ? React.createElement(
                                    'td',
                                    null,
                                    item.context.blueprint_id
                                ) : '',
                                !_this2.props.data.deploymentId && !_this2.props.data.executionId ? React.createElement(
                                    'td',
                                    null,
                                    item.context.deployment_id
                                ) : '',
                                !_this2.props.data.executionId ? React.createElement(
                                    'td',
                                    null,
                                    item.context.workflow_id
                                ) : '',
                                React.createElement(
                                    'td',
                                    null,
                                    item.level
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    item.timestamp
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    item.context.operation
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    item.context.node_name
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    item.context.node_id
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    item.message.text
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

var _LogsTable = require('./LogsTable');

var _LogsTable2 = _interopRequireDefault(_LogsTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Stage.defineWidget({
    id: 'logs',
    name: "Deployment Logs",
    description: '',
    initialWidth: 5,
    initialHeight: 4,
    color: "purple",
    fetchUrl: '[manager]/events',
    isReact: true,
    initialConfiguration: [{ id: "pollingTime", default: 2 }],

    render: function render(widget, data, error, toolbox) {
        if (_.isEmpty(data)) {
            return React.createElement(Stage.Basic.Loading, null);
        }

        var formattedData = Object.assign({}, data, {
            items: _.filter(data.items, function (item) {
                return item.type === 'cloudify_log';
            }) // Can maybe change to item.level !== undefined
        });
        var deploymentId = toolbox.getContext().getValue('deploymentId');
        var blueprintId = toolbox.getContext().getValue('blueprintId');
        var executionId = toolbox.getContext().getValue('executionId');

        if (executionId) {
            formattedData.items = _.filter(formattedData.items, function (item) {
                return item.context.execution_id === executionId;
            });
        } else if (deploymentId) {
            formattedData.items = _.filter(formattedData.items, function (item) {
                return item.context.deployment_id === deploymentId;
            });
        } else if (blueprintId) {
            formattedData.items = _.filter(formattedData.items, function (item) {
                return item.context.blueprint_id === blueprintId;
            });
        }

        var index = 0;
        formattedData = Object.assign({}, formattedData, {
            items: _.map(formattedData.items, function (item) {
                return Object.assign({}, item, {
                    id: index++,
                    timestamp: moment(item.timestamp, 'YYYY-MM-DD HH:mm:ss.SSS+SSS').format('DD-MM-YYYY HH:mm') //2016-07-20 09:10:53.103+000
                });
            })
        });

        formattedData.blueprintId = blueprintId;
        formattedData.deploymentId = deploymentId;
        formattedData.executionId = executionId;

        return React.createElement(_LogsTable2.default, { widget: widget, data: formattedData, toolbox: toolbox });
    }
}); /**
     * Created by kinneretzin on 07/09/2016.
     */

},{"./LogsTable":1}]},{},[1,2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3aWRnZXRzL2xvZ3Mvc3JjL0xvZ3NUYWJsZS5qcyIsIndpZGdldHMvbG9ncy9zcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7OztBQUtJLG9CQUFZLEtBQVosRUFBbUIsT0FBbkIsRUFBNEI7QUFBQTs7QUFBQSxvSEFDbEIsS0FEa0IsRUFDWCxPQURXOztBQUd4QixjQUFLLEtBQUwsR0FBYSxFQUFiO0FBSHdCO0FBSzNCOzs7O3VDQUVjO0FBQ1gsaUJBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsT0FBbkI7QUFDSDs7OzRDQUVtQjtBQUNoQixpQkFBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixXQUFuQixHQUFpQyxFQUFqQyxDQUFvQyxnQkFBcEMsRUFBc0QsS0FBSyxZQUEzRCxFQUF5RSxJQUF6RTtBQUNIOzs7K0NBRXNCO0FBQ25CLGlCQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLFdBQW5CLEdBQWlDLEdBQWpDLENBQXFDLGdCQUFyQyxFQUF1RCxLQUFLLFlBQTVEO0FBQ0g7OztxQ0FHWSxJLEVBQU07QUFDZixnQkFBSSxxQkFBcUIsS0FBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixVQUFuQixHQUFnQyxRQUFoQyxDQUF5QyxTQUF6QyxDQUF6QjtBQUNBLGlCQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLFVBQW5CLEdBQWdDLFFBQWhDLENBQXlDLFNBQXpDLEVBQW1ELEtBQUssRUFBTCxLQUFZLGtCQUFaLEdBQWlDLElBQWpDLEdBQXdDLEtBQUssRUFBaEc7QUFDSDs7O2lDQUVRO0FBQUE7O0FBQ0wsZ0JBQUksZUFBZSxNQUFNLEtBQU4sQ0FBWSxZQUEvQjs7QUFFQSxtQkFDSTtBQUFBO0FBQUE7QUFDSSxvQ0FBQyxZQUFELElBQWMsT0FBTyxLQUFLLEtBQUwsQ0FBVyxLQUFo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Q0gsYUFGcUIsQ0FBdEI7QUFHSCxTQUpNLE1BSUEsSUFBSSxXQUFKLEVBQWlCO0FBQ3BCLDBCQUFjLEtBQWQsR0FBc0IsRUFBRSxNQUFGLENBQVMsY0FBYyxLQUF2QixFQUE2QixVQUFDLElBQUQsRUFBUTtBQUN2RCx1QkFBTyxLQUFLLE9BQUwsQ0FBYSxZQUFiLEtBQThCLFdBQXJDO0FBQ0gsYUFGcUIsQ0FBdEI7QUFHSDs7QUFFRCxZQUFJLFFBQU0sQ0FBVjtBQUNBLHdCQUFnQixPQUFPLE1BQVAsQ0FBYyxFQUFkLEVBQWlCLGFBQWpCLEVBQStCO0FBQzNDLG1CQUFPLEVBQUUsR0FBRixDQUFPLGNBQWMsS0FBckIsRUFBMkIsVUFBQyxJQUFELEVBQVE7QUFDdEMsdUJBQU8sT0FBTyxNQUFQLENBQWMsRUFBZCxFQUFpQixJQUFqQixFQUFzQjtBQUN6Qix3QkFBSSxPQURxQjtBQUV6QiwrQkFBVyxPQUFPLEtBQUssU0FBWixFQUFzQiw2QkFBdEIsRUFBcUQsTUFBckQsQ0FBNEQsa0JBQTVELENBRmMsQ0FFa0U7QUFGbEUsaUJBQXRCLENBQVA7QUFJSCxhQUxNO0FBRG9DLFNBQS9CLENBQWhCOztBQVNBLHNCQUFjLFdBQWQsR0FBNEIsV0FBNUI7QUFDQSxzQkFBYyxZQUFkLEdBQTZCLFlBQTdCO0FBQ0Esc0JBQWMsV0FBZCxHQUE0QixXQUE1Qjs7QUFFQSxlQUNJLDJDQUFXLFFBQVEsTUFBbkIsRUFBMkIsTUFBTSxhQUFqQyxFQUFnRCxTQUFTLE9BQXpELEdBREo7QUFJSDtBQXpEYyxDQUFuQixFLENBTkEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGtpbm5lcmV0emluIG9uIDIwLzEwLzIwMTYuXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XG4gICAgICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcblxuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3JlZnJlc2hEYXRhKCkge1xuICAgICAgICB0aGlzLnByb3BzLnRvb2xib3gucmVmcmVzaCgpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLnRvb2xib3guZ2V0RXZlbnRCdXMoKS5vbignZXZlbnRzOnJlZnJlc2gnLCB0aGlzLl9yZWZyZXNoRGF0YSwgdGhpcyk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgICAgIHRoaXMucHJvcHMudG9vbGJveC5nZXRFdmVudEJ1cygpLm9mZignZXZlbnRzOnJlZnJlc2gnLCB0aGlzLl9yZWZyZXNoRGF0YSk7XG4gICAgfVxuXG5cbiAgICBfc2VsZWN0RXZlbnQoaXRlbSkge1xuICAgICAgICB2YXIgb2xkU2VsZWN0ZWRFdmVudElkID0gdGhpcy5wcm9wcy50b29sYm94LmdldENvbnRleHQoKS5nZXRWYWx1ZSgnZXZlbnRJZCcpO1xuICAgICAgICB0aGlzLnByb3BzLnRvb2xib3guZ2V0Q29udGV4dCgpLnNldFZhbHVlKCdldmVudElkJyxpdGVtLmlkID09PSBvbGRTZWxlY3RlZEV2ZW50SWQgPyBudWxsIDogaXRlbS5pZCk7XG4gICAgfVxuICAgIFxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdmFyIEVycm9yTWVzc2FnZSA9IFN0YWdlLkJhc2ljLkVycm9yTWVzc2FnZTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8RXJyb3JNZXNzYWdlIGVycm9yPXt0aGlzLnN0YXRlLmVycm9yfS8+XG5cbiAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPVwidWkgdmVyeSBjb21wYWN0IHRhYmxlIGxvZ3NUYWJsZVwiPlxuICAgICAgICAgICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHshdGhpcy5wcm9wcy5kYXRhLmJsdWVwcmludElkICYmICF0aGlzLnByb3BzLmRhdGEuZGVwbG95bWVudElkICYmICF0aGlzLnByb3BzLmRhdGEuZXhlY3V0aW9uSWQgPyA8dGg+Qmx1ZXByaW50PC90aD4gOiAnJ31cbiAgICAgICAgICAgICAgICAgICAgICAgIHshdGhpcy5wcm9wcy5kYXRhLmRlcGxveW1lbnRJZCAmJiAhdGhpcy5wcm9wcy5kYXRhLmV4ZWN1dGlvbklkID8gPHRoPkRlcGxveW1lbnQ8L3RoPiA6ICcnfVxuICAgICAgICAgICAgICAgICAgICAgICAgeyAhdGhpcy5wcm9wcy5kYXRhLmV4ZWN1dGlvbklkID8gPHRoPldvcmtmbG93PC90aD4gOiAnJ31cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5Mb2cgTGV2ZWw8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlRpbWVzdGFtcDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+T3BlcmF0aW9uPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5Ob2RlIE5hbWU8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk5vZGUgSWQ8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk1lc3NhZ2U8L3RoPlxuICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuZGF0YS5pdGVtcy5tYXAoKGl0ZW0pPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyIGtleT17aXRlbS5pZH0gY2xhc3NOYW1lPXsncm93ICcgKyAoaXRlbS5pc1NlbGVjdGVkID8gJ2FjdGl2ZScgOiAnJyl9IG9uQ2xpY2s9e3RoaXMuX3NlbGVjdEV2ZW50LmJpbmQodGhpcyxpdGVtKX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IXRoaXMucHJvcHMuZGF0YS5ibHVlcHJpbnRJZCAmJiAhdGhpcy5wcm9wcy5kYXRhLmRlcGxveW1lbnRJZCAmJiAhdGhpcy5wcm9wcy5kYXRhLmV4ZWN1dGlvbklkID8gPHRkPntpdGVtLmNvbnRleHQuYmx1ZXByaW50X2lkfTwvdGQ+IDogJyd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IXRoaXMucHJvcHMuZGF0YS5kZXBsb3ltZW50SWQgJiYgIXRoaXMucHJvcHMuZGF0YS5leGVjdXRpb25JZCA/IDx0ZD57aXRlbS5jb250ZXh0LmRlcGxveW1lbnRfaWR9PC90ZD4gOiAnJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgIXRoaXMucHJvcHMuZGF0YS5leGVjdXRpb25JZCA/IDx0ZD57aXRlbS5jb250ZXh0LndvcmtmbG93X2lkfTwvdGQ+IDogJycgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e2l0ZW0ubGV2ZWx9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57aXRlbS50aW1lc3RhbXB9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57aXRlbS5jb250ZXh0Lm9wZXJhdGlvbn08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPntpdGVtLmNvbnRleHQubm9kZV9uYW1lfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e2l0ZW0uY29udGV4dC5ub2RlX2lkfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e2l0ZW0ubWVzc2FnZS50ZXh0fTwvdGQ+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkga2lubmVyZXR6aW4gb24gMDcvMDkvMjAxNi5cbiAqL1xuXG5pbXBvcnQgTG9nc1RhYmxlIGZyb20gJy4vTG9nc1RhYmxlJztcblxuU3RhZ2UuZGVmaW5lV2lkZ2V0KHtcbiAgICBpZDogJ2xvZ3MnLFxuICAgIG5hbWU6IFwiRGVwbG95bWVudCBMb2dzXCIsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGluaXRpYWxXaWR0aDogNSxcbiAgICBpbml0aWFsSGVpZ2h0OiA0LFxuICAgIGNvbG9yOiBcInB1cnBsZVwiLFxuICAgIGZldGNoVXJsOiAnW21hbmFnZXJdL2V2ZW50cycsXG4gICAgaXNSZWFjdDogdHJ1ZSxcbiAgICBpbml0aWFsQ29uZmlndXJhdGlvbjogW1xuICAgICAgICB7aWQ6IFwicG9sbGluZ1RpbWVcIiwgZGVmYXVsdDogMn1cbiAgICBdLFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbih3aWRnZXQsZGF0YSxlcnJvcix0b29sYm94KSB7XG4gICAgICAgIGlmIChfLmlzRW1wdHkoZGF0YSkpIHtcbiAgICAgICAgICAgIHJldHVybiA8U3RhZ2UuQmFzaWMuTG9hZGluZy8+O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZvcm1hdHRlZERhdGEgPSBPYmplY3QuYXNzaWduKHt9LGRhdGEse1xuICAgICAgICAgICAgaXRlbXM6IF8uZmlsdGVyKGRhdGEuaXRlbXMsKGl0ZW0pPT57cmV0dXJuIGl0ZW0udHlwZSA9PT0gJ2Nsb3VkaWZ5X2xvZyc7fSkgLy8gQ2FuIG1heWJlIGNoYW5nZSB0byBpdGVtLmxldmVsICE9PSB1bmRlZmluZWRcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBkZXBsb3ltZW50SWQgPSB0b29sYm94LmdldENvbnRleHQoKS5nZXRWYWx1ZSgnZGVwbG95bWVudElkJyk7XG4gICAgICAgIHZhciBibHVlcHJpbnRJZCA9IHRvb2xib3guZ2V0Q29udGV4dCgpLmdldFZhbHVlKCdibHVlcHJpbnRJZCcpO1xuICAgICAgICB2YXIgZXhlY3V0aW9uSWQgPSB0b29sYm94LmdldENvbnRleHQoKS5nZXRWYWx1ZSgnZXhlY3V0aW9uSWQnKTtcblxuICAgICAgICBpZiAoZXhlY3V0aW9uSWQpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZERhdGEuaXRlbXMgPSBfLmZpbHRlcihmb3JtYXR0ZWREYXRhLml0ZW1zLCAoaXRlbSk9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uY29udGV4dC5leGVjdXRpb25faWQgPT09IGV4ZWN1dGlvbklkO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZGVwbG95bWVudElkKSB7XG4gICAgICAgICAgICBmb3JtYXR0ZWREYXRhLml0ZW1zID0gXy5maWx0ZXIoZm9ybWF0dGVkRGF0YS5pdGVtcywoaXRlbSk9PntcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5jb250ZXh0LmRlcGxveW1lbnRfaWQgPT09IGRlcGxveW1lbnRJZDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKGJsdWVwcmludElkKSB7XG4gICAgICAgICAgICBmb3JtYXR0ZWREYXRhLml0ZW1zID0gXy5maWx0ZXIoZm9ybWF0dGVkRGF0YS5pdGVtcywoaXRlbSk9PntcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5jb250ZXh0LmJsdWVwcmludF9pZCA9PT0gYmx1ZXByaW50SWQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpbmRleD0wO1xuICAgICAgICBmb3JtYXR0ZWREYXRhID0gT2JqZWN0LmFzc2lnbih7fSxmb3JtYXR0ZWREYXRhLHtcbiAgICAgICAgICAgIGl0ZW1zOiBfLm1hcCAoZm9ybWF0dGVkRGF0YS5pdGVtcywoaXRlbSk9PntcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSxpdGVtLHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGluZGV4KyssXG4gICAgICAgICAgICAgICAgICAgIHRpbWVzdGFtcDogbW9tZW50KGl0ZW0udGltZXN0YW1wLCdZWVlZLU1NLUREIEhIOm1tOnNzLlNTUytTU1MnKS5mb3JtYXQoJ0RELU1NLVlZWVkgSEg6bW0nKSAvLzIwMTYtMDctMjAgMDk6MTA6NTMuMTAzKzAwMFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcblxuICAgICAgICBmb3JtYXR0ZWREYXRhLmJsdWVwcmludElkID0gYmx1ZXByaW50SWQ7XG4gICAgICAgIGZvcm1hdHRlZERhdGEuZGVwbG95bWVudElkID0gZGVwbG95bWVudElkO1xuICAgICAgICBmb3JtYXR0ZWREYXRhLmV4ZWN1dGlvbklkID0gZXhlY3V0aW9uSWQ7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxMb2dzVGFibGUgd2lkZ2V0PXt3aWRnZXR9IGRhdGE9e2Zvcm1hdHRlZERhdGF9IHRvb2xib3g9e3Rvb2xib3h9Lz5cbiAgICAgICAgKTtcblxuICAgIH1cbn0pOyJdfQ==
