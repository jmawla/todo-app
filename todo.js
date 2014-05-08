$(document).ready(function() {


//	var inputText = $('input').text();
//	alert(inputText);

	function setListeners() {
		//keystroke listener
		var inputText = '';
		$('#new-todo').keyup(function(event) {
			inputText = $(this).val();
			console.log(inputText);
			if(event.which === 13) {
				alert(inputText);
			}
		});

		//double click listener
		var textWindow = $('#new-todo');
		textWindow.dblclick(function() {
			//will enable editing in exiting textWindow
			alert("doubleclick");
		})


	};

	setListeners();
});