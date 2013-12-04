function trip(){
	
	this.step = 0;
	this.stepTitles = ["Select dates", "Passengers", "Extras", "Summary"];



	this.setBegin = function(begin) {
		this.begin = begin;
	};

	this.setEnd = function(end) {
		this.end = end;
	};

	this.getBegin = function() {
		return this.begin;
	};

	this.getEnd = function() {
		return this.end;
	};

	this.nextStep = function() {
		this.step++;
	};

	this.getStep = function() {
		return this.step;
	};	
}