/**
 * Created by Alex on 21/03/2017.
 */

const bodyParser = require('body-parser');
const express = require('express');
const passport = require('passport');

const router = express.Router();
const logger = require('../handler/LoggerHandler').getLogger('Applications');
const db = require('../db/Connection');

router.use(passport.authenticate('token', { session: false }));
router.use(bodyParser.json());

router.get('/', (req, res, next) => {
    db.Application.findAll()
        .then(applications => {
            res.send(applications);
        })
        .catch(next);
});

router.get('/:id', (req, res, next) => {
    db.Application.findOne({ where: { id: req.params.id } })
        .then(application => {
            res.send(application);
        })
        .catch(next);
});

router.post('/', (req, res, next) => {
    const { name } = req.body;
    const { status } = req.body;
    const { isPrivate } = req.body;
    const { extras } = req.body;

    db.Application.findOrCreate({ where: { name } })
        .spread(application => {
            application.update({ name, status, isPrivate, extras }).then(response => {
                res.send(response);
            });
        })
        .catch(next);
});

router.post('/:id', (req, res, next) => {
    const { name } = req.body;
    const { status } = req.body;
    const { isPrivate } = req.body;
    const { extras } = req.body;

    db.Application.findOrCreate({ where: { id: req.params.id } })
        .spread(application => {
            application.update({ name, status, isPrivate, extras }).then(response => {
                res.send(response);
            });
        })
        .catch(next);
});

router.delete('/:id', (req, res, next) => {
    db.Application.destroy({ where: { id: req.params.id } })
        .then(response => {
            res.send(response);
        })
        .catch(next);
});

module.exports = router;
