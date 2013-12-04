$( document ).ready(function() {

	var myTrip = new trip();


	var initialize = function(){

	};

//Actions to perform when clicking on 'Return trip'
$('#radioReturn').click(function() {

	$('#dpReturn').val('').show().removeAttr('disabled').datepicker({
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

		$('#dpReturn').val('').prop("disabled", true); //disable editing
		$('#dpOneWay').val('').show().datepicker({
			changeMonth: true,
			changeYear: true
		});
	});



//Actions to perform when clicking on 'Next'
$('#next').click(function() {

	console.log(myTrip.getStep());
});



$('#name').autocomplete({

	source: function( request, response ) {

		$.ajax({
			dataType: "JSON",
			url: "data/airports2.json",
			// data: {
			// 	name: $('#name').val(),
			// },
			minLength: 3,
			success: function(response){
				console.log(request.term);
				//filter:
				var items = [];
				$.each(response, function (index, value) {
			        //console.log(value);
			        //if(value.type == "airport" && status == 1){ //1=open airport
			        	if(value.type == "Airports"
			        		&& (value.name).toLowerCase().indexOf(request.term.toLowerCase()) >= 0){
			        		items.push(value.name);
			        }    
			    });//end each
				console.log(items);

response(response);

		// var results = $.map(items, function(item){
		// return { 
		// 	value: item.value, id: item.id }
		// });




			//return items;

			}//end of success



//parse json:
//http://www.dzone.com/snippets/useful-us-airportcity-codes

});//end of ajax call

	},


});//end of autocomplete








}); //end of file