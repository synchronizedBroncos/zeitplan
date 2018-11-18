var cs480App = angular.module('cs480App');

cs480App.controller('ScheduleCtrl',
 ['$scope', 'RestService', function ($scope, RestService) {
   //$scope.editModal = new ShowDataToModal();
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
  //Edit a schedule in DB
  
  /*
  $scope.editSchedule = function (scheduleId){
    var schedule = {"_id": scheduleId, "title" : $scope.newTitle, "description" : $scope.newDescrip, "startDate" : $scope.newStartDate, "endDate:", $scope.newEndDate};
      RestService.editSchedule($scope.user_id, schedule)
        .then(function successCallback(response){
            console.log("Updated Data in DB.");
            $scope.getSchedule();
        }, function errorCallback(response){
            console.log("Error in updating SCHEDULE");
        });
  };

/*
  //Add a schdule item to DB
  $scope.addSchedule = function (){
    var schedule = {"title": $scope.newTitle, "description" : $scope.description, "startDate" : $scope.startDate, "endDate" : $scope.endDate};
      RestService.addSchedule($scope.user_id, schdule)
        .then(function successCallback(response){
            console.log("Inserted Data in DB.");
            $scope.getSchedule();
        }, function errorCallback(response){
            console.log("Error in adding SCHEDULE");
        });
  };

  //remove schedule from DB
  $scope.deleteSchedule = function (schedule){
    RestService.deleteSchedule($scope.user_id, schedule._id)
      .then(function successCallback(response){
          console.log("Removed schdule From DB.");
      }, function errorCallback(response){
          $log.log("Error");
      });
      $scope.getSchedule();
  };
}]);
*/
/*
var ShowDataToModal = function () {
  this.visible = false;
};
ShowDataToModal.prototype.open = function(ttr) {
  this.ttr = ttr;
  this.visible = true;
};
ShowDataToModal.prototype.openAdd = function() {
  this.visible = true;
};
ShowDataToModal.prototype.close = function() {
  this.visible = false;
};
cs480App.directive('editModalSchedule', [function() {
  return {
    restrict: 'E',
    scope: {
      model: '=',
      description: '=',
      dueDate: '='
    },
    link: function(scope, element, attributes) {
      scope.$watch('model.visible', function(newValue) {
        var modalElement = element.find('.modal');
        modalElement.modal(newValue ? 'show' : 'hide');
      });

      element.on('shown.bs.modal', function() {
        scope.$evalAsync(function() {
            scope.model.visible = true;
            scope.description = scope.model.ttr.description;
            scope.dueDate = new Date(scope.model.ttr.dueDate);
        });
      });

      element.on('hidden.bs.modal', function() {
        scope.$evalAsync(function() {
            scope.model.visible = false;
            element.find('.modal').find('form').trigger('reset');
        });
      });

    },
    templateUrl:'editModal.html' ,
  };
}]);

cs480App.directive('addModalSchedule', [function() {
  return {
    restrict: 'E',
    scope: {
      model: '=',
      description: '=',
      dueDate: '='
    },
    link: function(scope, element, attributes) {
      scope.$watch('model.visible', function(newValue) {
        var modalElement = element.find('.modal');
        modalElement.modal(newValue ? 'show' : 'hide');
      });

      element.on('shown.bs.modal', function() {
        scope.$evalAsync(function() {
            scope.model.visible = true;
            scope.description ='';
            scope.dueDate = new Date();
            element.find('.modal').find('form').trigger('reset');
        });
      });

      element.on('hidden.bs.modal', function() {
        scope.$evalAsync(function() {
            scope.model.visible = false;
        });
      });

    },
    templateUrl:'addModal.html',
  };
}]);*/