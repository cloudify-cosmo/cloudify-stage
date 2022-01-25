// @ts-nocheck File not migrated fully to TS

import bodyParser from 'body-parser';
import express from 'express';
import passport from 'passport';
import { db } from '../db/Connection';

const router = express.Router();

router.use(bodyParser.json());

router.get('/', (req, res, next) => {
    db.Applications.findAll()
        .then(applications => {
            res.send(applications);
        })
        .catch(next);
});

router.get('/:id', (req, res, next) => {
    db.Applications.findOne({ where: { id: req.params.id } })
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

    db.Applications.findOrCreate({ where: { name } })
        .then(([application]) => {
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

    db.Applications.findOrCreate({ where: { id: req.params.id } })
        .then(([application]) => {
            application.update({ name, status, isPrivate, extras }).then(response => {
                res.send(response);
            });
        })
        .catch(next);
});

router.delete('/:id', (req, res, next) => {
    db.Applications.destroy({ where: { id: req.params.id } })
        .then(response => {
            res.send(response);
        })
        .catch(next);
});

export default router;
