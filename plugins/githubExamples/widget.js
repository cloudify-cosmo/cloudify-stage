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
            this.props.context.getEventBus().on('githubExamples:refresh', this._refreshData, this);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.props.context.getEventBus().off('githubExamples:refresh', this._refreshData);
        }
    }, {
        key: '_selectExample',
        value: function _selectExample(item) {
            var oldSelectedExampleName = this.props.context.getValue('exampleName');
            this.props.context.setValue('exampleName', item.name === oldSelectedExampleName ? null : item.name);
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
                    { className: 'ui very compact table githubExamplesTable' },
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
                                'Description'
                            )
                        )
                    ),
                    React.createElement(
                        'tbody',
                        null,
                        this.props.data.items.map(function (item) {
                            return React.createElement(
                                'tr',
                                { key: item.id, className: 'row ' + (item.isSelected ? 'active' : ''), onClick: _this2._selectExample.bind(_this2, item) },
                                React.createElement(
                                    'td',
                                    null,
                                    React.createElement(
                                        'a',
                                        { href: item.html_url, target: '_blank' },
                                        item.name
                                    )
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    item.description
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

var _GithubExamplesTable = require('./GithubExamplesTable');

var _GithubExamplesTable2 = _interopRequireDefault(_GithubExamplesTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Stage.addPlugin({
    id: 'githubExamples',
    name: "GitHub repositories list",
    description: 'This plugin shows a list of cloudify example repositories',
    initialWidth: 8,
    initialHeight: 4,
    color: "teal",
    isReact: true,
    initialConfiguration: [{ id: 'fetchUsername', name: 'Fetch with username', placeHolder: "Type username..", default: "cloudify-examples", fetch: true }],
    fetchUrl: 'https://api.github.com/users/[config:fetchUsername]/repos',
    render: function render(widget, data, error, context, pluginUtils) {

        if (!data) {
            return pluginUtils.renderReactLoading();
        }

        if (error) {
            return pluginUtils.renderReactError(error);
        }

        var formattedData = Object.assign({}, data);

        var exampleId = context.getValue('exampleId');
        var selectedExample = context.getValue('exampleId');

        if (exampleId) {
            formattedData.items = _.filter(data.items, { id: exampleId });
        }

        formattedData = Object.assign({}, formattedData, {
            items: _.map(formattedData, function (item) {
                return Object.assign({}, item, {
                    isSelected: item.id === selectedExample,
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    url: item.url
                });
            })
        });

        return React.createElement(_GithubExamplesTable2.default, { widget: widget, data: formattedData, context: context, utils: pluginUtils });
    }
}); /**
     * Created by kinneretzin on 20/10/2016.
     */

},{"./GithubExamplesTable":1}]},{},[1,2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwbHVnaW5zL2dpdGh1YkV4YW1wbGVzL3NyYy9HaXRodWJFeGFtcGxlc1RhYmxlLmpzIiwicGx1Z2lucy9naXRodWJFeGFtcGxlcy9zcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7OztBQUtJLG9CQUFZLEtBQVosRUFBbUIsT0FBbkIsRUFBNEI7QUFBQTs7QUFBQSxvSEFDbEIsS0FEa0IsRUFDWCxPQURXOztBQUd4QixjQUFLLEtBQUwsR0FBYSxFQUFiO0FBSHdCO0FBSzNCOzs7O3VDQUVjO0FBQ1gsaUJBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsT0FBbkI7QUFDSDs7OzRDQUVtQjtBQUNoQixpQkFBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixXQUFuQixHQUFpQyxFQUFqQyxDQUFvQyx3QkFBcEMsRUFBOEQsS0FBSyxZQUFuRSxFQUFpRixJQUFqRjtBQUNIOzs7K0NBRXNCO0FBQ25CLGlCQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLFdBQW5CLEdBQWlDLEdBQWpDLENBQXFDLHdCQUFyQyxFQUErRCxLQUFLLFlBQXBFO0FBQ0g7Ozt1Q0FHYyxJLEVBQU07QUFDakIsZ0JBQUkseUJBQXlCLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsUUFBbkIsQ0FBNEIsYUFBNUIsQ0FBN0I7QUFDQSxpQkFBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixRQUFuQixDQUE0QixhQUE1QixFQUEwQyxLQUFLLElBQUwsS0FBYyxzQkFBZCxHQUF1QyxJQUF2QyxHQUE4QyxLQUFLLElBQTdGO0FBQ0g7OztpQ0FFUTtBQUFBOztBQUNMLG1CQUNJO0FBQUE7QUFBQTtBQUVRLHFCQUFLLEtBQUwsQ0FBVyxLQUFYLEdBQ0k7QUFBQTtBQUFBLHNCQUFLLFdBQVUsa0JBQWYsRUFBa0MsT0FBTyxFQUFDLFdB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LE9BQU8sV0FBbkYsR0FESjtBQUdIO0FBOUNXLENBQWhCLEUsQ0FOQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENyZWF0ZWQgYnkga2lubmVyZXR6aW4gb24gMjAvMTAvMjAxNi5cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcbiAgICAgICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xuXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfcmVmcmVzaERhdGEoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5yZWZyZXNoKCk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5nZXRFdmVudEJ1cygpLm9uKCdnaXRodWJFeGFtcGxlczpyZWZyZXNoJywgdGhpcy5fcmVmcmVzaERhdGEsIHRoaXMpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQuZ2V0RXZlbnRCdXMoKS5vZmYoJ2dpdGh1YkV4YW1wbGVzOnJlZnJlc2gnLCB0aGlzLl9yZWZyZXNoRGF0YSk7XG4gICAgfVxuXG5cbiAgICBfc2VsZWN0RXhhbXBsZShpdGVtKSB7XG4gICAgICAgIHZhciBvbGRTZWxlY3RlZEV4YW1wbGVOYW1lID0gdGhpcy5wcm9wcy5jb250ZXh0LmdldFZhbHVlKCdleGFtcGxlTmFtZScpO1xuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQuc2V0VmFsdWUoJ2V4YW1wbGVOYW1lJyxpdGVtLm5hbWUgPT09IG9sZFNlbGVjdGVkRXhhbXBsZU5hbWUgPyBudWxsIDogaXRlbS5uYW1lKTtcbiAgICB9XG4gICAgXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuZXJyb3IgP1xuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBlcnJvciBtZXNzYWdlXCIgc3R5bGU9e3tcImRpc3BsYXlcIjpcImJsb2NrXCJ9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhlYWRlclwiPkVycm9yIE9jY3VyZWQ8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD57dGhpcy5zdGF0ZS5lcnJvcn08L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICcnXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT1cInVpIHZlcnkgY29tcGFjdCB0YWJsZSBnaXRodWJFeGFtcGxlc1RhYmxlXCI+XG4gICAgICAgICAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk5hbWU8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkRlc2NyaXB0aW9uPC90aD5cbiAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmRhdGEuaXRlbXMubWFwKChpdGVtKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ciBrZXk9e2l0ZW0uaWR9IGNsYXNzTmFtZT17J3JvdyAnICsgKGl0ZW0uaXNTZWxlY3RlZCA/ICdhY3RpdmUnIDogJycpfSBvbkNsaWNrPXt0aGlzLl9zZWxlY3RFeGFtcGxlLmJpbmQodGhpcyxpdGVtKX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+PGEgaHJlZj17aXRlbS5odG1sX3VybH0gdGFyZ2V0PVwiX2JsYW5rXCI+e2l0ZW0ubmFtZX08L2E+PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57aXRlbS5kZXNjcmlwdGlvbn08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cbiIsIi8qKlxuICogQ3JlYXRlZCBieSBraW5uZXJldHppbiBvbiAyMC8xMC8yMDE2LlxuICovXG5cbmltcG9ydCBHaXRodWJFeGFtcGxlc1RhYmxlIGZyb20gJy4vR2l0aHViRXhhbXBsZXNUYWJsZSc7XG5cblN0YWdlLmFkZFBsdWdpbih7XG4gICAgaWQ6ICdnaXRodWJFeGFtcGxlcycsXG4gICAgbmFtZTogXCJHaXRIdWIgcmVwb3NpdG9yaWVzIGxpc3RcIixcbiAgICBkZXNjcmlwdGlvbjogJ1RoaXMgcGx1Z2luIHNob3dzIGEgbGlzdCBvZiBjbG91ZGlmeSBleGFtcGxlIHJlcG9zaXRvcmllcycsXG4gICAgaW5pdGlhbFdpZHRoOiA4LFxuICAgIGluaXRpYWxIZWlnaHQ6IDQsXG4gICAgY29sb3I6IFwidGVhbFwiLFxuICAgIGlzUmVhY3Q6IHRydWUsXG4gICAgaW5pdGlhbENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAge2lkOiAnZmV0Y2hVc2VybmFtZScsIG5hbWU6ICdGZXRjaCB3aXRoIHVzZXJuYW1lJyAscGxhY2VIb2xkZXI6XCJUeXBlIHVzZXJuYW1lLi5cIiwgZGVmYXVsdDpcImNsb3VkaWZ5LWV4YW1wbGVzXCIsZmV0Y2g6dHJ1ZX1cbiAgICBdLFxuICAgIGZldGNoVXJsOiAnaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS91c2Vycy9bY29uZmlnOmZldGNoVXNlcm5hbWVdL3JlcG9zJyxcbiAgICByZW5kZXI6IGZ1bmN0aW9uKHdpZGdldCxkYXRhLGVycm9yLGNvbnRleHQscGx1Z2luVXRpbHMpIHtcblxuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiBwbHVnaW5VdGlscy5yZW5kZXJSZWFjdExvYWRpbmcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIHBsdWdpblV0aWxzLnJlbmRlclJlYWN0RXJyb3IoZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZvcm1hdHRlZERhdGEgPSBPYmplY3QuYXNzaWduKHt9LGRhdGEpO1xuXG4gICAgICAgIHZhciBleGFtcGxlSWQgPSBjb250ZXh0LmdldFZhbHVlKCdleGFtcGxlSWQnKTtcbiAgICAgICAgdmFyIHNlbGVjdGVkRXhhbXBsZSA9IGNvbnRleHQuZ2V0VmFsdWUoJ2V4YW1wbGVJZCcpO1xuXG4gICAgICAgIGlmIChleGFtcGxlSWQpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZERhdGEuaXRlbXMgPSBfLmZpbHRlcihkYXRhLml0ZW1zLHtpZDogZXhhbXBsZUlkfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3JtYXR0ZWREYXRhID0gT2JqZWN0LmFzc2lnbih7fSxmb3JtYXR0ZWREYXRhLHtcbiAgICAgICAgICAgIGl0ZW1zOiBfLm1hcCAoZm9ybWF0dGVkRGF0YSwoaXRlbSk9PntcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSxpdGVtLHtcbiAgICAgICAgICAgICAgICAgICAgaXNTZWxlY3RlZDogaXRlbS5pZCA9PT0gc2VsZWN0ZWRFeGFtcGxlLFxuICAgICAgICAgICAgICAgICAgICBpZDogaXRlbS5pZCxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogaXRlbS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogaXRlbS5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBpdGVtLnVybFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPEdpdGh1YkV4YW1wbGVzVGFibGUgd2lkZ2V0PXt3aWRnZXR9IGRhdGE9e2Zvcm1hdHRlZERhdGF9IGNvbnRleHQ9e2NvbnRleHR9IHV0aWxzPXtwbHVnaW5VdGlsc30vPlxuICAgICAgICApO1xuICAgIH1cbn0pO1xuIl19
