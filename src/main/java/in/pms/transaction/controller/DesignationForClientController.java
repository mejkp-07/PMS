package in.pms.transaction.controller;

import in.pms.master.model.ProjectCategoryModel;
import in.pms.master.service.ProjectCategoryService;
import in.pms.transaction.model.DesignationForClientModel;
import in.pms.transaction.service.DesignationForClientService;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class DesignationForClientController {

	@Autowired
	DesignationForClientService designationForClientService;
	
	@Autowired
	ProjectCategoryService projectCategoryService;
	
	
	@RequestMapping("/designationForClient")
	public String designationForClient(DesignationForClientModel designationForClientModel,HttpServletRequest request){		
		designationForClientService.designationForClientAuthorityCheck();
		List<DesignationForClientModel> list = designationForClientService.getActiveDesignationForClient();
		request.setAttribute("data", list);	
		return "designationForClient";
	}

	
	@RequestMapping(value="/saveDesignationForClient",method=RequestMethod.POST)	
	public ModelAndView saveDesignationForClient(DesignationForClientModel designationForClientModel,HttpServletRequest request,RedirectAttributes redirectAttributes){		
		ModelAndView mav = new ModelAndView();
		
		String strDuplicateCheck = designationForClientService.checkDuplicateDesignationName(designationForClientModel);
		if(null == strDuplicateCheck){
		long id = designationForClientService.saveUpdateDesignationMaster(designationForClientModel);
		if(id>0){
			if(designationForClientModel.getNumId()==0){
				redirectAttributes.addFlashAttribute("message",  "Designation record saved Successfully with Id "+id);	
				redirectAttributes.addFlashAttribute("status", "success");
			}else{
				redirectAttributes.addFlashAttribute("message",  "Designation record updated Successfully with Id "+id);	
				redirectAttributes.addFlashAttribute("status", "success");
			}					
		}
		}else{
			
			
			redirectAttributes.addFlashAttribute("message",strDuplicateCheck);
			redirectAttributes.addFlashAttribute("status", "error");
		}
			
		mav.setViewName("redirect:/designationForClient");
		return mav;
	}	
	
	@RequestMapping("/projectCategorydesignationMapping")
	public String projectCategorydesignationMapping(DesignationForClientModel designationForClientModel,HttpServletRequest request){		
		designationForClientService.projectCategorydesignationMappingAuthorityCheck();
		List<DesignationForClientModel> designationList = designationForClientService.getActiveDesignationForClient();
		request.setAttribute("designationList", designationList);	
		
		List<ProjectCategoryModel> categoryList = projectCategoryService.getActiveProjectCategory();
		request.setAttribute("categoryList", categoryList);
		return "projectCategorydesignationMapping";
	}
	
	@RequestMapping(value="/categoryDesignationCost",method= RequestMethod.POST)
	public @ResponseBody DesignationForClientModel categoryDesignationCost(DesignationForClientModel designationForClientModel,HttpServletRequest request){
		
		return  designationForClientService.categorydesignationCost(designationForClientModel.getProjectCategoryId(), designationForClientModel.getDesignationId());
		
	}
	
	@RequestMapping(value="/projectCategorydesignationMapping",method= RequestMethod.POST)
	public @ResponseBody String saveprojectCategorydesignationMapping(DesignationForClientModel designationForClientModel,HttpServletRequest request){		
		
		return designationForClientService.saveprojectCategorydesignationMapping(designationForClientModel);
	}
	
}
