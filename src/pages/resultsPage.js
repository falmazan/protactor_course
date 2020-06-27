
var Utils = require('../resources/utils.js');

var ResultsPage = function() {
	
	this.checkInPicker = element(by.id('InDate_disp'));
	this.checkOutPicker = element(by.id('OutDate_disp'));	
	this.hiddenInputOutdate = element(by.id('OutDate'));
	this.hiddenInputIndate = element(by.id('InDate'));
	this.searchRoomInput = element(by.id('search-rooms'));
	this.searchRoomSpan = element(by.css("#rooms span span"));
	this.searchButton = element(by.id('btnStartSearch'));
	this.searchLocationInput = element(by.css("#destination .pac-target-input"));
	this.searchAutocompleteList = element(by.css(".pac-container"));
	this.hotelList = element.all(by.xpath("//div[@id='Rates']/div[contains(@id,'hotel') and not(contains(@id,'-'))]"));
	this.sortBy = element(by.id("sort-by"));
	this.hotelNameFilter = element(by.css("#filter-hotelname input"));
	this.starRating = element(by.id("filter-stars"));
	this.guestReviewRange = element(by.id("guest-review-range"));
	this.logo = element(by.id("logo-xx"));

	var expectedConditions = protractor.ExpectedConditions;

	this.verifyCheckInDate = async function() {
		let todayDate = Utils.addDaysToDate(0, new Date());
		let inputInDate = await this.hiddenInputIndate.getAttribute("value") + "";
		expect(inputInDate).toEqual(todayDate);
	}

	this.verifyCheckOutDate = async function() {
		let tomorrowDate = Utils.addDaysToDate(1, new Date());
		let inputOutdate = await this.hiddenInputOutdate.getAttribute("value") + "";
		expect(inputOutdate).toEqual(tomorrowDate);
	}
	
	this.selectCheckInDateNextMonth = async function() {
		let selectedDate = await this.hiddenInputIndate.getAttribute('value') + "";
		let selectedDateArray = selectedDate.split("/");
		let selectedDay = selectedDateArray[1];
		//Search in the next month div
		selectDateFromPicker(this.checkInPicker,'ui-datepicker-group-last', parseInt(selectedDay));
		selectedDate = await this.hiddenInputIndate.getAttribute('value') + "";
	}

	this.selectCheckOutDate = async function(days) {
			
		let tomorrowDate = await this.hiddenInputOutdate.getAttribute('value') + "";
		let tomorrowDateArray = tomorrowDate.split("/");
		let tomorrowMonth = tomorrowDateArray[0];
		
		let dateWithfourteenDaysMore = Utils.addDaysToDate(days,tomorrowDate);
		let dateWithfourteenDaysMoreArray = dateWithfourteenDaysMore.split("/");
		let fourteenDaysMoreDay = dateWithfourteenDaysMoreArray[1];
		let fourteenDaysMoreMonth = dateWithfourteenDaysMoreArray[0];

		if(tomorrowMonth < fourteenDaysMoreMonth) {
			//Search in the next month div
			selectDateFromPicker(this.checkOutPicker,'ui-datepicker-group-last', fourteenDaysMoreDay);
			let selectedDate = await this.hiddenInputOutdate.getAttribute('value') + "";
			expect(selectedDate).not.toBe("");
			expect(selectedDate).toEqual(dateWithfourteenDaysMore);
		}
		else {
			//Search in the current month div
			selectDateFromPicker(this.checkOutPicker,'ui-datepicker-group-first', fourteenDaysMoreDay);
			let selectedDate = await this.hiddenInputOutdate.getAttribute('value') + "";
			expect(selectedDate).not.toBe("");
			expect(selectedDate).toEqual(dateWithfourteenDaysMore);
		}
	}
	
	this.selectRoomOption = async function(optNumber) {
		browser.actions().
		mouseDown(this.searchRoomInput).
		perform();
		let option = element(by.css("#search-rooms > option:nth-child("+optNumber+")"));
		option.click();
		let roomSelection = await this.searchRoomSpan.getText();
		expect(roomSelection).toEqual(optNumber+"");
	}

	this.clickOnSearchButton = function() {
		this.searchButton.click();
	}

	this.verifyListOfHotelsNotEmpty = function() {
		this.hotelList.then(function(items) {
			expect(items.length).toBeGreaterThanOrEqual(0);
		});
	}
	
	this.searchCity = async function(cityKey) {
		let cityInput = await element(by.xpath('//*[@id="destination"]/input[@name="City"]'));
		browser.wait(
			expectedConditions.presenceOf(this.searchLocationInput), 2000,
			 'Element taking too long to appear in the DOM');
			this.searchLocationInput.clear().then(function() {
				cityInput.sendKeys(cityKey);
			});
		browser.sleep(2000);
		element.all(by.css('.pac-container .pac-item'))
		.each(function(item, index) {
			if(index === 0) {
				item.click();
				return 0;
			}
		});
	}
	
	this.verifyQuickSearchButtonName = async function() {
		expect(this.searchButton.getAttribute('value') + "" === "Quick Search");
	}

	async function selectDateFromPicker(picker, pickerSelector, dateSelected) {
		picker.click();
		let selector = `//div[contains(@class, '${pickerSelector}')]//td[a[text()='${parseInt(dateSelected)}']]`;
		picker.isDisplayed().then(function(isVisible) {
			if(isVisible) {
				element(by.xpath(selector)).click();	
			}			
		});		
	}

	this.verifySortingDistanceOrder = async function() {
		let isOrderCorrect = true;
		this.hotelList.then(async function(items) {
			if(items.length >= 2) {
				for(var i=1; i < items.length; i++) {
					let elementOne = await items[i-1].getWebElement().getDriver()
					.findElement(by.css(".distance"));
					let elementTwo = await items[i].getWebElement().getDriver()
					.findElement(by.css(".distance"));
					let distOne = await elementOne.getText().then(function(text) {
						return parseFloat(text.split(" ")[0]);
					});
					let distTwo = await elementTwo.getText().then(function(text) {
						return parseFloat(text.split(" ")[0]);
					});
					if(distOne > distTwo) {
						isOrderCorrect = false;
					}	
				}
			}else {
				console.log("It's not possibe verify distance sorting order with less than two elements");
			}
		});
		expect(isOrderCorrect).toBe(true);
	}

	this.selectFilter = function(filter) {
		this.sortBy.element(by.id(filter)).click();
	}

	this.verifySortingPriceOrder = function() {
		let isOrderCorrect = true;
		this.hotelList.then(async function(items) {
			if(items.length >= 2) {
				for(var i=1; i < items.length; i++) {
					let elementOne = await items[i-1].getWebElement().getDriver()
					.findElement(by.css(".price"));
					let elementTwo = await items[i].getWebElement().getDriver()
					.findElement(by.css(".price"));
					let priceOne = await elementOne.getText().then(function(text) {
						return parseFloat(text.replace('$',''));
					});
					let priceTwo = await elementTwo.getText().then(function(text) {
						return parseFloat(text.replace('$',''));
					});
					if(priceOne > priceTwo) {
						isOrderCorrect = false;
					}	
				}
			}else {
				console.log("It's not possibe verify price sorting order with less than two elements");
			}
		});
		expect(isOrderCorrect).toBe(true);
	}

	this.filterByBrand = function(brand) {
		this.hotelNameFilter.sendKeys(brand);
	}
	
	this.verifyAllHotelNames = function(brand) {
		let areNamesCorrect = true;
		this.hotelList.each(function(item) {
			try{
				item.getText().then(function(text){
					console.log("text"+text);
				});
				item.getWebElement().getDriver().findElement(by.css(".hotel-name")).getText()
				.then(function(text) {
					if(text !== brand){
						areNamesCorrect = false;
					}
				});
			}catch(error){}
		});
		expect(areNamesCorrect).toBe(true);
	}

	this.selectStarRating = function(stars) {
		this.starRating.element(by.id("Rating"+stars)).click();
	}

	this.selectGuestReviews = function(percentage) {
		this.guestReviewRange.element(by.css(".ui-slider-pip-"+percentage/20+"  span.ui-slider-label")).click(); 
	}

	this.verifyAllHotelsStars = function(stars) {
		this.hotelList.then(function(items) {
			for(var i=0; i < items.length; i++){
				items[i].getWebElement().getDriver().findElements(by.css(".rating-column .star-rating i"))
				.then(function(is){
					expect(stars).toEqual(is.length/items.length);
				});
			}
		});
	}

	this.verifyGuestRating = function(rating) {
		this.hotelList.each(async function(item) {
			let rate = await item.getWebElement().getDriver().findElement(by.css(".review-score"))
			.getText().then( function(text) {
				return parseFloat((text.split(" ")[2]).split("/")[0]);
			});
			expect(rate).toBeGreaterThanOrEqual(rating/20);
		});
	}
	this.selectHotel = function(hotelPosition) {
		this.hotelList.then(function(items){
			if(items.length >= hotelPosition){
				let item = items[hotelPosition-1];
				item.getWebElement().getDriver().findElement(by.css(".description-column  a")).click();
			}
		});
	}

	this.verifyAddress = function(address) {
		this.hotelList.then(function(items){
			if(items.length > 0){
				items[0].getWebElement().getDriver().findElement(by.css(".description-column .address"))
				.getText().then(function(text) {
					expect(text.includes(address)).toBe(true);
				});
			}

		});
	}

	this.getLowerPriceHotel = async function() {
		let lowerPrice = 0;
		await this.hotelList
		.each(function(item, index) {
			item.getWebElement().getDriver().findElement(by.css(".price")).getText()
			.then(function(text) {
				let price = parseFloat(text.replace("$",""));
				if(index == 0){
					lowerPrice = price;
				}else if(lowerPrice > price) {
					lowerPrice = price;
				}
			});
		});
		console.log("lowePrice:"+lowerPrice);
	}

	this.verifySiteNameIsAtTheTop = function() {
		this.logo.getLocation().then(function(location) {
			expect(location.y).toBeLessThan(10);
		});
	}
}

module.exports = ResultsPage;