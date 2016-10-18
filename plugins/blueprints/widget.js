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
                this.setState({ error: 'Something went wrong, no selected item for delete' });
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

                thi$.props.context.getEventBus().trigger('deployment:refresh');
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
    initialConfiguration: { filter_by: "" },
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

},{"./BlueprintsTable":1,"./CreateDeploymentModal":2,"./UploadBlueprintModal":3}]},{},[1,4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwbHVnaW5zL2JsdWVwcmludHMvc3JjL0JsdWVwcmludHNUYWJsZS5qcyIsInBsdWdpbnMvYmx1ZXByaW50cy9zcmMvQ3JlYXRlRGVwbG95bWVudE1vZGFsLmpzIiwicGx1Z2lucy9ibHVlcHJpbnRzL3NyYy9VcGxvYWRCbHVlcHJpbnRNb2RhbC5qcyIsInBsdWdpbnMvYmx1ZXByaW50cy9zcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7OztBQU1JLG9CQUFZLEtBQVosRUFBa0IsT0FBbEIsRUFBMkI7QUFBQTs7QUFBQSxvSEFDakIsS0FEaUIsRUFDWCxPQURXOztBQUd2QixjQUFLLEtBQUwsR0FBYTtBQUNULDJCQUFjO0FBREwsU0FBYjtBQUh1QjtBQU0xQjs7Ozt5Q0FFaUIsSSxFQUFLO0FBQ25CLGdCQUFJLHlCQUF5QixLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLFFBQW5CLENBQTRCLGFBQTVCLENBQTdCO0FBQ0EsaUJBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsUUFBbkIsQ0FBNEIsYUFBNUIsRUFBMEMsS0FBSyxFQUFMLEtBQVksc0JBQVosR0FBcUMsSUFBckMsR0FBNEMsS0FBSyxFQUEzRjtBQUNIOzs7MENBRWlCLEksRUFBSyxLLEVBQU07QUFDekIsa0JBQU0sZUFBTjs7QUFFQSxpQkFBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixRQUFuQixDQUE0QixLQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLEVBQWxCLEdBQXVCLGNBQW5ELEVBQWtFLElBQWxFO0FBQ0g7OztnREFFdUIsSSxFQUFLLEssRUFBTTtBQUMvQixrQkFBTSxlQUFOOztBQUVBLGlCQUFLLFFBQUwsQ0FBYztBQUNWLCtCQUFnQixJQUROO0FBRVYsc0JBQU07QUFGSSxhQUFkO0FBSUg7OzsyQ0FFa0I7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QVA7QUFDSDs7QUFFRCxZQUFJLEtBQUosRUFBVztBQUNQLG1CQUFPLFlBQVksZ0JBQVosQ0FBNkIsS0FBN0IsQ0FBUDtBQUNIOztBQUVELFlBQUksb0JBQW9CLFFBQVEsUUFBUixDQUFpQixhQUFqQixDQUF4QjtBQUNBLFlBQUksZ0JBQWdCLE9BQU8sTUFBUCxDQUFjLEVBQWQsRUFBaUIsSUFBakIsRUFBc0I7QUFDdEMsbUJBQU8sRUFBRSxHQUFGLENBQU8sS0FBSyxLQUFaLEVBQWtCLFVBQUMsSUFBRCxFQUFRO0FBQzdCLHVCQUFPLE9BQU8sTUFBUCxDQUFjLEVBQWQsRUFBaUIsSUFBakIsRUFBc0I7QUFDekIsZ0NBQVksWUFBWSxNQUFaLENBQW1CLEtBQUssVUFBeEIsRUFBbUMsMkJBQW5DLEVBQWdFLE1BQWhFLENBQXVFLGtCQUF2RSxDQURhLEVBQytFO0FBQ3hHLGdDQUFZLFlBQVksTUFBWixDQUFtQixLQUFLLFVBQXhCLEVBQW1DLDJCQUFuQyxFQUFnRSxNQUFoRSxDQUF1RSxrQkFBdkUsQ0FGYTtBQUd6QixnQ0FBWSxzQkFBc0IsS0FBSztBQUhkLGlCQUF0QixDQUFQO0FBS0gsYUFOTTtBQUQrQixTQUF0QixDQUFwQjs7QUFVQSxlQUNJO0FBQUE7QUFBQTtBQUNJLDZEQUFpQixRQUFRLE1BQXpCLEVBQWlDLE1BQU0sYUFBdkMsRUFBc0QsU0FBUyxPQUEvRCxFQUF3RSxPQUFPLFdBQS9FLEdBREo7QUFFSSxnQ0FBQyxXQUFELElBQWEsUUFBUSxNQUFyQixFQUE2QixNQUFNLGFBQW5DLEVBQWtELFNBQVMsT0FBM0QsRUFBb0UsT0FBTyxXQUEzRSxHQUZKO0FBR0ksbUVBQWEsUUFBUSxNQUFyQixFQUE2QixNQUFNLGFBQW5DLEVBQWtELFNBQVMsT0FBM0QsRUFBb0UsT0FBTyxXQUEzRTtBQUhKLFNBREo7QUFPSDtBQXZFVyxDQUFoQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENyZWF0ZWQgYnkga2lubmVyZXR6aW4gb24gMDIvMTAvMjAxNi5cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcyxjb250ZXh0KSB7XG4gICAgICAgIHN1cGVyKHByb3BzLGNvbnRleHQpO1xuXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBjb25maXJtRGVsZXRlOmZhbHNlXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfc2VsZWN0Qmx1ZXByaW50IChpdGVtKXtcbiAgICAgICAgdmFyIG9sZFNlbGVjdGVkQmx1ZXByaW50SWQgPSB0aGlzLnByb3BzLmNvbnRleHQuZ2V0VmFsdWUoJ2JsdWVwcmludElkJyk7XG4gICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5zZXRWYWx1ZSgnYmx1ZXByaW50SWQnLGl0ZW0uaWQgPT09IG9sZFNlbGVjdGVkQmx1ZXByaW50SWQgPyBudWxsIDogaXRlbS5pZCk7XG4gICAgfVxuXG4gICAgX2NyZWF0ZURlcGxveW1lbnQoaXRlbSxldmVudCl7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5zZXRWYWx1ZSh0aGlzLnByb3BzLndpZGdldC5pZCArICdjcmVhdGVEZXBsb3knLGl0ZW0pO1xuICAgIH1cblxuICAgIF9kZWxldGVCbHVlcHJpbnRDb25maXJtKGl0ZW0sZXZlbnQpe1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGNvbmZpcm1EZWxldGUgOiB0cnVlLFxuICAgICAgICAgICAgaXRlbTogaXRlbVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBfZGVsZXRlQmx1ZXByaW50KCkge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGUuaXRlbSkge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7ZXJyb3I6ICdTb21ldGhpbmcgd2VudCB3cm9uZywgbm8gc2VsZWN0ZWQgaXRlbSBmb3IgZGVsZXRlJ30pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRoaSQgPSB0aGlzO1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiB0aGkkLnByb3BzLmNvbnRleHQuZ2V0TWFuYWdlclVybCgpICsgJy9hcGkvdjIuMS9ibHVlcHJpbnRzLycrdGhpcy5zdGF0ZS5pdGVtLmlkLFxuICAgICAgICAgICAgXCJoZWFkZXJzXCI6IHtcImNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIn0sXG4gICAgICAgICAgICBtZXRob2Q6ICdkZWxldGUnXG4gICAgICAgIH0pXG4gICAgICAgICAgICAuZG9uZSgoKT0+IHtcbiAgICAgICAgICAgICAgICB0aGkkLnNldFN0YXRlKHtjb25maXJtRGVsZXRlOiBmYWxzZX0pO1xuICAgICAgICAgICAgICAgIHRoaSQucHJvcHMuY29udGV4dC5nZXRFdmVudEJ1cygpLnRyaWdnZXIoJ2JsdWVwcmludHM6cmVmcmVzaCcpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pPT57XG4gICAgICAgICAgICAgICAgdGhpJC5zZXRTdGF0ZSh7Y29uZmlybURlbGV0ZTogZmFsc2V9KTtcbiAgICAgICAgICAgICAgICB0aGkkLnNldFN0YXRlKHtlcnJvcjogKGpxWEhSLnJlc3BvbnNlSlNPTiAmJiBqcVhIUi5yZXNwb25zZUpTT04ubWVzc2FnZSA/IGpxWEhSLnJlc3BvbnNlSlNPTi5tZXNzYWdlIDogZXJyb3JUaHJvd24pfSlcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9yZWZyZXNoRGF0YSgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LnJlZnJlc2goKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LmdldEV2ZW50QnVzKCkub24oJ2JsdWVwcmludHM6cmVmcmVzaCcsdGhpcy5fcmVmcmVzaERhdGEsdGhpcyk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5nZXRFdmVudEJ1cygpLm9mZignYmx1ZXByaW50czpyZWZyZXNoJyx0aGlzLl9yZWZyZXNoRGF0YSk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICB2YXIgQ29uZmlybSA9IFN0YWdlLkJhc2ljLkNvbmZpcm07XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmVycm9yID9cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgZXJyb3IgbWVzc2FnZVwiIHN0eWxlPXt7XCJkaXNwbGF5XCI6XCJibG9ja1wifX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoZWFkZXJcIj5FcnJvciBPY2N1cmVkPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+e3RoaXMuc3RhdGUuZXJyb3J9PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgICAgICAnJ1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJ1aSB2ZXJ5IGNvbXBhY3QgdGFibGUgYmx1ZXByaW50c1RhYmxlXCI+XG4gICAgICAgICAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk5hbWU8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkNyZWF0ZWQ8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlVwZGF0ZWQ8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPiMgRGVwbG95bWVudHM8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPjwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5kYXRhLml0ZW1zLm1hcCgoaXRlbSk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHIga2V5PXtpdGVtLmlkfSBjbGFzc05hbWU9e1wicm93IFwiKyAoaXRlbS5pc1NlbGVjdGVkID8gJ2FjdGl2ZScgOiAnJyl9IG9uQ2xpY2s9e3RoaXMuX3NlbGVjdEJsdWVwcmludC5iaW5kKHRoaXMsaXRlbSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT0nYmx1ZXByaW50TmFtZScgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPntpdGVtLmlkfTwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e2l0ZW0uY3JlYXRlZF9hdH08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPntpdGVtLnVwZGF0ZWRfYXR9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD48ZGl2IGNsYXNzTmFtZT1cInVpIGdyZWVuIGhvcml6b250YWwgbGFiZWxcIj57aXRlbS5kZXBDb3VudH08L2Rpdj48L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93QWN0aW9uc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJyb2NrZXQgaWNvbiBsaW5rIGJvcmRlcmVkXCIgdGl0bGU9XCJDcmVhdGUgZGVwbG95bWVudFwiIG9uQ2xpY2s9e3RoaXMuX2NyZWF0ZURlcGxveW1lbnQuYmluZCh0aGlzLGl0ZW0pfT48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cInRyYXNoIGljb24gbGluayBib3JkZXJlZFwiIHRpdGxlPVwiRGVsZXRlIGJsdWVwcmludFwiIG9uQ2xpY2s9e3RoaXMuX2RlbGV0ZUJsdWVwcmludENvbmZpcm0uYmluZCh0aGlzLGl0ZW0pfT48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgICAgICA8Q29uZmlybSB0aXRsZT0nQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHJlbW92ZSB0aGlzIGJsdWVwcmludD8nXG4gICAgICAgICAgICAgICAgICAgICAgICAgc2hvdz17dGhpcy5zdGF0ZS5jb25maXJtRGVsZXRlfVxuICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ29uZmlybT17dGhpcy5fZGVsZXRlQmx1ZXByaW50LmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgb25DYW5jZWw9eygpPT50aGlzLnNldFN0YXRlKHtjb25maXJtRGVsZXRlIDogZmFsc2V9KX0gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICk7XG4gICAgfVxufTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBraW5uZXJldHppbiBvbiAwNS8xMC8yMDE2LlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzLGNvbnRleHQpIHtcbiAgICAgICAgc3VwZXIocHJvcHMsY29udGV4dCk7XG5cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIGVycm9yOiBudWxsXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkFwcHJvdmUgKCkge1xuICAgICAgICAkKHRoaXMucmVmcy5zdWJtaXREZXBsb3lCdG4pLmNsaWNrKCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBfZGVwbG95KCkge1xuICAgICAgICB2YXIgZGVwbG95SXRlbSA9IHRoaXMucHJvcHMuY29udGV4dC5nZXRWYWx1ZSh0aGlzLnByb3BzLndpZGdldC5pZCArICdjcmVhdGVEZXBsb3knKTtcblxuICAgICAgICBpZiAoIWRlcGxveUl0ZW0pIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2Vycm9yOiAnQmx1ZXByaW50IG5vdCBzZWxlY3RlZCd9KTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBibHVlcHJpbnRJZCA9IGRlcGxveUl0ZW0uaWQ7XG4gICAgICAgIHZhciBkZXBsb3ltZW50SWQgPSAkKCdbbmFtZT1kZXBsb3ltZW50TmFtZV0nKS52YWwoKTtcblxuICAgICAgICB2YXIgaW5wdXRzID0ge307XG5cbiAgICAgICAgJCgnW25hbWU9ZGVwbG95bWVudElucHV0XScpLmVhY2goKGluZGV4LGlucHV0KT0+e1xuICAgICAgICAgICAgdmFyIGlucHV0ID0gJChpbnB1dCk7XG4gICAgICAgICAgICBpbnB1dHNbaW5wdXQuZGF0YSgnbmFtZScpXSA9IGlucHV0LnZhbCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgdGhpJCA9IHRoaXM7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IHRoaSQucHJvcHMuY29udGV4dC5nZXRNYW5hZ2VyVXJsKCkgKyAnL2FwaS92Mi4xL2RlcGxveW1lbnRzLycrZGVwbG95bWVudElkLFxuICAgICAgICAgICAgLy9kYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgXCJoZWFkZXJzXCI6IHtcImNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIn0sXG4gICAgICAgICAgICBtZXRob2Q6ICdwdXQnLFxuICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICdibHVlcHJpbnRfaWQnOiBibHVlcHJpbnRJZCxcbiAgICAgICAgICAgICAgICBpbnB1dHM6IGlucHV0c1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5kb25lKChkZXBsb3ltZW50KT0+IHtcbiAgICAgICAgICAgICAgICB0aGkkLnByb3BzLmNvbnRleHQuc2V0VmFsdWUodGhpcy5wcm9wcy53aWRnZXQuaWQgKyAnY3JlYXRlRGVwbG95JyxudWxsKTtcblxuICAgICAgICAgICAgICAgIHRoaSQucHJvcHMuY29udGV4dC5nZXRFdmVudEJ1cygpLnRyaWdnZXIoJ2RlcGxveW1lbnQ6cmVmcmVzaCcpO1xuXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bik9PntcbiAgICAgICAgICAgICAgICB0aGkkLnNldFN0YXRlKHtlcnJvcjogKGpxWEhSLnJlc3BvbnNlSlNPTiAmJiBqcVhIUi5yZXNwb25zZUpTT04ubWVzc2FnZSA/IGpxWEhSLnJlc3BvbnNlSlNPTi5tZXNzYWdlIDogZXJyb3JUaHJvd24pfSlcbiAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIG9uRGVueSAoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5zZXRWYWx1ZSh0aGlzLnByb3BzLndpZGdldC5pZCArICdjcmVhdGVEZXBsb3knLG51bGwpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBfc3VibWl0RGVwbG95IChlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICB0aGlzLl9kZXBsb3koKTtcblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdmFyIE1vZGFsID0gU3RhZ2UuQmFzaWMuTW9kYWw7XG4gICAgICAgIHZhciBIZWFkZXIgPSBTdGFnZS5CYXNpYy5Nb2RhbEhlYWRlcjtcbiAgICAgICAgdmFyIEJvZHkgPSBTdGFnZS5CYXNpYy5Nb2RhbEJvZHk7XG4gICAgICAgIHZhciBGb290ZXIgPSBTdGFnZS5CYXNpYy5Nb2RhbEZvb3RlcjtcblxuICAgICAgICB2YXIgZGVwbG95SXRlbSA9IHRoaXMucHJvcHMuY29udGV4dC5nZXRWYWx1ZSh0aGlzLnByb3BzLndpZGdldC5pZCArICdjcmVhdGVEZXBsb3knKTtcbiAgICAgICAgdmFyIHNob3VsZFNob3cgPSAhXy5pc0VtcHR5KGRlcGxveUl0ZW0pO1xuICAgICAgICBkZXBsb3lJdGVtID0gT2JqZWN0LmFzc2lnbih7fSx7XG4gICAgICAgICAgICAgICAgaWQ6ICcnLFxuICAgICAgICAgICAgICAgIHBsYW46IHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRzOiB7fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZXBsb3lJdGVtXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxNb2RhbCBzaG93PXtzaG91bGRTaG93fSBjbGFzc05hbWU9J2RlcGxveW1lbnRNb2RhbCcgb25EZW55PXt0aGlzLm9uRGVueS5iaW5kKHRoaXMpfSBvbkFwcHJvdmU9e3RoaXMub25BcHByb3ZlLmJpbmQodGhpcyl9PlxuICAgICAgICAgICAgICAgICAgICA8SGVhZGVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwicm9ja2V0IGljb25cIj48L2k+IERlcGxveSBibHVlcHJpbnQge2RlcGxveUl0ZW0uaWR9XG4gICAgICAgICAgICAgICAgICAgIDwvSGVhZGVyPlxuXG4gICAgICAgICAgICAgICAgICAgIDxCb2R5PlxuICAgICAgICAgICAgICAgICAgICA8Zm9ybSBjbGFzc05hbWU9XCJ1aSBmb3JtIGRlcGxveUZvcm1cIiBvblN1Ym1pdD17dGhpcy5fc3VibWl0RGVwbG95LmJpbmQodGhpcyl9IGFjdGlvbj1cIlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHJlcXVpcmVkIG5hbWU9J2RlcGxveW1lbnROYW1lJyBwbGFjZWhvbGRlcj1cIkRlcGxveW1lbnQgbmFtZVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5tYXAoZGVwbG95SXRlbS5wbGFuLmlucHV0cywoaW5wdXQsbmFtZSk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGRcIiBrZXk9e25hbWV9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCB0aXRsZT17aW5wdXQuZGVzY3JpcHRpb24gfHwgbmFtZSB9PntuYW1lfTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IG5hbWU9J2RlcGxveW1lbnRJbnB1dCcgZGF0YS1uYW1lPXtuYW1lfSB0eXBlPVwidGV4dFwiIGRlZmF1bHRWYWx1ZT17aW5wdXQuZGVmYXVsdH0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuZXJyb3IgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIGVycm9yIG1lc3NhZ2UgZGVwbG95RmFpbGVkXCIgc3R5bGU9e3tcImRpc3BsYXlcIjpcImJsb2NrXCJ9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVhZGVyXCI+RXJyb3IgZGVwbG95aW5nIGJsdWVwcmludDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+e3RoaXMuc3RhdGUuZXJyb3J9PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9J3N1Ym1pdCcgc3R5bGU9e3tcImRpc3BsYXlcIjogXCJub25lXCJ9fSByZWY9J3N1Ym1pdERlcGxveUJ0bicvPlxuICAgICAgICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICAgICAgICAgIDwvQm9keT5cblxuICAgICAgICAgICAgICAgICAgICA8Rm9vdGVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBjYW5jZWwgYmFzaWMgYnV0dG9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwicmVtb3ZlIGljb25cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2FuY2VsXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgb2sgZ3JlZW4gIGJ1dHRvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cInJvY2tldCBpY29uXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIERlcGxveVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvRm9vdGVyPlxuICAgICAgICAgICAgICAgIDwvTW9kYWw+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICApO1xuICAgIH1cbn07XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkga2lubmVyZXR6aW4gb24gMDUvMTAvMjAxNi5cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCAocGx1Z2luVXRpbHMpPT4ge1xuXG4gICAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgICAgICBjb25zdHJ1Y3Rvcihwcm9wcyxjb250ZXh0KSB7XG4gICAgICAgICAgICBzdXBlcihwcm9wcyxjb250ZXh0KTtcblxuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgICAgICB1cGxvYWRFcnI6IG51bGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICAgICAgdGhpcy5faW5pdE1vZGFsKHRoaXMucmVmcy5tb2RhbE9iaik7XG4gICAgICAgIH1cbiAgICAgICAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgICAgICAgICAgcGx1Z2luVXRpbHMualF1ZXJ5KHRoaXMucmVmcy5tb2RhbE9iaikubW9kYWwoJ3JlZnJlc2gnKTtcbiAgICAgICAgfVxuICAgICAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgICAgICAgIHBsdWdpblV0aWxzLmpRdWVyeSh0aGlzLnJlZnMubW9kYWxPYmopLm1vZGFsKCdkZXN0cm95Jyk7XG4gICAgICAgICAgICBwbHVnaW5VdGlscy5qUXVlcnkodGhpcy5yZWZzLm1vZGFsT2JqKS5yZW1vdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9pbml0TW9kYWwobW9kYWxPYmopIHtcbiAgICAgICAgICAgIHBsdWdpblV0aWxzLmpRdWVyeShtb2RhbE9iaikubW9kYWwoe1xuICAgICAgICAgICAgICAgIGNsb3NhYmxlICA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIG9uRGVueSAgICA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIC8vd2luZG93LmFsZXJ0KCdXYWl0IG5vdCB5ZXQhJyk7XG4gICAgICAgICAgICAgICAgICAgIC8vcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgb25BcHByb3ZlIDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHBsdWdpblV0aWxzLmpRdWVyeSgnLnVwbG9hZEZvcm1TdWJtaXRCdG4nKS5jbGljaygpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIF9zaG93TW9kYWwoKSB7XG4gICAgICAgICAgICBwbHVnaW5VdGlscy5qUXVlcnkoJy51cGxvYWRCbHVlcHJpbnRNb2RhbCcpLm1vZGFsKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBfb3BlbkZpbGVTZWxlY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgcGx1Z2luVXRpbHMualF1ZXJ5KCcjYmx1ZXByaW50RmlsZScpLmNsaWNrKCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBfdXBsb2FkRmlsZUNoYW5nZWQoZSl7XG4gICAgICAgICAgICB2YXIgZnVsbFBhdGhGaWxlTmFtZSA9IHBsdWdpblV0aWxzLmpRdWVyeShlLmN1cnJlbnRUYXJnZXQpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIGZpbGVuYW1lID0gZnVsbFBhdGhGaWxlTmFtZS5zcGxpdCgnXFxcXCcpLnBvcCgpO1xuXG4gICAgICAgICAgICBwbHVnaW5VdGlscy5qUXVlcnkoJ2lucHV0LnVwbG9hZEJsdWVwcmludEZpbGUnKS52YWwoZmlsZW5hbWUpLmF0dHIoJ3RpdGxlJyxmdWxsUGF0aEZpbGVOYW1lKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgX3N1Ym1pdFVwbG9hZChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHZhciB0aGkkID0gdGhpcztcblxuICAgICAgICAgICAgdmFyIGZvcm1PYmogPSBwbHVnaW5VdGlscy5qUXVlcnkoZS5jdXJyZW50VGFyZ2V0KTtcblxuICAgICAgICAgICAgLy8gQ2xlYXIgZXJyb3JzXG4gICAgICAgICAgICBmb3JtT2JqLmZpbmQoJy5lcnJvcjpub3QoLm1lc3NhZ2UpJykucmVtb3ZlQ2xhc3MoJ2Vycm9yJyk7XG4gICAgICAgICAgICBmb3JtT2JqLmZpbmQoJy51aS5lcnJvci5tZXNzYWdlJykuaGlkZSgpO1xuXG4gICAgICAgICAgICAvLyBHZXQgdGhlIGRhdGFcbiAgICAgICAgICAgIHZhciBibHVlcHJpbnROYW1lID0gZm9ybU9iai5maW5kKFwiaW5wdXRbbmFtZT0nYmx1ZXByaW50TmFtZSddXCIpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIGJsdWVwcmludEZpbGVOYW1lID0gZm9ybU9iai5maW5kKFwiaW5wdXRbbmFtZT0nYmx1ZXByaW50RmlsZU5hbWUnXVwiKS52YWwoKTtcbiAgICAgICAgICAgIHZhciBibHVlcHJpbnRGaWxlVXJsID0gZm9ybU9iai5maW5kKFwiaW5wdXRbbmFtZT0nYmx1ZXByaW50RmlsZVVybCddXCIpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIGZpbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmx1ZXByaW50RmlsZScpLmZpbGVzWzBdO1xuXG4gICAgICAgICAgICAvLyBDaGVjayB0aGF0IHdlIGhhdmUgYWxsIHdlIG5lZWRcbiAgICAgICAgICAgIGlmIChfLmlzRW1wdHkoYmx1ZXByaW50RmlsZVVybCkgJiYgIWZpbGUpIHtcbiAgICAgICAgICAgICAgICBmb3JtT2JqLmFkZENsYXNzKCdlcnJvcicpO1xuICAgICAgICAgICAgICAgIGZvcm1PYmouZmluZChcImlucHV0LnVwbG9hZEJsdWVwcmludEZpbGVcIikucGFyZW50cygnLmZpZWxkJykuYWRkQ2xhc3MoJ2Vycm9yJyk7XG4gICAgICAgICAgICAgICAgZm9ybU9iai5maW5kKFwiaW5wdXRbbmFtZT0nYmx1ZXByaW50RmlsZVVybCddXCIpLnBhcmVudHMoJy5maWVsZCcpLmFkZENsYXNzKCdlcnJvcicpO1xuICAgICAgICAgICAgICAgIGZvcm1PYmouZmluZCgnLnVpLmVycm9yLm1lc3NhZ2UnKS5zaG93KCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfLmlzRW1wdHkoYmx1ZXByaW50TmFtZSkpIHtcbiAgICAgICAgICAgICAgICBmb3JtT2JqLmFkZENsYXNzKCdlcnJvcicpO1xuICAgICAgICAgICAgICAgIGZvcm1PYmouZmluZChcImlucHV0W25hbWU9J2JsdWVwcmludE5hbWUnXVwiKS5wYXJlbnRzKCcuZmllbGQnKS5hZGRDbGFzcygnZXJyb3InKTtcbiAgICAgICAgICAgICAgICBmb3JtT2JqLmZpbmQoJy51aS5lcnJvci5tZXNzYWdlJykuc2hvdygpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBEaXNhbGJlIHRoZSBmb3JtXG4gICAgICAgICAgICBmb3JtT2JqLnBhcmVudHMoJy5tb2RhbCcpLmZpbmQoJy5hY3Rpb25zIC5idXR0b24nKS5hdHRyKCdkaXNhYmxlZCcsJ2Rpc2FibGVkJykuYWRkQ2xhc3MoJ2Rpc2FibGVkIGxvYWRpbmcnKTtcbiAgICAgICAgICAgIGZvcm1PYmouYWRkQ2xhc3MoJ2xvYWRpbmcnKTtcblxuICAgICAgICAgICAgLy8gQ2FsbCB1cGxvYWQgbWV0aG9kXG4gICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICAoeGhyLnVwbG9hZCB8fCB4aHIpLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIHZhciBkb25lID0gZS5wb3NpdGlvbiB8fCBlLmxvYWRlZFxuICAgICAgICAgICAgICAgIHZhciB0b3RhbCA9IGUudG90YWxTaXplIHx8IGUudG90YWw7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3hociBwcm9ncmVzczogJyArIE1hdGgucm91bmQoZG9uZS90b3RhbCoxMDApICsgJyUnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygneGhyIHVwbG9hZCBlcnJvcicsIGUsIHRoaXMucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICB0aGkkLl9wcm9jZXNzVXBsb2FkRXJySWZOZWVkZWQodGhpcyk7XG4gICAgICAgICAgICAgICAgZm9ybU9iai5wYXJlbnRzKCcubW9kYWwnKS5maW5kKCcuYWN0aW9ucyAuYnV0dG9uJykucmVtb3ZlQXR0cignZGlzYWJsZWQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQgbG9hZGluZycpO1xuICAgICAgICAgICAgICAgIGZvcm1PYmoucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygneGhyIHVwbG9hZCBjb21wbGV0ZScsIGUsIHRoaXMucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICBmb3JtT2JqLnBhcmVudHMoJy5tb2RhbCcpLmZpbmQoJy5hY3Rpb25zIC5idXR0b24nKS5yZW1vdmVBdHRyKCdkaXNhYmxlZCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCBsb2FkaW5nJyk7XG4gICAgICAgICAgICAgICAgZm9ybU9iai5yZW1vdmVDbGFzcygnbG9hZGluZycpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCF0aGkkLl9wcm9jZXNzVXBsb2FkRXJySWZOZWVkZWQodGhpcykpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9ybU9iai5wYXJlbnRzKCcubW9kYWwnKS5tb2RhbCgnaGlkZScpO1xuICAgICAgICAgICAgICAgICAgICB0aGkkLnByb3BzLmNvbnRleHQucmVmcmVzaCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1PYmouZmluZCgnLnVpLmVycm9yLm1lc3NhZ2UudXBsb2FkRmFpbGVkJykuc2hvdygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgeGhyLm9wZW4oJ3B1dCcsdGhpcy5wcm9wcy5jb250ZXh0LmdldE1hbmFnZXJVcmwoKSArXG4gICAgICAgICAgICAgICAgJy9hcGkvdjIuMS9ibHVlcHJpbnRzLycrYmx1ZXByaW50TmFtZSArICghXy5pc0VtcHR5KGJsdWVwcmludEZpbGVOYW1lKSA/ICc/YXBwbGljYXRpb25fZmlsZV9uYW1lPScrYmx1ZXByaW50RmlsZU5hbWUrJy55YW1sJyA6ICcnKSk7XG4gICAgICAgICAgICB4aHIuc2VuZChmaWxlKTtcblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgX3Byb2Nlc3NVcGxvYWRFcnJJZk5lZWRlZCh4aHIpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UubWVzc2FnZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHt1cGxvYWRFcnI6IHJlc3BvbnNlLm1lc3NhZ2V9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnIoJ0Nhbm5vdCBwYXJzZSB1cGxvYWQgcmVzcG9uc2UnLGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJ1aSBsYWJlbGVkIGljb24gYnV0dG9uIHVwbG9hZEJsdWVwcmludFwiIG9uQ2xpY2s9e3RoaXMuX3Nob3dNb2RhbH0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJ1cGxvYWQgaWNvblwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgIFVwbG9hZFxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cblxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIG1vZGFsIHVwbG9hZEJsdWVwcmludE1vZGFsXCIgcmVmPSdtb2RhbE9iaic+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhlYWRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cInVwbG9hZCBpY29uXCI+PC9pPiBVcGxvYWQgYmx1ZXByaW50XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0gY2xhc3NOYW1lPVwidWkgZm9ybSB1cGxvYWRGb3JtXCIgb25TdWJtaXQ9e3RoaXMuX3N1Ym1pdFVwbG9hZC5iaW5kKHRoaXMpfSBhY3Rpb249XCJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZHNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQgbmluZSB3aWRlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBsYWJlbGVkIGlucHV0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgbGFiZWxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGh0dHA6Ly9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9J2JsdWVwcmludEZpbGVVcmwnIHBsYWNlaG9sZGVyPVwiRW50ZXIgYmx1ZXByaW50IHVybFwiPjwvaW5wdXQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZCBvbmUgd2lkZVwiIHN0eWxlPXt7XCJwb3NpdGlvblwiOlwicmVsYXRpdmVcIn19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgdmVydGljYWwgZGl2aWRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkIGVpZ2h0IHdpZGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIGFjdGlvbiBpbnB1dFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiByZWFkT25seT0ndHJ1ZScgdmFsdWU9XCJcIiBjbGFzc05hbWU9XCJ1cGxvYWRCbHVlcHJpbnRGaWxlXCIgb25DbGljaz17dGhpcy5fb3BlbkZpbGVTZWxlY3Rpb259PjwvaW5wdXQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwidWkgaWNvbiBidXR0b24gdXBsb2FkQmx1ZXByaW50RmlsZVwiIG9uQ2xpY2s9e3RoaXMuX29wZW5GaWxlU2VsZWN0aW9ufT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImF0dGFjaCBpY29uXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBuYW1lPSdibHVlcHJpbnRGaWxlJyBpZD1cImJsdWVwcmludEZpbGVcIiBzdHlsZT17e1wiZGlzcGxheVwiOiBcIm5vbmVcIn19IG9uQ2hhbmdlPXt0aGlzLl91cGxvYWRGaWxlQ2hhbmdlZH0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHJlcXVpcmVkIG5hbWU9J2JsdWVwcmludE5hbWUnIGlkPSdibHVlcHJpbnROYW1lJyBwbGFjZWhvbGRlcj1cIkJsdWVwcmludCBuYW1lXCIgcmVxdWlyZWQvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT0nYmx1ZXByaW50RmlsZU5hbWUnIGlkPSdibHVlcHJpbnRGaWxlTmFtZScgcGxhY2Vob2xkZXI9XCJCbHVlcHJpbnQgZmlsZW5hbWUgZS5nLiBibHVlcHJpbnRcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgZXJyb3IgbWVzc2FnZVwiIHN0eWxlPXt7XCJkaXNwbGF5XCI6XCJub25lXCJ9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVhZGVyXCI+TWlzc2luZyBkYXRhPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD5QbGVhc2UgZmlsbCBpbiBhbGwgdGhlIHJlcXVpcmVkIGZpZWxkczwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUudXBsb2FkRXJyID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIGVycm9yIG1lc3NhZ2UgdXBsb2FkRmFpbGVkXCIgc3R5bGU9e3tcImRpc3BsYXlcIjpcImJsb2NrXCJ9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoZWFkZXJcIj5FcnJvciB1cGxvYWRpbmcgZmlsZTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD57dGhpcy5zdGF0ZS51cGxvYWRFcnJ9PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9J3N1Ym1pdCcgc3R5bGU9e3tcImRpc3BsYXlcIjogXCJub25lXCJ9fSBjbGFzc05hbWU9J3VwbG9hZEZvcm1TdWJtaXRCdG4nLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhY3Rpb25zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBjYW5jZWwgYmFzaWMgYnV0dG9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cInJlbW92ZSBpY29uXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDYW5jZWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIG9rIGdyZWVuICBidXR0b25cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwidXBsb2FkIGljb25cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFVwbG9hZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfTtcbn07XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkga2lubmVyZXR6aW4gb24gMDcvMDkvMjAxNi5cbiAqL1xuXG5pbXBvcnQgQmx1ZXByaW50c1RhYmxlIGZyb20gJy4vQmx1ZXByaW50c1RhYmxlJztcbmltcG9ydCByZW5kZXJVcGxvYWRCbHVlcHJpbnRNb2RhbCBmcm9tICcuL1VwbG9hZEJsdWVwcmludE1vZGFsJztcbmltcG9ydCBEZXBsb3lNb2RhbCBmcm9tICcuL0NyZWF0ZURlcGxveW1lbnRNb2RhbCc7XG5cbnZhciBVcGxvYWRNb2RhbCA9IG51bGw7XG5cblN0YWdlLmFkZFBsdWdpbih7XG4gICAgaWQ6IFwiYmx1ZXByaW50c1wiLFxuICAgIG5hbWU6IFwiQmx1ZXByaW50cyBsaXN0XCIsXG4gICAgZGVzY3JpcHRpb246ICdibGFoIGJsYWggYmxhaCcsXG4gICAgaW5pdGlhbFdpZHRoOiA4LFxuICAgIGluaXRpYWxIZWlnaHQ6IDUsXG4gICAgY29sb3IgOiBcImJsdWVcIixcbiAgICBpbml0aWFsQ29uZmlndXJhdGlvbjoge2ZpbHRlcl9ieTogXCJcIn0sXG4gICAgaXNSZWFjdDogdHJ1ZSxcbiAgICBpbml0OiBmdW5jdGlvbihwbHVnaW5VdGlscykge1xuICAgICAgICBVcGxvYWRNb2RhbCA9IHJlbmRlclVwbG9hZEJsdWVwcmludE1vZGFsKHBsdWdpblV0aWxzKTtcbiAgICB9LFxuXG4gICAgZmV0Y2hEYXRhOiBmdW5jdGlvbihwbHVnaW4sY29udGV4dCxwbHVnaW5VdGlscykge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIChyZXNvbHZlLHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgcGx1Z2luVXRpbHMualF1ZXJ5LmdldCh7XG4gICAgICAgICAgICAgICAgdXJsOiBjb250ZXh0LmdldE1hbmFnZXJVcmwoKSArICcvYXBpL3YyLjEvYmx1ZXByaW50cz9faW5jbHVkZT1pZCx1cGRhdGVkX2F0LGNyZWF0ZWRfYXQsZGVzY3JpcHRpb24scGxhbicsXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmRvbmUoKGJsdWVwcmludHMpPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIHBsdWdpblV0aWxzLmpRdWVyeS5nZXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBjb250ZXh0LmdldE1hbmFnZXJVcmwoKSArICcvYXBpL3YyLjEvZGVwbG95bWVudHM/X2luY2x1ZGU9aWQsYmx1ZXByaW50X2lkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZG9uZSgoZGVwbG95bWVudHMpPT57XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVwQ291bnQgPSBfLmNvdW50QnkoZGVwbG95bWVudHMuaXRlbXMsJ2JsdWVwcmludF9pZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENvdW50IGRlcGxveW1lbnRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5lYWNoKGJsdWVwcmludHMuaXRlbXMsKGJsdWVwcmludCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmx1ZXByaW50LmRlcENvdW50ID0gZGVwQ291bnRbYmx1ZXByaW50LmlkXSB8fCAwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGJsdWVwcmludHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5mYWlsKHJlamVjdCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZmFpbChyZWplY3QpXG4gICAgICAgIH0pO1xuICAgIH0sXG5cblxuICAgIHJlbmRlcjogZnVuY3Rpb24od2lkZ2V0LGRhdGEsZXJyb3IsY29udGV4dCxwbHVnaW5VdGlscykge1xuXG4gICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIHBsdWdpblV0aWxzLnJlbmRlclJlYWN0TG9hZGluZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gcGx1Z2luVXRpbHMucmVuZGVyUmVhY3RFcnJvcihlcnJvcik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2VsZWN0ZWRCbHVlcHJpbnQgPSBjb250ZXh0LmdldFZhbHVlKCdibHVlcHJpbnRJZCcpO1xuICAgICAgICB2YXIgZm9ybWF0dGVkRGF0YSA9IE9iamVjdC5hc3NpZ24oe30sZGF0YSx7XG4gICAgICAgICAgICBpdGVtczogXy5tYXAgKGRhdGEuaXRlbXMsKGl0ZW0pPT57XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30saXRlbSx7XG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZWRfYXQ6IHBsdWdpblV0aWxzLm1vbWVudChpdGVtLmNyZWF0ZWRfYXQsJ1lZWVktTU0tREQgSEg6bW06c3MuU1NTU1MnKS5mb3JtYXQoJ0RELU1NLVlZWVkgSEg6bW0nKSwgLy8yMDE2LTA3LTIwIDA5OjEwOjUzLjEwMzU3OVxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVkX2F0OiBwbHVnaW5VdGlscy5tb21lbnQoaXRlbS51cGRhdGVkX2F0LCdZWVlZLU1NLUREIEhIOm1tOnNzLlNTU1NTJykuZm9ybWF0KCdERC1NTS1ZWVlZIEhIOm1tJyksXG4gICAgICAgICAgICAgICAgICAgIGlzU2VsZWN0ZWQ6IHNlbGVjdGVkQmx1ZXByaW50ID09PSBpdGVtLmlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxCbHVlcHJpbnRzVGFibGUgd2lkZ2V0PXt3aWRnZXR9IGRhdGE9e2Zvcm1hdHRlZERhdGF9IGNvbnRleHQ9e2NvbnRleHR9IHV0aWxzPXtwbHVnaW5VdGlsc30vPlxuICAgICAgICAgICAgICAgIDxVcGxvYWRNb2RhbCB3aWRnZXQ9e3dpZGdldH0gZGF0YT17Zm9ybWF0dGVkRGF0YX0gY29udGV4dD17Y29udGV4dH0gdXRpbHM9e3BsdWdpblV0aWxzfS8+XG4gICAgICAgICAgICAgICAgPERlcGxveU1vZGFsIHdpZGdldD17d2lkZ2V0fSBkYXRhPXtmb3JtYXR0ZWREYXRhfSBjb250ZXh0PXtjb250ZXh0fSB1dGlscz17cGx1Z2luVXRpbHN9Lz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn0pOyJdfQ==
