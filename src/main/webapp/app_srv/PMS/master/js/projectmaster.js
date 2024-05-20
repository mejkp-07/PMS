var addressRegex = '';
var addressErrorMessage = '';
var numericRegex = '';
var numericRegexMessage = '';
var amountRegex = '';
var amountRegexMessage = '';
var nameRegex='';
var nameErrorMessage='';
var gstRegex='';
var gstErrorMessage='';
var tanRegex='';
var tanErrorMessage='';

messageResource.init({
	filePath : '/PMS/resources/app_srv/PMS/global/js'
});

messageResource.load('regexValidationforjs',
		function() {
			numericRegex = messageResource.get('numeric.regex',
					'regexValidationforjs');
			numericRegexMessage = messageResource.get('numeric.regex.message',
					'regexValidationforjs');

			addressRegex = messageResource.get('address.regex',
					'regexValidationforjs');
			addressErrorMessage = messageResource.get('address.regex.message',
					'regexValidationforjs');

			amountRegex = messageResource.get('amount.regex',
					'regexValidationforjs');
			amountRegexMessage = messageResource.get('amount.regex.message',
					'regexValidationforjs');
			
			nameRegex= messageResource.get('name.regex', 'regexValidationforjs');
			nameErrorMessage = messageResource.get('name.regex.message', 'regexValidationforjs');
			
			gstRegex= messageResource.get('gst.regex', 'regexValidationforjs');
			gstErrorMessage = messageResource.get('gst.regex.message', 'regexValidationforjs');
			
			tanRegex= messageResource.get('tan.regex', 'regexValidationforjs');
			tanErrorMessage = messageResource.get('tan.regex.message', 'regexValidationforjs');

		});

$(document).ready(function() {

	$('.select2Option').select2({
		width : '100%'
	});
	$('#workOrderDate').datepicker({
		dateFormat : 'dd/mm/yy',
		changeMonth : true,
		changeYear : true,
		maxDate : '+5y',
		onSelect : function(date) {
			$('#workOrderDate').trigger('input');
			saveField("workOrderDate");
		}
	});
	$('#mouDate').datepicker({
		dateFormat : 'dd/mm/yy',
		changeMonth : true,
		changeYear : true,
		maxDate : '+5y',
		onSelect : function(date) {
			saveField("mouDate");

		}
	});

	/*$("#startDate").datepicker({
		dateFormat : 'dd/mm/yy',
		changeMonth : true,
		changeYear : true,
		maxDate : '+5y',
		onSelect : function(date) {
			$('#startDate').trigger('input');
			var dateData = date.split('/');
			var monthval = parseInt(dateData[1]) - 1;
			var selectedDate = new Date(dateData[2], monthval, dateData[0]);

			// Set Minimum Date of EndDatePicker After Selected Date of
			// StartDatePicker
			$("#endDate").datepicker("option", "minDate", selectedDate);
			$("#endDate").datepicker("option", "maxDate", '+5y');
			saveField("startDate");
		}
	});*/

	//Added by devesh on 01-11-23 to fix project start date once it is saved
	var startDate=$("#startDate").val();
	var startdateData = startDate.split('/');
	var startmonthval = parseInt(startdateData[1]) - 1;
	var selectedstartDate = new Date(startdateData[2], startmonthval, startdateData[0]);
	if(startDate !== "")$("#startDate").datepicker("option", "disabled", true);
	else{
		$("#startDate").datepicker({
			dateFormat : 'dd/mm/yy',
			changeMonth : true,
			changeYear : true,
			maxDate : '+5y',
			onSelect : function(date) {
				swal({
	    			  title: "Attention",
	    			  text: "Once saved,you would not able to modify Project Start Date. Do you want to save?",
	    			  type: 'success',						  
	    		      buttons: [					               
	    		                'No',
	    		                'Yes'
	    		              ],	     
	    		    }).then(function(isConfirm) {
	    		    	if (isConfirm) {
	    		    		$('#startDate').trigger('input');
	    					var dateData = date.split('/');
	    					var monthval = parseInt(dateData[1]) - 1;
	    					var selectedDate = new Date(dateData[2], monthval, dateData[0]);
	    					
	    		    		// Set Minimum Date of EndDatePicker After Selected Date of
	    					// StartDatePicker
	    					$("#endDate").datepicker("option", "minDate", selectedDate);
	    					saveField("startDate");
	    					/*$("#startDate").datepicker("option", "disabled", true);*/
	    					$("#startDate").css('pointer-events', 'none');
	    		    	}
	    		    	else $('#startDate').val('');
	    		    });
			}
		});
	}
	//End of setting Start Date

	$("#endDate").datepicker({
		dateFormat : 'dd/mm/yy',
		changeMonth : true,
		changeYear : true,
		minDate : selectedstartDate, //Added by devesh on 01-11-23 to set min date as start date on load
		onSelect : function(date) {
			$('#endDate').trigger('input');
			saveField("endDate");

		}
	});

	$('#example').DataTable();
	$('#userinfo-message').delay(5000).fadeOut();
	$('#delete').click(function() {
		BudgetDelete();
	});
});

$(document).on('click', '#edit', function(e) {

	var resultArray = $(this).closest('tr').find('td').map(function() {
		return $(this).text();
	}).get();
	console.log(resultArray);

	$('#numId').val(resultArray[0].trim());
	$('#strProjectName').val(resultArray[1].trim());
	$('#strProjectObjective').val(resultArray[2].trim());
	$('#strBriefDescription').val(resultArray[3].trim());
	$('#strProjectAim').val(resultArray[4].trim());
	$('#strProjectScope').val(resultArray[5].trim());
	$('#projectType').val(resultArray[6].trim()).trigger('change');
	$('#startDate').val(resultArray[7].trim());
	$('#endDate').val(resultArray[8].trim());
	$('#mouDate').val(resultArray[9].trim());
	$('#workOrderDate').val(resultArray[10].trim());
	$('#projectDuration').val(resultArray[11].trim());
	$('#projectCost').val(resultArray[12].trim());
	$('#strProjectStatus').val(resultArray[13].trim()).trigger('change');
	$('#strProjectRemarks').val(resultArray[14].trim());
	$('#strFundedScheme').val(resultArray[15].trim());

	$('#save').text('Update');
});

$(document)
		.ready(
				function() {

					$('#reset').click(function() {
		resetForm();
	});
	
	$('#form1').bootstrapValidator({
																		// live:
																		// 'disabled',
										excluded : ':disabled',
										message : 'This value is not valid',
										feedbackIcons : {
											valid : 'glyphicon glyphicon-ok',
											invalid : 'glyphicon glyphicon-remove',
											validating : 'glyphicon glyphicon-refresh'
										},
										fields : {
											strProjectName : {
												group : '.col-md-12',
												validators : {
													notEmpty : {
														message : 'Project Name is required and cannot be left empty'
													},
													stringLength : {
														max : 300,
														message : 'Project Name can not be greater than 300 characters'
													},
													regexp : {
														regexp : nameRegex,
														message : nameErrorMessage
													}
												}
											},
											projectCost : {
												group : '.col-md-12',
												validators : {
													notEmpty : {
														message : 'CDAC Outlay is required and cannot be left empty'
													},
													stringLength : {
														max : 18,
														message : 'CDAC Outlay must not be greater than 18 digits'
													},
													regexp : {
														regexp : amountRegex,
														message : amountRegexMessage
													}
												}
											},
											totalOutlay : {
												group : '.col-md-12',
												validators : {
													notEmpty : {
														message : 'Total Outlay is required and cannot be left empty'
													},
													stringLength : {
														max : 18,
														message : 'Total Outlay must not be greater than 18 digits'
													},
													regexp : {
														regexp : amountRegex,
														message : amountRegexMessage
													}
												}
											},
											workOrderDate : {
												validators : {
													notEmpty : {
														message : 'Work Order Date is required and cannot be left empty'
													}
												}
											},
										/*	projectRefrenceNo : {
												validators : {
													notEmpty : {
														message : 'Project Refrence No. is required and cannot be left empty'
													}
												}
											},*/
											startDate : {
												validators : {
													notEmpty : {
														message : 'Start Date is required and cannot be left empty'
													}
												}
											},
											endDate : {
												validators : {
													notEmpty : {
														message : 'End Date is required and cannot be left empty'
													}
												}
											},
											
											strProjectObjective : {
												group : '.col-md-12',
												validators : {
													notEmpty : {
														message : 'Project Objective is required and cannot be left empty'
													},
													stringLength : {
														max : 2000,
														message : 'Project Objective must be less than or equals to 2000 characters'
													},
													/*regexp : {
														regexp : addressRegex,
														message : addressErrorMessage
													}*/
												}
											},
											
											strProjectAim : {
												group : '.col-md-12',
												validators : {
													notEmpty : {
														message : 'Project Aim is required and cannot be left empty'
													},
													stringLength : {
														max : 2000,
														message : 'Project Aim must be less than or equals to 2000 characters'
													},
													/*regexp : {
														regexp : addressRegex,
														message : addressErrorMessage
													}*/
												}
											},
											strProjectRemarks : {
												group : '.col-md-12',
												validators : {
													
													stringLength : {
														max : 2000,
														message : 'Remarks must be less than or equals to 2000 characters'
													},
													/*regexp : {
														regexp : addressRegex,
														message : addressErrorMessage
													}*/
												}
											},
											strFundedScheme : {
												group : '.col-md-12',
												validators : {
													stringLength : {
														max : 2000,
														message : 'Funded Scheme Name must be less than or equals to 2000 characters'
													},
													/*regexp : {
														regexp : addressRegex,
														message : addressErrorMessage
													}*/
												}
											},
										/*	strGST : {
												group : '.col-md-12',
												validators : {
													stringLength : {
														max : 15,
														message : 'GST No should not be greater than 15'
													},
													regexp : {
														regexp : gstRegex,
														message : gstErrorMessage
													}
												}
											},
											strTAN : {
												group : '.col-md-12',
												validators : {
													stringLength : {
														max : 10,
														message : 'TAN No should not be greater than 10'
													},
													regexp : {
														regexp : tanRegex,
														message : tanErrorMessage
													}
												}
											},*/
											description : {
												group : '.col-md-12',
												validators : {
													notEmpty : {
														message : 'Project Description is required and cannot be left empty'
													},
													stringLength : {
														max : 6000,
														message : 'Project Description must be less than or equals to 6000 characters'
													},
													/*regexp : {
														regexp : addressRegex,
														message : addressErrorMessage
													}*/
												}
											},
											
										}
									});

					$('#save')
							.click(
									function() {

										var istoggle = "";
										if ($("#toggle-on").prop("checked") == true) {
											istoggle = true;
										} else if ($("#toggle-off").prop(
												"checked") == true) {
											istoggle = false;
										}
										$('#valid').val(istoggle);

										var bootstrapValidator = $("#form1")
												.data('bootstrapValidator');
										bootstrapValidator.validate();
										if (bootstrapValidator.isValid()) {
											document.getElementById("save").disabled = true;
											var frm = $('#form1');

											console
													.log($("#form1")
															.serialize());
											
										    if(bootstrapValidator.isValid()){				
												document.getElementById("save").disabled = true; 
												 $( "#form1")[0].submit();
												return true;
											
										}else{
											console.log('Not Validated');
											document.getElementById("save").disabled = false; 
										}
										    
										}

				});
				});
function resetForm() {
	$('#numId').val('');
	$('#strProjectName').val('');
	$('#strProjectObjective').val('');
	$('#strBriefDescription').val('');
	$('#strProjectAim').val('');
	$('#strProjectScope').val('');
	$('#ProjectType').val('');
	$('#startDate').val('');
	$('#endDate').val('');
	$('#mouDate').val('');
	$('#workOrderDate').val('');
	$('#ProjectDuration').val('');
	$('#ProjectCost').val('');
	$('#strProjectStatus').val('');
	$('#strProjectRemarks').val('');
	$('#strFundedScheme').val('');
	$('#save').text('Save');
	$('#form1').data('bootstrapValidator').resetForm(true);
}

function gonext() {
	
	var istoggle = "";
	if ($("#toggle-on").prop("checked") == true) {
		istoggle = true;
	} else if ($("#toggle-off").prop(
			"checked") == true) {
		istoggle = false;
	}
	$('#valid').val(istoggle);

	var bootstrapValidator = $("#form1")
			.data('bootstrapValidator');
	bootstrapValidator.validate();
	if (bootstrapValidator.isValid()) {
		checkStartDate();
		var path = $(location).attr('pathname');
		var appId=$("#numId").val();
		document.getElementById("form1").action = "/PMS/nextRedirectPage?path='"+ path + "'&workflowTypeId=3&uniqueId=" + appId;
		document.getElementById("form1").method = "POST";
		document.getElementById("form1").submit();
	}

}
/*function gonext(appId) {
	var path = $(location).attr('pathname');

	document.getElementById("form1").action = "/PMS/nextRedirectPage?path='"
			+ path + "'&workflowTypeId=3&uniqueId=" + appId;
	document.getElementById("form1").method = "POST";
	document.getElementById("form1").submit();

}*/

function BudgetDelete() {
	var chkArray = [];

	$(".CheckBox:checked").each(function() {
		chkArray.push($(this).val());
	});

	var selected;
	selected = chkArray.join(',');
	if (selected.length >= 1) {

		swal({
			title : "Are you sure you want to delete the record?",
			icon : "warning",
			buttons : [ 'No', 'Yes' ],
			dangerMode : true,
		}).then(function(isConfirm) {
			if (isConfirm) {
				$("#numIds").val(selected);
				submit_form_delete();
			}
			/*
			 * if(confirm("Are you sure you want to delete the record")) {
			 * 
			 * $("#userinfo-message").show().delay(3000).fadeOut(); }
			 */
			else {

				return false;
			}
		});
	} else {
		swal("Please select at least one Name to delete");
	}

}

function submit_form_delete() {
	document.form1.action = "/PMS/mst/deleteProjectMaster";
	document.getElementById("form1").submit();
	resetForm();
}
$('#reset').click(function() {
	resetForm();
});


function saveField(fieldId){
	var fieldValue = $('#'+fieldId).val();
	console.log("val=="+fieldValue);
	var validationFlag= true;
	/*---------------- Total Outlay and Cdac Outlay Validation -------------*/
	if(fieldId==='projectCost')
	{
		var cdacOutlay = parseInt($('#'+fieldId).val());
		var totalOutlay = parseInt($('#totalOutlay').val());
		console.log("Total:"+totalOutlay+"CDAC:"+cdacOutlay);
		console.log(cdacOutlay>=totalOutlay);
		if(cdacOutlay>totalOutlay){
			sweetSuccess('Attention','CDAC Outlay should not be greater than Total Outlay !');
			$('#projectCost').val($('#lastcdacCost').val());
			return;
		}else{
			$('#lastcdacCost').val(fieldValue);
		}
	}
	/*-----------------------------------------------------------------------*/
	
	if ($("#"+fieldId).hasClass("validateName")) {
		
		if(!validateName(fieldValue)){
			$('#'+fieldId).val('');
			sweetSuccess("Attention",nameErrorMessage);
			validationFlag= false;
			return false;
		}
				
				if(fieldValue.length>200){
					sweetSuccess('Attention','Project Name must be less than 200 characters');
					validationFlag= false;
					return false;
				}
			
	 
	 }
	 
	else if ($("#"+fieldId).hasClass("validateCost")) {
		 
			    if(!validateAmount(fieldValue)){
					$('#'+fieldId).val('0');
					sweetSuccess("Attention",amountRegexMessage);
					validationFlag= false;
					return false;
				}
				if(fieldValue.length>18){
					sweetSuccess('Attention','Total Outlay must be less than 18 characters');
					validationFlag= false;
					return false;
				}
			
	 
	 }
	
	else if ($("#"+fieldId).hasClass("validateTextArea")) {
		if(fieldValue.length>2000){
			sweetSuccess('Attention','This Field must be less than 2000 characters');
			validationFlag= false;
			return false;
		}
		
		
		else if ($("#"+fieldId).hasClass("validateProjectRefNo")) {
			if(fieldValue.length>2000){
				sweetSuccess('Attention','This Field must be less than 30 characters');
				validationFlag= false;
				return false;
			}
		}
			else if ($("#"+fieldId).hasClass("validateAdministrationNo")) {
				if(fieldValue.length>50){
					sweetSuccess('Attention','This Field must be less than 50 characters');
					validationFlag= false;
					return false;
				}
			}
		
			else if ($("#"+fieldId).hasClass("validateDescription")) {
				if(fieldValue.length>2000){
					sweetSuccess('Attention','This Field must be less than 2000 characters');
					validationFlag= false;
					return false;
				}
			}
			else if ($("#"+fieldId).hasClass("validateDescription")) {
				if(fieldValue.length>2000){
					sweetSuccess('Attention','This Field must be less than 2000 characters');
					validationFlag= false;
					return false;
				}
			}
			else if ($("#"+fieldId).hasClass("validateGST")) {
				if(fieldValue.length>15 || fieldValue.length<15){
					sweetSuccess('Attention','This Field must be equal to 15 characters');
					validationFlag= false;
					return false;
				}
			}
			else if ($("#"+fieldId).hasClass("validateTAN")) {
				if(fieldValue.length>10 || fieldValue.length<10){
					sweetSuccess('Attention','This Field must be less than 10 characters');
					validationFlag= false;
					return false;
				}
			}
	}
	

	
	$.ajaxRequest.ajax({
		type : "POST",
		url : "/PMS/mst/saveProjectDetails",
		data :$('#form1').serialize(),
		success : function(response) {
			if(response > 0){
				$('#numId').val(response);
			}
		}, error: function(data) {
	 	  
	   }
	})

	
}

function validateNumeric(amount){		
	numericRegex = new RegExp(numericRegex);			
	 if (numericRegex.test(amount)) {  
	    return (true)  ;
	  }else{
		  sweetSuccess("Attention",numericRegexMessage);
		  return (false)  ; 
	  }		
}

function validateAmount(amount){		
	amountRegex = new RegExp(amountRegex);			
	 if (amountRegex.test(amount)) {  
	    return (true)  ;
	  }else{
		  sweetSuccess("Attention",amountRegexMessage);
		  return (false)  ; 
	  }		
}

function validateName(value){		
	nameRegex = new RegExp(nameRegex);			
	 if (nameRegex.test(value)) {  
	    return (true)  ;
	  }else{
		  sweetSuccess("Attention",nameErrorMessage);
		  return (false)  ; 
	  }		
}

function validateAddress(value){		
	addressRegex = new RegExp(addressRegex);			
	 if (addressRegex.test(value)) {  
	    return (true)  ;
	  }else{
		  sweetSuccess("Attention",addressErrorMessage);
		  return (false)  ; 
	  }		
}

function checkStartDate(){
	$.ajaxRequest.ajax({
		type : "POST",
		url : "/PMS/mst/checkProjectDate",
		data :$('#form1').serialize(),
		async:false,
		success : function(response) {
			
		}
	})
	
}

function redirectPage(path){
	var encProjectId = $('#encProjectId').val();
	//alert(projectId);
	openWindowWithPost('GET',path,{"encProjectId" : encProjectId},'_self');
}
