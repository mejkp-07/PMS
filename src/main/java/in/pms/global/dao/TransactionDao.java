package in.pms.global.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import in.pms.global.domain.TransactionMasterDomain;

@Repository
public interface TransactionDao  extends JpaRepository<TransactionMasterDomain, Long>{

	@Query("from TransactionMasterDomain t join fetch t.employeeMasterDomain where t.monthlyProgressDomain.numId=:monthlyProgressId and t.numIsValid=1")
	List<TransactionMasterDomain> getTransactionDetails(@Param("monthlyProgressId") int numMonthlyProgressId);

	@Transactional
    @Modifying
	@Query(nativeQuery=true,value="update pms_transaction_master set num_isvalid=0 where num_monthly_progress_id_fk=:monthlyProgressId")
	void updateAllRowsWithNumIsValidZero(@Param("monthlyProgressId") int numMonthlyProgressId);
	
	@Query("from TransactionMasterDomain t join fetch t.employeeMasterDomain where t.monthlyProgressDomain.numId=:monthlyProgressId order by t.dtTrDate desc")
	List<TransactionMasterDomain> getProceedingDetails(@Param("monthlyProgressId") int numMonthlyProgressId);

	
	@Query("from TransactionMasterDomain t join fetch t.employeeMasterDomain where t.customId=:customId and t.workflowMasterDomain.numWorkflowId=:workflowId and t.numIsValid=1")
	List<TransactionMasterDomain> getLatestTransactionDetails(@Param("customId") int customId,@Param("workflowId") Long workflowId);

	@Transactional
    @Modifying
	@Query(nativeQuery=true,value="update pms_transaction_master set num_isvalid=0 where num_custom_id=:num_custom_id and num_workflow_type_id_fk=:num_workflow_type_id")
	void updateAllRowsWithNumIsValidZero(@Param("num_custom_id") int numCustomId, @Param("num_workflow_type_id") long workflowId);
	
	@Query(value="select ptm.dt_tr_date, ptm.str_remarks,ptm.num_action_id_fk, pem.str_emp_name, pam.str_name , pam.str_action_performed from pms_transaction_master ptm,pms_employee_master pem, pms_action_master pam where ptm.num_isvalid  in (0,1) and ptm.num_emp_id_fk = pem.emp_id and ptm.num_action_id_fk = pam.num_action_id and ptm.num_workflow_type_id_fk =:workflowId and num_custom_id=:customId order by ptm.dt_tr_date desc", nativeQuery= true)
	List<Object[]> getTransactionDetails(@Param("customId")int customId,@Param("workflowId") int workflowId);

}
