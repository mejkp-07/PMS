/*alert("testing.....")*/
function selectDate(date) {
    document.getElementById('selectedDate').value = date;
  }
function selectDateNumber(number) {
	// Set the selected number in the hidden input
	document.getElementById('selectedDateNumber').value = number;
	
	// Submit the form
	document.querySelector('.calendarForm').submit();
	}

  document.getElementsByClassName("monthList")[0].addEventListener("change", function() {
      document.getElementsByClassName("calendarForm")[0].submit();
  });

  document.getElementsByClassName("yearList")[0].addEventListener("change", function() {
      document.getElementsByClassName("calendarForm")[0].submit();
  });
  
  
  $(document).ready(function() {
      $('.validateWeekEffort').mask('99:99');
  });
  
  function checkWeekEffort(input) {
      var inputVal = $(input).val();
      
      var time = inputVal.split(':').map(Number);
      var hours = time[0];
      var minutes = time[1];

      if (hours > 167 || minutes > 59 || hours < 0 || minutes < 0) {
          swal('Invalid input minutes must be between 0 and 59.');
          $(input).val(''); // Clear the input value
      } else {
          // Valid input, you can proceed with further processing
          console.log('Valid input:', hours, 'hours', minutes, 'minutes');
      }
  }
  
  
  
  /*function checkWeekEffort(input) {
	  
	var enteredValue = input.value.trim();
	// Check if the entered value is a valid integer
    if (/^\d+$/.test(enteredValue)) {
        var intValue = parseInt(enteredValue, 10);

        // Check if the entered value is within the allowed range
        if (intValue > 168) {
            swal("Effort cannot be greater than 168 hours.");
            input.value = ''; // Clear the input value
        }
    } else {
        swal("Please enter valid time.");
        input.value = ''; // Clear the input value
    }
  }*/
  
  
  /*function checkWeekEffort(input) {
	    var enteredValue = input.value.trim();

	    // Check if the entered value is a valid number (integer or decimal)
	    if (/^\d+(\.\d+)?$/.test(enteredValue)) {
	        var floatValue = parseFloat(enteredValue);

	        // Check if the entered value is within the allowed range
	        if (floatValue > 168) {
	            swal("Effort cannot be greater than 168 hours.");
	            input.value = ''; // Clear the input value
	        }
	    } else {
	        swal("Please enter valid time.");
	        input.value = ''; // Clear the input value
	    }
	}*/

  
  
  document.getElementById("timesheetForm").addEventListener("submit", function (event) {
	  
	  
	//event.preventDefault(); // Prevent default form submission
	var weekEffortInputs = document.getElementsByClassName("validateWeekEffort");
  	var weekEffort = [];
  	for (var i = 0; i < weekEffortInputs.length; i++) {
          var value = weekEffortInputs[i].value.trim();
          weekEffort.push(value);
      }
  	//console.log(weekEffort);
  	
  	var weekNumbersInputs = document.getElementById("validateWeekNumber").value;
  	var weekNumbers= JSON.parse(weekNumbersInputs);
  	//console.log(weekNumbers);
  	
  	
    //console.log(weekNumberSubmitted);

    //let centerWeekSelected = weekNumbers[2];

    let interval = weekNumbers.length;
    //let startingIndex = Math.ceil(interval / 2) - (centerWeekSelected - weekNumberSubmitted) - 1;

    var separateWeekEffort = [];

    for (var startIndex = 0; startIndex < interval; startIndex++) {
        var innerList = [];

        for (var i = startIndex; i < weekEffort.length; i += interval) {
            innerList.push(weekEffort[i]);
        }

        separateWeekEffort.push(innerList);
    }
    event.preventDefault();
    var success = true
    //console.log(separateWeekEffort);
    for(var p =0; p<separateWeekEffort.length; p++){
      var validateSum = 0;
      // Calculate the sum
      for (var i = 0; i < separateWeekEffort[p].length; i++) {
          if (separateWeekEffort[p][i].trim() !== "") {
        	var timeParts = separateWeekEffort[p][i].split(":");
        	    
    	    // Parse hours and minutes
    	    var hours = parseInt(timeParts[0], 10);
    	    var minutes = parseInt(timeParts[1], 10);

    	    // Calculate total minutes
    	    var totalMinutes = hours * 60 + minutes;
          	validateSum += totalMinutes;
          }
      }
      console.log("valid sum "+validateSum);
      // Check if the sum is greater than 168
      if (validateSum > 10080) {
    	// Display an alert
          swal("Total effort cannot be greater than 168 hours in week " +weekNumbers[p])
              .then(function () {
                  // Code to execute after the alert is closed
            	  event.preventDefault();
                  console.log("Alert closed");
              });
          
          success = false;
          break;
      }
    }
    if(success == true){
    	// Submit the form if the sum is within the allowed range
    	swal("Data has been saved successfully").then(function(isConfirm) {

            if (isConfirm) {

            	document.getElementById("timesheetForm").submit();       

            }

          });;
    	event.preventDefault();
    	         
    }
    
  });
  
  //DYNAMIC CHANGING VALUE CODE
  
  //Add an event listener for input changes within the table
  $('#timesheetTable').on('blur', 'input.dynamicWeekEffort', function() {
      // Get the current row
      var currentRow = $(this).closest('tr');

      // Find all input elements in the current row with class 'validateWeekEffort'
      var weekEffortInputs = currentRow.find('input.dynamicWeekEffort');
	  //console.log(weekEffortInputs.val());
      // Initialize sum for the current row
      var rowSum = 0;

      // Loop through each input and calculate the sum
      weekEffortInputs.each(function() {
          var inputValue = $(this).val().trim();
       // Regular expression to match the format of two digits before colon and two digits after colon
          var validFormatRegex = /^\d{2}:\d{2}$/;

          if (validFormatRegex.test(inputValue)) {
              var timeParts = inputValue.split(":");
              var hours = parseInt(timeParts[0], 10);
              var minutes = parseInt(timeParts[1], 10);
              var totalMinutes = hours * 60 + minutes;
              rowSum += totalMinutes;
          } else {
              // If the format is not valid, treat it as 0
              rowSum += 0;
          }
      });
   		// Convert rowSum to HH:MM format
      var hoursSum = Math.floor(rowSum / 60);
      var minutesSum = rowSum % 60;
      // Use a conditional statement to decide the formatting
      var hoursPart = hoursSum > 99 ? ('000' + hoursSum).slice(-3) : ('0' + hoursSum).slice(-2);
      var formattedSum = hoursPart + ':' + ('0' + minutesSum).slice(-2);

      // Update the Total Project Effort cell in the current row with formatted sum
      currentRow.find('.dynamicTotalProjectEffort').text(formattedSum);

 
  });
  
//Add an event listener for input changes within the table
  $('#timesheetTable').on('blur', 'input.dynamicWeekEffort', function() {
      // Get the current column index
      var currentColumnIndex = $(this).closest('td').index();

      // Find all input elements in the column with class 'dynamicWeekEffort'
      var weekEffortInputs = $('input.dynamicWeekEffort').filter(function() {
          return $(this).closest('td').index() === currentColumnIndex;
      });

      // Initialize sum for the current column
      var columnSum = 0;

      // Loop through each input in the column and calculate the sum
      weekEffortInputs.each(function() {
          var inputValue = $(this).val().trim();

          // Regular expression to match the format of two digits before colon and two digits after colon
          var validFormatRegex = /^\d{2}:\d{2}$/;
          // Check if the project name is "vacation"
          var projectName = $(this).closest('tr').find('td:first-child').text().trim().toLowerCase();
          if (projectName !== "vacation" && validFormatRegex.test(inputValue)) {
              var timeParts = inputValue.split(":");
              var hours = parseInt(timeParts[0], 10);
              var minutes = parseInt(timeParts[1], 10);
              var totalMinutes = hours * 60 + minutes;
              columnSum += totalMinutes;
          } else {
              // If the format is not valid, treat it as 0
              columnSum += 0;
          }
      });

      // Convert columnSum to HH:MM format
      var hoursSum = Math.floor(columnSum / 60);
      var minutesSum = columnSum % 60;
      // Use a conditional statement to decide the formatting
      var hoursPart = hoursSum > 99 ? ('000' + hoursSum).slice(-3) : ('0' + hoursSum).slice(-2);
      var formattedSum = hoursPart + ':' + ('0' + minutesSum).slice(-2);

      // Update the Total Week Effort cell in the table footer for the current column
      $('#timesheetTable tfoot .dynamicTotalWeekEffort').eq(currentColumnIndex -1 ).text(formattedSum);
  });