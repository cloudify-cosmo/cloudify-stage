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
 * Created by pawelposel on 07/11/2016.
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
            this.props.toolbox.getEventBus().on('inputs:refresh', this._refreshData, this);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.props.toolbox.getEventBus().off('inputs:refresh', this._refreshData);
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps, prevState) {
            if (this.props.data.deploymentId !== prevProps.data.deploymentId) {
                this._refreshData();
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var ErrorMessage = Stage.Basic.ErrorMessage;

            return React.createElement(
                'div',
                null,
                React.createElement(ErrorMessage, { error: this.state.error }),
                React.createElement(
                    'table',
                    { className: 'ui very compact table outputsTable' },
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
                                'Value'
                            )
                        )
                    ),
                    React.createElement(
                        'tbody',
                        null,
                        this.props.data.items.map(function (item) {
                            return React.createElement(
                                'tr',
                                { key: item.name },
                                React.createElement(
                                    'td',
                                    null,
                                    item.name
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    item.value
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
;

},{}],2:[function(require,module,exports){
'use strict';

var _InputsTable = require('./InputsTable');

var _InputsTable2 = _interopRequireDefault(_InputsTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Stage.defineWidget({
    id: 'inputs',
    name: 'Deployment Inputs',
    description: 'This widget shows the deployment inputs',
    initialWidth: 8,
    initialHeight: 4,
    color: "teal",
    isReact: true,
    initialConfiguration: [{ id: "pollingTime", default: 2 }],

    fetchData: function fetchData(widget, toolbox) {
        var deploymentId = toolbox.getContext().getValue('deploymentId');

        if (deploymentId) {
            return toolbox.getManager().doGet('/deployments?_include=id,inputs&id=' + deploymentId).then(function (data) {
                return Promise.resolve({ inputs: _.get(data, "items[0].inputs", {}) });
            });
        }
        return Promise.resolve({ inputs: {} });
    },

    render: function render(widget, data, error, toolbox) {
        if (_.isEmpty(data)) {
            return React.createElement(Stage.Basic.Loading, null);
        }

        var formattedData = Object.assign({}, data, {
            items: Object.keys(data.inputs).map(function (key) {
                return { name: key, value: data.inputs[key] };
            }),
            deploymentId: toolbox.getContext().getValue('deploymentId')
        });

        return React.createElement(_InputsTable2.default, { data: formattedData, toolbox: toolbox });
    }
}); /**
     * Created by pawelposel on 07/11/2016.
     */

},{"./InputsTable":1}]},{},[1,2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3aWRnZXRzL2lucHV0cy9zcmMvSW5wdXRzVGFibGUuanMiLCJ3aWRnZXRzL2lucHV0cy9zcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7OztBQU1JLG9CQUFZLEtBQVosRUFBbUIsT0FBbkIsRUFBNEI7QUFBQTs7QUFBQSxvSEFDbEIsS0FEa0IsRUFDWCxPQURXOztBQUV4QixjQUFLLEtBQUwsR0FBYSxFQUFiO0FBRndCO0FBRzNCOzs7O3VDQUVjO0FBQ1gsaUJBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsT0FBbkI7QUFDSDs7OzRDQUVtQjtBQUNoQixpQkFBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixXQUFuQixHQUFpQyxFQUFqQyxDQUFvQyxnQkFBcEMsRUFBc0QsS0FBSyxZQUEzRCxFQUF5RSxJQUF6RTtBQUNIOzs7K0NBRXNCO0FBQ25CLGlCQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLFdBQW5CLEdBQWlDLEdBQWpDLENBQXFDLGdCQUFyQyxFQUF1RCxLQUFLLFlBQTVEO0FBQ0g7OzsyQ0FFa0IsUyxFQUFXLFMsRUFBVztBQUNyQyxnQkFBSSxLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLFlBQWhCLEtBQWlDLFVBQVUsSUFBVixDQUFlLFlBQXBELEVBQWtFO0FBQzlELHFCQUFLLFlBQUw7QUFDSDtBQUNKOzs7aUNBRVE7QUFDTCxnQkFBSSxlQUFlLE1BQU0sS0FBTixDQUFZLFlBQS9COztBQUVBLG1CQUNJO0FBQUE7QUFBQTtBQUNJLG9DQUFDLFlBQUQsSUFBYyxPQUFPLEtBQUssS0FBTCxDQUFXLEtBQWhDLEdBREo7QUFHSTtBQUFBO0FBQUEsc0JBQU8sV0FBVSxvQ0FBakI7QUFDSTtBQUFBO0FBQUE7QUFDSTtBQUFBO0FBQUE7QUFDSTtBQUFBO0FBQUE7QUFBQTtBQUFBLDZCQURKO0FBRUk7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUZKO0FBREoscUJBREo7QUFPSTtBQUFBO0FBQUE7QUFFSSw2QkFBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixLQUFoQixDQUFzQixHQUF0QixDQUEwQixVQUFDLElBQUQsRUFBUTtBQUM5QixtQ0FDSTtBQUFBO0FBQUEsa0NBQUksS0FBSyxLQUFLLElBQWQ7QUFDSTtBQUFBO0FBQUE7QUFBSyx5Q0FBSztBQUFWLGlDQURKO0FBRUk7QUFBQTtBQUFBO0FBQUsseUNBQUs7QUFBVjtBQUZKLDZCQURKO0FBTUgseUJBUEQ7QUFGSjtBQVBKO0FBSEosYUFESjtBQTJCSDs7OztFQXZEd0IsTUFBTSxTOzs7QUF3RGxDOzs7OztBQ3hERDs7Ozs7O0FBRUEsTUFBTSxZQUFOLENBQW1CO0FBQ2YsUUFBSSxRQURXO0FBRWYsVUFBTSxtQkFGUztBQUdmLGlCQUFhLHlDQUhFO0FBSWYsa0JBQWMsQ0FKQztBQUtmLG1CQUFlLENBTEE7QUFNZixXQUFRLE1BTk87QUFPZixhQUFTLElBUE07QUFRZiwwQkFBc0IsQ0FDbEIsRUFBQyxJQUFJLGFBQUwsRUFBb0IsU0FBUyxDQUE3QixFQURrQixDQVJQOztBQVlmLGVBQVcsbUJBQVMsTUFBVCxFQUFnQixPQUFoQixFQUF5QjtBQUNoQyxZQUFJLGVBQWUsUUFBUSxVQUFSLEdBQXFCLFFBQXJCLENBQThCLGNBQTlCLENBQW5COztBQUVBLFlBQUksWUFBSixFQUFrQjtBQUNkLG1CQUFPLFFBQVEsVUFBUixHQUFxQixLQUFyQix5Q0FBaUUsWUFBakUsRUFDRixJQURFLENBQ0c7QUFBQSx1QkFBTSxRQUFRLE9BQVIsQ0FBZ0IsRUFBQyxRQUFRLEVBQUUsR0FBRixDQUFNLElBQU4sRUFBWSxpQkFBWixFQUErQixFQUEvQixDQUFULEVBQWhCLENBQU47QUFBQSxhQURILENBQVA7QUFFSDtBQUNELGVBQU8sUUFBUSxPQUFSLENBQWdCLEVBQUMsUUFBTyxFQUFSLEVBQWhCLENBQVA7QUFDSCxLQXBCYzs7QUFzQmYsWUFBUSxnQkFBUyxNQUFULEVBQWdCLElBQWhCLEVBQXFCLEtBQXJCLEVBQTJCLE9BQTNCLEVBQW9DO0FBQ3hDLFlBQUksRUFBRSxPQUFGLENBQVUsSUFBVixDQUFKLEVBQXFCO0FBQ2pCLG1CQUFPLG9CQUFDLEtBQUQsQ0FBTyxLQUFQLENBQWEsT0FBYixPQUFQO0FBQ0g7O0FBRUQsWUFBSSxnQkFBZ0IsT0FBTyxNQUFQLENBQWMsRUFBZCxFQUFpQixJQUFqQixFQUFzQjtBQUN0QyxtQkFBTyxPQUFPLElBQVAsQ0FBWSxLQUFLLE1BQWpCLEVBQXlCLEdBQXpCLENBQTZCLFVBQVMsR0FBVCxFQUFjO0FBQzlDLHVCQUFPLEVBQUMsTUFBTSxHQUFQLEVBQVksT0FBTyxLQUFLLE1BQUwsQ0FBWSxHQUFaLENBQW5CLEVBQVA7QUFDQyxhQUZFLENBRCtCO0FBSXRDLDBCQUFlLFFBQVEsVUFBUixHQUFxQixRQUFyQixDQUE4QixjQUE5QjtBQUp1QixTQUF0QixDQUFwQjs7QUFPQSxlQUNJLDZDQUFhLE1BQU0sYUFBbkIsRUFBa0MsU0FBUyxPQUEzQyxHQURKO0FBR0g7QUFyQ2MsQ0FBbkIsRSxDQU5BIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ3JlYXRlZCBieSBwYXdlbHBvc2VsIG9uIDA3LzExLzIwMTYuXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcbiAgICAgICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge307XG4gICAgfVxuXG4gICAgX3JlZnJlc2hEYXRhKCkge1xuICAgICAgICB0aGlzLnByb3BzLnRvb2xib3gucmVmcmVzaCgpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLnRvb2xib3guZ2V0RXZlbnRCdXMoKS5vbignaW5wdXRzOnJlZnJlc2gnLCB0aGlzLl9yZWZyZXNoRGF0YSwgdGhpcyk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgICAgIHRoaXMucHJvcHMudG9vbGJveC5nZXRFdmVudEJ1cygpLm9mZignaW5wdXRzOnJlZnJlc2gnLCB0aGlzLl9yZWZyZXNoRGF0YSk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcywgcHJldlN0YXRlKSB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLmRhdGEuZGVwbG95bWVudElkICE9PSBwcmV2UHJvcHMuZGF0YS5kZXBsb3ltZW50SWQpIHtcbiAgICAgICAgICAgIHRoaXMuX3JlZnJlc2hEYXRhKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHZhciBFcnJvck1lc3NhZ2UgPSBTdGFnZS5CYXNpYy5FcnJvck1lc3NhZ2U7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPEVycm9yTWVzc2FnZSBlcnJvcj17dGhpcy5zdGF0ZS5lcnJvcn0vPlxuXG4gICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT1cInVpIHZlcnkgY29tcGFjdCB0YWJsZSBvdXRwdXRzVGFibGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5OYW1lPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+VmFsdWU8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmRhdGEuaXRlbXMubWFwKChpdGVtKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ciBrZXk9e2l0ZW0ubmFtZX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e2l0ZW0ubmFtZX08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPntpdGVtLnZhbHVlfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgKTtcbiAgICB9XG59O1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHBhd2VscG9zZWwgb24gMDcvMTEvMjAxNi5cbiAqL1xuXG5pbXBvcnQgSW5wdXRzVGFibGUgZnJvbSAnLi9JbnB1dHNUYWJsZSc7XG5cblN0YWdlLmRlZmluZVdpZGdldCh7XG4gICAgaWQ6ICdpbnB1dHMnLFxuICAgIG5hbWU6ICdEZXBsb3ltZW50IElucHV0cycsXG4gICAgZGVzY3JpcHRpb246ICdUaGlzIHdpZGdldCBzaG93cyB0aGUgZGVwbG95bWVudCBpbnB1dHMnLFxuICAgIGluaXRpYWxXaWR0aDogOCxcbiAgICBpbml0aWFsSGVpZ2h0OiA0LFxuICAgIGNvbG9yIDogXCJ0ZWFsXCIsXG4gICAgaXNSZWFjdDogdHJ1ZSxcbiAgICBpbml0aWFsQ29uZmlndXJhdGlvbjogW1xuICAgICAgICB7aWQ6IFwicG9sbGluZ1RpbWVcIiwgZGVmYXVsdDogMn1cbiAgICBdLFxuXG4gICAgZmV0Y2hEYXRhOiBmdW5jdGlvbih3aWRnZXQsdG9vbGJveCkge1xuICAgICAgICBsZXQgZGVwbG95bWVudElkID0gdG9vbGJveC5nZXRDb250ZXh0KCkuZ2V0VmFsdWUoJ2RlcGxveW1lbnRJZCcpO1xuXG4gICAgICAgIGlmIChkZXBsb3ltZW50SWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0b29sYm94LmdldE1hbmFnZXIoKS5kb0dldChgL2RlcGxveW1lbnRzP19pbmNsdWRlPWlkLGlucHV0cyZpZD0ke2RlcGxveW1lbnRJZH1gKVxuICAgICAgICAgICAgICAgIC50aGVuKGRhdGE9PlByb21pc2UucmVzb2x2ZSh7aW5wdXRzOiBfLmdldChkYXRhLCBcIml0ZW1zWzBdLmlucHV0c1wiLCB7fSl9KSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7aW5wdXRzOnt9fSk7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24od2lkZ2V0LGRhdGEsZXJyb3IsdG9vbGJveCkge1xuICAgICAgICBpZiAoXy5pc0VtcHR5KGRhdGEpKSB7XG4gICAgICAgICAgICByZXR1cm4gPFN0YWdlLkJhc2ljLkxvYWRpbmcvPjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBmb3JtYXR0ZWREYXRhID0gT2JqZWN0LmFzc2lnbih7fSxkYXRhLHtcbiAgICAgICAgICAgIGl0ZW1zOiBPYmplY3Qua2V5cyhkYXRhLmlucHV0cykubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7bmFtZToga2V5LCB2YWx1ZTogZGF0YS5pbnB1dHNba2V5XX07XG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBkZXBsb3ltZW50SWQgOiB0b29sYm94LmdldENvbnRleHQoKS5nZXRWYWx1ZSgnZGVwbG95bWVudElkJylcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxJbnB1dHNUYWJsZSBkYXRhPXtmb3JtYXR0ZWREYXRhfSB0b29sYm94PXt0b29sYm94fS8+XG4gICAgICAgICk7XG4gICAgfVxufSk7Il19
