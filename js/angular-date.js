(function(window, angular, undefined) {'use strict';

angular.module('ng-date', [])
    .factory('datePicker', datePickerProvider)
    .directive('dbankDate', ['datePicker', datePick]);

function datePickerProvider($rootScope, $compile, $q) {
    var body, el;
    var $scope = $rootScope.$new();//避免全区污染
    return {
        open: function(date){
            var defer = $q.defer();
            $scope.defer = defer;
            body = angular.element(document.body);
            el = $compile('<dbank-date def="defer" date="'+date+'"></dbank-date>')($scope);
            body.append(el);            
            return defer.promise;
        }
    }
}

function datePick(datePicker){
    return {
        restrict: 'E',
        replace:true,
        template:
        '<div>\
            <div id="laydate_box" class="laydate_box" style="position: absolute; left: 0px; top: 105px; display: block;">\
                <div class="laydate_top">\
                    <div class="laydate_ym laydate_y" id="laydate_YY">\
                        <a ng-click="goLastYear()"><cite class="prev_year_btn"></cite></a>\
                        <input id="laydate_y" readonly="" value="{{config.year}}" ng-click="toggleYears()">\
                        <label class="show_years_btn" ng-click="toggleYears()"></label>\
                        <a ng-click="goNextYear()"><cite class="next_year_btn"></cite></a>\
                        <div class="laydate_yms" ng-class="{laydate_hidden:isHiddenYears}">\
                            <a ng-click="checkYearUp()"><cite class="year_up"></cite></a>\
                            <ul id="laydate_ys">\
                                <li ng-repeat="year in years" ng-class="{laydate_year_picked:year==config.year}" ng-click="selectYear(year)">{{year}}</li>\
                            </ul>\
                            <a ng-click="checkYearDown()"><cite class="year_down"></cite></a>\
                        </div>\
                    </div>\
                    <div class="laydate_ym laydate_m" id="laydate_MM">\
                        <a ng-click="goLastMonth()"><cite class="prev_month_btn"></cite></a>\
                        <input id="laydate_m" readonly="" value="{{config.month}}月" ng-click="toggleMonths()">\
                        <label class="show_months_btn" ng-click="toggleMonths()"></label>\
                        <a ng-click="goNextMonth()"><cite class="next_month_btn"></cite></a>\
                        <div id="laydate_ms" ng-class="{laydate_hidden: isHiddenMonths,laydate_yms: true}">\
                            <span ng-repeat="item in months" ng-class="{laydate_month_picked: item==config.month}" ng-click="selectMonth(item)">{{item}}月</span>\
                        </div>\
                    </div>\
                </div>\
                <table class="laydate_table" id="laydate_table">\
                        <thead>\
                            <tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr>\
                        </thead>\
                        <tbody>\
                            <tr ng-repeat="week in days">\
                                <td ng-repeat="day in week"\
                                    ng-class="{\
                                        laydate_day_picked: day * 1 == getPickedDay() * 1,\
                                        laydate_day_this_month:day.getMonth()+1 == config.month,\
                                        laydate_day_today:today*1 - day*1 < 24*60*60*1000 &&  today*1 - day*1 >= 0\
                                    }" ng-click="pickDay(day)">{{day.getDate()}}</td>\</tr>\
                        </tbody>\
                </table>\
                <div class="laydate_bottom">\
                    <div class="laydate_btn">\
                        <a ng-click="clear()">清空</a>\
                        <a ng-click="selectToday()">今天</a>\
                    </div>\
                </div>\
        </div>',
        scope:{
            def:'='
        },
        link: function(scope, el, attr) {
            var date = attr.date.split('-');
            var today =scope.today =  new Date();
            if(date == '') {
                scope.config = {
                    year: today.getFullYear(),
                    month:today.getMonth() + 1,
                    day: today.getDate()
                }
            } else {
                scope.config ={
                    year: date[0],
                    month: date[1],
                    day: date[2]
                };
            }
            
            // var pickedDay = angular.extend({}, scope.config);
            scope.isHiddenMonths = true;
            scope.isHiddenYears = true;
            scope.months = [1,2,3,4,5,6,7,8,9,10,11,12];
            scope.years=getYears();
            scope.days= getDays(scope.config.year, scope.config.month);
            scope.getPickedDay = function(){
                return new Date(scope.config.year, scope.config.month - 1, scope.config.day);
            };
            scope.$watch('config', function(){
                scope.days= getDays(scope.config.year, scope.config.month);
            }, true);
            el.css({
                position:'absolute',
                top:0,
                bottom:0,
                left:0,
                right:0,
                zIndex: 5,
                backgroundColor: 'rgba(204,204,204,.7)'
            });
            el.on('click', function(e){
                if(e.target == el[0]) {
                    el.remove();
                }
            })

            scope.goLastYear = function(){
                scope.config.year --;
            };
            scope.goNextYear = function(){
                 scope.config.year ++;
            };
            scope.goLastMonth = function(){
                 scope.config.month --;
                 if(scope.config.month == 0) {
                    scope.config.month = 12
                 }
            };
            scope.goNextMonth = function(){
                scope.config.month ++;
                 if(scope.config.month == 13) {
                    scope.config.month = 1
                 }
            };
            scope.checkYearUp = function(){
                scope.years =getYears({type:'UP',year: scope.years[9]})
            };
            scope.checkYearDown = function(){
                scope.years =getYears({type:'DOWN',year: scope.years[9]})
            };

            scope.toggleYears = function(){
                scope.isHiddenYears = !scope.isHiddenYears;
                scope.isHiddenMonths = true;
            };
            
            scope.toggleMonths = function() {
               scope.isHiddenMonths = !scope.isHiddenMonths;
               scope.isHiddenYears = true;
            };

            scope.selectYear = function(year) {
                scope.config.year = year;
                scope.toggleYears ();
            };

            scope.selectMonth = function(month) {
                scope.config.month = month;
                scope.toggleMonths ()
            };

            scope.clear = function(){
                el.remove();
                scope.def.resolve('');
            };
            
            scope.selectToday = function(){
                el.remove();
                scope.def.resolve(today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate())
            };

            scope.pickDay = function(day){
                el.remove();
                scope.def.resolve(day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate());
            };


            function getDays(year, month){
                var weeks=[];
                var monthFirstDay = new Date(year, month-1, 1);
                var weekDay = monthFirstDay.getDay(); 
                var weekFirstDay = new Date(year, month-1, 1 - weekDay);
                for(var i = 0,k=0; i < 6; i++){
                    weeks[i] = []
                    for(var j = 0; j < 7; j++) {                        
                        weeks[i].push(new Date(year, month-1, 1 - weekDay + k++))
                    }                    
                }
                return weeks;
            }

            function getYears(action) {
                var nowYear;
                if(action == undefined) {
                    nowYear = scope.config.year*1
                } else {
                    switch (action.type) {
                        case 'DOWN':
                            nowYear = action.year + 7;
                            break;
                        case 'UP':
                            nowYear = action.year - 7;
                            break;
                        default: 
                            throw new Error('unknow action')
                    }
                }
                var years=[];
                for(var i = -8; i < 8; i++) {
                    years.push(nowYear + i);
                }
                return years;
            }
        }
    }
}

})(window, window.angular)