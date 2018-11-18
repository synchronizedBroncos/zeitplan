var cs480App = angular.module('cs480App');
cs480App.controller('ScheduleCtrl',
 ['$scope', 'RestService', function ($scope, RestService) {
   $scope.editModalSchedule = new ShowDataToModal();
   $scope.addModalSchedule = new ShowDataToModal();
   $scope.user_id = "5bf0fa700322c304dc96db7f";

  //Return schedule and update schedule page
  $scope.getSchedule = function ( ) {
    RestService.getSchedule($scope.user_id)
        .then(function successCallback(response){
            $scope.schedules = response.data.schedule;
        }, function errorCallback(response){
           console.log("Error in getting Schedule");
        });
  };

  $scope.getSchedule();   

  //Add a schedule to DB
  $scope.addSchedule = function (){
    var schedule = {"description" : $scope.description, "startDate" : $scope.startDate, "endDate" : $scope.endDate};
      RestService.addSchedule($scope.user_id, schedule)
        .then(function successCallback(response){
            console.log("Inserted schedule in DB.");
            $scope.getSchedule();
            $('#scheduleAddModal').modal('hide');
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
            console.log(scope);
            scope.description = scope.model.ttr.description;//change ttr to data later
            scope.startDate = new Date(scope.model.ttr.startDate);
            scope.endDate = new Date(scope.model.ttr.endDate);
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
            scope.description = '';
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