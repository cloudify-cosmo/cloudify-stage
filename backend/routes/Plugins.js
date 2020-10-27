const express = require('express');

const router = express.Router();
const passport = require('passport');
const multer = require('multer');
const yaml = require('js-yaml');

const upload = multer();

const _ = require('lodash');

const request = require('request').defaults({ encoding: null });
const archiver = require('archiver');
const ManagerHandler = require('../handler/ManagerHandler');
const RequestHandler = require('../handler/RequestHandler');

const logger = require('../handler/LoggerHandler').getLogger('Plugins');

function checkParams(req, res, next) {
    const noWagon = req.files && _.isEmpty(req.files.wagon_file) && !req.query.wagonUrl;
    const noYaml = req.files && _.isEmpty(req.files.yaml_file) && !req.query.yamlUrl;

    if (noWagon) {
        const errorMessage = 'Must provide a wagon file or url.';
        logger.error(errorMessage);
        res.status(500).send({ message: errorMessage });
    } else if (noYaml) {
        const errorMessage = 'Must provide a yaml file or url.';
        logger.error(errorMessage);
        res.status(500).send({ message: errorMessage });
    } else {
        next();
    }
}

function downloadFile(url) {
    return new Promise((resolve, reject) => {
        request.get(url, (err, res, body) => {
            if (err) {
                logger.error(`Failed downloading ${url}. ${err}`);
                reject(err);
            }
            logger.info(`Finished downloading ${url}`);
            resolve(body);
        });
    });
}

function zipFiles(wagonFile, wagonFilename, yamlFile, iconFile, output) {
    return new Promise((resolve, reject) => {
        const archive = archiver('zip');
        archive.append(wagonFile, { name: wagonFilename });
        archive.append(yamlFile, { name: 'plugin.yaml' });
        if (iconFile) {
            archive.append(iconFile, { name: 'icon.png' });
        }

        archive.on('error', err => {
            logger.error(`Failed archiving plugin. ${err}`);
            reject(err);
        });

        archive.on('end', () => {
            logger.info('Finished archiving plugin');
            resolve();
        });

        archive.pipe(output);
        archive.finalize();
    });
}

router.get('/icons/:pluginId', (req, res) => {
    const options = {};
    ManagerHandler.updateOptions(options, 'get');
    req.pipe(
        request(`${ManagerHandler.getManagerUrl()}/resources/plugins/${req.params.pluginId}/icon.png`, options).on(
            'response',
            // eslint-disable-next-line func-names
            function (response) {
                if (response.statusCode === 404) {
                    res.status(200).end();
                    this.abort();
                }
            }
        )
    ).pipe(res);
});

router.put('/title', upload.fields(_.map(['yaml_file'], name => ({ name, maxCount: 1 }))), (req, res) => {
    let getPluginYaml;
    if (req.query.yamlUrl) {
        getPluginYaml = downloadFile(req.query.yamlUrl);
    } else {
        getPluginYaml = Promise.resolve(req.files.yaml_file[0].buffer);
    }

    getPluginYaml
        .then(yaml.safeLoad)
        .then(pluginYamlData =>
            res.status(200).send({
                title: _.chain(pluginYamlData.plugins).values().head().get('package_name', '')
            })
        )
        .catch(() => res.status(200).send({ title: '' }));
});

router.post(
    '/upload',
    passport.authenticate('token', { session: false }),
    upload.fields(_.map(['wagon_file', 'yaml_file', 'icon_file'], name => ({ name, maxCount: 1 }))),
    checkParams,
    (req, res) => {
        const promises = [];
        let wagonFilename;

        if (req.query.wagonUrl) {
            promises.push(downloadFile(req.query.wagonUrl));
            wagonFilename = _.last(req.query.wagonUrl.split('/'));
        } else {
            promises.push(Promise.resolve(req.files.wagon_file[0].buffer));
            wagonFilename = req.files.wagon_file[0].originalname;
        }

        if (req.query.yamlUrl) {
            promises.push(downloadFile(req.query.yamlUrl));
        } else {
            promises.push(Promise.resolve(req.files.yaml_file[0].buffer));
        }

        if (req.query.iconUrl) {
            promises.push(downloadFile(req.query.iconUrl));
        } else if (_.get(req.files, 'icon_file')) {
            promises.push(Promise.resolve(req.files.icon_file[0].buffer));
        } else {
            promises.push(null);
        }

        Promise.all(promises)
            .then(([wagonFile, yamlFile, iconFile]) => {
                const uploadRequest = ManagerHandler.request(
                    'post',
                    `/plugins?visibility=${req.query.visibility}&title=${req.query.title}`,
                    {
                        'authentication-token': req.headers['authentication-token'],
                        tenant: req.headers.tenant
                    },
                    null,
                    response => {
                        RequestHandler.getResponseJson(response)
                            .then(data => {
                                res.status(response.statusCode).send(data);
                            })
                            .catch(() => {
                                res.sendStatus(response.statusCode);
                            });
                    },
                    err => {
                        res.status(500).send({ message: err });
                    }
                );

                zipFiles(wagonFile, wagonFilename, yamlFile, iconFile, uploadRequest).catch(err => {
                    res.status(500).send({ message: `Failed zipping the plugin. ${err}` });
                });
            })
            .catch(err => {
                res.status(500).send({ message: `Failed downloading files. ${err}` });
            });
    }
);

module.exports = router;
