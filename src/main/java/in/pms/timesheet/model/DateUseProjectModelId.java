package in.pms.timesheet.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class DateUseProjectModelId implements Serializable{
	@Column(name = "emp_id", length = 10)
    private Integer empId;

    @Column(name = "str_month", length = 150)
    private String monthName;
    
    @Column(name = "str_week", length = 150)
    private String weekName;
    
    @Column(name = "num_project_id_fk", length = 150)
    private long projectId;

    @Column(name = "str_year", length = 150)
    private String yearName;
    
    @Column(name = "status")
    private String status;

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

	public long getProjectId() {
		return projectId;
	}

	public void setProjectId(long projectId) {
		this.projectId = projectId;
	}

	public String getYearName() {
		return yearName;
	}

	public void setYearName(String yearName) {
		this.yearName = yearName;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	@Override
	public String toString() {
		return "DateUseProjectModelId [empId=" + empId + ", monthName="
				+ monthName + ", weekName=" + weekName + ", projectId="
				+ projectId + ", yearName=" + yearName + ", status=" + status
				+ "]";
	} 
}
