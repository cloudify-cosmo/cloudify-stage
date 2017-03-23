/**
 * Created by Alex on 21/03/2017.
 */

'use strict';

const express = require('express');
const router = express.Router();

const logger = require('log4js').getLogger('Application');
const db = require('../db/Connection');

router.get('/', (req, res, next) => {
    db.Application
        .findAll()
        .then(applications => { res.send(applications) })
        .catch(next);
});

router.get('/:application', (req, res, next) => {
    db.Application
        .findOne({ where: { id: req.params.id } })
        .then(application => { res.send(application) })
        .catch(next);
});

router.post('/:application', (req, res, next) => {
    db.Application
        .findOrCreate({ where: { id: req.params.id } })
        .spread(application => {
            application
                .update(
                    req.body,
                    {
                        fields: ['appStatus', 'name', 'VMs', 'isPrivate', 'TDMALCode', 'ITNumber', 'costCenter', 'LoB']
                    }
                )
                .then(status => { res.send(status) })
        })
        .catch(next);
});

router.delete('/:application', (req, res, next) => {
    db.Application
        .destroy({ where: { id: req.params.id } })
        .then(status => { res.send(status) })
        .catch(next);
});

module.exports = router;
