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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3aWRnZXRzXFxpbnB1dHNcXHNyY1xcSW5wdXRzVGFibGUuanMiLCJ3aWRnZXRzXFxpbnB1dHNcXHNyY1xcd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7OztBQU1JLG9CQUFZLEtBQVosRUFBbUIsT0FBbkIsRUFBNEI7QUFBQTs7QUFBQSxvSEFDbEIsS0FEa0IsRUFDWCxPQURXOztBQUV4QixjQUFLLEtBQUwsR0FBYSxFQUFiO0FBRndCO0FBRzNCOzs7O3VDQUVjO0FBQ1gsaUJBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsT0FBbkI7QUFDSDs7OzRDQUVtQjtBQUNoQixpQkFBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixXQUFuQixHQUFpQyxFQUFqQyxDQUFvQyxnQkFBcEMsRUFBc0QsS0FBSyxZQUEzRCxFQUF5RSxJQUF6RTtBQUNIOzs7K0NBRXNCO0FBQ25CLGlCQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLFdBQW5CLEdBQWlDLEdBQWpDLENBQXFDLGdCQUFyQyxFQUF1RCxLQUFLLFlBQTVEO0FBQ0g7OzsyQ0FFa0IsUyxFQUFXLFMsRUFBVztBQUNyQyxnQkFBSSxLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLFlBQWhCLEtBQWlDLFVBQVUsSUFBVixDQUFlLFlBQXBELEVBQWtFO0FBQzlELHFCQUFLLFlBQUw7QUFDSDtBQUNKOzs7aUNBRVE7QUFDTCxnQkFBSSxlQUFlLE1BQU0sS0FBTixDQUFZLFlBQS9COztBQUVBLG1CQUNJO0FBQUE7QUFBQTtBQUNJLG9DQUFDLFlBQUQsSUFBYyxPQUFPLEtBQUssS0FBTCxDQUFXLEtBQWhDLEdBREo7QUFHSTtBQUFBO0FBQUEsc0JBQU8sV0FBVSxvQ0FBakI7QUFDSTtBQUFBO0FBQUE7QUFDSTtBQUFBO0FBQUE7QUFDSTtBQUFBO0FBQUE7QUFBQTtBQUFBLDZCQURKO0FBRUk7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUZKO0FBREoscUJBREo7QUFPSTtBQUFBO0FBQUE7QUFFSSw2QkFBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixLQUFoQixDQUFzQixHQUF0QixDQUEwQixVQUFDLElBQUQsRUFBUTtBQUM5QixtQ0FDSTtBQUFBO0FBQUEsa0NBQUksS0FBSyxLQUFLLElBQWQ7QUFDSTtBQUFBO0FBQUE7QUFBSyx5Q0FBSztBQUFWLGlDQURKO0FBRUk7QUFBQTtBQUFBO0FBQUsseUNBQUs7QUFBVjtBQUZKLDZCQURKO0FBTUgseUJBUEQ7QUFGSjtBQVBKO0FBSEosYUFESjtBQTJCSDs7OztFQXZEd0IsTUFBTSxTOzs7QUF3RGxDOzs7OztBQ3hERDs7Ozs7O0FBRUEsTUFBTSxZQUFOLENBQW1CO0FBQ2YsUUFBSSxRQURXO0FBRWYsVUFBTSxtQkFGUztBQUdmLGlCQUFhLHlDQUhFO0FBSWYsa0JBQWMsQ0FKQztBQUtmLG1CQUFlLENBTEE7QUFNZixXQUFRLE1BTk87QUFPZixhQUFTLElBUE07QUFRZiwwQkFBc0IsQ0FDbEIsRUFBQyxJQUFJLGFBQUwsRUFBb0IsU0FBUyxDQUE3QixFQURrQixDQVJQOztBQVlmLGVBQVcsbUJBQVMsTUFBVCxFQUFnQixPQUFoQixFQUF5QjtBQUNoQyxZQUFJLGVBQWUsUUFBUSxVQUFSLEdBQXFCLFFBQXJCLENBQThCLGNBQTlCLENBQW5COztBQUVBLFlBQUksWUFBSixFQUFrQjtBQUNkLG1CQUFPLFFBQVEsVUFBUixHQUFxQixLQUFyQix5Q0FBaUUsWUFBakUsRUFDRixJQURFLENBQ0c7QUFBQSx1QkFBTSxRQUFRLE9BQVIsQ0FBZ0IsRUFBQyxRQUFRLEVBQUUsR0FBRixDQUFNLElBQU4sRUFBWSxpQkFBWixFQUErQixFQUEvQixDQUFULEVBQWhCLENBQU47QUFBQSxhQURILENBQVA7QUFFSDtBQUNELGVBQU8sUUFBUSxPQUFSLENBQWdCLEVBQUMsUUFBTyxFQUFSLEVBQWhCLENBQVA7QUFDSCxLQXBCYzs7QUFzQmYsWUFBUSxnQkFBUyxNQUFULEVBQWdCLElBQWhCLEVBQXFCLEtBQXJCLEVBQTJCLE9BQTNCLEVBQW9DO0FBQ3hDLFlBQUksRUFBRSxPQUFGLENBQVUsSUFBVixDQUFKLEVBQXFCO0FBQ2pCLG1CQUFPLG9CQUFDLEtBQUQsQ0FBTyxLQUFQLENBQWEsT0FBYixPQUFQO0FBQ0g7O0FBRUQsWUFBSSxnQkFBZ0IsT0FBTyxNQUFQLENBQWMsRUFBZCxFQUFpQixJQUFqQixFQUFzQjtBQUN0QyxtQkFBTyxPQUFPLElBQVAsQ0FBWSxLQUFLLE1BQWpCLEVBQXlCLEdBQXpCLENBQTZCLFVBQVMsR0FBVCxFQUFjO0FBQzlDLHVCQUFPLEVBQUMsTUFBTSxHQUFQLEVBQVksT0FBTyxLQUFLLE1BQUwsQ0FBWSxHQUFaLENBQW5CLEVBQVA7QUFDQyxhQUZFLENBRCtCO0FBSXRDLDBCQUFlLFFBQVEsVUFBUixHQUFxQixRQUFyQixDQUE4QixjQUE5QjtBQUp1QixTQUF0QixDQUFwQjs7QUFPQSxlQUNJLDZDQUFhLE1BQU0sYUFBbkIsRUFBa0MsU0FBUyxPQUEzQyxHQURKO0FBR0g7QUFyQ2MsQ0FBbkIsRSxDQU5BIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IHBhd2VscG9zZWwgb24gMDcvMTEvMjAxNi5cclxuICovXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcclxuICAgICAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIF9yZWZyZXNoRGF0YSgpIHtcclxuICAgICAgICB0aGlzLnByb3BzLnRvb2xib3gucmVmcmVzaCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIHRoaXMucHJvcHMudG9vbGJveC5nZXRFdmVudEJ1cygpLm9uKCdpbnB1dHM6cmVmcmVzaCcsIHRoaXMuX3JlZnJlc2hEYXRhLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcclxuICAgICAgICB0aGlzLnByb3BzLnRvb2xib3guZ2V0RXZlbnRCdXMoKS5vZmYoJ2lucHV0czpyZWZyZXNoJywgdGhpcy5fcmVmcmVzaERhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMsIHByZXZTdGF0ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLnByb3BzLmRhdGEuZGVwbG95bWVudElkICE9PSBwcmV2UHJvcHMuZGF0YS5kZXBsb3ltZW50SWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVmcmVzaERhdGEoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHZhciBFcnJvck1lc3NhZ2UgPSBTdGFnZS5CYXNpYy5FcnJvck1lc3NhZ2U7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8RXJyb3JNZXNzYWdlIGVycm9yPXt0aGlzLnN0YXRlLmVycm9yfS8+XHJcblxyXG4gICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT1cInVpIHZlcnkgY29tcGFjdCB0YWJsZSBvdXRwdXRzVGFibGVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8dGhlYWQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5OYW1lPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5WYWx1ZTwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmRhdGEuaXRlbXMubWFwKChpdGVtKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHIga2V5PXtpdGVtLm5hbWV9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e2l0ZW0ubmFtZX08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e2l0ZW0udmFsdWV9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cclxuICAgICAgICAgICAgICAgIDwvdGFibGU+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59O1xyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBwYXdlbHBvc2VsIG9uIDA3LzExLzIwMTYuXHJcbiAqL1xyXG5cclxuaW1wb3J0IElucHV0c1RhYmxlIGZyb20gJy4vSW5wdXRzVGFibGUnO1xyXG5cclxuU3RhZ2UuZGVmaW5lV2lkZ2V0KHtcclxuICAgIGlkOiAnaW5wdXRzJyxcclxuICAgIG5hbWU6ICdEZXBsb3ltZW50IElucHV0cycsXHJcbiAgICBkZXNjcmlwdGlvbjogJ1RoaXMgd2lkZ2V0IHNob3dzIHRoZSBkZXBsb3ltZW50IGlucHV0cycsXHJcbiAgICBpbml0aWFsV2lkdGg6IDgsXHJcbiAgICBpbml0aWFsSGVpZ2h0OiA0LFxyXG4gICAgY29sb3IgOiBcInRlYWxcIixcclxuICAgIGlzUmVhY3Q6IHRydWUsXHJcbiAgICBpbml0aWFsQ29uZmlndXJhdGlvbjogW1xyXG4gICAgICAgIHtpZDogXCJwb2xsaW5nVGltZVwiLCBkZWZhdWx0OiAyfVxyXG4gICAgXSxcclxuXHJcbiAgICBmZXRjaERhdGE6IGZ1bmN0aW9uKHdpZGdldCx0b29sYm94KSB7XHJcbiAgICAgICAgbGV0IGRlcGxveW1lbnRJZCA9IHRvb2xib3guZ2V0Q29udGV4dCgpLmdldFZhbHVlKCdkZXBsb3ltZW50SWQnKTtcclxuXHJcbiAgICAgICAgaWYgKGRlcGxveW1lbnRJZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdG9vbGJveC5nZXRNYW5hZ2VyKCkuZG9HZXQoYC9kZXBsb3ltZW50cz9faW5jbHVkZT1pZCxpbnB1dHMmaWQ9JHtkZXBsb3ltZW50SWR9YClcclxuICAgICAgICAgICAgICAgIC50aGVuKGRhdGE9PlByb21pc2UucmVzb2x2ZSh7aW5wdXRzOiBfLmdldChkYXRhLCBcIml0ZW1zWzBdLmlucHV0c1wiLCB7fSl9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe2lucHV0czp7fX0pO1xyXG4gICAgfSxcclxuXHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uKHdpZGdldCxkYXRhLGVycm9yLHRvb2xib3gpIHtcclxuICAgICAgICBpZiAoXy5pc0VtcHR5KGRhdGEpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiA8U3RhZ2UuQmFzaWMuTG9hZGluZy8+O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGZvcm1hdHRlZERhdGEgPSBPYmplY3QuYXNzaWduKHt9LGRhdGEse1xyXG4gICAgICAgICAgICBpdGVtczogT2JqZWN0LmtleXMoZGF0YS5pbnB1dHMpLm1hcChmdW5jdGlvbihrZXkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7bmFtZToga2V5LCB2YWx1ZTogZGF0YS5pbnB1dHNba2V5XX07XHJcbiAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgZGVwbG95bWVudElkIDogdG9vbGJveC5nZXRDb250ZXh0KCkuZ2V0VmFsdWUoJ2RlcGxveW1lbnRJZCcpXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxJbnB1dHNUYWJsZSBkYXRhPXtmb3JtYXR0ZWREYXRhfSB0b29sYm94PXt0b29sYm94fS8+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSk7Il19
