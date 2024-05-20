$(document).ready(function() {
$('#toggle-off').removeAttr('Checked');
	$('#toggle-on').attr('checked',true);
		$('#example').DataTable();
		
		  $('.select2Option').select2({
		    	 width: '100%'
		    });
	});

	$(document).on('click','#edit',function(e){
		var resultArray = $(this).closest('tr').find('td').map( function()
				{
				return $(this).text();
				}).get();
		console.log(resultArray);
		$('#organisationId').val(resultArray[1].trim().split("(")[1].split(")")[0]).trigger('change');;
		$('#numId').val(resultArray[0].trim());
		$('#groupName').val(resultArray[3].trim());
		$('#groupShortName').val(resultArray[4].trim());
		$('#groupAddress').val(resultArray[5].trim());
		$('#contactNumber').val(resultArray[6].trim());	
		
		
		if(resultArray[7].trim()=='Active'){
			$('#toggle-off').removeAttr('checked');
			$('#toggle-on').attr('checked',true);

		}else{
			$('#toggle-on').removeAttr('checked');
			$('#toggle-off').attr('checked',true);
		}
		$('#bgColor').val(resultArray[8].trim());	
		$('#strCode').val(resultArray[9].trim());	
		$('#save').text('Update');
	});
	
	

$(document).ready(function(){	

	$('#reset').click(function(){
		resetForm();
	});
	
	$('#save').click(function(){
		
		$('#groupName').validatebox({
		    required: true,
		    validType: ['minLength[1]','maxLength[500]']
		});
		
		$('#contactNumber').validatebox({
		    required: true,
		    validType: ['minLength[10]','maxLength[33]']
		}); 
		
		$('#groupAddress').validatebox({
		    required: true,
		    validType: ['minLength[1]','maxLength[500]']
		}); 
		
		$('#groupShortName').validatebox({		    
		    validType: ['maxLength[100]']
		});
		
		$('#bgColor').validatebox({		    
		    validType: ['maxLength[50]']
		});
		
		var istoggle="";
	   	 if($("#toggle-on").prop("checked")==true) {	   		 
	   		 istoggle=true;
	   	}
	   	 else if($("#toggle-off").prop("checked")==true){
	   	  istoggle=false;
	   	 }
	   	 $('#valid').val(istoggle);
		
		   if($('#form1').form('validate')){				
				document.getElementById("form1").submit();
				resetForm();
		   }
	});
		
});

function resetForm(){	
	
	$('#organisationId').val('0').trigger('change');
	$('#numId').val('0');
	$('#groupName').val('');
	$('#groupShortName').val('');
	$('#groupAddress').val('');
	$('#contactNumber').val('');
	$('#bgColor').val('');
	$("#toggle-off").attr("checked", false);
	$("#toggle-on").attr("checked", true);
	$('#save').text('Save');
}
