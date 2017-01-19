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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3aWRnZXRzXFxsb2dzXFxzcmNcXExvZ3NUYWJsZS5qcyIsIndpZGdldHNcXGxvZ3NcXHNyY1xcd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7OztBQUtJLG9CQUFZLEtBQVosRUFBbUIsT0FBbkIsRUFBNEI7QUFBQTs7QUFBQSxvSEFDbEIsS0FEa0IsRUFDWCxPQURXOztBQUd4QixjQUFLLEtBQUwsR0FBYSxFQUFiO0FBSHdCO0FBSzNCOzs7O3VDQUVjO0FBQ1gsaUJBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsT0FBbkI7QUFDSDs7OzRDQUVtQjtBQUNoQixpQkFBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixXQUFuQixHQUFpQyxFQUFqQyxDQUFvQyxnQkFBcEMsRUFBc0QsS0FBSyxZQUEzRCxFQUF5RSxJQUF6RTtBQUNIOzs7K0NBRXNCO0FBQ25CLGlCQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLFdBQW5CLEdBQWlDLEdBQWpDLENBQXFDLGdCQUFyQyxFQUF1RCxLQUFLLFlBQTVEO0FBQ0g7OztxQ0FHWSxJLEVBQU07QUFDZixnQkFBSSxxQkFBcUIsS0FBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixVQUFuQixHQUFnQyxRQUFoQyxDQUF5QyxTQUF6QyxDQUF6QjtBQUNBLGlCQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLFVBQW5CLEdBQWdDLFFBQWhDLENBQXlDLFNBQXpDLEVBQW1ELEtBQUssRUFBTCxLQUFZLGtCQUFaLEdBQWlDLElBQWpDLEdBQXdDLEtBQUssRUFBaEc7QUFDSDs7O2lDQUVRO0FBQUE7O0FBQ0wsZ0JBQUksZUFBZSxNQUFNLEtBQU4sQ0FBWSxZQUEvQjs7QUFFQSxtQkFDSTtBQUFBO0FBQUE7QUFDSSxvQ0FBQyxZQUFELElBQWMsT0FBTyxLQUFLLEtBQUwsQ0FB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QXRDO0FBQ0gsYUFGcUIsQ0FBdEI7QUFHSCxTQUpNLE1BSUEsSUFBSSxXQUFKLEVBQWlCO0FBQ3BCLDBCQUFjLEtBQWQsR0FBc0IsRUFBRSxNQUFGLENBQVMsY0FBYyxLQUF2QixFQUE2QixVQUFDLElBQUQsRUFBUTtBQUN2RCx1QkFBTyxLQUFLLE9BQUwsQ0FBYSxZQUFiLEtBQThCLFdBQXJDO0FBQ0gsYUFGcUIsQ0FBdEI7QUFHSDs7QUFFRCxZQUFJLFFBQU0sQ0FBVjtBQUNBLHdCQUFnQixPQUFPLE1BQVAsQ0FBYyxFQUFkLEVBQWlCLGFBQWpCLEVBQStCO0FBQzNDLG1CQUFPLEVBQUUsR0FBRixDQUFPLGNBQWMsS0FBckIsRUFBMkIsVUFBQyxJQUFELEVBQVE7QUFDdEMsdUJBQU8sT0FBTyxNQUFQLENBQWMsRUFBZCxFQUFpQixJQUFqQixFQUFzQjtBQUN6Qix3QkFBSSxPQURxQjtBQUV6QiwrQkFBVyxPQUFPLEtBQUssU0FBWixFQUFzQiw2QkFBdEIsRUFBcUQsTUFBckQsQ0FBNEQsa0JBQTVELENBRmMsQ0FFa0U7QUFGbEUsaUJBQXRCLENBQVA7QUFJSCxhQUxNO0FBRG9DLFNBQS9CLENBQWhCOztBQVNBLHNCQUFjLFdBQWQsR0FBNEIsV0FBNUI7QUFDQSxzQkFBYyxZQUFkLEdBQTZCLFlBQTdCO0FBQ0Esc0JBQWMsV0FBZCxHQUE0QixXQUE1Qjs7QUFFQSxlQUNJLDJDQUFXLFFBQVEsTUFBbkIsRUFBMkIsTUFBTSxhQUFqQyxFQUFnRCxTQUFTLE9BQXpELEdBREo7QUFJSDtBQXpEYyxDQUFuQixFLENBTkEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkga2lubmVyZXR6aW4gb24gMjAvMTAvMjAxNi5cclxuICovXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgX3JlZnJlc2hEYXRhKCkge1xyXG4gICAgICAgIHRoaXMucHJvcHMudG9vbGJveC5yZWZyZXNoKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgdGhpcy5wcm9wcy50b29sYm94LmdldEV2ZW50QnVzKCkub24oJ2V2ZW50czpyZWZyZXNoJywgdGhpcy5fcmVmcmVzaERhdGEsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xyXG4gICAgICAgIHRoaXMucHJvcHMudG9vbGJveC5nZXRFdmVudEJ1cygpLm9mZignZXZlbnRzOnJlZnJlc2gnLCB0aGlzLl9yZWZyZXNoRGF0YSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIF9zZWxlY3RFdmVudChpdGVtKSB7XHJcbiAgICAgICAgdmFyIG9sZFNlbGVjdGVkRXZlbnRJZCA9IHRoaXMucHJvcHMudG9vbGJveC5nZXRDb250ZXh0KCkuZ2V0VmFsdWUoJ2V2ZW50SWQnKTtcclxuICAgICAgICB0aGlzLnByb3BzLnRvb2xib3guZ2V0Q29udGV4dCgpLnNldFZhbHVlKCdldmVudElkJyxpdGVtLmlkID09PSBvbGRTZWxlY3RlZEV2ZW50SWQgPyBudWxsIDogaXRlbS5pZCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICB2YXIgRXJyb3JNZXNzYWdlID0gU3RhZ2UuQmFzaWMuRXJyb3JNZXNzYWdlO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPEVycm9yTWVzc2FnZSBlcnJvcj17dGhpcy5zdGF0ZS5lcnJvcn0vPlxyXG5cclxuICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJ1aSB2ZXJ5IGNvbXBhY3QgdGFibGUgbG9nc1RhYmxlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRoZWFkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgeyF0aGlzLnByb3BzLmRhdGEuYmx1ZXByaW50SWQgJiYgIXRoaXMucHJvcHMuZGF0YS5kZXBsb3ltZW50SWQgJiYgIXRoaXMucHJvcHMuZGF0YS5leGVjdXRpb25JZCA/IDx0aD5CbHVlcHJpbnQ8L3RoPiA6ICcnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7IXRoaXMucHJvcHMuZGF0YS5kZXBsb3ltZW50SWQgJiYgIXRoaXMucHJvcHMuZGF0YS5leGVjdXRpb25JZCA/IDx0aD5EZXBsb3ltZW50PC90aD4gOiAnJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgeyAhdGhpcy5wcm9wcy5kYXRhLmV4ZWN1dGlvbklkID8gPHRoPldvcmtmbG93PC90aD4gOiAnJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkxvZyBMZXZlbDwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5UaW1lc3RhbXA8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+T3BlcmF0aW9uPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk5vZGUgTmFtZTwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5Ob2RlIElkPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk1lc3NhZ2U8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmRhdGEuaXRlbXMubWFwKChpdGVtKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHIga2V5PXtpdGVtLmlkfSBjbGFzc05hbWU9eydyb3cgJyArIChpdGVtLmlzU2VsZWN0ZWQgPyAnYWN0aXZlJyA6ICcnKX0gb25DbGljaz17dGhpcy5fc2VsZWN0RXZlbnQuYmluZCh0aGlzLGl0ZW0pfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyF0aGlzLnByb3BzLmRhdGEuYmx1ZXByaW50SWQgJiYgIXRoaXMucHJvcHMuZGF0YS5kZXBsb3ltZW50SWQgJiYgIXRoaXMucHJvcHMuZGF0YS5leGVjdXRpb25JZCA/IDx0ZD57aXRlbS5jb250ZXh0LmJsdWVwcmludF9pZH08L3RkPiA6ICcnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IXRoaXMucHJvcHMuZGF0YS5kZXBsb3ltZW50SWQgJiYgIXRoaXMucHJvcHMuZGF0YS5leGVjdXRpb25JZCA/IDx0ZD57aXRlbS5jb250ZXh0LmRlcGxveW1lbnRfaWR9PC90ZD4gOiAnJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyAhdGhpcy5wcm9wcy5kYXRhLmV4ZWN1dGlvbklkID8gPHRkPntpdGVtLmNvbnRleHQud29ya2Zsb3dfaWR9PC90ZD4gOiAnJyB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e2l0ZW0ubGV2ZWx9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPntpdGVtLnRpbWVzdGFtcH08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e2l0ZW0uY29udGV4dC5vcGVyYXRpb259PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPntpdGVtLmNvbnRleHQubm9kZV9uYW1lfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57aXRlbS5jb250ZXh0Lm5vZGVfaWR9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPntpdGVtLm1lc3NhZ2UudGV4dH08L3RkPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cclxuICAgICAgICAgICAgICAgIDwvdGFibGU+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkga2lubmVyZXR6aW4gb24gMDcvMDkvMjAxNi5cclxuICovXHJcblxyXG5pbXBvcnQgTG9nc1RhYmxlIGZyb20gJy4vTG9nc1RhYmxlJztcclxuXHJcblN0YWdlLmRlZmluZVdpZGdldCh7XHJcbiAgICBpZDogJ2xvZ3MnLFxyXG4gICAgbmFtZTogXCJEZXBsb3ltZW50IExvZ3NcIixcclxuICAgIGRlc2NyaXB0aW9uOiAnJyxcclxuICAgIGluaXRpYWxXaWR0aDogNSxcclxuICAgIGluaXRpYWxIZWlnaHQ6IDQsXHJcbiAgICBjb2xvcjogXCJwdXJwbGVcIixcclxuICAgIGZldGNoVXJsOiAnW21hbmFnZXJdL2V2ZW50cycsXHJcbiAgICBpc1JlYWN0OiB0cnVlLFxyXG4gICAgaW5pdGlhbENvbmZpZ3VyYXRpb246IFtcclxuICAgICAgICB7aWQ6IFwicG9sbGluZ1RpbWVcIiwgZGVmYXVsdDogMn1cclxuICAgIF0sXHJcblxyXG4gICAgcmVuZGVyOiBmdW5jdGlvbih3aWRnZXQsZGF0YSxlcnJvcix0b29sYm94KSB7XHJcbiAgICAgICAgaWYgKF8uaXNFbXB0eShkYXRhKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gPFN0YWdlLkJhc2ljLkxvYWRpbmcvPjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBmb3JtYXR0ZWREYXRhID0gT2JqZWN0LmFzc2lnbih7fSxkYXRhLHtcclxuICAgICAgICAgICAgaXRlbXM6IF8uZmlsdGVyKGRhdGEuaXRlbXMsKGl0ZW0pPT57cmV0dXJuIGl0ZW0udHlwZSA9PT0gJ2Nsb3VkaWZ5X2xvZyc7fSkgLy8gQ2FuIG1heWJlIGNoYW5nZSB0byBpdGVtLmxldmVsICE9PSB1bmRlZmluZWRcclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgZGVwbG95bWVudElkID0gdG9vbGJveC5nZXRDb250ZXh0KCkuZ2V0VmFsdWUoJ2RlcGxveW1lbnRJZCcpO1xyXG4gICAgICAgIHZhciBibHVlcHJpbnRJZCA9IHRvb2xib3guZ2V0Q29udGV4dCgpLmdldFZhbHVlKCdibHVlcHJpbnRJZCcpO1xyXG4gICAgICAgIHZhciBleGVjdXRpb25JZCA9IHRvb2xib3guZ2V0Q29udGV4dCgpLmdldFZhbHVlKCdleGVjdXRpb25JZCcpO1xyXG5cclxuICAgICAgICBpZiAoZXhlY3V0aW9uSWQpIHtcclxuICAgICAgICAgICAgZm9ybWF0dGVkRGF0YS5pdGVtcyA9IF8uZmlsdGVyKGZvcm1hdHRlZERhdGEuaXRlbXMsIChpdGVtKT0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLmNvbnRleHQuZXhlY3V0aW9uX2lkID09PSBleGVjdXRpb25JZDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChkZXBsb3ltZW50SWQpIHtcclxuICAgICAgICAgICAgZm9ybWF0dGVkRGF0YS5pdGVtcyA9IF8uZmlsdGVyKGZvcm1hdHRlZERhdGEuaXRlbXMsKGl0ZW0pPT57XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5jb250ZXh0LmRlcGxveW1lbnRfaWQgPT09IGRlcGxveW1lbnRJZDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChibHVlcHJpbnRJZCkge1xyXG4gICAgICAgICAgICBmb3JtYXR0ZWREYXRhLml0ZW1zID0gXy5maWx0ZXIoZm9ybWF0dGVkRGF0YS5pdGVtcywoaXRlbSk9PntcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLmNvbnRleHQuYmx1ZXByaW50X2lkID09PSBibHVlcHJpbnRJZDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgaW5kZXg9MDtcclxuICAgICAgICBmb3JtYXR0ZWREYXRhID0gT2JqZWN0LmFzc2lnbih7fSxmb3JtYXR0ZWREYXRhLHtcclxuICAgICAgICAgICAgaXRlbXM6IF8ubWFwIChmb3JtYXR0ZWREYXRhLml0ZW1zLChpdGVtKT0+e1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30saXRlbSx7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGluZGV4KyssXHJcbiAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wOiBtb21lbnQoaXRlbS50aW1lc3RhbXAsJ1lZWVktTU0tREQgSEg6bW06c3MuU1NTK1NTUycpLmZvcm1hdCgnREQtTU0tWVlZWSBISDptbScpIC8vMjAxNi0wNy0yMCAwOToxMDo1My4xMDMrMDAwXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmb3JtYXR0ZWREYXRhLmJsdWVwcmludElkID0gYmx1ZXByaW50SWQ7XHJcbiAgICAgICAgZm9ybWF0dGVkRGF0YS5kZXBsb3ltZW50SWQgPSBkZXBsb3ltZW50SWQ7XHJcbiAgICAgICAgZm9ybWF0dGVkRGF0YS5leGVjdXRpb25JZCA9IGV4ZWN1dGlvbklkO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8TG9nc1RhYmxlIHdpZGdldD17d2lkZ2V0fSBkYXRhPXtmb3JtYXR0ZWREYXRhfSB0b29sYm94PXt0b29sYm94fS8+XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICB9XHJcbn0pOyJdfQ==
