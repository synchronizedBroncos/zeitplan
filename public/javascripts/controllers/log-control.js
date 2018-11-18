var cs480App = angular.module('cs480App');
cs480App.controller('LogCtrl',
 ['$scope', 'RestService', function ($scope, RestService) {
   $scope.user_id = "5bac44330012b8166ef76f04";
   console.log("load log");
   // initialize ng class for sidebar as active
   $scope.getLogs = function ( ) {
     RestService.getLogs($scope.user_id)
         .then(function successCallback(response){
             $scope.logs = response.data.logs;
         }, function errorCallback(response){
            console.log("Error in getting Logs");
         });
   };

   // $scope.buttonFilled = function() {
   //   let clicked = true;
   //
   // }
   $scope.getLogs();
}]);
