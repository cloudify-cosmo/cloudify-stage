const router = require('express').Router();
const passport = require('passport');
const bodyParser = require('body-parser');

const db = require('../db/Connection');

router.use(passport.authenticate('token', { session: false }));
router.use(bodyParser.json());

router.get('/layout/:blueprint', (req, res) => {
    db.BlueprintUserData.findOne({ where: { blueprintId: req.params.blueprint, username: req.user.username } }).then(
        blueprintData => {
            if (blueprintData) {
                res.send(blueprintData.layout);
            } else {
                res.status(404).send({});
            }
        }
    );
});

router.put('/layout/:blueprint', (req, res) => {
    db.BlueprintUserData.findOrCreate({
        where: { blueprintId: req.params.blueprint, username: req.user.username },
        defaults: { layout: {} }
    }).spread(blueprintData => blueprintData.update({ layout: req.body }).then(() => res.sendStatus(200)));
});

module.exports = router;
