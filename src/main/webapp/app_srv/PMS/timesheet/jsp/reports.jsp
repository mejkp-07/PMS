<%@page import="java.util.HashMap"%>
<%@page import="java.util.Map"%>
<%@page import="java.time.temporal.WeekFields"%>
<%@page import="java.util.List"%>
<%@page import="java.util.ArrayList"%>
<%@page import="java.time.DayOfWeek"%>
<%@page import="java.time.LocalDate"%>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@page isELIgnored="false" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
<!--   <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
  <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css"> -->
  <!-- Select2 CSS files for Searching -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/css/select2.min.css" rel="stylesheet" />
  <!-- Custom CSS files -->
  <link rel="stylesheet" href="<c:url value="/resources/app_srv/PMS/timesheet/css/styleReport.css"></c:url>">
  <title>Timesheet</title>
</head>
<body>

	
	<section id="main-content" class="main-content merge-left">
		<div class=" container wrapper1">
			<div>
				<header style="display: flex; justify-content:center">
					<h1 class="timesheetTitle" style="text-shadow: 2px 0px 2px #1e2787; padding-bottom: 20px;">
					<span style="color: #173faa;">R</span><span style="color: #1578c2">eports</span>
					</h1>
				</header>
		  	</div>
		</div>
		<div style="background-color: #e6faff"; class="container"><h3 style="padding:13px;">User Wise</h3></div>
		<div class="container">
		<div class="chart-container">
		<!-- R1 - Finding Employee details under GC -->
		<form id="myForm" class="calendarForm" action="employeeSelectReport" method="post">
		<div class="form-group" style=" margin-top: 30px;">
			<label style="font-size: 18px;" for="selectedEmpIdName">Select Employee: </label>
			<select class="select2" name="selectedEmpIdName" onchange="submitEmployeeSelectForm()" style="width: 200px;">
				
				<c:choose>
				    <c:when test="${empty selectedEmpName}">
				        <option value="">Select Employee</option>
				    </c:when>
				    <c:otherwise>
				        <option>${selectedEmpName}</option>
				    </c:otherwise>
				 </c:choose>
			    <c:forEach var="index" begin="0" end="${fn:length(EmpNames) - 1 }">
			    	<%-- <input type="hidden" name= "selectedEmpName" value="${EmpNames[index] }"/> --%>
			        <option value="${EmpIds[index]}+${EmpNames[index] }">${EmpNames[index]}</option>
			    </c:forEach>
			</select>
		</div>
		</form>
		<c:choose>
			<c:when test="${empty selectedEmpName}">
				<div class="text-center"><img src="<c:url value="/resources/app_srv/PMS/timesheet/image/SelectEmp.png"></c:url>"></div>
			</c:when>
			<c:otherwise>
				<!-- R5	-	LOGGED IN USER PROJECT-MONTH WISE REPORT -->
				<div class="row">
					<!-- <div class="chart-heading">Logged In User Project Wise Report</div> -->
					<div class="col-md-12 chart"><canvas id="reportUserProjectMonthWiseEffortColumnChart"></canvas></div>
				</div>
				
				<!-- R2   -    LOGGED IN USER PROJECT WISE REPORT -->
		
				<input type="hidden" id="xValues2" name="xValues2" value="${xValues2}"></input>
				<input type="hidden" id="yValues2" name="yValues2" value="${yValues2 }"></input>
				
				<div class="row">
					<!-- <div class="chart-heading">Logged In User Month Wise Report</div> -->
					<div class="col-md-12 chart" ><canvas id="reportUserProjectWiseEffortColumnChart"></canvas></div>
					
				</div>
		
				<!-- R3 & R4   -    LOGGED IN USER MONTH WISE/ACTIVITY WISE REPORT -->
				<input type="hidden" id="xValues1" name="xValues1" value="${xValues1 }"></input>
				<input type="hidden" id="yValues1" name="yValues1" value="${yValues1 }"></input>
				<input type="hidden" id="xValues3" name="xValues3" value="${xValues3}"></input>
				<input type="hidden" id="yValues3" name="yValues3" value="${yValues3 }"></input>
				<div class="row">
					<!-- <div class="chart-heading">Logged In User Project Wise Report</div> -->
					<div class="col-md-6 chart"><canvas id="reportUserMonthWiseEffortColoumnChart"></canvas></div>
					<div class="col-md-6 chart"><canvas id="reportUserActivityWiseEffortColumnChart"></canvas></div>
				</div>
				<input type="hidden" id="projectNamesByUserId" name="projectNamesByUserId" value="${projectNamesByUserId}"></input>
				<input type="hidden" id="everyProjectMonthWiseReport" name="everyProjectMonthWiseReport" value="${everyProjectMonthWiseReport }"></input>
				
				
				<%-- <div class="row">
					<!-- <div class="chart-heading">Logged In User Project Wise Report</div> -->
					<div class="col-md-12 chart"><canvas id="comboChart"></canvas></div>
				</div> --%>
				
				
			</c:otherwise>
		</c:choose>
		</div>
		</div>
		<div style="background-color: #e6faff"; class="container"><h3 style="padding:13px;">Group Wise</h3></div>
	</section>
	
	<!-- JS files for Charts -->
	<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
	<!-- JS files for Google Charts -->
	<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
	<!-- Select2 JS files for Searching -->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.min.js"></script>
	<!-- Custom JS files -->
	<script src="<c:url value="/resources/app_srv/PMS/timesheet/js/scriptReport.js"></c:url>"></script>
	<!-- Custom Internal JS -->
	<script type="text/javascript">
		// Function to generate random light color
		function getRandomColor() {
		    var minIntensity = 150; // Minimum intensity for RGB components
		    var color = "#";
	
		    for (var i = 0; i < 3; i++) {
		        // Generate a random value between minIntensity and 255
		        var intensity = Math.floor(Math.random() * (255 - minIntensity + 1) + minIntensity);
		        
		        // Convert intensity to hex and append to the color string
		        color += intensity.toString(16).padStart(2, '0');
		    }
	
		    return color;
		}
				
		//R2   -    LOGGED IN USER PROJECT WISE REPORT
		var xValuesString2 = decodeURIComponent(document.getElementById("xValues2").getAttribute("value"));
			// Remove square brackets and split the string by commas
		var elementsArray = xValuesString2.slice(1, -1).split(',');

			// Trim whitespaces from each element
		var xValues2 = elementsArray.map(function(element) {
		    return element.trim();
		});

		//var xValidJsonString2 = xValuesString2.replace(/&/g, '&amp;');
		//var xValidJsonString2 = xValuesString2.replace(/([a-zA-Z]+)/g, '"$1"');
		
			// Parse the modified string to get the array
		//var xValues2 = JSON.parse(xValuesString2);
		
		var yValuesString2 = document.getElementById("yValues2").getAttribute("value");
		var yValidJsonString2 = yValuesString2.replace(/([a-zA-Z]+)/g, '"$1"');
		
			// Parse the modified string to get the array
		var yValues2 = JSON.parse(yValidJsonString2);
		
		// Sample data
	    var labels = xValues2;
	    var dataInMinutes = yValues2;

	 	// Define custom colors for bars
	    var barColors = [
		    'rgba(75, 192, 192, 0.5)',
		    'rgba(255, 99, 132, 0.5)',
		    'rgba(255, 205, 86, 0.5)',
		    'rgba(54, 162, 235, 0.5)',
		    'rgba(255, 159, 64, 0.5)',
		    'rgba(153, 102, 255, 0.5)',
		    'rgba(255, 87, 34, 0.5)',
		    'rgba(219, 112, 147, 0.5)',
		    // Add more colors as needed
		];
	    // Create a bar chart
	    var ctx = document.getElementById('reportUserProjectWiseEffortColumnChart').getContext('2d');
	    var barChart = new Chart(ctx, {
	        type: 'bar',
	        data: {
	            labels: labels,
	            datasets: [{
	                label: 'Effort',
	                data: dataInMinutes,
	                backgroundColor: barColors,
	                borderColor: barColors,
	                borderWidth: 1,
	            }],
	        },
	        options: {
	            scales: {
	                y: {
	                    beginAtZero: true,
	                    ticks: {
	                        callback: function (value) {
	                            // Convert minutes to hours and minutes
	                            var hours = Math.floor(value / 60);
	                            var remainingMinutes = value % 60;
	                            return hours + 'h ' + remainingMinutes + 'm';
	                        }
	                    }
	                },
	            },
	            plugins: {
	                title: {
	                    display: true,
	                    text: 'User Wise Project Effort Report',
	                    font: {
	                        size: 18,
	                    },
	                },
	                legend: {
	                    display: true,
	                },
	                tooltip: {
	                    callbacks: {
	                        label: function (context) {
	                            var minutes = context.dataset.data[context.dataIndex];
	                            var hours = Math.floor(minutes / 60);
	                            var remainingMinutes = minutes % 60;
	                            return 'Effort: ' + hours + 'h ' + remainingMinutes + 'm';
	                        },
	                    },
	                },
	            },
	        },
	    });
		
		//R3   -    LOGGED IN USER MONTH WISE REPORT
		var xValuesString1 = document.getElementById("xValues1").getAttribute("value");
		var xValidJsonString1 = xValuesString1.replace(/([a-zA-Z]+)/g, '"$1"');
		
		// Parse the modified string to get the array
		var xValues1 = JSON.parse(xValidJsonString1);
		
		var yValuesString1 = document.getElementById("yValues1").getAttribute("value");
		var yValidJsonString1 = yValuesString1.replace(/([a-zA-Z]+)/g, '"$1"');
		
		// Parse the modified string to get the array
		var yValues1 = JSON.parse(yValidJsonString1);
		
		// Sample data
	    var labels = xValues1;
	    var dataInMinutes = yValues1;
		
	 	// Define custom colors for bars
	    var barColors = [
		    'rgba(75, 192, 192, 0.5)',
		    'rgba(255, 99, 132, 0.5)',
		    'rgba(255, 205, 86, 0.5)',
		    'rgba(54, 162, 235, 0.5)',
		    'rgba(255, 159, 64, 0.5)',
		    'rgba(153, 102, 255, 0.5)',
		    'rgba(255, 87, 34, 0.5)',
		    'rgba(219, 112, 147, 0.5)',
		    // Add more colors as needed
		];
	    // Create a bar chart
	    var ctx = document.getElementById('reportUserMonthWiseEffortColoumnChart').getContext('2d');
	    var barChart = new Chart(ctx, {
	        type: 'bar',
	        data: {
	            labels: labels,
	            datasets: [{
	                label: 'Effort',
	                data: dataInMinutes,
	                backgroundColor: barColors,
	                borderColor: barColors,
	                borderWidth: 1,
	            }],
	        },
	        options: {
	            scales: {
	                y: {
	                    beginAtZero: true,
	                    ticks: {
	                        callback: function (value) {
	                            // Convert minutes to hours and minutes
	                            var hours = Math.floor(value / 60);
	                            var remainingMinutes = value % 60;
	                            return hours + 'h ' + remainingMinutes + 'm';
	                        }
	                    }
	                },
	            },
	            plugins: {
	                title: {
	                    display: true,
	                    text: 'User Wise Month Effort Report',
	                    font: {
	                        size: 18,
	                    },
	                },
	                legend: {
	                    display: true,
	                },
	                tooltip: {
	                    callbacks: {
	                        label: function (context) {
	                            var minutes = context.dataset.data[context.dataIndex];
	                            var hours = Math.floor(minutes / 60);
	                            var remainingMinutes = minutes % 60;
	                            return 'Effort: ' + hours + 'h ' + remainingMinutes + 'm';
	                        },
	                    },
	                },
	            },
	        },
	    });
		
		//R4   -    LOGGED IN USER ACTIVITY WISE REPORT
		var xValuesString3 = decodeURIComponent(document.getElementById("xValues3").getAttribute("value"));
		// Remove square brackets and split the string by commas
		var elementsArray = xValuesString3.slice(1, -1).split(',');

		// Trim whitespaces from each element
		var xValues3 = elementsArray.map(function(element) {
		    return element.trim();
		});

		//var xValidJsonString2 = xValuesString2.replace(/&/g, '&amp;');
		//var xValidJsonString2 = xValuesString2.replace(/([a-zA-Z]+)/g, '"$1"');
		
		// Parse the modified string to get the array
		//var xValues2 = JSON.parse(xValuesString2);
		
		var yValuesString3 = document.getElementById("yValues3").getAttribute("value");
		var yValidJsonString3 = yValuesString3.replace(/([a-zA-Z]+)/g, '"$1"');
		
		// Parse the modified string to get the array
		var yValues3 = JSON.parse(yValidJsonString3);
		
		// Sample data
	    var labels = xValues3;
	    var dataInMinutes = yValues3;

	 	// Define custom colors for bars
	    var barColors = [
		    'rgba(75, 192, 192, 0.5)',
		    'rgba(255, 99, 132, 0.5)',
		    'rgba(255, 205, 86, 0.5)',
		    'rgba(54, 162, 235, 0.5)',
		    'rgba(255, 159, 64, 0.5)',
		    'rgba(153, 102, 255, 0.5)',
		    'rgba(255, 87, 34, 0.5)',
		    'rgba(219, 112, 147, 0.5)',
		    // Add more colors as needed
		];
	    // Create a bar chart
	    var ctx = document.getElementById('reportUserActivityWiseEffortColumnChart').getContext('2d');
	    var barChart = new Chart(ctx, {
	        type: 'bar',
	        data: {
	            labels: labels,
	            datasets: [{
	                label: 'Effort',
	                data: dataInMinutes,
	                backgroundColor: barColors,
	                borderColor: barColors,
	                borderWidth: 1,
	            }],
	        },
	        options: {
	            scales: {
	                y: {
	                    beginAtZero: true,
	                    ticks: {
	                        callback: function (value) {
	                            // Convert minutes to hours and minutes
	                            var hours = Math.floor(value / 60);
	                            var remainingMinutes = value % 60;
	                            return hours + 'h ' + remainingMinutes + 'm';
	                        }
	                    }
	                },
	            },
	            plugins: {
	                title: {
	                    display: true,
	                    text: 'User Wise Activity Effort Report',
	                    font: {
	                        size: 18,
	                    },
	                },
	                legend: {
	                    display: true,
	                },
	                tooltip: {
	                    callbacks: {
	                        label: function (context) {
	                            var minutes = context.dataset.data[context.dataIndex];
	                            var hours = Math.floor(minutes / 60);
	                            var remainingMinutes = minutes % 60;
	                            return 'Effort: ' + hours + 'h ' + remainingMinutes + 'm';
	                        },
	                    },
	                },
	            },
	        },
	    });
	    
	  	//R5	-	LOGGED IN USER PROJECT-MONTH WISE REPORT
	  	
	    var projectNamesByUserIdString = decodeURIComponent(document.getElementById("projectNamesByUserId").getAttribute("value"));
	 	// Remove square brackets and split the string by commas
		var elementsArray = projectNamesByUserIdString.slice(1, -1).split(',');

			// Trim whitespaces from each element
		var projectNamesByUserId = elementsArray.map(function(element) {
		    return element.trim();
		});
			
	    var everyProjectMonthWiseReport = JSON.parse(decodeURIComponent(document.getElementById("everyProjectMonthWiseReport").getAttribute("value")));
	    console.log(projectNamesByUserId);
	    console.log(everyProjectMonthWiseReport)
	    
	    //creating dataset
	    var datasets = [];
	    for(var i=0; i<projectNamesByUserId.length; i++){
	    	var singleProject = {
	    			label: projectNamesByUserId[i] + ' Effort',
                    type: 'bar',
                    data: everyProjectMonthWiseReport[i],
                    backgroundColor: getRandomColor(),
	    	}
	    	datasets.push(singleProject);
	    }
	    // Sample data
	    var months = ["January", "February", "March", "April", "May", "June",
	                  "July", "August", "September", "October", "November", "December"];

	    // Create a combo chart
	    var ctx = document.getElementById('reportUserProjectMonthWiseEffortColumnChart').getContext('2d');
	    var comboChart = new Chart(ctx, {
	        type: 'bar',
	        data: {
	            labels: months,
	            datasets: datasets,
	        },
	        options: {
	            scales: {
	                y: {
	                    beginAtZero: true,
	                    ticks: {
	                        callback: function (value) {
	                            // Convert minutes to hours and minutes
	                            var hours = Math.floor(value / 60);
	                            var remainingMinutes = value % 60;
	                            return hours + 'h ' + remainingMinutes + 'm';
	                        }
	                    }
	                },
	            },
	            plugins: {
	                title: {
	                    display: true,
	                    text: 'User Wise Project-Month Effort Report',
	                    font: {
	                        size: 18,
	                    },
	                },
	                legend: {
	                    display: true,
	                },
	                tooltip: {
	                    callbacks: {
	                        label: function (context) {
	                            var minutes = context.dataset.data[context.dataIndex];
	                            var hours = Math.floor(minutes / 60);
	                            var remainingMinutes = minutes % 60;
	                            return 'Effort: ' + hours + 'h ' + remainingMinutes + 'm';
	                        },
	                    },
	                },
	            },
	        },
	    });
	    
	    
	    
	     
		/* // Sample data
	    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
	    var project1Efforts = [50, 70, 60, 80, 90];
	    var project2Efforts = [30, 40, 50, 60, 70];

	    // Create a combo chart
	    var ctx = document.getElementById('comboChart').getContext('2d');
	    var comboChart = new Chart(ctx, {
	        type: 'bar',
	        data: {
	            labels: months,
	            datasets: [
	                {
	                    label: 'Project 1 Efforts',
	                    type: 'bar',
	                    data: project1Efforts,
	                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
	                    
	                },
	                {
	                    label: 'Project 2 Efforts',
	                    type: 'bar',
	                    data: project2Efforts,
	                    borderColor: 'rgba(255, 99, 132, 1)',  
	                },
	            ],
	        },
	        options: {
	            scales: {
	                y: {
	                    beginAtZero: true,
	                    ticks: {
	                        callback: function (value) {
	                            // Convert minutes to hours and minutes
	                            var hours = Math.floor(value / 60);
	                            var remainingMinutes = value % 60;
	                            return hours + 'h ' + remainingMinutes + 'm';
	                        }
	                    }
	                },
	            },
	            plugins: {
	                title: {
	                    display: true,
	                    text: 'User Wise Month Effort Report',
	                    font: {
	                        size: 18,
	                    },
	                },
	                legend: {
	                    display: true,
	                },
	                tooltip: {
	                    callbacks: {
	                        label: function (context) {
	                            var minutes = context.dataset.data[context.dataIndex];
	                            var hours = Math.floor(minutes / 60);
	                            var remainingMinutes = minutes % 60;
	                            return 'Effort: ' + hours + 'h ' + remainingMinutes + 'm';
	                        },
	                    },
	                },
	            },
	        },
	    }); */
	</script>
	
	
</body>
</html>
