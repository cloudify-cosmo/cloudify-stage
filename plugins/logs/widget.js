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

Stage.addPlugin({
    id: 'logs',
    name: "Deployment Logs",
    description: '',
    initialWidth: 5,
    initialHeight: 4,
    color: "purple",
    fetchUrl: '[manager]/api/v2.1/events',
    isReact: true,
    render: function render(widget, data, error, context, pluginUtils) {
        var formattedData = Object.assign({}, data, {
            items: _.filter(data.items, function (item) {
                return item.event_type === undefined;
            }) // Can maybe change to item.level !== undefined
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

        return React.createElement(_LogsTable2.default, { widget: widget, data: formattedData, context: context, utils: pluginUtils });
    }
}); /**
     * Created by kinneretzin on 07/09/2016.
     */

},{"./LogsTable":1}]},{},[1,2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwbHVnaW5zL2xvZ3Mvc3JjL0xvZ3NUYWJsZS5qcyIsInBsdWdpbnMvbG9ncy9zcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7OztBQUtJLG9CQUFZLEtBQVosRUFBbUIsT0FBbkIsRUFBNEI7QUFBQTs7QUFBQSxvSEFDbEIsS0FEa0IsRUFDWCxPQURXOztBQUd4QixjQUFLLEtBQUwsR0FBYSxFQUFiO0FBSHdCO0FBSzNCOzs7O3VDQUVjO0FBQ1gsaUJBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsT0FBbkI7QUFDSDs7OzRDQUVtQjtBQUNoQixpQkFBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixXQUFuQixHQUFpQyxFQUFqQyxDQUFvQyxnQkFBcEMsRUFBc0QsS0FBSyxZQUEzRCxFQUF5RSxJQUF6RTtBQUNIOzs7K0NBRXNCO0FBQ25CLGlCQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLFdBQW5CLEdBQWlDLEdBQWpDLENBQXFDLGdCQUFyQyxFQUF1RCxLQUFLLFlBQTVEO0FBQ0g7OztxQ0FHWSxJLEVBQU07QUFDZixnQkFBSSxxQkFBcUIsS0FBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixRQUFuQixDQUE0QixTQUE1QixDQUF6QjtBQUNBLGlCQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLFFBQW5CLENBQTRCLFNBQTVCLEVBQXNDLEtBQUssRUFBTCxLQUFZLGtCQUFaLEdBQWlDLElBQWpDLEdBQXdDLEtBQUssRUFBbkY7QUFDSDs7O2lDQUVRO0FBQUE7O0FBQ0wsbUJBQ0k7QUFBQTtBQUFBO0FBRVEscUJBQUssS0FBTCxDQUFXLEtBQVgsR0FDSTtBQUFBO0FBQUEsc0JBQUssV0FBVSxrQkFBZixFQUFrQyxPQUFPLEVBQUMsV0FBVSxPQUFYLEVBQXpDO0FBQ0k7QUFBQTtBQUFBLDBCQUFLLFdBQVUsUUFBZjtBQUFBO0FBQUEscUJBREo7QUFFSTtBQUFBO0FBQUE7QUFBSSw2QkFBSyxLQUFMLENBQVc7QUFBZjtBQUZKLGlCQURKLEdBTUksRUFSWjtBQVdJO0FBQUE7QUFBQSxzQkFBTyxXQUFVLGlDQUFqQjtBQUNJO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUNLLDZCQUFDLEtBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsV0FBakIsSUFBZ0MsQ0FBQyxLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLFlBQWpELElBQWlFLENBQUMsS0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixXQUFsRixHQUFnRztBQUFBO0FBQUE7QUFBQTtBQUFBLDZCQUFoRyxHQUFxSCxFQUQxSDtBQUVLLDZCQUFDLEtBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsWUFBakIsSUFBaUMsQ0FBQyxLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLFdBQWxELEdBQWdFO0FBQUE7QUFBQTtBQUFBO0FBQUEsNkJBQWhFLEdBQXNGLEVBRjNGO0FBR00sNkJBQUMsS0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixXQUFqQixHQUErQjtBQUFBO0FBQUE7QUFBQTtBQUFBLDZCQUEvQixHQUFtRCxFQUh6RDtBQUlJO0FBQUE7QUFBQTtBQUFBO0FBQUEsNkJBSko7QUFLSTtBQUFBO0FBQUE7QUFBQTtBQUFBLDZCQUxKO0FBTUk7QUFBQTtBQUFBO0FBQUE7QUFBQSw2QkFOSjtBQU9JO0FBQUE7QUFBQTtBQUFBO0FBQUEsNkJBUEo7QUFRSTtBQUFBO0FBQUE7QUFBQTtBQUFBLDZCQVJKO0FBU0k7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVRKO0FBREEscUJBREo7QUFjSTtBQUFBO0FBQUE7QUFFSSw2QkFBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixLQUFoQixDQUFzQixHQUF0QixDQUEwQixVQUFDLElBQUQsRUFBUTtBQUM5QixtQ0FDSTtBQUFBO0FBQUEsa0NBQUksS0FBSyxLQUFLLEVBQWQsRUFBa0IsV0FBVyxVQUFVLEtBQUssVUFBTCxHQUFrQixRQUFsQixHQUE2QixFQUF2QyxDQUE3QixFQUF5RSxTQUFTLE9BQUssWUFBTCxDQUFrQixJQUFsQixTQUE0QixJQUE1QixDQUFsRjtBQUNLLGlDQUFDLE9BQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsV0FBakIsSUFBZ0MsQ0FBQyxPQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLFlBQWpELElBQWlFLENBQUMsT0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixXQUFsRixHQUFnRztBQUFBO0FBQUE7QUFBSyx5Q0FBSyxPQUFMLENBQWE7QUFBbEIsaUNBQWhHLEdBQXVJLEVBRDVJO0FBRUssaUNBQUMsT0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixZQUFqQixJQUFpQyxDQUFDLE9BQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsV0FBbEQsR0FBZ0U7QUFBQTtBQUFBO0FBQUsseUNBQUssT0FBTCxDQUFhO0FBQWxCLGlDQUFoRSxHQUF3RyxFQUY3RztBQUdNLGlDQUFDLE9BQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsV0FBakIsR0FBK0I7QUFBQTtBQUFBO0FBQUsseUNBQUssT0FBTCxDQUFhO0FBQWxCLGlDQUEvQixHQUFxRSxFQUgzRTtBQUtJO0FBQUE7QUFBQTtBQUFLLHlDQUFLO0FBQVYsaUNBTEo7QUFNSTtBQUFBO0FBQUE7QUFBSyx5Q0FBSztBQUFWLGlDQU5KO0FBT0k7QUFBQTtBQUFBO0FBQUsseUNBQUssT0FBTCxDQUFhO0FBQWxCLGlDQVBKO0FBUUk7QUFBQTtBQUFBO0FBQUsseUNBQUssT0FBTCxDQUFhO0FBQWxCLGlDQVJKO0FBU0k7QUFBQTtBQUFBO0FBQUsseUNBQUssT0FBTCxDQUFhO0FBQWxCLGlDQVRKO0FBVUk7QUFBQTtBQUFBO0FBQUsseUNBQUssT0FBTCxDQUFhO0FBQWxCO0FBVkosNkJBREo7QUFlSCx5QkFoQkQ7QUFGSjtBQWRKO0FBWEosYUFESjtBQWtESDs7OztFQTdFd0IsTUFBTSxTOzs7Ozs7O0FDQW5DOzs7Ozs7QUFFQSxNQUFNLFNBQU4sQ0FBZ0I7QUFDWixRQUFJLE1BRFE7QUFFWixVQUFNLGlCQUZNO0FBR1osaUJBQWEsRUFIRDtBQUlaLGtCQUFjLENBSkY7QUFLWixtQkFBZSxDQUxIO0FBTVosV0FBTyxRQU5LO0FBT1osY0FBVSwyQkFQRTtBQVFaLGFBQVMsSUFSRztBQVNaLFlBQVEsZ0JBQVMsTUFBVCxFQUFnQixJQUFoQixFQUFxQixLQUFyQixFQUEyQixPQUEzQixFQUFtQyxXQUFuQyxFQUFnRDtBQUNwRCxZQUFJLGdCQUFnQixPQUFPLE1BQVAsQ0FBYyxFQUFkLEVBQWlCLElBQWpCLEVBQXNCO0FBQ3RDLG1CQUFPLEVBQUUsTUFBRixDQUFTLEtBQUssS0FBZCxFQUFvQixVQUFDLElBQUQsRUFBUTtBQUFDLHVCQUFPLEtBQUssVUFBTCxLQUFvQixTQUEzQjtBQUFzQyxhQUFuRSxDQUQrQixDQUNzQztBQUR0QyxTQUF0QixDQUFwQjtBQUdBLFlBQUksZUFBZSxRQUFRLFFBQVIsQ0FBaUIsY0FBakIsQ0FBbkI7QUFDQSxZQUFJLGNBQWMsUUFBUSxRQUFSLENBQWlCLGFBQWpCLENBQWxCO0FBQ0EsWUFBSSxjQUFjLFFBQVEsUUFBUixDQUFpQixhQUFqQixDQUFsQjs7QUFFQSxZQUFJLFdBQUosRUFBaUI7QUFDYiwwQkFBYyxLQUFkLEdBQXNCLEVBQUUsTUFBRixDQUFTLGNBQWMsS0FBdkIsRUFBOEIsVUFBQyxJQUFELEVBQVM7QUFDekQsdUJBQU8sS0FBSyxPQUFMLENBQWEsWUFBYixLQUE4QixXQUFyQztBQUNILGFBRnFCLENBQXRCO0FBR0gsU0FKRCxNQUlPLElBQUksWUFBSixFQUFrQjtBQUNyQiwwQkFBYyxLQUFkLEdBQXNCLEVBQUUsTUFBRixDQUFTLGNBQWMsS0FBdkIsRUFBNkIsVUFBQyxJQUFELEVBQVE7QUFDdkQsdUJBQU8sS0FBSyxPQUFMLENBQWEsYUFBYixLQUErQixZQUF0QztBQUNILGFBRnFCLENBQXRCO0FBR0gsU0FKTSxNQUlBLElBQUksV0FBSixFQUFpQjtBQUNwQiwwQkFBYyxLQUFkLEdBQXNCLEVBQUUsTUFBRixDQUFTLGNBQWMsS0FBdkIsRUFBNkIsVUFBQyxJQUFELEVBQVE7QUFDdkQsdUJBQU8sS0FBSyxPQUFMLENBQWEsWUFBYixLQUE4QixXQUFyQztBQUNILGFBRnFCLENBQXRCO0FBR0g7O0FBRUQsd0JBQWdCLE9BQU8sTUFBUCxDQUFjLEVBQWQsRUFBaUIsYUFBakIsRUFBK0I7QUFDM0MsbUJBQU8sRUFBRSxHQUFGLENBQU8sY0FBYyxLQUFyQixFQUEyQixVQUFDLElBQUQsRUFBUTtBQUN0Qyx1QkFBTyxPQUFPLE1BQVAsQ0FBYyxFQUFkLEVBQWlCLElBQWpCLEVBQXNCO0FBQ3pCLHdCQUFJLEtBQUssSUFBTCxHQUFVLEtBQUssU0FETTtBQUV6QiwrQkFBVyxZQUFZLE1BQVosQ0FBbUIsS0FBSyxTQUF4QixFQUFrQyw2QkFBbEMsRUFBaUUsTUFBakUsQ0FBd0Usa0JBQXhFLENBRmMsQ0FFOEU7QUFGOUUsaUJBQXRCLENBQVA7QUFJSCxhQUxNO0FBRG9DLFNBQS9CLENBQWhCOztBQVNBLHNCQUFjLFdBQWQsR0FBNEIsV0FBNUI7QUFDQSxzQkFBYyxZQUFkLEdBQTZCLFlBQTdCO0FBQ0Esc0JBQWMsV0FBZCxHQUE0QixXQUE1Qjs7QUFFQSxlQUNJLDJDQUFXLFFBQVEsTUFBbkIsRUFBMkIsTUFBTSxhQUFqQyxFQUFnRCxTQUFTLE9BQXpELEVBQWtFLE9BQU8sV0FBekUsR0FESjtBQUlIO0FBaERXLENBQWhCLEUsQ0FOQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENyZWF0ZWQgYnkga2lubmVyZXR6aW4gb24gMjAvMTAvMjAxNi5cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcbiAgICAgICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xuXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfcmVmcmVzaERhdGEoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5yZWZyZXNoKCk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5nZXRFdmVudEJ1cygpLm9uKCdldmVudHM6cmVmcmVzaCcsIHRoaXMuX3JlZnJlc2hEYXRhLCB0aGlzKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LmdldEV2ZW50QnVzKCkub2ZmKCdldmVudHM6cmVmcmVzaCcsIHRoaXMuX3JlZnJlc2hEYXRhKTtcbiAgICB9XG5cblxuICAgIF9zZWxlY3RFdmVudChpdGVtKSB7XG4gICAgICAgIHZhciBvbGRTZWxlY3RlZEV2ZW50SWQgPSB0aGlzLnByb3BzLmNvbnRleHQuZ2V0VmFsdWUoJ2V2ZW50SWQnKTtcbiAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LnNldFZhbHVlKCdldmVudElkJyxpdGVtLmlkID09PSBvbGRTZWxlY3RlZEV2ZW50SWQgPyBudWxsIDogaXRlbS5pZCk7XG4gICAgfVxuICAgIFxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmVycm9yID9cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgZXJyb3IgbWVzc2FnZVwiIHN0eWxlPXt7XCJkaXNwbGF5XCI6XCJibG9ja1wifX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoZWFkZXJcIj5FcnJvciBPY2N1cmVkPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+e3RoaXMuc3RhdGUuZXJyb3J9PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgICAgICAnJ1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJ1aSB2ZXJ5IGNvbXBhY3QgdGFibGUgbG9nc1RhYmxlXCI+XG4gICAgICAgICAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgeyF0aGlzLnByb3BzLmRhdGEuYmx1ZXByaW50SWQgJiYgIXRoaXMucHJvcHMuZGF0YS5kZXBsb3ltZW50SWQgJiYgIXRoaXMucHJvcHMuZGF0YS5leGVjdXRpb25JZCA/IDx0aD5CbHVlcHJpbnQ8L3RoPiA6ICcnfVxuICAgICAgICAgICAgICAgICAgICAgICAgeyF0aGlzLnByb3BzLmRhdGEuZGVwbG95bWVudElkICYmICF0aGlzLnByb3BzLmRhdGEuZXhlY3V0aW9uSWQgPyA8dGg+RGVwbG95bWVudDwvdGg+IDogJyd9XG4gICAgICAgICAgICAgICAgICAgICAgICB7ICF0aGlzLnByb3BzLmRhdGEuZXhlY3V0aW9uSWQgPyA8dGg+V29ya2Zsb3c8L3RoPiA6ICcnfVxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkxvZyBMZXZlbDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+VGltZXN0YW1wPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5PcGVyYXRpb248L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk5vZGUgTmFtZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+Tm9kZSBJZDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+TWVzc2FnZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5kYXRhLml0ZW1zLm1hcCgoaXRlbSk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHIga2V5PXtpdGVtLmlkfSBjbGFzc05hbWU9eydyb3cgJyArIChpdGVtLmlzU2VsZWN0ZWQgPyAnYWN0aXZlJyA6ICcnKX0gb25DbGljaz17dGhpcy5fc2VsZWN0RXZlbnQuYmluZCh0aGlzLGl0ZW0pfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHshdGhpcy5wcm9wcy5kYXRhLmJsdWVwcmludElkICYmICF0aGlzLnByb3BzLmRhdGEuZGVwbG95bWVudElkICYmICF0aGlzLnByb3BzLmRhdGEuZXhlY3V0aW9uSWQgPyA8dGQ+e2l0ZW0uY29udGV4dC5ibHVlcHJpbnRfaWR9PC90ZD4gOiAnJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHshdGhpcy5wcm9wcy5kYXRhLmRlcGxveW1lbnRJZCAmJiAhdGhpcy5wcm9wcy5kYXRhLmV4ZWN1dGlvbklkID8gPHRkPntpdGVtLmNvbnRleHQuZGVwbG95bWVudF9pZH08L3RkPiA6ICcnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyAhdGhpcy5wcm9wcy5kYXRhLmV4ZWN1dGlvbklkID8gPHRkPntpdGVtLmNvbnRleHQud29ya2Zsb3dfaWR9PC90ZD4gOiAnJyB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57aXRlbS5sZXZlbH08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPntpdGVtLnRpbWVzdGFtcH08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPntpdGVtLmNvbnRleHQub3BlcmF0aW9ufTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e2l0ZW0uY29udGV4dC5ub2RlX25hbWV9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57aXRlbS5jb250ZXh0Lm5vZGVfaWR9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57aXRlbS5tZXNzYWdlLnRleHR9PC90ZD5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cbiIsIi8qKlxuICogQ3JlYXRlZCBieSBraW5uZXJldHppbiBvbiAwNy8wOS8yMDE2LlxuICovXG5cbmltcG9ydCBMb2dzVGFibGUgZnJvbSAnLi9Mb2dzVGFibGUnO1xuXG5TdGFnZS5hZGRQbHVnaW4oe1xuICAgIGlkOiAnbG9ncycsXG4gICAgbmFtZTogXCJEZXBsb3ltZW50IExvZ3NcIixcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgaW5pdGlhbFdpZHRoOiA1LFxuICAgIGluaXRpYWxIZWlnaHQ6IDQsXG4gICAgY29sb3I6IFwicHVycGxlXCIsXG4gICAgZmV0Y2hVcmw6ICdbbWFuYWdlcl0vYXBpL3YyLjEvZXZlbnRzJyxcbiAgICBpc1JlYWN0OiB0cnVlLFxuICAgIHJlbmRlcjogZnVuY3Rpb24od2lkZ2V0LGRhdGEsZXJyb3IsY29udGV4dCxwbHVnaW5VdGlscykge1xuICAgICAgICB2YXIgZm9ybWF0dGVkRGF0YSA9IE9iamVjdC5hc3NpZ24oe30sZGF0YSx7XG4gICAgICAgICAgICBpdGVtczogXy5maWx0ZXIoZGF0YS5pdGVtcywoaXRlbSk9PntyZXR1cm4gaXRlbS5ldmVudF90eXBlID09PSB1bmRlZmluZWQ7fSkgLy8gQ2FuIG1heWJlIGNoYW5nZSB0byBpdGVtLmxldmVsICE9PSB1bmRlZmluZWRcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBkZXBsb3ltZW50SWQgPSBjb250ZXh0LmdldFZhbHVlKCdkZXBsb3ltZW50SWQnKTtcbiAgICAgICAgdmFyIGJsdWVwcmludElkID0gY29udGV4dC5nZXRWYWx1ZSgnYmx1ZXByaW50SWQnKTtcbiAgICAgICAgdmFyIGV4ZWN1dGlvbklkID0gY29udGV4dC5nZXRWYWx1ZSgnZXhlY3V0aW9uSWQnKTtcblxuICAgICAgICBpZiAoZXhlY3V0aW9uSWQpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZERhdGEuaXRlbXMgPSBfLmZpbHRlcihmb3JtYXR0ZWREYXRhLml0ZW1zLCAoaXRlbSk9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uY29udGV4dC5leGVjdXRpb25faWQgPT09IGV4ZWN1dGlvbklkO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZGVwbG95bWVudElkKSB7XG4gICAgICAgICAgICBmb3JtYXR0ZWREYXRhLml0ZW1zID0gXy5maWx0ZXIoZm9ybWF0dGVkRGF0YS5pdGVtcywoaXRlbSk9PntcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5jb250ZXh0LmRlcGxveW1lbnRfaWQgPT09IGRlcGxveW1lbnRJZDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKGJsdWVwcmludElkKSB7XG4gICAgICAgICAgICBmb3JtYXR0ZWREYXRhLml0ZW1zID0gXy5maWx0ZXIoZm9ybWF0dGVkRGF0YS5pdGVtcywoaXRlbSk9PntcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5jb250ZXh0LmJsdWVwcmludF9pZCA9PT0gYmx1ZXByaW50SWQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcm1hdHRlZERhdGEgPSBPYmplY3QuYXNzaWduKHt9LGZvcm1hdHRlZERhdGEse1xuICAgICAgICAgICAgaXRlbXM6IF8ubWFwIChmb3JtYXR0ZWREYXRhLml0ZW1zLChpdGVtKT0+e1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LGl0ZW0se1xuICAgICAgICAgICAgICAgICAgICBpZDogaXRlbS50eXBlK2l0ZW0udGltZXN0YW1wLFxuICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXA6IHBsdWdpblV0aWxzLm1vbWVudChpdGVtLnRpbWVzdGFtcCwnWVlZWS1NTS1ERCBISDptbTpzcy5TU1MrU1NTJykuZm9ybWF0KCdERC1NTS1ZWVlZIEhIOm1tJykgLy8yMDE2LTA3LTIwIDA5OjEwOjUzLjEwMyswMDBcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZm9ybWF0dGVkRGF0YS5ibHVlcHJpbnRJZCA9IGJsdWVwcmludElkO1xuICAgICAgICBmb3JtYXR0ZWREYXRhLmRlcGxveW1lbnRJZCA9IGRlcGxveW1lbnRJZDtcbiAgICAgICAgZm9ybWF0dGVkRGF0YS5leGVjdXRpb25JZCA9IGV4ZWN1dGlvbklkO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8TG9nc1RhYmxlIHdpZGdldD17d2lkZ2V0fSBkYXRhPXtmb3JtYXR0ZWREYXRhfSBjb250ZXh0PXtjb250ZXh0fSB1dGlscz17cGx1Z2luVXRpbHN9Lz5cbiAgICAgICAgKTtcblxuICAgIH1cbn0pOyJdfQ==
