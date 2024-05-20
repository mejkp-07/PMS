package in.pms.login.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import in.pms.login.model.RoleReportModel;
import in.pms.master.domain.ReportMaster;
import in.pms.master.service.ReportMasterService;
import in.pms.master.service.RoleMasterService;

@Controller
public class RoleReportController {
	
	@Autowired
	RoleMasterService roleMasterService;
	
	@Autowired
	ReportMasterService reportMasterService;

	@RequestMapping(value ="/roleReport", method=RequestMethod.GET)
	public String getAllRoleReport(HttpServletRequest request, RoleReportModel roleReportModel,RedirectAttributes redirectAttributes){		
		List<RoleReportModel> roleList = roleMasterService.getAllRoleDetails();	
		request.setAttribute("roleList", roleList);		
		List<ReportMaster> reportList = reportMasterService.reportName();
		request.setAttribute("reportList", reportList);
		return "roleReport";
	}
	
	@RequestMapping("/saveRoleReport")
	public String saveRoleReports(HttpServletRequest request, RoleReportModel roleReportModel, RedirectAttributes redirectAttributes){		
		String strDuplicateCheck = roleMasterService.checkDuplicateRoleData(roleReportModel);
		if(null == strDuplicateCheck){
		long id = roleMasterService.saveRoleData(roleReportModel);
		if(id>0){
			if(roleReportModel.getRoleId()==0){
				redirectAttributes.addFlashAttribute("message",  "RoleReport details saved Successfully with Id "+id);	
				redirectAttributes.addFlashAttribute("status", "success");
			}else{
				redirectAttributes.addFlashAttribute("message",  "RoleReport details updated Successfully with Id "+id);	
				redirectAttributes.addFlashAttribute("status", "success");
			}					  
		}
		}else{
			redirectAttributes.addFlashAttribute("message",strDuplicateCheck);
			redirectAttributes.addFlashAttribute("status", "error");
		}
				
		return "redirect:/roleReport";
	}
	  
      @RequestMapping("/getReportByRoleId") 
      public @ResponseBody String getReportByRoleId(HttpServletRequest request){ 
    	  long roleId = 0; if(null!=request.getParameter("roleId")) { 
    		  roleId =Long.parseLong(request.getParameter("roleId")); 
    		  String report=roleMasterService.getReportByRoleId(roleId); 
    		  return report;
	  } 
	  return ""; 
	  }
	 
	
}



