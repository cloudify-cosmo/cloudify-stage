/**
 * Created by edenp on 15/04/2018.
 */

var express = require('express');
var ToursHandler = require('../handler/ToursHandler');
var passport = require('passport');

var router = express.Router();

router.use(passport.authenticate('token', {session: false}));

router.get('/', function (req, res, next) {
    ToursHandler.listTours(req.user.role, req.user.group_system_roles, req.user.tenants, req.query.tenant)
        .then(tours => res.send(tours))
        .catch(next);
});

module.exports = router;