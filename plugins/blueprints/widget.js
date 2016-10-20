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
        key: '_selectBlueprint',
        value: function _selectBlueprint(item) {
            var oldSelectedBlueprintId = this.props.context.getValue('blueprintId');
            this.props.context.setValue('blueprintId', item.id === oldSelectedBlueprintId ? null : item.id);
        }
    }, {
        key: '_createDeployment',
        value: function _createDeployment(item, event) {
            event.stopPropagation();

            this.props.context.setValue(this.props.widget.id + 'createDeploy', item);
        }
    }, {
        key: '_deleteBlueprintConfirm',
        value: function _deleteBlueprintConfirm(item, event) {
            event.stopPropagation();

            this.setState({
                confirmDelete: true,
                item: item
            });
        }
    }, {
        key: '_deleteBlueprint',
        value: function _deleteBlueprint() {
            if (!this.state.item) {
                this.setState({ error: 'Something went wrong, no blueprint was selected for delete' });
                return;
            }

            var thi$ = this;
            $.ajax({
                url: thi$.props.context.getManagerUrl() + '/api/v2.1/blueprints/' + this.state.item.id,
                "headers": { "content-type": "application/json" },
                method: 'delete'
            }).done(function () {
                thi$.setState({ confirmDelete: false });
                thi$.props.context.getEventBus().trigger('blueprints:refresh');
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
            this.props.context.getEventBus().on('blueprints:refresh', this._refreshData, this);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.props.context.getEventBus().off('blueprints:refresh', this._refreshData);
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
                                        React.createElement('i', { className: 'trash icon link bordered', title: 'Delete blueprint', onClick: _this2._deleteBlueprintConfirm.bind(_this2, item) })
                                    )
                                )
                            );
                        })
                    )
                ),
                React.createElement(Confirm, { title: 'Are you sure you want to remove this blueprint?',
                    show: this.state.confirmDelete,
                    onConfirm: this._deleteBlueprint.bind(this),
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

var _class = function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class(props, context) {
        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props, context));

        _this.state = {
            error: null
        };
        return _this;
    }

    _createClass(_class, [{
        key: 'onApprove',
        value: function onApprove() {
            $(this.refs.submitDeployBtn).click();
            return false;
        }
    }, {
        key: '_deploy',
        value: function _deploy() {
            var _this2 = this;

            var deployItem = this.props.context.getValue(this.props.widget.id + 'createDeploy');

            if (!deployItem) {
                this.setState({ error: 'Blueprint not selected' });
                return false;
            }

            var blueprintId = deployItem.id;
            var deploymentId = $('[name=deploymentName]').val();

            var inputs = {};

            $('[name=deploymentInput]').each(function (index, input) {
                var input = $(input);
                inputs[input.data('name')] = input.val();
            });

            var thi$ = this;
            $.ajax({
                url: thi$.props.context.getManagerUrl() + '/api/v2.1/deployments/' + deploymentId,
                //dataType: 'json',
                "headers": { "content-type": "application/json" },
                method: 'put',
                data: JSON.stringify({
                    'blueprint_id': blueprintId,
                    inputs: inputs
                })
            }).done(function (deployment) {
                thi$.props.context.setValue(_this2.props.widget.id + 'createDeploy', null);

                thi$.props.context.getEventBus().trigger('deployments:refresh');
            }).fail(function (jqXHR, textStatus, errorThrown) {
                thi$.setState({ error: jqXHR.responseJSON && jqXHR.responseJSON.message ? jqXHR.responseJSON.message : errorThrown });
            });

            return false;
        }
    }, {
        key: 'onDeny',
        value: function onDeny() {
            this.props.context.setValue(this.props.widget.id + 'createDeploy', null);
            return true;
        }
    }, {
        key: '_submitDeploy',
        value: function _submitDeploy(e) {
            e.preventDefault();

            this._deploy();

            return false;
        }
    }, {
        key: 'render',
        value: function render() {
            var Modal = Stage.Basic.Modal;
            var Header = Stage.Basic.ModalHeader;
            var Body = Stage.Basic.ModalBody;
            var Footer = Stage.Basic.ModalFooter;

            var deployItem = this.props.context.getValue(this.props.widget.id + 'createDeploy');
            var shouldShow = !_.isEmpty(deployItem);
            deployItem = Object.assign({}, {
                id: '',
                plan: {
                    inputs: {}
                }
            }, deployItem);
            return React.createElement(
                'div',
                null,
                React.createElement(
                    Modal,
                    { show: shouldShow, className: 'deploymentModal', onDeny: this.onDeny.bind(this), onApprove: this.onApprove.bind(this) },
                    React.createElement(
                        Header,
                        null,
                        React.createElement('i', { className: 'rocket icon' }),
                        ' Deploy blueprint ',
                        deployItem.id
                    ),
                    React.createElement(
                        Body,
                        null,
                        React.createElement(
                            'form',
                            { className: 'ui form deployForm', onSubmit: this._submitDeploy.bind(this), action: '' },
                            React.createElement(
                                'div',
                                { className: 'field' },
                                React.createElement('input', { type: 'text', required: true, name: 'deploymentName', placeholder: 'Deployment name' })
                            ),
                            _.map(deployItem.plan.inputs, function (input, name) {
                                return React.createElement(
                                    'div',
                                    { className: 'field', key: name },
                                    React.createElement(
                                        'label',
                                        { title: input.description || name },
                                        name
                                    ),
                                    React.createElement('input', { name: 'deploymentInput', 'data-name': name, type: 'text', defaultValue: input.default })
                                );
                            }),
                            this.state.error ? React.createElement(
                                'div',
                                { className: 'ui error message deployFailed', style: { "display": "block" } },
                                React.createElement(
                                    'div',
                                    { className: 'header' },
                                    'Error deploying blueprint'
                                ),
                                React.createElement(
                                    'p',
                                    null,
                                    this.state.error
                                )
                            ) : '',
                            React.createElement('input', { type: 'submit', style: { "display": "none" }, ref: 'submitDeployBtn' })
                        )
                    ),
                    React.createElement(
                        Footer,
                        null,
                        React.createElement(
                            'div',
                            { className: 'ui cancel basic button' },
                            React.createElement('i', { className: 'remove icon' }),
                            'Cancel'
                        ),
                        React.createElement(
                            'div',
                            { className: 'ui ok green  button' },
                            React.createElement('i', { className: 'rocket icon' }),
                            'Deploy'
                        )
                    )
                )
            );
        }
    }]);

    return _class;
}(React.Component);

exports.default = _class;
;

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
'use strict';

var _BlueprintsTable = require('./BlueprintsTable');

var _BlueprintsTable2 = _interopRequireDefault(_BlueprintsTable);

var _UploadBlueprintModal = require('./UploadBlueprintModal');

var _UploadBlueprintModal2 = _interopRequireDefault(_UploadBlueprintModal);

var _CreateDeploymentModal = require('./CreateDeploymentModal');

var _CreateDeploymentModal2 = _interopRequireDefault(_CreateDeploymentModal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UploadModal = null; /**
                         * Created by kinneretzin on 07/09/2016.
                         */

Stage.addPlugin({
    id: "blueprints",
    name: "Blueprints list",
    description: 'blah blah blah',
    initialWidth: 8,
    initialHeight: 5,
    color: "blue",
    isReact: true,
    init: function init(pluginUtils) {
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
            React.createElement(_BlueprintsTable2.default, { widget: widget, data: formattedData, context: context, utils: pluginUtils }),
            React.createElement(UploadModal, { widget: widget, data: formattedData, context: context, utils: pluginUtils }),
            React.createElement(_CreateDeploymentModal2.default, { widget: widget, data: formattedData, context: context, utils: pluginUtils })
        );
    }
});

},{"./BlueprintsTable":1,"./CreateDeploymentModal":2,"./UploadBlueprintModal":3}]},{},[1,2,3,4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwbHVnaW5zL2JsdWVwcmludHMvc3JjL0JsdWVwcmludHNUYWJsZS5qcyIsInBsdWdpbnMvYmx1ZXByaW50cy9zcmMvQ3JlYXRlRGVwbG95bWVudE1vZGFsLmpzIiwicGx1Z2lucy9ibHVlcHJpbnRzL3NyYy9VcGxvYWRCbHVlcHJpbnRNb2RhbC5qcyIsInBsdWdpbnMvYmx1ZXByaW50cy9zcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7OztBQU1JLG9CQUFZLEtBQVosRUFBa0IsT0FBbEIsRUFBMkI7QUFBQTs7QUFBQSxvSEFDakIsS0FEaUIsRUFDWCxPQURXOztBQUd2QixjQUFLLEtBQUwsR0FBYTtBQUNULDJCQUFjO0FBREwsU0FBYjtBQUh1QjtBQU0xQjs7Ozt5Q0FFaUIsSSxFQUFLO0FBQ25CLGdCQUFJLHlCQUF5QixLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLFFBQW5CLENBQTRCLGFBQTVCLENBQTdCO0FBQ0EsaUJBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsUUFBbkIsQ0FBNEIsYUFBNUIsRUFBMEMsS0FBSyxFQUFMLEtBQVksc0JBQVosR0FBcUMsSUFBckMsR0FBNEMsS0FBSyxFQUEzRjtBQUNIOzs7MENBRWlCLEksRUFBSyxLLEVBQU07QUFDekIsa0JBQU0sZUFBTjs7QUFFQSxpQkFBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixRQUFuQixDQUE0QixLQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLEVBQWxCLEdBQXVCLGNBQW5ELEVBQWtFLElBQWxFO0FBQ0g7OztnREFFdUIsSSxFQUFLLEssRUFBTTtBQUMvQixrQkFBTSxlQUFOOztBQUVBLGlCQUFLLFFBQUwsQ0FBYztBQUNWLCtCQUFnQixJQUROO0FBRVYsc0JBQU07QUFGSSxhQUFkO0FBSUg7OzsyQ0FFa0I7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QVA7QUFDSDs7QUFFRCxZQUFJLEtBQUosRUFBVztBQUNQLG1CQUFPLFlBQVksZ0JBQVosQ0FBNkIsS0FBN0IsQ0FBUDtBQUNIOztBQUVELFlBQUksb0JBQW9CLFFBQVEsUUFBUixDQUFpQixhQUFqQixDQUF4QjtBQUNBLFlBQUksZ0JBQWdCLE9BQU8sTUFBUCxDQUFjLEVBQWQsRUFBaUIsSUFBakIsRUFBc0I7QUFDdEMsbUJBQU8sRUFBRSxHQUFGLENBQU8sS0FBSyxLQUFaLEVBQWtCLFVBQUMsSUFBRCxFQUFRO0FBQzdCLHVCQUFPLE9BQU8sTUFBUCxDQUFjLEVBQWQsRUFBaUIsSUFBakIsRUFBc0I7QUFDekIsZ0NBQVksWUFBWSxNQUFaLENBQW1CLEtBQUssVUFBeEIsRUFBbUMsMkJBQW5DLEVBQWdFLE1BQWhFLENBQXVFLGtCQUF2RSxDQURhLEVBQytFO0FBQ3hHLGdDQUFZLFlBQVksTUFBWixDQUFtQixLQUFLLFVBQXhCLEVBQW1DLDJCQUFuQyxFQUFnRSxNQUFoRSxDQUF1RSxrQkFBdkUsQ0FGYTtBQUd6QixnQ0FBWSxzQkFBc0IsS0FBSztBQUhkLGlCQUF0QixDQUFQO0FBS0gsYUFOTTtBQUQrQixTQUF0QixDQUFwQjs7QUFVQSxlQUNJO0FBQUE7QUFBQTtBQUNJLDZEQUFpQixRQUFRLE1BQXpCLEVBQWlDLE1BQU0sYUFBdkMsRUFBc0QsU0FBUyxPQUEvRCxFQUF3RSxPQUFPLFdBQS9FLEdBREo7QUFFSSxnQ0FBQyxXQUFELElBQWEsUUFBUSxNQUFyQixFQUE2QixNQUFNLGFBQW5DLEVBQWtELFNBQVMsT0FBM0QsRUFBb0UsT0FBTyxXQUEzRSxHQUZKO0FBR0ksbUVBQWEsUUFBUSxNQUFyQixFQUE2QixNQUFNLGFBQW5DLEVBQWtELFNBQVMsT0FBM0QsRUFBb0UsT0FBTyxXQUEzRTtBQUhKLFNBREo7QUFPSDtBQXZFVyxDQUFoQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENyZWF0ZWQgYnkga2lubmVyZXR6aW4gb24gMDIvMTAvMjAxNi5cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcyxjb250ZXh0KSB7XG4gICAgICAgIHN1cGVyKHByb3BzLGNvbnRleHQpO1xuXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBjb25maXJtRGVsZXRlOmZhbHNlXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfc2VsZWN0Qmx1ZXByaW50IChpdGVtKXtcbiAgICAgICAgdmFyIG9sZFNlbGVjdGVkQmx1ZXByaW50SWQgPSB0aGlzLnByb3BzLmNvbnRleHQuZ2V0VmFsdWUoJ2JsdWVwcmludElkJyk7XG4gICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5zZXRWYWx1ZSgnYmx1ZXByaW50SWQnLGl0ZW0uaWQgPT09IG9sZFNlbGVjdGVkQmx1ZXByaW50SWQgPyBudWxsIDogaXRlbS5pZCk7XG4gICAgfVxuXG4gICAgX2NyZWF0ZURlcGxveW1lbnQoaXRlbSxldmVudCl7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5zZXRWYWx1ZSh0aGlzLnByb3BzLndpZGdldC5pZCArICdjcmVhdGVEZXBsb3knLGl0ZW0pO1xuICAgIH1cblxuICAgIF9kZWxldGVCbHVlcHJpbnRDb25maXJtKGl0ZW0sZXZlbnQpe1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGNvbmZpcm1EZWxldGUgOiB0cnVlLFxuICAgICAgICAgICAgaXRlbTogaXRlbVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBfZGVsZXRlQmx1ZXByaW50KCkge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGUuaXRlbSkge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7ZXJyb3I6ICdTb21ldGhpbmcgd2VudCB3cm9uZywgbm8gYmx1ZXByaW50IHdhcyBzZWxlY3RlZCBmb3IgZGVsZXRlJ30pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRoaSQgPSB0aGlzO1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiB0aGkkLnByb3BzLmNvbnRleHQuZ2V0TWFuYWdlclVybCgpICsgJy9hcGkvdjIuMS9ibHVlcHJpbnRzLycrdGhpcy5zdGF0ZS5pdGVtLmlkLFxuICAgICAgICAgICAgXCJoZWFkZXJzXCI6IHtcImNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIn0sXG4gICAgICAgICAgICBtZXRob2Q6ICdkZWxldGUnXG4gICAgICAgIH0pXG4gICAgICAgICAgICAuZG9uZSgoKT0+IHtcbiAgICAgICAgICAgICAgICB0aGkkLnNldFN0YXRlKHtjb25maXJtRGVsZXRlOiBmYWxzZX0pO1xuICAgICAgICAgICAgICAgIHRoaSQucHJvcHMuY29udGV4dC5nZXRFdmVudEJ1cygpLnRyaWdnZXIoJ2JsdWVwcmludHM6cmVmcmVzaCcpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pPT57XG4gICAgICAgICAgICAgICAgdGhpJC5zZXRTdGF0ZSh7Y29uZmlybURlbGV0ZTogZmFsc2V9KTtcbiAgICAgICAgICAgICAgICB0aGkkLnNldFN0YXRlKHtlcnJvcjogKGpxWEhSLnJlc3BvbnNlSlNPTiAmJiBqcVhIUi5yZXNwb25zZUpTT04ubWVzc2FnZSA/IGpxWEhSLnJlc3BvbnNlSlNPTi5tZXNzYWdlIDogZXJyb3JUaHJvd24pfSlcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9yZWZyZXNoRGF0YSgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LnJlZnJlc2goKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LmdldEV2ZW50QnVzKCkub24oJ2JsdWVwcmludHM6cmVmcmVzaCcsdGhpcy5fcmVmcmVzaERhdGEsdGhpcyk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5nZXRFdmVudEJ1cygpLm9mZignYmx1ZXByaW50czpyZWZyZXNoJyx0aGlzLl9yZWZyZXNoRGF0YSk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICB2YXIgQ29uZmlybSA9IFN0YWdlLkJhc2ljLkNvbmZpcm07XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmVycm9yID9cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgZXJyb3IgbWVzc2FnZVwiIHN0eWxlPXt7XCJkaXNwbGF5XCI6XCJibG9ja1wifX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoZWFkZXJcIj5FcnJvciBPY2N1cmVkPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+e3RoaXMuc3RhdGUuZXJyb3J9PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgICAgICAnJ1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJ1aSB2ZXJ5IGNvbXBhY3QgdGFibGUgYmx1ZXByaW50c1RhYmxlXCI+XG4gICAgICAgICAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk5hbWU8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkNyZWF0ZWQ8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlVwZGF0ZWQ8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPiMgRGVwbG95bWVudHM8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPjwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5kYXRhLml0ZW1zLm1hcCgoaXRlbSk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHIga2V5PXtpdGVtLmlkfSBjbGFzc05hbWU9e1wicm93IFwiKyAoaXRlbS5pc1NlbGVjdGVkID8gJ2FjdGl2ZScgOiAnJyl9IG9uQ2xpY2s9e3RoaXMuX3NlbGVjdEJsdWVwcmludC5iaW5kKHRoaXMsaXRlbSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT0nYmx1ZXByaW50TmFtZScgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPntpdGVtLmlkfTwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e2l0ZW0uY3JlYXRlZF9hdH08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPntpdGVtLnVwZGF0ZWRfYXR9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD48ZGl2IGNsYXNzTmFtZT1cInVpIGdyZWVuIGhvcml6b250YWwgbGFiZWxcIj57aXRlbS5kZXBDb3VudH08L2Rpdj48L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93QWN0aW9uc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJyb2NrZXQgaWNvbiBsaW5rIGJvcmRlcmVkXCIgdGl0bGU9XCJDcmVhdGUgZGVwbG95bWVudFwiIG9uQ2xpY2s9e3RoaXMuX2NyZWF0ZURlcGxveW1lbnQuYmluZCh0aGlzLGl0ZW0pfT48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cInRyYXNoIGljb24gbGluayBib3JkZXJlZFwiIHRpdGxlPVwiRGVsZXRlIGJsdWVwcmludFwiIG9uQ2xpY2s9e3RoaXMuX2RlbGV0ZUJsdWVwcmludENvbmZpcm0uYmluZCh0aGlzLGl0ZW0pfT48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgICAgICA8Q29uZmlybSB0aXRsZT0nQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHJlbW92ZSB0aGlzIGJsdWVwcmludD8nXG4gICAgICAgICAgICAgICAgICAgICAgICAgc2hvdz17dGhpcy5zdGF0ZS5jb25maXJtRGVsZXRlfVxuICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ29uZmlybT17dGhpcy5fZGVsZXRlQmx1ZXByaW50LmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgb25DYW5jZWw9eygpPT50aGlzLnNldFN0YXRlKHtjb25maXJtRGVsZXRlIDogZmFsc2V9KX0gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICk7XG4gICAgfVxufTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBraW5uZXJldHppbiBvbiAwNS8xMC8yMDE2LlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzLGNvbnRleHQpIHtcbiAgICAgICAgc3VwZXIocHJvcHMsY29udGV4dCk7XG5cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIGVycm9yOiBudWxsXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkFwcHJvdmUgKCkge1xuICAgICAgICAkKHRoaXMucmVmcy5zdWJtaXREZXBsb3lCdG4pLmNsaWNrKCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBfZGVwbG95KCkge1xuICAgICAgICB2YXIgZGVwbG95SXRlbSA9IHRoaXMucHJvcHMuY29udGV4dC5nZXRWYWx1ZSh0aGlzLnByb3BzLndpZGdldC5pZCArICdjcmVhdGVEZXBsb3knKTtcblxuICAgICAgICBpZiAoIWRlcGxveUl0ZW0pIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2Vycm9yOiAnQmx1ZXByaW50IG5vdCBzZWxlY3RlZCd9KTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBibHVlcHJpbnRJZCA9IGRlcGxveUl0ZW0uaWQ7XG4gICAgICAgIHZhciBkZXBsb3ltZW50SWQgPSAkKCdbbmFtZT1kZXBsb3ltZW50TmFtZV0nKS52YWwoKTtcblxuICAgICAgICB2YXIgaW5wdXRzID0ge307XG5cbiAgICAgICAgJCgnW25hbWU9ZGVwbG95bWVudElucHV0XScpLmVhY2goKGluZGV4LGlucHV0KT0+e1xuICAgICAgICAgICAgdmFyIGlucHV0ID0gJChpbnB1dCk7XG4gICAgICAgICAgICBpbnB1dHNbaW5wdXQuZGF0YSgnbmFtZScpXSA9IGlucHV0LnZhbCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgdGhpJCA9IHRoaXM7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IHRoaSQucHJvcHMuY29udGV4dC5nZXRNYW5hZ2VyVXJsKCkgKyAnL2FwaS92Mi4xL2RlcGxveW1lbnRzLycrZGVwbG95bWVudElkLFxuICAgICAgICAgICAgLy9kYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgXCJoZWFkZXJzXCI6IHtcImNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIn0sXG4gICAgICAgICAgICBtZXRob2Q6ICdwdXQnLFxuICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICdibHVlcHJpbnRfaWQnOiBibHVlcHJpbnRJZCxcbiAgICAgICAgICAgICAgICBpbnB1dHM6IGlucHV0c1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5kb25lKChkZXBsb3ltZW50KT0+IHtcbiAgICAgICAgICAgICAgICB0aGkkLnByb3BzLmNvbnRleHQuc2V0VmFsdWUodGhpcy5wcm9wcy53aWRnZXQuaWQgKyAnY3JlYXRlRGVwbG95JyxudWxsKTtcblxuICAgICAgICAgICAgICAgIHRoaSQucHJvcHMuY29udGV4dC5nZXRFdmVudEJ1cygpLnRyaWdnZXIoJ2RlcGxveW1lbnRzOnJlZnJlc2gnKTtcblxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pPT57XG4gICAgICAgICAgICAgICAgdGhpJC5zZXRTdGF0ZSh7ZXJyb3I6IChqcVhIUi5yZXNwb25zZUpTT04gJiYganFYSFIucmVzcG9uc2VKU09OLm1lc3NhZ2UgPyBqcVhIUi5yZXNwb25zZUpTT04ubWVzc2FnZSA6IGVycm9yVGhyb3duKX0pXG4gICAgICAgICAgICB9KTtcblxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBvbkRlbnkgKCkge1xuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQuc2V0VmFsdWUodGhpcy5wcm9wcy53aWRnZXQuaWQgKyAnY3JlYXRlRGVwbG95JyxudWxsKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgX3N1Ym1pdERlcGxveSAoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgdGhpcy5fZGVwbG95KCk7XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHZhciBNb2RhbCA9IFN0YWdlLkJhc2ljLk1vZGFsO1xuICAgICAgICB2YXIgSGVhZGVyID0gU3RhZ2UuQmFzaWMuTW9kYWxIZWFkZXI7XG4gICAgICAgIHZhciBCb2R5ID0gU3RhZ2UuQmFzaWMuTW9kYWxCb2R5O1xuICAgICAgICB2YXIgRm9vdGVyID0gU3RhZ2UuQmFzaWMuTW9kYWxGb290ZXI7XG5cbiAgICAgICAgdmFyIGRlcGxveUl0ZW0gPSB0aGlzLnByb3BzLmNvbnRleHQuZ2V0VmFsdWUodGhpcy5wcm9wcy53aWRnZXQuaWQgKyAnY3JlYXRlRGVwbG95Jyk7XG4gICAgICAgIHZhciBzaG91bGRTaG93ID0gIV8uaXNFbXB0eShkZXBsb3lJdGVtKTtcbiAgICAgICAgZGVwbG95SXRlbSA9IE9iamVjdC5hc3NpZ24oe30se1xuICAgICAgICAgICAgICAgIGlkOiAnJyxcbiAgICAgICAgICAgICAgICBwbGFuOiB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0czoge31cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGVwbG95SXRlbVxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8TW9kYWwgc2hvdz17c2hvdWxkU2hvd30gY2xhc3NOYW1lPSdkZXBsb3ltZW50TW9kYWwnIG9uRGVueT17dGhpcy5vbkRlbnkuYmluZCh0aGlzKX0gb25BcHByb3ZlPXt0aGlzLm9uQXBwcm92ZS5iaW5kKHRoaXMpfT5cbiAgICAgICAgICAgICAgICAgICAgPEhlYWRlcj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cInJvY2tldCBpY29uXCI+PC9pPiBEZXBsb3kgYmx1ZXByaW50IHtkZXBsb3lJdGVtLmlkfVxuICAgICAgICAgICAgICAgICAgICA8L0hlYWRlcj5cblxuICAgICAgICAgICAgICAgICAgICA8Qm9keT5cbiAgICAgICAgICAgICAgICAgICAgPGZvcm0gY2xhc3NOYW1lPVwidWkgZm9ybSBkZXBsb3lGb3JtXCIgb25TdWJtaXQ9e3RoaXMuX3N1Ym1pdERlcGxveS5iaW5kKHRoaXMpfSBhY3Rpb249XCJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiByZXF1aXJlZCBuYW1lPSdkZXBsb3ltZW50TmFtZScgcGxhY2Vob2xkZXI9XCJEZXBsb3ltZW50IG5hbWVcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8ubWFwKGRlcGxveUl0ZW0ucGxhbi5pbnB1dHMsKGlucHV0LG5hbWUpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkXCIga2V5PXtuYW1lfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgdGl0bGU9e2lucHV0LmRlc2NyaXB0aW9uIHx8IG5hbWUgfT57bmFtZX08L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBuYW1lPSdkZXBsb3ltZW50SW5wdXQnIGRhdGEtbmFtZT17bmFtZX0gdHlwZT1cInRleHRcIiBkZWZhdWx0VmFsdWU9e2lucHV0LmRlZmF1bHR9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmVycm9yID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBlcnJvciBtZXNzYWdlIGRlcGxveUZhaWxlZFwiIHN0eWxlPXt7XCJkaXNwbGF5XCI6XCJibG9ja1wifX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhlYWRlclwiPkVycm9yIGRlcGxveWluZyBibHVlcHJpbnQ8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPnt0aGlzLnN0YXRlLmVycm9yfTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPSdzdWJtaXQnIHN0eWxlPXt7XCJkaXNwbGF5XCI6IFwibm9uZVwifX0gcmVmPSdzdWJtaXREZXBsb3lCdG4nLz5cbiAgICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgICAgICAgICA8L0JvZHk+XG5cbiAgICAgICAgICAgICAgICAgICAgPEZvb3Rlcj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgY2FuY2VsIGJhc2ljIGJ1dHRvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cInJlbW92ZSBpY29uXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENhbmNlbFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIG9rIGdyZWVuICBidXR0b25cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJyb2NrZXQgaWNvblwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBEZXBsb3lcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L0Zvb3Rlcj5cbiAgICAgICAgICAgICAgICA8L01vZGFsPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgKTtcbiAgICB9XG59O1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGtpbm5lcmV0emluIG9uIDA1LzEwLzIwMTYuXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgKHBsdWdpblV0aWxzKT0+IHtcblxuICAgIHJldHVybiBjbGFzcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJvcHMsY29udGV4dCkge1xuICAgICAgICAgICAgc3VwZXIocHJvcHMsY29udGV4dCk7XG5cbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICAgICAgdXBsb2FkRXJyOiBudWxsXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgICAgIHRoaXMuX2luaXRNb2RhbCh0aGlzLnJlZnMubW9kYWxPYmopO1xuICAgICAgICB9XG4gICAgICAgIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICAgICAgICAgIHBsdWdpblV0aWxzLmpRdWVyeSh0aGlzLnJlZnMubW9kYWxPYmopLm1vZGFsKCdyZWZyZXNoJyk7XG4gICAgICAgIH1cbiAgICAgICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgICAgICAgICBwbHVnaW5VdGlscy5qUXVlcnkodGhpcy5yZWZzLm1vZGFsT2JqKS5tb2RhbCgnZGVzdHJveScpO1xuICAgICAgICAgICAgcGx1Z2luVXRpbHMualF1ZXJ5KHRoaXMucmVmcy5tb2RhbE9iaikucmVtb3ZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBfaW5pdE1vZGFsKG1vZGFsT2JqKSB7XG4gICAgICAgICAgICBwbHVnaW5VdGlscy5qUXVlcnkobW9kYWxPYmopLm1vZGFsKHtcbiAgICAgICAgICAgICAgICBjbG9zYWJsZSAgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBvbkRlbnkgICAgOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAvL3dpbmRvdy5hbGVydCgnV2FpdCBub3QgeWV0IScpO1xuICAgICAgICAgICAgICAgICAgICAvL3JldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9uQXBwcm92ZSA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBwbHVnaW5VdGlscy5qUXVlcnkoJy51cGxvYWRGb3JtU3VibWl0QnRuJykuY2xpY2soKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICBfc2hvd01vZGFsKCkge1xuICAgICAgICAgICAgcGx1Z2luVXRpbHMualF1ZXJ5KCcudXBsb2FkQmx1ZXByaW50TW9kYWwnKS5tb2RhbCgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgX29wZW5GaWxlU2VsZWN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHBsdWdpblV0aWxzLmpRdWVyeSgnI2JsdWVwcmludEZpbGUnKS5jbGljaygpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgX3VwbG9hZEZpbGVDaGFuZ2VkKGUpe1xuICAgICAgICAgICAgdmFyIGZ1bGxQYXRoRmlsZU5hbWUgPSBwbHVnaW5VdGlscy5qUXVlcnkoZS5jdXJyZW50VGFyZ2V0KS52YWwoKTtcbiAgICAgICAgICAgIHZhciBmaWxlbmFtZSA9IGZ1bGxQYXRoRmlsZU5hbWUuc3BsaXQoJ1xcXFwnKS5wb3AoKTtcblxuICAgICAgICAgICAgcGx1Z2luVXRpbHMualF1ZXJ5KCdpbnB1dC51cGxvYWRCbHVlcHJpbnRGaWxlJykudmFsKGZpbGVuYW1lKS5hdHRyKCd0aXRsZScsZnVsbFBhdGhGaWxlTmFtZSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIF9zdWJtaXRVcGxvYWQoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICB2YXIgdGhpJCA9IHRoaXM7XG5cbiAgICAgICAgICAgIHZhciBmb3JtT2JqID0gcGx1Z2luVXRpbHMualF1ZXJ5KGUuY3VycmVudFRhcmdldCk7XG5cbiAgICAgICAgICAgIC8vIENsZWFyIGVycm9yc1xuICAgICAgICAgICAgZm9ybU9iai5maW5kKCcuZXJyb3I6bm90KC5tZXNzYWdlKScpLnJlbW92ZUNsYXNzKCdlcnJvcicpO1xuICAgICAgICAgICAgZm9ybU9iai5maW5kKCcudWkuZXJyb3IubWVzc2FnZScpLmhpZGUoKTtcblxuICAgICAgICAgICAgLy8gR2V0IHRoZSBkYXRhXG4gICAgICAgICAgICB2YXIgYmx1ZXByaW50TmFtZSA9IGZvcm1PYmouZmluZChcImlucHV0W25hbWU9J2JsdWVwcmludE5hbWUnXVwiKS52YWwoKTtcbiAgICAgICAgICAgIHZhciBibHVlcHJpbnRGaWxlTmFtZSA9IGZvcm1PYmouZmluZChcImlucHV0W25hbWU9J2JsdWVwcmludEZpbGVOYW1lJ11cIikudmFsKCk7XG4gICAgICAgICAgICB2YXIgYmx1ZXByaW50RmlsZVVybCA9IGZvcm1PYmouZmluZChcImlucHV0W25hbWU9J2JsdWVwcmludEZpbGVVcmwnXVwiKS52YWwoKTtcbiAgICAgICAgICAgIHZhciBmaWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JsdWVwcmludEZpbGUnKS5maWxlc1swXTtcblxuICAgICAgICAgICAgLy8gQ2hlY2sgdGhhdCB3ZSBoYXZlIGFsbCB3ZSBuZWVkXG4gICAgICAgICAgICBpZiAoXy5pc0VtcHR5KGJsdWVwcmludEZpbGVVcmwpICYmICFmaWxlKSB7XG4gICAgICAgICAgICAgICAgZm9ybU9iai5hZGRDbGFzcygnZXJyb3InKTtcbiAgICAgICAgICAgICAgICBmb3JtT2JqLmZpbmQoXCJpbnB1dC51cGxvYWRCbHVlcHJpbnRGaWxlXCIpLnBhcmVudHMoJy5maWVsZCcpLmFkZENsYXNzKCdlcnJvcicpO1xuICAgICAgICAgICAgICAgIGZvcm1PYmouZmluZChcImlucHV0W25hbWU9J2JsdWVwcmludEZpbGVVcmwnXVwiKS5wYXJlbnRzKCcuZmllbGQnKS5hZGRDbGFzcygnZXJyb3InKTtcbiAgICAgICAgICAgICAgICBmb3JtT2JqLmZpbmQoJy51aS5lcnJvci5tZXNzYWdlJykuc2hvdygpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoXy5pc0VtcHR5KGJsdWVwcmludE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgZm9ybU9iai5hZGRDbGFzcygnZXJyb3InKTtcbiAgICAgICAgICAgICAgICBmb3JtT2JqLmZpbmQoXCJpbnB1dFtuYW1lPSdibHVlcHJpbnROYW1lJ11cIikucGFyZW50cygnLmZpZWxkJykuYWRkQ2xhc3MoJ2Vycm9yJyk7XG4gICAgICAgICAgICAgICAgZm9ybU9iai5maW5kKCcudWkuZXJyb3IubWVzc2FnZScpLnNob3coKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRGlzYWxiZSB0aGUgZm9ybVxuICAgICAgICAgICAgZm9ybU9iai5wYXJlbnRzKCcubW9kYWwnKS5maW5kKCcuYWN0aW9ucyAuYnV0dG9uJykuYXR0cignZGlzYWJsZWQnLCdkaXNhYmxlZCcpLmFkZENsYXNzKCdkaXNhYmxlZCBsb2FkaW5nJyk7XG4gICAgICAgICAgICBmb3JtT2JqLmFkZENsYXNzKCdsb2FkaW5nJyk7XG5cbiAgICAgICAgICAgIC8vIENhbGwgdXBsb2FkIG1ldGhvZFxuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgKHhoci51cGxvYWQgfHwgeGhyKS5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZG9uZSA9IGUucG9zaXRpb24gfHwgZS5sb2FkZWRcbiAgICAgICAgICAgICAgICB2YXIgdG90YWwgPSBlLnRvdGFsU2l6ZSB8fCBlLnRvdGFsO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd4aHIgcHJvZ3Jlc3M6ICcgKyBNYXRoLnJvdW5kKGRvbmUvdG90YWwqMTAwKSArICclJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3hociB1cGxvYWQgZXJyb3InLCBlLCB0aGlzLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgdGhpJC5fcHJvY2Vzc1VwbG9hZEVycklmTmVlZGVkKHRoaXMpO1xuICAgICAgICAgICAgICAgIGZvcm1PYmoucGFyZW50cygnLm1vZGFsJykuZmluZCgnLmFjdGlvbnMgLmJ1dHRvbicpLnJlbW92ZUF0dHIoJ2Rpc2FibGVkJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkIGxvYWRpbmcnKTtcbiAgICAgICAgICAgICAgICBmb3JtT2JqLnJlbW92ZUNsYXNzKCdsb2FkaW5nJyk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3hociB1cGxvYWQgY29tcGxldGUnLCBlLCB0aGlzLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgZm9ybU9iai5wYXJlbnRzKCcubW9kYWwnKS5maW5kKCcuYWN0aW9ucyAuYnV0dG9uJykucmVtb3ZlQXR0cignZGlzYWJsZWQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQgbG9hZGluZycpO1xuICAgICAgICAgICAgICAgIGZvcm1PYmoucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKTtcblxuICAgICAgICAgICAgICAgIGlmICghdGhpJC5fcHJvY2Vzc1VwbG9hZEVycklmTmVlZGVkKHRoaXMpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1PYmoucGFyZW50cygnLm1vZGFsJykubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpJC5wcm9wcy5jb250ZXh0LnJlZnJlc2goKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmb3JtT2JqLmZpbmQoJy51aS5lcnJvci5tZXNzYWdlLnVwbG9hZEZhaWxlZCcpLnNob3coKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHhoci5vcGVuKCdwdXQnLHRoaXMucHJvcHMuY29udGV4dC5nZXRNYW5hZ2VyVXJsKCkgK1xuICAgICAgICAgICAgICAgICcvYXBpL3YyLjEvYmx1ZXByaW50cy8nK2JsdWVwcmludE5hbWUgKyAoIV8uaXNFbXB0eShibHVlcHJpbnRGaWxlTmFtZSkgPyAnP2FwcGxpY2F0aW9uX2ZpbGVfbmFtZT0nK2JsdWVwcmludEZpbGVOYW1lKycueWFtbCcgOiAnJykpO1xuICAgICAgICAgICAgeGhyLnNlbmQoZmlsZSk7XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9wcm9jZXNzVXBsb2FkRXJySWZOZWVkZWQoeGhyKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLm1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7dXBsb2FkRXJyOiByZXNwb25zZS5tZXNzYWdlfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyKCdDYW5ub3QgcGFyc2UgdXBsb2FkIHJlc3BvbnNlJyxlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZW5kZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwidWkgbGFiZWxlZCBpY29uIGJ1dHRvbiB1cGxvYWRCbHVlcHJpbnRcIiBvbkNsaWNrPXt0aGlzLl9zaG93TW9kYWx9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwidXBsb2FkIGljb25cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICBVcGxvYWRcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBtb2RhbCB1cGxvYWRCbHVlcHJpbnRNb2RhbFwiIHJlZj0nbW9kYWxPYmonPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoZWFkZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJ1cGxvYWQgaWNvblwiPjwvaT4gVXBsb2FkIGJsdWVwcmludFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtIGNsYXNzTmFtZT1cInVpIGZvcm0gdXBsb2FkRm9ybVwiIG9uU3VibWl0PXt0aGlzLl9zdWJtaXRVcGxvYWQuYmluZCh0aGlzKX0gYWN0aW9uPVwiXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGRzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkIG5pbmUgd2lkZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgbGFiZWxlZCBpbnB1dFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIGxhYmVsXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBodHRwOi8vXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPSdibHVlcHJpbnRGaWxlVXJsJyBwbGFjZWhvbGRlcj1cIkVudGVyIGJsdWVwcmludCB1cmxcIj48L2lucHV0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQgb25lIHdpZGVcIiBzdHlsZT17e1wicG9zaXRpb25cIjpcInJlbGF0aXZlXCJ9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIHZlcnRpY2FsIGRpdmlkZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZCBlaWdodCB3aWRlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBhY3Rpb24gaW5wdXRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgcmVhZE9ubHk9J3RydWUnIHZhbHVlPVwiXCIgY2xhc3NOYW1lPVwidXBsb2FkQmx1ZXByaW50RmlsZVwiIG9uQ2xpY2s9e3RoaXMuX29wZW5GaWxlU2VsZWN0aW9ufT48L2lucHV0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cInVpIGljb24gYnV0dG9uIHVwbG9hZEJsdWVwcmludEZpbGVcIiBvbkNsaWNrPXt0aGlzLl9vcGVuRmlsZVNlbGVjdGlvbn0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJhdHRhY2ggaWNvblwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJmaWxlXCIgbmFtZT0nYmx1ZXByaW50RmlsZScgaWQ9XCJibHVlcHJpbnRGaWxlXCIgc3R5bGU9e3tcImRpc3BsYXlcIjogXCJub25lXCJ9fSBvbkNoYW5nZT17dGhpcy5fdXBsb2FkRmlsZUNoYW5nZWR9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiByZXF1aXJlZCBuYW1lPSdibHVlcHJpbnROYW1lJyBpZD0nYmx1ZXByaW50TmFtZScgcGxhY2Vob2xkZXI9XCJCbHVlcHJpbnQgbmFtZVwiIHJlcXVpcmVkLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9J2JsdWVwcmludEZpbGVOYW1lJyBpZD0nYmx1ZXByaW50RmlsZU5hbWUnIHBsYWNlaG9sZGVyPVwiQmx1ZXByaW50IGZpbGVuYW1lIGUuZy4gYmx1ZXByaW50XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIGVycm9yIG1lc3NhZ2VcIiBzdHlsZT17e1wiZGlzcGxheVwiOlwibm9uZVwifX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhlYWRlclwiPk1pc3NpbmcgZGF0YTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+UGxlYXNlIGZpbGwgaW4gYWxsIHRoZSByZXF1aXJlZCBmaWVsZHM8L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnVwbG9hZEVyciA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBlcnJvciBtZXNzYWdlIHVwbG9hZEZhaWxlZFwiIHN0eWxlPXt7XCJkaXNwbGF5XCI6XCJibG9ja1wifX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVhZGVyXCI+RXJyb3IgdXBsb2FkaW5nIGZpbGU8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+e3RoaXMuc3RhdGUudXBsb2FkRXJyfTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPSdzdWJtaXQnIHN0eWxlPXt7XCJkaXNwbGF5XCI6IFwibm9uZVwifX0gY2xhc3NOYW1lPSd1cGxvYWRGb3JtU3VibWl0QnRuJy8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWN0aW9uc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgY2FuY2VsIGJhc2ljIGJ1dHRvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJyZW1vdmUgaWNvblwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2FuY2VsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBvayBncmVlbiAgYnV0dG9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cInVwbG9hZCBpY29uXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBVcGxvYWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH07XG59O1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGtpbm5lcmV0emluIG9uIDA3LzA5LzIwMTYuXG4gKi9cblxuaW1wb3J0IEJsdWVwcmludHNUYWJsZSBmcm9tICcuL0JsdWVwcmludHNUYWJsZSc7XG5pbXBvcnQgcmVuZGVyVXBsb2FkQmx1ZXByaW50TW9kYWwgZnJvbSAnLi9VcGxvYWRCbHVlcHJpbnRNb2RhbCc7XG5pbXBvcnQgRGVwbG95TW9kYWwgZnJvbSAnLi9DcmVhdGVEZXBsb3ltZW50TW9kYWwnO1xuXG52YXIgVXBsb2FkTW9kYWwgPSBudWxsO1xuXG5TdGFnZS5hZGRQbHVnaW4oe1xuICAgIGlkOiBcImJsdWVwcmludHNcIixcbiAgICBuYW1lOiBcIkJsdWVwcmludHMgbGlzdFwiLFxuICAgIGRlc2NyaXB0aW9uOiAnYmxhaCBibGFoIGJsYWgnLFxuICAgIGluaXRpYWxXaWR0aDogOCxcbiAgICBpbml0aWFsSGVpZ2h0OiA1LFxuICAgIGNvbG9yIDogXCJibHVlXCIsXG4gICAgaW5pdGlhbENvbmZpZ3VyYXRpb246IHtmaWx0ZXJfYnk6IFwiXCJ9LFxuICAgIGlzUmVhY3Q6IHRydWUsXG4gICAgaW5pdDogZnVuY3Rpb24ocGx1Z2luVXRpbHMpIHtcbiAgICAgICAgVXBsb2FkTW9kYWwgPSByZW5kZXJVcGxvYWRCbHVlcHJpbnRNb2RhbChwbHVnaW5VdGlscyk7XG4gICAgfSxcblxuICAgIGZldGNoRGF0YTogZnVuY3Rpb24ocGx1Z2luLGNvbnRleHQscGx1Z2luVXRpbHMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAocmVzb2x2ZSxyZWplY3QpID0+IHtcbiAgICAgICAgICAgIHBsdWdpblV0aWxzLmpRdWVyeS5nZXQoe1xuICAgICAgICAgICAgICAgIHVybDogY29udGV4dC5nZXRNYW5hZ2VyVXJsKCkgKyAnL2FwaS92Mi4xL2JsdWVwcmludHM/X2luY2x1ZGU9aWQsdXBkYXRlZF9hdCxjcmVhdGVkX2F0LGRlc2NyaXB0aW9uLHBsYW4nLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5kb25lKChibHVlcHJpbnRzKT0+IHtcblxuICAgICAgICAgICAgICAgICAgICBwbHVnaW5VdGlscy5qUXVlcnkuZ2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogY29udGV4dC5nZXRNYW5hZ2VyVXJsKCkgKyAnL2FwaS92Mi4xL2RlcGxveW1lbnRzP19pbmNsdWRlPWlkLGJsdWVwcmludF9pZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvbmUoKGRlcGxveW1lbnRzKT0+e1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlcENvdW50ID0gXy5jb3VudEJ5KGRlcGxveW1lbnRzLml0ZW1zLCdibHVlcHJpbnRfaWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDb3VudCBkZXBsb3ltZW50c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uZWFjaChibHVlcHJpbnRzLml0ZW1zLChibHVlcHJpbnQpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsdWVwcmludC5kZXBDb3VudCA9IGRlcENvdW50W2JsdWVwcmludC5pZF0gfHwgMDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShibHVlcHJpbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmFpbChyZWplY3QpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmZhaWwocmVqZWN0KVxuICAgICAgICB9KTtcbiAgICB9LFxuXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKHdpZGdldCxkYXRhLGVycm9yLGNvbnRleHQscGx1Z2luVXRpbHMpIHtcblxuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiBwbHVnaW5VdGlscy5yZW5kZXJSZWFjdExvYWRpbmcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIHBsdWdpblV0aWxzLnJlbmRlclJlYWN0RXJyb3IoZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNlbGVjdGVkQmx1ZXByaW50ID0gY29udGV4dC5nZXRWYWx1ZSgnYmx1ZXByaW50SWQnKTtcbiAgICAgICAgdmFyIGZvcm1hdHRlZERhdGEgPSBPYmplY3QuYXNzaWduKHt9LGRhdGEse1xuICAgICAgICAgICAgaXRlbXM6IF8ubWFwIChkYXRhLml0ZW1zLChpdGVtKT0+e1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LGl0ZW0se1xuICAgICAgICAgICAgICAgICAgICBjcmVhdGVkX2F0OiBwbHVnaW5VdGlscy5tb21lbnQoaXRlbS5jcmVhdGVkX2F0LCdZWVlZLU1NLUREIEhIOm1tOnNzLlNTU1NTJykuZm9ybWF0KCdERC1NTS1ZWVlZIEhIOm1tJyksIC8vMjAxNi0wNy0yMCAwOToxMDo1My4xMDM1NzlcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlZF9hdDogcGx1Z2luVXRpbHMubW9tZW50KGl0ZW0udXBkYXRlZF9hdCwnWVlZWS1NTS1ERCBISDptbTpzcy5TU1NTUycpLmZvcm1hdCgnREQtTU0tWVlZWSBISDptbScpLFxuICAgICAgICAgICAgICAgICAgICBpc1NlbGVjdGVkOiBzZWxlY3RlZEJsdWVwcmludCA9PT0gaXRlbS5pZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8Qmx1ZXByaW50c1RhYmxlIHdpZGdldD17d2lkZ2V0fSBkYXRhPXtmb3JtYXR0ZWREYXRhfSBjb250ZXh0PXtjb250ZXh0fSB1dGlscz17cGx1Z2luVXRpbHN9Lz5cbiAgICAgICAgICAgICAgICA8VXBsb2FkTW9kYWwgd2lkZ2V0PXt3aWRnZXR9IGRhdGE9e2Zvcm1hdHRlZERhdGF9IGNvbnRleHQ9e2NvbnRleHR9IHV0aWxzPXtwbHVnaW5VdGlsc30vPlxuICAgICAgICAgICAgICAgIDxEZXBsb3lNb2RhbCB3aWRnZXQ9e3dpZGdldH0gZGF0YT17Zm9ybWF0dGVkRGF0YX0gY29udGV4dD17Y29udGV4dH0gdXRpbHM9e3BsdWdpblV0aWxzfS8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59KTsiXX0=
