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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwbHVnaW5zL2JsdWVwcmludHMvc3JjL0JsdWVwcmludHNUYWJsZS5qcyIsInBsdWdpbnMvYmx1ZXByaW50cy9zcmMvQ3JlYXRlRGVwbG95bWVudE1vZGFsLmpzIiwicGx1Z2lucy9ibHVlcHJpbnRzL3NyYy9VcGxvYWRCbHVlcHJpbnRNb2RhbC5qcyIsInBsdWdpbnMvYmx1ZXByaW50cy9zcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7OztBQU1JLG9CQUFZLEtBQVosRUFBa0IsT0FBbEIsRUFBMkI7QUFBQTs7QUFBQSxvSEFDakIsS0FEaUIsRUFDWCxPQURXOztBQUd2QixjQUFLLEtBQUwsR0FBYTtBQUNULDJCQUFjO0FBREwsU0FBYjtBQUh1QjtBQU0xQjs7Ozt5Q0FFaUIsSSxFQUFLO0FBQ25CLGdCQUFJLHlCQUF5QixLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLFFBQW5CLENBQTRCLGFBQTVCLENBQTdCO0FBQ0EsaUJBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsUUFBbkIsQ0FBNEIsYUFBNUIsRUFBMEMsS0FBSyxFQUFMLEtBQVksc0JBQVosR0FBcUMsSUFBckMsR0FBNEMsS0FBSyxFQUEzRjtBQUNIOzs7MENBRWlCLEksRUFBSyxLLEVBQU07QUFDekIsa0JBQU0sZUFBTjs7QUFFQSxpQkFBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixRQUFuQixDQUE0QixLQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLEVBQWxCLEdBQXVCLGNBQW5ELEVBQWtFLElBQWxFO0FBQ0g7OztnREFFdUIsSSxFQUFLLEssRUFBTTtBQUMvQixrQkFBTSxlQUFOOztBQUVBLGlCQUFLLFFBQUwsQ0FBYztBQUNWLCtCQUFnQixJQUROO0FBRVYsc0JBQU07QUFGSSxhQUFkO0FBSUg7OzsyQ0FFa0I7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UCxtQkFBTyxZQUFZLGdCQUFaLENBQTZCLEtBQTdCLENBQVA7QUFDSDs7QUFFRCxZQUFJLG9CQUFvQixRQUFRLFFBQVIsQ0FBaUIsYUFBakIsQ0FBeEI7QUFDQSxZQUFJLGdCQUFnQixPQUFPLE1BQVAsQ0FBYyxFQUFkLEVBQWlCLElBQWpCLEVBQXNCO0FBQ3RDLG1CQUFPLEVBQUUsR0FBRixDQUFPLEtBQUssS0FBWixFQUFrQixVQUFDLElBQUQsRUFBUTtBQUM3Qix1QkFBTyxPQUFPLE1BQVAsQ0FBYyxFQUFkLEVBQWlCLElBQWpCLEVBQXNCO0FBQ3pCLGdDQUFZLFlBQVksTUFBWixDQUFtQixLQUFLLFVBQXhCLEVBQW1DLDJCQUFuQyxFQUFnRSxNQUFoRSxDQUF1RSxrQkFBdkUsQ0FEYSxFQUMrRTtBQUN4RyxnQ0FBWSxZQUFZLE1BQVosQ0FBbUIsS0FBSyxVQUF4QixFQUFtQywyQkFBbkMsRUFBZ0UsTUFBaEUsQ0FBdUUsa0JBQXZFLENBRmE7QUFHekIsZ0NBQVksc0JBQXNCLEtBQUs7QUFIZCxpQkFBdEIsQ0FBUDtBQUtILGFBTk07QUFEK0IsU0FBdEIsQ0FBcEI7O0FBVUEsZUFDSTtBQUFBO0FBQUE7QUFDSSw2REFBaUIsUUFBUSxNQUF6QixFQUFpQyxNQUFNLGFBQXZDLEVBQXNELFNBQVMsT0FBL0QsRUFBd0UsT0FBTyxXQUEvRSxHQURKO0FBRUksZ0NBQUMsV0FBRCxJQUFhLFFBQVEsTUFBckIsRUFBNkIsTUFBTSxhQUFuQyxFQUFrRCxTQUFTLE9BQTNELEVBQW9FLE9BQU8sV0FBM0UsR0FGSjtBQUdJLG1FQUFhLFFBQVEsTUFBckIsRUFBNkIsTUFBTSxhQUFuQyxFQUFrRCxTQUFTLE9BQTNELEVBQW9FLE9BQU8sV0FBM0U7QUFISixTQURKO0FBT0g7QUF0RVcsQ0FBaEIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGtpbm5lcmV0emluIG9uIDAyLzEwLzIwMTYuXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMsY29udGV4dCkge1xuICAgICAgICBzdXBlcihwcm9wcyxjb250ZXh0KTtcblxuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgY29uZmlybURlbGV0ZTpmYWxzZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3NlbGVjdEJsdWVwcmludCAoaXRlbSl7XG4gICAgICAgIHZhciBvbGRTZWxlY3RlZEJsdWVwcmludElkID0gdGhpcy5wcm9wcy5jb250ZXh0LmdldFZhbHVlKCdibHVlcHJpbnRJZCcpO1xuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQuc2V0VmFsdWUoJ2JsdWVwcmludElkJyxpdGVtLmlkID09PSBvbGRTZWxlY3RlZEJsdWVwcmludElkID8gbnVsbCA6IGl0ZW0uaWQpO1xuICAgIH1cblxuICAgIF9jcmVhdGVEZXBsb3ltZW50KGl0ZW0sZXZlbnQpe1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQuc2V0VmFsdWUodGhpcy5wcm9wcy53aWRnZXQuaWQgKyAnY3JlYXRlRGVwbG95JyxpdGVtKTtcbiAgICB9XG5cbiAgICBfZGVsZXRlQmx1ZXByaW50Q29uZmlybShpdGVtLGV2ZW50KXtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBjb25maXJtRGVsZXRlIDogdHJ1ZSxcbiAgICAgICAgICAgIGl0ZW06IGl0ZW1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgX2RlbGV0ZUJsdWVwcmludCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLml0ZW0pIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2Vycm9yOiAnU29tZXRoaW5nIHdlbnQgd3JvbmcsIG5vIGJsdWVwcmludCB3YXMgc2VsZWN0ZWQgZm9yIGRlbGV0ZSd9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0aGkkID0gdGhpcztcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogdGhpJC5wcm9wcy5jb250ZXh0LmdldE1hbmFnZXJVcmwoKSArICcvYXBpL3YyLjEvYmx1ZXByaW50cy8nK3RoaXMuc3RhdGUuaXRlbS5pZCxcbiAgICAgICAgICAgIFwiaGVhZGVyc1wiOiB7XCJjb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJ9LFxuICAgICAgICAgICAgbWV0aG9kOiAnZGVsZXRlJ1xuICAgICAgICB9KVxuICAgICAgICAgICAgLmRvbmUoKCk9PiB7XG4gICAgICAgICAgICAgICAgdGhpJC5zZXRTdGF0ZSh7Y29uZmlybURlbGV0ZTogZmFsc2V9KTtcbiAgICAgICAgICAgICAgICB0aGkkLnByb3BzLmNvbnRleHQuZ2V0RXZlbnRCdXMoKS50cmlnZ2VyKCdibHVlcHJpbnRzOnJlZnJlc2gnKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKT0+e1xuICAgICAgICAgICAgICAgIHRoaSQuc2V0U3RhdGUoe2NvbmZpcm1EZWxldGU6IGZhbHNlfSk7XG4gICAgICAgICAgICAgICAgdGhpJC5zZXRTdGF0ZSh7ZXJyb3I6IChqcVhIUi5yZXNwb25zZUpTT04gJiYganFYSFIucmVzcG9uc2VKU09OLm1lc3NhZ2UgPyBqcVhIUi5yZXNwb25zZUpTT04ubWVzc2FnZSA6IGVycm9yVGhyb3duKX0pXG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBfcmVmcmVzaERhdGEoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5yZWZyZXNoKCk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5nZXRFdmVudEJ1cygpLm9uKCdibHVlcHJpbnRzOnJlZnJlc2gnLHRoaXMuX3JlZnJlc2hEYXRhLHRoaXMpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQuZ2V0RXZlbnRCdXMoKS5vZmYoJ2JsdWVwcmludHM6cmVmcmVzaCcsdGhpcy5fcmVmcmVzaERhdGEpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdmFyIENvbmZpcm0gPSBTdGFnZS5CYXNpYy5Db25maXJtO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5lcnJvciA/XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIGVycm9yIG1lc3NhZ2VcIiBzdHlsZT17e1wiZGlzcGxheVwiOlwiYmxvY2tcIn19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVhZGVyXCI+RXJyb3IgT2NjdXJlZDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPnt0aGlzLnN0YXRlLmVycm9yfTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgJydcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPVwidWkgdmVyeSBjb21wYWN0IHRhYmxlIGJsdWVwcmludHNUYWJsZVwiPlxuICAgICAgICAgICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5OYW1lPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5DcmVhdGVkPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5VcGRhdGVkPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD4jIERlcGxveW1lbnRzPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD48L3RoPlxuICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuZGF0YS5pdGVtcy5tYXAoKGl0ZW0pPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyIGtleT17aXRlbS5pZH0gY2xhc3NOYW1lPXtcInJvdyBcIisgKGl0ZW0uaXNTZWxlY3RlZCA/ICdhY3RpdmUnIDogJycpfSBvbkNsaWNrPXt0aGlzLl9zZWxlY3RCbHVlcHJpbnQuYmluZCh0aGlzLGl0ZW0pfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9J2JsdWVwcmludE5hbWUnIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj57aXRlbS5pZH08L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPntpdGVtLmNyZWF0ZWRfYXR9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57aXRlbS51cGRhdGVkX2F0fTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+PGRpdiBjbGFzc05hbWU9XCJ1aSBncmVlbiBob3Jpem9udGFsIGxhYmVsXCI+e2l0ZW0uZGVwQ291bnR9PC9kaXY+PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd0FjdGlvbnNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwicm9ja2V0IGljb24gbGluayBib3JkZXJlZFwiIHRpdGxlPVwiQ3JlYXRlIGRlcGxveW1lbnRcIiBvbkNsaWNrPXt0aGlzLl9jcmVhdGVEZXBsb3ltZW50LmJpbmQodGhpcyxpdGVtKX0+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJ0cmFzaCBpY29uIGxpbmsgYm9yZGVyZWRcIiB0aXRsZT1cIkRlbGV0ZSBibHVlcHJpbnRcIiBvbkNsaWNrPXt0aGlzLl9kZWxldGVCbHVlcHJpbnRDb25maXJtLmJpbmQodGhpcyxpdGVtKX0+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICAgICAgPENvbmZpcm0gdGl0bGU9J0FyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byByZW1vdmUgdGhpcyBibHVlcHJpbnQ/J1xuICAgICAgICAgICAgICAgICAgICAgICAgIHNob3c9e3RoaXMuc3RhdGUuY29uZmlybURlbGV0ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICBvbkNvbmZpcm09e3RoaXMuX2RlbGV0ZUJsdWVwcmludC5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2FuY2VsPXsoKT0+dGhpcy5zZXRTdGF0ZSh7Y29uZmlybURlbGV0ZSA6IGZhbHNlfSl9IC8+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICApO1xuICAgIH1cbn07XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkga2lubmVyZXR6aW4gb24gMDUvMTAvMjAxNi5cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcyxjb250ZXh0KSB7XG4gICAgICAgIHN1cGVyKHByb3BzLGNvbnRleHQpO1xuXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBlcnJvcjogbnVsbFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25BcHByb3ZlICgpIHtcbiAgICAgICAgJCh0aGlzLnJlZnMuc3VibWl0RGVwbG95QnRuKS5jbGljaygpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgX2RlcGxveSgpIHtcbiAgICAgICAgdmFyIGRlcGxveUl0ZW0gPSB0aGlzLnByb3BzLmNvbnRleHQuZ2V0VmFsdWUodGhpcy5wcm9wcy53aWRnZXQuaWQgKyAnY3JlYXRlRGVwbG95Jyk7XG5cbiAgICAgICAgaWYgKCFkZXBsb3lJdGVtKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtlcnJvcjogJ0JsdWVwcmludCBub3Qgc2VsZWN0ZWQnfSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYmx1ZXByaW50SWQgPSBkZXBsb3lJdGVtLmlkO1xuICAgICAgICB2YXIgZGVwbG95bWVudElkID0gJCgnW25hbWU9ZGVwbG95bWVudE5hbWVdJykudmFsKCk7XG5cbiAgICAgICAgdmFyIGlucHV0cyA9IHt9O1xuXG4gICAgICAgICQoJ1tuYW1lPWRlcGxveW1lbnRJbnB1dF0nKS5lYWNoKChpbmRleCxpbnB1dCk9PntcbiAgICAgICAgICAgIHZhciBpbnB1dCA9ICQoaW5wdXQpO1xuICAgICAgICAgICAgaW5wdXRzW2lucHV0LmRhdGEoJ25hbWUnKV0gPSBpbnB1dC52YWwoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIHRoaSQgPSB0aGlzO1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiB0aGkkLnByb3BzLmNvbnRleHQuZ2V0TWFuYWdlclVybCgpICsgJy9hcGkvdjIuMS9kZXBsb3ltZW50cy8nK2RlcGxveW1lbnRJZCxcbiAgICAgICAgICAgIC8vZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgIFwiaGVhZGVyc1wiOiB7XCJjb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJ9LFxuICAgICAgICAgICAgbWV0aG9kOiAncHV0JyxcbiAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAnYmx1ZXByaW50X2lkJzogYmx1ZXByaW50SWQsXG4gICAgICAgICAgICAgICAgaW5wdXRzOiBpbnB1dHNcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICAgICAgICAuZG9uZSgoZGVwbG95bWVudCk9PiB7XG4gICAgICAgICAgICAgICAgdGhpJC5wcm9wcy5jb250ZXh0LnNldFZhbHVlKHRoaXMucHJvcHMud2lkZ2V0LmlkICsgJ2NyZWF0ZURlcGxveScsbnVsbCk7XG5cbiAgICAgICAgICAgICAgICB0aGkkLnByb3BzLmNvbnRleHQuZ2V0RXZlbnRCdXMoKS50cmlnZ2VyKCdkZXBsb3ltZW50czpyZWZyZXNoJyk7XG5cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKT0+e1xuICAgICAgICAgICAgICAgIHRoaSQuc2V0U3RhdGUoe2Vycm9yOiAoanFYSFIucmVzcG9uc2VKU09OICYmIGpxWEhSLnJlc3BvbnNlSlNPTi5tZXNzYWdlID8ganFYSFIucmVzcG9uc2VKU09OLm1lc3NhZ2UgOiBlcnJvclRocm93bil9KVxuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgb25EZW55ICgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LnNldFZhbHVlKHRoaXMucHJvcHMud2lkZ2V0LmlkICsgJ2NyZWF0ZURlcGxveScsbnVsbCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIF9zdWJtaXREZXBsb3kgKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHRoaXMuX2RlcGxveSgpO1xuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmVuZGVyKCkge1xuICAgICAgICB2YXIgTW9kYWwgPSBTdGFnZS5CYXNpYy5Nb2RhbDtcbiAgICAgICAgdmFyIEhlYWRlciA9IFN0YWdlLkJhc2ljLk1vZGFsSGVhZGVyO1xuICAgICAgICB2YXIgQm9keSA9IFN0YWdlLkJhc2ljLk1vZGFsQm9keTtcbiAgICAgICAgdmFyIEZvb3RlciA9IFN0YWdlLkJhc2ljLk1vZGFsRm9vdGVyO1xuXG4gICAgICAgIHZhciBkZXBsb3lJdGVtID0gdGhpcy5wcm9wcy5jb250ZXh0LmdldFZhbHVlKHRoaXMucHJvcHMud2lkZ2V0LmlkICsgJ2NyZWF0ZURlcGxveScpO1xuICAgICAgICB2YXIgc2hvdWxkU2hvdyA9ICFfLmlzRW1wdHkoZGVwbG95SXRlbSk7XG4gICAgICAgIGRlcGxveUl0ZW0gPSBPYmplY3QuYXNzaWduKHt9LHtcbiAgICAgICAgICAgICAgICBpZDogJycsXG4gICAgICAgICAgICAgICAgcGxhbjoge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dHM6IHt9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlcGxveUl0ZW1cbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPE1vZGFsIHNob3c9e3Nob3VsZFNob3d9IGNsYXNzTmFtZT0nZGVwbG95bWVudE1vZGFsJyBvbkRlbnk9e3RoaXMub25EZW55LmJpbmQodGhpcyl9IG9uQXBwcm92ZT17dGhpcy5vbkFwcHJvdmUuYmluZCh0aGlzKX0+XG4gICAgICAgICAgICAgICAgICAgIDxIZWFkZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJyb2NrZXQgaWNvblwiPjwvaT4gRGVwbG95IGJsdWVwcmludCB7ZGVwbG95SXRlbS5pZH1cbiAgICAgICAgICAgICAgICAgICAgPC9IZWFkZXI+XG5cbiAgICAgICAgICAgICAgICAgICAgPEJvZHk+XG4gICAgICAgICAgICAgICAgICAgIDxmb3JtIGNsYXNzTmFtZT1cInVpIGZvcm0gZGVwbG95Rm9ybVwiIG9uU3VibWl0PXt0aGlzLl9zdWJtaXREZXBsb3kuYmluZCh0aGlzKX0gYWN0aW9uPVwiXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgcmVxdWlyZWQgbmFtZT0nZGVwbG95bWVudE5hbWUnIHBsYWNlaG9sZGVyPVwiRGVwbG95bWVudCBuYW1lXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLm1hcChkZXBsb3lJdGVtLnBsYW4uaW5wdXRzLChpbnB1dCxuYW1lKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZFwiIGtleT17bmFtZX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHRpdGxlPXtpbnB1dC5kZXNjcmlwdGlvbiB8fCBuYW1lIH0+e25hbWV9PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgbmFtZT0nZGVwbG95bWVudElucHV0JyBkYXRhLW5hbWU9e25hbWV9IHR5cGU9XCJ0ZXh0XCIgZGVmYXVsdFZhbHVlPXtpbnB1dC5kZWZhdWx0fS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5lcnJvciA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgZXJyb3IgbWVzc2FnZSBkZXBsb3lGYWlsZWRcIiBzdHlsZT17e1wiZGlzcGxheVwiOlwiYmxvY2tcIn19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoZWFkZXJcIj5FcnJvciBkZXBsb3lpbmcgYmx1ZXByaW50PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD57dGhpcy5zdGF0ZS5lcnJvcn08L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT0nc3VibWl0JyBzdHlsZT17e1wiZGlzcGxheVwiOiBcIm5vbmVcIn19IHJlZj0nc3VibWl0RGVwbG95QnRuJy8+XG4gICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgICAgICAgICAgPC9Cb2R5PlxuXG4gICAgICAgICAgICAgICAgICAgIDxGb290ZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIGNhbmNlbCBiYXNpYyBidXR0b25cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJyZW1vdmUgaWNvblwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDYW5jZWxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBvayBncmVlbiAgYnV0dG9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwicm9ja2V0IGljb25cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRGVwbG95XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9Gb290ZXI+XG4gICAgICAgICAgICAgICAgPC9Nb2RhbD5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICk7XG4gICAgfVxufTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBraW5uZXJldHppbiBvbiAwNS8xMC8yMDE2LlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IChwbHVnaW5VdGlscyk9PiB7XG5cbiAgICByZXR1cm4gY2xhc3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByb3BzLGNvbnRleHQpIHtcbiAgICAgICAgICAgIHN1cGVyKHByb3BzLGNvbnRleHQpO1xuXG4gICAgICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgICAgIHVwbG9hZEVycjogbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgICAgICB0aGlzLl9pbml0TW9kYWwodGhpcy5yZWZzLm1vZGFsT2JqKTtcbiAgICAgICAgfVxuICAgICAgICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgICAgICAgICBwbHVnaW5VdGlscy5qUXVlcnkodGhpcy5yZWZzLm1vZGFsT2JqKS5tb2RhbCgncmVmcmVzaCcpO1xuICAgICAgICB9XG4gICAgICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgICAgICAgcGx1Z2luVXRpbHMualF1ZXJ5KHRoaXMucmVmcy5tb2RhbE9iaikubW9kYWwoJ2Rlc3Ryb3knKTtcbiAgICAgICAgICAgIHBsdWdpblV0aWxzLmpRdWVyeSh0aGlzLnJlZnMubW9kYWxPYmopLnJlbW92ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgX2luaXRNb2RhbChtb2RhbE9iaikge1xuICAgICAgICAgICAgcGx1Z2luVXRpbHMualF1ZXJ5KG1vZGFsT2JqKS5tb2RhbCh7XG4gICAgICAgICAgICAgICAgY2xvc2FibGUgIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgb25EZW55ICAgIDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgLy93aW5kb3cuYWxlcnQoJ1dhaXQgbm90IHlldCEnKTtcbiAgICAgICAgICAgICAgICAgICAgLy9yZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvbkFwcHJvdmUgOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcGx1Z2luVXRpbHMualF1ZXJ5KCcudXBsb2FkRm9ybVN1Ym1pdEJ0bicpLmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgX3Nob3dNb2RhbCgpIHtcbiAgICAgICAgICAgIHBsdWdpblV0aWxzLmpRdWVyeSgnLnVwbG9hZEJsdWVwcmludE1vZGFsJykubW9kYWwoJ3Nob3cnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9vcGVuRmlsZVNlbGVjdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBwbHVnaW5VdGlscy5qUXVlcnkoJyNibHVlcHJpbnRGaWxlJykuY2xpY2soKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIF91cGxvYWRGaWxlQ2hhbmdlZChlKXtcbiAgICAgICAgICAgIHZhciBmdWxsUGF0aEZpbGVOYW1lID0gcGx1Z2luVXRpbHMualF1ZXJ5KGUuY3VycmVudFRhcmdldCkudmFsKCk7XG4gICAgICAgICAgICB2YXIgZmlsZW5hbWUgPSBmdWxsUGF0aEZpbGVOYW1lLnNwbGl0KCdcXFxcJykucG9wKCk7XG5cbiAgICAgICAgICAgIHBsdWdpblV0aWxzLmpRdWVyeSgnaW5wdXQudXBsb2FkQmx1ZXByaW50RmlsZScpLnZhbChmaWxlbmFtZSkuYXR0cigndGl0bGUnLGZ1bGxQYXRoRmlsZU5hbWUpO1xuXG4gICAgICAgIH1cblxuICAgICAgICBfc3VibWl0VXBsb2FkKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgdmFyIHRoaSQgPSB0aGlzO1xuXG4gICAgICAgICAgICB2YXIgZm9ybU9iaiA9IHBsdWdpblV0aWxzLmpRdWVyeShlLmN1cnJlbnRUYXJnZXQpO1xuXG4gICAgICAgICAgICAvLyBDbGVhciBlcnJvcnNcbiAgICAgICAgICAgIGZvcm1PYmouZmluZCgnLmVycm9yOm5vdCgubWVzc2FnZSknKS5yZW1vdmVDbGFzcygnZXJyb3InKTtcbiAgICAgICAgICAgIGZvcm1PYmouZmluZCgnLnVpLmVycm9yLm1lc3NhZ2UnKS5oaWRlKCk7XG5cbiAgICAgICAgICAgIC8vIEdldCB0aGUgZGF0YVxuICAgICAgICAgICAgdmFyIGJsdWVwcmludE5hbWUgPSBmb3JtT2JqLmZpbmQoXCJpbnB1dFtuYW1lPSdibHVlcHJpbnROYW1lJ11cIikudmFsKCk7XG4gICAgICAgICAgICB2YXIgYmx1ZXByaW50RmlsZU5hbWUgPSBmb3JtT2JqLmZpbmQoXCJpbnB1dFtuYW1lPSdibHVlcHJpbnRGaWxlTmFtZSddXCIpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIGJsdWVwcmludEZpbGVVcmwgPSBmb3JtT2JqLmZpbmQoXCJpbnB1dFtuYW1lPSdibHVlcHJpbnRGaWxlVXJsJ11cIikudmFsKCk7XG4gICAgICAgICAgICB2YXIgZmlsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdibHVlcHJpbnRGaWxlJykuZmlsZXNbMF07XG5cbiAgICAgICAgICAgIC8vIENoZWNrIHRoYXQgd2UgaGF2ZSBhbGwgd2UgbmVlZFxuICAgICAgICAgICAgaWYgKF8uaXNFbXB0eShibHVlcHJpbnRGaWxlVXJsKSAmJiAhZmlsZSkge1xuICAgICAgICAgICAgICAgIGZvcm1PYmouYWRkQ2xhc3MoJ2Vycm9yJyk7XG4gICAgICAgICAgICAgICAgZm9ybU9iai5maW5kKFwiaW5wdXQudXBsb2FkQmx1ZXByaW50RmlsZVwiKS5wYXJlbnRzKCcuZmllbGQnKS5hZGRDbGFzcygnZXJyb3InKTtcbiAgICAgICAgICAgICAgICBmb3JtT2JqLmZpbmQoXCJpbnB1dFtuYW1lPSdibHVlcHJpbnRGaWxlVXJsJ11cIikucGFyZW50cygnLmZpZWxkJykuYWRkQ2xhc3MoJ2Vycm9yJyk7XG4gICAgICAgICAgICAgICAgZm9ybU9iai5maW5kKCcudWkuZXJyb3IubWVzc2FnZScpLnNob3coKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKF8uaXNFbXB0eShibHVlcHJpbnROYW1lKSkge1xuICAgICAgICAgICAgICAgIGZvcm1PYmouYWRkQ2xhc3MoJ2Vycm9yJyk7XG4gICAgICAgICAgICAgICAgZm9ybU9iai5maW5kKFwiaW5wdXRbbmFtZT0nYmx1ZXByaW50TmFtZSddXCIpLnBhcmVudHMoJy5maWVsZCcpLmFkZENsYXNzKCdlcnJvcicpO1xuICAgICAgICAgICAgICAgIGZvcm1PYmouZmluZCgnLnVpLmVycm9yLm1lc3NhZ2UnKS5zaG93KCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIERpc2FsYmUgdGhlIGZvcm1cbiAgICAgICAgICAgIGZvcm1PYmoucGFyZW50cygnLm1vZGFsJykuZmluZCgnLmFjdGlvbnMgLmJ1dHRvbicpLmF0dHIoJ2Rpc2FibGVkJywnZGlzYWJsZWQnKS5hZGRDbGFzcygnZGlzYWJsZWQgbG9hZGluZycpO1xuICAgICAgICAgICAgZm9ybU9iai5hZGRDbGFzcygnbG9hZGluZycpO1xuXG4gICAgICAgICAgICAvLyBDYWxsIHVwbG9hZCBtZXRob2RcbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgICh4aHIudXBsb2FkIHx8IHhocikuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRvbmUgPSBlLnBvc2l0aW9uIHx8IGUubG9hZGVkXG4gICAgICAgICAgICAgICAgdmFyIHRvdGFsID0gZS50b3RhbFNpemUgfHwgZS50b3RhbDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygneGhyIHByb2dyZXNzOiAnICsgTWF0aC5yb3VuZChkb25lL3RvdGFsKjEwMCkgKyAnJScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd4aHIgdXBsb2FkIGVycm9yJywgZSwgdGhpcy5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgIHRoaSQuX3Byb2Nlc3NVcGxvYWRFcnJJZk5lZWRlZCh0aGlzKTtcbiAgICAgICAgICAgICAgICBmb3JtT2JqLnBhcmVudHMoJy5tb2RhbCcpLmZpbmQoJy5hY3Rpb25zIC5idXR0b24nKS5yZW1vdmVBdHRyKCdkaXNhYmxlZCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCBsb2FkaW5nJyk7XG4gICAgICAgICAgICAgICAgZm9ybU9iai5yZW1vdmVDbGFzcygnbG9hZGluZycpO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd4aHIgdXBsb2FkIGNvbXBsZXRlJywgZSwgdGhpcy5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgIGZvcm1PYmoucGFyZW50cygnLm1vZGFsJykuZmluZCgnLmFjdGlvbnMgLmJ1dHRvbicpLnJlbW92ZUF0dHIoJ2Rpc2FibGVkJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkIGxvYWRpbmcnKTtcbiAgICAgICAgICAgICAgICBmb3JtT2JqLnJlbW92ZUNsYXNzKCdsb2FkaW5nJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXRoaSQuX3Byb2Nlc3NVcGxvYWRFcnJJZk5lZWRlZCh0aGlzKSkge1xuICAgICAgICAgICAgICAgICAgICBmb3JtT2JqLnBhcmVudHMoJy5tb2RhbCcpLm1vZGFsKCdoaWRlJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaSQucHJvcHMuY29udGV4dC5yZWZyZXNoKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZm9ybU9iai5maW5kKCcudWkuZXJyb3IubWVzc2FnZS51cGxvYWRGYWlsZWQnKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB4aHIub3BlbigncHV0Jyx0aGlzLnByb3BzLmNvbnRleHQuZ2V0TWFuYWdlclVybCgpICtcbiAgICAgICAgICAgICAgICAnL2FwaS92Mi4xL2JsdWVwcmludHMvJytibHVlcHJpbnROYW1lICsgKCFfLmlzRW1wdHkoYmx1ZXByaW50RmlsZU5hbWUpID8gJz9hcHBsaWNhdGlvbl9maWxlX25hbWU9JytibHVlcHJpbnRGaWxlTmFtZSsnLnlhbWwnIDogJycpKTtcbiAgICAgICAgICAgIHhoci5zZW5kKGZpbGUpO1xuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBfcHJvY2Vzc1VwbG9hZEVycklmTmVlZGVkKHhocikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5tZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3VwbG9hZEVycjogcmVzcG9uc2UubWVzc2FnZX0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycignQ2Fubm90IHBhcnNlIHVwbG9hZCByZXNwb25zZScsZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cInVpIGxhYmVsZWQgaWNvbiBidXR0b24gdXBsb2FkQmx1ZXByaW50XCIgb25DbGljaz17dGhpcy5fc2hvd01vZGFsfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cInVwbG9hZCBpY29uXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgVXBsb2FkXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgbW9kYWwgdXBsb2FkQmx1ZXByaW50TW9kYWxcIiByZWY9J21vZGFsT2JqJz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwidXBsb2FkIGljb25cIj48L2k+IFVwbG9hZCBibHVlcHJpbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybSBjbGFzc05hbWU9XCJ1aSBmb3JtIHVwbG9hZEZvcm1cIiBvblN1Ym1pdD17dGhpcy5fc3VibWl0VXBsb2FkLmJpbmQodGhpcyl9IGFjdGlvbj1cIlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZCBuaW5lIHdpZGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIGxhYmVsZWQgaW5wdXRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBsYWJlbFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaHR0cDovL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT0nYmx1ZXByaW50RmlsZVVybCcgcGxhY2Vob2xkZXI9XCJFbnRlciBibHVlcHJpbnQgdXJsXCI+PC9pbnB1dD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkIG9uZSB3aWRlXCIgc3R5bGU9e3tcInBvc2l0aW9uXCI6XCJyZWxhdGl2ZVwifX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSB2ZXJ0aWNhbCBkaXZpZGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQgZWlnaHQgd2lkZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgYWN0aW9uIGlucHV0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHJlYWRPbmx5PSd0cnVlJyB2YWx1ZT1cIlwiIGNsYXNzTmFtZT1cInVwbG9hZEJsdWVwcmludEZpbGVcIiBvbkNsaWNrPXt0aGlzLl9vcGVuRmlsZVNlbGVjdGlvbn0+PC9pbnB1dD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJ1aSBpY29uIGJ1dHRvbiB1cGxvYWRCbHVlcHJpbnRGaWxlXCIgb25DbGljaz17dGhpcy5fb3BlbkZpbGVTZWxlY3Rpb259PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiYXR0YWNoIGljb25cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiIG5hbWU9J2JsdWVwcmludEZpbGUnIGlkPVwiYmx1ZXByaW50RmlsZVwiIHN0eWxlPXt7XCJkaXNwbGF5XCI6IFwibm9uZVwifX0gb25DaGFuZ2U9e3RoaXMuX3VwbG9hZEZpbGVDaGFuZ2VkfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgcmVxdWlyZWQgbmFtZT0nYmx1ZXByaW50TmFtZScgaWQ9J2JsdWVwcmludE5hbWUnIHBsYWNlaG9sZGVyPVwiQmx1ZXByaW50IG5hbWVcIiByZXF1aXJlZC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPSdibHVlcHJpbnRGaWxlTmFtZScgaWQ9J2JsdWVwcmludEZpbGVOYW1lJyBwbGFjZWhvbGRlcj1cIkJsdWVwcmludCBmaWxlbmFtZSBlLmcuIGJsdWVwcmludFwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBlcnJvciBtZXNzYWdlXCIgc3R5bGU9e3tcImRpc3BsYXlcIjpcIm5vbmVcIn19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoZWFkZXJcIj5NaXNzaW5nIGRhdGE8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPlBsZWFzZSBmaWxsIGluIGFsbCB0aGUgcmVxdWlyZWQgZmllbGRzPC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS51cGxvYWRFcnIgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgZXJyb3IgbWVzc2FnZSB1cGxvYWRGYWlsZWRcIiBzdHlsZT17e1wiZGlzcGxheVwiOlwiYmxvY2tcIn19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhlYWRlclwiPkVycm9yIHVwbG9hZGluZyBmaWxlPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPnt0aGlzLnN0YXRlLnVwbG9hZEVycn08L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT0nc3VibWl0JyBzdHlsZT17e1wiZGlzcGxheVwiOiBcIm5vbmVcIn19IGNsYXNzTmFtZT0ndXBsb2FkRm9ybVN1Ym1pdEJ0bicvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFjdGlvbnNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIGNhbmNlbCBiYXNpYyBidXR0b25cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwicmVtb3ZlIGljb25cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENhbmNlbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgb2sgZ3JlZW4gIGJ1dHRvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJ1cGxvYWQgaWNvblwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVXBsb2FkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9O1xufTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBraW5uZXJldHppbiBvbiAwNy8wOS8yMDE2LlxuICovXG5cbmltcG9ydCBCbHVlcHJpbnRzVGFibGUgZnJvbSAnLi9CbHVlcHJpbnRzVGFibGUnO1xuaW1wb3J0IHJlbmRlclVwbG9hZEJsdWVwcmludE1vZGFsIGZyb20gJy4vVXBsb2FkQmx1ZXByaW50TW9kYWwnO1xuaW1wb3J0IERlcGxveU1vZGFsIGZyb20gJy4vQ3JlYXRlRGVwbG95bWVudE1vZGFsJztcblxudmFyIFVwbG9hZE1vZGFsID0gbnVsbDtcblxuU3RhZ2UuYWRkUGx1Z2luKHtcbiAgICBpZDogXCJibHVlcHJpbnRzXCIsXG4gICAgbmFtZTogXCJCbHVlcHJpbnRzIGxpc3RcIixcbiAgICBkZXNjcmlwdGlvbjogJ2JsYWggYmxhaCBibGFoJyxcbiAgICBpbml0aWFsV2lkdGg6IDgsXG4gICAgaW5pdGlhbEhlaWdodDogNSxcbiAgICBjb2xvciA6IFwiYmx1ZVwiLFxuICAgIGlzUmVhY3Q6IHRydWUsXG4gICAgaW5pdDogZnVuY3Rpb24ocGx1Z2luVXRpbHMpIHtcbiAgICAgICAgVXBsb2FkTW9kYWwgPSByZW5kZXJVcGxvYWRCbHVlcHJpbnRNb2RhbChwbHVnaW5VdGlscyk7XG4gICAgfSxcblxuICAgIGZldGNoRGF0YTogZnVuY3Rpb24ocGx1Z2luLGNvbnRleHQscGx1Z2luVXRpbHMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAocmVzb2x2ZSxyZWplY3QpID0+IHtcbiAgICAgICAgICAgIHBsdWdpblV0aWxzLmpRdWVyeS5nZXQoe1xuICAgICAgICAgICAgICAgIHVybDogY29udGV4dC5nZXRNYW5hZ2VyVXJsKCkgKyAnL2FwaS92Mi4xL2JsdWVwcmludHM/X2luY2x1ZGU9aWQsdXBkYXRlZF9hdCxjcmVhdGVkX2F0LGRlc2NyaXB0aW9uLHBsYW4nLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5kb25lKChibHVlcHJpbnRzKT0+IHtcblxuICAgICAgICAgICAgICAgICAgICBwbHVnaW5VdGlscy5qUXVlcnkuZ2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogY29udGV4dC5nZXRNYW5hZ2VyVXJsKCkgKyAnL2FwaS92Mi4xL2RlcGxveW1lbnRzP19pbmNsdWRlPWlkLGJsdWVwcmludF9pZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvbmUoKGRlcGxveW1lbnRzKT0+e1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlcENvdW50ID0gXy5jb3VudEJ5KGRlcGxveW1lbnRzLml0ZW1zLCdibHVlcHJpbnRfaWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDb3VudCBkZXBsb3ltZW50c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uZWFjaChibHVlcHJpbnRzLml0ZW1zLChibHVlcHJpbnQpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsdWVwcmludC5kZXBDb3VudCA9IGRlcENvdW50W2JsdWVwcmludC5pZF0gfHwgMDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShibHVlcHJpbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmFpbChyZWplY3QpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmZhaWwocmVqZWN0KVxuICAgICAgICB9KTtcbiAgICB9LFxuXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKHdpZGdldCxkYXRhLGVycm9yLGNvbnRleHQscGx1Z2luVXRpbHMpIHtcblxuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiBwbHVnaW5VdGlscy5yZW5kZXJSZWFjdExvYWRpbmcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIHBsdWdpblV0aWxzLnJlbmRlclJlYWN0RXJyb3IoZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNlbGVjdGVkQmx1ZXByaW50ID0gY29udGV4dC5nZXRWYWx1ZSgnYmx1ZXByaW50SWQnKTtcbiAgICAgICAgdmFyIGZvcm1hdHRlZERhdGEgPSBPYmplY3QuYXNzaWduKHt9LGRhdGEse1xuICAgICAgICAgICAgaXRlbXM6IF8ubWFwIChkYXRhLml0ZW1zLChpdGVtKT0+e1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LGl0ZW0se1xuICAgICAgICAgICAgICAgICAgICBjcmVhdGVkX2F0OiBwbHVnaW5VdGlscy5tb21lbnQoaXRlbS5jcmVhdGVkX2F0LCdZWVlZLU1NLUREIEhIOm1tOnNzLlNTU1NTJykuZm9ybWF0KCdERC1NTS1ZWVlZIEhIOm1tJyksIC8vMjAxNi0wNy0yMCAwOToxMDo1My4xMDM1NzlcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlZF9hdDogcGx1Z2luVXRpbHMubW9tZW50KGl0ZW0udXBkYXRlZF9hdCwnWVlZWS1NTS1ERCBISDptbTpzcy5TU1NTUycpLmZvcm1hdCgnREQtTU0tWVlZWSBISDptbScpLFxuICAgICAgICAgICAgICAgICAgICBpc1NlbGVjdGVkOiBzZWxlY3RlZEJsdWVwcmludCA9PT0gaXRlbS5pZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8Qmx1ZXByaW50c1RhYmxlIHdpZGdldD17d2lkZ2V0fSBkYXRhPXtmb3JtYXR0ZWREYXRhfSBjb250ZXh0PXtjb250ZXh0fSB1dGlscz17cGx1Z2luVXRpbHN9Lz5cbiAgICAgICAgICAgICAgICA8VXBsb2FkTW9kYWwgd2lkZ2V0PXt3aWRnZXR9IGRhdGE9e2Zvcm1hdHRlZERhdGF9IGNvbnRleHQ9e2NvbnRleHR9IHV0aWxzPXtwbHVnaW5VdGlsc30vPlxuICAgICAgICAgICAgICAgIDxEZXBsb3lNb2RhbCB3aWRnZXQ9e3dpZGdldH0gZGF0YT17Zm9ybWF0dGVkRGF0YX0gY29udGV4dD17Y29udGV4dH0gdXRpbHM9e3BsdWdpblV0aWxzfS8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59KTsiXX0=
