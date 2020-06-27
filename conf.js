var Jasmine2HtmlReporter = require('./node_modules/protractor-jasmine2-html-reporter');

exports.config = {
	seleniumAddress : 'http://localhost:4444/wd/hub',
	framework : 'jasmine',
	onPrepare : function() {
		browser.get('https://room77.com/'); 
		browser.manage().window().maximize();
		jasmine.getEnv().addReporter(new Jasmine2HtmlReporter({
            takeScreenshots: true,
            takeScreenshotsOnlyOnFailures: true,
            consolidateAll: true,
            savePath: './reports/',
			fileName:'webtable_report.html'
          }));
	},
	specs : [ './src/tests/testSuite.js' ]
};