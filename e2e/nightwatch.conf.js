module.exports = (function(settings) {
    console.log(`Running nightwatch on ${process.platform} platform.`);
    if (process.platform === 'win32') {
        settings.selenium.cli_args['webdriver.chrome.driver']  = "./e2e/bin/chromedriver.exe";
    }

    var managerUrl = process.env.MANAGER_URL;
    if (managerUrl) {
        managerUrl = managerUrl.trim();
        console.log('Connecting to manager: '+managerUrl);
        settings.test_settings.default.launch_url = 'http://'+managerUrl;
    }
    return settings;
})(require('./nightwatch.json'));