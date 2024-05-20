var amountRegex='';
var amountRegexMessage = '';
messageResource.init({
	filePath : '/PMS/resources/app_srv/PMS/global/js'
});

messageResource.load('regexValidationforjs', function() {	
	amountRegex= messageResource.get('amount.regex','regexValidationforjs');
	amountRegexMessage = messageResource.get('amount.regex.message','regexValidationforjs');
});

$(document).ready(function() {
	$('.select2Option').select2({
		width : '100%'
	});

});

$(document)
		.ready(
				function() {

					$('#reset').click(function() {
		
		resetForm();
	});

	 
	$('#form1').bootstrapValidator({
	
										excluded : ':disabled',
										message : 'This value is not valid',
										feedbackIcons : {
											valid : 'glyphicon glyphicon-ok',
											invalid : 'glyphicon glyphicon-remove',
											validating : 'glyphicon glyphicon-refresh'
										},
										fields : {
											cost: {
									              
									              validators: {
									                  notEmpty: {
									                      message: 'Cost is required and cannot be empty'
									                  },
									                  stringLength: {
									                        max: 100,
									                        message: 'Cost must be less than 20 chars'
									                    },
									                    regexp: {
									                        regexp: amountRegex,
									                       message: amountRegexMessage
									                    }
									              }
									          },
									          designationId:{
									        	  group: '.col-md-12',
									        	  validators: {
									                  callback: {
									                      message: 'Please choose Designation',
									                      callback: function(value, validator) {									                          
									                          var options = validator.getFieldElements('designationId').val();
									                          return (options != 0);
									                      }
									                  }
									              }
									          }, projectCategoryId:{									        	  
									        	  validators: {
									                  callback: {
									                      message: 'Please choose Project category',
									                      callback: function(value, validator) {									                         
									                          var options = validator.getFieldElements('projectCategoryId').val();
									                          return (options != 0);
									                      }
									                  }
									              }
									          }
										

										}
									});

					$('#save')
							.click(
									function() {									
										var bootstrapValidator = $("#form1").data('bootstrapValidator');
										bootstrapValidator.validate();
										if (bootstrapValidator.isValid()) {
											var categoryId = $('#projectCategoryId').val();
											var designationId = $('#designationId').val();
											var numId= $('#numId').val();
											var cost = $('#cost').val().trim();
											$.ajax({
												type : "POST",
												url : "/PMS/projectCategorydesignationMapping",
												data : {"projectCategoryId" : categoryId,
													"designationId":designationId,
													"numId":numId,
													"cost":cost
													},												
												success : function(response) {
													console.log(response);
													resetForm();
													if(response == 'save'){
														
														sweetSuccess('Attention','Data saved Successfully');
													}else if(response == 'update'){
														sweetSuccess('Attention','Data updated Successfully');
													}else{
														sweetSuccess('Attention','Something went wrong');
													}	
												}
											})
										} else {
											console.log('Not Validated');

										}

									});

				});

function resetForm() {
	$('#numId').val('0');
	$('#cost').val('0');
	$('#projectCategoryId').val('0').trigger('change');
	$('#designationId').val('0').trigger('change');
	$('#form1').data('bootstrapValidator').resetForm(true);
}


$(document).ready(function() {
	$('.data').change(function(){
		var projectCategoryId = $('#projectCategoryId').val();
		var designationId = $('#designationId').val();
		if(projectCategoryId != 0 && designationId != 0){
			loadData(projectCategoryId,designationId);
		}else{
			$('#numId').val(0);
			$('#cost').val(0);
		}
	});
});

function loadData(categoryId, designationId){
	$.ajax({
		type : "POST",
		url : "/PMS/categoryDesignationCost",
		data : {"projectCategoryId" : categoryId,"designationId":designationId},
		success : function(response) {
			console.log(response);
				if(response.hasOwnProperty("numId")){
					$('#numId').val(response.numId);
					if(response.cost){
						$('#cost').val(response.cost);
					}else{
						$('#cost').val(0);
					}
					
				}else{
					sweetSuccess('Error','Something went wrong');
				}
			}
		});
}
