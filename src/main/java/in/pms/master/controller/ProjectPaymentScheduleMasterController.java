package in.pms.master.controller;


import in.pms.global.service.EncryptionService;
import in.pms.master.model.ProjectMasterForm;
import in.pms.master.model.ProjectMilestoneForm;
import in.pms.master.model.ProjectPaymentScheduleMasterModel;
import in.pms.master.service.ProjectMasterService;
import in.pms.master.service.ProjectMilestoneService;
import in.pms.master.service.ProjectPaymentScheduleMasterService;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Validator;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
@Controller
@RequestMapping("/mst")
@Slf4j

public class ProjectPaymentScheduleMasterController {

	@Autowired
	ProjectPaymentScheduleMasterService projectPaymentScheduleMasterService;
	
	@Autowired
	ProjectMasterService projectMasterService;
	
	@Autowired
	@Qualifier("ProjectPaymentScheduleMasterValidator")
	Validator validator;
	
	@Autowired
	EncryptionService encryptionService;
	
	@Autowired
	ProjectMilestoneService projectMilestoneService;
	
	
	@RequestMapping("/projectPaymentScheduleMaster")
	public String projectPaymentScheduleMaster(ProjectPaymentScheduleMasterModel projectPaymentScheduleMasterModel,HttpServletRequest request,Model map){		
	

		Map md = map.asMap();
		String strProjectId = "";
		if(null != md.get("projectId")){
			strProjectId = ""+md.get("projectId");
		}
		String encProjectId = projectPaymentScheduleMasterModel.getEncProjectId();
		if(null != encProjectId && !encProjectId.equals("")){
			strProjectId = encryptionService.dcrypt(encProjectId);
			String referer = request.getHeader("referer");
			if(null != referer && referer.contains("projectDetails")){
				request.setAttribute("referer", referer);
			}
		}
		int projectId=0;
		if(null != strProjectId && !strProjectId.equals("")){
			projectId = Integer.parseInt(strProjectId);
		}
		
		      if(projectId  > 0){
		    	  ProjectMasterForm projectMasterForm = projectMasterService.getProjectDetailByProjectId(projectId);
		    	  request.setAttribute("projectData", projectMasterForm);
		    	  List<ProjectPaymentScheduleMasterModel> datalist = new ArrayList<ProjectPaymentScheduleMasterModel>();					
					datalist = projectPaymentScheduleMasterService.getProjectPaymentScheduleByProjectId(projectId);
					request.setAttribute("data", datalist);
					if(null == datalist || datalist.size()==0){
						request.setAttribute("paymentSequence", 1);
					}else{
						request.setAttribute("paymentSequence", datalist.size()+1);
					}
					
					List<ProjectMilestoneForm> milestoneData= projectMilestoneService.getMilestoneByProjectId(projectId);
					request.setAttribute("milestoneData", milestoneData);
				request.setAttribute("projectId", projectId);
				request.setAttribute("encProjectId", encryptionService.encrypt(""+projectId));
		      }else{								  
			  		return "redirect:/accessDenied";		  
		      }		
		return "projectPaymentScheduleMaster";
	}
	
	

	
	@RequestMapping(value="/saveUpdateProjectPaymentScheduleMaster",method=RequestMethod.POST)	
		public ModelAndView saveUpdateProjectPaymentScheduleMaster(ProjectPaymentScheduleMasterModel projectPaymentScheduleMasterModel,HttpServletRequest request,RedirectAttributes redirectAttributes, BindingResult bindingResult){		
			ModelAndView mav = new ModelAndView();
			
			validator.validate(projectPaymentScheduleMasterModel, bindingResult);
		      if (bindingResult.hasErrors()) {
		    	  long projectId = projectPaymentScheduleMasterModel.getProjectId();
		    	  ProjectMasterForm projectMasterForm = projectMasterService.getProjectDetailByProjectId(projectId);
		    	  request.setAttribute("projectData", projectMasterForm);
		    	  List<ProjectPaymentScheduleMasterModel> datalist = new ArrayList<ProjectPaymentScheduleMasterModel>();					
					datalist = projectPaymentScheduleMasterService.getProjectPaymentScheduleByProjectId(projectId);
					request.setAttribute("data", datalist);
					if(null == datalist || datalist.size()==0){
						request.setAttribute("paymentSequence", 1);
					}else{
						request.setAttribute("paymentSequence", datalist.size()+1);
					}
					
					List<ProjectMilestoneForm> milestoneData= projectMilestoneService.getMilestoneByProjectId(projectId);
					request.setAttribute("milestoneData", milestoneData);
				request.setAttribute("projectId", projectId);
		    	  mav.setViewName("projectPaymentScheduleMaster");
		          return mav;
		      }
		      String encProjectId = encryptionService.encrypt(""+projectPaymentScheduleMasterModel.getProjectId());
		      long id =0;
			String strDuplicateCheck = projectPaymentScheduleMasterService.checkDuplicateProjectPaymentScheduleSeqNo(projectPaymentScheduleMasterModel);
			if(null == strDuplicateCheck){
			 id = projectPaymentScheduleMasterService.saveUpdateProjectPaymentScheduleMaster(projectPaymentScheduleMasterModel);
			
			if(id>0){
				if(projectPaymentScheduleMasterModel.getNumId()==0){
					redirectAttributes.addFlashAttribute("message",  "Project Payment Schedule record saved Successfully with Id "+id);	
					redirectAttributes.addFlashAttribute("status", "success");
				}else{
					redirectAttributes.addFlashAttribute("message",  "Project Payment Schedule record updated Successfully with Id "+id);	
					redirectAttributes.addFlashAttribute("status", "success");
				}					
			}
			}else{				
				redirectAttributes.addFlashAttribute("message",strDuplicateCheck);
				redirectAttributes.addFlashAttribute("status", "error");
			}
	
			redirectAttributes.addFlashAttribute("encProjectId",encProjectId);
			redirectAttributes.addFlashAttribute("projectId", projectPaymentScheduleMasterModel.getProjectId());
			mav.setViewName("redirect:/mst/projectPaymentScheduleMaster");
			return mav;
		}

		
	@RequestMapping(value = "/deleteProjectPaymentSchedule",  method = RequestMethod.POST)
	public String deleteProjectPaymentSchedule(ProjectPaymentScheduleMasterModel projectPaymentScheduleMasterModel, HttpServletRequest request,RedirectAttributes redirectAttributes)
    {	
				 
				  try
			    	{				
			    		long result= projectPaymentScheduleMasterService.deleteProjectPaymentSchedule(projectPaymentScheduleMasterModel);
			    		if(result !=-1){
			    			redirectAttributes.addFlashAttribute("message",  "Project Payment Schedul record deleted Successfully");	
			    			redirectAttributes.addFlashAttribute("status", "success");
			    		}else{
			    			redirectAttributes.addFlashAttribute("message",  "Something went wrong");	
			    			redirectAttributes.addFlashAttribute("status", "error");
			    		}
			    		List<ProjectPaymentScheduleMasterModel> list = projectPaymentScheduleMasterService.getAllProjectPaymentScheduleMasterDomain();
						request.setAttribute("data", list);        
	                    
	                    
			    	}
			    	catch(Exception e){
		          	log.error(e.getCause()+"\t"+e.getMessage()+"\t"+e.getStackTrace());

			    	}		
				  String encProjectId = encryptionService.encrypt(""+projectPaymentScheduleMasterModel.getProjectId());
				  redirectAttributes.addFlashAttribute("encProjectId",encProjectId);
				  redirectAttributes.addFlashAttribute("projectId", projectPaymentScheduleMasterModel.getProjectId());
				  return "redirect:/mst/projectPaymentScheduleMaster";
    }
		
		
		
		
		
	//ajax call get Project Payment Schedule using ProjectId
			@RequestMapping(value="/getProjectPaymentScheduleByProjectId",method=RequestMethod.POST,produces="application/json")
			public @ResponseBody List<ProjectPaymentScheduleMasterModel> getProjectPaymentScheduleByProjectId(@RequestParam("projectId") long projectId,ProjectPaymentScheduleMasterModel projectPaymentScheduleMasterModel , BindingResult result,HttpServletRequest request,HttpServletResponse response, RedirectAttributes redirectAttributes){
			
				
					List<ProjectPaymentScheduleMasterModel> datalist = new ArrayList<ProjectPaymentScheduleMasterModel>();
				
					
					datalist = projectPaymentScheduleMasterService.getProjectPaymentScheduleByProjectId(projectId);
					request.setAttribute("data1", datalist);	
				return datalist; 
			}

			//ajax call get Project Payment Schedule using MilestoneId
					@RequestMapping(value="/getProjectPaymentScheduleByMilestoneId",method=RequestMethod.POST,produces="application/json")
					public @ResponseBody List<ProjectPaymentScheduleMasterModel> getProjectPaymentScheduleByMilestoneId(@RequestParam("numMilestoneId") long numMilestoneId,ProjectPaymentScheduleMasterModel projectPaymentScheduleMasterModel , BindingResult result,HttpServletRequest request,HttpServletResponse response, RedirectAttributes redirectAttributes){
					
						
							List<ProjectPaymentScheduleMasterModel> datalist = new ArrayList<ProjectPaymentScheduleMasterModel>();
						
							
							datalist = projectPaymentScheduleMasterService.getProjectPaymentScheduleByMilestoneId(numMilestoneId);
							request.setAttribute("data1", datalist);	
						return datalist; 
					}
		
	
}
