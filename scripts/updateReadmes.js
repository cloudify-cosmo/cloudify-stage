let request = require('request').defaults({ encoding: 'utf8' });
let fs = require('fs');
let path = require('path');
let _ = require('lodash');

const config = require('./readmesConfig.json');

function logChange(type, changes) {
    if (changes) {
        console.log(changes);
    } else {
        console.log(`No changes for ${type}`);
    }
}

function downloadFile(url) {
    return new Promise((resolve, reject) => {
        request.get(url, (err, res, body) => {
            let isSuccess = res.statusCode >= 200 && res.statusCode <300;
            if (err || !isSuccess) {
                reject(`Failed downloading ${url}. Status code: ${res.statusCode}. Error: ${err}.`);
            } else {
                console.info(`Downloaded ${url}.`);
                resolve(String(body));
            }
        });
    });
}

function updateTitle(content) {
    return new Promise((resolve, reject) => {
        const titleRegex = /---\n.*title: ([\w ]*)\n.*---/ms;

        console.info('Updating title:');
        logChange('title', content.match(titleRegex)[1]);

        content = content.replace(titleRegex, '### $1');

        resolve(content);
    })
}

function updateLinks(content) {
    return new Promise((resolve, reject) => {
        const linkRegex = /(\[.*?\])\(\s*(.*?)\s*\)/gm;

        console.info('Updating markdown links:');
        logChange('markdown links', content.match(linkRegex));

        content = content.replace(linkRegex, `$1(${config.linksBasePath}$2)`);

        resolve(content);
    });
}

function convertHugoShortcodes(content) {

    return new Promise((resolve, reject) => {
        // note
        const noteRegex = /{{%\s*note.*%}}(.*){{%\s*\/note\s*%}}/gms;
        const tipRegex = /{{%\s*tip.*%}}(.*){{%\s*\/tip\s*%}}/gms;
        const warningRegex = /{{%\s*warning.*%}}(.*){{%\s*\/warning\s*%}}/gms;

        // relref
        const relrefRegex = /{{<\s*relref\s*"(\S*)"\s*>}}/gms;
        const _indexRegex = /\_index.md/gm;
        const mdRegex = /\.md/gm;

        console.info('Converting Hugo shortcodes:');
        logChange('note shortcodes', content.match(noteRegex));
        logChange('tip shortcodes', content.match(tipRegex));
        logChange('warning shortcodes', content.match(warningRegex));

        content = content
            .replace(noteRegex, '$1')
            .replace(tipRegex, '$1')
            .replace(warningRegex, '$1')

        console.info('Converting relref links:');
        logChange('relref shortcodes', content.match(relrefRegex));

        content = content
            .replace(relrefRegex, '/$1')
            .replace(_indexRegex, 'index.html')
            .replace(mdRegex, '');

        resolve(content);
    });
}

function removeHTMLTags(content) {
    return new Promise((resolve, reject) => {
        const htmlTagRegex = /<[^>]*>/gms;

        console.info('Removing HTML tags:');
        logChange('html tags', content.match(htmlTagRegex));

        content = content.replace(htmlTagRegex, '');

        resolve(content);
    });
}

function saveToReadmeFile(content, readmePath) {
    console.info(`Saving content to ${readmePath}...`);

    fs.writeFileSync(readmePath, content);
}


_.forEach(config.files, async (file) => {
    const widgetsPath = 'widgets';
    const readmeFileName = 'README.md';
    const readmePath = path.resolve(`${widgetsPath}/${file.widget}/${readmeFileName}`);
    const url = `${config.rawContentBasePath}${file.link}`;

    console.info(`Adding to queue: '${url}' for '${file.widget}' widget...`);
    await downloadFile(url)
        .then(updateTitle)
        .then(convertHugoShortcodes)
        .then(updateLinks)
        .then(removeHTMLTags)
        .then((content) => saveToReadmeFile(content, readmePath))
        .catch((error) => console.error(error));
});

