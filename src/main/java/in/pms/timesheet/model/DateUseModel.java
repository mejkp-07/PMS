package in.pms.timesheet.model;

import java.io.Serializable;
import java.sql.Date;
import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "pms_date_use")
public class DateUseModel implements Serializable {
	
	@EmbeddedId
    private DateUseModelId id;
	
	@Column(name="str_total_effort_week")
	private String totalEffortWeek;
	
	@Column(name="group_id_fk",length=12)
	private long groupId;
	
	@Column(name="str_emp_name")
	private String employeeName;
	
	@Column(name="num_isvalid")
	private Integer isValid;
	
	@Column(name="dt_tr_date")
	private LocalDate transactionTime;

	public DateUseModelId getId() {
		return id;
	}

	public void setId(DateUseModelId id) {
		this.id = id;
	}

	public String getTotalEffortWeek() {
		return totalEffortWeek;
	}

	public void setTotalEffortWeek(String totalEffortWeek) {
		this.totalEffortWeek = totalEffortWeek;
	}

	public long getGroupId() {
		return groupId;
	}

	public void setGroupId(long groupId) {
		this.groupId = groupId;
	}

	public String getEmployeeName() {
		return employeeName;
	}

	public void setEmployeeName(String employeeName) {
		this.employeeName = employeeName;
	}
	
	public Integer getIsValid() {
		return isValid;
	}

	public void setIsValid(Integer isValid) {
		this.isValid = isValid;
	}

	public LocalDate getTransactionTime() {
		return transactionTime;
	}

	public void setTransactionTime(LocalDate transactionTime) {
		this.transactionTime = transactionTime;
	}

	@Override
	public String toString() {
		return "DateUseModel [id=" + id + ", totalEffortWeek="
				+ totalEffortWeek + ", groupId=" + groupId + ", employeeName="
				+ employeeName + ", isValid=" + isValid + ", transactionTime="
				+ transactionTime + "]";
	}

	
	
	
	
}
