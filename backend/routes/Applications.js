/**
 * Created by Alex on 21/03/2017.
 */

'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();

const logger = require('log4js').getLogger('Applications');
const db = require('../db/Connection');

router.use(bodyParser.json());

router.get('/', (req, res, next) => {
    db.Application
        .findAll()
        .then(applications => { res.send(applications) })
        .catch(next);
});

router.get('/:id', (req, res, next) => {
    db.Application
        .findOne({ where: { id: req.params.id } })
        .then(application => { res.send(application) })
        .catch(next);
});

router.post('/', (req, res, next) => {
    const { name, status, isPrivate, extras } = req.body;

    db.Application
        .findOrCreate({ where: { name } })
        .spread(application => {
            application
                .update({ name, status, isPrivate, extras })
                .then(response => { res.send(response) })
        })
        .catch(next);
});

router.post('/:id', (req, res, next) => {
    const { name, status, isPrivate, extras } = req.body;

    db.Application
        .findOrCreate({ where: { id: req.params.id } })
        .spread(application => {
            application
                .update({ name, status, isPrivate, extras })
                .then(response => { res.send(response) })
        })
        .catch(next);
});

router.delete('/:id', (req, res, next) => {
    db.Application
        .destroy({ where: { id: req.params.id } })
        .then(response => { res.send(response) })
        .catch(next);
});

module.exports = router;
