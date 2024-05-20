package in.pms.timesheet.dao;

import in.pms.global.dao.DaoHelper;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class TSHolidayMasterDao {
	
		@Autowired
		DaoHelper daoHelper;
		//Purpose - To get all holiday date for particular month and year
		public List<Integer> getHolidayList(String month, String year, Integer leaveTypeId){
			
			String query = "SELECT e.day FROM HolidayMasterModel e WHERE e.monthName = ?0 AND e.yearName = ?1 AND e.leaveTypeId = ?2";
			ArrayList<Object> paraList = new ArrayList<>();
			paraList.add(month);
			paraList.add(year);
			paraList.add(leaveTypeId);
			List<Integer> result = daoHelper.findByQuery(query, paraList);
			
			return (result != null && !result.isEmpty()) ? result : null;	
		}

}
