package in.pms.master.dao;

import in.pms.global.dao.DaoHelper;
import in.pms.global.util.DateUtils;
import in.pms.login.util.UserInfo;
import in.pms.master.domain.ContactPersonMasterDomain;
import in.pms.master.domain.GroupMasterDomain;
import in.pms.master.domain.ProposalMasterDomain;
import in.pms.master.model.EmployeeRoleMasterModel;
import in.pms.transaction.domain.Application;

import java.math.BigInteger;
import java.text.ParseException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Repository;

@Repository
public class ProposalMasterDao {

	@Autowired DaoHelper daoHelper;
	
	@Autowired
	EmployeeRoleMasterDao employeeRoleMasterDao;
	
	public ProposalMasterDomain saveUpdateProposalMaster(ProposalMasterDomain proposalMasterDomain){
		return  daoHelper.merge(ProposalMasterDomain.class, proposalMasterDomain);
	}
	
	public Application getProposalByName(String ProposalTitle){
		String query = "from Application where lower(proposalTitle) like lower('"+ProposalTitle+"')";	
		List<Application> applicationMasterDomainList = daoHelper.findByQuery(query);		
		if(applicationMasterDomainList.size()>0){
			return applicationMasterDomainList.get(0);
		}
		return null;
	}
	
	
	public ProposalMasterDomain getProposalMasterDomainById(long numId){
		ProposalMasterDomain proposalMasterDomain =null;
		String query = "from ProposalMasterDomain where numId="+numId;
		List<ProposalMasterDomain> list = daoHelper.findByQuery(query);
		if(list.size()>0){
			proposalMasterDomain =list.get(0);
		}
		return proposalMasterDomain;	
	}
	
	
	
	
	
	public List<ProposalMasterDomain> getAllProposalMasterDomain(){
		String query = "from ProposalMasterDomain where numIsValid<>2";
		return  daoHelper.findByQuery(query);	
	}
	
	public List<ProposalMasterDomain> getAllActiveProposalMasterDomain(){
		String query = "from ProposalMasterDomain where numIsValid=1";
		return  daoHelper.findByQuery(query);	
	}
	public void deleteProposal(ProposalMasterDomain proposalMasterDomain)
	{
		ProposalMasterDomain proposal = daoHelper.findById(ProposalMasterDomain.class, proposalMasterDomain.getNumId());
		proposal.setNumIsValid(2);
		proposal.setDtTrDate(proposalMasterDomain.getDtTrDate());
		daoHelper.merge(ProposalMasterDomain.class, proposal);
	}
	
	///for group

	public List<GroupMasterDomain> showGroup(int OrganisationId)
	{
		String query = "select s from GroupMasterDomain s where s.organisationMasterDomain.numId="+OrganisationId+" and s.numIsValid=1";
		//System.out.println( daoHelper.findByQuery(query).size());
		return daoHelper.findByQuery(query);
		
	}
	
	///for contact Person

		public List<ContactPersonMasterDomain> showContact(int ClientId)
		{
			String query = "select s from ContactPersonMasterDomain s where s.clientId="+ClientId+" and s.numIsValid=1 order by s.strContactPersonName";
			System.out.println( daoHelper.findByQuery(query).size());
			return daoHelper.findByQuery(query);
			
		}
	
		public List<ProposalMasterDomain> getProposalMasterByApplicationId(long applicationId){
			String query = "from ProposalMasterDomain a left join fetch a.application.thrustAreas left join fetch a.application.contactMaster where a.numIsValid=1 and  a.application.numId="+applicationId;
			return daoHelper.findByQuery(query);

		}
		public String getYearlyProject(int year){
			String result="";
			StringBuilder  query = new StringBuilder ("Select count(a) from pms_project_master a where a.str_project_ref_no IS NOT NULL and a.str_project_ref_no <> '' and to_char(a.dt_project_start,'YYYY')= '"+year+"'");
			List<BigInteger> dataList = daoHelper.runNative(query.toString());
			if(dataList.size()>0){				
				result = (dataList.get(0).intValue()+1)+"";
			}
			return result;
		}
/*
		public String getYearlyProject(int year){
			String result="";
			StringBuilder  query = new StringBuilder ("Select count(a) from pms_proposal_master a where a.str_status <> 'SAD' and to_char(a.dt_date_of_submission,'YYYY')= '"+year+"'");
			List<BigInteger> dataList = daoHelper.runNative(query.toString());
			if(dataList.size()>0){				
				result = (dataList.get(0).intValue()+1)+"";
			}
			return result;
		}
*/	
		
		public List<Object[]> getProposalMasterHistoryById(long numId){
		StringBuilder  query = new StringBuilder ("SELECT t.num_project_category_fk , t.num_project_type_fk FROM pms_log.pms_proposal_master_log p, pms_log.trans_application_log t, application_proposal a WHERE  a.application_id=t.num_application_id and a.application_id='"+numId+"'  ORDER BY p.dt_tr_date DESC");
		List<Object[]> obj = daoHelper.runNative(query.toString());
		return obj;	
		}
		
		public List<Object[]> getProposalHistoryById(long applicationId){
			StringBuilder  query = new StringBuilder ("select t.num_id, empMast.str_emp_name,t.dt_tr_date,t.str_remark from pms_log.trans_application_log t,pms_employee_master empMast where num_application_id='"+applicationId+"' and empMast.emp_id=t.num_tr_user_id order by t.dt_tr_date DESC");
			List<Object[]> obj = daoHelper.runNative(query.toString());
			return obj;	
			}
		
		//Added new proposal history query to get more columns to the proposal history model by devesh(28/7/23)
		public List<Object[]> getProposalHistorydetailsById(long applicationId){
			StringBuilder  query = new StringBuilder ("SELECT t.num_id,empMast.str_emp_name,t.dt_tr_date,t.str_remark,t.num_proposal_cost,category.str_category_name,typemst.str_project_type_name,t.str_proposal_title,client.str_client_name,t.num_corporate_approval,t.dt_clearance_receive_date,t.end_user_id_fk,t.is_collaborative,DATE(p.dt_date_of_submission) AS dt_date_of_submission,p.str_contact_person,p.num_duration,p.str_objectives,p.num_proposal_cost AS pms_proposal_cost,p.str_submitted_by,p.str_summary,p.str_background,p.str_proposal_status FROM pms_log.trans_application_log t JOIN pms_employee_master empMast ON empMast.emp_id = t.num_tr_user_id JOIN pms.pms_project_category_master category ON t.num_project_category_fk = category.num_project_category_id JOIN pms.pms_project_type_master typemst ON t.num_project_type_fk = typemst.num_project_type_id JOIN pms.pms_client_master client ON t.client_id_fk = client.client_id JOIN pms_log.pms_proposal_master_log p ON p.num_parent_id = t.num_id WHERE t.num_application_id = '"+applicationId+"' ORDER BY t.dt_tr_date DESC");
			List<Object[]> obj = daoHelper.runNative(query.toString());
			return obj;	
			}
		//End of query
		
		public List<Object[]> getVersionDetails(long numId){
			/*StringBuilder  query = new StringBuilder ("select t.str_proposal_title,p.str_summary,projType.str_project_type_name,projCat.str_category_name ,grpMast.str_group_name,t.dt_date_of_sub,p.num_duration,t.num_proposal_cost as totalcost,p.num_proposal_cost,p.str_submitted_by,p.str_objectives,p.str_background,p.str_proposal_status from pms_log.trans_application_log t, pms_log.pms_proposal_master_log p,pms_project_type_master projType,pms_project_category_master projCat,pms_group_master grpMast WHERE t.num_id=p.num_parent_id and t.num_id='"+numId+"' and projType.num_project_type_id=t.num_project_type_fk and projCat.num_project_category_id=t.num_project_category_fk and grpMast.group_id=num_group_id_fk");*/
			//Modified by devesh on 4/8/23 to correct date of submission
			StringBuilder  query = new StringBuilder ("select t.str_proposal_title,p.str_summary,projType.str_project_type_name,projCat.str_category_name ,grpMast.str_group_name,p.dt_date_of_submission,p.num_duration,t.num_proposal_cost as totalcost,p.num_proposal_cost,p.str_submitted_by,p.str_objectives,p.str_background,p.str_proposal_status,p.proposal_id from pms_log.trans_application_log t, pms_log.pms_proposal_master_log p,pms_project_type_master projType,pms_project_category_master projCat,pms_group_master grpMast WHERE t.num_id=p.num_parent_id and t.num_id='"+numId+"' and projType.num_project_type_id=t.num_project_type_fk and projCat.num_project_category_id=t.num_project_category_fk and grpMast.group_id=num_group_id_fk");
			List<Object[]> obj = daoHelper.runNative(query.toString());
			return obj;	
			}
		public void updateProposaCopyRemark(long applicationId,String strRemarks){
			
			StringBuilder  query = new StringBuilder ("select updateProposalCopyRemark('"+applicationId+"','"+strRemarks+"');");
			daoHelper.runNative(query.toString());
			
		}
		
		public List<ProposalMasterDomain> getActiveProposals(String startRange, String endRange){
			
			Date startDate=null;
			Date endDate=null;
		
			try {
				 startDate = DateUtils.dateStrToDate(startRange);
			} catch (ParseException e) {
				
				e.printStackTrace();
			}
			if(null != endRange && !endRange.equals("")){
				try {
					endDate = DateUtils.dateStrToDate(endRange);
				} catch (ParseException e) {
					
					e.printStackTrace();
				}
			}else{
				endDate = new Date();
			}
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			UserInfo userInfo = (UserInfo) authentication.getPrincipal();
			EmployeeRoleMasterModel selectedRole = userInfo.getSelectedEmployeeRole();
			int roleId = selectedRole.getNumRoleId();
			int selectedOrganisation = selectedRole.getNumOrganisationId();
		
			// added below projectids to get all the projectis from role by varun on 19-10-2023
			List<Integer> numProjectIds=employeeRoleMasterDao.getProjectIdsforTeam(roleId);
			/*List<Long> longs = numProjectIds.stream()
			        .mapToLong(Integer::longValue)
			        .boxed().collect(Collectors.toList());
			String result;*/
			StringBuilder projectIdsString = new StringBuilder();
			for (Integer projectId : numProjectIds) {
			    if (projectIdsString.length() > 0) {
			        projectIdsString.append(",");
			    }
			    projectIdsString.append(projectId);
			}

			String projectIdsInString = projectIdsString.toString();
			/*System.out.println("printstringbuilder " + projectIdsInString);*/
			if(roleId == 0){
				return null;
			}
			StringBuffer query = new StringBuffer("from ProposalMasterDomain p where p.numIsValid =1 ");
			
			/*if(roleId != 5 && roleId != 6 && roleId !=7 && roleId !=9){
				query.append(" and p.numTrUserId="+userInfo.getEmployeeId() +" and p.status in ('SUB','REV') ");
			}*/
			if(roleId ==3){
				query.append(" and p.numTrUserId="+userInfo.getEmployeeId() +" and p.status in ('SUB','REV') ");
			}
			
			/*			else if(roleId == 15 || roleId == 4){
					query.append(" and p.numId in ("+projectIdsInString+") and p.status in ('SUB','REV') ");
				//query.append(" and p.application.projectMaster.numId IN (SELECT pm.numId FROM ProjectMaster pm WHERE pm.numId IN (92,132,137,160,162,228,250,254,255,257,259,263,266,268,273,279,280,281,286,292,311,312)) and p.status in ('SUB','REV') ");
				
			}*/
			else{
				query.append(" and p.status in ('SUB','REV')");
			}		
			
			if(selectedOrganisation != 0){
				query.append(" and p.application.groupMaster.organisationMasterDomain.numId in ("+selectedOrganisation+")");
			}	
			//Commented by devesh on 29/08/23 to get all proposal list
			/*if(selectedGroup != 0){
				query.append(" and p.application.groupMaster.numId in ("+selectedGroup+")");
			}*/
			//End of Comment
			
			//query.append(" and p.dateOfSubmission between :startDate and :endDate");
			query.append("and  p.dateOfSubmission between '"+startDate+ "' and '"+ endDate+"'");
			
			return daoHelper.findByQuery(query.toString());
		}
		
		public List<Object[]> loadSubmittedProposals(String startRange, String endRange,int orgId){

		
			StringBuffer query = new StringBuffer("select a.num_group_id_fk,d.str_group_name ,count(*),sum(c.num_proposal_cost) from  trans_application  a, application_proposal b, pms_proposal_master c,pms_group_master d where a.num_isvalid=1 and a.num_application_id = b.application_id and b.proposal_id = c.proposal_id and c.num_isvalid=1 and c.str_status in ('SUB', 'REV') and a.num_group_id_fk = d.group_id and c.dt_date_of_submission BETWEEN to_date('"+startRange+"','dd/MM/yyyy')AND to_date('"+endRange+"','dd/MM/yyyy') and d.organisation_id="+orgId+" group by 1,2 ");
			
			
			List<Object[]> obj = daoHelper.runNative(query.toString()); 
			return obj;	
				
		}
		
		public List<Object[]> loadProjectClosed(String startRange, String endRange,int orgId){

			StringBuffer query = new StringBuffer("SELECT A .num_group_id_fk, d.str_group_name, COUNT (*), SUM (P .num_project_cost) FROM pms_project_master P, trans_application A, application_project b, pms_group_master d,pms_organisation_master e WHERE A .num_isvalid = 1 AND A .num_application_id = b.application_id AND b.project_id = P .num_project_id AND A .num_group_id_fk = d.group_id AND d.organisation_id=e.organisation_id AND P .num_isvalid = 1 AND P .dt_project_closure BETWEEN to_date('"+startRange+"','dd/MM/yyyy')AND to_date('"+endRange+"','dd/MM/yyyy') AND P .str_project_status IN ('Terminated', 'Completed') AND e.organisation_id="+orgId+" GROUP BY 1,2 ");
			
			
			List<Object[]> obj = daoHelper.runNative(query.toString()); 
			return obj;	
				
		}
		
		public List<Object[]> loadProjectsAsOnDate(int orgId){

			StringBuffer query = new StringBuffer("SELECT A .num_group_id_fk,d.str_group_name,COUNT (*),SUM (P .num_project_cost) FROM pms_project_master P,trans_application A,application_project b,pms_group_master d,pms_organisation_master e WHERE A .num_isvalid = 1 AND A .num_application_id = b.application_id AND b.project_id = P .num_project_id AND A .num_group_id_fk = d.group_id AND d.organisation_id = e.organisation_id AND P .num_isvalid = 1 AND P .str_project_status IN ('Ongoing') AND e.organisation_id = "+orgId+" GROUP BY 1,2 ");
			
			
			List<Object[]> obj = daoHelper.runNative(query.toString()); 
			return obj;	
				
		}

	public List<ProposalMasterDomain> getActiveProposalsByGroup(
			String startRange, String endRange, long encGroupId) {

		Date startDate = null;
		Date endDate = null;

		try {
			startDate = DateUtils.dateStrToDate(startRange);
		} catch (ParseException e) {

			e.printStackTrace();
		}
		if (null != endRange && !endRange.equals("")) {
			try {
				endDate = DateUtils.dateStrToDate(endRange);
			} catch (ParseException e) {

				e.printStackTrace();
			}
		} else {
			endDate = new Date();
		}
		Authentication authentication = SecurityContextHolder.getContext()
				.getAuthentication();
		UserInfo userInfo = (UserInfo) authentication.getPrincipal();
		EmployeeRoleMasterModel selectedRole = userInfo
				.getSelectedEmployeeRole();
		int roleId = selectedRole.getNumRoleId();
		int selectedOrganisation = selectedRole.getNumOrganisationId();
		/* int selectedGroup = selectedRole.getNumGroupId(); */
		if (roleId == 0) {
			return null;
		}
		StringBuffer query = new StringBuffer(
				"from ProposalMasterDomain p where p.numIsValid =1 ");

		if (roleId != 5 && roleId != 6) {
			query.append(" and p.numTrUserId=" + userInfo.getEmployeeId()
					+ " and p.status in ('SUB','REV') ");
		} else {
			query.append(" and p.status in ('SUB','REV')");
		}

		if (selectedOrganisation != 0) {
			query.append(" and p.application.groupMaster.organisationMasterDomain.numId in ("
					+ selectedOrganisation + ")");
		}

		query.append(" and p.application.groupMaster.numId in (" + encGroupId
				+ ")");

		query.append("and  p.dateOfSubmission between '" + startDate
				+ "' and '" + endDate + "'");

		return daoHelper.findByQuery(query.toString());
	}

	// Get Count of proposal from proposal master table of particular year
	public String getYearlyProposal(int year) {
		String result="";
		StringBuilder  query = new StringBuilder ("Select count(a) from pms_proposal_master a where a.str_status not in ('DEL','SAD') and to_char(a.dt_date_of_submission,'YYYY')='"+year+"'");
		List<BigInteger> dataList = daoHelper.runNative(query.toString());
		if(dataList.size()>0){				
			result = (dataList.get(0).intValue()+1)+"";
		}
		return result;

	}
	// End Changes
}
