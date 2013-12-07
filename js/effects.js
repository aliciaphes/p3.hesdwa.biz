$( document ).ready(function() {

	function displayPassengerList(index){

		//clear list to regenerate
		$("#passengers").empty(); 

		//render passengers and add/remove button
		for(var i=0 ; i<myTrip.passengerList.length ; i++){

			$("#passengers")
			.append("<input type='text' maxlength='35' value=" + myTrip.getPassenger(i) +">")
			.append("<button class=' save btn'>Save</button>")
			.append("<button class=' rem btn-danger'>Delete</button><br/>");
		}
	}



	function showSummary(){

		//retrieve all the information we stored and show in the corresponding fields:
		var typeOfTrip = $("label[for='" + $("#step0 input[type='radio']:checked").attr('id') + "']").text();

		//Type of trip (one way/return)
		$("#tripType").val(typeOfTrip);

		//Dates:
		$("#depDate").val(myTrip.getDepartureDate());

		if(typeOfTrip == "Return trip"){
			$("#returningDate").val(myTrip.getReturningDate());
		}
		else{
			$('label[for="returningDate"]').hide();
			$("#returningDate").hide();
		}

		//Airport names:
		var what = "Don't you want to travel?";

		if(myTrip.getStep() == 2){
			if($("#origin").val() == '') $("#origin").val(what);
			if($("#destination").val() == '') $("#destination").val(what);
		}
		$("#from").val($("#origin").val());
		$("#to").val($("#destination").val());

		//list of passengers:
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

		//this can be enhanced, it's kind of ugly
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
					&& $('#retError').html() == ''//&& $('#specificError').html() == ''
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

	});





	//Actions to perform when clicking on 'Return trip'
	$('#radioReturn').click(function() {

		$('.specificError').empty();
		$(".errors").addClass("hidden");

		$('#dpReturn')
		.show()
		.removeAttr('disabled')
		.datepicker({
			changeMonth: true,
			changeYear: true,
			dateFormat: "yy-mm-dd",
			onSelect: function(){ 
				var dateObject = $(this).datepicker('getDate');

				myTrip.setDepartureDate(dateObject);
			}

		});


		$('#dpOneWay')
		.show()
		.datepicker({
			changeMonth: true,
			changeYear: true,
			dateFormat: "yy-mm-dd"
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

		$('#dpOneWay').show().datepicker({
			changeMonth: true,
			changeYear: true
		});
	});






	//Actions to perform when clicking on 'Save'
	$(document).on('click', '.save', function() {

		var prevElement = $(this).prev();

		if($(this).text() == 'Save'){
			
			var newVal = prevElement.val();
			if(newVal == '') alert('Please provide valid information');
			else{
				myTrip.passengerList.push(newVal);

				prevElement.prop("disabled", true);
				$(this).text('Edit');
			}
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

			//remove from list
			myTrip.passengerList.splice(rowIndex, 1);

			displayPassengerList(myTrip.getStep());
		}


	});






	//Actions to perform when clicking on 'Add passenger'	
	$(document).on('click', '.add', function() {	

		$('.specificError').empty();
		$(".errors").addClass("hidden");

	//before adding a new passenger entry data, we store the entered value

		var name = $("#passengers input:last").val();

		$("#passengers")
		.append("<input type='text' placeholder='Enter first & last name and save' size='50' maxlength='50'>")
		.append("<button class='btn save'>Save</button>")
		.append("<button class='btn-danger rem'>Delete</button><br/>");

	});



	//use of AJAX for an autocompleter for the airport list using an external file in JSON
	$('.airport').autocomplete({

		source: function(request, response) {

			$.ajax({
				dataType: "JSON",
				url: "data/airports.json",
				minLength: 3,
				success: function(results){
					var items = [];
					$.each(results, function (index, value) {
				        	if(value.type == "Airports"
				        		&& (value.name).toLowerCase().indexOf(request.term.toLowerCase()) >= 0){
				        		items.push(value.name);
				        }    
				    });//end each
					
					response(items);

				}//end of success

			});//end of ajax call

		},


	});//end of autocomplete



showStep(myTrip.getStep()); //first call to initialize


}); //end of file