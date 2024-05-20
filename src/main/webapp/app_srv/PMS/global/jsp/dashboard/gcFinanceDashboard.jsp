<%@taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %> 
<%@ taglib prefix="sec"
	uri="http://www.springframework.org/security/tags"%>

<%@ taglib prefix = "fmt" uri = "http://java.sun.com/jsp/jstl/fmt" %>


<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="/PMS/resources/app_srv/PMS/global/css/dashboards.css">
<!-- Bhavesh(28-06-2023) added stylesheet link  --> 
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha384-******************" crossorigin="anonymous">

<section id="main-content" class="main-content merge-left">
	<div class=" container wrapper1">
		<div class="row">
			<div class=" col-md-12 pad-top-double  text-left">
				<ol class="breadcrumb bold">
					<li>Home</li>

					<li class="active"><spring:message
							code="dashboard.breadcrumb.label" /></li>
				</ol>
				<c:if test="${message != null && message != ''}">
					<c:choose>
						<c:when test="${status=='success'}">
							<div id="userinfo-message">
								<p class="success_msg">${message}</p>
							</div>
						</c:when>
						<c:otherwise>
							<div id="userinfo-message">
								<p class="error_msg">${message}</p>
							</div>
						</c:otherwise>
					</c:choose>
				</c:if>
			</div>
		</div>


		<div class="row">
			<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">
				<div class="col-md-7 col-lg-7 col-sm-12 col-xs-12 zero">
					<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">
						<div class="col-md-6 col-sm-6 col-lg-6 col-xs-12">
							<a class="" href="#" data-image-id="" data-toggle="modal"
								data-title="" data-target="#dash-grpwise-bargraph-modal">
								<div class=" serviceBoxFinDash blue ">
									<h3 class="title">
										<spring:message code="dashboard.project.label" />
									</h3>

									<div class="text-small subtextmed ">
										<sec:authentication
											property="principal.assignedOrganisationName" />
									</div>
									<div class=" subtextCount">${projectCount}</div>
									<h5 class="subtextsmall">
										<span style="font-weight: 500; color: yellow;">Total
									Outlay: </span><span>${cdaccost} Lakhs</span>
									</h5>
									<h5 class="subtextsmall">
										<span style="font-weight: 500; color: yellow;">CDAC
											Outlay: </span> <span>${ongoingProjectCost} Lakhs</span>
											
									</h5>
<%-- 									<h5 class="subtextsmall">
										<span style="font-weight: 500; color: yellow;">Expected
											Revenue : </span> <span>${projectRevenue} Lakhs
											&nbsp;(${financialYear}) </span>
									</h5> --%>


								<!-- 	<div class="service-icon">
										<span><i class="fa fa-file-text-o"></i></span>
									</div> -->
									<div class="service-icon">
										<span><i class="fa fa-file-text"></i></span>
									</div>
								</div>
							</a>
						</div>
						<div class="col-md-6 col-sm-6 col-lg-6 col-xs-12">
						<!-- updated by devesh on 16/6/23 for adding onclick function -->
							<a class="" href="#" data-image-id="" data-toggle="modal"
								data-title="" data-target="#dash-employee-modal">
							<!-- <a class="" href="#" data-image-id="" data-toggle="modal"
								data-title="" data-target="#dash-employee-modal" onclick="setTimeout(function() {drawdeputedChart();drawEmploymentTypeWiseChart();}, 1000)"> -->
						<!-- end -->
								<div class="serviceBoxFinDash ">

									<h3 class="title">
										<spring:message code="dashboard.employee.label" />
									</h3>

									<div class="text-small subtextmed ">
										<sec:authentication
											property="principal.assignedOrganisationName" />
									</div>
									<%-- <div class=" subtextCount" style="margin-bottom:50px;">${employeeCount}</div> --%>
									<!-- added for showing deputed at data by devesh on 14/6/23 -->
									<div class=" subtextCount" >${employeeCount}</div>
									<div>at CDAC : ${employeeAtCDACCount}</div>
									<div>at Client Site : ${employeeAtCLIENTCount}</div>
									<%-- <div>NULL : ${employeeAtOthersCount}</div> --%>
									<!-- End -->

									<div class="service-icon">
										<span><i class="fa fa-users"></i></span>
									</div>
								</div>
							</a>
						</div>
					</div>
					<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top">
						<div class="col-md-6 col-sm-6 col-lg-6 col-xs-12">
							<a class="" data-image-id="" data-toggle="modal"
								data-title="" data-target="#dash-income-modal">
								<div class="serviceBoxFinDash green">
									<h3 class="title">
										<spring:message code="dashboard.income.label" />
									</h3>

									<div class="text-small subtextmed ">
										<sec:authentication
											property="principal.assignedOrganisationName" />
									</div>
									<div class=" subtextCount number" id="incomeOndate" style="margin-bottom:50px;">${income} Lakhs</div>
									<h5 class="subtextsmall">
									 <span><span>since:<!-- Bhavesh(30-06-2023) added new class-asOnDateProposals1  --> <label
												class="col-yellow1 bold asOnDateProposals11" id="asOnDate">${startDate}</label>

										</span> <input class="input-field" type="hidden" id="dtStartDate">
											<input class="input-field" type="hidden" id="dtEndDate"
											value="${endRange}">
											</span>
									</h5>
									   
									<div class="service-icon">
										<span><i class="fa fa-inr"></i></span>
									</div>
								</div>
							</a>
						</div>
						<div class="col-md-6 col-sm-6 col-lg-6 col-xs-12">
							<a class=""  data-image-id="" data-toggle="modal"
					data-title="" data-target="#dash-expenditure-modal">
								<div class="serviceBoxFinDash purple">
									<h3 class="title">
										<spring:message code="dashboard.expenditure.label" />
									</h3>


									<div class="text-small subtextmed ">
										<sec:authentication
											property="principal.assignedOrganisationName" />
									</div>
									<div class="convert_lakhs subtextCount number" id="expenditureOndate" style="margin-bottom:50px;">${expenditure}</div>
									<h5 class="subtextsmall">
										 <span>since: </span>
										 <!-- Bhavesh(30-06-2023) added new class-asOnDateProposals11  --><span
											class="col-yellow1 bold asOnDateProposals11" id="asOnDateExp">${startDate}</span>
											<input class="input-field" type="hidden" id="dtExpStartDate">
										</h5>
									<div class="service-icon">
										<span><i class="fa fa-money"></i></span>
									</div>
								</div>
							</a>
						</div>
					</div>
				</div>
				<div class="col-md-5 col-lg-5 col-sm-12 col-xs-12 zero">
					<div class="panel panel-default panel-glance"
						style="background: #e2e2e2 !important;">

						<div class="panel-body zero">
							<div
								class="col-md-12 col-lg-12 col-sm-12 col-xs-12 align-items zero">

								<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
									<a class="" href="#" data-image-id="" data-toggle="modal"
										data-title="" data-target="#dash-newProposalList-modal">
										<div class="card card-stats card-stats-finDash" style="min-height: 125px;">
											<div class="card-header  card-header-icon">
												<div class="card-icon"
													style="background: #c9e7f9; border: 4px solid #a6d6f5;">
													<img class="img-responsive"
														src="/PMS/resources/app_srv/PMS/global/images/dashboard/proposals.png" />
												</div>
												<p class="card-category" title="Proposals Submitted">
													<%------------ Add Project Received word [12-10-2023] ------------------------%>
													<span style="font-size:medium">Proposals Submitted / Project Received</span></p>
												<h3 class="card-title card-count" id="newProposalsOnDate">
													${proposalListCount} / ${proposalReceivedCount}
													<!--  <small>GB</small> -->
												</h3>
											</div>
											<div class="card-footer">
												<div class="stats">
													<span> <span class="pad-top">since:</span> <span
														class="bold asOnDateProposals1" id="asOnDateProposals"
														style="font-size: 14px; color: #4d4b4b;">${startRange}
													</span>
													</span>

												</div>

											</div>
										</div>
									</a>
								</div>


								<!--1st Tile  -->

								<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
									<a class="" href="#" data-image-id="" data-toggle="modal"
										data-title="" data-target="#dash-newProjectList-modal">
										<div class="card card-stats card-stats-finDash" style="min-height: 125px;">
											<div class="card-header  card-header-icon">
												<div class="card-icon"
													style="background: #ddd5ff; border: 4px solid #bdaeff;">
													<!-- <i class="material-icons">add_alert</i> -->
													<img class="img-responsive"
														src="/PMS/resources/app_srv/PMS/global/images/dashboard/projects_rec.png" />
												</div>
												<%------------ Remove Received word [12-10-2023] ------------------------%>
												<p class="card-category" title="New Projects received but Approval Pending.">Project Approval Pending</p>
												<!-- <p class="card-category" style="font-size:medium;color:blue">(Approval Pending)</p> -->
												<h3 class="card-title card-count" id="newProjectsOnDate">
													${newProjectCount}
													<!--  <small>GB</small> -->
												</h3>
											</div>
											<div class="card-footer">
												<div class="stats">
													<span> <span class="pad-top">since:</span><!-- Bhavesh(30-06-2023) added new class-asOnDateProposals1  --> <span
														class="bold asOnDateProposals1" id="asOnDateProjects"
														style="font-size: 14px; color: #4d4b4b;">${startRange}</span>
													</span>

												</div>

											</div>
										</div>
									</a>
								</div>
								<!-- End of 1st Tile  -->
								<!-- 2nd tile  -->



							</div>
							<div
								class="col-md-12 col-lg-12 col-sm-12 col-xs-12 align-items zero ">


								<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
									<a class="" href="#" data-image-id="" data-toggle="modal"
										data-title="" data-target="#dash-pending-payments-modal">
										<div class="card card-stats card-stats-finDash" style="min-height: 125px;">
											<div class="card-header  card-header-icon">
												<div class="card-icon"
													style="background: #c8ffe8; border: 4px solid #98eaca;">
													<!-- <i class="material-icons">info_outline</i> -->
													<img class="img-responsive"
														src="/PMS/resources/app_srv/PMS/global/images/dashboard/pending_payments.png" />
												</div>
												<p class="card-category"
													title="Invoice raised but Payment is pending">Outstanding
													Payments</p><%----- [17-10-2023] change the title of tile --%>
												<h3 class="card-title">
													${paymentPendingCount} <br> <b> <span
														style="color: red; font-size: x-small">(${conTotalAmount}
															Lakhs) </span></b>
												</h3>

											</div>
											<div class="card-footer">
												<div class="stats">
													<!--<p>since : 01/01/2020</p>
											<span class="pull-right"><i class="material-icons">calendar_today</i></span>-->
												</div>
											</div>
										</div>
									</a>
								</div>
								
								<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
									<a class="" href="#" data-image-id="" data-toggle="modal"
										data-title="" data-target="#dash-pending-invoices-modal">
										<div class="card card-stats card-stats-finDash" style="min-height: 125px;">
											<div class="card-header  card-header-icon">
												<div class="card-icon"
													style="background: #ffd5df; border: 4px solid #fbb6ac;">
													<!-- <i class="material-icons">access_time</i> -->
													<img class="img-responsive"
														src="/PMS/resources/app_srv/PMS/global/images/dashboard/due_payments.png" />
												</div>
												<p class="card-category"
													title="Payment due as per payment milestone. Invoice not yet generated.">Due
													For Invoicing</p><%----- [17-10-2023] change the title of tile --%>
												<h3 class="card-title">
													${invoicesPendingCount}<br> <b><span
														style="color: red; font-size: x-small">
															(${dueConTotalAmount} Lakhs)</span></b>
												</h3>
												<%-- <div>${dueConTotalAmount}</div> --%>
											</div>
											<div class="card-footer">
												<div class="stats">
													<!--<p>since : 01/01/2020</p>
											<span class="pull-right"><i class="material-icons">calendar_today</i></span>-->
												</div>
											</div>
										</div>
									</a>
								</div>
							</div>
							<div
								class="col-md-12 col-lg-12 col-sm-12 col-xs-12 align-items zero ">
							<!--Bhavesh (14-08-23) added new tile for Underclosure  -->
							<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
									<a class="" href="#" data-image-id="" data-toggle="modal"
										data-title="" data-target="#dash-closure-pending-modal1">
										<div class="card card-stats card-stats-finDash" style="min-height: 125px;">
											<div class="card-header  card-header-icon">
												<div class="card-icon"
													style="background: #2bc7ed;border: 4px solid #047fa7;">
													<!-- <i class="material-icons">access_time</i> -->
													<img class="img-responsive"
														src="/PMS/resources/app_srv/PMS/global/images/dashboard/projects2.png" />
												</div>
												<p class="card-category"
													title="Pending for Financial Approval.">Closure Request</p>
												<h3 class="card-title">
													${underClosureProjectCountForGCFIn}
													<!--  <small>GB</small> -->
												</h3>
											</div>
											<div class="card-footer">
												<div class="stats">
													<!--<p>since : 01/01/2020</p>
											<span class="pull-right"><i class="material-icons">calendar_today</i></span>-->
												</div>
											</div>
										</div>
									</a>
								</div>
								<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
									<a class="" href="#" data-image-id="" data-toggle="modal"
										data-title="" data-target="#dash-closure-pending-modal">
										<div class="card card-stats card-stats-finDash" style="min-height: 125px;">
											<div class="card-header  card-header-icon">
												<div class="card-icon"
													style="background: #efd1b9; border: 4px solid #d8ae8b;">
													<!-- <i class="material-icons">access_time</i> -->
													<img class="img-responsive"
														src="/PMS/resources/app_srv/PMS/global/images/dashboard/closure_pending.png" />
												</div>
												<!-- <p class="card-category"
													title="Closing date passed.Closure still pending.">Closure/Extension Pending</p> -->
												<p class="card-category"
													title="Closing date passed.Closure still pending.">Technical Closure/Extension Pending</p><!-- Name changed by devesh on 22-09-23 -->
												<h3 class="card-title">
													${pendingClosureCount}
													<!--  <small>GB</small> -->
												</h3>
											</div>
											<div class="card-footer">
												<div class="stats">
													<!--<p>since : 01/01/2020</p>
											<span class="pull-right"><i class="material-icons">calendar_today</i></span>-->
												</div>
											</div>
										</div>
									</a>
								</div>



							</div>
							
							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 align-items zero ">
								<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
									<a class="" href="#" data-image-id="" data-toggle="modal"
										data-title="" data-target="#dash-closedProjectList-modal">
										<div class="card card-stats card-stats-finDash" style="min-height: 125px;">
											<div class="card-header  card-header-icon">
												<div class="card-icon"
													style="background: #ffe0bc; border: 4px solid #f7c287;">
													<!-- <i class="material-icons">backspace</i> -->
													<img class="img-responsive"
														src="/PMS/resources/app_srv/PMS/global/images/dashboard/closed_projects1.png" />
												</div>
												<p class="card-category"
													title="Click Here to View Technically and Financially Closed Projects.">Closed
													Projects</p>
												<h3 class="card-title" id="closedProjectsOnDate">
													${closedProjectsCount}
													<!--  <small>GB</small> -->
												</h3>
											</div>
											<div class="card-footer">


												<div class="stats">
													<span> <span class="pad-top">since:</span><!-- Bhavesh(30-06-2023) added new class-asOnDateProposals1  --> <span
														class="bold asOnDateProposals1" id="asOnDateClosedProjects"
														style="font-size: 14px; color: #4d4b4b;">${startRange}</span>
													</span>

												</div>


											</div>
										</div>
									</a>
								</div>
</div>

						</div>
					</div>
				</div>
			</div>
		</div>

	<!-- Group Tiles  -->
<!--Bhavesh 28-07-23 for comparison  -->
			<c:forEach var="item" items="${underClosureProjectCountPMO}">
				<p class="underclos hidden">${item.projectRefrenceNo}</p>
			</c:forEach>


<div class="row">
			<div class="col-md-12 col-sm-12 col-xs-12 col-lg-12 pad-bottom ">

				<div class="panel panel-info panel-glance">
					<div class="panel-heading font_eighteen"><spring:message code="dashboard.projectlist.label" /></div>
					<div class="panel-body">
						<div class="col-md-12 col-xs-12 col-sm-12 col-lg-12 groupdiv"
							id="groupdiv">							
								<c:forEach items="${groupnames}" var="grp">
									<%-- <c:choose>
										<c:when test="${fn:length(grp.groupName) >= 41}">
											<div class="col-md-2 col-lg-2 col-sm-2 col-xs-2 pad-top">
										</c:when>
										<c:when test="${fn:length(grp.groupName) >= 34}">
											<div class="col-md-2 col-lg-2 col-sm-2 col-xs-2 pad-top">
										</c:when>
										<c:when test="${fn:length(grp.groupName) >= 29}">
											<div class="col-md-2 col-lg-2 col-sm-2 col-xs-2 pad-top">
										</c:when>
										<c:otherwise> --%>
											<div class="col-md-2 col-lg-2 col-sm-2 col-xs-2 pad-top">
										<%-- </c:otherwise>
									</c:choose>	 --%>								
										<button class="btn btn1 " 
											data-toggle="tooltip" data-placement="top"
											title="Click here to see details"
											style="font-size:17px; font-weight:600;background-color:${grp.bgColor}" onclick="loadGroupWiseProjects('${grp.encGroupId}')">${grp.groupShortName}</button>
									</div>

									</c:forEach>

						</div>
						
						<!-- GroupWise Data	-->			
 									<div class="row pad-top" id="GroupWiseTable">
		
	<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">
	<div class=" datatable_row pad-bottom">
 		<fieldset class="fieldset-border">
 
		<!-- 	<legend class="bold legend_details">Details :</legend> -->
		<div class="table-responsive">
			<table id="example" class="table table-striped table-bordered"
				style="width: 100%">
				<thead class="datatable_thead bold ">
					<tr>
					    <th style="width:2%;"><spring:message code="serial.no"/></th>
					   <%--  <th><spring:message code="project.projectRefNo"/></th>	 --%>										    
						<th><spring:message code="Project_Module_Master.projectName"/></th>
						<%-- <th><spring:message code="application.project.category.label"/></th> --%>
						<%-- <th><spring:message code="employee_Role.start_Date"/></th>
						<th><spring:message code="employee_Role.end_Date"/></th> --%>
						<th style="width:10%;"><p><spring:message code="project.details.duration"/></p><!-- <p>(months)</p> --></th>
						<th><spring:message code="project.details.leader"/></th>
						<th style="width:10%;"><p><spring:message code="dashboard.lable.outlay"/></p><p>(in Lakhs)</p></th>
						<th class="hidden" style="width:10%;"><p><spring:message code="project.details.amountreceived"/></p><p>(in Lakhs)</p></th>
						<th><spring:message code="task.download" /></th>
		
					    
					</tr>
				</thead>
												<thead class="filters">
		<tr>     
		<th ><i class="fa fa-th-list"></i></th>
		<%-- <th class=""><spring:message code="project.projectRefNo"/></th> --%>
		<th class=""><%-- <spring:message code="Project_Module_Master.projectName"/> --%></th>
		                                                           
				<%-- <th class="comboBox" id="businessTypeSelect"><spring:message code="application.project.category.label"/></th> --%>
				<%-- <th class="comboBox" style="width:10%;"><spring:message code="employee_Role.start_Date"/></th>
				<th class="comboBox" style="width:10%;"><spring:message code="employee_Role.end_Date"/></th> --%>
				<th style="width:10%;" class="comboBox" > <spring:message code="project.details.duration"/></th>
				<th class="" ><%-- <spring:message code="project.details.leader"/> --%></th> 
				<!-- <th></th> -->
				<th style="width:10%;" class=""><%-- <spring:message code="project.details.totalcost.lakhs"/> --%></th>
				<th class="hidden" style="width:10%;" class=""><%-- <spring:message code="project.details.amountreceived.lakhs"/> --%></th>
				<!-----------------  For Download the Excel of ongoing projects feature [ added by Anuj ] ------------------------------------------------------------->
				<!-- <th><i class="fa fa-download"></i></th> -->
				<th><i class="fa fa-download btn btn-success" onClick="downloadOngoingProjects()"></i><input type="hidden" id="groupId"/></th>
		</tr>
</thead>
<tbody class="">
					
				</tbody>
				 <tfoot>
									<tr>
										<td colspan="6">
											<div class="legend">
												<div class="legend-item">
													<div class="legend-color"
														style="background-color: #4CAF50;"></div>
													<span>Ongoing</span>
												</div>
												<div class="legend-item">
													<div class="legend-color"
														style="background-color: #cc9900;"></div>
													<span>Date elapsed and Closure Initiated</span>
												</div>
												<div class="legend-item">
													<div class="legend-color"
														style="background-color: #808080;"></div>
													<span>Date elapsed but Closure Not Initiated</span>
												</div>
												<!-- Add more legend items as needed -->
											</div>
										</td>
									</tr>
								</tfoot>
			</table>
			</div>
			<!--End of data table-->
 		</fieldset>
 		</div>
	</div>
	</div>
	
						<div class=" hidden" id="groupWiseProject">
				
						<div class="col-md-12 col-lg-12 pad-top" id="groupWiseProjectDtl">

						</div>
						<div class="hidden " id="groupWiseProject">
				
						<div class="col-md-12 col-lg-12" id="groupWiseProjectDtl">

							
						   </div>
				
			            </div>
					</div> 
				</div>
			</div>
</div>
</div>
<!-- End Group Tiles  -->
            <!-- Bhavesh(30-06-2023) added new class-dash-newProposalList-modal  -->
            <div class="modal dash-grpwise-bargraph-modal dash-newProposalList-modal" id="dash-grpwise-bargraph-modal" tabindex="-1"
				role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"
				data-keyboard="false" data-backdrop="static">
				<!-- Bhavesh(30-06-2023) added new class-mymodal1 and style="width:99%; height:95%;"  -->
                 <div class="modal-dialog modal-lg mymodal1" style="width:99%; height:95%;">
                <!-- Bhavesh(30-06-2023) added new class-modal-lg and style="height:100%;"  -->
					<div class="modal-content modal-lg " style="height:100%;"> 
						<div class="modal-header">
							<h3 class="modal-title center" id="">
								<spring:message code="dashboard.ongoingprojects.label" /> in <sec:authentication
							property="principal.assignedOrganisationName" /></h3>
							<!-- Bhavesh(30-06-2023) added onclick="restoreprop()"  -->
							<button type="button" class="close" onclick="restoreprop()" data-dismiss="modal">
								<span aria-hidden="true"> </span><span class="sr-only">Close</span>
							</button>
							<!-- Bhavesh(30-06-2023) added resize Button"  -->
					<div class="button-container custom-margin-left">
                    <button type="button" class="close-btn" onclick="toggleMaximize()">
                        <span aria-hidden="true"><i class="far fa-window-restore fa-2xs"></i></span>
                    </button>
							
						</div>
						</div>
						
						<div class="modal-body ">
									
						<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">
						
						<h4 class="pad-bottom"> <span class="orange">${ongoingProjectCount}</span> ongoing projects worth <span class="orange">${ongoingProjectCost} </span> lakhs</h4>
						<%-- <h5><span class="orange ">&#42; </span><spring:message code="dashbaord.amount.label" />.</h5> --%>
			
							</div>
					<%-- <div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top">	
						<div
							class="table-responsive">

							<table class="table table-bordered table-striped mb-0" id="">
								<thead class="my-custom-scrollbar-thead datatable_thead">
								<tr>
								<th><spring:message code="dashboard.serial.shortcode.label" /></th>
										<th scope="col"><spring:message code="dashboard.group.label" /></th>
										<th scope="col"><spring:message code="dashboard.number.projects.label" /></th>
										<th scope="col"><spring:message code="dashboard.project.outlay.label" /> (in INR) </th>
									</tr>
								</thead>
								<tbody class="">
								<!--Bhavesh 28-07-23 added sumProjectCost and sumTotalCost in tfoot   -->
										<c:set var="sumProjectCost" value="0.0" />
										<c:set var="sumTotalCost" value="0.0" />

										<c:forEach items="${countProjects}" var="count">
											<c:set var="sumProjectCost"
												value="${sumProjectCost +count.projectCost}" />

											<c:set var="sumTotalCost"
												value="${sumTotalCost + count.totalCost}" />
										</c:forEach>
								
												<c:forEach items="${countProjects}" var="count"
										varStatus="loop">
										<tr>
											<td>${loop.index+1}</td>
											<td>${count.groupName}</td>
											<!-- Added by devesh on 27-09-23 to make group name hyperlink to show ongoing projects -->
													<td><a href="#" onclick="closeModalAndClickButton('${count.groupName}'); return false;">${count.groupName}</a></td>
											<td  class="text-right">${count.projectCount}</td>
											<td class="text-right currency-inr">${count.projectCost}</td>
											
										</tr>



									</c:forEach>
								</tbody>
								<tfoot>
											<tr style="background: #1580d0">
												<td colspan="2" class="text-right"><b>Total:</b></td>
												<td class="text-right" id="totalProjectCount"><b>${projectCount}</b></td>
												<td class="text-right currency-inr"><b>${sumProjectCost}</b></td>
												
											</tr>
										</tfoot>
							</table>
						</div>
						</div> --%>
						
						<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top">
								<div class="table-responsive">

									<table class="table table-bordered table-striped mb-0" id="">
										<thead class="my-custom-scrollbar-thead datatable_thead">
											<tr>
												<th><spring:message
														code="dashboard.serial.shortcode.label" /></th>
												<th scope="col"><spring:message
														code="dashboard.group.label" /></th>
												<th scope="col"><spring:message
														code="dashboard.number.projects.label" /></th>
												<%-- 	<th scope="col"><spring:message
												code="dashboard.project.outlay.label" /> (in INR)</th> --%>
												<!---------- CDAC and Total Outlay Display -->
												<th scope="col">C-DAC Outlay</th>
												<th scope="col">Total Outlay</th>
												<!----------CDAC and Total Outlay Display  -->
											</tr>
										</thead>
										<!--Bhavesh 28-07-23 added sumProjectCost and sumTotalCost in tfoot   -->
										<c:set var="sumProjectCost" value="0.0" />
										<c:set var="sumTotalCost" value="0.0" />

										<c:forEach items="${countProjects}" var="count">
											<c:set var="sumProjectCost"
												value="${sumProjectCost +count.projectCost}" />

											<c:set var="sumTotalCost"
												value="${sumTotalCost + count.totalCost}" />
										</c:forEach>

										<tbody class="">

											<c:forEach items="${countProjects}" var="count"
												varStatus="loop">
												<tr>
													<td>${loop.index+1}</td>
													<%-- <td>${count.groupName}</td> --%>
													<!-- Added by devesh on 27-09-23 to make group name hyperlink to show ongoing projects -->
													<td><a href="#" onclick="closeModalAndClickButton('${count.groupName}'); return false;">${count.groupName}</a></td>
													<td class="text-right">${count.projectCount}</td>
													<!---------- CDAC and Total Outlay Display -->
													<td class="text-right currency-inr">${count.projectCost}</td>
													<td class="text-right currency-inr">${count.totalCost}</td>
												</tr>



											</c:forEach>
										</tbody>
                                       <!--Bhavesh 28-07-23 added tfoot to count total  -->
										<tfoot>
											<tr style="background: #1580d0">
												<td colspan="2" class="text-right"><b>Total:</b></td>
												<td class="text-right" id="totalProjectCount"><b>${projectCount}</b></td>
												<td class="text-right currency-inr"><b>${sumProjectCost}</b></td>
												<td class="text-right currency-inr"><b>${sumTotalCost}</b></td>
											</tr>
										</tfoot>



									</table>
								</div>
							</div>
											 
						
						</div>
					</div>
				</div>
			</div>
			
			
			
						<div class="modal in pad-7-Percentage"
				id="dash-grpwise-bargraphNew-modal" tabindex="-1" role="dialog"
				aria-labelledby="myModalLabel" aria-hidden="true"
				data-keyboard="false" data-backdrop="static">
				<div class="modal-dialog modal-lg">
					<div class="modal-content">
						<div class="modal-header">
							<h3 class="modal-title center" id="">
								<spring:message code="dashboard.ongoingprojects.label" />
							</h3>
							<button type="button" class="close" data-dismiss="modal">
								<span aria-hidden="true"> </span><span class="sr-only">Close</span>
							</button>
						</div>

						<div class="modal-body ">

								<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top">
									<div class="table-responsive">

										<table class="table table-bordered table-striped mb-0" id="ongoingProjectList">
											<thead class="my-custom-scrollbar-thead datatable_thead">
												<tr>
													<th><spring:message code="dashboard.serial.shortcode.label" /></th>
										<th scope="col"><spring:message code="dashboard.group.label" /></th>
										<th scope="col"><spring:message code="dashboard.number.projects.label" /></th>
										<th scope="col"><spring:message code="dashboard.project.outlay.label" /> (in INR) </th>
												</tr>
											</thead>
											<tbody class="">

											</tbody>
										</table>

									</div>


								</div>
				
						</div>
					</div>
				</div>
			</div>
			
			<div class="modal dash-newProposalList-modal dash-modal"
				id="dash-newProposalList-modal" tabindex="-1" role="dialog"
				aria-labelledby="myModalLabel" aria-hidden="true"
				data-keyboard="false" data-backdrop="static">
				<!-- Bhavesh(30-06-2023) added new class-mymodal1 and style="width:99%; height:95%;"  -->
                 <div class="modal-dialog modal-lg mymodal1" style="width:99%; height:95%;">
                 <!-- Bhavesh(30-06-2023) added new class-modal-lg and style="height:100%;"  -->
					<div class="modal-content modal-lg " style="height:100%;"> 
						<div class="modal-header">
							<h3 class="modal-title center" id="">
								<%-- <spring:message code="dashboard.newproposals.list" /> --%>
								List of Proposals Submitted & Project Received <%------------ Add Project Received word [12-10-2023] ------------------------%>
							</h3>
							<!-- Bhavesh(30-06-2023) added onclick="restoreprop()"  -->
							<button type="button" class="close" onclick="restoreprop()" data-dismiss="modal">
								<span aria-hidden="true"> </span><span class="sr-only">Close</span>
							</button>
							<!-- Bhavesh(30-06-2023) added resize Button"  -->
					<div class="button-container custom-margin-left">
                    <button type="button" class="close-btn" onclick="toggleMaximize()">
                        <span aria-hidden="true"><i class="far fa-window-restore fa-2xs"></i></span>
                    </button>
							
						</div>
						</div>

						<div class="modal-body dash-modal-body">
							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">

								<h4 class="pad-bottom ">
									<%-- <spring:message code="dashboard.newproposals.label" /> --%>
									 <!-- Bhavesh(30-06-2023) added new class-asOnDateProposals1  -->
									 <%------------ Add Project Received word [12-10-2023] ------------------------%>
								Proposals Submitted	& Project Received since : <span class="orange asOnDateProposals1" id="asOnDateProposals1"></span>
								</h4>
								</div>
								<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 zero">
								<!--Bhavesh(17-07-23) changed grid class from col-md-5 col-lg-5 col-sm-5 col-xs-6 to col-md-9 col-lg-9 col-sm-9  -->
								<div class="col-md-9 col-lg-9 col-sm-9 col-xs-9 pad-bottom text-right "> <label class="font_16">Total Proposals Submitted :</label>  <span id="totalProCost"> </span></div>
								<div class="col-md-3 col-lg-3 col-sm-3 col-xs-3 pad-bottom text-right " id="projRec"><label class="font_16"> Project Received : </label> <span id="totalConvCost"> </span></div>
								</div>
							<div
								class="col-md-12 col-lg-12 col-sm-12 col-xs-12 zero">
							
							<div
								class="col-md-5 col-lg-5 col-sm-5 col-xs-5 date-bar pad-bottom ">

								<label class="font_16" for="from">Last:</label><!-- Bhavesh(30-06-2023) added new class-months1  --> <select class="months1"  id="months" onchange="calculateDates(this.value,'fromProposal','toProposal','goProposal',1)" class="inline form-control" style="width:80%">
								<option value="0">Select Months/Year's</option>
								<option value="3">3 Months</option>
								<option value="6">6 Months</option>
								<option value="12">1 Years</option>
								<option value="24">2 Years</option>
								<%-- Bhavesh (17-10-23) extended the filter to 3 years and 5 years --%>
								        <option value="36">3 Years</option> 
								        <option value="60">5 Years</option>
								</select>
			
							<!-- <div style="text-align:right;olor: #1578c2;"><a href="javascript:void()" onclick="openProposalAnotherFilter()" id="propSubCust"><i>Custom Duration</i></a></div> -->
							</div>
							<div id="proposalsAnotherFilter">
							<div
								class="col-md-1 col-lg-1 col-sm-1 col-xs-2 pad-bottom " style="padding-top:4px;">
								<h3 style="color: #1578c2;"><strong>OR</strong></h3>
								</div>
							<div class="col-md-6 col-lg-6 col-sm-6 col-xs-6  date-bar  pad-bottom ">

								<label class="font_16" for="from">From</label><!-- Bhavesh(30-06-2023) added new class-fromProposal1  --> <input class="fromProposal1" type="text"
									id="fromProposal" name="from" readonly /> <label class="font_16"
									for="to">To</label><!-- Bhavesh(30-06-2023) added new class-toProposal1  --> <input class="toProposal1" type="text" id="toProposal"
									name="to" readonly /> &nbsp; &nbsp;
								<button type="button" id="goProposal" class="btn btn-success ">Go</button>

							</div>
							</div>
							</div>
							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top">
								<!-- 
								<br> <br> -->
								<table id="newProposals_dataTable"
									class="table table-striped table-bordered" style="width: 100%">
									<thead class="datatable_thead bold ">
										<tr>
											<%-- <th width="5%"><spring:message code="forms.serialNo" />
											</th> --%>
											<%--  --%>
											<th width="14%"><spring:message code="group.groupName" /></th>
											<th width="22%"><spring:message code="menu.proposal.label" /></th>
											<th width="19%"><spring:message code="client.name" /></th>
											<th width="8%"><spring:message code="dashboard.newproposals.submittedOn" /></th>
											<th width="8%"><spring:message code="project.details.duration" /></th>
											<th width="2%"><spring:message code="dashboard.newproposals.received.project" /></th>
											<th width="10%"><spring:message code="dashboard.lable.outlay" /></th>
											<!-- new column added of total outlay by varun -->
											<th width="10%">Value of Proposal(Total Outlay) </th>
											<!-- Added heading for proposal history column in new proposal tiles by devesh on 2/8/23 -->
											<th width="6%">View Proposal History</th>
											<!-- End of heading -->


										</tr>
									</thead>
			<%------------------  Add Filter in Proposal List by Group Name [ 01/08/2023 ]   ----------------------------------%>
									<thead class="filters">
										<tr>
											<th width="14%" class="comboBox"><spring:message code="group.groupName" /></th>
											<th width="22%"></th> 
											<th width="19%"></th> 
											<th width="8%"></th>
											<th width="8%"></th>
											<th width="2%"></th>
											<th width="10%"></th>
											<th width="10%"></th>
											<th width="6%"></th>
										</tr>
									</thead>
									<tbody class="">
									</tbody>
									<%--------- Add footer [12-10-2023] ----------%>
									<tfoot>
										<tr>
											<td colspan="9">
						      					<div class="legend">
											        <div class="legend-item">
											          <div class="legend-color" style="background-color: #0d9b94;"></div>
											          <span>Proposal</span>
											        </div>
											        <div class="legend-item">
											          <div class="legend-color" style="background-color:#1578c2;"></div>
											          <span>Converted Proposal to Project</span>
											        </div>
										        <!-- Add more legend items as needed -->
										      </div>
										    </td>
										</tr>
									</tfoot>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
			
			<!-- Proposal History Modal added by devesh on 2/8/23 -->
			<div class="modal amount_receive_deatil_modal" id="history"
			tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
			aria-hidden="true" data-keyboard="true" data-backdrop="true">
				<div class="modal-dialog modal-lg" id="proposalhistorymodal" role="document" style="bottom:55px;">
					<div class="modal-content">
						<div class="modal-header">
							<h4 class="modal-title  center" id="exampleModalLabel">Proposal History</h4>
							<button type="button" class="close" data-dismiss="modal"
								aria-label="Close" onclick="restoreproposalsize()">
								<span aria-hidden="true">&times;</span>
							</button>
							<div class="button-container custom-margin-left" style="margin-left:93%;">
			                    <button type="button" class="close-btn" onclick="toggleproposalhistory()">
			                        <span aria-hidden="true"><i class="far fa-window-restore fa-2xs"></i></span>
			                    </button>
							</div>
						</div>
						<div class="modal-body">
							<table id="HistoryTable" class="table table-striped table-bordered example_det "
								style="width: 100%">
							<thead class="datatable_thead bold">
								<tr>
									<th><spring:message code="forms.serialNo"/></th>
								  	<th>Revision Number</th>
									<th>Modified By</th>
									<th>Date On:</th>
									<th>Remarks</th>
									<th>Total Proposal Cost</th>
									<th>Project Category</th>
									<th>Project Type</th>
									<th>Title</th>
									<th>Submitted To</th>
									<th>Corporate Approval</th>
									<th>Clearance Recieve Date</th>
									<th>End User Id</th>
									<th>Is Collaborative</th>
									<th>Date of Submission</th>
									<th>Contact Person</th>
									<th>Duration</th>
									<th>Objectives</th>
									<th>CDAC Outlay Cost</th>
									<th>Submitted By</th>
									<th>Description</th>
									<th>Background</th>
									<th>FTS File No</th>	
								</tr>
							</thead>
							<tbody class="">
							
							</tbody>
							</table>
					
						</div>
						<div class="modal-footer" id="modelFooter">
						
						</div>
					</div>
				</div>
			</div>
			<!-- End of proposal history modal -->
			
						<div class="modal dash-newProposalListByGroup-modal dash-modal" id="dash-newProposalListByGroup-modal"
			tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
			aria-hidden="true" data-keyboard="false" data-backdrop="static">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<h3 class="modal-title center" id="">
						 	<spring:message code="dashboard.newproposals.list" />
 					</h3>
						<button type="button" class="close" data-dismiss="modal">
							<span aria-hidden="true"> </span><span class="sr-only">Close</span>
						</button>
					</div>

					<div class="modal-body dash-modal-body">
					<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">

							 <h4 class="pad-bottom">
								 <spring:message code="dashboard.newproposals.label" /> 
								since : <span class="orange" id="asOnDateProp1"></span>
							</h4> 
							<h4 class="pad-bottom">
								 <spring:message code="group.groupName" /> 
								: <span class="orange" id="propSubGroupName"></span>
							</h4> 

						</div> 
						
						<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 date-bar ">

								<label class="" for="from">From</label> 
								<input type="text" id="fromProposalNew" name="from" readonly/>
								<label class="" for="to">To</label>
								 <input type="text" id="toProposalNew" name="to" readonly/>
								 &nbsp; &nbsp;
								 <input type="hidden" id="proposalGrpId">
								 <button type="button" id="goProposal" class="btn btn-success btn-successNew">Go</button>

							</div> 
				
						<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top">
									
										<table id="newProposalsByGroup_dataTable"
											class="table table-striped table-bordered"
											style="width: 100%">
											<thead class="datatable_thead bold ">
												<tr>
													<th width="5%"><spring:message code="forms.serialNo"/> </th>
													<%--  <th width="15%"><spring:message code="group.groupName" /></th> --%>
													 <th width="40%"><spring:message code="menu.proposal.label" /></th>
													
													<%-- <th width="30%"><spring:message code="dashboard.client.name" /></th> --%>
													<th width="15%"><spring:message code="dashboard.newproposals.submittedOn" /></th> 
													
													<th width="15%"><spring:message code="project.details.duration" /></th>
													<th width="15%"><spring:message code="dashboard.newproposals.received.project" /></th>
													<th width="15%"><spring:message code="dashboard.lable.outlay" /></th> 
													 
																								
												</tr>
											</thead>	
																					
											<tbody class="">
											</tbody>
										</table>
									</div>
					</div>
				</div>
			</div>
		</div>
<!-- Bhavesh(30-06-2023) added new class-dash-newProposalList-modal  -->			
<div class="modal dash-newProjectList-modal dash-modal dash-newProposalList-modal"
				id="dash-newProjectList-modal" tabindex="-1" role="dialog"
				aria-labelledby="myModalLabel" aria-hidden="true"
				data-keyboard="false" data-backdrop="static">
				<!-- Bhavesh(30-06-2023) added new class-mymodal1 and style="width:99%; height:95%;"  -->
                 <div class="modal-dialog modal-lg mymodal1" style="width:99%; height:95%;">
                   <!-- Bhavesh(30-06-2023) added new class-modal-lg and style="height:100%;"  -->
					<div class="modal-content modal-lg " style="height:100%;">
						<div class="modal-header">
							<h3 class="modal-title center" id="">
							<%------------ Remove Received word [12-10-2023] ------------------------%>
								List of Projects Approval Pending<%-- <spring:message code="dashboard.newprojects.list" /> --%>
							</h3>
							<!-- Bhavesh(30-06-2023) added onclick="restoreprop()"  -->
							<button type="button" class="close" onclick="restoreprop()" data-dismiss="modal">
								<span aria-hidden="true"> </span><span class="sr-only">Close</span>
							</button>
							<!-- Bhavesh(30-06-2023) added resize Button"  -->
					<div class="button-container custom-margin-left">
                    <button type="button" class="close-btn" onclick="toggleMaximize()">
                        <span aria-hidden="true"><i class="far fa-window-restore fa-2xs"></i></span>
                    </button>
							
						</div>
						</div>

						<div class="modal-body dash-modal-body">
							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">

								<h4 class="pad-bottom">
									Projects <%-- <spring:message code="dashboard.newprojects.label" /> --%>
									since : <!-- Bhavesh(30-06-2023) added new class-asOnDateProposals1  --><span class="orange asOnDateProposals1" id="asOnDateProjects1"></span>
								</h4>
								  <%------------      Display Project Received Count with costs of projects [21-08-2023]   ------------------%>
								<div class="text-right"><label class="font_16"> Project Received : </label> <span id="totalProjectReceivedCost"> </span></div>
							</div>

								<!-- <div
								class="col-md-12 col-lg-12 col-sm-12 col-xs-12 date-bar pad-bottom">

								<label class="" for="from">Last:</label> <select id="months" onchange="calculateDates(this.value,'from','to','go-btn',0)" class="inline form-control" style="width:32%">
								<option value="0">Select Months/Year's</option>
								<option value="3">3 Months</option>
								<option value="6">6 Months</option>
								<option value="12">1 Years</option>
								<option value="24">2 Years</option>
								</select>
			

							</div>

							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 date-bar ">

								<label class="" for="from">From</label> <input type="text"
									id="from" name="from" readonly /> <label class="" for="to">To</label>
								<input type="text" id="to" name="to" readonly /> &nbsp; &nbsp;
								<button type="button" class="btn btn-success go-btn">Go</button>

							</div> -->
							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 zero">
							
							<div
								class="col-md-5 col-lg-5 col-sm-5 col-xs-5 date-bar pad-bottom ">
                                <!-- Bhavesh(30-06-2023) added new class-months1  -->
								<label class="font_16" for="from">Last:</label> <select class="months1 inline form-control" id="months" onchange="calculateDates(this.value,'from','to','go-btn',0)" style="width:80%">
								<option value="0">Select Months/Year's</option>
								<option value="3">3 Months</option>
								<option value="6">6 Months</option>
								<option value="12">1 Years</option>
								<option value="24">2 Years</option>
								</select>
			
<!-- <div style="text-align:right;olor: #1578c2;"><a href="javascript:void()" id="ProjectCust" onclick="openProjectsAnotherFilter()" ><i>Custom Duration</i></a></div> -->
							</div>
							<div id="projectsAnotherFilter">
							<div
								class="col-md-1 col-lg-1 col-sm-1 col-xs-2 pad-bottom " style="padding-top:4px;">
								<h3 style="color: #1578c2;;"><strong>OR</strong></h3>
								</div>
							<div class="col-md-6 col-lg-6 col-sm-6 col-xs-6  date-bar  pad-bottom ">

								<label class="font_16" for="from">From</label><!-- Bhavesh(30-06-2023) added new class-fromProposal1  --> <input class="fromProposal1" type="text"
									id="from" name="from" readonly /> <label class="font_16"
									for="to">To</label><!-- Bhavesh(30-06-2023) added new class-toProposal1  --> <input class="toProposal1" type="text" id="to"
									name="to" readonly /> &nbsp; &nbsp;
								<button type="button"  class="btn btn-success go-btn ">Go</button>

							</div>
							</div>
							</div>
 <%------------------  Table contains all projects with its pending status [ 21-08-2023 ]  --------------------%>
				<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top">

								<table id="newProjects_dataTable"
									class="table table-striped table-bordered" style="width: 100%">
									<thead class="datatable_thead bold ">
										<tr>
											<th width="15%"><spring:message code="group.groupName" /></th>
											<th width="18%"><spring:message code="master.name" /></th>
											<th width="12%"><spring:message
													code="client.name" /></th>
											<th width="12%"><spring:message
													code="projectMaster.MOUdate" /> <i
												class="fas fa-grip-lines-vertical"></i> <spring:message
													code="projectMaster.WorkorderDate" /></th>
											<th width="10%"><spring:message
													code="dashboard.project.startDate" /></th>
											<th width="10%"><spring:message
													code="projectMaster.endDate" /></th>
											<th width="8%"><spring:message
													code="dashboard.lable.outlay" /></th>
											<th width="10%">Status</th>
										</tr>
									</thead>
									<thead class="filters">
										<tr>
											<th width="15%" class="comboBox"></th>
											<th width="18%"></th>
											<th width="12%"></th>
											<th width="12%"></th>
											<th width="10%"></th>
											<th width="10%"></th>
											<th width="8%"></th>
											<th width="10%" id="projectStatusCol"></th>

										</tr>
									</thead>
									<tbody class="">
									</tbody>
									<%--------- Add Footer [12-10-2023] ----------%>
									<tfoot>
										<tr>
											<td colspan="8">
						      					<div class="legend">
											        <div class="legend-item">
											          <div class="legend-color" style="background-color: #1578c2;"></div>
											          <span>Project Reference Number Generated</span>
											        </div>
											        <div class="legend-item">
											          <div class="legend-color" style="background-color:#800080;"></div>
											          <span>Project Reference Number Not Generated</span>
											        </div>
										        <!-- Add more legend items as needed -->
										      </div>
										    </td>
										</tr>
									</tfoot>
								</table>
							</div> 
 <%------------------  End of Table contains all projects with its pending status --------------------%>
<%-- <!---------------------------------------------- PENDING AT PL [04-08-2023] --------------------------------------------------------------------->
							<div class="panel-group" id="accordionGroupClosed" role="tablist" aria-multiselectable="true">
								<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top">
									<div class="panel panel-info  ">
										<div class="panel-heading font_16" data-toggle="collapse" data-target="#multiCollapse10" style="cursor: pointer;background: #1e2787 !important;">
											<a class="collapsed" style="color: white;"
													data-toggle="collapse" href="#multiCollapse10"
													aria-expanded="false" aria-controls="multiCollapse10">
													Pending at PL
											</a>
										</div>
										<div class="panel-collapse collapse" id="multiCollapse10" role="tabpanel" aria-labelledby="headingTwo">
											<div class="panel-body">
												<div class="table-responsive">
												<table id="newProjects_dataTable_PL"
													class="table table-striped table-bordered"
													style="width: 100%">
													<thead class="datatable_thead bold ">
														<tr>
															<th width="15%"><spring:message
																	code="group.groupName" /></th>
															<th width="25%"><spring:message code="master.name" /></th>

															<!-- change the label clientname on 23-05-23 -->
															<th width="12%"><spring:message
																	code="dashboard.client.name" /></th>

															<th width="12%"><spring:message
																	code="projectMaster.MOUdate" /> <i
																class="fas fa-grip-lines-vertical"></i> <spring:message
																	code="projectMaster.WorkorderDate" /></th>
															<th width="18%"><spring:message
																	code="dashboard.project.startDate" /></th>
															<th width="18%"><spring:message
																	code="projectMaster.endDate" /></th>
															<th width="20%"><spring:message
																	code="dashboard.lable.outlay" /></th>

														</tr>
													</thead>
													<tbody class="">
													</tbody>
												</table>
											</div>
											</div>
										</div>
									</div>
								</div>
<!-------------------------------------------- PENDING AT HOD [04-08-2023] --------------------------------------------------------------------->
								<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top">
									<div class="panel panel-info">
										<div class="panel-heading font_16" data-toggle="collapse" data-target="#multiCollapse11" style="cursor: pointer;background: #1e2787 !important;">
										  <a class="collapsed" style="color: white;"
													data-toggle="collapse" href="#multiCollapse11"
													aria-expanded="false" aria-controls="multiCollapse11">
													Pending at HOD
											</a>
										</div>
										<div class="panel-collapse collapse" id="multiCollapse11" role="tabpanel" aria-labelledby="headingTwo">
											<div class="panel-body">
												<div class="table-responsive">
												<table id="newProjects_dataTable_HOD"
													class="table table-striped table-bordered"
													style="width: 100%">
													<thead class="datatable_thead bold ">
														<tr>
															<th width="15%"><spring:message
																	code="group.groupName" /></th>
															<th width="25%"><spring:message code="master.name" /></th>

															<!-- change the label clientname on 23-05-23 -->
															<th width="12%"><spring:message
																	code="dashboard.client.name" /></th>

															<th width="12%"><spring:message
																	code="projectMaster.MOUdate" /> <i
																class="fas fa-grip-lines-vertical"></i> <spring:message
																	code="projectMaster.WorkorderDate" /></th>
															<th width="18%"><spring:message
																	code="dashboard.project.startDate" /></th>
															<th width="18%"><spring:message
																	code="projectMaster.endDate" /></th>
															<th width="20%"><spring:message
																	code="dashboard.lable.outlay" /></th>

														</tr>
													</thead>
													<tbody class="">
													</tbody>
												</table>
											</div>
											</div>
										</div>
									</div>
								</div>

<!-------------------------------------------- PENDING AT GC [04-08-2023] --------------------------------------------------------------------->
								<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top">
									<div class="panel panel-info  ">
										<div class="panel-heading font_16" data-toggle="collapse" data-target="#multiCollapse12" style="cursor: pointer;background: #1e2787 !important;">
											<a class="collapsed" style="color: white;"
													data-toggle="collapse" href="#multiCollapse12"
													aria-expanded="false" aria-controls="multiCollapse12">
													Pending at GC
											</a>
										</div>
										<div class="panel-collapse collapse" id="multiCollapse12" role="tabpanel" aria-labelledby="headingTwo">
											<div class="panel-body">
												<div class="table-responsive">
												<table id="newProjects_dataTable_GC"
													class="table table-striped table-bordered"
													style="width: 100%">
													<thead class="datatable_thead bold ">
														<tr>
															<th width="15%"><spring:message
																	code="group.groupName" /></th>
															<th width="25%"><spring:message code="master.name" /></th>

															<!-- change the label clientname on 23-05-23 -->
															<th width="12%"><spring:message
																	code="dashboard.client.name" /></th>

															<th width="12%"><spring:message
																	code="projectMaster.MOUdate" /> <i
																class="fas fa-grip-lines-vertical"></i> <spring:message
																	code="projectMaster.WorkorderDate" /></th>
															<th width="18%"><spring:message
																	code="dashboard.project.startDate" /></th>
															<th width="18%"><spring:message
																	code="projectMaster.endDate" /></th>
															<th width="20%"><spring:message
																	code="dashboard.lable.outlay" /></th>

														</tr>
													</thead>
													<tbody class="">
													</tbody>
												</table>
											</div>
											</div>
										</div>
									</div>
								</div>
<!-------------------------------------------- PENDING AT PMO [04-08-2023] --------------------------------------------------------------------->							
								<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top">
									<div class="panel panel-info  ">
										<div class="panel-heading font_16" data-toggle="collapse" data-target="#multiCollapse13" style="cursor: pointer;background: #1e2787 !important;">
											<a class="collapsed" style="color: white;"
													data-toggle="collapse" href="#multiCollapse13"
													aria-expanded="false" aria-controls="multiCollapse13">
													Pending at PMO
											</a>
										</div>
										<div class="panel-collapse collapse" id="multiCollapse13" role="tabpanel" aria-labelledby="headingTwo">
											<div class="panel-body">
												<div class="table-responsive">
												<table id="newProjects_dataTable_PMO"
													class="table table-striped table-bordered"
													style="width: 100%">
													<thead class="datatable_thead bold ">
														<tr>
															<th width="15%"><spring:message
																	code="group.groupName" /></th>
															<th width="25%"><spring:message code="master.name" /></th>

															<!-- change the label clientname on 23-05-23 -->
															<th width="12%"><spring:message
																	code="dashboard.client.name" /></th>

															<th width="12%"><spring:message
																	code="projectMaster.MOUdate" /> <i
																class="fas fa-grip-lines-vertical"></i> <spring:message
																	code="projectMaster.WorkorderDate" /></th>
															<th width="18%"><spring:message
																	code="dashboard.project.startDate" /></th>
															<th width="18%"><spring:message
																	code="projectMaster.endDate" /></th>
															<th width="20%"><spring:message
																	code="dashboard.lable.outlay" /></th>

														</tr>
													</thead>
													<tbody class="">
													</tbody>
												</table>
											</div>
											</div>
										</div>
									</div>
								</div>
							</div>
<!-----------------------------------  panel-group End  ------------------------------------------------------------> --%>
						</div>
					</div>
				</div>
			</div>

		
		
		<div class="modal dash-newProjectListByGroup-modal dash-modal" id="dash-newProjectListByGroup-modal"
			tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
			aria-hidden="true" data-keyboard="false" data-backdrop="static">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<h3 class="modal-title center" id="">
						 	<spring:message code="dashboard.newprojects.list" />
 					</h3>
						<button type="button" class="close" data-dismiss="modal">
							<span aria-hidden="true"> </span><span class="sr-only">Close</span>
						</button>
					</div>

					<div class="modal-body dash-modal-body">
					<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">

							 <h4 class="pad-bottom">
								 <spring:message code="dashboard.newprojects.label" /> 
								since : <span class="orange" id="asOnDateProj1"></span>
							</h4> 
							
							<h4 class="pad-bottom">
								 <spring:message code="group.groupName" /> 
								: <span class="orange" id="projRecGroupName"></span>
							</h4> 

						</div> 
						
						<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 date-bar ">

								<label class="" for="from">From</label> 
								<input type="text" id="fromNew" name="from" readonly/>
								<label class="" for="toNew">To</label>
								 <input type="text" id="toNew" name="to" readonly/>
								 &nbsp; &nbsp;
								 <input type="hidden" id="projectGroupId">
								 <button type="button" class="btn btn-success go-btnNew">Go</button>

							</div> 
				
						<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top">
									
										<table id="newProjectsByGroups_dataTable"
											class="table table-striped table-bordered"
											style="width: 100%">
											<thead class="datatable_thead bold ">
												<tr>
													<th width="5%"><spring:message code="forms.serialNo"/> </th>
													<%--  <th width="20%"><spring:message code="group.groupName" /></th> --%>
													 <th width="35%"><spring:message code="master.name" /></th>
									<%-- 				<th width="20%"><spring:message code="project.projectRefNo" /></th>
													<th width="30%"><spring:message code="dashboard.client.name" /></th> --%>
													<th width="15%"><spring:message code="projectMaster.MOUdate" /></th> 
													<th width="15%"><spring:message code="projectMaster.WorkorderDate" /></th>
													<th width="15%"><spring:message code="dashboard.project.startDate" /></th>
													<th width="15%"><spring:message code="dashboard.lable.outlay" /></th> 
																					
																					
												</tr>
											</thead>	
																					
											<tbody class="">
											</tbody>
										</table>
									</div>
					</div>
				</div>
			</div>
		</div>
		
		
		<div class="modal dash-newProjectList-modal dash-modal"
				id="dash-new-joinee-modal" tabindex="-1" role="dialog"
				aria-labelledby="myModalLabel" aria-hidden="true"
				data-keyboard="false" data-backdrop="static">
				<div class="modal-dialog modal-lg">
					<div class="modal-content">
						<div class="modal-header">
							<h3 class="modal-title center" id="">
								New Joinees
							</h3>
							<button type="button" class="close" data-dismiss="modal">
								<span aria-hidden="true"> </span><span class="sr-only">Close</span>
							</button>
						</div>

						<div class="modal-body dash-modal-body">
							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">

								<h4 class="pad-bottom">
									New Joinees
									since : <span class="orange" id="asOnDateJoinee1"></span>
								</h4>

							</div>

							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 date-bar ">

								<label class="" for="from">From</label> <input type="text"
									id="fromJoin" name="from" readonly /> <label class="" for="to">To</label>
								<input type="text" id="toJoin" name="to" readonly /> &nbsp; &nbsp;
								<button type="button" class="btn btn-success go-btn-join">Go</button>

							</div>

							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top">

								<table id="joinee_dataTable"
									class="table table-striped table-bordered" style="width: 100%">
									<thead class="datatable_thead bold ">
										<tr>
											<th width="5%"><spring:message code="forms.serialNo" />
											</th>
											<th width="20%"><spring:message code="employee_Role.group_Name" />
											</th>
											<th width="15%">Employee Id</th>
									
											<th width="25%"><spring:message
													code="employee_Role.employee_Name" /></th>
											<th width="20%"><spring:message
													code="employee.designation" /></th>
											<th width="15%"><spring:message
													code="employee.dateofJoining" /></th>
													<th width="15%">Status</th>

										</tr>
									</thead>
									<thead class="filters ">
												<tr>
											<th width="5%"></th>
											<th width="20%" class="comboBox"><spring:message code="employee_Role.group_Name" /></th>
											<th width="15%"></th>
											<th width="25%"></th>
											<th width="20%" class="comboBox"><spring:message
													code="employee.designation" /></th>
											<th width="15%"></th>
											<th width="15%"></th>	
											</tr>
											</thead>
									<tbody class="">
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
			
			
			<div class="modal dash-newProjectList-modal dash-modal"
				id="dash-new-joinee-ByGroup-modal" tabindex="-1" role="dialog"
				aria-labelledby="myModalLabel" aria-hidden="true"
				data-keyboard="false" data-backdrop="static">
				<div class="modal-dialog modal-lg">
					<div class="modal-content">
						<div class="modal-header">
							<h3 class="modal-title center" id="">
								New Joinees
							</h3>
							<button type="button" class="close" data-dismiss="modal">
								<span aria-hidden="true"> </span><span class="sr-only">Close</span>
							</button>
						</div>

						<div class="modal-body dash-modal-body">
							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">

								<h4 class="pad-bottom">
									New Joinees
									since : <span class="orange" id="asOnDateJoin1"></span>
								</h4>
								
								<h4 class="pad-bottom">
								 <spring:message code="group.groupName" /> 
								: <span class="orange" id="joineeGroupName"></span>
							</h4> 

							</div>

							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 date-bar ">

								<label class="" for="from">From</label> <input type="text"
									id="fromJoinNew" name="from" readonly /> <label class="" for="to">To</label>
								<input type="text" id="toJoinNew" name="to" readonly /> &nbsp; &nbsp;
								<input type="hidden" id="joinGroupId">
								<button type="button" class="btn btn-success go-btn-joinNew">Go</button>

							</div>

							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top">

								<table id="joineeBygroup_dataTable"
									class="table table-striped table-bordered" style="width: 100%">
									<thead class="datatable_thead bold ">
										<tr>
											<th width="5%"><spring:message code="forms.serialNo" />
											</th>
										<%-- 	<th width="20%"><spring:message code="employee_Role.group_Name" /> --%>
											</th>
											<th width="15%">Employee Id</th>
									
											<th width="25%"><spring:message
													code="employee_Role.employee_Name" /></th>
											<th width="20%"><spring:message
													code="employee.designation" /></th>
											<th width="15%"><spring:message
													code="employee.dateofJoining" /></th>
													<th width="15%">Status</th>

										</tr>
									</thead>
									
									<tbody class="">
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
			
		<div class="modal dash-newProjectList-modal dash-modal"
				id="dash-resigned-emp-modal" tabindex="-1" role="dialog"
				aria-labelledby="myModalLabel" aria-hidden="true"
				data-keyboard="false" data-backdrop="static">
				<div class="modal-dialog modal-lg">
					<div class="modal-content">
						<div class="modal-header">
							<h3 class="modal-title center" id="">
								Resigned Employees
							</h3>
							<button type="button" class="close" data-dismiss="modal">
								<span aria-hidden="true"> </span><span class="sr-only">Close</span>
							</button>
						</div>

						<div class="modal-body dash-modal-body">
							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">

								<h4 class="pad-bottom">
									Resigned
									since : <span class="orange" id="asOnDateResign1"></span>
								</h4>

							</div>

							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 date-bar ">

								<label class="" for="from">From</label> <input type="text"
									id="fromRes" name="from" readonly /> <label class="" for="to">To</label>
								<input type="text" id="toRes" name="to" readonly /> &nbsp; &nbsp;
								<button type="button" class="btn btn-success go-btn-resign">Go</button>

							</div>

							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top">

								<table id="resigned_dataTable"
									class="table table-striped table-bordered" style="width: 100%">
									<thead class="datatable_thead bold ">
										<tr>
											<th width="5%"><spring:message code="forms.serialNo" />
											</th>
											<th width="20%"><spring:message code="employee_Role.group_Name" />
											</th>
											<th width="15%">Employee Id</th>
									
											<th width="25%"><spring:message
													code="employee_Role.employee_Name" /></th>
											<th width="20%"><spring:message
													code="employee.designation" /></th>
											<th width="15%">Date of Resign/Release</th>
											<th width="15%">Status</th>

										</tr>
									</thead>
									<thead class="filters ">
												<tr>
											<th width="5%"></th>
											<th width="20%" class="comboBox"><spring:message code="employee_Role.group_Name" /></th>
											<th width="15%"></th>
											<th width="25%"></th>
											<th width="20%" class="comboBox"><spring:message
													code="employee.designation" /></th>
											<th width="15%"></th>
											<th width="15%"></th>
											</tr>
											</thead>
									<tbody class="">
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
			
			<div class="modal dash-newProjectListByGroup-modal dash-modal"
				id="dash-resigned-empByGroup-modal" tabindex="-1" role="dialog"
				aria-labelledby="myModalLabel" aria-hidden="true"
				data-keyboard="false" data-backdrop="static">
				<div class="modal-dialog modal-lg">
					<div class="modal-content">
						<div class="modal-header">
							<h3 class="modal-title center" id="">
								Resigned Employees
							</h3>
							<button type="button" class="close" data-dismiss="modal">
								<span aria-hidden="true"> </span><span class="sr-only">Close</span>
							</button>
						</div>

						<div class="modal-body dash-modal-body">
							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">

								<h4 class="pad-bottom">
									Resigned
									since : <span class="orange" id="asOnDateRes1"></span>
								</h4>
								
								<h4 class="pad-bottom">
								 <spring:message code="group.groupName" /> 
								: <span class="orange" id="resignGroupName"></span>
							</h4> 

							</div>

							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 date-bar ">

								<label class="" for="from">From</label> <input type="text"
									id="fromResNew" name="from" readonly /> <label class="" for="to">To</label>
								<input type="text" id="toResNew" name="to" readonly /> &nbsp; &nbsp;
								<input type="hidden" id="resignGroupId">
								<button type="button" class="btn btn-success go-btn-resignNew">Go</button>

							</div>

							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top">

								<table id="resignedByGroup_dataTable"
									class="table table-striped table-bordered" style="width: 100%">
									<thead class="datatable_thead bold ">
										<tr>
											<th width="5%"><spring:message code="forms.serialNo" />
											</th>
											<%-- <th width="20%"><spring:message code="employee_Role.group_Name" />
											</th> --%>
											<th width="15%">Employee Id</th>
									
											<th width="25%"><spring:message
													code="employee_Role.employee_Name" /></th>
											<th width="20%"><spring:message
													code="employee.designation" /></th>
											<th width="15%">Date of Resign/Release</th>
											<th width="15%">Status</th>

										</tr>
									</thead>
									
									<tbody class="">
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
			  
			  
			<div class="modal dash-pending-payments-modal dash-modal "
				id="Employee-Details-modal" role="dialog"
				aria-labelledby="myModalLabel" aria-hidden="true"
				data-keyboard="false" data-backdrop="static">
				
                <div class="modal-dialog modal-lg " >
                 
					<div class="modal-content modal-lg " > 
						<div class="modal-header">
							<h3 class="modal-title center" id="">
								 List of employees which are not fully mapped to the project
							</h3>
							
							<button type="button" class="close"  data-dismiss="modal">
								<span aria-hidden="true"> </span><span class="sr-only">Close</span>
							</button>
							
						</div>
							
						<div class="modal-body dash-modal-body">
							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top">
								<table id="employeeDetails"
									class="table table-striped table-bordered" style="width: 100%">
									<thead class="datatable_thead bold ">
										<tr>
											<th width="5%"><spring:message code="forms.serialNo" /></th>
											
											<th width="20%"><spring:message code="employee_Role.group_Name" /></th>
											<th width="10%"><spring:message code="employee.EmployeeId"/></th>
											<th width="20%"><spring:message code="employee_Role.employee_Name"/></th>
											<th width="13%"><spring:message code="employee.designation"/></th>
											<%-- <th width="15%"><spring:message code="thirdParty.contact.number" /></th> --%>
											<th width="15%">Mapped Involvement</th>
											<th width="15%">Non-Mapped Involvement</th>								
										</tr>
									</thead>
									
									<thead class="filters ">
										<tr>
											<th width="5%"></th>
											<th width="20%" class="comboBox"><spring:message code="employee_Role.group_Name" /></th>
											<th width="10%"></th>
											<th width="20%"></th> 
											<th width="13%"></th>
											<th width="15%"></th> 
											<th width="15%"></th>									
										</tr>
									</thead>
									
									<tbody class=""></tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
			
		<div class="modal amount_receive_deatil_modal" id="empProjectDetails"
		tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
		aria-hidden="true" data-keyboard="false" data-backdrop="static">
		<div class="modal-dialog modal-lg" role="document">
			<div class="modal-content" style="margin-left:10%;width:75%">
				<div class="modal-header"  style="background: #15c2b2 !important;" >
					<h4 class="modal-title  center" id="exampleModalLabel" >Employee Project Details</h4>
					<button type="button" class="close" data-dismiss="modal"
						aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
				<div class="row pad-top ">
									
										<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group">
										<div class="col-md-2 col-lg-2 col-sm-2 col-xs-2">

											<label class="label-class"><b><spring:message
													code="employee_Role.employee_Name" />:</b></label> 

										</div>
										<div class="col-md-6 col-lg-6 col-sm-6 col-xs-6" id="employeeName">
											
										</div>
									</div>
									</div>
             <table id="empInvTable" class="table table-striped table-bordered example_det "
						style="width: 100%">
					<thead class="datatable_thead bold">
						<tr>
						    <th>S.No</th>
						    <th>Project Name</th>  
						    <th>Role</th>
							<th>Start Date</th>
							<th>End Date</th>
							<th>Involvement</th>							
						</tr>
					</thead>
					<tbody class="">
					
				</tbody>
			</table>
				</div>
				<div class="modal-footer" id="modelFooter">
					
				</div>
			</div>
		</div>
	</div>
	
	
<%-- 	<div class="modal amount_receive_deatil_modal" id="allDetails"
		tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
		aria-hidden="true" data-keyboard="false" data-backdrop="static">
		<div class="modal-dialog modal-lg" role="document">
			<div class="modal-content" style="margin-left:10%;width:75%">
				<div class="modal-header"  style="background: #15c2b2 !important;" >
					<h4 class="modal-title  center" id="exampleModalLabel" >All Details</h4>
					<button type="button" class="close" data-dismiss="modal"
						aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
				<div class="row pad-top ">
									
										<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group">
										<div class="col-md-2 col-lg-2 col-sm-2 col-xs-2">

											<label class="label-class"><b><spring:message
													code="employee_Role.employee_Name" />:</b></label> 

										</div>
										<div class="col-md-6 col-lg-6 col-sm-6 col-xs-6" id="employeeName">
											
										</div>
									</div>
									</div>
             <table id="allDetailsTable" class="table table-striped table-bordered example_det "
						style="width: 100%">
					<thead class="datatable_thead bold">
						<tr>
						    <th>Department</th>
						    <th>Proposals Submitted </th>  
						    <th>Projects Received</th>
							<th>Projects Closed</th>
							<th>Joined Employees</th>
							<th>Resigned Employees</th>							
						</tr>
					</thead>
					<tbody class="">
					
				</tbody>
			</table>
				</div>
				<div class="modal-footer" id="modelFooter">
					
				</div>
			</div>
		</div>
	</div> --%>
	
			<%--
		
 --%>		<!-- End of modal for New Project -->

<!-- Modal for Closed Projects -->
<!-- Bhavesh(30-06-2023) added new class-dash-newProposalList-modal  -->
		<div class="modal dash-closedProjectList-modal dash-modal dash-newProposalList-modal "
				id="dash-closedProjectList-modal" tabindex="-1" role="dialog"
				aria-labelledby="myModalLabel" aria-hidden="true"
				data-keyboard="false" data-backdrop="static">
				<!-- Bhavesh(30-06-2023) added new class-mymodal1 and style="width:99%; height:95%;"  -->
                  <div class="modal-dialog modal-lg mymodal1" style="width:99%; height:95%;">
                  <!-- Bhavesh(30-06-2023) added new class-modal-lg and style="height:100%;"  -->
					<div class="modal-content modal-lg " style="height:100%;"> 
						<div class="modal-header">
							<h3 class="modal-title center" id="">
								<spring:message code="dashboard.closedprojects.list" />
							</h3>
							<!-- Bhavesh(30-06-2023) added onclick="restoreprop()"  -->
							<button type="button" class="close" onclick="restoreprop()" data-dismiss="modal">
								<span aria-hidden="true"> </span><span class="sr-only">Close</span>
							</button>
							<!-- Bhavesh(30-06-2023) added resize Button"  -->
					<div class="button-container custom-margin-left">
                    <button type="button" class="close-btn" onclick="toggleMaximize()">
                        <span aria-hidden="true"><i class="far fa-window-restore fa-2xs"></i></span>
                    </button>
							
						</div>
						</div>

						<div class="modal-body dash-modal-body">
							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">

								<h4 class="pad-bottom">
									<spring:message code="dashboard.closedprojects.label" />
									since :<!-- Bhavesh(30-06-2023) added new class-asOnDateProposals1  --> <span class="orange asOnDateProposals1" id="asOnDateClosedProjects1"></span>
								</h4>

							</div>
							<!-- <div
								class="col-md-12 col-lg-12 col-sm-12 col-xs-12 date-bar pad-bottom">

								<label class="" for="from">Last:</label> <select id="months" onchange="calculateDates(this.value,'from1','to1','go-btn1',0)" class="inline form-control" style="width:32%">
								<option value="0">Select Months/Year's</option>
								<option value="3">3 Months</option>
								<option value="6">6 Months</option>
								<option value="12">1 Years</option>
								<option value="24">2 Years</option>
								</select>
			

							</div> -->
							<!-- <div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 date-bar">

								<label class="" for="from">From</label> <input type="text"
									id="from1" name="from1" readonly /> <label class="pad-left"
									for="to">To</label> <input type="text" id="to1" name="to1"
									readonly />

								<button type="button" class="btn btn-success go-btn1 pad-left">Go</button>

							</div> -->
							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 zero">
							
							<div
								class="col-md-5 col-lg-5 col-sm-5 col-xs-5 date-bar pad-bottom ">

								<label class="font_16" for="from">Last:</label><!-- Bhavesh(30-06-2023) added new class-months1  --> 
								<select class="months1 inline form-control monthsClosedProjects" id="months" onchange="calculateDates(this.value,'from1','to1','go-btn1',0)" style="width:80%">
								<option value="0">Select Months/Year's</option>
								<option value="3">3 Months</option>
								<option value="6">6 Months</option>
								<option value="12">1 Years</option>
								<option value="24">2 Years</option>
								<%-- Bhavesh (17-10-23) extended the filter to 3 years and 5 years --%>
							    <option value="36">3 Years</option> 
							    <option value="60">5 Years</option>
								</select>
			
<!-- <div style="text-align:right;olor: #1578c2;"><a href="javascript:void()" onclick="openClosedAnotherFilter()" id="closedCustom"><i>Custom Duration</i></a></div> -->
							</div>
							<div id="closedAnotherFilter">
							<div
								class="col-md-1 col-lg-1 col-sm-1 col-xs-2 pad-bottom " style="padding-top:4px;">
								<h3 style="color: #1578c2;;"><strong>OR</strong></h3>
								</div>
							<div class="col-md-6 col-lg-6 col-sm-6 col-xs-6  date-bar  pad-bottom ">

								<label class="font_16" for="from">From</label> <input class="fromProposal1" type="text"
									id="from1" name="from" readonly /> <label class="font_16"
									for="to">To</label> <input class="toProposal1" type="text" id="to1"
									name="to" readonly /> &nbsp; &nbsp;
								<button type="button"  class="btn btn-success go-btn1 pad-left">Go</button>
							</div>
							</div>
							</div>
							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top">
								<%---------------- ADD some Columns in the closed project table [12-10-2023]---------------%>
								<table id="closedProjects_dataTable"
									class="table table-striped table-bordered">
									<thead class="datatable_thead bold ">
										<tr>
											<th width="2%"><spring:message code="serial.no" /></th>
											<th width="5%"><spring:message code="group.groupName" /></th>
											<th width="8%"><spring:message code="Project_Module_Master.projectName" /></th>
											<th width="5%"><spring:message code="client.name" /></th>
											<th width="5%"><spring:message code="project.details.leader" /></th>
											<th width="4%"><spring:message code="employee_Role.start_Date" /></th>
											<th width="4%"><spring:message code="employee_Role.end_Date" /></th>
											<th width="4%">
												<p>
													Actual
												</p>
												<p>
													<spring:message code="project.details.duration" />
												</p>
												<p>(In months)</p>
											</th>
											<th width="4%">
												<p>
													Total Value of The Project
												</p>
												<p>(INR)</p>
											</th>
											<th width="4%">
												<p>
													<spring:message code="centre.outlay" />
												</p>
												<p>(INR)</p>
											</th>
											<th width="4%">
												<p>
													Total Payment Received
												</p>
												<p>(INR)</p>
											</th>
										</tr>
									</thead>
									<thead class="filters ">
										<tr>
											<th width="2%"></th>
											<th  width="5%" class="comboBox"></th>
											<th width="8%"></th> 
											<th width="5%"></th>
											<th width="5%"></th>
											<th width="4%"></th>
											<th width="4%"></th>
											<th width="4%"></th>
											<th width="4%"></th>
											<th width="4%"></th>
											<th width="4%"></th>
										</tr>
									</thead>
									<tbody class="">
									</tbody>
									<tfoot>
										<tr>
											<td colspan="11">
						      					<div class="legend">
											        <div class="legend-item">
											          <div class="legend-color" style="background-color: black;"></div>
											          <span>Closed Projects</span>
											        </div>
											        <div class="legend-item">
											          <div class="legend-color" style="background-color:red;"></div>
											          <span>No Payment Received</span>
											        </div>
										        <!-- Add more legend items as needed -->
										      </div>
										    </td>
										</tr>
									</tfoot>
								</table>
								<%---------------- End of the closed project table [12-10-2023]---------------%>
							</div>
						</div>
					</div>
				</div>
			</div>

		
				 <div class="modal dash-closedProjectListByGroup-modal dash-modal" id="dash-closedProjectListByGroup-modal"
			tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
			aria-hidden="true" data-keyboard="false" data-backdrop="static">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<h3 class="modal-title center" id="">
						 	<spring:message code="dashboard.closedprojects.list" />
 					</h3>
						<button type="button" class="close" data-dismiss="modal">
							<span aria-hidden="true"> </span><span class="sr-only">Close</span>
						</button>
					</div>

					<div class="modal-body dash-modal-body">
					<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">

							 <h4 class="pad-bottom">
								 <spring:message code="dashboard.closedprojects.label" />
								since : <span class="orange" id="asOnDateClosedProj1"></span>
							</h4> 
							<h4 class="pad-bottom">
								 <spring:message code="group.groupName" /> 
								: <span class="orange" id="projClosedGroupName"></span>
							</h4> 
						</div> 
						
						<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 date-bar">

								<label class="" for="from">From</label> 
								<input type="text" id="fromGroup" name="from1" readonly/>
								<label class="pad-left" for="to">To</label>
								 <input type="text" id="toGroup" name="to1" readonly/>
								 <input type="hidden" id="grpId">
								 <button type="button" class="btn btn-success go-btn-group pad-left">Go</button>

							</div> 
				
						<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top">
									
										<table id="closedProjectsByGroup_dataTable" class="table table-striped table-bordered">
											<thead class="datatable_thead bold ">
												<tr>
													<th width="5%"><spring:message code="forms.serialNo"/></th>
													<%-- <th width="20%"><spring:message code="group.groupName" /></th> --%>
													<th width="35%"><spring:message code="master.name" /></th>
													<%-- <th width="20%"><spring:message code="project.projectRefNo" /></th>
													<th width="30%"><spring:message code="dashboard.client.name" /></th> --%>
													<th width="10%"><spring:message code="dashboard.project.startDate" /></th>
													<th width="10%"><spring:message code="dashboard.project.closureDate" /></th>							
													<th width="10%"><spring:message code="dashboard.lable.outlay" /></th>													
												</tr>
											</thead>
											
											<tbody class="">
											</tbody>
										</table>
									</div>
					</div>
				</div>
			</div>
		</div>
		<!-- End of modal for Closed Project -->
						<!-- Modal for Pending Closur -->
			<!-- Bhavesh(30-06-2023) added new class-dash-newProposalList-modal  -->			
			<div class="modal dash-closure-pending-modal dash-modal dash-newProposalList-modal"
				id="dash-closure-pending-modal" tabindex="-1" role="dialog"
				aria-labelledby="myModalLabel" aria-hidden="true"
				data-keyboard="false" data-backdrop="static">
				<!-- Bhavesh(30-06-2023) added new class-mymodal1 and style="width:99%; height:95%;"  -->
                   <div class="modal-dialog modal-lg mymodal1" style="width:99%; height:95%;">
                 <!-- Bhavesh(30-06-2023) added new class-modal-lg and style="height:100%;"  -->
					<div class="modal-content modal-lg " style="height:100%;"> 
						<div class="modal-header">
							<h3 class="modal-title center" id="">
								List Of Projects Pending for Technical Closure
							</h3>
							<!-- Bhavesh(30-06-2023) added onclick="restoreprop()"  -->
							<button type="button" class="close" onclick="restoreprop()" data-dismiss="modal">
								<span aria-hidden="true"> </span><span class="sr-only">Close</span>
							</button>
							<!-- Bhavesh(30-06-2023) added resize Button"  -->
					<div class="button-container custom-margin-left">
                    <button type="button" class="close-btn" onclick="toggleMaximize()">
                        <span aria-hidden="true"><i class="far fa-window-restore fa-2xs"></i></span>
                    </button>
							
						</div>
						</div>

						<div class="modal-body dash-modal-body">
							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">

								

							</div>

							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 date-bar ">

								<div
								class="col-md-12 col-lg-12 col-sm-12 col-xs-12 date-bar pad-bottom">
			
			            <!-- Display the correct filter data  -->
								<select id="filterClosureSymbol" onchange="calculateClosureDates()" class="inline form-control" style="width:32%">
								<option value=">=">Less than (<) </option>
								<option value="<=">Greater than (>)</option>
								
								</select>
			
			
								<label class="" for="from">Last:</label> <!-- Bhavesh(30-06-2023) added new class-months1  --> <select class="months1" id="monthsClosure" onchange="calculateClosureDates()" class="inline form-control" style="width:32%">
								<option value="0">Select Months/Year's</option>
								<option value="3">3 Months</option>
								<option value="6">6 Months</option>
								<option value="12">1 Years</option>
								<option value="24">2 Years</option>
								<%-- Bhavesh (17-10-23) extended the filter to 3 years and 5 years --%>
							    <option value="36">3 Years</option> 
							    <option value="60">5 Years</option>
								</select>
								
								
							</div> 

							</div>

							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top">

								<table id="pendingCLosure_dataTable"
									class="table table-striped table-bordered" style="width: 100%">
									<thead class="datatable_thead bold ">
										<tr>
											<th width="2%"><spring:message  code="forms.serialNo" /></th>
											<th width="14%"><spring:message code="group.groupName" /></th>
										<th width="24%"><spring:message code="master.name" /></th>
										<%-- 	<th width="15%"><spring:message
																		code="project.projectRefNo" /></th>
												<th width="15%"><spring:message
													code="dashboard.client.name" /></th> --%>
													
											<th width="14%"><spring:message code="client.name" /></th>
												<th width="7%"><spring:message
																		code="project.details.leader" /></th>
											<th width="8%"><spring:message code="projectMaster.startDate" /></th>
											<th width="9%"><spring:message code="projectMaster.endDate" /></th>
											<!-- Added by devesh on 21-09-23 to add Cdac outlay and status columns -->
											<th width="6%"><spring:message code="dashboard.lable.outlay" /></th>
											<th width="16%">Status</th>
											<!-- End of Columns -->

										</tr>
									</thead>
									<thead class="filters">
										<tr>
											<th width="2%"></th>
											<th width="14%" class="comboBox"><spring:message code="group.groupName" /></th>
											<th width="24%" class=""></th>
											<th width="14%" class="comboBox"><spring:message code="publicationdetail.Organization" /></th>
											<th width="7%"></th>
											<th width="8%"></th>
											<th width="9%"></th>
											<!-- Added by devesh on 21-09-23 to add Cdac outlay and status columns -->
											<th width="6%"></th>
											<th width="16%" id="statusComboBox"></th>
											<!-- End of Columns -->

										</tr>
									</thead>
									<tbody class="">
									</tbody>
									 <tfoot>
									<tr>
										<td colspan="9">
											<div class="legend">
												<div class="legend-item">
													<div class="legend-color"
														style="background-color: #cc9900;"></div>
													<span>Date elapsed and Closure Initiated</span>
												</div>
												<div class="legend-item">
													<div class="legend-color"
														style="background-color: #808080;"></div>
													<span>Date elapsed but Closure Not Initiated</span>
												</div>
												<!-- Add more legend items as needed -->
											</div>
										</td>
									</tr>
								</tfoot>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- End of modal for Pending Closure -->
			
			<!-- Modal for Under closure table -->
				<!-- Bhavesh(23-06-2023) added new class-dash-newProposalList-modal  -->
			<div class="modal dash-closure-pending-modal1 dash-modal dash-newProposalList-modal"
				id="dash-closure-pending-modal1" tabindex="-1" role="dialog"
				aria-labelledby="myModalLabel" aria-hidden="true"
				data-keyboard="false" data-backdrop="static">
				<!-- Bhavesh(23-06-2023) added new class-mymodal1 and style="width:99%; height:95%;"  -->
                <div class="modal-dialog modal-lg mymodal1" style="width:99%; height:95%;">
                 <!-- Bhavesh(23-06-2023) added new class-modal-lg and style="height:100%;"  -->
					<div class="modal-content modal-lg " style="height:100%;"> 
						<div class="modal-header">
							<h3 class="modal-title center" id="">
								<spring:message code="menu.project.underClosure" />
							</h3>
							<!-- Bhavesh(23-06-2023) added onclick="restoreprop()"  -->
							<button type="button" class="close" onclick="restoreprop()" data-dismiss="modal">
								<span aria-hidden="true"></span><span class="sr-only">Close</span>
							</button>
							<!-- Bhavesh(23-06-2023) added resize Button"  -->
					<div class="button-container custom-margin-left">
                    <button type="button" class="close-btn" onclick="toggleMaximize()">
                        <span aria-hidden="true"><i class="far fa-window-restore fa-2xs"></i></span>
                    </button>
							
						</div>
						</div>

						<div class="modal-body dash-modal-body">
							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">

								

							</div>

							<%-- <div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 date-bar ">

								<div
								class="col-md-12 col-lg-12 col-sm-12 col-xs-12 date-bar pad-bottom">
			  <!-- Display the correct filter data on 7-06-23 -->
								<select id="filterClosureSymbol" onchange="calculateClosureDates()" class="inline form-control" style="width:32%">
								<option value=">=">Less than (<) </option>
								<option value="<=">Greater than (>)</option>
								
								</select>
			
			                       <!-- Bhavesh(23-06-2023) added class in select class="months1"  -->
								<label class="" for="from">Last:</label> <select class="months1" id="monthsClosure" onchange="calculateClosureDates()" class="inline form-control" style="width:32%">
								<option value="0">Select Months/Year's</option>
								<option value="3">3 Months</option>
								<option value="6">6 Months</option>
								<option value="12">1 Years</option>
								<option value="24">2 Years</option>
								</select>
								
								
							</div> 

							</div> --%>

							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top">

								<%-- <table id="pendingCLosure_dataTable"
									class="table table-striped table-bordered" style="width: 100%">
									<thead class="datatable_thead bold ">
										<tr>
											<th width="5%"><spring:message  code="forms.serialNo" /></th>
										<th width="30%"><spring:message code="master.name" /></th>
											<th width="15%"><spring:message
																		code="project.projectRefNo" /></th>
												<th width="15%"><spring:message
													code="dashboard.client.name" /></th>
											<th width="15%"><spring:message code="publicationdetail.Organization" /></th>
												<th width="10%"><spring:message
																		code="project.details.leader" /></th>
											<th width="10%"><spring:message code="projectMaster.startDate" /></th>
											<th width="10%"><spring:message code="projectMaster.endDate" /></th>

										</tr>
									</thead>
									<thead class="filters">
										<tr>
											<th width="5%"></th>
											<th width="30%" class=""></th>
											<th width="15%" class="comboBox"><spring:message code="publicationdetail.Organization" /></th>
											<th width="10%"></th>
											<th width="10%"></th>
											<th width="10%"></th>

										</tr>
									</thead>
									<tbody class="">
									</tbody>
									 <!--Bhavesh 28-07-23 added tfoot to count total  -->
										<tfoot>
											<tr >
												<td colspan="7">
      <div class="legend">
        
        <div class="legend-item">
          <div class="legend-color" style="background-color: #cc9900;"></div>
          <span>Date elapsed and Closure Initiated</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background-color: #808080;"></div>
          <span>Date elapsed but Closure Not Initiated</span>
        </div>
        <!-- Add more legend items as needed -->
      </div>
    </td>
											</tr>
										</tfoot>
								</table> --%>
								
								
							<%-- <fieldset class="fieldset-border">

			<input type="hidden" value="${encWorkflowId}" id="encWorkflowId"/>		
			<table id="exampleUnderClosure" class="table table-striped table-bordered"
				style="width: 100%">
				<thead class="datatable_thead bold ">
				
					<tr>										
 					<th style="width:2%;"><spring:message code="serial.no"/></th>
 					<c:if test="${roleId==9}">
 					<th><spring:message code="group.groupName"/></th>	
 					</c:if>
 					<th><spring:message code="project.projectRefNo"/></th>	
 										
 						<th><spring:message code="Project_Payment_Schedule.projectName"/></th>
						<th style="width:8%;"><spring:message code="projectMaster.type"/></th>
						<th><spring:message code="projectMaster.startDate"/></th>
						<th><spring:message code="projectMaster.endDate"/></th>
	
						<th style="width:8%;"><spring:message code="projectMaster.duration"/> <br>(in months)</th>
						<th style="width:8%;"><spring:message code="projectMaster.Cost"/></th>
						<th><spring:message code="forms.status"/></th>
						<th style="width:3%;"><spring:message code="forms.action"/> </th> 
					</tr>
				</thead>
				
				<thead  class="filters">
										<tr>
										<c:if test="${roleId==9}">	
											<th></th>									
											<th class="comboBox"><spring:message code="group.groupName"/></th></c:if>
											<th></th>
											<th></th>
											<c:if test="${roleId==9}">		<th class="comboBox"><spring:message code="projectMaster.type"/></th></c:if>
											<th></th>
											<th></th>
											<th></th>
											<th></th>
											<th></th>
											<!-- <th></th> -->
											<!-- <th></th>	 -->																		
										</tr>
									</thead>
				
				
				<tbody>
					<c:forEach items="${underClosureProjectCountForGCFInc}" var="projectData" varStatus="loop">						
						<tr>
							<td class="brown-text text-center">${loop.count }</td>
					 <c:if test="${roleId==9}"> 
						<td class="brown-text">${projectData.strGroupName}</td>
					</c:if> 
								
							<td class="brown-text">${projectData.projectRefrenceNo}</td>	
 							<td class="font_16"><a title='Click to View Complete Information' onclick="viewProjectDetails('/PMS/projectDetails/${projectData.encProjectId}')"><span  class="brown-text">${projectData.strProjectName}</span></a></td>
							<td  class="brown-text">${projectData.businessType}</td>
							<td  class="brown-text">${projectData.startDate}</td>
							<td  class="brown-text">${projectData.endDate}</td>							
							<td  class="brown-text">${projectData.projectDuration}</td>
							<td  class="brown-text">${projectData.strTotalCost}</td>
							<td  class="brown-text">${projectData.workflowModel.strActionPerformed} by <b>${projectData.workflowModel.employeeName}</b> at ${projectData.workflowModel.transactionAt}</td>
							<td><div class="dropdown">																						
							 <a class="btn btn-warning dropdown-toggle" data-toggle="dropdown" onclick = "viewAllowedActions1('${projectData.encProjectId}')" aria-haspopup="true" aria-expanded="false">
								<i class="icon-th-large icon-1halfx blue pad-top" aria-hidden="true"></i></a>
							<ul class="dropdown-menu pull-right" aria-labelledby="dropdownMenuLink" id="${projectData.encProjectId}"></ul></div>
							</td>														
						</tr>
						
					</c:forEach>
				</tbody>
				 <!--Bhavesh 14-08-23 added tfoot to count total  -->
										<tfoot>
											<tr >
												<td colspan="9">
      <div class="legend">
        
        <div class="legend-item">
          <div class="legend-color" style="background-color: #993300;"></div>
          <span> Pending For Financial Closure</span>
        </div>
        
        <!-- Add more legend items as needed -->
      </div>
    </td>
											</tr>
										</tfoot>
			</table>
			
			<!--End of data table-->
		</fieldset> --%>
		 <fieldset class="fieldset-border">
						      <%---------------   Under Closure Request Tile Modal Table [21-09-2023] ------%>	
								<input type="hidden" value="${encWorkflowId_Closure}" id="encWorkflowId_Closure"/>	
								<input type="hidden"  id="customId" value="">	
								<input type="hidden"  id="encActionId" value="">
								
									<table id="exampleUnderClosure" class="table table-striped table-bordered table-responsive"
										style="width: 100%">
										<thead class="datatable_thead bold ">	
											<tr>										
						 						<th width="2%"><spring:message code="serial.no" /></th>
												<th width="4%"><spring:message code="group.groupName"/></th>
												<th width="10%"><spring:message code="Project_Module_Master.projectName" /></th>
												<%-- <th width="15%"><spring:message code="Client_Contact_Person_Master.name" /></th> --%>
												<th width="10%">Funding Organization</th><!-- Heading modified by devesh on 12-10-23 -->
												<th width="10%"><spring:message code="project.details.leader" /></th>
												<th width="10%"><spring:message code="projectMaster.startDate"/></th>
												<th width="10%"><spring:message code="projectMaster.endDate"/></th>
							                    <th width="10%"><spring:message code="forms.status"/></th>
												<th width="8%"><p>Technical</p> <p>Closure</p><p> Submission</p><p> Date</p></th>
												<th width="8%">Remarks</th>
												<!-- Added by devesh on 12-10-23 to add new columns -->
												<th width="5%">CDAC Outlay</th>
												<th width="5%">Payment Received</th>
												<th width="5%">Payment Pending</th>
												<!-- End of new columns -->
												<th width="3%"><spring:message code="forms.action"/> </th>
											</tr>
										</thead>
										<thead class="filters">
											<tr>
												<th width="2%"></th>
												<th width="4%" class="comboBox"></th>
												<th width="10%"></th>
												<th width="10%"></th>
												<th width="10%"></th>
												<th width="10%"></th>
												<th width="10%"></th>
							                    <th width="10%" id="comboBox_Status"></th>
												<th width="8%"></th>
												<th width="8%"></th>
												<!-- Added by devesh on 12-10-23 to add new columns -->
												<th width="5%"></th>
												<th width="5%"></th>
												<th width="5%"></th>
												<!-- End of new columns -->
												<th width="3%"></th>
											</tr>
										</thead>
										<tbody>
											<c:forEach items="${underClosureProjectCountForGCFInc}" var="projectData" varStatus="loop">	
												<c:set var="rowColor" value="${empty projectData.rowColor ? '#993300' : 'red'}" />					
												<tr style="color:${rowColor}">
													<td width="2%" class="text-center">${loop.count}</td>	
						 							<td width="4%">${projectData.strGroupName}</td>
						 							<td width="10%" class="font_16"><a title='Click to View Complete Information' onclick="viewProjectDetails('/PMS/projectDetails/${projectData.encProjectId}')"><span style="color:${rowColor}">${projectData.strProjectName}</span></a></td>
													<td width="10%" class="font_16" style="width:15%;" id="td2_${projectData.encProjectId}">${projectData.clientName}
														<%-- <a class="orange golden-text" title="Click here to view Funding org details" data-toggle='modal' data-target='#clientDetails' data-whatever='${projectData.encClientId};${projectData.encProjectId};${projectData.endUserId}'>
															${projectData.clientName}
														</a>  --%>
													</td>
													<td width="10%"><span class="font_16 ">${projectData.strPLName}</span></td>
													<td width="10%">${projectData.startDate}</td>
													<td width="10%">${projectData.endDate}</td>
													<td width="10%">${projectData.workflowModel.strActionPerformed} by <b>${projectData.workflowModel.employeeName}</b> at ${projectData.workflowModel.transactionAt}</td>							
													<td width="8%" class="text-center">${projectData.closureDate}</td>
													<td width="8%">${projectData.strProjectRemarks}</td>
													<!-- New columns added by devesh on 12-10-23 -->
													<td width="5%" align="left" class=""><span>${projectData.strTotalCost}
													</span></td>
													<td width="5%"><span>${projectData.numReceivedAmountInr}</span></td>
													<td width="5%">${projectData.numReceivedAmountTemp}</td>
													<!-- End of new columns -->
													<td width="3%"><div class="dropdown text-center">																						
													 <a class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" onclick="viewAllowedActionsForPending('${projectData.encProjectId}')" aria-haspopup="true" aria-expanded="false">
														<i class="icon-th-large icon-1halfx blue pad-top" aria-hidden="true"></i></a>
													<ul class="dropdown-menu pull-right" aria-labelledby="dropdownMenuLink" id="${projectData.encProjectId}"></ul></div>	

													</td>											
												</tr>
											</c:forEach>
										</tbody>
										<tfoot>
											<tr>
												<td colspan="14">
													<div class="legend">
														<div class="legend-item">
															<div class="legend-color"
																style="background-color: #993300;"></div>
															<span> Closure Initiated</span>
														</div>
														<div class="legend-item">
															<div class="legend-color"
																style="background-color: red;"></div>
															<span> No Payment Received</span>
														</div>
													</div>
												</td>
											</tr>
										</tfoot>
									</table>
								</fieldset>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- End of modal for Closure request -->
	<%---------------   END of Under Closure Request Tile Modal [21-09-2023] ------%>	
			
			
		<%---------------   Add Modal For View Proceeding Action in Closure Request Tile [21-09-2023] ------%>	
		<div class="modal amount_receive_deatil_modal" id="proceedingModal"
		tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
		aria-hidden="true" data-keyboard="false" data-backdrop="static">
		<div class="modal-dialog modal-lg" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h4 class="modal-title  center" id="exampleModalLabel">Proceeding Details</h4>
					<button type="button" class="close" data-dismiss="modal"
						aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<table id="proceedingTbl" class="table table-striped table-bordered example_det "
						style="width: 100%">
					<thead class="datatable_thead bold">
						<tr>
						   <th><spring:message code="forms.serialNo" /></th> 
						   <th><spring:message code="employee_Role.employee_Name"/></th> 
						   <th><spring:message code="forms.action"/></th>
						   <th>Remarks</th>
						   <th>Date</th><!-- Added by devesh on 18/7/23 for displaying transaction date -->		
						</tr>
					</thead>
					<tbody class="">
					</tbody>
				</table>
				</div>
				<div class="modal-footer" id="modelFooter">
				</div>
			</div>
		</div>
	</div>
	<%---------------   END of View Proceeding Action in Closure Request Tile------%>	
	<%---------------   Add Modal For View Project Closure Details Action in Closure Request Tile [21-09-2023] ------%>	
	<div class="modal amount_receive_deatil_modal" id="viewProjectClosure"
		tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
		aria-hidden="true" data-keyboard="false" data-backdrop="static">
		<div class="modal-dialog modal-lg" role="document" style="height: 95%;">
			<div class="modal-content" style="height: 95%;">
				<div class="modal-header">
					<h4 class="modal-title center">View Closure Details</h4>
					<button type="button" class="close" data-dismiss="modal"
						aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body dash-modal-body ">
					<div class="container pad-bottom">
						<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top">
							<div class="panel panel-info  ">				
								<div class="panel-body">						
									<p><span class="bold  font_14 ">Project Reference Number: </span> <span class="bold blue font_14"><i id="projectReferenceNumber"></i></span></p>
									<p><span class="bold  font_16 ">Project: </span> <span class="bold blue font_16"><i id="projectStrProjectName"></i></span></p>
									<p><span class="bold  font_16 ">Start Date: </span> <span class="bold blue font_16" id="projectStartDate"></span></p>
									<p><span class="bold  font_16 ">End date: </span> <span class="bold blue font_16" id="projectEndDate"></span></p>								
								</div>
							</div>
						</div>
					</div>
					<div class="container">
						<div class="col-md-6 col-lg-6 col-sm-6 col-xs-12 form-group">
							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 text-justify">
								<label class="font-weight-bold label-class"><spring:message code="project.closure.date"/>:</label> 
								<span id="closureDate"></span>
							</div>
						</div>
						<div class="col-md-6 col-lg-6 col-sm-6 col-xs-12 form-group">
							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 text-justify">
								<label class="font-weight-bold label-class"><spring:message code="project.closure.remarks"/>:</label>
								<span id="closureRemark"></span> 
							</div>					
						</div> 				
					</div>
					<div class="container">
						<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group">				
							<table id="example" class="table table-striped table-bordered" style="width: 100%">
								<thead class="datatable_thead bold">
									<tr>
										<th style="width:5%;"><spring:message code="serial.no"/></th>
 					    				<th style="width:12%;"><spring:message code="document.documentName"/></th>
										<th style="width:10%;"><spring:message code="task.download" /></th>
									</tr>
								</thead>
								<tbody class="" id="documentDetailsTable">
								</tbody>
							</table>
						</div>
					</div>
					<div class="container pad-top mb-4">
						<fieldset>
				    		<legend><spring:message code="project.closure.deallocate.team"/>:</legend>
				    		<div class="pad-top pad-bottom"><b class="red">Note : </b> if Effective Upto Date is not chosen explicitly, closure date will be considered. </div>
				    			<table class="table">
									<thead>
										<tr>
											<th width="30%"><spring:message code="Designation_Master.designationName"/></th>
											<th width="25%"><spring:message code="project_Team_Details.role_Name"/></th>								
											<th width="15%"><spring:message code="project_Team_Details.effective_From"/></th>
											<th width="15%"><spring:message code="project_Team_Details.effective_Upto"/> </th>
										</tr>
									</thead>
									<tbody id="teamDetailsTable">
									</tbody>
								</table>
				    	</fieldset>
    				</div>
				</div>
			</div>
		</div>
	</div>
	<%---------------EOL of View Project Closure Details Action in Closure Request Tile ------%>	
	
	<%-------------- View Financial Approval Form in Closure Request Tile [21-09-2023]-------%>
	<div class="modal amount_receive_deatil_modal" id="financialApprovalModel"
		tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
		aria-hidden="true" data-keyboard="false" data-backdrop="static">
		<div class="modal-dialog modal-lg" role="document">
			<div class="modal-content">
				 <div class="modal-header">
					 <h4 class="modal-title  center" id="exampleModalLabel">Approve Financial Closure</h4> 
					<button type="button" class="close" data-dismiss="modal"
						aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<!-- <div class="col-md-6 col-lg-6 col-sm-6 col-xs-6  date-bar  pad-bottom "> -->

								<div class="pad-bottom"><label class="font_14 bold" for="from">Financial Closure Date:</label> <span class="red">*</span>   <input type="text"
									id="finClosureDate" name="from" readonly /> </div>
									<br>
									<!-- <label class="font_16" for="from">Remarks"</label> --> <textarea style="height: 121px;" id="remarksForClosure" class="form-control " placeholder="You can write Remarks" 
									></textarea>
									<div class='text-center pad-top pad-bottom'><input type="button" value="Submit" id="closureSubmit" onclick="submitClosureReq()"></div>
							<!-- </div> -->
				
				</div>
				<div class="modal-footer" id="modelFooter">
					
				</div>
			</div>
		</div>
	</div>
	<%-------------- EOL View Financial Approval Form in Closure Request Tile-------%>
			
		<!--Modal For Pending Payments  -->
	    <!-- Bhavesh(30-06-2023) added new class-dash-newProposalList-modal  -->
		<div class="modal dash-pending-payments-modal dash-modal dash-newProposalList-modal"
				id="dash-pending-payments-modal" tabindex="-1" role="dialog"
				aria-labelledby="myModalLabel" aria-hidden="true"
				data-keyboard="false" data-backdrop="static">
				<!-- Bhavesh(30-06-2023) added new class-mymodal1 and style="width:99%; height:95%;"  -->
                <div class="modal-dialog modal-lg mymodal1" style="width:99%; height:95%;">
                    <!-- Bhavesh(30-06-2023) added new class-modal-lg and style="height:100%;"  -->
					<div class="modal-content modal-lg " style="height:100%;"> 
						<div class="modal-header">
							<h3 class="modal-title center" id="">
								<spring:message code="dashboard.pendingpayments.label" />
							</h3>
							<!-- Bhavesh(30-06-2023) added onclick="restoreprop()"  -->
							<button type="button" class="close" onclick="restoreprop()" data-dismiss="modal">
								<span aria-hidden="true"> </span><span class="sr-only">Close</span>
							</button>
							<!-- Bhavesh(30-06-2023) added resize Button"  -->
					<div class="button-container custom-margin-left">
                    <button type="button" class="close-btn" onclick="toggleMaximize()">
                        <span aria-hidden="true"><i class="far fa-window-restore fa-2xs"></i></span>
                    </button>
							
						</div>
						</div>

						<div class="modal-body dash-modal-body">
							 <div
								class="col-md-12 col-lg-12 col-sm-12 col-xs-12 date-bar pad-bottom">
			
								<select id="filterSymbol" onchange="calculateInvoiceDates()" class="inline form-control" style="width:32%">
								<option value="<=">Less than (<) </option>
								<option value=">=">Greater than (>)</option>
								
								</select>
			
			
								<label class="" for="from">Last:</label><!-- Bhavesh(30-06-2023) added new class-months1  --> <select class="months1" id="monthsInvoice" onchange="calculateInvoiceDates()" class="inline form-control" style="width:32%">
								<option value="0">Select Months/Year's</option>
								<option value="3">3 Months</option>
								<option value="6">6 Months</option>
								<option value="12">1 Years</option>
								<option value="24">2 Years</option>
								</select>
								
								
							</div> 
							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top">

								<table id="pendingPayments_dataTable"
									class="table table-striped table-bordered" style="width: 100%">
									<thead class="datatable_thead bold ">
										<tr>


											<th width="5%"><spring:message code="forms.serialNo" /></th>

											<th width="15%"><spring:message code="group.groupName" /></th>
											 <th scope="col" width="20%">Project Name</th>
										<%-- 	<th scope="col" width="20%"><spring:message
													code="project.projectRefNo" /></th> --%>
											<th width="15%"><spring:message
													code="client.name" /></th> 
													
											<th width="10%" scope="col"><spring:message
													code="Project_Invoice_Master.invoiceReferenceNumber" /></th>

											<th width="10%" scope="col"><spring:message
													code="Project_Invoice_Master.invoiceDate" /></th>
											<th width="10%" scope="col"><spring:message
													code="Project_Invoice_Master.invoiceStatus" /></th>
											<th width="10%" scope="col"><spring:message
													code="Project_Invoice_Master.invoiceAmount" /></th>
											<th width="10%" scope="col"><spring:message
													code="Project_Invoice_Master.invoiceTaxAmount" /></th>
											<th width="10%" scope="col"><spring:message
													code="Project_Invoice_Master.invoiceTotalAmount" /></th>
										</tr>
									</thead>
									
									<thead class="filters ">
										<tr>


											<th width="5%"></th>

											 <th width="20%" class="comboBox"><spring:message
													code="group.groupName" /></th>
								         <th class=""></th>
											<th width="15%" class="comboBox"><spring:message
													code="publicationdetail.Organization" /></th> 
													
											<th width="10%" scope="col"></th>

											<th width="10%" scope="col"></th>
											<th width="10%" scope="col"></th>
											<th width="10%" scope="col"></th>
											<th width="10%" scope="col"></th>
											<th width="10%" scope="col"></th>
										</tr>
									</thead>
									<tbody class="">


									</tbody>
								</table>

							</div>

						</div>
					</div>
				</div>
			</div>


			<!--Modal For Pending Invoices  -->
	    <!-- Bhavesh(30-06-2023) added new class-dash-newProposalList-modal  -->
		<div class="modal dash-pending-invoices-modal dash-modal dash-newProposalList-modal"
				id="dash-pending-invoices-modal" tabindex="-1" role="dialog"
				aria-labelledby="myModalLabel" aria-hidden="true"
				data-keyboard="false" data-backdrop="static">
				<!-- Bhavesh(30-06-2023) added new class-mymodal1 and style="width:99%; height:95%;"  -->
                <div class="modal-dialog modal-lg mymodal1" style="width:99%; height:95%;">
                 <!-- Bhavesh(30-06-2023) added new class-modal-lg and style="height:100%;"  -->
					<div class="modal-content modal-lg " style="height:100%;">
						<div class="modal-header">
							<h3 class="modal-title center" id="">
								<spring:message code="dashboard.pendinginvoices.label" />
							</h3>
							<!-- Bhavesh(30-06-2023) added onclick="restoreprop()"  -->
							<button type="button" class="close" onclick="restoreprop()" data-dismiss="modal">
								<span aria-hidden="true"> </span><span class="sr-only">Close</span>
							</button>
							<!-- Bhavesh(30-06-2023) added resize Button"  -->
					<div class="button-container custom-margin-left">
                    <button type="button" class="close-btn" onclick="toggleMaximize()">
                        <span aria-hidden="true"><i class="far fa-window-restore fa-2xs"></i></span>
                    </button>
							
						</div>
						</div>

						<div class="modal-body dash-modal-body">
							<div
								class="col-md-12 col-lg-12 col-sm-12 col-xs-12 date-bar pad-bottom">
			
								<select id="filterDueSymbol" onchange="calculateDueDates()" class="inline form-control" style="width:32%">
								<option value="<=">Less than (<) </option>
								<option value=">=">Greater than (>)</option>
								
								</select>
			
			
								<label class="" for="from">Last:</label><!-- Bhavesh(30-06-2023) added new class-months1  --> <select class="months1" id="monthsDue" onchange="calculateDueDates()" class="inline form-control" style="width:32%">
								<option value="0">Select Months/Year's</option>
								<option value="3">3 Months</option>
								<option value="6">6 Months</option>
								<option value="12">1 Years</option>
								<option value="24">2 Years</option>
								</select>
								
								
							</div> 
							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top">

								<table id="pendingInvoices_dataTable"
									class="table table-striped table-bordered" width="100%">
									<thead class="datatable_thead bold ">
										<tr>
											<th width="5%"><spring:message code="forms.serialNo" /></th>
											<th width="15%"><spring:message code="group.groupName" /></th>
											<th width="40%"><spring:message code="master.name" /></th>
										<%-- 	<th width="15%"><spring:message
													code="project.projectRefNo" /></th> --%>
											<th width="10%"><spring:message
													code="client.name" /></th> 
											<th width="10%"><spring:message code="Schedule_DueDate" />
											</th>
											<th width="15%"><spring:message
													code="Project_Payment_Schedule.purpose" /></th>
											<th width="15%"><spring:message
													code="Project_Payment_Schedule.remarks" /></th>
											<th width="10%"><spring:message
													code="Project_Payment_Schedule.amount" /></th>
										</tr>
									</thead>
									
									<thead class="filters ">
								<tr>
									<th width="5%"></th>
									<th class="comboBox"><spring:message code="group.groupName" /></th>
											<th width="40%" class=""></th>
										
											<th width="10%" class="comboBox">><spring:message
													code="publicationdetail.Organization" /></th> 
											<th width="10%">
											</th>
											<th width="15%"></th>
											<th width="15%"></th>
											<th width="10%"></th>
								</tr>
							</thead>
									<tbody class=""></tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>

		
		<!--End of Modal for Pending Invoice  -->	



			<!-- Modal for Employees -->
			<!-- Bhavesh(30-06-2023) added new class-dash-newProposalList-modal  -->
			<div class="modal dash-employee-modal dash-newProposalList-modal" id="dash-employee-modal" tabindex="-1"
				role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"
				data-keyboard="false" data-backdrop="static">
				<!-- Bhavesh(30-06-2023) added new class-mymodal1 and style="width:99%; height:95%;"  -->
                <div class="modal-dialog modal-lg mymodal1" style="width:99%; height:95%;">
                 <!-- Bhavesh(30-06-2023) added new class-modal-lg and style="height:100%;"  -->
					<div class="modal-content modal-lg " style="height:100%;"> 
						<div class="modal-header">
							<h3 class="modal-title center" id=""> <spring:message code="dashboard.employee.label"/> in <sec:authentication
							property="principal.assignedOrganisationName" /></h3>
							<!-- Bhavesh(30-06-2023) added onclick="restoreprop()"  -->
							<button type="button" class="close" onclick="restoreprop()" data-dismiss="modal">
								<span aria-hidden="true"> </span><span class="sr-only">Close</span>
							</button>

							<!-- Bhavesh(30-06-2023) added resize Button"  -->
					<div class="button-container custom-margin-left">
                    <button type="button" class="close-btn" onclick="toggleMaximize()">
                        <span aria-hidden="true"><i class="far fa-window-restore fa-2xs"></i></span>
                    </button>
							

							

						</div>
						</div>
						
						
						
						<div class="modal-body ">
								  <div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">
						
						<h4 class="pad-bottom"><spring:message code="dashboard.total.label" />:<span class="orange">${employeeCount}</span></h4>
						
				
							</div>
							<!-- Commented by devesh on 27/6/23 to add collapsed panel -->
							<%-- <div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">
							<div class="panel panel-info  ">
					<div class="panel-heading font_16"><spring:message code="dashboard.employment.type.label" /> </div>
					<div class="panel-body">
							<div id="chart-container-emp">
							
							</div>
							</div>
							</div>
							</div> --%>
					<div class="panel-group" id="accordionGroupClosed" role="tablist" aria-multiselectable="true">
					<!-- added by devesh on 27/6/23 for employee type graph -->
					<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">
								<div class="panel panel-info  " >
									<div class="panel-heading font_16" role="tab" id="headingTwo">
									
										<a class="collapsed" style="color:white;" data-toggle="collapse" href="#multiCollapse2"  aria-expanded="false" aria-controls="multiCollapse2"
											onclick="setTimeout(function() {drawEmploymentTypeWiseChart();}, 100)">
										<spring:message code="dashboard.employment.type.label" />  </a>	
												
									</div>
									<div  class="panel-collapse collapse" id="multiCollapse2" role="tabpanel" aria-labelledby="headingTwo">
										<div class="panel-body">
										<div id="chart-container-emp"></div>
										</div>
									</div>
								</div>
								</div>
					<!-- End of employee type graph-->
					<!-- added by devesh on 9/6/23 for deputed graph -->
					<!-- Commented by devesh on 27/6/23 to add collapsed panel -->
						<%-- <div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">
							<div class="panel panel-info  " >
							<div class="panel-heading font_16">
							<spring:message code="dashboard.gc.deputed.distribution.label" />  </a>			
						</div>
						<div class="panel-body">
							<div id="chart-container-emp2"></div>
					    </div>
						</div>
						</div> --%><div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">
								<div class="panel panel-info  " >
									<div class="panel-heading font_16" role="tab" id="headingTwo">
									
										<a class="collapsed" style="color:white;" data-toggle="collapse" href="#multiCollapse3"  aria-expanded="false" aria-controls="multiCollapse3"
											onclick="setTimeout(function() {drawdeputedChart();}, 100)">
										<spring:message code="dashboard.gc.deputed.distribution.label" />  </a>	
												
									</div>
									<div  class="panel-collapse collapse" id="multiCollapse3" role="tabpanel" aria-labelledby="headingTwo">
										<div class="panel-body">
										<div id="chart-container-emp2"></div>
										</div>
									</div>
								</div>
								</div>
					<!-- End of deputed graph -->
					<!-- Commented by devesh on 27/6/23 to add collapsed panel -->
							<%-- <div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">
							<div class="panel panel-info  ">
					<div class="panel-heading font_16"><spring:message code="dashboard.group.distribution.label" /> </div>
					<div class="panel-body">
					<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">
							<div id="chart-container-emp1">
							</div>
							</div>
							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top-double pad-bottom-double">
							<div id="group_emptype_div" class="">
								<table id="group_emptype_tbl" class="table table-responsive table-bordered">
									
								</table>
							</div>
							</div>
							</div>
							</div>
						</div> --%>
					<!-- Added by devesh on 27/6/23 to add collapse panel in Group Wise Distribution Table -->
					<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">
								<div class="panel panel-info  " >
									<div class="panel-heading font_16" role="tab" id="headingTwo">
									
										<a class="collapsed" style="color:white;" data-toggle="collapse" href="#multiCollapse1"  aria-expanded="false" aria-controls="multiCollapse1"
											>
										<spring:message code="dashboard.group.distribution.label" />  </a>	
												
									</div>
									<div  class="panel-collapse collapse" id="multiCollapse1" role="tabpanel" aria-labelledby="headingTwo">
										<div class="panel-body">
										<div id="chart-container-emp1"></div>
										<div
											class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top-double pad-bottom-double">
											<div id="group_emptype_div" class="">
												<table id="group_emptype_tbl"
													class="table table-responsive table-bordered">

												</table>
											</div>
										</div>
										</div>
									</div>
								</div>
					</div>
					<!-- End of Group Wise Distribution Table-->
					</div>
						
						<%-- <div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top-double pad-bottom-double">
						<div class="panel panel-info  ">
					<div class="panel-heading font_16"><spring:message code="dashboard.designation.distribution.label" /> </div>
					<div class="panel-body">
						<div
							class="table-responsive">

			<table id="testTbl" class="table table-bordered table-striped mb-0"> 
			
		
		<c:forEach var="employeeCountByGroupDesignation" items="${employeeCountByGroupandDesignation}" varStatus="loop">	
			
			<c:choose>
			<c:when test="${loop.index==0}">

														<tr class="my-custom-scrollbar-thead datatable_thead">
															<th class="bold font_12">
																${employeeCountByGroupDesignation.key}</th>
															<c:forEach var="counter"
																items="${employeeCountByGroupDesignation.value}">
																<th  class="font_12" id="${counter}">${counter}</th>
															</c:forEach>

														</tr>

													</c:when>
				<c:otherwise>
														<tr>
															<td class="bold font_14">
																${employeeCountByGroupDesignation.key}</td>
															<c:forEach var="counter"
																items="${employeeCountByGroupDesignation.value}"
																varStatus="status">

																<c:choose>
																	<c:when test="${not status.last}">
																		<td class="text-right emp"><a title='Click here to view Employee details' >${counter}</a> </td>
																	</c:when>
																	<c:otherwise>
																		<td class="text-right bold">${counter}</td>
																	</c:otherwise>
																</c:choose>
															</c:forEach>

														</tr>
				</c:otherwise>
			</c:choose>	
			
		
		</c:forEach>
			
		
		
		</table>
</div>
</div>
						</div>
						</div> --%>
						
					<!--Added by devesh on 21/6/23 for technical group -->
            		<div class="row">
                          <div
							class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top-double pad-bottom-double">
							<div class="panel panel-info  ">
								<div class="panel-heading font_16">
									<spring:message code="dashboard.designation.distribution.tech.label" />
								</div>
								<div class="panel-body">
	<div class="table-responsive">
		<table id="testTb2" class="table table-striped table-bordered mb-0" style="width: 100%">
			<c:forEach var="employeeCountByGroupDesignationTech" items="${employeeCountByGroupandDesignationTechnical}" varStatus="loop">

				<c:choose>
					<c:when test="${loop.index==0}">
                         <thead>
							<tr class="my-custom-scrollbar-thead datatable_thead">
								<!-- <th class="bold font_14" style="border: 1px solid #ddd;"> -->
								<th class="bold " style="border: 1px solid #ddd;font-size:11px;padding: 4px;"><!-- fontsize decreased on 27/6/23 -->
								${employeeCountByGroupDesignationTech.key}</th>
								<c:forEach var="counter"
								items="${employeeCountByGroupDesignationTech.value}">
								<!-- font size added on 27/6/23 -->
								<th id="${counter}" style="border: 1px solid #ddd;font-size:11px;padding: 4px;">${counter}</th>
								</c:forEach>

							</tr>
                         </thead>
					</c:when>
					
					<c:otherwise>
                       <c:if test="${loop.index==1}">
                          <tbody>
                            </c:if>
                             
                              <%-- <c:if test="${not loop.last}"> --%>
								<tr>
									<!-- <td class="bold font_14"> -->
									<td class="bold " style="font-size:11px;padding: 4px;"><!-- fontsize decreased on 27/6/23 -->
									${employeeCountByGroupDesignationTech.key}</td>
									<c:forEach var="counter"
								    items="${employeeCountByGroupDesignationTech.value}"
									varStatus="status">
                                   <c:if test="${employeeCountByGroupDesignationTech.key != 'Total'}">
									<c:choose>
										  <c:when test="${not status.last}">
											<td class="text-right emp"><a title='Click here to view Employee details' >${counter}</a> </td>
										 </c:when>
										 
										 <c:otherwise>
											<td class="text-right bold">${counter}</td>
										</c:otherwise>
									</c:choose>
								  </c:if>
								  <c:if test="${employeeCountByGroupDesignationTech.key == 'Total'}">
								  <td class="text-right bold">${counter}</td>
								   </c:if>
								  	
									</c:forEach>

								</tr>
							 
							 <c:if test="${loop.last}">
							    </tbody>
                               </c:if>
							 	
                           
					 </c:otherwise>
				   </c:choose>


		     </c:forEach>



		</table>
	</div>
   </div>
  </div>
 </div>
</div>
    
    <!-- technical group end -->
    
    
   <!-- Added by devesh on 21/6/23 for support group -->
            
			<div class="row">
                <div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top-double pad-bottom-double">
					<div class="panel panel-info  ">
						<div class="panel-heading font_16">
							<spring:message code="dashboard.designation.distribution.support.label" />
						</div>
						<div class="panel-body">
                           <div class="table-responsive">
							<table id="testTbl" class="table table-striped table-bordered" style="width: 100%">
									
								<c:forEach var="employeeCountByGroupDesignation" items="${employeeCountByGroupandDesignationSupport}"
												varStatus="loop">

												<c:choose>
													<c:when test="${loop.index==0}">
                                                      <thead>
														<tr class="my-custom-scrollbar-thead datatable_thead">
															<!-- <th class="bold font_14" style="border: 1px solid #ddd;"> -->
															<th class="bold " style="border: 1px solid #ddd;font-size:11px;padding: 4px;"><!-- fontsize decreased on 27/6/23 -->
																${employeeCountByGroupDesignation.key}</th>
															<c:forEach var="counter"
																items="${employeeCountByGroupDesignation.value}">
																<!-- font size added on 27/6/23 -->
																<th id="${counter}" style="border: 1px solid #ddd;font-size:11px;padding: 4px;">${counter}</th>
															</c:forEach>

														</tr>
                                                      </thead>
													</c:when>
												 <c:otherwise>
                                                 <c:if test="${loop.index==1}">
                                                  <tbody>
                                                 </c:if>
													<tr>
													  <!-- <td class="bold font_14"> -->
													  <td class="bold " style="font-size:11px;padding: 4px;"><!-- fontsize decreased on 27/6/23 -->
														${employeeCountByGroupDesignation.key}</td>
														
														  <c:forEach var="counter"
																items="${employeeCountByGroupDesignation.value}"
																varStatus="status">
                                                             <c:if test="${employeeCountByGroupDesignation.key!='Total'}">
																<c:choose>
																	<c:when test="${not status.last}">
																		<td class="text-right emp"><a title='Click here to view Employee details' >${counter}</a> </td>
																	</c:when>
																	<c:otherwise>
																		<td class="text-right bold">${counter}</td>
																	</c:otherwise>
																</c:choose>
															  </c:if>	
														  <c:if test="${employeeCountByGroupDesignation.key == 'Total'}">
														   <td class="text-right bold">${counter}</td>
														  </c:if>	  
															</c:forEach>
														
														
														</tr>
                                              <c:if test="${loop.last}">
                                                 </tbody>
                                              </c:if>
													</c:otherwise>
												</c:choose>


											</c:forEach>



										</table>
									</div>
								</div>
							</div>
						</div>
			</div>
		
	<!-- support group end -->					
					
					<!-- employee Details With Involvements -->
							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top">
								<table id="employeeWithInvolvementsTbl" class="table table-striped" width="100%">
									<thead>
										<tr class="datatable_thead">
											<th width="5%"><spring:message code="forms.serialNo"/></th>
											<th width="15%"><spring:message code="dashboard.group.label"/></th>
											<th width="10%"><spring:message code="employee.EmployeeId"/></th>
											<th width="20%"><spring:message code="employee_Role.employee_Name"/></th>
											<th width="13%"><spring:message code="employee.designation"/></th>
											<th width="12%"><spring:message code="employee.Employment.type"/></th>
											<th width="12%"><spring:message code="employee.deputedat"/></th> <!--Deputed at Column added by devesh on 09/06/23  -->
											<%-- <th width="20%"><spring:message code="Project_Module_Master.projectName"/></th> --%>
										</tr>
									</thead>
									<thead  class="filters">
										<tr>										
											<th></th>
											<th class="comboBox"></th>
											<th></th>
											<th></th>
											<th class="comboBox"></th>
											<th class="comboBox"></th>
											<th class="comboBox"></th><!-- added by devesh on 14/6/23 for deputed filter -->
											<!-- <th></th>	 -->																		
										</tr>
									</thead>
									<tbody>
										<c:forEach items="${employeeWithInvolvement}" var="employee" varStatus="theCount">
											<tr>
												<td>${theCount.count}</td>
												<td>${employee.groupName}</td>
												<td>${employee.employeeId}</td>
												<td>${employee.employeeName}</td>
												<td>${employee.strDesignation}</td>
												<td>${employee.employeeTypeName}</td>
												<!--added by devesh on 9/6/23 for deputed at value -->
												<td><c:choose>
													<c:when test="${employee.numDeputedAt==1}">CDAC</c:when>
													<c:when test="${employee.numDeputedAt==2}">Client</c:when>
													<c:otherwise>NULL</c:otherwise>
													</c:choose>
												</td>
												<!-- End -->
												<%-- <td>${employee.teamDetails}</td> --%>
											</tr>
										</c:forEach>
									</tbody>
								</table>
							
							</div>
					</div>
					
				</div>
			</div>
</div>
			<!-- End of modal for employees -->
			
			
			
			
			<div class="modal in pad-7-Percentage" id="dash-employee-group-modal"
				tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
				aria-hidden="true" data-keyboard="false" data-backdrop="static">
				<div class="modal-dialog modal-lg">
					<div class="modal-content">
						<div class="modal-header">
							<h3 class="modal-title center" id="">
								<spring:message code="dashboard.employee.label" />
							</h3>
							<button type="button" class="close" data-dismiss="modal">
								<span aria-hidden="true"> </span><span class="sr-only">Close</span>
							</button>
						</div>

						<div class="modal-body ">
					<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">

								
								
								<h4 class="pad-bottom">
								 <spring:message code="group.groupName" /> 
								: <span class="orange" id="empGroupName"></span>
							</h4> 

							</div>
							<%-- <div
								class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top-double pad-bottom-double">
								<div class="panel panel-info  ">
									<div class="panel-heading font_16">
										<spring:message
											code="dashboard.designation.distribution.label" />
									</div>
									<div class="panel-body">
										<div class="table-responsive">

											<table id="testTbl"
												class="table table-bordered table-striped mb-0">


											</table>
										</div>
									</div>
								</div>
							</div> --%>
							<!-- employee Details With Involvements -->
							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top">
								<table id="employeeWithInvolvementsTblNew" class="table table-striped">
									<thead>
										<tr class="datatable_thead bold ">
											<th width="5%"><spring:message code="forms.serialNo"/></th>
											<%-- <th width="15%"><spring:message code="dashboard.group.label"/></th> --%>
											<th width="10%"><spring:message code="employee.EmployeeId"/></th>
											<th width="20%"><spring:message code="employee_Role.employee_Name"/></th>
											<th width="13%"><spring:message code="employee.designation"/></th>
											<th width="12%"><spring:message code="employee.Employment.type"/></th>
											<%-- <th width="40%"><spring:message code="Project_Module_Master.projectName"/></th> --%>
										</tr>
									</thead>
									
									<tbody>
									<%-- 	<c:forEach items="${employeeWithInvolvement}" var="employee" varStatus="theCount">
											<tr>
												<td>${theCount.count}</td>
												<td>${employee.employeeId}</td>
												<td>${employee.employeeName}</td>
												<td>${employee.strDesignation}</td>
												<td>${employee.employeeTypeName}</td>
												
											</tr>
										</c:forEach> --%>
									</tbody>
								</table>
							
							</div>
							
						</div>
					
					</div>
				</div>
			</div>
			<!-- Modal For Emp Details --><!-- Updated by devesh on 21/6/23 as it was not working -->
	<div class="modal amount_receive_deatil_modal " id="empDetailModal"
		tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
		aria-hidden="true" data-keyboard="false" data-backdrop="static">
		<div class="modal-dialog modal-lg " role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h4 class="modal-title  center" id="exampleModalLabel">Employee Detail</h4>
					<button type="button" class="close" data-dismiss="modal"
						aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body emp_detail_modal">
				<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">
             <table id="datatable1" class="table table-striped table-bordered example_det"
						style="width: 100%">
					<thead class="datatable_thead bold">
						<tr>
						   <th>S.No</th>
						   <th>Employee Id</th>  
							<th>Employee Name</th>
							
						</tr>
					</thead>
					<tbody class="center">
					
				</tbody>
			</table>
			</div>
				</div>
				
			</div>
		</div>
	</div>
		<!-- End of Modal For Emp Details -->
						
			
						<!-- Modal for Income -->
			<!-- Bhavesh(30-06-2023) added new class-dash-newProposalList-modal  -->			
			<div class="modal dash-income-modal dash-newProposalList-modal" id="dash-income-modal" tabindex="-1"
				role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"
				data-keyboard="false" data-backdrop="static">
				<!-- Bhavesh(30-06-2023) added new class-mymodal1 and style="width:99%; height:95%;"  -->
                 <div class="modal-dialog modal-lg mymodal1" style="width:99%; height:95%;">
                  <!-- Bhavesh(30-06-2023) added new class-modal-lg and style="height:100%;"  -->
					<div class="modal-content modal-lg " style="height:100%;"> 
						<div class="modal-header">
							<h3 class="modal-title center" id=""> 
							<spring:message code="dashboard.income.label" /> in
							 <sec:authentication
							property="principal.assignedOrganisationName" /></h3>
							<!-- Bhavesh(30-06-2023) added onclick="restoreprop1()"  -->
							<button type="button" class="close" onclick="restoreprop1()" data-dismiss="modal">
								<span aria-hidden="true"> </span><span class="sr-only">Close</span>
							</button>
							
					<!-- Bhavesh(30-06-2023) added resize Button"  -->
					<div class="button-container custom-margin-left">
                    <button type="button" class="close-btn" onclick="toggleMaximize()">
                        <span aria-hidden="true"><i class="far fa-window-restore fa-2xs"></i></span>
                    </button>
							
						</div>
						
						</div>
						
						<div class="modal-body ">
						<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">
						
						<h4 class="pad-bottom">
						<spring:message code="dashboard.income.label" /> since 
						<span class="orange " id="asOnDate">${startDate} </span></h4>
						
						</div>
						<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 zero">
							
							<div
								class="col-md-5 col-lg-5 col-sm-5 col-xs-5 date-bar pad-bottom ">

								<label class="font_16" for="from">Last:
								<!-- Bhavesh(30-06-2023) added new class-months1  --></label>
								 <select class="months1 inline form-control" id="months" onchange="calculateDates(this.value,'incomefrom','incometo','go-btn2',0)" style="width:80%">
								<option value="0">Select Months/Year's</option>
								<option value="3">3 Months</option>
								<option value="6">6 Months</option>
								<option value="12">1 Years</option>
								<option value="24">2 Years</option>
								</select>
								
			                <!-- Bhavesh(18-10-23) hided Custom Duration --> 
							<!-- <div style="text-align:right;olor: #1578c2;">
							<a href="javascript:void()" onclick="openIncomeAnotherFilter()" id="incomCustom">
							<i>Custom Duration</i></a></div> -->
							</div>
							<div id="incomeAnotherFilter">
							<div
								class="col-md-1 col-lg-1 col-sm-1 col-xs-2 pad-bottom " style="padding-top:4px;">
								<h3 style="color: #1578c2;;"><strong>OR</strong></h3>
								</div>
							<div class="col-md-6 col-lg-6 col-sm-6 col-xs-6  date-bar  pad-bottom ">

								<label class="font_16" for="from">From</label><!-- Bhavesh(30-06-2023) added new class-fromProposal1  --> <input class="fromProposal1" type="text"
									id="incomefrom" name="from" readonly /> <label class="font_16"
									for="to">To</label><!-- Bhavesh(30-06-2023) added new class-toProposal1  --> <input class="toProposal1" type="text" id="incometo"
									name="to" readonly /> &nbsp; &nbsp;
								<button type="button"  class="btn btn-success go-btn2">Go</button>
							</div>
							</div>
							</div>
							
							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top">
							<div class="panel panel-info  ">
					<div class="panel-heading font_16">
					<spring:message code="dashboard.income.distribution.label" /> </div>
					<div class="panel-body ">
							<div id="chart-container-income" align='center'>
							
							</div>
							</div>
							</div>
							</div>
							
								<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top">
							<div class="panel panel-info  ">
					<div class="panel-heading font_16"> </div>
					<div class="panel-body">
							<div id="col-md-12">
								<%-------------------------- Income Table [05-12-2023]   ----------%>
								<table id="income_dataTable" class="table table-striped table-bordered"
									style="width: 100%">
									<thead class="datatable_thead bold ">
										<tr>									
											<th><spring:message code="dashboard.group.label" /></th>
											<th><spring:message code="dashboard.project.label" /></th>
											<th><spring:message code="dashboard.income.label" /></th>
										</tr>
									</thead>
									<thead class="filters">
										<tr>
											<th class="comboBox"></th>
											<th id="projectComboBox"></th>
											<th></th>
										</tr>
									</thead>
									<tbody class="">
									</tbody>
								</table>
								<%-------------------------- End Income Table [05-12-2023]   ----------%>
							</div>


							</div>


						</div>
					</div>
				</div>
			</div>
			</div>
			</div>
			
			<!-- End of modal for income -->

								<!-- Modal for Expenditure -->
			<!-- Bhavesh(30-06-2023) added new class-dash-newProposalList-modal  -->					
			<div class="modal dash-expenditure-modal dash-newProposalList-modal" id="dash-expenditure-modal"
				tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
				aria-hidden="true" data-keyboard="false" data-backdrop="static">
				<!-- Bhavesh(30-06-2023) added new class-mymodal1 and style="width:99%; height:95%;"  -->
                  <div class="modal-dialog modal-lg mymodal1" style="width:99%; height:95%;">
                  <!-- Bhavesh(30-06-2023) added new class-modal-lg and style="height:100%;"  -->
					<div class="modal-content modal-lg " style="height:100%;">
						<div class="modal-header">
							<h3 class="modal-title center" id="">
								<spring:message code="dashboard.expenditure.label" />
								in
								<sec:authentication
									property="principal.assignedOrganisationName" />
							</h3>
							<!-- Bhavesh(30-06-2023) added onclick="restoreprop1()"  -->
							<button type="button" class="close" onclick="restoreprop1()" data-dismiss="modal">
								<span aria-hidden="true"> </span><span class="sr-only">Close</span>
							</button>
							<!-- Bhavesh(30-06-2023) added resize Button"  -->
					<div class="button-container custom-margin-left">
                    <button type="button" class="close-btn" onclick="toggleMaximize()">
                        <span aria-hidden="true"><i class="far fa-window-restore fa-2xs"></i></span>
                    </button>
							
						</div>
						</div>

						<div class="modal-body ">
							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">

								<h4 class="pad-bottom">
									<spring:message code="dashboard.expenditure.label" />
									since <span class="orange" id="asOnDateExp1"></span>
								</h4>

							</div>
							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top">
								<div class="panel panel-info  ">
									<div class="panel-heading font_16">
										<spring:message
											code="dashboard.expenditure.distribution.label" />
									</div>
									<div class="panel-body">
										<div id="chart-container-expenditure"
											style="width: 100%; height: 100%;" align='center'></div>
									</div>
								</div>
							</div>

							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top">
								<div class="panel panel-info  ">
									<div class="panel-heading font_16"></div>
									<div class="panel-body">
										<div id="col-md-12">
											<table id="expenditure_dataTable"
												class="table table-striped table-bordered"
												style="width: 100%">
												<thead class="datatable_thead bold ">
													<tr>

														<th><spring:message code="dashboard.group.label" /></th>
														<th><spring:message code="dashboard.project.label" /></th>
														<th><spring:message
																code="dashboard.expenditure.label" /></th>
													</tr>
												</thead>
												<thead class="filters ">
													<tr>
														<th class="comboBox" id="expenditureSelect"><spring:message
																code="dashboard.group.label" /></th>
														<th class="">
															<%-- <spring:message code="dashboard.project.label" /> --%>
														</th>
														<th class="">
															<%-- <spring:message code="dashboard.expenditure.label" /> --%>
														</th>

													</tr>
												</thead>
												<tbody class="">
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>

						</div>
					</div>
				</div>
			</div>
			<!-- End of modal for Expenditure -->

			<!-- Modal For Emp Details --><!-- Commented by devesh on 21/6/23 as it was not working inside this div -->
	<!-- <div class="modal amount_receive_deatil_modal " id="empDetailModal"
		tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
		aria-hidden="true" data-keyboard="false" data-backdrop="static">
		<div class="modal-dialog modal-lg " role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h4 class="modal-title  center" id="exampleModalLabel">Employee Detail</h4>
					<button type="button" class="close" data-dismiss="modal"
						aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body emp_detail_modal">
				<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">
             <table id="datatable1" class="table table-striped table-bordered example_det"
						style="width: 100%">
					<thead class="datatable_thead bold">
						<tr>
						   <th>S.No</th>
						   <th>Employee Id</th>  
							<th>Employee Name</th>
							
						</tr>
					</thead>
					<tbody class="center">
					
				</tbody>
			</table>
			</div>
				</div>
				
			</div>
		</div>
	</div> -->
		<!-- End of Modal For Emp Details -->
		
	<!-- Modal For client Details -->
	<div class="modal amount_receive_deatil_modal" id="clientDetails"
		tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
		aria-hidden="true" data-keyboard="false" data-backdrop="static">
		<div class="modal-dialog modal-lg" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h4 class="modal-title  center" id="exampleModalLabel"><spring:message code="client.detail"/></h4>
					<button type="button" class="close" data-dismiss="modal"
						aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
				<div class="col-md-12 col-lg-12 col-xs-12 col-sm-12 table-responsive pad-top">
				<table class="table table-bordered">
    				<tbody>
        			<tr>
        			<th><h5 class=" blue"><spring:message code="client.name"/></h5></th>
        			<td><span class="black bold" id="clientName"></span></td>
        			</tr>
        			<tr>
        			<th><h5 class=" blue"><spring:message code="master.shortCode"/></h5></th>
        			<td><span class="black" id="shortCode"></span></td>
        			</tr>
        			<tr>
        			<th><h5 class=" blue"><spring:message code="group.groupAddress"/></h5></th>
        			<td><span class="black" id="address"></span> </td>
        			</tr>
        			<tr>
        			<th><h5 class=" blue"><spring:message code="master.contact"/></h5></th>
        			<td><span class="black" id="contactNo"></span></td>
        			</tr>
        			<tr>
        			<th><h5 class=" blue"><spring:message code="master.endUser"/></h5></th>
        			<td><span class="black" id="endUserName"></span></td>
        			</tr>
        			</tbody>
        			</table>
				</div>
				<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top ">
					<h5><u>Contact Person (For Funding Org)</u></h5></div>
					
					<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 table-responsive pad-top ">
					
						<table class="table table-bordered table-striped table-hover mb-0 " id="glance_data_table">						
							<thead>
						<tr>
						<td><h5><spring:message code="Client_Contact_Person_Master.clientContactPersonName"/></h5></td>
						<td><h5><spring:message code="Client_Contact_Person_Master.contactPersonDesignation"/></h5></td>
						<td><h5><spring:message code="Client_Contact_Person_Master.contactPersonMobileNumber"/></h5></td>
						<td><h5><spring:message code="Client_Contact_Person_Master.contactPersonEmailId"/></h5></td>
						<td><h5><spring:message code="Client_Contact_Person_Master.contactPersonOfficeAddress"/></h5></td>
						
						</thead>
						<tbody id="clientcontactDetails"></tbody>
						</table>
					</div>
				
				</div>
				<div class="modal-footer" id="modelFooter">
					
				</div>
			</div>
		</div>
	</div>
			<!-- Modal for team member details-->
<div class="modal" id="team-modal" tabindex="-1"
			role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"
			data-keyboard="false" data-backdrop="static">


    <!-- Modal content-->
  		<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<h3 class="modal-title center" id="">Team Details</h3>
						<button type="button" class="close" data-dismiss="modal">
							<span aria-hidden="true"> </span><span class="sr-only">Close</span>
						</button>
					</div>
      <div class="modal-body">
        <div class="col-md-12 col-lg-12 col-sm-12 center">
        	
					<div id="chart-container"></div>
				</div>

      </div>
  
    </div>

  </div>
</div>
<!-- Modal for Amount -->
<!-- Modal For Amount Receive -->
	<div class="modal amount_receive_deatil_modal" id="amtreceive"
		tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
		aria-hidden="true" data-keyboard="false" data-backdrop="static">
		<div class="modal-dialog modal-lg" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h4 class="modal-title  center" id="exampleModalLabel">Payment Realized</h4>
					
					<button type="button" class="close" data-dismiss="modal"
						aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
				
				<div class="row pad-top ">
									
										<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group">
										<div class="col-md-2 col-lg-2 col-sm-2 col-xs-2">

											<label class="label-class"><b><spring:message
													code="Project_Payment_Schedule.projectName" /> :</b></label> 

										</div>
										<div class="col-md-6 col-lg-6 col-sm-6 col-xs-6" id="projectForPayment">
											
										</div>
									</div>
									</div>
				<div class="row pad-top ">			
										<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group">
										<div class="col-md-2 col-lg-2 col-sm-2 col-xs-2">

											<label class="label-class"><b><spring:message
													code="client.name" /> :</b></label>

										</div>
										<div class="col-md-6 col-lg-6 col-sm-6 col-xs-6" id="clientIdForPayment">
											
										</div>
									</div>
								</div>
				
             <table id="datatable" class="table table-striped table-bordered example_det pad-top"
						style="width: 100%">
					<thead class="datatable_thead bold">
						 <tr>
							<th>Date</th>
							<th>Particulars</th>
							<th>Payment Due</th>
							<th>Payment Received</th>
						</tr>
					</thead>
					<tbody class="">
					
				</tbody>
			</table>
				</div>
				<div class="modal-footer" id="modelFooter">
					
				</div>
			</div>
		</div>
	</div>

<!-- End of Modal for Amount -->
			
		</div>
		
		
		 <div class="modal dash-newProjectList-modal dash-modal"
				id="allDetails" tabindex="-1" role="dialog"
				aria-labelledby="myModalLabel" aria-hidden="true"
				data-keyboard="false" data-backdrop="static">
				<div class="modal-dialog modal-lg">
					<div class="modal-content">
						<div class="modal-header">
							<h3 class="modal-title center" id="">
								All Details
							</h3>
							
						</div>
										<div class="card-footer">
											<div class="stats">
												<span> <span class="pad-top">since:</span> <span
													class="bold" id="asOnDateDetails"
													style="font-size: 14px; color: #4d4b4b;">${startRange}
												</span>
												</span>

											</div>
						<div class="modal-body dash-modal-body">
							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">

								<h4 class="pad-bottom">
									Details
									since : <span class="orange" id="asOnDateDetails1"></span>
								</h4>

							</div>

							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 date-bar ">

								<label class="" for="from">From</label> <input type="text"
									id="fromDet" name="from" readonly /> <label class="" for="to">To</label>
								<input type="text" id="toDet" name="to" readonly /> &nbsp; &nbsp;
								<button type="button" class="btn btn-success go-btn-det">Go</button>
									<input type="hidden" id="fromDetNew">
									<input type="hidden" id="fromDetailNew" value="${startRange}">
									<input type="hidden" id="toDetailNew">
							</div>

							<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 pad-top">

								<table id=""
									class="table table-striped table-bordered" style="width: 100%">
									<thead class="datatable_thead bold ">
										<tr>
						    <th width="15%">Department</th>
						    <th >Proposals Submitted </th>  
						    <th>Projects Received</th>
							<th>Projects Closed</th>
							<th>New Joinees</th>
							<th>Resigned Employees</th>
							<th> Employees</th>	
							<th> Income</th>							
						</tr>
									</thead>
							
									<tbody class="">
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
			</div>
			
			
			
				<c:forEach var="item" items="${closureData}">
		<p class="closureList hidden">${item.projectRefrenceNo}</p>
	</c:forEach>
	<c:forEach var="item2" items="${pendingClosureProjectList}">
		<p class="pendingClosureList hidden">${item2.projectRefrenceNo}</p>
	</c:forEach>
</section>

<script type="text/javascript" 	src="https://www.gstatic.com/charts/loader.js"></script>

<script src="/PMS/resources/app_srv/PMS/global/jsp/dashboard/js/gcFinanceDashboard.js"></script>
			
			<!-- Proposals submitted in last 3 years group wise -->
		<!-- <script type="text/javascript">
			google.charts.load('current', {
				'packages' : [ 'bar' ]
			});
			google.charts.setOnLoadCallback(drawChart);

			function drawChart() {
				
				countProposals = ${proposalGraphData}	;
				/* console.log(countProposals); */
				var colors = (countProposals[1]);
				countProposals.splice(1,1);
				/* console.log(countProposals); */
				 var data = google.visualization
						.arrayToDataTable(countProposals); 

				
				var options = {

						bar : {
							groupWidth : '30%'
						},
						colors : colors,
					
				};
				
					

				var chart = new google.charts.Bar(document
						.getElementById('columnchart_proposals'));

				chart.draw(data, google.charts.Bar.convertOptions(options));

			}
		</script>


			
			Projects received in last 3 years group wise
		<script type="text/javascript">
			google.charts.load('current', {
				'packages' : [ 'bar' ]
			});
			google.charts.setOnLoadCallback(drawChart);

			function drawChart() {
				
				countbarGraph = ${projcountbarGraphData}	;
				//console.log(countbarGraph);
				var colors = (countbarGraph[1]);
				countbarGraph.splice(1,1);
				//console.log(countbarGraph);
				 var data = google.visualization
						.arrayToDataTable(countbarGraph); 

				
				var options = {

						bar : {
							groupWidth : '30%'
						},
						colors : colors,
					
				};
				
					

				var chart = new google.charts.Bar(document
						.getElementById('columnchart_material'));

				chart.draw(data, google.charts.Bar.convertOptions(options));

			}
		</script>

 -->
<!--End of total projects  -->

<!--Number of employees in CDAC-Noida based on employement type  -->
						
 <script type="text/javascript">

	      google.charts.load("current", {packages:["corechart"]});
	      /* google.charts.setOnLoadCallback(drawChart);
	  	  function drawChart() { */
	  	  //name of funtion updated to call on click employee tile by devesh on 16/6/23
	      google.charts.setOnLoadCallback(drawEmploymentTypeWiseChart);
	      function drawEmploymentTypeWiseChart() {
	    	  employmentTypeWiseCount = ${employmentTypeWiseCount}	;			
				 var data = google.visualization
						.arrayToDataTable(employmentTypeWiseCount); 
	        var options = {	     
	          is3D: true,
	          width:800,
	          height:300,
	          chartArea: {width: 400, height: 200},
	   		 pieSliceTextStyle: {
	              color: 'white',
	              //fontSize : 15,
				  fontSize : 11,//font size updated on 16/6/23
	          },
	          legend: { textStyle: {fontSize: 14}},
	          pieSliceText: 'value',
	          colors : [ '#b36686', '#532aa1', '#90a603',
							'#3fbbc4' ],
	        };

	        var chart = new google.visualization.PieChart(document.getElementById('chart-container-emp'));
	        
	        function selectHandler() {
		          var selectedItem = chart.getSelection()[0];
		          if (selectedItem) {
		            var empType = data.getValue(selectedItem.row, 0);	          
		            filterTable(empType);
		         }
		        }
			 google.visualization.events.addListener(chart, 'select', selectHandler);
			 
	        chart.draw(data, options);
	      }
	    </script>

<!--End of Number of empoyees in CDAC-Noida based on employee type  -->


						<!-- Employees in CDAC Noida employee type wise-->
						<script type="text/javascript">
						//console.log('Employee Bar Graph Data');
						/* console.log('${empbarGraphData}'); */
						//console.log('**************************');
							google.charts.load('current', {
								packages : [ 'corechart', 'bar' ]
							});
							google.charts.setOnLoadCallback(drawChart);
							function drawChart() {
								barGraphEmployees = ${empbarGraphData};
								var data = google.visualization
										.arrayToDataTable(barGraphEmployees);
								 var view = new google.visualization.DataView(data);
							     view.setColumns([0, 1,
							                       { calc: "stringify",
							                         sourceColumn: 1,
							                         type: "string",
							                         role: "annotation" },
							                       2,{ calc: "stringify",
								                         sourceColumn: 2,
								                         type: "string",
								                         role: "annotation" },3,{ calc: "stringify",
									                         sourceColumn: 3,
									                         type: "string",
									                         role: "annotation" },4,{ calc: "stringify",
										                         sourceColumn: 4,
										                         type: "string",
										                         role: "annotation" }]); 
							     
							    /*  changes in label of graph on 23-05-23  */
								var options = {

									/* width : 1150,
									height : 1400, *///commented on 28/6/23 
									//height : 600,
									/* Updated by devesh on 28/6/23 to reduce the dimentions of graph */
									width : 920,
									height : 1250,
									/* End of height and width */
									
									/* Added by devesh on 28/6/23 to reduce the size of graph */
									chartArea: {
			      						width: '60%', // Adjust the width of the chart area
			     						height: '60%' // Adjust the height of the chart area
			    					},
		 							/* End of height and width */

									legend : {
										position : 'right',
										
										fontSize:12
									},
									 hAxis: {
								          showTextEvery: 1,		
								          slantedText:true,
								          //slantedTextAngle:40,//commented on 28/6/23 
								        //  slantedTextAngle:45,
								        /* Updated by devesh on 28/6/23 to change label font and avoid overlapping */
											slantedTextAngle : 60,
											textStyle: {
			        						fontSize: 12 // Adjust the font size of the x-axis labels
			      							},
			    						//end
								          
								        },
								
									  vAxis: {
								          title: 'Number of Employees'
								        },

								       
									bar : {
										groupWidth : '60%'
									},
									isStacked : true,
									
									colors : [ '#b36686', '#532aa1', '#90a603',
											'#3fbbc4' ],
								};
							
								
								
								var chart = new google.visualization.ColumnChart(
										document
												.getElementById('chart-container-emp1'));
								chart.draw(view, options); 

								google.visualization.events.addListener(chart,
										'select', selectHandler);

								function selectHandler() {
									var selection = chart.getSelection();
									var message = '';
									for (var i = 0; i < selection.length; i++) {
										var item = selection[i];
										if (item.row != null
												&& item.column != null) {
											var str = data.getFormattedValue(
													item.row, item.column);
											var category = data.getValue(chart
													.getSelection()[0].row, 0)
											var type
											if (item.column == 1) {
												type = " Consolidated Contract";
											} else if (item.column == 2) {
												type = "Regular";
											} else if (item.column == 3) {
												type = "Third Party";
											} else if (item.column == 4) {

												type = "Grade Based Contract";
											}
											message += '{row:'
													+ item.row
													+ ',column:'
													+ item.column
													+ '} = '
													+ str
													+ '  The Department is:'
													+ category
													+ ' and EmployeeType is  : '
													+ type + '\n';
										} else if (item.row != null) {
											var str = data.getFormattedValue(
													item.row, 0);
											message += '{row:'
													+ item.row
													+ ', column:none}; value (col 0) = '
													+ str
													+ '  The Category is:'
													+ category + '\n';
										} else if (item.column != null) {
											var str = data.getFormattedValue(0,
													item.column);
											message += '{row:none, column:'
													+ item.column
													+ '}; value (row 0) = '
													+ str
													+ '  The Category is:'
													+ category + '\n';
										}
									}
									if (message == '') {
										message = 'nothing';
									}
									alert('You selected ' + message);

								}
							}
	  
							$(window).resize(function() {
								drawChart();
							});
						</script>

<!--Deputed wise Employees added by devesh on 9/6/23 -->

<script type="text/javascript">
	google.charts.load("current", {
		packages : [ "corechart" ]
	});
	google.charts.setOnLoadCallback(drawdeputedChart);  
	
	
	function drawdeputedChart() {
		barGraphEmployees = ${deputedWiseCount};
	
		var data = google.visualization
				.arrayToDataTable(barGraphEmployees);
		var count = data.getNumberOfRows();
		var values = Array(count).fill().map(function(v, i) {
			return data.getValue(i, 1);
		});
		var total = google.visualization.data.sum(values);
		// console.log(total);
		values.forEach(function(v, i) {
			var key = data.getValue(i, 0);
			// console.log(key);
			var val = data.getValue(i, 1);
			//console.log(val);
			data.setFormattedValue(i, 0, key + ' (' + (val) + ')');
		});
		var options = {
			is3D : true,
			width : 800,
			height : 300,
			chartArea : {
				width : 400,
				height : 200
			},
			sliceVisibilityThreshold:0,

			pieSliceText : 'value',
			pieSliceTextStyle : {
				color : 'white',
				fontSize : 14,
			},
			legend : {
				text : 'value',
				position : 'right',
				textStyle : {
					fontSize : 14,
					color : 'red'
				}
			},

			colors : [ '#b36686', '#532aa1', '#90a603', '#3fbbc4' ],
		};

		var chart = new google.visualization.PieChart(document
				.getElementById('chart-container-emp2'));
		
		 function selectHandler() {
	          var selectedItem = chart.getSelection()[0];
	          if (selectedItem) {
	            var empType = data.getValue(selectedItem.row, 0);	          
	            filterTable(empType);
	         }
	        }
		 google.visualization.events.addListener(chart, 'select', selectHandler);	
		chart.draw(data, options);
	}
	
</script>
<!--End of Deputed wise Employees  -->						
						
		<!-- Income -->				
 <script type="text/javascript">
      google.charts.load('current', {'packages':['corechart']});
      /* google.charts.setOnLoadCallback(initialzeIncomeChart()); */

      function drawIncomeChart() {
    	 
       var incomePieChart = '';
       var colors ='';
    	
   // alert("inside draw");
    	var startDate =  $('#asOnDate').text();
    	var endDate =  $('#dtEndDate').val();
    	
    	$('#asOnDate1').text(startDate);
    	 //alert("inside draw:::::"+startDate);
    	 //alert("inside draw::222:::"+ $('#asOnDate1').text());
    	 //alert("endDate" +endDate);
    	// var endDate= ${endRange};
    	 //alert("endRange1" +endDate);
     	
    	$.ajax({
    		type : "POST",
    		url : "/PMS/mst/getIncomeByDateGraph",
    		data : {"startDate":startDate,
				"endDate":endDate
    		},
    		async: false, 
    		success : function(response) {
    			console.log(response);
    			incomePieChart=response;
    			
    			var temp = response.length-1;    			
    	    	colors = (incomePieChart[temp]);    	    	
    	    	incomePieChart.splice(temp,temp);  
	
    		}
		
			});
    	
      var data = google.visualization.arrayToDataTable(incomePieChart); 

        		   var options = {
     	    	        
     	    	          titleTextStyle: {
     	    	     	       
     	    	    	         fontName: 'Calibri', 
     	    	    	         fontSize: 16, 
     	    	    	        
     	    	    	     },
     	    	    	     
     	    	          width:900,
     	    	    	  height:300,
     	    	    	 
     	    	    	  legend: { textStyle: {fontSize: 14}},
     	    	  		 pieSliceTextStyle: {
     	    	             color: 'black'
     	    	         },
     	    	        pieSliceText: 'none',
     	    	        colors: colors
     	    	       
     	    	
     	    	        };

        		   var formatter = new google.visualization.NumberFormat(
        	    	         {negativeColor: 'black', negativeParens: true, pattern: '#,##,##,###.##'});
        	    	        formatter.format(data, 1);       
        	    	      
        	    	        // Create and draw the visualization.
        	    	        var chart =  new google.visualization.PieChart(document.getElementById('chart-container-income'));
        	    	            
       // var chart = new google.visualization.PieChart(document.getElementById('chart-container-income'));
        // Instantiate and draw our chart, passing in some options.

        function selectHandler() {
          var selectedItem = chart.getSelection()[0];
          if (selectedItem) {
            var group = data.getValue(selectedItem.row, 0);
           // console.log('The user selected ' + group);
           
          /*  var table_row = $('#income_dataTable thead  tr th').eq(0).prevObject;
    		 var abc = table_row[3];
    		 console.log(abc); */
    		 
    		$('#incomeSelect select').val(group).trigger('change');
          
          }
        }

        google.visualization.events.addListener(chart, 'select', selectHandler);   

        chart.draw(data, options);
      }
      
      function initialzeIncomeChart(){
    	 
    	  //alert("before draw");
    	 drawIncomeChart();
    	  
    	  //alert("after draw");
    	  
    	  incomeTable();
    	 // alert("after incomeTable");
      }
      
    </script> 
    
    
    
    						
		<!-- Expenditure -->				
 <script type="text/javascript">
      google.charts.load('current', {'packages':['corechart']});
      /* google.charts.setOnLoadCallback(initialzeIncomeChart()); */

      function drawExpenditureChart() {
    	 
       var expenditurePieChart = '';
       var colors ='';
    	
    
    	var startDate =  $('#asOnDateExp').text();
    	$('#asOnDateExp1').text(startDate);
    	
    	
    	$.ajax({
    		type : "POST",
    		url : "/PMS/mst/getExpenditureByDateGraph",
    		data : "startDate=" + startDate,
    		async: false, 
    		success : function(response) {
    			//console.log(response);
    			//console.log(expenditurePieChart);
    		
    			expenditurePieChart=response;
    			colors = (expenditurePieChart[1]);    	    	
    	    	expenditurePieChart.splice(1,1);  
    			 			
    	    	
	
    		}
		
			});
    	
   // console.log(expenditurePieChart)
    	
      var data = google.visualization.arrayToDataTable(expenditurePieChart); 

        		   var options = {
     	    	        
     	    	          titleTextStyle: {
     	    	     	       
     	    	    	         fontName: 'Calibri', 
     	    	    	         fontSize: 16, 
     	    	    	        
     	    	    	     },
     	    	    	     
     	    	          width:900,
     	    	    	  height:300,
     	    	    	
     	    	    	  legend: { textStyle: {fontSize: 14}},
     	    	  		 pieSliceTextStyle: {
     	    	             color: 'black'
     	    	         },
     	    	        pieSliceText: 'none',
     	    	        colors: colors
     	    	       
     	    	
     	    	        };


        		   var formatter = new google.visualization.NumberFormat(
        	    	         {negativeColor: 'red', negativeParens: true, pattern: '#,##,##,##,###.##'});
        	    	        formatter.format(data, 1);       
        	    	      
        	    	        // Create and draw the visualization.
        	    	        var chart =  new google.visualization.PieChart(document.getElementById('chart-container-expenditure'));
        	    	        
        	    	     // Instantiate and draw our chart, passing in some options.

        	    	        function selectHandler() {
        	    	          var selectedItem = chart.getSelection()[0];
        	    	          if (selectedItem) {
        	    	            var group = data.getValue(selectedItem.row, 0);
        	    	           // console.log('The user selected ' + group);
        	    	           
        	    	          /*  var table_row = $('#income_dataTable thead  tr th').eq(0).prevObject;
        	    	    		 var abc = table_row[3];
        	    	    		 console.log(abc); */
        	    	    		 
        	    	    		$('#expenditureSelect select').val(group).trigger('change');
        	    	          
        	    	          }
        	    	        }

        	    	        google.visualization.events.addListener(chart, 'select', selectHandler);   

        	    	            chart.draw(data,options);
      }
      
      function initialzeExpenditureChart(){
    	 
    	  drawExpenditureChart();
    	  expenditureTable();
    	  
      }
      
    </script> 
    <script>
    $(document).ready(function() {
    	groupEmpTypeTable();
    	groupEmpTypeTableTotal();
    });
    
    	function groupEmpTypeTable(){
    		var barGraphEmployees = ${empbarGraphData};	
    		var tableData = '';
    		var noOfColumn =0;
			for(var i=0;i<barGraphEmployees.length;i++){
				var rowData = barGraphEmployees[i];
				var tableRow  ="<tr> ";
				var totalOfRow = 0;
					for(var j=0;j<rowData.length;j++){
						if(i==0){
							noOfColumn = rowData.length;
							if(j == 0){
								tableRow += "<th width='40%'>"+ rowData[j] +"</th>";
							}else{
								tableRow += "<th width='10%'>"+ rowData[j] +"</th>";
							}
						}else{							
							if(j == 0){
								tableRow += "<th width='40%'>"+ rowData[j] +"</th>";
							}else{
								totalOfRow += rowData[j];
								tableRow += "<td width='10%' class='text-right col_"+j+"'>"+ rowData[j] +"</td>";
							}
							
						}
						if(j == rowData.length-1){
							if(i == 0){
								tableRow += "<th width='10%' class='blue'> Total </th> </tr>";
							}else{
								tableRow += "<th width='10%' class='blue text-right col_"+noOfColumn+"'>"+ totalOfRow +"</th> </tr>";
							}
						}
					}
					tableData += tableRow;
			}
			
			$('#group_emptype_tbl').empty();
			$('#group_emptype_tbl').append(tableData);
    	}
    	
    	function groupEmpTypeTableTotal(){
    		var columns = $($('#group_emptype_tbl  tr')[0]).find('th').length;
    		
			var totalRow = '<tr> <th>Total </th>';
			
			for(var i=1;i<columns;i++){
				var columnTotal = 0;
				$(".col_"+i).each(function(){
					//console.log($(this).text());
					columnTotal = parseInt(columnTotal)+ parseInt($(this).text().trim());
				  });
				totalRow+= "<th class='blue text-right'>"+columnTotal+"</th>";
			}
			totalRow+="</tr>";
			$('#group_emptype_tbl').append(totalRow);
    		
    	}
    </script>
    
    <script type="text/javascript">
	function initializePendingPayments() {

		pendingPaymentsTable();

	}
</script>
<script type="text/javascript">
	function initializePendingInvoices() {
	
		pendingInvoicesTable();
	}

</script>
<style>

 

.custom-margin-left {
  margin-left: 94%; 

  } 
  
 
 .maximized .modal-content {
  top: 52%;
    left: 53%;
    transform: translate(-52%, -50%);
    /* right: -104%; */
    /* transition: right -0.7s ease-in-out; */
    /* margin-left: auto; */
    /* margin-right: auto; */
    width: 80.5vw;
  
 
} 


 .modal-open .modal {
      overflow-y: clip;
}
  
.close-btn {
  border: none;
  background-color: transparent;
   color: white; 
  cursor: pointer;
   font-size: 16px;
  transform: scale(1.8);

  line-height: 2;
  margin-top: -23px;
} 
</style>

<style>

 

.custom-margin-left {
  margin-left: 94%; 

  } 
  
 
 .maximized .modal-content {
  top: 52%;
    left: 53%;
    transform: translate(-52%, -50%);
    /* right: -104%; */
    /* transition: right -0.7s ease-in-out; */
    /* margin-left: auto; */
    /* margin-right: auto; */
    width: 80.5vw;
  
 
} 


 .modal-open .modal {
      overflow-y: clip;
}
  
.close-btn {
  border: none;
  background-color: transparent;
   color: white; 
  cursor: pointer;
   font-size: 16px;
  transform: scale(1.8);

  line-height: 2;
  margin-top: -23px;
} 



/* added by devesh on 28/6/23 for minus sign on panel expand */
.panel-group .panel-heading a:after {
  content: '-';
  float: right;
}
/* End */
/* added by devesh on 28/6/23 for plus sign on panel collapse */
.panel-group .panel-heading a.collapsed:after {
  content: '+';
}
/* End */
/* <!-- Bhavesh(21-07-2023) added stylesheet link  --> */
.success-text {
	color: #4CAF50; /* Replace this with the shade of green you prefer */
}

.grey-text {
	color: #808080; /* Replace this with the shade of grey you prefer */
}

.golden-text {
	color: #cc9900;
}

.brown-text {
  color: #993300;
}
.legend {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f1f1f1;
    padding: 10px;
    border: 1px solid #ccc;
}

.legend-item {
    display: flex;
    align-items: center;
    margin-right: 15px;
}

.legend-color {
    width: 20px;
    height: 20px;
    margin-right: 5px;
    border-radius: 50%;
}

/* Added by devesh on 09/08/23 to colour the changed value in proposal log table */
.different-value {
	color: red; /* Change this to the desired color */
}
/* End of proposal log colour */

</style>
