package in.pms.transaction.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString

public class DesignationForClientModel {
	
	private int numId;
	private boolean valid;
	private String encNumId;
	private String designationName;
	private String desription;
	private String designationShortCode;	
	
	private String cost;
	private int projectCategoryId;
	private int designationId;
 
	
}
