<!DOCTYPE html>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="sec"
	uri="http://www.springframework.org/security/tags"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<html lang="en">
<head>

<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<style>
.bg_grey{
background: LemonChiffon !important;
}
</style>
<body>
	<section id="main-content" class="main-content merge-left">
		<div class=" container wrapper1">
			<div class="row">
				<div class=" col-md-12 pad-top-double  text-left">
					<ol class="breadcrumb bold">
						<li>Home</li>

						<li class="active">Project Category Designation </li>
					</ol>
					<div class="row padded"></div>
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

					
			<form:form id="form1" modelAttribute="designationForClientModel" method="post">
					
							
							<div class="container">
								<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">
									<div class="panel panel-info panel-info1">
										<div class="panel-heading">
											<h3 class="text-center text-shadow">
												Project Category Designation Mapping
											</h3>
										</div>
										<div class="panel-body">
											<form:hidden path="numId"/>											
											<div class="row pad-top">

												<div class="col-md-6 col-lg-6 col-sm-6 col-xs-12 form-group">
													<div class="col-md-6 col-lg-6 col-sm-6 col-xs-12">
														<label class="label-class"><spring:message
																code="application.project.category.label" />:<span
															style="color: red;">*</span></label>
													</div>
													<div class="col-md-6 col-lg-6 col-sm-6 col-xs-12">
														<div class="input-container">
															<form:select path="projectCategoryId" class="select2Option data">
																<form:option value="0">-- Select Category --</form:option>
																<c:forEach items="${categoryList}" var="category">
																	<form:option value="${category.numId}">
																		<c:out value="${category.categoryName}"></c:out>
																	</form:option>
																</c:forEach>
															</form:select>							

														</div>
													</div>
												</div>

												<div class="col-md-6 col-lg-6 col-sm-6 col-xs-12 form-group">
													<div class="col-md-6 col-lg-6 col-sm-6 col-xs-12">
														<label class="label-class"><spring:message
																code="employee.designation" />:<span
															style="color: red;">*</span></label>
													</div>
													<div class="col-md-6 col-lg-6 col-sm-6 col-xs-12">													
														<div class="input-container">
															<form:select path="designationId" class="select2Option data">
																<form:option value="0">-- Select Designation --</form:option>
																<c:forEach items="${designationList}" var="designation">
																	<form:option value="${designation.numId}">
																		<c:out value="${designation.designationName}"></c:out>
																	</form:option>
																</c:forEach>
															</form:select>							

														</div>												
														
													</div>
												</div>

											</div>

											<div class="row ">
												<div class="col-md-6 col-lg-6 col-sm-6 col-xs-12 form-group">
													<div class="col-md-6 col-lg-6 col-sm-6 col-xs-12">
														<label class="label-class"><spring:message
																code="manpower.cost" />:<span
															style="color: red;">*</span></label>
													</div>
													<div class="col-md-6 col-lg-6 col-sm-6 col-xs-12">
														<div class="input-container">
														<i class="fa fa-inr icon"></i>
												<form:input class="input-field" path="cost" />
												
											</div>
													</div>
												</div>

											</div>
										</div>
							

											<div class="row pad-top pad-bottom form_btn center">
											<button type="button" class="btn btn-primary font_14"  id="save">
												<span class="pad-right"><i class="fa fa-folder"></i></span>Save
											</button>
											
										</div>
									</div>
								</div>
							</div>
						</form:form>
								

				</div>
			</div>
		</div>
		

		
	</section>
	
	
	
	<script type="text/javascript" src="/PMS/resources/app_srv/PMS/transaction/js/projectCategoryDesignationMapping.js"></script>
</body>
</html>