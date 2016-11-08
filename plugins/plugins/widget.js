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
 * Created by kinneretzin on 02/10/2016.
 */

var _class = function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class(props, context) {
        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props, context));

        _this.state = {
            confirmDelete: false
        };
        return _this;
    }

    _createClass(_class, [{
        key: '_selectPlugin',
        value: function _selectPlugin(item) {
            var oldSelectedPluginId = this.props.context.getValue('pluginId');
            this.props.context.setValue('pluginId', item.id === oldSelectedPluginId ? null : item.id);
        }
    }, {
        key: '_deletePluginConfirm',
        value: function _deletePluginConfirm(item, event) {
            event.stopPropagation();

            this.setState({
                confirmDelete: true,
                item: item
            });
        }
    }, {
        key: '_downloadPlugin',
        value: function _downloadPlugin(item, event) {
            var thi$ = this;
            $.ajax({
                url: thi$.props.context.getManagerUrl() + '/api/v2.1/plugins/' + item.id + '/archive',
                method: 'get'
            }).done(function () {
                window.location = thi$.props.context.getManagerUrl() + '/api/v2.1/plugins/' + item.id + '/archive';
            }).fail(function (jqXHR, textStatus, errorThrown) {
                thi$.setState({ error: jqXHR.responseJSON && jqXHR.responseJSON.message ? jqXHR.responseJSON.message : errorThrown });
            });
        }
    }, {
        key: '_deletePlugin',
        value: function _deletePlugin() {
            if (!this.state.item) {
                this.setState({ error: 'Something went wrong, no plugin was selected for delete' });
                return;
            }

            var thi$ = this;
            $.ajax({
                url: thi$.props.context.getManagerUrl() + '/api/v2.1/plugins/' + this.state.item.id,
                "headers": { "content-type": "application/json" },
                method: 'delete'
            }).done(function () {
                thi$.setState({ confirmDelete: false });
                thi$.props.context.getEventBus().trigger('plugins:refresh');
            }).fail(function (jqXHR, textStatus, errorThrown) {
                thi$.setState({ confirmDelete: false });
                thi$.setState({ error: jqXHR.responseJSON && jqXHR.responseJSON.message ? jqXHR.responseJSON.message : errorThrown });
            });
        }
    }, {
        key: '_refreshData',
        value: function _refreshData() {
            this.props.context.refresh();
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.props.context.getEventBus().on('plugins:refresh', this._refreshData, this);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.props.context.getEventBus().off('plugins:refresh', this._refreshData);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var Confirm = Stage.Basic.Confirm;

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
                    { className: 'ui very compact table pluginsTable' },
                    React.createElement(
                        'thead',
                        null,
                        React.createElement(
                            'tr',
                            null,
                            React.createElement(
                                'th',
                                null,
                                'ID'
                            ),
                            React.createElement(
                                'th',
                                null,
                                'Package name'
                            ),
                            React.createElement(
                                'th',
                                null,
                                'Package version'
                            ),
                            React.createElement(
                                'th',
                                null,
                                'Supported platform'
                            ),
                            React.createElement(
                                'th',
                                null,
                                'Distribution'
                            ),
                            React.createElement(
                                'th',
                                null,
                                'Distribute release'
                            ),
                            React.createElement(
                                'th',
                                null,
                                'Uploaded at'
                            ),
                            React.createElement('th', null)
                        )
                    ),
                    React.createElement(
                        'tbody',
                        null,
                        this.props.data.items.map(function (item) {
                            return React.createElement(
                                'tr',
                                { key: item.id, className: "row " + (item.isSelected ? 'active' : ''), onClick: _this2._selectPlugin.bind(_this2, item) },
                                React.createElement(
                                    'td',
                                    null,
                                    React.createElement(
                                        'div',
                                        null,
                                        React.createElement(
                                            'a',
                                            { className: 'pluginName', href: 'javascript:void(0)' },
                                            item.id
                                        )
                                    )
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    item.package_name
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    item.package_version
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    item.supported_platform
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    item.distribution
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    item.distribution_release
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    item.uploaded_at
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    React.createElement(
                                        'div',
                                        { className: 'rowActions' },
                                        React.createElement('i', { className: 'download icon link bordered', title: 'Download', onClick: _this2._downloadPlugin.bind(_this2, item) }),
                                        React.createElement('i', { className: 'trash icon link bordered', title: 'Delete', onClick: _this2._deletePluginConfirm.bind(_this2, item) })
                                    )
                                )
                            );
                        })
                    )
                ),
                React.createElement(Confirm, { title: 'Are you sure you want to remove this plugin?',
                    show: this.state.confirmDelete,
                    onConfirm: this._deletePlugin.bind(this),
                    onCancel: function onCancel() {
                        return _this2.setState({ confirmDelete: false });
                    } })
            );
        }
    }]);

    return _class;
}(React.Component);

exports.default = _class;
;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by kinneretzin on 05/10/2016.
 */

exports.default = function (pluginUtils) {

    return function (_React$Component) {
        _inherits(_class, _React$Component);

        function _class(props, context) {
            _classCallCheck(this, _class);

            var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props, context));

            _this.state = {
                uploadErr: null
            };
            return _this;
        }

        _createClass(_class, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                this._initModal(this.refs.modalObj);
            }
        }, {
            key: 'componentDidUpdate',
            value: function componentDidUpdate() {
                pluginUtils.jQuery(this.refs.modalObj).modal('refresh');
            }
        }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
                pluginUtils.jQuery(this.refs.modalObj).modal('destroy');
                pluginUtils.jQuery(this.refs.modalObj).remove();
            }
        }, {
            key: '_initModal',
            value: function _initModal(modalObj) {
                pluginUtils.jQuery(modalObj).modal({
                    closable: false,
                    onDeny: function onDeny() {
                        //window.alert('Wait not yet!');
                        //return false;
                    },
                    onApprove: function onApprove() {
                        pluginUtils.jQuery('.uploadFormSubmitBtn').click();
                        return false;
                    }
                });
            }
        }, {
            key: '_showModal',
            value: function _showModal() {
                pluginUtils.jQuery('.uploadPluginModal').modal('show');
            }
        }, {
            key: '_openFileSelection',
            value: function _openFileSelection(e) {
                e.preventDefault();
                pluginUtils.jQuery('#pluginFile').click();
                return false;
            }
        }, {
            key: '_uploadFileChanged',
            value: function _uploadFileChanged(e) {
                var fullPathFileName = pluginUtils.jQuery(e.currentTarget).val();
                var filename = fullPathFileName.split('\\').pop();

                pluginUtils.jQuery('input.uploadPluginFile').val(filename).attr('title', fullPathFileName);
            }
        }, {
            key: '_submitUpload',
            value: function _submitUpload(e) {
                e.preventDefault();

                var thi$ = this;

                var formObj = pluginUtils.jQuery(e.currentTarget);

                // Clear errors
                formObj.find('.error:not(.message)').removeClass('error');
                formObj.find('.ui.error.message').hide();

                // Get the data
                var pluginFileUrl = formObj.find("input[name='pluginFileUrl']").val();
                var file = document.getElementById('pluginFile').files[0];

                // Check that we have all we need
                if (_.isEmpty(pluginFileUrl) && !file) {
                    formObj.addClass('error');
                    formObj.find("input.uploadPluginFile").parents('.field').addClass('error');
                    formObj.find("input[name='pluginFileUrl']").parents('.field').addClass('error');
                    formObj.find('.ui.error.message').show();

                    return false;
                }

                // Disalbe the form
                formObj.parents('.modal').find('.actions .button').attr('disabled', 'disabled').addClass('disabled loading');
                formObj.addClass('loading');

                // Call upload method
                var xhr = new XMLHttpRequest();
                (xhr.upload || xhr).addEventListener('progress', function (e) {
                    var done = e.position || e.loaded;
                    var total = e.totalSize || e.total;
                    console.log('xhr progress: ' + Math.round(done / total * 100) + '%');
                });
                xhr.addEventListener("error", function (e) {
                    console.log('xhr upload error', e, this.responseText);
                    thi$._processUploadErrIfNeeded(this);
                    formObj.parents('.modal').find('.actions .button').removeAttr('disabled').removeClass('disabled loading');
                    formObj.removeClass('loading');
                });
                xhr.addEventListener('load', function (e) {
                    console.log('xhr upload complete', e, this.responseText);
                    formObj.parents('.modal').find('.actions .button').removeAttr('disabled').removeClass('disabled loading');
                    formObj.removeClass('loading');

                    if (!thi$._processUploadErrIfNeeded(this)) {
                        formObj.parents('.modal').modal('hide');
                        thi$.props.context.refresh();
                    } else {
                        formObj.find('.ui.error.message.uploadFailed').show();
                    }
                });
                xhr.open('post', this.props.context.getManagerUrl() + '/api/v2.1/plugins');
                xhr.send(file);

                return false;
            }
        }, {
            key: '_processUploadErrIfNeeded',
            value: function _processUploadErrIfNeeded(xhr) {
                try {
                    var response = JSON.parse(xhr.responseText);
                    if (response.message) {
                        this.setState({ uploadErr: response.message });
                        return true;
                    }
                } catch (err) {
                    console.err('Cannot parse upload response', err);
                    return false;
                }
            }
        }, {
            key: 'render',
            value: function render() {
                return React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'button',
                        { className: 'ui labeled icon button uploadPlugin', onClick: this._showModal },
                        React.createElement('i', { className: 'upload icon' }),
                        'Upload'
                    ),
                    React.createElement(
                        'div',
                        { className: 'ui modal uploadPluginModal', ref: 'modalObj' },
                        React.createElement(
                            'div',
                            { className: 'header' },
                            React.createElement('i', { className: 'upload icon' }),
                            ' Upload plugin'
                        ),
                        React.createElement(
                            'div',
                            { className: 'content' },
                            React.createElement(
                                'form',
                                { className: 'ui form uploadForm', onSubmit: this._submitUpload.bind(this), action: '' },
                                React.createElement(
                                    'div',
                                    { className: 'fields' },
                                    React.createElement(
                                        'div',
                                        { className: 'field nine wide' },
                                        React.createElement(
                                            'div',
                                            { className: 'ui labeled input' },
                                            React.createElement(
                                                'div',
                                                { className: 'ui label' },
                                                'http://'
                                            ),
                                            React.createElement('input', { type: 'text', name: 'pluginFileUrl', placeholder: 'Enter plugin url' })
                                        )
                                    ),
                                    React.createElement(
                                        'div',
                                        { className: 'field one wide', style: { "position": "relative" } },
                                        React.createElement(
                                            'div',
                                            { className: 'ui vertical divider' },
                                            'Or'
                                        )
                                    ),
                                    React.createElement(
                                        'div',
                                        { className: 'field eight wide' },
                                        React.createElement(
                                            'div',
                                            { className: 'ui action input' },
                                            React.createElement('input', { type: 'text', readOnly: 'true', value: '', className: 'uploadPluginFile', onClick: this._openFileSelection }),
                                            React.createElement(
                                                'button',
                                                { className: 'ui icon button uploadPluginFile', onClick: this._openFileSelection },
                                                React.createElement('i', { className: 'attach icon' })
                                            )
                                        ),
                                        React.createElement('input', { type: 'file', name: 'pluginFile', id: 'pluginFile', style: { "display": "none" }, onChange: this._uploadFileChanged })
                                    )
                                ),
                                this.state.uploadErr ? React.createElement(
                                    'div',
                                    { className: 'ui error message uploadFailed', style: { "display": "block" } },
                                    React.createElement(
                                        'div',
                                        { className: 'header' },
                                        'Error uploading file'
                                    ),
                                    React.createElement(
                                        'p',
                                        null,
                                        this.state.uploadErr
                                    )
                                ) : '',
                                React.createElement('input', { type: 'submit', style: { "display": "none" }, className: 'uploadFormSubmitBtn' })
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'actions' },
                            React.createElement(
                                'div',
                                { className: 'ui cancel basic button' },
                                React.createElement('i', { className: 'remove icon' }),
                                'Cancel'
                            ),
                            React.createElement(
                                'div',
                                { className: 'ui ok green  button' },
                                React.createElement('i', { className: 'upload icon' }),
                                'Upload'
                            )
                        )
                    )
                );
            }
        }]);

        return _class;
    }(React.Component);
};

},{}],3:[function(require,module,exports){
'use strict';

var _PluginsTable = require('./PluginsTable');

var _PluginsTable2 = _interopRequireDefault(_PluginsTable);

var _UploadPluginModal = require('./UploadPluginModal');

var _UploadPluginModal2 = _interopRequireDefault(_UploadPluginModal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by kinneretzin on 07/09/2016.
 */

var UploadModal = null;

Stage.addPlugin({
    id: "plugins",
    name: "Plugins list",
    description: 'blah blah blah',
    initialWidth: 8,
    initialHeight: 5,
    color: "blue",
    isReact: true,
    init: function init(pluginUtils) {
        UploadModal = (0, _UploadPluginModal2.default)(pluginUtils);
    },

    fetchData: function fetchData(plugin, context, pluginUtils) {
        return new Promise(function (resolve, reject) {
            pluginUtils.jQuery.get({
                url: context.getManagerUrl() + '/api/v2.1/plugins?_include=id,package_name,package_version,supported_platform,distribution,distribution_release,uploaded_at',
                dataType: 'json'
            }).done(function (plugins) {
                resolve(plugins);
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

        var selectedPlugin = context.getValue('pluginId');
        var formattedData = Object.assign({}, data, {
            items: _.map(data.items, function (item) {
                return Object.assign({}, item, {
                    uploaded_at: pluginUtils.moment(item.uploaded_at, 'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'), //2016-07-20 09:10:53.103579
                    isSelected: selectedPlugin === item.id
                });
            })
        });

        return React.createElement(
            'div',
            null,
            React.createElement(_PluginsTable2.default, { widget: widget, data: formattedData, context: context, utils: pluginUtils }),
            React.createElement(UploadModal, { widget: widget, data: formattedData, context: context, utils: pluginUtils })
        );
    }
});

},{"./PluginsTable":1,"./UploadPluginModal":2}]},{},[1,2,3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwbHVnaW5zL3BsdWdpbnMvc3JjL1BsdWdpbnNUYWJsZS5qcyIsInBsdWdpbnMvcGx1Z2lucy9zcmMvVXBsb2FkUGx1Z2luTW9kYWwuanMiLCJwbHVnaW5zL3BsdWdpbnMvc3JjL3dpZGdldC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7QUFNSSxvQkFBWSxLQUFaLEVBQWtCLE9BQWxCLEVBQTJCO0FBQUE7O0FBQUEsb0hBQ2pCLEtBRGlCLEVBQ1gsT0FEVzs7QUFHdkIsY0FBSyxLQUFMLEdBQWE7QUFDVCwyQkFBYztBQURMLFNBQWI7QUFIdUI7QUFNMUI7Ozs7c0NBRWMsSSxFQUFLO0FBQ2hCLGdCQUFJLHNCQUFzQixLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLFFBQW5CLENBQTRCLFVBQTVCLENBQTFCO0FBQ0EsaUJBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsUUFBbkIsQ0FBNEIsVUFBNUIsRUFBdUMsS0FBSyxFQUFMLEtBQVksbUJBQVosR0FBa0MsSUFBbEMsR0FBeUMsS0FBSyxFQUFyRjtBQUNIOzs7NkNBRW9CLEksRUFBSyxLLEVBQU07QUFDNUIsa0JBQU0sZUFBTjs7QUFFQSxpQkFBSyxRQUFMLENBQWM7QUFDViwrQkFBZ0IsSUFETjtBQUVWLHNCQUFNO0FBRkksYUFBZDtBQUlIOzs7d0NBRWUsSSxFQUFLLEssRUFBTztBQUN4QixnQkFBSSxPQUFPLElBQVg7QUFDQSxjQUFFLElBQUYsQ0FBTztBQUNILHFCQUFLLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsYUFBbkIsS0FBcUMsb0JBQXJDLEdBQTBELEtBQUssRUFBL0QsR0FBa0UsVUFEcEU7QUFFSCx3QkFBUTtBQUZMLGFBQVAsRUFJSyxJQUpMLENBSVUsWUFBSztBQUNMLHVCQUFPLFFBQVAsR0FBa0IsS0FBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixhQUFuQixL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O0FBQUE7QUFBQTtBQUNJLDBEQUFjLFFBQVEsTUFBdEIsRUFBOEIsTUFBTSxhQUFwQyxFQUFtRCxTQUFTLE9BQTVELEVBQXFFLE9BQU8sV0FBNUUsR0FESjtBQUVJLGdDQUFDLFdBQUQsSUFBYSxRQUFRLE1BQXJCLEVBQTZCLE1BQU0sYUFBbkMsRUFBa0QsU0FBUyxPQUEzRCxFQUFvRSxPQUFPLFdBQTNFO0FBRkosU0FESjtBQU1IO0FBakRXLENBQWhCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ3JlYXRlZCBieSBraW5uZXJldHppbiBvbiAwMi8xMC8yMDE2LlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzLGNvbnRleHQpIHtcbiAgICAgICAgc3VwZXIocHJvcHMsY29udGV4dCk7XG5cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIGNvbmZpcm1EZWxldGU6ZmFsc2VcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9zZWxlY3RQbHVnaW4gKGl0ZW0pe1xuICAgICAgICB2YXIgb2xkU2VsZWN0ZWRQbHVnaW5JZCA9IHRoaXMucHJvcHMuY29udGV4dC5nZXRWYWx1ZSgncGx1Z2luSWQnKTtcbiAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LnNldFZhbHVlKCdwbHVnaW5JZCcsaXRlbS5pZCA9PT0gb2xkU2VsZWN0ZWRQbHVnaW5JZCA/IG51bGwgOiBpdGVtLmlkKTtcbiAgICB9XG5cbiAgICBfZGVsZXRlUGx1Z2luQ29uZmlybShpdGVtLGV2ZW50KXtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBjb25maXJtRGVsZXRlIDogdHJ1ZSxcbiAgICAgICAgICAgIGl0ZW06IGl0ZW1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgX2Rvd25sb2FkUGx1Z2luKGl0ZW0sZXZlbnQpIHtcbiAgICAgICAgdmFyIHRoaSQgPSB0aGlzO1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiB0aGkkLnByb3BzLmNvbnRleHQuZ2V0TWFuYWdlclVybCgpICsgJy9hcGkvdjIuMS9wbHVnaW5zLycraXRlbS5pZCsnL2FyY2hpdmUnLFxuICAgICAgICAgICAgbWV0aG9kOiAnZ2V0J1xuICAgICAgICB9KVxuICAgICAgICAgICAgLmRvbmUoKCk9PiB7XG4gICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSB0aGkkLnByb3BzLmNvbnRleHQuZ2V0TWFuYWdlclVybCgpICsgJy9hcGkvdjIuMS9wbHVnaW5zLycraXRlbS5pZCsnL2FyY2hpdmUnO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bik9PntcbiAgICAgICAgICAgICAgICB0aGkkLnNldFN0YXRlKHtlcnJvcjogKGpxWEhSLnJlc3BvbnNlSlNPTiAmJiBqcVhIUi5yZXNwb25zZUpTT04ubWVzc2FnZSA/IGpxWEhSLnJlc3BvbnNlSlNPTi5tZXNzYWdlIDogZXJyb3JUaHJvd24pfSlcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9kZWxldGVQbHVnaW4oKSB7XG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5pdGVtKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtlcnJvcjogJ1NvbWV0aGluZyB3ZW50IHdyb25nLCBubyBwbHVnaW4gd2FzIHNlbGVjdGVkIGZvciBkZWxldGUnfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdGhpJCA9IHRoaXM7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IHRoaSQucHJvcHMuY29udGV4dC5nZXRNYW5hZ2VyVXJsKCkgKyAnL2FwaS92Mi4xL3BsdWdpbnMvJyt0aGlzLnN0YXRlLml0ZW0uaWQsXG4gICAgICAgICAgICBcImhlYWRlcnNcIjoge1wiY29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwifSxcbiAgICAgICAgICAgIG1ldGhvZDogJ2RlbGV0ZSdcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5kb25lKCgpPT4ge1xuICAgICAgICAgICAgICAgIHRoaSQuc2V0U3RhdGUoe2NvbmZpcm1EZWxldGU6IGZhbHNlfSk7XG4gICAgICAgICAgICAgICAgdGhpJC5wcm9wcy5jb250ZXh0LmdldEV2ZW50QnVzKCkudHJpZ2dlcigncGx1Z2luczpyZWZyZXNoJyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bik9PntcbiAgICAgICAgICAgICAgICB0aGkkLnNldFN0YXRlKHtjb25maXJtRGVsZXRlOiBmYWxzZX0pO1xuICAgICAgICAgICAgICAgIHRoaSQuc2V0U3RhdGUoe2Vycm9yOiAoanFYSFIucmVzcG9uc2VKU09OICYmIGpxWEhSLnJlc3BvbnNlSlNPTi5tZXNzYWdlID8ganFYSFIucmVzcG9uc2VKU09OLm1lc3NhZ2UgOiBlcnJvclRocm93bil9KVxuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgX3JlZnJlc2hEYXRhKCkge1xuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQucmVmcmVzaCgpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQuZ2V0RXZlbnRCdXMoKS5vbigncGx1Z2luczpyZWZyZXNoJyx0aGlzLl9yZWZyZXNoRGF0YSx0aGlzKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LmdldEV2ZW50QnVzKCkub2ZmKCdwbHVnaW5zOnJlZnJlc2gnLHRoaXMuX3JlZnJlc2hEYXRhKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHZhciBDb25maXJtID0gU3RhZ2UuQmFzaWMuQ29uZmlybTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuZXJyb3IgP1xuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBlcnJvciBtZXNzYWdlXCIgc3R5bGU9e3tcImRpc3BsYXlcIjpcImJsb2NrXCJ9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhlYWRlclwiPkVycm9yIE9jY3VyZWQ8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD57dGhpcy5zdGF0ZS5lcnJvcn08L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICcnXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT1cInVpIHZlcnkgY29tcGFjdCB0YWJsZSBwbHVnaW5zVGFibGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+SUQ8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlBhY2thZ2UgbmFtZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+UGFja2FnZSB2ZXJzaW9uPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5TdXBwb3J0ZWQgcGxhdGZvcm08L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkRpc3RyaWJ1dGlvbjwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+RGlzdHJpYnV0ZSByZWxlYXNlPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5VcGxvYWRlZCBhdDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+PC90aD5cbiAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmRhdGEuaXRlbXMubWFwKChpdGVtKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ciBrZXk9e2l0ZW0uaWR9IGNsYXNzTmFtZT17XCJyb3cgXCIrIChpdGVtLmlzU2VsZWN0ZWQgPyAnYWN0aXZlJyA6ICcnKX0gb25DbGljaz17dGhpcy5fc2VsZWN0UGx1Z2luLmJpbmQodGhpcyxpdGVtKX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPSdwbHVnaW5OYW1lJyBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+e2l0ZW0uaWR9PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57aXRlbS5wYWNrYWdlX25hbWV9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57aXRlbS5wYWNrYWdlX3ZlcnNpb259PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57aXRlbS5zdXBwb3J0ZWRfcGxhdGZvcm19PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57aXRlbS5kaXN0cmlidXRpb259PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57aXRlbS5kaXN0cmlidXRpb25fcmVsZWFzZX08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPntpdGVtLnVwbG9hZGVkX2F0fTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dBY3Rpb25zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImRvd25sb2FkIGljb24gbGluayBib3JkZXJlZFwiIHRpdGxlPVwiRG93bmxvYWRcIiBvbkNsaWNrPXt0aGlzLl9kb3dubG9hZFBsdWdpbi5iaW5kKHRoaXMsaXRlbSl9PjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwidHJhc2ggaWNvbiBsaW5rIGJvcmRlcmVkXCIgdGl0bGU9XCJEZWxldGVcIiBvbkNsaWNrPXt0aGlzLl9kZWxldGVQbHVnaW5Db25maXJtLmJpbmQodGhpcyxpdGVtKX0+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgICAgICA8Q29uZmlybSB0aXRsZT0nQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHJlbW92ZSB0aGlzIHBsdWdpbj8nXG4gICAgICAgICAgICAgICAgICAgICAgICAgc2hvdz17dGhpcy5zdGF0ZS5jb25maXJtRGVsZXRlfVxuICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ29uZmlybT17dGhpcy5fZGVsZXRlUGx1Z2luLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgb25DYW5jZWw9eygpPT50aGlzLnNldFN0YXRlKHtjb25maXJtRGVsZXRlIDogZmFsc2V9KX0gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICk7XG4gICAgfVxufTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBraW5uZXJldHppbiBvbiAwNS8xMC8yMDE2LlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IChwbHVnaW5VdGlscyk9PiB7XG5cbiAgICByZXR1cm4gY2xhc3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByb3BzLGNvbnRleHQpIHtcbiAgICAgICAgICAgIHN1cGVyKHByb3BzLGNvbnRleHQpO1xuXG4gICAgICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgICAgIHVwbG9hZEVycjogbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgICAgICB0aGlzLl9pbml0TW9kYWwodGhpcy5yZWZzLm1vZGFsT2JqKTtcbiAgICAgICAgfVxuICAgICAgICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgICAgICAgICBwbHVnaW5VdGlscy5qUXVlcnkodGhpcy5yZWZzLm1vZGFsT2JqKS5tb2RhbCgncmVmcmVzaCcpO1xuICAgICAgICB9XG4gICAgICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgICAgICAgcGx1Z2luVXRpbHMualF1ZXJ5KHRoaXMucmVmcy5tb2RhbE9iaikubW9kYWwoJ2Rlc3Ryb3knKTtcbiAgICAgICAgICAgIHBsdWdpblV0aWxzLmpRdWVyeSh0aGlzLnJlZnMubW9kYWxPYmopLnJlbW92ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgX2luaXRNb2RhbChtb2RhbE9iaikge1xuICAgICAgICAgICAgcGx1Z2luVXRpbHMualF1ZXJ5KG1vZGFsT2JqKS5tb2RhbCh7XG4gICAgICAgICAgICAgICAgY2xvc2FibGUgIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgb25EZW55ICAgIDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgLy93aW5kb3cuYWxlcnQoJ1dhaXQgbm90IHlldCEnKTtcbiAgICAgICAgICAgICAgICAgICAgLy9yZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvbkFwcHJvdmUgOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcGx1Z2luVXRpbHMualF1ZXJ5KCcudXBsb2FkRm9ybVN1Ym1pdEJ0bicpLmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgX3Nob3dNb2RhbCgpIHtcbiAgICAgICAgICAgIHBsdWdpblV0aWxzLmpRdWVyeSgnLnVwbG9hZFBsdWdpbk1vZGFsJykubW9kYWwoJ3Nob3cnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9vcGVuRmlsZVNlbGVjdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBwbHVnaW5VdGlscy5qUXVlcnkoJyNwbHVnaW5GaWxlJykuY2xpY2soKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIF91cGxvYWRGaWxlQ2hhbmdlZChlKXtcbiAgICAgICAgICAgIHZhciBmdWxsUGF0aEZpbGVOYW1lID0gcGx1Z2luVXRpbHMualF1ZXJ5KGUuY3VycmVudFRhcmdldCkudmFsKCk7XG4gICAgICAgICAgICB2YXIgZmlsZW5hbWUgPSBmdWxsUGF0aEZpbGVOYW1lLnNwbGl0KCdcXFxcJykucG9wKCk7XG5cbiAgICAgICAgICAgIHBsdWdpblV0aWxzLmpRdWVyeSgnaW5wdXQudXBsb2FkUGx1Z2luRmlsZScpLnZhbChmaWxlbmFtZSkuYXR0cigndGl0bGUnLGZ1bGxQYXRoRmlsZU5hbWUpO1xuXG4gICAgICAgIH1cblxuICAgICAgICBfc3VibWl0VXBsb2FkKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgdmFyIHRoaSQgPSB0aGlzO1xuXG4gICAgICAgICAgICB2YXIgZm9ybU9iaiA9IHBsdWdpblV0aWxzLmpRdWVyeShlLmN1cnJlbnRUYXJnZXQpO1xuXG4gICAgICAgICAgICAvLyBDbGVhciBlcnJvcnNcbiAgICAgICAgICAgIGZvcm1PYmouZmluZCgnLmVycm9yOm5vdCgubWVzc2FnZSknKS5yZW1vdmVDbGFzcygnZXJyb3InKTtcbiAgICAgICAgICAgIGZvcm1PYmouZmluZCgnLnVpLmVycm9yLm1lc3NhZ2UnKS5oaWRlKCk7XG5cbiAgICAgICAgICAgIC8vIEdldCB0aGUgZGF0YVxuICAgICAgICAgICAgdmFyIHBsdWdpbkZpbGVVcmwgPSBmb3JtT2JqLmZpbmQoXCJpbnB1dFtuYW1lPSdwbHVnaW5GaWxlVXJsJ11cIikudmFsKCk7XG4gICAgICAgICAgICB2YXIgZmlsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbHVnaW5GaWxlJykuZmlsZXNbMF07XG5cbiAgICAgICAgICAgIC8vIENoZWNrIHRoYXQgd2UgaGF2ZSBhbGwgd2UgbmVlZFxuICAgICAgICAgICAgaWYgKF8uaXNFbXB0eShwbHVnaW5GaWxlVXJsKSAmJiAhZmlsZSkge1xuICAgICAgICAgICAgICAgIGZvcm1PYmouYWRkQ2xhc3MoJ2Vycm9yJyk7XG4gICAgICAgICAgICAgICAgZm9ybU9iai5maW5kKFwiaW5wdXQudXBsb2FkUGx1Z2luRmlsZVwiKS5wYXJlbnRzKCcuZmllbGQnKS5hZGRDbGFzcygnZXJyb3InKTtcbiAgICAgICAgICAgICAgICBmb3JtT2JqLmZpbmQoXCJpbnB1dFtuYW1lPSdwbHVnaW5GaWxlVXJsJ11cIikucGFyZW50cygnLmZpZWxkJykuYWRkQ2xhc3MoJ2Vycm9yJyk7XG4gICAgICAgICAgICAgICAgZm9ybU9iai5maW5kKCcudWkuZXJyb3IubWVzc2FnZScpLnNob3coKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRGlzYWxiZSB0aGUgZm9ybVxuICAgICAgICAgICAgZm9ybU9iai5wYXJlbnRzKCcubW9kYWwnKS5maW5kKCcuYWN0aW9ucyAuYnV0dG9uJykuYXR0cignZGlzYWJsZWQnLCdkaXNhYmxlZCcpLmFkZENsYXNzKCdkaXNhYmxlZCBsb2FkaW5nJyk7XG4gICAgICAgICAgICBmb3JtT2JqLmFkZENsYXNzKCdsb2FkaW5nJyk7XG5cbiAgICAgICAgICAgIC8vIENhbGwgdXBsb2FkIG1ldGhvZFxuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgKHhoci51cGxvYWQgfHwgeGhyKS5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZG9uZSA9IGUucG9zaXRpb24gfHwgZS5sb2FkZWRcbiAgICAgICAgICAgICAgICB2YXIgdG90YWwgPSBlLnRvdGFsU2l6ZSB8fCBlLnRvdGFsO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd4aHIgcHJvZ3Jlc3M6ICcgKyBNYXRoLnJvdW5kKGRvbmUvdG90YWwqMTAwKSArICclJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3hociB1cGxvYWQgZXJyb3InLCBlLCB0aGlzLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgdGhpJC5fcHJvY2Vzc1VwbG9hZEVycklmTmVlZGVkKHRoaXMpO1xuICAgICAgICAgICAgICAgIGZvcm1PYmoucGFyZW50cygnLm1vZGFsJykuZmluZCgnLmFjdGlvbnMgLmJ1dHRvbicpLnJlbW92ZUF0dHIoJ2Rpc2FibGVkJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkIGxvYWRpbmcnKTtcbiAgICAgICAgICAgICAgICBmb3JtT2JqLnJlbW92ZUNsYXNzKCdsb2FkaW5nJyk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3hociB1cGxvYWQgY29tcGxldGUnLCBlLCB0aGlzLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgZm9ybU9iai5wYXJlbnRzKCcubW9kYWwnKS5maW5kKCcuYWN0aW9ucyAuYnV0dG9uJykucmVtb3ZlQXR0cignZGlzYWJsZWQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQgbG9hZGluZycpO1xuICAgICAgICAgICAgICAgIGZvcm1PYmoucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKTtcblxuICAgICAgICAgICAgICAgIGlmICghdGhpJC5fcHJvY2Vzc1VwbG9hZEVycklmTmVlZGVkKHRoaXMpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1PYmoucGFyZW50cygnLm1vZGFsJykubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpJC5wcm9wcy5jb250ZXh0LnJlZnJlc2goKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmb3JtT2JqLmZpbmQoJy51aS5lcnJvci5tZXNzYWdlLnVwbG9hZEZhaWxlZCcpLnNob3coKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHhoci5vcGVuKCdwb3N0Jyx0aGlzLnByb3BzLmNvbnRleHQuZ2V0TWFuYWdlclVybCgpICtcbiAgICAgICAgICAgICAgICAnL2FwaS92Mi4xL3BsdWdpbnMnKTtcbiAgICAgICAgICAgIHhoci5zZW5kKGZpbGUpO1xuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBfcHJvY2Vzc1VwbG9hZEVycklmTmVlZGVkKHhocikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5tZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3VwbG9hZEVycjogcmVzcG9uc2UubWVzc2FnZX0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycignQ2Fubm90IHBhcnNlIHVwbG9hZCByZXNwb25zZScsZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cInVpIGxhYmVsZWQgaWNvbiBidXR0b24gdXBsb2FkUGx1Z2luXCIgb25DbGljaz17dGhpcy5fc2hvd01vZGFsfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cInVwbG9hZCBpY29uXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgVXBsb2FkXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgbW9kYWwgdXBsb2FkUGx1Z2luTW9kYWxcIiByZWY9J21vZGFsT2JqJz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwidXBsb2FkIGljb25cIj48L2k+IFVwbG9hZCBwbHVnaW5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybSBjbGFzc05hbWU9XCJ1aSBmb3JtIHVwbG9hZEZvcm1cIiBvblN1Ym1pdD17dGhpcy5fc3VibWl0VXBsb2FkLmJpbmQodGhpcyl9IGFjdGlvbj1cIlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZCBuaW5lIHdpZGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIGxhYmVsZWQgaW5wdXRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBsYWJlbFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaHR0cDovL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT0ncGx1Z2luRmlsZVVybCcgcGxhY2Vob2xkZXI9XCJFbnRlciBwbHVnaW4gdXJsXCI+PC9pbnB1dD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkIG9uZSB3aWRlXCIgc3R5bGU9e3tcInBvc2l0aW9uXCI6XCJyZWxhdGl2ZVwifX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSB2ZXJ0aWNhbCBkaXZpZGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQgZWlnaHQgd2lkZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgYWN0aW9uIGlucHV0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHJlYWRPbmx5PSd0cnVlJyB2YWx1ZT1cIlwiIGNsYXNzTmFtZT1cInVwbG9hZFBsdWdpbkZpbGVcIiBvbkNsaWNrPXt0aGlzLl9vcGVuRmlsZVNlbGVjdGlvbn0+PC9pbnB1dD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJ1aSBpY29uIGJ1dHRvbiB1cGxvYWRQbHVnaW5GaWxlXCIgb25DbGljaz17dGhpcy5fb3BlbkZpbGVTZWxlY3Rpb259PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiYXR0YWNoIGljb25cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiIG5hbWU9J3BsdWdpbkZpbGUnIGlkPVwicGx1Z2luRmlsZVwiIHN0eWxlPXt7XCJkaXNwbGF5XCI6IFwibm9uZVwifX0gb25DaGFuZ2U9e3RoaXMuX3VwbG9hZEZpbGVDaGFuZ2VkfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS51cGxvYWRFcnIgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgZXJyb3IgbWVzc2FnZSB1cGxvYWRGYWlsZWRcIiBzdHlsZT17e1wiZGlzcGxheVwiOlwiYmxvY2tcIn19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhlYWRlclwiPkVycm9yIHVwbG9hZGluZyBmaWxlPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPnt0aGlzLnN0YXRlLnVwbG9hZEVycn08L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT0nc3VibWl0JyBzdHlsZT17e1wiZGlzcGxheVwiOiBcIm5vbmVcIn19IGNsYXNzTmFtZT0ndXBsb2FkRm9ybVN1Ym1pdEJ0bicvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFjdGlvbnNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIGNhbmNlbCBiYXNpYyBidXR0b25cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwicmVtb3ZlIGljb25cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENhbmNlbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgb2sgZ3JlZW4gIGJ1dHRvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJ1cGxvYWQgaWNvblwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVXBsb2FkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9O1xufTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBraW5uZXJldHppbiBvbiAwNy8wOS8yMDE2LlxuICovXG5cbmltcG9ydCBQbHVnaW5zVGFibGUgZnJvbSAnLi9QbHVnaW5zVGFibGUnO1xuaW1wb3J0IHJlbmRlclVwbG9hZFBsdWdpbk1vZGFsIGZyb20gJy4vVXBsb2FkUGx1Z2luTW9kYWwnO1xuXG52YXIgVXBsb2FkTW9kYWwgPSBudWxsO1xuXG5TdGFnZS5hZGRQbHVnaW4oe1xuICAgIGlkOiBcInBsdWdpbnNcIixcbiAgICBuYW1lOiBcIlBsdWdpbnMgbGlzdFwiLFxuICAgIGRlc2NyaXB0aW9uOiAnYmxhaCBibGFoIGJsYWgnLFxuICAgIGluaXRpYWxXaWR0aDogOCxcbiAgICBpbml0aWFsSGVpZ2h0OiA1LFxuICAgIGNvbG9yIDogXCJibHVlXCIsXG4gICAgaXNSZWFjdDogdHJ1ZSxcbiAgICBpbml0OiBmdW5jdGlvbihwbHVnaW5VdGlscykge1xuICAgICAgICBVcGxvYWRNb2RhbCA9IHJlbmRlclVwbG9hZFBsdWdpbk1vZGFsKHBsdWdpblV0aWxzKTtcbiAgICB9LFxuXG4gICAgZmV0Y2hEYXRhOiBmdW5jdGlvbihwbHVnaW4sY29udGV4dCxwbHVnaW5VdGlscykge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIChyZXNvbHZlLHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgcGx1Z2luVXRpbHMualF1ZXJ5LmdldCh7XG4gICAgICAgICAgICAgICAgdXJsOiBjb250ZXh0LmdldE1hbmFnZXJVcmwoKSArICcvYXBpL3YyLjEvcGx1Z2lucz9faW5jbHVkZT1pZCxwYWNrYWdlX25hbWUscGFja2FnZV92ZXJzaW9uLHN1cHBvcnRlZF9wbGF0Zm9ybSxkaXN0cmlidXRpb24sZGlzdHJpYnV0aW9uX3JlbGVhc2UsdXBsb2FkZWRfYXQnLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5kb25lKChwbHVnaW5zKT0+IHtyZXNvbHZlKHBsdWdpbnMpO30pXG4gICAgICAgICAgICAgICAgLmZhaWwocmVqZWN0KVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbih3aWRnZXQsZGF0YSxlcnJvcixjb250ZXh0LHBsdWdpblV0aWxzKSB7XG5cbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gcGx1Z2luVXRpbHMucmVuZGVyUmVhY3RMb2FkaW5nKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBwbHVnaW5VdGlscy5yZW5kZXJSZWFjdEVycm9yKGVycm9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzZWxlY3RlZFBsdWdpbiA9IGNvbnRleHQuZ2V0VmFsdWUoJ3BsdWdpbklkJyk7XG4gICAgICAgIHZhciBmb3JtYXR0ZWREYXRhID0gT2JqZWN0LmFzc2lnbih7fSxkYXRhLHtcbiAgICAgICAgICAgIGl0ZW1zOiBfLm1hcCAoZGF0YS5pdGVtcywoaXRlbSk9PntcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSxpdGVtLHtcbiAgICAgICAgICAgICAgICAgICAgdXBsb2FkZWRfYXQ6IHBsdWdpblV0aWxzLm1vbWVudChpdGVtLnVwbG9hZGVkX2F0LCdZWVlZLU1NLUREIEhIOm1tOnNzLlNTU1NTJykuZm9ybWF0KCdERC1NTS1ZWVlZIEhIOm1tJyksIC8vMjAxNi0wNy0yMCAwOToxMDo1My4xMDM1NzlcbiAgICAgICAgICAgICAgICAgICAgaXNTZWxlY3RlZDogc2VsZWN0ZWRQbHVnaW4gPT09IGl0ZW0uaWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPFBsdWdpbnNUYWJsZSB3aWRnZXQ9e3dpZGdldH0gZGF0YT17Zm9ybWF0dGVkRGF0YX0gY29udGV4dD17Y29udGV4dH0gdXRpbHM9e3BsdWdpblV0aWxzfS8+XG4gICAgICAgICAgICAgICAgPFVwbG9hZE1vZGFsIHdpZGdldD17d2lkZ2V0fSBkYXRhPXtmb3JtYXR0ZWREYXRhfSBjb250ZXh0PXtjb250ZXh0fSB1dGlscz17cGx1Z2luVXRpbHN9Lz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn0pOyJdfQ==
