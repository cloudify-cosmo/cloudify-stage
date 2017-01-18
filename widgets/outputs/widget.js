(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
            this.props.toolbox.getEventBus().on('outputs:refresh', this._refreshData, this);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.props.toolbox.getEventBus().off('outputs:refresh', this._refreshData);
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
                                'Description'
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
                            var value = '';
                            try {
                                value = JSON.stringify(item.value);
                            } catch (e) {
                                console.error('cannot parse output value', e);
                            }

                            return React.createElement(
                                'tr',
                                { key: item.id },
                                React.createElement(
                                    'td',
                                    null,
                                    item.description
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    value
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
"use strict";

var _OutputsTable = require("./OutputsTable");

var _OutputsTable2 = _interopRequireDefault(_OutputsTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Stage.defineWidget({
    id: "outputs",
    name: "Deployment Outputs",
    description: 'This widget shows the deployment outputs',
    initialWidth: 8,
    initialHeight: 5,
    color: "blue",
    isReact: true,
    initialConfiguration: [{ id: "pollingTime", default: 2 }],

    fetchData: function fetchData(widget, toolbox) {
        var deploymentId = toolbox.getContext().getValue('deploymentId');

        if (deploymentId) {
            return toolbox.getManager().doGet("/deployments?_include=id,outputs&id=" + deploymentId).then(function (data) {
                return Promise.resolve({ outputs: _.get(data, "items[0].outputs", {}) });
            });
        }
        return Promise.resolve({ outputs: {} });
    },

    render: function render(widget, data, error, toolbox) {
        if (_.isEmpty(data)) {
            return React.createElement(Stage.Basic.Loading, null);
        }

        var formattedData = Object.assign({}, data, {
            items: Object.keys(data.outputs).map(function (key) {
                var val = data.outputs[key];
                return { id: key, description: val.description, value: val.value };
            }),
            deploymentId: toolbox.getContext().getValue('deploymentId')
        });

        return React.createElement(_OutputsTable2.default, { data: formattedData, toolbox: toolbox });
    }
});

},{"./OutputsTable":1}]},{},[1,2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3aWRnZXRzL291dHB1dHMvc3JjL091dHB1dHNUYWJsZS5qcyIsIndpZGdldHMvb3V0cHV0cy9zcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNFSSxvQkFBWSxLQUFaLEVBQW1CLE9BQW5CLEVBQTRCO0FBQUE7O0FBQUEsb0hBQ2xCLEtBRGtCLEVBQ1gsT0FEVzs7QUFFeEIsY0FBSyxLQUFMLEdBQWEsRUFBYjtBQUZ3QjtBQUczQjs7Ozt1Q0FFYztBQUNYLGlCQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLE9BQW5CO0FBQ0g7Ozs0Q0FFbUI7QUFDaEIsaUJBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsV0FBbkIsR0FBaUMsRUFBakMsQ0FBb0MsaUJBQXBDLEVBQXNELEtBQUssWUFBM0QsRUFBd0UsSUFBeEU7QUFDSDs7OytDQUVzQjtBQUNuQixpQkFBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixXQUFuQixHQUFpQyxHQUFqQyxDQUFxQyxpQkFBckMsRUFBdUQsS0FBSyxZQUE1RDtBQUNIOzs7MkNBRWtCLFMsRUFBVyxTLEVBQVc7QUFDckMsZ0JBQUksS0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixZQUFoQixLQUFpQyxVQUFVLElBQVYsQ0FBZSxZQUFwRCxFQUFrRTtBQUM5RCxxQkFBSyxZQUFMO0FBQ0g7QUFDSjs7O2lDQUVRO0FBQ0wsZ0JBQUksZUFBZSxNQUFNLEtBQU4sQ0FBWSxZQUEvQjs7QUFFQSxtQkFDSTtBQUFBO0FBQUE7QUFDSSxvQ0FBQyxZQUFELElBQWMsT0FBTyxLQUFLLEtBQUwsQ0FBVyxLQUFoQyxHQURKO0FBR0k7QUFBQTtBQUFBLHNCQUFPLFdBQVUsb0NBQWpCO0FBQ0k7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQ0k7QUFBQTtBQUFBO0FBQUE7QUFBQSw2QkFESjtBQUVJO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFGSjtBQURBLHFCQURKO0FBT0k7QUFBQTtBQUFBO0FBRUksNkJBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsS0FBaEIsQ0FBc0IsR0FBdEIsQ0FBMEIsVUFBQyxJQUFELEVBQVE7QUFDOUIsZ0NBQUksUUFBUSxFQUFaO0FBQ0EsZ0NBQUk7QUFDQSx3Q0FBUSxLQUFLLFNBQUwsQ0FBZSxLQUFLLEtBQXBCLENBQVI7QUFDSCw2QkFGRCxDQUVFLE9BQU8sQ0FBUCxFQUFVO0FBQ1Isd0NBQVEsS0FBUixDQUFjLDJCQUFkLEVBQTBDLENBQTFDO0FBQ0g7O0FBRUQsbUNBQ0k7QUFBQTtBQUFBLGtDQUFJLEtBQUssS0FBSyxFQUFkO0FBQ0k7QUFBQTtBQUFBO0FBQUsseUNBQUs7QUFBVixpQ0FESjtBQUVJO0FBQUE7QUFBQTtBQUFLO0FBQUw7QUFGSiw2QkFESjtBQU1ILHlCQWREO0FBRko7QUFQSjtBQUhKLGFBREo7QUFrQ0g7Ozs7RUE5RHdCLE1BQU0sUzs7O0FBK0RsQzs7Ozs7QUMvREQ7Ozs7OztBQUVBLE1BQU0sWUFBTixDQUFtQjtBQUNmLFFBQUksU0FEVztBQUVmLFVBQU0sb0JBRlM7QUFHZixpQkFBYSwwQ0FIRTtBQUlmLGtCQUFjLENBSkM7QUFLZixtQkFBZSxDQUxBO0FBTWYsV0FBUSxNQU5PO0FBT2YsYUFBUyxJQVBNO0FBUWYsMEJBQXNCLENBQ2xCLEVBQUMsSUFBSSxhQUFMLEVBQW9CLFNBQVMsQ0FBN0IsRUFEa0IsQ0FSUDs7QUFZZixlQUFXLG1CQUFTLE1BQVQsRUFBZ0IsT0FBaEIsRUFBeUI7QUFDaEMsWUFBSSxlQUFlLFFBQVEsVUFBUixHQUFxQixRQUFyQixDQUE4QixjQUE5QixDQUFuQjs7QUFFQSxZQUFJLFlBQUosRUFBa0I7QUFDZCxtQkFBTyxRQUFRLFVBQVIsR0FBcUIsS0FBckIsMENBQWtFLFlBQWxFLEVBQ0YsSUFERSxDQUNHO0FBQUEsdUJBQU0sUUFBUSxPQUFSLENBQWdCLEVBQUMsU0FBUyxFQUFFLEdBQUYsQ0FBTSxJQUFOLEVBQVksa0JBQVosRUFBZ0MsRUFBaEMsQ0FBVixFQUFoQixDQUFOO0FBQUEsYUFESCxDQUFQO0FBRUg7QUFDRCxlQUFPLFFBQVEsT0FBUixDQUFnQixFQUFDLFNBQVEsRUFBVCxFQUFoQixDQUFQO0FBQ0gsS0FwQmM7O0FBc0JmLFlBQVEsZ0JBQVMsTUFBVCxFQUFnQixJQUFoQixFQUFxQixLQUFyQixFQUEyQixPQUEzQixFQUFvQztBQUN4QyxZQUFJLEVBQUUsT0FBRixDQUFVLElBQVYsQ0FBSixFQUFxQjtBQUNqQixtQkFBTyxvQkFBQyxLQUFELENBQU8sS0FBUCxDQUFhLE9BQWIsT0FBUDtBQUNIOztBQUVELFlBQUksZ0JBQWdCLE9BQU8sTUFBUCxDQUFjLEVBQWQsRUFBaUIsSUFBakIsRUFBc0I7QUFDdEMsbUJBQU8sT0FBTyxJQUFQLENBQVksS0FBSyxPQUFqQixFQUEwQixHQUExQixDQUE4QixVQUFTLEdBQVQsRUFBYztBQUMvQyxvQkFBSSxNQUFNLEtBQUssT0FBTCxDQUFhLEdBQWIsQ0FBVjtBQUNBLHVCQUFPLEVBQUMsSUFBSSxHQUFMLEVBQVUsYUFBYSxJQUFJLFdBQTNCLEVBQXdDLE9BQU8sSUFBSSxLQUFuRCxFQUFQO0FBQ0gsYUFITSxDQUQrQjtBQUt0QywwQkFBZSxRQUFRLFVBQVIsR0FBcUIsUUFBckIsQ0FBOEIsY0FBOUI7QUFMdUIsU0FBdEIsQ0FBcEI7O0FBUUEsZUFDSSw4Q0FBYyxNQUFNLGFBQXBCLEVBQW1DLFNBQVMsT0FBNUMsR0FESjtBQUdIO0FBdENjLENBQW5CIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XG4gICAgICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHt9O1xuICAgIH1cblxuICAgIF9yZWZyZXNoRGF0YSgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy50b29sYm94LnJlZnJlc2goKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy50b29sYm94LmdldEV2ZW50QnVzKCkub24oJ291dHB1dHM6cmVmcmVzaCcsdGhpcy5fcmVmcmVzaERhdGEsdGhpcyk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgICAgIHRoaXMucHJvcHMudG9vbGJveC5nZXRFdmVudEJ1cygpLm9mZignb3V0cHV0czpyZWZyZXNoJyx0aGlzLl9yZWZyZXNoRGF0YSk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcywgcHJldlN0YXRlKSB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLmRhdGEuZGVwbG95bWVudElkICE9PSBwcmV2UHJvcHMuZGF0YS5kZXBsb3ltZW50SWQpIHtcbiAgICAgICAgICAgIHRoaXMuX3JlZnJlc2hEYXRhKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHZhciBFcnJvck1lc3NhZ2UgPSBTdGFnZS5CYXNpYy5FcnJvck1lc3NhZ2U7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPEVycm9yTWVzc2FnZSBlcnJvcj17dGhpcy5zdGF0ZS5lcnJvcn0vPlxuXG4gICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT1cInVpIHZlcnkgY29tcGFjdCB0YWJsZSBvdXRwdXRzVGFibGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+RGVzY3JpcHRpb248L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlZhbHVlPC90aD5cbiAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmRhdGEuaXRlbXMubWFwKChpdGVtKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gSlNPTi5zdHJpbmdpZnkoaXRlbS52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdjYW5ub3QgcGFyc2Ugb3V0cHV0IHZhbHVlJyxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHIga2V5PXtpdGVtLmlkfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57aXRlbS5kZXNjcmlwdGlvbn08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPnt2YWx1ZX08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICk7XG4gICAgfVxufTtcbiIsImltcG9ydCBPdXRwdXRzVGFibGUgZnJvbSAnLi9PdXRwdXRzVGFibGUnO1xuXG5TdGFnZS5kZWZpbmVXaWRnZXQoe1xuICAgIGlkOiBcIm91dHB1dHNcIixcbiAgICBuYW1lOiBcIkRlcGxveW1lbnQgT3V0cHV0c1wiLFxuICAgIGRlc2NyaXB0aW9uOiAnVGhpcyB3aWRnZXQgc2hvd3MgdGhlIGRlcGxveW1lbnQgb3V0cHV0cycsXG4gICAgaW5pdGlhbFdpZHRoOiA4LFxuICAgIGluaXRpYWxIZWlnaHQ6IDUsXG4gICAgY29sb3IgOiBcImJsdWVcIixcbiAgICBpc1JlYWN0OiB0cnVlLFxuICAgIGluaXRpYWxDb25maWd1cmF0aW9uOiBbXG4gICAgICAgIHtpZDogXCJwb2xsaW5nVGltZVwiLCBkZWZhdWx0OiAyfVxuICAgIF0sXG5cbiAgICBmZXRjaERhdGE6IGZ1bmN0aW9uKHdpZGdldCx0b29sYm94KSB7XG4gICAgICAgIGxldCBkZXBsb3ltZW50SWQgPSB0b29sYm94LmdldENvbnRleHQoKS5nZXRWYWx1ZSgnZGVwbG95bWVudElkJyk7XG5cbiAgICAgICAgaWYgKGRlcGxveW1lbnRJZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRvb2xib3guZ2V0TWFuYWdlcigpLmRvR2V0KGAvZGVwbG95bWVudHM/X2luY2x1ZGU9aWQsb3V0cHV0cyZpZD0ke2RlcGxveW1lbnRJZH1gKVxuICAgICAgICAgICAgICAgIC50aGVuKGRhdGE9PlByb21pc2UucmVzb2x2ZSh7b3V0cHV0czogXy5nZXQoZGF0YSwgXCJpdGVtc1swXS5vdXRwdXRzXCIsIHt9KX0pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHtvdXRwdXRzOnt9fSk7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24od2lkZ2V0LGRhdGEsZXJyb3IsdG9vbGJveCkge1xuICAgICAgICBpZiAoXy5pc0VtcHR5KGRhdGEpKSB7XG4gICAgICAgICAgICByZXR1cm4gPFN0YWdlLkJhc2ljLkxvYWRpbmcvPjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBmb3JtYXR0ZWREYXRhID0gT2JqZWN0LmFzc2lnbih7fSxkYXRhLHtcbiAgICAgICAgICAgIGl0ZW1zOiBPYmplY3Qua2V5cyhkYXRhLm91dHB1dHMpLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgICAgICBsZXQgdmFsID0gZGF0YS5vdXRwdXRzW2tleV07XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtpZDoga2V5LCBkZXNjcmlwdGlvbjogdmFsLmRlc2NyaXB0aW9uLCB2YWx1ZTogdmFsLnZhbHVlfTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgZGVwbG95bWVudElkIDogdG9vbGJveC5nZXRDb250ZXh0KCkuZ2V0VmFsdWUoJ2RlcGxveW1lbnRJZCcpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8T3V0cHV0c1RhYmxlIGRhdGE9e2Zvcm1hdHRlZERhdGF9IHRvb2xib3g9e3Rvb2xib3h9Lz5cbiAgICAgICAgKTtcbiAgICB9XG59KTsiXX0=
