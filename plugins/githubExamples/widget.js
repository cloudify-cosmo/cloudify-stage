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
            var oldSelectedExampleId = this.props.context.getValue('id');
            this.props.context.setValue('exampleId', item.id === oldSelectedExampleId ? null : item.id);
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
                                        {href: item.html_url, target: "_blank"},
                                        item.name)
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
    name: "Cloudify github examples",
    description: 'This plugin shows a list of cloudify example repositories',
    initialWidth: 8,
    initialHeight: 4,
    color: "teal",
    isReact: true,
    initialConfiguration: [
        {id: 'fetchUsername', name: 'Fetch with username' ,placeHolder:"Type username..", default:"cloudify-examples",fetch:true}
    ],
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