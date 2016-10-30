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
        key: '_selectExecution',
        value: function _selectExecution(item) {
            var oldSelectedExecutionId = this.props.context.getValue('executionId');
            this.props.context.setValue('executionId', item.id === oldSelectedExecutionId ? null : item.id);
        }
    }, {
        key: 'renderFields',
        value: function renderFields(fieldsToShow, item) {
            var fields = [];

            if (fieldsToShow.indexOf("Blueprint") >= 0 && !this.props.data.blueprintId) {
                fields.push(React.createElement(
                    'td',
                    { key: item.id + 'Blueprint' },
                    item.blueprint_id
                ));
            }
            if (fieldsToShow.indexOf("Deployment") >= 0 && !this.props.data.deploymentId) {
                fields.push(React.createElement(
                    'td',
                    { key: item.id + 'Deployment' },
                    item.deployment_id
                ));
            }

            if (fieldsToShow.indexOf("Workflow") >= 0) {
                fields.push(React.createElement(
                    'td',
                    { key: item.id + 'Workflow' },
                    item.workflow_id
                ));
            }

            if (fieldsToShow.indexOf("Id") >= 0) {
                fields.push(React.createElement(
                    'td',
                    { key: item.id + 'Id' },
                    item.id
                ));
            }
            if (fieldsToShow.indexOf("Created") >= 0) {
                fields.push(React.createElement(
                    'td',
                    { key: item.id + 'Created' },
                    item.created_at
                ));
            }
            if (fieldsToShow.indexOf("IsSystem") >= 0) {
                fields.push(React.createElement(
                    'td',
                    { key: item.id + 'IsSystem' },
                    item.is_system_workflow ? 'true' : 'false'
                ));
            }
            if (fieldsToShow.indexOf("Status") >= 0) {
                fields.push(React.createElement(
                    'td',
                    { key: item.id + 'Status' },
                    item.status,
                    _.isEmpty(item.error) ? React.createElement('i', { className: 'check circle icon inverted green' }) : React.createElement('i', { className: 'remove circle icon inverted red' })
                ));
            }

            return fields;
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var fieldsToShowConfig = this.props.widget.configuration ? _.find(this.props.widget.configuration, { id: 'fieldsToShow' }) : {};
            var fieldsToShow = [];
            try {
                // First set it to default, so if abends in json parse will have the default
                fieldsToShow = _.find(this.props.widget.plugin.initialConfiguration, { id: 'fieldsToShow' }) || ["Id"];

                fieldsToShow = fieldsToShowConfig && fieldsToShowConfig.value ? JSON.parse(fieldsToShowConfig.value) : fieldsToShow;
            } catch (e) {
                console.error('Error parsing fields-to-show configuration for executions table');
            }

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
                            fieldsToShow.indexOf("Blueprint") >= 0 && !this.props.data.blueprintId ? React.createElement(
                                'th',
                                null,
                                'Blueprint'
                            ) : null,
                            fieldsToShow.indexOf("Deployment") >= 0 && !this.props.data.deploymentId ? React.createElement(
                                'th',
                                null,
                                'Deployment'
                            ) : null,
                            fieldsToShow.indexOf("Workflow") >= 0 ? React.createElement(
                                'th',
                                null,
                                'Workflow'
                            ) : null,
                            fieldsToShow.indexOf("Id") >= 0 ? React.createElement(
                                'th',
                                null,
                                'Id'
                            ) : null,
                            fieldsToShow.indexOf("Created") >= 0 ? React.createElement(
                                'th',
                                null,
                                'Created'
                            ) : null,
                            fieldsToShow.indexOf("IsSystem") >= 0 ? React.createElement(
                                'th',
                                null,
                                'Is System'
                            ) : null,
                            fieldsToShow.indexOf("Status") >= 0 ? React.createElement(
                                'th',
                                null,
                                'Status'
                            ) : null
                        )
                    ),
                    React.createElement(
                        'tbody',
                        null,
                        this.props.data.items.map(function (item) {
                            return React.createElement(
                                'tr',
                                { key: item.id, className: 'row ' + (item.isSelected ? 'active' : ''), onClick: _this2._selectExecution.bind(_this2, item) },
                                _this2.renderFields(fieldsToShow, item)
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
    initialConfiguration: [{ id: "fieldsToShow", name: "List of fields to show in the table", placeHolder: "Enter list of comma separated field names (json format)",
        default: '["Blueprint","Deployment","Workflow","Id","Created","IsSystem","Status"]' }],

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
        var selectedExecution = context.getValue('executionId');

        if (blueprintId) {
            formattedData.items = _.filter(data.items, { blueprint_id: blueprintId });
        }

        if (deploymentId) {
            formattedData.items = _.filter(data.items, { deployment_id: deploymentId });
        }

        formattedData = Object.assign({}, formattedData, {
            items: _.map(formattedData.items, function (item) {
                return Object.assign({}, item, {
                    created_at: pluginUtils.moment(item.created_at, 'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'), //2016-07-20 09:10:53.103579
                    isSelected: item.id === selectedExecution
                });
            })
        });

        formattedData.blueprintId = blueprintId;
        formattedData.deploymentId = deploymentId;
        return React.createElement(_ExecutionsTable2.default, { widget: widget, data: formattedData, context: context, utils: pluginUtils });
    }
}); /**
     * Created by kinneretzin on 20/10/2016.
     */

},{"./ExecutionsTable":1}]},{},[1,2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwbHVnaW5zL2V4ZWN1dGlvbnMvc3JjL0V4ZWN1dGlvbnNUYWJsZS5qcyIsInBsdWdpbnMvZXhlY3V0aW9ucy9zcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7OztBQUtJLG9CQUFZLEtBQVosRUFBbUIsT0FBbkIsRUFBNEI7QUFBQTs7QUFBQSxvSEFDbEIsS0FEa0IsRUFDWCxPQURXOztBQUd4QixjQUFLLEtBQUwsR0FBYSxFQUFiO0FBSHdCO0FBSzNCOzs7O3VDQUVjO0FBQ1gsaUJBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsT0FBbkI7QUFDSDs7OzRDQUVtQjtBQUNoQixpQkFBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixXQUFuQixHQUFpQyxFQUFqQyxDQUFvQyxvQkFBcEMsRUFBMEQsS0FBSyxZQUEvRCxFQUE2RSxJQUE3RTtBQUNIOzs7K0NBRXNCO0FBQ25CLGlCQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLFdBQW5CLEdBQWlDLEdBQWpDLENBQXFDLG9CQUFyQyxFQUEyRCxLQUFLLFlBQWhFO0FBQ0g7Ozt5Q0FHZ0IsSSxFQUFNO0FBQ25CLGdCQUFJLHlCQUF5QixLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLFFBQW5CLENBQTRCLGFBQTVCLENBQTdCO0FBQ0EsaUJBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsUUFBbkIsQ0FBNEIsYUFBNUIsRUFBMEMsS0FBSyxFQUFMLEtBQVksc0JBQVosR0FBcUMsSUFBckMsR0FBNEMsS0FBSyxFQUEzRjtBQUNIOzs7cUNBRVksWSxFQUFhLEksRUFBTTtBQUM1QixnQkFBSSxTQUFTLEVBQWI7O0FBRUEsZ0JBQUksYUFBYSxPQUFiLENBQXFCLFdBQXJCLEtBQXFDLENBQXJDLElBQTBDLENBQUMsS0FBSyxLQUFMLENBQVcsSUFBWCxD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O0FBQ2IsMEJBQWMsS0FBZCxHQUFzQixFQUFFLE1BQUYsQ0FBUyxLQUFLLEtBQWQsRUFBb0IsRUFBQyxjQUFhLFdBQWQsRUFBcEIsQ0FBdEI7QUFDSDs7QUFFRCxZQUFJLFlBQUosRUFBa0I7QUFDZCwwQkFBYyxLQUFkLEdBQXNCLEVBQUUsTUFBRixDQUFTLEtBQUssS0FBZCxFQUFvQixFQUFDLGVBQWMsWUFBZixFQUFwQixDQUF0QjtBQUNIOztBQUdELHdCQUFnQixPQUFPLE1BQVAsQ0FBYyxFQUFkLEVBQWlCLGFBQWpCLEVBQStCO0FBQzNDLG1CQUFPLEVBQUUsR0FBRixDQUFPLGNBQWMsS0FBckIsRUFBMkIsVUFBQyxJQUFELEVBQVE7QUFDdEMsdUJBQU8sT0FBTyxNQUFQLENBQWMsRUFBZCxFQUFpQixJQUFqQixFQUFzQjtBQUN6QixnQ0FBWSxZQUFZLE1BQVosQ0FBbUIsS0FBSyxVQUF4QixFQUFtQywyQkFBbkMsRUFBZ0UsTUFBaEUsQ0FBdUUsa0JBQXZFLENBRGEsRUFDK0U7QUFDeEcsZ0NBQVksS0FBSyxFQUFMLEtBQVk7QUFGQyxpQkFBdEIsQ0FBUDtBQUlILGFBTE07QUFEb0MsU0FBL0IsQ0FBaEI7O0FBU0Esc0JBQWMsV0FBZCxHQUE0QixXQUE1QjtBQUNBLHNCQUFjLFlBQWQsR0FBNkIsWUFBN0I7QUFDQSxlQUNJLGlEQUFpQixRQUFRLE1BQXpCLEVBQWlDLE1BQU0sYUFBdkMsRUFBc0QsU0FBUyxPQUEvRCxFQUF3RSxPQUFPLFdBQS9FLEdBREo7QUFHSDtBQXREVyxDQUFoQixFLENBTkEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGtpbm5lcmV0emluIG9uIDIwLzEwLzIwMTYuXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XG4gICAgICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcblxuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3JlZnJlc2hEYXRhKCkge1xuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQucmVmcmVzaCgpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQuZ2V0RXZlbnRCdXMoKS5vbignZXhlY3V0aW9uczpyZWZyZXNoJywgdGhpcy5fcmVmcmVzaERhdGEsIHRoaXMpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQuZ2V0RXZlbnRCdXMoKS5vZmYoJ2V4ZWN1dGlvbnM6cmVmcmVzaCcsIHRoaXMuX3JlZnJlc2hEYXRhKTtcbiAgICB9XG5cblxuICAgIF9zZWxlY3RFeGVjdXRpb24oaXRlbSkge1xuICAgICAgICB2YXIgb2xkU2VsZWN0ZWRFeGVjdXRpb25JZCA9IHRoaXMucHJvcHMuY29udGV4dC5nZXRWYWx1ZSgnZXhlY3V0aW9uSWQnKTtcbiAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LnNldFZhbHVlKCdleGVjdXRpb25JZCcsaXRlbS5pZCA9PT0gb2xkU2VsZWN0ZWRFeGVjdXRpb25JZCA/IG51bGwgOiBpdGVtLmlkKTtcbiAgICB9XG5cbiAgICByZW5kZXJGaWVsZHMoZmllbGRzVG9TaG93LGl0ZW0pIHtcbiAgICAgICAgdmFyIGZpZWxkcyA9IFtdO1xuXG4gICAgICAgIGlmIChmaWVsZHNUb1Nob3cuaW5kZXhPZihcIkJsdWVwcmludFwiKSA+PSAwICYmICF0aGlzLnByb3BzLmRhdGEuYmx1ZXByaW50SWQpIHtcbiAgICAgICAgICAgIGZpZWxkcy5wdXNoKDx0ZCBrZXk9e2l0ZW0uaWQrJ0JsdWVwcmludCd9PntpdGVtLmJsdWVwcmludF9pZH08L3RkPilcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmllbGRzVG9TaG93LmluZGV4T2YoXCJEZXBsb3ltZW50XCIpID49IDAgJiYgIXRoaXMucHJvcHMuZGF0YS5kZXBsb3ltZW50SWQpIHtcbiAgICAgICAgICAgIGZpZWxkcy5wdXNoKDx0ZCBrZXk9e2l0ZW0uaWQrJ0RlcGxveW1lbnQnfT57aXRlbS5kZXBsb3ltZW50X2lkfTwvdGQ+KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmaWVsZHNUb1Nob3cuaW5kZXhPZihcIldvcmtmbG93XCIpID49IDApIHtcbiAgICAgICAgICAgIGZpZWxkcy5wdXNoKDx0ZCBrZXk9e2l0ZW0uaWQrJ1dvcmtmbG93J30+e2l0ZW0ud29ya2Zsb3dfaWR9PC90ZD4pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZpZWxkc1RvU2hvdy5pbmRleE9mKFwiSWRcIikgPj0gMCApIHtcbiAgICAgICAgICAgIGZpZWxkcy5wdXNoKDx0ZCBrZXk9e2l0ZW0uaWQrJ0lkJ30+e2l0ZW0uaWR9PC90ZD4pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaWVsZHNUb1Nob3cuaW5kZXhPZihcIkNyZWF0ZWRcIikgPj0gMCkge1xuICAgICAgICAgICAgZmllbGRzLnB1c2goPHRkIGtleT17aXRlbS5pZCsnQ3JlYXRlZCd9PntpdGVtLmNyZWF0ZWRfYXR9PC90ZD4pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaWVsZHNUb1Nob3cuaW5kZXhPZihcIklzU3lzdGVtXCIpID49IDApIHtcbiAgICAgICAgICAgIGZpZWxkcy5wdXNoKDx0ZCBrZXk9e2l0ZW0uaWQrJ0lzU3lzdGVtJ30+e2l0ZW0uaXNfc3lzdGVtX3dvcmtmbG93ID8gJ3RydWUnIDogJ2ZhbHNlJ308L3RkPik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpZWxkc1RvU2hvdy5pbmRleE9mKFwiU3RhdHVzXCIpID49IDApIHtcbiAgICAgICAgICAgIGZpZWxkcy5wdXNoKFxuICAgICAgICAgICAgICAgIDx0ZCBrZXk9e2l0ZW0uaWQrJ1N0YXR1cyd9PlxuICAgICAgICAgICAgICAgICAgICB7aXRlbS5zdGF0dXN9XG4gICAgICAgICAgICAgICAgICAgIHsgXy5pc0VtcHR5KGl0ZW0uZXJyb3IpID9cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImNoZWNrIGNpcmNsZSBpY29uIGludmVydGVkIGdyZWVuXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwicmVtb3ZlIGNpcmNsZSBpY29uIGludmVydGVkIHJlZFwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpZWxkcztcbiAgICB9XG4gICAgcmVuZGVyKCkge1xuICAgICAgICB2YXIgZmllbGRzVG9TaG93Q29uZmlnID0gdGhpcy5wcm9wcy53aWRnZXQuY29uZmlndXJhdGlvbiA/IF8uZmluZCh0aGlzLnByb3BzLndpZGdldC5jb25maWd1cmF0aW9uLHtpZDonZmllbGRzVG9TaG93J30pIDoge307XG4gICAgICAgIHZhciBmaWVsZHNUb1Nob3cgPSBbXTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIEZpcnN0IHNldCBpdCB0byBkZWZhdWx0LCBzbyBpZiBhYmVuZHMgaW4ganNvbiBwYXJzZSB3aWxsIGhhdmUgdGhlIGRlZmF1bHRcbiAgICAgICAgICAgIGZpZWxkc1RvU2hvdyA9IF8uZmluZCh0aGlzLnByb3BzLndpZGdldC5wbHVnaW4uaW5pdGlhbENvbmZpZ3VyYXRpb24se2lkOidmaWVsZHNUb1Nob3cnfSkgfHwgW1wiSWRcIl07XG5cbiAgICAgICAgICAgIGZpZWxkc1RvU2hvdyA9IChmaWVsZHNUb1Nob3dDb25maWcgJiYgZmllbGRzVG9TaG93Q29uZmlnLnZhbHVlKSA/IEpTT04ucGFyc2UoZmllbGRzVG9TaG93Q29uZmlnLnZhbHVlKSA6IGZpZWxkc1RvU2hvdztcblxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBwYXJzaW5nIGZpZWxkcy10by1zaG93IGNvbmZpZ3VyYXRpb24gZm9yIGV4ZWN1dGlvbnMgdGFibGUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5lcnJvciA/XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIGVycm9yIG1lc3NhZ2VcIiBzdHlsZT17e1wiZGlzcGxheVwiOlwiYmxvY2tcIn19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVhZGVyXCI+RXJyb3IgT2NjdXJlZDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPnt0aGlzLnN0YXRlLmVycm9yfTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgJydcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPVwidWkgdmVyeSBjb21wYWN0IHRhYmxlIGV4ZWN1dGlvbnNUYWJsZVwiPlxuICAgICAgICAgICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHsgZmllbGRzVG9TaG93LmluZGV4T2YoXCJCbHVlcHJpbnRcIikgPj0gMCAmJiAhdGhpcy5wcm9wcy5kYXRhLmJsdWVwcmludElkPyA8dGg+Qmx1ZXByaW50PC90aD4gOiBudWxsfVxuICAgICAgICAgICAgICAgICAgICAgICAgeyBmaWVsZHNUb1Nob3cuaW5kZXhPZihcIkRlcGxveW1lbnRcIikgPj0gMCAmJiAhdGhpcy5wcm9wcy5kYXRhLmRlcGxveW1lbnRJZD88dGg+RGVwbG95bWVudDwvdGg+IDogbnVsbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHsgZmllbGRzVG9TaG93LmluZGV4T2YoXCJXb3JrZmxvd1wiKSA+PSAwID88dGg+V29ya2Zsb3c8L3RoPiA6IG51bGx9XG4gICAgICAgICAgICAgICAgICAgICAgICB7IGZpZWxkc1RvU2hvdy5pbmRleE9mKFwiSWRcIikgPj0gMCA/PHRoPklkPC90aD4gOiBudWxsfVxuICAgICAgICAgICAgICAgICAgICAgICAgeyBmaWVsZHNUb1Nob3cuaW5kZXhPZihcIkNyZWF0ZWRcIikgPj0gMCA/PHRoPkNyZWF0ZWQ8L3RoPiA6IG51bGx9XG4gICAgICAgICAgICAgICAgICAgICAgICB7IGZpZWxkc1RvU2hvdy5pbmRleE9mKFwiSXNTeXN0ZW1cIikgPj0gMCA/PHRoPklzIFN5c3RlbTwvdGg+IDogbnVsbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHsgZmllbGRzVG9TaG93LmluZGV4T2YoXCJTdGF0dXNcIikgPj0gMCA/PHRoPlN0YXR1czwvdGg+IDogbnVsbH1cbiAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmRhdGEuaXRlbXMubWFwKChpdGVtKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ciBrZXk9e2l0ZW0uaWR9IGNsYXNzTmFtZT17J3JvdyAnICsgKGl0ZW0uaXNTZWxlY3RlZCA/ICdhY3RpdmUnIDogJycpfSBvbkNsaWNrPXt0aGlzLl9zZWxlY3RFeGVjdXRpb24uYmluZCh0aGlzLGl0ZW0pfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnJlbmRlckZpZWxkcyhmaWVsZHNUb1Nob3csaXRlbSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGtpbm5lcmV0emluIG9uIDIwLzEwLzIwMTYuXG4gKi9cblxuaW1wb3J0IEV4ZWN1dGlvbnNUYWJsZSBmcm9tICcuL0V4ZWN1dGlvbnNUYWJsZSc7XG5cblN0YWdlLmFkZFBsdWdpbih7XG4gICAgaWQ6IFwiZXhlY3V0aW9uc1wiLFxuICAgIG5hbWU6ICdEZXBsb3ltZW50IGV4ZWN1dGlvbnMnLFxuICAgIGRlc2NyaXB0aW9uOiAnVGhpcyBwbHVnaW4gc2hvd3MgdGhlIGRlcGxveW1lbnQgZXhlY3V0aW9ucycsXG4gICAgaW5pdGlhbFdpZHRoOiA4LFxuICAgIGluaXRpYWxIZWlnaHQ6IDYsXG4gICAgY29sb3IgOiBcInB1cnBsZVwiLFxuICAgIGZldGNoVXJsOiAnW21hbmFnZXJdL2FwaS92Mi4xL2V4ZWN1dGlvbnMnLFxuICAgIGlzUmVhY3Q6IHRydWUsXG4gICAgaW5pdGlhbENvbmZpZ3VyYXRpb246XG4gICAgICAgIFtcbiAgICAgICAgICAgIHtpZDogXCJmaWVsZHNUb1Nob3dcIixuYW1lOiBcIkxpc3Qgb2YgZmllbGRzIHRvIHNob3cgaW4gdGhlIHRhYmxlXCIsIHBsYWNlSG9sZGVyOiBcIkVudGVyIGxpc3Qgb2YgY29tbWEgc2VwYXJhdGVkIGZpZWxkIG5hbWVzIChqc29uIGZvcm1hdClcIixcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAnW1wiQmx1ZXByaW50XCIsXCJEZXBsb3ltZW50XCIsXCJXb3JrZmxvd1wiLFwiSWRcIixcIkNyZWF0ZWRcIixcIklzU3lzdGVtXCIsXCJTdGF0dXNcIl0nfVxuICAgICAgICBdLFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbih3aWRnZXQsZGF0YSxlcnJvcixjb250ZXh0LHBsdWdpblV0aWxzKSB7XG5cbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gcGx1Z2luVXRpbHMucmVuZGVyUmVhY3RMb2FkaW5nKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBwbHVnaW5VdGlscy5yZW5kZXJSZWFjdEVycm9yKGVycm9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBmb3JtYXR0ZWREYXRhID0gT2JqZWN0LmFzc2lnbih7fSxkYXRhKTtcblxuICAgICAgICB2YXIgYmx1ZXByaW50SWQgPSBjb250ZXh0LmdldFZhbHVlKCdibHVlcHJpbnRJZCcpO1xuICAgICAgICB2YXIgZGVwbG95bWVudElkID0gY29udGV4dC5nZXRWYWx1ZSgnZGVwbG95bWVudElkJyk7XG4gICAgICAgIHZhciBzZWxlY3RlZEV4ZWN1dGlvbiA9IGNvbnRleHQuZ2V0VmFsdWUoJ2V4ZWN1dGlvbklkJyk7XG5cbiAgICAgICAgaWYgKGJsdWVwcmludElkKSB7XG4gICAgICAgICAgICBmb3JtYXR0ZWREYXRhLml0ZW1zID0gXy5maWx0ZXIoZGF0YS5pdGVtcyx7Ymx1ZXByaW50X2lkOmJsdWVwcmludElkfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGVwbG95bWVudElkKSB7XG4gICAgICAgICAgICBmb3JtYXR0ZWREYXRhLml0ZW1zID0gXy5maWx0ZXIoZGF0YS5pdGVtcyx7ZGVwbG95bWVudF9pZDpkZXBsb3ltZW50SWR9KTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgZm9ybWF0dGVkRGF0YSA9IE9iamVjdC5hc3NpZ24oe30sZm9ybWF0dGVkRGF0YSx7XG4gICAgICAgICAgICBpdGVtczogXy5tYXAgKGZvcm1hdHRlZERhdGEuaXRlbXMsKGl0ZW0pPT57XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30saXRlbSx7XG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZWRfYXQ6IHBsdWdpblV0aWxzLm1vbWVudChpdGVtLmNyZWF0ZWRfYXQsJ1lZWVktTU0tREQgSEg6bW06c3MuU1NTU1MnKS5mb3JtYXQoJ0RELU1NLVlZWVkgSEg6bW0nKSwgLy8yMDE2LTA3LTIwIDA5OjEwOjUzLjEwMzU3OVxuICAgICAgICAgICAgICAgICAgICBpc1NlbGVjdGVkOiBpdGVtLmlkID09PSBzZWxlY3RlZEV4ZWN1dGlvblxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcblxuICAgICAgICBmb3JtYXR0ZWREYXRhLmJsdWVwcmludElkID0gYmx1ZXByaW50SWQ7XG4gICAgICAgIGZvcm1hdHRlZERhdGEuZGVwbG95bWVudElkID0gZGVwbG95bWVudElkO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPEV4ZWN1dGlvbnNUYWJsZSB3aWRnZXQ9e3dpZGdldH0gZGF0YT17Zm9ybWF0dGVkRGF0YX0gY29udGV4dD17Y29udGV4dH0gdXRpbHM9e3BsdWdpblV0aWxzfS8+XG4gICAgICAgICk7XG4gICAgfVxufSk7XG4iXX0=
