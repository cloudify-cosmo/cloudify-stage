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
                                    React.createElement('input', { type: 'text', name: 'blueprintName', id: 'blueprintName', placeholder: 'Blueprint name', required: true })
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwbHVnaW5zL2JsdWVwcmludHMvc3JjL0JsdWVwcmludHNUYWJsZS5qcyIsInBsdWdpbnMvYmx1ZXByaW50cy9zcmMvQ3JlYXRlRGVwbG95bWVudE1vZGFsLmpzIiwicGx1Z2lucy9ibHVlcHJpbnRzL3NyYy9VcGxvYWRCbHVlcHJpbnRNb2RhbC5qcyIsInBsdWdpbnMvYmx1ZXByaW50cy9zcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7OztBQU1JLG9CQUFZLEtBQVosRUFBa0IsT0FBbEIsRUFBMkI7QUFBQTs7QUFBQSxvSEFDakIsS0FEaUIsRUFDWCxPQURXOztBQUd2QixjQUFLLEtBQUwsR0FBYTtBQUNULDJCQUFjO0FBREwsU0FBYjtBQUh1QjtBQU0xQjs7Ozt5Q0FFaUIsSSxFQUFLO0FBQ25CLGdCQUFJLHlCQUF5QixLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLFFBQW5CLENBQTRCLGFBQTVCLENBQTdCO0FBQ0EsaUJBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsUUFBbkIsQ0FBNEIsYUFBNUIsRUFBMEMsS0FBSyxFQUFMLEtBQVksc0JBQVosR0FBcUMsSUFBckMsR0FBNEMsS0FBSyxFQUEzRjtBQUNIOzs7MENBRWlCLEksRUFBSyxLLEVBQU07QUFDekIsa0JBQU0sZUFBTjs7QUFFQSxpQkFBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixRQUFuQixDQUE0QixLQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLEVBQWxCLEdBQXVCLGNBQW5ELEVBQWtFLElBQWxFO0FBQ0g7OztnREFFdUIsSSxFQUFLLEssRUFBTTtBQUMvQixrQkFBTSxlQUFOOztBQUVBLGlCQUFLLFFBQUwsQ0FBYztBQUNWLCtCQUFnQixJQUROO0FBRVYsc0JBQU07QUFGSSxhQUFkO0FBSUg7OzsyQ0FFa0I7QUFDZixnQkFBSSxDQUFDLEtBQUssS0FB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QUE3QixDQUFQO0FBQ0g7O0FBRUQsWUFBSSxvQkFBb0IsUUFBUSxRQUFSLENBQWlCLGFBQWpCLENBQXhCO0FBQ0EsWUFBSSxnQkFBZ0IsT0FBTyxNQUFQLENBQWMsRUFBZCxFQUFpQixJQUFqQixFQUFzQjtBQUN0QyxtQkFBTyxFQUFFLEdBQUYsQ0FBTyxLQUFLLEtBQVosRUFBa0IsVUFBQyxJQUFELEVBQVE7QUFDN0IsdUJBQU8sT0FBTyxNQUFQLENBQWMsRUFBZCxFQUFpQixJQUFqQixFQUFzQjtBQUN6QixnQ0FBWSxZQUFZLE1BQVosQ0FBbUIsS0FBSyxVQUF4QixFQUFtQywyQkFBbkMsRUFBZ0UsTUFBaEUsQ0FBdUUsa0JBQXZFLENBRGEsRUFDK0U7QUFDeEcsZ0NBQVksWUFBWSxNQUFaLENBQW1CLEtBQUssVUFBeEIsRUFBbUMsMkJBQW5DLEVBQWdFLE1BQWhFLENBQXVFLGtCQUF2RSxDQUZhO0FBR3pCLGdDQUFZLHNCQUFzQixLQUFLO0FBSGQsaUJBQXRCLENBQVA7QUFLSCxhQU5NO0FBRCtCLFNBQXRCLENBQXBCOztBQVVBLGVBQ0k7QUFBQTtBQUFBO0FBQ0ksNkRBQWlCLFFBQVEsTUFBekIsRUFBaUMsTUFBTSxhQUF2QyxFQUFzRCxTQUFTLE9BQS9ELEVBQXdFLE9BQU8sV0FBL0UsR0FESjtBQUVJLGdDQUFDLFdBQUQsSUFBYSxRQUFRLE1BQXJCLEVBQTZCLE1BQU0sYUFBbkMsRUFBa0QsU0FBUyxPQUEzRCxFQUFvRSxPQUFPLFdBQTNFLEdBRko7QUFHSSxtRUFBYSxRQUFRLE1BQXJCLEVBQTZCLE1BQU0sYUFBbkMsRUFBa0QsU0FBUyxPQUEzRCxFQUFvRSxPQUFPLFdBQTNFO0FBSEosU0FESjtBQU9IO0FBdEVXLENBQWhCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ3JlYXRlZCBieSBraW5uZXJldHppbiBvbiAwMi8xMC8yMDE2LlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzLGNvbnRleHQpIHtcbiAgICAgICAgc3VwZXIocHJvcHMsY29udGV4dCk7XG5cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIGNvbmZpcm1EZWxldGU6ZmFsc2VcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9zZWxlY3RCbHVlcHJpbnQgKGl0ZW0pe1xuICAgICAgICB2YXIgb2xkU2VsZWN0ZWRCbHVlcHJpbnRJZCA9IHRoaXMucHJvcHMuY29udGV4dC5nZXRWYWx1ZSgnYmx1ZXByaW50SWQnKTtcbiAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LnNldFZhbHVlKCdibHVlcHJpbnRJZCcsaXRlbS5pZCA9PT0gb2xkU2VsZWN0ZWRCbHVlcHJpbnRJZCA/IG51bGwgOiBpdGVtLmlkKTtcbiAgICB9XG5cbiAgICBfY3JlYXRlRGVwbG95bWVudChpdGVtLGV2ZW50KXtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LnNldFZhbHVlKHRoaXMucHJvcHMud2lkZ2V0LmlkICsgJ2NyZWF0ZURlcGxveScsaXRlbSk7XG4gICAgfVxuXG4gICAgX2RlbGV0ZUJsdWVwcmludENvbmZpcm0oaXRlbSxldmVudCl7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgY29uZmlybURlbGV0ZSA6IHRydWUsXG4gICAgICAgICAgICBpdGVtOiBpdGVtXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9kZWxldGVCbHVlcHJpbnQoKSB7XG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5pdGVtKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtlcnJvcjogJ1NvbWV0aGluZyB3ZW50IHdyb25nLCBubyBibHVlcHJpbnQgd2FzIHNlbGVjdGVkIGZvciBkZWxldGUnfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdGhpJCA9IHRoaXM7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IHRoaSQucHJvcHMuY29udGV4dC5nZXRNYW5hZ2VyVXJsKCkgKyAnL2FwaS92Mi4xL2JsdWVwcmludHMvJyt0aGlzLnN0YXRlLml0ZW0uaWQsXG4gICAgICAgICAgICBcImhlYWRlcnNcIjoge1wiY29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwifSxcbiAgICAgICAgICAgIG1ldGhvZDogJ2RlbGV0ZSdcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5kb25lKCgpPT4ge1xuICAgICAgICAgICAgICAgIHRoaSQuc2V0U3RhdGUoe2NvbmZpcm1EZWxldGU6IGZhbHNlfSk7XG4gICAgICAgICAgICAgICAgdGhpJC5wcm9wcy5jb250ZXh0LmdldEV2ZW50QnVzKCkudHJpZ2dlcignYmx1ZXByaW50czpyZWZyZXNoJyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bik9PntcbiAgICAgICAgICAgICAgICB0aGkkLnNldFN0YXRlKHtjb25maXJtRGVsZXRlOiBmYWxzZX0pO1xuICAgICAgICAgICAgICAgIHRoaSQuc2V0U3RhdGUoe2Vycm9yOiAoanFYSFIucmVzcG9uc2VKU09OICYmIGpxWEhSLnJlc3BvbnNlSlNPTi5tZXNzYWdlID8ganFYSFIucmVzcG9uc2VKU09OLm1lc3NhZ2UgOiBlcnJvclRocm93bil9KVxuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgX3JlZnJlc2hEYXRhKCkge1xuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQucmVmcmVzaCgpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQuZ2V0RXZlbnRCdXMoKS5vbignYmx1ZXByaW50czpyZWZyZXNoJyx0aGlzLl9yZWZyZXNoRGF0YSx0aGlzKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LmdldEV2ZW50QnVzKCkub2ZmKCdibHVlcHJpbnRzOnJlZnJlc2gnLHRoaXMuX3JlZnJlc2hEYXRhKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHZhciBDb25maXJtID0gU3RhZ2UuQmFzaWMuQ29uZmlybTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuZXJyb3IgP1xuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBlcnJvciBtZXNzYWdlXCIgc3R5bGU9e3tcImRpc3BsYXlcIjpcImJsb2NrXCJ9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhlYWRlclwiPkVycm9yIE9jY3VyZWQ8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD57dGhpcy5zdGF0ZS5lcnJvcn08L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICcnXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT1cInVpIHZlcnkgY29tcGFjdCB0YWJsZSBibHVlcHJpbnRzVGFibGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+TmFtZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+Q3JlYXRlZDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+VXBkYXRlZDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+IyBEZXBsb3ltZW50czwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+PC90aD5cbiAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmRhdGEuaXRlbXMubWFwKChpdGVtKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ciBrZXk9e2l0ZW0uaWR9IGNsYXNzTmFtZT17XCJyb3cgXCIrIChpdGVtLmlzU2VsZWN0ZWQgPyAnYWN0aXZlJyA6ICcnKX0gb25DbGljaz17dGhpcy5fc2VsZWN0Qmx1ZXByaW50LmJpbmQodGhpcyxpdGVtKX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPSdibHVlcHJpbnROYW1lJyBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+e2l0ZW0uaWR9PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57aXRlbS5jcmVhdGVkX2F0fTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e2l0ZW0udXBkYXRlZF9hdH08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPjxkaXYgY2xhc3NOYW1lPVwidWkgZ3JlZW4gaG9yaXpvbnRhbCBsYWJlbFwiPntpdGVtLmRlcENvdW50fTwvZGl2PjwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dBY3Rpb25zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cInJvY2tldCBpY29uIGxpbmsgYm9yZGVyZWRcIiB0aXRsZT1cIkNyZWF0ZSBkZXBsb3ltZW50XCIgb25DbGljaz17dGhpcy5fY3JlYXRlRGVwbG95bWVudC5iaW5kKHRoaXMsaXRlbSl9PjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwidHJhc2ggaWNvbiBsaW5rIGJvcmRlcmVkXCIgdGl0bGU9XCJEZWxldGUgYmx1ZXByaW50XCIgb25DbGljaz17dGhpcy5fZGVsZXRlQmx1ZXByaW50Q29uZmlybS5iaW5kKHRoaXMsaXRlbSl9PjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgICAgIDxDb25maXJtIHRpdGxlPSdBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcmVtb3ZlIHRoaXMgYmx1ZXByaW50PydcbiAgICAgICAgICAgICAgICAgICAgICAgICBzaG93PXt0aGlzLnN0YXRlLmNvbmZpcm1EZWxldGV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgb25Db25maXJtPXt0aGlzLl9kZWxldGVCbHVlcHJpbnQuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICBvbkNhbmNlbD17KCk9PnRoaXMuc2V0U3RhdGUoe2NvbmZpcm1EZWxldGUgOiBmYWxzZX0pfSAvPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgKTtcbiAgICB9XG59O1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGtpbm5lcmV0emluIG9uIDA1LzEwLzIwMTYuXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMsY29udGV4dCkge1xuICAgICAgICBzdXBlcihwcm9wcyxjb250ZXh0KTtcblxuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgZXJyb3I6IG51bGxcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uQXBwcm92ZSAoKSB7XG4gICAgICAgICQodGhpcy5yZWZzLnN1Ym1pdERlcGxveUJ0bikuY2xpY2soKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIF9kZXBsb3koKSB7XG4gICAgICAgIHZhciBkZXBsb3lJdGVtID0gdGhpcy5wcm9wcy5jb250ZXh0LmdldFZhbHVlKHRoaXMucHJvcHMud2lkZ2V0LmlkICsgJ2NyZWF0ZURlcGxveScpO1xuXG4gICAgICAgIGlmICghZGVwbG95SXRlbSkge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7ZXJyb3I6ICdCbHVlcHJpbnQgbm90IHNlbGVjdGVkJ30pO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGJsdWVwcmludElkID0gZGVwbG95SXRlbS5pZDtcbiAgICAgICAgdmFyIGRlcGxveW1lbnRJZCA9ICQoJ1tuYW1lPWRlcGxveW1lbnROYW1lXScpLnZhbCgpO1xuXG4gICAgICAgIHZhciBpbnB1dHMgPSB7fTtcblxuICAgICAgICAkKCdbbmFtZT1kZXBsb3ltZW50SW5wdXRdJykuZWFjaCgoaW5kZXgsaW5wdXQpPT57XG4gICAgICAgICAgICB2YXIgaW5wdXQgPSAkKGlucHV0KTtcbiAgICAgICAgICAgIGlucHV0c1tpbnB1dC5kYXRhKCduYW1lJyldID0gaW5wdXQudmFsKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciB0aGkkID0gdGhpcztcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogdGhpJC5wcm9wcy5jb250ZXh0LmdldE1hbmFnZXJVcmwoKSArICcvYXBpL3YyLjEvZGVwbG95bWVudHMvJytkZXBsb3ltZW50SWQsXG4gICAgICAgICAgICAvL2RhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICBcImhlYWRlcnNcIjoge1wiY29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwifSxcbiAgICAgICAgICAgIG1ldGhvZDogJ3B1dCcsXG4gICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgJ2JsdWVwcmludF9pZCc6IGJsdWVwcmludElkLFxuICAgICAgICAgICAgICAgIGlucHV0czogaW5wdXRzXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgICAgICAgLmRvbmUoKGRlcGxveW1lbnQpPT4ge1xuICAgICAgICAgICAgICAgIHRoaSQucHJvcHMuY29udGV4dC5zZXRWYWx1ZSh0aGlzLnByb3BzLndpZGdldC5pZCArICdjcmVhdGVEZXBsb3knLG51bGwpO1xuXG4gICAgICAgICAgICAgICAgdGhpJC5wcm9wcy5jb250ZXh0LmdldEV2ZW50QnVzKCkudHJpZ2dlcignZGVwbG95bWVudHM6cmVmcmVzaCcpO1xuXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bik9PntcbiAgICAgICAgICAgICAgICB0aGkkLnNldFN0YXRlKHtlcnJvcjogKGpxWEhSLnJlc3BvbnNlSlNPTiAmJiBqcVhIUi5yZXNwb25zZUpTT04ubWVzc2FnZSA/IGpxWEhSLnJlc3BvbnNlSlNPTi5tZXNzYWdlIDogZXJyb3JUaHJvd24pfSlcbiAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIG9uRGVueSAoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5zZXRWYWx1ZSh0aGlzLnByb3BzLndpZGdldC5pZCArICdjcmVhdGVEZXBsb3knLG51bGwpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBfc3VibWl0RGVwbG95IChlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICB0aGlzLl9kZXBsb3koKTtcblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdmFyIE1vZGFsID0gU3RhZ2UuQmFzaWMuTW9kYWw7XG4gICAgICAgIHZhciBIZWFkZXIgPSBTdGFnZS5CYXNpYy5Nb2RhbEhlYWRlcjtcbiAgICAgICAgdmFyIEJvZHkgPSBTdGFnZS5CYXNpYy5Nb2RhbEJvZHk7XG4gICAgICAgIHZhciBGb290ZXIgPSBTdGFnZS5CYXNpYy5Nb2RhbEZvb3RlcjtcblxuICAgICAgICB2YXIgZGVwbG95SXRlbSA9IHRoaXMucHJvcHMuY29udGV4dC5nZXRWYWx1ZSh0aGlzLnByb3BzLndpZGdldC5pZCArICdjcmVhdGVEZXBsb3knKTtcbiAgICAgICAgdmFyIHNob3VsZFNob3cgPSAhXy5pc0VtcHR5KGRlcGxveUl0ZW0pO1xuICAgICAgICBkZXBsb3lJdGVtID0gT2JqZWN0LmFzc2lnbih7fSx7XG4gICAgICAgICAgICAgICAgaWQ6ICcnLFxuICAgICAgICAgICAgICAgIHBsYW46IHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRzOiB7fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZXBsb3lJdGVtXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxNb2RhbCBzaG93PXtzaG91bGRTaG93fSBjbGFzc05hbWU9J2RlcGxveW1lbnRNb2RhbCcgb25EZW55PXt0aGlzLm9uRGVueS5iaW5kKHRoaXMpfSBvbkFwcHJvdmU9e3RoaXMub25BcHByb3ZlLmJpbmQodGhpcyl9PlxuICAgICAgICAgICAgICAgICAgICA8SGVhZGVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwicm9ja2V0IGljb25cIj48L2k+IERlcGxveSBibHVlcHJpbnQge2RlcGxveUl0ZW0uaWR9XG4gICAgICAgICAgICAgICAgICAgIDwvSGVhZGVyPlxuXG4gICAgICAgICAgICAgICAgICAgIDxCb2R5PlxuICAgICAgICAgICAgICAgICAgICA8Zm9ybSBjbGFzc05hbWU9XCJ1aSBmb3JtIGRlcGxveUZvcm1cIiBvblN1Ym1pdD17dGhpcy5fc3VibWl0RGVwbG95LmJpbmQodGhpcyl9IGFjdGlvbj1cIlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHJlcXVpcmVkIG5hbWU9J2RlcGxveW1lbnROYW1lJyBwbGFjZWhvbGRlcj1cIkRlcGxveW1lbnQgbmFtZVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5tYXAoZGVwbG95SXRlbS5wbGFuLmlucHV0cywoaW5wdXQsbmFtZSk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGRcIiBrZXk9e25hbWV9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCB0aXRsZT17aW5wdXQuZGVzY3JpcHRpb24gfHwgbmFtZSB9PntuYW1lfTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IG5hbWU9J2RlcGxveW1lbnRJbnB1dCcgZGF0YS1uYW1lPXtuYW1lfSB0eXBlPVwidGV4dFwiIGRlZmF1bHRWYWx1ZT17aW5wdXQuZGVmYXVsdH0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuZXJyb3IgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIGVycm9yIG1lc3NhZ2UgZGVwbG95RmFpbGVkXCIgc3R5bGU9e3tcImRpc3BsYXlcIjpcImJsb2NrXCJ9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVhZGVyXCI+RXJyb3IgZGVwbG95aW5nIGJsdWVwcmludDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+e3RoaXMuc3RhdGUuZXJyb3J9PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9J3N1Ym1pdCcgc3R5bGU9e3tcImRpc3BsYXlcIjogXCJub25lXCJ9fSByZWY9J3N1Ym1pdERlcGxveUJ0bicvPlxuICAgICAgICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICAgICAgICAgIDwvQm9keT5cblxuICAgICAgICAgICAgICAgICAgICA8Rm9vdGVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBjYW5jZWwgYmFzaWMgYnV0dG9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwicmVtb3ZlIGljb25cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2FuY2VsXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgb2sgZ3JlZW4gIGJ1dHRvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cInJvY2tldCBpY29uXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIERlcGxveVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvRm9vdGVyPlxuICAgICAgICAgICAgICAgIDwvTW9kYWw+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICApO1xuICAgIH1cbn07XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkga2lubmVyZXR6aW4gb24gMDUvMTAvMjAxNi5cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCAocGx1Z2luVXRpbHMpPT4ge1xuXG4gICAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgICAgICBjb25zdHJ1Y3Rvcihwcm9wcyxjb250ZXh0KSB7XG4gICAgICAgICAgICBzdXBlcihwcm9wcyxjb250ZXh0KTtcblxuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgICAgICB1cGxvYWRFcnI6IG51bGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICAgICAgdGhpcy5faW5pdE1vZGFsKHRoaXMucmVmcy5tb2RhbE9iaik7XG4gICAgICAgIH1cbiAgICAgICAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgICAgICAgICAgcGx1Z2luVXRpbHMualF1ZXJ5KHRoaXMucmVmcy5tb2RhbE9iaikubW9kYWwoJ3JlZnJlc2gnKTtcbiAgICAgICAgfVxuICAgICAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgICAgICAgIHBsdWdpblV0aWxzLmpRdWVyeSh0aGlzLnJlZnMubW9kYWxPYmopLm1vZGFsKCdkZXN0cm95Jyk7XG4gICAgICAgICAgICBwbHVnaW5VdGlscy5qUXVlcnkodGhpcy5yZWZzLm1vZGFsT2JqKS5yZW1vdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9pbml0TW9kYWwobW9kYWxPYmopIHtcbiAgICAgICAgICAgIHBsdWdpblV0aWxzLmpRdWVyeShtb2RhbE9iaikubW9kYWwoe1xuICAgICAgICAgICAgICAgIGNsb3NhYmxlICA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIG9uRGVueSAgICA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIC8vd2luZG93LmFsZXJ0KCdXYWl0IG5vdCB5ZXQhJyk7XG4gICAgICAgICAgICAgICAgICAgIC8vcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgb25BcHByb3ZlIDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHBsdWdpblV0aWxzLmpRdWVyeSgnLnVwbG9hZEZvcm1TdWJtaXRCdG4nKS5jbGljaygpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIF9zaG93TW9kYWwoKSB7XG4gICAgICAgICAgICBwbHVnaW5VdGlscy5qUXVlcnkoJy51cGxvYWRCbHVlcHJpbnRNb2RhbCcpLm1vZGFsKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBfb3BlbkZpbGVTZWxlY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgcGx1Z2luVXRpbHMualF1ZXJ5KCcjYmx1ZXByaW50RmlsZScpLmNsaWNrKCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBfdXBsb2FkRmlsZUNoYW5nZWQoZSl7XG4gICAgICAgICAgICB2YXIgZnVsbFBhdGhGaWxlTmFtZSA9IHBsdWdpblV0aWxzLmpRdWVyeShlLmN1cnJlbnRUYXJnZXQpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIGZpbGVuYW1lID0gZnVsbFBhdGhGaWxlTmFtZS5zcGxpdCgnXFxcXCcpLnBvcCgpO1xuXG4gICAgICAgICAgICBwbHVnaW5VdGlscy5qUXVlcnkoJ2lucHV0LnVwbG9hZEJsdWVwcmludEZpbGUnKS52YWwoZmlsZW5hbWUpLmF0dHIoJ3RpdGxlJyxmdWxsUGF0aEZpbGVOYW1lKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgX3N1Ym1pdFVwbG9hZChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHZhciB0aGkkID0gdGhpcztcblxuICAgICAgICAgICAgdmFyIGZvcm1PYmogPSBwbHVnaW5VdGlscy5qUXVlcnkoZS5jdXJyZW50VGFyZ2V0KTtcblxuICAgICAgICAgICAgLy8gQ2xlYXIgZXJyb3JzXG4gICAgICAgICAgICBmb3JtT2JqLmZpbmQoJy5lcnJvcjpub3QoLm1lc3NhZ2UpJykucmVtb3ZlQ2xhc3MoJ2Vycm9yJyk7XG4gICAgICAgICAgICBmb3JtT2JqLmZpbmQoJy51aS5lcnJvci5tZXNzYWdlJykuaGlkZSgpO1xuXG4gICAgICAgICAgICAvLyBHZXQgdGhlIGRhdGFcbiAgICAgICAgICAgIHZhciBibHVlcHJpbnROYW1lID0gZm9ybU9iai5maW5kKFwiaW5wdXRbbmFtZT0nYmx1ZXByaW50TmFtZSddXCIpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIGJsdWVwcmludEZpbGVOYW1lID0gZm9ybU9iai5maW5kKFwiaW5wdXRbbmFtZT0nYmx1ZXByaW50RmlsZU5hbWUnXVwiKS52YWwoKTtcbiAgICAgICAgICAgIHZhciBibHVlcHJpbnRGaWxlVXJsID0gZm9ybU9iai5maW5kKFwiaW5wdXRbbmFtZT0nYmx1ZXByaW50RmlsZVVybCddXCIpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIGZpbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmx1ZXByaW50RmlsZScpLmZpbGVzWzBdO1xuXG4gICAgICAgICAgICAvLyBDaGVjayB0aGF0IHdlIGhhdmUgYWxsIHdlIG5lZWRcbiAgICAgICAgICAgIGlmIChfLmlzRW1wdHkoYmx1ZXByaW50RmlsZVVybCkgJiYgIWZpbGUpIHtcbiAgICAgICAgICAgICAgICBmb3JtT2JqLmFkZENsYXNzKCdlcnJvcicpO1xuICAgICAgICAgICAgICAgIGZvcm1PYmouZmluZChcImlucHV0LnVwbG9hZEJsdWVwcmludEZpbGVcIikucGFyZW50cygnLmZpZWxkJykuYWRkQ2xhc3MoJ2Vycm9yJyk7XG4gICAgICAgICAgICAgICAgZm9ybU9iai5maW5kKFwiaW5wdXRbbmFtZT0nYmx1ZXByaW50RmlsZVVybCddXCIpLnBhcmVudHMoJy5maWVsZCcpLmFkZENsYXNzKCdlcnJvcicpO1xuICAgICAgICAgICAgICAgIGZvcm1PYmouZmluZCgnLnVpLmVycm9yLm1lc3NhZ2UnKS5zaG93KCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfLmlzRW1wdHkoYmx1ZXByaW50TmFtZSkpIHtcbiAgICAgICAgICAgICAgICBmb3JtT2JqLmFkZENsYXNzKCdlcnJvcicpO1xuICAgICAgICAgICAgICAgIGZvcm1PYmouZmluZChcImlucHV0W25hbWU9J2JsdWVwcmludE5hbWUnXVwiKS5wYXJlbnRzKCcuZmllbGQnKS5hZGRDbGFzcygnZXJyb3InKTtcbiAgICAgICAgICAgICAgICBmb3JtT2JqLmZpbmQoJy51aS5lcnJvci5tZXNzYWdlJykuc2hvdygpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBEaXNhbGJlIHRoZSBmb3JtXG4gICAgICAgICAgICBmb3JtT2JqLnBhcmVudHMoJy5tb2RhbCcpLmZpbmQoJy5hY3Rpb25zIC5idXR0b24nKS5hdHRyKCdkaXNhYmxlZCcsJ2Rpc2FibGVkJykuYWRkQ2xhc3MoJ2Rpc2FibGVkIGxvYWRpbmcnKTtcbiAgICAgICAgICAgIGZvcm1PYmouYWRkQ2xhc3MoJ2xvYWRpbmcnKTtcblxuICAgICAgICAgICAgLy8gQ2FsbCB1cGxvYWQgbWV0aG9kXG4gICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICAoeGhyLnVwbG9hZCB8fCB4aHIpLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIHZhciBkb25lID0gZS5wb3NpdGlvbiB8fCBlLmxvYWRlZFxuICAgICAgICAgICAgICAgIHZhciB0b3RhbCA9IGUudG90YWxTaXplIHx8IGUudG90YWw7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3hociBwcm9ncmVzczogJyArIE1hdGgucm91bmQoZG9uZS90b3RhbCoxMDApICsgJyUnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygneGhyIHVwbG9hZCBlcnJvcicsIGUsIHRoaXMucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICB0aGkkLl9wcm9jZXNzVXBsb2FkRXJySWZOZWVkZWQodGhpcyk7XG4gICAgICAgICAgICAgICAgZm9ybU9iai5wYXJlbnRzKCcubW9kYWwnKS5maW5kKCcuYWN0aW9ucyAuYnV0dG9uJykucmVtb3ZlQXR0cignZGlzYWJsZWQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQgbG9hZGluZycpO1xuICAgICAgICAgICAgICAgIGZvcm1PYmoucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygneGhyIHVwbG9hZCBjb21wbGV0ZScsIGUsIHRoaXMucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICBmb3JtT2JqLnBhcmVudHMoJy5tb2RhbCcpLmZpbmQoJy5hY3Rpb25zIC5idXR0b24nKS5yZW1vdmVBdHRyKCdkaXNhYmxlZCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCBsb2FkaW5nJyk7XG4gICAgICAgICAgICAgICAgZm9ybU9iai5yZW1vdmVDbGFzcygnbG9hZGluZycpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCF0aGkkLl9wcm9jZXNzVXBsb2FkRXJySWZOZWVkZWQodGhpcykpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9ybU9iai5wYXJlbnRzKCcubW9kYWwnKS5tb2RhbCgnaGlkZScpO1xuICAgICAgICAgICAgICAgICAgICB0aGkkLnByb3BzLmNvbnRleHQucmVmcmVzaCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1PYmouZmluZCgnLnVpLmVycm9yLm1lc3NhZ2UudXBsb2FkRmFpbGVkJykuc2hvdygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgeGhyLm9wZW4oJ3B1dCcsdGhpcy5wcm9wcy5jb250ZXh0LmdldE1hbmFnZXJVcmwoKSArXG4gICAgICAgICAgICAgICAgJy9hcGkvdjIuMS9ibHVlcHJpbnRzLycrYmx1ZXByaW50TmFtZSArICghXy5pc0VtcHR5KGJsdWVwcmludEZpbGVOYW1lKSA/ICc/YXBwbGljYXRpb25fZmlsZV9uYW1lPScrYmx1ZXByaW50RmlsZU5hbWUrJy55YW1sJyA6ICcnKSk7XG4gICAgICAgICAgICB4aHIuc2VuZChmaWxlKTtcblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgX3Byb2Nlc3NVcGxvYWRFcnJJZk5lZWRlZCh4aHIpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UubWVzc2FnZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHt1cGxvYWRFcnI6IHJlc3BvbnNlLm1lc3NhZ2V9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnIoJ0Nhbm5vdCBwYXJzZSB1cGxvYWQgcmVzcG9uc2UnLGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJ1aSBsYWJlbGVkIGljb24gYnV0dG9uIHVwbG9hZEJsdWVwcmludFwiIG9uQ2xpY2s9e3RoaXMuX3Nob3dNb2RhbH0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJ1cGxvYWQgaWNvblwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgIFVwbG9hZFxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cblxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIG1vZGFsIHVwbG9hZEJsdWVwcmludE1vZGFsXCIgcmVmPSdtb2RhbE9iaic+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhlYWRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cInVwbG9hZCBpY29uXCI+PC9pPiBVcGxvYWQgYmx1ZXByaW50XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0gY2xhc3NOYW1lPVwidWkgZm9ybSB1cGxvYWRGb3JtXCIgb25TdWJtaXQ9e3RoaXMuX3N1Ym1pdFVwbG9hZC5iaW5kKHRoaXMpfSBhY3Rpb249XCJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZHNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQgbmluZSB3aWRlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBsYWJlbGVkIGlucHV0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgbGFiZWxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGh0dHA6Ly9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9J2JsdWVwcmludEZpbGVVcmwnIHBsYWNlaG9sZGVyPVwiRW50ZXIgYmx1ZXByaW50IHVybFwiPjwvaW5wdXQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZCBvbmUgd2lkZVwiIHN0eWxlPXt7XCJwb3NpdGlvblwiOlwicmVsYXRpdmVcIn19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgdmVydGljYWwgZGl2aWRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkIGVpZ2h0IHdpZGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIGFjdGlvbiBpbnB1dFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiByZWFkT25seT0ndHJ1ZScgdmFsdWU9XCJcIiBjbGFzc05hbWU9XCJ1cGxvYWRCbHVlcHJpbnRGaWxlXCIgb25DbGljaz17dGhpcy5fb3BlbkZpbGVTZWxlY3Rpb259PjwvaW5wdXQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwidWkgaWNvbiBidXR0b24gdXBsb2FkQmx1ZXByaW50RmlsZVwiIG9uQ2xpY2s9e3RoaXMuX29wZW5GaWxlU2VsZWN0aW9ufT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImF0dGFjaCBpY29uXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBuYW1lPSdibHVlcHJpbnRGaWxlJyBpZD1cImJsdWVwcmludEZpbGVcIiBzdHlsZT17e1wiZGlzcGxheVwiOiBcIm5vbmVcIn19IG9uQ2hhbmdlPXt0aGlzLl91cGxvYWRGaWxlQ2hhbmdlZH0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9J2JsdWVwcmludE5hbWUnIGlkPSdibHVlcHJpbnROYW1lJyBwbGFjZWhvbGRlcj1cIkJsdWVwcmludCBuYW1lXCIgcmVxdWlyZWQvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT0nYmx1ZXByaW50RmlsZU5hbWUnIGlkPSdibHVlcHJpbnRGaWxlTmFtZScgcGxhY2Vob2xkZXI9XCJCbHVlcHJpbnQgZmlsZW5hbWUgZS5nLiBibHVlcHJpbnRcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgZXJyb3IgbWVzc2FnZVwiIHN0eWxlPXt7XCJkaXNwbGF5XCI6XCJub25lXCJ9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVhZGVyXCI+TWlzc2luZyBkYXRhPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD5QbGVhc2UgZmlsbCBpbiBhbGwgdGhlIHJlcXVpcmVkIGZpZWxkczwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUudXBsb2FkRXJyID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIGVycm9yIG1lc3NhZ2UgdXBsb2FkRmFpbGVkXCIgc3R5bGU9e3tcImRpc3BsYXlcIjpcImJsb2NrXCJ9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoZWFkZXJcIj5FcnJvciB1cGxvYWRpbmcgZmlsZTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD57dGhpcy5zdGF0ZS51cGxvYWRFcnJ9PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9J3N1Ym1pdCcgc3R5bGU9e3tcImRpc3BsYXlcIjogXCJub25lXCJ9fSBjbGFzc05hbWU9J3VwbG9hZEZvcm1TdWJtaXRCdG4nLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhY3Rpb25zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBjYW5jZWwgYmFzaWMgYnV0dG9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cInJlbW92ZSBpY29uXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDYW5jZWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIG9rIGdyZWVuICBidXR0b25cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwidXBsb2FkIGljb25cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFVwbG9hZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfTtcbn07XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkga2lubmVyZXR6aW4gb24gMDcvMDkvMjAxNi5cbiAqL1xuXG5pbXBvcnQgQmx1ZXByaW50c1RhYmxlIGZyb20gJy4vQmx1ZXByaW50c1RhYmxlJztcbmltcG9ydCByZW5kZXJVcGxvYWRCbHVlcHJpbnRNb2RhbCBmcm9tICcuL1VwbG9hZEJsdWVwcmludE1vZGFsJztcbmltcG9ydCBEZXBsb3lNb2RhbCBmcm9tICcuL0NyZWF0ZURlcGxveW1lbnRNb2RhbCc7XG5cbnZhciBVcGxvYWRNb2RhbCA9IG51bGw7XG5cblN0YWdlLmFkZFBsdWdpbih7XG4gICAgaWQ6IFwiYmx1ZXByaW50c1wiLFxuICAgIG5hbWU6IFwiQmx1ZXByaW50cyBsaXN0XCIsXG4gICAgZGVzY3JpcHRpb246ICdibGFoIGJsYWggYmxhaCcsXG4gICAgaW5pdGlhbFdpZHRoOiA4LFxuICAgIGluaXRpYWxIZWlnaHQ6IDUsXG4gICAgY29sb3IgOiBcImJsdWVcIixcbiAgICBpc1JlYWN0OiB0cnVlLFxuICAgIGluaXQ6IGZ1bmN0aW9uKHBsdWdpblV0aWxzKSB7XG4gICAgICAgIFVwbG9hZE1vZGFsID0gcmVuZGVyVXBsb2FkQmx1ZXByaW50TW9kYWwocGx1Z2luVXRpbHMpO1xuICAgIH0sXG5cbiAgICBmZXRjaERhdGE6IGZ1bmN0aW9uKHBsdWdpbixjb250ZXh0LHBsdWdpblV0aWxzKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUscmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBwbHVnaW5VdGlscy5qUXVlcnkuZ2V0KHtcbiAgICAgICAgICAgICAgICB1cmw6IGNvbnRleHQuZ2V0TWFuYWdlclVybCgpICsgJy9hcGkvdjIuMS9ibHVlcHJpbnRzP19pbmNsdWRlPWlkLHVwZGF0ZWRfYXQsY3JlYXRlZF9hdCxkZXNjcmlwdGlvbixwbGFuJyxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZG9uZSgoYmx1ZXByaW50cyk9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgcGx1Z2luVXRpbHMualF1ZXJ5LmdldCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IGNvbnRleHQuZ2V0TWFuYWdlclVybCgpICsgJy9hcGkvdjIuMS9kZXBsb3ltZW50cz9faW5jbHVkZT1pZCxibHVlcHJpbnRfaWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kb25lKChkZXBsb3ltZW50cyk9PntcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZXBDb3VudCA9IF8uY291bnRCeShkZXBsb3ltZW50cy5pdGVtcywnYmx1ZXByaW50X2lkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ291bnQgZGVwbG95bWVudHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmVhY2goYmx1ZXByaW50cy5pdGVtcywoYmx1ZXByaW50KT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBibHVlcHJpbnQuZGVwQ291bnQgPSBkZXBDb3VudFtibHVlcHJpbnQuaWRdIHx8IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYmx1ZXByaW50cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZhaWwocmVqZWN0KTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5mYWlsKHJlamVjdClcbiAgICAgICAgfSk7XG4gICAgfSxcblxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbih3aWRnZXQsZGF0YSxlcnJvcixjb250ZXh0LHBsdWdpblV0aWxzKSB7XG5cbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gcGx1Z2luVXRpbHMucmVuZGVyUmVhY3RMb2FkaW5nKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBwbHVnaW5VdGlscy5yZW5kZXJSZWFjdEVycm9yKGVycm9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzZWxlY3RlZEJsdWVwcmludCA9IGNvbnRleHQuZ2V0VmFsdWUoJ2JsdWVwcmludElkJyk7XG4gICAgICAgIHZhciBmb3JtYXR0ZWREYXRhID0gT2JqZWN0LmFzc2lnbih7fSxkYXRhLHtcbiAgICAgICAgICAgIGl0ZW1zOiBfLm1hcCAoZGF0YS5pdGVtcywoaXRlbSk9PntcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSxpdGVtLHtcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlZF9hdDogcGx1Z2luVXRpbHMubW9tZW50KGl0ZW0uY3JlYXRlZF9hdCwnWVlZWS1NTS1ERCBISDptbTpzcy5TU1NTUycpLmZvcm1hdCgnREQtTU0tWVlZWSBISDptbScpLCAvLzIwMTYtMDctMjAgMDk6MTA6NTMuMTAzNTc5XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZWRfYXQ6IHBsdWdpblV0aWxzLm1vbWVudChpdGVtLnVwZGF0ZWRfYXQsJ1lZWVktTU0tREQgSEg6bW06c3MuU1NTU1MnKS5mb3JtYXQoJ0RELU1NLVlZWVkgSEg6bW0nKSxcbiAgICAgICAgICAgICAgICAgICAgaXNTZWxlY3RlZDogc2VsZWN0ZWRCbHVlcHJpbnQgPT09IGl0ZW0uaWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPEJsdWVwcmludHNUYWJsZSB3aWRnZXQ9e3dpZGdldH0gZGF0YT17Zm9ybWF0dGVkRGF0YX0gY29udGV4dD17Y29udGV4dH0gdXRpbHM9e3BsdWdpblV0aWxzfS8+XG4gICAgICAgICAgICAgICAgPFVwbG9hZE1vZGFsIHdpZGdldD17d2lkZ2V0fSBkYXRhPXtmb3JtYXR0ZWREYXRhfSBjb250ZXh0PXtjb250ZXh0fSB1dGlscz17cGx1Z2luVXRpbHN9Lz5cbiAgICAgICAgICAgICAgICA8RGVwbG95TW9kYWwgd2lkZ2V0PXt3aWRnZXR9IGRhdGE9e2Zvcm1hdHRlZERhdGF9IGNvbnRleHQ9e2NvbnRleHR9IHV0aWxzPXtwbHVnaW5VdGlsc30vPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufSk7Il19
