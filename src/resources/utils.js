
module.exports = {
	
	getDateWithFormat : function(date) {
		var mm = String(date.getMonth() + 1);
		var dd = String(date.getDate());
		var yyyy = String(date.getFullYear());
		return mm + "/" + dd + "/" + yyyy;
	},

	addDaysToDate : function(days, date) {
		var currentDate = new Date(date);
		var newDate = new Date(currentDate);
		newDate.setDate(newDate.getDate() + days);
		var dd = newDate.getDate() + "";
		var mm = newDate.getMonth() + 1 + "";
		var yyyy = newDate.getFullYear() + "";
		
		if(mm.length < 2){
			mm = "0" + mm;
		}
		if(dd.length < 2){
			dd = "0" + dd;
		}
		return mm + "/" + dd + "/" + yyyy;
	}

}
