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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwbHVnaW5zL2JsdWVwcmludHMvc3JjL0JsdWVwcmludHNUYWJsZS5qcyIsInBsdWdpbnMvYmx1ZXByaW50cy9zcmMvQ3JlYXRlRGVwbG95bWVudE1vZGFsLmpzIiwicGx1Z2lucy9ibHVlcHJpbnRzL3NyYy9VcGxvYWRCbHVlcHJpbnRNb2RhbC5qcyIsInBsdWdpbnMvYmx1ZXByaW50cy9zcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUNBQTs7OztrQkFJZSxVQUFDLFdBQUQsRUFBZ0I7O0FBRTNCO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSw2Q0FFc0IsSUFGdEIsRUFFMkI7QUFDbkIsb0JBQUkseUJBQXlCLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsUUFBbkIsQ0FBNEIsYUFBNUIsQ0FBN0I7QUFDQSxxQkFBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixRQUFuQixDQUE0QixhQUE1QixFQUEwQyxLQUFLLEVBQUwsS0FBWSxzQkFBWixHQUFxQyxJQUFyQyxHQUE0QyxLQUFLLEVBQTNGO0FBQ0g7QUFMTDtBQUFBO0FBQUEsOENBT3NCLElBUHRCLEVBTzJCLEtBUDNCLEVBT2lDO0FBQ3pCLHNCQUFNLGVBQU47O0FBRUEscUJBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsUUFBbkIsQ0FBNEIsS0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixFQUFsQixHQUF1QixjQUFuRCxFQUFrRSxJQUFsRTtBQUNIO0FBWEw7QUFBQTtBQUFBLDZDQWFxQixJQWJyQixFQWEwQixDQUNyQjtBQWRMO0FBQUE7QUFBQSxxQ0FnQmE7QUFBQTs7QUFDTCx1QkFFSTtBQUFBO0FBQUEsc0JBQU8sV0FBVSx1Q0FBakI7QUFDSTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFDSTtB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LEVBQWlDLE1BQU0sYUFBdkMsRUFBc0QsU0FBUyxPQUEvRCxFQUF3RSxPQUFPLFdBQS9FLEdBREo7QUFFSSxnQ0FBQyxXQUFELElBQWEsUUFBUSxNQUFyQixFQUE2QixNQUFNLGFBQW5DLEVBQWtELFNBQVMsT0FBM0QsRUFBb0UsT0FBTyxXQUEzRSxHQUZKO0FBR0ksbUVBQWEsUUFBUSxNQUFyQixFQUE2QixNQUFNLGFBQW5DLEVBQWtELFNBQVMsT0FBM0QsRUFBb0UsT0FBTyxXQUEzRTtBQUhKLFNBREo7QUFPSDtBQXZFVyxDQUFoQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENyZWF0ZWQgYnkga2lubmVyZXR6aW4gb24gMDIvMTAvMjAxNi5cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCAocGx1Z2luVXRpbHMpPT4ge1xuXG4gICAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgICAgICBfc2VsZWN0Qmx1ZXByaW50IChpdGVtKXtcbiAgICAgICAgICAgIHZhciBvbGRTZWxlY3RlZEJsdWVwcmludElkID0gdGhpcy5wcm9wcy5jb250ZXh0LmdldFZhbHVlKCdibHVlcHJpbnRJZCcpO1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LnNldFZhbHVlKCdibHVlcHJpbnRJZCcsaXRlbS5pZCA9PT0gb2xkU2VsZWN0ZWRCbHVlcHJpbnRJZCA/IG51bGwgOiBpdGVtLmlkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9jcmVhdGVEZXBsb3ltZW50KGl0ZW0sZXZlbnQpe1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5zZXRWYWx1ZSh0aGlzLnByb3BzLndpZGdldC5pZCArICdjcmVhdGVEZXBsb3knLGl0ZW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgX2RlbGV0ZUJsdWVwcmludChpdGVtKXtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG5cbiAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPVwidWkgdmVyeSBjb21wYWN0IHRhYmxlIGJsdWVwcmludHNUYWJsZVwiPlxuICAgICAgICAgICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5OYW1lPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5DcmVhdGVkPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5VcGRhdGVkPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD4jIERlcGxveW1lbnRzPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD48L3RoPlxuICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuZGF0YS5pdGVtcy5tYXAoKGl0ZW0pPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyIGtleT17aXRlbS5pZH0gY2xhc3NOYW1lPXtcInJvdyBcIisgKGl0ZW0uaXNTZWxlY3RlZCA/ICdhY3RpdmUnIDogJycpfSBvbkNsaWNrPXt0aGlzLl9zZWxlY3RCbHVlcHJpbnQuYmluZCh0aGlzLGl0ZW0pfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9J2JsdWVwcmludE5hbWUnIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj57aXRlbS5pZH08L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPntpdGVtLmNyZWF0ZWRfYXR9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57aXRlbS51cGRhdGVkX2F0fTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+PGRpdiBjbGFzc05hbWU9XCJ1aSBncmVlbiBob3Jpem9udGFsIGxhYmVsXCI+e2l0ZW0uZGVwQ291bnR9PC9kaXY+PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd0FjdGlvbnNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwicm9ja2V0IGljb24gbGluayBib3JkZXJlZFwiIHRpdGxlPVwiQ3JlYXRlIGRlcGxveW1lbnRcIiBvbkNsaWNrPXt0aGlzLl9jcmVhdGVEZXBsb3ltZW50LmJpbmQodGhpcyxpdGVtKX0+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJ0cmFzaCBpY29uIGxpbmsgYm9yZGVyZWRcIiB0aXRsZT1cIkRlbGV0ZSBibHVlcHJpbnRcIiBvbkNsaWNrPXt0aGlzLl9kZWxldGVCbHVlcHJpbnQuYmluZCh0aGlzLGl0ZW0pfT48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICAgICAgPC90YWJsZT5cblxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH07XG59O1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGtpbm5lcmV0emluIG9uIDA1LzEwLzIwMTYuXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMsY29udGV4dCkge1xuICAgICAgICBzdXBlcihwcm9wcyxjb250ZXh0KTtcblxuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgZXJyb3I6IG51bGxcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uQXBwcm92ZSAoKSB7XG4gICAgICAgICQodGhpcy5yZWZzLnN1Ym1pdERlcGxveUJ0bikuY2xpY2soKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIF9kZXBsb3koKSB7XG4gICAgICAgIHZhciBkZXBsb3lJdGVtID0gdGhpcy5wcm9wcy5jb250ZXh0LmdldFZhbHVlKHRoaXMucHJvcHMud2lkZ2V0LmlkICsgJ2NyZWF0ZURlcGxveScpO1xuXG4gICAgICAgIGlmICghZGVwbG95SXRlbSkge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7ZXJyb3I6ICdCbHVlcHJpbnQgbm90IHNlbGVjdGVkJ30pO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGJsdWVwcmludElkID0gZGVwbG95SXRlbS5pZDtcbiAgICAgICAgdmFyIGRlcGxveW1lbnRJZCA9ICQoJ1tuYW1lPWRlcGxveW1lbnROYW1lXScpLnZhbCgpO1xuXG4gICAgICAgIHZhciBpbnB1dHMgPSB7fTtcblxuICAgICAgICAkKCdbbmFtZT1kZXBsb3ltZW50SW5wdXRdJykuZWFjaCgoaW5kZXgsaW5wdXQpPT57XG4gICAgICAgICAgICB2YXIgaW5wdXQgPSAkKGlucHV0KTtcbiAgICAgICAgICAgIGlucHV0c1tpbnB1dC5kYXRhKCduYW1lJyldID0gaW5wdXQudmFsKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciB0aGkkID0gdGhpcztcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogdGhpJC5wcm9wcy5jb250ZXh0LmdldE1hbmFnZXJVcmwoKSArICcvYXBpL3YyLjEvZGVwbG95bWVudHMvJytkZXBsb3ltZW50SWQsXG4gICAgICAgICAgICAvL2RhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICBcImhlYWRlcnNcIjoge1wiY29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwifSxcbiAgICAgICAgICAgIG1ldGhvZDogJ3B1dCcsXG4gICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgJ2JsdWVwcmludF9pZCc6IGJsdWVwcmludElkLFxuICAgICAgICAgICAgICAgIGlucHV0czogaW5wdXRzXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgICAgICAgLmRvbmUoKGRlcGxveW1lbnQpPT4ge1xuICAgICAgICAgICAgICAgIHRoaSQucHJvcHMuY29udGV4dC5zZXRWYWx1ZSh0aGlzLnByb3BzLndpZGdldC5pZCArICdjcmVhdGVEZXBsb3knLG51bGwpO1xuXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bik9PntcbiAgICAgICAgICAgICAgICB0aGkkLnNldFN0YXRlKHtlcnJvcjogKGpxWEhSLnJlc3BvbnNlSlNPTiAmJiBqcVhIUi5yZXNwb25zZUpTT04ubWVzc2FnZSA/IGpxWEhSLnJlc3BvbnNlSlNPTi5tZXNzYWdlIDogZXJyb3JUaHJvd24pfSlcbiAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIG9uRGVueSAoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5zZXRWYWx1ZSh0aGlzLnByb3BzLndpZGdldC5pZCArICdjcmVhdGVEZXBsb3knLG51bGwpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBfc3VibWl0RGVwbG95IChlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICB0aGlzLl9kZXBsb3koKTtcblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdmFyIE1vZGFsID0gU3RhZ2UuQmFzaWMuTW9kYWw7XG4gICAgICAgIHZhciBIZWFkZXIgPSBTdGFnZS5CYXNpYy5Nb2RhbEhlYWRlcjtcbiAgICAgICAgdmFyIEJvZHkgPSBTdGFnZS5CYXNpYy5Nb2RhbEJvZHk7XG4gICAgICAgIHZhciBGb290ZXIgPSBTdGFnZS5CYXNpYy5Nb2RhbEZvb3RlcjtcblxuICAgICAgICB2YXIgZGVwbG95SXRlbSA9IHRoaXMucHJvcHMuY29udGV4dC5nZXRWYWx1ZSh0aGlzLnByb3BzLndpZGdldC5pZCArICdjcmVhdGVEZXBsb3knKTtcbiAgICAgICAgdmFyIHNob3VsZFNob3cgPSAhXy5pc0VtcHR5KGRlcGxveUl0ZW0pO1xuICAgICAgICBkZXBsb3lJdGVtID0gT2JqZWN0LmFzc2lnbih7fSx7XG4gICAgICAgICAgICAgICAgaWQ6ICcnLFxuICAgICAgICAgICAgICAgIHBsYW46IHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRzOiB7fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZXBsb3lJdGVtXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxNb2RhbCBzaG93PXtzaG91bGRTaG93fSBjbGFzc05hbWU9J2RlcGxveW1lbnRNb2RhbCcgb25EZW55PXt0aGlzLm9uRGVueS5iaW5kKHRoaXMpfSBvbkFwcHJvdmU9e3RoaXMub25BcHByb3ZlLmJpbmQodGhpcyl9PlxuICAgICAgICAgICAgICAgICAgICA8SGVhZGVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwicm9ja2V0IGljb25cIj48L2k+IERlcGxveSBibHVlcHJpbnQge2RlcGxveUl0ZW0uaWR9XG4gICAgICAgICAgICAgICAgICAgIDwvSGVhZGVyPlxuXG4gICAgICAgICAgICAgICAgICAgIDxCb2R5PlxuICAgICAgICAgICAgICAgICAgICA8Zm9ybSBjbGFzc05hbWU9XCJ1aSBmb3JtIGRlcGxveUZvcm1cIiBvblN1Ym1pdD17dGhpcy5fc3VibWl0RGVwbG95LmJpbmQodGhpcyl9IGFjdGlvbj1cIlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHJlcXVpcmVkIG5hbWU9J2RlcGxveW1lbnROYW1lJyBwbGFjZWhvbGRlcj1cIkRlcGxveW1lbnQgbmFtZVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5tYXAoZGVwbG95SXRlbS5wbGFuLmlucHV0cywoaW5wdXQsbmFtZSk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGRcIiBrZXk9e25hbWV9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCB0aXRsZT17aW5wdXQuZGVzY3JpcHRpb24gfHwgbmFtZSB9PntuYW1lfTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IG5hbWU9J2RlcGxveW1lbnRJbnB1dCcgZGF0YS1uYW1lPXtuYW1lfSB0eXBlPVwidGV4dFwiIGRlZmF1bHRWYWx1ZT17aW5wdXQuZGVmYXVsdH0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuZXJyb3IgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIGVycm9yIG1lc3NhZ2UgZGVwbG95RmFpbGVkXCIgc3R5bGU9e3tcImRpc3BsYXlcIjpcImJsb2NrXCJ9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVhZGVyXCI+RXJyb3IgZGVwbG95aW5nIGJsdWVwcmludDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+e3RoaXMuc3RhdGUuZXJyb3J9PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9J3N1Ym1pdCcgc3R5bGU9e3tcImRpc3BsYXlcIjogXCJub25lXCJ9fSByZWY9J3N1Ym1pdERlcGxveUJ0bicvPlxuICAgICAgICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICAgICAgICAgIDwvQm9keT5cblxuICAgICAgICAgICAgICAgICAgICA8Rm9vdGVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBjYW5jZWwgYmFzaWMgYnV0dG9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwicmVtb3ZlIGljb25cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2FuY2VsXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgb2sgZ3JlZW4gIGJ1dHRvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cInJvY2tldCBpY29uXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIERlcGxveVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvRm9vdGVyPlxuICAgICAgICAgICAgICAgIDwvTW9kYWw+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICApO1xuICAgIH1cbn07XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkga2lubmVyZXR6aW4gb24gMDUvMTAvMjAxNi5cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCAocGx1Z2luVXRpbHMpPT4ge1xuXG4gICAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgICAgICBjb25zdHJ1Y3Rvcihwcm9wcyxjb250ZXh0KSB7XG4gICAgICAgICAgICBzdXBlcihwcm9wcyxjb250ZXh0KTtcblxuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgICAgICB1cGxvYWRFcnI6IG51bGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICAgICAgdGhpcy5faW5pdE1vZGFsKHRoaXMucmVmcy5tb2RhbE9iaik7XG4gICAgICAgIH1cbiAgICAgICAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgICAgICAgICAgcGx1Z2luVXRpbHMualF1ZXJ5KHRoaXMucmVmcy5tb2RhbE9iaikubW9kYWwoJ3JlZnJlc2gnKTtcbiAgICAgICAgfVxuICAgICAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgICAgICAgIHBsdWdpblV0aWxzLmpRdWVyeSh0aGlzLnJlZnMubW9kYWxPYmopLm1vZGFsKCdkZXN0cm95Jyk7XG4gICAgICAgICAgICBwbHVnaW5VdGlscy5qUXVlcnkodGhpcy5yZWZzLm1vZGFsT2JqKS5yZW1vdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9pbml0TW9kYWwobW9kYWxPYmopIHtcbiAgICAgICAgICAgIHBsdWdpblV0aWxzLmpRdWVyeShtb2RhbE9iaikubW9kYWwoe1xuICAgICAgICAgICAgICAgIGNsb3NhYmxlICA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIG9uRGVueSAgICA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIC8vd2luZG93LmFsZXJ0KCdXYWl0IG5vdCB5ZXQhJyk7XG4gICAgICAgICAgICAgICAgICAgIC8vcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgb25BcHByb3ZlIDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHBsdWdpblV0aWxzLmpRdWVyeSgnLnVwbG9hZEZvcm1TdWJtaXRCdG4nKS5jbGljaygpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIF9zaG93TW9kYWwoKSB7XG4gICAgICAgICAgICBwbHVnaW5VdGlscy5qUXVlcnkoJy51cGxvYWRCbHVlcHJpbnRNb2RhbCcpLm1vZGFsKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBfb3BlbkZpbGVTZWxlY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgcGx1Z2luVXRpbHMualF1ZXJ5KCcjYmx1ZXByaW50RmlsZScpLmNsaWNrKCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBfdXBsb2FkRmlsZUNoYW5nZWQoZSl7XG4gICAgICAgICAgICB2YXIgZnVsbFBhdGhGaWxlTmFtZSA9IHBsdWdpblV0aWxzLmpRdWVyeShlLmN1cnJlbnRUYXJnZXQpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIGZpbGVuYW1lID0gZnVsbFBhdGhGaWxlTmFtZS5zcGxpdCgnXFxcXCcpLnBvcCgpO1xuXG4gICAgICAgICAgICBwbHVnaW5VdGlscy5qUXVlcnkoJ2lucHV0LnVwbG9hZEJsdWVwcmludEZpbGUnKS52YWwoZmlsZW5hbWUpLmF0dHIoJ3RpdGxlJyxmdWxsUGF0aEZpbGVOYW1lKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgX3N1Ym1pdFVwbG9hZChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHZhciB0aGkkID0gdGhpcztcblxuICAgICAgICAgICAgdmFyIGZvcm1PYmogPSBwbHVnaW5VdGlscy5qUXVlcnkoZS5jdXJyZW50VGFyZ2V0KTtcblxuICAgICAgICAgICAgLy8gQ2xlYXIgZXJyb3JzXG4gICAgICAgICAgICBmb3JtT2JqLmZpbmQoJy5lcnJvcjpub3QoLm1lc3NhZ2UpJykucmVtb3ZlQ2xhc3MoJ2Vycm9yJyk7XG4gICAgICAgICAgICBmb3JtT2JqLmZpbmQoJy51aS5lcnJvci5tZXNzYWdlJykuaGlkZSgpO1xuXG4gICAgICAgICAgICAvLyBHZXQgdGhlIGRhdGFcbiAgICAgICAgICAgIHZhciBibHVlcHJpbnROYW1lID0gZm9ybU9iai5maW5kKFwiaW5wdXRbbmFtZT0nYmx1ZXByaW50TmFtZSddXCIpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIGJsdWVwcmludEZpbGVOYW1lID0gZm9ybU9iai5maW5kKFwiaW5wdXRbbmFtZT0nYmx1ZXByaW50RmlsZU5hbWUnXVwiKS52YWwoKTtcbiAgICAgICAgICAgIHZhciBibHVlcHJpbnRGaWxlVXJsID0gZm9ybU9iai5maW5kKFwiaW5wdXRbbmFtZT0nYmx1ZXByaW50RmlsZVVybCddXCIpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIGZpbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmx1ZXByaW50RmlsZScpLmZpbGVzWzBdO1xuXG4gICAgICAgICAgICAvLyBDaGVjayB0aGF0IHdlIGhhdmUgYWxsIHdlIG5lZWRcbiAgICAgICAgICAgIGlmIChfLmlzRW1wdHkoYmx1ZXByaW50RmlsZVVybCkgJiYgIWZpbGUpIHtcbiAgICAgICAgICAgICAgICBmb3JtT2JqLmFkZENsYXNzKCdlcnJvcicpO1xuICAgICAgICAgICAgICAgIGZvcm1PYmouZmluZChcImlucHV0LnVwbG9hZEJsdWVwcmludEZpbGVcIikucGFyZW50cygnLmZpZWxkJykuYWRkQ2xhc3MoJ2Vycm9yJyk7XG4gICAgICAgICAgICAgICAgZm9ybU9iai5maW5kKFwiaW5wdXRbbmFtZT0nYmx1ZXByaW50RmlsZVVybCddXCIpLnBhcmVudHMoJy5maWVsZCcpLmFkZENsYXNzKCdlcnJvcicpO1xuICAgICAgICAgICAgICAgIGZvcm1PYmouZmluZCgnLnVpLmVycm9yLm1lc3NhZ2UnKS5zaG93KCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfLmlzRW1wdHkoYmx1ZXByaW50TmFtZSkpIHtcbiAgICAgICAgICAgICAgICBmb3JtT2JqLmFkZENsYXNzKCdlcnJvcicpO1xuICAgICAgICAgICAgICAgIGZvcm1PYmouZmluZChcImlucHV0W25hbWU9J2JsdWVwcmludE5hbWUnXVwiKS5wYXJlbnRzKCcuZmllbGQnKS5hZGRDbGFzcygnZXJyb3InKTtcbiAgICAgICAgICAgICAgICBmb3JtT2JqLmZpbmQoJy51aS5lcnJvci5tZXNzYWdlJykuc2hvdygpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBEaXNhbGJlIHRoZSBmb3JtXG4gICAgICAgICAgICBmb3JtT2JqLnBhcmVudHMoJy5tb2RhbCcpLmZpbmQoJy5hY3Rpb25zIC5idXR0b24nKS5hdHRyKCdkaXNhYmxlZCcsJ2Rpc2FibGVkJykuYWRkQ2xhc3MoJ2Rpc2FibGVkIGxvYWRpbmcnKTtcbiAgICAgICAgICAgIGZvcm1PYmouYWRkQ2xhc3MoJ2xvYWRpbmcnKTtcblxuICAgICAgICAgICAgLy8gQ2FsbCB1cGxvYWQgbWV0aG9kXG4gICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICAoeGhyLnVwbG9hZCB8fCB4aHIpLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIHZhciBkb25lID0gZS5wb3NpdGlvbiB8fCBlLmxvYWRlZFxuICAgICAgICAgICAgICAgIHZhciB0b3RhbCA9IGUudG90YWxTaXplIHx8IGUudG90YWw7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3hociBwcm9ncmVzczogJyArIE1hdGgucm91bmQoZG9uZS90b3RhbCoxMDApICsgJyUnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygneGhyIHVwbG9hZCBlcnJvcicsIGUsIHRoaXMucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICB0aGkkLl9wcm9jZXNzVXBsb2FkRXJySWZOZWVkZWQodGhpcyk7XG4gICAgICAgICAgICAgICAgZm9ybU9iai5wYXJlbnRzKCcubW9kYWwnKS5maW5kKCcuYWN0aW9ucyAuYnV0dG9uJykucmVtb3ZlQXR0cignZGlzYWJsZWQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQgbG9hZGluZycpO1xuICAgICAgICAgICAgICAgIGZvcm1PYmoucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygneGhyIHVwbG9hZCBjb21wbGV0ZScsIGUsIHRoaXMucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICBmb3JtT2JqLnBhcmVudHMoJy5tb2RhbCcpLmZpbmQoJy5hY3Rpb25zIC5idXR0b24nKS5yZW1vdmVBdHRyKCdkaXNhYmxlZCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCBsb2FkaW5nJyk7XG4gICAgICAgICAgICAgICAgZm9ybU9iai5yZW1vdmVDbGFzcygnbG9hZGluZycpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCF0aGkkLl9wcm9jZXNzVXBsb2FkRXJySWZOZWVkZWQodGhpcykpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9ybU9iai5wYXJlbnRzKCcubW9kYWwnKS5tb2RhbCgnaGlkZScpO1xuICAgICAgICAgICAgICAgICAgICB0aGkkLnByb3BzLmNvbnRleHQucmVmcmVzaCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1PYmouZmluZCgnLnVpLmVycm9yLm1lc3NhZ2UudXBsb2FkRmFpbGVkJykuc2hvdygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgeGhyLm9wZW4oJ3B1dCcsdGhpcy5wcm9wcy5jb250ZXh0LmdldE1hbmFnZXJVcmwoKSArXG4gICAgICAgICAgICAgICAgJy9hcGkvdjIuMS9ibHVlcHJpbnRzLycrYmx1ZXByaW50TmFtZSArICghXy5pc0VtcHR5KGJsdWVwcmludEZpbGVOYW1lKSA/ICc/YXBwbGljYXRpb25fZmlsZV9uYW1lPScrYmx1ZXByaW50RmlsZU5hbWUrJy55YW1sJyA6ICcnKSk7XG4gICAgICAgICAgICB4aHIuc2VuZChmaWxlKTtcblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgX3Byb2Nlc3NVcGxvYWRFcnJJZk5lZWRlZCh4aHIpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UubWVzc2FnZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHt1cGxvYWRFcnI6IHJlc3BvbnNlLm1lc3NhZ2V9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnIoJ0Nhbm5vdCBwYXJzZSB1cGxvYWQgcmVzcG9uc2UnLGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJ1aSBsYWJlbGVkIGljb24gYnV0dG9uIHVwbG9hZEJsdWVwcmludFwiIG9uQ2xpY2s9e3RoaXMuX3Nob3dNb2RhbH0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJ1cGxvYWQgaWNvblwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgIFVwbG9hZFxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cblxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIG1vZGFsIHVwbG9hZEJsdWVwcmludE1vZGFsXCIgcmVmPSdtb2RhbE9iaic+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhlYWRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cInVwbG9hZCBpY29uXCI+PC9pPiBVcGxvYWQgYmx1ZXByaW50XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0gY2xhc3NOYW1lPVwidWkgZm9ybSB1cGxvYWRGb3JtXCIgb25TdWJtaXQ9e3RoaXMuX3N1Ym1pdFVwbG9hZC5iaW5kKHRoaXMpfSBhY3Rpb249XCJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZHNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQgbmluZSB3aWRlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBsYWJlbGVkIGlucHV0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgbGFiZWxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGh0dHA6Ly9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9J2JsdWVwcmludEZpbGVVcmwnIHBsYWNlaG9sZGVyPVwiRW50ZXIgYmx1ZXByaW50IHVybFwiPjwvaW5wdXQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZCBvbmUgd2lkZVwiIHN0eWxlPXt7XCJwb3NpdGlvblwiOlwicmVsYXRpdmVcIn19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgdmVydGljYWwgZGl2aWRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkIGVpZ2h0IHdpZGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIGFjdGlvbiBpbnB1dFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiByZWFkT25seT0ndHJ1ZScgdmFsdWU9XCJcIiBjbGFzc05hbWU9XCJ1cGxvYWRCbHVlcHJpbnRGaWxlXCIgb25DbGljaz17dGhpcy5fb3BlbkZpbGVTZWxlY3Rpb259PjwvaW5wdXQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwidWkgaWNvbiBidXR0b24gdXBsb2FkQmx1ZXByaW50RmlsZVwiIG9uQ2xpY2s9e3RoaXMuX29wZW5GaWxlU2VsZWN0aW9ufT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImF0dGFjaCBpY29uXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBuYW1lPSdibHVlcHJpbnRGaWxlJyBpZD1cImJsdWVwcmludEZpbGVcIiBzdHlsZT17e1wiZGlzcGxheVwiOiBcIm5vbmVcIn19IG9uQ2hhbmdlPXt0aGlzLl91cGxvYWRGaWxlQ2hhbmdlZH0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHJlcXVpcmVkIG5hbWU9J2JsdWVwcmludE5hbWUnIGlkPSdibHVlcHJpbnROYW1lJyBwbGFjZWhvbGRlcj1cIkJsdWVwcmludCBuYW1lXCIgcmVxdWlyZWQvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT0nYmx1ZXByaW50RmlsZU5hbWUnIGlkPSdibHVlcHJpbnRGaWxlTmFtZScgcGxhY2Vob2xkZXI9XCJCbHVlcHJpbnQgZmlsZW5hbWUgZS5nLiBibHVlcHJpbnRcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgZXJyb3IgbWVzc2FnZVwiIHN0eWxlPXt7XCJkaXNwbGF5XCI6XCJub25lXCJ9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVhZGVyXCI+TWlzc2luZyBkYXRhPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD5QbGVhc2UgZmlsbCBpbiBhbGwgdGhlIHJlcXVpcmVkIGZpZWxkczwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUudXBsb2FkRXJyID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIGVycm9yIG1lc3NhZ2UgdXBsb2FkRmFpbGVkXCIgc3R5bGU9e3tcImRpc3BsYXlcIjpcImJsb2NrXCJ9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoZWFkZXJcIj5FcnJvciB1cGxvYWRpbmcgZmlsZTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD57dGhpcy5zdGF0ZS51cGxvYWRFcnJ9PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9J3N1Ym1pdCcgc3R5bGU9e3tcImRpc3BsYXlcIjogXCJub25lXCJ9fSBjbGFzc05hbWU9J3VwbG9hZEZvcm1TdWJtaXRCdG4nLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhY3Rpb25zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBjYW5jZWwgYmFzaWMgYnV0dG9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cInJlbW92ZSBpY29uXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDYW5jZWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIG9rIGdyZWVuICBidXR0b25cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwidXBsb2FkIGljb25cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFVwbG9hZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfTtcbn07XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkga2lubmVyZXR6aW4gb24gMDcvMDkvMjAxNi5cbiAqL1xuXG5pbXBvcnQgcmVuZGVyQmx1ZXByaW50c1RhYmxlIGZyb20gJy4vQmx1ZXByaW50c1RhYmxlJztcbmltcG9ydCByZW5kZXJVcGxvYWRCbHVlcHJpbnRNb2RhbCBmcm9tICcuL1VwbG9hZEJsdWVwcmludE1vZGFsJztcbmltcG9ydCBEZXBsb3lNb2RhbCBmcm9tICcuL0NyZWF0ZURlcGxveW1lbnRNb2RhbCc7XG5cbnZhciBCbHVlcHJpbnRzVGFibGUgPSBudWxsO1xudmFyIFVwbG9hZE1vZGFsID0gbnVsbDtcblxuU3RhZ2UuYWRkUGx1Z2luKHtcbiAgICBpZDogXCJibHVlcHJpbnRzXCIsXG4gICAgbmFtZTogXCJCbHVlcHJpbnRzIGxpc3RcIixcbiAgICBkZXNjcmlwdGlvbjogJ2JsYWggYmxhaCBibGFoJyxcbiAgICBpbml0aWFsV2lkdGg6IDgsXG4gICAgaW5pdGlhbEhlaWdodDogNSxcbiAgICBjb2xvciA6IFwiYmx1ZVwiLFxuICAgIGlzUmVhY3Q6IHRydWUsXG4gICAgaW5pdDogZnVuY3Rpb24ocGx1Z2luVXRpbHMpIHtcbiAgICAgICAgQmx1ZXByaW50c1RhYmxlID0gcmVuZGVyQmx1ZXByaW50c1RhYmxlKHBsdWdpblV0aWxzKTtcbiAgICAgICAgVXBsb2FkTW9kYWwgPSByZW5kZXJVcGxvYWRCbHVlcHJpbnRNb2RhbChwbHVnaW5VdGlscyk7XG4gICAgfSxcblxuICAgIGZldGNoRGF0YTogZnVuY3Rpb24ocGx1Z2luLGNvbnRleHQscGx1Z2luVXRpbHMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAocmVzb2x2ZSxyZWplY3QpID0+IHtcbiAgICAgICAgICAgIHBsdWdpblV0aWxzLmpRdWVyeS5nZXQoe1xuICAgICAgICAgICAgICAgIHVybDogY29udGV4dC5nZXRNYW5hZ2VyVXJsKCkgKyAnL2FwaS92Mi4xL2JsdWVwcmludHM/X2luY2x1ZGU9aWQsdXBkYXRlZF9hdCxjcmVhdGVkX2F0LGRlc2NyaXB0aW9uLHBsYW4nLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5kb25lKChibHVlcHJpbnRzKT0+IHtcblxuICAgICAgICAgICAgICAgICAgICBwbHVnaW5VdGlscy5qUXVlcnkuZ2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogY29udGV4dC5nZXRNYW5hZ2VyVXJsKCkgKyAnL2FwaS92Mi4xL2RlcGxveW1lbnRzP19pbmNsdWRlPWlkLGJsdWVwcmludF9pZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvbmUoKGRlcGxveW1lbnRzKT0+e1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlcENvdW50ID0gXy5jb3VudEJ5KGRlcGxveW1lbnRzLml0ZW1zLCdibHVlcHJpbnRfaWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDb3VudCBkZXBsb3ltZW50c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uZWFjaChibHVlcHJpbnRzLml0ZW1zLChibHVlcHJpbnQpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsdWVwcmludC5kZXBDb3VudCA9IGRlcENvdW50W2JsdWVwcmludC5pZF0gfHwgMDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShibHVlcHJpbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmFpbChyZWplY3QpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmZhaWwocmVqZWN0KVxuICAgICAgICB9KTtcbiAgICB9LFxuXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKHdpZGdldCxkYXRhLGVycm9yLGNvbnRleHQscGx1Z2luVXRpbHMpIHtcblxuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiBwbHVnaW5VdGlscy5yZW5kZXJSZWFjdExvYWRpbmcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIHBsdWdpblV0aWxzLnJlbmRlclJlYWN0RXJyb3IoZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNlbGVjdGVkQmx1ZXByaW50ID0gY29udGV4dC5nZXRWYWx1ZSgnYmx1ZXByaW50SWQnKTtcbiAgICAgICAgdmFyIGZvcm1hdHRlZERhdGEgPSBPYmplY3QuYXNzaWduKHt9LGRhdGEse1xuICAgICAgICAgICAgaXRlbXM6IF8ubWFwIChkYXRhLml0ZW1zLChpdGVtKT0+e1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LGl0ZW0se1xuICAgICAgICAgICAgICAgICAgICBjcmVhdGVkX2F0OiBwbHVnaW5VdGlscy5tb21lbnQoaXRlbS5jcmVhdGVkX2F0LCdZWVlZLU1NLUREIEhIOm1tOnNzLlNTU1NTJykuZm9ybWF0KCdERC1NTS1ZWVlZIEhIOm1tJyksIC8vMjAxNi0wNy0yMCAwOToxMDo1My4xMDM1NzlcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlZF9hdDogcGx1Z2luVXRpbHMubW9tZW50KGl0ZW0udXBkYXRlZF9hdCwnWVlZWS1NTS1ERCBISDptbTpzcy5TU1NTUycpLmZvcm1hdCgnREQtTU0tWVlZWSBISDptbScpLFxuICAgICAgICAgICAgICAgICAgICBpc1NlbGVjdGVkOiBzZWxlY3RlZEJsdWVwcmludCA9PT0gaXRlbS5pZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8Qmx1ZXByaW50c1RhYmxlIHdpZGdldD17d2lkZ2V0fSBkYXRhPXtmb3JtYXR0ZWREYXRhfSBjb250ZXh0PXtjb250ZXh0fSB1dGlscz17cGx1Z2luVXRpbHN9Lz5cbiAgICAgICAgICAgICAgICA8VXBsb2FkTW9kYWwgd2lkZ2V0PXt3aWRnZXR9IGRhdGE9e2Zvcm1hdHRlZERhdGF9IGNvbnRleHQ9e2NvbnRleHR9IHV0aWxzPXtwbHVnaW5VdGlsc30vPlxuICAgICAgICAgICAgICAgIDxEZXBsb3lNb2RhbCB3aWRnZXQ9e3dpZGdldH0gZGF0YT17Zm9ybWF0dGVkRGF0YX0gY29udGV4dD17Y29udGV4dH0gdXRpbHM9e3BsdWdpblV0aWxzfS8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59KTsiXX0=
