$( document ).ready(function() {


	// $(function() {
	// 	$( "#dpWay, #dpReturn" ).datepicker({
	// 		changeMonth: true,
	// 		changeYear: true
	// 	});
	// });


var myTrip = new trip();




$('#radioReturn').click(function() {

	$('#dpReturn').show().datepicker({
		changeMonth: true,
		changeYear: true,
		onSelect: function(){ 
			var dateObject = $(this).datepicker('getDate');
			//myTrip.setBegin($('#dpReturn').val());
			//console.log($('#dpReturn').datepicker('getDate'));
			var d = dateObject.getDate();
			console.log(d);        
		}

	});


	$('#dpWay').show().datepicker({
		changeMonth: true,
		changeYear: true
	});
});



$('#radioOne').click(function() {

	$('#dpReturn').hide();
	$('#dpWay').show().datepicker({
		changeMonth: true,
		changeYear: true
	});




});


});