package in.pms.timesheet.dao;

import in.pms.global.dao.DaoHelper;
import in.pms.timesheet.model.DateUseModel;
import in.pms.timesheet.model.DateUseModelId;
import in.pms.timesheet.model.EmployeeMasterModel;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class TSDateUseDao {
	
	@Autowired
	DaoHelper daoHelper;
	
	//Purpose - To save data in pms_date_use table
	@Transactional
	public Integer entryInDateUse(DateUseModel dateUseModel){

		dateUseModel = daoHelper.merge(DateUseModel.class, dateUseModel);

        return dateUseModel.getId().getEmpId();

  }
	//Purpose - To get total week Effort for all project/activities in each week for particular month and year to show on UI
	public List<Object> getTotalWeeksEffort(DateUseModelId dateUseModelId){
		
		Integer empId = dateUseModelId.getEmpId();
		String monthName = dateUseModelId.getMonthName();
		//String weekName = dateUseProjectModelId.getWeekName();
		//long projectId = dateUseProjectModelId.getProjectId();
		String yearName = dateUseModelId.getYearName();
		
		String query = "SELECT e.id.weekName, e.totalEffortWeek FROM DateUseModel e WHERE e.isValid=1 AND e.id.empId = ?0 AND e.id.monthName = ?1 AND e.id.yearName = ?2";

		 ArrayList<Object> paraList = new ArrayList<>();
		 paraList.add(empId);
		 paraList.add(monthName);
		 paraList.add(yearName);
		
		 List<Object> result = daoHelper.findByQuery(query, paraList);
		
		return (result != null && !result.isEmpty()) ? result : new ArrayList<>();
	}
	
	//REPORTS
		//R3   -    LOGGED IN USER MONTH WISE REPORT
			//Purpose - To fetch month wise effort for reporting
	public List<Object> reportUserMonthWiseEffort(DateUseModelId dateUseModelId){
		
		Integer empId = dateUseModelId.getEmpId();
		String yearName = dateUseModelId.getYearName();
		
		String query = "SELECT e.id.monthName, SUM(CAST(e.totalEffortWeek AS double)) FROM DateUseModel e WHERE e.isValid=1 AND e.id.empId = ?0 AND e.id.yearName = ?1 GROUP BY e.id.monthName" ;
		ArrayList<Object> paraList = new ArrayList<>();
		paraList.add(empId);
		paraList.add(yearName);
		List<Object> result = daoHelper.findByQuery(query, paraList);
		
		return (result != null && !result.isEmpty()) ? result : new ArrayList<>();
	}
	
}
