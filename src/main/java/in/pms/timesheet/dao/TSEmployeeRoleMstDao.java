package in.pms.timesheet.dao;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.HibernateTemplate;
import org.springframework.stereotype.Repository;

import in.pms.global.dao.DaoHelper;
import in.pms.timesheet.model.EmployeeMasterModel;
import in.pms.timesheet.model.EmployeeRoleMstModel;

@Repository
public class TSEmployeeRoleMstDao{
	
	@Autowired
	DaoHelper daoHelper;
	
	//Purpose - To get all project names under a employee from their employee Id
	public List<String> getProjectNamesByUserId(long empId){
		
		String query = "SELECT DISTINCT p.strProjectName FROM EmployeeRoleMstModel e JOIN fetch ProjectMasterModel p ON p.numId = e.numProjectId WHERE (p.strProjectStatus = 'Ongoing' OR p.strProjectStatus = 'Under Approval') AND e.numEmpId = ?0";
		ArrayList<Object> paraList = new ArrayList<>();
		paraList.add(empId);
		List<String> result = daoHelper.findByQuery(query, paraList);
		
		return (result != null && !result.isEmpty()) ? result : null;	
	}
	
	//Purpose - To get all project Ids under a employee from thier employee Id
	public List<Integer> getProjectIdsByUserId(long empId){
		
		String query = "SELECT DISTINCT e.numProjectId FROM EmployeeRoleMstModel e JOIN fetch ProjectMasterModel p ON p.numId = e.numProjectId WHERE (p.strProjectStatus = 'Ongoing' OR p.strProjectStatus = 'Under Approval') AND e.numEmpId = ?0";
		//String query = "SELECT e.numProjectId FROM EmployeeRoleMstModel e WHERE e.dtEndDate =null AND e.numEmpId ="+empId;
		ArrayList<Object> paraList = new ArrayList<>();
		paraList.add(empId);
		List<Integer> result = daoHelper.findByQuery(query, paraList);
		
		return (result != null && !result.isEmpty()) ? result : null;	
	}
	
}
