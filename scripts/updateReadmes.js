const request = require('request').defaults({ encoding: 'utf8' });
const fs = require('fs');
const path = require('path');
const toml = require('@iarna/toml');

const config = require('./readmesConfig.json');

function log(prefix, message) {
    console.log(`[${prefix}]:`, message);
}

function logError(prefix, message) {
    console.error(`[${prefix}]:`, message);
}

function logChange(prefix, type, changes) {
    if (changes) {
        log(prefix, changes);
    } else {
        log(prefix, `No changes for ${type}`);
    }
}

function downloadFile(widget, url) {
    return new Promise((resolve, reject) => {
        request.get(url, (err, res, body) => {
            const isSuccess = res.statusCode >= 200 && res.statusCode < 300;
            if (err || !isSuccess) {
                reject(new Error(`Failed downloading ${url}. Status code: ${res.statusCode}. Error: ${err}.`));
            } else {
                log(widget, `Downloaded ${url}.`);
                resolve(String(body));
            }
        });
    });
}

function updateTitle(widget, content) {
    return new Promise((resolve, reject) => {
        const titleRegex = /---[^]*title: ([\w ]*)[^]*---/m;

        log(widget, 'Updating title:');
        logChange(widget, 'title', content.match(titleRegex)[1]);

        content = content.replace(titleRegex, '# $1');

        resolve(content);
    });
}

function updateLinks(widget, content) {
    return new Promise((resolve, reject) => {
        const linkRegex = /(\[.*?\])\(\s*(?!http)(.*?)\s*\)/gm;

        log(widget, 'Updating markdown links:');
        logChange(widget, 'markdown links', content.match(linkRegex));

        content = content.replace(linkRegex, `$1(${config.linksBasePath}$2)`);

        resolve(content);
    });
}

function convertHugoParams(widget, content, params) {
    return new Promise((resolve, reject) => {
        const paramRegex = /{{<\s*param\s*(\S*)\s*>}}/gm;

        log(widget, 'Converting Hugo params:');
        logChange(widget, 'param shortcodes', content.match(paramRegex));

        Array.from(content.matchAll(paramRegex)).forEach(match => {
            const paramName = match[1];
            const paramValue = params[paramName];
            log(widget, match[0], match[1]);
            if (paramValue !== undefined) {
                log(widget, `Converting "${match[0]}" into "${paramValue}".`);
                content = content.replace(match[0], paramValue);
            } else {
                reject(new Error(`No ${paramName} parameter found.`));
            }
        });

        resolve(content);
    });
}

function convertHugoShortcodes(widget, content) {
    return new Promise((resolve, reject) => {
        const noteRegex = /{{%\s*note.*%}}([^]*){{%\s*\/note\s*%}}/gm;
        const tipRegex = /{{%\s*tip.*%}}([^]*){{%\s*\/tip\s*%}}/gm;
        const warningRegex = /{{%\s*warning.*%}}([^]*){{%\s*\/warning\s*%}}/gm;

        // relref
        const relrefRegex = /{{<\s*relref\s*"(\S*)"\s*>}}/gm;
        const indexRegex = /\_index.md/gm;
        const mdRegex = /\.md/gm;

        log(widget, 'Converting Hugo shortcodes:');
        logChange(widget, 'note shortcodes', content.match(noteRegex));
        logChange(widget, 'tip shortcodes', content.match(tipRegex));
        logChange(widget, 'warning shortcodes', content.match(warningRegex));

        content = content
            .replace(noteRegex, '$1')
            .replace(tipRegex, '$1')
            .replace(warningRegex, '$1');

        log(widget, 'Converting relref links:');
        logChange(widget, 'relref shortcodes', content.match(relrefRegex));

        content = content
            .replace(relrefRegex, '/$1')
            .replace(indexRegex, 'index.html')
            .replace(mdRegex, '');

        resolve(content);
    });
}

function removeHTMLTags(widget, content) {
    return new Promise((resolve, reject) => {
        const htmlTagRegex = /<[^>]*>/gm;

        log(widget, 'Removing HTML tags:');
        logChange(widget, 'html tags', content.match(htmlTagRegex));

        content = content.replace(htmlTagRegex, '');

        resolve(content);
    });
}

function saveToReadmeFile(widget, content, readmePath) {
    log(widget, `Saving content to ${readmePath}...`);

    fs.writeFileSync(readmePath, content);
}

function updateFiles() {
    const logPrefix = 'main';
    const hugoConfigUrl = `${config.rawContentBasePath}/${config.configFile}`;

    downloadFile(logPrefix, hugoConfigUrl)
        .then(tomlString => {
            const hugoConfig = toml.parse(tomlString);
            const { params } = hugoConfig;

            const promises = config.files.map(file => {
                const widgetsPath = 'widgets';
                const readmeFileName = 'README.md';
                const readmePath = path.resolve(`${widgetsPath}/${file.widget}/${readmeFileName}`);
                const url = `${config.rawContentBasePath}${file.link}`;
                const { widget } = file;

                log(logPrefix, `Adding to queue: '${url}' for '${widget}' widget...`);
                return downloadFile(widget, url)
                    .then(content => updateTitle(widget, content))
                    .then(content => convertHugoParams(widget, content, params))
                    .then(content => convertHugoShortcodes(widget, content))
                    .then(content => updateLinks(widget, content))
                    .then(content => removeHTMLTags(widget, content))
                    .then(content => saveToReadmeFile(widget, content, readmePath));
            });

            return Promise.all(promises);
        })
        .catch(error => {
            logError(logPrefix, error);
            process.exit(-1);
        });
}

updateFiles();
