/**
 * Created by jakubniezgoda on 24/11/2017.
 */

var express = require('express');
var router = express.Router();
var passport = require('passport');
var multer  = require('multer');
var upload = multer({limits: {fileSize: 50000}});
var logger = require('log4js').getLogger('File');

router.post('/text', passport.authenticate('token', {session: false}), upload.single('file'), function (req, res, next) {
    if (req.file) {
        logger.debug('Text file uploaded, name:',req.file.originalname,', size:',req.file.size);
        var data = req.file.buffer.toString();
        res.contentType('application/text').send(data);
    } else {
        var errorMessage = 'No file uploaded.';
        logger.error(errorMessage);
        res.status(400).send({message: errorMessage})
    }
})

module.exports = router;