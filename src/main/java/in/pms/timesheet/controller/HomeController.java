package in.pms.timesheet.controller;

import java.text.DateFormatSymbols;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.Month;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.view.RedirectView;

import in.pms.login.util.UserInfo;
import in.pms.timesheet.model.DateUseModel;
import in.pms.timesheet.model.DateUseModelId;
import in.pms.timesheet.model.DateUseProjectModel;
import in.pms.timesheet.model.DateUseProjectModelId;
import in.pms.timesheet.model.WeekSubmitModel;
import in.pms.timesheet.service.DateUseProjectService;
import in.pms.timesheet.service.DateUseService;
import in.pms.timesheet.service.EmployeeMasterService;
import in.pms.timesheet.service.EmployeeRoleMstService;
import in.pms.timesheet.service.HolidayMasterService;
import in.pms.timesheet.service.MiscActivityMasterService;

import org.threeten.extra.YearWeek;

@Controller
public class HomeController {
	
	@Autowired
	private EmployeeMasterService employeeMasterService; 
	
	@Autowired
	private EmployeeRoleMstService employeeRoleMstService;
	
	@Autowired
	private DateUseService dateUseService;
	
	@Autowired
	private DateUseProjectService dateUseProjectService;
	
	@Autowired
	private HolidayMasterService holidayMasterService;
	
	@Autowired
	private MiscActivityMasterService miscActivityMasterService;
	
	
	@RequestMapping("/timesheethome")
	public String index(Model model) {
		//COMMON THINGHS
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        UserInfo userInfo = (UserInfo) authentication.getPrincipal();
        
		int userId = userInfo.getEmployeeId();
		LocalDate selectedLocalDate = LocalDate.now();
		
		
		String userName = this.employeeMasterService.getEmpName(userId);
		
		List<String> projectNamesByUserId = this.employeeRoleMstService.getProjectNames(userId) != null ?
		        this.employeeRoleMstService.getProjectNames(userId) : new ArrayList<>();
		
		List<Integer> projectIdsByUserId = this.employeeRoleMstService.getProjectIds(userId) != null ?
		        this.employeeRoleMstService.getProjectIds(userId) : new ArrayList<>();
		
		long groupIdByUserId = this.employeeMasterService.getGroupId(userId);
		
		model.addAttribute("empId", userId);
		model.addAttribute("userName", userName);
		model.addAttribute("projectNames", projectNamesByUserId);
		model.addAttribute("projectIds", projectIdsByUserId);
		model.addAttribute("groupId",groupIdByUserId);
		
		//Color for calendar
		List<String> calendarColor = new ArrayList<String>();/*["#ACDDDE", "#CAF1DE", "#E1F8DC", "#FEF8DD", "#FFE7C7"];*/
		calendarColor.add("#ACDDDE");
		calendarColor.add("#CAF1DE");
		calendarColor.add("#E1F8DC");
		calendarColor.add("#FEF8DD");
		calendarColor.add("#FFE7C7");
		calendarColor.add("#F7D8BA");
		model.addAttribute("calendarColor", calendarColor);
		
		//code for sending misc acivity at frontend
		List<String> miscActivityNames = this.miscActivityMasterService.getMiscActivityNames() != null ?
				this.miscActivityMasterService.getMiscActivityNames() : new ArrayList<>();
	
		List<Integer> miscActivityIds = this.miscActivityMasterService.getMiscActivityIds() != null ?
				this.miscActivityMasterService.getMiscActivityIds() : new ArrayList<>();
				

		model.addAttribute("miscActivityNames", miscActivityNames);
		model.addAttribute("miscActivityIds", miscActivityIds);
		
		//Calculating active week number i.e. current week number for disabling other week inputs
		// Get the current date
        LocalDate currentDatetoFindActiveWeekNumber = LocalDate.now();

        // Get the week number using ISO week fields
        int activeWeekNumber = currentDatetoFindActiveWeekNumber.get(WeekFields.of(Locale.getDefault()).weekOfWeekBasedYear());
        model.addAttribute("activeWeekNumber",activeWeekNumber);
        
       //COMMON THINGHS END
        
		// Calculate the start date of the week
		LocalDate startDate = selectedLocalDate.with(DayOfWeek.MONDAY);

		model.addAttribute("todaysDate", selectedLocalDate);
		// Calculate the YearWeek
        YearWeek yearWeek = YearWeek.from(selectedLocalDate);

        // Get the month name, year, and week number as strings
        String yearString = String.valueOf(startDate.getYear());
        String weekNumberString = String.valueOf(yearWeek.getWeek());
        
        Integer yearToday = startDate.getYear();
        // Get the month name from startDate
        String monthToday = startDate.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH);
        
        List<String> monthNameList = new ArrayList<>();
        
        
        // Loop through each month and add its name to the list
        for (int i = 1; i <= 12; i++) {
            Month month = Month.of(i);
            String monthName = month.getDisplayName(TextStyle.FULL, Locale.ENGLISH);
            if(!monthName.equalsIgnoreCase(monthToday)){
            	monthNameList.add(monthName);
            }
        }
        
        // Loop through to make year list
        LocalDate currentDate = LocalDate.now();
	    int year = currentDate.getYear();
	    
	    List<Integer> yearList = new ArrayList<>();
	   
	    for (int i = 0; i <= 2; i++) {
            if(year!=yearToday){
            	yearList.add(year);
            }
            
            year++;
        } 
	    
	    List<Integer> dayListCalendar = getDayListCalendar(monthToday, yearToday);
        
        Integer firstDayNumberCalendar = getFirstDayNumberCalendar(monthToday, yearToday);
        
	    List<Integer> weekNumbersCalendar = getWeekNumbersCalendar(monthToday, yearToday);
	    if("December".equals(monthToday)){
	    	weekNumbersCalendar = weekNumbersCalendar.subList(0, weekNumbersCalendar.size()-1);
	    }
	    model.addAttribute("weekNumbers", weekNumbersCalendar);
	    
        model.addAttribute("yearSelectDB", yearString);
        model.addAttribute("weekSelectDB", weekNumberString); //No Use you can remove it
        
        model.addAttribute("monthToday", monthToday);
        model.addAttribute("yearToday", yearToday);
        model.addAttribute("monthNameList", monthNameList);
		model.addAttribute("yearList", yearList);
		model.addAttribute("calenderDayList",dayListCalendar); //used in frontend
		model.addAttribute("calenderStartDay",firstDayNumberCalendar); //used in frontend
		model.addAttribute("calenderWeekNumbers",weekNumbersCalendar); //used in frontend
		
		//color coding code
		List<Integer> holidayListDaysCompulsary = this.holidayMasterService.getHolidayList(monthToday, yearString,1 ) != null ?
				this.holidayMasterService.getHolidayList(monthToday, yearString, 1) : new ArrayList<>();
		List<Integer> holidayListDaysRestricted = this.holidayMasterService.getHolidayList(monthToday, yearString, 2) != null ?
				this.holidayMasterService.getHolidayList(monthToday, yearString, 2) : new ArrayList<>();
		
		model.addAttribute("holidayListDaysCompulsary", holidayListDaysCompulsary);
		model.addAttribute("holidayListDaysRestricted", holidayListDaysRestricted);	
		
		//Printing total effort for each project in UI
		DateUseProjectModelId dateUseProjectModelId = new DateUseProjectModelId();
		dateUseProjectModelId.setEmpId(userId);
		dateUseProjectModelId.setMonthName(monthToday);
		dateUseProjectModelId.setYearName(yearString);
		List<Object> projectEffort = this.dateUseProjectService.getProjectEffort(dateUseProjectModelId);
		List<Object> keys = new ArrayList<>();
		List<Object> values = new ArrayList<>();

		for (Object result : projectEffort) {
		    if (result instanceof Object[]) {
		        Object[] row = (Object[]) result;

		        if (row.length >= 2) {
		            keys.add(row[0]);
		            values.add(row[1]);
		        }
		    }
		}
		List<Object> valuesHHMM = convertToHHMM(values);
		model.addAttribute("projectIdKeys", keys);
		model.addAttribute("projectEffortValues", valuesHHMM);
		
		//Printing total effort for each activity on UI
		DateUseProjectModelId dateUseProjectModelIdMisc = new DateUseProjectModelId();
		dateUseProjectModelIdMisc.setEmpId(userId);
		dateUseProjectModelIdMisc.setMonthName(monthToday);
		dateUseProjectModelIdMisc.setYearName(yearString);
		List<Object> activityEffort = this.dateUseProjectService.getActivityEffort(dateUseProjectModelIdMisc);
		List<Object> keysMisc = new ArrayList<>();
		List<Object> valuesMisc = new ArrayList<>();

		for (Object result : activityEffort) {
		    if (result instanceof Object[]) {
		        Object[] row = (Object[]) result;

		        if (row.length >= 2) {
		            keysMisc.add(row[0]);
		            valuesMisc.add(row[1]);
		        }
		    }
		}
		
		List<Object> valuesMiscHHMM = convertToHHMM(valuesMisc);
		model.addAttribute("activityIdKeys", keysMisc);
		model.addAttribute("activityEffortValues", valuesMiscHHMM);
				
		//Printing total effort for each week on UI
		DateUseModelId dateUseModelId = new DateUseModelId();
		dateUseModelId.setEmpId(userId);
		dateUseModelId.setMonthName(monthToday);
		dateUseModelId.setYearName(String.valueOf(yearString));
		List<Object> weeksEffort = this.dateUseService.getWeeksEffort(dateUseModelId);
		List<Object> keys1 = new ArrayList<>();
		List<Object> values1 = new ArrayList<>();

		for (Object result : weeksEffort) {
		    if (result instanceof Object[]) {
		        Object[] row = (Object[]) result;

		        if (row.length >= 2) {
		            keys1.add(row[0]);
		            values1.add(row[1]);
		        }
		    }
		}
		
		List<Object> values1HHMM = convertToHHMM(values1);
		model.addAttribute("weekKeys", keys1);
		model.addAttribute("weekEffortValues", values1HHMM);
		
		//Printing each and every effort on UI
		DateUseProjectModelId dateUseProjectModelIdEachAndEveryEffort = new DateUseProjectModelId();
		dateUseProjectModelIdEachAndEveryEffort.setEmpId(userId);
		dateUseProjectModelIdEachAndEveryEffort.setMonthName(monthToday);
		dateUseProjectModelIdEachAndEveryEffort.setYearName(yearString);
		List<Object> eachAndEveryEffort = this.dateUseProjectService.getEachAndEveryEffort(dateUseProjectModelIdEachAndEveryEffort);
		
		List<Object> eachAndEveryWeek = new ArrayList<>();
		List<Object> eachAndEveryOnlyEffort = new ArrayList<>();
		List<Object> eachAndEveryProject = new ArrayList<>();
		List<Object> eachAndEveryStatus = new ArrayList<>();

		for (Object result : eachAndEveryEffort) {
		    if (result instanceof Object[]) {
		        Object[] row = (Object[]) result;

		        if (row.length >= 4) {
		        	eachAndEveryWeek.add(row[0]);
		        	eachAndEveryOnlyEffort.add(row[1]);
		        	eachAndEveryProject.add(row[2]);
		        	eachAndEveryStatus.add(row[3]);
		        }
		    }
		}
		List<Object> eachAndEveryOnlyEffortHHMM = convertToHHMM(eachAndEveryOnlyEffort);
        model.addAttribute("eachAndEveryWeek", eachAndEveryWeek);
        model.addAttribute("eachAndEveryOnlyEffort", eachAndEveryOnlyEffortHHMM);
        model.addAttribute("eachAndEveryProject", eachAndEveryProject);
        model.addAttribute("eachAndEveryStatus", eachAndEveryStatus);
        
		return "timesheethome";
	}
	
	@RequestMapping(path = "/calenderSelectedMonthYear", method = RequestMethod.POST)
	public String calenderSelectedMonth(@RequestParam String calenderSelectedMonth, @RequestParam Integer calenderSelectedYear, @RequestParam Integer selectedDateNumber, @RequestParam Integer userId, Model model){
		//COMMON THINGHS
				
		String userName = this.employeeMasterService.getEmpName(userId);
		List<String> projectNamesByUserId = this.employeeRoleMstService.getProjectNames(userId) != null ?
		        this.employeeRoleMstService.getProjectNames(userId) : new ArrayList<>();
		List<Integer> projectIdsByUserId = this.employeeRoleMstService.getProjectIds(userId) != null ?
		        this.employeeRoleMstService.getProjectIds(userId) : new ArrayList<>();
		   
		long groupIdByUserId = this.employeeMasterService.getGroupId(userId);
		
		model.addAttribute("empId", userId);
		model.addAttribute("userName", userName);
		model.addAttribute("projectNames", projectNamesByUserId);
		model.addAttribute("projectIds", projectIdsByUserId);
		model.addAttribute("groupId",groupIdByUserId);
		
		//Color for calendar
		List<String> calendarColor = new ArrayList<String>();/*["#ACDDDE", "#CAF1DE", "#E1F8DC", "#FEF8DD", "#FFE7C7"];*/
		calendarColor.add("#ACDDDE");
		calendarColor.add("#CAF1DE");
		calendarColor.add("#E1F8DC");
		calendarColor.add("#FEF8DD");
		calendarColor.add("#FFE7C7");
		calendarColor.add("#F7D8BA");
		model.addAttribute("calendarColor", calendarColor);
		
		//code for sending misc acivity at frontend
		List<String> miscActivityNames = this.miscActivityMasterService.getMiscActivityNames() != null ?
				this.miscActivityMasterService.getMiscActivityNames() : new ArrayList<>();
	
		List<Integer> miscActivityIds = this.miscActivityMasterService.getMiscActivityIds() != null ?
				this.miscActivityMasterService.getMiscActivityIds() : new ArrayList<>();
				
		model.addAttribute("miscActivityNames", miscActivityNames);
		model.addAttribute("miscActivityIds", miscActivityIds);
		
		//Calculating active week number i.e. current week number for disabling other week inputs
		// Get the current date
        LocalDate currentDatetoFindActiveWeekNumber = LocalDate.now();

        // Get the week number using ISO week fields
        int activeWeekNumber = currentDatetoFindActiveWeekNumber.get(WeekFields.of(Locale.getDefault()).weekOfWeekBasedYear());
        model.addAttribute("activeWeekNumber",activeWeekNumber);
        
       //COMMON THINGHS END
		
		int calenderSelectedMonthInt;
		switch (calenderSelectedMonth.toLowerCase()) {
		    case "january":
		    	calenderSelectedMonthInt = 1;
		        break;
		    case "february":
		    	calenderSelectedMonthInt = 2;
		        break;
		    case "march":
		    	calenderSelectedMonthInt = 3;
		        break;
		    case "april":
		    	calenderSelectedMonthInt = 4;
		        break;
		    case "may":
		    	calenderSelectedMonthInt = 5;
		        break;
		    case "june":
		    	calenderSelectedMonthInt = 6;
		        break;
		    case "july":
		    	calenderSelectedMonthInt = 7;
		        break;
		    case "august":
		    	calenderSelectedMonthInt = 8;
		        break;
		    case "september":
		    	calenderSelectedMonthInt = 9;
		        break;
		    case "october":
		    	calenderSelectedMonthInt = 10;
		        break;
		    case "november":
		    	calenderSelectedMonthInt = 11;
		        break;
		    case "december":
		    	calenderSelectedMonthInt = 12;
		        break;
		    default:
		        throw new IllegalArgumentException("Invalid month: " + calenderSelectedMonth);
		}
		
		LocalDate selectedLocalDate = LocalDate.of(calenderSelectedYear, calenderSelectedMonthInt, selectedDateNumber);
		    
		 	// Calculate the start date of the week
		LocalDate startDate = selectedLocalDate.with(DayOfWeek.MONDAY);

		model.addAttribute("selectedDate", selectedLocalDate);
		// Calculate the YearWeek
	    YearWeek yearWeek = YearWeek.from(selectedLocalDate);
	
	    // Get the month name, year, and week number as strings
	    String yearString = String.valueOf(startDate.getYear());
	    String weekNumberString = String.valueOf(yearWeek.getWeek());
	    
	    model.addAttribute("yearSelectDB", yearString);
	    model.addAttribute("weekSelectDB", weekNumberString); //No Use you can remove it
	    
	    List<String> monthNameList = new ArrayList<>();
	    
	    // Loop through each month and add its name to the list
	    for (int i = 1; i <= 12; i++) {
	        Month month1 = Month.of(i);
	        String monthName = month1.getDisplayName(TextStyle.FULL, Locale.ENGLISH);
	        if(!monthName.equalsIgnoreCase(calenderSelectedMonth)){
	        	monthNameList.add(monthName);
	        } 
	    }
	    
	    // Loop through to make year list
	    LocalDate currentDate = LocalDate.now();
	    int year = currentDate.getYear();
	    
	    List<Integer> yearList = new ArrayList<>();
	   
	    for (int i = 0; i <= 2; i++) {
	        if(year!=calenderSelectedYear){
	        	yearList.add(year);
	        }
	        year++;
	    }  
	    
	    List<Integer> dayListCalendar = getDayListCalendar(calenderSelectedMonth, calenderSelectedYear);
	    
	    Integer firstDayNumberCalendar = getFirstDayNumberCalendar(calenderSelectedMonth, calenderSelectedYear);
	    
	    List<Integer> weekNumbersCalendar = getWeekNumbersCalendar(calenderSelectedMonth, calenderSelectedYear);
	    
	    /*if("December".equals(calenderSelectedMonth)){
	    	weekNumbersCalendar = weekNumbersCalendar.subList(0, weekNumbersCalendar.size()-1);
	    }*/
	    model.addAttribute("weekNumbers", weekNumbersCalendar);
	    System.out.println("weekNumbersCalendar " +weekNumbersCalendar);
	    System.out.println("Date " +selectedDateNumber);
	    System.out.println("Month " +calenderSelectedMonth);
	    System.out.println("Year " +calenderSelectedYear);
	    
	    
	    model.addAttribute("monthNameList", monthNameList);
		model.addAttribute("yearList", yearList);
		model.addAttribute("calenderSelectedMonth",calenderSelectedMonth); //added to show on frontend
		model.addAttribute("calenderSelectedYear",calenderSelectedYear); //added to show on frontend
		model.addAttribute("calenderDayList",dayListCalendar); //used in frontend
		model.addAttribute("calenderStartDay",firstDayNumberCalendar); //used in frontend
		model.addAttribute("calenderWeekNumbers",weekNumbersCalendar); //used in frontend
		
		//color coding code
		List<Integer> holidayListDaysCompulsary = this.holidayMasterService.getHolidayList(calenderSelectedMonth, String.valueOf(calenderSelectedYear), 1) != null ?
				this.holidayMasterService.getHolidayList(calenderSelectedMonth, String.valueOf(calenderSelectedYear), 1) : new ArrayList<>();
		List<Integer> holidayListDaysRestricted = this.holidayMasterService.getHolidayList(calenderSelectedMonth, String.valueOf(calenderSelectedYear), 2) != null ?
				this.holidayMasterService.getHolidayList(calenderSelectedMonth, String.valueOf(calenderSelectedYear), 2) : new ArrayList<>();
		
				
		
		model.addAttribute("holidayListDaysCompulsary", holidayListDaysCompulsary);
		model.addAttribute("holidayListDaysRestricted", holidayListDaysRestricted);	
		
		//Printing total effort for each project in UI
		DateUseProjectModelId dateUseProjectModelId = new DateUseProjectModelId();
		dateUseProjectModelId.setEmpId(userId);
		dateUseProjectModelId.setMonthName(calenderSelectedMonth);
		dateUseProjectModelId.setYearName(String.valueOf(calenderSelectedYear));
		List<Object> projectEffort = this.dateUseProjectService.getProjectEffort(dateUseProjectModelId);
		List<Object> keys = new ArrayList<>();
		List<Object> values = new ArrayList<>();

		for (Object result : projectEffort) {
		    if (result instanceof Object[]) {
		        Object[] row = (Object[]) result;

		        if (row.length >= 2) {
		            keys.add(row[0]);
		            values.add(row[1]);
		        }
		    }
		}
		List<Object> valuesHHMM = convertToHHMM(values);
		model.addAttribute("projectIdKeys", keys);
		model.addAttribute("projectEffortValues", valuesHHMM);
		
		//Printing total effort for each activity in UI
		DateUseProjectModelId dateUseProjectModelIdMisc = new DateUseProjectModelId();
		dateUseProjectModelIdMisc.setEmpId(userId);
		dateUseProjectModelIdMisc.setMonthName(calenderSelectedMonth);
		dateUseProjectModelIdMisc.setYearName(String.valueOf(calenderSelectedYear));
		List<Object> activityEffort = this.dateUseProjectService.getActivityEffort(dateUseProjectModelIdMisc);
		List<Object> keysMisc = new ArrayList<>();
		List<Object> valuesMisc = new ArrayList<>();

		for (Object result : activityEffort) {
		    if (result instanceof Object[]) {
		        Object[] row = (Object[]) result;

		        if (row.length >= 2) {
		            keysMisc.add(row[0]);
		            valuesMisc.add(row[1]);
		        }
		    }
		}
		List<Object> valuesMiscHHMM = convertToHHMM(valuesMisc);
		model.addAttribute("activityIdKeys", keysMisc);
		model.addAttribute("activityEffortValues", valuesMiscHHMM);
				
		//Printing total effort for each week in UI
		DateUseModelId dateUseModelId = new DateUseModelId();
		dateUseModelId.setEmpId(userId);
		dateUseModelId.setMonthName(calenderSelectedMonth);
		dateUseModelId.setYearName(String.valueOf(calenderSelectedYear));
		List<Object> weeksEffort = this.dateUseService.getWeeksEffort(dateUseModelId);
		List<Object> keys1 = new ArrayList<>();
		List<Object> values1 = new ArrayList<>();

		for (Object result : weeksEffort) {
		    if (result instanceof Object[]) {
		        Object[] row = (Object[]) result;

		        if (row.length >= 2) {
		            keys1.add(row[0]);
		            values1.add(row[1]);
		        }
		    }
		}
		List<Object> values1HHMM = convertToHHMM(values1);
		model.addAttribute("weekKeys", keys1);
		model.addAttribute("weekEffortValues", values1HHMM);
		
		//Printing each and every effort on UI
		DateUseProjectModelId dateUseProjectModelIdEachAndEveryEffort = new DateUseProjectModelId();
		dateUseProjectModelIdEachAndEveryEffort.setEmpId(userId);
		dateUseProjectModelIdEachAndEveryEffort.setMonthName(calenderSelectedMonth);
		dateUseProjectModelIdEachAndEveryEffort.setYearName(String.valueOf(calenderSelectedYear));
		List<Object> eachAndEveryEffort = this.dateUseProjectService.getEachAndEveryEffort(dateUseProjectModelIdEachAndEveryEffort);
		
		List<Object> eachAndEveryWeek = new ArrayList<>();
		List<Object> eachAndEveryOnlyEffort = new ArrayList<>();
		List<Object> eachAndEveryProject = new ArrayList<>();
		List<Object> eachAndEveryStatus = new ArrayList<>();

		for (Object result : eachAndEveryEffort) {
		    if (result instanceof Object[]) {
		        Object[] row = (Object[]) result;

		        if (row.length >= 4) {
		        	eachAndEveryWeek.add(row[0]);
		        	eachAndEveryOnlyEffort.add(row[1]);
		        	eachAndEveryProject.add(row[2]);
		        	eachAndEveryStatus.add(row[3]);
		        }
		    }
		}

		List<Object> eachAndEveryOnlyEffortHHMM = convertToHHMM(eachAndEveryOnlyEffort);
        model.addAttribute("eachAndEveryWeek", eachAndEveryWeek);
        model.addAttribute("eachAndEveryOnlyEffort", eachAndEveryOnlyEffortHHMM);
        model.addAttribute("eachAndEveryProject", eachAndEveryProject);
        model.addAttribute("eachAndEveryStatus", eachAndEveryStatus);
		return "timesheethome";
	}
	
	@RequestMapping(path = "/weeksubmit", method = RequestMethod.POST)
	public String weekSubmission(/*@RequestParam Integer weekNumberSubmitted, */ @ModelAttribute WeekSubmitModel weekSubmitModel/*, @RequestParam String yearSelectDB, @RequestParam List<String> weekEffort, @RequestParam String todaysDate, @RequestParam String selectedDate, @RequestParam Integer employeeIdDB, @RequestParam String employeeNameDB, @RequestParam long groupIdDB, @RequestParam String weekNumbers, @RequestParam String projectIds, @RequestParam String miscActivityIds*/ ){
				
		String dateSelected = null;
		if(weekSubmitModel.getSelectedDate().isEmpty()) {
			dateSelected = weekSubmitModel.getTodaysDate();
		}else {
			dateSelected = weekSubmitModel.getSelectedDate();
		}
		
		String[] elements = weekSubmitModel.getWeekNumbers().substring(1, weekSubmitModel.getWeekNumbers().length() - 1).split(",");

        // Convert to a list of integers
        List<Integer> weekNumbersIntegerList = Arrays.stream(elements)
                .map(String::trim) // Remove leading/trailing spaces
                .map(Integer::parseInt)
                .collect(Collectors.toList());
		int interval = weekNumbersIntegerList.size();
		List<List<String>> seperateWeekEffort = new ArrayList<>();
		for (int startIndex = 0; startIndex < interval; startIndex++) {
            List<String> innerList = new ArrayList<>();
            for (int i = startIndex; i < weekSubmitModel.getWeekEffort().size(); i += interval) {
                innerList.add(weekSubmitModel.getWeekEffort().get(i));
            }
            seperateWeekEffort.add(innerList);
	    }
		
		List<Long> projectIdsDB = new ArrayList<Long>();
		
		if(!weekSubmitModel.getProjectIds().equalsIgnoreCase("[]")){
			String[] elements1 = weekSubmitModel.getProjectIds().substring(1, weekSubmitModel.getProjectIds().length() - 1).split(",");
	        // Convert to a list of integers
	        List<Integer> intProjectIdsDB = Arrays.stream(elements1)
	                .map(String::trim) // Remove leading/trailing spaces
	                .map(Integer::parseInt)
	                .collect(Collectors.toList());
	        
	       projectIdsDB = intProjectIdsDB.stream()
	                .map(Long::valueOf)
	                .collect(Collectors.toList());
		}
		
		for (int p = 0; p < seperateWeekEffort.size(); p++) {
	        // Get the first day of the specified week
	        LocalDate firstDayOfWeek = LocalDate.of(Integer.parseInt(weekSubmitModel.getYearSelectDB()), 1, 1)
	                .with(WeekFields.ISO.weekOfYear(), weekNumbersIntegerList.get(p))
	                .with(WeekFields.ISO.dayOfWeek(), 1);
	
	        // Get the month name from the first day of the week
	        String monthSelectDB = YearMonth.from(firstDayOfWeek).getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH);
	        String weekSelectDB = Integer.toString(weekNumbersIntegerList.get(p));
	       
	        //saving data to date use project table - project
	        int i =0;
	        while (i < projectIdsDB.size()) {
	        	if(seperateWeekEffort.get(p).get(i).isEmpty()==false){
	        		DateUseProjectModelId dateUseProjectModelId = new DateUseProjectModelId();
	        		dateUseProjectModelId.setEmpId(weekSubmitModel.getEmployeeIdDB());
	        		dateUseProjectModelId.setMonthName(monthSelectDB);
	        		dateUseProjectModelId.setWeekName(weekSelectDB);
	        		dateUseProjectModelId.setProjectId(projectIdsDB.get(i));
	        		dateUseProjectModelId.setYearName(weekSubmitModel.getYearSelectDB());
	        		dateUseProjectModelId.setStatus("p");
	        		DateUseProjectModel dateUseProjectModel = new DateUseProjectModel();
	        		dateUseProjectModel.setId(dateUseProjectModelId);
	        		int totalMinutes = convertToMinutes(seperateWeekEffort.get(p).get(i));
	        		dateUseProjectModel.setTotalEffortProject(String.valueOf(totalMinutes));
	        		dateUseProjectModel.setIsValid(1);
	        		dateUseProjectModel.setTransactionTime(LocalDate.now());
	        		
	        		Integer employeeID = this.dateUseProjectService.saveDateUseProject(dateUseProjectModel);
	        		System.out.println("Emplyoee with ID " + employeeID + " inserted in Date Use Project Table - Project");
	        		
	        	}else{
	        		DateUseProjectModelId dateUseProjectModelId = new DateUseProjectModelId();
	        		dateUseProjectModelId.setEmpId(weekSubmitModel.getEmployeeIdDB());
	        		dateUseProjectModelId.setMonthName(monthSelectDB);
	        		dateUseProjectModelId.setWeekName(weekSelectDB);
	        		dateUseProjectModelId.setProjectId(projectIdsDB.get(i));
	        		dateUseProjectModelId.setYearName(weekSubmitModel.getYearSelectDB());
	        		dateUseProjectModelId.setStatus("p");
	        		DateUseProjectModel dateUseProjectModel = new DateUseProjectModel();
	        		dateUseProjectModel.setId(dateUseProjectModelId);
	        		dateUseProjectModel.setTotalEffortProject("0");
	        		dateUseProjectModel.setIsValid(0);
	        		dateUseProjectModel.setTransactionTime(LocalDate.now());
	        		
	        		Integer employeeID = this.dateUseProjectService.saveDateUseProject(dateUseProjectModel);
	        		System.out.println("Emplyoee with ID " + employeeID + " inserted in Date Use Project Table - Project");
	        	}
	        	i++;
	            
	        }
	        
	        //saving data to date use project table - activity
	        String[] elements2 = weekSubmitModel.getMiscActivityIds().substring(1, weekSubmitModel.getMiscActivityIds().length() - 1).split(",");
	        // Convert to a list of integers
	        List<Integer> intActivityIdsDB = Arrays.stream(elements2)
	                .map(String::trim) // Remove leading/trailing spaces
	                .map(Integer::parseInt)
	                .collect(Collectors.toList());
	        
	        List<Long> activityIdsDB = intActivityIdsDB.stream()
	                .map(Long::valueOf)
	                .collect(Collectors.toList());
	        
	        for (int j = 0; j < activityIdsDB.size(); j++) {
	        	if(seperateWeekEffort.get(p).get(i+j).isEmpty()==false){
	        		DateUseProjectModelId dateUseProjectModelId = new DateUseProjectModelId();
	        		dateUseProjectModelId.setEmpId(weekSubmitModel.getEmployeeIdDB());
	        		dateUseProjectModelId.setMonthName(monthSelectDB);
	        		dateUseProjectModelId.setWeekName(weekSelectDB);
	        		dateUseProjectModelId.setProjectId(activityIdsDB.get(j));
	        		dateUseProjectModelId.setYearName(weekSubmitModel.getYearSelectDB());
	        		dateUseProjectModelId.setStatus("m");
	        		DateUseProjectModel dateUseProjectModel = new DateUseProjectModel();
	        		dateUseProjectModel.setId(dateUseProjectModelId);
	        		int totalMinutes = convertToMinutes(seperateWeekEffort.get(p).get(i+j));
	        		dateUseProjectModel.setTotalEffortProject(String.valueOf(totalMinutes));
	        		dateUseProjectModel.setIsValid(1);
	        		dateUseProjectModel.setTransactionTime(LocalDate.now());
	        		
	        		Integer employeeID = this.dateUseProjectService.saveDateUseProject(dateUseProjectModel);
	        		System.out.println("Emplyoee with ID " + employeeID + " inserted in Date Use Project Table - Activity");
	        		
	        	}else{
	        		DateUseProjectModelId dateUseProjectModelId = new DateUseProjectModelId();
	        		dateUseProjectModelId.setEmpId(weekSubmitModel.getEmployeeIdDB());
	        		dateUseProjectModelId.setMonthName(monthSelectDB);
	        		dateUseProjectModelId.setWeekName(weekSelectDB);
	        		dateUseProjectModelId.setProjectId(activityIdsDB.get(j));
	        		dateUseProjectModelId.setYearName(weekSubmitModel.getYearSelectDB());
	        		dateUseProjectModelId.setStatus("m");
	        		DateUseProjectModel dateUseProjectModel = new DateUseProjectModel();
	        		dateUseProjectModel.setId(dateUseProjectModelId);
	        		dateUseProjectModel.setTotalEffortProject("0");
	        		dateUseProjectModel.setIsValid(0);
	        		dateUseProjectModel.setTransactionTime(LocalDate.now());
	        		
	        		Integer employeeID = this.dateUseProjectService.saveDateUseProject(dateUseProjectModel);
	        		System.out.println("Emplyoee with ID " + employeeID + " inserted in Date Use Project Table - Activity");
	        	}
	            
	        }
	        
	        
	        boolean containsEmptyString = false;

	        for (String str : seperateWeekEffort.get(p)) {
	            if (!str.isEmpty()) {
	                containsEmptyString = true;
	                break; // No need to continue checking once an empty string is found
	            }
	        }
	        
	        if(containsEmptyString){
		        //saving data to Date use table
		        DateUseModelId dateUseModelId = new DateUseModelId();
		        dateUseModelId.setEmpId(weekSubmitModel.getEmployeeIdDB());
		        dateUseModelId.setMonthName(monthSelectDB);
		        dateUseModelId.setWeekName(weekSelectDB);
		        dateUseModelId.setYearName(weekSubmitModel.getYearSelectDB());
		        DateUseModel dateUseModel = new DateUseModel();
		        dateUseModel.setId(dateUseModelId);
		        dateUseModel.setEmployeeName(weekSubmitModel.getEmployeeNameDB());
		        dateUseModel.setGroupId(weekSubmitModel.getGroupIdDB());
		        
		        DateUseProjectModelId dateUseProjectModelId = new DateUseProjectModelId();
				dateUseProjectModelId.setEmpId(weekSubmitModel.getEmployeeIdDB());
				dateUseProjectModelId.setMonthName(monthSelectDB);
				dateUseProjectModelId.setWeekName(weekSelectDB);
				dateUseProjectModelId.setYearName(weekSubmitModel.getYearSelectDB());
				List<String> weekEffortDB1 = dateUseProjectService.getWeekEffort(dateUseProjectModelId);
				int sum = 0;
		        for (String str : weekEffortDB1) {
		            Integer number = Integer.parseInt(str);
		            sum += number;
		        }
		        String strSum = String.valueOf(sum);
		        dateUseModel.setTotalEffortWeek(strSum);
		        dateUseModel.setIsValid(1);
		        dateUseModel.setTransactionTime(LocalDate.now());
		        
		        
		        Integer employeeId = this.dateUseService.saveDateUse(dateUseModel);
		        
		        System.out.println("Emplyoee with ID " + employeeId + " inserted in Date Use Table");
	        }else{
	        	//saving data to Date use table
		        DateUseModelId dateUseModelId = new DateUseModelId();
		        dateUseModelId.setEmpId(weekSubmitModel.getEmployeeIdDB());
		        dateUseModelId.setMonthName(monthSelectDB);
		        dateUseModelId.setWeekName(weekSelectDB);
		        dateUseModelId.setYearName(weekSubmitModel.getYearSelectDB());
		        DateUseModel dateUseModel = new DateUseModel();
		        dateUseModel.setId(dateUseModelId);
		        dateUseModel.setEmployeeName(weekSubmitModel.getEmployeeNameDB());
		        dateUseModel.setGroupId(weekSubmitModel.getGroupIdDB());
		        dateUseModel.setTotalEffortWeek("0");
		        dateUseModel.setIsValid(0);
		        dateUseModel.setTransactionTime(LocalDate.now());
		        
		        
		        Integer employeeId = this.dateUseService.saveDateUse(dateUseModel);
		        
		        System.out.println("Emplyoee with ID " + employeeId + " inserted in Date Use Table");
	        }
		}
		return "redirect:/timesheethome";
	}
		
	
	public static List<Integer> getDayListCalendar(String calenderSelectedMonth, int calenderSelectedYear) {
		 // Get the month name, year, and week number as strings
	    List<Integer> dayList = new ArrayList<>();

        // Parse the month name to a LocalDate object
        LocalDate firstDayOfMonth = LocalDate.parse("01 " + calenderSelectedMonth + " " + calenderSelectedYear,
                DateTimeFormatter.ofPattern("dd MMMM yyyy"));

        // Determine the number of days in the month
        int daysInMonth = firstDayOfMonth.lengthOfMonth();

        // Populate the list with day numbers
        for (int day = 1; day <= daysInMonth; day++) {
            dayList.add(day);
        }

        return dayList;
    }
	
	public static Integer getFirstDayNumberCalendar(String calenderSelectedMonth, int calenderSelectedYear) {
		//Parse month name to Month enum
        Month month = Month.valueOf(calenderSelectedMonth.toUpperCase());

        // Create a LocalDate for the first day of the month
        LocalDate firstDayOfMonthCalendar = LocalDate.of(calenderSelectedYear, month, 1);

        // Get the DayOfWeek for the first day
        DayOfWeek firstDayOfWeek = firstDayOfMonthCalendar.getDayOfWeek();

        // Get the numeric value of the DayOfWeek (1 for Monday, 2 for Tuesday, and so on)
        int firstDayNumber = firstDayOfWeek.getValue();
        return firstDayNumber;
    }
	
	public static List<Integer> getWeekNumbersCalendar(String monthName, int year) {
        // Convert month name to month index
        int monthIndex = getMonthIndex(monthName);

        // Create a LocalDate for the first day of the month
        LocalDate firstDayOfMonth = LocalDate.of(year, monthIndex, 1);

        // Get the week fields based on the default locale
        WeekFields weekFields = WeekFields.of(Locale.getDefault());

        // Initialize the list to store week numbers
        List<Integer> weekNumbers = new ArrayList<>();

        // Iterate through the days of the month and collect week numbers
        for (int day = 1; day <= YearMonth.of(year, monthIndex).lengthOfMonth(); day++) {
            LocalDate date = LocalDate.of(year, monthIndex, day);
            int weekNumber = date.get(weekFields.weekOfWeekBasedYear());

            // Add the week number to the list if it's not already present
            if (!weekNumbers.contains(weekNumber)) {
                weekNumbers.add(weekNumber);
            }
        }

        return weekNumbers;
    }

    private static int getMonthIndex(String monthName) {
        // Convert month name to month index
        String[] months = new DateFormatSymbols(Locale.getDefault()).getMonths();
        for (int i = 0; i < months.length; i++) {
            if (months[i].equalsIgnoreCase(monthName)) {
                // Month index is 0-based in DateFormatSymbols, while YearMonth is 1-based
                return i + 1;
            }
        }
        throw new IllegalArgumentException("Invalid month name: " + monthName);
    }
    
    public static int convertToMinutes(String timeString) {
        try {
            String[] parts = timeString.split(":");
            int hours = Integer.parseInt(parts[0]);
            int minutes = Integer.parseInt(parts[1]);
            
            return hours * 60 + minutes;
        } catch (NumberFormatException | ArrayIndexOutOfBoundsException e) {
            // Handle the exception based on your requirements
            e.printStackTrace(); // or log the error
            return 0; // Default value or throw an exception
        }
    }
    
    public static List<Object> convertToHHMM(List<Object> minutesList) {
        List<Object> hhmmList = new ArrayList<>();

        for (Object minutesObject : minutesList) {
            try {
                double totalMinutes = Double.parseDouble(minutesObject.toString());
                int hours = (int) totalMinutes / 60;
                int minutes = (int) totalMinutes % 60;
                String hhmmString = String.format("%02d:%02d", hours, minutes);
                hhmmList.add(hhmmString);
            } catch (NumberFormatException e) {
                // Handle the exception based on your requirements
                e.printStackTrace(); // or log the error
                hhmmList.add(""); // Default value or throw an exception
            }
        }

        return hhmmList;
    }

    
   
	//REport WORK
	
    @RequestMapping("/reports")
	public String reports(/*@PathVariable("reportYear") String reportYear,*/ Model model) {
    	
    	//R1 - Finding Employee details under GC
    	Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        UserInfo userInfo = (UserInfo) authentication.getPrincipal();
        int userId = userInfo.getEmployeeId();
        
        	//finding group id
		long groupIdByUserId = this.employeeMasterService.getGroupId(userId);
		
			//finding employee Names and employee ids using group ids
		List<String> empNamesByGroupId = this.employeeMasterService.getEmpNamesByGroupId(groupIdByUserId);
		List<Long> empIdsByGroupId = this.employeeMasterService.getEmpIdsByGroupId(groupIdByUserId);
		System.out.println("Names" +empNamesByGroupId);
		System.out.println("Ids" +empIdsByGroupId);
		model.addAttribute("EmpNames", empNamesByGroupId);
		model.addAttribute("EmpIds", empIdsByGroupId);
		
        	//finding current year for reporting
		LocalDate currentDate = LocalDate.now();
        int currentYear = currentDate.getYear();
     	return "reports";
    }
    
	
    
    
    @RequestMapping("/employeeSelectReport")
	public String employeeSelectReport(@RequestParam String selectedEmpIdName, Model model) {
    	
    	//R1 - Finding Employee details under GC
    		// Print or use the selectedEmpId as needed
        System.out.println("Selected Employee ID: " + selectedEmpIdName);
        	// Extract number as long
        long selectedEmpId = Long.parseLong(selectedEmpIdName.split("\\+")[0]);

        	// Extract text as string
        String selectedEmpName = selectedEmpIdName.split("\\+")[1];
        model.addAttribute("selectedEmpName", selectedEmpName);
        
        	//Finding user id
    	Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        UserInfo userInfo = (UserInfo) authentication.getPrincipal();
        int userId = userInfo.getEmployeeId();
        
        	//finding group id
		long groupIdByUserId = this.employeeMasterService.getGroupId(userId);
		
			//finding employee Names and employee ids using group ids
		List<String> empNamesByGroupId = this.employeeMasterService.getEmpNamesByGroupId(groupIdByUserId);
		List<Long> empIdsByGroupId = this.employeeMasterService.getEmpIdsByGroupId(groupIdByUserId);
		empNamesByGroupId.remove(selectedEmpName);
		empIdsByGroupId.remove(selectedEmpId);
		model.addAttribute("EmpNames", empNamesByGroupId);
		model.addAttribute("EmpIds", empIdsByGroupId);
		/*System.out.println("Filtered Names" +empNamesByGroupId);
		System.out.println("Filtered Ids" +empIdsByGroupId);*/
        	//finding current year for reporting
		LocalDate currentDate = LocalDate.now();
        int currentYear = currentDate.getYear();
    	
        //R2   -    LOGGED IN USER PROJECT WISE REPORT
        DateUseProjectModelId dateUseProjectModelId = new DateUseProjectModelId();
		dateUseProjectModelId.setEmpId((int)selectedEmpId);
		dateUseProjectModelId.setYearName(String.valueOf(currentYear));
		List<Object> userProjectWiseReport = this.dateUseProjectService.reportUserProjectWiseEffort(dateUseProjectModelId);
		List<Object> xValues2 = new ArrayList<>();
		List<Object> yValues2 = new ArrayList<>();

		for (Object result : userProjectWiseReport) {
		    if (result instanceof Object[]) {
		        Object[] row = (Object[]) result;

		        if (row.length >= 2) {
		        	xValues2.add(row[0]);
		        	yValues2.add(row[1]);
		        }
		    }
		}
		
		List<String> miscActivityEffort = this.dateUseProjectService.reportMiscActivityTotalEffort(dateUseProjectModelId);
		int miscActivityTotalEffort = 0;

        for (String str : miscActivityEffort) {
            try {
                int num = Integer.parseInt(str);
                miscActivityTotalEffort += num;
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Invalid numeric value in the list");
            }
        }
        
        xValues2.add("Miscellaneous Activity");
        yValues2.add(miscActivityTotalEffort);
		System.out.println("xValues2 "+xValues2);
		System.out.println("yValues2 "+yValues2);
		model.addAttribute("xValues2", xValues2);
		model.addAttribute("yValues2", yValues2);
        
		//R3   -    LOGGED IN USER MONTH WISE REPORT
    	DateUseModelId dateUseModelId1 = new DateUseModelId();
    	dateUseModelId1.setEmpId((int)selectedEmpId);
    	dateUseModelId1.setYearName(String.valueOf(currentYear));
    	//dateUseModelId1.setYearName("2023");
    	List<Object> userMonthlyReport = this.dateUseService.reportUserMonthWiseEffort(dateUseModelId1);
    	//System.out.println("Grouping" +userMonthlyReport);
		List<Object> xValues1 = new ArrayList<>();
		List<Object> yValues1 = new ArrayList<>();
		
        
		for (Object result : userMonthlyReport) {
		    if (result instanceof Object[]) {
		        Object[] row = (Object[]) result;

		        if (row.length >= 2) {
		        	xValues1.add(row[0]);
		        	yValues1.add(row[1]);
		        }
		    }
		}        
        
        
		System.out.println("xValues1 "+xValues1);
		System.out.println("yValues1 "+yValues1);
		model.addAttribute("xValues1", xValues1);
		model.addAttribute("yValues1", yValues1);
		
		//R4   -    LOGGED IN USER ACTIVITY WISE REPORT
		
		DateUseProjectModelId dateUseProjectModelIdMisc = new DateUseProjectModelId();
		dateUseProjectModelIdMisc.setEmpId((int)selectedEmpId);
		dateUseProjectModelIdMisc.setYearName(String.valueOf(currentYear));
		List<Object> userActivityWiseReport = this.dateUseProjectService.reportUserActivityWiseEffort(dateUseProjectModelIdMisc);
		List<Object> xValues3 = new ArrayList<>();
		List<Object> yValues3 = new ArrayList<>();

		for (Object result : userActivityWiseReport) {
		    if (result instanceof Object[]) {
		        Object[] row = (Object[]) result;

		        if (row.length >= 2) {
		        	xValues3.add(row[0]);
		        	yValues3.add(row[1]);
		        }
		    }
		}
		
		System.out.println("xValues3 "+xValues3);
		System.out.println("yValues3 "+yValues3);
		model.addAttribute("xValues3", xValues3);
		model.addAttribute("yValues3", yValues3);
		
		//R5	-	LOGGED IN USER PROJECT-MONTH WISE REPORT
		List<String> projectNamesByUserId = this.employeeRoleMstService.getProjectNames((int)selectedEmpId) != null ?
		        this.employeeRoleMstService.getProjectNames((int)selectedEmpId) : new ArrayList<>();
        List<Integer> projectIdsByUserId = this.employeeRoleMstService.getProjectIds((int)selectedEmpId) != null ?
		        this.employeeRoleMstService.getProjectIds((int)selectedEmpId) : new ArrayList<>();
		List<List<Integer>> everyProjectMonthWiseReport = new ArrayList<List<Integer>>();
		for(int i = 0; i<projectIdsByUserId.size();i++){
			DateUseProjectModelId dateUseProjectModelIdPM = new DateUseProjectModelId();
			dateUseProjectModelIdPM.setEmpId((int)selectedEmpId);
			dateUseProjectModelIdPM.setProjectId(projectIdsByUserId.get(i));
			dateUseProjectModelIdPM.setYearName(String.valueOf(currentYear));
			
			List<Integer> singleProjectMonthWiseReport = this.dateUseProjectService.reportProjectMonthEffort(dateUseProjectModelIdPM);
			everyProjectMonthWiseReport.add(singleProjectMonthWiseReport);
		}
		
		System.out.println("ddddre"+projectIdsByUserId+projectNamesByUserId);
		System.out.println("fdhgdjkg"+everyProjectMonthWiseReport);
		model.addAttribute("projectNamesByUserId", projectNamesByUserId);
		model.addAttribute("everyProjectMonthWiseReport", everyProjectMonthWiseReport);
    	return "reports";
    }
}