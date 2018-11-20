var cs480App = angular.module('cs480App');
cs480App.controller('ScheduleCtrl',
 ['$scope', 'RestService', function ($scope, RestService) {
   $scope.editModalSchedule = new ShowDataToModal();
   $scope.addModalSchedule = new ShowDataToModal();

  $scope.user_id = "unresolved";
   RestService.getCurrentUserId()
       .then(function successCallback(response){
           $scope.user_id = response.data;
           $scope.getSchedule();
       }, function errorCallback(response){
          console.log("Error in getting current user id");
       });
       
  $scope.selectSchedule = [];

  //Return schedule and update schedule page
  $scope.getSchedule = function ( ) {
    RestService.getSchedule($scope.user_id)
        .then(function successCallback(response){
            $scope.schedules = response.data.schedule;
        }, function errorCallback(response){
           console.log("Error in getting Schedule");
        });
  };  

   $scope.selectedSchedule = function (scheduleId, checkStatus){
     if(!$scope.selectSchedule.includes(scheduleId) && checkStatus == false){
       $scope.selectSchedule.push(scheduleId);
     }
     if(checkStatus==true){
       var index = $scope.selectSchedule.indexOf(scheduleId);
       $scope.selectSchedule.splice(index, 1);
     }
   };

   $scope.deleteSelectedSchedule = function(){
     if($scope.selectSchedule.length > 0){
       angular.forEach($scope.selectSchedule, function(value,key){
         $scope.deleteSchedule(value);
       });
       $scope.selectSchedule.length = 0;
     }
   };

    $scope.deleteSchedule = function (scheduleId){
    RestService.deleteSchedule($scope.user_id, scheduleId)
      .then(function successCallback(response){
          console.log("Removed Schedule from DB.");
          $scope.getSchedule();
          $scope.editModalSchedule.close();
      }, function errorCallback(response){
          $log.log("Error removing Schedule from DB.");
      });
  };

  //Add a schedule to DB
  $scope.addSchedule = function (){
    var schedule = {"description" : $scope.description, "startDate" : $scope.startDate, "endDate" : $scope.endDate};
      RestService.addSchedule($scope.user_id, schedule)
        .then(function successCallback(response){
            console.log("Inserted schedule in DB.");
            $scope.getSchedule();
            $scope.addModalSchedule.close();
        }, function errorCallback(response){
            console.log("Error in adding schdule");
        });
  };

  //Edit a schedule to DB
  $scope.editSchedule = function (scheduleId){
    var schedule = {"_id": scheduleId, "description" : $scope.description, "startDate" : $scope.startDate, "endDate" : $scope.endDate};
      RestService.editSchedule($scope.user_id, schedule)
        .then(function successCallback(response){
            console.log("Updated Data in DB.");
            console.log(response);
            $scope.getSchedule();
            $scope.editModalSchedule.close();
        }, function errorCallback(response){
            console.log("Error in updating schedule");
        });
  };
}]);

cs480App.directive('editModalSchedule', [function() {
  return {
    restrict: 'E',
    scope: {
      model: '=',
      description: '=',
      startDate: '=', 
      endDate: '='
    },
    link: function(scope, element, attributes) {
      scope.$watch('model.visible', function(newValue) {
        var modalElement = element.find('.modal');
        modalElement.modal(newValue ? 'show' : 'hide');
      });

      element.on('shown.bs.modal', function() {
        scope.$evalAsync(function() {
            scope.model.visible = true;
            scope.description = scope.model.data.description;
            scope.startDate = new Date(scope.model.data.startDate);
            scope.endDate = new Date(scope.model.data.endDate);
        });
      });

      element.on('hidden.bs.modal', function() {
        scope.$evalAsync(function() {
            scope.model.visible = false;
            element.find('.modal').find('form').trigger('reset');
        });
      });
    },
    templateUrl:'editModalSchedule.html' ,
  };
}]);

cs480App.directive('addModalSchedule', [function() {
  return {
    restrict: 'E',
    scope: {
      model: '=',
      description: '=',
      startDate: '=', 
      endDate : '='
    },
    link: function(scope, element, attributes) {
      scope.$watch('model.visible', function(newValue) {
        var modalElement = element.find('.modal');
        modalElement.modal(newValue ? 'show' : 'hide');
      });

      element.on('shown.bs.modal', function() {
        scope.$evalAsync(function() {
            scope.model.visible = true;
            scope.description = '';
            scope.startDate = undefined;
            scope.endDate = undefined;
            scope.startTime = '';
            scope.endTime = '';
            element.find('.modal').find('form').trigger('reset');
        });
      });

      element.on('hidden.bs.modal', function() {
        scope.$evalAsync(function() {
            scope.model.visible = false;
        });
      });
    },
    templateUrl:'addModalSchedule.html',
  };
}]);