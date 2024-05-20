<%@page import="java.util.HashMap"%>
<%@page import="java.util.Map"%>
<%@page import="java.time.temporal.WeekFields"%>
<%@page import="java.util.List"%>
<%@page import="java.util.ArrayList"%>
<%@page import="java.time.DayOfWeek"%>
<%@page import="java.time.LocalDate"%>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@page isELIgnored="false" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
<!--   <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
  <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css"> -->
  <link rel="stylesheet" href="<c:url value="/resources/app_srv/PMS/timesheet/css/style.css"></c:url>">
  <title>Timesheet</title>
</head>
<body>
	<section id="main-content" class="main-content merge-left">
	
		<div class=" container wrapper1">
			<%-- <c:choose>
			    <c:when test="${empty yearToday}">
			    	<c:set var="reportYear" value="${calenderSelectedYear}"></c:set>
			    </c:when>
			    <c:otherwise>
			    	<c:set var="reportYear" value="${yearToday}"></c:set>
			    </c:otherwise>
			</c:choose>
			<div style="display: flex; justify-content:right">
		  		<a href="reports/${reportYear }">
		  			<h4 class="timesheetTitle" style="padding-bottom: 20px;">
						<span style="color: #173faa;">R</span><span style="color: #1578c2">eports</span>
					</h4>
				</a>
		  	</div> --%>
		  <div class="container mt-5">
			<div>
				<header style="display: flex; justify-content:center">
					<h1 class="timesheetTitle" style="text-shadow: 2px 0px 2px #1e2787; padding-bottom: 20px;">
					<span style="color: #173faa;">T</span><span style="color: #1578c2">imesheet</span>
					</h1>
				</header>
		  	</div> 
		<div class="container" style=" display: flex; justify-content: center;">
			 <form id="myForm" style="width: 400px;" class="calendarForm" action="calenderSelectedMonthYear" method="post">
			  	 <input type="hidden" id="selectedDateNumber" name="selectedDateNumber" value="15"/>
			  	 <input type="hidden" name="userId" value="${empId }"/>
			  	 <div class="row" style="display: flex; justify-content: center; padding-bottom: 10px;">
			  	 	<div class="col-md-4">
			            <label for="calenderSelectedMonth">Select Month:</label>
						 <select class="monthList form-control" name="calenderSelectedMonth">
							 <c:choose>
									    <c:when test="${empty monthToday}">
									        <option>${calenderSelectedMonth}</option>
									    </c:when>
									    <c:otherwise>
									        <option>${monthToday}</option>
									    </c:otherwise>
							 </c:choose>
						 	<c:forEach var="monthName" items="${monthNameList }">
								<option value="${monthName }">${monthName }</option>
							</c:forEach>
						 </select>
					 </div>
					 <div class="col-md-4">
			             <label for="calenderSelectedYear">Select Year:</label>
						 <select class="yearList form-control" name="calenderSelectedYear">
						 	<c:choose>
									    <c:when test="${empty yearToday}">
									        <option>${calenderSelectedYear}</option>
									    </c:when>
									    <c:otherwise>
									        <option>${yearToday}</option>
									    </c:otherwise>
							 </c:choose>
						 	<c:forEach var="year" items="${yearList }">
								<option value="${year }">${year }</option>
							</c:forEach>
						 </select>
					 </div>
				 </div>
				 <c:set var = "check" value = '${fn:length(calenderDayList)}'></c:set>
		        <div class="calendar">
		            <table border: "1" class="table table-bordered">
		            	<thead class="thead-dark">
		            	<tr>
		            		<th></th>
		            		<th>Mon</th>
		            		<th>Tue</th>
		            		<th>Wed</th>
		            		<th>Thu</th>
		            		<th>Fri</th>
		            		<th style="background-color:#666666;border-color: #666666;">Sat</th>
		            		<th style="background-color:#666666;border-color: #666666;">Sun</th>
		            	</tr>
		            	</thead>
		            	<tbody>
		            		<c:set var="filledTilldate" value="1" />
		            		
		            		<tr>
		            			<td style="background-color: rgb(33, 37, 41); color: white;"><strong>${calenderWeekNumbers[0]}</strong></td>
							    <c:forEach var="index" begin="1" end="${calenderStartDay - 1}">
							    		<c:choose>
							    			<c:when test="${index eq 6 or index eq 7}">
							    				<td style="background-color: #e6deed"><div class="block"></div></td>
							    			</c:when>
							    			<c:otherwise>
							    				<td style="background-color: ${calendarColor[0]}"><div class="block"></div></td>
							    			</c:otherwise>
							    		</c:choose>
								</c:forEach>
								<c:forEach var="index" begin="${calenderStartDay}" end="7">
									<c:set var="isHolidayCompulsary" value="false" />
									<c:forEach var="item" items="${holidayListDaysCompulsary}">
										<c:if test="${item eq filledTilldate}">
											<c:set var="isHolidayCompulsary" value="true" />
										</c:if>
									</c:forEach>
									<c:set var="isHolidayRestricted" value="false" />
									<c:forEach var="item" items="${holidayListDaysRestricted}">
										<c:if test="${item eq filledTilldate}">
											<c:set var="isHolidayRestricted" value="true" />
										</c:if>
									</c:forEach>
									<c:choose>
										<c:when test="${isHolidayCompulsary}">
											<td style="background-color: yellow;"><div class="block" onclick="selectDateNumber(${filledTilldate})"><strong>${filledTilldate}</strong></div></td>
										</c:when>
										<%-- <c:when test="${isHolidayRestricted}">
											<td style="background-color: pink;"><div class="block" onclick="selectDateNumber(${filledTilldate})"><strong>${filledTilldate}</strong></div></td>
										</c:when> --%>
										<c:otherwise>
											<c:choose>
								    			<c:when test="${index eq 6 or index eq 7}">
								    				<td style="background-color: #e6deed"><div class="block" onclick="selectDateNumber(${filledTilldate})">${filledTilldate}</div></td>
								    			</c:when>
								    			<c:otherwise>
								    				<td style="background-color: ${calendarColor[0]}"><div class="block" onclick="selectDateNumber(${filledTilldate})"><strong>${filledTilldate}</strong></div></td>
								    			</c:otherwise>
							    			</c:choose>
											
										</c:otherwise>
									</c:choose>
								    <c:set var="filledTilldate" value="${filledTilldate + 1}" />
									    
								</c:forEach>
							</tr>
		            		<c:forEach var="indexWeek" begin="1" end="${fn:length(calenderWeekNumbers)-1}">
							    <tr>
							    	<td style="background-color: rgb(33, 37, 41); color: white;"><strong>${calenderWeekNumbers[indexWeek]}</strong></td>
							    	<c:forEach var="index" begin="1" end="7">
							    		<c:set var="isHolidayCompulsary" value="false" />
										<c:forEach var="item" items="${holidayListDaysCompulsary}">
											<c:if test="${item eq filledTilldate}">
												<c:set var="isHolidayCompulsary" value="true" />
											</c:if>
										</c:forEach>
										<c:set var="isHolidayRestricted" value="false" />
										<c:forEach var="item" items="${holidayListDaysRestricted}">
											<c:if test="${item eq filledTilldate}">
												<c:set var="isHolidayRestricted" value="true" />
											</c:if>
										</c:forEach>
							    		<c:choose>
										    <c:when test="${filledTilldate gt check}">
										    	<c:choose>
										    		<c:when test="${index eq 6 or index eq 7}">
										    			<td style="background-color:#e6deed "><div class="block"></div></td>
										    		</c:when>
										    		<c:otherwise>
										    			<td style="background-color: ${calendarColor[indexWeek]}"><div class="block"></div></td>
										    		</c:otherwise>
										    	</c:choose>
										        
										    </c:when>
										    <c:otherwise>
										    	<c:choose>
													<c:when test="${isHolidayCompulsary}">
														<td style="background-color: yellow;"><div class="block" onclick="selectDateNumber(${filledTilldate})"><strong>${filledTilldate}</strong></div></td>
													</c:when>
													<%-- <c:when test="${isHolidayRestricted}">
														<td style="background-color: pink;"><div class="block" onclick="selectDateNumber(${filledTilldate})"><strong>${filledTilldate}</strong></div></td>
													</c:when> --%>
													<c:otherwise>
														<c:choose>
											    			<c:when test="${index eq 6 or index eq 7}">
											    				<td style="background-color: #e6deed"><div class="block" onclick="selectDateNumber(${filledTilldate})">${filledTilldate}</div></td>
											    			</c:when>
											    			<c:otherwise>
											    				<td style="background-color: ${calendarColor[indexWeek]}"><div class="block" onclick="selectDateNumber(${filledTilldate})"><strong>${filledTilldate}</strong></div></td>
											    			</c:otherwise>
										    			</c:choose>
													</c:otherwise>
												</c:choose>
										    </c:otherwise>
										 </c:choose>
									    <c:set var="filledTilldate" value="${filledTilldate + 1}" />
									</c:forEach>
							    </tr>
							</c:forEach>
		            	</tbody>
		            	
		            </table>
		        </div>
			</form>
		</div>
		<div style="display: flex; justify-content: center;">
			<div style="background-color: yellow" class="box"></div><p class="box-text">Mandatory Holiday</p>
			<!-- <div style="background-color: pink" class="box"></div><p class="box-text">Restricted</p> -->
		</div> 
		 <form style="padding-top: 20px;" id="timesheetForm" action="weeksubmit" method="post">
			 <c:choose>
			    <c:when test="${empty projectIds}">
			      <p style="font-size: 20px"><em>No project under this employee</em></p>
			      <table class="table table-bordered mt-5 lg-8" id="timesheetTable">
					      <!-- Table headers -->
					      <thead>
					        <tr>
					          <th>Activity Name</th>
					          	<c:set var="colorIndex" value="0"></c:set>
					            <c:forEach var="item" items="${weekNumbers }">
									<th style="background-color: ${calendarColor[colorIndex]}">Week <c:out value="${item }"></c:out></th>
									<c:set var="colorIndex" value="${colorIndex + 1}"></c:set>
								</c:forEach>
					          <th style="width: 155px;">Total Project Effort</th>
					        </tr>
					      </thead>
					    
					      <!-- Table body -->
					      <tbody>
					        	<!-- Rows for timesheet data - Projects -->
					        	<input type="hidden" class="form-control" name="projectIds" value="${projectIds}"/>
								<!-- Rows for timesheet data - Activities -->
							    <input type="hidden" class="form-control" name="miscActivityIds" value="${miscActivityIds}"/>
							    	<c:set var="previousWeek" value="${activeWeekNumber - 1}" />
							        <c:forEach var="index" begin="0" end="${fn:length(miscActivityIds)-1}">
								        <tr style="background-color: #CDD4ED;">
											<td><c:out value="${miscActivityNames[index ]}"></c:out></td>
											<c:forEach var="item" items="${weekNumbers }">												
												<c:choose>
													<c:when test="${previousWeek gt item}">
														<c:choose>
															<c:when test="${empty eachAndEveryWeek }">
																<td style="width:90px;">
																	<span>0</span>
																	<!-- <input type="text" class="form-control" name="weekEffort" onchange="checkWeekEffort(this)" disabled value="0"/> -->
																	<input type="hidden" class="form-control validateWeekEffort dynamicWeekEffort" name="weekEffort" onchange="checkWeekEffort(this)" />
																</td>
															</c:when>
															<c:otherwise>
																<td style="width:90px;">
																	<c:set var="hadValue" value="false"></c:set>
																	
																	<c:forEach var="checkHadValue" begin="0" end="${fn:length(eachAndEveryWeek)-1 }">
																		<c:if test="${(item eq eachAndEveryWeek[checkHadValue]) and (miscActivityIds[index] eq eachAndEveryProject[checkHadValue]) and (eachAndEveryStatus[checkHadValue] eq 'm')}">
																			<c:set var="hadValue" value="true"></c:set>
																			<c:set var="checkHadValueIndex" value="${checkHadValue }"></c:set>
																		</c:if>
																	</c:forEach>
																	<c:choose>
																		<c:when test="${hadValue }">
																			<span><strong>${eachAndEveryOnlyEffort[checkHadValueIndex] }</strong></strong></span>
																			<%-- <input type="text" class="form-control" name="weekEffort" onchange="checkWeekEffort(this)" disabled value="${eachAndEveryOnlyEffort[checkHadValueIndex] }"/> --%>
																			<input type="hidden" class="form-control validateWeekEffort dynamicWeekEffort" name="weekEffort" onchange="checkWeekEffort(this)" value="${eachAndEveryOnlyEffort[checkHadValueIndex] }"/>
																		</c:when>
																		<c:otherwise>
																			<span>0</span>
																			<!-- <input type="text" class="form-control" name="weekEffort" onchange="checkWeekEffort(this)" disabled value="0"/> -->
																			<input type="hidden" class="form-control validateWeekEffort dynamicWeekEffort" name="weekEffort" onchange="checkWeekEffort(this)"/>
																		</c:otherwise>
																	</c:choose>
																</td>
															</c:otherwise>
														</c:choose>
													</c:when>
													<c:otherwise>
														<c:choose>
															<c:when test="${item gt activeWeekNumber }">
																<c:choose>
																	<c:when test="${empty eachAndEveryWeek }">
																		<td style="width:90px;">
																			<span>--</span>
																			<input type="hidden" class="form-control validateWeekEffort dynamicWeekEffort" name="weekEffort" onchange="checkWeekEffort(this)" />
																		</td>
																	</c:when>
																	<c:otherwise>
																		<td style="width:90px;">
																			<c:set var="hadValue" value="false"></c:set>
																			<c:forEach var="checkHadValue" begin="0" end="${fn:length(eachAndEveryWeek)-1 }">
																				<c:if test="${(item eq eachAndEveryWeek[checkHadValue]) and (miscActivityIds[index] eq eachAndEveryProject[checkHadValue]) and (eachAndEveryStatus[checkHadValue] eq 'm')}">
																					<c:set var="hadValue" value="true"></c:set>
																					<c:set var="checkHadValueIndex" value="${checkHadValue }"></c:set>
																				</c:if>
																			</c:forEach>
																			<c:choose>
																				<c:when test="${hadValue }">
																					<span><strong>${eachAndEveryOnlyEffort[checkHadValueIndex] }</strong></span>
																					<input type="hidden" class="form-control validateWeekEffort dynamicWeekEffort" name="weekEffort" onchange="checkWeekEffort(this)" value="${eachAndEveryOnlyEffort[checkHadValueIndex] }"/>
																				</c:when>
																				<c:otherwise>
																					<span>--</span>
																					<input type="hidden" class="form-control validateWeekEffort dynamicWeekEffort" name="weekEffort" onchange="checkWeekEffort(this)" />
																				</c:otherwise>
																			</c:choose>
																		
																		</td>
																	</c:otherwise>
																</c:choose>
															</c:when>
															<c:otherwise>
																<c:choose>
																	<c:when test="${empty eachAndEveryWeek }">
																		<td style="width:90px;">
																			<input type="text" class="form-control validateWeekEffort dynamicWeekEffort" name="weekEffort" onchange="checkWeekEffort(this)" placeholder="HH:MM"/>
																		</td>
																	</c:when>
																	<c:otherwise>
																		<td style="width:90px;">
																		<c:set var="hadValue" value="false"></c:set>
																		<c:forEach var="checkHadValue" begin="0" end="${fn:length(eachAndEveryWeek)-1 }">
																			<c:if test="${(item eq eachAndEveryWeek[checkHadValue]) and (miscActivityIds[index] eq eachAndEveryProject[checkHadValue]) and (eachAndEveryStatus[checkHadValue] eq 'm')}">
																				<c:set var="hadValue" value="true"></c:set>
																				<c:set var="checkHadValueIndex" value="${checkHadValue }"></c:set>
																			</c:if>
																		</c:forEach>
																		<c:choose>
																			<c:when test="${hadValue }">
																				<strong><input type="text" class="form-control validateWeekEffort dynamicWeekEffort" name="weekEffort" onchange="checkWeekEffort(this)" value="${eachAndEveryOnlyEffort[checkHadValueIndex] }" placeholder="HH:MM"/></strong>
																			</c:when>
																			<c:otherwise>
																				<input type="text" class="form-control validateWeekEffort dynamicWeekEffort" name="weekEffort" onchange="checkWeekEffort(this)" placeholder="HH:MM"/>
																			</c:otherwise>
																		</c:choose>
																		</td>
																	</c:otherwise>
																</c:choose>
															</c:otherwise>
														</c:choose>
													</c:otherwise> 
												</c:choose>
											</c:forEach>
											<c:choose>
												<c:when test="${empty activityIdKeys}">
													<td class="dynamicTotalProjectEffort">0</td>
												</c:when>
												<c:otherwise>
														<c:set var="isActivityIdMatch" value="false" />
														<c:set var="j" value="0" />
														<c:forEach var="i" begin="0" end="${fn:length(activityIdKeys)-1}">
															<c:if test="${activityIdKeys[i] eq  miscActivityIds[index]}">
																<c:set var="isActivityIdMatch" value="true" />
																<c:set var="j" value="${i }" />
															</c:if>
														</c:forEach>
														<c:choose>
															<c:when test="${isActivityIdMatch }">
																<td class="dynamicTotalProjectEffort"><strong>${activityEffortValues[j] }</strong></td>
															</c:when>
															<c:otherwise>
																<td class="dynamicTotalProjectEffort">0</td>
															</c:otherwise>
														</c:choose>
												</c:otherwise>
											</c:choose>   
										</tr>
									</c:forEach>
					        
							<input type="hidden" class="form-control" name="yearSelectDB" value="${yearSelectDB}"/>
							<input type="hidden" class="form-control" name="selectedDate" value="${selectedDate}"/>
							<input type="hidden" class="form-control" name="todaysDate" value="${todaysDate }"/>
							<input type="hidden" class="form-control" name="employeeIdDB" value="${empId }"/>
							<input type="hidden" class="form-control" name="employeeNameDB" value="${userName }"/>
							<input type="hidden" class="form-control" name="groupIdDB" value="${groupId }"/>
							<input type="hidden" class="form-control" name="weekNumbers" value="${weekNumbers }"/>
							
					      </tbody>
				      
				      <!-- Table footer -->
					      <tfoot>
					        <tr>
					          <td>Total Week Effort</td>
					          <c:forEach var="item" items="${weekNumbers}">
						            <c:choose>
										<c:when test="${empty weekKeys}">
											<td class="dynamicTotalWeekEffort">0</td>
										</c:when>
										<c:otherwise>
												<c:set var="isWeekMatch" value="false" />
												<c:set var="j" value="0" />
												<c:forEach var="i" begin="0" end="${fn:length(weekKeys)-1}">
													<c:if test="${weekKeys[i] eq  item}">
														<c:set var="isWeekMatch" value="true" />
														<c:set var="j" value="${i }" />
													</c:if>
												</c:forEach>
												<c:choose>
													<c:when test="${isWeekMatch }">
														<td class="dynamicTotalWeekEffort"><strong>${weekEffortValues[j] }</strong></td>
													</c:when>
													<c:otherwise>
														<td class="dynamicTotalWeekEffort">0</td>
													</c:otherwise>
												</c:choose>
										</c:otherwise>
									</c:choose>
						       </c:forEach> 
					        </tr>
					      </tfoot>
					    </table>   
				    	<div style="justify-content: center; display: flex;">
				    		<button class="btn btn-primary btn-success btn-lg validationWeekNumberSubmitted" name="weekNumberSubmitted" style="font-size: larger;">Submit</button>
				    	</div>
					    <div style="display: flex; justify-content: left; margin-top: 5px;" >
				  			<div style="background-color: #CDD4ED" class="box"></div><p class="box-text">Miscellaneous Activity</p>
				  		</div>
				</c:when>
				<c:otherwise>
					    <table class="table table-bordered mt-5 lg-8" id="timesheetTable">
					      <!-- Table headers -->
					      <thead>
					        <tr>
					          <th>Project/Activity Name</th>
					          	<c:set var="colorIndex" value="0"></c:set>
					            <c:forEach var="item" items="${weekNumbers }">
									<th style="background-color: ${calendarColor[colorIndex]}">Week <c:out value="${item }"></c:out></th>
									<c:set var="colorIndex" value="${colorIndex + 1}"></c:set>
								</c:forEach>
					          <th style="width: 155px;">Total Project Effort</th>
					        </tr>
					      </thead>
					    
					      <!-- Table body -->
					      <tbody>
					        <!-- Rows for timesheet data - Projects -->
					        		<input type="hidden" class="form-control" name="projectIds" value="${projectIds}"/>
					        		<c:set var="previousWeek" value="${activeWeekNumber - 1}" />
							        <c:forEach var="index" begin="0" end="${fn:length(projectIds)-1}">
								        <tr style="background-color: #D8D7DA;">
											<td><c:out value="${projectNames[index ]}"></c:out></td>
											<c:forEach var="item" items="${weekNumbers }">
												<!-- <td><input type="text" class="form-control" name="weekEffort" onchange="checkWeekEffort(this)" /></td> -->
												<c:choose>
													<c:when test="${previousWeek gt item}">
														<c:choose>
															<c:when test="${empty eachAndEveryWeek}">
																<td style="width:90px;">
																	<span>0</span>
																	<!-- <input type="text" class="form-control" name="weekEffort" onchange="checkWeekEffort(this)" disabled value="0"/> -->
																	<input type="hidden" class="form-control validateWeekEffort dynamicWeekEffort" name="weekEffort" onchange="checkWeekEffort(this)"/>								
																</td>
															</c:when>
															<c:otherwise>
																<td style="width:90px;">
																	<c:set var="hadValue" value="false"></c:set>
																	<c:forEach var="checkHadValue" begin="0" end="${fn:length(eachAndEveryWeek)-1 }">
																		<c:if test="${(item eq eachAndEveryWeek[checkHadValue]) and (projectIds[index] eq eachAndEveryProject[checkHadValue]) and (eachAndEveryStatus[checkHadValue] eq 'p')}">
																			<c:set var="hadValue" value="true"></c:set>
																			<c:set var="checkHadValueIndex" value="${checkHadValue }"></c:set>
																		</c:if>
																	</c:forEach>
																		<c:choose>
																			<c:when test="${hadValue }">
																				<span><strong>${eachAndEveryOnlyEffort[checkHadValueIndex]}</strong></span>
																				<%-- <input type="text" class="form-control" name="weekEffort" onchange="checkWeekEffort(this)" disabled value="${eachAndEveryOnlyEffort[checkHadValueIndex]}"/> --%>
																				<input type="hidden" class="form-control validateWeekEffort dynamicWeekEffort" name="weekEffort" onchange="checkWeekEffort(this)" value="${eachAndEveryOnlyEffort[checkHadValueIndex]}"/>
																			</c:when>
																			<c:otherwise>
																				<span>0</span>
																				<!-- <input type="text" class="form-control" name="weekEffort" onchange="checkWeekEffort(this)" disabled value="0"/> -->
																				<input type="hidden" class="form-control validateWeekEffort dynamicWeekEffort" name="weekEffort" onchange="checkWeekEffort(this)"/>
																			</c:otherwise>
																		</c:choose>
																</td>
															</c:otherwise>
														</c:choose>
														
													</c:when>
													<c:otherwise>
														<c:choose>
															<c:when test="${item gt activeWeekNumber }">
																<c:choose>
																	<c:when test="${empty eachAndEveryWeek}">
																		<td style="width:90px;">
																			<span>--</span>
																			<input type="hidden" class="form-control validateWeekEffort dynamicWeekEffort" name="weekEffort" onchange="checkWeekEffort(this)" />
																		</td>
																	</c:when>
																	<c:otherwise>
																		<td style="width:90px;">
																			<c:set var="hadValue" value="false"></c:set>
																			<c:forEach var="checkHadValue" begin="0" end="${fn:length(eachAndEveryWeek)-1 }">
																				<c:if test="${(item eq eachAndEveryWeek[checkHadValue]) and (projectIds[index] eq eachAndEveryProject[checkHadValue]) and (eachAndEveryStatus[checkHadValue] eq 'p')}">
																					<c:set var="hadValue" value="true"></c:set>
																					<c:set var="checkHadValueIndex" value="${checkHadValue }"></c:set>
																				</c:if>
																			</c:forEach>
																			<c:choose>
																				<c:when test="${hadValue }">
																					<span><strong>${eachAndEveryOnlyEffort[checkHadValueIndex]}</strong></span>
																					<input type="hidden" class="form-control validateWeekEffort dynamicWeekEffort" name="weekEffort" onchange="checkWeekEffort(this)" value="${eachAndEveryOnlyEffort[checkHadValueIndex]}"/>
																				</c:when>
																				<c:otherwise>
																					<span>--</span>
																					<input type="hidden" class="form-control validateWeekEffort dynamicWeekEffort" name="weekEffort" onchange="checkWeekEffort(this)" />
																				</c:otherwise>
																			</c:choose>
																		</td>
																	</c:otherwise>
																</c:choose>
															</c:when>
															<c:otherwise>
																<c:choose>
																	<c:when test="${empty eachAndEveryWeek}">
																		<td style="width:90px;">
																			<input type="text" class="form-control validateWeekEffort dynamicWeekEffort" name="weekEffort" onchange="checkWeekEffort(this)" placeholder="HH:MM"/>
																		</td>
																	</c:when>
																	<c:otherwise>
																		<td style="width:90px;">
																			<c:set var="hadValue" value="false"></c:set>
																			<c:forEach var="checkHadValue" begin="0" end="${fn:length(eachAndEveryWeek)-1 }">
																				<c:if test="${(item eq eachAndEveryWeek[checkHadValue]) and (projectIds[index] eq eachAndEveryProject[checkHadValue]) and (eachAndEveryStatus[checkHadValue] eq 'p')}">
																					<c:set var="hadValue" value="true"></c:set>
																					<c:set var="checkHadValueIndex" value="${checkHadValue }"></c:set>
																				</c:if>
																			</c:forEach>
																			<c:choose>
																				<c:when test="${hadValue }">
																					<strong><input type="text" class="form-control validateWeekEffort dynamicWeekEffort" name="weekEffort" onchange="checkWeekEffort(this)" value="${eachAndEveryOnlyEffort[checkHadValueIndex]}"/></strong>
																				</c:when>
																				<c:otherwise>
																					<input type="text" class="form-control validateWeekEffort dynamicWeekEffort" name="weekEffort" onchange="checkWeekEffort(this)" placeholder="HH:MM"/>
																				</c:otherwise>
																			</c:choose>
																		</td>
																	</c:otherwise>
																</c:choose>
															</c:otherwise>
														</c:choose>
													</c:otherwise>
												</c:choose>
											</c:forEach>
											
											<c:choose>
												<c:when test="${empty projectIdKeys}">
													<td class="dynamicTotalProjectEffort">0</td>
												</c:when>
												<c:otherwise>
													
														<c:set var="isProjectIdMatch" value="false" />
														<c:set var="j" value="0" />
														<c:forEach var="i" begin="0" end="${fn:length(projectIdKeys)-1}">
															<c:if test="${projectIdKeys[i] eq  projectIds[index]}">
																<c:set var="isProjectIdMatch" value="true" />
																<c:set var="j" value="${i }" />
															</c:if>
														</c:forEach>
														<c:choose>
															<c:when test="${isProjectIdMatch }">
																<td class="dynamicTotalProjectEffort"><strong>${projectEffortValues[j] }</strong></td>
															</c:when>
															<c:otherwise>
																<td class="dynamicTotalProjectEffort">0</td>
															</c:otherwise>
														</c:choose>
												</c:otherwise>
											</c:choose>   
										</tr>
									</c:forEach>
									
								<!-- Rows for timesheet data - Activities -->
							    <input type="hidden" class="form-control" name="miscActivityIds" value="${miscActivityIds}"/>
							        <c:forEach var="index" begin="0" end="${fn:length(miscActivityIds)-1}">
								        <tr style="background-color: #CDD4ED;">
											<td><c:out value="${miscActivityNames[index ]}"></c:out></td>
											<c:forEach var="item" items="${weekNumbers }">
												<!-- <td><input type="text" class="form-control" name="weekEffort" onchange="checkWeekEffort(this)" /></td> -->
												<c:choose>
													<c:when test="${previousWeek gt item}">
														<c:choose>
															<c:when test="${empty eachAndEveryWeek}">
																<td style="width:90px;">
																	<span>0</span>
																	<!-- <input type="text" class="form-control" name="weekEffort" onchange="checkWeekEffort(this)" disabled value="0"/> -->
																	<input type="hidden" class="form-control validateWeekEffort dynamicWeekEffort" name="weekEffort" onchange="checkWeekEffort(this)"/>
																</td>
															</c:when>
															<c:otherwise>
																<td style="width:90px;">
																	<c:set var="hadValue" value="false"></c:set>
																	<c:forEach var="checkHadValue" begin="0" end="${fn:length(eachAndEveryWeek)-1 }">
																		<c:if test="${(item eq eachAndEveryWeek[checkHadValue]) and (miscActivityIds[index] eq eachAndEveryProject[checkHadValue]) and (eachAndEveryStatus[checkHadValue] eq 'm')}">
																			<c:set var="hadValue" value="true"></c:set>
																			<c:set var="checkHadValueIndex" value="${checkHadValue }"></c:set>
																		</c:if>
																	</c:forEach>
																	<c:choose>
																		<c:when test="${hadValue }">
																			<span><strong>${eachAndEveryOnlyEffort[checkHadValueIndex]}</strong></span>
																			<%-- <input type="text" class="form-control" name="weekEffort" onchange="checkWeekEffort(this)" disabled value="${eachAndEveryOnlyEffort[checkHadValueIndex]}"/> --%>
																			<input type="hidden" class="form-control validateWeekEffort dynamicWeekEffort" name="weekEffort" onchange="checkWeekEffort(this)" value="${eachAndEveryOnlyEffort[checkHadValueIndex]}"/>
																		</c:when>
																		<c:otherwise>
																			<span>0</span>
																			<!-- <input type="text" class="form-control" name="weekEffort" onchange="checkWeekEffort(this)" disabled value="0"/> -->
																			<input type="hidden" class="form-control validateWeekEffort dynamicWeekEffort" name="weekEffort" onchange="checkWeekEffort(this)"/>
																		</c:otherwise>
																	</c:choose>	
																</td>
															</c:otherwise>
														</c:choose>
													</c:when>
													<c:otherwise>
														<c:choose>
															<c:when test="${item gt activeWeekNumber }">
																<c:choose>
																	<c:when test="${empty eachAndEveryWeek}">
																		<td style="width:90px;">
																			<span>--</span>
																			<input type="hidden" class="form-control validateWeekEffort dynamicWeekEffort" name="weekEffort" onchange="checkWeekEffort(this)" />
																		</td>
																	</c:when>
																	<c:otherwise>
																		<td style="width:90px;">
																			<c:set var="hadValue" value="false"></c:set>
																			<c:forEach var="checkHadValue" begin="0" end="${fn:length(eachAndEveryWeek)-1 }">
																				<c:if test="${(item eq eachAndEveryWeek[checkHadValue]) and (miscActivityIds[index] eq eachAndEveryProject[checkHadValue]) and (eachAndEveryStatus[checkHadValue] eq 'm')}">
																					<c:set var="hadValue" value="true"></c:set>
																					<c:set var="checkHadValueIndex" value="${checkHadValue }"></c:set>
																				</c:if>
																			</c:forEach>
																			<c:choose>
																				<c:when test="${hadValue }">
																					<span><strong>${eachAndEveryOnlyEffort[checkHadValueIndex]}</strong></span>
																					<input type="hidden" class="form-control validateWeekEffort dynamicWeekEffort" name="weekEffort" onchange="checkWeekEffort(this)" value="${eachAndEveryOnlyEffort[checkHadValueIndex]}"/>
																				</c:when>
																				<c:otherwise>
																					<span>--</span>
																					<input type="hidden" class="form-control validateWeekEffort dynamicWeekEffort" name="weekEffort" onchange="checkWeekEffort(this)" />
																				</c:otherwise>
																			</c:choose>
																		</td>
																	</c:otherwise>
																</c:choose>
															</c:when>
															<c:otherwise>
																<c:choose>
																	<c:when test="${empty eachAndEveryWeek}">
																		<td style="width:90px;">
																			<input type="text" class="form-control validateWeekEffort dynamicWeekEffort" name="weekEffort" onchange="checkWeekEffort(this)" placeholder="HH:MM"/>
																		</td>
																	</c:when>
																	<c:otherwise>
																		<td style="width:90px;">
																			<c:set var="hadValue" value="false"></c:set>
																			<c:forEach var="checkHadValue" begin="0" end="${fn:length(eachAndEveryWeek)-1 }">
																				<c:if test="${(item eq eachAndEveryWeek[checkHadValue]) and (miscActivityIds[index] eq eachAndEveryProject[checkHadValue]) and (eachAndEveryStatus[checkHadValue] eq 'm')}">
																					<c:set var="hadValue" value="true"></c:set>
																					<c:set var="checkHadValueIndex" value="${checkHadValue }"></c:set>
																				</c:if>
																			</c:forEach>
																			<c:choose>
																				<c:when test="${hadValue }">
																					<strong><input type="text" class="form-control validateWeekEffort dynamicWeekEffort" name="weekEffort" onchange="checkWeekEffort(this)" value="${eachAndEveryOnlyEffort[checkHadValueIndex]}"/></strong>
																				</c:when>
																				<c:otherwise>
																					<input type="text" class="form-control validateWeekEffort dynamicWeekEffort" name="weekEffort" onchange="checkWeekEffort(this)" placeholder="HH:MM"/>
																				</c:otherwise>
																			</c:choose>
																		</td>
																	</c:otherwise>
																</c:choose>
															</c:otherwise>
														</c:choose>
													</c:otherwise>
												</c:choose>
											</c:forEach>
											
											<c:choose>
												<c:when test="${empty activityIdKeys}">
													<td class="dynamicTotalProjectEffort">0</td>
												</c:when>
												<c:otherwise>
													
														<c:set var="isActivityIdMatch" value="false" />
														<c:set var="j" value="0" />
														<c:forEach var="i" begin="0" end="${fn:length(activityIdKeys)-1}">
															<c:if test="${activityIdKeys[i] eq  miscActivityIds[index]}">
																<c:set var="isActivityIdMatch" value="true" />
																<c:set var="j" value="${i }" />
															</c:if>
														</c:forEach>
														<c:choose>
															<c:when test="${isActivityIdMatch }">
																<td class="dynamicTotalProjectEffort"><strong>${activityEffortValues[j] }</strong></td>
															</c:when>
															<c:otherwise>
																<td class="dynamicTotalProjectEffort">0</td>
															</c:otherwise>
														</c:choose>
												</c:otherwise>
											</c:choose>									        
										</tr>
									</c:forEach>
					        
							<input type="hidden" class="form-control" name="yearSelectDB" value="${yearSelectDB}"/>
							<input type="hidden" class="form-control" name="selectedDate" value="${selectedDate}"/>
							<input type="hidden" class="form-control" name="todaysDate" value="${todaysDate }"/>
							<input type="hidden" class="form-control" name="employeeIdDB" value="${empId }"/>
							<input type="hidden" class="form-control" name="employeeNameDB" value="${userName }"/>
							<input type="hidden" class="form-control" name="groupIdDB" value="${groupId }"/>
							<input type="hidden" class="form-control" name="weekNumbers" value="${weekNumbers }"/>
							
					      </tbody>
				      
				      <!-- Table footer -->
					      <tfoot>
					        <tr>
					          <td>Total Week Effort</td>
					          <c:forEach var="item" items="${weekNumbers}">
						            <c:choose>
										<c:when test="${empty weekKeys}">
											<td class="dynamicTotalWeekEffort">0</td>
										</c:when>
										<c:otherwise>
											
												<c:set var="isWeekMatch" value="false" />
												<c:set var="j" value="0" />
												<c:forEach var="i" begin="0" end="${fn:length(weekKeys)-1}">
													<c:if test="${weekKeys[i] eq  item}">
														<c:set var="isWeekMatch" value="true" />
														<c:set var="j" value="${i }" />
													</c:if>
												</c:forEach>
												<c:choose>
													<c:when test="${isWeekMatch }">
														<td class="dynamicTotalWeekEffort"><strong>${weekEffortValues[j] }</strong></td>
													</c:when>
													<c:otherwise>
														<td class="dynamicTotalWeekEffort">0</td>
													</c:otherwise>
												</c:choose>
										</c:otherwise>
									</c:choose>
						       </c:forEach> 
					          <!-- <td style="justify-content: center; display: flex;"><button class="btn btn-primary validationWeekNumberSubmitted" name="weekNumberSubmitted" >Submit</button></td> -->
					        </tr>
					      </tfoot>
					    </table>
					    <div style="justify-content: center; display: flex;">
					    	<button class="btn btn-success btn-lg validationWeekNumberSubmitted" name="weekNumberSubmitted" style="font-size: larger;">Submit</button>
					    </div>
					    <div style="display: flex; justify-content: left; margin-top: 5px">
						    <div style="background-color: #D8D7DA" class="box"></div><p class="box-text">Project</p>
					  		<div style="background-color: #CDD4ED" class="box"></div><p class="box-text">Miscellaneous Activity</p>
				  		</div>
			   	</c:otherwise>
			  </c:choose>
		  </form>
			</div>
		  </div>
		  
		  <!-- Validation of hours > 168 in a week -->
		  <input type="hidden" id = "validateWeekNumber" name="weekNumbers" value="${weekNumbers }"/>
</section>
  <!-- jQuery and Bootstrap JS -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.maskedinput/1.4.1/jquery.maskedinput.min.js"></script>
  <script src="<c:url value="/resources/app_srv/PMS/timesheet/js/script.js"></c:url>"></script>
</body>
</html>