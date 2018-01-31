const s3 = require('s3');
const s3Config = require('./s3-config');
const AWS = require('aws-sdk')

var awsS3Client = new AWS.S3({region: s3Config.region});
var options = { s3Client: awsS3Client };
var client = s3.createClient(options);
var uploader = client.uploadDir(s3Config);

uploader.on('error', function(err) {
    console.error("unable to sync:", err.stack);
});
uploader.on('progress', function() {
    // console.log("progress", uploader.progressAmount, uploader.progressTotal);
    console.log("progress", uploader);
});
uploader.on('end', function() {
    console.log("done uploading");
});