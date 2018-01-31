const deploy = require('s3-website').deploy
    , config = require('./s3config.json')
    , AWS = require('aws-sdk')
    , s3 = new AWS.S3({ region: config.region })
    , _ = require('lodash');


function createIndexHtmlFiles() {
    console.log('Creating index.html in all directories...');
    const { closeSync, openSync, statSync, readdirSync, existsSync } = require('fs');
    const { join } = require('path');

    // recursive synchronous "walk" through a folder structure, with the given base path
    const getAllSubFolders = (baseFolder, folderList = []) => {
        let folders = readdirSync(baseFolder).filter(file => statSync(join(baseFolder, file)).isDirectory());
        folders.forEach(folder => {
            folderList.push(join(baseFolder,folder));
            getAllSubFolders(join(baseFolder,folder), folderList);
        });
    }

    var directories = [];
    getAllSubFolders(config.uploadDir, directories);

    _.forEach(directories, (directory) => {
        var filename = join(directory, 'index.html');

        if (!existsSync(filename)) {
            console.log(`Creating index.html in '${directory}'.`);
            closeSync(openSync(filename, 'a'));
        }
    });
}

function getWebsiteFiles(callback) {
    var readParams = {
        Bucket: config.domain,
        Prefix: config.prefix
    };
    s3.listObjects(readParams, function(err, data) {
        if (err) {
            console.error('Error listing object.', err);
            throw err;
        }
        console.log('Successfully listed objects. Response:');
        console.log(data);
        callback(data);
    });
}

function updateWebsiteAcl() {
    console.log('Updating website ACL...')
    getWebsiteFiles(function(err, data) {
        var websiteFilesKeys = _.map(data.Contents, (value) => value.Key);
        _.forEach(websiteFilesKeys, (key) => {
            var params = {
                Bucket: config.domain,
                Key: key,
                ACL: config.acl
            };
            s3.putObjectAcl(params, function(err, data) {
                if (err) {
                    console.error(`Error setting ACL for object key='${key}'. ${err}`);
                    throw err;
                }
                console.log(`Successfully set ACL for object key='${key}'.`);
            });
        })
    });
}

function deleteWebsite() {
    console.log('Deleting website...')
    getWebsiteFiles(function(data) {
        var websiteFilesKeys = _.map(data.Contents, (value) => value.Key);
        _.forEach(websiteFilesKeys, (key) => {
            var deleteParams = {
                Bucket: config.domain,
                Key: key
            };
            s3.deleteObject(deleteParams, function (err, data) {
                if (err) {
                    console.error(`Error deleting object key=${key}.`, err);
                    throw err;
                }
                console.log(`Successfully deleted object key=${key}. Response:`);
                console.log(data);
            });
        })
    });
}

function deployWebsite() {
    console.log('Deploying website to AWS...');
    deploy(s3, config, (err, website) => {
        if(err) {
            console.error("Error deploying website.", err);
            throw err;
        }
        console.log(website);

        updateWebsiteAcl();
    })

}


createIndexHtmlFiles();

deleteWebsite();

deployWebsite();
