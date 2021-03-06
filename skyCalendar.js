app
		.directive(
				'skycalendar',
				function() {
					return {
						restrict : 'AE',

						template : '    	<!DOCTYPE html>\n'
								+ '  <link rel="stylesheet" href="skyCalendar.css">\n'
								+

								'<section class="" >\n'
								+ '	<table class="skyCalMultiple3">\n'
								+ '		<tr>\n'
								+ '			<td ng-repeat="month in selectedMonths">\n'
								+ '				<table class="skyCal">\n'
								+ '					<caption>\n'
								+ '						<span ng-hide="true" class="prev"><a>&larr;</a></span> <span\n'
								+ '							ng-hide="true" class="next"><a>&rarr;</a></span>\n'
								+ '						{{months[month.month-1]}} {{month.year}}\n'
								+ '					</caption>\n'
								+ '					<thead>\n'
								+ '						<tr>\n'
								+ '							<th ng-repeat="day in weekDays">{{day}}</th>\n'
								+ '							</tr>\n'
								+ ' 						</thead>\n'
								+ '  						<tbody>\n'
								+

								'						<tr ng-repeat="wk in month.weeks track by $index">\n'
								+

								'							<td ng-repeat="day in wk.days track by $index"\n'
								+ '								ng-class="!day.off && day.selected && '
								+ "'active'"
								+ '||day.off && '
								+ "'off'"
								+ '"><a\n'
								+ '								ng-click="selectDay(day,selecttype||' + "'single'" + ')"> {{day.day}} </a></td>\n'
								+

								'						</tr>\n' + '					</tbody>\n'
								+ '				</table>\n' + '			</td>\n' + '		</tr>\n'
								+ '	</table>\n' + '	</table>\n' +

								'</section>',
						scope : {
							control : '=',
							startmonth : '@',
							startyear : '@',
							nummonths : '@',
							selection : '@',
							selecttype : '@',
							output : '='
						},
						link : function($scope) {

							$scope.ctrl = $scope.control;
							$scope.active = 'active';
							$scope.off = 'off';
							$scope.weekDays = [ 'Sun', 'Mon', 'Tue', 'Wed',
									'Thu', 'Fri', 'Sat' ];
							$scope.months = [ 'January', 'February', 'March',
									'April', 'May', 'June', 'July', 'August',
									'September', 'October', 'November',
									'December' ];
							$scope.selectDay = function(day,selecttype) {
								
								if (day.off == "off")
									return;
								if ($scope.selection
										&& $scope.selection == "single") {
									$scope.output.pop();
									$scope.output.push(day);

									for (i in $scope.selectedMonths) {
										for (j in $scope.selectedMonths[i].weeks) {
											for (k in $scope.selectedMonths[i].weeks[j].days) {
												$scope.selectedMonths[i].weeks[j].days[k].selected = false;
											}
										}
									}

									day.selected = !day.selected;
									return;
								}
								day.selected = !day.selected;
								if (day.selected) {
									$scope.output.push(day);
								}
								if (!day.selected) {
									for (i in $scope.output) {
										if ($scope.output[i].day == day.day
												&& $scope.output[i].year == day.year
												&& $scope.output[i].month == day.month) {
											$scope.output.splice(i, 1);
										}
									}
								}
							};
							$scope.newCalendar = function(month, year, noMonths) {

								$scope.selectedMonths = [];
								for (i = 0; i < noMonths; i++) {
									var m, y;
									if (month * 1 + i * 1 > 12) {
										m = (month * 1 + i * 1) % 12 == 0 ? 12
												: (month * 1 + i * 1) % 12;
										y = (month * 1 + i * 1) % 12 == 0 ? (year * 1 + Math
												.floor((month * 1 + i * 1) / 12) * 1) - 1
												: (year * 1 + Math
														.floor((month * 1 + i * 1) / 12) * 1);
									}

									else {
										m = month * 1 + i * 1;
										y = year;
									}
									$scope.selectedMonths.push({
										month : m,
										year : y,
										weeks : []
									});
								}
							};
							$scope.newCalendar($scope.startmonth || 12,
									$scope.startyear || 2015,
									$scope.nummonths || 3);
							$scope.ctrl.nextMonth = function() {
								for (i in $scope.selectedMonths) {
									if ($scope.selectedMonths[i].month != 12) {
										$scope.selectedMonths[i].month++;
									} else {
										$scope.selectedMonths[i].month = 1;
										$scope.selectedMonths[i].year++;
									}

								}
								$scope.refreshCalendar();
							};
							$scope.ctrl.previousMonth = function() {
								for (i in $scope.selectedMonths) {
									if ($scope.selectedMonths[i].month != 1) {
										$scope.selectedMonths[i].month--;
									} else {
										$scope.selectedMonths[i].month = 12;
										$scope.selectedMonths[i].year--;
									}

								}
								$scope.refreshCalendar();
							};
							$scope.refreshCalendar = function() {
								for (i in $scope.selectedMonths) {
									var d = new Date(
											$scope.selectedMonths[i].year,
											$scope.selectedMonths[i].month - 1,
											1).getDay();
									var noDays = new Date(
											$scope.selectedMonths[i].year,
											$scope.selectedMonths[i].month, 0)
											.getDate();
									var lastMonthDays = new Date(
											$scope.selectedMonths[i].year,
											$scope.selectedMonths[i].month - 1,
											0).getDate();
									var weeks = [];
									var w = [];

									for (j = 0; j < d; j++) {

										w
												.unshift({
													day : lastMonthDays - j,
													month : $scope.selectedMonths[i].month,
													year : $scope.selectedMonths[i].year,
													off : 'off',
													selected : false
												}

												);
									}
									for (j = 1; j <= noDays; j++) {
										w
												.push({
													day : j,
													month : $scope.selectedMonths[i].month,
													year : $scope.selectedMonths[i].year,
													off : '',
													selected : false
												});
										if (j == noDays) {
											var m = 7 - w.length;
											for (k = 1; k <= m; k++) {
												w
														.push({
															day : k,
															off : 'off',
															month : $scope.selectedMonths[i].month,
															year : $scope.selectedMonths[i].year,
															selected : false
														});
											}
										}
										if (w.length % 7 == 0) {

											weeks.push({
												days : w
											});
											w = [];
										}
									}
									if (weeks.length == 4) {
										for (k = 1; k <= 7; k++) {
											w
													.push({
														day : k,
														off : 'off',
														month : $scope.selectedMonths[i].month,
														year : $scope.selectedMonths[i].year,
														selected : false
													});
										}
										weeks.push({
											days : w
										});

									}

									if (weeks.length == 6) {

										for (x in weeks[5].days) {
											if (weeks[5].days[x].off == '') {

												weeks[0].days[x] = angular
														.copy(weeks[5].days[x]);
											}

										}
										weeks.splice(5, 1);
									}

									for (a in $scope.output) {
										for (b in weeks) {
											for (c in weeks[b].days) {
												if ($scope.output[a].selected
														&& weeks[b].days[c].day == $scope.output[a].day
														&& weeks[b].days[c].month == $scope.output[a].month
														&& weeks[b].days[c].year == $scope.output[a].year)
													weeks[b].days[c].selected = true;
											}
										}
									}
									$scope.selectedMonths[i].weeks = angular
											.copy(weeks);

								}

							};
							$scope.refreshCalendar();
						}
					};
				});
