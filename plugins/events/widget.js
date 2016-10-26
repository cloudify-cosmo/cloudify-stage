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
            this.props.context.getEventBus().on('events:refresh', this._refreshData, this);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.props.context.getEventBus().off('events:refresh', this._refreshData);
        }
    }, {
        key: '_selectEvent',
        value: function _selectEvent(item) {
            var oldSelectedEventId = this.props.context.getValue('eventId');
            this.props.context.setValue('eventId', item.id === oldSelectedEventId ? null : item.id);
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
                    'table',
                    { className: 'ui very compact table eventsTable' },
                    React.createElement(
                        'thead',
                        null,
                        React.createElement(
                            'tr',
                            null,
                            !this.props.data.blueprintId && !this.props.data.deploymentId && !this.props.data.executionId ? React.createElement(
                                'th',
                                { key: '' },
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
                                'Event Type'
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
                                    item.event_type
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

var _EventsTable = require('./EventsTable');

var _EventsTable2 = _interopRequireDefault(_EventsTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Stage.addPlugin({
    id: 'events',
    name: "Deployment Events",
    description: '',
    initialWidth: 5,
    initialHeight: 4,
    color: "green",
    fetchUrl: '[manager]/api/v2.1/events',
    isReact: true,
    render: function render(widget, data, error, context, pluginUtils) {
        var formattedData = Object.assign({}, data, {
            items: _.filter(data.items, function (item) {
                return item.event_type !== undefined;
            })
        });
        var deploymentId = context.getValue('deploymentId');
        var blueprintId = context.getValue('blueprintId');
        var executionId = context.getValue('executionId');

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

        formattedData = Object.assign({}, formattedData, {
            items: _.map(formattedData.items, function (item) {
                return Object.assign({}, item, {
                    id: item.type + item.timestamp,
                    timestamp: pluginUtils.moment(item.timestamp, 'YYYY-MM-DD HH:mm:ss.SSS+SSS').format('DD-MM-YYYY HH:mm') //2016-07-20 09:10:53.103+000
                });
            })
        });

        formattedData.blueprintId = blueprintId;
        formattedData.deploymentId = deploymentId;
        formattedData.executionId = executionId;

        return React.createElement(_EventsTable2.default, { widget: widget, data: formattedData, context: context, utils: pluginUtils });
    }
}); /**
     * Created by kinneretzin on 07/09/2016.
     */

},{"./EventsTable":1}]},{},[1,2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwbHVnaW5zL2V2ZW50cy9zcmMvRXZlbnRzVGFibGUuanMiLCJwbHVnaW5zL2V2ZW50cy9zcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7OztBQUtJLG9CQUFZLEtBQVosRUFBbUIsT0FBbkIsRUFBNEI7QUFBQTs7QUFBQSxvSEFDbEIsS0FEa0IsRUFDWCxPQURXOztBQUd4QixjQUFLLEtBQUwsR0FBYSxFQUFiO0FBSHdCO0FBSzNCOzs7O3VDQUVjO0FBQ1gsaUJBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsT0FBbkI7QUFDSDs7OzRDQUVtQjtBQUNoQixpQkFBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixXQUFuQixHQUFpQyxFQUFqQyxDQUFvQyxnQkFBcEMsRUFBc0QsS0FBSyxZQUEzRCxFQUF5RSxJQUF6RTtBQUNIOzs7K0NBRXNCO0FBQ25CLGlCQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLFdBQW5CLEdBQWlDLEdBQWpDLENBQXFDLGdCQUFyQyxFQUF1RCxLQUFLLFlBQTVEO0FBQ0g7OztxQ0FHWSxJLEVBQU07QUFDZixnQkFBSSxxQkFBcUIsS0FBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixRQUFuQixDQUE0QixTQUE1QixDQUF6QjtBQUNBLGlCQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLFFBQW5CLENBQTRCLFNBQTVCLEVBQXNDLEtBQUssRUFBTCxLQUFZLGtCQUFaLEdBQWlDLElBQWpDLEdBQXdDLEtBQUssRUFBbkY7QUFDSDs7O2lDQUVRO0FBQUE7O0FBQ0wsbUJBQ0k7QUFBQTtBQUFBO0FBRVEscUJBQUssS0FBTCxDQUFXLEtBQVgsR0FDSTtBQUFBO0FBQUEsc0JBQUssV0FBVSxrQkFBZixFQUFrQyxPQUFPLEVBQUMsV0FBVSxPQUFYLEVBQXpDO0FBQ0k7QUFBQTtB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QUFjLEtBQXZCLEVBQTZCLFVBQUMsSUFBRCxFQUFRO0FBQ3ZELHVCQUFPLEtBQUssT0FBTCxDQUFhLFlBQWIsS0FBOEIsV0FBckM7QUFDSCxhQUZxQixDQUF0QjtBQUdIOztBQUVELHdCQUFnQixPQUFPLE1BQVAsQ0FBYyxFQUFkLEVBQWlCLGFBQWpCLEVBQStCO0FBQzNDLG1CQUFPLEVBQUUsR0FBRixDQUFPLGNBQWMsS0FBckIsRUFBMkIsVUFBQyxJQUFELEVBQVE7QUFDdEMsdUJBQU8sT0FBTyxNQUFQLENBQWMsRUFBZCxFQUFpQixJQUFqQixFQUFzQjtBQUN6Qix3QkFBSSxLQUFLLElBQUwsR0FBVSxLQUFLLFNBRE07QUFFekIsK0JBQVcsWUFBWSxNQUFaLENBQW1CLEtBQUssU0FBeEIsRUFBa0MsNkJBQWxDLEVBQWlFLE1BQWpFLENBQXdFLGtCQUF4RSxDQUZjLENBRThFO0FBRjlFLGlCQUF0QixDQUFQO0FBSUgsYUFMTTtBQURvQyxTQUEvQixDQUFoQjs7QUFTQSxzQkFBYyxXQUFkLEdBQTRCLFdBQTVCO0FBQ0Esc0JBQWMsWUFBZCxHQUE2QixZQUE3QjtBQUNBLHNCQUFjLFdBQWQsR0FBNEIsV0FBNUI7O0FBRUEsZUFDSSw2Q0FBYSxRQUFRLE1BQXJCLEVBQTZCLE1BQU0sYUFBbkMsRUFBa0QsU0FBUyxPQUEzRCxFQUFvRSxPQUFPLFdBQTNFLEdBREo7QUFJSDtBQWhEVyxDQUFoQixFLENBTkEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGtpbm5lcmV0emluIG9uIDIwLzEwLzIwMTYuXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XG4gICAgICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcblxuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3JlZnJlc2hEYXRhKCkge1xuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQucmVmcmVzaCgpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQuZ2V0RXZlbnRCdXMoKS5vbignZXZlbnRzOnJlZnJlc2gnLCB0aGlzLl9yZWZyZXNoRGF0YSwgdGhpcyk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5nZXRFdmVudEJ1cygpLm9mZignZXZlbnRzOnJlZnJlc2gnLCB0aGlzLl9yZWZyZXNoRGF0YSk7XG4gICAgfVxuXG5cbiAgICBfc2VsZWN0RXZlbnQoaXRlbSkge1xuICAgICAgICB2YXIgb2xkU2VsZWN0ZWRFdmVudElkID0gdGhpcy5wcm9wcy5jb250ZXh0LmdldFZhbHVlKCdldmVudElkJyk7XG4gICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5zZXRWYWx1ZSgnZXZlbnRJZCcsaXRlbS5pZCA9PT0gb2xkU2VsZWN0ZWRFdmVudElkID8gbnVsbCA6IGl0ZW0uaWQpO1xuICAgIH1cbiAgICBcbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5lcnJvciA/XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIGVycm9yIG1lc3NhZ2VcIiBzdHlsZT17e1wiZGlzcGxheVwiOlwiYmxvY2tcIn19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVhZGVyXCI+RXJyb3IgT2NjdXJlZDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPnt0aGlzLnN0YXRlLmVycm9yfTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgJydcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPVwidWkgdmVyeSBjb21wYWN0IHRhYmxlIGV2ZW50c1RhYmxlXCI+XG4gICAgICAgICAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgeyF0aGlzLnByb3BzLmRhdGEuYmx1ZXByaW50SWQgJiYgIXRoaXMucHJvcHMuZGF0YS5kZXBsb3ltZW50SWQgJiYgIXRoaXMucHJvcHMuZGF0YS5leGVjdXRpb25JZCA/IDx0aCBrZXk9Jyc+Qmx1ZXByaW50PC90aD4gOiAnJ31cbiAgICAgICAgICAgICAgICAgICAgICAgIHshdGhpcy5wcm9wcy5kYXRhLmRlcGxveW1lbnRJZCAmJiAhdGhpcy5wcm9wcy5kYXRhLmV4ZWN1dGlvbklkID8gPHRoPkRlcGxveW1lbnQ8L3RoPiA6ICcnfVxuICAgICAgICAgICAgICAgICAgICAgICAgeyAhdGhpcy5wcm9wcy5kYXRhLmV4ZWN1dGlvbklkID8gPHRoPldvcmtmbG93PC90aD4gOiAnJ31cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5FdmVudCBUeXBlPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5UaW1lc3RhbXA8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk9wZXJhdGlvbjwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+Tm9kZSBOYW1lPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5Ob2RlIElkPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5NZXNzYWdlPC90aD5cbiAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmRhdGEuaXRlbXMubWFwKChpdGVtKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ciBrZXk9e2l0ZW0uaWR9IGNsYXNzTmFtZT17J3JvdyAnICsgKGl0ZW0uaXNTZWxlY3RlZCA/ICdhY3RpdmUnIDogJycpfSBvbkNsaWNrPXt0aGlzLl9zZWxlY3RFdmVudC5iaW5kKHRoaXMsaXRlbSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyF0aGlzLnByb3BzLmRhdGEuYmx1ZXByaW50SWQgJiYgIXRoaXMucHJvcHMuZGF0YS5kZXBsb3ltZW50SWQgJiYgIXRoaXMucHJvcHMuZGF0YS5leGVjdXRpb25JZCA/IDx0ZD57aXRlbS5jb250ZXh0LmJsdWVwcmludF9pZH08L3RkPiA6ICcnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyF0aGlzLnByb3BzLmRhdGEuZGVwbG95bWVudElkICYmICF0aGlzLnByb3BzLmRhdGEuZXhlY3V0aW9uSWQgPyA8dGQ+e2l0ZW0uY29udGV4dC5kZXBsb3ltZW50X2lkfTwvdGQ+IDogJyd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ICF0aGlzLnByb3BzLmRhdGEuZXhlY3V0aW9uSWQgPyA8dGQ+e2l0ZW0uY29udGV4dC53b3JrZmxvd19pZH08L3RkPiA6ICcnIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPntpdGVtLmV2ZW50X3R5cGV9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57aXRlbS50aW1lc3RhbXB9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57aXRlbS5jb250ZXh0Lm9wZXJhdGlvbn08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPntpdGVtLmNvbnRleHQubm9kZV9uYW1lfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e2l0ZW0uY29udGV4dC5ub2RlX2lkfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e2l0ZW0ubWVzc2FnZS50ZXh0fTwvdGQ+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkga2lubmVyZXR6aW4gb24gMDcvMDkvMjAxNi5cbiAqL1xuXG5pbXBvcnQgRXZlbnRzVGFibGUgZnJvbSAnLi9FdmVudHNUYWJsZSc7XG5cblN0YWdlLmFkZFBsdWdpbih7XG4gICAgaWQ6ICdldmVudHMnLFxuICAgIG5hbWU6IFwiRGVwbG95bWVudCBFdmVudHNcIixcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaW5pdGlhbFdpZHRoOiA1LFxuICAgIGluaXRpYWxIZWlnaHQ6IDQsXG4gICAgY29sb3I6IFwiZ3JlZW5cIixcbiAgICBmZXRjaFVybDogJ1ttYW5hZ2VyXS9hcGkvdjIuMS9ldmVudHMnLFxuICAgIGlzUmVhY3Q6IHRydWUsXG4gICAgcmVuZGVyOiBmdW5jdGlvbih3aWRnZXQsZGF0YSxlcnJvcixjb250ZXh0LHBsdWdpblV0aWxzKSB7XG4gICAgICAgIHZhciBmb3JtYXR0ZWREYXRhID0gT2JqZWN0LmFzc2lnbih7fSxkYXRhLHtcbiAgICAgICAgICAgIGl0ZW1zOiBfLmZpbHRlcihkYXRhLml0ZW1zLChpdGVtKT0+e3JldHVybiBpdGVtLmV2ZW50X3R5cGUgIT09IHVuZGVmaW5lZDt9KVxuICAgICAgICB9KTtcbiAgICAgICAgdmFyIGRlcGxveW1lbnRJZCA9IGNvbnRleHQuZ2V0VmFsdWUoJ2RlcGxveW1lbnRJZCcpO1xuICAgICAgICB2YXIgYmx1ZXByaW50SWQgPSBjb250ZXh0LmdldFZhbHVlKCdibHVlcHJpbnRJZCcpO1xuICAgICAgICB2YXIgZXhlY3V0aW9uSWQgPSBjb250ZXh0LmdldFZhbHVlKCdleGVjdXRpb25JZCcpO1xuXG4gICAgICAgIGlmIChleGVjdXRpb25JZCkge1xuICAgICAgICAgICAgZm9ybWF0dGVkRGF0YS5pdGVtcyA9IF8uZmlsdGVyKGZvcm1hdHRlZERhdGEuaXRlbXMsIChpdGVtKT0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5jb250ZXh0LmV4ZWN1dGlvbl9pZCA9PT0gZXhlY3V0aW9uSWQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChkZXBsb3ltZW50SWQpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZERhdGEuaXRlbXMgPSBfLmZpbHRlcihmb3JtYXR0ZWREYXRhLml0ZW1zLChpdGVtKT0+e1xuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLmNvbnRleHQuZGVwbG95bWVudF9pZCA9PT0gZGVwbG95bWVudElkO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoYmx1ZXByaW50SWQpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZERhdGEuaXRlbXMgPSBfLmZpbHRlcihmb3JtYXR0ZWREYXRhLml0ZW1zLChpdGVtKT0+e1xuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLmNvbnRleHQuYmx1ZXByaW50X2lkID09PSBibHVlcHJpbnRJZDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9ybWF0dGVkRGF0YSA9IE9iamVjdC5hc3NpZ24oe30sZm9ybWF0dGVkRGF0YSx7XG4gICAgICAgICAgICBpdGVtczogXy5tYXAgKGZvcm1hdHRlZERhdGEuaXRlbXMsKGl0ZW0pPT57XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30saXRlbSx7XG4gICAgICAgICAgICAgICAgICAgIGlkOiBpdGVtLnR5cGUraXRlbS50aW1lc3RhbXAsXG4gICAgICAgICAgICAgICAgICAgIHRpbWVzdGFtcDogcGx1Z2luVXRpbHMubW9tZW50KGl0ZW0udGltZXN0YW1wLCdZWVlZLU1NLUREIEhIOm1tOnNzLlNTUytTU1MnKS5mb3JtYXQoJ0RELU1NLVlZWVkgSEg6bW0nKSAvLzIwMTYtMDctMjAgMDk6MTA6NTMuMTAzKzAwMFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcblxuICAgICAgICBmb3JtYXR0ZWREYXRhLmJsdWVwcmludElkID0gYmx1ZXByaW50SWQ7XG4gICAgICAgIGZvcm1hdHRlZERhdGEuZGVwbG95bWVudElkID0gZGVwbG95bWVudElkO1xuICAgICAgICBmb3JtYXR0ZWREYXRhLmV4ZWN1dGlvbklkID0gZXhlY3V0aW9uSWQ7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxFdmVudHNUYWJsZSB3aWRnZXQ9e3dpZGdldH0gZGF0YT17Zm9ybWF0dGVkRGF0YX0gY29udGV4dD17Y29udGV4dH0gdXRpbHM9e3BsdWdpblV0aWxzfS8+XG4gICAgICAgICk7XG5cbiAgICB9XG59KTsiXX0=
