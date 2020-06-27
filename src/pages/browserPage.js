// Browser page and its webelements and methods

var BrowserPage = function() {
	
	this.browserInput = element(by.id('autocomplete'));
	
	this.searchHotel = function(searchKey, searchResult) {
		this.browserInput.sendKeys(searchKey);
		let first = element(by.css(`span[selenium-suggestion*="${searchResult}"]`));
		//Waiting for page load
		browser.sleep(2000);
		first.click();
	}

}

module.exports = BrowserPage;