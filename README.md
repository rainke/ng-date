# ng-date
基于angular的移动端日期选择插件

##说明
```javascript
    <script src="../js/angular.js"></script>
    <script src="../js/angular-date.js"></script>
```
通过`angular.module('app', ['ng-date'])`引入插件。
html
```html
<input type="text" ng-model="config" ng-click="open()" readonly>
```
javascript

```javascript
$scope.config = '2016-6-21';
$scope.open = function() {
    // console.log(this)
    var p = datePicker.open($scope.config);
    p.then(function(s) {
        $scope.config = s
    })
};
```