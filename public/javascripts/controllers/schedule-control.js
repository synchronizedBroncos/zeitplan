var cs480App = angular.module('cs480App');
cs480App.controller('ScheduleCtrl',
 ['$scope', 'RestService', function ($scope, RestService) {
   $scope.editModalSchedule = new ShowDataToModal();
   $scope.addModalSchedule = new ShowDataToModal();
   $scope.moveToLogModal = new ShowDataToModal();

   $scope.checkUserId = function checkUserId() {
    $scope.$watch('$parent.user_id', function(newVal, oldVal){
      $scope.user_id = newVal;
      if($scope.user_id !== "unresolved") {
        $scope.getSchedule();
      }
    });
  }

  $scope.checkUserId();

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
    $scope.startTime.setDate($scope.date.getDate());
    $scope.startTime.setFullYear($scope.date.getFullYear());
    $scope.startTime.setMonth($scope.date.getMonth());

    $scope.endTime.setDate($scope.date.getDate());
    $scope.endTime.setFullYear($scope.date.getFullYear());
    $scope.endTime.setMonth($scope.date.getMonth());

    if($scope.endTime < $scope.startTime){
      $scope.endTime.setDate($scope.endTime.getDate() + 1);
    }

    var schedule = {"description" : $scope.description, "startTime" : $scope.startTime,
    "endTime" : $scope.endTime, "notification" : $scope.notification};
    console.log(schedule);
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
    var schedule = {"_id": scheduleId, "description" : $scope.description, "startDate" : $scope.startDate, "endDate" : $scope.endDate, "reason" : $scope.reason, "notification" : $scope.notification};
      RestService.editSchedule($scope.user_id, schedule)
        .then(function successCallback(response){
            console.log("Updated Data in DB.");
            $scope.getSchedule();
            $scope.editModalSchedule.close();
        }, function errorCallback(response){
            console.log("Error in updating schedule");
        });
  };

  $scope.sendScheduleToLogs = function (scheduleId){
    var log = {"_id": scheduleId, "description" : $scope.description, "startDate" : $scope.startDate, "endDate" : $scope.endDate, "reason" : $scope.reason};
      RestService.sendScheduleToLogs($scope.user_id, log)
        .then(function successCallback(response){
            console.log("Moved schedule to log in DB.");
            $scope.deleteSchedule(scheduleId);
            $scope.getSchedule();
            $scope.moveToLogModal.close();
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
      date: '=',
      startTime: '=',
      endTime: '=',
      notification: "="
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
            scope.reason = scope.model.data.reason;
            scope.startDate = new Date(scope.model.data.startDate);
            scope.endDate = new Date(scope.model.data.endDate);
            scope.notification = scope.model.data.notification;
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


cs480App.directive('moveToLogModal', [function() {
  return {
    restrict: 'E',
    scope: {
      model: '=',
      description: '=',
      startDate: '=',
      endDate: '=',
      notification: '='

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
    templateUrl:'moveToLogModal.html' ,
  };
}]);

cs480App.directive('addModalSchedule', [function() {
  return {
    restrict: 'E',
    scope: {
      model: '=',
      description: '=',
      date: '=',
      startTime: '=',
      endTime: '=',
      notification: "="
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
            scope.date = ;
            scope.startDate = undefined;
            scope.endDate = undefined;
            scope.notification = false;
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
