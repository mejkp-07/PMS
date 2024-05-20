package in.pms.timesheet.dao;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import in.pms.global.dao.DaoHelper;
import in.pms.timesheet.model.DateUseModel;
import in.pms.timesheet.model.DateUseModelId;
import in.pms.timesheet.model.DateUseProjectModel;
import in.pms.timesheet.model.DateUseProjectModelId;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class TSDateUseProjectDao {
	
	@Autowired
	DaoHelper daoHelper;
	
	//Purpose - To save data in pms_date_use_project table
	@Transactional
	public Integer entryInDateUseProject(DateUseProjectModel dateUseProjectModel){

		dateUseProjectModel = daoHelper.merge(DateUseProjectModel.class, dateUseProjectModel);

        return dateUseProjectModel.getId().getEmpId();
	}
	
	//Purpose - To get total week Effort for all project/activities for particular week, month and year so that we can save this in pms_date_use table
	public List<String> getTotalWeekEffort(DateUseProjectModelId dateUseProjectModelId){
		
		Integer empId = dateUseProjectModelId.getEmpId();
		String monthName = dateUseProjectModelId.getMonthName();
		String weekName = dateUseProjectModelId.getWeekName();
		//long projectId = dateUseProjectModelId.getProjectId();
		String yearName = dateUseProjectModelId.getYearName();
		
		String query = "SELECT e.totalEffortProject FROM DateUseProjectModel e WHERE e.id.empId = ?0 AND e.id.monthName = ?1 AND e.id.weekName = ?2 AND e.id.yearName= ?3 AND (e.id.status='p' OR e.id.projectId!=1)";
		ArrayList<Object> paraList = new ArrayList<>();
		paraList.add(empId);
		paraList.add(monthName);
		paraList.add(weekName);
		paraList.add(yearName);
		List<String> result = daoHelper.findByQuery(query, paraList);
		
		return (result != null && !result.isEmpty()) ? result : new ArrayList<>();
	}
	
	//Purpose - To get total project Effort for all week in each project for particular month and year to show on UI
	public List<Object> getTotalProjectEffort(DateUseProjectModelId dateUseProjectModelId){
		
		Integer empId = dateUseProjectModelId.getEmpId();
		String monthName = dateUseProjectModelId.getMonthName();
		//String weekName = dateUseProjectModelId.getWeekName();
		//long projectId = dateUseProjectModelId.getProjectId();
		String yearName = dateUseProjectModelId.getYearName();
		
		String query = "SELECT e.id.projectId, SUM(CAST(e.totalEffortProject AS double)) FROM DateUseProjectModel e WHERE e.isValid=1 AND e.id.empId = ?0 AND e.id.monthName= ?1 AND e.id.yearName = ?2 AND e.id.status='p' GROUP BY e.id.projectId" ;
		ArrayList<Object> paraList = new ArrayList<>();
		paraList.add(empId);
		paraList.add(monthName);
		paraList.add(yearName);
		List<Object> result = daoHelper.findByQuery(query, paraList);
		
		return (result != null && !result.isEmpty()) ? result : new ArrayList<>();
	}
	
	//Purpose - To get total activity Effort for all week in each activity for particular month and year to show on UI
	public List<Object> getTotalActivityEffort(DateUseProjectModelId dateUseProjectModelId){
		
		Integer empId = dateUseProjectModelId.getEmpId();
		String monthName = dateUseProjectModelId.getMonthName();
		//String weekName = dateUseProjectModelId.getWeekName();
		//long projectId = dateUseProjectModelId.getProjectId();
		String yearName = dateUseProjectModelId.getYearName();
		
		String query = "SELECT e.id.projectId, SUM(CAST(e.totalEffortProject AS double)) FROM DateUseProjectModel e WHERE e.isValid=1 AND e.id.empId = ?0 AND e.id.monthName = ?1 AND e.id.yearName = ?2 AND e.id.status='m' GROUP BY e.id.projectId" ;
		ArrayList<Object> paraList = new ArrayList<>();
		paraList.add(empId);
		paraList.add(monthName);
		paraList.add(yearName);
		List<Object> result = daoHelper.findByQuery(query, paraList);
		
		return (result != null && !result.isEmpty()) ? result : new ArrayList<>();
	}
	
	//Purpose - To get each Effort in each project, week for particular month and year to show on UI
	public List<Object> getEachAndEveryEffort(DateUseProjectModelId dateUseProjectModelId){
		
		Integer empId = dateUseProjectModelId.getEmpId();
		String monthName = dateUseProjectModelId.getMonthName();
		//String weekName = dateUseProjectModelId.getWeekName();
		//long projectId = dateUseProjectModelId.getProjectId();
		String yearName = dateUseProjectModelId.getYearName();
		
		String query = "SELECT e.id.weekName, e.totalEffortProject, e.id.projectId, e.id.status FROM DateUseProjectModel e WHERE e.isValid=1 AND e.id.empId = ?0 AND e.id.monthName = ?1 AND e.id.yearName = ?2 ORDER BY CAST(e.id.weekName AS double) ASC" ;
		ArrayList<Object> paraList = new ArrayList<>();
		paraList.add(empId);
		paraList.add(monthName);
		paraList.add(yearName);
		List<Object> result = daoHelper.findByQuery(query, paraList);
		
		return (result != null && !result.isEmpty()) ? result : new ArrayList<>();
	}
	
	//REPORTS
		//R2   -    LOGGED IN USER PROJECT WISE REPORT
			//Purpose - To fetch project wise effort for reporting
	public List<Object> reportUserProjectWiseEffort(DateUseProjectModelId dateUseProjectModelId){
		
		Integer empId = dateUseProjectModelId.getEmpId();
		String yearName = dateUseProjectModelId.getYearName();
		
		String query = "SELECT p.strProjectName, SUM(CAST(e.totalEffortProject AS double)) FROM DateUseProjectModel e JOIN fetch ProjectMasterModel p ON p.numId = e.id.projectId WHERE e.id.empId = ?0 AND e.id.yearName = ?1 AND e.id.status='p' GROUP BY p.strProjectName" ;
		ArrayList<Object> paraList = new ArrayList<>();
		paraList.add(empId);
		paraList.add(yearName);
		List<Object> result = daoHelper.findByQuery(query, paraList);
		
		return (result != null && !result.isEmpty()) ? result : new ArrayList<>();
	}
			//Purpose - To fetch total effort in all activities for reporting
	public List<String> reportMiscActivityTotalEffort(DateUseProjectModelId dateUseProjectModelId){
		
		Integer empId = dateUseProjectModelId.getEmpId();
		String yearName = dateUseProjectModelId.getYearName();
		
		String query = "SELECT e.totalEffortProject FROM DateUseProjectModel e WHERE e.id.empId = ?0 AND e.id.yearName = ?1 AND e.id.status='m'" ;
		ArrayList<Object> paraList = new ArrayList<>();
		paraList.add(empId);
		paraList.add(yearName);
		List<String> result = daoHelper.findByQuery(query, paraList);
		
		return (result != null && !result.isEmpty()) ? result : new ArrayList<>();
	}
	
		//R4   -    LOGGED IN USER ACTIVITY WISE REPORT
			//Purpose - To fetch activity wise effort for reporting
	public List<Object> reportUserActivityWiseEffort(DateUseProjectModelId dateUseProjectModelId){
		
		Integer empId = dateUseProjectModelId.getEmpId();
		String yearName = dateUseProjectModelId.getYearName();
		
		String query = "SELECT p.MiscActivityName, SUM(CAST(e.totalEffortProject AS double)) FROM DateUseProjectModel e JOIN fetch MiscActivityMasterModel p ON p.MiscActivityId = e.id.projectId WHERE e.id.empId = ?0 AND e.id.yearName = ?1 AND e.id.status='m' GROUP BY p.MiscActivityName" ;
		ArrayList<Object> paraList = new ArrayList<>();
		paraList.add(empId);
		paraList.add(yearName);
		List<Object> result = daoHelper.findByQuery(query, paraList);
		
		return (result != null && !result.isEmpty()) ? result : new ArrayList<>();
	}
	
		//R5	-	LOGGED IN USER PROJECT-MONTH WISE REPORT
			//Purpose - To fetch month wise effort for each project for reporting
	public List<Integer> reportProjectMonthEffort(DateUseProjectModelId dateUseProjectModelId){
		
		Integer empId = dateUseProjectModelId.getEmpId();
		String yearName = dateUseProjectModelId.getYearName();
		long projectID = dateUseProjectModelId.getProjectId();
		List<Integer> res = new ArrayList<Integer>();
		// Create a List<string> with month names
		List<String> months = Arrays.asList(
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
        );
		
		for(int i=0; i<months.size();i++){
			String query = "SELECT e.totalEffortProject FROM DateUseProjectModel e WHERE e.id.empId = ?0 AND e.id.yearName = ?1 AND e.id.projectId = ?2 AND e.id.monthName = ?3 AND e.id.status='p'" ;
			ArrayList<Object> paraList = new ArrayList<>();
			paraList.add(empId);
			paraList.add(yearName);
			paraList.add(projectID);
			paraList.add(months.get(i));
			List<String> result = daoHelper.findByQuery(query, paraList);
			int sum = 0;

	        for (String numericString : result) {
	            try {
	                // Attempt to parse the string as an integer and add to the sum
	                int number = Integer.parseInt(numericString);
	                sum += number;
	            } catch (NumberFormatException e) {
	                // Handle the case where the string is not a valid integer
	                System.err.println("Invalid numeric string: " + numericString);
	            }
	        }
			res.add(sum);
		}
		
		
		return (res != null && !res.isEmpty()) ? res : new ArrayList<Integer>();
	}
}
