package in.pms.transaction.domain;

import in.pms.global.domain.TransactionInfoDomain;
import in.pms.master.domain.ProjectCategoryMaster;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.TableGenerator;

import lombok.Data;

@Entity
@Table(name = "project_category_designation_mapping")
@Data
public class DesignationProjectCategoryMapping extends TransactionInfoDomain {
	@Id
	@Column(name = "num_designation_id")
	@GeneratedValue(strategy = GenerationType.TABLE, generator = "DesignationForClient")
	@TableGenerator(name = "DesignationForClient", initialValue = 1, allocationSize = 1)
	private int numId;
	@ManyToOne(optional = false)
	@JoinColumn(name="num_designation_id_fk")
	private DesignationForClient designationForClient;
	@ManyToOne(optional = false)
	@JoinColumn(name="num_category_id_fk")
	private ProjectCategoryMaster projectCategoryMaster;
	private double cost;
}
