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
            value: function _createDeployment(item, event) {
                event.stopPropagation();

                this.props.context.setValue(this.props.widget.id + 'createDeploy', item);
            }
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

var BlueprintsTable = null; /**
                             * Created by kinneretzin on 07/09/2016.
                             */

var UploadModal = null;

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
            React.createElement(UploadModal, { widget: widget, data: formattedData, context: context, utils: pluginUtils }),
            React.createElement(_CreateDeploymentModal2.default, { widget: widget, data: formattedData, context: context, utils: pluginUtils })
        );
    }
});

},{"./BlueprintsTable":1,"./CreateDeploymentModal":2,"./UploadBlueprintModal":3}]},{},[1,4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwbHVnaW5zL2JsdWVwcmludHMvc3JjL0JsdWVwcmludHNUYWJsZS5qcyIsInBsdWdpbnMvYmx1ZXByaW50cy9zcmMvQ3JlYXRlRGVwbG95bWVudE1vZGFsLmpzIiwicGx1Z2lucy9ibHVlcHJpbnRzL3NyYy9VcGxvYWRCbHVlcHJpbnRNb2RhbC5qcyIsInBsdWdpbnMvYmx1ZXByaW50cy9zcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUNBQTs7OztrQkFJZSxVQUFDLFdBQUQsRUFBZ0I7O0FBRTNCO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSw2Q0FFc0IsSUFGdEIsRUFFMkI7QUFDbkIsb0JBQUkseUJBQXlCLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsUUFBbkIsQ0FBNEIsYUFBNUIsQ0FBN0I7QUFDQSxxQkFBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixRQUFuQixDQUE0QixhQUE1QixFQUEwQyxLQUFLLEVBQUwsS0FBWSxzQkFBWixHQUFxQyxJQUFyQyxHQUE0QyxLQUFLLEVBQTNGO0FBQ0g7QUFMTDtBQUFBO0FBQUEsOENBT3NCLElBUHRCLEVBTzJCLEtBUDNCLEVBT2lDO0FBQ3pCLHNCQUFNLGVBQU47O0FBRUEscUJBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsUUFBbkIsQ0FBNEIsS0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixFQUFsQixHQUF1QixjQUFuRCxFQUFrRSxJQUFsRTtBQUNIO0FBWEw7QUFBQTtBQUFBLDZDQWFxQixJQWJyQixFQWEwQixDQUNyQjtBQWRMO0FBQUE7QUFBQSxxQ0FnQmE7QUFBQTs7QUFDTCx1QkFFSTtBQUFBO0FBQUEsc0JBQU8sV0FBVSx1Q0FBakI7QUFDSTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFDSTtB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O0FBSGQsaUJBQXRCLENBQVA7QUFLSCxhQU5NO0FBRCtCLFNBQXRCLENBQXBCOztBQVVBLGVBQ0k7QUFBQTtBQUFBO0FBQ0ksZ0NBQUMsZUFBRCxJQUFpQixRQUFRLE1BQXpCLEVBQWlDLE1BQU0sYUFBdkMsRUFBc0QsU0FBUyxPQUEvRCxFQUF3RSxPQUFPLFdBQS9FLEdBREo7QUFFSSxnQ0FBQyxXQUFELElBQWEsUUFBUSxNQUFyQixFQUE2QixNQUFNLGFBQW5DLEVBQWtELFNBQVMsT0FBM0QsRUFBb0UsT0FBTyxXQUEzRSxHQUZKO0FBR0ksbUVBQWEsUUFBUSxNQUFyQixFQUE2QixNQUFNLGFBQW5DLEVBQWtELFNBQVMsT0FBM0QsRUFBb0UsT0FBTyxXQUEzRTtBQUhKLFNBREo7QUFPSDtBQXhFVyxDQUFoQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENyZWF0ZWQgYnkga2lubmVyZXR6aW4gb24gMDIvMTAvMjAxNi5cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCAocGx1Z2luVXRpbHMpPT4ge1xuXG4gICAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgICAgICBfc2VsZWN0Qmx1ZXByaW50IChpdGVtKXtcbiAgICAgICAgICAgIHZhciBvbGRTZWxlY3RlZEJsdWVwcmludElkID0gdGhpcy5wcm9wcy5jb250ZXh0LmdldFZhbHVlKCdibHVlcHJpbnRJZCcpO1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LnNldFZhbHVlKCdibHVlcHJpbnRJZCcsaXRlbS5pZCA9PT0gb2xkU2VsZWN0ZWRCbHVlcHJpbnRJZCA/IG51bGwgOiBpdGVtLmlkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9jcmVhdGVEZXBsb3ltZW50KGl0ZW0sZXZlbnQpe1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5zZXRWYWx1ZSh0aGlzLnByb3BzLndpZGdldC5pZCArICdjcmVhdGVEZXBsb3knLGl0ZW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgX2RlbGV0ZUJsdWVwcmludChpdGVtKXtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG5cbiAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPVwidWkgdmVyeSBjb21wYWN0IHRhYmxlIGJsdWVwcmludHNUYWJsZVwiPlxuICAgICAgICAgICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5OYW1lPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5DcmVhdGVkPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5VcGRhdGVkPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD4jIERlcGxveW1lbnRzPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD48L3RoPlxuICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuZGF0YS5pdGVtcy5tYXAoKGl0ZW0pPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyIGtleT17aXRlbS5pZH0gY2xhc3NOYW1lPXtcInJvdyBcIisgKGl0ZW0uaXNTZWxlY3RlZCA/ICdhY3RpdmUnIDogJycpfSBvbkNsaWNrPXt0aGlzLl9zZWxlY3RCbHVlcHJpbnQuYmluZCh0aGlzLGl0ZW0pfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9J2JsdWVwcmludE5hbWUnIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj57aXRlbS5pZH08L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPntpdGVtLmNyZWF0ZWRfYXR9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57aXRlbS51cGRhdGVkX2F0fTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+PGRpdiBjbGFzc05hbWU9XCJ1aSBncmVlbiBob3Jpem9udGFsIGxhYmVsXCI+e2l0ZW0uZGVwQ291bnR9PC9kaXY+PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd0FjdGlvbnNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwicm9ja2V0IGljb24gbGluayBib3JkZXJlZFwiIHRpdGxlPVwiQ3JlYXRlIGRlcGxveW1lbnRcIiBvbkNsaWNrPXt0aGlzLl9jcmVhdGVEZXBsb3ltZW50LmJpbmQodGhpcyxpdGVtKX0+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJ0cmFzaCBpY29uIGxpbmsgYm9yZGVyZWRcIiB0aXRsZT1cIkRlbGV0ZSBibHVlcHJpbnRcIiBvbkNsaWNrPXt0aGlzLl9kZWxldGVCbHVlcHJpbnQuYmluZCh0aGlzLGl0ZW0pfT48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICAgICAgPC90YWJsZT5cblxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH07XG59O1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGtpbm5lcmV0emluIG9uIDA1LzEwLzIwMTYuXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMsY29udGV4dCkge1xuICAgICAgICBzdXBlcihwcm9wcyxjb250ZXh0KTtcblxuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgZXJyb3I6IG51bGxcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uQXBwcm92ZSAoKSB7XG4gICAgICAgICQodGhpcy5yZWZzLnN1Ym1pdERlcGxveUJ0bikuY2xpY2soKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIF9kZXBsb3koKSB7XG4gICAgICAgIHZhciBkZXBsb3lJdGVtID0gdGhpcy5wcm9wcy5jb250ZXh0LmdldFZhbHVlKHRoaXMucHJvcHMud2lkZ2V0LmlkICsgJ2NyZWF0ZURlcGxveScpO1xuXG4gICAgICAgIGlmICghZGVwbG95SXRlbSkge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7ZXJyb3I6ICdCbHVlcHJpbnQgbm90IHNlbGVjdGVkJ30pO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGJsdWVwcmludElkID0gZGVwbG95SXRlbS5pZDtcbiAgICAgICAgdmFyIGRlcGxveW1lbnRJZCA9ICQoJ1tuYW1lPWRlcGxveW1lbnROYW1lXScpLnZhbCgpO1xuXG4gICAgICAgIHZhciBpbnB1dHMgPSB7fTtcblxuICAgICAgICAkKCdbbmFtZT1kZXBsb3ltZW50SW5wdXRdJykuZWFjaCgoaW5kZXgsaW5wdXQpPT57XG4gICAgICAgICAgICB2YXIgaW5wdXQgPSAkKGlucHV0KTtcbiAgICAgICAgICAgIGlucHV0c1tpbnB1dC5kYXRhKCduYW1lJyldID0gaW5wdXQudmFsKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciB0aGkkID0gdGhpcztcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogdGhpJC5wcm9wcy5jb250ZXh0LmdldE1hbmFnZXJVcmwoKSArICcvYXBpL3YyLjEvZGVwbG95bWVudHMvJytkZXBsb3ltZW50SWQsXG4gICAgICAgICAgICAvL2RhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICBcImhlYWRlcnNcIjoge1wiY29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwifSxcbiAgICAgICAgICAgIG1ldGhvZDogJ3B1dCcsXG4gICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgJ2JsdWVwcmludF9pZCc6IGJsdWVwcmludElkLFxuICAgICAgICAgICAgICAgIGlucHV0czogaW5wdXRzXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgICAgICAgLmRvbmUoKGRlcGxveW1lbnQpPT4ge1xuICAgICAgICAgICAgICAgIHRoaSQucHJvcHMuY29udGV4dC5zZXRWYWx1ZSh0aGlzLnByb3BzLndpZGdldC5pZCArICdjcmVhdGVEZXBsb3knLG51bGwpO1xuXG4gICAgICAgICAgICAgICAgdGhpJC5wcm9wcy5jb250ZXh0LmdldEV2ZW50QnVzKCkudHJpZ2dlcignZGVwbG95bWVudDpyZWZyZXNoJyk7XG5cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKT0+e1xuICAgICAgICAgICAgICAgIHRoaSQuc2V0U3RhdGUoe2Vycm9yOiAoanFYSFIucmVzcG9uc2VKU09OICYmIGpxWEhSLnJlc3BvbnNlSlNPTi5tZXNzYWdlID8ganFYSFIucmVzcG9uc2VKU09OLm1lc3NhZ2UgOiBlcnJvclRocm93bil9KVxuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgb25EZW55ICgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LnNldFZhbHVlKHRoaXMucHJvcHMud2lkZ2V0LmlkICsgJ2NyZWF0ZURlcGxveScsbnVsbCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIF9zdWJtaXREZXBsb3kgKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHRoaXMuX2RlcGxveSgpO1xuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmVuZGVyKCkge1xuICAgICAgICB2YXIgTW9kYWwgPSBTdGFnZS5CYXNpYy5Nb2RhbDtcbiAgICAgICAgdmFyIEhlYWRlciA9IFN0YWdlLkJhc2ljLk1vZGFsSGVhZGVyO1xuICAgICAgICB2YXIgQm9keSA9IFN0YWdlLkJhc2ljLk1vZGFsQm9keTtcbiAgICAgICAgdmFyIEZvb3RlciA9IFN0YWdlLkJhc2ljLk1vZGFsRm9vdGVyO1xuXG4gICAgICAgIHZhciBkZXBsb3lJdGVtID0gdGhpcy5wcm9wcy5jb250ZXh0LmdldFZhbHVlKHRoaXMucHJvcHMud2lkZ2V0LmlkICsgJ2NyZWF0ZURlcGxveScpO1xuICAgICAgICB2YXIgc2hvdWxkU2hvdyA9ICFfLmlzRW1wdHkoZGVwbG95SXRlbSk7XG4gICAgICAgIGRlcGxveUl0ZW0gPSBPYmplY3QuYXNzaWduKHt9LHtcbiAgICAgICAgICAgICAgICBpZDogJycsXG4gICAgICAgICAgICAgICAgcGxhbjoge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dHM6IHt9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlcGxveUl0ZW1cbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPE1vZGFsIHNob3c9e3Nob3VsZFNob3d9IGNsYXNzTmFtZT0nZGVwbG95bWVudE1vZGFsJyBvbkRlbnk9e3RoaXMub25EZW55LmJpbmQodGhpcyl9IG9uQXBwcm92ZT17dGhpcy5vbkFwcHJvdmUuYmluZCh0aGlzKX0+XG4gICAgICAgICAgICAgICAgICAgIDxIZWFkZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJyb2NrZXQgaWNvblwiPjwvaT4gRGVwbG95IGJsdWVwcmludCB7ZGVwbG95SXRlbS5pZH1cbiAgICAgICAgICAgICAgICAgICAgPC9IZWFkZXI+XG5cbiAgICAgICAgICAgICAgICAgICAgPEJvZHk+XG4gICAgICAgICAgICAgICAgICAgIDxmb3JtIGNsYXNzTmFtZT1cInVpIGZvcm0gZGVwbG95Rm9ybVwiIG9uU3VibWl0PXt0aGlzLl9zdWJtaXREZXBsb3kuYmluZCh0aGlzKX0gYWN0aW9uPVwiXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgcmVxdWlyZWQgbmFtZT0nZGVwbG95bWVudE5hbWUnIHBsYWNlaG9sZGVyPVwiRGVwbG95bWVudCBuYW1lXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLm1hcChkZXBsb3lJdGVtLnBsYW4uaW5wdXRzLChpbnB1dCxuYW1lKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZFwiIGtleT17bmFtZX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHRpdGxlPXtpbnB1dC5kZXNjcmlwdGlvbiB8fCBuYW1lIH0+e25hbWV9PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgbmFtZT0nZGVwbG95bWVudElucHV0JyBkYXRhLW5hbWU9e25hbWV9IHR5cGU9XCJ0ZXh0XCIgZGVmYXVsdFZhbHVlPXtpbnB1dC5kZWZhdWx0fS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5lcnJvciA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgZXJyb3IgbWVzc2FnZSBkZXBsb3lGYWlsZWRcIiBzdHlsZT17e1wiZGlzcGxheVwiOlwiYmxvY2tcIn19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoZWFkZXJcIj5FcnJvciBkZXBsb3lpbmcgYmx1ZXByaW50PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD57dGhpcy5zdGF0ZS5lcnJvcn08L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT0nc3VibWl0JyBzdHlsZT17e1wiZGlzcGxheVwiOiBcIm5vbmVcIn19IHJlZj0nc3VibWl0RGVwbG95QnRuJy8+XG4gICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgICAgICAgICAgPC9Cb2R5PlxuXG4gICAgICAgICAgICAgICAgICAgIDxGb290ZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIGNhbmNlbCBiYXNpYyBidXR0b25cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJyZW1vdmUgaWNvblwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDYW5jZWxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBvayBncmVlbiAgYnV0dG9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwicm9ja2V0IGljb25cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRGVwbG95XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9Gb290ZXI+XG4gICAgICAgICAgICAgICAgPC9Nb2RhbD5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICk7XG4gICAgfVxufTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBraW5uZXJldHppbiBvbiAwNS8xMC8yMDE2LlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IChwbHVnaW5VdGlscyk9PiB7XG5cbiAgICByZXR1cm4gY2xhc3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByb3BzLGNvbnRleHQpIHtcbiAgICAgICAgICAgIHN1cGVyKHByb3BzLGNvbnRleHQpO1xuXG4gICAgICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgICAgIHVwbG9hZEVycjogbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgICAgICB0aGlzLl9pbml0TW9kYWwodGhpcy5yZWZzLm1vZGFsT2JqKTtcbiAgICAgICAgfVxuICAgICAgICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgICAgICAgICBwbHVnaW5VdGlscy5qUXVlcnkodGhpcy5yZWZzLm1vZGFsT2JqKS5tb2RhbCgncmVmcmVzaCcpO1xuICAgICAgICB9XG4gICAgICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgICAgICAgcGx1Z2luVXRpbHMualF1ZXJ5KHRoaXMucmVmcy5tb2RhbE9iaikubW9kYWwoJ2Rlc3Ryb3knKTtcbiAgICAgICAgICAgIHBsdWdpblV0aWxzLmpRdWVyeSh0aGlzLnJlZnMubW9kYWxPYmopLnJlbW92ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgX2luaXRNb2RhbChtb2RhbE9iaikge1xuICAgICAgICAgICAgcGx1Z2luVXRpbHMualF1ZXJ5KG1vZGFsT2JqKS5tb2RhbCh7XG4gICAgICAgICAgICAgICAgY2xvc2FibGUgIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgb25EZW55ICAgIDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgLy93aW5kb3cuYWxlcnQoJ1dhaXQgbm90IHlldCEnKTtcbiAgICAgICAgICAgICAgICAgICAgLy9yZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvbkFwcHJvdmUgOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcGx1Z2luVXRpbHMualF1ZXJ5KCcudXBsb2FkRm9ybVN1Ym1pdEJ0bicpLmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgX3Nob3dNb2RhbCgpIHtcbiAgICAgICAgICAgIHBsdWdpblV0aWxzLmpRdWVyeSgnLnVwbG9hZEJsdWVwcmludE1vZGFsJykubW9kYWwoJ3Nob3cnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9vcGVuRmlsZVNlbGVjdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBwbHVnaW5VdGlscy5qUXVlcnkoJyNibHVlcHJpbnRGaWxlJykuY2xpY2soKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIF91cGxvYWRGaWxlQ2hhbmdlZChlKXtcbiAgICAgICAgICAgIHZhciBmdWxsUGF0aEZpbGVOYW1lID0gcGx1Z2luVXRpbHMualF1ZXJ5KGUuY3VycmVudFRhcmdldCkudmFsKCk7XG4gICAgICAgICAgICB2YXIgZmlsZW5hbWUgPSBmdWxsUGF0aEZpbGVOYW1lLnNwbGl0KCdcXFxcJykucG9wKCk7XG5cbiAgICAgICAgICAgIHBsdWdpblV0aWxzLmpRdWVyeSgnaW5wdXQudXBsb2FkQmx1ZXByaW50RmlsZScpLnZhbChmaWxlbmFtZSkuYXR0cigndGl0bGUnLGZ1bGxQYXRoRmlsZU5hbWUpO1xuXG4gICAgICAgIH1cblxuICAgICAgICBfc3VibWl0VXBsb2FkKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgdmFyIHRoaSQgPSB0aGlzO1xuXG4gICAgICAgICAgICB2YXIgZm9ybU9iaiA9IHBsdWdpblV0aWxzLmpRdWVyeShlLmN1cnJlbnRUYXJnZXQpO1xuXG4gICAgICAgICAgICAvLyBDbGVhciBlcnJvcnNcbiAgICAgICAgICAgIGZvcm1PYmouZmluZCgnLmVycm9yOm5vdCgubWVzc2FnZSknKS5yZW1vdmVDbGFzcygnZXJyb3InKTtcbiAgICAgICAgICAgIGZvcm1PYmouZmluZCgnLnVpLmVycm9yLm1lc3NhZ2UnKS5oaWRlKCk7XG5cbiAgICAgICAgICAgIC8vIEdldCB0aGUgZGF0YVxuICAgICAgICAgICAgdmFyIGJsdWVwcmludE5hbWUgPSBmb3JtT2JqLmZpbmQoXCJpbnB1dFtuYW1lPSdibHVlcHJpbnROYW1lJ11cIikudmFsKCk7XG4gICAgICAgICAgICB2YXIgYmx1ZXByaW50RmlsZU5hbWUgPSBmb3JtT2JqLmZpbmQoXCJpbnB1dFtuYW1lPSdibHVlcHJpbnRGaWxlTmFtZSddXCIpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIGJsdWVwcmludEZpbGVVcmwgPSBmb3JtT2JqLmZpbmQoXCJpbnB1dFtuYW1lPSdibHVlcHJpbnRGaWxlVXJsJ11cIikudmFsKCk7XG4gICAgICAgICAgICB2YXIgZmlsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdibHVlcHJpbnRGaWxlJykuZmlsZXNbMF07XG5cbiAgICAgICAgICAgIC8vIENoZWNrIHRoYXQgd2UgaGF2ZSBhbGwgd2UgbmVlZFxuICAgICAgICAgICAgaWYgKF8uaXNFbXB0eShibHVlcHJpbnRGaWxlVXJsKSAmJiAhZmlsZSkge1xuICAgICAgICAgICAgICAgIGZvcm1PYmouYWRkQ2xhc3MoJ2Vycm9yJyk7XG4gICAgICAgICAgICAgICAgZm9ybU9iai5maW5kKFwiaW5wdXQudXBsb2FkQmx1ZXByaW50RmlsZVwiKS5wYXJlbnRzKCcuZmllbGQnKS5hZGRDbGFzcygnZXJyb3InKTtcbiAgICAgICAgICAgICAgICBmb3JtT2JqLmZpbmQoXCJpbnB1dFtuYW1lPSdibHVlcHJpbnRGaWxlVXJsJ11cIikucGFyZW50cygnLmZpZWxkJykuYWRkQ2xhc3MoJ2Vycm9yJyk7XG4gICAgICAgICAgICAgICAgZm9ybU9iai5maW5kKCcudWkuZXJyb3IubWVzc2FnZScpLnNob3coKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKF8uaXNFbXB0eShibHVlcHJpbnROYW1lKSkge1xuICAgICAgICAgICAgICAgIGZvcm1PYmouYWRkQ2xhc3MoJ2Vycm9yJyk7XG4gICAgICAgICAgICAgICAgZm9ybU9iai5maW5kKFwiaW5wdXRbbmFtZT0nYmx1ZXByaW50TmFtZSddXCIpLnBhcmVudHMoJy5maWVsZCcpLmFkZENsYXNzKCdlcnJvcicpO1xuICAgICAgICAgICAgICAgIGZvcm1PYmouZmluZCgnLnVpLmVycm9yLm1lc3NhZ2UnKS5zaG93KCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIERpc2FsYmUgdGhlIGZvcm1cbiAgICAgICAgICAgIGZvcm1PYmoucGFyZW50cygnLm1vZGFsJykuZmluZCgnLmFjdGlvbnMgLmJ1dHRvbicpLmF0dHIoJ2Rpc2FibGVkJywnZGlzYWJsZWQnKS5hZGRDbGFzcygnZGlzYWJsZWQgbG9hZGluZycpO1xuICAgICAgICAgICAgZm9ybU9iai5hZGRDbGFzcygnbG9hZGluZycpO1xuXG4gICAgICAgICAgICAvLyBDYWxsIHVwbG9hZCBtZXRob2RcbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgICh4aHIudXBsb2FkIHx8IHhocikuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRvbmUgPSBlLnBvc2l0aW9uIHx8IGUubG9hZGVkXG4gICAgICAgICAgICAgICAgdmFyIHRvdGFsID0gZS50b3RhbFNpemUgfHwgZS50b3RhbDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygneGhyIHByb2dyZXNzOiAnICsgTWF0aC5yb3VuZChkb25lL3RvdGFsKjEwMCkgKyAnJScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd4aHIgdXBsb2FkIGVycm9yJywgZSwgdGhpcy5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgIHRoaSQuX3Byb2Nlc3NVcGxvYWRFcnJJZk5lZWRlZCh0aGlzKTtcbiAgICAgICAgICAgICAgICBmb3JtT2JqLnBhcmVudHMoJy5tb2RhbCcpLmZpbmQoJy5hY3Rpb25zIC5idXR0b24nKS5yZW1vdmVBdHRyKCdkaXNhYmxlZCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCBsb2FkaW5nJyk7XG4gICAgICAgICAgICAgICAgZm9ybU9iai5yZW1vdmVDbGFzcygnbG9hZGluZycpO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd4aHIgdXBsb2FkIGNvbXBsZXRlJywgZSwgdGhpcy5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgIGZvcm1PYmoucGFyZW50cygnLm1vZGFsJykuZmluZCgnLmFjdGlvbnMgLmJ1dHRvbicpLnJlbW92ZUF0dHIoJ2Rpc2FibGVkJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkIGxvYWRpbmcnKTtcbiAgICAgICAgICAgICAgICBmb3JtT2JqLnJlbW92ZUNsYXNzKCdsb2FkaW5nJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXRoaSQuX3Byb2Nlc3NVcGxvYWRFcnJJZk5lZWRlZCh0aGlzKSkge1xuICAgICAgICAgICAgICAgICAgICBmb3JtT2JqLnBhcmVudHMoJy5tb2RhbCcpLm1vZGFsKCdoaWRlJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaSQucHJvcHMuY29udGV4dC5yZWZyZXNoKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZm9ybU9iai5maW5kKCcudWkuZXJyb3IubWVzc2FnZS51cGxvYWRGYWlsZWQnKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB4aHIub3BlbigncHV0Jyx0aGlzLnByb3BzLmNvbnRleHQuZ2V0TWFuYWdlclVybCgpICtcbiAgICAgICAgICAgICAgICAnL2FwaS92Mi4xL2JsdWVwcmludHMvJytibHVlcHJpbnROYW1lICsgKCFfLmlzRW1wdHkoYmx1ZXByaW50RmlsZU5hbWUpID8gJz9hcHBsaWNhdGlvbl9maWxlX25hbWU9JytibHVlcHJpbnRGaWxlTmFtZSsnLnlhbWwnIDogJycpKTtcbiAgICAgICAgICAgIHhoci5zZW5kKGZpbGUpO1xuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBfcHJvY2Vzc1VwbG9hZEVycklmTmVlZGVkKHhocikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5tZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3VwbG9hZEVycjogcmVzcG9uc2UubWVzc2FnZX0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycignQ2Fubm90IHBhcnNlIHVwbG9hZCByZXNwb25zZScsZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cInVpIGxhYmVsZWQgaWNvbiBidXR0b24gdXBsb2FkQmx1ZXByaW50XCIgb25DbGljaz17dGhpcy5fc2hvd01vZGFsfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cInVwbG9hZCBpY29uXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgVXBsb2FkXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgbW9kYWwgdXBsb2FkQmx1ZXByaW50TW9kYWxcIiByZWY9J21vZGFsT2JqJz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwidXBsb2FkIGljb25cIj48L2k+IFVwbG9hZCBibHVlcHJpbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybSBjbGFzc05hbWU9XCJ1aSBmb3JtIHVwbG9hZEZvcm1cIiBvblN1Ym1pdD17dGhpcy5fc3VibWl0VXBsb2FkLmJpbmQodGhpcyl9IGFjdGlvbj1cIlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZCBuaW5lIHdpZGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIGxhYmVsZWQgaW5wdXRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBsYWJlbFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaHR0cDovL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT0nYmx1ZXByaW50RmlsZVVybCcgcGxhY2Vob2xkZXI9XCJFbnRlciBibHVlcHJpbnQgdXJsXCI+PC9pbnB1dD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkIG9uZSB3aWRlXCIgc3R5bGU9e3tcInBvc2l0aW9uXCI6XCJyZWxhdGl2ZVwifX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSB2ZXJ0aWNhbCBkaXZpZGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQgZWlnaHQgd2lkZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgYWN0aW9uIGlucHV0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHJlYWRPbmx5PSd0cnVlJyB2YWx1ZT1cIlwiIGNsYXNzTmFtZT1cInVwbG9hZEJsdWVwcmludEZpbGVcIiBvbkNsaWNrPXt0aGlzLl9vcGVuRmlsZVNlbGVjdGlvbn0+PC9pbnB1dD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJ1aSBpY29uIGJ1dHRvbiB1cGxvYWRCbHVlcHJpbnRGaWxlXCIgb25DbGljaz17dGhpcy5fb3BlbkZpbGVTZWxlY3Rpb259PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiYXR0YWNoIGljb25cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiIG5hbWU9J2JsdWVwcmludEZpbGUnIGlkPVwiYmx1ZXByaW50RmlsZVwiIHN0eWxlPXt7XCJkaXNwbGF5XCI6IFwibm9uZVwifX0gb25DaGFuZ2U9e3RoaXMuX3VwbG9hZEZpbGVDaGFuZ2VkfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgcmVxdWlyZWQgbmFtZT0nYmx1ZXByaW50TmFtZScgaWQ9J2JsdWVwcmludE5hbWUnIHBsYWNlaG9sZGVyPVwiQmx1ZXByaW50IG5hbWVcIiByZXF1aXJlZC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPSdibHVlcHJpbnRGaWxlTmFtZScgaWQ9J2JsdWVwcmludEZpbGVOYW1lJyBwbGFjZWhvbGRlcj1cIkJsdWVwcmludCBmaWxlbmFtZSBlLmcuIGJsdWVwcmludFwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBlcnJvciBtZXNzYWdlXCIgc3R5bGU9e3tcImRpc3BsYXlcIjpcIm5vbmVcIn19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoZWFkZXJcIj5NaXNzaW5nIGRhdGE8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPlBsZWFzZSBmaWxsIGluIGFsbCB0aGUgcmVxdWlyZWQgZmllbGRzPC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS51cGxvYWRFcnIgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgZXJyb3IgbWVzc2FnZSB1cGxvYWRGYWlsZWRcIiBzdHlsZT17e1wiZGlzcGxheVwiOlwiYmxvY2tcIn19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhlYWRlclwiPkVycm9yIHVwbG9hZGluZyBmaWxlPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPnt0aGlzLnN0YXRlLnVwbG9hZEVycn08L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT0nc3VibWl0JyBzdHlsZT17e1wiZGlzcGxheVwiOiBcIm5vbmVcIn19IGNsYXNzTmFtZT0ndXBsb2FkRm9ybVN1Ym1pdEJ0bicvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFjdGlvbnNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIGNhbmNlbCBiYXNpYyBidXR0b25cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwicmVtb3ZlIGljb25cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENhbmNlbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgb2sgZ3JlZW4gIGJ1dHRvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJ1cGxvYWQgaWNvblwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVXBsb2FkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9O1xufTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBraW5uZXJldHppbiBvbiAwNy8wOS8yMDE2LlxuICovXG5cbmltcG9ydCByZW5kZXJCbHVlcHJpbnRzVGFibGUgZnJvbSAnLi9CbHVlcHJpbnRzVGFibGUnO1xuaW1wb3J0IHJlbmRlclVwbG9hZEJsdWVwcmludE1vZGFsIGZyb20gJy4vVXBsb2FkQmx1ZXByaW50TW9kYWwnO1xuaW1wb3J0IERlcGxveU1vZGFsIGZyb20gJy4vQ3JlYXRlRGVwbG95bWVudE1vZGFsJztcblxudmFyIEJsdWVwcmludHNUYWJsZSA9IG51bGw7XG52YXIgVXBsb2FkTW9kYWwgPSBudWxsO1xuXG5TdGFnZS5hZGRQbHVnaW4oe1xuICAgIGlkOiBcImJsdWVwcmludHNcIixcbiAgICBuYW1lOiBcIkJsdWVwcmludHMgbGlzdFwiLFxuICAgIGRlc2NyaXB0aW9uOiAnYmxhaCBibGFoIGJsYWgnLFxuICAgIGluaXRpYWxXaWR0aDogOCxcbiAgICBpbml0aWFsSGVpZ2h0OiA1LFxuICAgIGNvbG9yIDogXCJibHVlXCIsXG4gICAgaW5pdGlhbENvbmZpZ3VyYXRpb246IHtmaWx0ZXJfYnk6IFwiXCJ9LFxuICAgIGlzUmVhY3Q6IHRydWUsXG4gICAgaW5pdDogZnVuY3Rpb24ocGx1Z2luVXRpbHMpIHtcbiAgICAgICAgQmx1ZXByaW50c1RhYmxlID0gcmVuZGVyQmx1ZXByaW50c1RhYmxlKHBsdWdpblV0aWxzKTtcbiAgICAgICAgVXBsb2FkTW9kYWwgPSByZW5kZXJVcGxvYWRCbHVlcHJpbnRNb2RhbChwbHVnaW5VdGlscyk7XG4gICAgfSxcblxuICAgIGZldGNoRGF0YTogZnVuY3Rpb24ocGx1Z2luLGNvbnRleHQscGx1Z2luVXRpbHMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAocmVzb2x2ZSxyZWplY3QpID0+IHtcbiAgICAgICAgICAgIHBsdWdpblV0aWxzLmpRdWVyeS5nZXQoe1xuICAgICAgICAgICAgICAgIHVybDogY29udGV4dC5nZXRNYW5hZ2VyVXJsKCkgKyAnL2FwaS92Mi4xL2JsdWVwcmludHM/X2luY2x1ZGU9aWQsdXBkYXRlZF9hdCxjcmVhdGVkX2F0LGRlc2NyaXB0aW9uLHBsYW4nLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5kb25lKChibHVlcHJpbnRzKT0+IHtcblxuICAgICAgICAgICAgICAgICAgICBwbHVnaW5VdGlscy5qUXVlcnkuZ2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogY29udGV4dC5nZXRNYW5hZ2VyVXJsKCkgKyAnL2FwaS92Mi4xL2RlcGxveW1lbnRzP19pbmNsdWRlPWlkLGJsdWVwcmludF9pZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvbmUoKGRlcGxveW1lbnRzKT0+e1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlcENvdW50ID0gXy5jb3VudEJ5KGRlcGxveW1lbnRzLml0ZW1zLCdibHVlcHJpbnRfaWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDb3VudCBkZXBsb3ltZW50c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uZWFjaChibHVlcHJpbnRzLml0ZW1zLChibHVlcHJpbnQpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsdWVwcmludC5kZXBDb3VudCA9IGRlcENvdW50W2JsdWVwcmludC5pZF0gfHwgMDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShibHVlcHJpbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmFpbChyZWplY3QpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmZhaWwocmVqZWN0KVxuICAgICAgICB9KTtcbiAgICB9LFxuXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKHdpZGdldCxkYXRhLGVycm9yLGNvbnRleHQscGx1Z2luVXRpbHMpIHtcblxuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiBwbHVnaW5VdGlscy5yZW5kZXJSZWFjdExvYWRpbmcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIHBsdWdpblV0aWxzLnJlbmRlclJlYWN0RXJyb3IoZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNlbGVjdGVkQmx1ZXByaW50ID0gY29udGV4dC5nZXRWYWx1ZSgnYmx1ZXByaW50SWQnKTtcbiAgICAgICAgdmFyIGZvcm1hdHRlZERhdGEgPSBPYmplY3QuYXNzaWduKHt9LGRhdGEse1xuICAgICAgICAgICAgaXRlbXM6IF8ubWFwIChkYXRhLml0ZW1zLChpdGVtKT0+e1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LGl0ZW0se1xuICAgICAgICAgICAgICAgICAgICBjcmVhdGVkX2F0OiBwbHVnaW5VdGlscy5tb21lbnQoaXRlbS5jcmVhdGVkX2F0LCdZWVlZLU1NLUREIEhIOm1tOnNzLlNTU1NTJykuZm9ybWF0KCdERC1NTS1ZWVlZIEhIOm1tJyksIC8vMjAxNi0wNy0yMCAwOToxMDo1My4xMDM1NzlcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlZF9hdDogcGx1Z2luVXRpbHMubW9tZW50KGl0ZW0udXBkYXRlZF9hdCwnWVlZWS1NTS1ERCBISDptbTpzcy5TU1NTUycpLmZvcm1hdCgnREQtTU0tWVlZWSBISDptbScpLFxuICAgICAgICAgICAgICAgICAgICBpc1NlbGVjdGVkOiBzZWxlY3RlZEJsdWVwcmludCA9PT0gaXRlbS5pZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8Qmx1ZXByaW50c1RhYmxlIHdpZGdldD17d2lkZ2V0fSBkYXRhPXtmb3JtYXR0ZWREYXRhfSBjb250ZXh0PXtjb250ZXh0fSB1dGlscz17cGx1Z2luVXRpbHN9Lz5cbiAgICAgICAgICAgICAgICA8VXBsb2FkTW9kYWwgd2lkZ2V0PXt3aWRnZXR9IGRhdGE9e2Zvcm1hdHRlZERhdGF9IGNvbnRleHQ9e2NvbnRleHR9IHV0aWxzPXtwbHVnaW5VdGlsc30vPlxuICAgICAgICAgICAgICAgIDxEZXBsb3lNb2RhbCB3aWRnZXQ9e3dpZGdldH0gZGF0YT17Zm9ybWF0dGVkRGF0YX0gY29udGV4dD17Y29udGV4dH0gdXRpbHM9e3BsdWdpblV0aWxzfS8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59KTsiXX0=
