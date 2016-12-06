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
            this.props.context.refresh();
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.props.context.getEventBus().on('inputs:refresh', this._refreshData, this);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.props.context.getEventBus().off('inputs:refresh', this._refreshData);
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
                    'div',
                    null,
                    'Inputs for deployment with id: ',
                    this.props.data.deploymentId || "NA"
                ),
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

Stage.addPlugin({
    id: 'inputs',
    name: 'Deployment Inputs',
    description: 'This plugin shows the deployment inputs',
    initialWidth: 8,
    initialHeight: 4,
    color: "teal",
    isReact: true,
    initialConfiguration: [{ id: "pollingTime", default: 2 }],

    fetchData: function fetchData(plugin, context, pluginUtils) {
        var deploymentId = context.getValue('deploymentId');

        if (deploymentId) {
            return context.getManager().doGet('/deployments?_include=id,inputs&id=' + deploymentId).then(function (data) {
                return Promise.resolve({ inputs: _.get(data, "items[0].inputs", {}) });
            });
        }
        return Promise.resolve({ inputs: {} });
    },

    render: function render(widget, data, error, context, pluginUtils) {
        if (_.isEmpty(data)) {
            return pluginUtils.renderReactLoading();
        }

        var formattedData = Object.assign({}, data, {
            items: Object.keys(data.inputs).map(function (key) {
                return { name: key, value: data.inputs[key] };
            }),
            deploymentId: context.getValue('deploymentId')
        });

        return React.createElement(_InputsTable2.default, { data: formattedData, context: context });
    }
}); /**
     * Created by pawelposel on 07/11/2016.
     */

},{"./InputsTable":1}]},{},[1,2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwbHVnaW5zXFxJbnB1dHNcXHNyY1xcSW5wdXRzVGFibGUuanMiLCJwbHVnaW5zXFxJbnB1dHNcXHNyY1xcd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7OztBQU1JLG9CQUFZLEtBQVosRUFBbUIsT0FBbkIsRUFBNEI7QUFBQTs7QUFBQSxvSEFDbEIsS0FEa0IsRUFDWCxPQURXOztBQUV4QixjQUFLLEtBQUwsR0FBYSxFQUFiO0FBRndCO0FBRzNCOzs7O3VDQUVjO0FBQ1gsaUJBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsT0FBbkI7QUFDSDs7OzRDQUVtQjtBQUNoQixpQkFBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixXQUFuQixHQUFpQyxFQUFqQyxDQUFvQyxnQkFBcEMsRUFBc0QsS0FBSyxZQUEzRCxFQUF5RSxJQUF6RTtBQUNIOzs7K0NBRXNCO0FBQ25CLGlCQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLFdBQW5CLEdBQWlDLEdBQWpDLENBQXFDLGdCQUFyQyxFQUF1RCxLQUFLLFlBQTVEO0FBQ0g7OzsyQ0FFa0IsUyxFQUFXLFMsRUFBVztBQUNyQyxnQkFBSSxLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLFlBQWhCLEtBQWlDLFVBQVUsSUFBVixDQUFlLFlBQXBELEVBQWtFO0FBQzlELHFCQUFLLFlBQUw7QUFDSDtBQUNKOzs7aUNBRVE7QUFDTCxnQkFBSSxlQUFlLE1BQU0sS0FBTixDQUFZLFlBQS9COztBQUVBLG1CQUNJO0FBQUE7QUFBQTtBQUNJLG9DQUFDLFlBQUQsSUFBYyxPQUFPLEtBQUssS0FBTCxDQUFXLEtBQWhDLEdBREo7QUFHSTtBQUFBO0FBQUE7QUFBQTtBQUFxQyx5QkFBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixZQUFoQixJQUFnQztBQUFyRSxpQkFISjtBQUtJO0FBQUE7QUFBQSxzQkFBTyxXQUFVLG9DQUFqQjtBQUNJO0FBQUE7QUFBQTtBQUNJO0FBQUE7QUFBQTtBQUNJO0FBQUE7QUFBQTtBQUFBO0FBQUEsNkJBREo7QUFFSTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRko7QUFESixxQkFESjtBQU9JO0FBQUE7QUFBQTtBQUVJLDZCQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLEtBQWhCLENBQXNCLEdBQXRCLENBQTBCLFVBQUMsSUFBRCxFQUFRO0FBQzlCLG1DQUNJO0FBQUE7QUFBQSxrQ0FBSSxLQUFLLEtBQUssSUFBZDtBQUNJO0FBQUE7QUFBQTtBQUFLLHlDQUFLO0FBQVYsaUNBREo7QUFFSTtBQUFBO0FBQUE7QUFBSyx5Q0FBSztBQUFWO0FBRkosNkJBREo7QUFNSCx5QkFQRDtBQUZKO0FBUEo7QUFMSixhQURKO0FBNkJIOzs7O0VBekR3QixNQUFNLFM7OztBQTBEbEM7Ozs7O0FDMUREOzs7Ozs7QUFFQSxNQUFNLFNBQU4sQ0FBZ0I7QUFDWixRQUFJLFFBRFE7QUFFWixVQUFNLG1CQUZNO0FBR1osaUJBQWEseUNBSEQ7QUFJWixrQkFBYyxDQUpGO0FBS1osbUJBQWUsQ0FMSDtBQU1aLFdBQVEsTUFOSTtBQU9aLGFBQVMsSUFQRztBQVFaLDBCQUFzQixDQUNsQixFQUFDLElBQUksYUFBTCxFQUFvQixTQUFTLENBQTdCLEVBRGtCLENBUlY7O0FBWVosZUFBVyxtQkFBUyxNQUFULEVBQWdCLE9BQWhCLEVBQXdCLFdBQXhCLEVBQXFDO0FBQzVDLFlBQUksZUFBZSxRQUFRLFFBQVIsQ0FBaUIsY0FBakIsQ0FBbkI7O0FBRUEsWUFBSSxZQUFKLEVBQWtCO0FBQ2QsbUJBQU8sUUFBUSxVQUFSLEdBQXFCLEtBQXJCLHlDQUFpRSxZQUFqRSxFQUNGLElBREUsQ0FDRztBQUFBLHVCQUFNLFFBQVEsT0FBUixDQUFnQixFQUFDLFFBQVEsRUFBRSxHQUFGLENBQU0sSUFBTixFQUFZLGlCQUFaLEVBQStCLEVBQS9CLENBQVQsRUFBaEIsQ0FBTjtBQUFBLGFBREgsQ0FBUDtBQUVIO0FBQ0QsZUFBTyxRQUFRLE9BQVIsQ0FBZ0IsRUFBQyxRQUFPLEVBQVIsRUFBaEIsQ0FBUDtBQUNILEtBcEJXOztBQXNCWixZQUFRLGdCQUFTLE1BQVQsRUFBZ0IsSUFBaEIsRUFBcUIsS0FBckIsRUFBMkIsT0FBM0IsRUFBbUMsV0FBbkMsRUFBZ0Q7QUFDcEQsWUFBSSxFQUFFLE9BQUYsQ0FBVSxJQUFWLENBQUosRUFBcUI7QUFDakIsbUJBQU8sWUFBWSxrQkFBWixFQUFQO0FBQ0g7O0FBRUQsWUFBSSxnQkFBZ0IsT0FBTyxNQUFQLENBQWMsRUFBZCxFQUFpQixJQUFqQixFQUFzQjtBQUN0QyxtQkFBTyxPQUFPLElBQVAsQ0FBWSxLQUFLLE1BQWpCLEVBQXlCLEdBQXpCLENBQTZCLFVBQVMsR0FBVCxFQUFjO0FBQzlDLHVCQUFPLEVBQUMsTUFBTSxHQUFQLEVBQVksT0FBTyxLQUFLLE1BQUwsQ0FBWSxHQUFaLENBQW5CLEVBQVA7QUFDQyxhQUZFLENBRCtCO0FBSXRDLDBCQUFlLFFBQVEsUUFBUixDQUFpQixjQUFqQjtBQUp1QixTQUF0QixDQUFwQjs7QUFPQSxlQUNJLDZDQUFhLE1BQU0sYUFBbkIsRUFBa0MsU0FBUyxPQUEzQyxHQURKO0FBR0g7QUFyQ1csQ0FBaEIsRSxDQU5BIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IHBhd2VscG9zZWwgb24gMDcvMTEvMjAxNi5cclxuICovXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcclxuICAgICAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIF9yZWZyZXNoRGF0YSgpIHtcclxuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQucmVmcmVzaCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5nZXRFdmVudEJ1cygpLm9uKCdpbnB1dHM6cmVmcmVzaCcsIHRoaXMuX3JlZnJlc2hEYXRhLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcclxuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQuZ2V0RXZlbnRCdXMoKS5vZmYoJ2lucHV0czpyZWZyZXNoJywgdGhpcy5fcmVmcmVzaERhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMsIHByZXZTdGF0ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLnByb3BzLmRhdGEuZGVwbG95bWVudElkICE9PSBwcmV2UHJvcHMuZGF0YS5kZXBsb3ltZW50SWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVmcmVzaERhdGEoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHZhciBFcnJvck1lc3NhZ2UgPSBTdGFnZS5CYXNpYy5FcnJvck1lc3NhZ2U7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8RXJyb3JNZXNzYWdlIGVycm9yPXt0aGlzLnN0YXRlLmVycm9yfS8+XHJcblxyXG4gICAgICAgICAgICAgICAgPGRpdj5JbnB1dHMgZm9yIGRlcGxveW1lbnQgd2l0aCBpZDoge3RoaXMucHJvcHMuZGF0YS5kZXBsb3ltZW50SWQgfHwgXCJOQVwifTwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJ1aSB2ZXJ5IGNvbXBhY3QgdGFibGUgb3V0cHV0c1RhYmxlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRoZWFkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+TmFtZTwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+VmFsdWU8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5kYXRhLml0ZW1zLm1hcCgoaXRlbSk9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyIGtleT17aXRlbS5uYW1lfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPntpdGVtLm5hbWV9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPntpdGVtLnZhbHVlfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XHJcbiAgICAgICAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufTtcclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgcGF3ZWxwb3NlbCBvbiAwNy8xMS8yMDE2LlxyXG4gKi9cclxuXHJcbmltcG9ydCBJbnB1dHNUYWJsZSBmcm9tICcuL0lucHV0c1RhYmxlJztcclxuXHJcblN0YWdlLmFkZFBsdWdpbih7XHJcbiAgICBpZDogJ2lucHV0cycsXHJcbiAgICBuYW1lOiAnRGVwbG95bWVudCBJbnB1dHMnLFxyXG4gICAgZGVzY3JpcHRpb246ICdUaGlzIHBsdWdpbiBzaG93cyB0aGUgZGVwbG95bWVudCBpbnB1dHMnLFxyXG4gICAgaW5pdGlhbFdpZHRoOiA4LFxyXG4gICAgaW5pdGlhbEhlaWdodDogNCxcclxuICAgIGNvbG9yIDogXCJ0ZWFsXCIsXHJcbiAgICBpc1JlYWN0OiB0cnVlLFxyXG4gICAgaW5pdGlhbENvbmZpZ3VyYXRpb246IFtcclxuICAgICAgICB7aWQ6IFwicG9sbGluZ1RpbWVcIiwgZGVmYXVsdDogMn1cclxuICAgIF0sXHJcblxyXG4gICAgZmV0Y2hEYXRhOiBmdW5jdGlvbihwbHVnaW4sY29udGV4dCxwbHVnaW5VdGlscykge1xyXG4gICAgICAgIGxldCBkZXBsb3ltZW50SWQgPSBjb250ZXh0LmdldFZhbHVlKCdkZXBsb3ltZW50SWQnKTtcclxuXHJcbiAgICAgICAgaWYgKGRlcGxveW1lbnRJZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gY29udGV4dC5nZXRNYW5hZ2VyKCkuZG9HZXQoYC9kZXBsb3ltZW50cz9faW5jbHVkZT1pZCxpbnB1dHMmaWQ9JHtkZXBsb3ltZW50SWR9YClcclxuICAgICAgICAgICAgICAgIC50aGVuKGRhdGE9PlByb21pc2UucmVzb2x2ZSh7aW5wdXRzOiBfLmdldChkYXRhLCBcIml0ZW1zWzBdLmlucHV0c1wiLCB7fSl9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe2lucHV0czp7fX0pO1xyXG4gICAgfSxcclxuXHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uKHdpZGdldCxkYXRhLGVycm9yLGNvbnRleHQscGx1Z2luVXRpbHMpIHtcclxuICAgICAgICBpZiAoXy5pc0VtcHR5KGRhdGEpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwbHVnaW5VdGlscy5yZW5kZXJSZWFjdExvYWRpbmcoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBmb3JtYXR0ZWREYXRhID0gT2JqZWN0LmFzc2lnbih7fSxkYXRhLHtcclxuICAgICAgICAgICAgaXRlbXM6IE9iamVjdC5rZXlzKGRhdGEuaW5wdXRzKS5tYXAoZnVuY3Rpb24oa2V5KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge25hbWU6IGtleSwgdmFsdWU6IGRhdGEuaW5wdXRzW2tleV19O1xyXG4gICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIGRlcGxveW1lbnRJZCA6IGNvbnRleHQuZ2V0VmFsdWUoJ2RlcGxveW1lbnRJZCcpXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxJbnB1dHNUYWJsZSBkYXRhPXtmb3JtYXR0ZWREYXRhfSBjb250ZXh0PXtjb250ZXh0fS8+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSk7Il19
