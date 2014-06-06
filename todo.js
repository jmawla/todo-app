$(document).ready(function() {
	//globals
	var bool = true;
	var itemCounter = 0;
	var checkedCounter = 0;
	var CR_KEY = 13;
	var ESC_KEY = 27;
	var inputStorage = new Array;	//array of objects for storage
	localStorage.setItem('todos', JSON.stringify(inputStorage));

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
				todoFunc.saveInput(entry);	// save entry into local storage
			} else if(e.keyCode === ESC_KEY) {
				console.log('ESC');
			}
		},
		keyEditPressed: function(e, id, thisVar) {
			if(e.keyCode === CR_KEY) {
				todoFunc.updateEntry(id, thisVar);
			} else if(e.keyCode === ESC_KEY) {
				todoFunc.abortEditing();
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
			} else {
				$('#todo-list li:last-child').removeClass('completed');
				$('#todo-list li:last-child .toggle').attr('checked', false);
				itemCounter++;
				$('#new-todo').val('');
			}
			footerUpdate.completedUpdate(itemCounter, checkedCounter);
			$('#footer').show();
		},
		// update entry into HTML page
		updateEntry: function(id, thisVar) {
			var item = $(this).closest('li input');
			for( i=0 ; i<inputStorage.length ; i++) {
				if(inputStorage[i].id === id) {
					inputStorage[i].name = $('.editing .edit').val();
				}
			}
			localStorage.setItem('todos', JSON.stringify(inputStorage));
			$('.editing label').text($('.editing .edit').val());
			$('.editing').removeClass('editing').find('.edit').val();
			thisVar.closest('li input').removeClass('edit');
			thisVar.closest('li input').remove();
		},
		// abort entry editing
		abortEditing: function() {

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
			todoFunc.addEntry(inputText, getID, status);
			todoListners.addListItemListener(getID);
		},
		// reload entries from storage
		populateStorage: function() {
			inputStorage = JSON.parse(localStorage.getItem("todos"));
			if(inputStorage.length > 0) {
				for(var key=0 ; key<inputStorage.length ; key++) {
					todoFunc.addEntry(inputStorage[key].name, inputStorage[key].id, inputStorage[key].completed);
					todoListners.addListItemListener(inputStorage[key].id);
				}
			} else {
				$('#footer').hide();
			}
/*			if(localStorage && localStorage.length >0) {
				inputStorage = JSON.parse(localStorage.getItem("todos"));
				for(var key=0 ; key < inputStorage.length ; key++) {
					todoFunc.addEntry(inputStorage[key].name, inputStorage[key].id, inputStorage[key].completed);
					todoListners.addListItemListener(inputStorage[key].id);
				}
			} else {
				$('#footer').hide();
			}*/
		},

		updateStatus: function(id, status) {
			for(var i=0 ; i<inputStorage.length ; i++) {
				if(inputStorage[i].id == id) {
					inputStorage[i].completed = status;
				}
				localStorage.setItem('todos', JSON.stringify(inputStorage));
			}
		},

		updateAllStatus: function(status) {
			for(var i=0 ; i<inputStorage.length ; i++) {
				inputStorage[i].completed = status;
			}
			$('#todo-list li .toggle').prop('checked', status);

		},

		deleteItem: function(id) {
			for(var i=0 ; i<inputStorage.length ; i++) {
				if(inputStorage[i].id == id) {
					inputStorage.splice(i,1);
					localStorage.setItem('todos', JSON.stringify(inputStorage));
				}
			}
		},

		checkAll: function() {
//			alert('cheveron clicked');
			if(bool) {
				$('li').attr('class', 'completed');
//				$('li').toggleClass('completed');
				checkedCounter = itemCounter + checkedCounter;
				itemCounter = 0;
				todoFunc.updateAllStatus(true);
			} else {
				$('li').attr('class', '');
				itemCounter = itemCounter + checkedCounter;
				checkedCounter = 0;
				todoFunc.updateAllStatus(false);
			}
			bool = !bool;
			footerUpdate.completedUpdate(itemCounter, checkedCounter);

//			for(var i=0 ; i<inputStorage.length ; i++) {
//				$('li').attr('class', 'completed');
//			}
		}
	};

	var footerUpdate = {
		completedUpdate: function(count, chkcount) {
			$('#todo-count .todoCount').text(count);
			$('#clear-completed').text('Clear Completed (' + chkcount + ')');
			if( chkcount==0 && count==0) {
				$('#clear-completed').css({'display':'none'});
				$('#footer').hide();
			} else {
				$('#clear-completed').css({'display':'block'});
			}
		}

	};

	var todoListners = {
		//add listener for main input to add text
		mainInputListener: function() {
			$('#new-todo').keyup(function(e) {
				todoFunc.keyPressed(e);
			});
		},
		//add listener to cheveron symbol if clicked all tasks will be checked
		markAllListener: function() {
			$('#toggle-all').click(function() {
				todoFunc.checkAll();
			});
		},
		//add listener to list item based on its id
		//to take care of double click editing, single click check, and x delete click
		addListItemListener: function(id) {
			//double click
			$("li[data-id *= '" + id + "']").on('dblclick', 'label', function(event) {
				console.log('dblclick listener');
				var item = $(this).closest('li');
				if(!item.hasClass('completed')) {
					item.append('<input type=\"text\" name=\"todoEditor\" id=\" \" class=\"edit\">');
					item.addClass('editing').find('.edit').val($(this).text()).focus();
					$('.editing .edit').on('keyup', function(e) {
						//pass $(this) handler to allow keyEditPressed() to remove <input tag
						todoFunc.keyEditPressed(e, id, $(this));	
					});
				}
			});
			//check click
			$("li[data-id *= '" + id + "']").on('click','.toggle', function(e) {
				if(e.target.nodeName == "INPUT") {
//					console.log('singleclick listner');
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
		},
		addEditorListener: function() {
			alert('addEditorListener');

		}

	};

	todoFunc.populateStorage();
	todoListners.mainInputListener();
	todoListners.markAllListener();
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