exports.config = {
    capabilities: { 'browserName': 'chrome' },
    specs: ['e2e/*.js'],
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 120000
    },
    onPrepare: function () {
        browser.driver.manage().window().maximize();
    },
    allScriptsTimeout: 120000
};

