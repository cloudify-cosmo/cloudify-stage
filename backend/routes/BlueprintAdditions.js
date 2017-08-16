/**
 * Created by pposel on 09/03/2017.
 */
var express = require('express');
var request = require('request');
var db = require('../db/Connection');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var _ = require('lodash');
var passport = require('passport');

router.use(bodyParser.raw({
    limit: '1mb',
    type: 'image/*'
}));

//This path returns image resource so there is no point to secure that
// (if yes all credentials should be passed in the query string)
router.get('/image/:blueprint',function (req, res, next) {
    db.BlueprintAdditions
        .findOne({ where: {blueprintId: req.params.blueprint} }).then(function(additions) {
            if (additions) {
                if (additions.image) {
                    res.contentType('image/*').send(additions.image);
                } else if (additions.imageUrl) {
                    res.redirect(additions.imageUrl);
                } else {
                    res.contentType('image/png').sendFile(path.resolve(__dirname, '../images/logo.png'));
                }
            } else {
                res.contentType('image/png').sendFile(path.resolve(__dirname, '../images/logo.png'));
            }
        })
        .catch(next);
});

router.post('/image/:blueprint',passport.authenticate('token', {session: false}),function (req, res, next) {
    db.BlueprintAdditions
        .findOrCreate({ where: {blueprintId: req.params.blueprint}})
        .spread(function(blueprintAdditions, created) {
            blueprintAdditions.update({ image: _.isEmpty(req.body)?null:req.body, imageUrl: req.query.imageUrl},
                {fields: ['image', 'imageUrl']}).then(function() {
                    res.end(JSON.stringify({status:'ok'}));
            })
        })
        .catch(next);
});

router.delete('/image/:blueprint',passport.authenticate('token', {session: false}),function (req, res, next) {
    db.BlueprintAdditions
        .destroy({ where: {blueprintId: req.params.blueprint} }).then(function(deletedRecord) {
            res.end(JSON.stringify({status:'ok'}));
        })
        .catch(next);
});

module.exports = router;
