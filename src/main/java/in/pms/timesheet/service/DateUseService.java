package in.pms.timesheet.service;

import java.util.List;

import in.pms.timesheet.dao.TSDateUseDao;
import in.pms.timesheet.model.DateUseModel;
import in.pms.timesheet.model.DateUseModelId;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DateUseService {
	
	@Autowired
	TSDateUseDao dateUseDao;
	
	public Integer saveDateUse(DateUseModel dateUseModel) {
		return dateUseDao.entryInDateUse(dateUseModel);
	}
	public List<Object> getWeeksEffort(DateUseModelId dateUseModelId) {
		return dateUseDao.getTotalWeeksEffort(dateUseModelId);
	}
	
	//REPORTS
		//R3   -    LOGGED IN USER MONTH WISE REPORT
	public List<Object> reportUserMonthWiseEffort(DateUseModelId dateUseModelId) {
		return dateUseDao.reportUserMonthWiseEffort(dateUseModelId);
	}
}
