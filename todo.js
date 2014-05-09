$(document).ready(function() {


//	var inputText = $('input').text();
//	alert(inputText);

	var func = {
		todoInput: function() {

		},

		todoDblClick: function() {

		},

		todoChkMrk: function() {

		}
	};



	function setListeners() {
		//keystroke listener
		var inputText = '';
		$('#new-todo').keyup(function(e) {
			inputText = $(this).val();
			console.log(inputText);
			if(e.which === 13) {
				$('#todo-list').append("<li></li>");
				$('#todo-list li').append("<div class=\"view\"></div>");
				$('#todo-list li .view').append("<input class=\"toggle\" type=\"checkbox\">");
				$('#todo-list li .view').append("<label></label>");
				$('#todo-list li .view label').text(inputText);
				$('#todo-list li .view').append("<button class=\"destroy\"></button>");
				$('#new-todo').val('');
			}
		});

		//double click listener
		var textWindow = $('#new-todo');
		textWindow.dblclick(function() {
			//will enable editing in exiting textWindow
			alert("doubleclick");
		})


		//checkmark click listener
		//completed all click
		//remove all completed
		//delete
		//hover
		//all/active/completed
	};

	setListeners();

});