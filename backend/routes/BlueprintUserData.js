const yaml = require('js-yaml');
const router = require('express').Router();
const passport = require('passport');
const bodyParser = require('body-parser');
const _ = require('lodash');

const SourceHandler = require('../handler/SourceHandler');
const { db } = require('../db/Connection');

router.use(passport.authenticate('token', { session: false }));
router.use(bodyParser.json());

router.get('/layout/:blueprintId', (req, res) => {
    db.BlueprintUserData.findOne({ where: { ...req.params, ..._.pick(req.user, 'username') } }).then(blueprintData => {
        if (blueprintData) {
            res.send(blueprintData.layout);
        } else {
            SourceHandler.browseArchiveTree(req)
                .then(data => _.chain(data).get('children[0].children').find({ title: 'info.yaml' }).get('key').value())
                .then(path => {
                    if (path) {
                        SourceHandler.browseArchiveFile(path)
                            .then(yaml.safeLoad)
                            .then(layout => res.send(layout));
                    } else {
                        res.status(404).send({});
                    }
                });
        }
    });
});

router.put('/layout/:blueprint', (req, res) => {
    db.BlueprintUserData.findOrCreate({
        where: { blueprintId: req.params.blueprint, username: req.user.username },
        defaults: { layout: {} }
    }).spread(blueprintData => blueprintData.update({ layout: req.body }).then(() => res.sendStatus(200)));
});

module.exports = router;
