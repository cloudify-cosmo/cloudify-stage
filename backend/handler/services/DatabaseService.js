/**
 * Created by jakubniezgoda on 06/11/2017.
 */

var _ = require('lodash');
var db = require('../../db/Connection');
var config = require('../../config').get();

const headerWidgetIdKey = 'widgetId';

module.exports = (function() {
    function create(key, value, req, res, next) {
        if (_.isEmpty(req.user)) {
            res.status(401).send({message: 'User not authenticated'});
        } else {
            return db.WidgetsData
                .create({
                    user: req.user.username,
                    widget: req.header(headerWidgetIdKey),
                    key: key,
                    value: value
                });
        }
    }

    function read(key, req, res, next) {
        if (_.isEmpty(req.user)) {
            res.status(401).send({message: 'User not authenticated'});
        } else {
            return db.WidgetsData
                .findOne({
                    where: {
                        user: req.user.username,
                        widget: req.header(headerWidgetIdKey),
                        key: key,
                    }
                });
        }
    }

    function readAll(req, res, next) {
        if (_.isEmpty(req.user)) {
            res.status(500).send({message: 'User not authenticated'});
        } else {
            return db.WidgetsData
                .findAll({
                    where: {
                        user: req.user.username,
                        widget: req.header(headerWidgetIdKey),
                    }
                });
        }
    }

    function update(key, value, req, res, next) {
        if (_.isEmpty(req.user)) {
            res.status(401).send({message: 'User not authenticated'});
        } else {
            return db.WidgetsData
                .update({
                        value: value
                    },
                    {
                        where: {
                            user: req.user.username,
                            widget: req.header(headerWidgetIdKey),
                            key: key
                        }
                    });
        }
    }

    function remove(id, req, res, next) {
        if (_.isEmpty(req.user)) {
            res.status(401).send({message: 'User not authenticated'});
        } else {
            return db.WidgetsData
                .destroy({
                    where: {
                        user: req.user.username,
                        widget: req.header(headerWidgetIdKey),
                        id: id,
                    }
                });
        }
    }

    return {
        create,
        read,
        readAll,
        update,
        remove
    };
})();