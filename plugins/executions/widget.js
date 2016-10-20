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
                    'table',
                    { className: 'ui very compact table executionsTable' },
                    React.createElement(
                        'thead',
                        null,
                        React.createElement(
                            'tr',
                            null,
                            React.createElement(
                                'th',
                                null,
                                'Blueprint'
                            ),
                            React.createElement(
                                'th',
                                null,
                                'Deployment'
                            ),
                            React.createElement(
                                'th',
                                null,
                                'Workflow'
                            ),
                            React.createElement(
                                'th',
                                null,
                                'Id'
                            ),
                            React.createElement(
                                'th',
                                null,
                                'Created'
                            ),
                            React.createElement(
                                'th',
                                null,
                                'Is System'
                            ),
                            React.createElement(
                                'th',
                                null,
                                'Status'
                            )
                        )
                    ),
                    React.createElement(
                        'tbody',
                        null,
                        this.props.data.items.map(function (item) {
                            return React.createElement(
                                'tr',
                                { key: item.id, className: 'row' },
                                React.createElement(
                                    'td',
                                    null,
                                    item.blueprint_id
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    item.deployment_id
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    item.workflow_id
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    item.id
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    item.created_at
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    item.is_system_workflow ? 'true' : 'false'
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    item.status,
                                    _.isEmpty(item.error) ? React.createElement('i', { className: 'check circle icon inverted green' }) : React.createElement('i', { className: 'remove circle icon inverted red' })
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

    render: function render(widget, data, error, context, pluginUtils) {

        if (!data) {
            return pluginUtils.renderReactLoading();
        }

        if (error) {
            return pluginUtils.renderReactError(error);
        }

        var formattedData = Object.assign({}, data);

        var blueprintId = context.getValue('blueprintId');
        if (blueprintId) {
            formattedData.items = _.filter(data.items, { blueprint_id: blueprintId });
        }

        formattedData = Object.assign({}, formattedData, {
            items: _.map(formattedData.items, function (item) {
                return Object.assign({}, item, {
                    created_at: pluginUtils.moment(item.created_at, 'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm') //2016-07-20 09:10:53.103579
                });
            })
        });

        return React.createElement(_ExecutionsTable2.default, { widget: widget, data: formattedData, context: context, utils: pluginUtils });
    }
}); /**
     * Created by kinneretzin on 20/10/2016.
     */

},{"./ExecutionsTable":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwbHVnaW5zL2V4ZWN1dGlvbnMvc3JjL0V4ZWN1dGlvbnNUYWJsZS5qcyIsInBsdWdpbnMvZXhlY3V0aW9ucy9zcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7OztBQUtJLG9CQUFZLEtBQVosRUFBbUIsT0FBbkIsRUFBNEI7QUFBQTs7QUFBQSxvSEFDbEIsS0FEa0IsRUFDWCxPQURXOztBQUd4QixjQUFLLEtBQUwsR0FBYSxFQUFiO0FBSHdCO0FBSzNCOzs7O3VDQUVjO0FBQ1gsaUJBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsT0FBbkI7QUFDSDs7OzRDQUVtQjtBQUNoQixpQkFBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixXQUFuQixHQUFpQyxFQUFqQyxDQUFvQyxvQkFBcEMsRUFBMEQsS0FBSyxZQUEvRCxFQUE2RSxJQUE3RTtBQUNIOzs7K0NBRXNCO0FBQ25CLGlCQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLFdBQW5CLEdBQWlDLEdBQWpDLENBQXFDLG9CQUFyQyxFQUEyRCxLQUFLLFlBQWhFO0FBQ0g7OztpQ0FHUTtBQUNMLG1CQUNJO0FBQUE7QUFBQTtBQUVRLHFCQUFLLEtBQUwsQ0FBVyxLQUFYLEdBQ0k7QUFBQTtBQUFBLHNCQUFLLFdBQVUsa0JBQWYsRUFBa0MsT0FBTyxFQUFDLFdBQVUsT0FBWCxFQUF6QztBQUNJO0FBQUE7QUFBQSwwQkFBSyxXQUFVLFFBQWY7QUFBQTtBQUFBLHFCQURKO0FBRUk7QUFBQTtBQUFBO0FBQUksNkJBQUssS0FBTCxDQUFXO0FBQWY7QUFGSixpQkFESixHQU1JLEVBUlo7QUFXSTtBQUFBO0FBQUEsc0JBQU8sV0FBVSx1Q0FBakI7QUFDSTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFDSTtBQUFBO0FBQUE7QUFBQTtBQUFBLDZC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ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGtpbm5lcmV0emluIG9uIDIwLzEwLzIwMTYuXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XG4gICAgICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcblxuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3JlZnJlc2hEYXRhKCkge1xuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQucmVmcmVzaCgpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQuZ2V0RXZlbnRCdXMoKS5vbignZXhlY3V0aW9uczpyZWZyZXNoJywgdGhpcy5fcmVmcmVzaERhdGEsIHRoaXMpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQuZ2V0RXZlbnRCdXMoKS5vZmYoJ2V4ZWN1dGlvbnM6cmVmcmVzaCcsIHRoaXMuX3JlZnJlc2hEYXRhKTtcbiAgICB9XG5cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmVycm9yID9cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgZXJyb3IgbWVzc2FnZVwiIHN0eWxlPXt7XCJkaXNwbGF5XCI6XCJibG9ja1wifX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoZWFkZXJcIj5FcnJvciBPY2N1cmVkPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+e3RoaXMuc3RhdGUuZXJyb3J9PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgICAgICAnJ1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJ1aSB2ZXJ5IGNvbXBhY3QgdGFibGUgZXhlY3V0aW9uc1RhYmxlXCI+XG4gICAgICAgICAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkJsdWVwcmludDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+RGVwbG95bWVudDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+V29ya2Zsb3c8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPklkPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5DcmVhdGVkPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5JcyBTeXN0ZW08L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlN0YXR1czwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5kYXRhLml0ZW1zLm1hcCgoaXRlbSk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHIga2V5PXtpdGVtLmlkfSBjbGFzc05hbWU9J3Jvdyc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e2l0ZW0uYmx1ZXByaW50X2lkfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e2l0ZW0uZGVwbG95bWVudF9pZH08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPntpdGVtLndvcmtmbG93X2lkfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e2l0ZW0uaWR9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57aXRlbS5jcmVhdGVkX2F0fTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e2l0ZW0uaXNfc3lzdGVtX3dvcmtmbG93ID8gJ3RydWUnIDogJ2ZhbHNlJ308L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtpdGVtLnN0YXR1c31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IF8uaXNFbXB0eShpdGVtLmVycm9yKSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImNoZWNrIGNpcmNsZSBpY29uIGludmVydGVkIGdyZWVuXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cInJlbW92ZSBjaXJjbGUgaWNvbiBpbnZlcnRlZCByZWRcIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkga2lubmVyZXR6aW4gb24gMjAvMTAvMjAxNi5cbiAqL1xuXG5pbXBvcnQgRXhlY3V0aW9uc1RhYmxlIGZyb20gJy4vRXhlY3V0aW9uc1RhYmxlJztcblxuU3RhZ2UuYWRkUGx1Z2luKHtcbiAgICBpZDogXCJleGVjdXRpb25zXCIsXG4gICAgbmFtZTogJ0RlcGxveW1lbnQgZXhlY3V0aW9ucycsXG4gICAgZGVzY3JpcHRpb246ICdUaGlzIHBsdWdpbiBzaG93cyB0aGUgZGVwbG95bWVudCBleGVjdXRpb25zJyxcbiAgICBpbml0aWFsV2lkdGg6IDgsXG4gICAgaW5pdGlhbEhlaWdodDogNixcbiAgICBjb2xvciA6IFwicHVycGxlXCIsXG4gICAgZmV0Y2hVcmw6ICdbbWFuYWdlcl0vYXBpL3YyLjEvZXhlY3V0aW9ucycsXG4gICAgaXNSZWFjdDogdHJ1ZSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24od2lkZ2V0LGRhdGEsZXJyb3IsY29udGV4dCxwbHVnaW5VdGlscykge1xuXG4gICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIHBsdWdpblV0aWxzLnJlbmRlclJlYWN0TG9hZGluZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gcGx1Z2luVXRpbHMucmVuZGVyUmVhY3RFcnJvcihlcnJvcik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZm9ybWF0dGVkRGF0YSA9IE9iamVjdC5hc3NpZ24oe30sZGF0YSk7XG5cbiAgICAgICAgdmFyIGJsdWVwcmludElkID0gY29udGV4dC5nZXRWYWx1ZSgnYmx1ZXByaW50SWQnKTtcbiAgICAgICAgaWYgKGJsdWVwcmludElkKSB7XG4gICAgICAgICAgICBmb3JtYXR0ZWREYXRhLml0ZW1zID0gXy5maWx0ZXIoZGF0YS5pdGVtcyx7Ymx1ZXByaW50X2lkOmJsdWVwcmludElkfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3JtYXR0ZWREYXRhID0gT2JqZWN0LmFzc2lnbih7fSxmb3JtYXR0ZWREYXRhLHtcbiAgICAgICAgICAgIGl0ZW1zOiBfLm1hcCAoZm9ybWF0dGVkRGF0YS5pdGVtcywoaXRlbSk9PntcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSxpdGVtLHtcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlZF9hdDogcGx1Z2luVXRpbHMubW9tZW50KGl0ZW0uY3JlYXRlZF9hdCwnWVlZWS1NTS1ERCBISDptbTpzcy5TU1NTUycpLmZvcm1hdCgnREQtTU0tWVlZWSBISDptbScpIC8vMjAxNi0wNy0yMCAwOToxMDo1My4xMDM1NzlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxFeGVjdXRpb25zVGFibGUgd2lkZ2V0PXt3aWRnZXR9IGRhdGE9e2Zvcm1hdHRlZERhdGF9IGNvbnRleHQ9e2NvbnRleHR9IHV0aWxzPXtwbHVnaW5VdGlsc30vPlxuICAgICAgICApO1xuICAgIH1cbn0pO1xuIl19
