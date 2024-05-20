package in.pms.timesheet.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class DateUseModelId implements Serializable{
	@Column(name = "emp_id", length = 10)
    private Integer empId;

    @Column(name = "str_month", length = 150)
    private String monthName;

    @Column(name = "str_week", length = 150)
    private String weekName;

    @Column(name = "str_year", length = 150)
    private String yearName;

	public Integer getEmpId() {
		return empId;
	}

	public void setEmpId(Integer empId) {
		this.empId = empId;
	}

	public String getMonthName() {
		return monthName;
	}

	public void setMonthName(String monthName) {
		this.monthName = monthName;
	}

	public String getWeekName() {
		return weekName;
	}

	public void setWeekName(String weekName) {
		this.weekName = weekName;
	}

	public String getYearName() {
		return yearName;
	}

	public void setYearName(String yearName) {
		this.yearName = yearName;
	}

	@Override
	public String toString() {
		return "DateUseModelId [empId=" + empId + ", monthName=" + monthName
				+ ", weekName=" + weekName + ", yearName=" + yearName + "]";
	}
    
    
}
