const deploy = require('s3-website').deploy
    , config = require('./s3config.json')
    , AWS = require('aws-sdk')
    , s3 = new AWS.S3();

deploy(s3, config, (err, website) => {
    if(err) {
        throw err;
    }
    console.log(website);
})