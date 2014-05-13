$(document).ready(function() {
	//globals
	var itemCounter = 0;
	var CR_KEY = 13;
	var ESC_KEY = 27;
	var inputStorage = [];	//array of objects for storage

	var todoFunc = {
		uuid: function () { 
			/*jshint bitwise:false */
			var i, random;
			var uuid = '';

			for (i = 0; i < 32; i++) {
				random = Math.random() * 16 | 0;
				if (i === 8 || i === 12 || i === 16 || i === 20) {
					uuid += '-';
				}
				uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
				}
			return uuid;
		},

		keyPressed: function(e) {
			if(e.keyCode === CR_KEY) {
				var entry = $('#new-todo').val();
				this.saveInput(entry);	// save entry into local storage
				this.addEntry(entry); // put entry into HTML page
			} else if(e.keyCode === ESC_KEY) {
				console.log('ESC');
			}
		},

		addEntry: function(entry) {
				$('.newInput li').clone().appendTo('#todo-list');
				$('#todo-list li:last-child label').text(entry);
				$('#new-todo').val('');
				$('#todo-count .todoCount').text(++itemCounter);
		},

		saveInput: function(inputText) {
			var getID = todoFunc.uuid();
			var todoInput = {
				'id' : getID,
				'name' : inputText
			}
			inputStorage.push(todoInput);
			// Re-serialize the array back into a string and store it in localStorage
			localStorage.setItem('todos', JSON.stringify(inputStorage));
		},

		populateStorage: function() {
			if(localStorage && localStorage.length >0) {
//				var ts = localStorage.getItem("todos");
				inputStorage = JSON.parse(localStorage.getItem("todos"));
				for(var key=0 ; key < inputStorage.length ; key++) {
//					console.log(localStorage.key(key));
					this.addEntry(inputStorage[key].name);
				}
			}
		}

	};

	var todoListners = {
		mainInput: function() {
			$('#new-todo').keyup(function(e) {
				todoFunc.keyPressed(e);
			});

		},

		dblClick: function() {

		},

		chkMrk: function() {

		}

	};

	todoFunc.populateStorage();
	todoListners.mainInput();

/*	function setListeners() {
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

	setListeners();*/
});