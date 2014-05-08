$(document).ready(function() {


//	var inputText = $('input').text();
//	alert(inputText);

	function setListeners() {

		var inputText = '';
		$('#new-todo').keyup(function(event) {
			inputText = $(this).val();
			console.log(inputText);
			if(event.which === 13) {
				alert(inputText);
			}
		});
	};

	setListeners();
});