const express = require('express');
const passport = require('passport');
const FilterHandler = require('../handler/FilterHandler');

const router = express.Router();

router.use(passport.authenticate('token', { session: false }));

router.get('/usage/:filterId', (req, res, next) => {
    FilterHandler.getFilterUsage(req.params.filterId)
        .then(result => res.send(result))
        .catch(next);
});

module.exports = router;
