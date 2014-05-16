$(document).ready(function() {
	//globals
	var itemCounter = 0;
	var checkedCounter = 0;
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
			} else if(e.keyCode === ESC_KEY) {
				console.log('ESC');
			}
		},
		// put entry into HTML page
		addEntry: function(entry, id, status) {
				$('.newInput li').clone().appendTo('#todo-list');
				$('#todo-list li:last-child label').text(entry);
				$('#todo-list li:last-child').attr('data-id',id);
				if(status) {
					$('#todo-list li:last-child').addClass('completed');
					$('#todo-list li:last-child .toggle').attr('checked', true);
					checkedCounter++;
				}
				$('#new-todo').val('');
				footerUpdate.completedUpdate(++itemCounter, checkedCounter);
				$('#footer').show();
		},
		// save entry into local storage
		saveInput: function(inputText) {
			var getID = todoFunc.uuid();
			var status = false;
			var todoInput = {
				'id' : getID,
				'name' : inputText,
				'completed' : status
			}
			inputStorage.push(todoInput);
			// Re-serialize the array back into a string and store it in localStorage
			localStorage.setItem('todos', JSON.stringify(inputStorage));
			this.addEntry(inputText, getID, status);
			todoListners.addListItemListener(getID);
		},
		// reload entries from storage
		populateStorage: function() {
			if(localStorage && localStorage.length >0) {
				inputStorage = JSON.parse(localStorage.getItem("todos"));
				for(var key=0 ; key < inputStorage.length ; key++) {
					this.addEntry(inputStorage[key].name, inputStorage[key].id, inputStorage[key].completed);
					todoListners.addListItemListener(inputStorage[key].id);
				}
			} else {
				$('#footer').hide();
			}
		},

		updateStatus: function(id, status) {
			for(var i=0 ; i<inputStorage.length ; i++) {
				if(inputStorage[i].id == id) {
					inputStorage[i].completed = status;
				}
				localStorage.setItem('todos', JSON.stringify(inputStorage));
			}
		},

		deleteItem: function(id) {
			for(var i=0 ; i<inputStorage.length ; i++) {
				if(inputStorage[i].id == id) {
					inputStorage.splice(i,1);
					localStorage.setItem('todos', JSON.stringify(inputStorage));
				}
			}
		}
	};

	var footerUpdate = {
		completedUpdate: function(count, chkcount) {
			$('#todo-count .todoCount').text(count);
			$('#clear-completed').text('Clear Completed (' + chkcount + ')');
			if( chkcount>0 ) {
				$('#clear-completed').css({'display':'block'});
			} else {
				$('#clear-completed').css({'display':'none'});
			}
		}

	};

	var todoListners = {
		mainInput: function() {
			$('#new-todo').keyup(function(e) {
				todoFunc.keyPressed(e);
			});

		},
		//add listener to list item based on its id
		//to take care of double click editing, single click check, and x delete click
		addListItemListener: function(id) {
			//double click
			$("li[data-id *= '" + id + "']").on('dblclick', 'label', function(event) {
				console.log('dblclick listener');
			});
			//check click
			$("li[data-id *= '" + id + "']").on('click','.toggle', function(e) {
				if(e.target.nodeName == "INPUT") {
					console.log('singleclick listner');
					var item = $(this).closest('li');
					var compStatus;
					if(item.hasClass('completed')) {
						compStatus = false;
						itemCounter++;
						checkedCounter--;
					} else {
						compStatus = true;
						itemCounter--;
						checkedCounter++;
					}
					todoFunc.updateStatus(id, compStatus);
					footerUpdate.completedUpdate(itemCounter, checkedCounter);
					item.toggleClass('completed');
				}
			});
			//x delete click
			$("li[data-id *= '" + id + "']").on('click','.destroy', function(e) {
				var item = $(this).closest('li');
				//itemCounter--;
				if(item.hasClass('completed')) {
					checkedCounter--;
				} else {
					itemCounter--;
				}
				//get the clicked id
				var id = item.attr('data-id');
				$("li[data-id *= '" + id + "']").off();
				item.remove();
				footerUpdate.completedUpdate(itemCounter, checkedCounter);
				todoFunc.deleteItem(id);	//remove item from local storage
			});
		}

	};

	todoFunc.populateStorage();
	todoListners.mainInput();
//	todoListners.oneClick();
//	todoListners.xClick();
//	todoListners.doubleClick();

/*		doubleClick: function() {
			var liDbl = $('#todo-list label');
			console.log("double click");
			liDbl.on('dblclick', 'li', function() {
				$("<input type='text'>").appendTo(this).focus();
			});
//			alert($(this).closest('li').text(liDbl));
	//		liDbl.dblclick(function(e) {
//				alert($(this).closest('li').text(liDbl));
	//			alert(e.target.textContent);
	//			e.toggleClass();

	//		});

		},

		xClick: function() {
			var tmp = $('#todo-list li button'); 
			tmp.click(function(e) {
				alert(e.target.nodeName);
				alert($(this).closest('li'));
//				$(this).closest('li').removeClass();
//			})

		},

		mouseHvr: function() {
		},

		oneClick: function() {
			$('#todo-list li .toggle').click(function() {
				$(this).closest('li').toggleClass('completed');
			})
		},*/

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