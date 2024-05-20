package in.pms.transaction.service;

import in.pms.global.service.EncryptionService;
import in.pms.login.util.UserInfo;
import in.pms.master.domain.ProjectCategoryMaster;
import in.pms.transaction.dao.DesignationForClientDao;
import in.pms.transaction.dao.DesignationProjectCategoryMappingDao;
import in.pms.transaction.domain.DesignationForClient;
import in.pms.transaction.domain.DesignationProjectCategoryMapping;
import in.pms.transaction.model.DesignationForClientModel;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class DesignationForClientServiceImpl implements
		DesignationForClientService {

	@Autowired
	DesignationForClientDao designationForClientDao;
	
	@Autowired
	DesignationProjectCategoryMappingDao designationProjectCategoryMappingDao;
	
	@Autowired
	EncryptionService encryptionService;
	
	@Override
	public int saveUpdateDesignationMaster(DesignationForClientModel model) {
		return designationForClientDao.save(convertModelToDomain(model)).getNumDesignationId();
	}

	@Override
	public String checkDuplicateDesignationName(DesignationForClientModel model) {
		
		String result=	"";
		List<DesignationForClient> designationList = designationForClientDao.getByName(model.getDesignationName());
		DesignationForClient domain = null;
		if(null != designationList && designationList.size()>0){
			domain = designationList.get(0);
		}
		
		 if(null == domain){
				return null; 
		}else if(model.getNumId() != 0){
				 if(domain.getNumDesignationId() == model.getNumId()){
					 return null; 
				 }else{
					 result = "Designation Name already exist with Id  "+domain.getNumDesignationId();
				 }
		}else{
				if(domain.getNumIsValid() == 0){
					result = "Designation Name already exist with Id "+ domain.getNumDesignationId() +". Please activate same record";
				}else{
					result = "Designation Name already exist with Id "+domain.getNumDesignationId();
				}			
			 }
			return result;		
	}

	@Override
	public DesignationForClient getById(int numId) {		
		return designationForClientDao.getOne(numId);
	}

	@Override
	public List<DesignationForClientModel> getActiveDesignationForClient() {		
		return convertDomainToModelList(designationForClientDao.getActiveDesignationForClient());
	}	

	public DesignationForClient convertModelToDomain(DesignationForClientModel model){
		
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		UserInfo userInfo = (UserInfo) authentication.getPrincipal();
		
		DesignationForClient domain = new DesignationForClient();
		if(model.getNumId()!=0){				
			domain =  designationForClientDao.getOne(model.getNumId());
		}
		
		domain.setDtTrDate(new Date());
		domain.setNumTrUserId(userInfo.getEmployeeId());
		if(model.isValid()){
			domain.setNumIsValid(1);
		}else{
			domain.setNumIsValid(0);
		}
		domain.setDesignationName(model.getDesignationName());
		domain.setDesignationShortCode(model.getDesignationShortCode());
		domain.setDescription(model.getDesription());		
		return domain;
	}
	
	List<DesignationForClientModel> convertDomainToModelList(List<DesignationForClient> domainList){
		List<DesignationForClientModel> list = new ArrayList<DesignationForClientModel>();
			for(int i=0;i<domainList.size();i++){
				DesignationForClient domain = domainList.get(i);
				DesignationForClientModel model = new DesignationForClientModel();			
				model.setNumId(domain.getNumDesignationId());
				model.setEncNumId(encryptionService.encrypt(""+domain.getNumDesignationId()));
				if(domain.getNumIsValid() ==1){
					model.setValid(true);
				}else{
					model.setValid(false);
				}
			
		
				model.setDesignationName(domain.getDesignationName());
				model.setDesignationShortCode(domain.getDesignationShortCode());
				model.setDesription(domain.getDescription());				
				list.add(model);
	}
		return list;
	}
	
	@Override
	public DesignationForClientModel categorydesignationCost(int projectCategoryId,int designationId){
		DesignationForClientModel model = new DesignationForClientModel();
		List<DesignationProjectCategoryMapping> list = designationProjectCategoryMappingDao.getDesignationProjects(projectCategoryId,designationId);
		
		if(null != list && list.size()>0){
			DesignationProjectCategoryMapping domain = list.get(0);
			model.setNumId(domain.getNumId());			
			model.setCost(""+domain.getCost());
		}
		return model;
	}
	
	public String saveprojectCategorydesignationMapping(DesignationForClientModel model){
		
		String result ="";
		List<DesignationProjectCategoryMapping> list = designationProjectCategoryMappingDao.getDesignationProjects(model.getProjectCategoryId(),model.getDesignationId());
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		UserInfo userInfo = (UserInfo) authentication.getPrincipal();
		
		
		if(null != list && list.size()>0){
			result="update";
			DesignationProjectCategoryMapping domain = list.get(0);
			domain.setCost(Double.parseDouble(model.getCost()));
			domain.setDtTrDate(new Date());
			domain.setNumTrUserId(userInfo.getEmployeeId());
			designationProjectCategoryMappingDao.save(domain);
		}else{
			result="save";
			DesignationProjectCategoryMapping domain = new DesignationProjectCategoryMapping();
			domain.setCost(Double.parseDouble(model.getCost()));
			DesignationForClient client = new DesignationForClient();
			client.setNumDesignationId(model.getDesignationId());
			domain.setDesignationForClient(client);
			ProjectCategoryMaster projectCategoryMaster = new ProjectCategoryMaster();
			projectCategoryMaster.setNumId(model.getProjectCategoryId());
			domain.setProjectCategoryMaster(projectCategoryMaster);
			domain.setDtTrDate(new Date());
			domain.setNumIsValid(1);
			domain.setNumTrUserId(userInfo.getEmployeeId());
			designationProjectCategoryMappingDao.save(domain);
		}
		return result;
		
	}
	
	@Override
	 public List<DesignationForClientModel> getDesignationByCategory(int categoryId){
		return convertDomainToModelList(designationProjectCategoryMappingDao.getDataByCategory(categoryId));
	 }
	
	@Override
	@PreAuthorize("hasAuthority('DESIGNATION_FOR_CLIENT')")
	public void designationForClientAuthorityCheck(){}
	
	@Override
	@PreAuthorize("hasAuthority('DESIGNATION_CATEGORY_MAPPING')")
	public void projectCategorydesignationMappingAuthorityCheck(){}
}
