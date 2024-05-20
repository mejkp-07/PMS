package in.pms.timesheet.service;

import java.util.List;

import in.pms.timesheet.dao.TSDateUseDao;
import in.pms.timesheet.dao.TSDateUseProjectDao;
import in.pms.timesheet.model.DateUseModel;
import in.pms.timesheet.model.DateUseModelId;
import in.pms.timesheet.model.DateUseProjectModel;
import in.pms.timesheet.model.DateUseProjectModelId;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DateUseProjectService {
	@Autowired
	TSDateUseProjectDao dateUseProjectDao;
	
	public Integer saveDateUseProject(DateUseProjectModel dateUseProjectModel) {
		return dateUseProjectDao.entryInDateUseProject(dateUseProjectModel);
	}
	
	public List<String> getWeekEffort(DateUseProjectModelId dateUseProjectModelId) {
		return dateUseProjectDao.getTotalWeekEffort(dateUseProjectModelId);
	}
	
	public List<Object> getProjectEffort(DateUseProjectModelId dateUseProjectModelId) {
		return dateUseProjectDao.getTotalProjectEffort(dateUseProjectModelId);
	}
	
	public List<Object> getActivityEffort(DateUseProjectModelId dateUseProjectModelId) {
		return dateUseProjectDao.getTotalActivityEffort(dateUseProjectModelId);
	}
	
	public List<Object> getEachAndEveryEffort(DateUseProjectModelId dateUseProjectModelId) {
		return dateUseProjectDao.getEachAndEveryEffort(dateUseProjectModelId);
	}
	
	
	//REPORTS
		//R2   -    LOGGED IN USER PROJECT WISE REPORT
	public List<Object> reportUserProjectWiseEffort(DateUseProjectModelId dateUseProjectModelId) {
		return dateUseProjectDao.reportUserProjectWiseEffort(dateUseProjectModelId);
	}
	
	public List<String> reportMiscActivityTotalEffort(DateUseProjectModelId dateUseProjectModelId) {
		return dateUseProjectDao.reportMiscActivityTotalEffort(dateUseProjectModelId);
	}
	
		//R4   -    LOGGED IN USER ACTIVITY WISE REPORT
	public List<Object> reportUserActivityWiseEffort(DateUseProjectModelId dateUseProjectModelId) {
		return dateUseProjectDao.reportUserActivityWiseEffort(dateUseProjectModelId);
	}
	
	//R5	-	LOGGED IN USER PROJECT-MONTH WISE REPORT
	public List<Integer> reportProjectMonthEffort(DateUseProjectModelId dateUseProjectModelId){
		return dateUseProjectDao.reportProjectMonthEffort(dateUseProjectModelId);
	}
}
