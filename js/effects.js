$( document ).ready(function() {
	//var myTrip = new trip();

	function displayPassengerList(index){

		//switch(parseInt(index)){
			//case 1:

				//clear list to regenerate
				$("#passengers").empty(); 
				//$("#step" + index).find('div[id="passengers"]').empty();
				//$("#passengers").children().remove();
				//$("#passengers").html('');

				//render passengers and add/remove button
				for(var i=0 ; i<myTrip.passengerList.length ; i++){

					$("#passengers")
					.append("<input type='text' maxlength='35' value=" + myTrip.getPassenger(i) +">")
					.append("<button class=' save btn'>Save</button>")
					.append("<button class=' rem btn-danger'>Delete</button><br/>");
				}
				//break;
		//}
	}

	function showSummary(){


		var typeOfTrip = $("label[for='" + $("#step0 input[type='radio']:checked").attr('id') + "']").text();

		$("#tripType").val(typeOfTrip);


		$("#depDate").val(myTrip.getDepartureDate());

		if(typeOfTrip == "Return trip"){
			$("#returningDate").val(myTrip.getReturningDate());
		}
		else{
			$('label[for="returningDate"]').hide();
			$("#returningDate").hide();
		}

		$("#from").val($("#origin").val());
		$("#to").val($("#destination").val());


		console.log(myTrip.passengerList);

		$("#passList").empty(); //refresh list
		
		for(var i=0; i<myTrip.passengerList.length; i++){
			$("#passList").append("<label for='pass"+i+"'>Passenger "+(i+1)+":<input type='text' id='pass"+i+"' readonly></label>");
			$("#pass"+i).val(myTrip.getPassenger(i));

		}




	}	

	function showStep(index){

		//show current step and hide the rest:
		$("#step" + index).show();
		$(".errors").addClass("hidden");

		$("#step" + index + " .buttons")
		.empty() //clear button area and then insert:
		.append("<button id='prev"+index+"'>Prev</button>")
		.append("<button id='next"+index+"'>Next</button>");

		$("#step" + index + " button").addClass("btn");

		//find the header and give it the title
		$("#step" + index).find("header h3").html(myTrip.getTitle(index));

		var n = myTrip.stepTitles.length;
		for(var i=0; i < n; i++){
			if(i != index)
				$("#step"+i).hide();
			if(i == 0) //if first step, hide 'prev' button
				$("#prev"+i).hide();
			if(i == 1)
				displayPassengerList(index);
			if(i == n-1){ //if last step, hide 'next' button
				$("#next"+i).hide();
				showSummary();
			}
	}

};




//Actions to perform when clicking on 'Next'
$(document).on('click', 'button[id^="next"]', function() {
	//verify errors before anything else:

	var currentStep = myTrip.getStep();


	$('#retError').empty();
	$('#depError').empty();
	$('#specificError').empty();

	if(currentStep == 0){
		if($('#dpOneWay').is(':visible') || $('#dpReturn').is(':visible')){//if date fields are showing

			var checkedValue = $("#step" + currentStep + " input[type='radio']:checked").attr('id');

			//store values:
			myTrip.setDepartureDate($('#dpOneWay').datepicker('getDate'));
			myTrip.setReturningDate($('#dpReturn').datepicker('getDate'));

			//check departure date
			if(myTrip.getDepartureDate() == null){
				$(".errors").removeClass("hidden");
				$('#depError').html('<strong>Departure date cannot be empty</strong>');
				
			}

			//check returning date in case of a return trip
			if(checkedValue == 'radioReturn' && myTrip.getReturningDate() == null){
				$(".errors").removeClass("hidden");
				$('#retError').html('<strong>Returning date cannot be empty</strong>');
			}

			//determine if it's allowed to go to the next step:
			//empty message area means values are correct
			if( $('#depError').html() == ''
				&& $('#retError').html() == ''
			 //&& $('#specificError').html() == ''
			 ){

				//show error if departure > return (only in the case of a return trip)
			if(checkedValue == 'radioReturn'){
				if( !(myTrip.getDepartureDate() < myTrip.getReturningDate()) ){
					$(".errors").removeClass("hidden");
					$('.specificError').html("<strong>Returning date cannot be before or on departure date</strong>");

				}
				else{
					myTrip.nextStep();
					showStep(myTrip.getStep());
				}					
			}
			else{
				myTrip.nextStep();
				showStep(myTrip.getStep());
					//console.log(passengerList);	
				}

			}//if error area is clean
		}//if date fields are showing
		else{
			$(".errors").removeClass("hidden")
			$('.specificError').html("<strong>Please make a selection</strong>");	
		}
	}	



	if(currentStep == 1){

		if(myTrip.passengerList.length == 0){
			$(".errors").removeClass("hidden")
			$('.specificError').html("<strong>Please make a selection</strong>");
		}
		else{
			myTrip.nextStep();
			showStep(myTrip.getStep());			
		}
	}
});






//Actions to perform when clicking on 'Prev'
$(document).on('click', 'button[id^="prev"]', function() {

	myTrip.prevStep();
	showStep(myTrip.getStep());

	//console.log(passengerList);

});





//Actions to perform when clicking on 'Return trip'
$('#radioReturn').click(function() {

	$('.specificError').empty();
	$(".errors").addClass("hidden");

	$('#dpReturn')
	//.val('')
	.show()
	.removeAttr('disabled')
	.datepicker({
		changeMonth: true,
		changeYear: true,
		onSelect: function(){ 
			var dateObject = $(this).datepicker('getDate');

			myTrip.setDepartureDate(dateObject);
			//var d = myTrip.getDepartureDate().getDate();
			//console.log(d);
		}

	});


	$('#dpOneWay')
	//.val('')
	.show()
	.datepicker({
		changeMonth: true,
		changeYear: true
	});
});







//Actions to perform when clicking on 'One way'
$('#radioOne').click(function() {

	$('.specificError').empty();
	$(".errors").addClass("hidden");

	$('#dpReturn')
			.val('') //.hide()
			.prop("disabled", true) //disable editing
			.attr('placeholder','No returning date');

			$('#dpOneWay')
		//.val('')
		.show().datepicker({
			changeMonth: true,
			changeYear: true
		});
	});







$(document).on('click', '.save', function() {

	var prevElement = $(this).prev();

	if($(this).text() == 'Save'){
		
		var newVal = prevElement.val();

		myTrip.passengerList.push(newVal);

		//console.log(myTrip.passengerList);
		
		prevElement.prop("disabled", true);
		$(this).text('Edit');

	}
	else{
		prevElement.removeAttr('disabled');
		$(this).text('Save');	
	}


});






$(document).on('click', '.rem', function() {

	if (confirm("Are you sure you want to delete this element?")){

		//retrieve row number of clicked element
		var rowIndex = $(this).prevAll("input:first").index();
		rowIndex /= 4;
		//console.log(rowIndex);

		//remove from list
		myTrip.passengerList.splice(rowIndex, 1);
		//console.log(myTrip.passengerList);

		displayPassengerList(myTrip.getStep());

//hide element
}


});






//Actions to perform when clicking on 'Add passenger'	
$(document).on('click', '.add', function() {	

	$('.specificError').empty();
	$(".errors").addClass("hidden");

//before adding a new passenger entry data, we store the entered value

var name = $("#passengers input:last").val();
	//console.log(name);
	//console.log("adding "+name);

	$("#passengers")
	.append("<input type='text' placeholder='First and last name' maxlength='35'>")
	.append("<button class='btn save'>Save</button>")
	.append("<button class='btn-danger rem'>Delete</button><br/>");

	//console.log(myTrip.passengerList);

});




$('.airport').autocomplete({

	source: function(request, response) {

		$.ajax({
			dataType: "JSON",
			url: "data/airports2.json",
			minLength: 3,
			success: function(results){
				//filter:
				var items = [];
				$.each(results, function (index, value) {
			        //if(value.type == "airport" && status == 1){ //1=open airport
			        	if(value.type == "Airports"
			        		&& (value.name).toLowerCase().indexOf(request.term.toLowerCase()) >= 0){
			        		items.push(value.name);
			        }    
			    });//end each
				
				//console.log(items);

				//response(results);
				response(items); //este tira mas o menos


				// response( $.map( items, function( item ) {
				// 	return {
				// 		label: item.name,
				// 		value: item.name
				// 	}
				// }));




			}//end of success



//parse json:
//http://www.dzone.com/snippets/useful-us-airportcity-codes

});//end of ajax call

	},


});//end of autocomplete






showStep(myTrip.getStep()); //first call to initialize

}); //end of file