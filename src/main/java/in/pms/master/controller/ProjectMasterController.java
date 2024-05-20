package in.pms.master.controller;

import in.pms.global.domain.TransactionMasterDomain;
import in.pms.global.service.EncryptionService;
import in.pms.global.service.WorkflowService;
import in.pms.global.util.DateUtils;
import in.pms.login.util.UserInfo;
import in.pms.master.dao.EmployeeRoleMasterDao;
import in.pms.master.domain.ProjectMasterDomain;
import in.pms.master.domain.ProjectMilestoneDomain;
import in.pms.master.model.ClientMasterModel;
import in.pms.master.model.DocumentTypeMasterModel;
import in.pms.master.model.EmployeeRoleMasterModel;
import in.pms.master.model.ManpowerRequirementModel;
import in.pms.master.model.ProjectClosureModel;
import in.pms.master.model.ProjectDocumentMasterModel;
import in.pms.master.model.ProjectMasterForm;
import in.pms.master.model.ProjectMasterModel;
import in.pms.master.model.ProjectMilestoneForm;
import in.pms.master.model.ProjectPaymentScheduleMasterModel;
import in.pms.master.model.ProposalMasterModel;
import in.pms.master.service.ClientMasterService;
import in.pms.master.service.DocStageMappingService;
import in.pms.master.service.EmployeeRoleMasterService;
import in.pms.master.service.ManpowerRequirementService;
import in.pms.master.service.ProjectDocumentMasterService;
import in.pms.master.service.ProjectMasterService;
import in.pms.master.service.ProjectMilestoneService;
import in.pms.master.service.ProjectPaymentScheduleMasterService;
import in.pms.master.service.ProposalMasterService;
import in.pms.master.validator.ProjectMasterValidator;
import in.pms.transaction.domain.Application;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;


	@Controller
	@RequestMapping("/mst")
	public class ProjectMasterController {

		@Autowired
		ProjectMasterService projectMasterService;
		
		@Autowired
		WorkflowService workflowService;
				
		@Autowired
		ClientMasterService clientMasterService;
		
		@Autowired
		DocStageMappingService docStageMappingService;
		
		@Autowired
		EmployeeRoleMasterService employeeRoleMasterService;
		
		@Autowired
		EncryptionService encryptionService;
		
		@Autowired
		ManpowerRequirementService manpowerRequirementService;
		
		@Autowired
		ProjectMilestoneService projectMilestoneService;
		
		@Autowired
		ProjectPaymentScheduleMasterService projectPaymentScheduleMasterService;
		
		@Autowired
		ProjectDocumentMasterService projectDocumentMasterService;
		
		@Autowired
		ProposalMasterService proposalMasterService;
		
		@Autowired
		EmployeeRoleMasterDao employeeRoleMasterDao;
		
		@RequestMapping("/projectMaster")
		public ModelAndView getProjectMaster(HttpServletRequest request, ProjectMasterForm projectMasterForm,Model map){		
			ModelAndView modelAndView = new ModelAndView();

			Map md = map.asMap();
			int projectId=0;
		      if(md.get("projectId")!=null)
		    	  projectId=Integer.parseInt(md.get("projectId").toString());
		      
		      if(null != request.getParameter("encProjectId")){
					try{
					String encProjectId = request.getParameter("encProjectId");
					String strProjectId = encryptionService.dcrypt(encProjectId);
					projectId = Integer.parseInt(strProjectId);
					}catch(Exception e){
						e.printStackTrace();
					}
				}
		      
			if(projectId>0 ){
				request.setAttribute("encProjectId", encryptionService.encrypt(""+projectId));
				ProjectMasterDomain projectMasterDomain =projectMasterService.getProjectMasterDataById(projectId);
				//Application application = projectMasterDomain.getApplication();
				List<ProjectMasterDomain> domainList=new ArrayList<ProjectMasterDomain>();
				domainList.add(projectMasterDomain);
				List<ProjectMasterForm> model=projectMasterService.convertBudgetMasterDomainToModelList(domainList);
				if(model.size()>0)
				projectMasterForm=model.get(0);
				request.setAttribute("projectMasterForm", projectMasterForm);
				if(null!=projectMasterDomain.getApplication()){
					Application application = projectMasterDomain.getApplication();
					projectMasterForm.setTotalOutlay(application.getTotalProposalCost());
					}
				
				modelAndView.addObject("projectMasterForm",projectMasterForm);
			
				List<ClientMasterModel> clientData = clientMasterService.getAllActiveClientMasterDomainByApplicationId(projectMasterDomain.getApplication().getNumId());
				if(clientData.size()>0)
				request.setAttribute("clientMaster", clientData.get(0));
				modelAndView.setViewName("ProjectMaster");

			}else{
				modelAndView.setViewName("accessDenied"); 
			  }
			return modelAndView;
			
			
		}
	
		@RequestMapping(value="/saveProjectDetails",method=RequestMethod.POST)	
		@ResponseBody
		public long saveProposalMasterDetails(@ModelAttribute("projectMasterForm") ProjectMasterForm projectMasterForm ,HttpServletRequest request,RedirectAttributes redirectAttributes){		
			ProjectMasterDomain domain = projectMasterService.saveProjectDetailsData(projectMasterForm);
			return domain.getNumId();
		}
		
		@RequestMapping(value="/saveProjectMaster",method=RequestMethod.POST)	
		public String saveUpdateProjectDetailsMaster(HttpServletRequest request, ProjectMasterForm projectMasterForm, RedirectAttributes redirectAttributes,BindingResult bindingResult){		
			new ProjectMasterValidator().validate(projectMasterForm, bindingResult);
		      if (bindingResult.hasErrors()) {
		    	  List<ProjectMasterForm> list = projectMasterService.getAllProjectDetailsData();
					request.setAttribute("data", list);		
					//return "ProjectMaster";
		      }
			String strDuplicateCheck = projectMasterService.checkDuplicateProjectDetailsData(projectMasterForm);			
			if(null == strDuplicateCheck){
				ProjectMasterDomain domain= projectMasterService.saveProjectDetailsData(projectMasterForm);
			if(domain.getNumId()>0){
				if(projectMasterForm.getNumId()==0){
					redirectAttributes.addFlashAttribute("message",  "Project details saved Successfully");	
					redirectAttributes.addFlashAttribute("status", "success");
				}else{
					redirectAttributes.addFlashAttribute("message",  "Project details updated Successfully");	
					redirectAttributes.addFlashAttribute("status", "success");
				}	
				redirectAttributes.addFlashAttribute("projectId", domain.getNumId());
			}
			}else{
				redirectAttributes.addFlashAttribute("message",strDuplicateCheck);
				redirectAttributes.addFlashAttribute("status", "error");
			}
			return "redirect:/mst/projectMaster";

			}
		
		
		@RequestMapping(value="/deleteProjectMaster",method=RequestMethod.POST)
		public String deleteProjectMaster(ProjectMasterForm budgetHeadMasterForm, BindingResult result, HttpServletRequest request,RedirectAttributes redirectAttributes)
			{
				   
			if(budgetHeadMasterForm.getNumIds()==null || budgetHeadMasterForm.getNumIds().length==0){
				List<ProjectMasterForm> list = projectMasterService.getAllProjectDetailsData();
				request.setAttribute("data", list);	
				return "ProjectMaster";
			}
			else{
				    	try
				    	{
						
				    		projectMasterService.deleteProjectDetailsData(budgetHeadMasterForm);
				    		redirectAttributes.addFlashAttribute("message",  "Details deleted Successfully");	
				    		redirectAttributes.addFlashAttribute("status", "success");
				    		List<ProjectMasterForm> list = projectMasterService.getAllProjectDetailsData();
							request.setAttribute("data", list);		
		                   
		                    
		                    
				    	}
				    	catch(Exception e){

				    	}
				    	return "redirect:/mst/ProjectMaster";
			}
				    }
		@RequestMapping("/ViewProjectDetails")
		public String getAllViewProjectDetails(HttpServletRequest request, ProjectMasterForm projectMasterForm){	
			String encGroupId = projectMasterForm.getEncGroupId();	
			
			List<ProjectMasterForm> list = projectMasterService.viewProjectDetailsData(encGroupId);
			request.setAttribute("data", list);	
			//System.out.println(list);
			
			if(null == encGroupId){
				request.setAttribute("showWrapper", 1);
				return "ViewProjectDetails";
			}else{
				request.setAttribute("showWrapper", 0);
				return "ViewProjectDetailsWithoutHeader";
			}
			
		}
		
		@RequestMapping(value="/ViewProjectDetails",method=RequestMethod.POST)	
		@ResponseBody
		public List<ProjectMasterForm> ViewProjectDetails(@ModelAttribute("projectMasterForm") ProjectMasterForm projectMasterForm ,HttpServletRequest request,RedirectAttributes redirectAttributes){		
				String encGroupId = projectMasterForm.getEncGroupId();	
			
				List<ProjectMasterForm> list = projectMasterService.viewProjectDetailsData(encGroupId);
				
			return list;
			
		}

		@RequestMapping("/ViewAllProjects")
		public String getAllProjects(HttpServletRequest request, ProjectMasterForm projectMasterForm){		
			List<ProjectMasterForm> list = projectMasterService.getAllProjectDetails();
			request.setAttribute("data", list);	
			request.setAttribute("sysDate", new Date());
			/*-------------Get Under closure projects list without role ids [29-08-2023] -----------------------------------------------------------*/ 
			try {
				List<ProjectMasterForm> closureDataList = projectMasterService.underClosureProjectsList();
				if (closureDataList != null) {
					request.setAttribute("closureData", closureDataList);
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
			/*------------- End of Get Under closure projects list without role ids -----------------------------------------------------------*/ 
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			UserInfo userInfo = (UserInfo) authentication.getPrincipal();
			if(userInfo.getSelectedEmployeeRole()!=null && userInfo.getSelectedEmployeeRole().getNumRoleId()==6)
			request.setAttribute("isEdRole", 1);	
			request.setAttribute("role",userInfo.getSelectedEmployeeRole().getNumRoleId());
			return "ProjectList";
		}
		
		/*@RequestMapping("/ViewAssignedProjectDetails")
		public String getAllAssignedProjectDetails(HttpServletRequest request, ProjectMasterForm projectMasterForm){	
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			UserInfo userInfo = (UserInfo) authentication.getPrincipal();
			 String assignedProjects=userInfo.getAssignedProjects();
			 List<Object[]> list=pdao.viewProjectDetailsDataById(assignedProjects);
			    List<ProjectMasterDomain> list=new ArrayList<ProjectMasterDomain>();
				   StringTokenizer stringTokenizer = new StringTokenizer(assignedProjects, ",");
				   while (stringTokenizer.hasMoreElements()) {
					    Integer id = Integer.parseInt(stringTokenizer.nextElement().toString());
					    ProjectMasterDomain project=projectMasterService.getProjectMasterDataById(id);
					    list.add(project);
				   }
				   
			
			List<ProjectMasterForm> model=projectMasterService.convertProjectDetailsToModelList(list);
			request.setAttribute("data", model);		
	
				return "ViewProjectDetailsWithoutHeader";
			
			
		}*/
		@RequestMapping("/ViewAssignedProjectDetails")
		public String getAllAssignedProjectDetails(HttpServletRequest request, ProjectMasterForm projectMasterForm){	
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			UserInfo userInfo = (UserInfo) authentication.getPrincipal();
			String assignedProjects="";
			if(userInfo.getSelectedEmployeeRole()!=null && userInfo.getSelectedEmployeeRole().getNumProjectId()>0)
			 assignedProjects=userInfo.getSelectedEmployeeRole().getNumProjectId()+"";
			else
				assignedProjects=userInfo.getAssignedProjects();
				 			
			List<ProjectMasterForm> model=projectMasterService.getAllProjectMasterData(assignedProjects);
			request.setAttribute("data", model);		
			request.setAttribute("showWrapper", 0);
				return "ViewProjectDetailsWithoutHeader";
			
			
		}
		
		@RequestMapping(value="convertApplicationToProject",method=RequestMethod.POST)
		public String convertApplicationToProject(HttpServletRequest request, ProjectMasterForm projectMasterForm,RedirectAttributes redirectAttributes){
			long applicationId = projectMasterForm.getApplicationId();
			long numId=0;
			if(applicationId!=0){				
				ProjectMasterForm projectMasterForm1 =projectMasterService.getProjectDetailsByApplicationId(applicationId);
					if(null != projectMasterForm1){						
						numId=projectMasterForm1.getNumId();
					}else{
						//Load Proposal Details and convert to Project with Basic Information
						ProjectMasterForm projectMasterForm2= 	projectMasterService.getProjectDetailsFromProposalByApplicationId(applicationId);
						projectMasterForm2.setConvertProposalToProject(true);
						ProjectMasterDomain domain = projectMasterService.saveProjectDetailsData(projectMasterForm2);
						projectMasterForm2.setNumId(domain.getNumId());
						
						numId=projectMasterForm2.getNumId();

					}
			}
			redirectAttributes.addFlashAttribute("projectId", numId);
			/*return "redirect:/mst/projectMaster";*/
			//Added by devesh on 02-11-23 to set encId in url
			String encProjectId = encryptionService.encrypt(""+numId);
			String url = "/mst/projectMaster?encProjectId="+encProjectId;
			return "redirect:"+url;
			//End of code
		}
		
		@RequestMapping(value="projectClosure",method=RequestMethod.GET)
		public String projectClosure(HttpServletRequest request,ProjectClosureModel projectClosureModel){
			int editMode=0;
			String strProjectId = encryptionService.dcrypt(projectClosureModel.getEncProjectId());
			long projectId = Long.parseLong(strProjectId);
					
			// Added 18-09-23 to set roleId in project closure page
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			UserInfo userInfo = (UserInfo) authentication.getPrincipal();
			EmployeeRoleMasterModel selectedRole = userInfo.getSelectedEmployeeRole();
			if(null != selectedRole){
				int  roleId = selectedRole.getNumRoleId(); 
				request.setAttribute("roleId", roleId);
			}
			//End of setting roleId
			
			ProjectMasterModel projectMasterModel = projectMasterService.getProjectMasterModelById(projectId);
			request.setAttribute("projectDetails", projectMasterModel);
			
			ProjectClosureModel detailsOfTemp = projectMasterService.getTempProjectMasterModelById(projectId);
			
			request.setAttribute("projectTempMasterDetail", detailsOfTemp);
		
			if(detailsOfTemp!=null){
				editMode=1;
				request.setAttribute("editMode", editMode);
			}
			else{
				request.setAttribute("editMode", editMode);
			}
			/*String msg=projectMasterService.getDetailOfTransaction(projectId);
			
			if(msg.equals("success")){
				editMode=1;
				request.setAttribute("editMode", editMode);
			}
			else{
				request.setAttribute("editMode", editMode);
			}*/
			/*if(projectMasterModel.getStatus().equalsIgnoreCase("Ongoing")){*/ //commented by devesh on 09-08-23 to get document in financial closure
				List<DocumentTypeMasterModel> documents = docStageMappingService.getDocumentsByStageName("Project Closure");			
				request.setAttribute("documents", documents);
				//List<ProjectDocumentMasterModel> details=projectDocumentMasterService.getProjectDocumentWithDocTypeId(projectId,documents);
				List<ProjectDocumentMasterModel> details=projectDocumentMasterService.uploadedTempDocumentByProjectId(projectId,documents);
				request.setAttribute("docDetails", details);
				List<EmployeeRoleMasterModel> teamDetails = employeeRoleMasterService.getAllTeamDetailsByProject(strProjectId);
				request.setAttribute("teamDetails", teamDetails);				
			/*}*/		
			
			/*----- Set a value if project closure open from gc Dashboard [06-12-2023] --------*/
			if(projectClosureModel.getStatus()!=null && projectClosureModel.getStatus().equals("Dashboard")){
				request.setAttribute("backButtonStatus", true);
			}
			
			return "projectClosure";
		}
		
		@RequestMapping(value="projectClosure",method=RequestMethod.POST)
		public @ResponseBody boolean  projectClosurePost(HttpServletRequest request, @ModelAttribute ProjectClosureModel projectClosureModel){
			return projectMasterService.projectClosure(projectClosureModel);			
		}
		
		@RequestMapping(value="getAllCompletedProject",method=RequestMethod.GET)
		public String  getAllCompletedProject(HttpServletRequest request,ProjectMasterForm projectMasterForm){
			String returnPage="completedProject";
			if(projectMasterForm.getStartDate()==null || projectMasterForm.getStartDate().equals(""))
			{
					Calendar cal = Calendar.getInstance();
					Date endDate = cal.getTime();
					String strEndDate=DateUtils.dateToString(endDate);
					cal.add(Calendar.YEAR, -1); // to get previous year add -1
					Date startDate = cal.getTime();
					String strStartDate=DateUtils.dateToString(startDate);
					List<ProjectMasterForm> list=projectMasterService.getAllCompletedProject(strStartDate,strEndDate);
					request.setAttribute("groupProjectDetails", list);
					request.setAttribute("strStartDate", strStartDate);
					request.setAttribute("strEndDate", strEndDate);
			}
			else
			{
				String strEndDate= projectMasterForm.getEndDate();
				String strStartDate= projectMasterForm.getStartDate();
				List<ProjectMasterForm> list=projectMasterService.getAllCompletedProject(strStartDate,strEndDate);
				request.setAttribute("groupProjectDetails", list);
				request.setAttribute("strStartDate", strStartDate);
				request.setAttribute("strEndDate", strEndDate);	
			}
			return returnPage;			
		}
		
		@RequestMapping("/ViewCompletedProjectDetails")
		public String viewCompletedProjectDetails(HttpServletRequest request, ProjectMasterForm projectMasterForm){	
			String encGroupId = projectMasterForm.getEncGroupId();	
			String groupId = encryptionService.dcrypt(encGroupId);
			if(projectMasterForm.getStartDate()==null || projectMasterForm.getStartDate().equals(""))
			{
					Calendar cal = Calendar.getInstance();
					Date endDate = cal.getTime();
					String strEndDate=DateUtils.dateToString(endDate);
					cal.add(Calendar.YEAR, -1); // to get previous year add -1
					Date startDate = cal.getTime();
					String strStartDate=DateUtils.dateToString(startDate);
					List<ProjectMasterForm> list=projectMasterService.getCompletedProjectByGroup(groupId, strStartDate, strEndDate);
					request.setAttribute("data", list);
					request.setAttribute("strStartDate", strStartDate);
					request.setAttribute("strEndDate", strEndDate);
			}
			else
			{
				String strEndDate= projectMasterForm.getEndDate();
				String strStartDate= projectMasterForm.getStartDate();
				List<ProjectMasterForm> list=projectMasterService.getCompletedProjectByGroup(groupId, strStartDate, strEndDate);
				request.setAttribute("data", list);
				request.setAttribute("strStartDate", strStartDate);
				request.setAttribute("strEndDate", strEndDate);	
			}
			if(null == encGroupId){
				request.setAttribute("showWrapper", 1);
				return "ViewProjectDetails";
			}else{
				request.setAttribute("showWrapper", 0);
				request.setAttribute("closure", 1);
				return "ViewProjectDetailsWithoutHeader";
			}
			
		}
		
		@RequestMapping(value="getAllCompletedProjectByDate",method=RequestMethod.POST)
		public @ResponseBody List<ProjectMasterForm> getAllCompletedProject(@RequestParam("startDate") Date startDate,@RequestParam("endDate") Date endDate,HttpServletRequest request){
			
			SimpleDateFormat formatter = new SimpleDateFormat("yyyy/MM/dd");
			String strEndDate= formatter.format(endDate);
			String strStartDate= formatter.format(startDate);
				
			
			List<ProjectMasterForm> list=projectMasterService.getAllCompletedProject(strStartDate,strEndDate);
				
			
			return list;			
		}
		
		@RequestMapping(value="/getNewProjectsByDate", method=RequestMethod.POST)
		public @ResponseBody  long getNewProjectsByDate(ProjectMasterModel projectMasterModel ,HttpServletRequest request){
		
		Date startDate = null;
		Date endDate = null;
		String strStartDate = projectMasterModel.getStartDate();
		if(null != strStartDate && !strStartDate.equals("")){
			try {
				startDate = DateUtils.dateStrToDate(strStartDate);
			} catch (ParseException e) {				
				e.printStackTrace();
			}
		}
		String strEndDate = projectMasterModel.getEndDate();
		if(null != strEndDate && !strEndDate.equals("")){
			try {
				endDate = DateUtils.dateStrToDate(strEndDate);
			} catch (ParseException e) {				
				e.printStackTrace();
			}
		}		
		return projectMasterService.getNewProjectCount(startDate,endDate);	
		}
		
		@RequestMapping(value="/getNewProjectsDetail", method=RequestMethod.POST)
		public @ResponseBody List<ProjectMasterModel> getNewProjectsDetail(ProjectMasterModel projectMastermodel ,HttpServletRequest request){
			List<ProjectMasterModel> newProjectList = projectMasterService.getNewProjectsDetail(projectMastermodel);
			//System.out.println("inside getNewProjectsDetail controller");
			//System.out.println(newProjectList);
			request.setAttribute("newProjectList", newProjectList);	
			
			return newProjectList;		
		}
		
		
		// Count no of Closed Projects till date
		@RequestMapping(value="/getClosedProjectsByDate", method=RequestMethod.POST)
		public @ResponseBody  long getClosedProjectsByDate(ProjectMasterModel projectMasterModel ,HttpServletRequest request){
		
		Date startDate = null;
		Date endDate = null;
		String strStartDate = projectMasterModel.getStartDate();
		if(null != strStartDate && !strStartDate.equals("")){
			try {
				startDate = DateUtils.dateStrToDate(strStartDate);
			} catch (ParseException e) {				
				e.printStackTrace();
			}
		}
		String strEndDate = projectMasterModel.getEndDate();
		if(null != strEndDate && !strEndDate.equals("")){
			try {
				endDate = DateUtils.dateStrToDate(strEndDate);
			} catch (ParseException e) {				
				e.printStackTrace();
			}
		}		
		return projectMasterService.getClosedProjectCount(startDate,endDate);	
		}
		//End of Closed Projects
		
		
		@RequestMapping(value="/getAllClosedProjectByDate", method=RequestMethod.POST)
		public @ResponseBody List<ProjectMasterModel> getAllClosedProjectByDate(ProjectMasterModel projectMastermodel ,HttpServletRequest request){
			List<ProjectMasterModel> closedProjectList = projectMasterService.getClosedProjectsDetail(projectMastermodel);
			//System.out.println("inside getNewProjectsDetail controller");
			//System.out.println(closedProjectList);
			request.setAttribute("closedProjectList", closedProjectList);	
			
			return closedProjectList;		
		}
		
		@RequestMapping(value="/getProjectIdByApplicationId",method=RequestMethod.POST)	
		@ResponseBody
		public String getProjectIdByApplicationId(@ModelAttribute("projectMasterForm") ProjectMasterForm projectMasterForm ,HttpServletRequest request){			
			return  projectMasterService.getProjectIdByApplicationId(projectMasterForm);
		}
		
		@RequestMapping(value="/checkProjectDate",method=RequestMethod.POST)	
		@ResponseBody
		public int checkProjectDate(@ModelAttribute("projectMasterForm") ProjectMasterForm projectMasterForm ,HttpServletRequest request,RedirectAttributes redirectAttributes){		
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			UserInfo userInfo = (UserInfo) authentication.getPrincipal();
			if(userInfo.getSelectedEmployeeRole()!=null)
			{
				int selectedRoleId = userInfo.getSelectedEmployeeRole().getNumRoleId();
				if(selectedRoleId!=5 && selectedRoleId != 6 && selectedRoleId != 9)
				{
					projectMasterService.checkProjectDate(projectMasterForm);
				}
				
			}
			return 1;
			//int domain = projectMasterService.checkProjectDate(projectMasterForm);
			
		}
		
		@RequestMapping(value="/getPendingClosureDetail", method=RequestMethod.POST)
		public @ResponseBody List<ProjectMasterForm> getPendingClosureDetail(ProjectMasterModel projectMasterModel ,HttpServletRequest request){
			List<ProjectMasterForm> projectMasterModelList = projectMasterService.getPendingClosureDetail();
			request.setAttribute("pendingInvoiceList", projectMasterModelList);	
			
			return projectMasterModelList;		
		}
		
		//Added new controller for Pending Closure Tile without closure initialized details by devesh on 17/8/23
		@RequestMapping(value="/getPendingClosureDetailforOngoing", method=RequestMethod.POST)
		public @ResponseBody List<ProjectMasterForm> getPendingClosureDetailforOngoing(ProjectMasterModel projectMasterModel ,HttpServletRequest request){
			//List<ProjectMasterForm> projectMasterModelList = projectMasterService.getPendingClosureDetailforOngoing();
			/*-------------Get All closure projects which end date elapsed but closure not initiated [29-08-2023] -----------------------------------------------------------*/ 
		    List<ProjectMasterForm> notExistingRecords = new ArrayList<>();
			try {
				List<ProjectMasterForm> closureDataList = projectMasterService.getUnderClosure();
				List<ProjectMasterForm> projectMasterModelList = projectMasterService.getPendingClosureDetail();
			    for(ProjectMasterForm pendingProject:projectMasterModelList){
			    	boolean existingFlag=false;
			    	if(closureDataList != null){
					    for (ProjectMasterForm closureProject : closureDataList) {
				            if (pendingProject.getProjectRefrenceNo().equals(closureProject.getProjectRefrenceNo()) && pendingProject.getStrProjectName().equals(closureProject.getStrProjectName())) {
				            	existingFlag=true;
				            	break;
				            }
				        }
			    	}
				    if(!existingFlag){
				    	notExistingRecords.add(pendingProject);
				    }
			    }
			} catch (Exception e) {
				e.printStackTrace();
			}
			/*------------- End of Get All closure projects which end date elapsed but closure not initiated  -----------------------------------------------------------*/ 
			return notExistingRecords;		
		}
		//End of Controller
		
		@RequestMapping(value="/getProjectStartDate", method=RequestMethod.POST)
		public @ResponseBody String getProjectStartDate(ProjectMasterModel projectMasterModel ,HttpServletRequest request){
			long projectId =0;
			String strProjectId = encryptionService.dcrypt(projectMasterModel.getEncProjectId());
			try{
				projectId = Long.parseLong(strProjectId);
			}catch(Exception e){
				e.printStackTrace();
			}
			ProjectMasterForm projectMasterForm = projectMasterService.getProjectDetailByProjectId(projectId);			
			return projectMasterForm.getStartDate();		
		}
		
		
		@RequestMapping(value="/getAllClosedProjectByGroup", method=RequestMethod.POST)
		public @ResponseBody List<ProjectMasterModel> getAllClosedProjectByGroup(ProjectMasterModel projectMastermodel ,HttpServletRequest request){
			List<ProjectMasterModel> closedProjectList = projectMasterService.getAllClosedProjectByGroup(projectMastermodel);
			//System.out.println("inside getNewProjectsDetail controller");
			//System.out.println(closedProjectList);
			request.setAttribute("closedProjectList", closedProjectList);	
			
			return closedProjectList;		
		}
		
		@RequestMapping(value="/getNewProjectsByGroupDetail", method=RequestMethod.POST)
		public @ResponseBody List<ProjectMasterModel> getNewProjectsByGroupDetail(ProjectMasterModel projectMastermodel ,HttpServletRequest request){
			List<ProjectMasterModel> newProjectList = projectMasterService.getNewProjectsByGroupDetail(projectMastermodel);

			request.setAttribute("newProjectList", newProjectList);	
			
			return newProjectList;		
		}
		
		@RequestMapping(value="/getPendingClosureDetailByDate", method=RequestMethod.POST)
		public @ResponseBody List<ProjectMasterForm> getPendingClosureDetailByDate(@RequestParam("closureDate") String closureDate,@RequestParam("symbol") String symbol,ProjectMasterModel projectMasterModel ,HttpServletRequest request){
			List<ProjectMasterForm> projectMasterModelList = projectMasterService.getPendingClosureDetailByDate(closureDate,symbol);
			request.setAttribute("pendingInvoiceList", projectMasterModelList);	
			
			return projectMasterModelList;		
		}
		
		//Added new controller for Pending Closure Tile without closure initialized details by devesh on 17/8/23
		@RequestMapping(value="/getPendingClosureDetailByDateforOngoing", method=RequestMethod.POST)
		public @ResponseBody List<ProjectMasterForm> getPendingClosureDetailByDateforOngoing(@RequestParam("closureDate") String closureDate,@RequestParam("symbol") String symbol,ProjectMasterModel projectMasterModel ,HttpServletRequest request){
			//List<ProjectMasterForm> projectMasterModelList = projectMasterService.getPendingClosureDetailByDateforOngoing(closureDate,symbol);
			/*-------------Get All closure projects which end date elapsed but closure not initiated  [29-08-2023] -----------------------------------------------------------*/ 
		    List<ProjectMasterForm> notExistingRecords = new ArrayList<>();
			try {
				List<ProjectMasterForm> closureDataList = projectMasterService.getUnderClosure();
				List<ProjectMasterForm> projectMasterModelList = projectMasterService.getPendingClosureDetailByDate(closureDate,symbol);
			    for(ProjectMasterForm pendingProject:projectMasterModelList){
			    	boolean existingFlag=false;
			    	if(closureDataList != null){
					    for (ProjectMasterForm closureProject : closureDataList) {
				            if (pendingProject.getProjectRefrenceNo().equals(closureProject.getProjectRefrenceNo()) && pendingProject.getStrProjectName().equals(closureProject.getStrProjectName())) {
				            	existingFlag=true;
				            	break;
				            }
				        }
			    	}
				    if(!existingFlag){
				    	notExistingRecords.add(pendingProject);
				    }
			    }
			} catch (Exception e) {
				e.printStackTrace();
			}
			/*------------- End of Get All closure projects which end date elapsed but closure not initiated  -----------------------------------------------------------*/ 
			
			request.setAttribute("pendingInvoiceList", notExistingRecords);	
			return notExistingRecords;		
		}
		//End of Controller
		
		@RequestMapping(value="/updateProjectDetails",method=RequestMethod.POST)	
		@ResponseBody
		public String updateProjectDetails(@RequestParam("encProjectId") String encProjectId,@RequestParam("selectedVal") int selectedVal,@ModelAttribute("projectMasterForm") ProjectMasterForm projectMasterForm ,HttpServletRequest request,RedirectAttributes redirectAttributes){		
			ProjectMasterDomain domain = projectMasterService.saveProjectDetails(encProjectId,selectedVal);
			return "Done";
		}
		
		@RequestMapping("/underApprovalProjects")
		public String getUnderApprovalProjects(HttpServletRequest request, ProjectMasterForm projectMasterForm){		
			List<ProjectMasterForm> list = projectMasterService.getUnderApprovalProjects();
			request.setAttribute("data", list);	
	 	    /*-------------------------- Check Project Team contains HOD or not [ 27/07/2023 added by_Anuj ] -------------------------------------------------*/	
			List<Boolean> HODStatus = new ArrayList<>();
			for(ProjectMasterForm project1 : list){
				List<Object[]> allocatedEmployees = employeeRoleMasterDao.projectTeamWiseEmployees(project1.getProjectId(),0);
				Boolean show=false;
				for(Object[] a:allocatedEmployees){
					if(a[8].equals("Head of Department")){
						show=true;
						break;
					}
				}
				HODStatus.add(show);
			}
			request.setAttribute("HODStatus", HODStatus);
	 		/*-------------------------- End Check Project Team contains HOD or not -------------------------------------------------*/	
			String encWorkflowId = encryptionService.encrypt("3");	
			request.setAttribute("encWorkflowId",encWorkflowId);
			return "underApprovalProjects";
		}
		
		@RequestMapping("/previewProject")
		public String previewProject(HttpServletRequest request, ProjectMasterForm projectMasterForm,Model map){		
			Map md = map.asMap();
			int projectId=0;
			
			if(null != request.getParameter("encProjectId")){
				try{
				String encProjectId = request.getParameter("encProjectId");
				String strProjectId = encryptionService.dcrypt(encProjectId);
				projectId = Integer.parseInt(strProjectId);
				}catch(Exception e){
					e.printStackTrace();
				}
			}
			
		      if(md.get("projectId")!=null){
		    	  projectId=Integer.parseInt(md.get("projectId").toString());
		      }
		  	List<ProjectDocumentMasterModel> projectDocument = projectDocumentMasterService.uploadedDocumentByProjectId(projectId);		
			request.setAttribute("projectDocument", projectDocument);
				
			List<ManpowerRequirementModel> manpowerRequirement = manpowerRequirementService.getAllManpowerRequirement(projectId);
			request.setAttribute("manpowerRequirement", manpowerRequirement);
			
			List<ProjectPaymentScheduleMasterModel> paymentScheduleList=	projectPaymentScheduleMasterService.getProjectPaymentScheduleByProjectId(projectId);
			request.setAttribute("paymentScheduleList", paymentScheduleList);
			
			List<ProjectMilestoneForm> milestoneDetails = projectMilestoneService.getMilestoneByProjectId(projectId);
			request.setAttribute("milestoneDetails", milestoneDetails);
			
	 	    /*-------------------------- Check Project Team contains HOD or not [ 21/07/2023 added by_Anuj ] -------------------------------------------------*/	
			List<Object[]> allocatedEmployees = employeeRoleMasterDao.projectTeamWiseEmployees(projectId,0);
			Boolean show=false;
			for(Object[] a:allocatedEmployees){
				if(a[8].equals("Head of Department")){
					show=true;
					break;
				}
			}
			request.setAttribute("button", show);
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			UserInfo userInfo = (UserInfo) authentication.getPrincipal();
			if(userInfo.getSelectedEmployeeRole()!=null)
			{
				int selectedRoleId = userInfo.getSelectedEmployeeRole().getNumRoleId();
				request.setAttribute("currentRoleId", selectedRoleId);
			}
	 		/*-------------------------- End Check Project Team contains HOD or not -------------------------------------------------*/	
			      if(projectId>0){
			    	  ProjectMasterDomain domain=projectMasterService.getProjectMasterDataById(projectId);
			  			request.setAttribute("projectDetail", domain);			  			
			    	 	request.setAttribute("projectId", projectId);
			    	 	request.setAttribute("encProjectId", encryptionService.encrypt(""+projectId));
			      }else{		
			    	  request.setAttribute("projectId", 0);
			    	  return "redirect:/accessDenied"; 
			      }						
			

			
			return "previewProject";
		}
		@RequestMapping(value="/validateProjectDetails/{encId}",method=RequestMethod.POST)	
		@ResponseBody
		public List<String> validateProjectDetails(@PathVariable("encId") String encId,HttpServletRequest request,RedirectAttributes redirectAttributes){		
			String strProjectId = encryptionService.dcrypt(encId);
			Long projectId = Long.parseLong(strProjectId);
			List<String> finalList = new ArrayList<String>();
			List<String> basicProjectDetails = projectMasterService.validateProjectDetails(encId);
			if(basicProjectDetails.size() == 1 && basicProjectDetails.get(0).equals("-1")){
				finalList.add("Project is already Approved");
				return finalList;
			}else{
				finalList.addAll(basicProjectDetails);
			}		
			
			List<ProjectMilestoneDomain> projectMilestones = projectMilestoneService.getMilestoneDataByProjectId(projectId);
			if(null == projectMilestones){
				finalList.add("Project Milestone required");
			}else if(projectMilestones.size()==0){
				finalList.add("Project Milestone required");
			}
			
			List<ManpowerRequirementModel> manpowerRequirements = 	manpowerRequirementService.getAllManpowerRequirement(projectId);
			if(null == manpowerRequirements){
				finalList.add("Manpower Requirement required");
			}else if(manpowerRequirements.size()==0){
				finalList.add("Manpower Requirement required");
			}
			
			List<ProjectPaymentScheduleMasterModel> paymentSchedules = projectPaymentScheduleMasterService.getProjectPaymentScheduleByProjectId(projectId);
			if(null == paymentSchedules){
				finalList.add("Project Payment schedule required");
			}else if(paymentSchedules.size()==0){
				finalList.add("Project Payment schedule required");
			}
			
			if(finalList.size() == 0){
				finalList.add(projectMasterService.submitProjectDetails(projectId));
				
				if(finalList.contains("success")){
				ProjectMasterDomain projectMasterDomain =projectMasterService.getProjectMasterDataById(projectId);
				finalList.add(projectMasterDomain.getStrProjectRefNo());
				}
			}
			
			return finalList;
		}
		
		@RequestMapping(value="getDetailOfTransaction",method=RequestMethod.POST)
		public @ResponseBody String getDetailOfTransaction(@RequestParam("encProjectId") String encProjectId,HttpServletRequest request){
			
				
				String strProjectId = encryptionService.dcrypt(encProjectId);
				long projectId = Long.parseLong(strProjectId);
				String msg=projectMasterService.getDetailOfTransaction(projectId);
				return msg;
			
		}
		
		@RequestMapping(value="saveDetailsInTransaction",method=RequestMethod.POST)
		public @ResponseBody String saveDetailsInTransaction(@RequestParam("encProjectId") String encProjectId,HttpServletRequest request){
			
			
				
				String strProjectId = encryptionService.dcrypt(encProjectId);
				long projectId = Long.parseLong(strProjectId);
				String details=projectMasterService.submitProjectClosureInitiateByPL(projectId);
		
				return details;
				
			
					
		}
		
		@RequestMapping("/underClosureProjects")
		public String underClosureProjects(HttpServletRequest request, ProjectMasterForm projectMasterForm){
			try{
				
			List<ProjectMasterForm> list = projectMasterService.underClosureProjects();
			if(list!=null){
				//Added 18/09/23 to Check Project Team contains HOD or not	
				List<Boolean> HODStatus = new ArrayList<>();
				for(ProjectMasterForm project1 : list){
					List<Object[]> allocatedEmployees = employeeRoleMasterDao.projectTeamWiseEmployees(project1.getProjectId(),0);
					Boolean show=false;
					for(Object[] a:allocatedEmployees){
						if(a[8].equals("Head of Department")){
							show=true;
							break;
						}
					}
					HODStatus.add(show);
				}
				request.setAttribute("HODStatus", HODStatus);
		 		//End Check Project Team contains HOD or not
			request.setAttribute("data", list);	
			}
			}
			catch(Exception e){
				e.printStackTrace();
			}
			try{
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			UserInfo userInfo = (UserInfo) authentication.getPrincipal();
			EmployeeRoleMasterModel selectedRole = userInfo.getSelectedEmployeeRole();
			if(null != selectedRole){
				int  roleId = selectedRole.getNumRoleId(); 
				request.setAttribute("roleId", roleId);
				//Added on 18-09-23 to get selectedRoleProjectId and Also check allroles are same or not in under closure page
				int selectedRoleProjectId = selectedRole.getNumProjectId();
				request.setAttribute("selectedRoleProjectId", selectedRoleProjectId);
				
				boolean allRolesAreSame = true; 
				long firstRoleId = userInfo.getEmployeeRoleList().get(0).getNumRoleId();
				for (int i = 1; i < userInfo.getEmployeeRoleList().size(); i++) {
				    EmployeeRoleMasterModel selectedRoleInformation = userInfo.getEmployeeRoleList().get(i);
				    long userOtherroleId = selectedRoleInformation.getNumRoleId();
				    if (userOtherroleId != firstRoleId) {
				        allRolesAreSame = false;
				        break; 
				    }
				}
				request.setAttribute("allRolesAreSame", allRolesAreSame);
			}
			List<ProjectMasterForm> FinancialPendingProjectDetails=projectMasterService.getAllPendingCompletedProject();
			request.setAttribute("FinancialPendingProjectDetails", FinancialPendingProjectDetails);
			request.setAttribute("flag", 1);
			}
			catch(Exception e){
				e.printStackTrace();
			}
			String encWorkflowId = encryptionService.encrypt("4");	
			request.setAttribute("encWorkflowId",encWorkflowId);
			return "underClosureProjects";
		}
		
		@RequestMapping(value="viewProjectClosure",method=RequestMethod.GET)
		public String viewProjectClosure(HttpServletRequest request,ProjectClosureModel projectClosureModel){
			
			String strProjectId = encryptionService.dcrypt(projectClosureModel.getEncProjectId());
			long projectId = Long.parseLong(strProjectId);
					
			ProjectMasterModel projectMasterModel = projectMasterService.getProjectMasterModelById(projectId);
			request.setAttribute("projectDetails", projectMasterModel);
			
			projectClosureModel = projectMasterService.getTempProjectMasterModelById(projectId);
			
			request.setAttribute("projectTempMasterDetail", projectClosureModel);
		
			
			
		
		
			/*if(projectMasterModel.getStatus().equalsIgnoreCase("Ongoing")){*/ //commented by devesh on 09-08-23 to get document in financial closure
				List<DocumentTypeMasterModel> documents = docStageMappingService.getDocumentsByStageName("Project Closure");			
				request.setAttribute("documents", documents);
				//List<ProjectDocumentMasterModel> details=projectDocumentMasterService.getProjectDocumentWithDocTypeId(projectId,documents);
				List<ProjectDocumentMasterModel> details=projectDocumentMasterService.uploadedTempDocumentByProjectId(projectId,documents);
				request.setAttribute("docDetails", details);
				List<EmployeeRoleMasterModel> teamDetails = employeeRoleMasterService.getAllTempTeamDetailsByProject(strProjectId);
				
				/*------------------- Add condition for display only unique teamDetails for view closure  [19-09-2023] -----------------------*/
				List<EmployeeRoleMasterModel> teamDetails1 = new ArrayList<>();
				Set<String> uniqueElements = new HashSet<>();
				for (EmployeeRoleMasterModel employee : teamDetails) {
				    String key = employee.getStrEmpName() + "_" +
				                 employee.getStrRoleName();
				    if (!uniqueElements.contains(key)) {
				        teamDetails1.add(employee);
				        uniqueElements.add(key);
				    }
				}
				request.setAttribute("teamDetails", teamDetails1);	
				/*------------------- END Add condition for display only unique teamDetails for view closure-----------------------*/
			/*}*/		
			
			return "viewProjectClosure";
		}
		
		@RequestMapping("/underClosureProjectsNew")
		public String underClosureProjectsNew(HttpServletRequest request, ProjectMasterForm projectMasterForm){
			try{
			List<ProjectMasterForm> list = projectMasterService.getUnderClosure();
			request.setAttribute("data", list);	
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			UserInfo userInfo = (UserInfo) authentication.getPrincipal();
			EmployeeRoleMasterModel selectedRole = userInfo.getSelectedEmployeeRole();
			if(null != selectedRole){
				int  roleId = selectedRole.getNumRoleId(); 
				request.setAttribute("roleId", roleId);
			}
			request.setAttribute("flag", 0);
			}
			catch(Exception e){
				e.printStackTrace();
			}
			String encWorkflowId = encryptionService.encrypt("4");	
			request.setAttribute("encWorkflowId",encWorkflowId);
			return "underClosureProjects";
		}
		
		@RequestMapping("/underClosureProjectsforPMO")
		public String underClosureProjectsforPMO(HttpServletRequest request, ProjectMasterForm projectMasterForm){
			try{
			List<ProjectMasterForm> list = projectMasterService.getUnderClosureforPMO();
			request.setAttribute("data", list);	
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			UserInfo userInfo = (UserInfo) authentication.getPrincipal();
			EmployeeRoleMasterModel selectedRole = userInfo.getSelectedEmployeeRole();
			if(null != selectedRole){
				int  roleId = selectedRole.getNumRoleId(); 
				request.setAttribute("roleId", roleId);
			}
			request.setAttribute("flag", 0);
			}
			catch(Exception e){
				e.printStackTrace();
			}
			String encWorkflowId = encryptionService.encrypt("4");	
			request.setAttribute("encWorkflowId",encWorkflowId);
			return "underClosureProjects";
		}
		
		@RequestMapping("/underClosureProjectsforGCFin")
		public String underClosureProjectsforGCFin(HttpServletRequest request, ProjectMasterForm projectMasterForm){
			try{
			List<ProjectMasterForm> list = projectMasterService.getUnderClosureforGCFin();
			request.setAttribute("data", list);	
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			UserInfo userInfo = (UserInfo) authentication.getPrincipal();
			EmployeeRoleMasterModel selectedRole = userInfo.getSelectedEmployeeRole();
			if(null != selectedRole){
				int  roleId = selectedRole.getNumRoleId(); 
				request.setAttribute("roleId", roleId);
			}
			request.setAttribute("flag", 0);
			}
			catch(Exception e){
				e.printStackTrace();
			}
			String encWorkflowId = encryptionService.encrypt("4");	
			request.setAttribute("encWorkflowId",encWorkflowId);
			return "underClosureProjects";
		}
		
		/*---------------------------------------  Handle Request By HOD [ 21/07/2023 added by_Anuj ]  ---------------------------------------------------------------------------*/
		@RequestMapping(value="/validateProjectDetailsHOD/{encId}",method=RequestMethod.POST)	
		@ResponseBody
		public List<String> validateProjectDetailsHOD(@PathVariable("encId") String encId,HttpServletRequest request,RedirectAttributes redirectAttributes){		
			String strProjectId = encryptionService.dcrypt(encId);
			Long projectId = Long.parseLong(strProjectId);
			List<String> finalList = new ArrayList<String>();
			List<String> basicProjectDetails = projectMasterService.validateProjectDetails(encId);
			if(basicProjectDetails.size() == 1 && basicProjectDetails.get(0).equals("-1")){
				finalList.add("Project is already Approved");
				return finalList;
			}else{
				finalList.addAll(basicProjectDetails);
			}		
			
			List<ProjectMilestoneDomain> projectMilestones = projectMilestoneService.getMilestoneDataByProjectId(projectId);
			if(null == projectMilestones){
				finalList.add("Project Milestone required");
			}else if(projectMilestones.size()==0){
				finalList.add("Project Milestone required");
			}
			
			List<ManpowerRequirementModel> manpowerRequirements = 	manpowerRequirementService.getAllManpowerRequirement(projectId);
			if(null == manpowerRequirements){
				finalList.add("Manpower Requirement required");
			}else if(manpowerRequirements.size()==0){
				finalList.add("Manpower Requirement required");
			}
			
			List<ProjectPaymentScheduleMasterModel> paymentSchedules = projectPaymentScheduleMasterService.getProjectPaymentScheduleByProjectId(projectId);
			if(null == paymentSchedules){
				finalList.add("Project Payment schedule required");
			}else if(paymentSchedules.size()==0){
				finalList.add("Project Payment schedule required");
			}
			
			if(finalList.size() == 0){
				finalList.add(projectMasterService.submitProjectDetailsbyHOD(projectId));
				
				if(finalList.contains("success")){
				ProjectMasterDomain projectMasterDomain =projectMasterService.getProjectMasterDataById(projectId);
				finalList.add(projectMasterDomain.getStrProjectRefNo());
				}
			}
			
			return finalList;
		}
		
		@RequestMapping(value="/actionProjectDetailsbyHOD/{encId}",method=RequestMethod.POST)	
		@ResponseBody
		public List<String> ProjectReferenceNumberbyHOD(@PathVariable("encId") String encId,HttpServletRequest request,RedirectAttributes redirectAttributes){		
			String strProjectId = encryptionService.dcrypt(encId);
			Long projectId = Long.parseLong(strProjectId);
			List<String> finalList = new ArrayList<String>();
			
			if(finalList.size() == 0){
				finalList.add(projectMasterService.ProjectReferenceNumberbyHOD(projectId));
				if(finalList.contains("success"))
				{
					ProjectMasterDomain projectMasterDomain =projectMasterService.getProjectMasterDataById(projectId);
					finalList.add(projectMasterDomain.getStrProjectRefNo());
				}
			}
			return finalList;
		}
		
		/*---------------------------------------  Handle Request By GC [ 21/07/2023 added by_Anuj ]  ---------------------------------------------------------------------------*/
		@RequestMapping(value="/validateProjectDetailsPMO/{encId}",method=RequestMethod.POST)	
		@ResponseBody
		public List<String> validateProjectDetailsPMO(@PathVariable("encId") String encId,HttpServletRequest request,RedirectAttributes redirectAttributes){		
			String strProjectId = encryptionService.dcrypt(encId);
			Long projectId = Long.parseLong(strProjectId);
			List<String> finalList = new ArrayList<String>();
			List<String> basicProjectDetails = projectMasterService.validateProjectDetails(encId);
			if(basicProjectDetails.size() == 1 && basicProjectDetails.get(0).equals("-1")){
				finalList.add("Project is already Approved");
				return finalList;
			}else{
				finalList.addAll(basicProjectDetails);
			}		
			
			List<ProjectMilestoneDomain> projectMilestones = projectMilestoneService.getMilestoneDataByProjectId(projectId);
			if(null == projectMilestones){
				finalList.add("Project Milestone required");
			}else if(projectMilestones.size()==0){
				finalList.add("Project Milestone required");
			}
			
			List<ManpowerRequirementModel> manpowerRequirements = 	manpowerRequirementService.getAllManpowerRequirement(projectId);
			if(null == manpowerRequirements){
				finalList.add("Manpower Requirement required");
			}else if(manpowerRequirements.size()==0){
				finalList.add("Manpower Requirement required");
			}
			
			List<ProjectPaymentScheduleMasterModel> paymentSchedules = projectPaymentScheduleMasterService.getProjectPaymentScheduleByProjectId(projectId);
			if(null == paymentSchedules){
				finalList.add("Project Payment schedule required");
			}else if(paymentSchedules.size()==0){
				finalList.add("Project Payment schedule required");
			}
			
			if(finalList.size() == 0){
				finalList.add(projectMasterService.submitProjectDetailsbyGC(projectId));
				
				if(finalList.contains("success")){
				ProjectMasterDomain projectMasterDomain =projectMasterService.getProjectMasterDataById(projectId);
				finalList.add(projectMasterDomain.getStrProjectRefNo());
				}
			}
			
			return finalList;
		}
		
		/*-------------------- View Closure Project Details When Click action from dashboard [21-09-2023] ------------------------------*/
		@RequestMapping(value="/viewProjectClosureDetailFromDashboard/{encId}",method=RequestMethod.POST)	
		@ResponseBody
		public Map<String, Object> ViewProjectClosureDetailFromDashboard(@PathVariable("encId") String encId,HttpServletRequest request,RedirectAttributes redirectAttributes){		
			Map<String,Object> response = new HashMap<>();
			String strProjectId = encryptionService.dcrypt(encId);
			Long projectId = Long.parseLong(strProjectId);
			ProjectClosureModel projectClosureModel = projectMasterService.getTempProjectMasterModelById(projectId);
			ProjectMasterModel projectMasterModel = projectMasterService.getProjectMasterModelById(projectId);
			List<DocumentTypeMasterModel> documents = docStageMappingService.getDocumentsByStageName("Project Closure");			
			List<ProjectDocumentMasterModel> details=projectDocumentMasterService.uploadedTempDocumentByProjectId(projectId,documents);
			List<EmployeeRoleMasterModel> teamDetails = employeeRoleMasterService.getAllTempTeamDetailsByProject(strProjectId);
			/*------------------- Add condition for display only unique teamDetails for view closure  [20-09-2023] -----------------------*/
			List<EmployeeRoleMasterModel> teamDetails1 = new ArrayList<>();
			Set<String> uniqueElements = new HashSet<>();
			for (EmployeeRoleMasterModel employee : teamDetails) {
			    String key = employee.getStrEmpName() + "_" +
			                 employee.getStrRoleName();
			    if (!uniqueElements.contains(key)) {
			        teamDetails1.add(employee);
			        uniqueElements.add(key);
			    }
			}
			/*------------------- END Add condition for display only unique teamDetails for view closure-----------------------*/
		    response.put("documents", documents);
		    response.put("details", details);
		    response.put("teamDetails", teamDetails1);
		    response.put("projectTempMasterDetail",projectClosureModel);
		    response.put("projectDetails",projectMasterModel);
		    return response;
		}
		/*-------------------- EOF Closure Project Details [20-09-2023] ------------------------------*/
		
		/*-------------------- Get The Closure Request Tile Table Data for GC Dashboard [26-09-2023] ------------------------------*/
		@RequestMapping(value="/getClosureRequestTileData",method=RequestMethod.POST)	
		@ResponseBody
		public Map<String, Object> getClosureRequestTileData(HttpServletRequest request,RedirectAttributes redirectAttributes){	
				Map<String,Object> response = new HashMap<>();
				List<ProjectMasterForm> underClosureProjects2 = projectMasterService.getUnderClosure();
				/*------------- Remove the projects from the closure request if GC send to PMO [12-10-2023]-------------------*/
				List<ProjectMasterForm> underClosureProjects1 = new ArrayList<>();
				if(underClosureProjects2 != null)
				{
					for(ProjectMasterForm getunderClosureProject:underClosureProjects2){
						if(!"Accepted and Sent to PMO".equals(getunderClosureProject.getWorkflowModel().getStrActionPerformed()))
						{
							underClosureProjects1.add(getunderClosureProject);
						}
					}
				}
				/*------------- END Remove the projects from the closure request if GC send to PMO [12-10-2023]-------------------*/
				int underClosureCount = (underClosureProjects1 != null) ? underClosureProjects1.size() : 0;
				if(underClosureProjects1!=null){
					List<ProjectMasterForm> underClosureProjects = new ArrayList<>();
					List<Boolean> HODStatus = new ArrayList<>();
					for(ProjectMasterForm getunderClosureProject:underClosureProjects1){
						ProjectClosureModel projectClosureModel = projectMasterService.getTempProjectMasterModelById(getunderClosureProject.getProjectId());
						getunderClosureProject.setStrProjectRemarks(projectClosureModel.getClosureRemark());
						getunderClosureProject.setClosureDate(projectClosureModel.getClosureDate());
						underClosureProjects.add(getunderClosureProject);
						List<Object[]> allocatedEmployees = employeeRoleMasterDao.projectTeamWiseEmployees(getunderClosureProject.getProjectId(),0);
						Boolean show=false;
						for(Object[] a:allocatedEmployees){
							if(a[8].equals("Head of Department")){
								show=true;
								break;
							}
						}
						HODStatus.add(show);
					}
					response.put("underClosureCount1", underClosureProjects);
				    response.put("HODStatus", HODStatus);
				}
				response.put("underClosureCount",underClosureCount);
				ProjectMasterModel projectMasterModel = new ProjectMasterModel(); 
		        HttpServletRequest TempRequest = null;
		        List<ProjectMasterForm> result = getPendingClosureDetailforOngoing(projectMasterModel,TempRequest);
		        int technicalClosurePendingCount = result.size();
		        response.put("TechnicalClosurePendingCount",technicalClosurePendingCount);
				try {
					List<ProjectMasterForm> closureDataList = projectMasterService.underClosureProjectsList();
					if (closureDataList != null) {
						response.put("closureData", closureDataList);
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
				return response;
		/*-------------------- EOF Closure Project Details [20-09-2023] ------------------------------*/		
	}
		
		/*-------------------- Get The Closure Request Tile Table Data for PMO Dashboard [13-10-2023] ------------------------------*/
		@RequestMapping(value="/getClosureRequestTileDataPMO",method=RequestMethod.POST)	
		@ResponseBody
		public Map<String, Object> getClosureRequestTileDataPMO(HttpServletRequest request,RedirectAttributes redirectAttributes){	
				Map<String,Object> response = new HashMap<>();
				List<ProjectMasterForm> underClosureProjectsPMO = projectMasterService.getUnderClosureforPMO();
				int underClosureProjectCount = (underClosureProjectsPMO != null) ? underClosureProjectsPMO.size() : 0;
				if(underClosureProjectsPMO!=null){
					List<ProjectMasterForm> underClosureProjects = new ArrayList<>();
					List<Boolean> HODStatus = new ArrayList<>();
					for(ProjectMasterForm getunderClosureProject:underClosureProjectsPMO){
						ProjectClosureModel projectClosureModel = projectMasterService.getTempProjectMasterModelById(getunderClosureProject.getProjectId());
						getunderClosureProject.setStrProjectRemarks(projectClosureModel.getClosureRemark());
						getunderClosureProject.setClosureDate(projectClosureModel.getClosureDate());
						underClosureProjects.add(getunderClosureProject);
						List<Object[]> allocatedEmployees = employeeRoleMasterDao.projectTeamWiseEmployees(getunderClosureProject.getProjectId(),0);
						Boolean show=false;
						for(Object[] a:allocatedEmployees){
							if(a[8].equals("Head of Department")){
								show=true;
								break;
							}
						}
						HODStatus.add(show);
					}
					response.put("HODStatus", HODStatus);
					//Bhavesh(16-08-23) 
					response.put("underClosureCountPMO",underClosureProjectsPMO);
					//Bhavesh(16-08-23)
				}
				response.put("underClosureProjectCount",underClosureProjectCount);
				ProjectMasterModel projectMasterModel = new ProjectMasterModel(); 
		        HttpServletRequest TempRequest = null;
		        List<ProjectMasterForm> result = projectMasterService.getPendingClosureDetail();
		        int technicalClosurePendingCount = result.size();
		        response.put("TechnicalClosurePendingCount",technicalClosurePendingCount);
				try {
					List<ProjectMasterForm> closureDataList = projectMasterService.underClosureProjectsList();
					if (closureDataList != null) {
						response.put("closureData", closureDataList);
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
				return response;
		/*-------------------- EOF Closure Project Details [20-09-2023] ------------------------------*/		
	}

	/*------------- Get All Financial Closure Pending Projects [12-10-2023]-------------------*/	
	@RequestMapping(value="/getAllFinancialClosurePendingProjectByDate", method=RequestMethod.POST)
	public @ResponseBody List<ProjectMasterForm> getAllFinancialClosurePendingProjectByDate(ProjectMasterForm projectMastermodel ,HttpServletRequest request){
		List<ProjectMasterForm> closedProjectList1 = projectMasterService.getAllFinancialClosurePendingProjectByDate(projectMastermodel);
		/*---------- Get All Data of Project Closure Request Tile [06-12-2023] ------------*/
		List<ProjectMasterForm> underClosureProjects2 = projectMasterService.getUnderClosure();
		List<ProjectMasterForm> underClosureProjects = new ArrayList<>();
		if(underClosureProjects2 != null)
		{
			for(ProjectMasterForm getunderClosureProject:underClosureProjects2){
				if(!"Accepted and Sent to PMO".equals(getunderClosureProject.getWorkflowModel().getStrActionPerformed()))
				{
					underClosureProjects.add(getunderClosureProject);
				}
			}
		}

		/*---------- Remove project from closedProjectList if it exists in the underClosureProjects List [06-12-2023] ------------*/
		List<ProjectMasterForm> closedProjectList = new ArrayList<>();
		for(ProjectMasterForm getClosedProject:closedProjectList1){
			boolean notExists = false;
			for(ProjectMasterForm getUnderClosureProject:underClosureProjects2){
				if(getClosedProject.getProjectId()!=getUnderClosureProject.getProjectId()){
					notExists = true;
					break;
				}
			}
			if(notExists){
				closedProjectList.add(getClosedProject);
			}
		}
		
		return closedProjectList;		
	}
	/*------------- Get All Financial Closure Pending Projects [12-10-2023]-------------------*/
}
	