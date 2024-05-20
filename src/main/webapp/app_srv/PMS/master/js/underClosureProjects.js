function startWorkFlow(applicationId,moduleTypeId,businessTypeId,projectTypeId,categoryId){
			openWindowWithPost('POST','/PMS/startProjectWorkflow',{"numId":applicationId,"moduleTypeId":moduleTypeId,"businessTypeId":businessTypeId,"projectTypeId":projectTypeId,"categoryId":categoryId},'_blank');
			}

$(document).ready(function() {
	$('#example1').DataTable({
		"paging":   false, 
		"ordering": false
	});
});


function viewAllowedActions(encCustomId){
	
	var encWorkflowId = $('#encWorkflowId').val();
	$.ajax({
        type: "POST",
        url: "/PMS/getNextRoleActionDetails",
        async:false,
        data: {"encCustomId":encCustomId,"encWorkflowId":encWorkflowId},			
		success : function(res) {	
			
			$('#'+encCustomId).find('li').remove();	
			if(Array.isArray(res) && res.length >0){
				for(var i=0;i<res.length;i++){	
					
					
					/*if(res[i].numActionId == 18){
						$('#'+encCustomId).append("<li> <a class='font_14'  onclick= updateProjectClosure('"+encCustomId+"') > "+res[i].strActionName+"</a></li>");
						//$('#'+encCustomId).append("<li> <a class='font_14' onclick=performAction('"+encCustomId+"','"+res[i].strEncActionId+"',"+res[i].isRemarksReq+") title='"+res[i].strToolTip+"'><span  aria-hidden='true'>"+res[i].strActionName+"</span></a></li>");
					}
					else{*/
					
					
						$('#'+encCustomId).append("<li> <a class='font_14' onclick=performAction('"+encCustomId+"','"+res[i].strEncActionId+"',"+res[i].isRemarksReq+","+res[i].numActionId+") title='"+res[i].strToolTip+"'><span  aria-hidden='true'>"+res[i].strActionName+"</span></a></li>");
					/*}*/
					
				}
			}else{
				$('#'+encCustomId).append("<li> <a class='font_14 red'><span  aria-hidden='true'> No Action </span></a></li>");
			}
		/*	$('#'+encCustomId).append("<li> <a class='font_14 red' onclick= viewClosureReq('"+encCustomId+"') ><span  aria-hidden='true'> View Closure </span></a></li>");*/				
		},
		error : function(e) {					
		}		
	});

}

function performAction(customId,encActionId,isRemarks,actionId){
	var roleId=$("#roleId").val();
	var encWorkflowId = $('#encWorkflowId').val();
	//Added 18/09/23 to check project team contains HOD or not
	var elements = document.getElementsByClassName(customId);
	if(actionId==23){
	    window.scrollTo({
	        top: 0,
	        behavior: 'smooth' 
	    });
	}
	  if (elements.length > 0) {
	    var hodStatus = elements[0].value;
	  }
	console.log("hodStatus.."+customId);
	console.log("actionId.."+actionId);
	if ((hodStatus==='false') && actionId===27) {
	  swal("Mapping of HOD is Pending.")
	  return;
	} 
	//end
	/*if(encActionId==21){
		openWindowWithPost('GET','/PMS/mst/projectClosure',{"encProjectId" : encCustomId},'_self');
		return false;
	}*/
	if(isRemarks==0){
		swal({
			  title: "Do you want to submit?",
			  buttons: [					               
		                'No',
		                'Yes'
		              ],	     
		    }).then(function(isConfirm) {
		      if (isConfirm) {
		    	  doWorkAccrodingToAction(customId,encActionId,encWorkflowId,"",actionId);
		      } else {
		    	  
		      }
		    }); 
		
	}
	else if(isRemarks==1 && actionId==23 && roleId==7){
		
		$('#financialApprovalModel').modal('show');
		$('#encActionId').val(encActionId);
		$('#customId').val(customId);
		
		return false;
	}
	else if(isRemarks==1 && actionId!=23)
		{
			var textarea = document.createElement('textarea');
			
		  textarea.rows = 6;
		  textarea.className = 'swal-content__textarea';
		  textarea.id = 'textArea';
		  textarea.placeholder = 'You can write remarks';
		
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
						 	if(textAreaValue.length<300 || textAreaValue.length==300){						 		
						 		doWorkAccrodingToAction(customId,encActionId,encWorkflowId,textAreaValue);
						 	}
						 	else{
						 			swal("Remarks should be less than or equals to 300 characters.");
						 		}
				      } 
				}); 
		}
	else
		{
		  doWorkAccrodingToAction(customId,encActionId,encWorkflowId,"",actionId);
		}
}

function doWorkAccrodingToAction(encCustomId,encActionId,encWorkflowId,strRemarks,actionId){
	
	if(actionId==21){
		openWindowWithPost('GET','/PMS/mst/viewProjectClosure',{"encProjectId" : encCustomId},'_self');
		return false;
	}
	else if(actionId==25){
		openWindowWithPost('GET','/PMS/mst/projectClosure',{"encProjectId" : encCustomId},'_self');
		return false;
	}
	else if(actionId==19){
		
		$.ajax({
	        type: "POST",
	        url: "/PMS/loadTransactionDetails",
	        async:false,
	        data: {"encCustomId":encCustomId,"encWorkflowId":encWorkflowId},			
			success : function(res) {
				
				
				var tableData ='';
				for(var i=0; i< res.length ;i++){
					var rowData = res[i];
					var remarks;
					
					if(!rowData.strRemarks){
						remarks='';
					}
					else
						{
						remarks=rowData.strRemarks;
						}
					tableData +="<tr> <td>"+(i+1)+"</td><td>"+rowData.employeeName+"</td> ";
					/*tableData +="<td>"+rowData.strActionPerformed+"</td> <td>"+remarks+"</td> ";*/
					tableData +="<td>"+rowData.strActionPerformed+"</td> <td>"+remarks+"</td><td>"+rowData.transactionAt.split(' ')[0]+"</td>";//Added by devesh on 18/7/23 for displaying transaction date on view proceedings
				
					
					tableData +="</tr>";
				}
				$('#proceedingTbl > tbody').html('');
				$('#proceedingTbl').append(tableData);
			},
		})
		$('#proceedingModal').modal('show');
		return false;
	}
	$.ajax({
        type: "POST",
        url: "/PMS/doWorkAccrodingToAction",
        async:false,
        data: {"encCustomId":encCustomId,"strEncActionId":encActionId,"encWorkflowId":encWorkflowId,"strRemarks":strRemarks},			
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
					    		  openWindowWithPost('GET','/PMS/mst/underClosureProjects','_self');
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

function viewClosureReq(encCustomId){
	openWindowWithPost('GET','/PMS/mst/projectClosure',{"encProjectId" : encCustomId},'_blank');
}

$(document).ready(function(){			
	var  table= $('#example').DataTable( {		
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

$( function() {
	  var dateFormat = "dd/mm/yy",
	    from = $( "#closureDate" )
	      .datepicker({
	    	dateFormat: 'dd/mm/yy', 
	  	    changeMonth: true,
	  	    changeYear:true,
	  	    maxDate: '0',
	  	    minDate : '-5Y'
	      })
	     /* .on( "change", function() {
	        to.datepicker( "option", "minDate", getDate( this ) );
	      });*/
});
	  
	 function submitClosureReq(){
		 
		var encActionId= $('#encActionId').val();
		var customId=$('#customId').val();
		var encWorkflowId = $('#encWorkflowId').val();
		 var finClosureDate= $("#closureDate").val();
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
						    		  openWindowWithPost('GET','/PMS/mst/underClosureProjects','_self');
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
	
	function viewAllowedActionsForPending(encCustomIdNew){
		
		var encWorkflowId = $('#encWorkflowId').val();
		$.ajax({
	        type: "POST",
	        url: "/PMS/getNextRoleActionDetails",
	        async:false,
	        data: {"encCustomId":encCustomIdNew,"encWorkflowId":encWorkflowId},			
			success : function(res) {	
				 
				$('#new'+encCustomIdNew).find('li').remove();	
				if(Array.isArray(res) && res.length >0){
					for(var i=0;i<res.length;i++){	
						
				
						
							$('#new'+encCustomIdNew).append("<li> <a class='font_14' onclick=performAction('"+encCustomIdNew+"','"+res[i].strEncActionId+"',"+res[i].isRemarksReq+","+res[i].numActionId+") title='"+res[i].strToolTip+"'><span  aria-hidden='true'>"+res[i].strActionName+"</span></a></li>");
						
						
					}
				}else{
					$('#new'+encCustomIdNew).append("<li> <a class='font_14 red'><span  aria-hidden='true'> No Action </span></a></li>");
				}
						
			},
			error : function(e) {					
			}		
		});

	}
	
	// Added the below function for get the funding organisation form by varun on 04-10-2023
	var scrollPos = 0;
	$('#clientDetails').on('show.bs.modal', function(event) {
		console.log("inside client modal");
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
	
