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
            this.props.context.refresh();
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.props.context.getEventBus().on('outputs:refresh', this._refreshData, this);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.props.context.getEventBus().off('outputs:refresh', this._refreshData);
        }
    }, {
        key: 'render',
        value: function render() {

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
                    'div',
                    null,
                    'Outputs for deployment with id: ',
                    this.props.deploymentId || "NA"
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
"use strict";

var _OutputsTable = require("./OutputsTable");

var _OutputsTable2 = _interopRequireDefault(_OutputsTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Stage.addPlugin({
    id: "outputs",
    name: "Deployment Outputs",
    description: 'blah blah blah',
    initialWidth: 8,
    initialHeight: 5,
    color: "blue",
    isReact: true,
    init: function init(pluginUtils) {},

    fetchData: function fetchData(output, context, pluginUtils) {
        return new Promise(function (resolve, reject) {
            pluginUtils.jQuery.get({
                url: context.getManagerUrl() + '/api/v2.1/deployments?_include=id,outputs',
                dataType: 'json'
            }).done(function (outputs) {
                resolve(outputs);
            }).fail(reject);
        });
    },

    render: function render(widget, data, error, context, pluginUtils) {

        if (!data) {
            return pluginUtils.renderReactLoading();
        }

        if (error) {
            return pluginUtils.renderReactError(error);
        }

        var deploymentId = context.getValue('deploymentId');
        var filteredItems = { items: [] };
        var formattedData = { items: [] };
        if (deploymentId) {
            filteredItems.items = _.filter(data.items, { id: deploymentId });
            formattedData = Object.assign({}, data, {
                items: _.map(filteredItems.items, function (item) {
                    var description = "";
                    var value = "";
                    if (item.outputs.endpoint) {
                        description = item.outputs.endpoint.description;
                        value = JSON.stringify(item.outputs.endpoint.value);
                    }
                    return Object.assign({}, item, {
                        id: item.id,
                        description: description,
                        value: value
                    });
                })
            });
        }

        return React.createElement(
            "div",
            null,
            React.createElement(_OutputsTable2.default, { widget: widget, data: formattedData, context: context, utils: pluginUtils, deploymentId: deploymentId })
        );
    }
});

},{"./OutputsTable":1}]},{},[1,2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwbHVnaW5zL291dHB1dHMvc3JjL091dHB1dHNUYWJsZS5qcyIsInBsdWdpbnMvb3V0cHV0cy9zcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNFSSxvQkFBWSxLQUFaLEVBQWtCLE9BQWxCLEVBQTJCO0FBQUE7O0FBQUEsb0hBQ2pCLEtBRGlCLEVBQ1gsT0FEVzs7QUFFdkIsY0FBSyxLQUFMLEdBQWEsRUFBYjtBQUZ1QjtBQUcxQjs7Ozt1Q0FFYztBQUNYLGlCQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLE9BQW5CO0FBQ0g7Ozs0Q0FFbUI7QUFDaEIsaUJBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsV0FBbkIsR0FBaUMsRUFBakMsQ0FBb0MsaUJBQXBDLEVBQXNELEtBQUssWUFBM0QsRUFBd0UsSUFBeEU7QUFDSDs7OytDQUVzQjtBQUNuQixpQkFBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixXQUFuQixHQUFpQyxHQUFqQyxDQUFxQyxpQkFBckMsRUFBdUQsS0FBSyxZQUE1RDtBQUNIOzs7aUNBRVE7O0FBRUwsbUJBQ0k7QUFBQTtBQUFBO0FBRVEscUJBQUssS0FBTCxDQUFXLEtBQVgsR0FDSTtBQUFBO0FBQUEsc0JBQUssV0FBVSxrQkFBZixFQUFrQyxPQUFPLEVBQUMsV0FBVSxPQUFYLEVBQXpDO0FBQ0k7QUFBQTtBQUFBLDBCQUFLLFdBQVUsUUFBZjtBQUFBO0FBQUEscUJBREo7QUFFSTtBQUFBO0FBQUE7QUFBSSw2QkFBSyxLQUFMLENBQVc7QUFBZjtBQUZKLGlCQURKLEdBTUksRUFSWjtBQVVJO0FBQUE7QUFBQTtBQUFBO0FBQXNDLHlCQUFLLEtBQUwsQ0FBVyxZQUFYLElBQTJCO0FBQWpFLGlCQVZKO0FBWUk7QUFBQTtBQUFBLHNCQUFPLFdBQVUsb0NBQWpCO0FBQ0k7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FB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LGNBQWMsWUFBdkc7QUFESixTQURKO0FBS0g7QUE3RFcsQ0FBaEIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMsY29udGV4dCkge1xuICAgICAgICBzdXBlcihwcm9wcyxjb250ZXh0KTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHt9XG4gICAgfVxuXG4gICAgX3JlZnJlc2hEYXRhKCkge1xuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQucmVmcmVzaCgpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQuZ2V0RXZlbnRCdXMoKS5vbignb3V0cHV0czpyZWZyZXNoJyx0aGlzLl9yZWZyZXNoRGF0YSx0aGlzKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LmdldEV2ZW50QnVzKCkub2ZmKCdvdXRwdXRzOnJlZnJlc2gnLHRoaXMuX3JlZnJlc2hEYXRhKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmVycm9yID9cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgZXJyb3IgbWVzc2FnZVwiIHN0eWxlPXt7XCJkaXNwbGF5XCI6XCJibG9ja1wifX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoZWFkZXJcIj5FcnJvciBPY2N1cmVkPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+e3RoaXMuc3RhdGUuZXJyb3J9PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgICAgICAnJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA8ZGl2Pk91dHB1dHMgZm9yIGRlcGxveW1lbnQgd2l0aCBpZDoge3RoaXMucHJvcHMuZGVwbG95bWVudElkIHx8IFwiTkFcIn08L2Rpdj5cblxuICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJ1aSB2ZXJ5IGNvbXBhY3QgdGFibGUgb3V0cHV0c1RhYmxlXCI+XG4gICAgICAgICAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkRlc2NyaXB0aW9uPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5WYWx1ZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5kYXRhLml0ZW1zLm1hcCgoaXRlbSk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHIga2V5PXtpdGVtLmlkfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57aXRlbS5kZXNjcmlwdGlvbn08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPntpdGVtLnZhbHVlfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICApO1xuICAgIH1cbn07XG4iLCJpbXBvcnQgT3V0cHV0c1RhYmxlIGZyb20gJy4vT3V0cHV0c1RhYmxlJztcblxuU3RhZ2UuYWRkUGx1Z2luKHtcbiAgICBpZDogXCJvdXRwdXRzXCIsXG4gICAgbmFtZTogXCJEZXBsb3ltZW50IE91dHB1dHNcIixcbiAgICBkZXNjcmlwdGlvbjogJ2JsYWggYmxhaCBibGFoJyxcbiAgICBpbml0aWFsV2lkdGg6IDgsXG4gICAgaW5pdGlhbEhlaWdodDogNSxcbiAgICBjb2xvciA6IFwiYmx1ZVwiLFxuICAgIGlzUmVhY3Q6IHRydWUsXG4gICAgaW5pdDogZnVuY3Rpb24ocGx1Z2luVXRpbHMpIHtcbiAgICB9LFxuXG4gICAgZmV0Y2hEYXRhOiBmdW5jdGlvbihvdXRwdXQsY29udGV4dCxwbHVnaW5VdGlscykge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIChyZXNvbHZlLHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgcGx1Z2luVXRpbHMualF1ZXJ5LmdldCh7XG4gICAgICAgICAgICAgICAgdXJsOiBjb250ZXh0LmdldE1hbmFnZXJVcmwoKSArICcvYXBpL3YyLjEvZGVwbG95bWVudHM/X2luY2x1ZGU9aWQsb3V0cHV0cycsXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmRvbmUoKG91dHB1dHMpPT4ge3Jlc29sdmUob3V0cHV0cyk7fSlcbiAgICAgICAgICAgICAgICAuZmFpbChyZWplY3QpXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKHdpZGdldCxkYXRhLGVycm9yLGNvbnRleHQscGx1Z2luVXRpbHMpIHtcblxuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiBwbHVnaW5VdGlscy5yZW5kZXJSZWFjdExvYWRpbmcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIHBsdWdpblV0aWxzLnJlbmRlclJlYWN0RXJyb3IoZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGRlcGxveW1lbnRJZCA9IGNvbnRleHQuZ2V0VmFsdWUoJ2RlcGxveW1lbnRJZCcpO1xuICAgICAgICB2YXIgZmlsdGVyZWRJdGVtcyA9IHtpdGVtczpbXX07XG4gICAgICAgIHZhciBmb3JtYXR0ZWREYXRhID0ge2l0ZW1zOltdfTtcbiAgICAgICAgaWYgKGRlcGxveW1lbnRJZCkge1xuICAgICAgICAgICAgZmlsdGVyZWRJdGVtcy5pdGVtcyA9IF8uZmlsdGVyKGRhdGEuaXRlbXMse2lkOmRlcGxveW1lbnRJZH0pO1xuICAgICAgICAgICAgZm9ybWF0dGVkRGF0YSA9IE9iamVjdC5hc3NpZ24oe30sZGF0YSx7XG4gICAgICAgICAgICAgICAgaXRlbXM6IF8ubWFwIChmaWx0ZXJlZEl0ZW1zLml0ZW1zLChpdGVtKT0+e1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGVzY3JpcHRpb24gPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5vdXRwdXRzLmVuZHBvaW50KVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9IGl0ZW0ub3V0cHV0cy5lbmRwb2ludC5kZXNjcmlwdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gSlNPTi5zdHJpbmdpZnkoaXRlbS5vdXRwdXRzLmVuZHBvaW50LnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSxpdGVtLHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBpdGVtLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8T3V0cHV0c1RhYmxlIHdpZGdldD17d2lkZ2V0fSBkYXRhPXtmb3JtYXR0ZWREYXRhfSBjb250ZXh0PXtjb250ZXh0fSB1dGlscz17cGx1Z2luVXRpbHN9IGRlcGxveW1lbnRJZD17ZGVwbG95bWVudElkfS8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59KTsiXX0=
