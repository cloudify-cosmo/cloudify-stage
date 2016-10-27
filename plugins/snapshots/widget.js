(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
                                    React.createElement('input', _defineProperty({ type: 'text', required: true, name: 'snapshotId', id: 'snapshotId', placeholder: 'Snapshot ID' }, 'required', true))
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
                                        React.createElement('i', { className: 'restore icon link bordered', title: 'Restore', onClick: _this2._restoreSnapshot.bind(_this2, item) }),
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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
                                    React.createElement('input', _defineProperty({ type: 'text', required: true, name: 'snapshotId', id: 'snapshotId', placeholder: 'Snapshot ID' }, 'required', true))
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
            React.createElement(_SnapshotsTable2.default, { widget: widget, data: formattedData, context: context, utils: snapshotUtils }),
            React.createElement(CreateModal, { widget: widget, data: formattedData, context: context, utils: snapshotUtils }),
            React.createElement(UploadModal, { widget: widget, data: formattedData, context: context, utils: snapshotUtils })
        );
    }
});

},{"./CreateSnapshotModal":1,"./SnapshotsTable":2,"./UploadSnapshotModal":3}]},{},[2,3,4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwbHVnaW5zL3NuYXBzaG90cy9zcmMvQ3JlYXRlU25hcHNob3RNb2RhbC5qcyIsInBsdWdpbnMvc25hcHNob3RzL3NyYy9TbmFwc2hvdHNUYWJsZS5qcyIsInBsdWdpbnMvc25hcHNob3RzL3NyYy9VcGxvYWRTbmFwc2hvdE1vZGFsLmpzIiwicGx1Z2lucy9zbmFwc2hvdHMvc3JjL3dpZGdldC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQTs7OztrQkFJZSxVQUFDLGFBQUQsRUFBa0I7O0FBRTdCO0FBQUE7O0FBRUksd0JBQVksS0FBWixFQUFrQixPQUFsQixFQUEyQjtBQUFBOztBQUFBLHdIQUNqQixLQURpQixFQUNYLE9BRFc7O0FBR3ZCLGtCQUFLLEtBQUwsR0FBYTtBQUNULDJCQUFXO0FBREYsYUFBYjtBQUh1QjtBQU0xQjs7QUFSTDtBQUFBO0FBQUEsZ0RBVXdCO0FBQ2hCLHFCQUFLLFVBQUwsQ0FBZ0IsS0FBSyxJQUFMLENBQVUsUUFBMUI7QUFDSDtBQVpMO0FBQUE7QUFBQSxpREFheUI7QUFDakIsOEJBQWMsTUFBZCxDQUFxQixLQUFLLElBQUwsQ0FBVSxRQUEvQixFQUF5QyxLQUF6QyxDQUErQyxTQUEvQztBQUNIO0FBZkw7QUFBQTtBQUFBLG1EQWdCMkI7QUFDbkIsOEJBQWMsTUFBZCxDQUFxQixLQUFLLElBQUwsQ0FBVSxRQUEvQixFQUF5QyxLQUF6QyxDQUErQyxTQUEvQztBQUNBLDhCQUFjLE1BQWQsQ0FBcUIsS0FBSyxJQUFMLENBQVUsUUFBL0IsRUFBeUMsTUFBekM7QUFDSDtBQW5CTDtBQUFBO0FBQUEsdUNBcUJlLFFBckJmLEVBcUJ5QjtBQUNqQiw4QkFBYyxNQUFkLENBQXFCLFFBQXJCLEVBQStCLEtBQS9CLENBQXFDO0FBQ2pDLDhCQUFZLEtBRHFCO0FBRWpDLDRCQUFZLGtCQUFVO0FBQ2xCO0FBQ0E7QUFDSCxx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a0QsU0FBUyxPQUEzRCxFQUFvRSxPQUFPLGFBQTNFLEdBRko7QUFHSSxnQ0FBQyxXQUFELElBQWEsUUFBUSxNQUFyQixFQUE2QixNQUFNLGFBQW5DLEVBQWtELFNBQVMsT0FBM0QsRUFBb0UsT0FBTyxhQUEzRTtBQUhKLFNBREo7QUFPSDtBQW5EVyxDQUFoQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENyZWF0ZWQgYnkga2lubmVyZXR6aW4gb24gMDUvMTAvMjAxNi5cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCAoc25hcHNob3RVdGlscyk9PiB7XG5cbiAgICByZXR1cm4gY2xhc3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByb3BzLGNvbnRleHQpIHtcbiAgICAgICAgICAgIHN1cGVyKHByb3BzLGNvbnRleHQpO1xuXG4gICAgICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgICAgIGNyZWF0ZUVycjogbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgICAgICB0aGlzLl9pbml0TW9kYWwodGhpcy5yZWZzLm1vZGFsT2JqKTtcbiAgICAgICAgfVxuICAgICAgICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgICAgICAgICBzbmFwc2hvdFV0aWxzLmpRdWVyeSh0aGlzLnJlZnMubW9kYWxPYmopLm1vZGFsKCdyZWZyZXNoJyk7XG4gICAgICAgIH1cbiAgICAgICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgICAgICAgICBzbmFwc2hvdFV0aWxzLmpRdWVyeSh0aGlzLnJlZnMubW9kYWxPYmopLm1vZGFsKCdkZXN0cm95Jyk7XG4gICAgICAgICAgICBzbmFwc2hvdFV0aWxzLmpRdWVyeSh0aGlzLnJlZnMubW9kYWxPYmopLnJlbW92ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgX2luaXRNb2RhbChtb2RhbE9iaikge1xuICAgICAgICAgICAgc25hcHNob3RVdGlscy5qUXVlcnkobW9kYWxPYmopLm1vZGFsKHtcbiAgICAgICAgICAgICAgICBjbG9zYWJsZSAgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBvbkRlbnkgICAgOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAvL3dpbmRvdy5hbGVydCgnV2FpdCBub3QgeWV0IScpO1xuICAgICAgICAgICAgICAgICAgICAvL3JldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9uQXBwcm92ZSA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBzbmFwc2hvdFV0aWxzLmpRdWVyeSgnLmNyZWF0ZUZvcm1TdWJtaXRCdG4nKS5jbGljaygpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIF9zaG93TW9kYWwoKSB7XG4gICAgICAgICAgICBzbmFwc2hvdFV0aWxzLmpRdWVyeSgnLmNyZWF0ZVNuYXBzaG90TW9kYWwnKS5tb2RhbCgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgX29wZW5GaWxlU2VsZWN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHNuYXBzaG90VXRpbHMualF1ZXJ5KCcjc25hcHNob3RGaWxlJykuY2xpY2soKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9jcmVhdGVGaWxlQ2hhbmdlZChlKXtcbiAgICAgICAgICAgIHZhciBmdWxsUGF0aEZpbGVOYW1lID0gc25hcHNob3RVdGlscy5qUXVlcnkoZS5jdXJyZW50VGFyZ2V0KS52YWwoKTtcbiAgICAgICAgICAgIHZhciBmaWxlbmFtZSA9IGZ1bGxQYXRoRmlsZU5hbWUuc3BsaXQoJ1xcXFwnKS5wb3AoKTtcblxuICAgICAgICAgICAgc25hcHNob3RVdGlscy5qUXVlcnkoJ2lucHV0LmNyZWF0ZVNuYXBzaG90RmlsZScpLnZhbChmaWxlbmFtZSkuYXR0cigndGl0bGUnLGZ1bGxQYXRoRmlsZU5hbWUpO1xuXG4gICAgICAgIH1cblxuICAgICAgICBfc3VibWl0Q3JlYXRlKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgdmFyIHRoaSQgPSB0aGlzO1xuXG4gICAgICAgICAgICB2YXIgZm9ybU9iaiA9IHNuYXBzaG90VXRpbHMualF1ZXJ5KGUuY3VycmVudFRhcmdldCk7XG5cbiAgICAgICAgICAgIC8vIENsZWFyIGVycm9yc1xuICAgICAgICAgICAgZm9ybU9iai5maW5kKCcuZXJyb3I6bm90KC5tZXNzYWdlKScpLnJlbW92ZUNsYXNzKCdlcnJvcicpO1xuICAgICAgICAgICAgZm9ybU9iai5maW5kKCcudWkuZXJyb3IubWVzc2FnZScpLmhpZGUoKTtcblxuICAgICAgICAgICAgLy8gR2V0IHRoZSBkYXRhXG4gICAgICAgICAgICB2YXIgc25hcHNob3RJZCA9IGZvcm1PYmouZmluZChcImlucHV0W25hbWU9J3NuYXBzaG90SWQnXVwiKS52YWwoKTtcblxuICAgICAgICAgICAgLy8gRGlzYWxiZSB0aGUgZm9ybVxuICAgICAgICAgICAgZm9ybU9iai5wYXJlbnRzKCcubW9kYWwnKS5maW5kKCcuYWN0aW9ucyAuYnV0dG9uJykuYXR0cignZGlzYWJsZWQnLCdkaXNhYmxlZCcpLmFkZENsYXNzKCdkaXNhYmxlZCBsb2FkaW5nJyk7XG4gICAgICAgICAgICBmb3JtT2JqLmFkZENsYXNzKCdsb2FkaW5nJyk7XG5cbiAgICAgICAgICAgIC8vIENhbGwgY3JlYXRlIG1ldGhvZFxuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiB0aGkkLnByb3BzLmNvbnRleHQuZ2V0TWFuYWdlclVybCgpICsgJy9hcGkvdjIuMS9zbmFwc2hvdHMvJytzbmFwc2hvdElkLFxuICAgICAgICAgICAgLy9kYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgXCJoZWFkZXJzXCI6IHtcImNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIn0sXG4gICAgICAgICAgICBtZXRob2Q6ICdwdXQnLFxuICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICdzbmFwc2hvdF9pZCc6IHNuYXBzaG90SWRcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICAgICAgICAuZG9uZSgoc25hcHNob3QpPT4ge1xuICAgICAgICAgICAgICAgIHRoaSQucHJvcHMuY29udGV4dC5zZXRWYWx1ZSh0aGlzLnByb3BzLndpZGdldC5pZCArICdjcmVhdGVTbmFwc2hvdCcsbnVsbCk7XG5cbiAgICAgICAgICAgICAgICB0aGkkLnByb3BzLmNvbnRleHQuZ2V0RXZlbnRCdXMoKS50cmlnZ2VyKCdzbmFwc2hvdHM6cmVmcmVzaCcpO1xuXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bik9PntcbiAgICAgICAgICAgICAgICB0aGkkLnNldFN0YXRlKHtlcnJvcjogKGpxWEhSLnJlc3BvbnNlSlNPTiAmJiBqcVhIUi5yZXNwb25zZUpTT04ubWVzc2FnZSA/IGpxWEhSLnJlc3BvbnNlSlNPTi5tZXNzYWdlIDogZXJyb3JUaHJvd24pfSlcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBmb3JtT2JqLnBhcmVudHMoJy5tb2RhbCcpLmZpbmQoJy5hY3Rpb25zIC5idXR0b24nKS5yZW1vdmVBdHRyKCdkaXNhYmxlZCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCBsb2FkaW5nJyk7XG4gICAgICAgICAgICBmb3JtT2JqLnJlbW92ZUNsYXNzKCdsb2FkaW5nJyk7XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9wcm9jZXNzQ3JlYXRlRXJySWZOZWVkZWQoeGhyKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLm1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7Y3JlYXRlRXJyOiByZXNwb25zZS5tZXNzYWdlfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyKCdDYW5ub3QgcGFyc2UgY3JlYXRlIHJlc3BvbnNlJyxlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZW5kZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwidWkgbGFiZWxlZCBpY29uIGJ1dHRvbiBjcmVhdGVTbmFwc2hvdFwiIG9uQ2xpY2s9e3RoaXMuX3Nob3dNb2RhbH0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJhZGQgaWNvblwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgIENyZWF0ZVxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cblxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIG1vZGFsIGNyZWF0ZVNuYXBzaG90TW9kYWxcIiByZWY9J21vZGFsT2JqJz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiYWRkIGljb25cIj48L2k+IENyZWF0ZSBzbmFwc2hvdFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybSBjbGFzc05hbWU9XCJ1aSBmb3JtIGNyZWF0ZUZvcm1cIiBvblN1Ym1pdD17dGhpcy5fc3VibWl0Q3JlYXRlLmJpbmQodGhpcyl9IGFjdGlvbj1cIlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiByZXF1aXJlZCBuYW1lPSdzbmFwc2hvdElkJyBpZD0nc25hcHNob3RJZCcgcGxhY2Vob2xkZXI9XCJTbmFwc2hvdCBJRFwiIHJlcXVpcmVkLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuY3JlYXRlRXJyID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIGVycm9yIG1lc3NhZ2UgY3JlYXRlRmFpbGVkXCIgc3R5bGU9e3tcImRpc3BsYXlcIjpcImJsb2NrXCJ9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoZWFkZXJcIj5FcnJvciBjcmVhdGVpbmcgZmlsZTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD57dGhpcy5zdGF0ZS5jcmVhdGVFcnJ9PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9J3N1Ym1pdCcgc3R5bGU9e3tcImRpc3BsYXlcIjogXCJub25lXCJ9fSBjbGFzc05hbWU9J2NyZWF0ZUZvcm1TdWJtaXRCdG4nLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhY3Rpb25zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBjYW5jZWwgYmFzaWMgYnV0dG9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cInJlbW92ZSBpY29uXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDYW5jZWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIG9rIGdyZWVuICBidXR0b25cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiYWRkIGljb25cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENyZWF0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfTtcbn07XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkga2lubmVyZXR6aW4gb24gMDIvMTAvMjAxNi5cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcyxjb250ZXh0KSB7XG4gICAgICAgIHN1cGVyKHByb3BzLGNvbnRleHQpO1xuXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBjb25maXJtRGVsZXRlOmZhbHNlXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfc2VsZWN0U25hcHNob3QgKGl0ZW0pe1xuICAgICAgICB2YXIgb2xkU2VsZWN0ZWRTbmFwc2hvdElkID0gdGhpcy5wcm9wcy5jb250ZXh0LmdldFZhbHVlKCdzbmFwc2hvdElkJyk7XG4gICAgICAgIHRoaXMucHJvcHMuY29udGV4dC5zZXRWYWx1ZSgnc25hcHNob3RJZCcsaXRlbS5pZCA9PT0gb2xkU2VsZWN0ZWRTbmFwc2hvdElkID8gbnVsbCA6IGl0ZW0uaWQpO1xuICAgIH1cblxuICAgIF9kZWxldGVTbmFwc2hvdENvbmZpcm0oaXRlbSxldmVudCl7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgY29uZmlybURlbGV0ZSA6IHRydWUsXG4gICAgICAgICAgICBpdGVtOiBpdGVtXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9yZXN0b3JlU25hcHNob3QoaXRlbSxldmVudCkge1xuICAgICAgICB2YXIgdGhpJCA9IHRoaXM7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IHRoaSQucHJvcHMuY29udGV4dC5nZXRNYW5hZ2VyVXJsKCkgKyAnL2FwaS92Mi4xL3NuYXBzaG90cy8nK2l0ZW0uaWQrJy9hcmNoaXZlJyxcbiAgICAgICAgICAgIG1ldGhvZDogJ2dldCdcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5kb25lKCgpPT4ge1xuICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gdGhpJC5wcm9wcy5jb250ZXh0LmdldE1hbmFnZXJVcmwoKSArICcvYXBpL3YyLjEvc25hcHNob3RzLycraXRlbS5pZCsnL2FyY2hpdmUnO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bik9PntcbiAgICAgICAgICAgICAgICB0aGkkLnNldFN0YXRlKHtlcnJvcjogKGpxWEhSLnJlc3BvbnNlSlNPTiAmJiBqcVhIUi5yZXNwb25zZUpTT04ubWVzc2FnZSA/IGpxWEhSLnJlc3BvbnNlSlNPTi5tZXNzYWdlIDogZXJyb3JUaHJvd24pfSlcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9kb3dubG9hZFNuYXBzaG90KGl0ZW0sZXZlbnQpIHtcbiAgICAgICAgdmFyIHRoaSQgPSB0aGlzO1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiB0aGkkLnByb3BzLmNvbnRleHQuZ2V0TWFuYWdlclVybCgpICsgJy9hcGkvdjIuMS9zbmFwc2hvdHMvJytpdGVtLmlkKycvYXJjaGl2ZScsXG4gICAgICAgICAgICBtZXRob2Q6ICdnZXQnXG4gICAgICAgIH0pXG4gICAgICAgICAgICAuZG9uZSgoKT0+IHtcbiAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IHRoaSQucHJvcHMuY29udGV4dC5nZXRNYW5hZ2VyVXJsKCkgKyAnL2FwaS92Mi4xL3NuYXBzaG90cy8nK2l0ZW0uaWQrJy9hcmNoaXZlJztcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pPT57XG4gICAgICAgICAgICAgICAgdGhpJC5zZXRTdGF0ZSh7ZXJyb3I6IChqcVhIUi5yZXNwb25zZUpTT04gJiYganFYSFIucmVzcG9uc2VKU09OLm1lc3NhZ2UgPyBqcVhIUi5yZXNwb25zZUpTT04ubWVzc2FnZSA6IGVycm9yVGhyb3duKX0pXG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBfZGVsZXRlU25hcHNob3QoKSB7XG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5pdGVtKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtlcnJvcjogJ1NvbWV0aGluZyB3ZW50IHdyb25nLCBubyBzbmFwc2hvdCB3YXMgc2VsZWN0ZWQgZm9yIGRlbGV0ZSd9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0aGkkID0gdGhpcztcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogdGhpJC5wcm9wcy5jb250ZXh0LmdldE1hbmFnZXJVcmwoKSArICcvYXBpL3YyLjEvc25hcHNob3RzLycrdGhpcy5zdGF0ZS5pdGVtLmlkLFxuICAgICAgICAgICAgXCJoZWFkZXJzXCI6IHtcImNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIn0sXG4gICAgICAgICAgICBtZXRob2Q6ICdkZWxldGUnXG4gICAgICAgIH0pXG4gICAgICAgICAgICAuZG9uZSgoKT0+IHtcbiAgICAgICAgICAgICAgICB0aGkkLnNldFN0YXRlKHtjb25maXJtRGVsZXRlOiBmYWxzZX0pO1xuICAgICAgICAgICAgICAgIHRoaSQucHJvcHMuY29udGV4dC5nZXRFdmVudEJ1cygpLnRyaWdnZXIoJ3NuYXBzaG90czpyZWZyZXNoJyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bik9PntcbiAgICAgICAgICAgICAgICB0aGkkLnNldFN0YXRlKHtjb25maXJtRGVsZXRlOiBmYWxzZX0pO1xuICAgICAgICAgICAgICAgIHRoaSQuc2V0U3RhdGUoe2Vycm9yOiAoanFYSFIucmVzcG9uc2VKU09OICYmIGpxWEhSLnJlc3BvbnNlSlNPTi5tZXNzYWdlID8ganFYSFIucmVzcG9uc2VKU09OLm1lc3NhZ2UgOiBlcnJvclRocm93bil9KVxuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgX3JlZnJlc2hEYXRhKCkge1xuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQucmVmcmVzaCgpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQuZ2V0RXZlbnRCdXMoKS5vbignc25hcHNob3RzOnJlZnJlc2gnLHRoaXMuX3JlZnJlc2hEYXRhLHRoaXMpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgICB0aGlzLnByb3BzLmNvbnRleHQuZ2V0RXZlbnRCdXMoKS5vZmYoJ3NuYXBzaG90czpyZWZyZXNoJyx0aGlzLl9yZWZyZXNoRGF0YSk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICB2YXIgQ29uZmlybSA9IFN0YWdlLkJhc2ljLkNvbmZpcm07XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmVycm9yID9cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgZXJyb3IgbWVzc2FnZVwiIHN0eWxlPXt7XCJkaXNwbGF5XCI6XCJibG9ja1wifX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoZWFkZXJcIj5FcnJvciBPY2N1cmVkPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+e3RoaXMuc3RhdGUuZXJyb3J9PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgICAgICAnJ1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJ1aSB2ZXJ5IGNvbXBhY3QgdGFibGUgc25hcHNob3RzVGFibGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+SUQ8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkNyZWF0ZWQgYXQ8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlN0YXR1czwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGg+PC90aD5cbiAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmRhdGEuaXRlbXMubWFwKChpdGVtKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ciBrZXk9e2l0ZW0uaWR9IGNsYXNzTmFtZT17XCJyb3cgXCIrIChpdGVtLmlzU2VsZWN0ZWQgPyAnYWN0aXZlJyA6ICcnKX0gb25DbGljaz17dGhpcy5fc2VsZWN0U25hcHNob3QuYmluZCh0aGlzLGl0ZW0pfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9J3NuYXBzaG90TmFtZScgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPntpdGVtLmlkfTwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e2l0ZW0uY3JlYXRlZF9hdH08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPntpdGVtLnN0YXR1c308L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93QWN0aW9uc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJyZXN0b3JlIGljb24gbGluayBib3JkZXJlZFwiIHRpdGxlPVwiUmVzdG9yZVwiIG9uQ2xpY2s9e3RoaXMuX3Jlc3RvcmVTbmFwc2hvdC5iaW5kKHRoaXMsaXRlbSl9PjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZG93bmxvYWQgaWNvbiBsaW5rIGJvcmRlcmVkXCIgdGl0bGU9XCJEb3dubG9hZFwiIG9uQ2xpY2s9e3RoaXMuX2Rvd25sb2FkU25hcHNob3QuYmluZCh0aGlzLGl0ZW0pfT48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cInRyYXNoIGljb24gbGluayBib3JkZXJlZFwiIHRpdGxlPVwiRGVsZXRlXCIgb25DbGljaz17dGhpcy5fZGVsZXRlU25hcHNob3RDb25maXJtLmJpbmQodGhpcyxpdGVtKX0+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgICAgICA8Q29uZmlybSB0aXRsZT0nQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHJlbW92ZSB0aGlzIHNuYXBzaG90PydcbiAgICAgICAgICAgICAgICAgICAgICAgICBzaG93PXt0aGlzLnN0YXRlLmNvbmZpcm1EZWxldGV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgb25Db25maXJtPXt0aGlzLl9kZWxldGVTbmFwc2hvdC5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2FuY2VsPXsoKT0+dGhpcy5zZXRTdGF0ZSh7Y29uZmlybURlbGV0ZSA6IGZhbHNlfSl9IC8+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICApO1xuICAgIH1cbn07XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkga2lubmVyZXR6aW4gb24gMDUvMTAvMjAxNi5cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCAoc25hcHNob3RVdGlscyk9PiB7XG5cbiAgICByZXR1cm4gY2xhc3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByb3BzLGNvbnRleHQpIHtcbiAgICAgICAgICAgIHN1cGVyKHByb3BzLGNvbnRleHQpO1xuXG4gICAgICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgICAgIHVwbG9hZEVycjogbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgICAgICB0aGlzLl9pbml0TW9kYWwodGhpcy5yZWZzLm1vZGFsT2JqKTtcbiAgICAgICAgfVxuICAgICAgICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgICAgICAgICBzbmFwc2hvdFV0aWxzLmpRdWVyeSh0aGlzLnJlZnMubW9kYWxPYmopLm1vZGFsKCdyZWZyZXNoJyk7XG4gICAgICAgIH1cbiAgICAgICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgICAgICAgICBzbmFwc2hvdFV0aWxzLmpRdWVyeSh0aGlzLnJlZnMubW9kYWxPYmopLm1vZGFsKCdkZXN0cm95Jyk7XG4gICAgICAgICAgICBzbmFwc2hvdFV0aWxzLmpRdWVyeSh0aGlzLnJlZnMubW9kYWxPYmopLnJlbW92ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgX2luaXRNb2RhbChtb2RhbE9iaikge1xuICAgICAgICAgICAgc25hcHNob3RVdGlscy5qUXVlcnkobW9kYWxPYmopLm1vZGFsKHtcbiAgICAgICAgICAgICAgICBjbG9zYWJsZSAgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBvbkRlbnkgICAgOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAvL3dpbmRvdy5hbGVydCgnV2FpdCBub3QgeWV0IScpO1xuICAgICAgICAgICAgICAgICAgICAvL3JldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9uQXBwcm92ZSA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBzbmFwc2hvdFV0aWxzLmpRdWVyeSgnLnVwbG9hZEZvcm1TdWJtaXRCdG4nKS5jbGljaygpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIF9zaG93TW9kYWwoKSB7XG4gICAgICAgICAgICBzbmFwc2hvdFV0aWxzLmpRdWVyeSgnLnVwbG9hZFNuYXBzaG90TW9kYWwnKS5tb2RhbCgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgX29wZW5GaWxlU2VsZWN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHNuYXBzaG90VXRpbHMualF1ZXJ5KCcjc25hcHNob3RGaWxlJykuY2xpY2soKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIF91cGxvYWRGaWxlQ2hhbmdlZChlKXtcbiAgICAgICAgICAgIHZhciBmdWxsUGF0aEZpbGVOYW1lID0gc25hcHNob3RVdGlscy5qUXVlcnkoZS5jdXJyZW50VGFyZ2V0KS52YWwoKTtcbiAgICAgICAgICAgIHZhciBmaWxlbmFtZSA9IGZ1bGxQYXRoRmlsZU5hbWUuc3BsaXQoJ1xcXFwnKS5wb3AoKTtcblxuICAgICAgICAgICAgc25hcHNob3RVdGlscy5qUXVlcnkoJ2lucHV0LnVwbG9hZFNuYXBzaG90RmlsZScpLnZhbChmaWxlbmFtZSkuYXR0cigndGl0bGUnLGZ1bGxQYXRoRmlsZU5hbWUpO1xuXG4gICAgICAgIH1cblxuICAgICAgICBfc3VibWl0VXBsb2FkKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgdmFyIHRoaSQgPSB0aGlzO1xuXG4gICAgICAgICAgICB2YXIgZm9ybU9iaiA9IHNuYXBzaG90VXRpbHMualF1ZXJ5KGUuY3VycmVudFRhcmdldCk7XG5cbiAgICAgICAgICAgIC8vIENsZWFyIGVycm9yc1xuICAgICAgICAgICAgZm9ybU9iai5maW5kKCcuZXJyb3I6bm90KC5tZXNzYWdlKScpLnJlbW92ZUNsYXNzKCdlcnJvcicpO1xuICAgICAgICAgICAgZm9ybU9iai5maW5kKCcudWkuZXJyb3IubWVzc2FnZScpLmhpZGUoKTtcblxuICAgICAgICAgICAgLy8gR2V0IHRoZSBkYXRhXG4gICAgICAgICAgICB2YXIgc25hcHNob3RJZCA9IGZvcm1PYmouZmluZChcImlucHV0W25hbWU9J3NuYXBzaG90SWQnXVwiKS52YWwoKTtcbiAgICAgICAgICAgIHZhciBzbmFwc2hvdEZpbGVVcmwgPSBmb3JtT2JqLmZpbmQoXCJpbnB1dFtuYW1lPSdzbmFwc2hvdEZpbGVVcmwnXVwiKS52YWwoKTtcbiAgICAgICAgICAgIHZhciBmaWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NuYXBzaG90RmlsZScpLmZpbGVzWzBdO1xuXG4gICAgICAgICAgICAvLyBDaGVjayB0aGF0IHdlIGhhdmUgYWxsIHdlIG5lZWRcbiAgICAgICAgICAgIGlmIChfLmlzRW1wdHkoc25hcHNob3RGaWxlVXJsKSAmJiAhZmlsZSkge1xuICAgICAgICAgICAgICAgIGZvcm1PYmouYWRkQ2xhc3MoJ2Vycm9yJyk7XG4gICAgICAgICAgICAgICAgZm9ybU9iai5maW5kKFwiaW5wdXQudXBsb2FkU25hcHNob3RGaWxlXCIpLnBhcmVudHMoJy5maWVsZCcpLmFkZENsYXNzKCdlcnJvcicpO1xuICAgICAgICAgICAgICAgIGZvcm1PYmouZmluZChcImlucHV0W25hbWU9J3NuYXBzaG90RmlsZVVybCddXCIpLnBhcmVudHMoJy5maWVsZCcpLmFkZENsYXNzKCdlcnJvcicpO1xuICAgICAgICAgICAgICAgIGZvcm1PYmouZmluZCgnLnVpLmVycm9yLm1lc3NhZ2UnKS5zaG93KCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIERpc2FsYmUgdGhlIGZvcm1cbiAgICAgICAgICAgIGZvcm1PYmoucGFyZW50cygnLm1vZGFsJykuZmluZCgnLmFjdGlvbnMgLmJ1dHRvbicpLmF0dHIoJ2Rpc2FibGVkJywnZGlzYWJsZWQnKS5hZGRDbGFzcygnZGlzYWJsZWQgbG9hZGluZycpO1xuICAgICAgICAgICAgZm9ybU9iai5hZGRDbGFzcygnbG9hZGluZycpO1xuXG4gICAgICAgICAgICAvLyBDYWxsIHVwbG9hZCBtZXRob2RcbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgICh4aHIudXBsb2FkIHx8IHhocikuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRvbmUgPSBlLnBvc2l0aW9uIHx8IGUubG9hZGVkXG4gICAgICAgICAgICAgICAgdmFyIHRvdGFsID0gZS50b3RhbFNpemUgfHwgZS50b3RhbDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygneGhyIHByb2dyZXNzOiAnICsgTWF0aC5yb3VuZChkb25lL3RvdGFsKjEwMCkgKyAnJScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd4aHIgdXBsb2FkIGVycm9yJywgZSwgdGhpcy5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgIHRoaSQuX3Byb2Nlc3NVcGxvYWRFcnJJZk5lZWRlZCh0aGlzKTtcbiAgICAgICAgICAgICAgICBmb3JtT2JqLnBhcmVudHMoJy5tb2RhbCcpLmZpbmQoJy5hY3Rpb25zIC5idXR0b24nKS5yZW1vdmVBdHRyKCdkaXNhYmxlZCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCBsb2FkaW5nJyk7XG4gICAgICAgICAgICAgICAgZm9ybU9iai5yZW1vdmVDbGFzcygnbG9hZGluZycpO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd4aHIgdXBsb2FkIGNvbXBsZXRlJywgZSwgdGhpcy5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgIGZvcm1PYmoucGFyZW50cygnLm1vZGFsJykuZmluZCgnLmFjdGlvbnMgLmJ1dHRvbicpLnJlbW92ZUF0dHIoJ2Rpc2FibGVkJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkIGxvYWRpbmcnKTtcbiAgICAgICAgICAgICAgICBmb3JtT2JqLnJlbW92ZUNsYXNzKCdsb2FkaW5nJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXRoaSQuX3Byb2Nlc3NVcGxvYWRFcnJJZk5lZWRlZCh0aGlzKSkge1xuICAgICAgICAgICAgICAgICAgICBmb3JtT2JqLnBhcmVudHMoJy5tb2RhbCcpLm1vZGFsKCdoaWRlJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaSQucHJvcHMuY29udGV4dC5yZWZyZXNoKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZm9ybU9iai5maW5kKCcudWkuZXJyb3IubWVzc2FnZS51cGxvYWRGYWlsZWQnKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB4aHIub3BlbigncHV0Jyx0aGlzLnByb3BzLmNvbnRleHQuZ2V0TWFuYWdlclVybCgpICtcbiAgICAgICAgICAgICAgICAnL2FwaS92Mi4xL3NuYXBzaG90cy8nICsgc25hcHNob3RJZCArIFwiL2FyY2hpdmVcIik7XG4gICAgICAgICAgICB4aHIuc2VuZChmaWxlKTtcblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgX3Byb2Nlc3NVcGxvYWRFcnJJZk5lZWRlZCh4aHIpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UubWVzc2FnZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHt1cGxvYWRFcnI6IHJlc3BvbnNlLm1lc3NhZ2V9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnIoJ0Nhbm5vdCBwYXJzZSB1cGxvYWQgcmVzcG9uc2UnLGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJ1aSBsYWJlbGVkIGljb24gYnV0dG9uIHVwbG9hZFNuYXBzaG90XCIgb25DbGljaz17dGhpcy5fc2hvd01vZGFsfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cInVwbG9hZCBpY29uXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgVXBsb2FkXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgbW9kYWwgdXBsb2FkU25hcHNob3RNb2RhbFwiIHJlZj0nbW9kYWxPYmonPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoZWFkZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJ1cGxvYWQgaWNvblwiPjwvaT4gVXBsb2FkIHNuYXBzaG90XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtIGNsYXNzTmFtZT1cInVpIGZvcm0gdXBsb2FkRm9ybVwiIG9uU3VibWl0PXt0aGlzLl9zdWJtaXRVcGxvYWQuYmluZCh0aGlzKX0gYWN0aW9uPVwiXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGRzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkIG5pbmUgd2lkZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgbGFiZWxlZCBpbnB1dFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVpIGxhYmVsXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBodHRwOi8vXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPSdzbmFwc2hvdEZpbGVVcmwnIHBsYWNlaG9sZGVyPVwiRW50ZXIgc25hcHNob3QgdXJsXCI+PC9pbnB1dD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkIG9uZSB3aWRlXCIgc3R5bGU9e3tcInBvc2l0aW9uXCI6XCJyZWxhdGl2ZVwifX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSB2ZXJ0aWNhbCBkaXZpZGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQgZWlnaHQgd2lkZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgYWN0aW9uIGlucHV0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHJlYWRPbmx5PSd0cnVlJyB2YWx1ZT1cIlwiIGNsYXNzTmFtZT1cInVwbG9hZFNuYXBzaG90RmlsZVwiIG9uQ2xpY2s9e3RoaXMuX29wZW5GaWxlU2VsZWN0aW9ufT48L2lucHV0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cInVpIGljb24gYnV0dG9uIHVwbG9hZFNuYXBzaG90RmlsZVwiIG9uQ2xpY2s9e3RoaXMuX29wZW5GaWxlU2VsZWN0aW9ufT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImF0dGFjaCBpY29uXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBuYW1lPSdzbmFwc2hvdEZpbGUnIGlkPVwic25hcHNob3RGaWxlXCIgc3R5bGU9e3tcImRpc3BsYXlcIjogXCJub25lXCJ9fSBvbkNoYW5nZT17dGhpcy5fdXBsb2FkRmlsZUNoYW5nZWR9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgcmVxdWlyZWQgbmFtZT0nc25hcHNob3RJZCcgaWQ9J3NuYXBzaG90SWQnIHBsYWNlaG9sZGVyPVwiU25hcHNob3QgSURcIiByZXF1aXJlZC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnVwbG9hZEVyciA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBlcnJvciBtZXNzYWdlIHVwbG9hZEZhaWxlZFwiIHN0eWxlPXt7XCJkaXNwbGF5XCI6XCJibG9ja1wifX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVhZGVyXCI+RXJyb3IgdXBsb2FkaW5nIGZpbGU8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+e3RoaXMuc3RhdGUudXBsb2FkRXJyfTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPSdzdWJtaXQnIHN0eWxlPXt7XCJkaXNwbGF5XCI6IFwibm9uZVwifX0gY2xhc3NOYW1lPSd1cGxvYWRGb3JtU3VibWl0QnRuJy8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWN0aW9uc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidWkgY2FuY2VsIGJhc2ljIGJ1dHRvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJyZW1vdmUgaWNvblwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2FuY2VsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1aSBvayBncmVlbiAgYnV0dG9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cInVwbG9hZCBpY29uXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBVcGxvYWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH07XG59O1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGtpbm5lcmV0emluIG9uIDA3LzA5LzIwMTYuXG4gKi9cblxuaW1wb3J0IFNuYXBzaG90c1RhYmxlIGZyb20gJy4vU25hcHNob3RzVGFibGUnO1xuaW1wb3J0IHJlbmRlclVwbG9hZFNuYXBzaG90TW9kYWwgZnJvbSAnLi9VcGxvYWRTbmFwc2hvdE1vZGFsJztcbmltcG9ydCByZW5kZXJDcmVhdGVTbmFwc2hvdE1vZGFsIGZyb20gJy4vQ3JlYXRlU25hcHNob3RNb2RhbCc7XG5cbnZhciBVcGxvYWRNb2RhbCA9IG51bGw7XG52YXIgQ3JlYXRlTW9kYWwgPSBudWxsO1xuXG5TdGFnZS5hZGRQbHVnaW4oe1xuICAgIGlkOiBcInNuYXBzaG90c1wiLFxuICAgIG5hbWU6IFwiU25hcHNob3RzIGxpc3RcIixcbiAgICBkZXNjcmlwdGlvbjogJ2JsYWggYmxhaCBibGFoJyxcbiAgICBpbml0aWFsV2lkdGg6IDQsXG4gICAgaW5pdGlhbEhlaWdodDogNCxcbiAgICBjb2xvciA6IFwiYmx1ZVwiLFxuICAgIGlzUmVhY3Q6IHRydWUsXG4gICAgaW5pdDogZnVuY3Rpb24oc25hcHNob3RVdGlscykge1xuICAgICAgICBVcGxvYWRNb2RhbCA9IHJlbmRlclVwbG9hZFNuYXBzaG90TW9kYWwoc25hcHNob3RVdGlscyk7XG4gICAgICAgIENyZWF0ZU1vZGFsID0gcmVuZGVyQ3JlYXRlU25hcHNob3RNb2RhbChzbmFwc2hvdFV0aWxzKTtcbiAgICB9LFxuXG4gICAgZmV0Y2hEYXRhOiBmdW5jdGlvbihzbmFwc2hvdCxjb250ZXh0LHNuYXBzaG90VXRpbHMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAocmVzb2x2ZSxyZWplY3QpID0+IHtcbiAgICAgICAgICAgIHNuYXBzaG90VXRpbHMualF1ZXJ5LmdldCh7XG4gICAgICAgICAgICAgICAgdXJsOiBjb250ZXh0LmdldE1hbmFnZXJVcmwoKSArICcvYXBpL3YyLjEvc25hcHNob3RzP19pbmNsdWRlPWlkLGNyZWF0ZWRfYXQsc3RhdHVzJyxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZG9uZSgoc25hcHNob3RzKT0+IHtyZXNvbHZlKHNuYXBzaG90cyk7fSlcbiAgICAgICAgICAgICAgICAuZmFpbChyZWplY3QpXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKHdpZGdldCxkYXRhLGVycm9yLGNvbnRleHQsc25hcHNob3RVdGlscykge1xuXG4gICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIHNuYXBzaG90VXRpbHMucmVuZGVyUmVhY3RMb2FkaW5nKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBzbmFwc2hvdFV0aWxzLnJlbmRlclJlYWN0RXJyb3IoZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNlbGVjdGVkU25hcHNob3QgPSBjb250ZXh0LmdldFZhbHVlKCdzbmFwc2hvdElkJyk7XG4gICAgICAgIHZhciBmb3JtYXR0ZWREYXRhID0gT2JqZWN0LmFzc2lnbih7fSxkYXRhLHtcbiAgICAgICAgICAgIGl0ZW1zOiBfLm1hcCAoZGF0YS5pdGVtcywoaXRlbSk9PntcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSxpdGVtLHtcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlZF9hdDogc25hcHNob3RVdGlscy5tb21lbnQoaXRlbS5jcmVhdGVkX2F0LCdZWVlZLU1NLUREIEhIOm1tOnNzLlNTU1NTJykuZm9ybWF0KCdERC1NTS1ZWVlZIEhIOm1tJyksIC8vMjAxNi0wNy0yMCAwOToxMDo1My4xMDM1NzlcbiAgICAgICAgICAgICAgICAgICAgaXNTZWxlY3RlZDogc2VsZWN0ZWRTbmFwc2hvdCA9PT0gaXRlbS5pZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8U25hcHNob3RzVGFibGUgd2lkZ2V0PXt3aWRnZXR9IGRhdGE9e2Zvcm1hdHRlZERhdGF9IGNvbnRleHQ9e2NvbnRleHR9IHV0aWxzPXtzbmFwc2hvdFV0aWxzfS8+XG4gICAgICAgICAgICAgICAgPENyZWF0ZU1vZGFsIHdpZGdldD17d2lkZ2V0fSBkYXRhPXtmb3JtYXR0ZWREYXRhfSBjb250ZXh0PXtjb250ZXh0fSB1dGlscz17c25hcHNob3RVdGlsc30vPlxuICAgICAgICAgICAgICAgIDxVcGxvYWRNb2RhbCB3aWRnZXQ9e3dpZGdldH0gZGF0YT17Zm9ybWF0dGVkRGF0YX0gY29udGV4dD17Y29udGV4dH0gdXRpbHM9e3NuYXBzaG90VXRpbHN9Lz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn0pOyJdfQ==
