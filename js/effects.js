$( document ).ready(function() {
	//var myTrip = new trip();


var devices = new Array("Phone", "Tablet", "Computer");





	function showStep(index){

		//console.log("Step = " + index);

		//show current step and hide the rest:
		$("#step" + index).show();

		$("#step" + index + " .buttons")
		.empty() //clear button area and then insert:
		.append("<button id='prev"+index+"'>Prev</button>")
		.append("<button id='next"+index+"'>Next</button>");

		$("#step" + index + " button").addClass("btn");

		//find the header an give it the title
		$("#step" + index).find("header h3").html(myTrip.getTitle(index));

		var n = myTrip.stepTitles.length;
		for(var i=0; i < n; i++){
			if(i != index)
				$("#step"+i).hide();
			if(i == 0) //if first step, hide 'prev' button
				$("#prev"+i).hide();
			if(i == n-1) //if last step, hide 'next' button
				$("#next"+i).hide();
		}

	};


	
showStep(myTrip.getStep()); //first call to initialize



//Actions to perform when clicking on 'Next'
	$(document).on('click', 'button[id^="next"]', function() { //$('#next' + myTrip.step)

	//alert("button clicked");
	myTrip.nextStep();
	showStep(myTrip.getStep());

});



//Actions to perform when clicking on 'Prev'
$(document).on('click', 'button[id^="prev"]', function() {

	//alert("button clicked");
	myTrip.prevStep();
	showStep(myTrip.getStep());

});





//Actions to perform when clicking on 'Return trip'
$('#radioReturn').click(function() {

	$('#dpReturn').val('').show().removeAttr('disabled')
	.datepicker({
		changeMonth: true,
		changeYear: true,
		onSelect: function(){ 
			var dateObject = $(this).datepicker('getDate');

			myTrip.setBegin(dateObject);
			var d = myTrip.getBegin().getDate();
			console.log(d);
		}

	});


	$('#dpOneWay').val('').show().datepicker({
		changeMonth: true,
		changeYear: true
	});
});


//Actions to perform when clicking on 'One way'
$('#radioOne').click(function() {

		$('#dpReturn').val('') //.hide()
		.prop("disabled", true) //disable editing
		;
		$('#dpOneWay').val('').show().datepicker({
			changeMonth: true,
			changeYear: true
		});
	});




$('#name').autocomplete({

	source: function(request, response) {

		$.ajax({
			dataType: "JSON",
			url: "data/airports2.json",
			// data: {
			// 	name: $('#name').val(),
			// },
			minLength: 3,
			success: function(results){
				//console.log(request.term);
				//filter:
				var items = [];
				$.each(results, function (index, value) {
			        //console.log(value);
			        //if(value.type == "airport" && status == 1){ //1=open airport
			        	if(value.type == "Airports"
			        		&& (value.name).toLowerCase().indexOf(request.term.toLowerCase()) >= 0){
			        		items.push(value.name);
			        }    
			    });//end each
				
				console.log(items);

				//response(results);
				//response(items); //este tira mas o menos


				response( $.map( items, function( item ) {
					return {
						label: item.name,
						value: item.name
					}
				}));




			}//end of success



//parse json:
//http://www.dzone.com/snippets/useful-us-airportcity-codes

});//end of ajax call

	},


});//end of autocomplete








}); //end of file