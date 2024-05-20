package in.pms.transaction.service;

import in.pms.transaction.domain.DesignationForClient;
import in.pms.transaction.model.DesignationForClientModel;

import java.util.List;

import org.springframework.transaction.annotation.Transactional;

public interface DesignationForClientService {

	@Transactional	
	 public int saveUpdateDesignationMaster(DesignationForClientModel designationForClientModel);		
	
	 public String checkDuplicateDesignationName(DesignationForClientModel designationForClientModel);
	 
	 public DesignationForClient getById(int numId);
	
	 public List<DesignationForClientModel> getActiveDesignationForClient(); 

	 public DesignationForClientModel categorydesignationCost(int projectCategoryId,int designationId);
	 
	 @Transactional
	 public String saveprojectCategorydesignationMapping(DesignationForClientModel model);
	 
	 public List<DesignationForClientModel> getDesignationByCategory(int categoryId);
	 
	 public void designationForClientAuthorityCheck();
	 
	 public void projectCategorydesignationMappingAuthorityCheck();
}
