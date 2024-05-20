package in.pms.global.service;

import in.pms.global.misc.FTPPropertiesReader;
import in.pms.global.util.PMSFtp;
import in.pms.master.domain.DesignationMasterDomain;
import in.pms.master.domain.EmpTypeMasterDomain;
import in.pms.master.domain.EmployeeMasterDomain;
import in.pms.master.domain.GroupMasterDomain;
import in.pms.master.domain.ManpowerRequirementDomain;
import in.pms.master.model.DesignationMasterModel;
import in.pms.master.model.EmpTypeMasterModel;
import in.pms.master.model.EmployeeRoleMasterModel;
import in.pms.master.model.GroupMasterModel;
import in.pms.master.model.ManpowerRequirementModel;
import in.pms.master.model.ProjectDocumentMasterModel;
import in.pms.master.model.ProjectMasterForm;
import in.pms.master.service.EmployeeMasterService;
import in.pms.master.service.EmployeeRoleMasterService;
import in.pms.master.service.ManpowerRequirementService;
import in.pms.master.service.ProjectMasterService;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;
import javax.swing.JFileChooser;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.RichTextString;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFRichTextString;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.HtmlUtils;

@Service
public class MiscDocumentServiceImpl implements MiscDocumentService {

	@Autowired
	FileUploadService fileUploadService;
	
	@Autowired
	ProjectMasterService projectMasterService;
	
	@Autowired
	ManpowerRequirementService manpowerRequirementService;
	
	@Autowired
	EmployeeRoleMasterService employeeRoleMasterService;
	
	public static final String rootPath =FTPPropertiesReader.getValueFromKey("FTP_ROOT");

	@Override
	public void downloadTemplate(ProjectDocumentMasterModel projectDocumentMasterModel,HttpServletResponse response){
	
	FTPClient ftpClient = new FTPClient();
	boolean login = PMSFtp.loginFTP(ftpClient);
	if(login){
		String filePath = FTPPropertiesReader.getValueFromKey(projectDocumentMasterModel.getTemplate());			
		try {				
			
			ftpClient.setFileType(FTP.BINARY_FILE_TYPE);					
			InputStream inputStream = ftpClient.retrieveFileStream(rootPath+"/"+filePath+"/"+projectDocumentMasterModel.getDocumentTypeName());				
			response.setHeader("Content-Disposition", "attachment; filename=\"" + projectDocumentMasterModel.getDocumentTypeName() + "\"");
			//response.setContentType("application/"+ originalFileName.substring(originalFileName.lastIndexOf(".")+1,originalFileName.length()));		
			response.getOutputStream().write(IOUtils.toByteArray(inputStream));
			response.flushBuffer();          
		} catch (IOException e) {			
			e.printStackTrace();
		}finally{
			PMSFtp.logoutFTP(ftpClient);
		}
	}
}
	
	/*----------------- Download details of ongoing project in excel sheet -------------------------------------*/
	
	@Override
	public Boolean downloadOngoingProjects(List<ProjectMasterForm> list,HttpServletResponse response){
		String ftpPath=FTPPropertiesReader.getValueFromKey("EMPLOYEE_REG_TEMPLATE");
		String fileName="Download.xlsx";
		FTPClient ftpClient = new FTPClient();
		PMSFtp.loginFTP(ftpClient);
		/*------------------------ Get Error Excel template and write to the 0 index sheet -------------------------------*/
		try 
		{
			InputStream file = ftpClient.retrieveFileStream(rootPath + "/" + ftpPath + "/" + fileName);
			XSSFWorkbook workbook1 = new XSSFWorkbook(file);
			XSSFSheet sheet1 = workbook1.getSheetAt(0);

		    /*------------------------ Populate data in the Excel sheet -----------------------------------------------------*/
		    for (int i = 0; i < list.size(); i++) 
		    {
		    	ProjectMasterForm data = list.get(i);
				ProjectMasterForm projectMasterForm =projectMasterService.getProjectDetailByProjectId(data.getProjectId());
					
				//Map<String,List<EmployeeRoleMasterModel>> assignedManpower = manpowerRequirementService.getManpowerRequirementWithAssignedRole(data.getProjectId());


				XSSFCellStyle cellStyle = workbook1.createCellStyle();
				cellStyle.setVerticalAlignment(VerticalAlignment.CENTER);
				cellStyle.setWrapText(true);
				cellStyle.setBorderTop(BorderStyle.THIN);
				cellStyle.setBorderBottom(BorderStyle.THIN);
				cellStyle.setBorderLeft(BorderStyle.THIN);
				cellStyle.setBorderRight(BorderStyle.THIN);
				
				//Added by devesh on 28-11-23 to bold active members in team details
				XSSFCellStyle boldcellStyle = workbook1.createCellStyle();
				boldcellStyle.setVerticalAlignment(VerticalAlignment.CENTER);
				boldcellStyle.setWrapText(true);
				boldcellStyle.setBorderTop(BorderStyle.THIN);
				boldcellStyle.setBorderBottom(BorderStyle.THIN);
				boldcellStyle.setBorderLeft(BorderStyle.THIN);
				boldcellStyle.setBorderRight(BorderStyle.THIN);
				XSSFFont boldFont = workbook1.createFont();
		        //End of bold style
				
				XSSFCellStyle cellStyle1 = workbook1.createCellStyle();
				cellStyle1.setVerticalAlignment(VerticalAlignment.CENTER);
				cellStyle1.setWrapText(true);
				cellStyle1.setBorderTop(BorderStyle.THIN);
				cellStyle1.setBorderBottom(BorderStyle.THIN);
				cellStyle1.setBorderLeft(BorderStyle.THIN);
				cellStyle1.setBorderRight(BorderStyle.THIN);
				cellStyle1.setAlignment(HorizontalAlignment.CENTER);
				
		        Row row = sheet1.createRow(i+1);

		        Cell cell0 = row.createCell(0);
		        cell0.setCellValue(i+1);
		        cell0.setCellStyle(cellStyle1);

		        Cell cell1 = row.createCell(1);
		    	cell1.setCellValue(projectMasterForm.getProjectRefrenceNo());
		    	cell1.setCellStyle(cellStyle1);
		        
		    	//comment the below line by varun on 09-10-2023
		       /* String projectName = data.getStrProjectName();
		        String projectRefNo = data.getProjectRefrenceNo();
		        //cell1.setCellValue(data.getStrProjectName()+"("+data.getProjectRefrenceNo()+")");
		        String cellValue = (projectRefNo != null || projectRefNo=="NA") ? projectName + "(" + projectRefNo + ")" : projectName+"";
		        cell1.setCellValue(cellValue);
		        cell1.setCellStyle(cellStyle1);*/
		    	
		    	//added the column project refernce and get the value and increased the cell by 1 by varun on 09-10-2023
		    	Cell cell2 = row.createCell(2);
		    	cell2.setCellValue(projectMasterForm.getStrProjectName());
		    	cell2.setCellStyle(cellStyle1);

		        Cell cell3 = row.createCell(3);
		        cell3.setCellValue(projectMasterForm.getProjectType());
		        cell3.setCellStyle(cellStyle1);
        
		     // Manpower  
		        String empName = "";
		        String involvement = "";
		        String deputedAt = "";

		        int serialNo = 0;

		        /*List<EmployeeRoleMasterModel> employeeRoleMasterList1 = employeeRoleMasterService.getAllTeamDetailsByProject(""+data.getProjectId());*/
		      //Added by devesh on 04/09/23 to get team details members including those whose end date has passed
		        List<EmployeeRoleMasterModel> employeeRoleMasterList1 = employeeRoleMasterService.getAllTeamDetailsByProjectForAllEndDate(""+data.getProjectId());
		      //End of service
		        List<EmployeeRoleMasterModel> employeeRoleMasterList = new ArrayList<>();
		        for(int record=0;record<employeeRoleMasterList1.size();record++)
		        {
		        	EmployeeRoleMasterModel recordRoleMaster = employeeRoleMasterList1.get(record);
		        	if(!recordRoleMaster.getManpowerRequirementId().equals(-1)){
		        		employeeRoleMasterList.add(recordRoleMaster);
		        	}
		        }
		     
/*--------------------------------------------Added by devesh on 28-11-23 to add HOD column in the excel--------------------------------------------*/
		        String HODName = "";
		        List<EmployeeRoleMasterModel> copiedHODList = new ArrayList<>();
		        if(data.getStrHODName()!=null)
		        {
			        String[] splitArray = data.getStrHODName().split(",");
			        List<EmployeeRoleMasterModel> HODRoleMasterList = new ArrayList<>();
			        for (String entry : splitArray) {
			            String[] parts = entry.split(" \\(");
			            String name = parts[0];
			            
			            String[] dates = parts[1].split(" - ");
			            String startDate = dates[0];
			            String endDate = dates.length > 1 ? dates[1].replace(")", "") : "";
			        
			            EmployeeRoleMasterModel r1 =new EmployeeRoleMasterModel();
			            r1.setStrEmpName(name);
			            r1.setStrStartDate(startDate);
			            r1.setStrEndDate(endDate);
			            HODRoleMasterList.add(r1);
			        }

			        DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");

			        Collections.sort(HODRoleMasterList, new Comparator<EmployeeRoleMasterModel>() {
			            @Override
			            public int compare(EmployeeRoleMasterModel model1, EmployeeRoleMasterModel model2) {
			                String endDate1 = model1.getStrEndDate();
			                String endDate2 = model2.getStrEndDate();

			                if (endDate1 == null || endDate1.isEmpty()) {
			                    if (endDate2 == null || endDate2.isEmpty()) {
			                        return HODRoleMasterList.indexOf(model1) - HODRoleMasterList.indexOf(model2);
			                    }
			                    return -1;
			                } else if (endDate2 == null || endDate2.isEmpty()) {
			                    return 1; 
			                }
			                try {
			                    java.util.Date date1 = dateFormat.parse(endDate1);
			                    java.util.Date date2 = dateFormat.parse(endDate2);

			                    return date2.compareTo(date1);
			                } catch (Exception e) {
			                    e.printStackTrace();
			                }

			                return 0;
			            }
			        });

			        Set<String> addedNames = new HashSet<>();
			        List<EmployeeRoleMasterModel> uniqueNames = new ArrayList<>();
			        for (EmployeeRoleMasterModel model : HODRoleMasterList) {
			            String name = model.getStrEmpName();
			            if (!addedNames.contains(name)) {
			                uniqueNames.add(model);
			                addedNames.add(name);
			            }
			        }

			        for(int k=0;k<uniqueNames.size();k++)
			        {
			        	EmployeeRoleMasterModel r1 =uniqueNames.get(k);
			        	HODName += r1.getStrEmpName() +"(";
		        		if(r1.getStrEndDate()==null || r1.getStrEndDate()=="" ||r1.getStrEndDate().isEmpty())
		        		{
		        			HODName +="Since "+r1.getStrStartDate()+")\n";
		        		}else{
		        			HODName +=r1.getStrStartDate()+" - "+r1.getStrEndDate()+")\n";
		        		}
			        }
			        copiedHODList = new ArrayList<>(uniqueNames);
			        
			        
		        }
		        
		        Cell cell4 = row.createCell(4);
		        cell4.setCellValue(HODName);
		        cell4.setCellStyle(cellStyle);
		  

/*-----------------------------------------------------------------End of HOD Column----------------------------------------------------------------*/

/*--------------------------------------------------------------------------------------------------------------------------------------------------*/
		        String plName = "";
		        List<EmployeeRoleMasterModel> copiedList = new ArrayList<>();//Added by devesh on 04-09-23 to copy pl name list
		        if(data.getStrPLName()!=null)
		        {
			        String[] splitArray = data.getStrPLName().split(",");
			        List<EmployeeRoleMasterModel> plRoleMasterList = new ArrayList<>();
			        for (String entry : splitArray) {
			            String[] parts = entry.split(" \\(");
			            String name = parts[0];
			            
			            String[] dates = parts[1].split(" - ");
			            String startDate = dates[0];
			            String endDate = dates.length > 1 ? dates[1].replace(")", "") : "";
			        
			            EmployeeRoleMasterModel r1 =new EmployeeRoleMasterModel();
			            r1.setStrEmpName(name);
			            r1.setStrStartDate(startDate);
			            r1.setStrEndDate(endDate);
			            plRoleMasterList.add(r1);
			        }

			        DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");

			        Collections.sort(plRoleMasterList, new Comparator<EmployeeRoleMasterModel>() {
			            @Override
			            public int compare(EmployeeRoleMasterModel model1, EmployeeRoleMasterModel model2) {
			                String endDate1 = model1.getStrEndDate();
			                String endDate2 = model2.getStrEndDate();

			                if (endDate1 == null || endDate1.isEmpty()) {
			                    if (endDate2 == null || endDate2.isEmpty()) {
			                        return plRoleMasterList.indexOf(model1) - plRoleMasterList.indexOf(model2);
			                    }
			                    return -1;
			                } else if (endDate2 == null || endDate2.isEmpty()) {
			                    return 1; 
			                }
			                try {
			                    java.util.Date date1 = dateFormat.parse(endDate1);
			                    java.util.Date date2 = dateFormat.parse(endDate2);

			                    return date2.compareTo(date1);
			                } catch (Exception e) {
			                    e.printStackTrace();
			                }

			                return 0;
			            }
			        });

			        Set<String> addedNames = new HashSet<>();
			        List<EmployeeRoleMasterModel> uniqueNames = new ArrayList<>();
			        for (EmployeeRoleMasterModel model : plRoleMasterList) {
			            String name = model.getStrEmpName();
			            if (!addedNames.contains(name)) {
			                uniqueNames.add(model);
			                addedNames.add(name);
			            }
			        }

			        for(int k=0;k<uniqueNames.size();k++)
			        {
			        	EmployeeRoleMasterModel r1 =uniqueNames.get(k);
			        	plName += r1.getStrEmpName() +"(";
		        		if(r1.getStrEndDate()==null || r1.getStrEndDate()=="" ||r1.getStrEndDate().isEmpty())
		        		{
		        			plName +="Since "+r1.getStrStartDate()+")\n";
		        		}else{
		        			plName +=r1.getStrStartDate()+" - "+r1.getStrEndDate()+")\n";
		        		}
			        }
			        copiedList = new ArrayList<>(uniqueNames);//Added by devesh on 04-09-23 to copy pl name list
			        
			        
		        }
		        
		        Cell cell5 = row.createCell(5);
		        cell5.setCellValue(plName);
		        cell5.setCellStyle(cellStyle);
		  

/*--------------------------------------------------------------------------------------------------------------------------------------------------*/
	            deputedAt += " \n";
	            //Added by devesh on 04-09-23 to remove PL named from Team details column
	            // Create an iterator for the original list
	            Iterator<EmployeeRoleMasterModel> iterator = employeeRoleMasterList.iterator();

	            // Iterate through the original list and remove matching records
	            while (iterator.hasNext()) {
	                EmployeeRoleMasterModel originalRecord = iterator.next();
	                for (EmployeeRoleMasterModel copiedRecord : copiedList) {
	                    if (areEqual(originalRecord.getStrStartDate(), copiedRecord.getStrStartDate()) &&
	                        areEqual(originalRecord.getStrEndDate(), copiedRecord.getStrEndDate()) &&
	                        areEqual(originalRecord.getStrEmpName(), copiedRecord.getStrEmpName())) {
	                        iterator.remove(); // Remove the current record using the iterator
	                        break; // No need to check further, record is matched
	                    }
	                }
	            }
	            
				//End of removal
	            
	          //Added by devesh on 04-09-23 to remove PL named from Team details column
	            // Create an iterator for the original list
	            Iterator<EmployeeRoleMasterModel> iterator1 = employeeRoleMasterList.iterator();

	            // Iterate through the original list and remove matching records
	            while (iterator1.hasNext()) {
	                EmployeeRoleMasterModel originalRecord = iterator1.next();
	                for (EmployeeRoleMasterModel copiedRecord : copiedHODList) {
	                    if (areEqual(originalRecord.getStrStartDate(), copiedRecord.getStrStartDate()) &&
	                        areEqual(originalRecord.getStrEndDate(), copiedRecord.getStrEndDate()) &&
	                        areEqual(originalRecord.getStrEmpName(), copiedRecord.getStrEmpName())) {
	                        iterator1.remove(); // Remove the current record using the iterator
	                        break; // No need to check further, record is matched
	                    }
	                }
	            }
	            
				//End of removal
	            XSSFRichTextString richText = new XSSFRichTextString();
	            boldFont.setBold(true);
	            XSSFFont normalFont = workbook1.createFont();
	            
		        for (EmployeeRoleMasterModel employeeRole : employeeRoleMasterList) 
		        {        	
		        	if (employeeRole.getStrEmploymentStatus().equals("Relieved"))
		        	{
		        		/*empName += (serialNo + 1) + ". " + employeeRole.getStrEmpName() +"(";*/
		        		//Added by devesh on 28-11-23 to add involvement in team details column
		        		/*empName += (serialNo + 1) + ". " + employeeRole.getStrEmpName() + ", " + employeeRole.getDesignation() + ", " + employeeRole.getInvolvement() +" (";*/
		        		richText.append((serialNo + 1) + ". " + employeeRole.getStrEmpName() + ", " + employeeRole.getDesignation() + ", " + employeeRole.getInvolvement() +" %  (", normalFont);
		        		
		        		if(employeeRole.getStrEndDate()==null)
		        		{
		        			/*empName +="Since "+employeeRole.getStrStartDate()+")";*/
		        			richText.append("Since "+employeeRole.getStrStartDate()+")", normalFont);
		        		}else{
		        			/*empName +=employeeRole.getStrStartDate()+" - "+employeeRole.getStrEndDate()+")";*/
		        			richText.append(employeeRole.getStrStartDate()+" - "+employeeRole.getStrEndDate()+")", normalFont);
		        		}
		        		/*empName +="("+employeeRole.getStrEmploymentStatus()+")\n";*/
		        		richText.append("("+employeeRole.getStrEmploymentStatus()+")\n", normalFont);
		        	}
		        	else
		        	{
		        		/*empName += (serialNo + 1) + ". " + employeeRole.getStrEmpName() +"(";*/
		        		//Added by devesh on 28-11-23 to add involvement in team details column
		        		/*empName += (serialNo + 1) + ". " + employeeRole.getStrEmpName() + ", " + employeeRole.getDesignation() + ", " + employeeRole.getInvolvement() +" (";*/
		        		richText.append((serialNo + 1) + ". " + employeeRole.getStrEmpName() + ", " + employeeRole.getDesignation() + ", " + employeeRole.getInvolvement() +" %  (", boldFont);
		        		
		        		if(employeeRole.getStrEndDate()==null)
		        		{
		        			/*empName +="Since "+employeeRole.getStrStartDate()+")\n";*/
		        			richText.append("Since "+employeeRole.getStrStartDate()+")\n", boldFont);
		        		}else{
		        			/*empName +=employeeRole.getStrStartDate()+" - "+employeeRole.getStrEndDate()+")\n";*/
		        			richText.append(employeeRole.getStrStartDate()+" - "+employeeRole.getStrEndDate()+")\n", boldFont);
		        		}
		        		//Added by devesh on 28-11-23 to bold active members in team details
				        //End of bold style
		        	}
		            
		            /*involvement += (serialNo + 1) + ") " + employeeRole.getInvolvement() + "\n";*/

		            if (employeeRole.getNumDeputedAt() == 1) {
		            	deputedAt += " C-DAC\n";
		            } else if (employeeRole.getNumDeputedAt() == 2) {
		            	deputedAt += " At Client\n";
		            } else {
		            	deputedAt += " NULL \n";
		            }
		            serialNo++;
		            
		        }

		        Cell cell6 = row.createCell(6);
		        cell6.setCellValue(data.getStartDate());
		        cell6.setCellStyle(cellStyle1);

		        Cell cell7 = row.createCell(7);
		        cell7.setCellValue(data.getEndDate());
		        cell7.setCellStyle(cellStyle1);

		        Cell cell8 = row.createCell(8);
		        DecimalFormat decimalFormat = new DecimalFormat("#,##0");
		        String formattedProjectCost = decimalFormat.format(projectMasterForm.getProjectCost());
		        cell8.setCellValue("₹ "+formattedProjectCost);
		        cell8.setCellStyle(cellStyle1);

		        /*Cell cell9 = row.createCell(9);
		        cell9.setCellValue(empName);
		        cell9.setCellStyle(cellStyle);*/
		        
		        //Added by devesh on 28-11-23 to bold active members in team details
        		Cell cell9 = row.createCell(9);
		        cell9.setCellValue(richText);
		        /*boldcellStyle.setFont(boldFont);*/
		        cell9.setCellStyle(cellStyle);
		        //End of bold style

		        //Commented by devesh on 29-11-23 to remove Involvement column
		        /*Cell cell10 = row.createCell(10);
		        cell10.setCellValue(involvement);
		        cell10.setCellStyle(cellStyle);*/
		        
		        Cell cell11 = row.createCell(10);
		        cell11.setCellValue(deputedAt);
		        cell11.setCellStyle(cellStyle);
		        /*------------------------------------*/
		        /*
		        String s="hello";
		        String d="world";

		        // Set the cell value as a rich text string
		        RichTextString richTextString = new XSSFRichTextString("Hello, World!");
		        
		        // Apply different colors to different parts of the string
		        Font font1 = workbook1.createFont();
		        font1.setColor(Font.COLOR_RED);
		        richTextString.applyFont(0, 5, font1); // Apply red color to "Hello"
		        
		        Font font2 = workbook1.createFont();
		        font2.setColor(Font.COLOR_BLUE);
		        richTextString.applyFont(7, 12, font2); // Apply blue color to "World"

	            RichTextString richTextString = new XSSFRichTextString(s);
	
	            // Set the rich text string as the cell value
	            Cell cell10 = row.createCell(10);
	            cell10.setCellValue(richTextString);
		        */
		        /*------------------------------------*/

		    }
		    sheet1.createFreezePane(0, 1);
		    /*------------------------ End Populate data in the Excel sheet -------------------------------------------------*/
		    String filePath = "Project Details.xlsx";
		    // For Local File 
		    //String remoteFilePath = "C:/Users/deveshsingh/Downloads/Download1.xlsx";
		    // For Production
		    String remoteFilePath = rootPath + "/" + ftpPath + "/" + filePath;
		    try (FileOutputStream output_file = new FileOutputStream(remoteFilePath)) {
		        workbook1.write(output_file);
		        return true;
		    } catch (IOException e) {
		        e.printStackTrace();
		        return false;
		    }
		    /*-----------------------------------------------------------------------------------------------------------*/
		} catch (IOException e) {
		    e.printStackTrace();
		}
		return false;
	}
	
	// Custom method to compare values, including handling null values added by devesh on 04-09-23
    private static boolean areEqual(Object obj1, Object obj2) {
		 if (obj1 instanceof String) {
		        obj1 = ((String) obj1).trim().isEmpty() ? null : obj1;
		    }
    	    
	    if (obj2 instanceof String) {
	        obj2 = ((String) obj2).trim().isEmpty() ? null : obj2;
	    }
	    
        if (obj1 == null && obj2 == null) {
            return true;
        }
        if (obj1 == null || obj2 == null) {
            return false;
        }
        return obj1.equals(obj2);
    }
    //End of Custom Method
	
}
