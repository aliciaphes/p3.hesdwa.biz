var myTrip = {
	
	step: 0,

	stepTitles: ["Select dates", "Passengers", "Extras", "Summary"],



	setBegin: function(begin) {
		this.begin = begin;
	},

	setEnd: function(end) {
		this.end = end;
	},

	getBegin: function() {
		return this.begin;
	},

	getEnd: function() {
		return this.end;
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
	}	
}