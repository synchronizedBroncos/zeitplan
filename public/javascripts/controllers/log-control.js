var cs480App = angular.module('cs480App');
cs480App.controller('LogCtrl',
 ['$scope', 'RestService', function ($scope, RestService) {
<<<<<<< HEAD
   $scope.user_id = "5bac44330012b8166ef76f04";

=======
   $scope.checkUserId = function checkUserId() {
     $scope.$watch('$parent.user_id', function(newVal, oldVal){
       $scope.user_id = newVal;
       if($scope.user_id !== "unresolved") {
         $scope.getLogs();
       }
     });
   }

   $scope.checkUserId();
>>>>>>> ccf25323d04cf641ba59ec7945b559679c083d02
   // initialize ng class for sidebar as active
   $scope.getLogs = function ( ) {
     RestService.getLogs($scope.user_id)
         .then(function successCallback(response){
             $scope.logs = response.data.logs;
         }, function errorCallback(response){
            console.log("Error in getting Logs");
         });
   };


   $scope.getLogs();
}]);
