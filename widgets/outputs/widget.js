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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3aWRnZXRzXFxvdXRwdXRzXFxzcmNcXE91dHB1dHNUYWJsZS5qcyIsIndpZGdldHNcXG91dHB1dHNcXHNyY1xcd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNFSSxvQkFBWSxLQUFaLEVBQW1CLE9BQW5CLEVBQTRCO0FBQUE7O0FBQUEsb0hBQ2xCLEtBRGtCLEVBQ1gsT0FEVzs7QUFFeEIsY0FBSyxLQUFMLEdBQWEsRUFBYjtBQUZ3QjtBQUczQjs7Ozt1Q0FFYztBQUNYLGlCQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLE9BQW5CO0FBQ0g7Ozs0Q0FFbUI7QUFDaEIsaUJBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsV0FBbkIsR0FBaUMsRUFBakMsQ0FBb0MsaUJBQXBDLEVBQXNELEtBQUssWUFBM0QsRUFBd0UsSUFBeEU7QUFDSDs7OytDQUVzQjtBQUNuQixpQkFBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixXQUFuQixHQUFpQyxHQUFqQyxDQUFxQyxpQkFBckMsRUFBdUQsS0FBSyxZQUE1RDtBQUNIOzs7MkNBRWtCLFMsRUFBVyxTLEVBQVc7QUFDckMsZ0JBQUksS0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixZQUFoQixLQUFpQyxVQUFVLElBQVYsQ0FBZSxZQUFwRCxFQUFrRTtBQUM5RCxxQkFBSyxZQUFMO0FBQ0g7QUFDSjs7O2lDQUVRO0FBQ0wsZ0JBQUksZUFBZSxNQUFNLEtBQU4sQ0FBWSxZQUEvQjs7QUFFQSxtQkFDSTtBQUFBO0FBQUE7QUFDSSxvQ0FBQyxZQUFELElBQWMsT0FBTyxLQUFLLEtBQUwsQ0FBVyxLQUFoQyxHQURKO0FBR0k7QUFBQTtBQUFBLHNCQUFPLFdBQVUsb0NBQWpCO0FBQ0k7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQ0k7QUFBQTtBQUFBO0FBQUE7QUFBQSw2QkFESjtBQUVJO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFGSjtBQURBLHFCQURKO0FBT0k7QUFBQTtBQUFBO0FBRUksNkJBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsS0FBaEIsQ0FBc0IsR0FBdEIsQ0FBMEIsVUFBQyxJQUFELEVBQVE7QUFDOUIsZ0NBQUksUUFBUSxFQUFaO0FBQ0EsZ0NBQUk7QUFDQSx3Q0FBUSxLQUFLLFNBQUwsQ0FBZSxLQUFLLEtBQXBCLENBQVI7QUFDSCw2QkFGRCxDQUVFLE9BQU8sQ0FBUCxFQUFVO0FBQ1Isd0NBQVEsS0FBUixDQUFjLDJCQUFkLEVBQTBDLENBQTFDO0FBQ0g7O0FBRUQsbUNBQ0k7QUFBQTtBQUFBLGtDQUFJLEtBQUssS0FBSyxFQUFkO0FBQ0k7QUFBQTtBQUFBO0FBQUsseUNBQUs7QUFBVixpQ0FESjtBQUVJO0FBQUE7QUFBQTtBQUFLO0FBQUw7QUFGSiw2QkFESjtBQU1ILHlCQWREO0FBRko7QUFQSjtBQUhKLGFBREo7QUFrQ0g7Ozs7RUE5RHdCLE1BQU0sUzs7O0FBK0RsQzs7Ozs7QUMvREQ7Ozs7OztBQUVBLE1BQU0sWUFBTixDQUFtQjtBQUNmLFFBQUksU0FEVztBQUVmLFVBQU0sb0JBRlM7QUFHZixpQkFBYSwwQ0FIRTtBQUlmLGtCQUFjLENBSkM7QUFLZixtQkFBZSxDQUxBO0FBTWYsV0FBUSxNQU5PO0FBT2YsYUFBUyxJQVBNO0FBUWYsMEJBQXNCLENBQ2xCLEVBQUMsSUFBSSxhQUFMLEVBQW9CLFNBQVMsQ0FBN0IsRUFEa0IsQ0FSUDs7QUFZZixlQUFXLG1CQUFTLE1BQVQsRUFBZ0IsT0FBaEIsRUFBeUI7QUFDaEMsWUFBSSxlQUFlLFFBQVEsVUFBUixHQUFxQixRQUFyQixDQUE4QixjQUE5QixDQUFuQjs7QUFFQSxZQUFJLFlBQUosRUFBa0I7QUFDZCxtQkFBTyxRQUFRLFVBQVIsR0FBcUIsS0FBckIsMENBQWtFLFlBQWxFLEVBQ0YsSUFERSxDQUNHO0FBQUEsdUJBQU0sUUFBUSxPQUFSLENBQWdCLEVBQUMsU0FBUyxFQUFFLEdBQUYsQ0FBTSxJQUFOLEVBQVksa0JBQVosRUFBZ0MsRUFBaEMsQ0FBVixFQUFoQixDQUFOO0FBQUEsYUFESCxDQUFQO0FBRUg7QUFDRCxlQUFPLFFBQVEsT0FBUixDQUFnQixFQUFDLFNBQVEsRUFBVCxFQUFoQixDQUFQO0FBQ0gsS0FwQmM7O0FBc0JmLFlBQVEsZ0JBQVMsTUFBVCxFQUFnQixJQUFoQixFQUFxQixLQUFyQixFQUEyQixPQUEzQixFQUFvQztBQUN4QyxZQUFJLEVBQUUsT0FBRixDQUFVLElBQVYsQ0FBSixFQUFxQjtBQUNqQixtQkFBTyxvQkFBQyxLQUFELENBQU8sS0FBUCxDQUFhLE9BQWIsT0FBUDtBQUNIOztBQUVELFlBQUksZ0JBQWdCLE9BQU8sTUFBUCxDQUFjLEVBQWQsRUFBaUIsSUFBakIsRUFBc0I7QUFDdEMsbUJBQU8sT0FBTyxJQUFQLENBQVksS0FBSyxPQUFqQixFQUEwQixHQUExQixDQUE4QixVQUFTLEdBQVQsRUFBYztBQUMvQyxvQkFBSSxNQUFNLEtBQUssT0FBTCxDQUFhLEdBQWIsQ0FBVjtBQUNBLHVCQUFPLEVBQUMsSUFBSSxHQUFMLEVBQVUsYUFBYSxJQUFJLFdBQTNCLEVBQXdDLE9BQU8sSUFBSSxLQUFuRCxFQUFQO0FBQ0gsYUFITSxDQUQrQjtBQUt0QywwQkFBZSxRQUFRLFVBQVIsR0FBcUIsUUFBckIsQ0FBOEIsY0FBOUI7QUFMdUIsU0FBdEIsQ0FBcEI7O0FBUUEsZUFDSSw4Q0FBYyxNQUFNLGFBQXBCLEVBQW1DLFNBQVMsT0FBNUMsR0FESjtBQUdIO0FBdENjLENBQW5CIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcclxuICAgICAgICB0aGlzLnN0YXRlID0ge307XHJcbiAgICB9XHJcblxyXG4gICAgX3JlZnJlc2hEYXRhKCkge1xyXG4gICAgICAgIHRoaXMucHJvcHMudG9vbGJveC5yZWZyZXNoKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgdGhpcy5wcm9wcy50b29sYm94LmdldEV2ZW50QnVzKCkub24oJ291dHB1dHM6cmVmcmVzaCcsdGhpcy5fcmVmcmVzaERhdGEsdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XHJcbiAgICAgICAgdGhpcy5wcm9wcy50b29sYm94LmdldEV2ZW50QnVzKCkub2ZmKCdvdXRwdXRzOnJlZnJlc2gnLHRoaXMuX3JlZnJlc2hEYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzLCBwcmV2U3RhdGUpIHtcclxuICAgICAgICBpZiAodGhpcy5wcm9wcy5kYXRhLmRlcGxveW1lbnRJZCAhPT0gcHJldlByb3BzLmRhdGEuZGVwbG95bWVudElkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlZnJlc2hEYXRhKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICB2YXIgRXJyb3JNZXNzYWdlID0gU3RhZ2UuQmFzaWMuRXJyb3JNZXNzYWdlO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPEVycm9yTWVzc2FnZSBlcnJvcj17dGhpcy5zdGF0ZS5lcnJvcn0vPlxyXG5cclxuICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJ1aSB2ZXJ5IGNvbXBhY3QgdGFibGUgb3V0cHV0c1RhYmxlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRoZWFkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkRlc2NyaXB0aW9uPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlZhbHVlPC90aD5cclxuICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5kYXRhLml0ZW1zLm1hcCgoaXRlbSk9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KGl0ZW0udmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Nhbm5vdCBwYXJzZSBvdXRwdXQgdmFsdWUnLGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyIGtleT17aXRlbS5pZH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57aXRlbS5kZXNjcmlwdGlvbn08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3ZhbHVlfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XHJcbiAgICAgICAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufTtcclxuIiwiaW1wb3J0IE91dHB1dHNUYWJsZSBmcm9tICcuL091dHB1dHNUYWJsZSc7XHJcblxyXG5TdGFnZS5kZWZpbmVXaWRnZXQoe1xyXG4gICAgaWQ6IFwib3V0cHV0c1wiLFxyXG4gICAgbmFtZTogXCJEZXBsb3ltZW50IE91dHB1dHNcIixcclxuICAgIGRlc2NyaXB0aW9uOiAnVGhpcyB3aWRnZXQgc2hvd3MgdGhlIGRlcGxveW1lbnQgb3V0cHV0cycsXHJcbiAgICBpbml0aWFsV2lkdGg6IDgsXHJcbiAgICBpbml0aWFsSGVpZ2h0OiA1LFxyXG4gICAgY29sb3IgOiBcImJsdWVcIixcclxuICAgIGlzUmVhY3Q6IHRydWUsXHJcbiAgICBpbml0aWFsQ29uZmlndXJhdGlvbjogW1xyXG4gICAgICAgIHtpZDogXCJwb2xsaW5nVGltZVwiLCBkZWZhdWx0OiAyfVxyXG4gICAgXSxcclxuXHJcbiAgICBmZXRjaERhdGE6IGZ1bmN0aW9uKHdpZGdldCx0b29sYm94KSB7XHJcbiAgICAgICAgbGV0IGRlcGxveW1lbnRJZCA9IHRvb2xib3guZ2V0Q29udGV4dCgpLmdldFZhbHVlKCdkZXBsb3ltZW50SWQnKTtcclxuXHJcbiAgICAgICAgaWYgKGRlcGxveW1lbnRJZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdG9vbGJveC5nZXRNYW5hZ2VyKCkuZG9HZXQoYC9kZXBsb3ltZW50cz9faW5jbHVkZT1pZCxvdXRwdXRzJmlkPSR7ZGVwbG95bWVudElkfWApXHJcbiAgICAgICAgICAgICAgICAudGhlbihkYXRhPT5Qcm9taXNlLnJlc29sdmUoe291dHB1dHM6IF8uZ2V0KGRhdGEsIFwiaXRlbXNbMF0ub3V0cHV0c1wiLCB7fSl9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe291dHB1dHM6e319KTtcclxuICAgIH0sXHJcblxyXG4gICAgcmVuZGVyOiBmdW5jdGlvbih3aWRnZXQsZGF0YSxlcnJvcix0b29sYm94KSB7XHJcbiAgICAgICAgaWYgKF8uaXNFbXB0eShkYXRhKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gPFN0YWdlLkJhc2ljLkxvYWRpbmcvPjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBmb3JtYXR0ZWREYXRhID0gT2JqZWN0LmFzc2lnbih7fSxkYXRhLHtcclxuICAgICAgICAgICAgaXRlbXM6IE9iamVjdC5rZXlzKGRhdGEub3V0cHV0cykubWFwKGZ1bmN0aW9uKGtleSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHZhbCA9IGRhdGEub3V0cHV0c1trZXldO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtpZDoga2V5LCBkZXNjcmlwdGlvbjogdmFsLmRlc2NyaXB0aW9uLCB2YWx1ZTogdmFsLnZhbHVlfTtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIGRlcGxveW1lbnRJZCA6IHRvb2xib3guZ2V0Q29udGV4dCgpLmdldFZhbHVlKCdkZXBsb3ltZW50SWQnKVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8T3V0cHV0c1RhYmxlIGRhdGE9e2Zvcm1hdHRlZERhdGF9IHRvb2xib3g9e3Rvb2xib3h9Lz5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59KTsiXX0=
