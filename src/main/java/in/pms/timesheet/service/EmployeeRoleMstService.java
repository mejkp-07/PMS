package in.pms.timesheet.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import in.pms.timesheet.dao.TSEmployeeRoleMstDao;

@Service
public class EmployeeRoleMstService {
	
	@Autowired
	public TSEmployeeRoleMstDao employeeRoleMstDao;
	
	public List<String> getProjectNames(long empId) {
		return this.employeeRoleMstDao.getProjectNamesByUserId(empId);
	}
	
	public List<Integer> getProjectIds(long empId) {
		return this.employeeRoleMstDao.getProjectIdsByUserId(empId);
	}
	
}
