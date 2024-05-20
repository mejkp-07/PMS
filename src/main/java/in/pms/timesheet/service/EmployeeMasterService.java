package in.pms.timesheet.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import in.pms.timesheet.dao.TSEmployeeMasterDao;
import in.pms.timesheet.model.EmployeeMasterModel;


@Service
public class EmployeeMasterService {
	
	@Autowired
	public TSEmployeeMasterDao employeeMasterDao;
	
	public String getEmpName(long empId) {
		return employeeMasterDao.getEmpNameById(empId);
	}
	
	public long getGroupId(long empId) {
		return employeeMasterDao.getGroupIdById(empId);
	}
	
	//REPORT
		//R1 - Finding Employee details under GC
	public List<String> getEmpNamesByGroupId(long groupId){
		return employeeMasterDao.getEmpNamesByGroupId(groupId);
	}
	
	public List<Long> getEmpIdsByGroupId(long groupId){
		return employeeMasterDao.getEmpIdsByGroupId(groupId);	
	}
}
