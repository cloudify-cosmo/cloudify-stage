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
 * Created by kinneretzin on 05/10/2016.
 */

exports.default = function (snapshotUtils) {

    return function (_React$Component) {
        _inherits(_class, _React$Component);

        function _class(props, context) {
            _classCallCheck(this, _class);

            var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props, context));

            _this.state = {
                createErr: null
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
                snapshotUtils.jQuery(this.refs.modalObj).modal('refresh');
            }
        }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
                snapshotUtils.jQuery(this.refs.modalObj).modal('destroy');
                snapshotUtils.jQuery(this.refs.modalObj).remove();
            }
        }, {
            key: '_initModal',
            value: function _initModal(modalObj) {
                snapshotUtils.jQuery(modalObj).modal({
                    closable: false,
                    onDeny: function onDeny() {
                        //window.alert('Wait not yet!');
                        //return false;
                    },
                    onApprove: function onApprove() {
                        snapshotUtils.jQuery('.createFormSubmitBtn').click();
                        return false;
                    }
                });
            }
        }, {
            key: '_showModal',
            value: function _showModal() {
                snapshotUtils.jQuery('.createSnapshotModal').modal('show');
            }
        }, {
            key: '_openFileSelection',
            value: function _openFileSelection(e) {
                e.preventDefault();
                snapshotUtils.jQuery('#snapshotFile').click();
                return false;
            }
        }, {
            key: '_createFileChanged',
            value: function _createFileChanged(e) {
                var fullPathFileName = snapshotUtils.jQuery(e.currentTarget).val();
                var filename = fullPathFileName.split('\\').pop();

                snapshotUtils.jQuery('input.createSnapshotFile').val(filename).attr('title', fullPathFileName);
            }
        }, {
            key: '_submitCreate',
            value: function _submitCreate(e) {
                var _this2 = this;

                e.preventDefault();

                var thi$ = this;

                var formObj = snapshotUtils.jQuery(e.currentTarget);

                // Clear errors
                formObj.find('.error:not(.message)').removeClass('error');
                formObj.find('.ui.error.message').hide();

                // Get the data
                var snapshotId = formObj.find("input[name='snapshotId']").val();

                // Disalbe the form
                formObj.parents('.modal').find('.actions .button').attr('disabled', 'disabled').addClass('disabled loading');
                formObj.addClass('loading');

                // Call create method
                $.ajax({
                    url: thi$.props.context.getManagerUrl() + '/api/v2.1/snapshots/' + snapshotId,
                    //dataType: 'json',
                    "headers": { "content-type": "application/json" },
                    method: 'put',
                    data: JSON.stringify({
                        'snapshot_id': snapshotId
                    })
                }).done(function (snapshot) {
                    thi$.props.context.setValue(_this2.props.widget.id + 'createSnapshot', null);

                    thi$.props.context.getEventBus().trigger('snapshots:refresh');
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    thi$.setState({ error: jqXHR.responseJSON && jqXHR.responseJSON.message ? jqXHR.responseJSON.message : errorThrown });
                });

                formObj.parents('.modal').find('.actions .button').removeAttr('disabled').removeClass('disabled loading');
                formObj.removeClass('loading');

                return false;
            }
        }, {
            key: '_processCreateErrIfNeeded',
            value: function _processCreateErrIfNeeded(xhr) {
                try {
                    var response = JSON.parse(xhr.responseText);
                    if (response.message) {
                        this.setState({ createErr: response.message });
                        return true;
                    }
                } catch (err) {
                    console.err('Cannot parse create response', err);
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
                        { className: 'ui labeled icon button createSnapshot', onClick: this._showModal },
                        React.createElement('i', { className: 'add icon' }),
                        'Create'
                    ),
                    React.createElement(
                        'div',
                        { className: 'ui modal createSnapshotModal', ref: 'modalObj' },
                        React.createElement(
                            'div',
                            { className: 'header' },
                            React.createElement('i', { className: 'add icon' }),
                            ' Create snapshot'
                        ),
                        React.createElement(
                            'div',
                            { className: 'content' },
                            React.createElement(
                                'form',
                                { className: 'ui form createForm', onSubmit: this._submitCreate.bind(this), action: '' },
                                React.createElement(
                                    'div',
                                    { className: 'field' },
                                    React.createElement('input', { type: 'text', name: 'snapshotId', id: 'snapshotId', placeholder: 'Snapshot ID', required: true })
                                ),
                                this.state.createErr ? React.createElement(
                                    'div',
                                    { className: 'ui error message createFailed', style: { "display": "block" } },
                                    React.createElement(
                                        'div',
                                        { className: 'header' },
                                        'Error createing file'
                                    ),
                                    React.createElement(
                                        'p',
                                        null,
                                        this.state.createErr
                                    )
                                ) : '',
                                React.createElement('input', { type: 'submit', style: { "display": "none" }, className: 'createFormSubmitBtn' })
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
                                React.createElement('i', { className: 'add icon' }),
                                'Create'
                            )
                        )
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
        key: '_selectSnapshot',
        value: function _selectSnapshot(item) {
            var oldSelectedSnapshotId = this.props.context.getValue('snapshotId');
            this.props.context.setValue('snapshotId', item.id === oldSelectedSnapshotId ? null : item.id);
        }
    }, {
        key: '_deleteSnapshotConfirm',
        value: function _deleteSnapshotConfirm(item, event) {
            event.stopPropagation();

            this.setState({
                confirmDelete: true,
                item: item
            });
        }
    }, {
        key: '_restoreSnapshot',
        value: function _restoreSnapshot(item, event) {
            var thi$ = this;
            var data = { force: false, recreate_deployments_envs: false };
            $.ajax({
                url: thi$.props.context.getManagerUrl() + '/api/v2.1/snapshots/' + item.id + '/restore',
                "headers": { "content-type": "application/json" },
                data: JSON.stringify(data),
                dataType: "json",
                method: 'post'
            }).done(function () {
                thi$.props.context.getEventBus().trigger('snapshots:refresh');
            }).fail(function (jqXHR, textStatus, errorThrown) {
                thi$.setState({ error: jqXHR.responseJSON && jqXHR.responseJSON.message ? jqXHR.responseJSON.message : errorThrown });
            });
        }
    }, {
        key: '_downloadSnapshot',
        value: function _downloadSnapshot(item, event) {
            var thi$ = this;
            $.ajax({
                url: thi$.props.context.getManagerUrl() + '/api/v2.1/snapshots/' + item.id + '/archive',
                method: 'get'
            }).done(function () {
                window.location = thi$.props.context.getManagerUrl() + '/api/v2.1/snapshots/' + item.id + '/archive';
            }).fail(function (jqXHR, textStatus, errorThrown) {
                thi$.setState({ error: jqXHR.responseJSON && jqXHR.responseJSON.message ? jqXHR.responseJSON.message : errorThrown });
            });
        }
    }, {
        key: '_deleteSnapshot',
        value: function _deleteSnapshot() {
            if (!this.state.item) {
                this.setState({ error: 'Something went wrong, no snapshot was selected for delete' });
                return;
            }

            var thi$ = this;
            $.ajax({
                url: thi$.props.context.getManagerUrl() + '/api/v2.1/snapshots/' + this.state.item.id,
                "headers": { "content-type": "application/json" },
                method: 'delete'
            }).done(function () {
                thi$.setState({ confirmDelete: false });
                thi$.props.context.getEventBus().trigger('snapshots:refresh');
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
            this.props.context.getEventBus().on('snapshots:refresh', this._refreshData, this);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.props.context.getEventBus().off('snapshots:refresh', this._refreshData);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var Confirm = Stage.Basic.Confirm;

            return React.createElement(
                'div',
                { className: 'snapshotsTableDiv' },
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
                    { className: 'ui very compact table snapshotsTable' },
                    React.createElement(
                        'thead',
                        null,
                        React.createElement(
                            'tr',
                            null,
                            React.createElement(
                                'th',
                                null,
                                'ID'
                            ),
                            React.createElement(
                                'th',
                                null,
                                'Created at'
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
                                { key: item.id, className: "row " + (item.isSelected ? 'active' : ''), onClick: _this2._selectSnapshot.bind(_this2, item) },
                                React.createElement(
                                    'td',
                                    null,
                                    React.createElement(
                                        'div',
                                        null,
                                        React.createElement(
                                            'a',
                                            { className: 'snapshotName', href: 'javascript:void(0)' },
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
                                    item.status
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    React.createElement(
                                        'div',
                                        { className: 'rowActions' },
                                        React.createElement('i', { className: 'undo icon link bordered', title: 'Restore', onClick: _this2._restoreSnapshot.bind(_this2, item) }),
                                        React.createElement('i', { className: 'download icon link bordered', title: 'Download', onClick: _this2._downloadSnapshot.bind(_this2, item) }),
                                        React.createElement('i', { className: 'trash icon link bordered', title: 'Delete', onClick: _this2._deleteSnapshotConfirm.bind(_this2, item) })
                                    )
                                )
                            );
                        })
                    )
                ),
                React.createElement(Confirm, { title: 'Are you sure you want to remove this snapshot?',
                    show: this.state.confirmDelete,
                    onConfirm: this._deleteSnapshot.bind(this),
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

exports.default = function (snapshotUtils) {

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
                snapshotUtils.jQuery(this.refs.modalObj).modal('refresh');
            }
        }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
                snapshotUtils.jQuery(this.refs.modalObj).modal('destroy');
                snapshotUtils.jQuery(this.refs.modalObj).remove();
            }
        }, {
            key: '_initModal',
            value: function _initModal(modalObj) {
                snapshotUtils.jQuery(modalObj).modal({
                    closable: false,
                    onDeny: function onDeny() {
                        //window.alert('Wait not yet!');
                        //return false;
                    },
                    onApprove: function onApprove() {
                        snapshotUtils.jQuery('.uploadFormSubmitBtn').click();
                        return false;
                    }
                });
            }
        }, {
            key: '_showModal',
            value: function _showModal() {
                snapshotUtils.jQuery('.uploadSnapshotModal').modal('show');
            }
        }, {
            key: '_openFileSelection',
            value: function _openFileSelection(e) {
                e.preventDefault();
                snapshotUtils.jQuery('#snapshotFile').click();
                return false;
            }
        }, {
            key: '_uploadFileChanged',
            value: function _uploadFileChanged(e) {
                var fullPathFileName = snapshotUtils.jQuery(e.currentTarget).val();
                var filename = fullPathFileName.split('\\').pop();

                snapshotUtils.jQuery('input.uploadSnapshotFile').val(filename).attr('title', fullPathFileName);
            }
        }, {
            key: '_submitUpload',
            value: function _submitUpload(e) {
                e.preventDefault();

                var thi$ = this;

                var formObj = snapshotUtils.jQuery(e.currentTarget);

                // Clear errors
                formObj.find('.error:not(.message)').removeClass('error');
                formObj.find('.ui.error.message').hide();

                // Get the data
                var snapshotId = formObj.find("input[name='snapshotId']").val();
                var snapshotFileUrl = formObj.find("input[name='snapshotFileUrl']").val();
                var file = document.getElementById('snapshotFile').files[0];

                // Check that we have all we need
                if (_.isEmpty(snapshotFileUrl) && !file) {
                    formObj.addClass('error');
                    formObj.find("input.uploadSnapshotFile").parents('.field').addClass('error');
                    formObj.find("input[name='snapshotFileUrl']").parents('.field').addClass('error');
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
                xhr.open('put', this.props.context.getManagerUrl() + '/api/v2.1/snapshots/' + snapshotId + "/archive");
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
                        { className: 'ui labeled icon button uploadSnapshot', onClick: this._showModal },
                        React.createElement('i', { className: 'upload icon' }),
                        'Upload'
                    ),
                    React.createElement(
                        'div',
                        { className: 'ui modal uploadSnapshotModal', ref: 'modalObj' },
                        React.createElement(
                            'div',
                            { className: 'header' },
                            React.createElement('i', { className: 'upload icon' }),
                            ' Upload snapshot'
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
                                            React.createElement('input', { type: 'text', name: 'snapshotFileUrl', placeholder: 'Enter snapshot url' })
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
                                            React.createElement('input', { type: 'text', readOnly: 'true', value: '', className: 'uploadSnapshotFile', onClick: this._openFileSelection }),
                                            React.createElement(
                                                'button',
                                                { className: 'ui icon button uploadSnapshotFile', onClick: this._openFileSelection },
                                                React.createElement('i', { className: 'attach icon' })
                                            )
                                        ),
                                        React.createElement('input', { type: 'file', name: 'snapshotFile', id: 'snapshotFile', style: { "display": "none" }, onChange: this._uploadFileChanged })
                                    )
                                ),
                                React.createElement(
                                    'div',
                                    { className: 'field' },
                                    React.createElement('input', { type: 'text', name: 'snapshotId', id: 'snapshotId', placeholder: 'Snapshot ID', required: true })
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

var _SnapshotsTable = require('./SnapshotsTable');

var _SnapshotsTable2 = _interopRequireDefault(_SnapshotsTable);

var _UploadSnapshotModal = require('./UploadSnapshotModal');

var _UploadSnapshotModal2 = _interopRequireDefault(_UploadSnapshotModal);

var _CreateSnapshotModal = require('./CreateSnapshotModal');

var _CreateSnapshotModal2 = _interopRequireDefault(_CreateSnapshotModal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UploadModal = null; /**
                         * Created by kinneretzin on 07/09/2016.
                         */

var CreateModal = null;

Stage.addPlugin({
    id: "snapshots",
    name: "Snapshots list",
    description: 'blah blah blah',
    initialWidth: 4,
    initialHeight: 4,
    color: "blue",
    isReact: true,
    init: function init(snapshotUtils) {
        UploadModal = (0, _UploadSnapshotModal2.default)(snapshotUtils);
        CreateModal = (0, _CreateSnapshotModal2.default)(snapshotUtils);
    },

    fetchData: function fetchData(snapshot, context, snapshotUtils) {
        return new Promise(function (resolve, reject) {
            snapshotUtils.jQuery.get({
                url: context.getManagerUrl() + '/api/v2.1/snapshots?_include=id,created_at,status',
                dataType: 'json'
            }).done(function (snapshots) {
                resolve(snapshots);
            }).fail(reject);
        });
    },

    render: function render(widget, data, error, context, snapshotUtils) {

        if (!data) {
            return snapshotUtils.renderReactLoading();
        }

        if (error) {
            return snapshotUtils.renderReactError(error);
        }

        var selectedSnapshot = context.getValue('snapshotId');
        var formattedData = Object.assign({}, data, {
            items: _.map(data.items, function (item) {
                return Object.assign({}, item, {
                    created_at: snapshotUtils.moment(item.created_at, 'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'), //2016-07-20 09:10:53.103579
                    isSelected: selectedSnapshot === item.id
                });
            })
        });

        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'snapshotsButtons' },
                React.createElement(CreateModal, { widget: widget, data: formattedData, context: context, utils: snapshotUtils }),
                React.createElement(UploadModal, { widget: widget, data: formattedData, context: context, utils: snapshotUtils })
            ),
            React.createElement(_SnapshotsTable2.default, { widget: widget, data: formattedData, context: context, utils: snapshotUtils })
        );
    }
});

},{"./CreateSnapshotModal":1,"./SnapshotsTable":2,"./UploadSnapshotModal":3}]},{},[1,2,3,4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwbHVnaW5zL3NuYXBzaG90cy9zcmMvQ3JlYXRlU25hcHNob3RNb2RhbC5qcyIsInBsdWdpbnMvc25hcHNob3RzL3NyYy9TbmFwc2hvdHNUYWJsZS5qcyIsInBsdWdpbnMvc25hcHNob3RzL3NyYy9VcGxvYWRTbmFwc2hvdE1vZGFsLmpzIiwicGx1Z2lucy9zbmFwc2hvdHMvc3JjL3dpZGdldC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0FDQUE7Ozs7a0JBSWUsVUFBQyxhQUFELEVBQWtCOztBQUU3QjtBQUFBOztBQUVJLHdCQUFZLEtBQVosRUFBa0IsT0FBbEIsRUFBMkI7QUFBQTs7QUFBQSx3SEFDakIsS0FEaUIsRUFDWCxPQURXOztBQUd2QixrQkFBSyxLQUFMLEdBQWE7QUFDVCwyQkFBVztBQURGLGFBQWI7QUFIdUI7QUFNMUI7O0FBUkw7QUFBQTtBQUFBLGdEQVV3QjtBQUNoQixxQkFBSyxVQUFMLENBQWdCLEtBQUssSUFBTCxDQUFVLFFBQTFCO0FBQ0g7QUFaTDtBQUFBO0FBQUEsaURBYXlCO0FBQ2pCLDhCQUFjLE1BQWQsQ0FBcUIsS0FBSyxJQUFMLENBQVUsUUFBL0IsRUFBeUMsS0FBekMsQ0FBK0MsU0FBL0M7QUFDSDtBQWZMO0FBQUE7QUFBQSxtREFnQjJCO0FBQ25CLDhCQUFjLE1BQWQsQ0FBcUIsS0FBSyxJQUFMLENBQVUsUUFBL0IsRUFBeUMsS0FBekMsQ0FBK0MsU0FBL0M7QUFDQSw4QkFBYyxNQUFkLENBQXFCLEtBQUssSUFBTCxDQUFVLFFBQS9CLEVBQXlDLE1BQXpDO0FBQ0g7QUFuQkw7QUFBQTtBQUFBLHVDQXFCZSxRQXJCZixFQXFCeUI7QUFDakIsOEJBQWMsTUFBZCxDQUFxQixRQUFyQixFQUErQixLQUEvQixDQUFxQztBQUNqQyw4QkFBWSxLQURxQjtBQUVqQyw0QkFBWSxr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QUNJO0FBQUE7QUFBQTtBQUNJO0FBQUE7QUFBQSxrQkFBSyxXQUFVLGtCQUFmO0FBQ0ksb0NBQUMsV0FBRCxJQUFhLFFBQVEsTUFBckIsRUFBNkIsTUFBTSxhQUFuQyxFQUFrRCxTQUFTLE9BQTNELEVBQW9FLE9BQU8sYUFBM0UsR0FESjtBQUVJLG9DQUFDLFdBQUQsSUFBYSxRQUFRLE1BQXJCLEVBQTZCLE1BQU0sYUFBbkMsRUFBa0QsU0FBUyxPQUEzRCxFQUFvRSxPQUFPLGFBQTNFO0FBRkosYUFESjtBQUtJLDREQUFnQixRQUFRLE1BQXhCLEVBQWdDLE1BQU0sYUFBdEMsRUFBcUQsU0FBUyxPQUE5RCxFQUF1RSxPQUFPLGFBQTlFO0FBTEosU0FESjtBQVNIO0FBckRXLENBQWhCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ3JlYXRlZCBieSBraW5uZXJldHppbiBvbiAwNS8xMC8yMDE2LlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IChzbmFwc2hvdFV0aWxzKT0+IHtcblxuICAgIHJldHVybiBjbGFzcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJvcHMsY29udGV4dCkge1xuICAgICAgICAgICAgc3VwZXIocHJvcHMsY29udGV4dCk7XG5cbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlRXJyOiBudWxsXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgICAgIHRoaXMuX2luaXRNb2RhbCh0aGlzLnJlZnMubW9kYWxPYmopO1xuICAgICAgICB9XG4gICAgICAgIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICAgICAgICAgIHNuYXBzaG90VXRpbHMualF1ZXJ5KHRoaXMucmVmcy5tb2RhbE9iaikubW9kYWwoJ3JlZnJlc2gnKTtcbiAgICAgICAgfVxuICAgICAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgICAgICAgIHNuYXBzaG90VXRpbHMualF1ZXJ5KHRoaXMucmVmcy5tb2RhbE9iaikubW9kYWwoJ2Rlc3Ryb3knKTtcbiAgICAgICAgICAgIHNuYXBzaG90VXRpbHMualF1ZXJ5KHRoaXMucmVmcy5tb2RhbE9iaikucmVtb3ZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBfaW5pdE1vZGFsKG1vZGFsT2JqKSB7XG4gICAgICAgICAgICBzbmFwc2hvdFV0aWxzLmpRdWVyeShtb2RhbE9iaikubW9kYWwoe1xuICAgICAgICAgICAgICAgIGNsb3NhYmxlICA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIG9uRGVueSAgICA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIC8vd2luZG93LmFsZXJ0KCdXYWl0IG5vdCB5ZXQhJyk7XG4gICAgICAgICAgICAgICAgICAgIC8vcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgb25BcHByb3ZlIDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHNuYXBzaG90VXRpbHMualF1ZXJ5KCcuY3JlYXRlRm9ybVN1Ym1pdEJ0bicpLmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgX3Nob3dNb2RhbCgpIHtcbiAgICAgICAgICAgIHNuYXBzaG90VXRpbHMualF1ZXJ5KCcuY3JlYXRlU25hcHNob3RNb2RhbCcpLm1vZGFsKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBfb3BlbkZpbGVTZWxlY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgc25hcHNob3RVdGlscy5qUXVlcnkoJyNzbmFwc2hvdEZpbGUnKS5jbGljaygpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgX2NyZWF0ZUZpbGVDaGFuZ2VkKGUpe1xuICAgICAgICAgICAgdmFyIGZ1bGxQYXRoRmlsZU5hbWUgPSBzbmFwc2hvdFV0aWxzLmpRdWVyeShlLmN1cnJlbnRUYXJnZXQpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIGZpbGVuYW1lID0gZnVsbFBhdGhGaWxlTmFtZS5zcGxpdCgnXFxcXCcpLnBvcCgpO1xuXG4gICAgICAgICAgICBzbmFwc2hvdFV0aWxzLmpRdWVyeSgnaW5wdXQuY3JlYXRlU25hcHNob3RGaWxlJykudmFsKGZpbGVuYW1lKS5hdHRyKCd0aXRsZScsZnVsbFBhdGhGaWxlTmFtZSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIF9zdWJtaXRDcmVhdGUoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICB2YXIgdGhpJCA9IHRoaXM7XG5cbiAgICAgICAgICAgIHZhciBmb3JtT2JqID0gc25hcHNob3RVdGlscy5qUXVlcnkoZS5jdXJyZW50VGFyZ2V0KTtcblxuICAgICAgICAgICAgLy8gQ2xlYXIgZXJyb3JzXG4gICAgICAgICAgICBmb3JtT2JqLmZpbmQoJy5lcnJvcjpub3QoLm1lc3NhZ2UpJykucmVtb3ZlQ2xhc3MoJ2Vycm9yJyk7XG4gICAgICAgICAgICBmb3JtT2JqLmZpbmQoJy51aS5lcnJvci5tZXNzYWdlJykuaGlkZSgpO1xuXG4gICAgICAgICAgICAvLyBHZXQgdGhlIGRhdGFcbiAgICAgICAgICAgIHZhciBzbmFwc2hvdElkID0gZm9ybU9iai5maW5kKFwiaW5wdXRbbmFtZT0nc25hcHNob3RJZCddXCIpLnZhbCgpO1xuXG4gICAgICAgICAgICAvLyBEaXNhbGJlIHRoZSBmb3JtXG4gICAgICAgICAgICBmb3JtT2JqLnBhcmVudHMoJy5tb2RhbCcpLmZpbmQoJy5hY3Rpb25zIC5idXR0b24nKS5hdHRyKCdkaXNhYmxlZCcsJ2Rpc2FibGVkJykuYWRkQ2xhc3MoJ2Rpc2FibGVkIGxvYWRpbmcnKTtcbiAgICAgICAgICAgIGZvcm1PYmouYWRkQ2xhc3MoJ2xvYWRpbmcnKTtcblxuICAgICAgICAgICAgLy8gQ2FsbCBjcmVhdGUgbWV0aG9kXG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IHRoaSQucHJvcHMuY29udGV4dC5nZXRNYW5hZ2VyVXJsKCkgKyAnL2FwaS92Mi4xL3NuYXBzaG90cy8nK3NuYXBzaG90SWQsXG4gICAgICAgICAgICAvL2RhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICBcImhlYWRlcnNcIjoge1wiY29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwifSxcbiAgICAgICAgICAgIG1ldGhvZDogJ3B1dCcsXG4gICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgJ3NuYXBzaG90X2lkJzogc25hcHNob3RJZFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5kb25lKChzbmFwc2hvdCk9PiB7XG4gICAgICAgICAgICAgICAgdGhpJC5wcm9wcy5jb250ZXh0LnNldFZhbHVlKHRoaXMucHJvcHMud2lkZ2V0LmlkICsgJ2NyZWF0ZVNuYXBzaG90JyxudWxsKTtcblxuICAgICAgICAgICAgICAgIHRoaSQucHJvcHMuY29udGV4dC5nZXRFdmVudEJ1cygpLnRyaWdnZXIoJ3NuYXBzaG90czpyZWZyZXNoJyk7XG5cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKT0+e1xuICAgICAgICAgICAgICAgIHRoaSQuc2V0U3RhdGUoe2Vycm9yOiAoanFYSFIucmVzcG9uc2VKU09OICYmIGpxWEhSLnJlc3BvbnNlSlNPTi5tZXNzYWdlID8ganFYSFIucmVzcG9uc2VKU09OLm1lc3NhZ2UgOiBlcnJvclRocm93bil9KVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGZvcm1PYmoucGFyZW50cygnLm1vZGFsJykuZmluZCgnLmFjdGlvbnMgLmJ1dHRvbicpLnJlbW92ZUF0dHIoJ2Rpc2FibGVkJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkIGxvYWRpbmcnKTtcbiAgICAgICAgICAgIGZvcm1PYmoucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKTtcblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgX3Byb2Nlc3NDcmVhdGVFcnJJZk5lZWRlZCh4aHIpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UubWVzc2FnZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtjcmVhdGVFcnI6IHJlc3BvbnNlLm1lc3NhZ2V9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnIoJ0Nhbm5vdCBwYXJzZSBjcmVhdGUgcmVzcG9uc2UnLGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJ1aSBsYWJlbGVkIGljb24gYnV0dG9uIGNyZWF0ZVNuYXBzaG90XCIgb25DbGljaz17dGhpcy5fc2hvd01vZGFsfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImFkZCBpY29uXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgQ3JlYXRlXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgbW9kYWwgY3JlYXRlU25hcHNob3RNb2RhbFwiIHJlZj0nbW9kYWxPYmonPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoZWFkZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJhZGQgaWNvblwiPjwvaT4gQ3JlYXRlIHNuYXBzaG90XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtIGNsYXNzTmFtZT1cInVpIGZvcm0gY3JlYXRlRm9ybVwiIG9uU3VibWl0PXt0aGlzLl9zdWJtaXRDcmVhdGUuYmluZCh0aGlzKX0gYWN0aW9uPVwiXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9J3NuYXBzaG90SWQnIGlkPSdzbmFwc2hvdElkJyBwbGFjZWhvbGRlcj1cIlNuYXBzaG90IElEXCIgcmVxdWlyZWQvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5jcmVhdGVFcnIgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgZXJyb3IgbWVzc2FnZSBjcmVhdGVGYWlsZWRcIiBzdHlsZT17e1wiZGlzcGxheVwiOlwiYmxvY2tcIn19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhlYWRlclwiPkVycm9yIGNyZWF0ZWluZyBmaWxlPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPnt0aGlzLnN0YXRlLmNyZWF0ZUVycn08L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT0nc3VibWl0JyBzdHlsZT17e1wiZGlzcGxheVwiOiBcIm5vbmVcIn19IGNsYXNzTmFtZT0nY3JlYXRlRm9ybVN1Ym1pdEJ0bicvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFjdGlvbnNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIGNhbmNlbCBiYXNpYyBidXR0b25cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwicmVtb3ZlIGljb25cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENhbmNlbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgb2sgZ3JlZW4gIGJ1dHRvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJhZGQgaWNvblwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ3JlYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9O1xufTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBraW5uZXJldHppbiBvbiAwMi8xMC8yMDE2LlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzLGNvbnRleHQpIHtcbiAgICAgICAgc3VwZXIocHJvcHMsY29udGV4dCk7XG5cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIGNvbmZpcm1EZWxldGU6ZmFsc2VcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9zZWxlY3RTbmFwc2hvdCAoaXRlbSl7XG4gICAgICAgIHZhciBvbGRTZWxlY3RlZFNuYXBzaG90SWQgPSB0aGlzLnByb3BzLmNvbnRleHQuZ2V0VmFsdWUoJ3NuYXBzaG90SWQnKTtcbiAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LnNldFZhbHVlKCdzbmFwc2hvdElkJyxpdGVtLmlkID09PSBvbGRTZWxlY3RlZFNuYXBzaG90SWQgPyBudWxsIDogaXRlbS5pZCk7XG4gICAgfVxuXG4gICAgX2RlbGV0ZVNuYXBzaG90Q29uZmlybShpdGVtLGV2ZW50KXtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBjb25maXJtRGVsZXRlIDogdHJ1ZSxcbiAgICAgICAgICAgIGl0ZW06IGl0ZW1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgX3Jlc3RvcmVTbmFwc2hvdChpdGVtLGV2ZW50KSB7XG4gICAgICAgIHZhciB0aGkkID0gdGhpcztcbiAgICAgICAgdmFyIGRhdGEgPSB7Zm9yY2U6IGZhbHNlLCByZWNyZWF0ZV9kZXBsb3ltZW50c19lbnZzOiBmYWxzZX07XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IHRoaSQucHJvcHMuY29udGV4dC5nZXRNYW5hZ2VyVXJsKCkgKyAnL2FwaS92Mi4xL3NuYXBzaG90cy8nK2l0ZW0uaWQrJy9yZXN0b3JlJyxcbiAgICAgICAgICAgIFwiaGVhZGVyc1wiOiB7XCJjb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJ9LFxuICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgICAgICAgICBtZXRob2Q6ICdwb3N0J1xuICAgICAgICB9KVxuICAgICAgICAgICAgLmRvbmUoKCk9PiB7XG4gICAgICAgICAgICAgICAgdGhpJC5wcm9wcy5jb250ZXh0LmdldEV2ZW50QnVzKCkudHJpZ2dlcignc25hcHNob3RzOnJlZnJlc2gnKTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pPT57XG4gICAgICAgICAgICAgICAgdGhpJC5zZXRTdGF0ZSh7ZXJyb3I6IChqcVhIUi5yZXNwb25zZUpTT04gJiYganFYSFIucmVzcG9uc2VKU09OLm1lc3NhZ2UgPyBqcVhIUi5yZXNwb25zZUpTT04ubWVzc2FnZSA6IGVycm9yVGhyb3duKX0pXG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBfZG93bmxvYWRTbmFwc2hvdChpdGVtLGV2ZW50KSB7XG4gICAgICAgIHZhciB0aGkkID0gdGhpcztcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogdGhpJC5wcm9wcy5jb250ZXh0LmdldE1hbmFnZXJVcmwoKSArICcvYXBpL3YyLjEvc25hcHNob3RzLycraXRlbS5pZCsnL2FyY2hpdmUnLFxuICAgICAgICAgICAgbWV0aG9kOiAnZ2V0J1xuICAgICAgICB9KVxuICAgICAgICAgICAgLmRvbmUoKCk9PiB7XG4gICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSB0aGkkLnByb3BzLmNvbnRleHQuZ2V0TWFuYWdlclVybCgpICsgJy9hcGkvdjIuMS9zbmFwc2hvdHMvJytpdGVtLmlkKycvYXJjaGl2ZSc7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKT0+e1xuICAgICAgICAgICAgICAgIHRoaSQuc2V0U3RhdGUoe2Vycm9yOiAoanFYSFIucmVzcG9uc2VKU09OICYmIGpxWEhSLnJlc3BvbnNlSlNPTi5tZXNzYWdlID8ganFYSFIucmVzcG9uc2VKU09OLm1lc3NhZ2UgOiBlcnJvclRocm93bil9KVxuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgX2RlbGV0ZVNuYXBzaG90KCkge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGUuaXRlbSkge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7ZXJyb3I6ICdTb21ldGhpbmcgd2VudCB3cm9uZywgbm8gc25hcHNob3Qgd2FzIHNlbGVjdGVkIGZvciBkZWxldGUnfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdGhpJCA9IHRoaXM7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IHRoaSQucHJvcHMuY29udGV4dC5nZXRNYW5hZ2VyVXJsKCkgKyAnL2FwaS92Mi4xL3NuYXBzaG90cy8nK3RoaXMuc3RhdGUuaXRlbS5pZCxcbiAgICAgICAgICAgIFwiaGVhZGVyc1wiOiB7XCJjb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJ9LFxuICAgICAgICAgICAgbWV0aG9kOiAnZGVsZXRlJ1xuICAgICAgICB9KVxuICAgICAgICAgICAgLmRvbmUoKCk9PiB7XG4gICAgICAgICAgICAgICAgdGhpJC5zZXRTdGF0ZSh7Y29uZmlybURlbGV0ZTogZmFsc2V9KTtcbiAgICAgICAgICAgICAgICB0aGkkLnByb3BzLmNvbnRleHQuZ2V0RXZlbnRCdXMoKS50cmlnZ2VyKCdzbmFwc2hvdHM6cmVmcmVzaCcpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pPT57XG4gICAgICAgICAgICAgICAgdGhpJC5zZXRTdGF0ZSh7Y29uZmlybURlbGV0ZTogZmFsc2V9KTtcbiAgICAgICAgICAgICAgICB0aGkkLnNldFN0YXRlKHtlcnJvcjogKGpxWEhSLnJlc3BvbnNlSlNPTiAmJiBqcVhIUi5yZXNwb25zZUpTT04ubWVzc2FnZSA/IGpxWEhSLnJlc3BvbnNlSlNPTi5tZXNzYWdlIDogZXJyb3JUaHJvd24pfSlcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9yZWZyZXNoRGF0YSgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LnJlZnJlc2goKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LmdldEV2ZW50QnVzKCkub24oJ3NuYXBzaG90czpyZWZyZXNoJyx0aGlzLl9yZWZyZXNoRGF0YSx0aGlzKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jb250ZXh0LmdldEV2ZW50QnVzKCkub2ZmKCdzbmFwc2hvdHM6cmVmcmVzaCcsdGhpcy5fcmVmcmVzaERhdGEpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdmFyIENvbmZpcm0gPSBTdGFnZS5CYXNpYy5Db25maXJtO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzbmFwc2hvdHNUYWJsZURpdlwiPlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5lcnJvciA/XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIGVycm9yIG1lc3NhZ2VcIiBzdHlsZT17e1wiZGlzcGxheVwiOlwiYmxvY2tcIn19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVhZGVyXCI+RXJyb3IgT2NjdXJlZDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPnt0aGlzLnN0YXRlLmVycm9yfTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgJydcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT1cInVpIHZlcnkgY29tcGFjdCB0YWJsZSBzbmFwc2hvdHNUYWJsZVwiPlxuICAgICAgICAgICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5JRDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+Q3JlYXRlZCBhdDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+U3RhdHVzPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD48L3RoPlxuICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuZGF0YS5pdGVtcy5tYXAoKGl0ZW0pPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyIGtleT17aXRlbS5pZH0gY2xhc3NOYW1lPXtcInJvdyBcIisgKGl0ZW0uaXNTZWxlY3RlZCA/ICdhY3RpdmUnIDogJycpfSBvbkNsaWNrPXt0aGlzLl9zZWxlY3RTbmFwc2hvdC5iaW5kKHRoaXMsaXRlbSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT0nc25hcHNob3ROYW1lJyBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+e2l0ZW0uaWR9PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57aXRlbS5jcmVhdGVkX2F0fTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e2l0ZW0uc3RhdHVzfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dBY3Rpb25zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cInVuZG8gaWNvbiBsaW5rIGJvcmRlcmVkXCIgdGl0bGU9XCJSZXN0b3JlXCIgb25DbGljaz17dGhpcy5fcmVzdG9yZVNuYXBzaG90LmJpbmQodGhpcyxpdGVtKX0+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJkb3dubG9hZCBpY29uIGxpbmsgYm9yZGVyZWRcIiB0aXRsZT1cIkRvd25sb2FkXCIgb25DbGljaz17dGhpcy5fZG93bmxvYWRTbmFwc2hvdC5iaW5kKHRoaXMsaXRlbSl9PjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwidHJhc2ggaWNvbiBsaW5rIGJvcmRlcmVkXCIgdGl0bGU9XCJEZWxldGVcIiBvbkNsaWNrPXt0aGlzLl9kZWxldGVTbmFwc2hvdENvbmZpcm0uYmluZCh0aGlzLGl0ZW0pfT48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgICAgIDxDb25maXJtIHRpdGxlPSdBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcmVtb3ZlIHRoaXMgc25hcHNob3Q/J1xuICAgICAgICAgICAgICAgICAgICAgICAgIHNob3c9e3RoaXMuc3RhdGUuY29uZmlybURlbGV0ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICBvbkNvbmZpcm09e3RoaXMuX2RlbGV0ZVNuYXBzaG90LmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgb25DYW5jZWw9eygpPT50aGlzLnNldFN0YXRlKHtjb25maXJtRGVsZXRlIDogZmFsc2V9KX0gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICk7XG4gICAgfVxufTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBraW5uZXJldHppbiBvbiAwNS8xMC8yMDE2LlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IChzbmFwc2hvdFV0aWxzKT0+IHtcblxuICAgIHJldHVybiBjbGFzcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJvcHMsY29udGV4dCkge1xuICAgICAgICAgICAgc3VwZXIocHJvcHMsY29udGV4dCk7XG5cbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICAgICAgdXBsb2FkRXJyOiBudWxsXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgICAgIHRoaXMuX2luaXRNb2RhbCh0aGlzLnJlZnMubW9kYWxPYmopO1xuICAgICAgICB9XG4gICAgICAgIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICAgICAgICAgIHNuYXBzaG90VXRpbHMualF1ZXJ5KHRoaXMucmVmcy5tb2RhbE9iaikubW9kYWwoJ3JlZnJlc2gnKTtcbiAgICAgICAgfVxuICAgICAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgICAgICAgIHNuYXBzaG90VXRpbHMualF1ZXJ5KHRoaXMucmVmcy5tb2RhbE9iaikubW9kYWwoJ2Rlc3Ryb3knKTtcbiAgICAgICAgICAgIHNuYXBzaG90VXRpbHMualF1ZXJ5KHRoaXMucmVmcy5tb2RhbE9iaikucmVtb3ZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBfaW5pdE1vZGFsKG1vZGFsT2JqKSB7XG4gICAgICAgICAgICBzbmFwc2hvdFV0aWxzLmpRdWVyeShtb2RhbE9iaikubW9kYWwoe1xuICAgICAgICAgICAgICAgIGNsb3NhYmxlICA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIG9uRGVueSAgICA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIC8vd2luZG93LmFsZXJ0KCdXYWl0IG5vdCB5ZXQhJyk7XG4gICAgICAgICAgICAgICAgICAgIC8vcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgb25BcHByb3ZlIDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHNuYXBzaG90VXRpbHMualF1ZXJ5KCcudXBsb2FkRm9ybVN1Ym1pdEJ0bicpLmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgX3Nob3dNb2RhbCgpIHtcbiAgICAgICAgICAgIHNuYXBzaG90VXRpbHMualF1ZXJ5KCcudXBsb2FkU25hcHNob3RNb2RhbCcpLm1vZGFsKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBfb3BlbkZpbGVTZWxlY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgc25hcHNob3RVdGlscy5qUXVlcnkoJyNzbmFwc2hvdEZpbGUnKS5jbGljaygpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgX3VwbG9hZEZpbGVDaGFuZ2VkKGUpe1xuICAgICAgICAgICAgdmFyIGZ1bGxQYXRoRmlsZU5hbWUgPSBzbmFwc2hvdFV0aWxzLmpRdWVyeShlLmN1cnJlbnRUYXJnZXQpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIGZpbGVuYW1lID0gZnVsbFBhdGhGaWxlTmFtZS5zcGxpdCgnXFxcXCcpLnBvcCgpO1xuXG4gICAgICAgICAgICBzbmFwc2hvdFV0aWxzLmpRdWVyeSgnaW5wdXQudXBsb2FkU25hcHNob3RGaWxlJykudmFsKGZpbGVuYW1lKS5hdHRyKCd0aXRsZScsZnVsbFBhdGhGaWxlTmFtZSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIF9zdWJtaXRVcGxvYWQoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICB2YXIgdGhpJCA9IHRoaXM7XG5cbiAgICAgICAgICAgIHZhciBmb3JtT2JqID0gc25hcHNob3RVdGlscy5qUXVlcnkoZS5jdXJyZW50VGFyZ2V0KTtcblxuICAgICAgICAgICAgLy8gQ2xlYXIgZXJyb3JzXG4gICAgICAgICAgICBmb3JtT2JqLmZpbmQoJy5lcnJvcjpub3QoLm1lc3NhZ2UpJykucmVtb3ZlQ2xhc3MoJ2Vycm9yJyk7XG4gICAgICAgICAgICBmb3JtT2JqLmZpbmQoJy51aS5lcnJvci5tZXNzYWdlJykuaGlkZSgpO1xuXG4gICAgICAgICAgICAvLyBHZXQgdGhlIGRhdGFcbiAgICAgICAgICAgIHZhciBzbmFwc2hvdElkID0gZm9ybU9iai5maW5kKFwiaW5wdXRbbmFtZT0nc25hcHNob3RJZCddXCIpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIHNuYXBzaG90RmlsZVVybCA9IGZvcm1PYmouZmluZChcImlucHV0W25hbWU9J3NuYXBzaG90RmlsZVVybCddXCIpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIGZpbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc25hcHNob3RGaWxlJykuZmlsZXNbMF07XG5cbiAgICAgICAgICAgIC8vIENoZWNrIHRoYXQgd2UgaGF2ZSBhbGwgd2UgbmVlZFxuICAgICAgICAgICAgaWYgKF8uaXNFbXB0eShzbmFwc2hvdEZpbGVVcmwpICYmICFmaWxlKSB7XG4gICAgICAgICAgICAgICAgZm9ybU9iai5hZGRDbGFzcygnZXJyb3InKTtcbiAgICAgICAgICAgICAgICBmb3JtT2JqLmZpbmQoXCJpbnB1dC51cGxvYWRTbmFwc2hvdEZpbGVcIikucGFyZW50cygnLmZpZWxkJykuYWRkQ2xhc3MoJ2Vycm9yJyk7XG4gICAgICAgICAgICAgICAgZm9ybU9iai5maW5kKFwiaW5wdXRbbmFtZT0nc25hcHNob3RGaWxlVXJsJ11cIikucGFyZW50cygnLmZpZWxkJykuYWRkQ2xhc3MoJ2Vycm9yJyk7XG4gICAgICAgICAgICAgICAgZm9ybU9iai5maW5kKCcudWkuZXJyb3IubWVzc2FnZScpLnNob3coKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRGlzYWxiZSB0aGUgZm9ybVxuICAgICAgICAgICAgZm9ybU9iai5wYXJlbnRzKCcubW9kYWwnKS5maW5kKCcuYWN0aW9ucyAuYnV0dG9uJykuYXR0cignZGlzYWJsZWQnLCdkaXNhYmxlZCcpLmFkZENsYXNzKCdkaXNhYmxlZCBsb2FkaW5nJyk7XG4gICAgICAgICAgICBmb3JtT2JqLmFkZENsYXNzKCdsb2FkaW5nJyk7XG5cbiAgICAgICAgICAgIC8vIENhbGwgdXBsb2FkIG1ldGhvZFxuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgKHhoci51cGxvYWQgfHwgeGhyKS5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZG9uZSA9IGUucG9zaXRpb24gfHwgZS5sb2FkZWRcbiAgICAgICAgICAgICAgICB2YXIgdG90YWwgPSBlLnRvdGFsU2l6ZSB8fCBlLnRvdGFsO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd4aHIgcHJvZ3Jlc3M6ICcgKyBNYXRoLnJvdW5kKGRvbmUvdG90YWwqMTAwKSArICclJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3hociB1cGxvYWQgZXJyb3InLCBlLCB0aGlzLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgdGhpJC5fcHJvY2Vzc1VwbG9hZEVycklmTmVlZGVkKHRoaXMpO1xuICAgICAgICAgICAgICAgIGZvcm1PYmoucGFyZW50cygnLm1vZGFsJykuZmluZCgnLmFjdGlvbnMgLmJ1dHRvbicpLnJlbW92ZUF0dHIoJ2Rpc2FibGVkJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkIGxvYWRpbmcnKTtcbiAgICAgICAgICAgICAgICBmb3JtT2JqLnJlbW92ZUNsYXNzKCdsb2FkaW5nJyk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3hociB1cGxvYWQgY29tcGxldGUnLCBlLCB0aGlzLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgZm9ybU9iai5wYXJlbnRzKCcubW9kYWwnKS5maW5kKCcuYWN0aW9ucyAuYnV0dG9uJykucmVtb3ZlQXR0cignZGlzYWJsZWQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQgbG9hZGluZycpO1xuICAgICAgICAgICAgICAgIGZvcm1PYmoucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKTtcblxuICAgICAgICAgICAgICAgIGlmICghdGhpJC5fcHJvY2Vzc1VwbG9hZEVycklmTmVlZGVkKHRoaXMpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1PYmoucGFyZW50cygnLm1vZGFsJykubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpJC5wcm9wcy5jb250ZXh0LnJlZnJlc2goKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmb3JtT2JqLmZpbmQoJy51aS5lcnJvci5tZXNzYWdlLnVwbG9hZEZhaWxlZCcpLnNob3coKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHhoci5vcGVuKCdwdXQnLHRoaXMucHJvcHMuY29udGV4dC5nZXRNYW5hZ2VyVXJsKCkgK1xuICAgICAgICAgICAgICAgICcvYXBpL3YyLjEvc25hcHNob3RzLycgKyBzbmFwc2hvdElkICsgXCIvYXJjaGl2ZVwiKTtcbiAgICAgICAgICAgIHhoci5zZW5kKGZpbGUpO1xuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBfcHJvY2Vzc1VwbG9hZEVycklmTmVlZGVkKHhocikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5tZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3VwbG9hZEVycjogcmVzcG9uc2UubWVzc2FnZX0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycignQ2Fubm90IHBhcnNlIHVwbG9hZCByZXNwb25zZScsZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cInVpIGxhYmVsZWQgaWNvbiBidXR0b24gdXBsb2FkU25hcHNob3RcIiBvbkNsaWNrPXt0aGlzLl9zaG93TW9kYWx9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwidXBsb2FkIGljb25cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICBVcGxvYWRcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBtb2RhbCB1cGxvYWRTbmFwc2hvdE1vZGFsXCIgcmVmPSdtb2RhbE9iaic+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhlYWRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cInVwbG9hZCBpY29uXCI+PC9pPiBVcGxvYWQgc25hcHNob3RcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0gY2xhc3NOYW1lPVwidWkgZm9ybSB1cGxvYWRGb3JtXCIgb25TdWJtaXQ9e3RoaXMuX3N1Ym1pdFVwbG9hZC5iaW5kKHRoaXMpfSBhY3Rpb249XCJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZHNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQgbmluZSB3aWRlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBsYWJlbGVkIGlucHV0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgbGFiZWxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGh0dHA6Ly9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9J3NuYXBzaG90RmlsZVVybCcgcGxhY2Vob2xkZXI9XCJFbnRlciBzbmFwc2hvdCB1cmxcIj48L2lucHV0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQgb25lIHdpZGVcIiBzdHlsZT17e1wicG9zaXRpb25cIjpcInJlbGF0aXZlXCJ9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIHZlcnRpY2FsIGRpdmlkZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZCBlaWdodCB3aWRlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBhY3Rpb24gaW5wdXRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgcmVhZE9ubHk9J3RydWUnIHZhbHVlPVwiXCIgY2xhc3NOYW1lPVwidXBsb2FkU25hcHNob3RGaWxlXCIgb25DbGljaz17dGhpcy5fb3BlbkZpbGVTZWxlY3Rpb259PjwvaW5wdXQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwidWkgaWNvbiBidXR0b24gdXBsb2FkU25hcHNob3RGaWxlXCIgb25DbGljaz17dGhpcy5fb3BlbkZpbGVTZWxlY3Rpb259PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiYXR0YWNoIGljb25cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiIG5hbWU9J3NuYXBzaG90RmlsZScgaWQ9XCJzbmFwc2hvdEZpbGVcIiBzdHlsZT17e1wiZGlzcGxheVwiOiBcIm5vbmVcIn19IG9uQ2hhbmdlPXt0aGlzLl91cGxvYWRGaWxlQ2hhbmdlZH0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPSdzbmFwc2hvdElkJyBpZD0nc25hcHNob3RJZCcgcGxhY2Vob2xkZXI9XCJTbmFwc2hvdCBJRFwiIHJlcXVpcmVkLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUudXBsb2FkRXJyID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIGVycm9yIG1lc3NhZ2UgdXBsb2FkRmFpbGVkXCIgc3R5bGU9e3tcImRpc3BsYXlcIjpcImJsb2NrXCJ9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoZWFkZXJcIj5FcnJvciB1cGxvYWRpbmcgZmlsZTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD57dGhpcy5zdGF0ZS51cGxvYWRFcnJ9PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9J3N1Ym1pdCcgc3R5bGU9e3tcImRpc3BsYXlcIjogXCJub25lXCJ9fSBjbGFzc05hbWU9J3VwbG9hZEZvcm1TdWJtaXRCdG4nLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhY3Rpb25zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBjYW5jZWwgYmFzaWMgYnV0dG9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cInJlbW92ZSBpY29uXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDYW5jZWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIG9rIGdyZWVuICBidXR0b25cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwidXBsb2FkIGljb25cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFVwbG9hZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfTtcbn07XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkga2lubmVyZXR6aW4gb24gMDcvMDkvMjAxNi5cbiAqL1xuXG5pbXBvcnQgU25hcHNob3RzVGFibGUgZnJvbSAnLi9TbmFwc2hvdHNUYWJsZSc7XG5pbXBvcnQgcmVuZGVyVXBsb2FkU25hcHNob3RNb2RhbCBmcm9tICcuL1VwbG9hZFNuYXBzaG90TW9kYWwnO1xuaW1wb3J0IHJlbmRlckNyZWF0ZVNuYXBzaG90TW9kYWwgZnJvbSAnLi9DcmVhdGVTbmFwc2hvdE1vZGFsJztcblxudmFyIFVwbG9hZE1vZGFsID0gbnVsbDtcbnZhciBDcmVhdGVNb2RhbCA9IG51bGw7XG5cblN0YWdlLmFkZFBsdWdpbih7XG4gICAgaWQ6IFwic25hcHNob3RzXCIsXG4gICAgbmFtZTogXCJTbmFwc2hvdHMgbGlzdFwiLFxuICAgIGRlc2NyaXB0aW9uOiAnYmxhaCBibGFoIGJsYWgnLFxuICAgIGluaXRpYWxXaWR0aDogNCxcbiAgICBpbml0aWFsSGVpZ2h0OiA0LFxuICAgIGNvbG9yIDogXCJibHVlXCIsXG4gICAgaXNSZWFjdDogdHJ1ZSxcbiAgICBpbml0OiBmdW5jdGlvbihzbmFwc2hvdFV0aWxzKSB7XG4gICAgICAgIFVwbG9hZE1vZGFsID0gcmVuZGVyVXBsb2FkU25hcHNob3RNb2RhbChzbmFwc2hvdFV0aWxzKTtcbiAgICAgICAgQ3JlYXRlTW9kYWwgPSByZW5kZXJDcmVhdGVTbmFwc2hvdE1vZGFsKHNuYXBzaG90VXRpbHMpO1xuICAgIH0sXG5cbiAgICBmZXRjaERhdGE6IGZ1bmN0aW9uKHNuYXBzaG90LGNvbnRleHQsc25hcHNob3RVdGlscykge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIChyZXNvbHZlLHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgc25hcHNob3RVdGlscy5qUXVlcnkuZ2V0KHtcbiAgICAgICAgICAgICAgICB1cmw6IGNvbnRleHQuZ2V0TWFuYWdlclVybCgpICsgJy9hcGkvdjIuMS9zbmFwc2hvdHM/X2luY2x1ZGU9aWQsY3JlYXRlZF9hdCxzdGF0dXMnLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5kb25lKChzbmFwc2hvdHMpPT4ge3Jlc29sdmUoc25hcHNob3RzKTt9KVxuICAgICAgICAgICAgICAgIC5mYWlsKHJlamVjdClcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24od2lkZ2V0LGRhdGEsZXJyb3IsY29udGV4dCxzbmFwc2hvdFV0aWxzKSB7XG5cbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gc25hcHNob3RVdGlscy5yZW5kZXJSZWFjdExvYWRpbmcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIHNuYXBzaG90VXRpbHMucmVuZGVyUmVhY3RFcnJvcihlcnJvcik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2VsZWN0ZWRTbmFwc2hvdCA9IGNvbnRleHQuZ2V0VmFsdWUoJ3NuYXBzaG90SWQnKTtcbiAgICAgICAgdmFyIGZvcm1hdHRlZERhdGEgPSBPYmplY3QuYXNzaWduKHt9LGRhdGEse1xuICAgICAgICAgICAgaXRlbXM6IF8ubWFwIChkYXRhLml0ZW1zLChpdGVtKT0+e1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LGl0ZW0se1xuICAgICAgICAgICAgICAgICAgICBjcmVhdGVkX2F0OiBzbmFwc2hvdFV0aWxzLm1vbWVudChpdGVtLmNyZWF0ZWRfYXQsJ1lZWVktTU0tREQgSEg6bW06c3MuU1NTU1MnKS5mb3JtYXQoJ0RELU1NLVlZWVkgSEg6bW0nKSwgLy8yMDE2LTA3LTIwIDA5OjEwOjUzLjEwMzU3OVxuICAgICAgICAgICAgICAgICAgICBpc1NlbGVjdGVkOiBzZWxlY3RlZFNuYXBzaG90ID09PSBpdGVtLmlkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic25hcHNob3RzQnV0dG9uc1wiPlxuICAgICAgICAgICAgICAgICAgICA8Q3JlYXRlTW9kYWwgd2lkZ2V0PXt3aWRnZXR9IGRhdGE9e2Zvcm1hdHRlZERhdGF9IGNvbnRleHQ9e2NvbnRleHR9IHV0aWxzPXtzbmFwc2hvdFV0aWxzfS8+XG4gICAgICAgICAgICAgICAgICAgIDxVcGxvYWRNb2RhbCB3aWRnZXQ9e3dpZGdldH0gZGF0YT17Zm9ybWF0dGVkRGF0YX0gY29udGV4dD17Y29udGV4dH0gdXRpbHM9e3NuYXBzaG90VXRpbHN9Lz5cbiAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPFNuYXBzaG90c1RhYmxlIHdpZGdldD17d2lkZ2V0fSBkYXRhPXtmb3JtYXR0ZWREYXRhfSBjb250ZXh0PXtjb250ZXh0fSB1dGlscz17c25hcHNob3RVdGlsc30vPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufSk7Il19
