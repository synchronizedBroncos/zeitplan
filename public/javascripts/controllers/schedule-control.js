var cs480App = angular.module('cs480App');

cs480App.controller('ScheduleCtrl',
 ['$scope', 'RestService', function ($scope, RestService) {
   $scope.editModal = new ShowDataToModal();
   $scope.user_id = "5bac55220012b8166ef76f04";
   
  //Return schedule and update schedule page
  $scope.getSchedule = function ( ) {
    RestService.getSchedule($scope.user_id)
        .then(function successCallback(response){
            console.log(response);
            $scope.schedules = response.data.schedule;
        }, function errorCallback(response){
           console.log("Error in getting Schedule");
        });
  };
  
  $scope.getSchedule();
}]);