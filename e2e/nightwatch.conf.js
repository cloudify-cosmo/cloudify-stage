module.exports = (function(settings) {
    console.log(`Running nightwatch on ${process.platform} platform.`);
    if (process.platform === 'win32') {
        settings.selenium.cli_args['webdriver.chrome.driver']  = "./e2e/bin/chromedriver.exe";
    }

    var managerUrl = process.env.STAGE_E2E_MANAGER_URL;
    if (managerUrl) {
        managerUrl = managerUrl.trim();
        console.log('Connecting to manager: '+managerUrl);
        settings.test_settings.default.launch_url = 'http://'+managerUrl;
    }

    var seleniumHost = process.env.STAGE_E2E_SELENIUM_HOST;
    if (seleniumHost) {
        seleniumHost = seleniumHost.trim();
        console.log('Using selenium host: '+seleniumHost);
        settings.test_settings.default.selenium_host = seleniumHost;
        settings.selenium.start_process = false;
    }
    return settings;
})(require('./nightwatch.json'));