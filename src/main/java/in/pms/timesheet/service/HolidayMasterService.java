package in.pms.timesheet.service;

import java.util.List;

import in.pms.timesheet.dao.TSDateUseProjectDao;
import in.pms.timesheet.dao.TSHolidayMasterDao;
import in.pms.timesheet.model.DateUseProjectModel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HolidayMasterService {
	@Autowired
	TSHolidayMasterDao holidayMasterDao;
	
	public List<Integer> getHolidayList(String month, String year, Integer leaveTypeId) {
		return holidayMasterDao.getHolidayList(month, year,leaveTypeId);
	}
}
