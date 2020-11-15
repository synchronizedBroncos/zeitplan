var cs480App = angular.module('cs480App');
cs480App.controller('LogCtrl',
 ['$scope', 'RestService', function ($scope, RestService) {
   $scope.checkUserId = function checkUserId() {
     $scope.$watch('$parent.user_id', function(newVal, oldVal){
       $scope.user_id = newVal;
       if($scope.user_id !== "unresolved") {
         $scope.getLogs();
       }
     });
   }

   // calls getLogs if user_id exists
   $scope.checkUserId();
   // initialize ng class for sidebar as active
   $scope.getLogs = function ( ) {
     RestService.getLogs($scope.user_id)
         .then(function successCallback(response){
             $scope.logs = response.data.logs;
         }, function errorCallback(response){
            alert("Error in getting Logs");
         });
   };

   $scope.deleteLog = function (logId){
    RestService.deleteLog($scope.user_id, logId)
      .then(function successCallback(response){
          console.log("Removed Log from DB.");
          $scope.getLogs();
      }, function errorCallback(response){
          alert("Error removing Log from DB.");
      });
   };

}]);
