
var BrowserPage = require('../pages/browserPage.js');
var ResultsPage = require('../pages/resultsPage.js');
var Data = require('../data/data.json');

describe('Room 77 test cases:', function() {
	
	var browserPage;
	var resultsPage
	
	beforeAll(() => {
		browser.waitForAngularEnabled(false);
	});

	beforeEach(() =>{
		browserPage = new BrowserPage();
		resultsPage = new ResultsPage();		
	})

	it('TC 1: Search for a hotel', async function() {
		//Select “La Argentina” from the auto populated list.
		browserPage.searchHotel(Data.hotelSearchKey, Data.searchResult);
		//Verify ‘Check-in’  is having today’s dates
		resultsPage.verifyCheckInDate();

		//Verify ‘Check-out’  is having tomorrow’s date
		resultsPage.verifyCheckOutDate();
	
		//Select date after two weeks as check-out date
		browser.sleep(5000);
		resultsPage.selectCheckOutDate(Data.checkOutDays);

		//Select room number as 2.
		resultsPage.selectRoomOption(Data.rooms);

		//Click search
		resultsPage.clickOnSearchButton();

		//Verify hotels list is populated
		resultsPage.verifyListOfHotelsNotEmpty();
	});

	it('TC 2: Update search', function() {
		//Type London and select London Uk
		resultsPage.searchCity(Data.searchCity);

		//Select same check-in date from the next month
		resultsPage.selectCheckInDateNextMonth();
	
		//Select check out date 14 days after that date.
		browser.sleep(5000);
		resultsPage.selectCheckOutDate(Data.checkOutDays);

		//Verify button name is ‘Quick Search’
		resultsPage.verifyQuickSearchButtonName();

		//Click Quick search
		resultsPage.clickOnSearchButton();

		//Verify hotels list is populated
		resultsPage.verifyListOfHotelsNotEmpty();
	});

	it('TC 3: Sorting order verification', function() {
		//Verify the default sorting order is 'Distance'
		resultsPage.verifySortingDistanceOrder();
		
		//Select price sort
		resultsPage.selectFilter(Data.filter);
		
		//verify all hotels are sorted by price
		resultsPage.verifySortingPriceOrder();
	});
	
	it('TC 4: Filter result verification', function() {
		//Filter the result by “Best Western” brand.
		resultsPage.filterByBrand(Data.brand);

		//Verify all hotel names starts with “Best Western”.
		resultsPage.verifyAllHotelNames(Data.brand);
		//Select 3 for star rating and 70 for guest rating.
		resultsPage.selectStarRating(Data.starRating);
		resultsPage.selectGuestReviews(Data.guestReviews);

		//Verify all hotels listed
		resultsPage.verifyAllHotelsStars(Data.starRating);
		resultsPage.verifyGuestRating(Data.guestReviews);
	});
	
	it('TC 5: View details of a hotel', function() {
		//Click on the first hotel listed
		resultsPage.selectHotel(Data.hotelSelected);

		//Verify the address contains ‘London’
		resultsPage.verifyAddress(Data.searchCity);

		//Verify the lowest price among all deals 
		resultsPage.getLowerPriceHotel();
		
		//Verify the site name is showing at the top.
		resultsPage.verifySiteNameIsAtTheTop();
	});

});

