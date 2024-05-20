package in.pms.master.dao;

import java.util.List;

import in.pms.global.dao.DaoHelper;
import in.pms.master.domain.ProjectCategoryMaster;
import in.pms.transaction.domain.CategoryMaster;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class ProjectCategoryDao {
	
	@Autowired
	DaoHelper daoHelper;
	
	public ProjectCategoryMaster mergeProjectCategory(
			ProjectCategoryMaster projectCategoryMaster){
		return daoHelper.merge(ProjectCategoryMaster.class, projectCategoryMaster);
	}
	
	public List<ProjectCategoryMaster> getAllProjectCategory(){
		String query = "from ProjectCategoryMaster where numIsValid<>2";
		return daoHelper.findByQuery(query);	
	}
	
	public List<ProjectCategoryMaster> getActiveProjectCategory(){
		String query = "from ProjectCategoryMaster p where p.numIsValid=1 order by p.categoryName";
		return daoHelper.findByQuery(query);
	}
	
	public ProjectCategoryMaster getProjectCategoryById(int id){
		return daoHelper.findById(ProjectCategoryMaster.class, id);
	}
	
	public List<CategoryMaster> getProjectCategoryByCatId(long categoryId){
		String query = "from CategoryMaster p where   p.numCategoryId="+categoryId+" and  p.numIsValid=1";
		return daoHelper.findByQuery(query);
	}

}
