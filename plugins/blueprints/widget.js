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

exports.default = function (pluginUtils) {

    return function (_React$Component) {
        _inherits(_class, _React$Component);

        function _class() {
            _classCallCheck(this, _class);

            return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
        }

        _createClass(_class, [{
            key: '_selectBlueprint',
            value: function _selectBlueprint(item) {
                var oldSelectedBlueprintId = this.props.context.getValue('blueprintId');
                this.props.context.setValue('blueprintId', item.id === oldSelectedBlueprintId ? null : item.id);
            }
        }, {
            key: '_createDeployment',
            value: function _createDeployment(item) {}
        }, {
            key: '_deleteBlueprint',
            value: function _deleteBlueprint(item) {}
        }, {
            key: 'render',
            value: function render() {
                var _this2 = this;

                return React.createElement(
                    'table',
                    { className: 'ui very compact table blueprintsTable' },
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
                                'Created'
                            ),
                            React.createElement(
                                'th',
                                null,
                                'Updated'
                            ),
                            React.createElement(
                                'th',
                                null,
                                '# Deployments'
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
                                { key: item.id, className: "row " + (item.isSelected ? 'active' : ''), onClick: _this2._selectBlueprint.bind(_this2, item) },
                                React.createElement(
                                    'td',
                                    null,
                                    React.createElement(
                                        'div',
                                        null,
                                        React.createElement(
                                            'a',
                                            { className: 'blueprintName', href: 'javascript:void(0)' },
                                            item.id
                                        )
                                    )
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    item.created_at
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    item.updated_at
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    React.createElement(
                                        'div',
                                        { className: 'ui green horizontal label' },
                                        item.depCount
                                    )
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    React.createElement(
                                        'div',
                                        { className: 'rowActions' },
                                        React.createElement('i', { className: 'rocket icon link bordered', title: 'Create deployment', onClick: _this2._createDeployment.bind(_this2, item) }),
                                        React.createElement('i', { className: 'trash icon link bordered', title: 'Delete blueprint', onClick: _this2._deleteBlueprint.bind(_this2, item) })
                                    )
                                )
                            );
                        })
                    )
                );
            }
        }]);

        return _class;
    }(React.Component);
};

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
                pluginUtils.jQuery('.uploadBlueprintModal').modal('show');
            }
        }, {
            key: '_openFileSelection',
            value: function _openFileSelection(e) {
                e.preventDefault();
                pluginUtils.jQuery('#blueprintFile').click();
                return false;
            }
        }, {
            key: '_uploadFileChanged',
            value: function _uploadFileChanged(e) {
                var fullPathFileName = pluginUtils.jQuery(e.currentTarget).val();
                var filename = fullPathFileName.split('\\').pop();

                pluginUtils.jQuery('input.uploadBlueprintFile').val(filename).attr('title', fullPathFileName);
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
                var blueprintName = formObj.find("input[name='blueprintName']").val();
                var blueprintFileName = formObj.find("input[name='blueprintFileName']").val();
                var blueprintFileUrl = formObj.find("input[name='blueprintFileUrl']").val();
                var file = document.getElementById('blueprintFile').files[0];

                // Check that we have all we need
                if (_.isEmpty(blueprintFileUrl) && !file) {
                    formObj.addClass('error');
                    formObj.find("input.uploadBlueprintFile").parents('.field').addClass('error');
                    formObj.find("input[name='blueprintFileUrl']").parents('.field').addClass('error');
                    formObj.find('.ui.error.message').show();

                    return false;
                }

                if (_.isEmpty(blueprintName)) {
                    formObj.addClass('error');
                    formObj.find("input[name='blueprintName']").parents('.field').addClass('error');
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
                xhr.open('put', this.props.context.getManagerUrl() + '/api/v2.1/blueprints/' + blueprintName + (!_.isEmpty(blueprintFileName) ? '?application_file_name=' + blueprintFileName + '.yaml' : ''));
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
                        { className: 'ui labeled icon button uploadBlueprint', onClick: this._showModal },
                        React.createElement('i', { className: 'upload icon' }),
                        'Upload'
                    ),
                    React.createElement(
                        'div',
                        { className: 'ui modal uploadBlueprintModal', ref: 'modalObj' },
                        React.createElement(
                            'div',
                            { className: 'header' },
                            React.createElement('i', { className: 'upload icon' }),
                            ' Upload blueprint'
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
                                            React.createElement('input', { type: 'text', name: 'blueprintFileUrl', placeholder: 'Enter blueprint url' })
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
                                            React.createElement('input', { type: 'text', readOnly: 'true', value: '', className: 'uploadBlueprintFile', onClick: this._openFileSelection }),
                                            React.createElement(
                                                'button',
                                                { className: 'ui icon button uploadBlueprintFile', onClick: this._openFileSelection },
                                                React.createElement('i', { className: 'attach icon' })
                                            )
                                        ),
                                        React.createElement('input', { type: 'file', name: 'blueprintFile', id: 'blueprintFile', style: { "display": "none" }, onChange: this._uploadFileChanged })
                                    )
                                ),
                                React.createElement(
                                    'div',
                                    { className: 'field' },
                                    React.createElement('input', _defineProperty({ type: 'text', required: true, name: 'blueprintName', id: 'blueprintName', placeholder: 'Blueprint name' }, 'required', true))
                                ),
                                React.createElement(
                                    'div',
                                    { className: 'field' },
                                    React.createElement('input', { type: 'text', name: 'blueprintFileName', id: 'blueprintFileName', placeholder: 'Blueprint filename e.g. blueprint' })
                                ),
                                React.createElement(
                                    'div',
                                    { className: 'ui error message', style: { "display": "none" } },
                                    React.createElement(
                                        'div',
                                        { className: 'header' },
                                        'Missing data'
                                    ),
                                    React.createElement(
                                        'p',
                                        null,
                                        'Please fill in all the required fields'
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

var _BlueprintsTable = require('./BlueprintsTable');

var _BlueprintsTable2 = _interopRequireDefault(_BlueprintsTable);

var _UploadBlueprintModal = require('./UploadBlueprintModal');

var _UploadBlueprintModal2 = _interopRequireDefault(_UploadBlueprintModal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by kinneretzin on 07/09/2016.
 */

var BlueprintsTable = null;
var UploadModal = null;

addPlugin({
    id: "blueprints",
    name: "Blueprints list",
    description: 'blah blah blah',
    initialWidth: 8,
    initialHeight: 5,
    color: "blue",
    initialConfiguration: {filterBy: "addistest"},
    isReact: true,
    init: function init(pluginUtils) {
        BlueprintsTable = (0, _BlueprintsTable2.default)(pluginUtils);
        UploadModal = (0, _UploadBlueprintModal2.default)(pluginUtils);
    },

    fetchData: function fetchData(plugin, context, pluginUtils) {
        return new Promise(function (resolve, reject) {
            pluginUtils.jQuery.get({
                url: context.getManagerUrl() + '/api/v2.1/blueprints?_include=id,updated_at,created_at,description,plan',
                dataType: 'json'
            }).done(function (blueprints) {

                pluginUtils.jQuery.get({
                    url: context.getManagerUrl() + '/api/v2.1/deployments?_include=id,blueprint_id',
                    dataType: 'json'
                }).done(function (deployments) {

                    var depCount = _.countBy(deployments.items, 'blueprint_id');
                    // Count deployments
                    _.each(blueprints.items, function (blueprint) {
                        blueprint.depCount = depCount[blueprint.id] || 0;
                    });

                    resolve(blueprints);
                }).fail(reject);
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

        var selectedBlueprint = context.getValue('blueprintId');
        var formattedData = Object.assign({}, data, {
            items: _.map(data.items, function (item) {
                return Object.assign({}, item, {
                    created_at: pluginUtils.moment(item.created_at, 'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'), //2016-07-20 09:10:53.103579
                    updated_at: pluginUtils.moment(item.updated_at, 'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'),
                    isSelected: selectedBlueprint === item.id
                });
            })
        });

        return React.createElement(
            'div',
            null,
            React.createElement(BlueprintsTable, { widget: widget, data: formattedData, context: context, utils: pluginUtils }),
            React.createElement(UploadModal, { widget: widget, data: formattedData, context: context, utils: pluginUtils })
        );
    }
});

},{"./BlueprintsTable":1,"./UploadBlueprintModal":2}]},{},[1,3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwbHVnaW5zL2JsdWVwcmludHMvc3JjL0JsdWVwcmludHNUYWJsZS5qcyIsInBsdWdpbnMvYmx1ZXByaW50cy9zcmMvVXBsb2FkQmx1ZXByaW50TW9kYWwuanMiLCJwbHVnaW5zL2JsdWVwcmludHMvc3JjL3dpZGdldC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0FDQUE7Ozs7a0JBSWUsVUFBQyxXQUFELEVBQWdCOztBQUUzQjtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsNkNBRXNCLElBRnRCLEVBRTJCO0FBQ25CLG9CQUFJLHlCQUF5QixLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLFFBQW5CLENBQTRCLGFBQTVCLENBQTdCO0FBQ0EscUJBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsUUFBbkIsQ0FBNEIsYUFBNUIsRUFBMEMsS0FBSyxFQUFMLEtBQVksc0JBQVosR0FBcUMsSUFBckMsR0FBNEMsS0FBSyxFQUEzRjtBQUNIO0FBTEw7QUFBQTtBQUFBLDhDQU9zQixJQVB0QixFQU8yQixDQUN0QjtBQVJMO0FBQUE7QUFBQSw2Q0FVcUIsSUFWckIsRUFVMEIsQ0FDckI7QUFYTDtBQUFBO0FBQUEscUNBYWE7QUFBQTs7QUFDTCx1QkFFSTtBQUFBO0FBQUEsc0JBQU8sV0FBVSx1Q0FBakI7QUFDSTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFDSTtBQUFBO0FBQUE7QUFBQTtBQUFBLDZCQURKO0FBRUk7QUFBQTtBQUFBO0FBQUE7QUFBQSw2QkFGSjtBQUdJO0FBQUE7QUFBQTtBQUFBO0FBQUEsNkJBSEo7QUFJSTtBQUFBO0FBQUE7QUFBQTtBQUFBLDZCQUpKO0FBS0k7QUFMSjtBQURBLHFCQURKO0FBVUk7QUFBQTtBQUFBO0FBRUksNkJBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsS0FBaEIsQ0FBc0IsR0FBdEIsQ0FBMEIsVUFBQyxJQUFELEVBQVE7QUFDOUIsbUNBQ0k7QUFBQTtBQUFBLGtDQUFJLEtBQUssS0FBSyxFQUFkLEVBQWtCLFdBQVcsVUFBUyxLQUFLLFVBQUwsR0FBa0IsUUFBbEIsR0FBNkIsRUFBdEMsQ0FBN0IsRUFBd0UsU0FBUyxPQUFLLGdCQUFMLENBQXNCLElBQXRCLFNBQWdDLElBQWhDLENBQWpGO0FBQ0k7QUFBQTtBQUFBO0FBQ0k7QUFBQTtBQUFBO0FBQ0k7QUFBQTtBQUFBLDhDQUFHLFdBQVUsZUFBYixFQUE2QixNQUFLLG9CQUFsQztBQUF3RCxpREFBSztBQUE3RDtBQURKO0FBREosaUNBREo7QUFNSTtBQUFBO0FBQUE7QUFBSyx5Q0FBSztBQUFWLGlDQU5KO0FBT0k7QUFBQTtBQUFBO0FBQUsseUNBQUs7QUFBVixpQ0FQSjtBQVFJO0FBQUE7QUFBQTtBQUFJO0FBQUE7QUFBQSwwQ0FBSyxXQUFVLDJCQUFmO0FBQTRDLDZDQUFLO0FBQWpEO0FBQUosaUNBUko7QUFTSTtBQUFBO0FBQUE7QUFDSTtBQUFBO0FBQUEsMENBQUssV0FBVSxZQUFmO0FBQ0ksbUVBQUcsV0FBVSwyQkFBYixFQUF5QyxPQUFNLG1CQUEvQyxFQUFtRSxTQUFTLE9BQUssaUJBQUwsQ0FBdUIsSUFBdkIsU0FBaUMsSUFBakMsQ0FBNUUsR0FESjtBQUVJLG1FQUFHLFdBQVUsMEJBQWIsRUFBd0MsT0FBTSxrQkFBOUMsRUFBaUUsU0FBUyxPQUFLLGdCQUFMLENBQXNCLElBQXRCLFNBQWdDLElBQWhDLENBQTFFO0FBRko7QUFESjtBQVRKLDZCQURKO0FBa0JILHlCQW5CRDtBQUZKO0FBVkosaUJBRko7QUF1Q0g7QUFyREw7O0FBQUE7QUFBQSxNQUFxQixNQUFNLFNBQTNCO0FBdURILEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3REQ7Ozs7a0JBSWUsVUFBQyxXQUFELEVBQWdCOztBQUUzQjtBQUFBOztBQUVJLHdCQUFZLEtBQVosRUFBa0IsT0FBbEIsRUFBMkI7QUFBQTs7QUFBQSx3SEFDakIsS0FEaUIsRUFDWCxPQURXOztBQUd2QixrQkFBSyxLQUFMLEdBQWE7QUFDVCwyQkFBVztBQURGLGFBQWI7QUFIdUI7QUFNMUI7O0FBUkw7QUFBQTtBQUFBLGdEQVV3QjtBQUNoQixxQkFBSyxVQUFMLENBQWdCLEtBQUssSUFBTCxDQUFVLFFBQTFCO0FBQ0g7QUFaTDtBQUFBO0FBQUEsaURBYXlCO0FBQ2pCLDRCQUFZLE1BQVosQ0FBbUIsS0FBSyxJQUFMLENBQVUsUUFBN0IsRUFBdUMsS0FBdkMsQ0FBNkMsU0FBN0M7QUFDSDtBQWZMO0FBQUE7QUFBQSxtREFnQjJCO0FBQ25CLDRCQUFZLE1BQVosQ0FBbUIsS0FBSyxJQUFMLENBQVUsUUFBN0IsRUFBdUMsS0FBdkMsQ0FBNkMsU0FBN0M7QUFDQSw0QkFBWSxNQUFaLENBQW1CLEtBQUssSUFBTCxDQUFVLFFBQTdCLEVBQXVDLE1BQXZDO0FBQ0g7QUFuQkw7QUFBQTtBQUFBLHVDQXFCZSxRQXJCZixFQXFCeUI7QUFDakIsNEJBQVksTUFBWixDQUFtQixRQUFuQixFQUE2QixLQUE3QixDQUFtQztBQUMvQiw4QkFBWSxLQURtQjtBQUUvQiw0QkFBWSxrQkFBVTtBQUNsQjtBQUNBO0FBQ0gscUJBTDhCO0FBTS9CLCtCQUFZLHFCQUFXO0FBQ25CLG9DQUFZLE1BQVosQ0FBbUIsc0JBQW5CLEVBQTJDLEtBQTNDO0FBQ0EsK0JBQU8sS0FBUDtBQUNIO0FBVDhCLGlCQUFuQztBQVlIO0FBbENMO0FBQUE7QUFBQSx5Q0FvQ2lCO0FBQ1QsNEJBQVksTUFBWixDQUFtQix1QkFBbkIsRUFBNEMsS0FBNUMsQ0FBa0QsTUFBbEQ7QUFDSDtBQXRDTDtBQUFBO0FBQUEsK0NBd0N1QixDQXhDdkIsRUF3QzBCO0FBQ2xCLGtCQUFFLGNBQUY7QUFDQSw0QkFBWSxNQUFaLENBQW1CLGdCQUFuQixFQUFxQyxLQUFyQztBQUNBLHVCQUFPLEtBQVA7QUFDSDtBQTVDTDtBQUFBO0FBQUEsK0NBOEN1QixDQTlDdkIsRUE4Q3lCO0FBQ2pCLG9CQUFJLG1CQUFtQixZQUFZLE1BQVosQ0FBbUIsRUFBRSxhQUFyQixFQUFvQyxHQUFwQyxFQUF2QjtBQUNBLG9CQUFJLFdBQVcsaUJBQWlCLEtBQWpCLENBQXVCLElBQXZCLEVBQTZCLEdBQTdCLEVBQWY7O0FBRUEsNEJBQVksTUFBWixDQUFtQiwyQkFBbkIsRUFBZ0QsR0FBaEQsQ0FBb0QsUUFBcEQsRUFBOEQsSUFBOUQsQ0FBbUUsT0FBbkUsRUFBMkUsZ0JBQTNFO0FBRUg7QUFwREw7QUFBQTtBQUFBLDBDQXNEa0IsQ0F0RGxCLEVBc0RxQjtBQUNiLGtCQUFFLGNBQUY7O0FBRUEsb0JBQUksT0FBTyxJQUFYOztBQUVBLG9CQUFJLFVBQVUsWUFBWSxNQUFaLENBQW1CLEVBQUUsYUFBckIsQ0FBZDs7QUFFQTtBQUNBLHdCQUFRLElBQVIsQ0FBYSxzQkFBYixFQUFxQyxXQUFyQyxDQUFpRCxPQUFqRDtBQUNBLHdCQUFRLElBQVIsQ0FBYSxtQkFBYixFQUFrQyxJQUFsQzs7QUFFQTtBQUNBLG9CQUFJLGdCQUFnQixRQUFRLElBQVIsQ0FBYSw2QkFBYixFQUE0QyxHQUE1QyxFQUFwQjtBQUNBLG9CQUFJLG9CQUFvQixRQUFRLElBQVIsQ0FBYSxpQ0FBYixFQUFnRCxHQUFoRCxFQUF4QjtBQUNBLG9CQUFJLG1CQUFtQixRQUFRLElBQVIsQ0FBYSxnQ0FBYixFQUErQyxHQUEvQyxFQUF2QjtBQUNBLG9CQUFJLE9BQU8sU0FBUyxjQUFULENBQXdCLGVBQXhCLEVBQXlDLEtBQXpDLENBQStDLENBQS9DLENBQVg7O0FBRUE7QUFDQSxvQkFBSSxFQUFFLE9BQUYsQ0FBVSxnQkFBVixLQUErQixDQUFDLElBQXBDLEVBQTBDO0FBQ3RDLDRCQUFRLFFBQVIsQ0FBaUIsT0FBakI7QUFDQSw0QkFBUSxJQUFSLENBQWEsMkJBQWIsRUFBMEMsT0FBMUMsQ0FBa0QsUUFBbEQsRUFBNEQsUUFBNUQsQ0FBcUUsT0FBckU7QUFDQSw0QkFBUSxJQUFSLENBQWEsZ0NBQWIsRUFBK0MsT0FBL0MsQ0FBdUQsUUFBdkQsRUFBaUUsUUFBakUsQ0FBMEUsT0FBMUU7QUFDQSw0QkFBUSxJQUFSLENBQWEsbUJBQWIsRUFBa0MsSUFBbEM7O0FBRUEsMkJBQU8sS0FBUDtBQUNIOztBQUVELG9CQUFJLEVBQUUsT0FBRixDQUFVLGFBQVYsQ0FBSixFQUE4QjtBQUMxQiw0QkFBUSxRQUFSLENBQWlCLE9BQWpCO0FBQ0EsNEJBQVEsSUFBUixDQUFhLDZCQUFiLEVBQTRDLE9BQTVDLENBQW9ELFFBQXBELEVBQThELFFBQTlELENBQXVFLE9BQXZFO0FBQ0EsNEJBQVEsSUFBUixDQUFhLG1CQUFiLEVBQWtDLElBQWxDOztBQUVBLDJCQUFPLEtBQVA7QUFDSDs7QUFFRDtBQUNBLHdCQUFRLE9BQVIsQ0FBZ0IsUUFBaEIsRUFBMEIsSUFBMUIsQ0FBK0Isa0JBQS9CLEVBQW1ELElBQW5ELENBQXdELFVBQXhELEVBQW1FLFVBQW5FLEVBQStFLFFBQS9FLENBQXdGLGtCQUF4RjtBQUNBLHdCQUFRLFFBQVIsQ0FBaUIsU0FBakI7O0FBRUE7QUFDQSxvQkFBSSxNQUFNLElBQUksY0FBSixFQUFWO0FBQ0EsaUJBQUMsSUFBSSxNQUFKLElBQWMsR0FBZixFQUFvQixnQkFBcEIsQ0FBcUMsVUFBckMsRUFBaUQsVUFBUyxDQUFULEVBQVk7QUFDekQsd0JBQUksT0FBTyxFQUFFLFFBQUYsSUFBYyxFQUFFLE1BQTNCO0FBQ0Esd0JBQUksUUFBUSxFQUFFLFNBQUYsSUFBZSxFQUFFLEtBQTdCO0FBQ0EsNEJBQVEsR0FBUixDQUFZLG1CQUFtQixLQUFLLEtBQUwsQ0FBVyxPQUFLLEtBQUwsR0FBVyxHQUF0QixDQUFuQixHQUFnRCxHQUE1RDtBQUNILGlCQUpEO0FBS0Esb0JBQUksZ0JBQUosQ0FBcUIsT0FBckIsRUFBOEIsVUFBUyxDQUFULEVBQVc7QUFDckMsNEJBQVEsR0FBUixDQUFZLGtCQUFaLEVBQWdDLENBQWhDLEVBQW1DLEtBQUssWUFBeEM7QUFDQSx5QkFBSyx5QkFBTCxDQUErQixJQUEvQjtBQUNBLDRCQUFRLE9BQVIsQ0FBZ0IsUUFBaEIsRUFBMEIsSUFBMUIsQ0FBK0Isa0JBQS9CLEVBQW1ELFVBQW5ELENBQThELFVBQTlELEVBQTBFLFdBQTFFLENBQXNGLGtCQUF0RjtBQUNBLDRCQUFRLFdBQVIsQ0FBb0IsU0FBcEI7QUFFSCxpQkFORDtBQU9BLG9CQUFJLGdCQUFKLENBQXFCLE1BQXJCLEVBQTZCLFVBQVMsQ0FBVCxFQUFZO0FBQ3JDLDRCQUFRLEdBQVIsQ0FBWSxxQkFBWixFQUFtQyxDQUFuQyxFQUFzQyxLQUFLLFlBQTNDO0FBQ0EsNEJBQVEsT0FBUixDQUFnQixRQUFoQixFQUEwQixJQUExQixDQUErQixrQkFBL0IsRUFBbUQsVUFBbkQsQ0FBOEQsVUFBOUQsRUFBMEUsV0FBMUUsQ0FBc0Ysa0JBQXRGO0FBQ0EsNEJBQVEsV0FBUixDQUFvQixTQUFwQjs7QUFFQSx3QkFBSSxDQUFDLEtBQUsseUJBQUwsQ0FBK0IsSUFBL0IsQ0FBTCxFQUEyQztBQUN2QyxnQ0FBUSxPQUFSLENBQWdCLFFBQWhCLEVBQTBCLEtBQTFCLENBQWdDLE1BQWhDO0FBQ0EsNkJBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsT0FBbkI7QUFDSCxxQkFIRCxNQUdPO0FBQ0gsZ0NBQVEsSUFBUixDQUFhLGdDQUFiLEVBQStDLElBQS9DO0FBQ0g7QUFDSixpQkFYRDtBQVlBLG9CQUFJLElBQUosQ0FBUyxLQUFULEVBQWUsS0FBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixhQUFuQixLQUNYLHVCQURXLEdBQ2EsYUFEYixJQUM4QixDQUFDLEVBQUUsT0FBRixDQUFVLGlCQUFWLENBQUQsR0FBZ0MsNEJBQTBCLGlCQUExQixHQUE0QyxPQUE1RSxHQUFzRixFQURwSCxDQUFmO0FBRUEsb0JBQUksSUFBSixDQUFTLElBQVQ7O0FBRUEsdUJBQU8sS0FBUDtBQUNIO0FBNUhMO0FBQUE7QUFBQSxzREE4SDhCLEdBOUg5QixFQThIbUM7QUFDM0Isb0JBQUk7QUFDQSx3QkFBSSxXQUFXLEtBQUssS0FBTCxDQUFXLElBQUksWUFBZixDQUFmO0FBQ0Esd0JBQUksU0FBUyxPQUFiLEVBQXNCO0FBQ2xCLDZCQUFLLFFBQUwsQ0FBYyxFQUFDLFdBQVcsU0FBUyxPQUFyQixFQUFkO0FBQ0EsK0JBQU8sSUFBUDtBQUNIO0FBQ0osaUJBTkQsQ0FNRSxPQUFPLEdBQVAsRUFBWTtBQUNWLDRCQUFRLEdBQVIsQ0FBWSw4QkFBWixFQUEyQyxHQUEzQztBQUNBLDJCQUFPLEtBQVA7QUFDSDtBQUNKO0FBeklMO0FBQUE7QUFBQSxxQ0EwSWE7QUFDTCx1QkFDSTtBQUFBO0FBQUE7QUFDSTtBQUFBO0FBQUEsMEJBQVEsV0FBVSx3Q0FBbEIsRUFBMkQsU0FBUyxLQUFLLFVBQXpFO0FBQ0ksbURBQUcsV0FBVSxhQUFiLEdBREo7QUFBQTtBQUFBLHFCQURKO0FBTUk7QUFBQTtBQUFBLDBCQUFLLFdBQVUsK0JBQWYsRUFBK0MsS0FBSSxVQUFuRDtBQUNJO0FBQUE7QUFBQSw4QkFBSyxXQUFVLFFBQWY7QUFDSSx1REFBRyxXQUFVLGFBQWIsR0FESjtBQUFBO0FBQUEseUJBREo7QUFLSTtBQUFBO0FBQUEsOEJBQUssV0FBVSxTQUFmO0FBQ0k7QUFBQTtBQUFBLGtDQUFNLFdBQVUsb0JBQWhCLEVBQXFDLFVBQVUsS0FBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLElBQXhCLENBQS9DLEVBQThFLFFBQU8sRUFBckY7QUFDSTtBQUFBO0FBQUEsc0NBQUssV0FBVSxRQUFmO0FBQ0k7QUFBQTtBQUFBLDBDQUFLLFdBQVUsaUJBQWY7QUFDSTtBQUFBO0FBQUEsOENBQUssV0FBVSxrQkFBZjtBQUNJO0FBQUE7QUFBQSxrREFBSyxXQUFVLFVBQWY7QUFBQTtBQUFBLDZDQURKO0FBSUksMkVBQU8sTUFBSyxNQUFaLEVBQW1CLE1BQUssa0JBQXhCLEVBQTJDLGFBQVkscUJBQXZEO0FBSko7QUFESixxQ0FESjtBQVVJO0FBQUE7QUFBQSwwQ0FBSyxXQUFVLGdCQUFmLEVBQWdDLE9BQU8sRUFBQyxZQUFXLFVBQVosRUFBdkM7QUFDSTtBQUFBO0FBQUEsOENBQUssV0FBVSxxQkFBZjtBQUFBO0FBQUE7QUFESixxQ0FWSjtBQWVJO0FBQUE7QUFBQSwwQ0FBSyxXQUFVLGtCQUFmO0FBQ0k7QUFBQTtBQUFBLDhDQUFLLFdBQVUsaUJBQWY7QUFDSSwyRUFBTyxNQUFLLE1BQVosRUFBbUIsVUFBUyxNQUE1QixFQUFtQyxPQUFNLEVBQXpDLEVBQTRDLFdBQVUscUJBQXRELEVBQTRFLFNBQVMsS0FBSyxrQkFBMUYsR0FESjtBQUVJO0FBQUE7QUFBQSxrREFBUSxXQUFVLG9DQUFsQixFQUF1RCxTQUFTLEtBQUssa0JBQXJFO0FBQ0ksMkVBQUcsV0FBVSxhQUFiO0FBREo7QUFGSix5Q0FESjtBQU9JLHVFQUFPLE1BQUssTUFBWixFQUFtQixNQUFLLGVBQXhCLEVBQXdDLElBQUcsZUFBM0MsRUFBMkQsT0FBTyxFQUFDLFdBQVcsTUFBWixFQUFsRSxFQUF1RixVQUFVLEtBQUssa0JBQXRHO0FBUEo7QUFmSixpQ0FESjtBQTJCSTtBQUFBO0FBQUEsc0NBQUssV0FBVSxPQUFmO0FBQ0ksbUZBQU8sTUFBSyxNQUFaLEVBQW1CLGNBQW5CLEVBQTRCLE1BQUssZUFBakMsRUFBaUQsSUFBRyxlQUFwRCxFQUFvRSxhQUFZLGdCQUFoRjtBQURKLGlDQTNCSjtBQThCSTtBQUFBO0FBQUEsc0NBQUssV0FBVSxPQUFmO0FBQ0ksbUVBQU8sTUFBSyxNQUFaLEVBQW1CLE1BQUssbUJBQXhCLEVBQTRDLElBQUcsbUJBQS9DLEVBQW1FLGFBQVksbUNBQS9FO0FBREosaUNBOUJKO0FBa0NJO0FBQUE7QUFBQSxzQ0FBSyxXQUFVLGtCQUFmLEVBQWtDLE9BQU8sRUFBQyxXQUFVLE1BQVgsRUFBekM7QUFDSTtBQUFBO0FBQUEsMENBQUssV0FBVSxRQUFmO0FBQUE7QUFBQSxxQ0FESjtBQUVJO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFGSixpQ0FsQ0o7QUF1Q1EscUNBQUssS0FBTCxDQUFXLFNBQVgsR0FDSTtBQUFBO0FBQUEsc0NBQUssV0FBVSwrQkFBZixFQUErQyxPQUFPLEVBQUMsV0FBVSxPQUFYLEVBQXREO0FBQ0k7QUFBQTtBQUFBLDBDQUFLLFdBQVUsUUFBZjtBQUFBO0FBQUEscUNBREo7QUFFSTtBQUFBO0FBQUE7QUFBSSw2Q0FBSyxLQUFMLENBQVc7QUFBZjtBQUZKLGlDQURKLEdBTUksRUE3Q1o7QUFnREksK0RBQU8sTUFBSyxRQUFaLEVBQXFCLE9BQU8sRUFBQyxXQUFXLE1BQVosRUFBNUIsRUFBaUQsV0FBVSxxQkFBM0Q7QUFoREo7QUFESix5QkFMSjtBQTBESTtBQUFBO0FBQUEsOEJBQUssV0FBVSxTQUFmO0FBQ0k7QUFBQTtBQUFBLGtDQUFLLFdBQVUsd0JBQWY7QUFDSSwyREFBRyxXQUFVLGFBQWIsR0FESjtBQUFBO0FBQUEsNkJBREo7QUFLSTtBQUFBO0FBQUEsa0NBQUssV0FBVSxxQkFBZjtBQUNJLDJEQUFHLFdBQVUsYUFBYixHQURKO0FBQUE7QUFBQTtBQUxKO0FBMURKO0FBTkosaUJBREo7QUErRUg7QUExTkw7O0FBQUE7QUFBQSxNQUFxQixNQUFNLFNBQTNCO0FBNE5ILEM7Ozs7O0FDOU5EOzs7O0FBQ0E7Ozs7OztBQUxBOzs7O0FBT0EsSUFBSSxrQkFBa0IsSUFBdEI7QUFDQSxJQUFJLGNBQWMsSUFBbEI7O0FBRUEsVUFBVTtBQUNOLFFBQUksWUFERTtBQUVOLFVBQU0saUJBRkE7QUFHTixpQkFBYSxnQkFIUDtBQUlOLGtCQUFjLENBSlI7QUFLTixtQkFBZSxDQUxUO0FBTU4sV0FBUSxNQU5GO0FBT04sYUFBUyxJQVBIO0FBUU4sVUFBTSxjQUFTLFdBQVQsRUFBc0I7QUFDeEIsMEJBQWtCLCtCQUFzQixXQUF0QixDQUFsQjtBQUNBLHNCQUFjLG9DQUEyQixXQUEzQixDQUFkO0FBQ0gsS0FYSzs7QUFhTixlQUFXLG1CQUFTLE1BQVQsRUFBZ0IsT0FBaEIsRUFBd0IsV0FBeEIsRUFBcUM7QUFDNUMsZUFBTyxJQUFJLE9BQUosQ0FBYSxVQUFDLE9BQUQsRUFBUyxNQUFULEVBQW9CO0FBQ3BDLHdCQUFZLE1BQVosQ0FBbUIsR0FBbkIsQ0FBdUI7QUFDbkIscUJBQUssUUFBUSxhQUFSLEtBQTBCLHlFQURaO0FBRW5CLDBCQUFVO0FBRlMsYUFBdkIsRUFJSyxJQUpMLENBSVUsVUFBQyxVQUFELEVBQWU7O0FBRWpCLDRCQUFZLE1BQVosQ0FBbUIsR0FBbkIsQ0FBdUI7QUFDbkIseUJBQUssUUFBUSxhQUFSLEtBQTBCLGdEQURaO0FBRW5CLDhCQUFVO0FBRlMsaUJBQXZCLEVBSUssSUFKTCxDQUlVLFVBQUMsV0FBRCxFQUFlOztBQUVqQix3QkFBSSxXQUFXLEVBQUUsT0FBRixDQUFVLFlBQVksS0FBdEIsRUFBNEIsY0FBNUIsQ0FBZjtBQUNBO0FBQ0Esc0JBQUUsSUFBRixDQUFPLFdBQVcsS0FBbEIsRUFBd0IsVUFBQyxTQUFELEVBQWE7QUFDakMsa0NBQVUsUUFBVixHQUFxQixTQUFTLFVBQVUsRUFBbkIsS0FBMEIsQ0FBL0M7QUFFSCxxQkFIRDs7QUFLQSw0QkFBUSxVQUFSO0FBQ0gsaUJBZEwsRUFlSyxJQWZMLENBZVUsTUFmVjtBQWdCSCxhQXRCTCxFQXVCSyxJQXZCTCxDQXVCVSxNQXZCVjtBQXdCSCxTQXpCTSxDQUFQO0FBMEJILEtBeENLOztBQTJDTixZQUFRLGdCQUFTLE1BQVQsRUFBZ0IsSUFBaEIsRUFBcUIsS0FBckIsRUFBMkIsT0FBM0IsRUFBbUMsV0FBbkMsRUFBZ0Q7O0FBRXBELFlBQUksQ0FBQyxJQUFMLEVBQVc7QUFDUCxtQkFBTyxZQUFZLGtCQUFaLEVBQVA7QUFDSDs7QUFFRCxZQUFJLEtBQUosRUFBVztBQUNQLG1CQUFPLFlBQVksZ0JBQVosQ0FBNkIsS0FBN0IsQ0FBUDtBQUNIOztBQUVELFlBQUksb0JBQW9CLFFBQVEsUUFBUixDQUFpQixhQUFqQixDQUF4QjtBQUNBLFlBQUksZ0JBQWdCLE9BQU8sTUFBUCxDQUFjLEVBQWQsRUFBaUIsSUFBakIsRUFBc0I7QUFDdEMsbUJBQU8sRUFBRSxHQUFGLENBQU8sS0FBSyxLQUFaLEVBQWtCLFVBQUMsSUFBRCxFQUFRO0FBQzdCLHVCQUFPLE9BQU8sTUFBUCxDQUFjLEVBQWQsRUFBaUIsSUFBakIsRUFBc0I7QUFDekIsZ0NBQVksWUFBWSxNQUFaLENBQW1CLEtBQUssVUFBeEIsRUFBbUMsMkJBQW5DLEVBQWdFLE1BQWhFLENBQXVFLGtCQUF2RSxDQURhLEVBQytFO0FBQ3hHLGdDQUFZLFlBQVksTUFBWixDQUFtQixLQUFLLFVBQXhCLEVBQW1DLDJCQUFuQyxFQUFnRSxNQUFoRSxDQUF1RSxrQkFBdkUsQ0FGYTtBQUd6QixnQ0FBWSxzQkFBc0IsS0FBSztBQUhkLGlCQUF0QixDQUFQO0FBS0gsYUFOTTtBQUQrQixTQUF0QixDQUFwQjs7QUFVQSxlQUNJO0FBQUE7QUFBQTtBQUNJLGdDQUFDLGVBQUQsSUFBaUIsUUFBUSxNQUF6QixFQUFpQyxNQUFNLGFBQXZDLEVBQXNELFNBQVMsT0FBL0QsRUFBd0UsT0FBTyxXQUEvRSxHQURKO0FBRUksZ0NBQUMsV0FBRCxJQUFhLFFBQVEsTUFBckIsRUFBNkIsTUFBTSxhQUFuQyxFQUFrRCxTQUFTLE9BQTNELEVBQW9FLE9BQU8sV0FBM0U7QUFGSixTQURKO0FBTUg7QUF0RUssQ0FBViIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENyZWF0ZWQgYnkga2lubmVyZXR6aW4gb24gMDIvMTAvMjAxNi5cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCAocGx1Z2luVXRpbHMpPT4ge1xuXG4gICAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgICAgICBfc2VsZWN0Qmx1ZXByaW50IChpdGVtKXtcbiAgICAgICAgICAgIHZhciBvbGRTZWxlY3RlZEJsdWVwcmludElkID0gdGhpcy5wcm9wcy5jb250ZXh0LmdldFZhbHVlKCdibHVlcHJpbnRJZCcpO1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LnNldFZhbHVlKCdibHVlcHJpbnRJZCcsaXRlbS5pZCA9PT0gb2xkU2VsZWN0ZWRCbHVlcHJpbnRJZCA/IG51bGwgOiBpdGVtLmlkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9jcmVhdGVEZXBsb3ltZW50KGl0ZW0pe1xuICAgICAgICB9XG5cbiAgICAgICAgX2RlbGV0ZUJsdWVwcmludChpdGVtKXtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG5cbiAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPVwidWkgdmVyeSBjb21wYWN0IHRhYmxlIGJsdWVwcmludHNUYWJsZVwiPlxuICAgICAgICAgICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5OYW1lPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5DcmVhdGVkPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5VcGRhdGVkPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD4jIERlcGxveW1lbnRzPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD48L3RoPlxuICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuZGF0YS5pdGVtcy5tYXAoKGl0ZW0pPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyIGtleT17aXRlbS5pZH0gY2xhc3NOYW1lPXtcInJvdyBcIisgKGl0ZW0uaXNTZWxlY3RlZCA/ICdhY3RpdmUnIDogJycpfSBvbkNsaWNrPXt0aGlzLl9zZWxlY3RCbHVlcHJpbnQuYmluZCh0aGlzLGl0ZW0pfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9J2JsdWVwcmludE5hbWUnIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj57aXRlbS5pZH08L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPntpdGVtLmNyZWF0ZWRfYXR9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57aXRlbS51cGRhdGVkX2F0fTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+PGRpdiBjbGFzc05hbWU9XCJ1aSBncmVlbiBob3Jpem9udGFsIGxhYmVsXCI+e2l0ZW0uZGVwQ291bnR9PC9kaXY+PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd0FjdGlvbnNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwicm9ja2V0IGljb24gbGluayBib3JkZXJlZFwiIHRpdGxlPVwiQ3JlYXRlIGRlcGxveW1lbnRcIiBvbkNsaWNrPXt0aGlzLl9jcmVhdGVEZXBsb3ltZW50LmJpbmQodGhpcyxpdGVtKX0+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJ0cmFzaCBpY29uIGxpbmsgYm9yZGVyZWRcIiB0aXRsZT1cIkRlbGV0ZSBibHVlcHJpbnRcIiBvbkNsaWNrPXt0aGlzLl9kZWxldGVCbHVlcHJpbnQuYmluZCh0aGlzLGl0ZW0pfT48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICAgICAgPC90YWJsZT5cblxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH07XG59O1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGtpbm5lcmV0emluIG9uIDA1LzEwLzIwMTYuXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgKHBsdWdpblV0aWxzKT0+IHtcblxuICAgIHJldHVybiBjbGFzcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJvcHMsY29udGV4dCkge1xuICAgICAgICAgICAgc3VwZXIocHJvcHMsY29udGV4dCk7XG5cbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICAgICAgdXBsb2FkRXJyOiBudWxsXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgICAgIHRoaXMuX2luaXRNb2RhbCh0aGlzLnJlZnMubW9kYWxPYmopO1xuICAgICAgICB9XG4gICAgICAgIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICAgICAgICAgIHBsdWdpblV0aWxzLmpRdWVyeSh0aGlzLnJlZnMubW9kYWxPYmopLm1vZGFsKCdyZWZyZXNoJyk7XG4gICAgICAgIH1cbiAgICAgICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgICAgICAgICBwbHVnaW5VdGlscy5qUXVlcnkodGhpcy5yZWZzLm1vZGFsT2JqKS5tb2RhbCgnZGVzdHJveScpO1xuICAgICAgICAgICAgcGx1Z2luVXRpbHMualF1ZXJ5KHRoaXMucmVmcy5tb2RhbE9iaikucmVtb3ZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBfaW5pdE1vZGFsKG1vZGFsT2JqKSB7XG4gICAgICAgICAgICBwbHVnaW5VdGlscy5qUXVlcnkobW9kYWxPYmopLm1vZGFsKHtcbiAgICAgICAgICAgICAgICBjbG9zYWJsZSAgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBvbkRlbnkgICAgOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAvL3dpbmRvdy5hbGVydCgnV2FpdCBub3QgeWV0IScpO1xuICAgICAgICAgICAgICAgICAgICAvL3JldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9uQXBwcm92ZSA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBwbHVnaW5VdGlscy5qUXVlcnkoJy51cGxvYWRGb3JtU3VibWl0QnRuJykuY2xpY2soKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICBfc2hvd01vZGFsKCkge1xuICAgICAgICAgICAgcGx1Z2luVXRpbHMualF1ZXJ5KCcudXBsb2FkQmx1ZXByaW50TW9kYWwnKS5tb2RhbCgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgX29wZW5GaWxlU2VsZWN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHBsdWdpblV0aWxzLmpRdWVyeSgnI2JsdWVwcmludEZpbGUnKS5jbGljaygpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgX3VwbG9hZEZpbGVDaGFuZ2VkKGUpe1xuICAgICAgICAgICAgdmFyIGZ1bGxQYXRoRmlsZU5hbWUgPSBwbHVnaW5VdGlscy5qUXVlcnkoZS5jdXJyZW50VGFyZ2V0KS52YWwoKTtcbiAgICAgICAgICAgIHZhciBmaWxlbmFtZSA9IGZ1bGxQYXRoRmlsZU5hbWUuc3BsaXQoJ1xcXFwnKS5wb3AoKTtcblxuICAgICAgICAgICAgcGx1Z2luVXRpbHMualF1ZXJ5KCdpbnB1dC51cGxvYWRCbHVlcHJpbnRGaWxlJykudmFsKGZpbGVuYW1lKS5hdHRyKCd0aXRsZScsZnVsbFBhdGhGaWxlTmFtZSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIF9zdWJtaXRVcGxvYWQoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICB2YXIgdGhpJCA9IHRoaXM7XG5cbiAgICAgICAgICAgIHZhciBmb3JtT2JqID0gcGx1Z2luVXRpbHMualF1ZXJ5KGUuY3VycmVudFRhcmdldCk7XG5cbiAgICAgICAgICAgIC8vIENsZWFyIGVycm9yc1xuICAgICAgICAgICAgZm9ybU9iai5maW5kKCcuZXJyb3I6bm90KC5tZXNzYWdlKScpLnJlbW92ZUNsYXNzKCdlcnJvcicpO1xuICAgICAgICAgICAgZm9ybU9iai5maW5kKCcudWkuZXJyb3IubWVzc2FnZScpLmhpZGUoKTtcblxuICAgICAgICAgICAgLy8gR2V0IHRoZSBkYXRhXG4gICAgICAgICAgICB2YXIgYmx1ZXByaW50TmFtZSA9IGZvcm1PYmouZmluZChcImlucHV0W25hbWU9J2JsdWVwcmludE5hbWUnXVwiKS52YWwoKTtcbiAgICAgICAgICAgIHZhciBibHVlcHJpbnRGaWxlTmFtZSA9IGZvcm1PYmouZmluZChcImlucHV0W25hbWU9J2JsdWVwcmludEZpbGVOYW1lJ11cIikudmFsKCk7XG4gICAgICAgICAgICB2YXIgYmx1ZXByaW50RmlsZVVybCA9IGZvcm1PYmouZmluZChcImlucHV0W25hbWU9J2JsdWVwcmludEZpbGVVcmwnXVwiKS52YWwoKTtcbiAgICAgICAgICAgIHZhciBmaWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JsdWVwcmludEZpbGUnKS5maWxlc1swXTtcblxuICAgICAgICAgICAgLy8gQ2hlY2sgdGhhdCB3ZSBoYXZlIGFsbCB3ZSBuZWVkXG4gICAgICAgICAgICBpZiAoXy5pc0VtcHR5KGJsdWVwcmludEZpbGVVcmwpICYmICFmaWxlKSB7XG4gICAgICAgICAgICAgICAgZm9ybU9iai5hZGRDbGFzcygnZXJyb3InKTtcbiAgICAgICAgICAgICAgICBmb3JtT2JqLmZpbmQoXCJpbnB1dC51cGxvYWRCbHVlcHJpbnRGaWxlXCIpLnBhcmVudHMoJy5maWVsZCcpLmFkZENsYXNzKCdlcnJvcicpO1xuICAgICAgICAgICAgICAgIGZvcm1PYmouZmluZChcImlucHV0W25hbWU9J2JsdWVwcmludEZpbGVVcmwnXVwiKS5wYXJlbnRzKCcuZmllbGQnKS5hZGRDbGFzcygnZXJyb3InKTtcbiAgICAgICAgICAgICAgICBmb3JtT2JqLmZpbmQoJy51aS5lcnJvci5tZXNzYWdlJykuc2hvdygpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoXy5pc0VtcHR5KGJsdWVwcmludE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgZm9ybU9iai5hZGRDbGFzcygnZXJyb3InKTtcbiAgICAgICAgICAgICAgICBmb3JtT2JqLmZpbmQoXCJpbnB1dFtuYW1lPSdibHVlcHJpbnROYW1lJ11cIikucGFyZW50cygnLmZpZWxkJykuYWRkQ2xhc3MoJ2Vycm9yJyk7XG4gICAgICAgICAgICAgICAgZm9ybU9iai5maW5kKCcudWkuZXJyb3IubWVzc2FnZScpLnNob3coKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRGlzYWxiZSB0aGUgZm9ybVxuICAgICAgICAgICAgZm9ybU9iai5wYXJlbnRzKCcubW9kYWwnKS5maW5kKCcuYWN0aW9ucyAuYnV0dG9uJykuYXR0cignZGlzYWJsZWQnLCdkaXNhYmxlZCcpLmFkZENsYXNzKCdkaXNhYmxlZCBsb2FkaW5nJyk7XG4gICAgICAgICAgICBmb3JtT2JqLmFkZENsYXNzKCdsb2FkaW5nJyk7XG5cbiAgICAgICAgICAgIC8vIENhbGwgdXBsb2FkIG1ldGhvZFxuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgKHhoci51cGxvYWQgfHwgeGhyKS5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZG9uZSA9IGUucG9zaXRpb24gfHwgZS5sb2FkZWRcbiAgICAgICAgICAgICAgICB2YXIgdG90YWwgPSBlLnRvdGFsU2l6ZSB8fCBlLnRvdGFsO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd4aHIgcHJvZ3Jlc3M6ICcgKyBNYXRoLnJvdW5kKGRvbmUvdG90YWwqMTAwKSArICclJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3hociB1cGxvYWQgZXJyb3InLCBlLCB0aGlzLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgdGhpJC5fcHJvY2Vzc1VwbG9hZEVycklmTmVlZGVkKHRoaXMpO1xuICAgICAgICAgICAgICAgIGZvcm1PYmoucGFyZW50cygnLm1vZGFsJykuZmluZCgnLmFjdGlvbnMgLmJ1dHRvbicpLnJlbW92ZUF0dHIoJ2Rpc2FibGVkJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkIGxvYWRpbmcnKTtcbiAgICAgICAgICAgICAgICBmb3JtT2JqLnJlbW92ZUNsYXNzKCdsb2FkaW5nJyk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3hociB1cGxvYWQgY29tcGxldGUnLCBlLCB0aGlzLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgZm9ybU9iai5wYXJlbnRzKCcubW9kYWwnKS5maW5kKCcuYWN0aW9ucyAuYnV0dG9uJykucmVtb3ZlQXR0cignZGlzYWJsZWQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQgbG9hZGluZycpO1xuICAgICAgICAgICAgICAgIGZvcm1PYmoucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKTtcblxuICAgICAgICAgICAgICAgIGlmICghdGhpJC5fcHJvY2Vzc1VwbG9hZEVycklmTmVlZGVkKHRoaXMpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1PYmoucGFyZW50cygnLm1vZGFsJykubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpJC5wcm9wcy5jb250ZXh0LnJlZnJlc2goKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmb3JtT2JqLmZpbmQoJy51aS5lcnJvci5tZXNzYWdlLnVwbG9hZEZhaWxlZCcpLnNob3coKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHhoci5vcGVuKCdwdXQnLHRoaXMucHJvcHMuY29udGV4dC5nZXRNYW5hZ2VyVXJsKCkgK1xuICAgICAgICAgICAgICAgICcvYXBpL3YyLjEvYmx1ZXByaW50cy8nK2JsdWVwcmludE5hbWUgKyAoIV8uaXNFbXB0eShibHVlcHJpbnRGaWxlTmFtZSkgPyAnP2FwcGxpY2F0aW9uX2ZpbGVfbmFtZT0nK2JsdWVwcmludEZpbGVOYW1lKycueWFtbCcgOiAnJykpO1xuICAgICAgICAgICAgeGhyLnNlbmQoZmlsZSk7XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9wcm9jZXNzVXBsb2FkRXJySWZOZWVkZWQoeGhyKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLm1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7dXBsb2FkRXJyOiByZXNwb25zZS5tZXNzYWdlfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyKCdDYW5ub3QgcGFyc2UgdXBsb2FkIHJlc3BvbnNlJyxlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZW5kZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwidWkgbGFiZWxlZCBpY29uIGJ1dHRvbiB1cGxvYWRCbHVlcHJpbnRcIiBvbkNsaWNrPXt0aGlzLl9zaG93TW9kYWx9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwidXBsb2FkIGljb25cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICBVcGxvYWRcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBtb2RhbCB1cGxvYWRCbHVlcHJpbnRNb2RhbFwiIHJlZj0nbW9kYWxPYmonPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoZWFkZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJ1cGxvYWQgaWNvblwiPjwvaT4gVXBsb2FkIGJsdWVwcmludFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtIGNsYXNzTmFtZT1cInVpIGZvcm0gdXBsb2FkRm9ybVwiIG9uU3VibWl0PXt0aGlzLl9zdWJtaXRVcGxvYWQuYmluZCh0aGlzKX0gYWN0aW9uPVwiXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGRzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkIG5pbmUgd2lkZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgbGFiZWxlZCBpbnB1dFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIGxhYmVsXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBodHRwOi8vXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPSdibHVlcHJpbnRGaWxlVXJsJyBwbGFjZWhvbGRlcj1cIkVudGVyIGJsdWVwcmludCB1cmxcIj48L2lucHV0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQgb25lIHdpZGVcIiBzdHlsZT17e1wicG9zaXRpb25cIjpcInJlbGF0aXZlXCJ9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIHZlcnRpY2FsIGRpdmlkZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZCBlaWdodCB3aWRlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBhY3Rpb24gaW5wdXRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgcmVhZE9ubHk9J3RydWUnIHZhbHVlPVwiXCIgY2xhc3NOYW1lPVwidXBsb2FkQmx1ZXByaW50RmlsZVwiIG9uQ2xpY2s9e3RoaXMuX29wZW5GaWxlU2VsZWN0aW9ufT48L2lucHV0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cInVpIGljb24gYnV0dG9uIHVwbG9hZEJsdWVwcmludEZpbGVcIiBvbkNsaWNrPXt0aGlzLl9vcGVuRmlsZVNlbGVjdGlvbn0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJhdHRhY2ggaWNvblwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJmaWxlXCIgbmFtZT0nYmx1ZXByaW50RmlsZScgaWQ9XCJibHVlcHJpbnRGaWxlXCIgc3R5bGU9e3tcImRpc3BsYXlcIjogXCJub25lXCJ9fSBvbkNoYW5nZT17dGhpcy5fdXBsb2FkRmlsZUNoYW5nZWR9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiByZXF1aXJlZCBuYW1lPSdibHVlcHJpbnROYW1lJyBpZD0nYmx1ZXByaW50TmFtZScgcGxhY2Vob2xkZXI9XCJCbHVlcHJpbnQgbmFtZVwiIHJlcXVpcmVkLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9J2JsdWVwcmludEZpbGVOYW1lJyBpZD0nYmx1ZXByaW50RmlsZU5hbWUnIHBsYWNlaG9sZGVyPVwiQmx1ZXByaW50IGZpbGVuYW1lIGUuZy4gYmx1ZXByaW50XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIGVycm9yIG1lc3NhZ2VcIiBzdHlsZT17e1wiZGlzcGxheVwiOlwibm9uZVwifX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhlYWRlclwiPk1pc3NpbmcgZGF0YTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+UGxlYXNlIGZpbGwgaW4gYWxsIHRoZSByZXF1aXJlZCBmaWVsZHM8L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnVwbG9hZEVyciA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBlcnJvciBtZXNzYWdlIHVwbG9hZEZhaWxlZFwiIHN0eWxlPXt7XCJkaXNwbGF5XCI6XCJibG9ja1wifX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVhZGVyXCI+RXJyb3IgdXBsb2FkaW5nIGZpbGU8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+e3RoaXMuc3RhdGUudXBsb2FkRXJyfTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPSdzdWJtaXQnIHN0eWxlPXt7XCJkaXNwbGF5XCI6IFwibm9uZVwifX0gY2xhc3NOYW1lPSd1cGxvYWRGb3JtU3VibWl0QnRuJy8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWN0aW9uc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgY2FuY2VsIGJhc2ljIGJ1dHRvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJyZW1vdmUgaWNvblwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2FuY2VsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBvayBncmVlbiAgYnV0dG9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cInVwbG9hZCBpY29uXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBVcGxvYWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH07XG59O1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGtpbm5lcmV0emluIG9uIDA3LzA5LzIwMTYuXG4gKi9cblxuaW1wb3J0IHJlbmRlckJsdWVwcmludHNUYWJsZSBmcm9tICcuL0JsdWVwcmludHNUYWJsZSc7XG5pbXBvcnQgcmVuZGVyVXBsb2FkQmx1ZXByaW50TW9kYWwgZnJvbSAnLi9VcGxvYWRCbHVlcHJpbnRNb2RhbCc7XG5cbnZhciBCbHVlcHJpbnRzVGFibGUgPSBudWxsO1xudmFyIFVwbG9hZE1vZGFsID0gbnVsbDtcblxuYWRkUGx1Z2luKHtcbiAgICBpZDogXCJibHVlcHJpbnRzXCIsXG4gICAgbmFtZTogXCJCbHVlcHJpbnRzIGxpc3RcIixcbiAgICBkZXNjcmlwdGlvbjogJ2JsYWggYmxhaCBibGFoJyxcbiAgICBpbml0aWFsV2lkdGg6IDgsXG4gICAgaW5pdGlhbEhlaWdodDogNSxcbiAgICBjb2xvciA6IFwiYmx1ZVwiLFxuICAgIGlzUmVhY3Q6IHRydWUsXG4gICAgaW5pdDogZnVuY3Rpb24ocGx1Z2luVXRpbHMpIHtcbiAgICAgICAgQmx1ZXByaW50c1RhYmxlID0gcmVuZGVyQmx1ZXByaW50c1RhYmxlKHBsdWdpblV0aWxzKTtcbiAgICAgICAgVXBsb2FkTW9kYWwgPSByZW5kZXJVcGxvYWRCbHVlcHJpbnRNb2RhbChwbHVnaW5VdGlscyk7XG4gICAgfSxcblxuICAgIGZldGNoRGF0YTogZnVuY3Rpb24ocGx1Z2luLGNvbnRleHQscGx1Z2luVXRpbHMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAocmVzb2x2ZSxyZWplY3QpID0+IHtcbiAgICAgICAgICAgIHBsdWdpblV0aWxzLmpRdWVyeS5nZXQoe1xuICAgICAgICAgICAgICAgIHVybDogY29udGV4dC5nZXRNYW5hZ2VyVXJsKCkgKyAnL2FwaS92Mi4xL2JsdWVwcmludHM/X2luY2x1ZGU9aWQsdXBkYXRlZF9hdCxjcmVhdGVkX2F0LGRlc2NyaXB0aW9uLHBsYW4nLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5kb25lKChibHVlcHJpbnRzKT0+IHtcblxuICAgICAgICAgICAgICAgICAgICBwbHVnaW5VdGlscy5qUXVlcnkuZ2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogY29udGV4dC5nZXRNYW5hZ2VyVXJsKCkgKyAnL2FwaS92Mi4xL2RlcGxveW1lbnRzP19pbmNsdWRlPWlkLGJsdWVwcmludF9pZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvbmUoKGRlcGxveW1lbnRzKT0+e1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlcENvdW50ID0gXy5jb3VudEJ5KGRlcGxveW1lbnRzLml0ZW1zLCdibHVlcHJpbnRfaWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDb3VudCBkZXBsb3ltZW50c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uZWFjaChibHVlcHJpbnRzLml0ZW1zLChibHVlcHJpbnQpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsdWVwcmludC5kZXBDb3VudCA9IGRlcENvdW50W2JsdWVwcmludC5pZF0gfHwgMDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShibHVlcHJpbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmFpbChyZWplY3QpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmZhaWwocmVqZWN0KVxuICAgICAgICB9KTtcbiAgICB9LFxuXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKHdpZGdldCxkYXRhLGVycm9yLGNvbnRleHQscGx1Z2luVXRpbHMpIHtcblxuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiBwbHVnaW5VdGlscy5yZW5kZXJSZWFjdExvYWRpbmcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIHBsdWdpblV0aWxzLnJlbmRlclJlYWN0RXJyb3IoZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNlbGVjdGVkQmx1ZXByaW50ID0gY29udGV4dC5nZXRWYWx1ZSgnYmx1ZXByaW50SWQnKTtcbiAgICAgICAgdmFyIGZvcm1hdHRlZERhdGEgPSBPYmplY3QuYXNzaWduKHt9LGRhdGEse1xuICAgICAgICAgICAgaXRlbXM6IF8ubWFwIChkYXRhLml0ZW1zLChpdGVtKT0+e1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LGl0ZW0se1xuICAgICAgICAgICAgICAgICAgICBjcmVhdGVkX2F0OiBwbHVnaW5VdGlscy5tb21lbnQoaXRlbS5jcmVhdGVkX2F0LCdZWVlZLU1NLUREIEhIOm1tOnNzLlNTU1NTJykuZm9ybWF0KCdERC1NTS1ZWVlZIEhIOm1tJyksIC8vMjAxNi0wNy0yMCAwOToxMDo1My4xMDM1NzlcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlZF9hdDogcGx1Z2luVXRpbHMubW9tZW50KGl0ZW0udXBkYXRlZF9hdCwnWVlZWS1NTS1ERCBISDptbTpzcy5TU1NTUycpLmZvcm1hdCgnREQtTU0tWVlZWSBISDptbScpLFxuICAgICAgICAgICAgICAgICAgICBpc1NlbGVjdGVkOiBzZWxlY3RlZEJsdWVwcmludCA9PT0gaXRlbS5pZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8Qmx1ZXByaW50c1RhYmxlIHdpZGdldD17d2lkZ2V0fSBkYXRhPXtmb3JtYXR0ZWREYXRhfSBjb250ZXh0PXtjb250ZXh0fSB1dGlscz17cGx1Z2luVXRpbHN9Lz5cbiAgICAgICAgICAgICAgICA8VXBsb2FkTW9kYWwgd2lkZ2V0PXt3aWRnZXR9IGRhdGE9e2Zvcm1hdHRlZERhdGF9IGNvbnRleHQ9e2NvbnRleHR9IHV0aWxzPXtwbHVnaW5VdGlsc30vPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufSk7Il19
