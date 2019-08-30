/**
 * Created by edenp on 15/04/2018.
 */

const express = require('express');
const passport = require('passport');
const ToursHandler = require('../handler/ToursHandler');

const router = express.Router();

router.use(passport.authenticate('token', { session: false }));

router.get('/', function(req, res, next) {
    ToursHandler.listTours(
        req.user.role,
        req.user.group_system_roles,
        req.user.tenants,
        req.query.tenant,
        req.headers['authentication-token']
    )
        .then(tours => res.send(tours))
        .catch(next);
});

module.exports = router;
