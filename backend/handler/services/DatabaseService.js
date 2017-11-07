/**
 * Created by jakubniezgoda on 06/11/2017.
 */

var _ = require('lodash');
var db = require('../../db/Connection');
var consts = require('../../consts');

module.exports = (function() {
    function create(key, value, req, res, next) {
        if (_.isEmpty(req.user)) {
            res.status(401).send({message: 'User not authenticated'});
        } else {
            return db.WidgetsData
                .create({
                    user: req.user.username,
                    widget: req.header(consts.WIDGET_ID_HEADER),
                    key: key,
                    value: value
                })
                .catch(function () {
                    res.status(500).send({message: 'Data write error'});
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
                        widget: req.header(consts.WIDGET_ID_HEADER),
                        key: key,
                    }
                }).catch(function () {
                    res.status(500).send({message: 'Data read error'});
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
                        widget: req.header(consts.WIDGET_ID_HEADER),
                    }
                }).catch(function () {
                    res.status(500).send({message: 'Data read error'});
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
                            widget: req.header(consts.WIDGET_ID_HEADER),
                            key: key
                        }
                    })
                .catch(function () {
                    res.status(500).send({message: 'Data update error'});
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
                        widget: req.header(consts.WIDGET_ID_HEADER),
                        id: id,
                    }
                }).catch(function () {
                    res.status(500).send({message: 'Data delete error'});
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