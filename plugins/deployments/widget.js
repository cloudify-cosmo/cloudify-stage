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
    initialConfiguration: [{ id: "clickToDrillDown", name: "Should click to drilldown", placeHolder: "True of false to click to drill down", default: "true" }],
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwbHVnaW5zL2RlcGxveW1lbnRzL3NyYy9EZXBsb3ltZW50c1RhYmxlLmpzIiwicGx1Z2lucy9kZXBsb3ltZW50cy9zcmMvRXhlY3V0ZVdvcmtmbG93LmpzIiwicGx1Z2lucy9kZXBsb3ltZW50cy9zcmMvV29ya2Zsb3dQYXJhbWV0ZXJzTW9kYWwuanMiLCJwbHVnaW5zL2RlcGxveW1lbnRzL3NyYy9hY3Rpb25zLmpzIiwicGx1Z2lucy9kZXBsb3ltZW50cy9zcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUNJQTs7OztBQUNBOzs7O0FBRUE7Ozs7Ozs7Ozs7K2VBUEE7Ozs7Ozs7QUFVSSxvQkFBWSxLQUFaLEVBQWtCLE9BQWxCLEVBQTJCO0FBQUE7O0FBQUEsb0hBQ2pCLEtBRGlCLEVBQ1gsT0FEVzs7QUFHdkIsY0FBSyxLQUFMLEdBQWE7QUFDVCwyQkFBYyxLQURMO0FBRVQsOEJBQWtCO0FBRlQsU0FBYjtBQUh1QjtBQU8xQjs7Ozs0Q0FFbUI7QUFDaEIsaUJBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsV0FBbkIsR0FBaUMsRUFBakMsQ0FBb0MscUJBQXBDLEVBQTBELEtBQUssWUFBL0QsRUFBNEUsSUFBNUU7QUFDSDs7OytDQUVzQjtBQUNuQixpQkFBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixXQUFuQixHQUFpQyxHQUFqQyxDQUFxQyxxQkFBckMsRUFBMkQsS0FBSyxZQUFoRTtBQUNIOzs7c0NBRWEsUSxFQUFVO0FBQ3BCLGdCQUFJLE9BQU8sSUFBWDtBQUNBLGNBQUUsUUFBRixFQUFZLFFBQVosQ0FBcUI7QUFDakIsMEJBQVUsa0JBQUMsS0FBRCxFQUFRLElBQVIsRUFBYyxPQUFkLEVBQTBCO0FBQ2hDLHlCQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLFFBQW5CLENBQTRCLGNBQVksS0FBSyxL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RSxDQU5BIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ3JlYXRlZCBieSBraW5uZXJldHppbiBvbiAxOC8xMC8yMDE2LlxuICovXG5cbmltcG9ydCBFeGVjdXRlV29ya2Zsb3cgZnJvbSAnLi9FeGVjdXRlV29ya2Zsb3cnO1xuaW1wb3J0IEV4ZWN1dGVNb2RhbCBmcm9tICcuL1dvcmtmbG93UGFyYW1ldGVyc01vZGFsJztcblxuaW1wb3J0IEFjdGlvbnMgZnJvbSAnLi9hY3Rpb25zJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzLGNvbnRleHQpIHtcbiAgICAgICAgc3VwZXIocHJvcHMsY29udGV4dCk7XG5cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIGNvbmZpcm1EZWxldGU6ZmFsc2UsXG4gICAgICAgICAgICBzaG93RXhlY3V0ZU1vZGFsOiBmYWxzZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5nZXRFdmVudEJ1cygpLm9uKCdkZXBsb3ltZW50czpyZWZyZXNoJyx0aGlzLl9yZWZyZXNoRGF0YSx0aGlzKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LmdldEV2ZW50QnVzKCkub2ZmKCdkZXBsb3ltZW50czpyZWZyZXNoJyx0aGlzLl9yZWZyZXNoRGF0YSk7XG4gICAgfVxuXG4gICAgX2luaXREcm9wZG93bihkcm9wZG93bikge1xuICAgICAgICB2YXIgdGhpJCA9IHRoaXM7XG4gICAgICAgICQoZHJvcGRvd24pLmRyb3Bkb3duKHtcbiAgICAgICAgICAgIG9uQ2hhbmdlOiAodmFsdWUsIHRleHQsICRjaG9pY2UpID0+IHtcbiAgICAgICAgICAgICAgICB0aGkkLnByb3BzLmNvbnRleHQuc2V0VmFsdWUoJ2ZpbHRlckRlcCcrdGhpJC5wcm9wcy53aWRnZXQuaWQsdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgZmlsdGVyID0gdGhpcy5wcm9wcy5jb250ZXh0LmdldFZhbHVlKCdmaWx0ZXJEZXAnK3RoaXMucHJvcHMud2lkZ2V0LmlkKTtcbiAgICAgICAgaWYgKGZpbHRlcikge1xuICAgICAgICAgICAgJChkcm9wZG93bikuZHJvcGRvd24oJ3NldCBzZWxlY3RlZCcsZmlsdGVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9zZWxlY3REZXBsb3ltZW50KGl0ZW0pIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LnNldFZhbHVlKCdkZXBsb3ltZW50SWQnLGl0ZW0uaWQpO1xuICAgICAgICB2YXIgZHJpbGxEb3duQ29uZmlnID0gdGhpcy5wcm9wcy53aWRnZXQuY29uZmlndXJhdGlvbiA/IF8uZmluZCh0aGlzLnByb3BzLndpZGdldC5jb25maWd1cmF0aW9uLHtpZDonY2xpY2tUb0RyaWxsRG93bid9KSA6IHt9O1xuICAgICAgICBpZiAoZHJpbGxEb3duQ29uZmlnICYmIGRyaWxsRG93bkNvbmZpZy52YWx1ZSA9PT0gJ3RydWUnKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQuZHJpbGxEb3duKHRoaXMucHJvcHMud2lkZ2V0LCdkZXBsb3ltZW50Jyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfZGVsZXRlRGVwbG95bWVudENvbmZpcm0oaXRlbSxldmVudCl7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgY29uZmlybURlbGV0ZSA6IHRydWUsXG4gICAgICAgICAgICBkZWxldGVEZXA6IGl0ZW1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgX2RlbGV0ZURlcGxveW1lbnQoKSB7XG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5kZWxldGVEZXApIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2Vycm9yOiAnU29tZXRoaW5nIHdlbnQgd3JvbmcsIG5vIGRlcGxveW1lbnQgd2FzIHNlbGVjdGVkIGZvciBkZWxldGUnfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYWN0aW9ucyA9IG5ldyBBY3Rpb25zKHRoaXMucHJvcHMuY29udGV4dCk7XG5cbiAgICAgICAgYWN0aW9ucy5kZWxldGUodGhpcy5zdGF0ZS5kZWxldGVEZXApLnRoZW4oKCk9PntcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2NvbmZpcm1EZWxldGU6IGZhbHNlLGRlbGV0ZURlcDpudWxsfSk7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQuZ2V0RXZlbnRCdXMoKS50cmlnZ2VyKCdkZXBsb3ltZW50czpyZWZyZXNoJyk7XG4gICAgICAgIH0pLmNhdGNoKChlcnIpPT57XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtjb25maXJtRGVsZXRlOiBmYWxzZSxkZWxldGVEZXA6IG51bGx9KTtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2Vycm9yOiBlcnJ9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgX3JlZnJlc2hEYXRhKCkge1xuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQucmVmcmVzaCgpO1xuICAgIH1cblxuICAgIF9zaG93RXhlY3V0ZVdvcmtmbG93TW9kYWwgKGRlcGxveW1lbnQsd29ya2Zsb3cpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBzaG93RXhlY3V0ZU1vZGFsOiB0cnVlLFxuICAgICAgICAgICAgZXhlY3V0ZURlcDogZGVwbG95bWVudCxcbiAgICAgICAgICAgIGV4ZWN1dGVXb3JrZmxvdzogd29ya2Zsb3dcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgX2hpZGVFeGVjdXRlV29ya2Zsb3dNb2RhbCgpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBzaG93RXhlY3V0ZU1vZGFsOiBmYWxzZSxcbiAgICAgICAgICAgIGV4ZWN1dGVEZXA6IG51bGwsXG4gICAgICAgICAgICBleGVjdXRlV29ya2Zsb3c6IG51bGxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIF9leGVjdXRlV29ya2Zsb3coZGVwbG95bWVudCx3b3JrZmxvdyxwYXJhbXMpIHtcbiAgICAgICAgdmFyIGFjdGlvbnMgPSBuZXcgQWN0aW9ucyh0aGlzLnByb3BzLmNvbnRleHQpO1xuXG4gICAgICAgIGFjdGlvbnMuZXhlY3V0ZShkZXBsb3ltZW50LHdvcmtmbG93LHBhcmFtcykudGhlbigoKT0+e1xuICAgICAgICAgICAgdGhpcy5faGlkZUV4ZWN1dGVXb3JrZmxvd01vZGFsKCk7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQuZ2V0RXZlbnRCdXMoKS50cmlnZ2VyKCdleGVjdXRpb25zOnJlZnJlc2gnKTtcbiAgICAgICAgfSkuY2F0Y2goKGVycik9PntcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2Vycm9yOiBlcnJ9KTtcbiAgICAgICAgfSlcbiAgICB9XG4gICAgcmVuZGVyKCkge1xuICAgICAgICB2YXIgQ29uZmlybSA9IFN0YWdlLkJhc2ljLkNvbmZpcm07XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmVycm9yID9cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgZXJyb3IgbWVzc2FnZVwiIHN0eWxlPXt7XCJkaXNwbGF5XCI6XCJibG9ja1wifX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoZWFkZXJcIj5FcnJvciBPY2N1cmVkPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+e3RoaXMuc3RhdGUuZXJyb3J9PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgICAgICAnJ1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgc2VsZWN0aW9uIGRyb3Bkb3duIGZsdWlkXCIgcmVmPXt0aGlzLl9pbml0RHJvcGRvd24uYmluZCh0aGlzKX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJzdGF0dXNGaWx0ZXJcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlZmF1bHQgdGV4dFwiPkZpbHRlciBieSBzdGF0dXM8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImRyb3Bkb3duIGljb25cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lbnVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIml0ZW1cIiBkYXRhLXZhbHVlPVwib2tcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiY2hlY2sgY2lyY2xlIGljb24gaW52ZXJ0ZWQgZ3JlZW5cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9LXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpdGVtXCIgZGF0YS12YWx1ZT1cImVycm9yXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cInJlbW92ZSBjaXJjbGUgaWNvbiBpbnZlcnRlZCByZWRcIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVycm9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPVwidWkgdmVyeSBjb21wYWN0IHRhYmxlIGRlcGxveW1lbnRUYWJsZVwiPlxuICAgICAgICAgICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5OYW1lPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5CbHVlcHJpbnQ8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkNyZWF0ZWQ8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlVwZGF0ZWQ8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlN0YXR1czwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGgvPlxuICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuZGF0YS5pdGVtcy5tYXAoKGl0ZW0pPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyIGtleT17aXRlbS5pZH0gY2xhc3NOYW1lPXsncm93ICcgKyAoaXRlbS5pc1NlbGVjdGVkID8gJ2FjdGl2ZScgOiAnJyl9IG9uQ2xpY2s9e3RoaXMuX3NlbGVjdERlcGxveW1lbnQuYmluZCh0aGlzLGl0ZW0pfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9J2RlcGxveW1lbnROYW1lJyBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+e2l0ZW0uaWR9PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57aXRlbS5ibHVlcHJpbnRfaWR9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57aXRlbS5jcmVhdGVkX2F0fTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e2l0ZW0udXBkYXRlZF9hdH08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgaXRlbS5zdGF0dXMgPT09ICdvaycgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJjaGVjayBjaXJjbGUgaWNvbiBpbnZlcnRlZCBncmVlblwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJyZW1vdmUgY2lyY2xlIGljb24gaW52ZXJ0ZWQgcmVkXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd0FjdGlvbnNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEV4ZWN1dGVXb3JrZmxvdyBpdGVtPXtpdGVtfSBvbldvcmtmbG93U2VsZWN0ZWQ9e3RoaXMuX3Nob3dFeGVjdXRlV29ya2Zsb3dNb2RhbC5iaW5kKHRoaXMpfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cIndyaXRlIGljb24gbGluayBib3JkZXJlZFwiIHRpdGxlPVwiRWRpdCBkZXBsb3ltZW50XCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJ0cmFzaCBpY29uIGxpbmsgYm9yZGVyZWRcIiB0aXRsZT1cIkRlbGV0ZSBkZXBsb3ltZW50XCIgb25DbGljaz17dGhpcy5fZGVsZXRlRGVwbG95bWVudENvbmZpcm0uYmluZCh0aGlzLGl0ZW0pfT48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgICAgICA8Q29uZmlybSB0aXRsZT0nQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHJlbW92ZSB0aGlzIGRlcGxveW1lbnQ/J1xuICAgICAgICAgICAgICAgICAgICAgICAgIHNob3c9e3RoaXMuc3RhdGUuY29uZmlybURlbGV0ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICBvbkNvbmZpcm09e3RoaXMuX2RlbGV0ZURlcGxveW1lbnQuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICBvbkNhbmNlbD17KCk9PnRoaXMuc2V0U3RhdGUoe2NvbmZpcm1EZWxldGUgOiBmYWxzZX0pfSAvPlxuICAgICAgICAgICAgICAgIDxFeGVjdXRlTW9kYWxcbiAgICAgICAgICAgICAgICAgICAgc2hvdz17dGhpcy5zdGF0ZS5zaG93RXhlY3V0ZU1vZGFsfVxuICAgICAgICAgICAgICAgICAgICBkZXBsb3ltZW50PXt0aGlzLnN0YXRlLmV4ZWN1dGVEZXB9XG4gICAgICAgICAgICAgICAgICAgIHdvcmtmbG93PXt0aGlzLnN0YXRlLmV4ZWN1dGVXb3JrZmxvd31cbiAgICAgICAgICAgICAgICAgICAgb25FeGVjdXRlPXt0aGlzLl9leGVjdXRlV29ya2Zsb3cuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgICAgICAgb25DYW5jZWw9e3RoaXMuX2hpZGVFeGVjdXRlV29ya2Zsb3dNb2RhbC5iaW5kKHRoaXMpfS8+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICApO1xuICAgIH1cbn1cbiIsIi8qKlxuICogQ3JlYXRlZCBieSBraW5uZXJldHppbiBvbiAxOS8xMC8yMDE2LlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcyxjb250ZXh0KSB7XG4gICAgICAgIHN1cGVyKHByb3BzLGNvbnRleHQpO1xuXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvblNlbGVjdFdvcmtmbG93KHZhbHVlLCB0ZXh0LCAkY2hvaWNlKSB7XG4gICAgICAgIHZhciB3b3JrZmxvdyA9IF8uZmluZCggdGhpcy5wcm9wcy5pdGVtLndvcmtmbG93cyx7bmFtZTogdmFsdWV9KTtcbiAgICAgICAgY29uc29sZS5sb2coJ3NlbGVjdGVkIHdvcmtmbG93ICcrIHZhbHVlLHdvcmtmbG93KTtcblxuICAgICAgICB0aGlzLnByb3BzLm9uV29ya2Zsb3dTZWxlY3RlZCh0aGlzLnByb3BzLml0ZW0sd29ya2Zsb3cpO1xuICAgIH1cblxuICAgIHJlbmRlciAoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIGRyb3Bkb3duIHRvcCByaWdodCBwb2ludGluZ1wiIHJlZj17KGRyb3Bkb3duKT0+JChkcm9wZG93bikuZHJvcGRvd24oe29uQ2hhbmdlOiB0aGlzLm9uU2VsZWN0V29ya2Zsb3cuYmluZCh0aGlzKX0pfSBvbkNsaWNrPXsoZSk9PmUuc3RvcFByb3BhZ2F0aW9uKCl9PlxuICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cInJvYWQgaWNvbiBsaW5rIGJvcmRlcmVkXCIgdGl0bGU9XCJFeGVjdXRlIHdvcmtmbG93XCI+PC9pPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVudVwiPlxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLml0ZW0ud29ya2Zsb3dzLm1hcCgod29ya2Zsb3cpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDxkaXYga2V5PXt3b3JrZmxvdy5uYW1lfSBjbGFzc05hbWU9XCJpdGVtXCI+e3dvcmtmbG93Lm5hbWV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICApO1xuICAgIH1cbn1cbiIsIi8qKlxuICogQ3JlYXRlZCBieSBraW5uZXJldHppbiBvbiAxOS8xMC8yMDE2LlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzLGNvbnRleHQpIHtcbiAgICAgICAgc3VwZXIocHJvcHMsY29udGV4dCk7XG5cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIGVycm9yOiBudWxsXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkFwcHJvdmUgKCkge1xuICAgICAgICAkKHRoaXMucmVmcy5zdWJtaXRFeGVjdXRlQnRuKS5jbGljaygpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgX2V4ZWN1dGUoKSB7XG4gICAgICAgIGlmICghdGhpcy5wcm9wcy5kZXBsb3ltZW50IHx8ICF0aGlzLnByb3BzLndvcmtmbG93KSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtlcnJvcjogJ01pc3Npbmcgd29ya2Zsb3cgb3IgZGVwbG95bWVudCd9KTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBwYXJhbXMgPSB7fTtcblxuICAgICAgICAkKHRoaXMucmVmcy5leGVjdXRlRm9ybSkuZmluZCgnW25hbWU9ZXhlY3V0ZUlucHV0XScpLmVhY2goKGluZGV4LGlucHV0KT0+e1xuICAgICAgICAgICAgdmFyIGlucHV0ID0gJChpbnB1dCk7XG4gICAgICAgICAgICBwYXJhbXNbaW5wdXQuZGF0YSgnbmFtZScpXSA9IGlucHV0LnZhbCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnByb3BzLm9uRXhlY3V0ZSAmJiB0aGlzLnByb3BzLm9uRXhlY3V0ZSh0aGlzLnByb3BzLmRlcGxveW1lbnQsdGhpcy5wcm9wcy53b3JrZmxvdyxwYXJhbXMpO1xuXG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIG9uRGVueSAoKSB7XG4gICAgICAgIC8vdGhpcy5wcm9wcy5jb250ZXh0LnNldFZhbHVlKHRoaXMucHJvcHMud2lkZ2V0LmlkICsgJ2NyZWF0ZURlcGxveScsbnVsbCk7XG4gICAgICAgIHRoaXMucHJvcHMub25DYW5jZWwgJiYgdGhpcy5wcm9wcy5vbkNhbmNlbCgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBfc3VibWl0RXhlY3V0ZSAoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgdGhpcy5fZXhlY3V0ZSgpO1xuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmVuZGVyKCkge1xuICAgICAgICBpZiAoIXRoaXMucHJvcHMuc2hvdyB8fCAhdGhpcy5wcm9wcy53b3JrZmxvdykge1xuICAgICAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPSdleGVjdXRlTW9kYWxDb250YWluZXInLz47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgTW9kYWwgPSBTdGFnZS5CYXNpYy5Nb2RhbDtcbiAgICAgICAgdmFyIEhlYWRlciA9IFN0YWdlLkJhc2ljLk1vZGFsSGVhZGVyO1xuICAgICAgICB2YXIgQm9keSA9IFN0YWdlLkJhc2ljLk1vZGFsQm9keTtcbiAgICAgICAgdmFyIEZvb3RlciA9IFN0YWdlLkJhc2ljLk1vZGFsRm9vdGVyO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZXhlY3V0ZU1vZGFsQ29udGFpbmVyJz5cbiAgICAgICAgICAgICAgICA8TW9kYWwgc2hvdz17dGhpcy5wcm9wcy5zaG93fSBjbGFzc05hbWU9J2V4ZWN1dGVNb2RhbCcgb25EZW55PXt0aGlzLm9uRGVueS5iaW5kKHRoaXMpfSBvbkFwcHJvdmU9e3RoaXMub25BcHByb3ZlLmJpbmQodGhpcyl9PlxuICAgICAgICAgICAgICAgICAgICA8SGVhZGVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwicm9hZCBpY29uXCI+PC9pPiBFeGVjdXRlIHdvcmtmbG93IHt0aGlzLnByb3BzLndvcmtmbG93Lm5hbWV9XG4gICAgICAgICAgICAgICAgICAgIDwvSGVhZGVyPlxuXG4gICAgICAgICAgICAgICAgICAgIDxCb2R5PlxuICAgICAgICAgICAgICAgICAgICA8Zm9ybSBjbGFzc05hbWU9XCJ1aSBmb3JtIGV4ZWN1dGVGb3JtXCIgb25TdWJtaXQ9e3RoaXMuX3N1Ym1pdEV4ZWN1dGUuYmluZCh0aGlzKX0gYWN0aW9uPVwiXCIgcmVmPSdleGVjdXRlRm9ybSc+XG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5tYXAodGhpcy5wcm9wcy53b3JrZmxvdy5wYXJhbWV0ZXJzLChwYXJhbWV0ZXIsbmFtZSk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGRcIiBrZXk9e25hbWV9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCB0aXRsZT17cGFyYW1ldGVyLmRlc2NyaXB0aW9uIHx8IG5hbWUgfT57bmFtZX08L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBuYW1lPSdleGVjdXRlSW5wdXQnIGRhdGEtbmFtZT17bmFtZX0gdHlwZT1cInRleHRcIiBkZWZhdWx0VmFsdWU9e3BhcmFtZXRlci5kZWZhdWx0fS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5lcnJvciA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgZXJyb3IgbWVzc2FnZSBleGVjdXRlRmFpbGVkXCIgc3R5bGU9e3tcImRpc3BsYXlcIjpcImJsb2NrXCJ9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVhZGVyXCI+RXJyb3IgZXhlY3V0aW5nIGJsdWVwcmludDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+e3RoaXMuc3RhdGUuZXJyb3J9PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9J3N1Ym1pdCcgc3R5bGU9e3tcImRpc3BsYXlcIjogXCJub25lXCJ9fSByZWY9J3N1Ym1pdEV4ZWN1dGVCdG4nLz5cbiAgICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgICAgICAgICA8L0JvZHk+XG5cbiAgICAgICAgICAgICAgICAgICAgPEZvb3Rlcj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgY2FuY2VsIGJhc2ljIGJ1dHRvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cInJlbW92ZSBpY29uXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENhbmNlbFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIG9rIGdyZWVuICBidXR0b25cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJyb2NrZXQgaWNvblwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBFeGVjdXRlXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9Gb290ZXI+XG4gICAgICAgICAgICAgICAgPC9Nb2RhbD5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICk7XG4gICAgfVxufTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBraW5uZXJldHppbiBvbiAxOS8xMC8yMDE2LlxuICovXG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKGNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgICB9XG5cbiAgICBkZWxldGUoZGVwbG95bWVudCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUscmVqZWN0KT0+e1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6IHRoaXMuY29udGV4dC5nZXRNYW5hZ2VyVXJsKCkgKyAnL2FwaS92Mi4xL2RlcGxveW1lbnRzLycrZGVwbG95bWVudC5pZCxcbiAgICAgICAgICAgICAgICBcImhlYWRlcnNcIjoge1wiY29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwifSxcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdkZWxldGUnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5kb25lKCgpPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKT0+e1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoanFYSFIucmVzcG9uc2VKU09OICYmIGpxWEhSLnJlc3BvbnNlSlNPTi5tZXNzYWdlID8ganFYSFIucmVzcG9uc2VKU09OLm1lc3NhZ2UgOiBlcnJvclRocm93bik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHVwZGF0ZSgpIHtcblxuICAgIH1cblxuICAgIGV4ZWN1dGUoZGVwbG95bWVudCx3b3JrZmxvdyxwYXJhbXMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLHJlamVjdCk9PntcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiB0aGlzLmNvbnRleHQuZ2V0TWFuYWdlclVybCgpICsgJy9hcGkvdjIuMS9leGVjdXRpb25zJyxcbiAgICAgICAgICAgICAgICBcImhlYWRlcnNcIjoge1wiY29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwifSxcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICAgICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgICdkZXBsb3ltZW50X2lkJzogZGVwbG95bWVudC5pZCxcbiAgICAgICAgICAgICAgICAgICAgJ3dvcmtmbG93X2lkJyA6IHdvcmtmbG93Lm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtZXRlcnM6IHBhcmFtc1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5kb25lKChleGVjdXRpb24pPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGV4ZWN1dGlvbik7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKT0+e1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoanFYSFIucmVzcG9uc2VKU09OICYmIGpxWEhSLnJlc3BvbnNlSlNPTi5tZXNzYWdlID8ganFYSFIucmVzcG9uc2VKU09OLm1lc3NhZ2UgOiBlcnJvclRocm93bilcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufSIsIi8qKlxuICogQ3JlYXRlZCBieSBraW5uZXJldHppbiBvbiAwNy8wOS8yMDE2LlxuICovXG5cbmltcG9ydCBEZXBsb3ltZW50c1RhYmxlIGZyb20gJy4vRGVwbG95bWVudHNUYWJsZSc7XG5cblN0YWdlLmFkZFBsdWdpbih7XG4gICAgaWQ6IFwiZGVwbG95bWVudHNcIixcbiAgICBuYW1lOiAnQmx1ZXByaW50IGRlcGxveW1lbnRzJyxcbiAgICBkZXNjcmlwdGlvbjogJ2JsYWggYmxhaCBibGFoJyxcbiAgICBpbml0aWFsV2lkdGg6IDgsXG4gICAgaW5pdGlhbEhlaWdodDogNixcbiAgICBjb2xvciA6IFwicHVycGxlXCIsXG4gICAgZmV0Y2hVcmw6ICdbbWFuYWdlcl0vYXBpL3YyLjEvZGVwbG95bWVudHMnLFxuICAgIGluaXRpYWxDb25maWd1cmF0aW9uOlxuICAgICAgICBbXG4gICAgICAgICAgICB7aWQ6IFwiY2xpY2tUb0RyaWxsRG93blwiLG5hbWU6IFwiU2hvdWxkIGNsaWNrIHRvIGRyaWxsZG93blwiLCBwbGFjZUhvbGRlcjogXCJUcnVlIG9mIGZhbHNlIHRvIGNsaWNrIHRvIGRyaWxsIGRvd25cIiwgZGVmYXVsdDogXCJ0cnVlXCJ9XG4gICAgICAgIF0sXG4gICAgaXNSZWFjdDogdHJ1ZSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24od2lkZ2V0LGRhdGEsZXJyb3IsY29udGV4dCxwbHVnaW5VdGlscykge1xuXG4gICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIHBsdWdpblV0aWxzLnJlbmRlclJlYWN0TG9hZGluZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gcGx1Z2luVXRpbHMucmVuZGVyUmVhY3RFcnJvcihlcnJvcik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZm9ybWF0dGVkRGF0YSA9IE9iamVjdC5hc3NpZ24oe30sZGF0YSk7XG4gICAgICAgIHZhciBibHVlcHJpbnRJZCA9IGNvbnRleHQuZ2V0VmFsdWUoJ2JsdWVwcmludElkJyk7XG4gICAgICAgIHZhciBkZXBsb3ltZW50SWQgPSBjb250ZXh0LmdldFZhbHVlKCdkZXBsb3ltZW50SWQnKTtcbiAgICAgICAgdmFyIGZpbHRlciA9IGNvbnRleHQuZ2V0VmFsdWUoJ2ZpbHRlckRlcCcrd2lkZ2V0LmlkKTtcbiAgICAgICAgaWYgKGJsdWVwcmludElkKSB7XG4gICAgICAgICAgICBmb3JtYXR0ZWREYXRhLml0ZW1zID0gXy5maWx0ZXIoZGF0YS5pdGVtcyx7Ymx1ZXByaW50X2lkOmJsdWVwcmludElkfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3JtYXR0ZWREYXRhID0gT2JqZWN0LmFzc2lnbih7fSxmb3JtYXR0ZWREYXRhLHtcbiAgICAgICAgICAgIGl0ZW1zOiBfLm1hcCAoZm9ybWF0dGVkRGF0YS5pdGVtcywoaXRlbSk9PntcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSxpdGVtLHtcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlZF9hdDogcGx1Z2luVXRpbHMubW9tZW50KGl0ZW0uY3JlYXRlZF9hdCwnWVlZWS1NTS1ERCBISDptbTpzcy5TU1NTUycpLmZvcm1hdCgnREQtTU0tWVlZWSBISDptbScpLCAvLzIwMTYtMDctMjAgMDk6MTA6NTMuMTAzNTc5XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZWRfYXQ6IHBsdWdpblV0aWxzLm1vbWVudChpdGVtLnVwZGF0ZWRfYXQsJ1lZWVktTU0tREQgSEg6bW06c3MuU1NTU1MnKS5mb3JtYXQoJ0RELU1NLVlZWVkgSEg6bW0nKSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBpdGVtLnN0YXR1cyB8fCAnb2snLFxuICAgICAgICAgICAgICAgICAgICBpc1NlbGVjdGVkOiBkZXBsb3ltZW50SWQgPT09IGl0ZW0uaWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGZpbHRlcikge1xuICAgICAgICAgICAgZm9ybWF0dGVkRGF0YS5pdGVtcyA9IF8uZmlsdGVyKGZvcm1hdHRlZERhdGEuaXRlbXMse3N0YXR1czpmaWx0ZXJ9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcm1hdHRlZERhdGEuYmx1ZXByaW50SWQgPSBibHVlcHJpbnRJZDtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8RGVwbG95bWVudHNUYWJsZSB3aWRnZXQ9e3dpZGdldH0gZGF0YT17Zm9ybWF0dGVkRGF0YX0gY29udGV4dD17Y29udGV4dH0gdXRpbHM9e3BsdWdpblV0aWxzfS8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59KTtcbiJdfQ==
