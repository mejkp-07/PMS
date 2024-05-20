package in.pms.timesheet.dao;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.HibernateTemplate;
import org.springframework.stereotype.Repository;

import in.pms.global.dao.DaoHelper;
import in.pms.timesheet.model.EmployeeMasterModel;

@Repository
public class TSEmployeeMasterDao {
	
	@Autowired
	DaoHelper daoHelper;
	//Purpose - To get employee name from employee Id
	public String getEmpNameById(long empId){
		EmployeeMasterModel employeeMasterDomain =null;
		String query = "from EmployeeMasterModel where numId = ?0";
		ArrayList<Object> paraList = new ArrayList<>();
		paraList.add(empId);
		List<EmployeeMasterModel> list = daoHelper.findByQuery(query, paraList);
		if(list.size()>0){
			employeeMasterDomain =list.get(0);
		}
		return employeeMasterDomain.getEmployeeName();	
	}
	
	//Purpose - To get group id from employee Id
	public long getGroupIdById(long empId){
		
		EmployeeMasterModel employeeMasterDomain =null;
		String query = "from EmployeeMasterModel where numId = ?0";
		ArrayList<Object> paraList = new ArrayList<>();
		paraList.add(empId);
		List<EmployeeMasterModel> list = daoHelper.findByQuery(query, paraList);
		if(list.size()>0){
			employeeMasterDomain =list.get(0);
		}
		return employeeMasterDomain.getGroupid();	
	}
	
	//REPORT
		//R1 - Finding Employee details under GC
			//Purpose - To fetch all employee name under particular group for reporting
	public List<String> getEmpNamesByGroupId(long groupId){
		EmployeeMasterModel employeeMasterDomain =null;
		String query = "from EmployeeMasterModel where numGroupId = ?0 and num_isvalid=1";
		ArrayList<Object> paraList = new ArrayList<>();
		paraList.add(groupId);
		List<EmployeeMasterModel> list = daoHelper.findByQuery(query, paraList);
		List<String> empList = new ArrayList<String>();
		for(int i =0; i<list.size(); i++){
			empList.add(list.get(i).getEmployeeName());
		}
		return empList;	
	}
	
			//Purpose - To fetch all employee name under particular group for reporting
	public List<Long> getEmpIdsByGroupId(long groupId){
		EmployeeMasterModel employeeMasterDomain =null;
		String query = "from EmployeeMasterModel where numGroupId = ?0 and num_isvalid=1";
		ArrayList<Object> paraList = new ArrayList<>();
		paraList.add(groupId);
		List<EmployeeMasterModel> list = daoHelper.findByQuery(query, paraList);
		List<Long> empList = new ArrayList<Long>();
		for(int i =0; i<list.size(); i++){
			empList.add(list.get(i).getNumId());
		}
		return empList;	
	}
	
}
