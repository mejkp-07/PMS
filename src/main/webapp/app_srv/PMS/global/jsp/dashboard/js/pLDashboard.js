/* function resizeIframe(obj) {
    obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
  }*/
 
/*function showDetails(groupkey) {
		$("#charts_datatable").removeClass('hide');
		$("#charts_datatable").show();
		$('#example_det').DataTable().clear().destroy();
		var tableData = '';
		$
		$.ajaxRequest.ajax({

					type : "POST",
					url : "/PMS/projectDetailsByGroupName",
					data : "groupName=" + groupkey,
					success : function(data) {
						//console.log(data);
						for (var i = 0; i < data.length; i++) {
							var row = data[i];
							//console.log(row);
							var clickFunction = "viewProjectDetails('/PMS/projectDetails/"
									+ row.encNumId + "')";
							tableData += '<tr><td > <a class="font_17" title="Click to View Complete Information" onclick='+clickFunction+'>'
									+ row.strProjectName + ' </a> </td>';
							tableData += ' <td class="font_16">'
									+ row.startDate
									+ '</td>  <td class="font_16">'
									+ row.endDate
									+ ' </td>  <td class="font_16"> '
									+ row.projectCost + '</td> </tr>';
						}

						$('#example_det > tbody').html('');
						$('#example_det').append(tableData);

						$('#example_det').DataTable();
					}

				});

	}
	
*/

		
		
	$(document).ready(function() {		
		$('#example_det').DataTable();
	});
	
	var my_time;
	$(document).ready(function() {
	//  pageScroll();
	  $("#contain").mouseover(function() {
	    clearTimeout(my_time);
	  }).mouseout(function() {
	    //pageScroll();
	  });
	});

/*	function pageScroll() {  
		var objDiv = document.getElementById("contain");
	  objDiv.scrollTop = objDiv.scrollTop + 1;  
	  if (objDiv.scrollTop == (objDiv.scrollHeight - 250)) {
	    objDiv.scrollTop = 0;
	  }
	  my_time = setTimeout('pageScroll()', 25);
	}
*/

	

	
/*	
	function loadGroupWiseProposals(encGroupId){
		
		$('#groupWiseProject').removeClass('hidden');
		$('#groupWiseProjectDtl').find('div').remove();
		
		var url = "/PMS/mst/ViewProjectDetails?encGroupId="+encGroupId;
		
		var data='<div > <iframe id="test" src='+url+'  frameborder="0" width="100%;" height="100%;" scrolling="yes"></iframe> </div>';
		
		$('#groupWiseProjectDtl').append(data);
	}*/
	$(document).ready(function() {
		var strStart = "01/04/";
		var strEnd = "31/03/";
		var d = new Date();
		var currentYear = d.getFullYear();
		var currentMonth = d.getMonth();
		var lastYear = d.getFullYear() - 1;
		//alert("as on date"+currentYear);
		var dateString = '01/01/'+currentYear;

	
	$("#dtExpStartDate").datepicker({ 
		
		 showOn: "both", 
  buttonText: "<i class='fa fa-calendar font_20'></i>",
		
    /*   buttonImage: "/PMS/resources/app_srv/PMS/global/images/slider/slider4.jpg",
         buttonImageOnly: true,*/
		dateFormat: 'dd/mm/yy', 
	    changeMonth: true,
	    changeYear:true,           
	    maxDate: '0',
	    showOn: 'both',
	    
	   onSelect: function() {
		   var date = $('#dtExpStartDate').val();
		  // alert("Date Value"+date);
		   
			$.ajaxRequest.ajax({
				type : "POST",
				url : "/PMS/mst/getExpenditureByDate",
				data : "startDate="+date ,
				success : function(response) {
					//console.log(response);			
						 var fieldValue = response;
						// $('#expenditureOndate').html('&#8377; '+k);
					/*	 $('#expenditureOndate').html(k);
						 $("#asOnDateExp").text(date);
*/
						 var convertedStringAmount = convertINRToAmount(fieldValue);
						 
							//console.log(convertedStringAmount);
							var amount = (parseFloat(convertedStringAmount))/100000;
							//console.log(response + " "+ amount);
							//console.log(roundUpTo2Decimal(amount));
							var convertedIntegerAmount=convertAmountToINR(roundUpTo2Decimal(amount,2));
							
							$('#expenditureOndate').html(convertedIntegerAmount +" Lakhs");
							 $("#asOnDateExp").text(date);
			}
		});
			
			
	      }
		});
	
	
	$('.ui-datepicker-trigger').attr('alt', 'Calender');
	$('.ui-datepicker-trigger').attr('title', 'Select Start Date');
	});
	
	
	
	$('#dash-income-modal').on('shown.bs.modal', function(event) {
		initialzeIncomeChart();
		$(this).off('shown.bs.modal');
	}); 
	/*$('#dash-expenditure-modal').on('shown.bs.modal', function(event) {
		
		initialzeExpenditureChart();
	});
	*/
/*	$('#dash-newProposalList-modal').on('shown.bs.modal', function(event) {		
		initializeNewProposals();
		$(this).off('shown.bs.modal');
	});

	$('#dash-newProjectList-modal').on('shown.bs.modal', function(event) {		
		initializeNewProjects();
		$(this).off('shown.bs.modal');
	});
	
	$('#dash-closedProjectList-modal').on('shown.bs.modal', function(event) {		
		initializeClosedProjects();
		$(this).off('shown.bs.modal');
	});*/
	$('#dash-pending-payments-modal').on('shown.bs.modal', function(event) {		
		initializePendingPayments();
		$(this).off('shown.bs.modal');
	});
	$('#dash-pending-invoices-modal').on('shown.bs.modal', function(event) {		
		initializePendingInvoices();
		$(this).off('shown.bs.modal');
	});
	$('#dash-closure-pending-modal').on('shown.bs.modal', function(event) {		
		initializeClosurePending();
		$(this).off('shown.bs.modal');
	});
	
function incomeTable(){
	
	var startDate = null;
	var endDate = null;
	var selectedDateRange = $('#asOnDate').text().trim();

	$('#asOnDate1').text(selectedDateRange);
	if(selectedDateRange){
		if(selectedDateRange.includes("to")){
			var inputArray = selectedDateRange.split('to');
			if(inputArray.length >= 2){
				startDate = inputArray[0].trim();
				endDate = inputArray[1].trim();
			}else if(inputArray.length == 1){
				startDate = inputArray[0].trim();				
			}
		}else{
			startDate = selectedDateRange;		
		}		
	}
if(startDate){	
	 $('#income_dataTable').DataTable().clear().destroy();
	var tableData = '';
	$.ajaxRequest.ajax({
		
		type : "POST",
		url : "/PMS/mst/getPaymentReceivedDetails",
		data:{
			"startDate":startDate,
			"endDate":endDate
		},
		success : function(response) {
			
			//console.log(response);
			var totalAmount = 0;
			for (var i = 0; i < response.length; i++) {
				var row = response[i];	
				var strReferenceNumber=row.strReferenceNumber;
				if(row.strReferenceNumber==null){
					strReferenceNumber='';
				}
				var clickFunction = "viewProjectDetails('/PMS/projectDetails/"
						+ row.encProjectId + "')";
			
				tableData += '<tr> <td>'+(i+1)+' </td> <td> <a class="font_14" title="Click to View Complete Information" onclick='+clickFunction+'>'
						+ row.projectName + ' </a><p class="bold blue font_14 text-left">'+ strReferenceNumber+'<p> </td>';
				tableData += '<td class="font_14 text-right"> <span  class="">'
					+ row.strdtPayment
					+  '</span></td>';
				
				tableData += ' <td class="font_14 text-right"> <input type="hidden" id="hiddenPaymentRecvAmt_'+row.encProjectId+'" value='+row.encProjectId+'/> <span  class="" id="paymentRecvAmt_'+row.encProjectId+'">'
				+ row.strReceivedAmount
				+  '</span></td></tr>';
				
				totalAmount += row.numReceivedAmountLakhs;
			}

			if(totalAmount >0){
				var tempConverted = convertAmountToINR(totalAmount);
				tableData +='<tr><td></td> <td></td> <td class="bold"><span class="text-right">Total</span></td> <td class="bold text-right">'+tempConverted+' Lakhs </td></tr>';
				$('#incomeOndate').text(tempConverted +' Lakhs');				
			}else{
				$('#incomeOndate').text(0); 
			}			
			$('#income_dataTable').append(tableData);            
			 $('#income_dataTable').DataTable( {
				 	dom: 'Bfrtip',
			        "ordering": false,
			        "paging":   false,			        
			        buttons: [
			             'excel', 'pdf', 'print'
			        ]
			    });		                              
		}
	
	});
}		
	
}
	//Expenditure Table
/*function expenditureTable(){
	 table = $('#expenditure_dataTable').DataTable().clear().destroy();
	 var expenditureTableId = $('#expenditure_dataTable').attr('id')
	
	var tableData = '';
	$.ajaxRequest.ajax({
		
		type : "POST",
		url : "/PMS/mst/getExpenditureByGroupByProject",
		success : function(response) {
			//console.log(response);
			for (var i = 0; i < response.length; i++) {
				var row = response[i];
				//console.log(row);
				var clickFunction = "viewProjectDetails('/PMS/projectDetails/"
						+ row.encProjectId + "')";
			
				tableData += '<tr><td > <a class="font_14" title="Click to View Complete Information" onclick='+clickFunction+'>'
						+ row.projectName + ' </a> </td>';
				tableData += ' <td class="font_14 text-right"> <input type="hidden" id="hiddenExpenditureAmt_'+row.encProjectId+'" value='+row.encProjectId+'/> <span  class="convert_lakhs_td" id="expenditureAmt_'+row.encProjectId+'">'
						+ row.strTotalExpenditure
						+  '</td> </tr>';
			}

			$('#expenditure_dataTable > tbody').html('');
			$('#expenditure_dataTable').append(tableData);
			//convertToLakhsForComponent(expenditureTableId);
			 table= $('#expenditure_dataTable').DataTable();
			
			$('#expenditure_dataTable .filters th[class="comboBox"]').each( function ( i ) {
		        var colIdx=$(this).index();
		            var select = $('<select style="width:100%" ><option value="">All</option></select>')
		                .appendTo( $(this).empty() )
		                .on( 'change', function () {
		                 var val = $.fn.dataTable.util.escapeRegex(
		                                $(this).val()
		                            );
		                 table.column(colIdx)
		                        .search( val ? '^'+val+'$' : '', true, false)
		                        .draw();
		                } );
		     
		            table.column(colIdx).data().unique().sort().each( function ( d, j ) {
		                select.append( '<option value="'+d+'">'+d+'</option>' )
		            } );
		        } );
		        
		        // Setup - add a text input
		                                $('#expenditure_dataTable .filters th[class="textBox"]').each( function () {                 
		                                    $(this).html( '<div class="lighter"><input type="text"  style="width:100%" /></div>' );
		             
		              } );
		                             
		                                // DataTable
		                                var table = $('#expenditure_dataTable').DataTable();
		            
		             // Apply the search
		                                table.columns().eq( 0 ).each( function ( colIdx ) {
		                            $( 'input', $('.filters th')[colIdx] ).on( 'keyup change', function () {
		                                table
		                                            .column( colIdx )
		                                            .search( this.value )
		                                            .draw() ;
		                                    
		                                                            } );
		      } );
		                              
		}
	
	});

	
		
	
}
*/
/*function newProposalsTable(){
	
	var startDate = null;
	var endDate = null;
	var selectedDateRange = $('#asOnDateProposals').text().trim();

	$('#asOnDateProposals1').text(selectedDateRange);
	if(selectedDateRange){
		if(selectedDateRange.includes("to")){
			var inputArray = selectedDateRange.split('to');
			if(inputArray.length >= 2){
				startDate = inputArray[0].trim();
				endDate = inputArray[1].trim();
			}else if(inputArray.length == 1){
				startDate = inputArray[0].trim();				
			}
		}else{
			startDate = selectedDateRange;		
		}		
	}

	
	if(startDate){	
		$('#newProposals_dataTable').DataTable().clear().destroy();
	 var tableData = '';
		$.ajaxRequest.ajax({
			type : "POST",
			url : "/PMS/mst/getActiveProposals",
			data:{
				"startDate":startDate,
				"endDate":endDate
			},
			success : function(response) {
				
				if(response){
					$('#newProposalsOnDate').text(response.length); 
				}else{
					$('#newProposalsOnDate').text(0); 
				}
				
				var totalAmount = 0;
				for (var i = 0; i < response.length; i++) {
					var row = response[i];
					
					var clickFunction = "viewProjectDetails('/PMS/projectDetails/"
							+ row.encProjectId + "')";
				
					tableData += '<tr> <td>'+(i+1)+'</td>';
					tableData +='<td class="font_14 text-right">'+ row.groupName +  '</td>';
					tableData += ' <td class="font_14">'+ row.proposalTitle +  '</td> ';
					tableData += ' <td class="font_14">'+ row.strClientName +  '</td> ';
					tableData += ' <td class="font_14 text-right">'+ row.dateOfSubmission +  '</td> ';
					tableData += ' <td class="font_14 text-right">'+ row.duration +  ' months </td> ';
					
					if(row.receivedProjectStatus=='Yes'){
						
							tableData += '<td class="font_14 text-center"> <a title="Click to View Project Details" onclick=openProjectDetails("'+row.encApplicationId+'")>'
						+ row.receivedProjectStatus + ' </a></td>';
					}
					else{
						tableData += ' <td class="font_14 text-center">'+ row.receivedProjectStatus +  '</td> ';
					}
					
					tableData += ' <td class="font_14 text-right"> <input type="hidden" id="hiddenProjectCost_'+row.encApplicationId+'" value='+row.encApplicationId+' /> <span id="projectCost_'+row.encApplicationId+'">'
					+ row.strProposalCost + '</span></td> </tr>';
		
					totalAmount += row.numProposalAmountLakhs;
					
					
				}

				if(totalAmount >0){
					tableData +='<tr> <td></td> <td></td> <td></td> <td></td><td></td><td class="bold text-right">Total</td> <td class="bold text-right">'+convertAmountToINR(totalAmount)+' Lakhs </td></tr>';
				}
				
				$('#newProposals_dataTable').append(tableData);	        

				
				var  table= $('#newProposals_dataTable').DataTable( {
					dom: 'Bfrtip',		       
			        "ordering": false,
			        "paging":   false,
			        buttons: [
			             'excel', 'pdf', 'print'
			        ],
				"columnDefs": [ {
			            "orderable": false,
		            "targets": 0
		        } ],
		        "order": [[ 1, 'asc' ]]
		    } );
				
				table.on('order.dt search.dt', function () {
					table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
				           cell.innerHTML = i+1;
				           table.cell(cell).invalidate('dom');
				     });
				}).draw();
				
				$('#newProposals_dataTable .filters th[class="comboBox"]').each( function ( i ) {
			        var colIdx=$(this).index();
			            var select = $('<select style="width:100%" ><option value="">All</option></select>')
			                .appendTo( $(this).empty() )
			                .on( 'change', function () {
			                 var val = $.fn.dataTable.util.escapeRegex(
			                                $(this).val()
			                            );
			                 table.column(colIdx)
			                        .search( val ? '^'+val+'$' : '', true, false)
			                        .draw();
			                } );
			     
			            table.column(colIdx).data().unique().sort().each( function ( d, j ) {
			                select.append( '<option value="'+d+'">'+d+'</option>' )
			            } );
			        } );
				

				 // Setup - add a text input
		       $('#newProposals_dataTable .filters th[class="textBox"]').each( function () {                 
		           $(this).html( '<div class="lighter"><input type="text"  style="width:100%" /></div>' );

		       } );

               // DataTable
               var table = $('#newProposals_dataTable').DataTable();
		       
		       table.columns().eq( 0 ).each( function ( colIdx ) {
		           $( 'input', $('.filters th')[colIdx] ).on( 'keyup change', function () {
		               table
		                           .column( colIdx )
		                           .search( this.value )
		                           .draw() ;
		                   
		                                           } );
		} );
		       

			},
			error : function(e) {
				// $('#RecurringManpowerAmt').val(0);
				alert('Error: ' + e);
			}
		});
			
	}
	}*/


//Function for new Projects
/*function newProjectsTable(){
var startDate = null;
var endDate = null;
var selectedDateRange = $('#asOnDateProjects').text().trim();

$('#asOnDateProjects1').text(selectedDateRange);
if(selectedDateRange){
	if(selectedDateRange.includes("to")){
		var inputArray = selectedDateRange.split('to');
		if(inputArray.length >= 2){
			startDate = inputArray[0].trim();
			endDate = inputArray[1].trim();
		}else if(inputArray.length == 1){
			startDate = inputArray[0].trim();				
		}
	}else{
		startDate = selectedDateRange;		
	}		
}

 
if(startDate){	
	$('#newProjects_dataTable').DataTable().clear().destroy();
 var tableData = '';
	$.ajaxRequest.ajax({
		type : "POST",
		url : "/PMS/mst/getNewProjectsDetail",
		data:{
			"startDate":startDate,
			"endDate":endDate
		},
		success : function(response) {
			//console.log(response);
			if(response){
				$('#newProjectsOnDate').text(response.length); 
			}else{
				$('#newProjectsOnDate').text(0); 
			}
			
			var totalAmount = 0;
			for (var i = 0; i < response.length; i++) {
				var row = response[i];	
				var mouDate=row.strMouDate;
				var workorderDate= row.strWorkOrderDate
				if(row.strMouDate==null){
					mouDate='';
				}
				if(row.strWorkOrderDate==null){
					workorderDate='';
				}
				var strReferenceNumber=row.strReferenceNumber;
				if(!strReferenceNumber){
					strReferenceNumber='';
				}
				var clickFunction = "viewProjectDetails('/PMS/projectDetails/"
						+ row.encProjectId + "')";
			
				tableData += '<tr> <td>'+(i+1)+'</td> <td> <a class="font_14" title="Click to View Complete Information" onclick='+clickFunction+'>'
						+ row.strProjectName + ' </a></td>';
				
				tableData += ' <td class="bold blue font_14 text-right">'+ strReferenceNumber+'</td>';
				tableData += ' <td class="bold blue font_12">'+ row.strClientName+'</td>';	
				tableData += ' <td class="font_14 text-right">'+ mouDate +  '</td> ';
				tableData += ' <td class="font_14 text-right">'+ workorderDate +  '</td> ';
				
				tableData += ' <td class="font_14 text-right">'+ row.startDate +  '</td> ';			
				tableData += ' <td class="font_14 text-right"> <input type="hidden" id="hiddenProjectCost_'+row.encProjectId+'" value='+row.encProjectId+' /> <span id="projectCost_'+row.encProjectId+'">'
				+ row.strProjectCost + '</span></td> </tr>';
	
				totalAmount += row.numProjectAmountLakhs;
				
				
			}

			if(totalAmount >0){
				tableData +='<tr><td></td><td></td><td></td> <td></td> <td></td> <td></td> <td class="bold text-right">Total</td> <td class="bold text-right">'+convertAmountToINR(totalAmount)+' Lakhs </td></tr>';
			}
			
			$('#newProjects_dataTable').append(tableData);	        
			$('#newProjects_dataTable').DataTable( {		
		        dom: 'Bfrtip',		       
		        "ordering": false,
		        "paging":   false,
		        buttons: [
		             'excel', 'pdf', 'print'
		        ]
		    });		                     
		}
	});
}
}
*/
//Function for Closed Projects

/*function closedProjectsTable(){
	//alert("closedProjectsTable");
	var startDate = null;
	var endDate = null;
	var selectedDateRange = $('#asOnDateClosedProjects').text().trim();
	//console.log("selectedDateRange inside function"+selectedDateRange);
	$('#asOnDateClosedProjects1').text(selectedDateRange);
	if(selectedDateRange){
		if(selectedDateRange.includes("to")){
			var inputArray = selectedDateRange.split('to');
			if(inputArray.length >= 2){
				startDate = inputArray[0].trim();
				endDate = inputArray[1].trim();
			}else if(inputArray.length == 1){
				startDate = inputArray[0].trim();				
			}
		}else{
			startDate = selectedDateRange;		
		}		
	}
	if(startDate){		
	
	 $('#closedProjects_dataTable').DataTable().clear().destroy();
	 var tableData = '';
		$.ajaxRequest.ajax({
			type : "POST",
			url : "/PMS/mst/getAllClosedProjectByDate",
			data:{
				"startDate":startDate,
				"endDate":endDate
			},
			success : function(response) {				
				if(response){
				$('#closedProjectsOnDate').text(response.length); 
			}else{
				$('#closedProjectsOnDate').text(0); 
			}
				var totalAmount = 0;
				for (var i = 0; i < response.length; i++) {
					var row = response[i];	
					var strReferenceNumber=row.strReferenceNumber;
					if(!strReferenceNumber){
						strReferenceNumber='';
					}
					var clickFunction = "viewProjectDetails('/PMS/projectDetails/"
							+ row.encProjectId + "')";
				
					tableData += '<tr><td>'+(i+1)+'</td> <td > <a class="font_14" title="Click to View Complete Information" onclick='+clickFunction+'>'
							+ row.strProjectName + ' </a> </td>';
					
					tableData += ' <td class="bold blue font_14 text-right">'+ strReferenceNumber+'</td><td class="font_12"> <input type="hidden" id="hiddenClientName_'+row.encProjectId+'" value='+row.encProjectId+'/> <span  class="" id="clientName_'+row.encProjectId+'">'
					+ row.strClientName
					+  '</span></td> ';					
					tableData += ' <td class="font_14 text-right"> <span  class="" >'
					+ row.startDate+  '</span></td> ';				
					
					tableData += ' <td class="font_14 text-right">'+ row.projectClosureDate+'</td>';
					tableData += ' <td class="font_14 text-right"><span  class="" id="projectCost_'+row.encProjectId+'">'
					+ row.strProjectCost
					+  '</span></td> </tr>';
				
					
					totalAmount += row.numProjectAmountLakhs;
				}

				if(totalAmount >0){
					tableData +='<tr><td> </td> <td> </td> <td> </td> <td> </td> <td> </td> <td class="bold text-right">Total</td> <td class="bold text-right">'+convertAmountToINR(totalAmount)+' Lakhs </td></tr>';
				}
				
				$('#closedProjects_dataTable').append(tableData);
		        
				$('#closedProjects_dataTable').DataTable( {					
			        dom: 'Bfrtip',			        
			        "ordering": false,
			        "paging":   false,
			        buttons: [
			             'excel', 'pdf', 'print'
			        ]
			    });		       
			}

		});
	}
		
	}*/
//pending payments function
function pendingPaymentsTable(){
	
	 $('#pendingPayments_dataTable').DataTable().clear().destroy();

	var tableData = '';
	$.ajaxRequest.ajax({
		type : "POST",
		url : "/PMS/mst/getPendingPaymentsInvoiceDetail",
		success : function(response) {
			var totalInvoiceAmt=0;
			var totalTaxAmt = 0;
			var totalAmt = 0;
			
			for (var i = 0; i < response.length; i++) {
				var row = response[i];
				 totalInvoiceAmt += row.numInvoiceAmt;
				 totalTaxAmt += row.numTaxAmount;
				 totalAmt +=row.numInvoiceTotalAmt;
				var strInvoiceStatus= row.strInvoiceStatus;
				if(row.strInvoiceStatus==null){
					strInvoiceStatus='';
				}
				var strReferenceNumber=row.strReferenceNumber;
				if(!strReferenceNumber){
					strReferenceNumber='';
				}
				var clickFunction = "viewProjectDetails('/PMS/projectDetails/"
						+ row.encProjectId + "')";
			
				tableData += '<tr><td>'+(i+1)+'</td><td > <a class="font_14" title="Click to View Complete Information" onclick='+clickFunction+'>'
						+ row.strProjectName + ' </a><p class="font_14 orange"><i>'+row.strClientName+'</i></p><p class="bold blue font_14 text-left">'+ strReferenceNumber+'<p> </td>';
				
				tableData += '<td class="font_14 ">'
				+ row.strInvoiceRefno +'</td>';
				
				tableData += ' <td class="font_14">'+ row.strInvoiceDate+ '</td>';
				
				tableData += ' <td class="font_14">'+ strInvoiceStatus+  '</td>';
				
				tableData += ' <td class="font_14 text-right">'	+ row.strInvoiceAmt +'</td>';
				
				tableData += ' <td class="font_14 text-right">'	+ row.strTaxAmount + '</td>';
				
				tableData += ' <td class="font_14 text-right">'+ row.strInvoiceTotalAmt+ '</td> </tr>';			
				
			}		
			
			 if(totalInvoiceAmt>0){
				 tableData+='<tr><td></td> <td></td> <td></td><td></td> <td class="bold text-right">Total</td><td class="bold text-right">'+convertAmountToINR(totalInvoiceAmt)+'</td> <td class="bold text-right">'+convertAmountToINR(totalTaxAmt)+'</td> <td class="bold text-right">'+convertAmountToINR(totalAmt)+'</td></tr>'
			 }
			
			$('#pendingPayments_dataTable').append(tableData);            
			 $('#pendingPayments_dataTable').DataTable( {
				 destroy: true,
			        dom: 'Bfrtip',			        
			        "ordering": false,
			        "paging":   false,
			        buttons: [
			             'excel', 'pdf', 'print'
			        ]
			    });		                        
		}
	
	});

	
		
	
}

function pendingInvoicesTable(){	
		
	var tableData = '';
	$.ajaxRequest.ajax({
		type : "POST",
		url : "/PMS/mst/getPendingInvoiceDetail",
		success : function(response) {
			var totalAmt =0;
			for (var i = 0; i < response.length; i++) {
				var row = response[i];	
				var strPurpose=row.strPurpose;
				var strRemarks=row.strRemarks;
				totalAmt +=row.numInvoiceAmtInLakhs;
				if(row.strPurpose==null){
					strPurpose='';
				}
				if(row.strRemarks==null){
					strRemarks='';
				}
				var strReferenceNumber=row.strReferenceNumber;
				if(!strReferenceNumber){
					strReferenceNumber='';
				}
				var clickFunction = "viewProjectDetails('/PMS/projectDetails/"
						+ row.encProjectId + "')";
			
				tableData += '<tr><td>'+(i+1)+'</td><td > <a class="font_14" title="Click to View Complete Information" onclick='+clickFunction+'>'
						+ row.strProjectName + ' </a><p class="font_14 orange"><i>'+row.strClientName+'</i></p><p class="bold blue font_14 text-left">'+ strReferenceNumber+'<p> </td>';
				
				tableData += '<td class="font_14 "> <span  class="" >'
				+ row.strPaymentDueDate
				+  '</span></td>';
				
				tableData += ' <td class="font_14">'+ strPurpose+  '</td>';
				
				tableData += ' <td class="font_14"> <span  class="" >'
					+strRemarks +  '</span></td>';
				tableData += ' <td class="font_14 text-right">'+row.strAmount+ ' Lakhs</td> </tr>';
				
			}

			if(totalAmt>0){
				tableData +='<tr><td></td> <td></td> <td></td>  <td></td><td class="bold text-right">Total</td> <td class="bold text-right">'+convertAmountToINR(totalAmt)+' Lakhs</td></tr>';
			}
			
			$('#pendingInvoices_dataTable > tbody').html('');
			$('#pendingInvoices_dataTable').append(tableData);
           
			 $('#pendingInvoices_dataTable').DataTable( {
				 destroy: true,
			        dom: 'Bfrtip',
			        destroy: true,
			        "ordering": false,
			        "paging":   false,
			        buttons: [
			             'excel', 'pdf', 'print'
			        ]
			    });		                        
		}
	
	});

	
		
	
}

$(".emp").on("click", getColumnID);

function getColumnID() {
	
	
	  var $td = $(this),
      $th = $td.closest('table').find('th').eq($td.index());
 // console.log($th.attr("id"));
  var designation=$th.attr("id");
  var group=$td.closest('tr').children('td:first').text();
  //console.log(group);
  
	$.ajaxRequest.ajax({

		type : "POST",
		url : "/PMS/mst/getEmpbyDesignationForGroup",
		data : {"group":group,
			"designation":designation
		},
		success : function(data) {
			//console.log(data);
			var tableData="";
			for(var i =0;i<data.length;i++){
				var row = data[i];
  			    var sno=i+1;    			       			  
				tableData+="<tr><td>"+sno+"</td><td>"+row.employeeId+"</td> <td>"+row.employeeName+"</td></tr>";

 			} 
 			tableData+='</tbody>';
 			
			$('#datatable1 tbody').empty();						
			$('#datatable1').append(tableData);	
			$('#empDetailModal').modal('show');

		}
	});
}

$(document).ready(function() {

	var  table= $('#example').DataTable( {
		 "paging":   false,
		 "ordering": false,
	"columnDefs": [ {
            "orderable": false,
           
        "targets": 0
    } ],
    "order": [[ 1, 'asc' ]]
} );
	
	table.on('order.dt search.dt', function () {
		table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
	           cell.innerHTML = i+1;
	           table.cell(cell).invalidate('dom');
	     });
	}).draw();
	
	$('#example .filters th[class="comboBox"]').each( function ( i ) {
        var colIdx=$(this).index();
            var select = $('<select style="width:100%" ><option value="">All</option></select>')
                .appendTo( $(this).empty() )
                .on( 'change', function () {
                 var val = $.fn.dataTable.util.escapeRegex(
                                $(this).val()
                            );
                 table.column(colIdx)
                        .search( val ? '^'+val+'$' : '', true, false)
                        .draw();
                } );
     
            table.column(colIdx).data().unique().sort().each( function ( d, j ) {
                select.append( '<option value="'+d+'">'+d+'</option>' )
            } );
        } );
	

	 // Setup - add a text input
   $('#example .filters th[class="textBox"]').each( function () {                 
       $(this).html( '<div class="lighter"><input type="text"  style="width:100%" /></div>' );

   } );
   
   table.columns().eq( 0 ).each( function ( colIdx ) {
       $( 'input', $('.filters th')[colIdx] ).on( 'keyup change', function () {
           table
                       .column( colIdx )
                       .search( this.value )
                       .draw() ;
               
                                       } );
} );
   
	
});


$('#amtreceive').on('show.bs.modal', function(event) {
	var button = $(event.relatedTarget);
	var input = button.data('whatever');
	var inputs = input.split(';');
	var projectId= inputs[0];
	var resultArray = $('#'+projectId).find('td').map( function()
			{
			return $(this).text();
			}).get();
	var result=resultArray[2].trim();
	var resultSplit=result.split('\n');
	var split1=resultSplit[0];
	var split2=resultSplit[1];
	
	$('#projectForPayment').text(split1);
	$('#clientIdForPayment').text(split2);
	var startDate= inputs[1];
	var projectCost= inputs[2].trim();
	//console.log(projectCost);
	var tableData = "";
$.ajax({
		type : "POST",
		url : "/PMS/mst/getProjectPaymentReceivedByProjectId",
		data : "encProjectId=" + projectId,
		async:false,
		success : function(response) {
		//console.log(response);
			  var SumOfReceivedAmt=0
			  var paymentReceive=0;
			  var paymentDue=0;
 			  //paymentDue =parseFloat(convertINRToAmount(projectCost))*100000;
 			 paymentDue =parseFloat(convertINRToAmount(projectCost));
			   tableData+="<tr><td>"+startDate+"</td><td><b>Total Project Cost</b></td><td class='text-right'><b>"+convertAmountToINR(paymentDue)+"</b></td><td class='text-right'>₹ "+paymentReceive+"</td></tr>";

		   for(var i =0;i<response.length;i++){
				var row = response[i]; 
			   var newAmt =row.numReceivedAmount;
			   SumOfReceivedAmt+=newAmt;
			       tableData+="<tr><td>"+row.strdtPayment+"</td> ";
			  tableData+="<td><p>"+row.strPaymentMode+" , "+row.strUtrNumber+"</p><p class='pad-left'><b>" ;
			  if(row.encInvoiceId!=null){
				  tableData+="Payment Received Against Invoice Ref No. : </b><a title='Click here to view Invoice details' data-toggle='modal' data-target='#invoiceDetail' onclick=viewInvoiceDetails('"+row.encInvoiceId+"') class='text-center'>"+row.invoiceCode+"</a></p></td>";
					tableData+="<td class='text-right'>"+row.paymentDue+"</td> <td class='text-right'>"+convertAmountToINR(newAmt)+"</td></tr>";

			  }else{
				  tableData+="Payment Received without Invoice Details : </b></p></td>";  
					tableData+="<td class='text-right'>"+row.paymentDue+"</td> <td class='text-right'>"+convertAmountToINR(row.numBalanceAmount)+"</td></tr>";

			  }
			}
		if(SumOfReceivedAmt && SumOfReceivedAmt>0){
			tableData+="<tr><td colspan='3' class='font_eighteen text-right'><b>Total Payment Received:</b></td><td class='font_eighteen text-right'><b>"+convertAmountToINR(SumOfReceivedAmt)+"</b></td> </tr>";
			tableData+="<tr><td colspan='3' class='font_eighteen text-right'><b>Payment Remaining:</b></td><td class='font_eighteen text-right'><b>"+row.paymentDue+"</b></td> </tr>";

		}
			tableData+='</tbody>';
			$('#datatable tbody').empty();						
			$('#datatable').append(tableData);		
		},
		error : function(e) {
			alert('Error: ' + e);			
		}
	});				
});



var scrollPos = 0;
$('#clientDetails').on('show.bs.modal', function(event) {
	//console.log("inside client modal");
	var button = $(event.relatedTarget);
	var input = button.data('whatever');
	//console.log("data"+input);
	if (typeof input !== 'undefined')
	{
	var inputs = input.split(';');
	var clientId= inputs[0];
	var projectId= inputs[1];
	var endUserId= inputs[2];
	loadClientData(clientId,projectId,endUserId);
	}
	  $('body').css({
          overflow: 'hidden',
          position: 'fixed',
          top : -scrollPos
      });
})
 .on('hide.bs.modal', function (){
        $('body').css({
            overflow: '',
            position: '',
            top: ''
        }).scrollTop(scrollPos);
    });
$( function() {
	  var dateFormat = "dd/mm/yy",
	    from = $( "#fromProposal" )
	      .datepicker({
	    	dateFormat: 'dd/mm/yy', 
	  	    changeMonth: true,
	  	    changeYear:true,
	  	    maxDate: '0',
	  	  /* Bhavesh (18-10-23) extend the min date year to 8 Year from minDate : '-5Y'*/
	  	    minDate : '-10Y'
	      })
	      .on( "change", function() {
	        to.datepicker( "option", "minDate", getDate( this ) );
	      }),
	    to = $( "#toProposal" ).datepicker({
	      dateFormat: 'dd/mm/yy', 
	      changeMonth: true,
	      changeYear:true,
	      maxDate: '0',
	      /* Bhavesh (18-10-23) extend the min date year to 8 Year from minDate : '-5Y'*/
	  	    minDate : '-10Y'
	    })
	    .on( "change", function() {
	      from.datepicker( "option", "maxDate", getDate( this ) );
	    });

	  
	  $('#goProposal').click(function() {
		  var startRange = $("#fromProposal").val();
		  var endRange = $("#toProposal").val();
		  if(!startRange){
			  sweetSuccess('Attention','Please select Start Range');
			  return false;
		  }
		  var selectedRange = startRange;
		  if(endRange){
			  selectedRange = selectedRange +' to '+endRange;
		  }
		  $('#asOnDateProposals').text(selectedRange);
		  
		  //alert('Called');
		  newProposalsTable();
	  });
	  
	     $('.go-btn').click(function() {
			  var startRange = $("#from").val();
			  var endRange = $("#to").val();
			  if(!startRange){
				  sweetSuccess('Attention','Please select Start Range');
				  return false;
			  }
			  var selectedRange = startRange;
			  if(endRange){
				  selectedRange = selectedRange +' to '+endRange;
			  }
			  $('#asOnDateProjects').text(selectedRange);
			  
			  //alert('Called');
			  newProjectsTable();
		  });
	     
	  function getDate( element ) {
		    var date;
		    try {
		      date = $.datepicker.parseDate( dateFormat, element.value );
		    } catch( error ) {
		      date = null;
		    }

		    return date;
		  }
		});

//Added code for jquery ui daterangepicker
$( function() {
  var dateFormat = "dd/mm/yy",
    from = $( "#from" )
      .datepicker({
    	dateFormat: 'dd/mm/yy', 
  	    changeMonth: true,
  	    changeYear:true,
  	    maxDate: '0',
  	  /* Bhavesh (18-10-23) extend the min date year to 8 Year from minDate : '-5Y'*/
  	    minDate : '-10Y'
      })
      .on( "change", function() {
        to.datepicker( "option", "minDate", getDate( this ) );
      }),
    to = $( "#to" ).datepicker({
      dateFormat: 'dd/mm/yy', 
      changeMonth: true,
      changeYear:true,
      maxDate: '0',
      /* Bhavesh (18-10-23) extend the min date year to 8 Year from minDate : '-5Y'*/
	    minDate : '-10Y'
    })
    .on( "change", function() {
      from.datepicker( "option", "maxDate", getDate( this ) );
    });

  $('.go-btn').click(function() {
	  var startRange = $("#from").val();
	  var endRange = $("#to").val();
	  if(!startRange){
		  sweetSuccess('Attention','Please select Start Range');
		  return false;
	  }
	  var selectedRange = startRange;
	  if(endRange){
		  selectedRange = selectedRange +' to '+endRange;
	  }
	  $('#asOnDateProjects').text(selectedRange);
	  
	  //alert('Called');
	  newProjectsTable();
  });
  
  function getDate( element ) {
    var date;
    try {
      date = $.datepicker.parseDate( dateFormat, element.value );
    } catch( error ) {
      date = null;
    }

    return date;
  }
});



$( function() {
	  var dateFormat = "dd/mm/yy",
	    from = $( "#from1" )
	      .datepicker({
	    	dateFormat: 'dd/mm/yy', 
	  	    changeMonth: true,
	  	    changeYear:true,
	  	    maxDate: '0',
	  	  /* Bhavesh (18-10-23) extend the min date year to 8 Year from minDate : '-5Y'*/
	  	    minDate : '-10Y'
	      })
	      .on( "change", function() {
	        to.datepicker( "option", "minDate", getDate( this ) );
	      }),
	    to = $( "#to1" ).datepicker({
	      dateFormat: 'dd/mm/yy', 
	      changeMonth: true,
	      changeYear:true,
	      maxDate: '0',
	      /* Bhavesh (18-10-23) extend the min date year to 8 Year from minDate : '-5Y'*/
	  	    minDate : '-10Y'
	    })
	    .on( "change", function() {
	      from.datepicker( "option", "maxDate", getDate( this ) );
	    });
	  
	  $('.go-btn1').click(function() {
		  var startRange = $("#from1").val();
		  var endRange = $("#to1").val();
		  console.log("go-btn1 startRange"+startRange)
		  console.log("go-btn1 endRange"+endRange)
		  if(!startRange){
			  sweetSuccess('Attention','Please select Start Range');
			  return false;
		  }
		  var selectedRange = startRange;
		  if(endRange){
			  selectedRange = selectedRange +' to '+endRange;
		  }
		 
		  $('#asOnDateClosedProjects').text(selectedRange);
		  //alert('Called');
		  closedProjectsTable();
	  });
	  
	  
	  
	  function getDate( element ) {
	    var date;
	    try {
	      date = $.datepicker.parseDate( dateFormat, element.value );
	    } catch( error ) {
	      date = null;
	    }

	    return date;
	  }
	});

function getEncProjectId(encApplicationId){
	$.ajaxRequest.ajax({
		type : "POST",
		url : "/PMS/mst/getProjectIdByApplicationId",
		data : {"encApplicationId":encApplicationId,
		async:false,		
		},
		success : function(response) {
		if(response){
			window.location.href= "/PMS/projectDetails/"+response;
		}
		else{
			sweetSuccess('Attention!','No project found');
			return false;
		}
		

	}
});
}

function openProjectDetails(encApplicationId){
	getEncProjectId(encApplicationId);
	
	
}




$( function() {
	  var dateFormat = "dd/mm/yy",
	    from = $( "#incomefrom" )
	      .datepicker({
	    	dateFormat: 'dd/mm/yy', 
	  	    changeMonth: true,
	  	    changeYear:true,
	  	    maxDate: '0',
	  	  /* Bhavesh (18-10-23) extend the min date year to 8 Year from minDate : '-5Y'*/
	  	    minDate : '-10Y'
	      })
	      .on( "change", function() {
	        to.datepicker( "option", "minDate", getDate( this ) );
	      }),
	    to = $( "#incometo" ).datepicker({
	      dateFormat: 'dd/mm/yy', 
	      changeMonth: true,
	      changeYear:true,
	      maxDate: '0',
	      /* Bhavesh (18-10-23) extend the min date year to 8 Year from minDate : '-5Y'*/
	  	    minDate : '-10Y'
	    })
	    .on( "change", function() {
	      from.datepicker( "option", "maxDate", getDate( this ) );
	    });
	  
	  $('.go-btn2').click(function() {
		  var startRange = $("#incomefrom").val();
		  var endRange = $("#incometo").val();
		  console.log("go-btn2 startRange"+startRange)
		  console.log("go-btn2 endRange"+endRange)
		  if(!startRange){
			  sweetSuccess('Attention','Please select Start Range');
			  return false;
		  }
		  var selectedRange = startRange;
		  if(endRange){
			  selectedRange = selectedRange +' to '+endRange;
		  }
		 
		  $('#asOnDate').text(selectedRange);
		  //alert('Called');
		  incomeTable();
	  });
	  
	  function getDate( element ) {
	    var date;
	    try {
	      date = $.datepicker.parseDate( dateFormat, element.value );
	    } catch( error ) {
	      date = null;
	    }

	    return date;
	  }
	});


	function initialzeIncomeChart() {
		incomeTable();
	}
		
	/*function initializeNewProposals() {
		newProposalsTable();
	}

		function initializeNewProjects() {
			newProjectsTable();
		}

		function initializeClosedProjects() {		
			closedProjectsTable();
		}*/
		function initializePendingPayments() {
			pendingPaymentsTable();
		}
		function initializePendingInvoices() {
			pendingInvoicesTable();
		}
		function initializeClosurePending() {
			pendingClosuresTable();
		}
		
		// update the table data on 08-06-2023
		function pendingClosuresTable(){	
			
				
				$('#pendingCLosure_dataTable').DataTable().clear().destroy();
			 var tableData = '';
				$.ajaxRequest.ajax({
					type : "POST",
					url : "/PMS/mst/getPendingClosureDetail",
					success : function(response) {
						//console.log(response);
						if(response){
						var totalAmount = 0;
						/*Bhavesh(26-07-23)*/ 
						var valuesList = []; // Initialize an empty array to store the values
					    $(".closureList").each(function() {
					      var value = $(this).text().trim(); // Get the text content and remove any leading/trailing spaces
					      valuesList.push(value); // Add the value to the array
					    });

					   
					    //console.log(valuesList); 
						for (var i = 0; i < response.length; i++) {
							var row = response[i];	
							var clickFunction = "viewProjectDetails('/PMS/projectDetails/"
									+ row.encNumId + "')";
							if(!valuesList.includes(row.projectRefrenceNo)){
							tableData += '<tr> <td class="grey-text">'+(i+1)+'</td> <td> <a class="font_14 grey-text" title="Click to View Complete Information" onclick='+clickFunction+'>'
							+ row.strProjectName + ' </a><p class="bold grey-text font_14 text-left">'+ row.projectRefrenceNo+'<p></td><td class="font_14 grey-text">'+ row.clientName +  '</td>';
							/*tableData += '<tr> <td>'+(i+1)+'</td><td>'+row.strGroupName+'</td> <td> <a class="font_14" title="Click to View Complete Information" onclick='+clickFunction+'>'
									+ row.strProjectName + ' </a><p class="font_14 orange"><i>'+row.clientName+'</i></p><p class="bold blue font_14 text-left">'+ row.projectRefrenceNo+'<p></td>';*/
							
						if(row.strPLName==null || row.strPLName==''){
								row.strPLName='';
							}
							tableData += ' <td class="font_16 grey-text">'+ row.strPLName +  '</td>';
							tableData += ' <td class="font_14 text-right grey-text">'+ row.startDate +  '</td> ';
							
							tableData += ' <td class="font_14 text-right grey-text">'+ row.endDate +  '</td>';
							//Added by devesh on 21-09-23 to get cdac outlay and status column in pending closure table
							tableData += ' <td class="font_14 text-right grey-text"> <span id="projectCost_'+row.encProjectId+'">'
							+ row.strProjectCost + '</span></td>';
				
							totalAmount += row.numProjectAmountLakhs;
							
							if (row.workflowModel && row.workflowModel.strActionPerformed) {
								  if (row.workflowModel.strActionPerformed.includes("Sent back to PM")) {
								    tableData += ' <td class="font_14 text-center grey-text">Pending At PL</span></td> </tr>';
								  } else if (row.workflowModel.strActionPerformed.includes("HOD")) {
								    tableData += ' <td class="font_14 text-center grey-text">Pending At HOD</span></td> </tr>';
								  } else if (row.workflowModel.strActionPerformed.includes("GC")||row.workflowModel.strActionPerformed.includes("Project Closure Initiated")) {
								    tableData += ' <td class="font_14 text-center grey-text">Pending At GC</span></td> </tr>';
								  } else if (row.workflowModel.strActionPerformed.includes("PMO")) {
								    tableData += ' <td class="font_14 text-center grey-text">Pending At PMO</span></td> </tr>';
								  }
								} 
							else {
								  // Handle the case when row.workflowModel.strActionPerformed is null
								  tableData += ' <td class="font_14 text-center grey-text">Project Closure Not Initiated</span></td> </tr>';
								}
							//End of added columns
							
						}
							else if(valuesList.includes(row.projectRefrenceNo)){
								tableData += '<tr> <td class="golden-text">'+(i+1)+'</td> <td> <a class="font_14 golden-text" title="Click to View Complete Information" onclick='+clickFunction+'>'
								+ row.strProjectName + ' </a><p class="bold golden-text font_14 text-left">'+ row.projectRefrenceNo+'<p></td><td class="font_14 golden-text">'+ row.clientName +  '</td>';
								/*tableData += '<tr> <td>'+(i+1)+'</td><td>'+row.strGroupName+'</td> <td> <a class="font_14" title="Click to View Complete Information" onclick='+clickFunction+'>'
										+ row.strProjectName + ' </a><p class="font_14 orange"><i>'+row.clientName+'</i></p><p class="bold blue font_14 text-left">'+ row.projectRefrenceNo+'<p></td>';*/
								
							if(row.strPLName==null || row.strPLName==''){
									row.strPLName='';
								}
								tableData += ' <td class="font_16 golden-text">'+ row.strPLName +  '</td>';
								tableData += ' <td class="font_14 text-right golden-text">'+ row.startDate +  '</td> ';
								
								tableData += ' <td class="font_14 text-right golden-text">'+ row.endDate +  '</td>';
								//Added by devesh on 21-09-23 to get cdac outlay and status column in pending closure table
								tableData += ' <td class="font_14 text-right golden-text"> <span id="projectCost_'+row.encProjectId+'">'
								+ row.strProjectCost + '</span></td>';
					
								totalAmount += row.numProjectAmountLakhs;
								
								if (row.workflowModel && row.workflowModel.strActionPerformed) {
									  if (row.workflowModel.strActionPerformed.includes("Sent back to PM")) {
									    tableData += ' <td class="font_14 text-center golden-text">Pending At PL</span></td> </tr>';
									  } else if (row.workflowModel.strActionPerformed.includes("HOD")) {
									    tableData += ' <td class="font_14 text-center golden-text">Pending At HOD</span></td> </tr>';
									  } else if (row.workflowModel.strActionPerformed.includes("GC")||row.workflowModel.strActionPerformed.includes("Project Closure Initiated")) {
									    tableData += ' <td class="font_14 text-center golden-text">Pending At GC</span></td> </tr>';
									  } else if (row.workflowModel.strActionPerformed.includes("PMO")) {
									    tableData += ' <td class="font_14 text-center golden-text">Pending At PMO</span></td> </tr>';
									  }
									} 
								else {
									  // Handle the case when row.workflowModel.strActionPerformed is null
									  tableData += ' <td class="font_14 text-center golden-text">Pending (No Action)</span></td> </tr>';
									}

								//End of added columns
							}
						}

							
						$('#pendingCLosure_dataTable').append(tableData);	        
						$('#pendingCLosure_dataTable').DataTable( {		
					        dom: 'Bfrtip',		       
					        "ordering": false,
					        "paging":   false,
					        buttons: [
					             'excel', 'pdf', 'print'
					        ]
					    });		                     
					}
					}
				});
			}
				

		$('#my-team-modal').on('shown.bs.modal', function(event) {
			myTeamTable();
			$(this).off('shown.bs.modal');
		}); 
		
		//Added by devesh on 30-11-23 for my team modal project wise
		$('#my-team-modal-projectwise').on('shown.bs.modal', function(event) {
			myTeamProjectWiseTable();
			$(this).off('shown.bs.modal');
		});
		//End of my team modal
				
		function myTeamTable(){
			
			
			
			 $('#myteam_dataTable').DataTable().clear().destroy();
			var tableData = '';
			$.ajaxRequest.ajax({
				
				type : "POST",
				url : "/PMS/mst/getAllTeamMembers",
				
				success : function(response) {
					
					for (var i = 0; i < response.length; i++) {
						var row = response[i];
						tableData += '<tr> <td>'+ row.strEmpName + ' </a> </td>';
						tableData += '<td>'+ row.designation+'</td> ';						
						tableData += ' <td>'+ row.strProjectName+  '</td></tr>';
						
					}
		
					$('#myteam_dataTable').append(tableData);            
					 $('#myteam_dataTable').DataTable( {
						 	dom: 'Bfrtip',
					        "ordering": false,
					        "paging":   false,			        
					        buttons: [
					             'excel', 'pdf', 'print'
					        ]
					    });		                              
				}
			
			});
		}		
		
		//Function added by devesh on 30-11-23 for my team modal project wise
		function myTeamProjectWiseTable(){
			
			
			
			 $('#myteam_projectwise_dataTable').DataTable().clear().destroy();
			var tableData = '';
			$.ajaxRequest.ajax({
				
				type : "POST",
				url : "/PMS/mst/getAllTeamMembersProjectWise",
				
				success : function(response) {
					
					/*for (var i = 0; i < response.length; i++) {
						var row = response[i];
						tableData += '<tr> <td>'+ row.strProjectName + ' </a> </td>';
						tableData += '<td>'+ row.designation+'</td> ';						
						tableData += ' <td>'+ row.strEmpName+  '</td></tr>';
						
					}*/
					var projectGroups = groupByProject(response);
					var isAlternate = 0;

		            for (var projectName in projectGroups) {
		                if (projectGroups.hasOwnProperty(projectName)) {
		                    var groupRows = projectGroups[projectName];
		                    var rowspan = groupRows.length;		                    

		                    for (var i = 0; i < rowspan; i++) {
		                        var row = groupRows[i];

		                        if(isAlternate%2 == 0){
		                        	if (i === 0) {
			                            // Create a new row for the project name with rowspan
			                            tableData += '<tr><td style="vertical-align: middle;border-bottom-width: 1;background-color: #f2f2f2;" rowspan="' + rowspan + '">' + projectName + ' </a> </td>';
			                        }
		                        	// Add designation and employee name for the current project
			                        tableData += '<td style="vertical-align: middle;border-bottom-width: 1;background-color: #f2f2f2;">' + row.designation + '</td>';
			                        tableData += '<td style="vertical-align: middle;border-bottom-width: 1;background-color: #f2f2f2;">' + row.strEmpName + '</td></tr>';
		                        }
		                        else{
		                        	if (i === 0) {
			                            // Create a new row for the project name with rowspan
			                            tableData += '<tr><td style="vertical-align: middle;border-bottom-width: 1;" rowspan="' + rowspan + '">' + projectName + ' </a> </td>';
			                        }
		                        	// Add designation and employee name for the current project
			                        tableData += '<td style="vertical-align: middle;border-bottom-width: 1;">' + row.designation + '</td>';
			                        tableData += '<td style="vertical-align: middle;border-bottom-width: 1;">' + row.strEmpName + '</td></tr>';
		                        }

		                    }
		                    isAlternate += 1;
		                }
		            }
		            
					$('#myteam_projectwise_dataTable').append(tableData);            
					 $('#myteam_projectwise_dataTable').DataTable( {
						 	dom: 'Bfrtip',
					        "ordering": false,
					        "paging":   false,			        
					        buttons: [
					             'excel', 'pdf', 'print'
					        ]
					    });	                              
				}
			
			});
		}
		// Function to group rows by project name
		function groupByProject(rows) {
		    var groups = {};

		    for (var i = 0; i < rows.length; i++) {
		        var row = rows[i];
		        var projectName = row.strProjectName;

		        if (!groups.hasOwnProperty(projectName)) {
		            groups[projectName] = [];
		        }

		        groups[projectName].push(row);
		    }

		    return groups;
		}
		//End of function
		
		$('#Progress-Reports-modal-rev').on('shown.bs.modal', function(event) {

			var monthNames = [ "January", "February", "March", "April", "May", "June",
			                   "July", "August", "September", "October", "November", "December" ];
			
			
				$.ajaxRequest.ajax({
					type : "POST",
					url : "/PMS/revisedReportAtPL",
					data : {"actionId": 5,
						
					},
					success : function(data) {
						//console.log(data);	
						var tableData = '';
						if(data.length>0){
						for(var i=0;i<data.length;i++){
							
							var row = data[i];
							var action= '<div class="dropdown">';																						
							action += ' <a class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" onmouseover=viewAllowedActions("'+row.encNumId+'","'+row.encCategoryId+'") aria-haspopup="true" aria-expanded="false">';
							action+='<i class="icon-th-large icon-1halfx blue pad-top" aria-hidden="true"></i></a>';
							action+='<ul class="dropdown-menu pull-right" aria-labelledby="dropdownMenuLink" id="'+row.encNumId+'"></ul></div>';
							
							tableData +='<tr><td class="text-right">'+(i+1)+'</td><td>'+row.strProjectName+'</br><p class="bold blue font_14 text-left"> 	'+row.strProjectReferenceNo+'</p></td>';
							tableData +='<td>'+monthNames[row.month-1] +'/'+row.year+'</td>';
							tableData +=' <td>'+row.transactionDate+'</td><td>'+action+' </td></tr>';
						}
						}
						else{
							sweetSuccess("Attention","No Record Exist for this month");
							$('#projectProgressTbl tbody').empty();
							  return false;
						}
						$('#projectProgressTbl tbody').empty();
						$('#projectProgressTbl tbody').append(tableData);
						
						 $('#projectProgressTbl').DataTable( {
							 	destroy: true,
						        dom: 'Bfrtip',			        
						        "ordering": false,
						        "paging":   false,
						        buttons: [
						             'excel', 'pdf', 'print'
						        ]
						    });
					}
				});
				
			})
		$('#Progress-Reports-modal-pending').on('shown.bs.modal', function(event) {
			var button = $(event.relatedTarget);
			var input = button.data('whatever');
			
			var monthNames = [ "January", "February", "March", "April", "May", "June",
			                   "July", "August", "September", "October", "November", "December" ];
			
			$.ajaxRequest.ajax({
				type : "POST",
				url : "/PMS/pendingProgressReportsAtPL",
				data : {"actionId": input},
				success : function(data) {
					//console.log(data);	
					var tableData = '';
					var monthNYear='';
					for(var i=0;i<data.length;i++){
						
						var row = data[i];
						if(row.month!=0 && row.year){
							monthNYear=monthNames[row.month-1]+'/'+row.year;
						}
						else{
							monthNYear="";
						}
					var encrypProjectId = row.encProjectId;
					var monthUpdate = row.month;
					var yearUpdate = row.year;
					console.log(encrypProjectId);
					console.log(monthUpdate);
					console.log(yearUpdate);
					
						/*var action= '<div class="dropdown">';																						
						action += ' <a class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" onmouseover=viewAllowedActions("'+row.encNumId+'","'+row.encCategoryId+'") aria-haspopup="true" aria-expanded="false">';
						action+='<i class="icon-th-large icon-1halfx blue pad-top" aria-hidden="true"></i></a>';
						action+='<ul class="dropdown-menu pull-right" aria-labelledby="dropdownMenuLink" id="'+row.encNumId+'"></ul></div>';
						*/
						//console.log(row);
						tableData +='<tr id="reportId_'+row.encNumId+'"><td class="text-right">'+(i+1)+' <input type="checkbox" class="sendToPMO" value="'+row.encNumId+'"/> </td><td><p style="color: #1a7dc4;" class="font_14">'+row.strProjectName+'</p><p class="bold blue font_14 text-left">'+ row.strProjectReferenceNo+'<p></td>';
						tableData +='<td>'+monthNYear+'</td>';
						tableData +='<td><a class="btn btn-primary " onclick=monthlyProgressReport("'+row.encProjectId+'","'+row.month+'","'+row.year+'") >Update</a></td>';
						tableData +=' </tr>';
						/*tableData +='<td class="text-right">'+row.transactionDate+'</td></tr>';*/
					}
					
					$('#projectProgressTblPending').DataTable().clear().destroy();
					$('#projectProgressTblPending tbody').append(tableData);
				
					 $('#projectProgressTblPending').DataTable( {
						 	/*destroy: true,*/
					        dom: 'Bfrtip',			        
					        "ordering": false,
					        "paging":   false,
					        buttons: [
					             'excel', 'pdf', 'print'
					        ]
					    });
				}
				
			});
			//$(this).off('shown.bs.modal');
		});
		
		function viewAllowedActions(encMonthlyProgressId, numCatId){
		
			var encWorkflowId = $('#encWorkflowId').val();
			var encPageId = $('#encPageId').val();
			var actionName="View Report";
			
			$.ajax({
		        type: "POST",
		        url: "/PMS/getNextRoleActionDetails",
		        async:false,
		        data: {"encMonthlyProgressId":encMonthlyProgressId,"encPageId":encPageId,"encWorkflowId":encWorkflowId},			
				success : function(res) {
				
					$('#'+encMonthlyProgressId).find('li').remove();
					$('#'+encMonthlyProgressId).append("<li> <a class='font_14' onclick=previewOfReport('"+encMonthlyProgressId+"') title='Preview of Report'><span  aria-hidden='true'>"+actionName+"</span></a></li>");
						for(var i=0;i<res.length;i++)
						{	
				
							$('#'+encMonthlyProgressId).append("<li> <a class='font_14' onclick=performAction('"+encMonthlyProgressId+"','"+res[i].strEncActionId+"',"+res[i].isRemarksReq+",'"+encPageId+"','"+encWorkflowId+"','"+numCatId+"') title='"+res[i].strToolTip+"'><span  aria-hidden='true'>"+res[i].strActionName+"</span></a></li>");
						}					
				},
				error : function(e) {					
				}		
			});

		}
		
		function performAction(encMonthlyProgressId,encActionId,isRemarks,encPageId,encWorkflowId,numCatId)
		{ 
			if(isRemarks==0)
			{
				swal({
					  title: "Do you wan to submit?",
					
					  buttons: [					               
				                'No',
				                'Yes'
				              ],
				              
				    }).then(function(isConfirm) {
				      if (isConfirm) {
				    	  doWorkAccrodingToAction(encMonthlyProgressId,encActionId,encPageId,encWorkflowId,"",numCatId);
				      } else {
				    	  
				      }
				    }); 
				
			}
			else if(isRemarks==1)
				{
					var textarea = document.createElement('textarea');
				  textarea.rows = 6;
				  textarea.className = 'swal-content__textarea';
				  textarea.id = 'textArea';
				  textarea.placeholder = 'You can write remarks';
				  textarea.disabled = false;
				  
				 
				  
				
					swal({
						  title: 'Do you want to submit?',
						  content: textarea,
						  
						  buttons: [					               
				                'No',
				                'Yes'
				              ]
						}).then(function(isConfirm) {
						      if (isConfirm) {
								 	var textAreaValue=$("#textArea").val();
								 	textAreaValue=textAreaValue.trim();
								 	if(textAreaValue.length<300 || textAreaValue.length==300)
								 	{
								 		
								 		doWorkAccrodingToAction(encMonthlyProgressId,encActionId,encPageId,encWorkflowId,textAreaValue,numCatId);
								 	}
								 	else
								 		{
								 			swal("Remarks should be less than or equals to 300 characters.");
								 		}
						      } else {
						    	  
						      }
						}); 
				}
			else
				{
				  doWorkAccrodingToAction(encMonthlyProgressId,encActionId,encPageId,encWorkflowId,"",numCatId);
				}
		}
		
		function doWorkAccrodingToAction(encMonthlyProgressId,encActionId,encPageId,encWorkflowId,strRemarks,numCatId)
		{
			
			$.ajax({
		        type: "POST",
		        url: "/PMS/doWorkAccrodingToAction",
		        async:false,
		        data: {"encMonthlyProgressId":encMonthlyProgressId,"strEncActionId":encActionId,"encPageId":encPageId,"encWorkflowId":encWorkflowId,"strRemarks":strRemarks},			
				success : function(res) {
					//alert(res.numActionId);
					if(res.numActionId==1)
					{
						monthlyReport(encMonthlyProgressId,numCatId);
					}
					else if(res.numActionId==2)
						{
						 previewOfReport(encMonthlyProgressId);
						}
					else if(res.numActionId==3)
						{
						  
						 previewOfReport(encMonthlyProgressId);
						}
					else{
						   if(res.strSuccessMsg!='' && res.strSuccessMsg!='error') 
						   {   
							  
							   sweetSuccess("Attention!","Data Submitted Successfully.");
							  /* $('#projectProgressTbl tbody').empty();*/
							   var monthNames = [ "January", "February", "March", "April", "May", "June",
								                   "July", "August", "September", "October", "November", "December" ];
								$.ajaxRequest.ajax({
									type : "POST",
									url : "/PMS/revisedReportAtPL",
									data : {"actionId": 5,
										
									},
									success : function(data) {
										//console.log(data);	
										var tableData = '';
										var monthNYear='';
										if(data.length>0){
										for(var i=0;i<data.length;i++){
											
											var row = data[i];
											if(row.month!=0 && row.year){
												monthNYear=monthNames[row.month-1]+'/'+row.year;
											}
											else{
												monthNYear="";
											}
											var action= '<div class="dropdown">';																						
											action += ' <a class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" onmouseover=viewAllowedActions("'+row.encNumId+'","'+row.encCategoryId+'") aria-haspopup="true" aria-expanded="false">';
											action+='<i class="icon-th-large icon-1halfx blue pad-top" aria-hidden="true"></i></a>';
											action+='<ul class="dropdown-menu pull-right" aria-labelledby="dropdownMenuLink" id="'+row.encNumId+'"></ul></div>';
											
											tableData +='<tr><td class="text-right">'+(i+1)+'</td><td>'+row.strProjectName+'<p class="bold blue font_14 text-left"> "+row.projectRefrenceNo+"</p></td>';
											tableData +='<td>'+monthNYear+'</td>';
											tableData +=' <td>'+row.transactionDate+'</td><td>'+action+' </td></tr>';
										}
										}
									
										$('#projectProgressTbl tbody').empty();
										$('#projectProgressTbl tbody').append(tableData);
										
										
									}
								});
							 /*  swal({
							    	  title: "",
							    	  text: res.strSuccessMsg,    	
							    	  showCancelButton: false,
							    	  confirmButtonColor: "#DD6B55",    	  
							    	  confirmButtonColor: "#34A534",
							    	  confirmButtonText: "Ok",
							    	  cancelButtonText: "Cancel",
							    	  closeOnConfirm: true,
							    	  closeOnCancel: true
							    	}).then(
							    	 function(isConfirm){
							    	  if (isConfirm) {
							    		  openWindowWithPost('GET','/PMS/mst/ViewAllProjects','_self');
							    	  }
							    	});*/
							        
						   }
						   else if(res.strSuccessMsg!='error')
							   swal("There are some problem.Please contact to Admin.");
					}
				},
				error : function(e) {
					
					
				}


			
			});
			
		}
		
		function monthlyReport(encMonthlyProgressId,numCatId){
	//alert(numCatId);
			var requestURL='';
			$.ajax({
				type : "POST",
				url : "/PMS/getCategoryURL",
				data : {"encCategoryId":numCatId	
				},
				async:false,
				success : function(response) {
					//alert(response);
					requestURL=response;
				},
				error : function(e) {
					alert('Error: ' + e);			
				}
			});	

			//alert(requestURL);
			
				openWindowWithPost('GET','/PMS/'+requestURL,{"encMonthlyProgressId":encMonthlyProgressId,"encCategoryId":numCatId},'_blank');
				
		}
		
		function previewOfReport(encMonthlyProgressId){
			
			openWindowWithPost('POST','/PMS/getPreviewDetails',{"encMonthlyProgressId":encMonthlyProgressId,"previewFlag":1},'_blank');
			
			}

		$(document).ready(function(){
			loadSentForRevision();
			loadPendingReport()
			
		});
		
		function loadPendingReport(){
			$.ajaxRequest.ajax({
				type : "POST",
				url : "/PMS/PendingAtPLCount",
			
				success : function(data) {	
					if($.isNumeric(data)){
						
						$('#allPendingReports').text(data);
					}else{
						$('#allPendingReports').text(0);
					}
					
				}
			});
		}
		function loadSentForRevision(){
			$.ajaxRequest.ajax({
				type : "POST",
				url : "/PMS/SentForRevisionCount",
				data : {"actionId": 5},
				success : function(data) {	
					//console.log(data);
					if($.isNumeric(data)){
						
						$('#sentForRevCount').text(data);
					}else{
						$('#sentForRevCount').text(0);
					}
					
				}
			});

		}
		function monthlyProgressReport(encrypProjectId,month,year){
			$('#tempAction').text('');	
		
		$.ajaxRequest.ajax({

			type : "POST",
			url : "/PMS/getMonthlyProgress",
			data : {"encProjectId": encrypProjectId , 
					"month":month ,
					"year" :year},			
			success : function(response) {
				if(response!=null || response!=''){
				console.log(response);
				if(response.encMonthlyProgressId){	
				
				
							
					getNextRoleActions(response.encMonthlyProgressId,response.encPageId,response.encWorkflowId);
					
					if($('#tempAction').text() == "Update"){
						openWindowWithPost('GET','/PMS/Highlights',{"encMonthlyProgressId":response.encMonthlyProgressId,"encCategoryId":"akE4TUdNMW1jeWpUb2tSS1lVVm44Zz09"},'_self');
					}
				}
				}
				}
				});	
				}
		
		
		/*<!-- Bhavesh(26-06-2023) restore code  -->*/

		//restore code
		var isMaximized = false;
		function toggleMaximize() {
			 // var myModal = $(".myModal1");
			 
			  if (isMaximized) {
			  // myModal.classList.remove("maximized");
				  $(".myModal1").removeClass("maximized");
				 
			    //document.body.classList.remove("modal-open");
				  $("body").removeClass("modal-open");
				  
				  
			   // document.getElementById('dash-newProposalList-modal').style.height = '';
			    //document.getElementById('dash-newProposalList-modal').style.width = '';
			    
			    $('.dash-newProposalList-modal').css('height', '');
			    $('.dash-newProposalList-modal').css('width', '');
			  } else {
			   // myModal.classList.add("maximized");
				  $(".myModal1").addClass("maximized");
				  $("body").addClass("modal-open");

			    var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
			    var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth; 
			    var modal =$('.dash-newProposalList-modal');
			   // modal.style.height = (windowHeight * 0.75) + 'px'; 
			    var windowHeight = $(window).height();
			    $('.dash-newProposalList-modal').height(windowHeight * 0.75 + 'px');

			    
			    //modal.style.width = (windowWidth * 0.98) + 'px'; 
			    //modal.style.transformOrigin = 'center';
			    var windowWidth = $(window).width();
			    $('dash-newProposalList-modal').width(windowWidth * 0.98 + 'px');
			    $('.dash-newProposalList-modal').css('transform-origin', 'center');
			  }

			  isMaximized = !isMaximized;
			  
			  var btn = document.getElementsByClassName('close-btn')[0];
			  var icon = btn.getElementsByTagName('i')[0];
			  
			  if (icon.classList.contains('fa-window-maximize')) {
			    // Change maximize to restore
			    icon.classList.remove('fa-window-maximize');
			    icon.classList.add('fa-window-restore');
			  } else {
			    // Change restore to maximize
			    icon.classList.remove('fa-window-restore');
			    icon.classList.add('fa-window-maximize');
			  }
			}

		function restoreModalSize() {
			  //var myModal = $(".myModal1");
			 // myModal.classList.remove("maximized");
			 // document.body.classList.remove("modal-open");
			  $(".myModal1").removeClass("maximized");
			  $("body").removeClass("modal-open");
			 // document.getElementById('dash-newProposalList-modal').style.height = '';
			  //document.getElementById('dash-newProposalList-modal').style.width = '';
			  
			  $('.dash-newProposalList-modal').css('height', '');
			    $('.dash-newProposalList-modal').css('width', '');
			}

		// Code for restoring the proposals



		function restoreprop(){
			$(".months1").val("0");
			 $(".fromProposal1").val("");
			$(".toProposal1").val("");
			  isMaximized=true;
			  toggleMaximize();
			  restoreModalSize();
			
			 
			
			//$("#myContent").load(location.href + " #myContent");
		   const today = new Date();
		   const year = today.getFullYear();
		   const firstDayOfYear = new Date(year, 0, 1);

		   const dd = String(firstDayOfYear.getDate()).padStart(2, '0');
		   const mm = String(firstDayOfYear.getMonth() + 1).padStart(2, '0'); // January is 0
		   const yyyy = firstDayOfYear.getFullYear();

		   const fromDate = dd + "/" + mm + "/" + yyyy;
		  
			  

		   const dd1 = String(today.getDate()).padStart(2, '0');
		   const mm1 = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
		   const yyyy1 = today.getFullYear();

		   const toDate = dd1 + "/" + mm1 + "/" + yyyy1;
		   console.log(toDate);
		   var startRange = dd + "/" + mm + "/" + yyyy;
			  var endRange = dd1 + "/" + mm1 + "/" + yyyy1;
			  if(!startRange){
				  sweetSuccess('Attention','Please select Start Range');
				  return false;
			  }
			  var selectedRange = startRange;
			  if(endRange){
				  selectedRange = selectedRange /*+' to '+endRange*/;
			  }
			  $('.asOnDateProposals1').text(selectedRange);
			  $('#asOnDateClosedProjects').text(selectedRange);
			 
			  closedProjectsTable();
			  //alert('Called');
			 /* incomeTable();
			  expenditureTable();
			  newProposalsTable();
			  newProjectsTable();
			 closedProjectsTable();
			 
			 newJoineeEmpTable();
			 newResignEmpTable();
			 newRejoinEmpTable(status); */
			  pendingClosuresTable();
			  incomeTable();
			  pendingPaymentsTable();
			  pendingInvoicesTable();
			  myTeamTable();
			  myTeamProjectWiseTable();
			 
			  $('.asOnDateProposals1').text(fromDate);
			  
			 
			
			//-------------------  Reset the tables of milestone exceeded [21-08-2023] -----------------------------------------------
			  ResetTheMileStones();
			  $('#milestoneDueInOneMonthTable').dataTable().fnDestroy();
			  setMilestoneDueInOneMonthProperties();
			 
			
		} 
		/*$(document).ready(function() {
			  var valuesSet = new Set();
			  $(".underclos1").each(function() {
			    var value = $(this).text().trim();
			    valuesSet.add(value);
			  });
			  
			  var valuesSet1 = new Set();
			  $(".underclos").each(function() {
			    var value1 = $(this).text().trim();
			    valuesSet1.add(value1);
			  });
			  
			  
			 


			 

			
			  
			  var strProjectName;
			  var value = new Set();
			  // Loop through each element with class "unique" individually
			  $(".unique").each(function() {
				  strProjectName = $(this).text().trim();
			     
			    // Check if the current element's 'projectRefrenceNo' exists in 'valuesSet'
			    if (valuesSet.has(strProjectName)) {
			      // If the element's 'projectRefrenceNo' exists in 'valuesSet', set its class to "golden-text"
			      $(this).removeClass("grey-text").addClass("golden-text");
			    } else {
			      // If not, set its class to "grey-text"
			      $(this).removeClass("golden-text").addClass("grey-text");
			    }
			  });
			 
			  var projectRefrenceNo;
			  var value = new Set();
			  // Loop through each element with class "unique" individually
			  $(".unique1").each(function() {
				  projectRefrenceNo = $(this).text().trim();
			     
			    // Check if the current element's 'projectRefrenceNo' exists in 'valuesSet'
			    if (valuesSet1.has(projectRefrenceNo)) {
			      // If the element's 'projectRefrenceNo' exists in 'valuesSet', set its class to "golden-text"
			      $(this).removeClass("grey-text").addClass("golden-text");
			    } else {
			      // If not, set its class to "grey-text"
			      $(this).removeClass("golden-text").addClass("grey-text");
			    }
			  });

			 
			});*/
		
		//------------------------------------------ Milestone Exceeded Deadlines filters [21-08-2023] -----------------------------------------
		$(document)
				.ready(
						function() {
							var dateFormat = "dd/mm/yy", from = $(
									"#fromDate_MilestoneExceeded").datepicker({
								dateFormat : 'dd/mm/yy',
								changeMonth : true,
								changeYear : true,
								maxDate : '0',
								/* Bhavesh (18-10-23) extend the min date year to 8 Year from minDate : '-5Y'*/
						  	    minDate : '-10Y'
							}).on("change", function() {
								to.datepicker("option", "minDate", getDate(this));
							}), to = $("#toDate_MilestoneExceeded").datepicker({
								dateFormat : 'dd/mm/yy',
								changeMonth : true,
								changeYear : true,
								maxDate : '0',
								/* Bhavesh (18-10-23) extend the min date year to 8 Year from minDate : '-5Y'*/
						  	    minDate : '-10Y'
							}).on("change", function() {
								from.datepicker("option", "maxDate", getDate(this));
							});

							setMilestoneExceededtableProperties();
							setMilestoneDueInOneMonthProperties();

						});

		//------------------------------------------ Milestone Exceeded Deadlines filter by clicking the GoButton [21-08-2023] ----------------------------
		$('#milestoneExceeded_GoBtn').click(function() {
			var startRange = $("#fromDate_MilestoneExceeded").val();
			var endRange = $("#toDate_MilestoneExceeded").val();
			if (!startRange) {
				sweetSuccess('Attention', 'Please select Start Range');
				return false;
			}
			var selectedRange = startRange;
			if (endRange) {
				selectedRange = selectedRange + ' to ' + endRange;
			}

			$('#asOnDate').text(selectedRange);
			MilestonesTable(startRange, endRange);
		});

		function getDate( element ) {
		    var date;
		    try {
		      date = $.datepicker.parseDate( dateFormat, element.value );
		    } catch( error ) {
		      date = null;
		    }

		    return date;
		  }
		//------------------------------------------ Set the DataTable Properties in Milestone Exceeded Deadlines Table [21-08-2023] ------------------
		function setMilestoneExceededtableProperties()
		{
			var  table= $('#milestoneExceededDeadlineTable').DataTable( {
				destroy: true,
				dom: 'Bfrtip',		       
		        "ordering": false,
		        "paging":   true,
		        buttons: [
		             'excel', 'pdf', 'print'
		        ]
		    } );
				
				table.on('order.dt search.dt', function () {
					table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
				           cell.innerHTML = i+1;
				           table.cell(cell).invalidate('dom');
				     });
				}).draw();
				
				$('#milestoneExceededDeadlineTable .filters th[class="comboBox"]').each( function ( i ) {
			        var colIdx=$(this).index();
			            var select = $('<select style="width:100%" ><option value="">All</option></select>')
			                .appendTo( $(this).empty() )
			                .on( 'change', function () {
			                 var val = $.fn.dataTable.util.escapeRegex(
			                                $(this).val()
			                            );
			                 table.column(colIdx)
			                        .search( val ? '^'+val+'$' : '', true, false)
			                        .draw();
			                } );
			     
			            table.column(colIdx).data().unique().sort().each( function ( d, j ) {
			                select.append( '<option value="'+d+'">'+d+'</option>' )
			            } );
			        } );
		       $('#milestoneExceededDeadlineTable .filters th[class="textBox"]').each( function () {                 
		           $(this).html( '<div class="lighter"><input type="text"  style="width:100%" /></div>' );

		       } );
		       var table = $('#milestoneExceededDeadlineTable').DataTable();
		       
		       table.columns().eq( 0 ).each( function ( colIdx ) {
		           $( 'input', $('.filters th')[colIdx] ).on( 'keyup change', function () {
		               table
		                           .column( colIdx )
		                           .search( this.value )
		                           .draw() ;
		                   
		                                           } );
		           });	
		}
		//------------------------------------------ Set the DataTable Properties in Milestone Due In One Month Table [21-08-2023] ------------------
		function setMilestoneDueInOneMonthProperties()
		{
			var table1 = $('#milestoneDueInOneMonthTable').DataTable({
				dom : 'Bfrtip',
				"paging" : true,
				buttons : [ 'excel', 'pdf', 'print' ],
				"columnDefs" : [ {
					"orderable" : false,
					"targets" : 0
				} ],
				"order" : [ [ 1, 'asc' ] ]
			});

			table1.on('order.dt search.dt', function() {
				table1.column(0, {
					search : 'applied',
					order : 'applied'
				}).nodes().each(function(cell, i) {
					cell.innerHTML = i + 1;
					table1.cell(cell).invalidate('dom');
				});
			}).draw();

			$('#milestoneDueInOneMonthTable .filters th[class="comboBox"]').each( function ( i ) {
		        var colIdx=$(this).index();
		            var select = $('<select style="width:100%" ><option value="">All</option></select>')
		                .appendTo( $(this).empty() )
		                .on( 'change', function () {
		                 var val = $.fn.dataTable.util.escapeRegex(
		                                $(this).val()
		                            );
		                           
		                 table1.column(colIdx)
		                        .search( val ? '^'+val+'$' : '', true, false)
		                        .draw();
		                } );
		     
		            table1.column(colIdx).data().unique().sort().each( function ( d, j ) {
		                select.append( '<option value="'+d+'">'+d+'</option>' )
		            } );
		        } );
			
			table1.columns().eq(0).each(
					function(colIdx) {
						$('input', $('.filters th')[colIdx]).on(
								'keyup change',
								function() {
									table1.column(colIdx).search(
											this.value).draw();

								});
					});
		}

		//------------------------------------------ Using Filter Symbols Calculate Dates in Milestone Exceeded Deadlines Table [21-08-2023] ------------------
		function calculateMilestoneExceededDates() {
			var d = new Date();
			var symbol = $("#filterSymbol_milestoneExceeded").val();
			var selValue = $("#months_milestoneExceeded").val();

			if (selValue == 0) {

				$('#milestoneExceededDeadlineTable').empty();
				$('#milestoneExceededDeadlineTable').DataTable().destroy();
				var table = $('#milestoneExceededDeadlineTable').DataTable({
					destroy : true,
					dom : 'Bfrtip',
					"ordering" : false,
					"paging" : true,
					buttons : [ 'excel', 'pdf', 'print' ],
					dom : 'Bfrtip',
					"columnDefs" : [ {

						"orderable" : false,
						"targets" : 0
					} ],
					"order" : [ [ 1, 'asc' ] ]
				});

			} else {

				var lastMonth = new Date();
				lastMonth.setMonth(lastMonth.getMonth() - 1);
				var durationBefore = selValue;
				d.setMonth(d.getMonth() - durationBefore);
				var lastDayOfLastMonth = lastday(lastMonth.getFullYear(), lastMonth
						.getMonth());
				var fromMonth = d.getMonth() + 1;
				var toMonth = lastMonth.getMonth() + 1;
				fromMonth = fromMonth + "";
				toMonth = toMonth + "";
				lastDayOfLastMonth = lastDayOfLastMonth + "";

				if (fromMonth.length == 1) {
					fromMonth = "0" + fromMonth;
				}
				if (toMonth.length == 1) {
					toMonth = "0" + toMonth;
				}
				if (selValue != 0) {
					$("#fromDate_MilestoneExceeded").val(
							"01" + "/" + fromMonth + "/" + d.getFullYear());
					$("#toDate_MilestoneExceeded").val(
							lastDayOfLastMonth + "/" + toMonth + "/"
									+ lastMonth.getFullYear());

				} else {
					$("#fromDate_MilestoneExceeded").val("");
					$("#toDate_MilestoneExceeded").val("");

				}

				var compDate = "01" + "/" + fromMonth + "/" + d.getFullYear();
				getAllMilestoneExceededDeadlineTable(compDate, symbol);
			}
		}

		var lastday = function(y, m) {
			return new Date(y, m, 0).getDate();
		}

		//------------------------------------------ Get All Milestone Exceeded Deadlines Details By Symbol Filter [21-08-2023] ------------------
		function getAllMilestoneExceededDeadlineTable(compDate, symbol) {
			$('#milestoneExceededDeadlineTable').DataTable().clear().destroy();
			var groupColumn = 0;
			var tableData = '';
			$.ajaxRequest
					.ajax({
						type : "POST",
						url : "/PMS/mst/MilestoneExceededDeadlineDetailByDates",
						data : {
							"compDate" : compDate,
							"symbol" : symbol
						},
						success : function(response) {
							console.log(response);
							for (var i = 0; i < response.length; i++) {
								var row = response[i];
								var strReferenceNumber = row.strProjectReference;
								if (!strReferenceNumber) {
									strReferenceNumber = '';
								}
								/*-----------  [ 29-08-2023 ] ----------------------------------------*/
								var closureList = []; 
							    $(".closureList").each(function() {
							      var value = $(this).text().trim(); 
							      closureList.push(value); 
							    });
							    
							    var pendingClosureList = []; 
							    $(".pendingClosureList").each(function() {
							      var value = $(this).text().trim();
							      pendingClosureList.push(value); 
							    });
							    
							    var rowColor="";
							    if(closureList.includes(row.strProjectReference)){
							    	rowColor='golden-text';
							    }else{
							    	if(pendingClosureList.includes(row.strProjectReference)){
							    		rowColor='grey-text';
							    	}else{
							    		rowColor='success-text';
							    	}
							    }
							    /*----------- EOL [ 29-08-2023 ] ----------------------------------------*/
								var clickFunction = "viewProjectDetails('/PMS/projectDetails/"
										+ row.encProjectId + "')";
								tableData += '<tr class="'+rowColor+'"><td>'
										+ (i + 1)
										+ '</td><td class="font_14">'
										+ row.groupName
										+ '</td><td> <a class="font_14 '+rowColor+'" title="Click to View Complete Information" onclick="'
										+ clickFunction
										+ '"> '
										+ row.strProjectName
										+ ' </a> <br/> <span class="bold font_14 text-left '+rowColor+'">'
										+ strReferenceNumber + '</span> </td>';
								tableData += ' <td>' + row.milestoneName + '</td>';

								if (row.completionDate != null) {
									tableData += ' <td class=" text-center">'
											+ row.completionDate + '</td>';
								}
								if (row.expectedStartDate != null) {
									tableData += ' <td class=" text-center">'
											+ row.expectedStartDate + '</td>';
								}
								tableData += ' <td><div class="text-center"><a class="btn btn-primary"  onclick=viewProjectDetails("/PMS/mst/MilestoneReviewMaster/'
										+ row.encMilestsoneId
										+ '")>Review</a></td> </tr>';

							}

							$('#milestoneExceededDeadlineTable  tbody').append(tableData);
						
							setMilestoneExceededtableProperties();
						}
					});
		}

		//------------------------------------------ Get All Milestone Exceeded Deadlines Details By Start and End Date Filter [21-08-2023] ------------------
		function MilestonesTable(startDate, endDate) {
			$('#milestoneExceededDeadlineTable').DataTable().clear().destroy();
			var groupColumn = 0;
			var tableData = '';
			$.ajaxRequest
					.ajax({
						type : "POST",
						url : "/PMS/mst/MilestoneExceededDeadlineDetailByDates",
						data : {
							"compDate" : startDate,
							"symbol" : endDate
						},
						success : function(response) {
							for (var i = 0; i < response.length; i++) {
								var row = response[i];
								var strReferenceNumber = row.strProjectReference;
								if (!strReferenceNumber) {
									strReferenceNumber = '';
								}
								/*-----------  [ 29-08-2023 ] ----------------------------------------*/
								var closureList = []; 
							    $(".closureList").each(function() {
							      var value = $(this).text().trim(); 
							      closureList.push(value); 
							    });
							    
							    var pendingClosureList = []; 
							    $(".pendingClosureList").each(function() {
							      var value = $(this).text().trim();
							      pendingClosureList.push(value); 
							    });
							    
							    var rowColor="";
							    if(closureList.includes(row.strProjectReference)){
							    	rowColor='golden-text';
							    }else{
							    	if(pendingClosureList.includes(row.strProjectReference)){
							    		rowColor='grey-text';
							    	}else{
							    		rowColor='success-text';
							    	}
							    }
							    /*----------- EOL [ 29-08-2023 ] ----------------------------------------*/
								var clickFunction = "viewProjectDetails('/PMS/projectDetails/"
										+ row.encProjectId + "')";
								tableData += '<tr class="'+rowColor+'"><td>'
										+ (i + 1)
										+ '</td><td class="font_14">'
										+ row.groupName
										+ '</td><td> <a class="font_14 '+rowColor+'" title="Click to View Complete Information" onclick="'
										+ clickFunction
										+ '"> '
										+ row.strProjectName
										+ ' </a> <br/> <span class="bold font_14 text-left '+rowColor+'">'
										+ strReferenceNumber + '</span> </td>';
								tableData += ' <td>' + row.milestoneName + '</td>';

								if (row.completionDate != null) {
									tableData += ' <td class=" text-center">'
											+ row.completionDate + '</td>';
								}
								if (row.expectedStartDate != null) {
									tableData += ' <td class=" text-center">'
											+ row.expectedStartDate + '</td>';
								}
								tableData += ' <td><div class="text-center"><a class="btn btn-primary"  onclick=viewProjectDetails("/PMS/mst/MilestoneReviewMaster/'
										+ row.encMilestsoneId
										+ '")>Review</a></td> </tr>';

							}

							$('#milestoneExceededDeadlineTable  tbody').append(
									tableData);

							setMilestoneExceededtableProperties();
						}
					});
		}
		//------------------------------------------ Reset the Milestone Exceeded Deadlines Details By Start and End Date Filter [21-08-2023] ------------------
		function ResetTheMileStones() {
			$('#milestoneExceededDeadlineTable').DataTable().clear().destroy();
			var groupColumn = 0;
			var tableData = '';
			$.ajaxRequest
					.ajax({
						type : "POST",
						url : "/PMS/mst/getAllMilestoneExceededDeadlineDetailMaster",
						success : function(response) {
							console.log(response);
							for (var i = 0; i < response.length; i++) {
								var row = response[i];
								var strReferenceNumber = row.strProjectReference;
								if (!strReferenceNumber) {
									strReferenceNumber = '';
								}
								/*-----------  [ 29-08-2023 ] ----------------------------------------*/
								var closureList = []; 
							    $(".closureList").each(function() {
							      var value = $(this).text().trim(); 
							      closureList.push(value); 
							    });
							    
							    var pendingClosureList = []; 
							    $(".pendingClosureList").each(function() {
							      var value = $(this).text().trim();
							      pendingClosureList.push(value); 
							    });
							    
							    var rowColor="";
							    if(closureList.includes(row.strProjectReference)){
							    	rowColor='golden-text';
							    }else{
							    	if(pendingClosureList.includes(row.strProjectReference)){
							    		rowColor='grey-text';
							    	}else{
							    		rowColor='success-text';
							    	}
							    }
							    /*----------- EOL [ 29-08-2023 ] ----------------------------------------*/
								var clickFunction = "viewProjectDetails('/PMS/projectDetails/"
										+ row.encProjectId + "')";

								tableData += '<tr class="'+rowColor+'"><td>'
										+ (i + 1)
										+ '</td><td>'
										+ row.groupName
										+ '</td><td> <a class="font_14 '+rowColor+'" title="Click to View Complete Information" onclick='
										+ clickFunction
										+ ' > '
										+ row.strProjectName
										+ ' </a> <br/> <span class="bold font_14 text-left '+rowColor+'">'
										+ strReferenceNumber + '</span> </td>';

								tableData += ' <td>' + row.milestoneName + '</td>';

								if (row.completionDate != null) {
									tableData += ' <td class=" text-center">'
											+ row.completionDate + '</td>';
								}
								if (row.expectedStartDate != null) {
									tableData += ' <td class=" text-center">'
											+ row.expectedStartDate + '</td>';
								}
								tableData += ' <td><div class="text-center"><a class="btn btn-primary"  onclick=viewProjectDetails("/PMS/mst/MilestoneReviewMaster/'
										+ row.encMilestsoneId
										+ '")>Review</a></td> </tr>';
							}
							$('#milestoneExceededDeadlineTable tbody')
									.append(tableData);

							setMilestoneExceededtableProperties();
						}

					});
		}
		//------------------------------------------ End of Milestone Exceeded Deadlines filters -----------------------------------------------------------------------

		/*Bhavesh (08-09-23)called the setMilestoneDueInOneMonthProperties() for adding pdf, print, excel */
		$(document).ready(function() {
			setMilestoneDueInOneMonthProperties();
		});
		
		
		// function for proposal table added by varun on 11-10-2023
		function newProposalsTable(){
			var groupColumn = 2;
			var startDate = null;
			var endDate = null;
			var selectedDateRange = $('#asOnDateProposals').text().trim();

			$('#asOnDateProposals1').text(selectedDateRange);
			if(selectedDateRange){
				if(selectedDateRange.includes("to")){
					var inputArray = selectedDateRange.split('to');
					if(inputArray.length >= 2){
						startDate = inputArray[0].trim();
						endDate = inputArray[1].trim();
					}else if(inputArray.length == 1){
						startDate = inputArray[0].trim();				
					}
				}else{
					startDate = selectedDateRange;		
				}		
			}

			$('#newProposals_dataTable').DataTable().clear().destroy();
			if(startDate){		 
			
				
			 var tableData = '';
				$.ajaxRequest.ajax({
					type : "POST",
					url : "/PMS/mst/getActiveProposals",
					data:{
						"startDate":startDate,
						"endDate":endDate
					},
					success : function(response) {
						
					
						/*if(response){
							$('#newProposalsOnDate').text(response.length); 
						}else{
							$('#newProposalsOnDate').text(0); 
						}*/
						// declare the total amountlay and numerictotaloutlay to get the total outlay by varun
						var totalAmount = 0;
						var totalAmountoutlay;
						var totalConvertedToProjCost=0;
						var convertedCount=0;
						var numerictotaloutlay =0;
						for (var i = 0; i < response.length; i++) {
							var row = response[i];
							// sum the totalamouunt lay by varun 
							//Bhavesh (31-10-23) data will show if row.dateOfSubmission is not null
							if(null!= row.dateOfSubmission){
		                    totalAmountoutlay =row.strProposalTotalCost;
							numerictotaloutlay += parseFloat(totalAmountoutlay.replace(/[^0-9.-]/g, ""));
							
							/*var clickFunction = "viewProjectDetails('/PMS/projectDetails/"
									+ row.encProjectId + "')";*/
						
							/*tableData += '<tr><td class="font_14">'+ row.groupName +  '</td><td><p style="color: #1a7dc4;" class="font_14">'+ row.proposalTitle +'</p></td> ';*/
							//Added by devesh on 3/8/23 to display proposal details on click in proposal tiles
							tableData += '<tr><td><a href="#" style="color: #1a7dc4;" class="font_14" onclick="viewProjectDetails(\'/PMS/mst/proposalDetails/' + row.encApplicationId + '\')">'+ row.proposalTitle +'</a></td> ';
							
							tableData += ' <td><p class="font_14 orange"><i>'+row.strClientName+''+row.numRoleId+'</i></p></td> ';
							
							tableData += ' <td class="font_14 text-right">'+ row.dateOfSubmission +  '</td> ';
							tableData += ' <td class="font_14 text-right">'+ row.duration +  ' months </td> ';
							
							if(row.receivedProjectStatus=='Yes'){
								
									tableData += '<td class="font_14 text-center"> <a title="Click to View Project Details" onclick=openProjectDetails("'+row.encApplicationId+'")>'+ row.receivedProjectStatus + ' </a></td>';
							}
							else{
								tableData += ' <td class="font_14 text-center">'+ row.receivedProjectStatus +  '</td> ';
							}
							
							tableData += ' <td class="font_14 text-right"> <input type="hidden" id="hiddenProjectCost_'+row.encApplicationId+'" value='+row.encApplicationId+' /> <span id="projectCost_'+row.encApplicationId+'">'
							+ row.strProposalCost + '</span></td>';
							// added the strtotalproposalcost by varun 
			                   tableData += ' <td class="font_14 text-right"> <input type="hidden" id="hiddenProjectCost_'+row.encApplicationId+'" value='+row.encApplicationId+' /> <span id="projectCost_'+row.encApplicationId+'">'
								+ row.strProposalTotalCost + '</span></td>';
			                //Added button for proposal history by devesh on 27/7/23
							/*tableData += ' <td class="font_14 text-center"> <button type="button" style="font-size: 12px; border-radius: 5px; background-color: #1a7dc4; color: #ffffff;" onclick="viewProposalHistory(\'' + row.encApplicationId + '\')">View Proposal History </button>  </td> </tr>';*/
			                tableData += ' <td class="font_14 text-center"> <a href="#" data-toggle="tooltip" data-placement="top" title="Click here to view proposal history" onclick="viewProposalHistory(\'' + row.encApplicationId + '\')"><img src="/PMS/resources/app_srv/PMS/global/images/proposal_log.png" alt="Proposal History Icon" width="28" height="28"></a> </td> </tr>';
							//End of button
							totalAmount += row.numProposalAmountLakhs;
							totalConvertedToProjCost +=row.totalProjectCost;
							convertedCount+=row.numCountOfConverted;
							
						}	
						}
						
						$('#newProposals_dataTable').append(tableData); 
						var foot = $("#newProposals_dataTable").find('tfoot');
						 if(foot.length){
							 $("#newProposals_dataTable tfoot").remove();
						 }
						 var roleId = $("#roleId1").text();
						if(roleId==15 || roleId==4){
							
						if(totalAmount >0){
							/*var amt1= response.length +" " + " ( " +convertAmountToINR(totalAmount) + " Lakhs "+ "  )";*/
							var amt2=convertedCount +" " + " ( " + convertAmountToINR(totalAmount)+ " Lakhs "+ " )";
							 $("#totalProCost").text(amt2);
							 foot = $('<tfoot class="datatable_tfoot" style="background: #1580d0;">').appendTo("#newProposals_dataTable"); 
							// numerictotaloutlay td declare to sum the totaloutlay by varun 
							    /*foot.append('<tr> <td></td><td></td><td></td> <td></td><td></td><td class="bold text-right">Total</td> <td class="bold text-right amount-cell">'+convertAmountToINR(totalAmount)+' Lakhs </td><td class="bold text-right amount-cells">'+convertAmountToINR(numerictotaloutlay)+' Lakhs </td></tr>');*/
							  //Added to span tfoot across 8 columns by devesh on 2/8/23
							 	foot.append('<tr> <td></td><td></td> <td></td><td></td><td class="bold text-right">Total</td> <td class="bold text-right amount-cell">'+convertAmountToINR(totalAmount)+' Lakhs </td><td class="bold text-right amount-cells">'+convertAmountToINR(numerictotaloutlay)+' Lakhs </td><td></td></tr>');
						}
						if(totalConvertedToProjCost>0){
							$("#projRec").show();
							var amt2=convertedCount +" " + " ( " + convertAmountToINR(totalConvertedToProjCost)+ " Lakhs "+ " )";
							$("#totalConvCost").text(amt2);
						}
						else{
							
							$("#projRec").hide();
						}
						}
						else{
							
							if(totalAmount >0){
								var amt1= response.length +" " + " ( " +convertAmountToINR(totalAmount) + " Lakhs "+ "  )";
								
								 $("#totalProCost").text(amt1);
								 foot = $('<tfoot class="datatable_tfoot" style="background: #1580d0;">').appendTo("#newProposals_dataTable"); 
								// numerictotaloutlay td declare to sum the totaloutlay by varun 
								    /*foot.append('<tr> <td></td><td></td><td></td> <td></td><td></td><td class="bold text-right">Total</td> <td class="bold text-right amount-cell">'+convertAmountToINR(totalAmount)+' Lakhs </td><td class="bold text-right amount-cells">'+convertAmountToINR(numerictotaloutlay)+' Lakhs </td></tr>');*/
								  //Added to span tfoot across 8 columns by devesh on 2/8/23
								 	foot.append('<tr> <td></td><td></td> <td></td><td></td><td class="bold text-right">Total</td> <td class="bold text-right amount-cell">'+convertAmountToINR(totalAmount)+' Lakhs </td><td class="bold text-right amount-cells">'+convertAmountToINR(numerictotaloutlay)+' Lakhs </td><td></td></tr>');
							}
							if(totalConvertedToProjCost>0){
								$("#projRec").show();
								var amt2=convertedCount +" " + " ( " + convertAmountToINR(totalConvertedToProjCost)+ " Lakhs "+ " )";
								$("#totalConvCost").text(amt2);
							}
							else{
								
								$("#projRec").hide();
							}
							
						}
						var  table= $('#newProposals_dataTable').DataTable( {
						
							  dom: 'Bfrtip',	
							  buttons: [
							             'excel', 'pdf', 'print'
							        ],
							        //Added by devesh on 03-11-23 to sort table according to date
							        "columnDefs": [
							                       {
							                         "type": "datetime-moment",
							                         "targets": 2, // Assuming the 3rd column is the date column (0-based index).
							                         "render": function (data, type, row) {
							                           if (type === "sort") {
							                             return moment(data, "DD/MM/YYYY").format("YYYY-MM-DD");
							                           }
							                           return data;
							                         }
							                       }
							                     ],
							                     "order": [[2, "desc"]]
									//End of Sorting      
				        
				        
				    } );
					 
					
						
						$('#newProposals_dataTable .filters th[class="comboBox"]').each( function ( i ) {
					        var colIdx=$(this).index();
					            var select = $('<select style="width:100%" ><option value="">All</option></select>')
					                .appendTo( $(this).empty() )
					                .on( 'change', function () {
					                 var val = $.fn.dataTable.util.escapeRegex(
					                                $(this).val()
					                            );
					                 table.column(colIdx)
					                        .search( val ? '^'+val+'$' : '', true, false)
					                        .draw();
					              // call the below function getSelectedColumnValues and getSelectedProposalValues by varun 
					                 getSelectedColumnValues(table,colIdx);
					                 getSelectedProposalValues(table, colIdx)
					                } );
					     
					            table.column(colIdx).data().unique().sort().each( function ( d, j ) {
					                select.append( '<option value="'+d+'">'+d+'</option>' )
					            } );
					        } );
						
						// function is used to get the dynamic total proposal submitted vales and project recived values by varun 
						function getSelectedProposalValues(table, colIdx) {
						    var values = [];
						    table.rows({ search: 'applied' }).every(function () {
						        var data = this.data();
						        values.push(data[5]+"%"+data[6]);
						    });
						    performgroupfilter(values);
						    return values;
						}
						function performgroupfilter(values) {
						    var totalProjects = values.length;
						    var noCount = 0;
						    var totalCostInLakhs = 0;
						    var totalCostInLakhsC = 0;
						    for (var i = 0; i < values.length; i++) {
						        var parts = values[i].split('%');
						        if (parts.length === 2) {
						            if (parts[0].trim() === "No") {
						                noCount++;
						                var costMatch11 = parts[1].split('&nbsp;');
						                var costMatch12 = costMatch11[1].split('Lakhs');
						                if (costMatch12) {
						                    totalCostInLakhsC += parseFloat(costMatch12[0]);
						                }
						            }
						            var costMatch = parts[1].match(/₹\s*([\d.]+)\s*Lakhs/);
						            var costMatch1 = parts[1].split('&nbsp;');
						            var costMatch2 = costMatch1[1].split('Lakhs');
						            if (costMatch2) {
						                totalCostInLakhs += parseFloat(costMatch2[0]);
						            }
						        }
						    }
						    var amt_1= totalProjects +" " + " ( " +convertAmountToINR(totalCostInLakhs) + " Lakhs "+ "  )";
						    console.log("Total Submitted:"+amt_1);
						    var rCount = totalProjects-noCount;
						    var rCost = totalCostInLakhs-totalCostInLakhsC;
						    var amt_2=rCount +" " + " ( " + convertAmountToINR(rCost)+ " Lakhs "+ " )";
						    console.log("Total Received:"+amt_2);
						    
						    $('#totalProCost').text(amt_1);
						    
						    $('#totalConvCost').text(amt_2);
						}

		                 // function is used for get the CDAC outlay and total outlay while filtering the group name by varun 
						function getSelectedColumnValues(table, colIdx) {
						    var values = [];
						    table.rows({ search: 'applied' }).every(function () {
						        var data = this.data();
						        values.push(data[6]+"%"+data[7]);
						        console.log("data:"+data);
						    });
						    performCalculations(values);
						    
						}
						function performCalculations(values) {
						    var totalProjects = values.length;
						    var noCount = 0;
						    var totalCostInLakhs = 0;
						    var totalCostInLakhsC = 0;
						    for (var i = 0; i < values.length; i++) {
						        var parts = values[i].split('%');
					            var costMatch1 = parts[1].split('&nbsp;');
					            var costMatch2 = costMatch1[1].split('Lakhs');
					            if (costMatch2) {
					                totalCostInLakhs += parseFloat(costMatch2[0]);
					            }
					            
					            var costMatch3 = parts[0].split('&nbsp;');
					            var costMatch4 = costMatch3[1].split('Lakhs');
					            if (costMatch4) {
					            	totalCostInLakhsC += parseFloat(costMatch4[0]);
					            }
						    }
						    
						    var amt_1 = convertAmountToINR(totalCostInLakhsC) + " Lakhs ";
						    $('.amount-cell').text(amt_1); // Update all elements with class "amount-cell"

						    var amt_2 = convertAmountToINR(totalCostInLakhs) + " Lakhs ";
						    $('.amount-cells').text(amt_2);
						   
						}
						

						 // Setup - add a text input
				       $('#newProposals_dataTable .filters th[class="textBox"]').each( function () {                 
				           $(this).html( '<div class="lighter"><input type="text"  style="width:100%" /></div>' );

				       } );

		               // DataTable
		               var table = $('#newProposals_dataTable').DataTable();
				       
				       table.columns().eq( 0 ).each( function ( colIdx ) {
				           $( 'input', $('.filters th')[colIdx] ).on( 'keyup change', function () {
				               table
				                           .column( colIdx )
				                           .search( this.value )
				                           .draw() ;
				                   
				                                           } );
				} );
						    

					},
					error : function(e) {
						// $('#RecurringManpowerAmt').val(0);
						alert('Error: ' + e);
					}
				});
					
			}
			}
		
		$( function() {
			 var maxDate = new Date(2024,11, 31); // changes in proposal year 2024 
			  var dateFormat = "dd/mm/yy",
			    from = $( "#fromProposal" )
			      .datepicker({
			    	dateFormat: 'dd/mm/yy', 
			  	    changeMonth: true,
			  	    changeYear:true,
			  	    maxDate: maxDate,
			  	    minDate : '-5Y'
			      })
			      .on( "change", function() {
			        to.datepicker( "option", "minDate", getDate( this ) );
			     // reset the select month years zero by varun 
				      $('#months').val(0);
			      }),
			    to = $( "#toProposal" ).datepicker({
			      dateFormat: 'dd/mm/yy', 
			      changeMonth: true,
			      changeYear:true,
			      maxDate: maxDate,
			      minDate : '-5Y'
			    })
			    .on( "change", function() {
			      from.datepicker( "option", "maxDate", getDate( this ) );
			    });

			 
			  function getDate( element ) {
				    var date;
				    try {
				      date = $.datepicker.parseDate( dateFormat, element.value );
				    } catch( error ) {
				      date = null;
				    }

				    return date;
				  }
				});
		
		function initializeNewProposals() {
			newProposalsTable();
		}
		
		function calculateDates(selValue,fromId,toId,btnIdOrClass,type){
			var d = new Date();
			
			var lastMonth = new Date();
			lastMonth.setMonth(lastMonth.getMonth());//Bhavesh [17-10-23] changed (lastMonth.getMonth() - 1) to (lastMonth.getMonth()) to get current month
			var durationBefore=selValue;
			d.setMonth(d.getMonth() - durationBefore);
			 var lastDayOfLastMonth=lastMonth.getDate();/*lastday(lastMonth.getFullYear(),lastMonth.getMonth());*/ //Bhavesh [17-10-23] changed lastday(lastMonth.getFullYear(),lastMonth.getMonth()) to lastMonth.getDate() to get the current Date
			 var fromMonth=d.getMonth()+1;
			 var toMonth=lastMonth.getMonth()+1;
			 fromMonth=fromMonth+"";
			 toMonth=toMonth+"";
			 lastDayOfLastMonth=lastDayOfLastMonth+"";
			 if(fromMonth.length==1)
			 {
				 fromMonth="0"+fromMonth; 
			 }	 
			 if(toMonth.length==1)
				{ 
				 toMonth="0"+toMonth;
				}
			if(selValue!=0)
			{
				$("#"+fromId).val("01"+"/"+fromMonth+"/"+d.getFullYear());
				$("#"+toId).val(lastDayOfLastMonth+"/"+toMonth+"/"+lastMonth.getFullYear());
				
			}
			else
				{
					$("#"+fromId).val("");
					$("#"+toId).val("");
					
				}
			if(type==1)
			$( "#"+btnIdOrClass ).trigger( "click" );	
			else	
			$( "."+btnIdOrClass ).trigger( "click" );
			
			
		}
		
		// below function is used for restore the table data 
		var isMaximized = false;
	    function togglepmoprop() {
	    	  var myModal = document.getElementById("myProp");
	    	  
	    	  if (isMaximized) {
	    	    myModal.classList.remove("maximized");
	    	    document.body.classList.remove("modal-open");
	    	    document.getElementById('dash-newProposalList-modal').style.height = '';
	    	    document.getElementById('dash-newProposalList-modal').style.width = '';
	    	  } else {
	    	    myModal.classList.add("maximized");
	    	    document.body.classList.add("modal-open");

	    	    var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	    	    var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth; 
	    	    var modal = document.getElementById('dash-newProposalList-modal');
	    	    modal.style.height = (windowHeight * 0.75) + 'px'; 
	    	    modal.style.width = (windowWidth * 0.98) + 'px'; 
	    	    modal.style.transformOrigin = 'center';
	    	  }

	    	  isMaximized = !isMaximized; 

	    	  var btn = document.getElementsByClassName('close-btn')[0];
	    	  var icon = btn.getElementsByTagName('i')[0];
	    	  
	    	  if (icon.classList.contains('fa-window-maximize')) {
	    	    // Change maximize to restore
	    	    icon.classList.remove('fa-window-maximize');
	    	    icon.classList.add('fa-window-restore');
	    	  } else {
	    	    // Change restore to maximize
	    	    icon.classList.remove('fa-window-restore');
	    	    icon.classList.add('fa-window-maximize');
	    	  }
	    	}
	    function restorepropSize() {
	    	  var myModal = document.getElementById("myProp");
	    	  myModal.classList.remove("maximized");
	    	  document.body.classList.remove("modal-open");
	    	  document.getElementById('dash-newProposalList-modal').style.height = '';
	    	  document.getElementById('dash-newProposalList-modal').style.width = '';
	    	}
          function restorepmoprop(){
	    	 isMaximized = true;
	    	$("#months").val("0");
	    	 $("#fromProposal").val("");
	    	$("#toProposal").val("");
	    	 
	    	const today = new Date();
	        const year = today.getFullYear();
	        const firstDayOfYear = new Date(year, 0, 1);

	        const dd = String(firstDayOfYear.getDate()).padStart(2, '0');
	        const mm = String(firstDayOfYear.getMonth() + 1).padStart(2, '0'); // January is 0
	        const yyyy = firstDayOfYear.getFullYear();

	        const fromDate = dd + "/" + mm + "/" + yyyy;
	        const dd1 = String(today.getDate()).padStart(2, '0');
	        const mm1 = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
	        const yyyy1 = today.getFullYear();

	        const toDate = dd1 + "/" + mm1 + "/" + yyyy1;
	        console.log(toDate);
	        var startRange = dd + "/" + mm + "/" + yyyy;
	    	  var endRange = dd1 + "/" + mm1 + "/" + yyyy1;
	    	  if(!startRange){
	    		  sweetSuccess('Attention','Please select Start Range');
	    		  return false;
	    	  }
	    	  var selectedRange = startRange;
	    	  if(endRange){
	    		  selectedRange = selectedRange +' to '+endRange;
	    	  }
	    	  $('#asOnDateProposals').text(selectedRange);
	    	  
	    	  //alert('Called');
	    	  newProposalsTable();
	    	  $('#asOnDateProposals').text(fromDate);
	    	  $("#asOnDateProposals1").text(fromDate);
	    	 togglepmoprop();
	    	 restorepropSize();
	    	
	    }    
	     
	     $(document).ready(function() {
	    	 newProposalsTable();
			});

	     
	   //Function for new Projects added by varun on 11-10-2023
	     function newProjectsTable(){
	     var groupColumn = 2;
	     var startDate = null;
	     var endDate = null;
	     var selectedDateRange = $('#asOnDateProjects').text().trim();

	     $('#asOnDateProjects1').text(selectedDateRange);
	     if(selectedDateRange){
	     	if(selectedDateRange.includes("to")){
	     		var inputArray = selectedDateRange.split('to');
	     		if(inputArray.length >= 2){
	     			startDate = inputArray[0].trim();
	     			endDate = inputArray[1].trim();
	     		}else if(inputArray.length == 1){
	     			startDate = inputArray[0].trim();				
	     		}
	     	}else{
	     		startDate = selectedDateRange;		
	     	}		
	     }

	      if(startDate){	

	   var tableData = '';
	     	$.ajaxRequest.ajax({
	     		type : "POST",
	     		url : "/PMS/mst/getNewProjectsDetail",
	     		data:{
	     			"startDate":startDate,
	     			"endDate":endDate
	     		},
	     		success : function(response) {
	     			/*
	     				$('#newProjects_dataTable_PL').DataTable().clear().destroy();
	     				$('#newProjects_dataTable_GC').DataTable().clear().destroy();
	     				$('#newProjects_dataTable_HOD').DataTable().clear().destroy();
	     				$('#newProjects_dataTable_PMO').DataTable().clear().destroy();
	     			*/
	     			$('#newProjects_dataTable').DataTable().clear().destroy();
	     			
	     			if(response){
	     				$('#newProjectsOnDate').text(response.length); 
	     			}else{
	     				$('#newProjectsOnDate').text(0); 
	     			}
	     			
	     			var totalAmount = 0;
	     			for (var i = 0; i < response.length; i++) {
	     				var row = response[i];	

	     				var mouDate=row.strMouDate;
	     				var workorderDate= row.strWorkOrderDate;
	     				if(row.strMouDate==null){
	     					mouDate='';
	     				}
	     				if(row.strWorkOrderDate==null){
	     					workorderDate='';
	     				}
	     				var strReferenceNumber=row.strReferenceNumber;
	     				if(!strReferenceNumber){
	     					strReferenceNumber='';
	     					tableData+='<tr style="color:#800080">'
	     				}else{
	     					tableData += '<tr style="color:#1578c2">'
	     				}
	     				var clickFunction = "viewProjectDetails('/PMS/projectDetails/"
	     						+ row.encProjectId + "')";
	     			
	     				if(!strReferenceNumber){
	     					tableData += '<td> <a class="font_14" style="color:#800080" title="Click to View Complete Information" onclick='+clickFunction+'>'
	     					+ row.strProjectName + ' </a><p class="bold blue font_14 text-left">'+ strReferenceNumber+'</p></td>';
	     				}else{
	     					tableData += '<td> <a class="font_14" title="Click to View Complete Information" onclick='+clickFunction+'>'
	     					+ row.strProjectName + ' </a><p class="bold blue font_14 text-left" style="color:#1578c2">'+ strReferenceNumber+'</p></td>';
	     				}
	     				
	     				
	     				if(!strReferenceNumber){
	     					tableData += '<td><p class="font_14" style="color:#800080"><i>' + row.strClientName + '</i></p></td><td class="font_14 text-right">';
	     				}else{
	     					tableData += '<td><p class="font_14" style="color:#1578c2"><i>' + row.strClientName + '</i></p></td><td class="font_14 text-right">';
	     				}
	     						
	     				

	     				if (mouDate || workorderDate) {
	     					var EmptyDash ="-- Not Available --";
	     					if(mouDate){
	     						tableData += mouDate;
	     						if(workorderDate){
	     							tableData += '  <i class="fas fa-grip-lines-vertical"></i>  '+workorderDate;
	     						}else{
	     							tableData += '  <i class="fas fa-grip-lines-vertical"></i>  '+EmptyDash;
	     						}
	     					}else{
	     						tableData += EmptyDash;
	     						if(workorderDate){
	     							tableData += '  <i class="fas fa-grip-lines-vertical"></i>  '+workorderDate;
	     						}else{
	     							tableData += '  <i class="fas fa-grip-lines-vertical"></i>  '+EmptyDash;
	     						}
	     					}
	     				}

	     				tableData += '</td> <td class="font_14 text-right">'+ row.startDate +  '</td> ';
	     				tableData += ' <td class="font_14 text-right">'+ row.endDate +  '</td> ';	
	     				tableData += ' <td class="font_14 text-right"> <span id="projectCost_'+row.encProjectId+'">'
	     				+ row.strProjectCost + '</span></td>';
	     	
	     				totalAmount += row.numProjectAmountLakhs;
	     				
	     				if (row.workflowModel && row.workflowModel.strActionPerformed) {
	     					if (row.workflowModel.strActionPerformed.includes("Converted Proposal to Project") || row.workflowModel.strActionPerformed.includes("PL")){
	     				    	tableData += ' <td class="font_14 text-center">Pending At PL</span></td> </tr>';
	     				    }else if (row.workflowModel.strActionPerformed.includes("HOD")) {
	     				    	tableData += ' <td class="font_14 text-center">Pending At HOD</span></td> </tr>';
	     				    }else if (row.workflowModel.strActionPerformed.includes("GC")) {
	     				    	tableData += ' <td class="font_14 text-center">Pending At GC</span></td> </tr>';
	     				    } else if (row.workflowModel.strActionPerformed.includes("PMO")) {
	     				    	tableData += ' <td class="font_14 text-center">Pending At PMO</span></td> </tr>';
	     				    }
	     				}
	    
	     			}
	     		
	     			
	     			$('#newProjects_dataTable').append(tableData);
	     			var ReceivedAmt= response.length +" " + " ( " +convertAmountToINR(totalAmount) + " Lakhs "+ "  )";
	     			$('#totalProjectReceivedCost').text(ReceivedAmt);
	     			
	     			var  table= $('#newProjects_dataTable').DataTable( {
	     				  dom: 'Bfrtip',	
	     				  buttons: [
	     				             'excel', 'pdf', 'print'
	     				        ],	                
	     			});

	     			$('#newProjects_dataTable .filters th[class="comboBox"]').each( function ( i ) {
	     		        var colIdx=$(this).index();
	     		            var select = $('<select style="width:100%" ><option value="">All</option></select>')
	     		                .appendTo( $(this).empty() )
	     		                .on( 'change', function () {
	     		                 var val = $.fn.dataTable.util.escapeRegex(
	     		                                $(this).val()
	     		                            );
	     		                 table.column(colIdx)
	     		                        .search( val ? '^'+val+'$' : '', true, false)
	     		                        .draw();
	     		                } );
	     		            	table.column(colIdx).data().unique().sort().each( function ( d, j ) {
	     			                select.append( '<option value="'+d+'">'+d+'</option>' )
	     			            } );
	     		        });
	     				$('#newProjects_dataTable .filters th[id="projectStatusCol"]').each( function ( i ) {
	     			        var colIdx=$(this).index();
	     			            var select = $('<select style="width:100%" ><option value="">All</option></select>')
	     			                .appendTo( $(this).empty() )
	     			                .on( 'change', function () {
	     			                 var val = $.fn.dataTable.util.escapeRegex(
	     			                                $(this).val()
	     			                            );
	     			                 table.column(colIdx)
	     			                        .search( val ? '^'+val+'$' : '', true, false)
	     			                        .draw();
	     			                } );
	     			            
	     			            	var projectStatus = [
	     			                               "Pending At PL",
	     			                               "Pending At HOD",
	     			                               "Pending At GC",
	     			                               "Pending At PMO"
	     			                               ];
	     			            	projectStatus.forEach(function (d) {
	     	                         select.append('<option value="' + d + '">' + d + '</option>');
	     	                     });
	     			        });
	     	     var table = $('#newProjects_dataTable').DataTable();
	     	     table.columns().eq( 0 ).each( function ( colIdx ) {
	     	           $( 'input', $('.filters th')[colIdx] ).on( 'keyup change', function () {
	     	               table
	     	                           .column( colIdx )
	     	                           .search( this.value )
	     	                           .draw() ;  
	     	                                           });
	     	     	});	

	     
	     		}
	     	});
	     }
	     }
	     
	     $( function() {
	    	 var maxDate = new Date(2024, 11, 31); // changes in project recived year 2024 
	    	  var dateFormat = "dd/mm/yy",
	    	    from = $( "#from" )
	    	      .datepicker({
	    	    	dateFormat: 'dd/mm/yy', 
	    	  	    changeMonth: true,
	    	  	    changeYear:true,
	    	  	    maxDate: maxDate,
	    	  	    minDate : '-5Y'
	    	      })
	    	      .on( "change", function() {
	    	        to.datepicker( "option", "minDate", getDate( this ) );
	    	      }),
	    	    to = $( "#to" ).datepicker({
	    	      dateFormat: 'dd/mm/yy', 
	    	      changeMonth: true,
	    	      changeYear:true,
	    	      maxDate: maxDate,
	    	      minDate : '-5Y'
	    	    })
	    	    .on( "change", function() {
	    	      from.datepicker( "option", "maxDate", getDate( this ) );
	    	    });

	    	 
	    	  
	    	  function getDate( element ) {
	    	    var date;
	    	    try {
	    	      date = $.datepicker.parseDate( dateFormat, element.value );
	    	    } catch( error ) {
	    	      date = null;
	    	    }

	    	    return date;
	    	  }
	    	});
	     
	     function initializeNewProjects() {
	    		newProjectsTable();
	    	}
	     
	
	      var isMaximized = false;
	     function toggleProjects() {
	     	  var myModal = document.getElementById("myProject");
	     	  
	     	  if (isMaximized) {
	     	    myModal.classList.remove("maximized");
	     	    document.body.classList.remove("modal-open");
	     	    document.getElementById('dash-newProjectList-modal').style.height = '';
	     	    document.getElementById('dash-newProjectList-modal').style.width = '';
	     	  } else {
	     	    myModal.classList.add("maximized");
	     	    document.body.classList.add("modal-open");

	     	    var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	     	    var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth; 
	     	    var modal = document.getElementById('dash-newProjectList-modal');
	     	    modal.style.height = (windowHeight * 0.75) + 'px'; 
	     	    modal.style.width = (windowWidth * 0.98) + 'px'; 
	     	    modal.style.transformOrigin = 'center';
	     	  }

	     	  isMaximized = !isMaximized; 

	     	  var btn = document.getElementsByClassName('close-btn')[0];
	     	  var icon = btn.getElementsByTagName('i')[0];
	     	  
	     	  if (icon.classList.contains('fa-window-maximize')) {
	     	    // Change maximize to restore
	     	    icon.classList.remove('fa-window-maximize');
	     	    icon.classList.add('fa-window-restore');
	     	  } else {
	     	    // Change restore to maximize
	     	    icon.classList.remove('fa-window-restore');
	     	    icon.classList.add('fa-window-maximize');
	     	  }
	     	}
	     function restoreProjectsSize() {
	     	  var myModal = document.getElementById("myProject");
	     	  myModal.classList.remove("maximized");
	     	  document.body.classList.remove("modal-open");
	     	  document.getElementById('dash-newProjectList-modal').style.height = '';
	     	  document.getElementById('dash-newProjectList-modal').style.width = '';
	     	}

	     	function restoreProjects(){
	    	  isMaximized = true;
	     	$(".listprojects").val("0");
	     	 $("#from").val("");
	     	$("#to").val("");
           /*-----------------------------  Collapse all the Project received table [04-08-2023] --------------------*/
	           $('#multiCollapse10, #multiCollapse11,#multiCollapse12,#multiCollapse13').filter('.in').collapse('hide');
	           /*-------------------------------------------------------------------------------------------------------*/
	     	//$("#myContent").load(location.href + " #myContent");
	         const today = new Date();
	         const year = today.getFullYear();
	         const firstDayOfYear = new Date(year, 0, 1);

	         const dd = String(firstDayOfYear.getDate()).padStart(2, '0');
	         const mm = String(firstDayOfYear.getMonth() + 1).padStart(2, '0'); // January is 0
	         const yyyy = firstDayOfYear.getFullYear();

	         const fromDate = dd + "/" + mm + "/" + yyyy;
	        


	         const dd1 = String(today.getDate()).padStart(2, '0');
	         const mm1 = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
	         const yyyy1 = today.getFullYear();

	         const toDate = dd1 + "/" + mm1 + "/" + yyyy1;
	      
	         var startRange = dd + "/" + mm + "/" + yyyy;
	     	  var endRange = dd1 + "/" + mm1 + "/" + yyyy1;
	     	  if(!startRange){
	     		  sweetSuccess('Attention','Please select Start Range');
	     		  return false;
	     	  }
	     	  var selectedRange = startRange;
	     	  if(endRange){
	     		  selectedRange = selectedRange +' to '+endRange;
	     	  }
	     	  $('#asOnDateProjects').text(selectedRange);
	     	  
	     	  //alert('Called');
	     	  newProjectsTable();
	     	  $('#asOnDateProjects').text(fromDate);
	     	  $("#asOnDateProjects1").text(fromDate);
	     	 toggleProjects();
	     	restoreProjectsSize();
	     	
	     }  
	     	
	 $(document).ready(function() {
	     		newProjectsTable();
	     		setUnderClosureFinanceTableProperties();
				});
	 
	 //  restore for financial closure request by varun on 11-10-2023
	 var isMaximized3 = false;
	 function togglePending3() {
	 	  var myModal = document.getElementById("myPending3");
	 	  if (isMaximized3) {
	 	    myModal.classList.remove("maximized");
	 	    document.body.classList.remove("modal-open");
	 	    document.getElementById('dash-closure-pending-modal3').style.height = '';
	 	    document.getElementById('dash-closure-pending-modal3').style.width = '';
	 	  } else {
	 	    myModal.classList.add("maximized");
	 	    document.body.classList.add("modal-open");
	 	    var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	 	    var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth; 
	 	    var modal = document.getElementById('dash-closure-pending-modal3');
	 	    modal.style.height = (windowHeight * 0.75) + 'px'; 
	 	    modal.style.width = (windowWidth * 0.98) + 'px'; 
	 	    modal.style.transformOrigin = 'center';
	 	  }

	 	  isMaximized3 = !isMaximized3; 
	 	  var btn = document.getElementsByClassName('close-btn')[0];
	 	  var icon = btn.getElementsByTagName('i')[0];
	 	  
	 	  if (icon.classList.contains('fa-window-maximize')) {
	 	    icon.classList.remove('fa-window-maximize');
	 	    icon.classList.add('fa-window-restore');
	 	  } else {
	 	    icon.classList.remove('fa-window-restore');
	 	    icon.classList.add('fa-window-maximize');
	 	  }
	 }
	 function restorePendingSize3() {
	 	  var myModal = document.getElementById("myPending3");
	 	  myModal.classList.remove("maximized");
	 	  document.body.classList.remove("modal-open");
	 	  document.getElementById('dash-closure-pending-modal3').style.height = '';
	 	  document.getElementById('dash-closure-pending-modal3').style.width = '';
	 }
	 function restorepending3(){
	 	   isMaximized3 = true;
	 		togglePending3();
	 		restorePendingSize3();
	 	 	$('#exampleUnderClosureFinance').dataTable().fnDestroy();
	 	 	setUnderClosureFinanceTableProperties();	
	 }
	 
	 // function for set the table for financial request by varun on 11-10-2023
	 function setUnderClosureFinanceTableProperties(){				        
	 		var table= $('#exampleUnderClosureFinance').DataTable( {
	 			dom: 'Bfrtip',		       
	 	        "ordering": false,
	 	        "paging":   false,
	 	        buttons: [
	 	             'excel', 'pdf', 'print'
	 	        ],
	 		"columnDefs": [ {
	 	            "orderable": false,
	             "targets": 0
	         } ],
	         "order": [[ 1, 'asc' ]]
	     });	
	 		table.on('order.dt search.dt', function () {
	 			table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
	 		           cell.innerHTML = i+1;
	 		           table.cell(cell).invalidate('dom');
	 		     });
	 		}).draw();
	 		$('#exampleUnderClosureFinance .filters th[class="comboBox"]').each( function ( i ) {
	 	        var colIdx=$(this).index();
	 	            var select = $('<select style="width:100%" ><option value="">All</option></select>')
	 	                .appendTo( $(this).empty() )
	 	                .on( 'change', function () {
	 	                 var val = $.fn.dataTable.util.escapeRegex(
	 	                                $(this).val()
	 	                            );
	 	                           
	 	                 table.column(colIdx)
	 	                        .search( val ? '^'+val+'$' : '', true, false)
	 	                        .draw();
	 	                } );
	 	     
	 	            table.column(colIdx).data().unique().sort().each( function ( d, j ) {
	 	                select.append( '<option value="'+d+'">'+d+'</option>' )
	 	            } );
	 	        });
	 }
	 
	 function closedProjectsTable(){
			//alert("closedProjectsTable");
			var groupColumn = 2;
			var startDate = null;
			var endDate = null;
			var selectedDateRange = $('#asOnDateClosedProjects').text().trim();
			//console.log("selectedDateRange inside function"+selectedDateRange);
			$('#asOnDateClosedProjects1').text(selectedDateRange);
			if(selectedDateRange){
				if(selectedDateRange.includes("to")){
					var inputArray = selectedDateRange.split('to');
					if(inputArray.length >= 2){
						startDate = inputArray[0].trim();
						endDate = inputArray[1].trim();
					}else if(inputArray.length == 1){
						startDate = inputArray[0].trim();				
					}
				}else{
					startDate = selectedDateRange;		
				}		
			}
			if(startDate){		
				//------------------------------------- Add Some Columns For Closed Projects Tile [12-10-2023] ----------------------------------	
				 $('#closedProjects_dataTable').DataTable().clear().destroy();
				 var tableData = '';
					$.ajaxRequest.ajax({
						type : "POST",
						url : "/PMS/mst/getAllClosedProjectByDate",
						data:{
							"startDate":startDate,
							"endDate":endDate
						},
						success : function(response) {
							console.log("closed list"+response)
							if(response){
								$('#closedProjectsOnDate').text(response.length); 
							}else{
								$('#closedProjectsOnDate').text(0); 
							}
							var totalAmount = 0;
							for (var i = 0; i < response.length; i++) {
								var row = response[i];	
								var strReferenceNumber=row.strReferenceNumber;
								if(!strReferenceNumber){
									strReferenceNumber='';
								}
								
								var rowColor=row.rowColor;

								var clickFunction = "viewProjectDetails('/PMS/projectDetails/"+ row.encProjectId + "')";
								tableData += '<tr style="color:'+rowColor+'"><td class="font_14 text-center">'+ (i+1)+'</td><td><a style="color:'+rowColor+'" class="font_14" title="Click to View Complete Information" onclick='+clickFunction+'>'
										+ row.strProjectName + ' </a><p class="bold font_14 text-left">'+ strReferenceNumber+'<p> </td>';				
								tableData += ' <td><p class="font_14"><i>'+row.strClientName+'</i></p></td><td class="font_16 text-left">'+row.strPLName+'</td> ';
								tableData += ' <td class="font_14 text-center"> <span  class="" >'+ row.startDate+  '</span></td> ';				
								tableData += ' <td class="font_14 text-center">'+ row.endDate+'</td>';
								tableData += ' <td class="font_14 text-center">'+row.projectDuration+'</span></td>';
								tableData += ' <td class="font_14 text-right">'+ row.strTotalCost+  '</span></td>';
								tableData += ' <td class="font_14 text-right">'+ row.strProjectCost+  '</span></td>';
								tableData += ' <td class="font_14 text-right">'+ row.strReceivedAmount+  '</span></td></tr>';
							}
							$('#closedProjects_dataTable').append(tableData); 
							var table= $('#closedProjects_dataTable').DataTable( {
								dom: 'Bfrtip',		       
						        "ordering": false,
						        "paging":   true,
						        buttons: [
						             'excel', 'pdf', 'print'
						        ],
						        "columnDefs": [ {
						            "orderable": false,
					            "targets": 0
					        	} ],
					        	"order": [[ 1, 'asc' ]]
							});	
							table.on('order.dt search.dt', function () {
								table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
							           cell.innerHTML = i+1;
							           table.cell(cell).invalidate('dom');
							     });
							}).draw();
							$('#closedProjects_dataTable .filters th[class="comboBox"]').each( function ( i ) {
						        var colIdx=$(this).index();
						            var select = $('<select style="width:100%" ><option value="">All</option></select>')
						                .appendTo( $(this).empty() )
						                .on( 'change', function () {
						                 var val = $.fn.dataTable.util.escapeRegex(
						                                $(this).val()
						                            );
						                           
						                 table.column(colIdx)
						                        .search( val ? '^'+val+'$' : '', true, false)
						                        .draw();
						                } );
						     
						            table.column(colIdx).data().unique().sort().each( function ( d, j ) {
						                select.append( '<option value="'+d+'">'+d+'</option>' )
						            } );
						        });
						}
					});
				}
				//------------------------------------- END of Closed Projects Tile Table [12-10-2023] ----------------------------------			
			}
	 

	      	
	      	 $(document).ready(function() {
	      		closedProjectsTable();
	      		
					});
	     
	      	 // added below function scrolltotop 
	      	function scrollToTop() {
	      	    window.scrollTo({
	      	        top: 0,
	      	        behavior: 'smooth' 
	      	    });
	      	}


	      	// Attach scrollToTop function to the button's click event
	      	const scrollButton = document.getElementById('testscroll');
	     

	      	scrollButton.addEventListener('click', scrollToTop);
	      	scrollButton1.addEventListener('click', scrollToTop);
	      	scrollButton2.addEventListener('click', scrollToTop);
	      	
	      	
	     

	     