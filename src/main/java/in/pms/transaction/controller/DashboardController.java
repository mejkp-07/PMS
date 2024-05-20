package in.pms.transaction.controller;

import in.pms.global.misc.ResourceBundleFile;
import in.pms.global.service.EncryptionService;
import in.pms.global.util.CurrencyUtils;
import in.pms.global.util.DateUtils;
import in.pms.login.util.UserInfo;
import in.pms.master.dao.EmployeeRoleMasterDao;
import in.pms.master.model.EmployeeMasterModel;
import in.pms.master.model.EmployeeRoleMasterModel;
import in.pms.master.model.GroupMasterModel;
import in.pms.master.model.ProjectClosureModel;
import in.pms.master.model.ProjectInvoiceMasterModel;
import in.pms.master.model.ProjectMasterForm;
import in.pms.master.model.ProjectMasterModel;
import in.pms.master.model.ProjectMilestoneForm;
import in.pms.master.model.ProjectPaymentScheduleMasterModel;
import in.pms.master.model.ProposalMasterModel;
import in.pms.master.service.BusinessTypeService;
import in.pms.master.service.EmpTypeMasterService;
import in.pms.master.service.EmployeeMasterService;
import in.pms.master.service.EmployeeRoleMasterService;
import in.pms.master.service.GroupMasterService;
import in.pms.master.service.ProjectInvoiceMasterService;
import in.pms.master.service.ProjectMasterService;
import in.pms.master.service.ProjectMilestoneService;
import in.pms.master.service.ProjectPaymentReceivedService;
import in.pms.master.service.ProjectPaymentScheduleMasterService;
import in.pms.master.service.ProposalMasterService;
import in.pms.transaction.model.BudgetHeadMasterForm;
import in.pms.transaction.model.DashboardModel;
import in.pms.transaction.model.MiscDataModel;
import in.pms.transaction.service.DashboardService;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ibm.icu.text.SimpleDateFormat;

@Controller
public class DashboardController {
	
	@Autowired
	DashboardService dashboardService;
	
	@Autowired
	GroupMasterService groupMasterService;
	
	@Autowired
	BusinessTypeService businessTypeService;
	
	@Autowired
	ProjectMasterService projectMasterService;
	
	@Autowired
	EmployeeMasterService employeeMasterService;
	
	@Autowired
	EmpTypeMasterService empTypeMasterService;
	
	@Autowired
	ProjectPaymentReceivedService projectPaymentReceivedService;
	
	@Autowired
	EmployeeRoleMasterService employeeRoleMasterService;
	
	@Autowired
	ProjectInvoiceMasterService projectInvoiceMasterService;
	
	@Autowired
	EncryptionService encryptionService;
	
	@Autowired
	ProposalMasterService proposalMasterService;
	@Autowired
	ProjectMilestoneService projectMilestoneService;
	@Autowired
	ProjectPaymentScheduleMasterService projectPaymentScheduleMasterService;
	
	@Autowired 
	EmployeeRoleMasterDao employeeRoleMasterDao;
	
	@RequestMapping("/dashboard")
	public String dashboard(HttpServletRequest request, BudgetHeadMasterForm budgetHeadMasterForm){
		
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		UserInfo userInfo = (UserInfo) authentication.getPrincipal();
		EmployeeRoleMasterModel defaultRole =  userInfo.getDefaultEmployeeRole();
		EmployeeRoleMasterModel selectedRole = userInfo.getSelectedEmployeeRole();
		/*------- Get Current date--------------*/
		request.setAttribute("sysDate",new Date());
		/*----------------------*/
		if(null == selectedRole ){
			selectedRole =  defaultRole;
		}	
		
		if(selectedRole.getNumRoleId() == 0){
			//Redirect to basic Dashboard		
			return "dashboard";
		}else{
			//Role Specific Dashboard			
			Calendar calendar = Calendar.getInstance();
	    	int currentYear = calendar.get(Calendar.YEAR);
	    	Date calendarStartRange = null;
	    	String calendarStart="";
	    	String calendarEnd="";
			try {
				calendarStartRange = DateUtils.dateStrToDate("01/01/"+currentYear);
				calendarStart = "01/01/"+currentYear;
				calendarEnd = "31/12/"+currentYear;
				request.setAttribute("startRange", DateUtils.dateToString(calendarStartRange));
			} catch (ParseException e) {		
				e.printStackTrace();
			}
			Date calendarEndRange = new Date();
			
			Calendar calendarfinance = Calendar.getInstance();
			int currentfinanceMonth = calendarfinance.get(Calendar.MONTH);			
			int currentfinanceYear = calendarfinance.get(Calendar.YEAR);
			int lastfinanceYear = calendarfinance.get(Calendar.YEAR)-1;
			int nextFinanceYear = calendarfinance.get(Calendar.YEAR)+1;
			String strFinanceStart = "01/04/";
			String strFinanceEnd = "31/03/";
			
			String financeStart="";
			String financeEnd="";
			
			String financialYear ="";
			
			Date startRangeFinance = null;
			Date endRangeFinance = null;
			
			if(currentfinanceMonth<=2){			
				try {				
					startRangeFinance = DateUtils.dateStrToDate(strFinanceStart+lastfinanceYear);	
					endRangeFinance = DateUtils.dateStrToDate(strFinanceEnd+currentfinanceYear);
					financeStart =strFinanceStart+lastfinanceYear;
					financeEnd = strFinanceEnd+currentfinanceYear;
					financialYear = (currentYear-1) +"-"+currentYear;
				} catch (ParseException e) {				
					e.printStackTrace();
				}
				
			}else{			
				try {				
					startRangeFinance = DateUtils.dateStrToDate(strFinanceStart+currentfinanceYear);	
					endRangeFinance = DateUtils.dateStrToDate(strFinanceEnd+nextFinanceYear);
					financeStart =strFinanceStart+currentfinanceYear;
					financeEnd = strFinanceEnd+nextFinanceYear;
					financialYear = (currentYear) +"-"+(currentYear+1);
				} catch (ParseException e) {				
					e.printStackTrace();
				}
			}
			
			int roleId = selectedRole.getNumRoleId();
			int assignedOrganisation = selectedRole.getNumOrganisationId();
			String assignedProject = ""+selectedRole.getNumProjectId();
			String assignedGroups = ""+selectedRole.getNumGroupId();
			
			//Commented by devesh on 31-08-23 to fix ongoing projects count
			/*long projectCount = dashboardService.getAllOngoingProjectCount();		
			request.setAttribute("projectCount", projectCount);*/
			
			 List<ProjectMasterForm> list1 =projectMasterService.getAllProjectDetails();
			 
			//Added by devesh on 31/08/23 to fix ongoing projects count on PL Dashboard tile
			 request.setAttribute("projectCount", list1.size());
			 
			 //Bhavesh get the list size
			 request.setAttribute("groupProjectDetails1", list1.size());
			
			if(roleId == 7){
				String income =  projectPaymentReceivedService.getIncome(startRangeFinance,endRangeFinance);		
				request.setAttribute("income", income);
				
				String expenditure = dashboardService.getExpenditure(startRangeFinance);
				request.setAttribute("expenditure", expenditure);
				request.setAttribute("startDate", financeStart);
				
				double projectRevenue = projectPaymentScheduleMasterService.getTotalProjectsRevenue(startRangeFinance,endRangeFinance);
				request.setAttribute("projectRevenue", CurrencyUtils.convertToINR(projectRevenue));
				request.setAttribute("financialYear", financialYear);
				
				
				request.setAttribute("startDate", financeStart);
				
			}else{
				String income =  projectPaymentReceivedService.getIncome(calendarStartRange,calendarEndRange);		
				request.setAttribute("income", income);
				
				String expenditure = dashboardService.getExpenditure(calendarStartRange);
				request.setAttribute("expenditure", expenditure);
				request.setAttribute("startDate", calendarStart);
				
				double projectRevenue = projectPaymentScheduleMasterService.getTotalProjectsRevenue(calendarStartRange,calendarEndRange);
				request.setAttribute("projectRevenue", CurrencyUtils.convertToINR(projectRevenue));
				request.setAttribute("financialYear", financialYear);
			
				request.setAttribute("startDate", calendarStart);		
				
			}
			
			if(roleId == 3 || roleId == 4 || roleId == 5 || roleId == 6 ||  roleId==7 || roleId==9){
				
				double ongoingProjectCost = dashboardService.getTotalOngoingProjectsCost();
				request.setAttribute("ongoingProjectCost", CurrencyUtils.convertToINR(ongoingProjectCost));
			// Get Total outlay share on 22/05/2023
				double cdaccost = dashboardService.getCDACoutlay();
				request.setAttribute("cdaccost", CurrencyUtils.convertToINR(cdaccost));
			//
				//First table to fetch group-wise total projects and cost
				List<DashboardModel>  countProjects = dashboardService.getProjectCountandCostByGroup();				
				request.setAttribute("countProjects", countProjects);
				
			}
			
			if(roleId == 5 || roleId == 6 || roleId==7 || roleId == 8 || roleId==9 ){
				JSONArray employmentTypeWiseCount = employeeMasterService.getEmployeeCountByEmployementType();
				request.setAttribute("employmentTypeWiseCount", employmentTypeWiseCount);
				
				//added by devesh on 9/6/23
				JSONArray deputedWiseCount = employeeMasterService.getdeputedwiseEmployeeCount();
				request.setAttribute("deputedWiseCount", deputedWiseCount);
				//end
				
				Map<String,List> employeeCountByGroupandDesignation = employeeMasterService.getEmployeeCountByGroupandDesignation();
				request.setAttribute("employeeCountByGroupandDesignation", employeeCountByGroupandDesignation);
				
				/*JSONArray employmentTypeWiseCountNew = employeeMasterService.getEmployeeCountByEmployementType();
				request.setAttribute("employmentTypeWiseCountNew", employmentTypeWiseCountNew);
				Map<String,List> employeeCountByGroupandDesignationNew = employeeMasterService.getEmployeeCountByGroupandDesignation();
				request.setAttribute("employeeCountByGroupandDesignationNew", employeeCountByGroupandDesignationNew);*/
				
				request.setAttribute("employeeWithInvolvement",employeeMasterService.employeeDetailsWithInvolvements());
				
			
			}
			/*---------------------- Add the HOD Role id(15) [21-09-2023] --------------------------------*/
			if(roleId == 3 || roleId == 4 || roleId==5 || roleId==6  ||  roleId==7 ||roleId==8 || roleId == 9 || roleId == 15){
									
				
				long newProjectCount = projectMasterService.getNewProjectCount(calendarStartRange, calendarEndRange);		
				request.setAttribute("newProjectCount", newProjectCount);
				
				long closedProjectsCount = projectMasterService.getClosedProjectCount(calendarStartRange, calendarEndRange);		
				request.setAttribute("closedProjectsCount", closedProjectsCount);
				
				ProjectInvoiceMasterModel projectInvoiceMasterModel=new  ProjectInvoiceMasterModel();
				List<ProjectInvoiceMasterModel> pendingPaymentsList = projectInvoiceMasterService.getPendingPaymentsInvoiceDetail(projectInvoiceMasterModel);
				if(pendingPaymentsList.size()>0){
					request.setAttribute("paymentPendingCount", pendingPaymentsList.size());
					double totalAmount=0.0;
					for(int i=0;i<pendingPaymentsList.size();i++){
						totalAmount =totalAmount+pendingPaymentsList.get(i).getNumInvoiceTotalAmt();
					}
					Double cost = CurrencyUtils.round((totalAmount/100000),2);
					String conTotalAmount=CurrencyUtils.convertToINR(cost);
					request.setAttribute("conTotalAmount", conTotalAmount);
				}
				List<ProjectPaymentScheduleMasterModel> invoicesPendingCount = projectInvoiceMasterService.getPendingInvoiceDetail();		
				request.setAttribute("invoicesPendingCount", invoicesPendingCount.size());
				if(invoicesPendingCount.size()>0){
					double dueTotalAmount=0;
					for(int i=0;i<invoicesPendingCount.size();i++){
						dueTotalAmount =dueTotalAmount+invoicesPendingCount.get(i).getNumInvoiceAmtInLakhs();
					}
					String dueConTotalAmount=CurrencyUtils.convertToINR(dueTotalAmount);
					request.setAttribute("dueConTotalAmount", dueConTotalAmount);
				}
				
				List<ProjectMasterForm> pendingClosurelist = projectMasterService.getPendingClosureDetail();		
				request.setAttribute("pendingClosureCount", pendingClosurelist.size());
				
				//Added Closure/Extention pending count projects which closure is not initialized by devesh on 17/8/23
				List<ProjectMasterForm> pendingClosurelistforOngoingProjects = projectMasterService.getPendingClosureDetailforOngoing();		
				//End of Closure/Extention pending Count
				/*-------------Get Under closure projects list without role ids [29-08-2023] -----------------------------------------------------------*/ 
			    List<ProjectMasterForm> notExistingRecords = new ArrayList<>();
				try {
					List<ProjectMasterForm> closureDataList = projectMasterService.underClosureProjectsList();
					if (closureDataList != null) {
						request.setAttribute("closureData", closureDataList);
					}
					List<ProjectMasterForm> closureDataList2 = projectMasterService.getUnderClosure();  // all closure request data
					List<ProjectMasterForm> projectMasterModelList = projectMasterService.getPendingClosureDetail();
				    for(ProjectMasterForm pendingProject:projectMasterModelList){
				    	boolean existingFlag=false;
				    	/*---------------------- Condition for Handle the null pointer exception [21-09-2023] --------------------------------*/
				    	if(closureDataList2 != null){
						    for (ProjectMasterForm closureProject : closureDataList2) {
					            if (pendingProject.getProjectRefrenceNo().equals(closureProject.getProjectRefrenceNo()) && pendingProject.getStrProjectName().equals(closureProject.getStrProjectName())) {
					            	existingFlag=true;
					            	break;
					            }
					        }
				    	}
					    //Added Closure/Extention pending count projects which closure is not initialized
					    if(!existingFlag){
					    	notExistingRecords.add(pendingProject);
					    }
				    }
				} catch (Exception e) {
					e.printStackTrace();
				}
				if(roleId==5){
					request.setAttribute("pendingClosureCountforOngoing", notExistingRecords.size());
				}else{
					request.setAttribute("pendingClosureCountforOngoing", pendingClosurelistforOngoingProjects.size());
				}
				request.setAttribute("pendingClosureProjectList", pendingClosurelist);
				/*------------- End of Get Under closure projects list without role ids -----------------------------------------------------------*/ 
				
				try{
					String encWorkflowId = encryptionService.encrypt("4");	
					request.setAttribute("encWorkflowId_Closure",encWorkflowId);
					/*----------------------------Get Closure Request Tile Data For GC Dashboard [21-09-2023] ------------------------------------*/
					// add list for ed Dashboard in Finacial Closure Pending Tile [ 29-09-2023]
					if(roleId==6){
						List<ProjectMasterForm> underClosureProjects1 = projectMasterService.getUnderClosure();
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
							request.setAttribute("underClosureCount1",underClosureProjects);
							request.setAttribute("HODStatus", HODStatus);
						}
						request.setAttribute("underClosureCount",underClosureCount);
					}
					/*---------------------------- END of Get Closure Request Tile Data For GC Dashboard [21-09-2023] ------------------------------------*/
					/*----------------------------Get Closure Request Tile Data For PMO Dashboard [21-09-2023] ------------------------------------*/
                   //Bhavesh (10-10-23)give access of underClosureProjectsPMO list to roleId=5;
					if(roleId==9 || roleId==5){
						
						
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
							request.setAttribute("HODStatus", HODStatus);
							//Bhavesh(16-08-23) 
							request.setAttribute("underClosureCountPMO",underClosureProjectsPMO);
							//Bhavesh(16-08-23)
						}
						request.setAttribute("underClosureProjectCount",underClosureProjectCount);
					}
					/*---------------------------- END of Get Closure Request Tile Data For PMO Dashboard [21-09-2023] ------------------------------------*/
					/*----------------------------Get Closure Request Tile Data For GC Finance Dashboard [21-09-2023] ------------------------------------*/
					if(roleId==7){
						List<ProjectMasterForm> underClosureProjectCountForGCFIn = projectMasterService.getUnderClosureforGCFin();
						int underClosureProjectCountForGCFInCount = (underClosureProjectCountForGCFIn != null) ? underClosureProjectCountForGCFIn.size() : 0;
						if(underClosureProjectCountForGCFIn!=null){
							List<ProjectMasterForm> underClosureProjects = new ArrayList<>();
							List<Boolean> HODStatus = new ArrayList<>();
							for(ProjectMasterForm getunderClosureProject:underClosureProjectCountForGCFIn){
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
							request.setAttribute("HODStatus", HODStatus);
							request.setAttribute("underClosureProjectCountForGCFInc",underClosureProjectCountForGCFIn);
							//Bhavesh(16-08-23)
						}
						request.setAttribute("underClosureProjectCountForGCFIn",underClosureProjectCountForGCFInCount);
						//Bhavesh(16-08-23) 
					}
					/*---------------------------- END of Get Closure Request Tile Data For GC Finance Dashboard [21-09-2023] ------------------------------------*/
					//Bhavesh(22-09-23)total list of under closure project for GC Finance
					List<ProjectMasterForm> FinancialPendingProjectDetails=projectMasterService.getAllPendingCompletedProject();
					request.setAttribute("FinancialPendingProjectDetails", FinancialPendingProjectDetails);
				}
				catch(Exception e){
					e.printStackTrace();
				}
				List<ProposalMasterModel> proposalList=proposalMasterService.getActiveProposals(calendarStart, calendarEnd);
				//request.setAttribute("proposalListCount", proposalList.size());
				
				//Added by devesh 29/08/23 on to fix proposal count on new proposal tiles
				int selectedGroup = selectedRole.getNumGroupId();
				int proposalReceivedCount = 0;  // declare the variable for proposal Received [12-10-2023]
				/*---------------- Get the Count of Proposal Submitted and Project Received [12-10-2023] ------------*/
				if(selectedGroup != 0){
					// Filter out rows with the same groupName as selectedGroup
				    List<ProposalMasterModel> filteredProposals = new ArrayList<>();
				    for (ProposalMasterModel proposal : proposalList) {
				        if (proposal.getGroupName().equals(groupMasterService.getDistinctGroupsForOrganisation(Long.toString(selectedGroup)))) {
				            filteredProposals.add(proposal);
				        }
				    }
				    // Count proposals with status "yes" in the entire list
				    for (ProposalMasterModel proposal : filteredProposals) {
				        if ("yes".equalsIgnoreCase(proposal.getReceivedProjectStatus())&&(null !=proposal.getDateOfSubmission())) {
				        	proposalReceivedCount++;
				        }
				    }
				    request.setAttribute("proposalListCount", filteredProposals.size());
				}
				else{
				    // Count proposals with status "yes" in the entire list
				    for (ProposalMasterModel proposal : proposalList) {
				        if ("yes".equalsIgnoreCase(proposal.getReceivedProjectStatus())) {
				        	proposalReceivedCount++;
				        }
				    }
					request.setAttribute("proposalListCount", proposalList.size());
				}
				request.setAttribute("proposalReceivedCount", proposalReceivedCount);
				
				//Bhavesh (31-10-23) set attribute roleId1 to get Role Ids
				request.setAttribute("roleId1", roleId);
				/*---------------- END of Count of Proposal Submitted annd Project Received [12-10-2023] ------------*/
			}
			
			if(roleId==6 || roleId == 9){							
				Map<String, MiscDataModel> getallDetails = employeeMasterService.getDetails(calendarStart,calendarEnd);
					request.setAttribute("getallDetails",getallDetails);
					request.setAttribute("endRange",DateUtils.dateToString(new Date()));
			}
			
			
			if(roleId==5 || roleId==6 || roleId == 9){
				int days = 30;
				
				List<ProjectMilestoneForm> milestoneCountList = projectMilestoneService.getMilestoneReviewDetail(days);
				int countMilestone = milestoneCountList.size();			
				request.setAttribute("countMilestone", countMilestone);
				//-------------------  Add Attribute data1 for current month Milestone exceeded list [21-08-2023] -----------------------------------------------
				request.setAttribute("data1", milestoneCountList);
				
				List<EmployeeMasterModel> joinedEmp=employeeMasterService.loadJoinedEmployeeDetails(calendarStart, calendarEnd);
				request.setAttribute("listOfJoinedEmp", joinedEmp.size());
				
				List<EmployeeMasterModel> resignedEmp=employeeMasterService.loadResignedEmployeeDetails(calendarStart,calendarEnd);
				request.setAttribute("listOfResignedEmp", resignedEmp.size());
				
				List<EmployeeMasterModel> rejoinEmp=employeeMasterService.loadRejoinEmployeeDetails(calendarStart,calendarEnd);
				request.setAttribute("rejoinEmp", rejoinEmp.size());
				
				List<EmployeeMasterModel> rejoinRelievedEmp=employeeMasterService.loadRejoinRelievedEmployeeDetails(calendarStart,calendarEnd,"Relieved");
				request.setAttribute("rejoinRelievedEmp", rejoinRelievedEmp.size());
				int rejoinCount=rejoinEmp.size();
				int rejoinRelievedEmpCount=rejoinRelievedEmp.size();
				int workingEmployeeCount=rejoinCount-rejoinRelievedEmpCount;
				request.setAttribute("workingEmployeeCount", workingEmployeeCount);
				List<ProjectMilestoneForm> milestoneExceededCountList = projectMilestoneService.getMilestoneReviewDetail();
				int countExceededMilestone = milestoneExceededCountList.size();
				
				request.setAttribute("countExceededMilestone", countExceededMilestone);
				//-------------------  Add Attribute data2 for all Milestone exceeded list [21-08-2023] -----------------------------------------------
				request.setAttribute("data2", milestoneExceededCountList);	
			}			
			if(roleId == 6 || roleId==7 || roleId == 8 || roleId==9 ) {//Updated by devesh on 21/6/23 for adding designation group table for gcfinance				
				Map<String,List> employeeCountByGroupandDesignationTechnical = employeeMasterService.getEmployeeCountByGroupandDesignationTechnical();
				request.setAttribute("employeeCountByGroupandDesignationTechnical", employeeCountByGroupandDesignationTechnical);
			
				Map<String,List> employeeCountByGroupandDesignationSupport = employeeMasterService.getEmployeeCountByGroupandDesignationSupport();
				request.setAttribute("employeeCountByGroupandDesignationSupport", employeeCountByGroupandDesignationSupport);
			}
			
			 if(roleId == 5 ||roleId == 6 || roleId==7 || roleId == 8 || roleId == 9){
				 if(assignedOrganisation != 0){
						Long orgId = Long.valueOf(assignedOrganisation).longValue();		     
					    List<GroupMasterModel> groupnames =groupMasterService.getAllActiveGrpMasterDomain(orgId);
						request.setAttribute("groupnames", groupnames);
				}
			 }else if(assignedProject != null && !assignedProject.equals("0")){
					
				 List<ProjectMasterForm> list =projectMasterService.getAllProjectDetails();
					 request.setAttribute("groupProjectDetails", list);
					 
			 }else{
				 List<ProjectMasterForm> list = projectMasterService.viewProjectDetailsData(encryptionService.encrypt(assignedGroups));
				 request.setAttribute("groupProjectDetails", list);
			 }
			 
			 if(roleId==6 || roleId==7 || roleId == 9){
					
					JSONArray projectdata = dashboardService.getgroupProjectCount();
					request.setAttribute("projcountbarGraphData", projectdata);	
					 
					long employeeCount = dashboardService.getTotalActiveEmployees();		
					request.setAttribute("employeeCount", employeeCount);
					long employeeAtCDACCount = dashboardService.getActiveEmployeesAtCDAC();
					request.setAttribute("employeeAtCDACCount", employeeAtCDACCount);
					//added by devesh on 14/6/23 for deputed at client count
					long employeeAtCLIENTCount = dashboardService.getActiveEmployeesAtCLIENT();
					request.setAttribute("employeeAtCLIENTCount", employeeAtCLIENTCount);
					//End
					//request.setAttribute("employeeAtClientCount", employeeCount-employeeAtCDACCount);
					request.setAttribute("employeeAtOthersCount", employeeCount-employeeAtCDACCount-employeeAtCLIENTCount);//updated for undefined deputed employee count on 14/6/23
					JSONArray  empdata = dashboardService.getgroupEmployeeTypeEmployeeCount();
					request.setAttribute("empbarGraphData", empdata);

					JSONArray proposalGraphData = dashboardService.getgroupProposalCount();
					request.setAttribute("proposalGraphData", proposalGraphData);
				
											
					if(roleId==6){
				    return "edDashboard";
					}else if(roleId==7){
					return "gcFinanceDashboard";
					}
				 }
			 
			 if(roleId==9 || roleId==3){
				 String encPageId = encryptionService.encrypt("2");
					String encWorkflowId=encryptionService.encrypt("1");
					
					request.setAttribute("encPageId", encPageId);
					request.setAttribute("encWorkflowId",encWorkflowId);
			 }
			if(roleId==5){
				long employeeCount = dashboardService.getTotalActiveEmployees();		
				request.setAttribute("employeeCount", employeeCount);
				long employeeAtCDACCount = dashboardService.getActiveEmployeesAtCDAC();
				request.setAttribute("employeeAtCDACCount", employeeAtCDACCount);
				//added by devesh on 14/6/23 for deputed at client count
				long employeeAtCLIENTCount = dashboardService.getActiveEmployeesAtCLIENT();
				request.setAttribute("employeeAtCLIENTCount", employeeAtCLIENTCount);
				//End
				//request.setAttribute("employeeAtClientCount", employeeCount-employeeAtCDACCount);
				request.setAttribute("employeeAtOthersCount", employeeCount-employeeAtCDACCount-employeeAtCLIENTCount);//updated for undefined deputed employee count on 14/6/23

				String encPageId = encryptionService.encrypt("2");
				String encWorkflowId=encryptionService.encrypt("1");
				
				request.setAttribute("encPageId", encPageId);
				request.setAttribute("encWorkflowId",encWorkflowId);
							
				  JSONArray  empgenderdata = dashboardService.getGenderWiseEmployeeCount();
				  request.setAttribute("empgenderbarGraphData", empgenderdata);
				  
				  /*-- Trigger the Closure Request Tile If it comes from projectClosure [06-12-2023] --------*/
				  if (budgetHeadMasterForm.getShortCode() != null && budgetHeadMasterForm.getShortCode().equals("true")) {
				    request.setAttribute("openRequestTile", true); 
				  }

				  return "gcDashboard";
			  }
			    	
			 if(roleId==9){
				 
				/* JSONArray projectdata = dashboardService.getgroupProjectCount();
				 request.setAttribute("projcountbarGraphData", projectdata);	
				 
				  JSONArray  empdata = dashboardService.getgroupEmployeeTypeEmployeeCount();
				  request.setAttribute("empbarGraphData", empdata);
				

				  JSONArray proposalGraphData = dashboardService.getgroupProposalCount();
				  request.setAttribute("proposalGraphData", proposalGraphData);
				  
				  JSONArray businesstypeprojectcount = dashboardService.getProjectCountByBusinessType();		
				  request.setAttribute("businesstypeprojectcount", businesstypeprojectcount);
				  
				  JSONArray businesstypeprojectcost = dashboardService.getProjectCostByBusinessType();
				  request.setAttribute("businesstypeprojectcost", businesstypeprojectcost);
					
				  int days = 30;
				  List<ProjectMilestoneForm> milestoneCountList = projectMilestoneService.getMilestoneReviewDetail(days);
					int countMilestone = milestoneCountList.size();
				
					request.setAttribute("countMilestone", countMilestone);
					
					*/
				 
				  
				return "PMODashboard";
			  }
			    
			if(roleId==8){
				String fixDay=ResourceBundleFile.getValueFromKey("newJoineeEmployeeBeforeOneMonth");
				Date startDate=DateUtils.addDays(new Date(),Integer.parseInt(fixDay));
				request.setAttribute("startDate",DateUtils.dateToString(startDate));
				request.setAttribute("endDate",DateUtils.dateToString(new Date()));
				
				long employeeCount = dashboardService.getTotalActiveEmployees();		
				request.setAttribute("employeeCount", employeeCount);
				
				long employeeAtCDACCount = dashboardService.getActiveEmployeesAtCDAC();
				request.setAttribute("employeeAtCDACCount", employeeAtCDACCount);
				//added by devesh on 14/6/23 for deputed at client count
				long employeeAtCLIENTCount = dashboardService.getActiveEmployeesAtCLIENT();
				request.setAttribute("employeeAtCLIENTCount", employeeAtCLIENTCount);
				//End
				//request.setAttribute("employeeAtClientCount", employeeCount-employeeAtCDACCount);
				request.setAttribute("employeeAtOthersCount", employeeCount-employeeAtCDACCount-employeeAtCLIENTCount);//updated for undefined deputed employee count on 14/6/23
				
				JSONArray groupWiseEmployeeCount = employeeMasterService.getEmployeeCountByGroup();
				request.setAttribute("groupWiseEmployeeCount", groupWiseEmployeeCount);
					
				JSONArray employeesCategoryWiseCount = employeeMasterService.getEmployeeCountByCategory();
				request.setAttribute("employeesCategoryWiseCount", employeesCategoryWiseCount);
				
				JSONArray employeesYearWiseCount = employeeMasterService.getYearWiseEmployeeCount();
				request.setAttribute("employeesYearWiseCount", employeesYearWiseCount);
				
				JSONArray  empgenderdata = dashboardService.getGenderWiseEmployeeCount();
				request.setAttribute("empgenderbarGraphData", empgenderdata);
				
				List<EmployeeMasterModel> newJoineeDetails=employeeMasterService.loadJoinedEmployeeDetails(DateUtils.dateToString(startDate), DateUtils.dateToString(new Date()));
				if(newJoineeDetails.size()>0){
				request.setAttribute("NewJoineeCount",newJoineeDetails.size());
				
				}
				List<EmployeeMasterModel> resignedEmployees=employeeMasterService.loadResignedEmployeeDetails(DateUtils.dateToString(startDate), DateUtils.dateToString(new Date()));
				if(resignedEmployees.size()>0){
					request.setAttribute("resignedEmployees",resignedEmployees.size());
			}
				
				return "hrDashboard";
			 }	
			if (roleId == 3 || roleId == 4 || roleId == 2 || roleId == 15) {
				int days = 30;
				List<ProjectMilestoneForm> milestoneCountList = projectMilestoneService.getMilestoneReviewDetail(days);
				int countMilestone = milestoneCountList.size();			
				request.setAttribute("countMilestone", countMilestone);

				List<ProjectMilestoneForm> milestoneExceededCountList = projectMilestoneService.getMilestoneReviewDetail();
				int countExceededMilestone = milestoneExceededCountList.size();				
				request.setAttribute("countExceededMilestone", countExceededMilestone);
				//-------------------  Add Attribute data2 for all Milestone exceeded list [21-08-2023] -----------------------------------------------
				request.setAttribute("data2", milestoneExceededCountList);
				//-------------------  Add Attribute data1 for current month Milestone exceeded list [21-08-2023] -----------------------------------------------
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
				request.setAttribute("data1", milestoneCountList);
				return "pLDashboard";
			  }
		}
	
		
		return "dashboard";
		
	}
	
	@RequestMapping(value="/getNewProjectsDetail", method=RequestMethod.POST)
	public @ResponseBody List<ProjectMasterModel> getNewProjectsDetail(ProjectMasterModel projectMastermodel ,HttpServletRequest request){
		List<ProjectMasterModel> newProjectList = projectMasterService.getNewProjectsDetail(projectMastermodel);
		//System.out.println("inside getNewProjectsDetail controller");
		//System.out.println(newProjectList);
		request.setAttribute("newProjectList", newProjectList);	
		
		return newProjectList;		
	}
	
	
	@RequestMapping(value="/getOngoinProjectlist",method=RequestMethod.POST)
	public @ResponseBody List<DashboardModel> getOngoinProjectlist(ProjectMasterModel projectMastermodel ,HttpServletRequest request){		
		List<DashboardModel>  countProjects = dashboardService.getOngoinProjectlist(projectMastermodel);
		return countProjects;
	}
	
	@RequestMapping(value="/getEmployeelist",method=RequestMethod.POST)
	public @ResponseBody List<EmployeeMasterModel> getEmployeelist(ProjectMasterModel projectMastermodel ,HttpServletRequest request){		
		List<EmployeeMasterModel>  list = employeeMasterService.employeeDetailsWithInvolvements(projectMastermodel);
		return list;
	}

	//Added by Devesh on 13-10-23 to get last updated at status for employees
	@RequestMapping("/employeesLastUpdatedAtDate")
	 public @ResponseBody List<Object[]> getLastUpdatedAtDateForEmployees() {
	        List<Object[]> result = dashboardService.getLastUpdatedAtDateForEmployees();
	        return result;
	}
	//End of Function

	//Added by devesh on 12-10-23 to update counts on all tiles
	@RequestMapping(value="/UpdateCounts",method=RequestMethod.POST)
	public @ResponseBody Map<String, Object> UpdateCounts(HttpServletRequest request) {
	    Map<String, Object> response = new HashMap<>();
	    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		UserInfo userInfo = (UserInfo) authentication.getPrincipal();
		EmployeeRoleMasterModel defaultRole =  userInfo.getDefaultEmployeeRole();
		EmployeeRoleMasterModel selectedRole = userInfo.getSelectedEmployeeRole();
		Calendar calendar = Calendar.getInstance();
    	int currentYear = calendar.get(Calendar.YEAR);
    	Date calendarStartRange = null;
    	String calendarStart="";
    	String calendarEnd="";
		try {
			calendarStartRange = DateUtils.dateStrToDate("01/01/"+currentYear);
			calendarStart = "01/01/"+currentYear;
			calendarEnd = "31/12/"+currentYear;
			request.setAttribute("startRange", DateUtils.dateToString(calendarStartRange));
		} catch (ParseException e) {		
			e.printStackTrace();
		}
		Date calendarEndRange = new Date();
		
		Calendar calendarfinance = Calendar.getInstance();
		int currentfinanceMonth = calendarfinance.get(Calendar.MONTH);			
		int currentfinanceYear = calendarfinance.get(Calendar.YEAR);
		int lastfinanceYear = calendarfinance.get(Calendar.YEAR)-1;
		int nextFinanceYear = calendarfinance.get(Calendar.YEAR)+1;
		String strFinanceStart = "01/04/";
		String strFinanceEnd = "31/03/";
		
		String financeStart="";
		String financeEnd="";
		
		String financialYear ="";
		
		Date startRangeFinance = null;
		Date endRangeFinance = null;
		
		if(currentfinanceMonth<=2){			
			try {				
				startRangeFinance = DateUtils.dateStrToDate(strFinanceStart+lastfinanceYear);	
				endRangeFinance = DateUtils.dateStrToDate(strFinanceEnd+currentfinanceYear);
				financeStart =strFinanceStart+lastfinanceYear;
				financeEnd = strFinanceEnd+currentfinanceYear;
				financialYear = (currentYear-1) +"-"+currentYear;
			} catch (ParseException e) {				
				e.printStackTrace();
			}
			
		}else{			
			try {				
				startRangeFinance = DateUtils.dateStrToDate(strFinanceStart+currentfinanceYear);	
				endRangeFinance = DateUtils.dateStrToDate(strFinanceEnd+nextFinanceYear);
				financeStart =strFinanceStart+currentfinanceYear;
				financeEnd = strFinanceEnd+nextFinanceYear;
				financialYear = (currentYear) +"-"+(currentYear+1);
			} catch (ParseException e) {				
				e.printStackTrace();
			}
		}
		int roleId = selectedRole.getNumRoleId();
		int assignedOrganisation = selectedRole.getNumOrganisationId();
		String assignedProject = ""+selectedRole.getNumProjectId();
		String assignedGroups = ""+selectedRole.getNumGroupId();
		
		
	    // Retrieve the proposal count here and put it in the response
	    int selectedGroup = selectedRole.getNumGroupId();
	    List<ProposalMasterModel> proposalList=proposalMasterService.getActiveProposals(calendarStart, calendarEnd);
		int proposalReceivedCount = 0;  // declare the variable for proposal Received [12-10-2023]
		/*---------------- Get the Count of Proposal Submitted and Project Received [12-10-2023] ------------*/
		if(selectedGroup != 0){
		    List<ProposalMasterModel> filteredProposals = new ArrayList<>();
		    for (ProposalMasterModel proposal : proposalList) {
		        if (proposal.getGroupName().equals(groupMasterService.getDistinctGroupsForOrganisation(Long.toString(selectedGroup)))) {
		            filteredProposals.add(proposal);
		        }
		    }
		    for (ProposalMasterModel proposal : filteredProposals) {
		        if ("yes".equalsIgnoreCase(proposal.getReceivedProjectStatus())) {
		        	proposalReceivedCount++;
		        }
		    }
		    response.put("proposalListCount", filteredProposals.size());
		}
		else{
		    for (ProposalMasterModel proposal : proposalList) {
		        if ("yes".equalsIgnoreCase(proposal.getReceivedProjectStatus())) {
		        	proposalReceivedCount++;
		        }
		    }
		    response.put("proposalListCount", proposalList.size());
		}
		response.put("proposalReceivedCount", proposalReceivedCount);
		/*---------------- END of Count of Proposal Submitted annd Project Received [12-10-2023] ------------*/
		//End of Proposal Count
		
		//Closure Pending Tiles
		List<ProjectMasterForm> notExistingRecords = new ArrayList<>();
		try {
			List<ProjectMasterForm> closureDataList = projectMasterService.underClosureProjectsList();
			List<ProjectMasterForm> closureDataList2 = projectMasterService.getUnderClosure();  // all closure request data
			List<ProjectMasterForm> projectMasterModelList = projectMasterService.getPendingClosureDetail();
		    for(ProjectMasterForm pendingProject:projectMasterModelList){
		    	boolean existingFlag=false;
		    	/*---------------------- Condition for Handle the null pointer exception [21-09-2023] --------------------------------*/
		    	if(closureDataList2 != null){
				    for (ProjectMasterForm closureProject : closureDataList2) {
			            if (pendingProject.getProjectRefrenceNo().equals(closureProject.getProjectRefrenceNo()) && pendingProject.getStrProjectName().equals(closureProject.getStrProjectName())) {
			            	existingFlag=true;
			            	break;
			            }
			        }
		    	}
			    //Added Closure/Extention pending count projects which closure is not initialized
			    if(!existingFlag){
			    	notExistingRecords.add(pendingProject);
			    }
		    }
		} catch (Exception e) {
			e.printStackTrace();
		}
		if(roleId==5){
			response.put("pendingClosureCountforOngoing", notExistingRecords.size());
		}else{
			response.put("pendingClosureCountforOngoing", projectMasterService.getPendingClosureDetailforOngoing().size());
		}
		List<ProjectMasterForm> pendingClosurelist = projectMasterService.getPendingClosureDetail();		
		response.put("pendingClosureCount", pendingClosurelist.size());
		//End of Closure Pending Tiles
		
		response.put("FinancialPendingProjectDetails", projectMasterService.getAllPendingCompletedProject().size());//Financial Pending Count
		
		//New Project Count
		long newProjectCount = projectMasterService.getNewProjectCount(calendarStartRange, calendarEndRange);		
		response.put("newProjectCount", newProjectCount);
		//End of new projects count
		
		//Closure Request Count
		if(roleId==5){
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
			int underClosureCount = (underClosureProjects1 != null) ? underClosureProjects1.size() : 0;
			response.put("underClosureCount",underClosureCount);
		}
		if(roleId==9){
			List<ProjectMasterForm> underClosureProjectsPMO = projectMasterService.getUnderClosureforPMO();
			int underClosureProjectCount = (underClosureProjectsPMO != null) ? underClosureProjectsPMO.size() : 0;
			response.put("underClosureProjectCount",underClosureProjectCount);
		}
		//End of Closure Request Count
		List<ProjectMasterForm> underClosureProjectsPMO = projectMasterService.getUnderClosureforPMO();
		//bhavesh (20-10-23) added underClosureProjectsPMO list 
		response.put("underClosureProjectsPMO",underClosureProjectsPMO);
		// set the date in updatecounts for get the count in projectmastermodel by varun on 03-11-2023
		Date currentDate = new Date();
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy");
        String year = formatter.format(currentDate);
        ProjectMasterModel projectMastermodel = new ProjectMasterModel();
        projectMastermodel.setStartDate("01/01/"+year);
		List<ProjectMasterModel> newApprovalCountList = projectMasterService.getNewProjectsDetail(projectMastermodel);
		int pmocount=0;
		for(ProjectMasterModel a1:newApprovalCountList){
		 if (a1.getWorkflowModel().getStrActionName().contains("PMO")) {
			 pmocount++;
		 }
		}
		//System.out.println("PmoCount" +pmocount);
		response.put("newApprovalCountList", pmocount);
	    return response;
	}
	//End of update Counts Controller
	//Added by Bhavesh on 13-10-23 to get underClosureProjectsPMO list 
	@RequestMapping(value="/popPendingPMO",method=RequestMethod.POST)
	public @ResponseBody List<ProjectMasterForm> getUnderClosureForPmo(ProjectMasterModel projectMastermodel ,HttpServletRequest request){	
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		UserInfo userInfo = (UserInfo) authentication.getPrincipal();
		EmployeeRoleMasterModel selectedRole = userInfo.getSelectedEmployeeRole();
		int roleId = selectedRole.getNumRoleId();
		
		List<ProjectMasterForm> underClosureProjectsPMO = projectMasterService.getUnderClosureforPMO();
		
	
		return underClosureProjectsPMO;
	}
	//End of Function   
	
	

	@RequestMapping(value="/getFinancialPendingList",method=RequestMethod.POST)
	public @ResponseBody List<ProjectMasterForm> getFinancialPendingList(ProjectMasterForm ProjectMasterForm ,HttpServletRequest request){		
		List<ProjectMasterForm> FinancialPendingProjectDetails=projectMasterService.getAllPendingCompletedProject();
		return FinancialPendingProjectDetails;
	}
	
}
