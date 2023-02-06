import axios from 'axios';
import { resolve as resolvePath } from 'path';
import { writeFileSync } from 'fs';
import translationFile from '../app/translations/en.json';
import config from './readmesConfig.json';

const supportedParams: Record<string, string> = translationFile.widgets.common.readmes.params;

function log(prefix: string, message: string | RegExpMatchArray | null) {
    console.log(`[${prefix}]:`, message);
}

function logError(prefix: string, message: string) {
    console.error(`[${prefix}]:`, message);
}

function logChange(prefix: string, type: string, changes: string | RegExpMatchArray | null) {
    if (changes) {
        log(prefix, changes);
    } else {
        log(prefix, `No changes for ${type}`);
    }
}

async function downloadFile(widget: string, url: string) {
    return axios(url, { responseEncoding: 'utf8' })
        .then(({ data }) => {
            log(widget, `Downloaded ${url}.`);
            return String(data);
        })
        .catch(err => {
            throw new Error(
                `Failed downloading ${url}. Status code: ${err.status}. Error: ${err.code || err.message}.`
            );
        });
}

function updateTitle(widget: string, content: string) {
    return new Promise<string>(resolve => {
        // NOTE: [^]* are used instead of .* to capture line breaks
        const titleRegex = /---[^]*title: ([^\n]*)[^]*---/m;
        let newContent = content;

        log(widget, 'Updating title:');
        logChange(widget, 'title', newContent.match(titleRegex)?.[1] || null);

        newContent = newContent.replace(titleRegex, '# $1');

        resolve(newContent);
    });
}

function validateHugoParams(widget: string, content: string) {
    return new Promise<string>((resolve, reject) => {
        const paramRegex = /{{<\s*param\s*(\S*)\s*>}}/gm;

        log(widget, 'Validating Hugo params:');

        Array.from(content.matchAll(paramRegex)).forEach(match => {
            const paramName = match[1];
            const paramValue = supportedParams[paramName];
            log(widget, paramName);
            if (paramValue === undefined) {
                reject(
                    new Error(
                        `${paramName} not found in supported parameters. Add support by extending translation file`
                    )
                );
            }
        });

        resolve(content);
    });
}

function convertHugoShortcodes(widget: string, content: string) {
    return new Promise<string>(resolve => {
        // NOTE: See http://www.regular-expressions.info/repeat.html#lazy for an explanation of `*?`
        const anyCharacterRegex = '[^]*?';

        /* eslint-disable security/detect-non-literal-regexp */
        const getStyledMessageRegex = (messageType = '') =>
            new RegExp(`{{%\\s*${messageType}.*%}}(${anyCharacterRegex}){{%\\s*\\/${messageType}\\s*%}}`, 'gm');

        const getRelrefMarkdownLinkRegex = (linkPrefix = '') =>
            new RegExp(`\\[(.+)\\]\\({{<\\s*relref\\s*"(${linkPrefix}\\S*)"\\s*>}}\\)`, 'gm');
        /* eslint-enable security/detect-non-literal-regexp */

        const noteRegex = getStyledMessageRegex('note');
        const tipRegex = getStyledMessageRegex('tip');
        const warningRegex = getStyledMessageRegex('warning');
        const styledContentWrappersRegex = getStyledMessageRegex('(?:note|tip|warning)');
        const tableRegex = /<table>([^]*?)<\/table>/gm;

        // relref
        const relrefRegex = /{{<\s*relref\s*"(\S*)"\s*>}}/gm;
        const relrefToCurrentPageRegex = getRelrefMarkdownLinkRegex('#');
        const indexRegex = /_index.md/gm;
        const mdRegex = /\.md/gm;

        const onLinkRedirectionToTheCurrentPage =
            "document.getElementById(this.getAttribute('href')).scrollIntoView();";

        let newContent = content;

        log(widget, 'Converting Hugo shortcodes:');
        logChange(widget, 'note shortcodes', newContent.match(noteRegex));
        logChange(widget, 'tip shortcodes', newContent.match(tipRegex));
        logChange(widget, 'warning shortcodes', newContent.match(warningRegex));

        newContent = newContent
            .replace(styledContentWrappersRegex, match => {
                return match?.replace(getRelrefMarkdownLinkRegex(), '<a href="/$2">$1</a>');
            })
            .replace(noteRegex, '<div class="ui message info">$1</div>')
            .replace(tipRegex, '<div class="ui message info">$1</div>')
            .replace(warningRegex, '<div class="ui message warning">$1</div>')
            .replace(tableRegex, '<table class="ui celled table">$1</table>');

        log(widget, 'Converting relref links which are pointing out to the current MD file:');
        logChange(widget, 'relref shortcodes', newContent.match(relrefToCurrentPageRegex));

        log(widget, 'Converting relref links:');
        logChange(widget, 'relref shortcodes', newContent.match(relrefRegex));

        newContent = newContent
            .replace(relrefToCurrentPageRegex, `<a href="$2" onclick="${onLinkRedirectionToTheCurrentPage}">$1</a>`)
            .replace(relrefRegex, '/$1')
            .replace(indexRegex, 'index.html')
            .replace(mdRegex, '');

        resolve(newContent);
    });
}

function saveToReadmeFile(widget: string, content: string, readmePath: string) {
    log(widget, `Saving content to ${readmePath}...`);

    writeFileSync(readmePath, content);
}

function updateFiles() {
    const logPrefix = 'main';

    const promises = config.files.map(file => {
        const widgetsPath = 'widgets';
        const readmeFileName = 'README.md';
        const readmePath = resolvePath(`${widgetsPath}/${file.widget}/${readmeFileName}`);
        const url = `${config.rawContentBasePath}${file.link}`;
        const { widget } = file;

        log(logPrefix, `Adding to queue: '${url}' for '${widget}' widget...`);
        return downloadFile(widget, url)
            .then(content => validateHugoParams(widget, content))
            .then(content => updateTitle(widget, content))
            .then(content => convertHugoShortcodes(widget, content))
            .then(content => saveToReadmeFile(widget, content, readmePath));
    });

    Promise.all(promises).catch(error => {
        logError(logPrefix, error);
        process.exit(-1);
    });
}

updateFiles();
