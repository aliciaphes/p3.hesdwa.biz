var myTrip = {
	
	step: 0,

	stepTitles: ["Select dates", "Passengers", "Summary"],

	departureDate: new Date(),
	returningDate: 0,

	//var passengerList = ["First name"];
	passengerList: [],


	setDepartureDate: function(begin) {
		this.departureDate = begin;
	},

	setReturningDate: function(end) {
		this.returningDate = end;
	},

	getDepartureDate: function() {
		return this.departureDate;
	},

	getReturningDate: function() {
		return this.returningDate;
	},

	nextStep: function() {
		this.step++;
	},

	prevStep: function() {
		this.step--;
	},	

	getStep: function() {
		return this.step;
	},

	getTitle: function(index) {
		return this.stepTitles[index];
	},

	getPassenger: function(index) {
		return this.passengerList[index];
	}
}