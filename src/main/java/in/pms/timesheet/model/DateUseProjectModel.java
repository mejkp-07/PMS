package in.pms.timesheet.model;

import java.sql.Date;
import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "pms_date_use_project")
public class DateUseProjectModel {
	@EmbeddedId
    private DateUseProjectModelId id;
	
	@Column(name="str_project_effort")
	private String totalEffortProject;
	
	@Column(name="dt_tr_date")
	private LocalDate transactionTime;
	
	@Column(name="num_isvalid")
	private Integer isValid;
	
	
	public DateUseProjectModelId getId() {
		return id;
	}

	public void setId(DateUseProjectModelId id) {
		this.id = id;
	}

	public String getTotalEffortProject() {
		return totalEffortProject;
	}

	public void setTotalEffortProject(String totalEffortProject) {
		this.totalEffortProject = totalEffortProject;
	}
	
	
	public LocalDate getTransactionTime() {
		return transactionTime;
	}

	public void setTransactionTime(LocalDate transactionTime) {
		this.transactionTime = transactionTime;
	}

	public Integer getIsValid() {
		return isValid;
	}

	public void setIsValid(Integer isValid) {
		this.isValid = isValid;
	}

	@Override
	public String toString() {
		return "DateUseProjectModel [id=" + id + ", totalEffortProject="
				+ totalEffortProject + ", transactionTime=" + transactionTime
				+ ", isValid=" + isValid + "]";
	}

	
	
}
