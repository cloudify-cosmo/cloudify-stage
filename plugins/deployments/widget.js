(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ExecuteWorkflow = require('./ExecuteWorkflow');

var _ExecuteWorkflow2 = _interopRequireDefault(_ExecuteWorkflow);

var _WorkflowParametersModal = require('./WorkflowParametersModal');

var _WorkflowParametersModal2 = _interopRequireDefault(_WorkflowParametersModal);

var _actions = require('./actions');

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by kinneretzin on 18/10/2016.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var _class = function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class(props, context) {
        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props, context));

        _this.state = {
            confirmDelete: false,
            showExecuteModal: false
        };
        return _this;
    }

    _createClass(_class, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.props.context.getEventBus().on('deployments:refresh', this._refreshData, this);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.props.context.getEventBus().off('deployments:refresh', this._refreshData);
        }
    }, {
        key: '_initDropdown',
        value: function _initDropdown(dropdown) {
            var thi$ = this;
            $(dropdown).dropdown({
                onChange: function onChange(value, text, $choice) {
                    thi$.props.context.setValue('filterDep' + thi$.props.widget.id, value);
                }
            });

            var filter = this.props.context.getValue('filterDep' + this.props.widget.id);
            if (filter) {
                $(dropdown).dropdown('set selected', filter);
            }
        }
    }, {
        key: '_selectDeployment',
        value: function _selectDeployment(item) {
            this.props.context.setValue('deploymentId', item.id);
            var drillDownConfig = this.props.widget.configuration ? _.find(this.props.widget.configuration, { id: 'clickToDrillDown' }) : {};
            if (drillDownConfig && drillDownConfig.value === 'true') {
                this.props.context.drillDown(this.props.widget, 'deployment');
            }
        }
    }, {
        key: '_deleteDeploymentConfirm',
        value: function _deleteDeploymentConfirm(item, event) {
            event.stopPropagation();

            this.setState({
                confirmDelete: true,
                deleteDep: item
            });
        }
    }, {
        key: '_deleteDeployment',
        value: function _deleteDeployment() {
            var _this2 = this;

            if (!this.state.deleteDep) {
                this.setState({ error: 'Something went wrong, no deployment was selected for delete' });
                return;
            }

            var actions = new _actions2.default(this.props.context);

            actions.delete(this.state.deleteDep).then(function () {
                _this2.setState({ confirmDelete: false, deleteDep: null });
                _this2.props.context.getEventBus().trigger('deployments:refresh');
            }).catch(function (err) {
                _this2.setState({ confirmDelete: false, deleteDep: null });
                _this2.setState({ error: err });
            });
        }
    }, {
        key: '_refreshData',
        value: function _refreshData() {
            this.props.context.refresh();
        }
    }, {
        key: '_showExecuteWorkflowModal',
        value: function _showExecuteWorkflowModal(deployment, workflow) {
            this.setState({
                showExecuteModal: true,
                executeDep: deployment,
                executeWorkflow: workflow
            });
        }
    }, {
        key: '_hideExecuteWorkflowModal',
        value: function _hideExecuteWorkflowModal() {
            this.setState({
                showExecuteModal: false,
                executeDep: null,
                executeWorkflow: null
            });
        }
    }, {
        key: '_executeWorkflow',
        value: function _executeWorkflow(deployment, workflow, params) {
            var _this3 = this;

            var actions = new _actions2.default(this.props.context);

            actions.execute(deployment, workflow, params).then(function () {
                _this3._hideExecuteWorkflowModal();
                _this3.props.context.getEventBus().trigger('executions:refresh');
            }).catch(function (err) {
                _this3.setState({ error: err });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

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
                    'div',
                    null,
                    React.createElement(
                        'div',
                        { className: 'ui selection dropdown fluid', ref: this._initDropdown.bind(this) },
                        React.createElement('input', { type: 'hidden', name: 'statusFilter' }),
                        React.createElement(
                            'div',
                            { className: 'default text' },
                            'Filter by status'
                        ),
                        React.createElement('i', { className: 'dropdown icon' }),
                        React.createElement(
                            'div',
                            { className: 'menu' },
                            React.createElement(
                                'div',
                                { className: 'item', 'data-value': 'ok' },
                                React.createElement('i', { className: 'check circle icon inverted green' }),
                                'OK'
                            ),
                            React.createElement(
                                'div',
                                { className: 'item', 'data-value': 'error' },
                                React.createElement('i', { className: 'remove circle icon inverted red' }),
                                'Error'
                            )
                        )
                    )
                ),
                React.createElement(
                    'table',
                    { className: 'ui very compact table deploymentTable' },
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
                                'Blueprint'
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
                                'Status'
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
                                { key: item.id, className: 'row ' + (item.isSelected ? 'active' : ''), onClick: _this4._selectDeployment.bind(_this4, item) },
                                React.createElement(
                                    'td',
                                    null,
                                    React.createElement(
                                        'div',
                                        null,
                                        React.createElement(
                                            'a',
                                            { className: 'deploymentName', href: 'javascript:void(0)' },
                                            item.id
                                        )
                                    )
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    item.blueprint_id
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
                                    item.status === 'ok' ? React.createElement('i', { className: 'check circle icon inverted green' }) : React.createElement('i', { className: 'remove circle icon inverted red' })
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    React.createElement(
                                        'div',
                                        { className: 'rowActions' },
                                        React.createElement(_ExecuteWorkflow2.default, { item: item, onWorkflowSelected: _this4._showExecuteWorkflowModal.bind(_this4) }),
                                        React.createElement('i', { className: 'write icon link bordered', title: 'Edit deployment' }),
                                        React.createElement('i', { className: 'trash icon link bordered', title: 'Delete deployment', onClick: _this4._deleteDeploymentConfirm.bind(_this4, item) })
                                    )
                                )
                            );
                        })
                    )
                ),
                React.createElement(Confirm, { title: 'Are you sure you want to remove this deployment?',
                    show: this.state.confirmDelete,
                    onConfirm: this._deleteDeployment.bind(this),
                    onCancel: function onCancel() {
                        return _this4.setState({ confirmDelete: false });
                    } }),
                React.createElement(_WorkflowParametersModal2.default, {
                    show: this.state.showExecuteModal,
                    deployment: this.state.executeDep,
                    workflow: this.state.executeWorkflow,
                    onExecute: this._executeWorkflow.bind(this),
                    onCancel: this._hideExecuteWorkflowModal.bind(this) })
            );
        }
    }]);

    return _class;
}(React.Component);

exports.default = _class;

},{"./ExecuteWorkflow":2,"./WorkflowParametersModal":3,"./actions":4}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by kinneretzin on 19/10/2016.
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
        key: "onSelectWorkflow",
        value: function onSelectWorkflow(value, text, $choice) {
            var workflow = _.find(this.props.item.workflows, { name: value });
            console.log('selected workflow ' + value, workflow);

            this.props.onWorkflowSelected(this.props.item, workflow);
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            return React.createElement(
                "div",
                { className: "ui dropdown top right pointing", ref: function ref(dropdown) {
                        return $(dropdown).dropdown({ onChange: _this2.onSelectWorkflow.bind(_this2) });
                    }, onClick: function onClick(e) {
                        return e.stopPropagation();
                    } },
                React.createElement("i", { className: "road icon link bordered", title: "Execute workflow" }),
                React.createElement(
                    "div",
                    { className: "menu" },
                    this.props.item.workflows.map(function (workflow) {
                        return React.createElement(
                            "div",
                            { key: workflow.name, className: "item" },
                            workflow.name
                        );
                    })
                )
            );
        }
    }]);

    return _class;
}(React.Component);

exports.default = _class;

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
 * Created by kinneretzin on 19/10/2016.
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
            $(this.refs.submitExecuteBtn).click();
            return false;
        }
    }, {
        key: '_execute',
        value: function _execute() {
            if (!this.props.deployment || !this.props.workflow) {
                this.setState({ error: 'Missing workflow or deployment' });
                return false;
            }

            var params = {};

            $(this.refs.executeForm).find('[name=executeInput]').each(function (index, input) {
                var input = $(input);
                params[input.data('name')] = input.val();
            });

            this.props.onExecute && this.props.onExecute(this.props.deployment, this.props.workflow, params);

            return false;
        }
    }, {
        key: 'onDeny',
        value: function onDeny() {
            //this.props.context.setValue(this.props.widget.id + 'createDeploy',null);
            this.props.onCancel && this.props.onCancel();
            return true;
        }
    }, {
        key: '_submitExecute',
        value: function _submitExecute(e) {
            e.preventDefault();

            this._execute();

            return false;
        }
    }, {
        key: 'render',
        value: function render() {
            if (!this.props.show || !this.props.workflow) {
                return React.createElement('div', { className: 'executeModalContainer' });
            }

            var Modal = Stage.Basic.Modal;
            var Header = Stage.Basic.ModalHeader;
            var Body = Stage.Basic.ModalBody;
            var Footer = Stage.Basic.ModalFooter;

            return React.createElement(
                'div',
                { className: 'executeModalContainer' },
                React.createElement(
                    Modal,
                    { show: this.props.show, className: 'executeModal', onDeny: this.onDeny.bind(this), onApprove: this.onApprove.bind(this) },
                    React.createElement(
                        Header,
                        null,
                        React.createElement('i', { className: 'road icon' }),
                        ' Execute workflow ',
                        this.props.workflow.name
                    ),
                    React.createElement(
                        Body,
                        null,
                        React.createElement(
                            'form',
                            { className: 'ui form executeForm', onSubmit: this._submitExecute.bind(this), action: '', ref: 'executeForm' },
                            _.map(this.props.workflow.parameters, function (parameter, name) {
                                return React.createElement(
                                    'div',
                                    { className: 'field', key: name },
                                    React.createElement(
                                        'label',
                                        { title: parameter.description || name },
                                        name
                                    ),
                                    React.createElement('input', { name: 'executeInput', 'data-name': name, type: 'text', defaultValue: parameter.default })
                                );
                            }),
                            this.state.error ? React.createElement(
                                'div',
                                { className: 'ui error message executeFailed', style: { "display": "block" } },
                                React.createElement(
                                    'div',
                                    { className: 'header' },
                                    'Error executing blueprint'
                                ),
                                React.createElement(
                                    'p',
                                    null,
                                    this.state.error
                                )
                            ) : '',
                            React.createElement('input', { type: 'submit', style: { "display": "none" }, ref: 'submitExecuteBtn' })
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
                            'Execute'
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

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by kinneretzin on 19/10/2016.
 */

var _class = function () {
    function _class(context) {
        _classCallCheck(this, _class);

        this.context = context;
    }

    _createClass(_class, [{
        key: "delete",
        value: function _delete(deployment) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: _this.context.getManagerUrl() + '/api/v2.1/deployments/' + deployment.id,
                    "headers": { "content-type": "application/json" },
                    method: 'delete'
                }).done(function () {
                    resolve();
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    reject(jqXHR.responseJSON && jqXHR.responseJSON.message ? jqXHR.responseJSON.message : errorThrown);
                });
            });
        }
    }, {
        key: "update",
        value: function update() {}
    }, {
        key: "execute",
        value: function execute(deployment, workflow, params) {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: _this2.context.getManagerUrl() + '/api/v2.1/executions',
                    "headers": { "content-type": "application/json" },
                    method: 'post',
                    data: JSON.stringify({
                        'deployment_id': deployment.id,
                        'workflow_id': workflow.name,
                        parameters: params
                    })
                }).done(function (execution) {
                    resolve(execution);
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    reject(jqXHR.responseJSON && jqXHR.responseJSON.message ? jqXHR.responseJSON.message : errorThrown);
                });
            });
        }
    }]);

    return _class;
}();

exports.default = _class;

},{}],5:[function(require,module,exports){
'use strict';

var _DeploymentsTable = require('./DeploymentsTable');

var _DeploymentsTable2 = _interopRequireDefault(_DeploymentsTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Stage.addPlugin({
    id: "deployments",
    name: 'Blueprint deployments',
    description: 'blah blah blah',
    initialWidth: 8,
    initialHeight: 6,
    color: "purple",
    fetchUrl: '[manager]/api/v2.1/deployments',
    initialConfiguration: [{ id: "clickToDrillDown", name: "Should click to drilldown", placeHolder: "True of false to click to drill down", default: "true" }, { id: "blueprintIdFilter", name: "Blueprint ID to filter by", placeHolder: "Enter the blueprint id you wish to filter by" }],
    isReact: true,

    render: function render(widget, data, error, context, pluginUtils) {

        if (!data) {
            return pluginUtils.renderReactLoading();
        }

        if (error) {
            return pluginUtils.renderReactError(error);
        }

        var formattedData = Object.assign({}, data);
        var blueprintId = context.getValue('blueprintId');
        var deploymentId = context.getValue('deploymentId');

        // Find if we have a config for blueprint selection
        var blueprintIdFilter = widget.configuration ? _.find(widget.configuration, { id: 'blueprintIdFilter' }) : {};
        if (blueprintIdFilter && blueprintIdFilter.value) {
            blueprintId = blueprintIdFilter.value;
        }

        var filter = context.getValue('filterDep' + widget.id);
        if (blueprintId) {
            formattedData.items = _.filter(data.items, { blueprint_id: blueprintId });
        }

        formattedData = Object.assign({}, formattedData, {
            items: _.map(formattedData.items, function (item) {
                return Object.assign({}, item, {
                    created_at: pluginUtils.moment(item.created_at, 'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'), //2016-07-20 09:10:53.103579
                    updated_at: pluginUtils.moment(item.updated_at, 'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'),
                    status: item.status || 'ok',
                    isSelected: deploymentId === item.id
                });
            })
        });

        if (filter) {
            formattedData.items = _.filter(formattedData.items, { status: filter });
        }

        formattedData.blueprintId = blueprintId;

        return React.createElement(
            'div',
            null,
            React.createElement(_DeploymentsTable2.default, { widget: widget, data: formattedData, context: context, utils: pluginUtils })
        );
    }
}); /**
     * Created by kinneretzin on 07/09/2016.
     */

},{"./DeploymentsTable":1}]},{},[4,1,2,5,3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwbHVnaW5zL2RlcGxveW1lbnRzL3NyYy9EZXBsb3ltZW50c1RhYmxlLmpzIiwicGx1Z2lucy9kZXBsb3ltZW50cy9zcmMvRXhlY3V0ZVdvcmtmbG93LmpzIiwicGx1Z2lucy9kZXBsb3ltZW50cy9zcmMvV29ya2Zsb3dQYXJhbWV0ZXJzTW9kYWwuanMiLCJwbHVnaW5zL2RlcGxveW1lbnRzL3NyYy9hY3Rpb25zLmpzIiwicGx1Z2lucy9kZXBsb3ltZW50cy9zcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUNJQTs7OztBQUNBOzs7O0FBRUE7Ozs7Ozs7Ozs7K2VBUEE7Ozs7Ozs7QUFVSSxvQkFBWSxLQUFaLEVBQWtCLE9BQWxCLEVBQTJCO0FBQUE7O0FBQUEsb0hBQ2pCLEtBRGlCLEVBQ1gsT0FEVzs7QUFHdkIsY0FBSyxLQUFMLEdBQWE7QUFDVCwyQkFBYyxLQURMO0FBRVQsOEJBQWtCO0FBRlQsU0FBYjtBQUh1QjtBQU8xQjs7Ozs0Q0FFbUI7QUFDaEIsaUJBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsV0FBbkIsR0FBaUMsRUFBakMsQ0FBb0MscUJBQXBDLEVBQTBELEtBQUssWUFBL0QsRUFBNEUsSUFBNUU7QUFDSDs7OytDQUVzQjtBQUNuQixpQkFBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixXQUFuQixHQUFpQyxHQUFqQyxDQUFxQyxxQkFBckMsRUFBMkQsS0FBSyxZQUFoRTtBQUNIOzs7c0NBRWEsUSxFQUFVO0FBQ3BCLGdCQUFJLE9BQU8sSUFBWDtBQUNBLGNBQUUsUUFBRixFQUFZLFFBQVosQ0FBcUI7QUFDakIsMEJBQVUsa0JBQUMsS0FBRCxFQUFRLElBQVIsRUFBYyxPQUFkLEVBQTBCO0FBQ2hDLHlCQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLFFBQW5CLENBQTRCLGNBQVksS0FBSyxL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WTtBQUNSLDBCQUFjLEtBQWQsR0FBc0IsRUFBRSxNQUFGLENBQVMsY0FBYyxLQUF2QixFQUE2QixFQUFDLFFBQU8sTUFBUixFQUE3QixDQUF0QjtBQUNIOztBQUVELHNCQUFjLFdBQWQsR0FBNEIsV0FBNUI7O0FBRUEsZUFDSTtBQUFBO0FBQUE7QUFDSSw4REFBa0IsUUFBUSxNQUExQixFQUFrQyxNQUFNLGFBQXhDLEVBQXVELFNBQVMsT0FBaEUsRUFBeUUsT0FBTyxXQUFoRjtBQURKLFNBREo7QUFLSDtBQWhFVyxDQUFoQixFLENBTkEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGtpbm5lcmV0emluIG9uIDE4LzEwLzIwMTYuXG4gKi9cblxuaW1wb3J0IEV4ZWN1dGVXb3JrZmxvdyBmcm9tICcuL0V4ZWN1dGVXb3JrZmxvdyc7XG5pbXBvcnQgRXhlY3V0ZU1vZGFsIGZyb20gJy4vV29ya2Zsb3dQYXJhbWV0ZXJzTW9kYWwnO1xuXG5pbXBvcnQgQWN0aW9ucyBmcm9tICcuL2FjdGlvbnMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMsY29udGV4dCkge1xuICAgICAgICBzdXBlcihwcm9wcyxjb250ZXh0KTtcblxuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgY29uZmlybURlbGV0ZTpmYWxzZSxcbiAgICAgICAgICAgIHNob3dFeGVjdXRlTW9kYWw6IGZhbHNlXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LmdldEV2ZW50QnVzKCkub24oJ2RlcGxveW1lbnRzOnJlZnJlc2gnLHRoaXMuX3JlZnJlc2hEYXRhLHRoaXMpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQuZ2V0RXZlbnRCdXMoKS5vZmYoJ2RlcGxveW1lbnRzOnJlZnJlc2gnLHRoaXMuX3JlZnJlc2hEYXRhKTtcbiAgICB9XG5cbiAgICBfaW5pdERyb3Bkb3duKGRyb3Bkb3duKSB7XG4gICAgICAgIHZhciB0aGkkID0gdGhpcztcbiAgICAgICAgJChkcm9wZG93bikuZHJvcGRvd24oe1xuICAgICAgICAgICAgb25DaGFuZ2U6ICh2YWx1ZSwgdGV4dCwgJGNob2ljZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaSQucHJvcHMuY29udGV4dC5zZXRWYWx1ZSgnZmlsdGVyRGVwJyt0aGkkLnByb3BzLndpZGdldC5pZCx2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBmaWx0ZXIgPSB0aGlzLnByb3BzLmNvbnRleHQuZ2V0VmFsdWUoJ2ZpbHRlckRlcCcrdGhpcy5wcm9wcy53aWRnZXQuaWQpO1xuICAgICAgICBpZiAoZmlsdGVyKSB7XG4gICAgICAgICAgICAkKGRyb3Bkb3duKS5kcm9wZG93bignc2V0IHNlbGVjdGVkJyxmaWx0ZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3NlbGVjdERlcGxveW1lbnQoaXRlbSkge1xuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQuc2V0VmFsdWUoJ2RlcGxveW1lbnRJZCcsaXRlbS5pZCk7XG4gICAgICAgIHZhciBkcmlsbERvd25Db25maWcgPSB0aGlzLnByb3BzLndpZGdldC5jb25maWd1cmF0aW9uID8gXy5maW5kKHRoaXMucHJvcHMud2lkZ2V0LmNvbmZpZ3VyYXRpb24se2lkOidjbGlja1RvRHJpbGxEb3duJ30pIDoge307XG4gICAgICAgIGlmIChkcmlsbERvd25Db25maWcgJiYgZHJpbGxEb3duQ29uZmlnLnZhbHVlID09PSAndHJ1ZScpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5kcmlsbERvd24odGhpcy5wcm9wcy53aWRnZXQsJ2RlcGxveW1lbnQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9kZWxldGVEZXBsb3ltZW50Q29uZmlybShpdGVtLGV2ZW50KXtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBjb25maXJtRGVsZXRlIDogdHJ1ZSxcbiAgICAgICAgICAgIGRlbGV0ZURlcDogaXRlbVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBfZGVsZXRlRGVwbG95bWVudCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmRlbGV0ZURlcCkge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7ZXJyb3I6ICdTb21ldGhpbmcgd2VudCB3cm9uZywgbm8gZGVwbG95bWVudCB3YXMgc2VsZWN0ZWQgZm9yIGRlbGV0ZSd9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhY3Rpb25zID0gbmV3IEFjdGlvbnModGhpcy5wcm9wcy5jb250ZXh0KTtcblxuICAgICAgICBhY3Rpb25zLmRlbGV0ZSh0aGlzLnN0YXRlLmRlbGV0ZURlcCkudGhlbigoKT0+e1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7Y29uZmlybURlbGV0ZTogZmFsc2UsZGVsZXRlRGVwOm51bGx9KTtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5nZXRFdmVudEJ1cygpLnRyaWdnZXIoJ2RlcGxveW1lbnRzOnJlZnJlc2gnKTtcbiAgICAgICAgfSkuY2F0Y2goKGVycik9PntcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2NvbmZpcm1EZWxldGU6IGZhbHNlLGRlbGV0ZURlcDogbnVsbH0pO1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7ZXJyb3I6IGVycn0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBfcmVmcmVzaERhdGEoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5yZWZyZXNoKCk7XG4gICAgfVxuXG4gICAgX3Nob3dFeGVjdXRlV29ya2Zsb3dNb2RhbCAoZGVwbG95bWVudCx3b3JrZmxvdykge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHNob3dFeGVjdXRlTW9kYWw6IHRydWUsXG4gICAgICAgICAgICBleGVjdXRlRGVwOiBkZXBsb3ltZW50LFxuICAgICAgICAgICAgZXhlY3V0ZVdvcmtmbG93OiB3b3JrZmxvd1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBfaGlkZUV4ZWN1dGVXb3JrZmxvd01vZGFsKCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHNob3dFeGVjdXRlTW9kYWw6IGZhbHNlLFxuICAgICAgICAgICAgZXhlY3V0ZURlcDogbnVsbCxcbiAgICAgICAgICAgIGV4ZWN1dGVXb3JrZmxvdzogbnVsbFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgX2V4ZWN1dGVXb3JrZmxvdyhkZXBsb3ltZW50LHdvcmtmbG93LHBhcmFtcykge1xuICAgICAgICB2YXIgYWN0aW9ucyA9IG5ldyBBY3Rpb25zKHRoaXMucHJvcHMuY29udGV4dCk7XG5cbiAgICAgICAgYWN0aW9ucy5leGVjdXRlKGRlcGxveW1lbnQsd29ya2Zsb3cscGFyYW1zKS50aGVuKCgpPT57XG4gICAgICAgICAgICB0aGlzLl9oaWRlRXhlY3V0ZVdvcmtmbG93TW9kYWwoKTtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5nZXRFdmVudEJ1cygpLnRyaWdnZXIoJ2V4ZWN1dGlvbnM6cmVmcmVzaCcpO1xuICAgICAgICB9KS5jYXRjaCgoZXJyKT0+e1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7ZXJyb3I6IGVycn0pO1xuICAgICAgICB9KVxuICAgIH1cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHZhciBDb25maXJtID0gU3RhZ2UuQmFzaWMuQ29uZmlybTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuZXJyb3IgP1xuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBlcnJvciBtZXNzYWdlXCIgc3R5bGU9e3tcImRpc3BsYXlcIjpcImJsb2NrXCJ9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhlYWRlclwiPkVycm9yIE9jY3VyZWQ8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD57dGhpcy5zdGF0ZS5lcnJvcn08L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICcnXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBzZWxlY3Rpb24gZHJvcGRvd24gZmx1aWRcIiByZWY9e3RoaXMuX2luaXREcm9wZG93bi5iaW5kKHRoaXMpfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cInN0YXR1c0ZpbHRlclwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVmYXVsdCB0ZXh0XCI+RmlsdGVyIGJ5IHN0YXR1czwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZHJvcGRvd24gaWNvblwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVudVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaXRlbVwiIGRhdGEtdmFsdWU9XCJva1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJjaGVjayBjaXJjbGUgaWNvbiBpbnZlcnRlZCBncmVlblwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT0tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIml0ZW1cIiBkYXRhLXZhbHVlPVwiZXJyb3JcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwicmVtb3ZlIGNpcmNsZSBpY29uIGludmVydGVkIHJlZFwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRXJyb3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJ1aSB2ZXJ5IGNvbXBhY3QgdGFibGUgZGVwbG95bWVudFRhYmxlXCI+XG4gICAgICAgICAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk5hbWU8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkJsdWVwcmludDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+Q3JlYXRlZDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+VXBkYXRlZDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+U3RhdHVzPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aC8+XG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5kYXRhLml0ZW1zLm1hcCgoaXRlbSk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHIga2V5PXtpdGVtLmlkfSBjbGFzc05hbWU9eydyb3cgJyArIChpdGVtLmlzU2VsZWN0ZWQgPyAnYWN0aXZlJyA6ICcnKX0gb25DbGljaz17dGhpcy5fc2VsZWN0RGVwbG95bWVudC5iaW5kKHRoaXMsaXRlbSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT0nZGVwbG95bWVudE5hbWUnIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj57aXRlbS5pZH08L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPntpdGVtLmJsdWVwcmludF9pZH08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPntpdGVtLmNyZWF0ZWRfYXR9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57aXRlbS51cGRhdGVkX2F0fTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBpdGVtLnN0YXR1cyA9PT0gJ29rJyA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImNoZWNrIGNpcmNsZSBpY29uIGludmVydGVkIGdyZWVuXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cInJlbW92ZSBjaXJjbGUgaWNvbiBpbnZlcnRlZCByZWRcIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93QWN0aW9uc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8RXhlY3V0ZVdvcmtmbG93IGl0ZW09e2l0ZW19IG9uV29ya2Zsb3dTZWxlY3RlZD17dGhpcy5fc2hvd0V4ZWN1dGVXb3JrZmxvd01vZGFsLmJpbmQodGhpcyl9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwid3JpdGUgaWNvbiBsaW5rIGJvcmRlcmVkXCIgdGl0bGU9XCJFZGl0IGRlcGxveW1lbnRcIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cInRyYXNoIGljb24gbGluayBib3JkZXJlZFwiIHRpdGxlPVwiRGVsZXRlIGRlcGxveW1lbnRcIiBvbkNsaWNrPXt0aGlzLl9kZWxldGVEZXBsb3ltZW50Q29uZmlybS5iaW5kKHRoaXMsaXRlbSl9PjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgICAgIDxDb25maXJtIHRpdGxlPSdBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcmVtb3ZlIHRoaXMgZGVwbG95bWVudD8nXG4gICAgICAgICAgICAgICAgICAgICAgICAgc2hvdz17dGhpcy5zdGF0ZS5jb25maXJtRGVsZXRlfVxuICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ29uZmlybT17dGhpcy5fZGVsZXRlRGVwbG95bWVudC5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2FuY2VsPXsoKT0+dGhpcy5zZXRTdGF0ZSh7Y29uZmlybURlbGV0ZSA6IGZhbHNlfSl9IC8+XG4gICAgICAgICAgICAgICAgPEV4ZWN1dGVNb2RhbFxuICAgICAgICAgICAgICAgICAgICBzaG93PXt0aGlzLnN0YXRlLnNob3dFeGVjdXRlTW9kYWx9XG4gICAgICAgICAgICAgICAgICAgIGRlcGxveW1lbnQ9e3RoaXMuc3RhdGUuZXhlY3V0ZURlcH1cbiAgICAgICAgICAgICAgICAgICAgd29ya2Zsb3c9e3RoaXMuc3RhdGUuZXhlY3V0ZVdvcmtmbG93fVxuICAgICAgICAgICAgICAgICAgICBvbkV4ZWN1dGU9e3RoaXMuX2V4ZWN1dGVXb3JrZmxvdy5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgICAgICBvbkNhbmNlbD17dGhpcy5faGlkZUV4ZWN1dGVXb3JrZmxvd01vZGFsLmJpbmQodGhpcyl9Lz5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICk7XG4gICAgfVxufVxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGtpbm5lcmV0emluIG9uIDE5LzEwLzIwMTYuXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzLGNvbnRleHQpIHtcbiAgICAgICAgc3VwZXIocHJvcHMsY29udGV4dCk7XG5cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uU2VsZWN0V29ya2Zsb3codmFsdWUsIHRleHQsICRjaG9pY2UpIHtcbiAgICAgICAgdmFyIHdvcmtmbG93ID0gXy5maW5kKCB0aGlzLnByb3BzLml0ZW0ud29ya2Zsb3dzLHtuYW1lOiB2YWx1ZX0pO1xuICAgICAgICBjb25zb2xlLmxvZygnc2VsZWN0ZWQgd29ya2Zsb3cgJysgdmFsdWUsd29ya2Zsb3cpO1xuXG4gICAgICAgIHRoaXMucHJvcHMub25Xb3JrZmxvd1NlbGVjdGVkKHRoaXMucHJvcHMuaXRlbSx3b3JrZmxvdyk7XG4gICAgfVxuXG4gICAgcmVuZGVyICgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgZHJvcGRvd24gdG9wIHJpZ2h0IHBvaW50aW5nXCIgcmVmPXsoZHJvcGRvd24pPT4kKGRyb3Bkb3duKS5kcm9wZG93bih7b25DaGFuZ2U6IHRoaXMub25TZWxlY3RXb3JrZmxvdy5iaW5kKHRoaXMpfSl9IG9uQ2xpY2s9eyhlKT0+ZS5zdG9wUHJvcGFnYXRpb24oKX0+XG4gICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwicm9hZCBpY29uIGxpbmsgYm9yZGVyZWRcIiB0aXRsZT1cIkV4ZWN1dGUgd29ya2Zsb3dcIj48L2k+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZW51XCI+XG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuaXRlbS53b3JrZmxvd3MubWFwKCh3b3JrZmxvdyk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gPGRpdiBrZXk9e3dvcmtmbG93Lm5hbWV9IGNsYXNzTmFtZT1cIml0ZW1cIj57d29ya2Zsb3cubmFtZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICk7XG4gICAgfVxufVxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGtpbm5lcmV0emluIG9uIDE5LzEwLzIwMTYuXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMsY29udGV4dCkge1xuICAgICAgICBzdXBlcihwcm9wcyxjb250ZXh0KTtcblxuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgZXJyb3I6IG51bGxcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uQXBwcm92ZSAoKSB7XG4gICAgICAgICQodGhpcy5yZWZzLnN1Ym1pdEV4ZWN1dGVCdG4pLmNsaWNrKCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBfZXhlY3V0ZSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnByb3BzLmRlcGxveW1lbnQgfHwgIXRoaXMucHJvcHMud29ya2Zsb3cpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2Vycm9yOiAnTWlzc2luZyB3b3JrZmxvdyBvciBkZXBsb3ltZW50J30pO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHBhcmFtcyA9IHt9O1xuXG4gICAgICAgICQodGhpcy5yZWZzLmV4ZWN1dGVGb3JtKS5maW5kKCdbbmFtZT1leGVjdXRlSW5wdXRdJykuZWFjaCgoaW5kZXgsaW5wdXQpPT57XG4gICAgICAgICAgICB2YXIgaW5wdXQgPSAkKGlucHV0KTtcbiAgICAgICAgICAgIHBhcmFtc1tpbnB1dC5kYXRhKCduYW1lJyldID0gaW5wdXQudmFsKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucHJvcHMub25FeGVjdXRlICYmIHRoaXMucHJvcHMub25FeGVjdXRlKHRoaXMucHJvcHMuZGVwbG95bWVudCx0aGlzLnByb3BzLndvcmtmbG93LHBhcmFtcyk7XG5cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgb25EZW55ICgpIHtcbiAgICAgICAgLy90aGlzLnByb3BzLmNvbnRleHQuc2V0VmFsdWUodGhpcy5wcm9wcy53aWRnZXQuaWQgKyAnY3JlYXRlRGVwbG95JyxudWxsKTtcbiAgICAgICAgdGhpcy5wcm9wcy5vbkNhbmNlbCAmJiB0aGlzLnByb3BzLm9uQ2FuY2VsKCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIF9zdWJtaXRFeGVjdXRlIChlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICB0aGlzLl9leGVjdXRlKCk7XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGlmICghdGhpcy5wcm9wcy5zaG93IHx8ICF0aGlzLnByb3BzLndvcmtmbG93KSB7XG4gICAgICAgICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9J2V4ZWN1dGVNb2RhbENvbnRhaW5lcicvPjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBNb2RhbCA9IFN0YWdlLkJhc2ljLk1vZGFsO1xuICAgICAgICB2YXIgSGVhZGVyID0gU3RhZ2UuQmFzaWMuTW9kYWxIZWFkZXI7XG4gICAgICAgIHZhciBCb2R5ID0gU3RhZ2UuQmFzaWMuTW9kYWxCb2R5O1xuICAgICAgICB2YXIgRm9vdGVyID0gU3RhZ2UuQmFzaWMuTW9kYWxGb290ZXI7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdleGVjdXRlTW9kYWxDb250YWluZXInPlxuICAgICAgICAgICAgICAgIDxNb2RhbCBzaG93PXt0aGlzLnByb3BzLnNob3d9IGNsYXNzTmFtZT0nZXhlY3V0ZU1vZGFsJyBvbkRlbnk9e3RoaXMub25EZW55LmJpbmQodGhpcyl9IG9uQXBwcm92ZT17dGhpcy5vbkFwcHJvdmUuYmluZCh0aGlzKX0+XG4gICAgICAgICAgICAgICAgICAgIDxIZWFkZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJyb2FkIGljb25cIj48L2k+IEV4ZWN1dGUgd29ya2Zsb3cge3RoaXMucHJvcHMud29ya2Zsb3cubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgPC9IZWFkZXI+XG5cbiAgICAgICAgICAgICAgICAgICAgPEJvZHk+XG4gICAgICAgICAgICAgICAgICAgIDxmb3JtIGNsYXNzTmFtZT1cInVpIGZvcm0gZXhlY3V0ZUZvcm1cIiBvblN1Ym1pdD17dGhpcy5fc3VibWl0RXhlY3V0ZS5iaW5kKHRoaXMpfSBhY3Rpb249XCJcIiByZWY9J2V4ZWN1dGVGb3JtJz5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLm1hcCh0aGlzLnByb3BzLndvcmtmbG93LnBhcmFtZXRlcnMsKHBhcmFtZXRlcixuYW1lKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZFwiIGtleT17bmFtZX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHRpdGxlPXtwYXJhbWV0ZXIuZGVzY3JpcHRpb24gfHwgbmFtZSB9PntuYW1lfTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IG5hbWU9J2V4ZWN1dGVJbnB1dCcgZGF0YS1uYW1lPXtuYW1lfSB0eXBlPVwidGV4dFwiIGRlZmF1bHRWYWx1ZT17cGFyYW1ldGVyLmRlZmF1bHR9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmVycm9yID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBlcnJvciBtZXNzYWdlIGV4ZWN1dGVGYWlsZWRcIiBzdHlsZT17e1wiZGlzcGxheVwiOlwiYmxvY2tcIn19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoZWFkZXJcIj5FcnJvciBleGVjdXRpbmcgYmx1ZXByaW50PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD57dGhpcy5zdGF0ZS5lcnJvcn08L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT0nc3VibWl0JyBzdHlsZT17e1wiZGlzcGxheVwiOiBcIm5vbmVcIn19IHJlZj0nc3VibWl0RXhlY3V0ZUJ0bicvPlxuICAgICAgICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICAgICAgICAgIDwvQm9keT5cblxuICAgICAgICAgICAgICAgICAgICA8Rm9vdGVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBjYW5jZWwgYmFzaWMgYnV0dG9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwicmVtb3ZlIGljb25cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2FuY2VsXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgb2sgZ3JlZW4gIGJ1dHRvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cInJvY2tldCBpY29uXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEV4ZWN1dGVcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L0Zvb3Rlcj5cbiAgICAgICAgICAgICAgICA8L01vZGFsPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgKTtcbiAgICB9XG59O1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGtpbm5lcmV0emluIG9uIDE5LzEwLzIwMTYuXG4gKi9cblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG4gICAgY29uc3RydWN0b3IoY29udGV4dCkge1xuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgIH1cblxuICAgIGRlbGV0ZShkZXBsb3ltZW50KSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSxyZWplY3QpPT57XG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogdGhpcy5jb250ZXh0LmdldE1hbmFnZXJVcmwoKSArICcvYXBpL3YyLjEvZGVwbG95bWVudHMvJytkZXBsb3ltZW50LmlkLFxuICAgICAgICAgICAgICAgIFwiaGVhZGVyc1wiOiB7XCJjb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJ9LFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ2RlbGV0ZSdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmRvbmUoKCk9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pPT57XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUi5yZXNwb25zZUpTT04gJiYganFYSFIucmVzcG9uc2VKU09OLm1lc3NhZ2UgPyBqcVhIUi5yZXNwb25zZUpTT04ubWVzc2FnZSA6IGVycm9yVGhyb3duKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdXBkYXRlKCkge1xuXG4gICAgfVxuXG4gICAgZXhlY3V0ZShkZXBsb3ltZW50LHdvcmtmbG93LHBhcmFtcykge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUscmVqZWN0KT0+e1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6IHRoaXMuY29udGV4dC5nZXRNYW5hZ2VyVXJsKCkgKyAnL2FwaS92Mi4xL2V4ZWN1dGlvbnMnLFxuICAgICAgICAgICAgICAgIFwiaGVhZGVyc1wiOiB7XCJjb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJ9LFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgICAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgJ2RlcGxveW1lbnRfaWQnOiBkZXBsb3ltZW50LmlkLFxuICAgICAgICAgICAgICAgICAgICAnd29ya2Zsb3dfaWQnIDogd29ya2Zsb3cubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVyczogcGFyYW1zXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmRvbmUoKGV4ZWN1dGlvbik9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZXhlY3V0aW9uKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pPT57XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUi5yZXNwb25zZUpTT04gJiYganFYSFIucmVzcG9uc2VKU09OLm1lc3NhZ2UgPyBqcVhIUi5yZXNwb25zZUpTT04ubWVzc2FnZSA6IGVycm9yVGhyb3duKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGtpbm5lcmV0emluIG9uIDA3LzA5LzIwMTYuXG4gKi9cblxuaW1wb3J0IERlcGxveW1lbnRzVGFibGUgZnJvbSAnLi9EZXBsb3ltZW50c1RhYmxlJztcblxuU3RhZ2UuYWRkUGx1Z2luKHtcbiAgICBpZDogXCJkZXBsb3ltZW50c1wiLFxuICAgIG5hbWU6ICdCbHVlcHJpbnQgZGVwbG95bWVudHMnLFxuICAgIGRlc2NyaXB0aW9uOiAnYmxhaCBibGFoIGJsYWgnLFxuICAgIGluaXRpYWxXaWR0aDogOCxcbiAgICBpbml0aWFsSGVpZ2h0OiA2LFxuICAgIGNvbG9yIDogXCJwdXJwbGVcIixcbiAgICBmZXRjaFVybDogJ1ttYW5hZ2VyXS9hcGkvdjIuMS9kZXBsb3ltZW50cycsXG4gICAgaW5pdGlhbENvbmZpZ3VyYXRpb246XG4gICAgICAgIFtcbiAgICAgICAgICAgIHtpZDogXCJjbGlja1RvRHJpbGxEb3duXCIsbmFtZTogXCJTaG91bGQgY2xpY2sgdG8gZHJpbGxkb3duXCIsIHBsYWNlSG9sZGVyOiBcIlRydWUgb2YgZmFsc2UgdG8gY2xpY2sgdG8gZHJpbGwgZG93blwiLCBkZWZhdWx0OiBcInRydWVcIn0sXG4gICAgICAgICAgICB7aWQ6IFwiYmx1ZXByaW50SWRGaWx0ZXJcIixuYW1lOiBcIkJsdWVwcmludCBJRCB0byBmaWx0ZXIgYnlcIiwgcGxhY2VIb2xkZXI6IFwiRW50ZXIgdGhlIGJsdWVwcmludCBpZCB5b3Ugd2lzaCB0byBmaWx0ZXIgYnlcIn1cbiAgICAgICAgXSxcbiAgICBpc1JlYWN0OiB0cnVlLFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbih3aWRnZXQsZGF0YSxlcnJvcixjb250ZXh0LHBsdWdpblV0aWxzKSB7XG5cbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gcGx1Z2luVXRpbHMucmVuZGVyUmVhY3RMb2FkaW5nKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBwbHVnaW5VdGlscy5yZW5kZXJSZWFjdEVycm9yKGVycm9yKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgdmFyIGZvcm1hdHRlZERhdGEgPSBPYmplY3QuYXNzaWduKHt9LGRhdGEpO1xuICAgICAgICB2YXIgYmx1ZXByaW50SWQgPSBjb250ZXh0LmdldFZhbHVlKCdibHVlcHJpbnRJZCcpO1xuICAgICAgICB2YXIgZGVwbG95bWVudElkID0gY29udGV4dC5nZXRWYWx1ZSgnZGVwbG95bWVudElkJyk7XG5cbiAgICAgICAgLy8gRmluZCBpZiB3ZSBoYXZlIGEgY29uZmlnIGZvciBibHVlcHJpbnQgc2VsZWN0aW9uXG4gICAgICAgIHZhciBibHVlcHJpbnRJZEZpbHRlciA9IHdpZGdldC5jb25maWd1cmF0aW9uID8gXy5maW5kKHdpZGdldC5jb25maWd1cmF0aW9uLHtpZDonYmx1ZXByaW50SWRGaWx0ZXInfSkgOiB7fTtcbiAgICAgICAgaWYgKGJsdWVwcmludElkRmlsdGVyICYmIGJsdWVwcmludElkRmlsdGVyLnZhbHVlKSB7XG4gICAgICAgICAgICBibHVlcHJpbnRJZCA9IGJsdWVwcmludElkRmlsdGVyLnZhbHVlO1xuICAgICAgICB9XG5cblxuICAgICAgICB2YXIgZmlsdGVyID0gY29udGV4dC5nZXRWYWx1ZSgnZmlsdGVyRGVwJyt3aWRnZXQuaWQpO1xuICAgICAgICBpZiAoYmx1ZXByaW50SWQpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZERhdGEuaXRlbXMgPSBfLmZpbHRlcihkYXRhLml0ZW1zLHtibHVlcHJpbnRfaWQ6Ymx1ZXByaW50SWR9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcm1hdHRlZERhdGEgPSBPYmplY3QuYXNzaWduKHt9LGZvcm1hdHRlZERhdGEse1xuICAgICAgICAgICAgaXRlbXM6IF8ubWFwIChmb3JtYXR0ZWREYXRhLml0ZW1zLChpdGVtKT0+e1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LGl0ZW0se1xuICAgICAgICAgICAgICAgICAgICBjcmVhdGVkX2F0OiBwbHVnaW5VdGlscy5tb21lbnQoaXRlbS5jcmVhdGVkX2F0LCdZWVlZLU1NLUREIEhIOm1tOnNzLlNTU1NTJykuZm9ybWF0KCdERC1NTS1ZWVlZIEhIOm1tJyksIC8vMjAxNi0wNy0yMCAwOToxMDo1My4xMDM1NzlcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlZF9hdDogcGx1Z2luVXRpbHMubW9tZW50KGl0ZW0udXBkYXRlZF9hdCwnWVlZWS1NTS1ERCBISDptbTpzcy5TU1NTUycpLmZvcm1hdCgnREQtTU0tWVlZWSBISDptbScpLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IGl0ZW0uc3RhdHVzIHx8ICdvaycsXG4gICAgICAgICAgICAgICAgICAgIGlzU2VsZWN0ZWQ6IGRlcGxveW1lbnRJZCA9PT0gaXRlbS5pZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoZmlsdGVyKSB7XG4gICAgICAgICAgICBmb3JtYXR0ZWREYXRhLml0ZW1zID0gXy5maWx0ZXIoZm9ybWF0dGVkRGF0YS5pdGVtcyx7c3RhdHVzOmZpbHRlcn0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9ybWF0dGVkRGF0YS5ibHVlcHJpbnRJZCA9IGJsdWVwcmludElkO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxEZXBsb3ltZW50c1RhYmxlIHdpZGdldD17d2lkZ2V0fSBkYXRhPXtmb3JtYXR0ZWREYXRhfSBjb250ZXh0PXtjb250ZXh0fSB1dGlscz17cGx1Z2luVXRpbHN9Lz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn0pO1xuIl19
