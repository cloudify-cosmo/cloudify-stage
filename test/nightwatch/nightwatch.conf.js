module.exports = (function(settings) {
    const _ = require('lodash');
    try {
        const me = require('../../conf/me.json');
        console.log('me.json found. Updating nightwatch settings.');
        _.merge(settings, me.e2e);
    } catch (err) {
        if (err.code !== 'MODULE_NOT_FOUND') {
            throw err;
        } else {
            console.log('me.json not found. Using nightwatch settings.');
        }
    }

    console.log(`Running nightwatch on ${process.platform} platform.`);
    if (process.platform === 'win32') {
        settings.selenium.cli_args['webdriver.chrome.driver'] =
            './node_modules/chrome-driver-standalone/binaries/chromedriver_win32.exe';
    } else if (process.platform === 'linux') {
        settings.selenium.cli_args['webdriver.chrome.driver'] =
            './node_modules/chrome-driver-standalone/binaries/chromedriver_linux64';
    }

    let managerUrl = process.env.STAGE_E2E_MANAGER_URL;
    if (managerUrl) {
        managerUrl = managerUrl.trim();
        console.log(`Connecting to manager: ${managerUrl}`);
        settings.test_settings.default.launch_url = `http://${managerUrl}`;
    }

    let seleniumHost = process.env.STAGE_E2E_SELENIUM_HOST;
    if (seleniumHost) {
        seleniumHost = seleniumHost.trim();
        console.log(`Using selenium host: ${seleniumHost}`);
        settings.test_settings.default.selenium_host = seleniumHost;
        settings.selenium.start_process = false;
    }
    return settings;
})(require('./nightwatch.json'));
