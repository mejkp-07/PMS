function resizeIframe(obj) {
	obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
}
function openIncomeAnotherFilter(){           
	$("#incomeAnotherFilter").toggle();
	$("#incomCustom").toggle();
 }
$(document).ready(function() {		
	/*$("#incomeAnotherFilter").hide();*/
});
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
				/*-------------- Show the Proposal Count with Project Received Count[12-10-2023] -------------------*/
				var proposalReceivedCount=0;
				for (var i = 0; i < response.length; i++) {
					var row = response[i];
					if(row.receivedProjectStatus=="Yes"){
						proposalReceivedCount+=1;
					}
				}
				if(response){
					$('#newProposalsOnDate').text(response.length+" / "+proposalReceivedCount); 
				}else{
					$('#newProposalsOnDate').text(0); 
				}
				/*-------------- END the Proposal Count with Project Received Count[12-10-2023] -------------------*/
				// declare the total amountlay and numerictotaloutlay to get the total outlay by varun
				
				var totalAmount = 0;
				var totalAmountoutlay;
				var totalConvertedToProjCost=0;
				var convertedCount=0;
				var numerictotaloutlay =0;
				for (var i = 0; i < response.length; i++) {
					var row = response[i];
					// sum the totalamouunt lay by varun 
                    totalAmountoutlay =row.strProposalTotalCost;
					numerictotaloutlay += parseFloat(totalAmountoutlay.replace(/[^0-9.-]/g, ""));
					/*var clickFunction = "viewProjectDetails('/PMS/projectDetails/"
							+ row.encProjectId + "')";*/
					/*------- row color [12-10-2023] ----------*/
					var rowColor=""
					if(row.receivedProjectStatus=="Yes"){
						rowColor="#1578c2";
					}else{
						rowColor="#0d9b94";
					}
					/*------- end of row color [12-10-2023] ----------*/
					/*tableData += '<tr><td class="font_14">'+ row.groupName +  '</td><td><p style="color: #1a7dc4;" class="font_14">'+ row.proposalTitle +'</p></td> ';*/
					//Added by devesh on 3/8/23 to display proposal details on click in proposal tiles
					tableData += '<tr style="color:'+rowColor+'"><td class="font_14">'+ row.groupName +  '</td><td><a style="color:'+rowColor+'" class="font_14" onclick="viewProjectDetails(\'/PMS/mst/proposalDetails/' + row.encApplicationId + '\')">'+ row.proposalTitle +'</a></td> ';
					/*tableData +='<td class="font_14 text-right">'+ row.groupName +  '</td>';*/
					tableData += ' <td><p class="font_14"><i>'+row.strClientName+'</i></p></td> ';
					/*tableData += ' <td class="font_14">'+ row.strClientName +  '</td> ';*/
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

				/*if(totalAmount >0){
					tableData +='<tr> <td></td><td></td> <td></td><td></td><td class="bold text-right">Total</td> <td class="bold text-right">'+convertAmountToINR(totalAmount)+' Lakhs </td></tr>';
				}*/
				
				/*$('#newProposals_dataTable').append(tableData);*/  
				
				$('#newProposals_dataTable').append(tableData); 
				/*----------- Comment Footer [12-10-2023] ----------*/
/*				var foot = $("#newProposals_dataTable").find('tfoot');
				 if(foot.length){
					 $("#newProposals_dataTable tfoot").remove();
				 }
*/				
				if(totalAmount >0){
					var amt1= response.length +" " + " ( " +convertAmountToINR(totalAmount) + " Lakhs "+ "  )";
						
					 $("#totalProCost").text(amt1);/*
					 foot = $('<tfoot class="datatable_tfoot" style="background: #1580d0;">').appendTo("#newProposals_dataTable"); 
					// numerictotaloutlay td declare to sum the totaloutlay by varun 
					    foot.append('<tr> <td></td><td></td><td></td> <td></td><td></td><td class="bold text-right">Total</td> <td class="bold text-right amount-cell">'+convertAmountToINR(totalAmount)+' Lakhs </td><td class="bold text-right amount-cells">'+convertAmountToINR(numerictotaloutlay)+' Lakhs </td></tr>');
					//Added to span tfoot across 8 columns by devesh on 2/8/23
					    foot.append('<tr> <td></td><td></td><td></td> <td></td><td></td><td class="bold text-right">Total</td> <td class="bold text-right amount-cell">'+convertAmountToINR(totalAmount)+' Lakhs </td><td class="bold text-right amount-cells">'+convertAmountToINR(numerictotaloutlay)+' Lakhs </td><td></td></tr>');
				*/}
				if(totalConvertedToProjCost>0){
					$("#projRec").show();
					var amt2=convertedCount +" " + " ( " + convertAmountToINR(totalConvertedToProjCost)+ " Lakhs "+ " )";
					$("#totalConvCost").text(amt2);
				}
				else{
					
					$("#projRec").hide();
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
					                         "targets": 3, // Assuming the 3rd column is the date column (0-based index).
					                         "render": function (data, type, row) {
					                           if (type === "sort") {
					                             return moment(data, "DD/MM/YYYY").format("YYYY-MM-DD");
					                           }
					                           return data;
					                         }
					                       }
					                     ],
					                     "order": [[3, "desc"]]
							//End of Sorting      
		       /* "columnDefs": [
		                       { "visible": false, "targets": groupColumn ,"orderable": false, }
		                   ],
		                   "order": [[ groupColumn, 'asc' ]],
		                   "displayLength": 25,
		                   "drawCallback": function ( settings ) {
		                       var api = this.api();
		                       var rows = api.rows( {page:'current'} ).nodes();
		                       var last=null;
		            
		                       api.column(groupColumn, {page:'current'} ).data().each( function ( group, i ) {
		                           if ( last !== group ) {
		                               $(rows).eq( i ).before(
		                                   '<tr class="group"><td colspan="6">'+group+'</td></tr>'
		                               );
		            
		                               last = group;
		                           }
		                       } );
		                   }*/
		        
		    } );
			   /* $('#newProposals_dataTable tbody').on( 'click', 'tr.group', function () {
			        var currentOrder = table.order()[0];
			        if ( currentOrder[0] === groupColumn && currentOrder[1] === 'asc' ) {
			            table.order( [ groupColumn, 'desc' ] ).draw();
			        }
			        else {
			            table.order( [ groupColumn, 'asc' ] ).draw();
			        }
			    } );*/
			
				
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
				        /*console.log("data:"+data);*/
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

//Added to create proposal history modal by devesh on 2/8/23
function viewProposalHistory(encApplicationId) {
    // Perform actions based on the applicationId
    // For example, you can use this ID to open a modal, show more information, etc.
	var encAppId=encApplicationId;
	$('#HistoryTable').DataTable().clear().destroy();
	var tableData = '';
	$.ajax({
		type : "POST",
		url : "/PMS/mst/proposalHistorydetails",
		data : "encId=" + encAppId,
		success : function(response) {
			if(response!=''||response!=null){
				
				for (var i = 0; i < response.length; i++) {
					var row = response[i];
					revCount=response.length-i;
					revcount1= revCount-1;
					//console.log("revcount1.."+revcount1);
					sNo=i+1;
					if(row[3]==null||row[3]==''){
						row[3]='';
						
					}
										
					tableData += '<tr id="row_' + i + '"> <td class="font_16 center">'+sNo+'</td>' 
							+ '<td class="font_16"><a onclick="getHistoryDetails('+row[0]+','+revCount+')"> Rev '+revcount1+'</a></td>'
							+'<td class="font_16">'+row[1] +'</td>'
							+'<td class="font_16">'+row[2]+'</td>'
							
							+'<td class="font_16">'+row[3]+'</td>'
							+'<td class="font_16">'+row[4]+'</td>'
							+'<td class="font_16">'+row[5]+'</td>'
							+'<td class="font_16">'+row[6]+'</td>'
							+'<td class="font_16">'+row[7]+'</td>'
							+'<td class="font_16">'+row[8]+'</td>'
							+'<td class="font_16">'+row[9]+'</td>'
							+'<td class="font_16">'+row[10]+'</td>'
							+'<td class="font_16">'+row[11]+'</td>'							
							+'<td class="font_16">'+row[12]+'</td>'
							+'<td class="font_16">'+(row[13]?row[13].slice(0, 10):'')+'</td>'
							+'<td class="font_16">'+row[14]+'</td>'
							+'<td class="font_16">'+row[15]+'</td>'
							+'<td class="font_16">'+row[16]+'</td>'
							+'<td class="font_16">'+row[17]+'</td>'
							+'<td class="font_16">'+row[18]+'</td>'
							+'<td class="font_16">'+row[19]+'</td>'
							+'<td class="font_16">'+row[20]+'</td>'
							+'<td class="font_16">'+row[21]+'</td>';
							+'</tr>';  
							revCount-1;			
				}

				$('#HistoryTable').append(tableData);

				$('#HistoryTable').DataTable( {
			        "paging":   false,
			        "ordering": false,
			        "info":     false,
			        "filter": false,
			        "scrollX": "100%",
			        "scrollY": "340px"
			    } );
				
				colorRows();
				$('#history').modal('show');
				const columnIndices = findAllColumnsWithSameValueInAllRows(response);

				if (response.length > 0) {
			        if (columnIndices.length > 0) {
			          //console.log('Column indices with the same value in all rows:', columnIndices);
			          removeColumnsFromTable(columnIndices);
			        } else {
			          //console.log('No columns with the same value in all rows.');
			        }
			      } else {
			        // If there are no rows, hide all columns with an index greater than 4
			    	//console.log('No rows in the table.');
			        const table = $('#HistoryTable').DataTable();
			        for (var colIndex = 5; colIndex < table.columns().count(); colIndex++) {
			          table.column(colIndex).visible(false);
			        }
			      }
			
				
			}
			else{
				alert("empty");
			}

		},
		error : function(e) {
			alert('Error: ' + e);			
		}
	});
	/*alert(encAppId);*/
    //encryptionService.dcrypt(applicationId);
}

function colorRows() {
    const rowCount = $('#HistoryTable tbody tr').length;
    const colCount = $('#HistoryTable tbody tr:first td').length;

    for (var rowIndex = 0; rowIndex < rowCount - 1; rowIndex++) {
    	for (var colIndex = 2; colIndex < colCount; colIndex++) {
            // Skip columns 4 and 5
            if (colIndex === 3 || colIndex === 4) {
                continue;
            }

            const currentValue = $('#row_' + rowIndex + ' td:eq(' + colIndex + ')').text();
            const nextValue = $('#row_' + (rowIndex + 1) + ' td:eq(' + colIndex + ')').text();

            const cell = $('#row_' + rowIndex + ' td:eq(' + colIndex + ')');

            if (currentValue !== nextValue) {
                cell.addClass('different-value');
            } else {
                cell.removeClass('different-value');
            }
        }
    }
}

function findAllColumnsWithSameValueInAllRows(response) {
	  if (!response || response.length === 0) {
	    return [];
	  }

	  const referenceRow = response[0];
	  const numColumns = referenceRow.length;
	  const columnIndices = [];

	  for (var colIndex = 0; colIndex < numColumns; colIndex++) {
	    const columnValue = referenceRow[colIndex];
	    let allRowsHaveSameValue = true;

	    for (var rowIndex = 1; rowIndex < response.length; rowIndex++) {
	      if (response[rowIndex][colIndex] !== columnValue) {
	        allRowsHaveSameValue = false;
	        break;
	      }
	    }

	    if (allRowsHaveSameValue) {
	    	if((colIndex+1)>4)columnIndices.push(colIndex+1);
	    }
	  }

	  return columnIndices;
	}

function removeColumnsFromTable(columnIndices) {
	  const table = $('#HistoryTable').DataTable();

	  // Remove the header cells for the columns with the same value
	  for (var i = columnIndices.length - 1; i >= 0; i--) {
	    table.column(columnIndices[i]).visible(false);
	  }
	}

function getHistoryDetails(r,versionNo){
	var numId=r;
	//alert(numId);
	var ver=versionNo;
	//alert(ver);
	openWindowWithPost('POST','/PMS/mst/proposalVersionDetails',{"numVersion":ver,"numId":numId},'_blank');

}
//End of proposal history modal

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
	/*------------------------ Display Project Received Data based on their respective statuses [ 21-08-2023 ] -----------------------------------*/
	/*		 var tableData_PL = '';
			 var tableData_HOD = '';
			 var tableData_GC = '';
			 var tableData_PMO = '';*/
			var tableData = '';
			$.ajaxRequest.ajax({
				type : "POST",
				url : "/PMS/mst/getNewProjectsDetail",
				data:{
					"startDate":startDate,
					"endDate":endDate
				},
				success : function(response) {
					/*$('#newProjects_dataTable_PL').DataTable().clear().destroy();
					$('#newProjects_dataTable_GC').DataTable().clear().destroy();
					$('#newProjects_dataTable_HOD').DataTable().clear().destroy();
					$('#newProjects_dataTable_PMO').DataTable().clear().destroy();*/
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
							tableData += '<td class="font_14">'+ row.strGrouptName +  '</td><td> <a class="font_14" style="color:#800080" title="Click to View Complete Information" onclick='+clickFunction+'>'
							+ row.strProjectName + ' </a><p class="bold blue font_14 text-left">'+ strReferenceNumber+'</p></td>';
						}else{
							tableData += '<td class="font_14">'+ row.strGrouptName +  '</td><td> <a class="font_14" title="Click to View Complete Information" onclick='+clickFunction+'>'
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
			
						tableData += ' <td class="font_14 text-left"> <span id="projectCost_'+row.encProjectId+'">'
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
/*						if (row.workflowModel && row.workflowModel.strActionPerformed) {
						    if (row.workflowModel.strActionPerformed.includes("GC")) {
						    	tableData_GC +=tableData;
						    } else if (row.workflowModel.strActionPerformed.includes("PMO")) {
						    	tableData_PMO +=tableData;
						    }else if (row.workflowModel.strActionPerformed.includes("HOD")) {
						    	tableData_HOD +=tableData;
						    }else if (row.workflowModel.strActionPerformed.includes("Converted Proposal to Project") || row.workflowModel.strActionPerformed.includes("PL")){
						    	tableData_PL +=tableData;
						    }
						}*/
						
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
/*------------------------ End of Display Project Received Data based on their respective statuses -----------------------------------*/					

					//$('#newProjects_dataTable').append(tableData);  // changes in new project filter table on 23-05-23 
					/*$('#newProjects_dataTable_PL').append(tableData_PL);
					$('#newProjects_dataTable_GC').append(tableData_GC);
					$('#newProjects_dataTable_HOD').append(tableData_HOD);
					$('#newProjects_dataTable_PMO').append(tableData_PMO);
					
-------------------------- DataTable Plugins add to Pending At PL Table [04-08-2023] ----------------------------------
				       $('#newProjects_dataTable_PL .filters th[class="textBox"]').each( function () {                 
				           $(this).html( '<div class="lighter"><input type="text"  style="width:100%" /></div>' );
				       });
		               var table = $('#newProjects_dataTable_PL').DataTable();
				       table.columns().eq( 0 ).each( function ( colIdx ) {
				           $( 'input', $('.filters th')[colIdx] ).on( 'keyup change', function () {
				               table
				                           .column( colIdx )
				                           .search( this.value )
				                           .draw() ;
				             });
						});
						
-------------------------- DataTable Plugins add to Pending At HOD Table [04-08-2023] ----------------------------------
				       $('#newProjects_dataTable_HOD .filters th[class="textBox"]').each( function () {                 
				           $(this).html( '<div class="lighter"><input type="text"  style="width:100%" /></div>' );

				       });
		             var table = $('#newProjects_dataTable_HOD').DataTable();
				       table.columns().eq( 0 ).each( function ( colIdx ) {
				           $( 'input', $('.filters th')[colIdx] ).on( 'keyup change', function () {
				               table
				                           .column( colIdx )
				                           .search( this.value )
				                           .draw() ;
							});
					  });
					  
-------------------------- DataTable Plugins add to Pending At GC Table [04-08-2023] ----------------------------------
				       $('#newProjects_dataTable_GC .filters th[class="textBox"]').each( function () {                 
				           $(this).html( '<div class="lighter"><input type="text"  style="width:100%" /></div>' );
				       });
		             var table = $('#newProjects_dataTable_GC').DataTable();
				       table.columns().eq( 0 ).each( function ( colIdx ) {
				           $( 'input', $('.filters th')[colIdx] ).on( 'keyup change', function () {
				               table
				                           .column( colIdx )
				                           .search( this.value )
				                           .draw() ;
									});
					  });
					  
-------------------------- DataTable Plugins add to Pending At PMO Table [04-08-2023] ----------------------------------
				       $('#newProjects_dataTable_PMO .filters th[class="textBox"]').each( function () {                 
				           $(this).html( '<div class="lighter"><input type="text"  style="width:100%" /></div>' );
				       } );
		             var table = $('#newProjects_dataTable_PMO').DataTable();
				       table.columns().eq( 0 ).each( function ( colIdx ) {
				           $( 'input', $('.filters th')[colIdx] ).on( 'keyup change', function () {
				               table
				                           .column( colIdx )
				                           .search( this.value )
				                           .draw() ;
				               });
						});       */              
				}
			});
		}

	 
	/*if(startDate){	
		
	 var tableData = '';
		$.ajaxRequest.ajax({
			type : "POST",
			url : "/PMS/mst/getNewProjectsDetail",
			data:{
				"startDate":startDate,
				"endDate":endDate
			},
			success : function(response) {
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
				
					tableData += '<tr> <td class="font_14">'+ row.strGrouptName +  '</td><td> <a class="font_14" title="Click to View Complete Information" onclick='+clickFunction+'>'
							+ row.strProjectName + ' </a><p class="bold blue font_14 text-left">'+ strReferenceNumber+'</p></td>';
					
					tableData += ' <td class="bold blue font_14 text-right">'+ strReferenceNumber+'</td>';
					tableData += ' <td class="bold blue font_12">'+ row.strClientName+'</td>';	
					tableData += ' <td><p class="font_14 orange"><i>'+row.strClientName+'</i></p></td><td class="font_14 text-right">'+ mouDate +  '</td> ';
					tableData += ' <td class="font_14 text-right">'+ workorderDate +  '</td> ';
					
					tableData += ' <td class="font_14 text-right">'+ row.startDate +  '</td> ';			
					tableData += ' <td class="font_14 text-right"> <span id="projectCost_'+row.encProjectId+'">'
					+ row.strProjectCost + '</span></td> </tr>';
		
					totalAmount += row.numProjectAmountLakhs;
					
					
				}

				if(totalAmount >0){
					tableData +='<tr><td></td><td></td><td></td><td></td> <td class="bold text-right">Total</td> <td class="bold text-right">'+convertAmountToINR(totalAmount)+' Lakhs </td></tr>';
				}
				
				$('#newProjects_dataTable').append(tableData); 
				var foot = $("#newProjects_dataTable").find('tfoot');
				 if(foot.length){
					 $("#newProjects_dataTable tfoot").remove();
				 }
				
				if(totalAmount >0){
								
					 foot = $('<tfoot class="datatable_tfoot" style="background: #1580d0;">').appendTo("#newProjects_dataTable"); 
					    foot.append('<tr><td></td><td></td><td></td><td></td><td></td> <td class="bold text-right">Total</td> <td class="bold text-right">'+convertAmountToINR(totalAmount)+' Lakhs </td></tr>');
				}
				$('#newProjects_dataTable').DataTable( {					
			        dom: 'Bfrtip',			        
			        "ordering": false,
			        "paging":   false,
			        buttons: [
			             'excel', 'pdf', 'print'
			        ],
			      "columnDefs": [
			                       { "visible": false, "targets": groupColumn }
			                   ],
			                   "order": [[ groupColumn, 'asc' ]],
			                   "displayLength": 25,
			                   "drawCallback": function ( settings ) {
			                       var api = this.api();
			                       var rows = api.rows( {page:'current'} ).nodes();
			                       var last=null;
			            
			                       api.column(groupColumn, {page:'current'} ).data().each( function ( group, i ) {
			                           if ( last !== group ) {
			                               $(rows).eq( i ).before(
			                                   '<tr class="group"><td colspan="6">'+group+'</td></tr>'
			                               );
			            
			                               last = group;
			                           }
			                       } );
			                   }
			    });	
				
				 $('#newProjects_dataTable tbody').on( 'click', 'tr.group', function () {
				        var currentOrder = table.order()[0];
				        if ( currentOrder[0] === groupColumn && currentOrder[1] === 'asc' ) {
				            table.order( [ groupColumn, 'desc' ] ).draw();
				        }
				        else {
				            table.order( [ groupColumn, 'asc' ] ).draw();
				        }
				    } );
			
				
				   
				   $('#newProjects_dataTable .filters th[class="textBox"]').each( function () {                 
			           $(this).html( '<div class="lighter"><input type="text"  style="width:100%" /></div>' );

			       } );

	               // DataTable
	               var table = $('#newProjects_dataTable').DataTable();
			       
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
	} */
}

	//Function for Closed Projects

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
			/*------------------------------------- Add Some Columns For Closed Projects Tile [12-10-2023] ----------------------------------*/	
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
							
							var rowColor=row.rowColor;

							var clickFunction = "viewProjectDetails('/PMS/projectDetails/"+ row.encProjectId + "')";
							tableData += '<tr style="color:'+rowColor+'"><td class="font_14 text-center">'+ (i+1)+'</td><td class="font_14 text-center">'+ row.strGrouptName+  '</span></td><td><a style="color:'+rowColor+'" class="font_14" title="Click to View Complete Information" onclick='+clickFunction+'>'
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
			/*------------------------------------- END of Closed Projects Tile Table [12-10-2023] ----------------------------------*/		
		}
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
					var clickFunction = "viewProjectDetails('/PMS/projectDetails/"+ row.encProjectId + "')";
				
					tableData += '<tr><td>'+(i+1)+'</td> <td class="font_14">'+ row.strGroupName +  '</td><td> <a class="font_14" title="Click to View Complete Information" onclick='+clickFunction+' > '
							+ row.strProjectName + ' </a> <br/> <span class="bold blue font_14 text-left">'+ strReferenceNumber+'</span> </td>';
					
					tableData += '<td class="font_14 orange">'+row.strClientName+'</td><td class="font_14 ">'
					+ row.strInvoiceRefno +'</td>';
					
					tableData += ' <td class="font_14">'+ row.strInvoiceDate+ '</td>';
					
					tableData += ' <td class="font_14">'+ strInvoiceStatus+  '</td>';
					
					tableData += ' <td class="font_14 text-right">'	+ row.strInvoiceAmt +'</td>';
					
					tableData += ' <td class="font_14 text-right">'	+ row.strTaxAmount + '</td>';
					
					tableData += ' <td class="font_14 text-right">'+ row.strInvoiceTotalAmt+ '</td> </tr>';			
					
				}		
				
				 /*if(totalInvoiceAmt>0){
					 tableData+='<tr><td></td> <td></td><td></td> <td></td><td></td> <td class="bold text-right">Total</td><td class="bold text-right">'+convertAmountToINR(totalInvoiceAmt)+'</td> <td class="bold text-right">'+convertAmountToINR(totalTaxAmt)+'</td> <td class="bold text-right">'+convertAmountToINR(totalAmt)+'</td></tr>'
				 }*/
				
				$('#pendingPayments_dataTable').append(tableData); 
				var foot = $("#pendingPayments_dataTable").find('tfoot');
				 if(foot.length){
					 $("#pendingPayments_dataTable tfoot").remove();
				 }
				
				if(totalInvoiceAmt >0){
								
					 foot = $('<tfoot class="datatable_tfoot" style="background: #1580d0;">').appendTo("#pendingPayments_dataTable"); 
					    foot.append('<tr><td></td><td></td> <td></td><td></td> <td></td><td></td> <td class="bold text-right">Total</td><td class="bold text-right totalinvoice">'+convertAmountToINR(totalInvoiceAmt)+'</td> <td class="bold text-right totaltax">'+convertAmountToINR(totalTaxAmt)+'</td> <td class="bold text-right totalAmount">'+convertAmountToINR(totalAmt)+'</td></tr>');
					   
					    $("#totalOfPendingPay").text(convertAmountToINR(totalAmt));
				}          
				var  table= $('#pendingPayments_dataTable').DataTable( {
					destroy: true,
					dom: 'Bfrtip',		       
			        "ordering": false,
			        "paging":   false,
			        buttons: [
			             'excel', 'pdf', 'print'
			        ],
			       /* dom: 'Bfrtip',*/
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

						updateTotalAmount(table);

					}).draw();
					
					$('#pendingPayments_dataTable .filters th[class="comboBox"]').each( function ( i ) {
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

				                 updateTotalAmount(table);

				                } );
				     
				            table.column(colIdx).data().unique().sort().each( function ( d, j ) {
				                select.append( '<option value="'+d+'">'+d+'</option>' )
				            } );
				        } );
					

					 // Setup - add a text input
			       $('#pendingPayments_dataTable .filters th[class="textBox"]').each( function () {                 
			           $(this).html( '<div class="lighter"><input type="text"  style="width:100%" /></div>' );

			       } );

	               // DataTable
	               var table = $('#pendingPayments_dataTable').DataTable();
			       
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
	
	//declare the function by varun to get the sum by selecting groupname by varun 
	   function updateTotalAmount(table) {
	      
		   var totalinvoiceAmt = 0;
		    var totalwithouttaxAmt = 0;
		    var totalAmt = 0;
		  
		    table.rows({ search: 'applied' }).every(function () {
		        var data = this.data();
		        var valueinvoice = parseFloat(data[7].split(";")[1].replace(/,/g, ''));
		        var valuewithouttax = parseFloat(data[8].split(";")[1].replace(/,/g, ''));
		        var valueamnt = parseFloat(data[9].split(";")[1].replace(/,/g, ''));

		        totalinvoiceAmt += isNaN(valueinvoice) ? 0 : valueinvoice;
		        totalwithouttaxAmt += isNaN(valuewithouttax) ? 0 : valuewithouttax;
		        totalAmt += isNaN(valueamnt) ? 0 : valueamnt;
		    });

	       
	        $('.totalinvoice').text( convertAmountToINR(totalinvoiceAmt));
	        $('.totaltax').text( convertAmountToINR(totalwithouttaxAmt));
	        $('.totalAmount').text( convertAmountToINR(totalAmt));
	    }	

	function pendingInvoicesTable(){
		
		 $('#pendingInvoices_dataTable').DataTable().clear().destroy();
		
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
				
					tableData += '<tr><td>'+(i+1)+'</td><td class="font_14">'+ row.strGroupName +  '</td><td> <a class="font_14" title="Click to View Complete Information" onclick='+clickFunction+'>'
							+ row.strProjectName + ' </a> <p class="bold blue font_14 text-left">'+ strReferenceNumber+'<p></td>';
					
					tableData += '<td class="font_14 orange">'+row.strClientName+'</td><td class="font_14 "> <span  class="" >'
					+ row.strPaymentDueDate
					+  '</span></td>';
					
					tableData += ' <td class="font_14">'+ strPurpose+  '</td>';
					
					tableData += ' <td class="font_14"> <span  class="" >'
						+strRemarks +  '</span></td>';
					tableData += ' <td class="font_14 text-right">'+row.strAmount+ ' Lakhs</td> </tr>';
					
				}

				/*if(totalAmt>0){
					tableData +='<tr><td></td><td></td> <td></td> <td></td>  <td></td><td class="bold text-right">Total</td> <td class="bold text-right">'+convertAmountToINR(totalAmt)+' Lakhs</td></tr>';
				}*/
				
				$('#pendingInvoices_dataTable > tbody').html('');
				$('#pendingInvoices_dataTable').append(tableData); 
				var foot = $("#pendingInvoices_dataTable").find('tfoot');
				 if(foot.length){
					 $("#pendingInvoices_dataTable tfoot").remove();
				 }
				
				if(totalAmt >0){
									
					 foot = $('<tfoot class="datatable_tfoot" style="background: #1580d0;">').appendTo("#pendingInvoices_dataTable"); 
					    foot.append('<tr><td></td><td></td><td></td> <td></td> <td></td>  <td></td><td class="bold text-right">Total</td> <td class="bold text-right">'+convertAmountToINR(totalAmt)+' Lakhs</td></tr>');
				}
	           
				var  table= $('#pendingInvoices_dataTable').DataTable( {
					destroy: true,
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
					
					$('#pendingInvoices_dataTable .filters th[class="comboBox"]').each( function ( i ) {
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
			       $('#pendingInvoices_dataTable .filters th[class="textBox"]').each( function () {                 
			           $(this).html( '<div class="lighter"><input type="text"  style="width:100%" /></div>' );

			       } );

	               // DataTable
	               var table = $('#pendingInvoices_dataTable').DataTable();
			       
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

	function newResignEmpTable(){
		var startDate = null;
		var endDate = null;
		var selectedDateRange = $('#asOnDateResign').text().trim();

		$('#asOnDateResign1').text(selectedDateRange);
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
			$('#resigned_dataTable').DataTable().clear().destroy();
		 var tableData = '';
			$.ajaxRequest.ajax({
				type : "POST",
				url : "/PMS/mst/getResignedEmployeeDetails",
				data:{
					"startDate":startDate,
					"endDate":endDate
				},
				success : function(response) {
					//console.log(response);
					if(response){
						$('#newResignEmp').text(response.length); 
					}else{
						$('#newResignEmp').text(0); 
					}
					
					var totalAmount = 0;
					for (var i = 0; i < response.length; i++) {
						var row = response[i];	
			
						tableData += '<tr> <td>'+(i+1)+'</td>';	
						tableData += ' <td class="font_14 ">'+ row.groupName +  '</td> ';
						tableData += ' <td class="font_14 ">'+ row.employeeId +  '</td> ';
						tableData += ' <td class="font_14 ">'+ row.employeeName +  '</td> ';
						
						tableData += ' <td class="font_14 ">'+ row.strDesignation +  '</td>';			
						tableData += ' <td class="font_14 text-right">'+ row.dateOfResignation +  '</td> <td class="font_14 ">'+ row.employmentStatus +  '</td></tr>';
						/*tableData += ' <td class="font_14 >'+ row.employmentStatus +  '</td></tr> ';*/
					}

					$('#resigned_dataTable').append(tableData);	        
					var  table= $('#resigned_dataTable').DataTable( {
						destroy: true,
						dom: 'Bfrtip',		       
				        "ordering": true,
				        "paging":   false,
				        buttons: [
				             'excel', 'pdf', 'print'
				        ],
							"columnDefs": [ {
							
							
					            "orderable": true,
					            
				            "targets": 0
				        } ]
				        /*"order": [[ 1, 'asc' ]]*/
				    } );
						
						table.on('order.dt search.dt', function () {
							table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
						           cell.innerHTML = i+1;
						           table.cell(cell).invalidate('dom');
						     });
						}).draw();
						
						$('#resigned_dataTable .filters th[class="comboBox"]').each( function ( i ) {
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
				       $('#resigned_dataTable .filters th[class="textBox"]').each( function () {                 
				           $(this).html( '<div class="lighter"><input type="text"  style="width:100%" /></div>' );

				       } );

		               // DataTable
		               var table = $('#resigned_dataTable').DataTable();
				       
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
		}

	// function for Joinee Employee-

	function newJoineeEmpTable(){
		var startDate = null;
		var endDate = null;
		var selectedDateRange = $('#asOnDateJoinee').text().trim();

		$('#asOnDateJoinee1').text(selectedDateRange);
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
			$('#joinee_dataTable').DataTable().clear().destroy();
		 var tableData = '';
			$.ajaxRequest.ajax({
				type : "POST",
				url : "/PMS/mst/getNewJoinedEmployeeDetails",
				data:{
					"startDate":startDate,
					"endDate":endDate
				},
				success : function(response) {
					//console.log(response);
					if(response){
						$('#newJoineEmp').text(response.length); 
					}else{
						$('#newJoineEmp').text(0); 
					}
					
					var totalAmount = 0;
					for (var i = 0; i < response.length; i++) {
						var row = response[i];	
						if(row.employmentStatus =='Working'){
						tableData += '<tr> <td>'+(i+1)+'</td>';	
						tableData += ' <td class="font_14 ">'+ row.groupName +  '</td> ';
						tableData += ' <td class="font_14 ">'+ row.employeeId +  '</td> ';
						tableData += ' <td class="font_14 ">'+ row.employeeName +  '</td> ';
						
						tableData += ' <td class="font_14 ">'+ row.strDesignation +  '</td> ';			
						tableData += ' <td class="font_14 text-right">'+ row.dateOfJoining +  '</td><td class="font_14 ">'+ row.employmentStatus +  '</td></tr>';
						/*tableData += ' <td class="font_14 >'+ row.employmentStatus +  '</td></tr> ';*/
					}
						else{
							tableData += '<tr class="red"> <td>'+(i+1)+'</td>';	
							tableData += ' <td class="font_14 ">'+ row.groupName +  '</td> ';
							tableData += ' <td class="font_14 ">'+ row.employeeId +  '</td> ';
							tableData += ' <td class="font_14 ">'+ row.employeeName +  '</td> ';
							
							tableData += ' <td class="font_14 ">'+ row.strDesignation +  '</td> ';			
							tableData += ' <td class="font_14 text-right">'+ row.dateOfJoining +  '</td><td class="font_14 ">'+ row.employmentStatus +  '</td></tr>';
						}}

					$('#joinee_dataTable').append(tableData);	        
					var  table= $('#joinee_dataTable').DataTable( {
						destroy: true,
						dom: 'Bfrtip',		       
				        "ordering": true,
				        "paging":   false,
				        buttons: [
				             'excel', 'pdf', 'print'
				        ],
							"columnDefs": [ {
	
					        "orderable": true,
					            
				            "targets": 0
				        } ]
				       /* "order": [[ 1, 'asc' ]]*/
				    } );
						
						table.on('order.dt search.dt', function () {
							table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
						           cell.innerHTML = i+1;
						           table.cell(cell).invalidate('dom');
						     });
						}).draw();
						
						$('#joinee_dataTable .filters th[class="comboBox"]').each( function ( i ) {
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
				       $('#joinee_dataTable .filters th[class="textBox"]').each( function () {                 
				           $(this).html( '<div class="lighter"><input type="text"  style="width:100%" /></div>' );

				       } );

		               // DataTable
		               var table = $('#joinee_dataTable').DataTable();
				       
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
		}

function showDetails(groupkey) {
	$("#charts_datatable").removeClass('hide');
	$("#charts_datatable").show();
	$('#example_det').DataTable().clear().destroy();
	var tableData = '';
	$
			.ajax({

				type : "POST",
				url : "/PMS/projectDetailsByGroupName",
				data : "groupName=" + groupkey,
				success : function(data) {
					// console.log(data);
					for (var i = 0; i < data.length; i++) {
						var row = data[i];
						// console.log(row);
						var clickFunction = "viewProjectDetails('/PMS/projectDetails/"
								+ row.encNumId + "')";
						tableData += '<tr><td > <a class="font_17" title="Click to View Complete Information" onclick='
								+ clickFunction
								+ '>'
								+ row.strProjectName
								+ ' </a> </td>';
						tableData += ' <td class="font_16">' + row.startDate
								+ '</td>  <td class="font_16">' + row.endDate
								+ ' </td>  <td class="font_16"> '
								+ row.projectCost + '</td> </tr>';
					}

					$('#example_det > tbody').html('');
					$('#example_det').append(tableData);

					$('#example_det').DataTable();
				}

			});

}

// /for table scroll
/*
 * $(document).ready(function() {
 * 
 * pageScroll(); $("#contain").mouseover(function() { clearTimeout(my_time);
 * }).mouseout(function() { pageScroll(); });
 * 
 * getWidthHeader('glance_data_table','table_scroll');
 * 
 * });
 * 
 * var my_time; function pageScroll() { var objDiv =
 * document.getElementById("contain"); objDiv.scrollTop = objDiv.scrollTop + 1;
 * if ((objDiv.scrollTop + 100) == objDiv.scrollHeight) { objDiv.scrollTop = 0; }
 * my_time = setTimeout('pageScroll()', 25); }
 * 
 * function getWidthHeader(id_header, id_scroll) { var colCount = 0; $('#' +
 * id_scroll + ' tr:nth-child(1) td').each(function () { if
 * ($(this).attr('colspan')) { colCount += +$(this).attr('colspan'); } else {
 * colCount++; } });
 * 
 * for(var i = 1; i <= colCount; i++) { var th_width = $('#' + id_scroll + ' >
 * tbody > tr:first-child > td:nth-child(' + i + ')').width(); $('#' + id_header + ' >
 * thead th:nth-child(' + i + ')').css('width',th_width + 'px'); } }
 */
$(document).ready(function() {	
	var t = $('#allDetailsTable').DataTable( {
		destroy: true,
		"paging":   false,
		 "info": false,
        "columnDefs": [ {
            "searchable": false,
            "orderable": false,
            "targets": 0
        } ],
        "order": [[ 1, 'asc' ]]
    } );
 
    t.on( 'order.dt search.dt', function () {
        t.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell.innerHTML = i+1;
        } );
    } ).draw();

});
$(document).ready(function() {

	$('#example_det').DataTable();
	// $('#glance_data_table').dataTable({searching: false, paging: false, info:
	// false});
	/*
	 * var $el = $(".table-responsive"); function anim() { var st =
	 * $el.scrollTop(); var sb = $el.prop("scrollHeight") - $el.innerHeight();
	 * $el.animate({ scrollTop : st < sb / 2 ? sb : 0 }, 30000, anim); }
	 * function stop() { $el.stop(); } anim(); $el.hover(stop, anim);
	 */

});

var my_time;
$(document).ready(function() {
	pageScroll();
	$("#contain").mouseover(function() {
		clearTimeout(my_time);
	}).mouseout(function() {
		pageScroll();
	});
});

function pageScroll() {
	var objDiv = document.getElementById("contain");
	objDiv.scrollTop = objDiv.scrollTop + 1;
	if (objDiv.scrollTop == (objDiv.scrollHeight - 250)) {
		objDiv.scrollTop = 0;
	}
	my_time = setTimeout('pageScroll()', 25);
}

function loadGroupWiseProjects(encGroupId) {
	//alert(encGroupId);
	$('#example').DataTable().clear().destroy();
	var tableData = "";
	$.ajaxRequest
			.ajax({
				type : "POST",
				url : "/PMS/mst/ViewProjectDetails",
				data : "encGroupId=" + encGroupId,
				success : function(data) {
					//console.log(data);
					var sysDate = new Date();
					/*Bhavesh(26-07-23)*/ 
					var valuesList = []; // Initialize an empty array to store the values
				    $(".closureList").each(function() {
				      var value = $(this).text().trim(); // Get the text content and remove any leading/trailing spaces
				      valuesList.push(value); // Add the value to the array
				    });

				    
				    console.log(valuesList); 
				    for (var i = 0; i < data.length; i++) {
						var row = data[i];
						var serialNo = i + 1;
						$('#groupId').val(encGroupId); // set group id for click download excel icon [ added by Anuj ]
						/*--------------------------  Color change after enddate passed  --------------------------------------------------*/
						if (row.endDate != null || row.endDate === '') {
						    var endDateString = row.endDate;
						    var endDateParts = endDateString.split("/");
						    var endDate = new Date(endDateParts[2], endDateParts[1] - 1, endDateParts[0]);
						    if (endDate.getTime() < sysDate.getTime()) {
						        tableData += "<tr id='" + row.encProjectId + "'><td>" + serialNo + "</td>";
						    } else {
						        tableData += "<tr id='" + row.encProjectId + "'><td>" + serialNo + "</td>";
						    }
						} else {
						    tableData += "<tr id='" + row.encProjectId + "'><td>" + serialNo + "</td>";
						}
						/*-----------------------------------------------------------------------------------------------------------------*/
						
						//tableData += "<tr id='"+row.encProjectId+"'><td>" + serialNo + "</td>";
						/*if (row.projectRefrenceNo != null) {
							tableData += "<td>" + row.projectRefrenceNo
									+ "</td>";
						} else {
							tableData += "<td></td>";
						}*/
						 if (endDate.getTime() < sysDate.getTime()&& !valuesList.includes(row.projectRefrenceNo) ){
						tableData += "<td class='font_16 grey-text' style='width:35%;' id='td2_"+row.encProjectId+"'><p class='grey-text'><a class='bold grey-text' title='Click to View Complete Information' onclick=viewProjectDetails('/PMS/projectDetails/"
								+ row.encProjectId+ "')>"+ row.strProjectName+ "</a> </p>"
								+ "<p class='font_14'><i><a class='orange  grey-text' title='Click here to view Funding org details' data-toggle='modal' data-target='#clientDetails' data-whatever='"
								+ row.encClientId+ ";"+ row.encProjectId+ ";"+ row.endUserId+ "' class='text-center grey-text'>"+ row.clientName+ "</a></i></p> <p class='bold blue font_14 text-left grey-text'> "+row.projectRefrenceNo+"</p><p class=' font_12 grey-text' >"+row.businessType+"</p></td>";
						tableData += "<td class='grey-text' align='center' style='width:23%;'>"+ row.startDate + " to  " + row.endDate+ "<br> ("+ row.projectDuration + " Months)</td>";
						if (row.strPLName != null) {
							tableData += "<td style='width:15%;'><span class='font_16 grey-text'>"
									+ row.strPLName
									+ "</span><p><a  class='grey-text' title='Team details' data-toggle='modal' data-target='#team-modal' onclick=viewTeamDetails('"
									+ row.encProjectId
									+ "')><span class='font_12 pull-right'><i class='fa fa-users'></i></span></a></p></td>";
						} else {
							tableData += "<td></td>";
						}
						tableData += "<td align='right'><input type='hidden' id='hiddenTotalAmt_"
								+ row.encProjectId
								+ "' value="
								+ row.strTotalCost
								+ "/><span  class='convertLakhs grey-text' id='totalAmt_"
								+ row.encProjectId
								+ "'>"
								+ row.strTotalCost
								+ " </span></td>";
						if (row.strReceivedAmout != null) {
							
							tableData += "<td class='hide' align='right'> <input type='hidden' id='hiddenAmt_"+row.encProjectId+"' value='"+row.strReceivedAmout+"'/> <a title='Click here to view received details' data-toggle='modal' data-target='#amtreceive' class='text-center grey-text' data-whatever='"+row.encProjectId+";"+row.startDate+";"+row.strTotalCost+"'> <span   id='amt_"+row.encProjectId+"'>"
									+ row.strReceivedAmout + " </span></a></td>";
						} else {
							tableData += "<td class='hide'></td>";
						}
						 }
						 else if (valuesList.includes(row.projectRefrenceNo) ){
						tableData += "<td class='font_16 golden' style='width:35%;' id='td2_"+row.encProjectId+"'><p class='golden-text'><a class='bold golden-text' title='Click to View Complete Information' onclick=viewProjectDetails('/PMS/projectDetails/"
								+ row.encProjectId+ "')>"+ row.strProjectName+ "</a> </p>"
								+ "<p class='font_14'><i><a class='golden-text' title='Click here to view Funding org details' data-toggle='modal' data-target='#clientDetails' data-whatever='"
								+ row.encClientId+ ";"+ row.encProjectId+ ";"+ row.endUserId+ "' class='text-center grey-text'>"+ row.clientName+ "</a></i></p> <p class='bold font_14 text-left golden-text'> "+row.projectRefrenceNo+"</p><p class=' font_12 golden-text' >"+row.businessType+"</p></td>";
						tableData += "<td class='golden-text' align='center' style='width:23%;'>"+ row.startDate + " to  " + row.endDate+ "<br> ("+ row.projectDuration + " Months)</td>";
						if (row.strPLName != null) {
							tableData += "<td style='width:15%;'><span class='font_16 golden-text'>"
									+ row.strPLName
									+ "</span><p><a  class='golden-text' title='Team details' data-toggle='modal' data-target='#team-modal' onclick=viewTeamDetails('"
									+ row.encProjectId
									+ "')><span class='font_12 pull-right'><i class='fa fa-users'></i></span></a></p></td>";
						} else {
							tableData += "<td></td>";
						}
						tableData += "<td align='right'><input type='hidden' id='hiddenTotalAmt_"
								+ row.encProjectId
								+ "' value="
								+ row.strTotalCost
								+ "/><span  class='convertLakhs golden-text' id='totalAmt_"
								+ row.encProjectId
								+ "'>"
								+ row.strTotalCost
								+ " </span></td>";
						if (row.strReceivedAmout != null) {
							
							tableData += "<td class='hide' align='right'> <input type='hidden' id='hiddenAmt_"+row.encProjectId+"' value='"+row.strReceivedAmout+"'/> <a title='Click here to view received details' data-toggle='modal' data-target='#amtreceive' class='text-center grey-text' data-whatever='"+row.encProjectId+";"+row.startDate+";"+row.strTotalCost+"'> <span   id='amt_"+row.encProjectId+"'>"
									+ row.strReceivedAmout + " </span></a></td>";
						} else {
							tableData += "<td class='hide'></td>";
						}
						 }
						
						 
						 else{
							 tableData += "<td class='font_16 success-text' style='width:35%;' id='td2_"+row.encProjectId+"'><p class=' success-text'><a class='bold success-text' title='Click to View Complete Information' onclick=viewProjectDetails('/PMS/projectDetails/"
								+ row.encProjectId+ "')>"+ row.strProjectName+ "</a> </p>"
								+ "<p class='font_14'><i><a class='orange success-text' title='Click here to view Funding org details' data-toggle='modal' data-target='#clientDetails' data-whatever='"
								+ row.encClientId+ ";"+ row.encProjectId+ ";"+ row.endUserId+ "' class='text-center success-text'>"+ row.clientName+ "</a></i></p> <p class='bold blue font_14 text-left success-text'> "+row.projectRefrenceNo+"</p><p class=' font_12 success-text' >"+row.businessType+"</p></td>";
							 tableData += "<td class='success-text' align='center' style='width:23%;'>"+ row.startDate + " to  " + row.endDate+ "<br> ("+ row.projectDuration + " Months)</td>";
								if (row.strPLName != null) {
									tableData += "<td style='width:15%;'><span class='font_16 success-text'>"
											+ row.strPLName
											+ "</span><p><a class='success-text' title='Team details' data-toggle='modal' data-target='#team-modal' onclick=viewTeamDetails('"
											+ row.encProjectId
											+ "')><span class='font_12 pull-right'><i class='fa fa-users'></i></span></a></p></td>";
								} else {
									tableData += "<td></td>";
								}
								tableData += "<td align='right'><input type='hidden' id='hiddenTotalAmt_"
										+ row.encProjectId
										+ "' value="
										+ row.strTotalCost
										+ "/><span  class='convertLakhs success-text' id='totalAmt_"
										+ row.encProjectId
										+ "'>"
										+ row.strTotalCost
										+ " </span></td>";
								if (row.strReceivedAmout != null) {
									
									tableData += "<td class='hide' align='right'> <input type='hidden' id='hiddenAmt_"+row.encProjectId+"' value='"+row.strReceivedAmout+"'/> <a title='Click here to view received details' data-toggle='modal' data-target='#amtreceive' class='text-center success-text' data-whatever='"+row.encProjectId+";"+row.startDate+";"+row.strTotalCost+"'> <span   id='amt_"+row.encProjectId+"'>"
											+ row.strReceivedAmout + " </span></a></td>";
								} else {
									tableData += "<td class='hide'></td>";
								}
						 }
						/*tableData += "<td style='width:10%;'>"
								+ row.businessType + "</td>";*/
						/*tableData += "<td style='width:10%;'>" + row.startDate
								+ "</td>";
						tableData += "<td style='width:10%;'>" + row.endDate
								+ "</td>";*/
						
						tableData += "<td >  <ul>";
						
							for(var j =0;j<row.projectDocument.length;j++)
								tableData +="<li ><a class='"+row.projectDocument[j].classColor+" bold' onclick='downloadDocument(\""+row.projectDocument[j].encNumId+"\")'>"+ row.projectDocument[j].documentTypeName+"</a></li>";
							tableData +=  "</ul><a style='float:right;' onclick=viewProjectDetails('/PMS/mst/documentDetails/"+row.encProjectId+"')>View All</a></td> </tr>";


					}
					/*for (var i = 0; i < data.length; i++) {
						var row = data[i];
						var serialNo = i + 1;
						$('#groupId').val(encGroupId); // set group id for click download excel icon [ added by Anuj ]
						--------------------------  Color change after enddate passed  --------------------------------------------------
						if (row.endDate != null || row.endDate === '') {
						    var endDateString = row.endDate;
						    var endDateParts = endDateString.split("/");
						    var endDate = new Date(endDateParts[2], endDateParts[1] - 1, endDateParts[0]);
						    if (endDate.getTime() < sysDate.getTime()&& valuesList.includes(row.projectRefrenceNo)) {
						        tableData += "<tr id='" + row.encProjectId + "' style='color:#d59a83'><td>" + serialNo + "</td>";
						       
						    } else if (endDate.getTime() < sysDate.getTime()&& !( valuesList.includes(row.projectRefrenceNo)))  {
						        tableData += "<tr id='" + row.encProjectId + "'><td>" + serialNo + "</td>";
						        
						} else {
						    tableData += "<tr id='" + row.encProjectId + "'><td>" + serialNo + "</td>";
						    
					}
						}
						-----------------------------------------------------------------------------------------------------------------
						
						//tableData += "<tr id='"+row.encProjectId+"'><td>" + serialNo + "</td>";
						if (row.projectRefrenceNo != null) {
							tableData += "<td>" + row.projectRefrenceNo
									+ "</td>";
						} else {
							tableData += "<td></td>";
						}
						 if (endDate.getTime() < sysDate.getTime()&& valuesList.includes(row.projectRefrenceNo)){
						tableData += "<td class='font_16 golden-text' style='width:35%;' id='td2_"+row.encProjectId+"'><p><a class='bold golden-text' title='Click to View Complete Information' onclick=viewProjectDetails('/PMS/projectDetails/"
								+ row.encProjectId+ "')>"+ row.strProjectName+ "</a> </p>"
								+ "<p class='font_14 golden-text'><i><a class='orange golden-text' title='Click here to view Funding org details' data-toggle='modal' data-target='#clientDetails' data-whatever='"
								+ row.encClientId+ ";"+ row.encProjectId+ ";"+ row.endUserId+ "' class='text-center golden-text'>"+ row.clientName+ "</a></i></p> <p class='bold blue font_14 text-left golden-text'> "+row.projectRefrenceNo+"</p><p class=' font_12 golden-text' >"+row.businessType+"</p></td>";
						tableData += "<td style='width:10%;'>"
								+ row.businessType + "</td>";
						tableData += "<td style='width:10%;'>" + row.startDate
								+ "</td>";
						tableData += "<td style='width:10%;'>" + row.endDate
								+ "</td>";
						tableData += "<td class='golden-text' align='center' style='width:23%;'>"+ row.startDate + " to  " + row.endDate+ "<br> ("+ row.projectDuration + " Months)</td>";
						if (row.strPLName != null) {
							tableData += "<td style='width:15%;'><span class='font_16 golden-text'>"
									+ row.strPLName
									+ "</span><p><a golden-text title='Team details' data-toggle='modal' data-target='#team-modal' onclick=viewTeamDetails('"
									+ row.encProjectId
									+ "')><span class='font_12 pull-right'><i class='fa fa-users'></i></span></a></p></td>";
						} else {
							tableData += "<td></td>";
						}
						tableData += "<td align='right'><input type='hidden' id='hiddenTotalAmt_"
								+ row.encProjectId
								+ "' value="
								+ row.strTotalCost
								+ "/><span  class='convertLakhs golden-text' id='totalAmt_"
								+ row.encProjectId
								+ "'>"
								+ row.strTotalCost
								+ " </span></td>";
						if (row.strReceivedAmout != null) {
							
							tableData += "<td align='right'> <input type='hidden' id='hiddenAmt_"+row.encProjectId+"' value='"+row.strReceivedAmout+"'/> <a title='Click here to view received details' data-toggle='modal' data-target='#amtreceive' class='text-center golden-text' data-whatever='"+row.encProjectId+";"+row.startDate+";"+row.strTotalCost+"'> <span   id='amt_"+row.encProjectId+"'>"
									+ row.strReceivedAmout + " </span></a></td>";
						} else {
							tableData += "<td></td>";
						}
						 }
						 else if (endDate.getTime() < sysDate.getTime()&&! valuesList.includes(row.projectRefrenceNo)){
						tableData += "<td class='font_16 grey-text' style='width:35%;' id='td2_"+row.encProjectId+"'><p><a class='bold grey-text' title='Click to View Complete Information' onclick=viewProjectDetails('/PMS/projectDetails/"
								+ row.encProjectId+ "')>"+ row.strProjectName+ "</a> </p>"
								+ "<p class='font_14'><i><a class='orange grey-text' title='Click here to view Funding org details' data-toggle='modal' data-target='#clientDetails' data-whatever='"
								+ row.encClientId+ ";"+ row.encProjectId+ ";"+ row.endUserId+ "' class='text-center grey-text'>"+ row.clientName+ "</a></i></p> <p class='bold blue font_14 text-left grey-text'> "+row.projectRefrenceNo+"</p><p class=' font_12 grey-text' >"+row.businessType+"</p></td>";
						tableData += "<td style='width:10%;'>"
								+ row.businessType + "</td>";
						tableData += "<td style='width:10%;'>" + row.startDate
								+ "</td>";
						tableData += "<td style='width:10%;'>" + row.endDate
								+ "</td>";
						tableData += "<td class='grey-text'  align='center' style='width:23%;'>"+ row.startDate + " to  " + row.endDate+ "<br> ("+ row.projectDuration + " Months)</td>";
						if (row.strPLName != null) {
							tableData += "<td style='width:15%;'><span class='font_16 grey-text'>"
									+ row.strPLName
									+ "</span><p><a class='grey-text' title='Team details' data-toggle='modal' data-target='#team-modal' onclick=viewTeamDetails('"
									+ row.encProjectId
									+ "')><span class='font_12 pull-right'><i class='fa fa-users'></i></span></a></p></td>";
						} else {
							tableData += "<td></td>";
						}
						tableData += "<td align='right'><input type='hidden' id='hiddenTotalAmt_"
								+ row.encProjectId
								+ "' value="
								+ row.strTotalCost
								+ "/><span  class='convertLakhs grey-text' id='totalAmt_"
								+ row.encProjectId
								+ "'>"
								+ row.strTotalCost
								+ " </span></td>";
						if (row.strReceivedAmout != null) {
							
							tableData += "<td align='right'> <input type='hidden' id='hiddenAmt_"+row.encProjectId+"' value='"+row.strReceivedAmout+"'/> <a title='Click here to view received details' data-toggle='modal' data-target='#amtreceive' class='text-center grey-text' data-whatever='"+row.encProjectId+";"+row.startDate+";"+row.strTotalCost+"'> <span   id='amt_"+row.encProjectId+"'>"
									+ row.strReceivedAmout + " </span></a></td>";
						} else {
							tableData += "<td></td>";
						}
						 }
						 else {
						tableData += "<td class='font_16 success-text' style='width:35%;' id='td2_"+row.encProjectId+"'><p><a class='bold success-text' title='Click to View Complete Information' onclick=viewProjectDetails('/PMS/projectDetails/"
								+ row.encProjectId+ "')>"+ row.strProjectName+ "</a> </p>"
								+ "<p class='font_14'><i><a class='orange success-text' title='Click here to view Funding org details' data-toggle='modal' data-target='#clientDetails' data-whatever='"
								+ row.encClientId+ ";"+ row.encProjectId+ ";"+ row.endUserId+ "' class='text-center success-text'>"+ row.clientName+ "</a></i></p> <p class='bold blue font_14 text-left success-text'> "+row.projectRefrenceNo+"</p><p class=' font_12 success-text' >"+row.businessType+"</p></td>";
						tableData += "<td style='width:10%;'>"
								+ row.businessType + "</td>";
						tableData += "<td style='width:10%;'>" + row.startDate
								+ "</td>";
						tableData += "<td style='width:10%;'>" + row.endDate
								+ "</td>";
						tableData += "<td class='success-text' align='center' style='width:23%;'>"+ row.startDate + " to  " + row.endDate+ "<br> ("+ row.projectDuration + " Months)</td>";
						if (row.strPLName != null) {
							tableData += "<td style='width:15%;'><span class='font_16 success-text'>"
									+ row.strPLName
									+ "</span><p><a title='Team details' data-toggle='modal' data-target='#team-modal' onclick=viewTeamDetails('"
									+ row.encProjectId
									+ "')><span class='font_12 pull-right'><i class='fa fa-users'></i></span></a></p></td>";
						} else {
							tableData += "<td></td>";
						}
						tableData += "<td align='right'><input type='hidden' id='hiddenTotalAmt_"
								+ row.encProjectId
								+ "' value="
								+ row.strTotalCost
								+ "/><span  class='convertLakhs success-text' id='totalAmt_"
								+ row.encProjectId
								+ "'>"
								+ row.strTotalCost
								+ " </span></td>";
						if (row.strReceivedAmout != null) {
							
							tableData += "<td align='right'> <input type='hidden' id='hiddenAmt_"+row.encProjectId+"' value='"+row.strReceivedAmout+"'/> <a title='Click here to view received details' data-toggle='modal' data-target='#amtreceive' class='text-center success-text' data-whatever='"+row.encProjectId+";"+row.startDate+";"+row.strTotalCost+"'> <span   id='amt_"+row.encProjectId+"'>"
									+ row.strReceivedAmout + " </span></a></td>";
						} else {
							tableData += "<td></td>";
						}
						 }
						tableData += "<td style='width:10%;'>  <ul>";
						
							for(var j =0;j<row.projectDocument.length;j++)
								tableData +="<li ><a class='"+row.projectDocument[j].classColor+" bold' onclick='downloadDocument(\""+row.projectDocument[j].encNumId+"\")'>"+ row.projectDocument[j].documentTypeName+"</a></li>";
							tableData +=  "</ul><a style='float:right;' onclick=viewProjectDetails('/PMS/mst/documentDetails/"+row.encProjectId+"')>View All</a></td> </tr>";


					}*/
					tableData += '</tbody>';
					$('#example tbody').empty();
					$('#example').show();
					$('#GroupWiseTable').show();
					$('#example').append(tableData);
					
					
					
					var  table= $('#example').DataTable( {
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

                   // DataTable
                   var table = $('#example').DataTable();
			       
			       table.columns().eq( 0 ).each( function ( colIdx ) {
			           $( 'input', $('.filters th')[colIdx] ).on( 'keyup change', function () {
			               table
			                           .column( colIdx )
			                           .search( this.value )
			                           .draw() ;
			                   
			                                           } );
			} );
			       convertToLakhWithoutLabel();

				},
				error : function(e) {
					// $('#RecurringManpowerAmt').val(0);
					alert('Error: ' + e);
				}
			});
	window.scrollBy(0,1400); 
}

/*
 * function loadGroupWiseProjects(encGroupId){
 * $('#groupWiseProject').removeClass('hidden');
 * $('#groupWiseProjectDtl').find('div').remove();
 * 
 * var url = "/PMS/mst/ViewProjectDetails?encGroupId="+encGroupId;
 * 
 * var data='<div > <iframe id="test" src='+url+' width="100%;" height="100%;"
 * margin-top="0px;" frameborder="0" ></iframe> </div>';
 * 
 * $('#groupWiseProjectDtl').append(data); }
 */
$(document)
		.ready(
				function() {
					$('#GroupWiseTable').hide();
					$('#example').hide();
					var strStart = "01/04/";
					var strEnd = "31/03/";
					var d = new Date();
					var currentYear = d.getFullYear();
					var currentMonth = d.getMonth();
					var lastYear = d.getFullYear() - 1;
					//alert("as on date"+currentYear);
					var dateString = '01/04/';
					if(currentMonth<=2){
						dateString  += lastYear;
					}
					else{
						dateString  += currentYear;
					}
					// alert("dateString"+dateString);
					//$("#asOnDate").text(dateString);
					// $("#asOnDate1").text(dateString);
					//$("#asOnDateExp").text(dateString);
					// $("#asOnDateExp1").text(dateString);

				/*	$("#dtStartDate")
							.datepicker(
									{

										showOn : "both",
										buttonText : "<i class='fa fa-calendar font_20 green1'></i>",
										dateFormat : 'dd/mm/yy',
										changeMonth : true,
										changeYear : true,
										maxDate : '0',

										onSelect : function() {
											var date = $('#dtStartDate').val();
											// alert("Date Value"+date);

											$.ajaxRequest
													.ajax({
														type : "POST",
														url : "/PMS/mst/getIncomeByDate",
														data : "startDate="
																+ date,
														success : function(
																response) {
															// console.log(response);
															// var k = response;

															// $('#incomeOndate').html(k);

															// $("#asOnDate").text(date);
															var fieldValue = response;
															var convertedStringAmount = convertINRToAmount(fieldValue);

															console
																	.log(convertedStringAmount);
															var amount = (parseFloat(convertedStringAmount)) / 100000;
															console
																	.log(response
																			+ " "
																			+ amount);
															// console.log(roundUpTo2Decimal(amount));
															var convertedIntegerAmount = convertAmountToINR(roundUpTo2Decimal(
																	amount, 2));

															$('#incomeOndate')
																	.html(
																			convertedIntegerAmount
																					+ " Lakhs");

															$("#asOnDate")
																	.text(date);

														}
													});

										}
									});*/

					$("#dtExpStartDate")
							.datepicker(
									{

										showOn : "both",
										buttonText : "<i class='fa fa-calendar font_20'></i>",

										/*
										 * buttonImage:
										 * "/PMS/resources/app_srv/PMS/global/images/slider/slider4.jpg",
										 * buttonImageOnly: true,
										 */
										dateFormat : 'dd/mm/yy',
										changeMonth : true,
										changeYear : true,
										maxDate : '0',
										showOn : 'both',

										onSelect : function() {
											var date = $('#dtExpStartDate')
													.val();
											// alert("Date Value"+date);

											$.ajaxRequest
													.ajax({
														type : "POST",
														url : "/PMS/mst/getExpenditureByDate",
														data : "startDate="
																+ date,
														success : function(
																response) {
															// console.log(response);
															// var k = response;

															// $('#expenditureOndate').html(k);
															// $("#asOnDateExp").text(date);
															var fieldValue = response;
															var convertedStringAmount = convertINRToAmount(fieldValue);

															// console.log(convertedStringAmount);
															var amount = (parseFloat(convertedStringAmount)) / 100000;
															// console.log(response
															// + " "+ amount);
															// console.log(roundUpTo2Decimal(amount));
															var convertedIntegerAmount = convertAmountToINR(roundUpTo2Decimal(
																	amount, 2));

															$(
																	'#expenditureOndate')
																	.html(
																			convertedIntegerAmount
																					+ " Lakhs");
															$("#asOnDateExp")
																	.text(date);

														}
													});

										}
									});

					$('.ui-datepicker-trigger').attr('alt', 'Calender');
					$('.ui-datepicker-trigger').attr('title',
							'Select Start Date');
				});

$('#dash-income-modal').on('show.bs.modal', function(event) {
	initialzeIncomeChart();
	$(this).off('shown.bs.modal');
});
$('#dash-expenditure-modal').on('show.bs.modal', function(event) {
	initialzeExpenditureChart();
	$(this).off('shown.bs.modal');
});

$('#dash-newProposalList-modal').on('shown.bs.modal', function(event) {		
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
});
$('#dash-pending-payments-modal').on('shown.bs.modal', function(event) {
	/*alert("inside newProjectList-modal");*/
	initializePendingPayments();
	$(this).off('shown.bs.modal');
});
$('#dash-pending-invoices-modal').on('shown.bs.modal', function(event) {
	/*alert("inside newProjectList-modal");*/
	initializePendingInvoices();
	$(this).off('shown.bs.modal');
});
$('#dash-closure-pending-modal').on('shown.bs.modal', function(event) {		
	initializeClosurePending();
	$(this).off('shown.bs.modal');
});
$('#dash-new-joinee-modal').on('shown.bs.modal', function(event) {		
	initializeNewJoinee();
	$(this).off('shown.bs.modal');
});
$('#dash-resigned-emp-modal').on('shown.bs.modal', function(event) {		
	initializeResignedEmp();
	$(this).off('shown.bs.modal');
});

$('#dash-closedProjectListByGroup-modal').on('shown.bs.modal', function(event) {	
	var button = $(event.relatedTarget);
	var input = button.data('whatever');
	$("#grpId").val(input);
	closedProjectsNew(input,0);
	
	/*$(this).off('shown.bs.modal');*/
});

$('#dash-newProposalListByGroup-modal').on('shown.bs.modal', function(event) {	
	var button = $(event.relatedTarget);
	var input = button.data('whatever');
	$("#proposalGrpId").val(input);
	proposalSubmittedNew(input,0);
	
	/*$(this).off('shown.bs.modal');*/
});

$('#dash-incomeByGroup-modal').on('shown.bs.modal', function(event) {
	
	var button = $(event.relatedTarget);
	var input = button.data('whatever');
	$("#incomeGroupId").val(input);
	 incomeTableNew(input,0);
	
	/*$(this).off('shown.bs.modal');*/
});

$('#dash-resigned-empByGroup-modal').on('shown.bs.modal', function(event) {
	var button = $(event.relatedTarget);
	var input = button.data('whatever');
	
	$("#resignGroupId").val(input);
	resignEmployeelist(input,0);
	
	/*$(this).off('shown.bs.modal');*/
});

$('#dash-newProjectListByGroup-modal').on('shown.bs.modal', function(event) {
	var button = $(event.relatedTarget);
	var input = button.data('whatever');
	$("#projectGroupId").val(input);
	projectReceivedNew(input,0);
	
	/*$(this).off('shown.bs.modal');*/
});

$('#dash-new-joinee-ByGroup-modal').on('shown.bs.modal', function(event) {
	var button = $(event.relatedTarget);
	var input = button.data('whatever');
	$("#joinGroupId").val(input);
	
	joineeEmployeeList(input,0);
	
	//$(this).off('shown.bs.modal');
});


function incomeTable(){
	var groupColumn = 0;
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
		/*------------------------------ Append Data in Income Table [05-12-2023] ----------------*/ 
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
					tableData += '<tr ><td  class="font_16" style="width:15%;">'
							+ row.groupName + '</td>';
					tableData += '<td > <a class="font_14" title="Click to View Complete Information" onclick='
							+ clickFunction
							+ '>'
							+ row.projectName
							+ ' </a><p class="bold blue font_14 text-left">'+ strReferenceNumber+'<p></td>';
					tableData += '<td class="font_14 text-center"> <input type="hidden" id="hiddenIncomeAmt_'
							+ row.encProjectId
							+ '" value='
							+ row.encProjectId
							+ '/> <span  class="convert_lakhs_td" id="incomeAmt_'
							+ row.encProjectId
							+ '">'
							+ row.strReceivedAmount + '</span></td> </tr>';
					
					totalAmount += row.numReceivedAmountLakhs;
				}
				$('#income_dataTable > tbody').html('');	
				$('#income_dataTable').append(tableData);
				$('#income_dataTable').DataTable().destroy();
	   
				var foot = $("#income_dataTable").find('tfoot');
				if(foot.length){
					 $("#income_dataTable tfoot").remove();
				 }
				
				if(totalAmount >0){
					var tempConverted = convertAmountToINR(totalAmount);		
					$('#incomeOndate').text(tempConverted +' Lakhs');				
					foot = $('<tfoot class="datatable_tfoot" style="background: #1580d0;">').appendTo("#income_dataTable"); 
					foot.append('<tr> <td></td> <td class="bold"><span class="text-center">Total</span></td> <td class="bold text-center" id="incomeFooterTotalAmount">'+tempConverted+' Lakhs </td></tr>');
				}else{
					$('#incomeOndate').text(0); 
				}	

				var table= $('#income_dataTable').DataTable( {
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
				           table.cell(cell).invalidate('dom');
				           //getAllTableData(table);
				     });
					getAllTableData(table);
				}).draw();
				$('#income_dataTable .filters th[class="comboBox"]').each( function ( i ) {
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
		                 		//getAllTableData(table);
		                } );
			     
		            table.column(colIdx).data().unique().sort().each( function ( d, j ) {
		                select.append( '<option value="'+d+'">'+d+'</option>' )
		           });
		           getAllTableData(table);
				});
				$('#income_dataTable .filters th[id="projectComboBox"]').each( function ( i ) {
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
		                 		//getAllTableData(table);
		                } );
			     
		            table.column(colIdx).data().unique().sort().each( function ( d, j ) {
		                var extractedText = $($.parseHTML(d)).text().trim();
		                select.append( '<option value="'+extractedText+'">'+extractedText+'</option>' )
		           });
		           getAllTableData(table);
				});
			}	
		});
		/*------------------------- End of Income Table Data [05-12-2023]---------------------------------------*/
	}			
}
/*------------------- Functions For Calculate the footer value of income table [05-12-2023] ---------*/
function getAllTableData(table) {
    var values = [];
    var totalCostInLakhs = 0;
    table.rows({ search: 'applied' }).every(function () {
    	var data = this.data();
    	values.push(data[2]);
    });

    for (var i = 0; i < values.length; i++) {
    	var match = values[i].match(/₹[^0-9]*([\d,]+(\.\d{1,2})?)/);
    	if (match) {
    	  var incomeValue = parseFloat(match[1].replace(/,/g, ''));
    	  totalCostInLakhs += incomeValue;
    	}
    }
    var totalIncomeAmount = convertAmountToINR(totalCostInLakhs);
    $('#incomeFooterTotalAmount').text(totalIncomeAmount+" Lakhs");
}
/*------------------- EOF for Income Footer[05-12-2023] ------------------------------*/

// Expenditure Table
function expenditureTable() {
	table = $('#expenditure_dataTable').DataTable().clear().destroy();
	var expenditureTableId = $('#expenditure_dataTable').attr('id')

	var tableData = '';
	$.ajaxRequest
			.ajax({

				type : "POST",
				url : "/PMS/mst/getExpenditureByGroupByProject",
				success : function(response) {
					// console.log(response);
					for (var i = 0; i < response.length; i++) {
						var row = response[i];
						// console.log(row);
						var clickFunction = "viewProjectDetails('/PMS/projectDetails/"
								+ row.encProjectId + "')";
						tableData += '<tr ><td  class="font_14" style="width:15%;">'
								+ row.groupName + '</td>';
						tableData += '<td > <a class="font_14" title="Click to View Complete Information" onclick='
								+ clickFunction
								+ '>'
								+ row.projectName
								+ ' </a> </td>';
						tableData += ' <td class="font_14 text-right"> <input type="hidden" id="hiddenExpenditureAmt_'
								+ row.encProjectId
								+ '" value='
								+ row.encProjectId
								+ '/> <span  class="convert_lakhs_td" id="expenditureAmt_'
								+ row.encProjectId
								+ '">'
								+ row.strTotalExpenditure + '</td> </tr>';
					}

					$('#expenditure_dataTable > tbody').html('');
					$('#expenditure_dataTable').append(tableData);
					// convertToLakhsForComponent(expenditureTableId);
					table = $('#expenditure_dataTable').DataTable();

					$('#expenditure_dataTable .filters th[class="comboBox"]')
							.each(
									function(i) {
										var colIdx = $(this).index();
										var select = $(
												'<select style="width:100%" ><option value="">All</option></select>')
												.appendTo($(this).empty())
												.on(
														'change',
														function() {
															var val = $.fn.dataTable.util
																	.escapeRegex($(
																			this)
																			.val());
															table
																	.column(
																			colIdx)
																	.search(
																			val ? '^'
																					+ val
																					+ '$'
																					: '',
																			true,
																			false)
																	.draw();
														});

										table
												.column(colIdx)
												.data()
												.unique()
												.sort()
												.each(
														function(d, j) {
															select
																	.append('<option value="'
																			+ d
																			+ '">'
																			+ d
																			+ '</option>')
														});
									});

					// Setup - add a text input
					$('#expenditure_dataTable .filters th[class="textBox"]')
							.each(
									function() {
										$(this)
												.html(
														'<div class="lighter"><input type="text"  style="width:100%" /></div>');

									});

					// DataTable
					var table = $('#expenditure_dataTable').DataTable();

					// Apply the search
					table.columns().eq(0).each(
							function(colIdx) {
								$('input', $('.filters th')[colIdx]).on(
										'keyup change',
										function() {
											table.column(colIdx).search(
													this.value).draw();

										});
							});

				}

			});

}
/*
 * function convertToLakhsForComponent(tableId){
 * 
 * $(".convert_lakhs_td").each(function() { var fieldId=this.id;
 * 
 * var fieldValue = this.innerText;
 * 
 * if(fieldId){ var convertedStringAmount = convertINRToAmount(fieldValue);
 * 
 * var amount = (parseFloat(convertedStringAmount))/100000;
 * 
 * var convertedIntegerAmount=convertAmountToINR(roundUpTo2Decimal(amount,2));
 * 
 * $("#"+fieldId).text(convertedIntegerAmount +' Lakhs'); } }); }
 */
$(".emp").on("click", getColumnID);

function getColumnID() {

	var $td = $(this), $th = $td.closest('table').find('th').eq($td.index());
	// console.log($th.attr("id"));
	var designation = $th.attr("id");
	var group = $td.closest('tr').children('td:first').text();
	// console.log(group);

	$.ajaxRequest.ajax({

		type : "POST",
		url : "/PMS/mst/getEmpbyDesignationForGroup",
		data : {"group":group,
			"designation":designation
		},
		success : function(data) {
			// console.log(data);
			var tableData = "";
			for (var i = 0; i < data.length; i++) {
				var row = data[i];
				var sno = i + 1;
				tableData += "<tr><td>" + sno + "</td><td>" + row.employeeId
						+ "</td> <td>" + row.employeeName + "</td></tr>";

			}
			tableData += '</tbody>';

			$('#datatable1 tbody').empty();
			$('#datatable1').append(tableData);
			$('#empDetailModal').modal('show');

		}
	});
}

$(document)
		.ready(
				function() {

					// $('#example').DataTable();
					var table = $('#example').DataTable({
						"columnDefs" : [ {
							"orderable" : false,
							"targets" : 0
						} ],
						"order" : [ [ 1, 'asc' ] ]
					});

					table.on('order.dt search.dt', function() {
						table.column(0, {
							search : 'applied',
							order : 'applied'
						}).nodes().each(function(cell, i) {
							cell.innerHTML = i + 1;
							table.cell(cell).invalidate('dom');
						});
					}).draw();

					$('#example .filters th[class="comboBox"]')
							.each(
									function(i) {
										var colIdx = $(this).index();
										var select = $(
												'<select style="width:100%" ><option value="">All</option></select>')
												.appendTo($(this).empty())
												.on(
														'change',
														function() {
															var val = $.fn.dataTable.util
																	.escapeRegex($(
																			this)
																			.val());
															table
																	.column(
																			colIdx)
																	.search(
																			val ? '^'
																					+ val
																					+ '$'
																					: '',
																			true,
																			false)
																	.draw();
														});

										table
												.column(colIdx)
												.data()
												.unique()
												.sort()
												.each(
														function(d, j) {
															select
																	.append('<option value="'
																			+ d
																			+ '">'
																			+ d
																			+ '</option>')
														});
									});

					// Setup - add a text input
					$('#example .filters th[class="textBox"]')
							.each(
									function() {
										$(this)
												.html(
														'<div class="lighter"><input type="text"  style="width:100%" /></div>');

									});

					table.columns().eq(0).each(
							function(colIdx) {
								$('input', $('.filters th')[colIdx]).on(
										'keyup change',
										function() {
											table.column(colIdx).search(
													this.value).draw();

										});
							});

				});

$('#amtreceive')
		.on(
				'show.bs.modal',
				function(event) {
					var button = $(event.relatedTarget);
					var input = button.data('whatever');
					var inputs = input.split(';');
					var projectId = inputs[0];
					
					var split1 = $('#td2_'+projectId).find('p:eq(0)').text();
					var split2 = $('#td2_'+projectId).find('p:eq(1)').text();
					
					$('#projectForPayment').text(split1);
					$('#clientIdForPayment').text(split2);
					var startDate = inputs[1];
					var projectCost = inputs[2].trim();
					// console.log(projectCost);
					var tableData = "";
					$.ajax({
								type : "POST",
								url : "/PMS/mst/getProjectPaymentReceivedByProjectId",
								data : "encProjectId=" + projectId,
								async : false,
								success : function(response) {
									// console.log(response);
									var SumOfReceivedAmt = 0
									var paymentReceive = 0;
									var paymentDue = 0;
									
									paymentDue = parseFloat(convertINRToAmount(projectCost));
									tableData += "<tr><td>"
											+ startDate
											+ "</td><td><b>Total Project Cost</b></td><td class='text-right'><b>"
											+ convertAmountToINR(paymentDue)
											+ "</b></td><td class='text-right'>â‚¹ "
											+ paymentReceive + "</td></tr>";

									for (var i = 0; i < response.length; i++) {
										var row = response[i];
										var newAmt = row.numReceivedAmount;
										SumOfReceivedAmt += newAmt;
										tableData += "<tr><td>"
												+ row.strdtPayment + "</td> ";
										tableData += "<td><p>"
												+ row.strPaymentMode + " , "
												+ row.strUtrNumber
												+ "</p><p class='pad-left'><b>";
										if (row.encInvoiceId != null) {
											tableData += "Payment Received Against Invoice Ref No. : </b><a title='Click here to view Invoice details' data-toggle='modal' data-target='#invoiceDetail' onclick=viewInvoiceDetails('"
													+ row.encInvoiceId
													+ "') class='text-center'>"
													+ row.invoiceCode
													+ "</a></p></td>";
											tableData += "<td class='text-right'>"
													+ row.paymentDue
													+ "</td> <td class='text-right'>"
													+ convertAmountToINR(newAmt)
													+ "</td></tr>";

										} else {
											tableData += "Payment Received without Invoice Details : </b></p></td>";
											tableData += "<td class='text-right'>"
													+ row.paymentDue
													+ "</td> <td class='text-right'>"
													+ convertAmountToINR(row.numBalanceAmount)
													+ "</td></tr>";

										}
									}
									if (SumOfReceivedAmt
											&& SumOfReceivedAmt > 0) {
										tableData += "<tr><td colspan='3' class='font_eighteen text-right'><b>Total Payment Received:</b></td><td class='font_eighteen text-right'><b>"
												+ convertAmountToINR(SumOfReceivedAmt)
												+ "</b></td> </tr>";
										tableData += "<tr><td colspan='3' class='font_eighteen text-right'><b>Payment Remaining:</b></td><td class='font_eighteen text-right'><b>"
												+ row.paymentDue
												+ "</b></td> </tr>";

									}
									tableData += '</tbody>';
									$('#datatable tbody').empty();
									$('#datatable').append(tableData);
								},
								error : function(e) {
									alert('Error: ' + e);
								}
							});
					$(this).off('shown.bs.modal');
				});

var scrollPos = 0;
$('#clientDetails').on('show.bs.modal', function(event) {
	//console.log("inside client modal");
	var button = $(event.relatedTarget);
	var input = button.data('whatever');
	// console.log("data"+input);
	if (typeof input !== 'undefined') {
		var inputs = input.split(';');
		var clientId = inputs[0];
		var projectId = inputs[1];
		var endUserId= inputs[2];
		loadClientData(clientId,projectId,endUserId);
	}
	$('body').css({
		overflow : 'hidden',
		position : 'fixed',
		top : -scrollPos
	});
}).on('hide.bs.modal', function() {
	$('body').css({
		overflow : '',
		position : '',
		top : ''
	}).scrollTop(scrollPos);
});

$( function() {
	  var dateFormat = "dd/mm/yy",
	    from = $( "#fromRes" )
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
	    to = $( "#toRes" ).datepicker({
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

	  $('.go-btn-resign').click(function() {
		  var startRange = $("#fromRes").val();
		  var endRange = $("#toRes").val();
		  if(!startRange){
			  sweetSuccess('Attention','Please select Start Range');
			  return false;
		  }
		  var selectedRange = startRange;
		  if(endRange){
			  selectedRange = selectedRange +' to '+endRange;
		  }
		  $('#asOnDateResign').text(selectedRange);
		  
		  //alert('Called');
		  newResignEmpTable();
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
	    from = $( "#fromJoin" )
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
	    to = $( "#toJoin" ).datepicker({
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

	  $('.go-btn-join').click(function() {
		  var startRange = $("#fromJoin").val();
		  var endRange = $("#toJoin").val();
		  if(!startRange){
			  sweetSuccess('Attention','Please select Start Range');
			  return false;
		  }
		  var selectedRange = startRange;
		  if(endRange){
			  selectedRange = selectedRange +' to '+endRange;
		  }
		  $('#asOnDateJoinee').text(selectedRange);
		  
		  //alert('Called');
		  newJoineeEmpTable();
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
	        $('.monthsClosedProjects').val(0);  // reset the months fields [12-10-2023]
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
	      $('.monthsClosedProjects').val(0);  // reset the months fields [12-10-2023]
	    });
	  
	  $('.go-btn1').click(function() {
		  var startRange = $("#from1").val();
		  var endRange = $("#to1").val();
		 // console.log("go-btn1 startRange"+startRange)
		  //console.log("go-btn1 endRange"+endRange)
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

$( function() {
	  var dateFormat = "dd/mm/yy",
	    from = $( "#fromGroup" )
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
	    to = $( "#toGroup" ).datepicker({
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
	  
	  $('.go-btn-group').click(function() {
		  var startRange = $("#fromGroup").val();
		  var endRange = $("#toGroup").val();
		  var groupId=$("#grpId").val();
		  $("#fromDetNew").val('');
		 // console.log("go-btn1 startRange"+startRange)
		 // console.log("go-btn1 endRange"+endRange)
		  if(!startRange){
			  sweetSuccess('Attention','Please select Start Range');
			  return false;
		  }
		  var selectedRange = startRange;
		  if(endRange){
			  selectedRange = selectedRange +' to '+endRange;
		  }
		 
	 /* $('#asOnDateClosedProjects').text(selectedRange);*/
		  closedProjectsNew(groupId,1);
		  
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
		    from = $( "#fromJoinNew" )
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
		    to = $( "#toJoinNew" ).datepicker({
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
		  
		  $('.go-btn-joinNew').click(function() {
			  var startRange = $("#fromJoinNew").val();
			  var endRange = $("#toJoinNew").val();
			  var groupId=$("#joinGroupId").val();
			  $("#fromDetNew").val('');
			 // console.log("go-btn1 startRange"+startRange)
			 // console.log("go-btn1 endRange"+endRange)
			  if(!startRange){
				  sweetSuccess('Attention','Please select Start Range');
				  return false;
			  }
			  var selectedRange = startRange;
			  if(endRange){
				  selectedRange = selectedRange +' to '+endRange;
			  }
			 
			 
			  //$('#asOnDateJoinee').text(selectedRange);
			 joineeEmployeeList(groupId,1);
			
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
		    from = $( "#fromProposalNew" )
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
		    to = $( "#toProposalNew" ).datepicker({
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
		  
		  $('.btn-successNew').click(function() {
			  var startRange = $("#fromProposalNew").val();
			  var endRange = $("#toProposalNew").val();
			  var groupId=$("#proposalGrpId").val();
			  var hiddenFromVal=$("#fromDetNew").val();
				
			  $("#hiddenFromVal").val('');
			  //$("#toDet").val('');
			 /* $("#toResNew").val('');
			  $("#asOnDateRes1").text('');
			  $("#toJoinNew").val('');
			  $("#fromJoinNew").val('');
			  $("#asOnDateJoin1").text('');
			  
			  $("#fromGroup").val('');
			  $("#toGroup").val('');
			  $("#asOnDateClosedProj1").text('');
			  
			  $("#fromNew").val('');
			  $("#toNew").val('');
			  $("#asOnDateProj1").text('');
			  
			  $("#fromProposalNew").val('');
			  $("#toProposalNew").val('');
			  $("#asOnDateProp1").text('');*/
			
			 // console.log("go-btn1 startRange"+startRange)
			 // console.log("go-btn1 endRange"+endRange)
			  if(!startRange){
				  sweetSuccess('Attention','Please select Start Range');
				  return false;
			  }
			  var selectedRange = startRange;
			  if(endRange){
				  selectedRange = selectedRange +' to '+endRange;
			  }
			 
			 // $('#asOnDateProposals').text(selectedRange);
			  proposalSubmittedNew(groupId,1);
			
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
		    from = $( "#fromNew" )
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
		    to = $( "#toNew" ).datepicker({
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
		  
		  $('.go-btnNew').click(function() {
			  var startRange = $("#fromNew").val();
			  var endRange = $("#toNew").val();
			  var groupId=$("#projectGroupId").val();
			  $("#fromDetNew").val('');
			  //console.log("go-btn1 startRange"+startRange)
			 // console.log("go-btn1 endRange"+endRange)
			  if(!startRange){
				  sweetSuccess('Attention','Please select Start Range');
				  return false;
			  }
			  var selectedRange = startRange;
			  if(endRange){
				  selectedRange = selectedRange +' to '+endRange;
			  }
			 
			/*  $('#asOnDateProjects').text(selectedRange);*/
			  projectReceivedNew(groupId,1);
			
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
		    from = $( "#fromResNew" )
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
		    to = $( "#toResNew" ).datepicker({
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
		  
		  $('.go-btn-resignNew').click(function() {
			  var startRange = $("#fromResNew").val();
			  var endRange = $("#toResNew").val();
			  var groupId=$("#resignGroupId").val();
			  $("#fromDetNew").val('');
			//  console.log("go-btn1 startRange"+startRange)
			 // console.log("go-btn1 endRange"+endRange)
			  if(!startRange){
				  sweetSuccess('Attention','Please select Start Range');
				  return false;
			  }
			  var selectedRange = startRange;
			  if(endRange){
				  selectedRange = selectedRange +' to '+endRange;
			  }
			 
				 
			  //$('#asOnDateResign').text(selectedRange);
			  resignEmployeelist(groupId,1);
			
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
	  
	});






$( function() {
	  var dateFormat = "dd/mm/yy",
	    from = $( "#incomefromNew" )
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
	    to = $( "#incometoNew" ).datepicker({
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
	  
	  $('.go-btn2-New').click(function() {
		  var startRange = $("#incomefromNew").val();
		  var endRange = $("#incometoNew").val();
		  var groupId= $("#incomeGroupId").val();
		  $("#fromDetNew").val('');
		  //console.log("go-btn2 startRange"+startRange)
		  //console.log("go-btn2 endRange"+endRange)
		  if(!startRange){
			  sweetSuccess('Attention','Please select Start Range');
			  return false;
		  }
		  var selectedRange = startRange;
		  if(endRange){
			  selectedRange = selectedRange +' to '+endRange;
		  }
		 
		 /* $('#asOnDate').text(selectedRange);*/
		  //alert('Called');
		  incomeTableNew(groupId,1);
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
	     // reset the select month years zero by varun 
		      $('#months').val(0);
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
	        $('.months1').val(0); // 12-10-2023
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
	      $('.months1').val(0); // 12-10-2023
	      months1
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


function viewAllProjectData(){
	openWindowWithPost('POST','/PMS/generateReportForInterface3',{"eCode":"EPRJ"},'_blank');
	}
function initializeNewProposals() {
	newProposalsTable();
}
function initializeNewProjects() {
	newProjectsTable();
}
function initializeClosurePending() {
	pendingClosuresTable();
}

	function initializeClosedProjects() {		
		closedProjectsTable();
	}
	
	function initializeNewJoinee() {
		newJoineeEmpTable();
	}
	
	function initializeResignedEmp() {
		newResignEmpTable();
	}

	
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
	$(document).ready(function() {
		var strStart = "01/04/";
		var strEnd = "31/03/";
		var d = new Date();
		var currentYear = d.getFullYear();
		var currentMonth = d.getMonth();
		var lastYear = d.getFullYear() - 1;
		//alert("as on date"+currentYear);
		var dateString = '01/01/'+currentYear;
		
		/*if(currentMonth<=2){
			dateString  += lastYear;
		}
		else{
			dateString  += currentYear;
		}*/
		
		
		
		//alert("dateString"+dateString);
		//$("#asOnDate").text(dateString);
		//$("#asOnDate1").text(dateString);
		 //$("#asOnDateExp").text(dateString);
		 $("#asOnDateProjects").text(dateString);
		 $("#asOnDateProposals").text(dateString);
		 $("#asOnDateClosedProjects").text(dateString);

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
					tableData += '<tr> <td class="grey-text">'+(i+1)+'</td> <td class="font_14 grey-text">'+ row.strGroupName +  '</td><td> <a class="font_14 grey-text" title="Click to View Complete Information" onclick='+clickFunction+'>'
					+ row.strProjectName + ' </a><p class="bold grey-text font_14 text-left">'+ row.projectRefrenceNo+'<p></td><td class="font_14 orange grey-text">'+row.clientName+'</td>';
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
						tableData += '<tr> <td class="golden-text">'+(i+1)+'</td> <td class="font_14 golden-text">'+ row.strGroupName +  '</td><td> <a class="font_14 golden-text" title="Click to View Complete Information" onclick='+clickFunction+'>'
						+ row.strProjectName + ' </a><p class="bold golden-text font_14 text-left">'+ row.projectRefrenceNo+'<p></td><td class="font_14 orange golden-text">'+row.clientName+'</td>';
						/*tableData += '<tr> <td>'+(i+1)+'</td><td>'+row.strGroupName+'</td> <td> <a class="font_14" title="Click to View Complete Information" onclick='+clickFunction+'>'
								+ row.strProjectName + ' </a><p class="font_14 orange"><i>'+row.clientName+'</i></p><p class="bold blue font_14 text-left">'+ row.projectRefrenceNo+'<p></td>';*/
						
					if(row.strPLName==null || row.strPLName==''){
							row.strPLName='';
						}
						tableData += ' <td class="font_16 golden-text">'+ row.strPLName +  '</td>';
						tableData += ' <td class="font_14 text-right golden-text">'+ row.startDate +  '</td>';
						
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
				var  table= $('#pendingCLosure_dataTable').DataTable( {
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
				
				$('#pendingCLosure_dataTable .filters th[class="comboBox"]').each( function ( i ) {
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
					/*------------------------ Get the Filter of Status By Order [26-09-2023] ------------------------------------------------*/
						$('#pendingCLosure_dataTable .filters th[id="statusComboBox"]').each( function ( i ) {
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
						                               "Project Closure Not Initiated",
						                               "Pending At PL",
						                               "Pending At HOD",
						                               "Pending At GC",
						                               "Pending At PMO"
						                               ];
						            projectStatus.forEach(function (d) {
				                         select.append('<option value="' + d + '">' + d + '</option>');
				                     });
					        } );
						/*----------------------------------- EOF [29-08-2023] -------------------------------------------*/

				 // Setup - add a text input
		       $('#pendingCLosure_dataTable .filters th[class="textBox"]').each( function () {                 
		           $(this).html( '<div class="lighter"><input type="text"  style="width:100%" /></div>' );

		       } );

               // DataTable
               var table = $('#pendingCLosure_dataTable').DataTable();
		       
		       table.columns().eq( 0 ).each( function ( colIdx ) {
		           $( 'input', $('.filters th')[colIdx] ).on( 'keyup change', function () {
		               table
		                           .column( colIdx )
		                           .search( this.value )
		                           .draw() ;
		                   
		                                           } );
		} );	                     
			}
			}
		});
	}
	
	$(document).ready(function(){			
		var  table= $('#employeeWithInvolvementsTblByGroup').DataTable( {		
			destroy: true,
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
	})

	$(document).ready(function(){			
		var  table= $('#employeeWithInvolvementsTbl').DataTable( {		
			destroy: true,
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
			
			$('#employeeWithInvolvementsTbl .filters th[class="comboBox"]').each( function ( i ) {
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
	       $('#employeeWithInvolvementsTbl .filters th[class="textBox"]').each( function () {                 
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
	
$('#Employee-Details-modal').on('shown.bs.modal', function(event) {
		
		$.ajaxRequest.ajax({
			type : "POST",
			url : "/PMS/mst/getEmployeeDetails",
			success : function(data) {
				//console.log(data);	
				var tableData = '';
				var involvment='';
				var pendingInv='';
				for(var i=0;i<data.length;i++){
					
					var row = data[i];
					if(row.involvment==-1){
						involvment='<span class="red">Not yet mapped</span>'
					}
					else{
						involvment=row.involvment
					}
					
					if(row.pendingInv==-1){
						pendingInv=''
					}
					else{
						pendingInv=row.pendingInv
					}
				
					tableData +='<tr><td class="text-right">'+(i+1)+'  </td><td>'+row.groupName+'</td><td><p style="color: #1a7dc4;" class="font_14">'+row.employeeId +'</p></td>';
					tableData +='<td class="">'+row.employeeName+'</td>';
					tableData +='<td>'+row.strDesignation+'</td>';
					/*tableData +='<td>'+row.mobileNumber+'</td>';*/
					tableData +='<td><a class="font_14" data-toggle="modal" data-target="#empProjectDetails" data-whatever="'+row.encEmployeeId +';'+row.employeeName+'">'+ involvment + ' </a></td>';
					tableData +='<td>'+pendingInv+'</td></tr>';
					
				}
				
				 
				$('#employeeDetails').DataTable().clear().destroy();
				$('#employeeDetails tbody').append(tableData);
		
				var  table= $('#employeeDetails').DataTable( {
					destroy: true,
					dom: 'Bfrtip',		       
			        "ordering": true,
			        "paging":   false,
			        buttons: [
			             'excel', 'pdf', 'print'
			        ],
						"columnDefs": [ {

				        "orderable": true,
				            
			            "targets": 0
			        } ]
			       /* "order": [[ 1, 'asc' ]]*/
			    } );
					
					table.on('order.dt search.dt', function () {
						table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
					           cell.innerHTML = i+1;
					           table.cell(cell).invalidate('dom');
					     });
					}).draw();
					
					$('#employeeDetails .filters th[class="comboBox"]').each( function ( i ) {
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
			       $('#employeeDetails .filters th[class="textBox"]').each( function () {                 
			           $(this).html( '<div class="lighter"><input type="text"  style="width:100%" /></div>' );

			       } );

	               // DataTable
	               var table = $('#employeeDetails').DataTable();
			       
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
	});
	
	
	function loadEmployeeDetails(){
		
		$.ajaxRequest.ajax({
			type : "POST",
			url : "/PMS/mst/loadEmployeeDetailsCount",
		
			success : function(data) {	
				//console.log(data);
				if($.isNumeric(data)){
					
					$('#empDetailsCount').text(data);
				}else{
					$('#empDetailsCount').text(0);
				}
				
			}
		});
	}
	$(document).ready(function(){
		loadEmployeeDetails()
	});
	
	function filterTable(empType){
		$('#employeeWithInvolvementsTbl').get(0).scrollIntoView()
							var  table= $('#employeeWithInvolvementsTbl').DataTable( {		
			destroy: true,
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
			
			
		        var colIdx=5;
		           
		           var val = empType;
		           
		                 table.column(colIdx)
		                        .search( val ? '^'+val+'$' : '', true, false)
		                        .draw();
		                
		     
		            

				


		
		
}		
			
	$('#empProjectDetails').on('show.bs.modal', function(event) {
		var button = $(event.relatedTarget);
		var input = button.data('whatever');
		var inputs=input.split(';');
		var empId=inputs[0];
		var empName=inputs[1];
	
		$('#employeeName').text(empName);
		
		var tableData = "";
		$.ajaxRequest.ajax({
			type : "POST",
			url : "/PMS/mst/activeRolesByEmpId",
			data : {"encEmpId": empId},
			async:false,
			success : function(response) {
			//console.log(response);
			for(var i =0;i<response.length;i++){
				var row=response[i];
				
				var serialNo=i+1;
				if(row.primaryProject == 1)
				tableData+='<tr class="orange bg_grey"><td >'+serialNo+'</td>';
				else
					tableData+='<tr ><td >'+serialNo+'</td>';

				tableData+='<td >'+row.strProjectName+'</td>';
				tableData+='<td >'+row.strRoleName+'</td>';
				tableData+='<td >'+row.strStartDate+'</td>';
				if(row.strEndDate !=null){
					tableData+='<td >'+row.strEndDate+'</td>';
				}
				else{
					tableData+='<td></td>'
				}
				tableData+='<td >'+row.involvement+'</td>';
				
				tableData+='<td class="hidden ">'+row.primaryProject+'</td>  ';

				tableData+='</tr>';
				//console.log(row.primaryProject);
				

			}
			
				tableData+='</tbody>';
				$('#empInvTable tbody').empty();						
				$('#empInvTable').append(tableData);	
				
			},
			error : function(e) {
				alert('Error: ' + e);			
			}
		});				
	});
	
	function allDetailsTable(){
		var startDate = null;
		var endDate = null;
		var selectedDateRange = $('#asOnDateDetails').text().trim();

		$('#asOnDateDetails1').text(selectedDateRange);
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
		$('#allDetailsTable').DataTable().clear().destroy();
			
		 var tableData = '';
		 var footerData='';
		 var data='';
		 var groupName='';
		 var submittedProposalCount='';
		 var projectReceviedCount='';
		 var closedProposalCout='';
		 var  joinEmpCout='';
		 var employeeCount='';
		 var resignEmpCount='';
		 var income='';
		 var totalProjects='';
		
			$.ajaxRequest.ajax({
				type : "POST",
				url : "/PMS/mst/getAllDetails",
				data:{
					"startDate":startDate,
					"endDate":endDate
				},
				success : function(response) {
					/*$('.datatable_tfoot').hide();*/
					var curr = "Lakhs";
					var Lakhs = curr.fontcolor("#a4a4a4");
					var count =0;
					$.each( response, function(index,value){
					
		        		 data=value;
		        		 groupName=index;
		        			 
		        		// alert(data.submittedProposalCount);
		        		 if(data.submittedProposalCount!=null){
		        			 submittedProposalCount=data.submittedProposalCount;
		        		 }
		        		 else{
		        			 submittedProposalCount='';
		        		 }
		        		 
		        		 if(data.resignEmpCount!=null){
		        			 resignEmpCount=data.resignEmpCount;
		        		 }
		        		 else{
		        			 resignEmpCount='';
		        		 }
		        		 if(data.joinEmpCout!=null){
		        			 joinEmpCout=data.joinEmpCout;
		        		 }
		        		 else{
		        			 joinEmpCout='';
		        		 }
		        		 if(data.closedProposalCout!=null){
		        			 closedProposalCout=data.closedProposalCout;
		        		 }
		        		 else{
		        			 closedProposalCout='';
		        		 }
		        		 if(data.projectReceviedCount!=null){
		        			 projectReceviedCount=data.projectReceviedCount;
		        		 }
		        		 else{
		        			 projectReceviedCount='';
		        		 }
		        		 if(data.income!=null){
		        			 income=data.income  + " Lakhs";
		        			 income1 =data.income;
		        		 }
		        		 else{
		        			 income='';
		        		 }
		        		 
		        		 if(data.employeeCount!=null){
		        			 employeeCount=data.employeeCount;
		        		 }
		        		 else{
		        			 employeeCount='';
		        		 }
		        		 if(data.totalProjects!=null){
		        			 totalProjects=data.totalProjects;
		        		 }
		        		 else{
		        			 totalProjects='';
		        		 }
		        		 
		        		 if(groupName=='Total'){
		        			 footerData += '<tr class="no-sort sorting_disabled white">';	
		        			 footerData += ' <td></td> ';
		        			 footerData += ' <td class="bold">'+ groupName +  '</td> ';
							 if(data.submittedProposalCount!=null){
								 footerData += ' <td class="bold text-right">'+ submittedProposalCount +  '<br><span class="white bold  ">'+data.strTotalCost+' Lakhs</span></td> ';
							 }
							 else{
								 footerData += ' <td class="bold text-right">'+ submittedProposalCount +  '</td> ';
							 }
							 if(data.projectReceviedCount!=null){
								 footerData += ' <td class=" bold text-right">'+ projectReceviedCount +  '<br/><span class="white  bold ">'+data.strProjectTotalCost+' Lakhs</span></td> ';
							 }
							 else{
								 footerData += ' <td class="bold text-right">'+ projectReceviedCount +  '</td> ';
							 }
							 footerData += ' <td class="bold text-right ">'+ closedProposalCout +  '</td> ';
							 footerData += ' <td class="bold text-right">'+ income1 +  ' Lakhs</td>';
							 footerData += ' <td class="bold text-right">'+joinEmpCout +  '</td> ';
							 footerData += ' <td class="bold text-right">'+ resignEmpCount +  '</td> ';
							 footerData += ' <td class="bold text-right">'+ employeeCount +  '</td> ';
							if(data.totalProjects!=null){
								footerData += ' <td class="bold text-right">'+ totalProjects +  '<br/><span class="bold ">'+data.totalOutlayOfProject+' Lakhs</span></td> ';
							}
							else{
								footerData += ' <td class="white bold text-right">'+ totalProjects +  '</td> ';	
							}
							footerData += ' </tr> ';
		        		 }
		        		 else{
		        			 count += 1;
		        			 tableData += '<tr>';	
		        			 tableData += ' <td >'+count+'</td> ';
								tableData += ' <td class="font_blue">'+ groupName +  '</td> ';
								 if(data.submittedProposalCount!=null){
								tableData += ' <td class="text-right"><a title="Click here to view details" class="black bold" data-toggle="modal" data-target="#dash-newProposalListByGroup-modal" data-whatever="'+data.encGroupId+','+data.groupName+'" >'+ submittedProposalCount + ' </a><br/><span class="dark-grey-font bold">'+data.strTotalCost+' Lakhs</span></td> ';
								 }
								 else{
									 tableData += ' <td class=" text-right"><a title="Click here to view details" class="black  bold"  data-toggle="modal" data-target="#dash-newProposalListByGroup-modal" data-whatever="'+data.encGroupId+','+data.groupName+' ">'+ submittedProposalCount +  '</a></td> ';
								 }
								 if(data.projectReceviedCount!=null){
								tableData += ' <td class="text-right"><a title="Click here to view details" class="black bold"  data-toggle="modal" data-target="#dash-newProjectListByGroup-modal" data-whatever="'+data.encGroupId+','+data.groupName+' ">'+ projectReceviedCount +  '</a><br/><span class="dark-grey-font bold">'+data.strProjectTotalCost+' Lakhs</span></td> ';
								 }
								 else{
									 tableData += ' <td class=" text-right"><a title="Click here to view details" class="black bold" data-toggle="modal" data-target="#dash-newProjectListByGroup-modal" data-whatever="'+data.encGroupId+','+data.groupName+' ">'+ projectReceviedCount +  '</a></td> ';
								 }
								tableData += ' <td class=" text-right "><a title="Click here to view details" class="black  bold" data-toggle="modal" data-target="#dash-closedProjectListByGroup-modal" data-whatever="'+data.encGroupId+','+data.groupName+' ">'+ closedProposalCout +  '</a></td> ';
								tableData += ' <td class=" text-right"><a title="Click here to view details" class="dark-grey-font  bold" data-toggle="modal" data-target="#dash-incomeByGroup-modal" data-whatever="'+data.encGroupId+','+data.groupName+' ">'+ income +  ' </a></td> ';
								tableData += ' <td class=" text-right"><a title="Click here to view details" class="black  bold" data-toggle="modal" data-target="#dash-new-joinee-ByGroup-modal" data-whatever="'+data.encGroupId+','+data.groupName+' ">'+joinEmpCout +  '</a></td> ';
								tableData += ' <td class=" text-right"><a title="Click here to view details" class="black  bold" data-toggle="modal" data-target="#dash-resigned-empByGroup-modal" data-whatever="'+data.encGroupId+','+data.groupName+' ">'+ resignEmpCount +  '</a></td> ';
								tableData += ' <td class=" text-right"><a title="Click here to view details" class="black  bold"  data-toggle="modal" data-target="#dash-employee-group-modal" data-whatever="'+data.encGroupId+','+data.groupName+' ">'+ employeeCount +  '</a></td> ';
								
								if(data.totalProjects!=null){
									tableData += ' <td class=" text-right"><a title="Click here to view details" class="black  bold" onclick=loadGroupWiseProjects("'+data.encGroupId+'")>'+ totalProjects +  '</a><br/><span class=" dark-grey-font bold ">'+data.totalOutlayOfProject+' Lakhs</span></td> ';
								}
								else{
									tableData += ' <td class=" text-right"><a title="Click here to view details" class="black  bold" onclick=loadGroupWiseProjects("'+data.encGroupId+'")>'+ totalProjects +  '</a></td> ';
								}
								tableData += ' </tr> ';
		        		 }
		        			
					})				

					
					$('#allDetailsTable').append(tableData);	
					 var foot = $("#allDetailsTable").find('tfoot');
					 if(foot.length){
						 $("#allDetailsTable tfoot").remove();
					 }
					 if(footerData){
					    foot = $('<tfoot class="datatable_tfoot" style="background: #1580d0;">').appendTo("#allDetailsTable"); 
					    foot.append($(footerData));
					 }
					var  table= $('#allDetailsTable').DataTable( {
						destroy: true,
						 "info": false,
				        "paging":   false,
				        "columnDefs": [ {
				            "searchable": false,
				            "orderable": false,
				            "targets": 0
				        } ],
				        "order": [[ 1, 'asc' ]]
				    } );
				 
					table.on( 'order.dt search.dt', function () {
						table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
				            cell.innerHTML = i+1;
				        } );
				    } ).draw();
				      
					
				       
				  
						
						/*table.on('order.dt search.dt', function () {
							table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
						           cell.innerHTML = i+1;
						           table.cell(cell).invalidate('dom');
						     });
						}).draw();
						
						$('#resigned_dataTable .filters th[class="comboBox"]').each( function ( i ) {
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
				       $('#resigned_dataTable .filters th[class="textBox"]').each( function () {                 
				           $(this).html( '<div class="lighter"><input type="text"  style="width:100%" /></div>' );

				       } );

		               // DataTable
		               var table = $('#resigned_dataTable').DataTable();
				       
				       table.columns().eq( 0 ).each( function ( colIdx ) {
				           $( 'input', $('.filters th')[colIdx] ).on( 'keyup change', function () {
				               table
				                           .column( colIdx )
				                           .search( this.value )
				                           .draw() ;
				                   
				                                           } );
				} );			                     
		*/		}
			});
		}
		}
		
	$( function() {
		  var dateFormat = "dd/mm/yy",
		    from = $( "#fromDet" )
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
		    to = $( "#toDet" ).datepicker({
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

		  $('.go-btn-det').click(function() {
			  var startRange = $("#fromDet").val();
			  var endRange = $("#toDet").val();
			  $("#fromDetailNew").val(startRange);
			  $("#toDetailNew").val(endRange);
			  $("#fromResNew").val('');
			  $("#toResNew").val('');
			  $("#asOnDateRes1").text('');
			  
			  $("#toJoinNew").val('');
			  $("#fromJoinNew").val('');
			  $("#asOnDateJoin1").text('');
			  
			  $("#fromGroup").val('');
			  $("#toGroup").val('');
			  $("#asOnDateClosedProj1").text('');
			  
			  $("#fromNew").val('');
			  $("#toNew").val('');
			  $("#asOnDateProj1").text('');
			  
			  $("#fromProposalNew").val('');
			  $("#toProposalNew").val('');
			  $("#asOnDateProp1").text('');
			  
			  $("#incomefromNew").val('');
			  $("#incometoNew").val('');
			  $("#asOnDateNew1").text('');
			  if(!startRange){
				  sweetSuccess('Attention','Please select Start Range');
				  return false;
			  }
			  var selectedRange = startRange;
			  if(endRange){
				  selectedRange = selectedRange +' to '+endRange;
			  }
			  $('#asOnDateDetails').text(selectedRange);
			  
			  allDetailsTable();
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
	
	function proposalSubmittedNew(input,requestFrom){
	/*$("#fromProposalNew").val('');
	$("#toProposalNew").val('');*/
	var data=input.split(",");
	var encGroupId=data[0];
	var groupName= data[1];
	var startDate = null;
	var endDate = null;
	
	$("#propSubGroupName").text(groupName);
	var toProposalNew=$("#toProposalNew").val();
	var fromProposalNew=$("#fromProposalNew").val();
	var fromDet=$("#fromDetailNew").val();
	var toDet=$("#toDet").val();
	var hiddenFromVal=$("#fromDetNew").val();
	hiddenFromVal=fromDet;
	if(requestFrom == 0){
		
		$("#fromProposalNew").val('');
		$("#toProposalNew").val('');
	}
	if($("#fromProposalNew").val()=='' && hiddenFromVal!=''){
		
	
		startDate=fromDet;
		endDate=toDet;
		
	}
	else{
		
		startDate=fromProposalNew;
		endDate=toProposalNew;
		
}
	$("#fromProposalNew").val(startDate);
	$("#toProposalNew").val(endDate);
	var finalDateRange=startDate +' to '+ endDate;
	
	$('#asOnDateProp1').text(finalDateRange);
	
		if(startDate){	
			$('#newProposalsByGroup_dataTable').DataTable().clear().destroy();
		 var tableData = '';
		
			$.ajaxRequest.ajax({
				type : "POST",
				url : "/PMS/mst/getActiveProposalsByGroup",
				data:{
					"startDate":startDate,
					"endDate":endDate,
					"encGroupId":encGroupId
				},
				success : function(response) {
				
					
					var totalAmount = 0;
					for (var i = 0; i < response.length; i++) {
						var row = response[i];
									
						tableData += '<tr> <td>'+(i+1)+'</td>';
						
						tableData += ' <td style="color: #1a7dc4;" class="font_14">'+ row.proposalTitle +  '<p class="font_14 orange"><i>'+row.strClientName+'</i></p></td> ';
						/*tableData += ' <td class="font_14 ">'+ row.strClientName +  '</td> ';*/
						tableData += ' <td class="font_14 text-right">'+ row.dateOfSubmission +  '</td> ';
						tableData += ' <td class="font_14 text-right">'+ row.duration +  ' months </td> ';
						
						
						if(row.receivedProjectStatus=='Yes'){
							
							tableData += '<td class="font_14"> <a title="Click to View Project Details" onclick=openProjectDetails("'+row.encApplicationId+'")>'
						+ row.receivedProjectStatus + ' </a></td>';
					}
					else{
						tableData += ' <td class="font_14">'+ row.receivedProjectStatus +  '</td> ';
					}
					
					tableData += ' <td class="font_14 text-right"> <input type="hidden" id="hiddenProjectCost_'+row.encApplicationId+'" value='+row.encApplicationId+' /> <span id="projectCost_'+row.encApplicationId+'">'
					+ row.strProposalCost + '</span></td> </tr>';
		
					totalAmount += row.numProposalAmountLakhs;
				
					}

					if(totalAmount >0){
						tableData +='<tr> <td></td> <td>Total of All Group</td><td></td> <td></td><td class="bold text-right">Total</td> <td class="bold text-right">'+convertAmountToINR(totalAmount)+' Lakhs </td></tr>';
					}
					
					$('#newProposalsByGroup_dataTable').append(tableData);	        

					
					var  table= $('#newProposalsByGroup_dataTable').DataTable( {
						destroy: true,
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
					
								       

				},
				error : function(e) {
					
					alert('Error: ' + e);
				}
			});
				
		};
		}

			function closedProjectsNew(input,requestFrom){
			var startDate = null;
			var endDate = null;
			var data=input.split(",");
			var encGroupId=data[0];
			var groupName= data[1];
			$("#projClosedGroupName").text(groupName);
			var toGroup=$("#toGroup").val();
			var fromGroup=$("#fromGroup").val();
			var fromDet=$("#fromDetailNew").val();
			var toDet=$("#toDet").val();
			var hiddenFromVal=$("#fromDetNew").val();
			hiddenFromVal=fromDet;
			if(requestFrom == 0){
				
				$("#fromGroup").val('');
				$("#toGroup").val('');
			}
			
			if($("#fromGroup").val()=='' && hiddenFromVal!=''){
			
				startDate=fromDet;
				endDate=toDet;
			
			}else{
				startDate=fromGroup;
				endDate=toGroup;
			}
			
			$("#fromGroup").val(startDate);
			$("#toGroup").val(endDate);
			var finalDateRange=startDate +' to '+ endDate;
			
			$('#asOnDateClosedProj1').text(finalDateRange);
			if(startDate){		
			
			 $('#closedProjectsByGroup_dataTable').DataTable().clear().destroy();
			 var tableData = '';
				$.ajaxRequest.ajax({
					type : "POST",
					url : "/PMS/mst/getAllClosedProjectByGroup",
					data:{
						"startDate":startDate,
						"endDate":endDate,
						"encGroupId":encGroupId
					},
					success : function(response) {				
				/*		if(response){
						$('#closedProjectsOnDate').text(response.length); 
					}else{
						$('#closedProjectsOnDate').text(0); 
					}*/
						var totalAmount = 0;
						for (var i = 0; i < response.length; i++) {
							var row = response[i];	
							var strReferenceNumber=row.strReferenceNumber;
							if(!strReferenceNumber){
								strReferenceNumber='';
							}
							var clickFunction = "viewProjectDetails('/PMS/projectDetails/"
									+ row.encProjectId + "')";
						
							tableData += '<tr><td>'+(i+1)+'</td><td> <a class="font_14" title="Click to View Complete Information" onclick='+clickFunction+'>'
									+ row.strProjectName + ' </a><p class="font_14 orange"><i>'+row.strClientName+'</i></p><p class="bold blue font_14 text-left">'+ strReferenceNumber+'<p> </td>';
							
					
							tableData += ' <td class="font_14 text-right"> <span  class="" >'
							+ row.startDate
							+  '</span></td> ';
							
							
							tableData += ' <td class="font_14 text-right"> <span  class="" >'
								+ row.projectClosureDate
								+  '</span></td>';
							tableData += ' <td class="font_14 text-right"> <input type="hidden" id="hiddenProjectCost_'+row.encProjectId+'" value='+row.encProjectId+'/> <span  class="" id="projectCost_'+row.encProjectId+'">'
							+ row.strProjectCost
							+  '</span></td> </tr>';
						
							
							totalAmount += row.numProjectAmountLakhs;
						}

						if(totalAmount >0){
							tableData +='<tr><td> </td> <td> Total of All Group</td>  <td> </td> <td class="bold text-right">Total</td> <td class="bold text-right">'+convertAmountToINR(totalAmount)+' Lakhs </td></tr>';
						}
						
						$('#closedProjectsByGroup_dataTable').append(tableData);
				        
					
						
						var  table= $('#closedProjectsByGroup_dataTable').DataTable( {
							destroy: true,
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
					

			               // DataTable
			               var table = $('#closedProjectsByGroup_dataTable').DataTable();
					       
					     
					}

				});
			}

			}
		
	
		function projectReceivedNew(input,requestFrom){
		var startDate = null;
		var endDate = null;
		var data=input.split(",");
		var encGroupId=data[0];
		var groupName= data[1];
		$("#projRecGroupName").text(groupName);
		var toNew=$("#toNew").val();
		var fromNew=$("#fromNew").val();
		var fromDet=$("#fromDetailNew").val();
		var toDet=$("#toDet").val();
		var hiddenFromVal=$("#fromDetNew").val();
		if(requestFrom == 0){
		
			$("#fromNew").val('');
			$("#toNew").val('');
		}
	
		hiddenFromVal=fromDet;
	
		if($("#fromNew").val()=='' && hiddenFromVal!=''){
		
			startDate=fromDet;
			endDate=toDet;
			
		}else{
			
			startDate=fromNew;
			endDate=toNew;
		
		}
		
		$("#fromNew").val(startDate);
		$("#toNew").val(endDate);
		var finalDateRange=startDate +' to '+ endDate;
		
		
		$('#asOnDateProj1').text(finalDateRange);
		if(startDate){	
			$('#newProjectsByGroups_dataTable').DataTable().clear().destroy();
		 var tableData = '';
			$.ajaxRequest.ajax({
				type : "POST",
				url : "/PMS/mst/getNewProjectsByGroupDetail",
				data:{
					"startDate":startDate,
					"endDate":endDate,
					"encGroupId":encGroupId
				},
				success : function(response) {
					//console.log(response);
					/*if(response){
						$('#newProjectsOnDate').text(response.length); 
					}else{
						$('#newProjectsOnDate').text(0); 
					}*/
					
					var totalAmount = 0;
					for (var i = 0; i < response.length; i++) {
						var row = response[i];
						//$('#incomeSelect select').val(row.strGrouptName).trigger('change');
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
					
						tableData += '<tr> <td>'+(i+1)+'</td><td> <a class="font_14" title="Click to View Complete Information" onclick='+clickFunction+'>'
								+ row.strProjectName + ' </a><p class="font_14 orange"><i>'+row.strClientName+'</i></p><p class="bold blue font_14 text-left">'+ strReferenceNumber+'<p> </td>';
						
						/*tableData += ' <td class="bold blue font_14 text-right">'+strReferenceNumber+'</td><td class="font_14"> <input type="hidden" id="hiddenClientName_'+row.encProjectId+'" value='+row.encProjectId+' /> <span  id="clientName_'+row.encProjectId+'">'
						+ row.strClientName
						+  '</span></td> ';*/
						
						tableData += ' <td class="font_14 text-right">'+ mouDate +  '</td> ';
						tableData += ' <td class="font_14 text-right">'+ workorderDate +  '</td> ';
						tableData += ' <td class="font_14 text-right">'+ row.startDate +  '</td> ';
						
						
						
						tableData += ' <td class="font_14 text-right"> <input type="hidden" id="hiddenProjectCost_'+row.encProjectId+'" value='+row.encProjectId+' /> <span id="projectCost_'+row.encProjectId+'">'
						+ row.strProjectCost + '</span></td> </tr>';
			
						totalAmount += row.numProjectAmountLakhs;
						
						
					}

					if(totalAmount >0){
						tableData +='<tr> <td></td> <td>Total of All Group</td>  <td></td><td></td><td class="bold text-right">Total</td> <td class="bold text-right">'+convertAmountToINR(totalAmount)+' Lakhs </td></tr>';
					}
					
					$('#newProjectsByGroups_dataTable').append(tableData);	        

					
					var  table= $('#newProjectsByGroups_dataTable').DataTable( {
						destroy: true,
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
					
								       

				},
				error : function(e) {
					// $('#RecurringManpowerAmt').val(0);
					alert('Error: ' + e);
				}
			});
				
		}
		};
		
		
	
		function joineeEmployeeList(input,requestFrom){
			
			var startDate = null;
			var endDate = null;
			var data=input.split(",");
			var encGroupId=data[0];
			var groupName= data[1];
			$("#joineeGroupName").text(groupName);
			var toJoinNew=$("#toJoinNew").val();
			var fromJoinNew=$("#fromJoinNew").val();
			var fromDet=$("#fromDetailNew").val();
			var toDet=$("#toDet").val();
			var hiddenFromVal=$("#fromDetNew").val();
			hiddenFromVal=fromDet;
			if(requestFrom == 0){
				
				$("#fromJoinNew").val('');
				$("#toJoinNew").val('');
			}
			if($("#fromJoinNew").val()==''&&  hiddenFromVal!='' ){
				
				startDate=fromDet;
				endDate=toDet;
				
			}else{
				
				startDate=fromJoinNew;
				endDate=toJoinNew;
					}
			$("#fromJoinNew").val(startDate);
			$("#toJoinNew").val(endDate);
			var finalDateRange=startDate +' to '+ endDate;
	
			$('#asOnDateJoin1').text(finalDateRange);
			 
			if(startDate){	
				$('#joineeBygroup_dataTable').DataTable().clear().destroy();
			 var tableData = '';
				$.ajaxRequest.ajax({
					type : "POST",
					url : "/PMS/mst/getNewJoinedEmployeeByGroupDetails",
					data:{
						"startDate":startDate,
						"endDate":endDate,
						"encGroupId":encGroupId
					},
					success : function(response) {
						
						
						var totalAmount = 0;
						for (var i = 0; i < response.length; i++) {
							var row = response[i];	
							if(row.employmentStatus =='Working'){
							tableData += '<tr> <td>'+(i+1)+'</td>';	
							/*tableData += ' <td class="font_14 ">'+ row.groupName +  '</td> ';*/
							tableData += ' <td class="font_14 ">'+ row.employeeId +  '</td> ';
							tableData += ' <td class="font_14 ">'+ row.employeeName +  '</td> ';
							
							tableData += ' <td class="font_14 ">'+ row.strDesignation +  '</td> ';			
							tableData += ' <td class="font_14 text-right">'+ row.dateOfJoining +  '</td><td class="font_14 ">'+ row.employmentStatus +  '</td></tr>';
							/*tableData += ' <td class="font_14 >'+ row.employmentStatus +  '</td></tr> ';*/
						}
							else{
								tableData += '<tr class="red"> <td>'+(i+1)+'</td>';	
								/*tableData += ' <td class="font_14 ">'+ row.groupName +  '</td> ';*/
								tableData += ' <td class="font_14 ">'+ row.employeeId +  '</td> ';
								tableData += ' <td class="font_14 ">'+ row.employeeName +  '</td> ';
								
								tableData += ' <td class="font_14 ">'+ row.strDesignation +  '</td> ';			
								tableData += ' <td class="font_14 text-right">'+ row.dateOfJoining +  '</td><td class="font_14 ">'+ row.employmentStatus +  '</td></tr>';
							}}

						$('#joineeBygroup_dataTable').append(tableData);	        
						var  table= $('#joineeBygroup_dataTable').DataTable( {
							destroy: true,
							dom: 'Bfrtip',		       
					        "ordering": true,
					        "paging":   false,
					        buttons: [
					             'excel', 'pdf', 'print'
					        ],
								"columnDefs": [ {
		
						        "orderable": true,
						            
					            "targets": 0
					        } ]
					      
					    } );
							
                     
					}
				});
			};
			}
		
		
		
		function resignEmployeelist(input,requestFrom){
			var data=input.split(",");
			var startDate = null;
			var endDate = null;
			var encGroupId=data[0];
			var groupName= data[1];
			$("#resignGroupName").text(groupName);
			var toResNew=$("#toResNew").val();
			var fromResNew=$("#fromResNew").val();
			var fromDet=$("#fromDetailNew").val();
			var toDet=$("#toDet").val();
			var hiddenFromVal=$("#fromDetNew").val();
			hiddenFromVal=fromDet;
			if(requestFrom == 0){
				
				$("#fromResNew").val('');
				$("#toResNew").val('');
			}
			if($("#fromResNew").val()=='' && hiddenFromVal!=''){
				
				startDate=fromDet;
				endDate=toDet;
				
			}else{
				startDate=fromResNew;
				endDate=toResNew;
				}
			$("#fromResNew").val(startDate);
			$("#toResNew").val(endDate);
			
			var finalDateRange=startDate +' to '+ endDate;
			
			$('#asOnDateRes1').text(finalDateRange);
			if(startDate){	
				$('#resignedByGroup_dataTable').DataTable().clear().destroy();
			 var tableData = '';
				$.ajaxRequest.ajax({
					type : "POST",
					url : "/PMS/mst/getResignedEmployeeByGroupDetails",
					data:{
						"startDate":startDate,
						"endDate":endDate,
						"encGroupId":encGroupId
					},
					success : function(response) {
						//console.log(response);
						/*if(response){
							$('#newResignEmp').text(response.length); 
						}else{
							$('#newResignEmp').text(0); 
						}*/
						
						var totalAmount = 0;
						for (var i = 0; i < response.length; i++) {
							var row = response[i];	
				
							tableData += '<tr> <td>'+(i+1)+'</td>';	
							/*tableData += ' <td class="font_14 ">'+ row.groupName +  '</td> ';*/
							tableData += ' <td class="font_14 ">'+ row.employeeId +  '</td> ';
							tableData += ' <td class="font_14 ">'+ row.employeeName +  '</td> ';
							
							tableData += ' <td class="font_14 ">'+ row.strDesignation +  '</td>';			
							tableData += ' <td class="font_14 text-right">'+ row.dateOfResignation +  '</td> <td class="font_14 ">'+ row.employmentStatus +  '</td></tr>';
						
						}

						$('#resignedByGroup_dataTable').append(tableData);	        
						var  table= $('#resignedByGroup_dataTable').DataTable( {
							destroy: true,
							dom: 'Bfrtip',		       
					        "ordering": true,
					        "paging":   false,
					        buttons: [
					             'excel', 'pdf', 'print'
					        ],
								"columnDefs": [ {
								
								
						            "orderable": true,
						            
					            "targets": 0
								} ]
					      
					    } );
							
                     
					}
				});
			};
			}
		
		
		
		function incomeTableNew(input,requestFrom){
			
			var startDate = null;
			var endDate = null;
			var data=input.split(",");
			var encGroupId=data[0];
			var groupName= data[1];
			$("#incomeGroupName").text(groupName);
			var incometoNew=$("#incometoNew").val();
			var incomefromNew=$("#incomefromNew").val();
			var fromDet=$("#fromDetailNew").val();
			var toDet=$("#toDet").val();
			var hiddenFromVal=$("#fromDetNew").val();
			hiddenFromVal=fromDet;
			if(requestFrom == 0){
				
				$("#incomefromNew").val('');
				$("#incomefromNew").val('');
			}
			if($("#incomefromNew").val()=='' && hiddenFromVal!=''){
				
				startDate=fromDet;
				endDate=toDet;
				
			}else{
				startDate=incomefromNew;
				endDate=incometoNew;
				}
			$("#incomefromNew").val(startDate);
			$("#incometoNew").val(endDate);
			
			var finalDateRange=startDate +' to '+ endDate;
			
			$('#asOnDateNew1').text(finalDateRange);

		var incomeTableId = $('#incomeByGroup_dataTable').attr('id');
		table = $('#incomeByGroup_dataTable').DataTable().clear().destroy();
		var tableData = '';
		$.ajaxRequest
				.ajax({

					type : "POST",
					url : "/PMS/mst/getPaymentReceivedDetails",
					data:{
						"startDate":startDate,
						"endDate":endDate,
						"encGroupId":encGroupId
					},
					success : function(response) {
						// console.log(response);
						for (var i = 0; i < response.length; i++) {
							var row = response[i];
							// console.log(row);
							var strReferenceNumber=row.strReferenceNumber;
							if(!strReferenceNumber){
								strReferenceNumber='';
							}
							var clickFunction = "viewProjectDetails('/PMS/projectDetails/"
									+ row.encProjectId + "')";
							tableData += '<tr >';
							tableData += '<td > <a class="font_14" title="Click to View Complete Information" onclick='
									+ clickFunction
									+ '>'
									+ row.projectName
									+ ' </a><p class="bold blue font_14 text-left">'+ strReferenceNumber+'<p></td>';
							tableData += '<td class="font_14 text-right"> <input type="hidden" id="hiddenIncomeAmt_'
									+ row.encProjectId
									+ '" value='
									+ row.encProjectId
									+ '/> <span  class="convert_lakhs_td" id="incomeAmt_'
									+ row.encProjectId
									+ '">'
									+ row.strReceivedAmount + '</span></td> </tr>';
						}

						$('#incomeByGroup_dataTable > tbody').html('');
						$('#incomeByGroup_dataTable').append(tableData);
						// convertToLakhsForComponent(incomeTableId);
						table = $('#incomeByGroup_dataTable').DataTable();




					}

				});
		}

		$('#dash-grpwise-bargraphNew-modal').on('shown.bs.modal', function(event) {
			var button = $(event.relatedTarget);
			var input = button.data('whatever');

			
			$('#ongoingProjectList').DataTable().clear().destroy();
			 var tableData = '';
				$.ajaxRequest.ajax({
					type : "POST",
					url : "/PMS/getOngoinProjectlist",
					data:{
						
						"encGroupId":input
					},
					success : function(response) {
			
						
						var totalAmount = 0;
						for (var i = 0; i < response.length; i++) {
							var row = response[i];	
							
								tableData += '<tr class=""> <td>'+(i+1)+'</td>';	
								tableData += ' <td class="font_14 ">'+ row.groupName +  '</td> ';
								tableData += ' <td class="font_14 ">'+ row.projectCount +  '</td> ';
								tableData += ' <td class="font_14 ">'+ row.projectCost +  '</td> ';
								
								/*tableData += ' <td class="font_14 ">'+ row.strDesignation +  '</td> ';	*/		
								tableData += ' </tr>';
							}

						$('#ongoingProjectList').append(tableData);	        
						var  table= $('#ongoingProjectList').DataTable( {
							destroy: true,
							dom: 'Bfrtip',		       
					        "ordering": true,
					        "paging":   false,
					        buttons: [
					             'excel', 'pdf', 'print'
					        ],
								"columnDefs": [ {
		
						        "orderable": true,
						            
					            "targets": 0
					        } ]
					      
					    } );
							
                     
					}
				});
			
			});
		
		
		$('#dash-employee-group-modal').on('shown.bs.modal', function(event) {
			var button = $(event.relatedTarget);
			var input = button.data('whatever');
			var data= input.split(",");
			var encGroupId=data[0];
			var groupName=data[1];
			$("#empGroupName").text(groupName);
			$('#employeeWithInvolvementsTblNew').DataTable().clear().destroy();
			 var tableData = '';
				$.ajaxRequest.ajax({
					type : "POST",
					url : "/PMS/getEmployeelist",
					data:{
						
						"encGroupId":encGroupId
					},
					success : function(response) {
			
						
						var totalAmount = 0;
						for (var i = 0; i < response.length; i++) {
							var row = response[i];	
							//alert(row.groupName);
								tableData += '<tr class=""> <td>'+(i+1)+'</td>';	
								/*tableData += ' <td class="font_14 ">'+ row.groupName +  '</td> ';*/
								tableData += ' <td class="font_14 ">'+ row.employeeId +  '</td> ';
								tableData += ' <td class="font_14 ">'+ row.employeeName +  '</td> ';
								tableData += ' <td class="font_14 ">'+ row.strDesignation +  '</td> ';
								tableData += ' <td class="font_14 ">'+ row.employeeTypeName +  '</td> ';
								/*tableData += ' <td class="font_14 ">'+ row.strDesignation +  '</td> ';	*/		
								tableData += ' </tr>';
							}

						$('#employeeWithInvolvementsTblNew').append(tableData);	        
						var  table= $('#employeeWithInvolvementsTblNew').DataTable( {
							destroy: true,
							dom: 'Bfrtip',		       
					        "ordering": true,
					        "paging":   false,
					        buttons: [
					             'excel', 'pdf', 'print'
					        ],
								"columnDefs": [ {
		
						        "orderable": true,
						            
					            "targets": 0
					        } ]
					      
					    } );
							
                     
					}
				});
			
			});

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
		
		
		
		var lastday = function(y,m){
			return  new Date(y, m, 0).getDate();
			}	
		
		
		$('.go-btn2').click(function() {
			  var startRange = $("#incomefrom").val();
			  var endRange = $("#incometo").val();
			 // console.log("go-btn2 startRange"+startRange)
			 // console.log("go-btn2 endRange"+endRange)
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
			  drawIncomeChart();
		  });
		
	/*	------*/

			$(document).ready(function() {
				$("#projRec").hide();
				
				
				
				
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
/*
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
*/
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
				    from = $( "#fromJoin" )
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
				    to = $( "#toJoin" ).datepicker({
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

				  $('.go-btn-join').click(function() {
					  var startRange = $("#fromJoin").val();
					  var endRange = $("#toJoin").val();
					  if(!startRange){
						  sweetSuccess('Attention','Please select Start Range');
						  return false;
					  }
					  var selectedRange = startRange;
					  if(endRange){
						  selectedRange = selectedRange +' to '+endRange;
					  }
					  $('#asOnDateJoinee').text(selectedRange);
					  
					  //alert('Called');
					  newJoineeEmpTable();
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
				    from = $( "#fromRes" )
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
				    to = $( "#toRes" ).datepicker({
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

				  $('.go-btn-resign').click(function() {
					  var startRange = $("#fromRes").val();
					  var endRange = $("#toRes").val();
					  if(!startRange){
						  sweetSuccess('Attention','Please select Start Range');
						  return false;
					  }
					  var selectedRange = startRange;
					  if(endRange){
						  selectedRange = selectedRange +' to '+endRange;
					  }
					  $('#asOnDateResign').text(selectedRange);
					  
					  //alert('Called');
					  newResignEmpTable();
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
				        $('#months').val(0); // reset the months fields [12-10-2023]
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
				      $('#months').val(0);  // reset the months fields [12-10-2023]
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




			function loadOngoingList(){

				 window.scrollBy(0,1450); 
				 
			}	
			
				/*function initialzeIncomeChart() {
					incomeTable();
				}*/
					
				function initializeNewProposals() {
					newProposalsTable();
				}

					function initializeNewProjects() {
						newProjectsTable();
					}

					function initializeClosedProjects() {		
						closedProjectsTable();
					}
					function initializePendingPayments() {
						pendingPaymentsTable();
					}
					
					
					/*$("#fromDt").MonthPicker( {

					    Button: "<i class='pad-left-half font_eighteen fa fa-calendar'></i>",
					    changeMonth: true,
					    changeYear: true,
					    dateFormat: 'mm/yy',
					    MaxMonth: 0,
					    Position: {
					        collision: 'fit flip'
					    },
					    OnAfterChooseMonth: function(){
					    $("#divCat").removeClass('hidden');    
					       var date = $(this).val();
					     
					        var res = date.split("/");
					        var month = res[0];
					        var year = res[1];
					      alert(month);
					      alert(year);
					        if (month > 0 && year > 0){
					       
					        var monthNames = [ "January", "February", "March", "April", "May", "June",
					                "July", "August", "September", "October", "November", "December" ];
					if(month == 0){
					var d = new Date();
					$('#displayMonth').text(monthNames[d.getMonth()-1]);
					$('#displayYear').text(", "+d.getFullYear());
					}else{
					$('#displayMonth').text(monthNames[month-1]);
					$('#displayYear').text(", "+year);
					}


					            //var encProjectId = $('#encProjectId').val();
					            //monthlyProgressReport(encProjectId,month,year);
					$("#month").val(month);
					$("#year").val(year);
										           
					        }
					    },
					    beforeShow: function() {
					        setTimeout(function(){
					            $('.month-picker').css('z-index', 99999999999999);
					        }, 0);
					    }
					    });*/
					
					function callGo(){
						//alert("here");
						/*$('#goButton').click(function() {*/
							  var startRange = $("#fromDt").val();
								var reportType= $("#reportType").val();
								  //alert(startRange);
							 if(!startRange){
									  sweetSuccess('Attention','Please select Month for Report');
									  return false;
								  }
								  
								 
							 else if(reportType==0){
									 sweetSuccess('Attention','Please select Report Type');
									  return false;
								 }

								  monthlyPR();
							/*});*/
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
						
						
						var lastday = function(y,m){
							return  new Date(y, m, 0).getDate();
							}	
						
						
						function openProposalAnotherFilter(){
							$("#proposalsAnotherFilter").toggle();
							$("#propSubCust").toggle();
						}
						function openProjectsAnotherFilter(){
							$("#projectsAnotherFilter").toggle();
							$("#ProjectCust").toggle();
						}
						function openClosedAnotherFilter(){
							$("#closedAnotherFilter").toggle();
							$("#closedCustom").toggle();
						}
						function openIncomeAnotherFilter(){           
							$("#incomeAnotherFilter").toggle();
							$("#incomCustom").toggle();
						 }
						function openJoiningAnotherFilter(){           
							$("#joineeAnotherFilter").toggle();
							$("#joinCustom").toggle();
						 }
						function openResignedAnotherFilter(){           
							$("#resignedAnotherFilter").toggle();
							$("#resignCustom").toggle();
						 }
						

						function calculateClosureDates(){
						var d = new Date();
						var symbol= $("#filterClosureSymbol").val();
						var selValue=$("#monthsClosure").val();
						
						if(selValue=='0'){
							
							
							$('#pendingCLosure_dataTable').empty();
							$('#pendingCLosure_dataTable').DataTable().destroy();
							var  table= $('#pendingCLosure_dataTable').DataTable( {
								destroy: true,
								dom: 'Bfrtip',		       
						        "ordering": false,
						        "paging":   false,
						        buttons: [
						             'excel', 'pdf', 'print'
						        ],
						        dom: 'Bfrtip',
								"columnDefs": [ {
									
							        "orderable": false,
						            "targets": 0
						        } ],
						        "order": [[ 1, 'asc' ]]
						    } );
						}
						else{
						var lastMonth = new Date();
						lastMonth.setMonth(lastMonth.getMonth() - 1);
						var durationBefore=selValue;
						d.setMonth(d.getMonth() - durationBefore);
						 var lastDayOfLastMonth=lastday(lastMonth.getFullYear(),lastMonth.getMonth());
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
						
							var closureDate="01"+"/"+fromMonth+"/"+d.getFullYear();


							pendingClosuresTableByClosureDate(closureDate,symbol);
						}
						}
						function calculateInvoiceDates(){
						var d = new Date();
						var symbol= $("#filterSymbol").val();
						var selValue=$("#monthsInvoice").val();
						
						if(selValue==0){
						
							$('#pendingPayments_dataTable').empty();
							$('#pendingPayments_dataTable').DataTable().destroy();
							var foot = $("#pendingPayments_dataTable").find('tfoot');
							 if(foot.length){
								 $("#pendingPayments_dataTable tfoot").remove();
							 }
							var  table= $('#pendingPayments_dataTable').DataTable( {
								destroy: true,
								dom: 'Bfrtip',		       
						        "ordering": false,
						        "paging":   false,
						        buttons: [
						             'excel', 'pdf', 'print'
						        ],
						        dom: 'Bfrtip',
								"columnDefs": [ {
									
							        "orderable": false,
						            "targets": 0
						        } ],
						        "order": [[ 1, 'asc' ]]
						    } );
							
						}
						else{
						var lastMonth = new Date();
						lastMonth.setMonth(lastMonth.getMonth() - 1);
						var durationBefore=selValue;
						d.setMonth(d.getMonth() - durationBefore);
						 var lastDayOfLastMonth=lastday(lastMonth.getFullYear(),lastMonth.getMonth());
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
						
							var invoiceDate="01"+"/"+fromMonth+"/"+d.getFullYear();
							
						
						/*if(type==1)
						$( "#"+btnIdOrClass ).trigger( "click" );	
						else	
						$( "."+btnIdOrClass ).trigger( "click" );*/
					
						pendingPaymentsTableWithInvoiceDate(invoiceDate,symbol);
						}
						}

						function calculateDueDates(){
						var d = new Date();
						var symbol= $("#filterDueSymbol").val();
						var selValue=$("#monthsDue").val();
					
						if(selValue=='0'){
							$('#pendingInvoices_dataTable').empty();
							$('#pendingInvoices_dataTable').DataTable().destroy();
							var foot = $("#pendingInvoices_dataTable").find('tfoot');
							 if(foot.length){
								 $("#pendingInvoices_dataTable tfoot").remove();
							 }
							var  table= $('#pendingInvoices_dataTable').DataTable( {
								destroy: true,
								dom: 'Bfrtip',		       
						        "ordering": false,
						        "paging":   false,
						        buttons: [
						             'excel', 'pdf', 'print'
						        ],
						        dom: 'Bfrtip',
								"columnDefs": [ {
									
							        "orderable": false,
						            "targets": 0
						        } ],
						        "order": [[ 1, 'asc' ]]
						    } );
						
						}
						else{
						var lastMonth = new Date();
						lastMonth.setMonth(lastMonth.getMonth() - 1);
						var durationBefore=selValue;
						d.setMonth(d.getMonth() - durationBefore);
						 var lastDayOfLastMonth=lastday(lastMonth.getFullYear(),lastMonth.getMonth());
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
						
							var dueDate="01"+"/"+fromMonth+"/"+d.getFullYear();
					
					
							pendingInvoicesTableByDate(dueDate,symbol);
						}
						}
						
						function pendingPaymentsTableWithInvoiceDate(invoiceDate,symbol){
						
						 $('#pendingPayments_dataTable').DataTable().clear().destroy();

						var tableData = '';
						$.ajaxRequest.ajax({
							type : "POST",
							url : "/PMS/mst/getPendingPaymentsDetailsByInvoiceDt",
							data : {"invoiceDate":invoiceDate,
									"symbol":symbol
									},
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
									var clickFunction = "viewProjectDetails('/PMS/projectDetails/"+ row.encProjectId + "')";
								
									tableData += '<tr><td>'+(i+1)+'</td> <td class="font_14">'+ row.strGroupName +  '</td><td> <a class="font_14" title="Click to View Complete Information" onclick='+clickFunction+' > '
											+ row.strProjectName + ' </a> <br/> <span class="bold blue font_14 text-left">'+ strReferenceNumber+'</span> </td>';
									
									tableData += '<td class="font_14 orange">'+row.strClientName+'</td><td class="font_14 ">'
									+ row.strInvoiceRefno +'</td>';
									
									tableData += ' <td class="font_14">'+ row.strInvoiceDate+ '</td>';
									
									tableData += ' <td class="font_14">'+ strInvoiceStatus+  '</td>';
									
									tableData += ' <td class="font_14 text-right">'	+ row.strInvoiceAmt +'</td>';
									
									tableData += ' <td class="font_14 text-right">'	+ row.strTaxAmount + '</td>';
									
									tableData += ' <td class="font_14 text-right">'+ row.strInvoiceTotalAmt+ '</td> </tr>';			
									
								}		
							
								$('#pendingPayments_dataTable').append(tableData); 
								var foot = $("#pendingPayments_dataTable").find('tfoot');
								 if(foot.length){
									 $("#pendingPayments_dataTable tfoot").remove();
								 }
								
								if(totalInvoiceAmt >0){
												
									 foot = $('<tfoot class="datatable_tfoot" style="background: #1580d0;">').appendTo("#pendingPayments_dataTable"); 
									    foot.append('<tr><td></td> <td></td><td></td><td></td> <td></td><td></td> <td class="bold text-right">Total</td><td class="bold text-right totalinvoice">'+convertAmountToINR(totalInvoiceAmt)+'</td> <td class="bold text-right totaltax">'+convertAmountToINR(totalTaxAmt)+'</td> <td class="bold text-right totalAmount">'+convertAmountToINR(totalAmt)+'</td></tr>');
								}          
								var  table= $('#pendingPayments_dataTable').DataTable( {
									destroy: true,
									dom: 'Bfrtip',		       
							        "ordering": false,
							        "paging":   false,
							        buttons: [
							             'excel', 'pdf', 'print'
							        ],
							        dom: 'Bfrtip',
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
										updateTotalAmount(table);
									}).draw();
									
									$('#pendingPayments_dataTable .filters th[class="comboBox"]').each( function ( i ) {
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
								                 updateTotalAmount(table);
								                } );
								     
								            table.column(colIdx).data().unique().sort().each( function ( d, j ) {
								                select.append( '<option value="'+d+'">'+d+'</option>' )
								            } );
								        } );
									

									 // Setup - add a text input
							       $('#pendingPayments_dataTable .filters th[class="textBox"]').each( function () {                 
							           $(this).html( '<div class="lighter"><input type="text"  style="width:100%" /></div>' );

							       } );

					               // DataTable
					               var table = $('#pendingPayments_dataTable').DataTable();
							       
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
							
						function pendingInvoicesTableByDate(dueDate,symbol){	
							$('#pendingInvoices_dataTable').DataTable().clear().destroy();
							var tableData = '';
							$.ajaxRequest.ajax({
								type : "POST",
								url : "/PMS/mst/getPendingInvoiceDetailbyDate",
								data : {"dueDate":dueDate,
									"symbol":symbol
									},
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
									
										tableData += '<tr><td>'+(i+1)+'</td><td class="font_14">'+ row.strGroupName +  '</td><td> <a class="font_14" title="Click to View Complete Information" onclick='+clickFunction+'>'
												+ row.strProjectName + ' </a> <p class="bold blue font_14 text-left">'+ strReferenceNumber+'<p></td>';
										
										tableData += '<td class="font_14 orange">'+row.strClientName+'</td><td class="font_14 "> <span  class="" >'
										+ row.strPaymentDueDate
										+  '</span></td>';
										
										tableData += ' <td class="font_14">'+ strPurpose+  '</td>';
										
										tableData += ' <td class="font_14"> <span  class="" >'
											+strRemarks +  '</span></td>';
										tableData += ' <td class="font_14 text-right">'+row.strAmount+ ' Lakhs</td> </tr>';
										
									}

									/*if(totalAmt>0){
										tableData +='<tr><td></td><td></td> <td></td> <td></td>  <td></td><td class="bold text-right">Total</td> <td class="bold text-right">'+convertAmountToINR(totalAmt)+' Lakhs</td></tr>';
									}*/
									
									$('#pendingInvoices_dataTable > tbody').html('');
									$('#pendingInvoices_dataTable').append(tableData); 
									var foot = $("#pendingInvoices_dataTable").find('tfoot');
									 if(foot.length){
										 $("#pendingInvoices_dataTable tfoot").remove();
									 }
									
									if(totalAmt >0){
														
										 foot = $('<tfoot class="datatable_tfoot" style="background: #1580d0;">').appendTo("#pendingInvoices_dataTable"); 
										    foot.append('<tr><td><td></td></td><td></td> <td></td> <td></td>  <td></td><td class="bold text-right">Total</td> <td class="bold text-right">'+convertAmountToINR(totalAmt)+' Lakhs</td></tr>');
									}
						           
									var  table= $('#pendingInvoices_dataTable').DataTable( {
										destroy: true,
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
										
										$('#pendingInvoices_dataTable .filters th[class="comboBox"]').each( function ( i ) {
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
								       $('#pendingInvoices_dataTable .filters th[class="textBox"]').each( function () {                 
								           $(this).html( '<div class="lighter"><input type="text"  style="width:100%" /></div>' );

								       } );

						               // DataTable
						               var table = $('#pendingInvoices_dataTable').DataTable();
								       
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
						
				function pendingClosuresTableByClosureDate(closureDate,symbol){	
							
							
							$('#pendingCLosure_dataTable').DataTable().clear().destroy();
						 var tableData = '';
							$.ajaxRequest.ajax({
								type : "POST",
								url : "/PMS/mst/getPendingClosureDetailByDate",
								data : {"closureDate":closureDate,
									"symbol":symbol
									},
								success : function(response) {
									//console.log(response);
									if(response){
									var totalAmount = 0;
									/*for (var i = 0; i < response.length; i++) {
										var row = response[i];	
										var clickFunction = "viewProjectDetails('/PMS/projectDetails/"
												+ row.encNumId + "')";
									
										tableData += '<tr> <td>'+(i+1)+'</td> <td class="font_14">'+ row.strGroupName  +  '</td><td> <a class="font_14" title="Click to View Complete Information" onclick='+clickFunction+'>'
												+ row.strProjectName + ' </a><p class="bold blue font_14 text-left">'+ row.projectRefrenceNo+'<p></td><td class="font_14 orange">'+row.clientName+'</td>';
										tableData += ' <td class="bold blue font_14 text-right">'+ row.projectRefrenceNo +  '</td>';	
										tableData += ' <td class="bold orange font_12">'+ row.clientName +  '</td> ';	
										
										if(row.strPLName==null || row.strPLName==''){
											row.strPLName='';
										}
										tableData += ' <td class="font_16">'+ row.strPLName +  '</td>';
										tableData += ' <td class="font_14 text-right">'+ row.startDate +  '</td> ';
										
										tableData += ' <td class="font_14 text-right">'+ row.endDate +  '</td>  </tr>';		
										
										
									}*/
									/*Bhavesh(16-08-23)*/ 
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
										tableData += '<tr> <td class="grey-text">'+(i+1)+'</td> <td class="font_14 grey-text">'+ row.strGroupName +  '</td><td> <a class="font_14 grey-text" title="Click to View Complete Information" onclick='+clickFunction+'>'
										+ row.strProjectName + ' </a><p class="bold grey-text font_14 text-left">'+ row.projectRefrenceNo+'<p></td><td class="font_14 orange grey-text">'+row.clientName+'</td>';
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
											tableData += '<tr class="golden-text"> <td>'+(i+1)+'</td> <td class="font_14 golden-text">'+ row.strGroupName +  '</td><td> <a class="font_14 golden-text" title="Click to View Complete Information" onclick='+clickFunction+'>'
											+ row.strProjectName + ' </a><p class="bold golden-text font_14 text-left">'+ row.projectRefrenceNo+'<p></td><td class="font_14 orange golden-text">'+row.clientName+'</td>';
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
									var  table= $('#pendingCLosure_dataTable').DataTable( {
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
									
									$('#pendingCLosure_dataTable .filters th[class="comboBox"]').each( function ( i ) {
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
						/*------------------------ Get the Filter of Status By Order [26-09-2023] ------------------------------------------------*/
						$('#pendingCLosure_dataTable .filters th[id="statusComboBox"]').each( function ( i ) {
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
						                               "Project Closure Not Initiated",
						                               "Pending At PL",
						                               "Pending At HOD",
						                               "Pending At GC",
						                               "Pending At PMO"
						                               ];
						            projectStatus.forEach(function (d) {
				                         select.append('<option value="' + d + '">' + d + '</option>');
				                     });
					        } );
						/*----------------------------------- EOF [29-08-2023] -------------------------------------------*/

									 // Setup - add a text input
							       $('#pendingCLosure_dataTable .filters th[class="textBox"]').each( function () {                 
							           $(this).html( '<div class="lighter"><input type="text"  style="width:100%" /></div>' );

							       } );

					               // DataTable
					               var table = $('#pendingCLosure_dataTable').DataTable();
							       
							       table.columns().eq( 0 ).each( function ( colIdx ) {
							           $( 'input', $('.filters th')[colIdx] ).on( 'keyup change', function () {
							               table
							                           .column( colIdx )
							                           .search( this.value )
							                           .draw() ;
							                   
							                                           } );
							} );	                     
								}
								}
							});
						}	
				
				function initializeUnderClosure(){
					 openWindowWithPost('GET','/PMS/mst/underClosureProjectsforGCFin','_self');

				}
				
				//Added by devesh on 26-09-23 for adding expand button on proposal history modal
				var isMaximizedproposal = false;
				var scrollHeadInnerDivflag = true;
				var originalWidth = "";
				function toggleproposalhistory() {
					  var myModal = document.getElementById("proposalhistorymodal");
					  
					  if (myModal) {
					  var scrollHeadInnerDiv = myModal.querySelector(".dataTables_scrollHeadInner");
					  // Check if the scrollHeadInnerDiv element exists
					  if (scrollHeadInnerDiv && scrollHeadInnerDivflag) {
					  // Get the original width of the scrollHeadInnerDiv
					  originalWidth = scrollHeadInnerDiv.style.width;
					  scrollHeadInnerDivflag = false;
					  }
					  }
					  //console.log("originalWidth: "+originalWidth);
					  
					  if (isMaximizedproposal) {
					    /*myModal.classList.remove("maximized");*/
						
					    document.body.classList.remove("modal-open");
					    document.getElementById('proposalhistorymodal').style.height = '';
					    document.getElementById('proposalhistorymodal').style.width = '';
					    scrollHeadInnerDiv.style.width = originalWidth;
					  } else {
					    /*myModal.classList.add("maximized");*/
					    document.body.classList.add("modal-open");

					    var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
					    var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth; 
					    var modal = document.getElementById('proposalhistorymodal');
					    modal.style.height = (windowHeight * 0.75) + 'px'; 
					    modal.style.width = (windowWidth * 0.98) + 'px';
					    modal.style.transformOrigin = 'center';
					    if (myModal) {
						    // Find the div with class "dataTables_scrollBody" inside the modal
						    var scrollBodyDiv = myModal.querySelector(".dataTables_scrollBody");

						    // Check if the scrollBodyDiv element exists
						    if (scrollBodyDiv) {
						      // Get the width of the scrollBodyDiv
						      var scrollBodyWidth = scrollBodyDiv.clientWidth;
						      //console.log("Width of scrollBodyDiv:", scrollBodyWidth, "pixels");
						    } else {
						      console.log("Element with class 'dataTables_scrollBody' not found inside the modal.");
						    }
						  }
					    scrollHeadInnerDiv.style.width = scrollBodyWidth;
					  }

					  isMaximizedproposal = !isMaximizedproposal; 

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

				function restoreproposalsize() {
					  var myModal = document.getElementById("proposalhistorymodal");
					    document.body.classList.remove("modal-open");
					    document.getElementById('proposalhistorymodal').style.height = '';
					    document.getElementById('proposalhistorymodal').style.width = '';
					    if (myModal) {
							  var scrollHeadInnerDiv = myModal.querySelector(".dataTables_scrollHeadInner");
					    }
					    scrollHeadInnerDiv.style.width = originalWidth;
					    scrollHeadInnerDivflag = true;
					    isMaximizedproposal=false;
					}
				//End of expand button for proposal history modal
				
				/*<!-- Bhavesh(23-06-2023) restore code  -->*/

				//restore code
				let isMaximized = false;
				function toggleMaximize() {
					 // var myModal = $(".myModal1");
					 console.log("isMaximized="+isMaximized);
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
					 
					
					//$("#myContent").load(location.href + " #myContent");
					$('#exampleUnderClosure').dataTable().fnDestroy();
					 /*------- Set Data Table Properties in closure request tile [21-09-2023] --*/
					setTablePropertiesForClosureRequestTile();
				 	
				 	 /* Bhavesh (08-09-23) destroyed employee with involvment table*/
					  $('#employeeWithInvolvementsTbl').dataTable().fnDestroy();
					 $('#employeeWithInvolvementsTbl').DataTable( {		
							destroy: true,
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
					  $('.asOnDateProposals1').text(selectedRange);
					  newProposalsTable();
					  newProjectsTable();
					  closedProjectsTable();
					  
					  //alert('Called');
					/*  loadProgressReportSentByPL();
					  loadProgressReportSentByPMO();
					  $('#projectProgressTblAll').DataTable().clear().destroy();
					 
					  
					  initializeProgressTable();
					  incomeTable();
					  expenditureTable();
					  newProposalsTable();
					  
					 closedProjectsTable();
					 pendingPaymentsTable();
					 pendingInvoicesTable();
					 pendingClosuresTable();
					 newJoineeEmpTable();
					 newResignEmpTable();
					 
					 newRejoinEmpTable(status);
					  $('.asOnDateProposals1').text(fromDate);
					  $(".asOnDateProposals1").text(fromDate); */
					 
					  pendingPaymentsTable();
					  pendingInvoicesTable();
					  pendingClosuresTable();
					  
					  $('.asOnDateProposals1').text(fromDate);
					  $(".asOnDateProposals1").text(fromDate);
					  isMaximized=true;
					  toggleMaximize();
					  restoreModalSize();
					
				} 
				
				/*<!-- Bhavesh(23-06-2023) restore prop for gcFinance dashboard  -->*/
				function restoreprop1(){
					$(".months1").val("0");
					 $(".fromProposal1").val("");
					$(".toProposal1").val("");
					 
					/*-----------------------------  Collapse all the Project received table [04-08-2023] --------------------*/
				 	$('#multiCollapse10, #multiCollapse11,#multiCollapse12,#multiCollapse13').filter('.in').collapse('hide');
				 	/*-------------------------------------------------------------------------------------------------------*/
					$('#income_dataTable').dataTable().fnDestroy();
					
					var firstDayOfApril = new Date();
					firstDayOfApril.setMonth(3); // 3 represents April (zero-based)
					firstDayOfApril.setDate(1); // Set the day of the month to 1

					console.log(firstDayOfApril);
					//$("#myContent").load(location.href + " #myContent");
				   const today = new Date();
				   const year = today.getFullYear();
				   const firstDayOfYear = new Date(year, 0, 1);

				   const dd = String(firstDayOfApril.getDate()).padStart(2, '0');
				   const mm = String(firstDayOfApril.getMonth() + 1).padStart(2, '0'); // January is 0
				   const yyyy = firstDayOfYear.getFullYear();

				   const fromDate1 = dd + "/" + mm + "/" + yyyy;
				  


				   const dd1 = String(today.getDate()).padStart(2, '0');
				   const mm1 = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
				   const yyyy1 = today.getFullYear();

				   const toDate1 = dd1 + "/" + mm1 + "/" + yyyy1;
				   console.log(toDate1);
				   var startRange = dd + "/" + mm + "/" + yyyy;
					  var endRange = dd1 + "/" + mm1 + "/" + yyyy1;
					  if(!startRange){
						  sweetSuccess('Attention','Please select Start Range');
						  return false;
					  }
					  var selectedRange = startRange;
					  if(endRange){
						  selectedRange = selectedRange;
					  }
					  $('.asOnDateProposals11').text(selectedRange);
					  
					  //alert('Called');
					/*  loadProgressReportSentByPL();
					  loadProgressReportSentByPMO();
					  $('#projectProgressTblAll').DataTable().clear().destroy();
					 
					  
					  initializeProgressTable();
					  incomeTable();
					  expenditureTable();
					  newProposalsTable();
					  newProjectsTable();
					 closedProjectsTable();
					 pendingPaymentsTable();
					 pendingInvoicesTable();
					 pendingClosuresTable();
					 newJoineeEmpTable();
					 newResignEmpTable();
					 
					 newRejoinEmpTable(status);
					  $('.asOnDateProposals1').text(fromDate);
					  $(".asOnDateProposals1").text(fromDate); */
					  incomeTable();
					  $('.asOnDateProposals11').text(fromDate1);
					  $(".asOnDateProposals11").text(fromDate1);
					 
					  isMaximized=true;
					  toggleMaximize();
					  restoreModalSize();
					
				} 	
							

				
				
/*-----------------  For Download the Excel of ongoing projects feature [ added by Anuj ] -------------------------------------------------------------*/
				function downloadOngoingProjects() {
					var encGroupId = document.getElementById('groupId').value;
					$.ajaxRequest
							.ajax({
								type : "POST",
								url : "/PMS/downloadOngoingProjects",
								data : "encGroupId=" + encGroupId,
								success : function(data) {
									if(data){
										downloadTemplate('Project Details.xlsx');
									}else{
										swal("File download Failed.!");
									}
								}});
				}
				
				function downloadTemplate(documentName){
					openWindowWithPost('POST','/PMS/downloadTemplate',{"template" : "EMPLOYEE_REG_TEMPLATE","documentTypeName":documentName},'_blank');
				}				
				
//Added by devesh on 22/8/23 to sort Designation wise distribution table alphabetically
$(document).ready(function() {
    $('#testTb2').DataTable({
      order: [[0, 'asc']], // Sort the first column in ascending order
      searching: false, // Disable the search feature
      paging: false,
      info: false,
      columnDefs: [
                    { targets: '_all', orderable: false },
                    { targets: [0], orderable: true }
                 ]
    });
    $('#testTbl').DataTable({
        order: [[0, 'asc']], // Sort the first column in ascending order
        searching: false, // Disable the search feature
        paging: false,
        info: false,
        columnDefs: [
                      { targets: '_all', orderable: false },
                      { targets: [0], orderable: true }
                   ]
      });
  });
//End
/*-----------------------------------------  Closure Action Handling in Closure Request Tile Data [21-09-2023]    ----------------------------------------------------------------------*/
function startWorkFlow(applicationId, moduleTypeId, businessTypeId,projectTypeId, categoryId) {
	openWindowWithPost('POST', '/PMS/startProjectWorkflow', {
		"numId" : applicationId,
		"moduleTypeId" : moduleTypeId,
		"businessTypeId" : businessTypeId,
		"projectTypeId" : projectTypeId,
		"categoryId" : categoryId
	}, '_blank');
}

function viewAllowedActionsForPending(encCustomIdNew){
	/*--------------- For Write Remarks [30-11-2023] --------*/
	$('#proceedingModal').addClass('hidden');
	$('#proceedingModal').modal('show');
	$('#proceedingModal').modal('hide');
	$('#proceedingModal').removeClass('hidden');
	/*--------------- End For Write Remarks [30-11-2023] --------*/
	
	var encWorkflowId = $('#encWorkflowId_Closure').val();
	$.ajax({
        type: "POST",
        url: "/PMS/getNextRoleActionDetails",
        async:false,
        data: {"encCustomId":encCustomIdNew,"encWorkflowId":encWorkflowId},			
		success : function(res) {	
			 
			$('#'+encCustomIdNew).find('li').remove();	
			if(Array.isArray(res) && res.length >0){
				for(var i=0;i<res.length;i++){	
					
			
					
						$('#'+encCustomIdNew).append("<li> <a class='font_14' onclick=performAction('"+encCustomIdNew+"','"+res[i].strEncActionId+"',"+res[i].isRemarksReq+","+res[i].numActionId+") title='"+res[i].strToolTip+"'><span  aria-hidden='true'>"+res[i].strActionName+"</span></a></li>");
					
					
				}
			}else{
				$('#new'+encCustomIdNew).append("<li> <a class='font_14 red'><span  aria-hidden='true'> No Action </span></a></li>");
			}
					
		},
		error : function(e) {					
		}		
	});

}
function performAction(customId, encActionId, isRemarks, actionId) {
	var encWorkflowId = $('#encWorkflowId_Closure').val();

	if (isRemarks == 0) {
		swal({
			title : "Do you want to submit?",
			buttons : [ 'No', 'Yes' ],
		}).then(
				function(isConfirm) {
					if (isConfirm) {
						doWorkAccrodingToAction(customId, encActionId,encWorkflowId, "", actionId);
					} else {
					}
				});
	} else if (isRemarks == 1 && actionId == 23) {
		console.log("res"+customId);
		$('#financialApprovalModel').modal('show');
		$('#encActionId').val(encActionId);
		$('#customId').val(customId);
		return false;
	} else if (isRemarks == 1 && actionId != 23) {
		var textarea = document.createElement('textarea');
		textarea.rows = 6;
		textarea.className = 'swal-content__textarea';
		textarea.id = 'textArea';
		textarea.placeholder = 'You can write remarks';

		swal({
			title : 'Do you want to submit?',
			content : textarea,
			buttons : [ 'No', 'Yes' ]
		}).then(function(isConfirm) {
							if (isConfirm) {
								var textAreaValue = $("#textArea").val();
								textAreaValue = textAreaValue.trim();
								if (textAreaValue.length < 300 || textAreaValue.length == 300) {
									doWorkAccrodingToAction(customId,encActionId, encWorkflowId,textAreaValue);
								} else {
									swal("Remarks should be less than or equals to 300 characters.");
								}
							}
						});
	} else {
		doWorkAccrodingToAction(customId, encActionId, encWorkflowId,"",actionId);
	}
}

function doWorkAccrodingToAction(encCustomId, encActionId, encWorkflowId,strRemarks, actionId) {
	if (actionId == 21) {
		viewProjectClosureDetails(encCustomId);
		return false;
	} else if (actionId == 25) {
		openWindowWithPost('GET', '/PMS/mst/projectClosure', {
			"encProjectId" : encCustomId
		}, '_self');
		return false;
	} else if (actionId == 19) {
		$.ajax({
			type : "POST",
			url : "/PMS/loadTransactionDetails",
			async : false,
			data : {
				"encCustomId" : encCustomId,
				"encWorkflowId" : encWorkflowId
			},
			success : function(res) {
				var tableData = '';
				for (var i = 0; i < res.length; i++) {
					var rowData = res[i];
					var remarks;

					if (!rowData.strRemarks) {
						remarks = '';
					} else {
						remarks = rowData.strRemarks;
					}
					tableData += "<tr> <td>" + (i + 1) + "</td><td>"
							+ rowData.employeeName + "</td> ";
					tableData += "<td>" + rowData.strActionPerformed
							+ "</td> <td>" + remarks + "</td><td>"
							+ rowData.transactionAt.split(' ')[0] + "</td>";
					tableData += "</tr>";
				}
				$('#proceedingTbl > tbody').html('');
				$('#proceedingTbl').append(tableData);
			},
		})
		$('#proceedingModal').modal('show');
		return false;
	}
	$.ajax({
		type : "POST",
		url : "/PMS/doWorkAccrodingToAction",
		async : false,
		data : {
			"encCustomId" : encCustomId,
			"strEncActionId" : encActionId,
			"encWorkflowId" : encWorkflowId,
			"strRemarks" : strRemarks
		},
		success : function(res) {
			if (res.strSuccessMsg != '' && res.strSuccessMsg != 'error') {
				swal({
					title : "",
					text : res.strSuccessMsg,
					showCancelButton : false,
					confirmButtonColor : "#DD6B55",
					confirmButtonColor : "#34A534",
					confirmButtonText : "Ok",
					cancelButtonText : "Cancel",
					closeOnConfirm : true,
					closeOnCancel : true
				}).then(
						function(isConfirm) {
							if (isConfirm) {
								/*openWindowWithPost('GET',
										'/PMS/dashboard',
										'_self');*/
								window.location.href = '/PMS/dashboard';
							    $(window).on('load', function () {
							        $('#dash-closure-pending-modal1').modal('show');
							    });
							}
						});
			} else if (res.strSuccessMsg != 'error')
				swal("There are some problem.Please contact to Admin.");
		},
		error : function(e) {
		}
	});
}
function viewProjectClosureDetails(encCustomId){
	$('#viewProjectClosure').modal('show');
	$.ajax({
		type : "POST",
		url : "/PMS/mst/viewProjectClosureDetailFromDashboard/"+encCustomId,	
		dataType:"json",
		success : function(response) {
			var TeamDetailTable="";
			for(var i=0;i<response.teamDetails.length;i++)
			{
				var teamMember="";
				teamMember+="<tr><td>"+response.teamDetails[i].strEmpName+"</td>";
				teamMember+="<td>"+response.teamDetails[i].strRoleName+"</td><td class='startDate' id='startDate_${loop.index}'>"+response.teamDetails[i].strStartDate+"</td>";
				teamMember+="<td id='end_"+i+"'>"+response.teamDetails[i].strEndDate+"</td></tr>";
				TeamDetailTable+=teamMember;
			}
			$('#teamDetailsTable').html('');
			$('#teamDetailsTable').append(TeamDetailTable);
			
			
			$('#closureDate').text(response.projectTempMasterDetail.closureDate);
			$('#closureRemark').text(response.projectTempMasterDetail.closureRemark);
			$('#projectReferenceNumber').text(response.projectDetails.projectRefNo);
			$('#projectStrProjectName').text(response.projectDetails.strProjectName);
			$('#projectStartDate').text(response.projectDetails.startDate);
			$('#projectEndDate').text(response.projectDetails.endDate);
			
			
			var documentsDetails="";
			if(response.details.length>0){
				for (var i = 0; i < response.details.length; i++) {
				    var doc = response.details[i];
				    var docRow = "<tr>";
				    docRow+="<td>"+(i+1)+"</td><td><p class='bold'>"+response.details[i].documentTypeName+"</p></td>";
				    docRow+="<td align='center'>";
					for(var k=0;k<doc.detailsModels.length;k++)
					{
						var detailsModel = doc.detailsModels[k];
						docRow+="<span> <a onclick=downloadTempDocument('"+detailsModel.encNumId+"')>"+detailsModel.icon+"</a></span>";
					}
					docRow+="</td>";
				    docRow += "</tr>";
				    documentsDetails += docRow;
				}
			}else{
				documentsDetails+="<tr><td class='text-center' colspan='3'>No Document Found.</td></tr>";
			}
			$('#documentDetailsTable').html('');
			$('#documentDetailsTable').append(documentsDetails);
		}, error: function(data) {
	 	  
	   }
	})
}

function submitClosureReq(){
	 
	var encActionId= $('#encActionId').val();
	var customId=$('#customId').val();
	var encWorkflowId = $('#encWorkflowId_Closure').val();
	 var finClosureDate= $("#finClosureDate").val();
	 var textAreaValue=$("#remarksForClosure").val();
	/*alert(finClosureDate);*/
	if(finClosureDate==null || finClosureDate==''){
		swal("Financial Closure Date is required");
		return false
	}
	else if(textAreaValue==null || textAreaValue==''){
		swal("Remarks are required");
		return false
	}
	 swal({
		  title: 'Do you want to approve Financial Closure?',
		 
		  buttons: [					               
                'No',
                'Yes'
              ]
		}).then(function(isConfirm) {
		      if (isConfirm) {
		    	
				 						 		
				 		doWorkAccrodingToActionFinal(customId,encActionId,encWorkflowId,textAreaValue,finClosureDate);
				 
		      } 
		}); 
 }
  
function doWorkAccrodingToActionFinal(customId,encActionId,encWorkflowId,textAreaValue,finClosureDate){
	$.ajax({
        type: "POST",
        url: "/PMS/doWorkAccrodingToAction",
        async:false,
        data: {"encCustomId":customId,"strEncActionId":encActionId,"encWorkflowId":encWorkflowId,"strRemarks":textAreaValue,"finClosureDate":finClosureDate},			
		success : function(res) {
			
			
		
		/*	else{*/
				   if(res.strSuccessMsg!='' && res.strSuccessMsg!='error') 
				   {   
					   
					   swal({
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
					    		  openWindowWithPost('GET','/PMS/dashboard','_self');
					    	  }
					    	});
					        
				   }
				   else if(res.strSuccessMsg!='error')
					   swal("There are some problem.Please contact to Admin.");
			/*}*/
		},
		error : function(e) {
			
			
		}


	
	});
}
function downloadTempDocument(documentId){
	openWindowWithPost('POST','/PMS/mst/downloadTempProjectFile',{"encNumId" : documentId},'_blank');
}
/*-----------------------------------------  EOL Closure Action Handling in Closure Request Tile Data ----------------------------------------------------------------------*/
$(document).ready(function() {
	setTablePropertiesForClosureRequestTile();
	  var dateFormat = "dd/mm/yy",
	    from = $( "#finClosureDate" )
	      .datepicker({
	    	dateFormat: 'dd/mm/yy', 
	  	    changeMonth: true,
	  	    changeYear:true,
	  	    maxDate: '0',
	  	  /* Bhavesh (18-10-23) extend the min date year to 8 Year from minDate : '-5Y'*/
	  	    minDate : '-10Y'
	      })
	     /* .on( "change", function() {
	        to.datepicker( "option", "minDate", getDate( this ) );
	      });*/
});
/*----------------- Adding the DataTable feature in the closure request table data [20-09-2023] -------------------------------------------------------------*/
function setTablePropertiesForClosureRequestTile(){				        
		var table= $('#exampleUnderClosure').DataTable( {
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
		

		$('#exampleUnderClosure .filters th[class="comboBox"]').each( function ( i ) {
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
		
		
		$('#exampleUnderClosure .filters th[id="comboBox_Status"]').each(function (i) {
		    var colIdx = $(this).index();
		    var select = $('<select style="width:100%" ><option value="">All</option></select>')
		        .appendTo($(this).empty())
		        .on('change', function () {
		            var val = $.fn.dataTable.util.escapeRegex(
		                $(this).val()
		            );
		            var searchVal="";
			    	if(val.includes('Sent By PMO')){
			    		searchVal="Approved and Sent To Finance";
			    	}else if(val.includes('Sent By GC')){
			    		searchVal="Sent to GC Finance";
			    	}else{
			    		searchVal=val;
			    	}
		            table.column(colIdx)
		                .search(searchVal, true, false)
		                .draw();
		        });

		    	var projectStatus = [
	                               "Sent By PMO",
	                               "Sent By GC",
	                               ];
	            projectStatus.forEach(function (d) {
                   select.append('<option value="' + d + '">' + d + '</option>');
               });
		});


       // DataTable
       var table = $('#exampleUnderClosure').DataTable();
       
/*       table.columns().eq( 0 ).each( function ( colIdx ) {
           $( 'input', $('.filters th')[colIdx] ).on( 'keyup change', function () {
               table
                           .column( colIdx )
                           .search( this.value )
                           .draw() ;
                   
                                           } );
       			});	 */                    
	}
/*----------------- EOF Adding the DataTable feature in the closure request table data ------------------------------------------------------------*/

//Added by devesh on 27-09-23 for redirecting ongoing projects from group name
function closeModalAndClickButton(groupName) {
    // Close the modal (you may need to adjust this part based on your modal implementation)
	var modalParent = document.getElementById('dash-grpwise-bargraph-modal');
    var closeButton = modalParent.querySelector('.close');
    if (closeButton) {
        closeButton.click();
    }

    window.scrollBy(0,1100);
    var groupButtonMappings = {
            'Education & Training': 'E&T',
            'e-Governance': 'e-Gov',
            'Embedded Systems': 'Embedded',
            'Health Informatics - I': 'HI - I',
            'Health Informatics - II': 'HI - II',
            'Speech & Natural Language Processing': 'NLP',
            'Data Centre & Information Services': 'DC',
            'PMO and SQA': 'PMO'
        };

        // If the groupName is in the mapping, find and click the corresponding button
        if (groupButtonMappings[groupName]) {
            var buttons = document.querySelectorAll('.btn1');
            for (var i = 0; i < buttons.length; i++) {
                if (buttons[i].innerText === groupButtonMappings[groupName]) {
                    buttons[i].click();
                    break; // Stop searching after clicking the matching button
                }
            }
        }
}
//End of redirecting to ongoing projects