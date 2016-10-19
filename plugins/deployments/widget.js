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
            this.props.context.drillDown(this.props.widget, 'deployment');
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
                                { key: item.id, className: 'row', onClick: _this4._selectDeployment.bind(_this4, item) },
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
    initialConfiguration: { filterBy: "" },
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
        var filter = context.getValue('filterDep' + widget.id);
        if (blueprintId) {
            formattedData.items = _.filter(data.items, { blueprint_id: blueprintId });
        }
        formattedData = Object.assign({}, formattedData, {
            items: _.map(formattedData.items, function (item) {
                return Object.assign({}, item, {
                    created_at: pluginUtils.moment(item.created_at, 'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'), //2016-07-20 09:10:53.103579
                    updated_at: pluginUtils.moment(item.updated_at, 'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'),
                    status: item.status || 'ok'
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

},{"./DeploymentsTable":1}]},{},[1,5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwbHVnaW5zL2RlcGxveW1lbnRzL3NyYy9EZXBsb3ltZW50c1RhYmxlLmpzIiwicGx1Z2lucy9kZXBsb3ltZW50cy9zcmMvRXhlY3V0ZVdvcmtmbG93LmpzIiwicGx1Z2lucy9kZXBsb3ltZW50cy9zcmMvV29ya2Zsb3dQYXJhbWV0ZXJzTW9kYWwuanMiLCJwbHVnaW5zL2RlcGxveW1lbnRzL3NyYy9hY3Rpb25zLmpzIiwicGx1Z2lucy9kZXBsb3ltZW50cy9zcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUNJQTs7OztBQUNBOzs7O0FBRUE7Ozs7Ozs7Ozs7K2VBUEE7Ozs7Ozs7QUFVSSxvQkFBWSxLQUFaLEVBQWtCLE9BQWxCLEVBQTJCO0FBQUE7O0FBQUEsb0hBQ2pCLEtBRGlCLEVBQ1gsT0FEVzs7QUFHdkIsY0FBSyxLQUFMLEdBQWE7QUFDVCwyQkFBYyxLQURMO0FBRVQsOEJBQWtCO0FBRlQsU0FBYjtBQUh1QjtBQU8xQjs7Ozs0Q0FFbUI7QUFDaEIsaUJBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsV0FBbkIsR0FBaUMsRUFBakMsQ0FBb0MscUJBQXBDLEVBQTBELEtBQUssWUFBL0QsRUFBNEUsSUFBNUU7QUFDSDs7OytDQUVzQjtBQUNuQixpQkFBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixXQUFuQixHQUFpQyxHQUFqQyxDQUFxQyxxQkFBckMsRUFBMkQsS0FBSyxZQUFoRTtBQUNIOzs7c0NBRWEsUSxFQUFVO0FBQ3BCLGdCQUFJLE9BQU8sSUFBWDtBQUNBLGNBQUUsUUFBRixFQUFZLFFBQVosQ0FBcUI7QUFDakIsMEJBQVUsa0JBQUMsS0FBRCxFQUFRLElBQVIsRUFBYyxPQUFkLEVBQTBCO0FBQ2hDLHlCQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLFFBQW5CLENBQTRCLGNBQVksS0FBSyxL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QWQsRUFBaUIsSUFBakIsRUFBc0I7QUFDekIsZ0NBQVksWUFBWSxNQUFaLENBQW1CLEtBQUssVUFBeEIsRUFBbUMsMkJBQW5DLEVBQWdFLE1BQWhFLENBQXVFLGtCQUF2RSxDQURhLEVBQytFO0FBQ3hHLGdDQUFZLFlBQVksTUFBWixDQUFtQixLQUFLLFVBQXhCLEVBQW1DLDJCQUFuQyxFQUFnRSxNQUFoRSxDQUF1RSxrQkFBdkUsQ0FGYTtBQUd6Qiw0QkFBUSxLQUFLLE1BQUwsSUFBZTtBQUhFLGlCQUF0QixDQUFQO0FBS0gsYUFOTTtBQURvQyxTQUEvQixDQUFoQjs7QUFVQSxZQUFJLE1BQUosRUFBWTtBQUNSLDBCQUFjLEtBQWQsR0FBc0IsRUFBRSxNQUFGLENBQVMsY0FBYyxLQUF2QixFQUE2QixFQUFDLFFBQU8sTUFBUixFQUE3QixDQUF0QjtBQUNIOztBQUVELHNCQUFjLFdBQWQsR0FBNEIsV0FBNUI7O0FBRUEsZUFDSTtBQUFBO0FBQUE7QUFDSSw4REFBa0IsUUFBUSxNQUExQixFQUFrQyxNQUFNLGFBQXhDLEVBQXVELFNBQVMsT0FBaEUsRUFBeUUsT0FBTyxXQUFoRjtBQURKLFNBREo7QUFLSDtBQWhEVyxDQUFoQixFLENBTkEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGtpbm5lcmV0emluIG9uIDE4LzEwLzIwMTYuXG4gKi9cblxuaW1wb3J0IEV4ZWN1dGVXb3JrZmxvdyBmcm9tICcuL0V4ZWN1dGVXb3JrZmxvdyc7XG5pbXBvcnQgRXhlY3V0ZU1vZGFsIGZyb20gJy4vV29ya2Zsb3dQYXJhbWV0ZXJzTW9kYWwnO1xuXG5pbXBvcnQgQWN0aW9ucyBmcm9tICcuL2FjdGlvbnMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMsY29udGV4dCkge1xuICAgICAgICBzdXBlcihwcm9wcyxjb250ZXh0KTtcblxuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgY29uZmlybURlbGV0ZTpmYWxzZSxcbiAgICAgICAgICAgIHNob3dFeGVjdXRlTW9kYWw6IGZhbHNlXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LmdldEV2ZW50QnVzKCkub24oJ2RlcGxveW1lbnRzOnJlZnJlc2gnLHRoaXMuX3JlZnJlc2hEYXRhLHRoaXMpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQuZ2V0RXZlbnRCdXMoKS5vZmYoJ2RlcGxveW1lbnRzOnJlZnJlc2gnLHRoaXMuX3JlZnJlc2hEYXRhKTtcbiAgICB9XG5cbiAgICBfaW5pdERyb3Bkb3duKGRyb3Bkb3duKSB7XG4gICAgICAgIHZhciB0aGkkID0gdGhpcztcbiAgICAgICAgJChkcm9wZG93bikuZHJvcGRvd24oe1xuICAgICAgICAgICAgb25DaGFuZ2U6ICh2YWx1ZSwgdGV4dCwgJGNob2ljZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaSQucHJvcHMuY29udGV4dC5zZXRWYWx1ZSgnZmlsdGVyRGVwJyt0aGkkLnByb3BzLndpZGdldC5pZCx2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBmaWx0ZXIgPSB0aGlzLnByb3BzLmNvbnRleHQuZ2V0VmFsdWUoJ2ZpbHRlckRlcCcrdGhpcy5wcm9wcy53aWRnZXQuaWQpO1xuICAgICAgICBpZiAoZmlsdGVyKSB7XG4gICAgICAgICAgICAkKGRyb3Bkb3duKS5kcm9wZG93bignc2V0IHNlbGVjdGVkJyxmaWx0ZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3NlbGVjdERlcGxveW1lbnQoaXRlbSkge1xuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQuc2V0VmFsdWUoJ2RlcGxveW1lbnRJZCcsaXRlbS5pZCk7XG4gICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5kcmlsbERvd24odGhpcy5wcm9wcy53aWRnZXQsJ2RlcGxveW1lbnQnKTtcbiAgICB9XG5cbiAgICBfZGVsZXRlRGVwbG95bWVudENvbmZpcm0oaXRlbSxldmVudCl7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgY29uZmlybURlbGV0ZSA6IHRydWUsXG4gICAgICAgICAgICBkZWxldGVEZXA6IGl0ZW1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgX2RlbGV0ZURlcGxveW1lbnQoKSB7XG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5kZWxldGVEZXApIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2Vycm9yOiAnU29tZXRoaW5nIHdlbnQgd3JvbmcsIG5vIGRlcGxveW1lbnQgd2FzIHNlbGVjdGVkIGZvciBkZWxldGUnfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYWN0aW9ucyA9IG5ldyBBY3Rpb25zKHRoaXMucHJvcHMuY29udGV4dCk7XG5cbiAgICAgICAgYWN0aW9ucy5kZWxldGUodGhpcy5zdGF0ZS5kZWxldGVEZXApLnRoZW4oKCk9PntcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2NvbmZpcm1EZWxldGU6IGZhbHNlLGRlbGV0ZURlcDpudWxsfSk7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQuZ2V0RXZlbnRCdXMoKS50cmlnZ2VyKCdkZXBsb3ltZW50czpyZWZyZXNoJyk7XG4gICAgICAgIH0pLmNhdGNoKChlcnIpPT57XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtjb25maXJtRGVsZXRlOiBmYWxzZSxkZWxldGVEZXA6IG51bGx9KTtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2Vycm9yOiBlcnJ9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgX3JlZnJlc2hEYXRhKCkge1xuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQucmVmcmVzaCgpO1xuICAgIH1cbiAgICBcbiAgICBfc2hvd0V4ZWN1dGVXb3JrZmxvd01vZGFsIChkZXBsb3ltZW50LHdvcmtmbG93KSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgc2hvd0V4ZWN1dGVNb2RhbDogdHJ1ZSxcbiAgICAgICAgICAgIGV4ZWN1dGVEZXA6IGRlcGxveW1lbnQsXG4gICAgICAgICAgICBleGVjdXRlV29ya2Zsb3c6IHdvcmtmbG93XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9oaWRlRXhlY3V0ZVdvcmtmbG93TW9kYWwoKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgc2hvd0V4ZWN1dGVNb2RhbDogZmFsc2UsXG4gICAgICAgICAgICBleGVjdXRlRGVwOiBudWxsLFxuICAgICAgICAgICAgZXhlY3V0ZVdvcmtmbG93OiBudWxsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBfZXhlY3V0ZVdvcmtmbG93KGRlcGxveW1lbnQsd29ya2Zsb3cscGFyYW1zKSB7XG4gICAgICAgIHZhciBhY3Rpb25zID0gbmV3IEFjdGlvbnModGhpcy5wcm9wcy5jb250ZXh0KTtcblxuICAgICAgICBhY3Rpb25zLmV4ZWN1dGUoZGVwbG95bWVudCx3b3JrZmxvdyxwYXJhbXMpLnRoZW4oKCk9PntcbiAgICAgICAgICAgIHRoaXMuX2hpZGVFeGVjdXRlV29ya2Zsb3dNb2RhbCgpO1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LmdldEV2ZW50QnVzKCkudHJpZ2dlcignZXhlY3V0aW9uczpyZWZyZXNoJyk7XG4gICAgICAgIH0pLmNhdGNoKChlcnIpPT57XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtlcnJvcjogZXJyfSk7XG4gICAgICAgIH0pXG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdmFyIENvbmZpcm0gPSBTdGFnZS5CYXNpYy5Db25maXJtO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5lcnJvciA/XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIGVycm9yIG1lc3NhZ2VcIiBzdHlsZT17e1wiZGlzcGxheVwiOlwiYmxvY2tcIn19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVhZGVyXCI+RXJyb3IgT2NjdXJlZDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPnt0aGlzLnN0YXRlLmVycm9yfTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgJydcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIHNlbGVjdGlvbiBkcm9wZG93biBmbHVpZFwiIHJlZj17dGhpcy5faW5pdERyb3Bkb3duLmJpbmQodGhpcyl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwic3RhdHVzRmlsdGVyXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZWZhdWx0IHRleHRcIj5GaWx0ZXIgYnkgc3RhdHVzPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJkcm9wZG93biBpY29uXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZW51XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpdGVtXCIgZGF0YS12YWx1ZT1cIm9rXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImNoZWNrIGNpcmNsZSBpY29uIGludmVydGVkIGdyZWVuXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPS1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaXRlbVwiIGRhdGEtdmFsdWU9XCJlcnJvclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJyZW1vdmUgY2lyY2xlIGljb24gaW52ZXJ0ZWQgcmVkXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBFcnJvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT1cInVpIHZlcnkgY29tcGFjdCB0YWJsZSBkZXBsb3ltZW50VGFibGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+TmFtZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+Qmx1ZXByaW50PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5DcmVhdGVkPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5VcGRhdGVkPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5TdGF0dXM8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoLz5cbiAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmRhdGEuaXRlbXMubWFwKChpdGVtKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ciBrZXk9e2l0ZW0uaWR9IGNsYXNzTmFtZT0ncm93JyBvbkNsaWNrPXt0aGlzLl9zZWxlY3REZXBsb3ltZW50LmJpbmQodGhpcyxpdGVtKX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPSdkZXBsb3ltZW50TmFtZScgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPntpdGVtLmlkfTwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e2l0ZW0uYmx1ZXByaW50X2lkfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e2l0ZW0uY3JlYXRlZF9hdH08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPntpdGVtLnVwZGF0ZWRfYXR9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGl0ZW0uc3RhdHVzID09PSAnb2snID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiY2hlY2sgY2lyY2xlIGljb24gaW52ZXJ0ZWQgZ3JlZW5cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwicmVtb3ZlIGNpcmNsZSBpY29uIGludmVydGVkIHJlZFwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dBY3Rpb25zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxFeGVjdXRlV29ya2Zsb3cgaXRlbT17aXRlbX0gb25Xb3JrZmxvd1NlbGVjdGVkPXt0aGlzLl9zaG93RXhlY3V0ZVdvcmtmbG93TW9kYWwuYmluZCh0aGlzKX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJ3cml0ZSBpY29uIGxpbmsgYm9yZGVyZWRcIiB0aXRsZT1cIkVkaXQgZGVwbG95bWVudFwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwidHJhc2ggaWNvbiBsaW5rIGJvcmRlcmVkXCIgdGl0bGU9XCJEZWxldGUgZGVwbG95bWVudFwiIG9uQ2xpY2s9e3RoaXMuX2RlbGV0ZURlcGxveW1lbnRDb25maXJtLmJpbmQodGhpcyxpdGVtKX0+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICAgICAgPENvbmZpcm0gdGl0bGU9J0FyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byByZW1vdmUgdGhpcyBkZXBsb3ltZW50PydcbiAgICAgICAgICAgICAgICAgICAgICAgICBzaG93PXt0aGlzLnN0YXRlLmNvbmZpcm1EZWxldGV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgb25Db25maXJtPXt0aGlzLl9kZWxldGVEZXBsb3ltZW50LmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgb25DYW5jZWw9eygpPT50aGlzLnNldFN0YXRlKHtjb25maXJtRGVsZXRlIDogZmFsc2V9KX0gLz5cbiAgICAgICAgICAgICAgICA8RXhlY3V0ZU1vZGFsXG4gICAgICAgICAgICAgICAgICAgIHNob3c9e3RoaXMuc3RhdGUuc2hvd0V4ZWN1dGVNb2RhbH1cbiAgICAgICAgICAgICAgICAgICAgZGVwbG95bWVudD17dGhpcy5zdGF0ZS5leGVjdXRlRGVwfVxuICAgICAgICAgICAgICAgICAgICB3b3JrZmxvdz17dGhpcy5zdGF0ZS5leGVjdXRlV29ya2Zsb3d9XG4gICAgICAgICAgICAgICAgICAgIG9uRXhlY3V0ZT17dGhpcy5fZXhlY3V0ZVdvcmtmbG93LmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2FuY2VsPXt0aGlzLl9oaWRlRXhlY3V0ZVdvcmtmbG93TW9kYWwuYmluZCh0aGlzKX0vPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkga2lubmVyZXR6aW4gb24gMTkvMTAvMjAxNi5cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMsY29udGV4dCkge1xuICAgICAgICBzdXBlcihwcm9wcyxjb250ZXh0KTtcblxuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25TZWxlY3RXb3JrZmxvdyh2YWx1ZSwgdGV4dCwgJGNob2ljZSkge1xuICAgICAgICB2YXIgd29ya2Zsb3cgPSBfLmZpbmQoIHRoaXMucHJvcHMuaXRlbS53b3JrZmxvd3Mse25hbWU6IHZhbHVlfSk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzZWxlY3RlZCB3b3JrZmxvdyAnKyB2YWx1ZSx3b3JrZmxvdyk7XG5cbiAgICAgICAgdGhpcy5wcm9wcy5vbldvcmtmbG93U2VsZWN0ZWQodGhpcy5wcm9wcy5pdGVtLHdvcmtmbG93KTtcbiAgICB9XG5cbiAgICByZW5kZXIgKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBkcm9wZG93biB0b3AgcmlnaHQgcG9pbnRpbmdcIiByZWY9eyhkcm9wZG93bik9PiQoZHJvcGRvd24pLmRyb3Bkb3duKHtvbkNoYW5nZTogdGhpcy5vblNlbGVjdFdvcmtmbG93LmJpbmQodGhpcyl9KX0gb25DbGljaz17KGUpPT5lLnN0b3BQcm9wYWdhdGlvbigpfT5cbiAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJyb2FkIGljb24gbGluayBib3JkZXJlZFwiIHRpdGxlPVwiRXhlY3V0ZSB3b3JrZmxvd1wiPjwvaT5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lbnVcIj5cbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5pdGVtLndvcmtmbG93cy5tYXAoKHdvcmtmbG93KT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiA8ZGl2IGtleT17d29ya2Zsb3cubmFtZX0gY2xhc3NOYW1lPVwiaXRlbVwiPnt3b3JrZmxvdy5uYW1lfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkga2lubmVyZXR6aW4gb24gMTkvMTAvMjAxNi5cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcyxjb250ZXh0KSB7XG4gICAgICAgIHN1cGVyKHByb3BzLGNvbnRleHQpO1xuXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBlcnJvcjogbnVsbFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25BcHByb3ZlICgpIHtcbiAgICAgICAgJCh0aGlzLnJlZnMuc3VibWl0RXhlY3V0ZUJ0bikuY2xpY2soKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIF9leGVjdXRlKCkge1xuICAgICAgICBpZiAoIXRoaXMucHJvcHMuZGVwbG95bWVudCB8fCAhdGhpcy5wcm9wcy53b3JrZmxvdykge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7ZXJyb3I6ICdNaXNzaW5nIHdvcmtmbG93IG9yIGRlcGxveW1lbnQnfSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcGFyYW1zID0ge307XG5cbiAgICAgICAgJCh0aGlzLnJlZnMuZXhlY3V0ZUZvcm0pLmZpbmQoJ1tuYW1lPWV4ZWN1dGVJbnB1dF0nKS5lYWNoKChpbmRleCxpbnB1dCk9PntcbiAgICAgICAgICAgIHZhciBpbnB1dCA9ICQoaW5wdXQpO1xuICAgICAgICAgICAgcGFyYW1zW2lucHV0LmRhdGEoJ25hbWUnKV0gPSBpbnB1dC52YWwoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5wcm9wcy5vbkV4ZWN1dGUgJiYgdGhpcy5wcm9wcy5vbkV4ZWN1dGUodGhpcy5wcm9wcy5kZXBsb3ltZW50LHRoaXMucHJvcHMud29ya2Zsb3cscGFyYW1zKTtcblxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBvbkRlbnkgKCkge1xuICAgICAgICAvL3RoaXMucHJvcHMuY29udGV4dC5zZXRWYWx1ZSh0aGlzLnByb3BzLndpZGdldC5pZCArICdjcmVhdGVEZXBsb3knLG51bGwpO1xuICAgICAgICB0aGlzLnByb3BzLm9uQ2FuY2VsICYmIHRoaXMucHJvcHMub25DYW5jZWwoKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgX3N1Ym1pdEV4ZWN1dGUgKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHRoaXMuX2V4ZWN1dGUoKTtcblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgaWYgKCF0aGlzLnByb3BzLnNob3cgfHwgIXRoaXMucHJvcHMud29ya2Zsb3cpIHtcbiAgICAgICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT0nZXhlY3V0ZU1vZGFsQ29udGFpbmVyJy8+O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIE1vZGFsID0gU3RhZ2UuQmFzaWMuTW9kYWw7XG4gICAgICAgIHZhciBIZWFkZXIgPSBTdGFnZS5CYXNpYy5Nb2RhbEhlYWRlcjtcbiAgICAgICAgdmFyIEJvZHkgPSBTdGFnZS5CYXNpYy5Nb2RhbEJvZHk7XG4gICAgICAgIHZhciBGb290ZXIgPSBTdGFnZS5CYXNpYy5Nb2RhbEZvb3RlcjtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2V4ZWN1dGVNb2RhbENvbnRhaW5lcic+XG4gICAgICAgICAgICAgICAgPE1vZGFsIHNob3c9e3RoaXMucHJvcHMuc2hvd30gY2xhc3NOYW1lPSdleGVjdXRlTW9kYWwnIG9uRGVueT17dGhpcy5vbkRlbnkuYmluZCh0aGlzKX0gb25BcHByb3ZlPXt0aGlzLm9uQXBwcm92ZS5iaW5kKHRoaXMpfT5cbiAgICAgICAgICAgICAgICAgICAgPEhlYWRlcj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cInJvYWQgaWNvblwiPjwvaT4gRXhlY3V0ZSB3b3JrZmxvdyB7dGhpcy5wcm9wcy53b3JrZmxvdy5uYW1lfVxuICAgICAgICAgICAgICAgICAgICA8L0hlYWRlcj5cblxuICAgICAgICAgICAgICAgICAgICA8Qm9keT5cbiAgICAgICAgICAgICAgICAgICAgPGZvcm0gY2xhc3NOYW1lPVwidWkgZm9ybSBleGVjdXRlRm9ybVwiIG9uU3VibWl0PXt0aGlzLl9zdWJtaXRFeGVjdXRlLmJpbmQodGhpcyl9IGFjdGlvbj1cIlwiIHJlZj0nZXhlY3V0ZUZvcm0nPlxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8ubWFwKHRoaXMucHJvcHMud29ya2Zsb3cucGFyYW1ldGVycywocGFyYW1ldGVyLG5hbWUpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkXCIga2V5PXtuYW1lfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgdGl0bGU9e3BhcmFtZXRlci5kZXNjcmlwdGlvbiB8fCBuYW1lIH0+e25hbWV9PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgbmFtZT0nZXhlY3V0ZUlucHV0JyBkYXRhLW5hbWU9e25hbWV9IHR5cGU9XCJ0ZXh0XCIgZGVmYXVsdFZhbHVlPXtwYXJhbWV0ZXIuZGVmYXVsdH0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuZXJyb3IgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIGVycm9yIG1lc3NhZ2UgZXhlY3V0ZUZhaWxlZFwiIHN0eWxlPXt7XCJkaXNwbGF5XCI6XCJibG9ja1wifX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhlYWRlclwiPkVycm9yIGV4ZWN1dGluZyBibHVlcHJpbnQ8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPnt0aGlzLnN0YXRlLmVycm9yfTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJydcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPSdzdWJtaXQnIHN0eWxlPXt7XCJkaXNwbGF5XCI6IFwibm9uZVwifX0gcmVmPSdzdWJtaXRFeGVjdXRlQnRuJy8+XG4gICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgICAgICAgICAgPC9Cb2R5PlxuXG4gICAgICAgICAgICAgICAgICAgIDxGb290ZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIGNhbmNlbCBiYXNpYyBidXR0b25cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJyZW1vdmUgaWNvblwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDYW5jZWxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBvayBncmVlbiAgYnV0dG9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwicm9ja2V0IGljb25cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRXhlY3V0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvRm9vdGVyPlxuICAgICAgICAgICAgICAgIDwvTW9kYWw+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICApO1xuICAgIH1cbn07XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkga2lubmVyZXR6aW4gb24gMTkvMTAvMjAxNi5cbiAqL1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcbiAgICBjb25zdHJ1Y3Rvcihjb250ZXh0KSB7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgfVxuXG4gICAgZGVsZXRlKGRlcGxveW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLHJlamVjdCk9PntcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiB0aGlzLmNvbnRleHQuZ2V0TWFuYWdlclVybCgpICsgJy9hcGkvdjIuMS9kZXBsb3ltZW50cy8nK2RlcGxveW1lbnQuaWQsXG4gICAgICAgICAgICAgICAgXCJoZWFkZXJzXCI6IHtcImNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIn0sXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnZGVsZXRlJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZG9uZSgoKT0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bik9PntcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLnJlc3BvbnNlSlNPTiAmJiBqcVhIUi5yZXNwb25zZUpTT04ubWVzc2FnZSA/IGpxWEhSLnJlc3BvbnNlSlNPTi5tZXNzYWdlIDogZXJyb3JUaHJvd24pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB1cGRhdGUoKSB7XG5cbiAgICB9XG5cbiAgICBleGVjdXRlKGRlcGxveW1lbnQsd29ya2Zsb3cscGFyYW1zKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSxyZWplY3QpPT57XG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogdGhpcy5jb250ZXh0LmdldE1hbmFnZXJVcmwoKSArICcvYXBpL3YyLjEvZXhlY3V0aW9ucycsXG4gICAgICAgICAgICAgICAgXCJoZWFkZXJzXCI6IHtcImNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIn0sXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICAnZGVwbG95bWVudF9pZCc6IGRlcGxveW1lbnQuaWQsXG4gICAgICAgICAgICAgICAgICAgICd3b3JrZmxvd19pZCcgOiB3b3JrZmxvdy5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzOiBwYXJhbXNcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZG9uZSgoZXhlY3V0aW9uKT0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShleGVjdXRpb24pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bik9PntcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLnJlc3BvbnNlSlNPTiAmJiBqcVhIUi5yZXNwb25zZUpTT04ubWVzc2FnZSA/IGpxWEhSLnJlc3BvbnNlSlNPTi5tZXNzYWdlIDogZXJyb3JUaHJvd24pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0iLCIvKipcbiAqIENyZWF0ZWQgYnkga2lubmVyZXR6aW4gb24gMDcvMDkvMjAxNi5cbiAqL1xuXG5pbXBvcnQgRGVwbG95bWVudHNUYWJsZSBmcm9tICcuL0RlcGxveW1lbnRzVGFibGUnO1xuXG5TdGFnZS5hZGRQbHVnaW4oe1xuICAgIGlkOiBcImRlcGxveW1lbnRzXCIsXG4gICAgbmFtZTogJ0JsdWVwcmludCBkZXBsb3ltZW50cycsXG4gICAgZGVzY3JpcHRpb246ICdibGFoIGJsYWggYmxhaCcsXG4gICAgaW5pdGlhbFdpZHRoOiA4LFxuICAgIGluaXRpYWxIZWlnaHQ6IDYsXG4gICAgY29sb3IgOiBcInB1cnBsZVwiLFxuICAgIGZldGNoVXJsOiAnW21hbmFnZXJdL2FwaS92Mi4xL2RlcGxveW1lbnRzJyxcbiAgICBpbml0aWFsQ29uZmlndXJhdGlvbjoge2ZpbHRlcl9ieTogXCJcIn0sXG4gICAgaXNSZWFjdDogdHJ1ZSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24od2lkZ2V0LGRhdGEsZXJyb3IsY29udGV4dCxwbHVnaW5VdGlscykge1xuXG4gICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIHBsdWdpblV0aWxzLnJlbmRlclJlYWN0TG9hZGluZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gcGx1Z2luVXRpbHMucmVuZGVyUmVhY3RFcnJvcihlcnJvcik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZm9ybWF0dGVkRGF0YSA9IE9iamVjdC5hc3NpZ24oe30sZGF0YSk7XG4gICAgICAgIHZhciBibHVlcHJpbnRJZCA9IGNvbnRleHQuZ2V0VmFsdWUoJ2JsdWVwcmludElkJyk7XG4gICAgICAgIHZhciBmaWx0ZXIgPSBjb250ZXh0LmdldFZhbHVlKCdmaWx0ZXJEZXAnK3dpZGdldC5pZCk7XG4gICAgICAgIGlmIChibHVlcHJpbnRJZCkge1xuICAgICAgICAgICAgZm9ybWF0dGVkRGF0YS5pdGVtcyA9IF8uZmlsdGVyKGRhdGEuaXRlbXMse2JsdWVwcmludF9pZDpibHVlcHJpbnRJZH0pO1xuICAgICAgICB9XG4gICAgICAgIGZvcm1hdHRlZERhdGEgPSBPYmplY3QuYXNzaWduKHt9LGZvcm1hdHRlZERhdGEse1xuICAgICAgICAgICAgaXRlbXM6IF8ubWFwIChmb3JtYXR0ZWREYXRhLml0ZW1zLChpdGVtKT0+e1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LGl0ZW0se1xuICAgICAgICAgICAgICAgICAgICBjcmVhdGVkX2F0OiBwbHVnaW5VdGlscy5tb21lbnQoaXRlbS5jcmVhdGVkX2F0LCdZWVlZLU1NLUREIEhIOm1tOnNzLlNTU1NTJykuZm9ybWF0KCdERC1NTS1ZWVlZIEhIOm1tJyksIC8vMjAxNi0wNy0yMCAwOToxMDo1My4xMDM1NzlcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlZF9hdDogcGx1Z2luVXRpbHMubW9tZW50KGl0ZW0udXBkYXRlZF9hdCwnWVlZWS1NTS1ERCBISDptbTpzcy5TU1NTUycpLmZvcm1hdCgnREQtTU0tWVlZWSBISDptbScpLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IGl0ZW0uc3RhdHVzIHx8ICdvaydcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGZpbHRlcikge1xuICAgICAgICAgICAgZm9ybWF0dGVkRGF0YS5pdGVtcyA9IF8uZmlsdGVyKGZvcm1hdHRlZERhdGEuaXRlbXMse3N0YXR1czpmaWx0ZXJ9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcm1hdHRlZERhdGEuYmx1ZXByaW50SWQgPSBibHVlcHJpbnRJZDtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8RGVwbG95bWVudHNUYWJsZSB3aWRnZXQ9e3dpZGdldH0gZGF0YT17Zm9ybWF0dGVkRGF0YX0gY29udGV4dD17Y29udGV4dH0gdXRpbHM9e3BsdWdpblV0aWxzfS8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59KTtcbiJdfQ==
