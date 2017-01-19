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

var EventsTable = function (_React$Component) {
    _inherits(EventsTable, _React$Component);

    function EventsTable(props, context) {
        _classCallCheck(this, EventsTable);

        var _this = _possibleConstructorReturn(this, (EventsTable.__proto__ || Object.getPrototypeOf(EventsTable)).call(this, props, context));

        _this.state = {};
        return _this;
    }

    _createClass(EventsTable, [{
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

            var filteredColumnsTitles = [];
            if (!this.props.data.blueprintId && !this.props.data.deploymentId && !this.props.data.executionId) filteredColumnsTitles.push(React.createElement(
                'th',
                { key: 'blueprintHeader' },
                'Blueprint'
            ));
            if (!this.props.data.deploymentId && !this.props.data.executionId) filteredColumnsTitles.push(React.createElement(
                'th',
                { key: 'deploymentHeader' },
                'Deployment'
            ));
            if (!this.props.data.executionId) filteredColumnsTitles.push(React.createElement(
                'th',
                { key: 'workflowHeader' },
                'Workflow'
            ));

            return React.createElement(
                'div',
                null,
                React.createElement(ErrorMessage, { error: this.state.error }),
                React.createElement(
                    'table',
                    { className: 'ui very compact table eventsTable' },
                    React.createElement(
                        'thead',
                        null,
                        React.createElement(
                            'tr',
                            null,
                            filteredColumnsTitles,
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
                            var filteredColumns = [];

                            if (!_this2.props.data.blueprintId && !_this2.props.data.deploymentId && !_this2.props.data.executionId) filteredColumns.push(React.createElement(
                                'td',
                                { key: 'blueprint' },
                                item.context.blueprint_id
                            ));
                            if (!_this2.props.data.deploymentId && !_this2.props.data.executionId) filteredColumns.push(React.createElement(
                                'td',
                                { key: 'deployment' },
                                item.context.deployment_id
                            ));
                            if (!_this2.props.data.executionId) filteredColumns.push(React.createElement(
                                'td',
                                { key: 'workflow' },
                                item.context.workflow_id
                            ));

                            return React.createElement(
                                'tr',
                                { key: item.id, className: 'row ' + (item.isSelected ? 'active' : ''), onClick: _this2._selectEvent.bind(_this2, item) },
                                filteredColumns,
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

    return EventsTable;
}(React.Component);

exports.default = EventsTable;

},{}],2:[function(require,module,exports){
'use strict';

var _EventsTable = require('./EventsTable');

var _EventsTable2 = _interopRequireDefault(_EventsTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Stage.defineWidget({
    id: 'events',
    name: "Deployment Events",
    description: '',
    initialWidth: 5,
    initialHeight: 4,
    color: "green",
    fetchUrl: '[manager]/events',
    isReact: true,
    initialConfiguration: [{ id: "pollingTime", default: 2 }],

    render: function render(widget, data, error, toolbox) {
        if (_.isEmpty(data)) {
            return React.createElement(Stage.Basic.Loading, null);
        }

        var formattedData = Object.assign({}, data, {
            items: _.filter(data.items, function (item) {
                return item.type === 'cloudify_event';
            })
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

        return React.createElement(_EventsTable2.default, { widget: widget, data: formattedData, toolbox: toolbox });
    }
}); /**
     * Created by kinneretzin on 07/09/2016.
     */

},{"./EventsTable":1}]},{},[1,2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3aWRnZXRzXFxldmVudHNcXHNyY1xcRXZlbnRzVGFibGUuanMiLCJ3aWRnZXRzXFxldmVudHNcXHNyY1xcd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUNBQTs7OztJQUlxQixXOzs7QUFDakIseUJBQVksS0FBWixFQUFtQixPQUFuQixFQUE0QjtBQUFBOztBQUFBLDhIQUNsQixLQURrQixFQUNYLE9BRFc7O0FBR3hCLGNBQUssS0FBTCxHQUFhLEVBQWI7QUFId0I7QUFLM0I7Ozs7dUNBRWM7QUFDWCxpQkFBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixPQUFuQjtBQUNIOzs7NENBRW1CO0FBQ2hCLGlCQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLFdBQW5CLEdBQWlDLEVBQWpDLENBQW9DLGdCQUFwQyxFQUFzRCxLQUFLLFlBQTNELEVBQXlFLElBQXpFO0FBQ0g7OzsrQ0FFc0I7QUFDbkIsaUJBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsV0FBbkIsR0FBaUMsR0FBakMsQ0FBcUMsZ0JBQXJDLEVBQXVELEtBQUssWUFBNUQ7QUFDSDs7O3FDQUdZLEksRUFBTTtBQUNmLGdCQUFJLHFCQUFxQixLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLFVBQW5CLEdBQWdDLFFBQWhDLENBQXlDLFNBQXpDLENBQXpCO0FBQ0EsaUJBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsVUFBbkIsR0FBZ0MsUUFBaEMsQ0FBeUMsU0FBekMsRUFBbUQsS0FBSyxFQUFMLEtBQVksa0JBQVosR0FBaUMsSUFBakMsR0FBd0MsS0FBSyxFQUFoRztBQUNIOzs7aUNBRVE7QUFBQTs7QUFDTCxnQkFBSSxlQUFlLE1BQU0sS0FBTixDQUFZLFlBQS9COztBQUVBLGdCQUFJLHdCQUF3QixFQUE1QjtBQUNBLGdCQUFJLENBQUMsS0FBSyxL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QUFrRCxTQUFTLE9BQTNELEdBREo7QUFJSDtBQXpEYyxDQUFuQixFLENBTkEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkga2lubmVyZXR6aW4gb24gMjAvMTAvMjAxNi5cclxuICovXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFdmVudHNUYWJsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgX3JlZnJlc2hEYXRhKCkge1xyXG4gICAgICAgIHRoaXMucHJvcHMudG9vbGJveC5yZWZyZXNoKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgdGhpcy5wcm9wcy50b29sYm94LmdldEV2ZW50QnVzKCkub24oJ2V2ZW50czpyZWZyZXNoJywgdGhpcy5fcmVmcmVzaERhdGEsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xyXG4gICAgICAgIHRoaXMucHJvcHMudG9vbGJveC5nZXRFdmVudEJ1cygpLm9mZignZXZlbnRzOnJlZnJlc2gnLCB0aGlzLl9yZWZyZXNoRGF0YSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIF9zZWxlY3RFdmVudChpdGVtKSB7XHJcbiAgICAgICAgdmFyIG9sZFNlbGVjdGVkRXZlbnRJZCA9IHRoaXMucHJvcHMudG9vbGJveC5nZXRDb250ZXh0KCkuZ2V0VmFsdWUoJ2V2ZW50SWQnKTtcclxuICAgICAgICB0aGlzLnByb3BzLnRvb2xib3guZ2V0Q29udGV4dCgpLnNldFZhbHVlKCdldmVudElkJyxpdGVtLmlkID09PSBvbGRTZWxlY3RlZEV2ZW50SWQgPyBudWxsIDogaXRlbS5pZCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICB2YXIgRXJyb3JNZXNzYWdlID0gU3RhZ2UuQmFzaWMuRXJyb3JNZXNzYWdlO1xyXG5cclxuICAgICAgICB2YXIgZmlsdGVyZWRDb2x1bW5zVGl0bGVzID0gW107XHJcbiAgICAgICAgaWYgKCF0aGlzLnByb3BzLmRhdGEuYmx1ZXByaW50SWQgJiYgIXRoaXMucHJvcHMuZGF0YS5kZXBsb3ltZW50SWQgJiYgIXRoaXMucHJvcHMuZGF0YS5leGVjdXRpb25JZCkgZmlsdGVyZWRDb2x1bW5zVGl0bGVzLnB1c2goPHRoIGtleT0nYmx1ZXByaW50SGVhZGVyJz5CbHVlcHJpbnQ8L3RoPik7XHJcbiAgICAgICAgaWYgKCF0aGlzLnByb3BzLmRhdGEuZGVwbG95bWVudElkICYmICF0aGlzLnByb3BzLmRhdGEuZXhlY3V0aW9uSWQpIGZpbHRlcmVkQ29sdW1uc1RpdGxlcy5wdXNoKDx0aCBrZXk9J2RlcGxveW1lbnRIZWFkZXInPkRlcGxveW1lbnQ8L3RoPik7XHJcbiAgICAgICAgaWYgKCF0aGlzLnByb3BzLmRhdGEuZXhlY3V0aW9uSWQgKSBmaWx0ZXJlZENvbHVtbnNUaXRsZXMucHVzaCggPHRoIGtleT0nd29ya2Zsb3dIZWFkZXInPldvcmtmbG93PC90aD4pO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPEVycm9yTWVzc2FnZSBlcnJvcj17dGhpcy5zdGF0ZS5lcnJvcn0vPlxyXG5cclxuICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJ1aSB2ZXJ5IGNvbXBhY3QgdGFibGUgZXZlbnRzVGFibGVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8dGhlYWQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7ZmlsdGVyZWRDb2x1bW5zVGl0bGVzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+RXZlbnQgVHlwZTwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5UaW1lc3RhbXA8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+T3BlcmF0aW9uPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk5vZGUgTmFtZTwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5Ob2RlIElkPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk1lc3NhZ2U8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmRhdGEuaXRlbXMubWFwKChpdGVtKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbHRlcmVkQ29sdW1ucyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5wcm9wcy5kYXRhLmJsdWVwcmludElkICYmICF0aGlzLnByb3BzLmRhdGEuZGVwbG95bWVudElkICYmICF0aGlzLnByb3BzLmRhdGEuZXhlY3V0aW9uSWQpIGZpbHRlcmVkQ29sdW1ucy5wdXNoKDx0ZCBrZXk9J2JsdWVwcmludCc+e2l0ZW0uY29udGV4dC5ibHVlcHJpbnRfaWR9PC90ZD4pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnByb3BzLmRhdGEuZGVwbG95bWVudElkICYmICF0aGlzLnByb3BzLmRhdGEuZXhlY3V0aW9uSWQpZmlsdGVyZWRDb2x1bW5zLnB1c2goIDx0ZCBrZXk9J2RlcGxveW1lbnQnPntpdGVtLmNvbnRleHQuZGVwbG95bWVudF9pZH08L3RkPik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMucHJvcHMuZGF0YS5leGVjdXRpb25JZCkgZmlsdGVyZWRDb2x1bW5zLnB1c2goIDx0ZCBrZXk9J3dvcmtmbG93Jz57aXRlbS5jb250ZXh0LndvcmtmbG93X2lkfTwvdGQ+KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ciBrZXk9e2l0ZW0uaWR9IGNsYXNzTmFtZT17J3JvdyAnICsgKGl0ZW0uaXNTZWxlY3RlZCA/ICdhY3RpdmUnIDogJycpfSBvbkNsaWNrPXt0aGlzLl9zZWxlY3RFdmVudC5iaW5kKHRoaXMsaXRlbSl9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZmlsdGVyZWRDb2x1bW5zfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e2l0ZW0uZXZlbnRfdHlwZX08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e2l0ZW0udGltZXN0YW1wfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57aXRlbS5jb250ZXh0Lm9wZXJhdGlvbn08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e2l0ZW0uY29udGV4dC5ub2RlX25hbWV9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPntpdGVtLmNvbnRleHQubm9kZV9pZH08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e2l0ZW0ubWVzc2FnZS50ZXh0fTwvdGQ+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxyXG4gICAgICAgICAgICAgICAgPC90YWJsZT5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBraW5uZXJldHppbiBvbiAwNy8wOS8yMDE2LlxyXG4gKi9cclxuXHJcbmltcG9ydCBFdmVudHNUYWJsZSBmcm9tICcuL0V2ZW50c1RhYmxlJztcclxuXHJcblN0YWdlLmRlZmluZVdpZGdldCh7XHJcbiAgICBpZDogJ2V2ZW50cycsXHJcbiAgICBuYW1lOiBcIkRlcGxveW1lbnQgRXZlbnRzXCIsXHJcbiAgICBkZXNjcmlwdGlvbjogJycsXHJcbiAgICBpbml0aWFsV2lkdGg6IDUsXHJcbiAgICBpbml0aWFsSGVpZ2h0OiA0LFxyXG4gICAgY29sb3I6IFwiZ3JlZW5cIixcclxuICAgIGZldGNoVXJsOiAnW21hbmFnZXJdL2V2ZW50cycsXHJcbiAgICBpc1JlYWN0OiB0cnVlLFxyXG4gICAgaW5pdGlhbENvbmZpZ3VyYXRpb246IFtcclxuICAgICAgICB7aWQ6IFwicG9sbGluZ1RpbWVcIiwgZGVmYXVsdDogMn1cclxuICAgIF0sXHJcblxyXG4gICAgcmVuZGVyOiBmdW5jdGlvbih3aWRnZXQsZGF0YSxlcnJvcix0b29sYm94KSB7XHJcbiAgICAgICAgaWYgKF8uaXNFbXB0eShkYXRhKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gPFN0YWdlLkJhc2ljLkxvYWRpbmcvPjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBmb3JtYXR0ZWREYXRhID0gT2JqZWN0LmFzc2lnbih7fSxkYXRhLHtcclxuICAgICAgICAgICAgaXRlbXM6IF8uZmlsdGVyKGRhdGEuaXRlbXMsKGl0ZW0pPT57cmV0dXJuIGl0ZW0udHlwZSA9PT0gJ2Nsb3VkaWZ5X2V2ZW50Jzt9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZhciBkZXBsb3ltZW50SWQgPSB0b29sYm94LmdldENvbnRleHQoKS5nZXRWYWx1ZSgnZGVwbG95bWVudElkJyk7XHJcbiAgICAgICAgdmFyIGJsdWVwcmludElkID0gdG9vbGJveC5nZXRDb250ZXh0KCkuZ2V0VmFsdWUoJ2JsdWVwcmludElkJyk7XHJcbiAgICAgICAgdmFyIGV4ZWN1dGlvbklkID0gdG9vbGJveC5nZXRDb250ZXh0KCkuZ2V0VmFsdWUoJ2V4ZWN1dGlvbklkJyk7XHJcblxyXG4gICAgICAgIGlmIChleGVjdXRpb25JZCkge1xyXG4gICAgICAgICAgICBmb3JtYXR0ZWREYXRhLml0ZW1zID0gXy5maWx0ZXIoZm9ybWF0dGVkRGF0YS5pdGVtcywgKGl0ZW0pPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uY29udGV4dC5leGVjdXRpb25faWQgPT09IGV4ZWN1dGlvbklkO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKGRlcGxveW1lbnRJZCkge1xyXG4gICAgICAgICAgICBmb3JtYXR0ZWREYXRhLml0ZW1zID0gXy5maWx0ZXIoZm9ybWF0dGVkRGF0YS5pdGVtcywoaXRlbSk9PntcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLmNvbnRleHQuZGVwbG95bWVudF9pZCA9PT0gZGVwbG95bWVudElkO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKGJsdWVwcmludElkKSB7XHJcbiAgICAgICAgICAgIGZvcm1hdHRlZERhdGEuaXRlbXMgPSBfLmZpbHRlcihmb3JtYXR0ZWREYXRhLml0ZW1zLChpdGVtKT0+e1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uY29udGV4dC5ibHVlcHJpbnRfaWQgPT09IGJsdWVwcmludElkO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBpbmRleCA9MDtcclxuICAgICAgICBmb3JtYXR0ZWREYXRhID0gT2JqZWN0LmFzc2lnbih7fSxmb3JtYXR0ZWREYXRhLHtcclxuICAgICAgICAgICAgaXRlbXM6IF8ubWFwIChmb3JtYXR0ZWREYXRhLml0ZW1zLChpdGVtKT0+e1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30saXRlbSx7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGluZGV4KyssXHJcbiAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wOiBtb21lbnQoaXRlbS50aW1lc3RhbXAsJ1lZWVktTU0tREQgSEg6bW06c3MuU1NTK1NTUycpLmZvcm1hdCgnREQtTU0tWVlZWSBISDptbScpIC8vMjAxNi0wNy0yMCAwOToxMDo1My4xMDMrMDAwXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmb3JtYXR0ZWREYXRhLmJsdWVwcmludElkID0gYmx1ZXByaW50SWQ7XHJcbiAgICAgICAgZm9ybWF0dGVkRGF0YS5kZXBsb3ltZW50SWQgPSBkZXBsb3ltZW50SWQ7XHJcbiAgICAgICAgZm9ybWF0dGVkRGF0YS5leGVjdXRpb25JZCA9IGV4ZWN1dGlvbklkO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8RXZlbnRzVGFibGUgd2lkZ2V0PXt3aWRnZXR9IGRhdGE9e2Zvcm1hdHRlZERhdGF9IHRvb2xib3g9e3Rvb2xib3h9Lz5cclxuICAgICAgICApO1xyXG5cclxuICAgIH1cclxufSk7Il19
