var cs480App = angular.module('cs480App');
cs480App.controller('TTRCntrl',
 ['$scope', 'RestService', function ($scope, RestService) {
   $scope.editModal = new ShowDataToModal();
   $scope.addModal = new ShowDataToModal();

   $scope.checkUserId = function checkUserId() {
     $scope.$watch('$parent.user_id', function(newVal, oldVal){
       $scope.user_id = newVal;
       if($scope.user_id !== "unresolved") {
         $scope.getTTR();
       }
     });
   }

   $scope.checkUserId();

   $scope.selectTTR = [];

   $scope.selectedTTR = function (ttrId, checkStatus){
     if(!$scope.selectTTR.includes(ttrId) && checkStatus == false){
       $scope.selectTTR.push(ttrId);
     }
     if(checkStatus==true){
       var index = $scope.selectTTR.indexOf(ttrId);
       $scope.selectTTR.splice(index, 1);
     }
   };

   $scope.deleteSelectedTTR = function(){
     if($scope.selectTTR.length > 0){
       angular.forEach($scope.selectTTR, function(value,key){
         $scope.deleteTTR(value);
       });
       $scope.selectTTR.length = 0;
     }
   };

  //Return ttr and update ttr page
  $scope.getTTR = function ( ) {
    RestService.getTTR($scope.user_id)
        .then(function successCallback(response){
            $scope.ttrs = response.data.ttr;
            $scope.selectTTR.length = 0;
        }, function errorCallback(response){
           console.log("Error in getting TTR");
        });
  };

  //Edit a ttr to DB
  $scope.editTTR = function (ttrId){
    var ttr = {"_id": ttrId, "description" : $scope.description, "dueDate" : $scope.dueDate};
      RestService.editTTR($scope.user_id, ttr)
        .then(function successCallback(response){
            console.log("Updated Data in DB.");
            $scope.getTTR();
            $scope.editModal.close();
        }, function errorCallback(response){
            console.log("Error in updating TTR");
        });
  };

  $scope.addTTRToSchedule = function (){
    if(!$scope.$parent.startDate || !$scope.$parent.date){
      $scope.errorMsg = "Error: Please fill in start date and time fields.";
      $scope.error=true;
    }else{
      $scope.startDate.setDate($scope.$parent.date.getDate());
      $scope.startDate.setFullYear($scope.$parent.date.getFullYear());
      $scope.startDate.setMonth($scope.$parent.date.getMonth());
      if($scope.endDate){
        $scope.endDate.setDate($scope.$parent.date.getDate());
        $scope.endDate.setFullYear($scope.$parent.date.getFullYear());
        $scope.endDate.setMonth($scope.$parent.date.getMonth());
      }
      var schedule = {"description" : $scope.description, "date" : $scope.date,
      "endDate" : $scope.endDate, "startDate" : $scope.startDate, "notification": $scope.notifySchedule};
      RestService.addSchedule($scope.user_id, schedule)
        .then(function successCallback(response){
            console.log("Added TTR to Schedule.");
            $scope.editModal.close();
        }, function errorCallback(response){
            $log.log("Error add TTR to Schedule.");
        });
    }
  };

  //Add a ttr to DB
  $scope.addTTR = function (){
    var ttr = {"description" : $scope.description, "dueDate" : $scope.dueDate};
      RestService.addTTR($scope.user_id, ttr)
        .then(function successCallback(response){
            console.log("Inserted Data in DB.");
            $scope.getTTR();
            $('#ttrAddModal').modal('hide');
        }, function errorCallback(response){
            console.log("Error in adding TTR");
        });
  };

  //remove ttr from DB
  $scope.deleteTTR = function (ttrId){
    RestService.deleteTTR($scope.user_id, ttrId)
      .then(function successCallback(response){
          console.log("Removed TTR from DB.");
          $scope.getTTR();
          $scope.editModal.close();
      }, function errorCallback(response){
          $log.log("Error removing TTR from DB.");
      });
  };
}]);

cs480App.directive('editModal', [function() {
  return {
    restrict: 'E',
    scope: {
      model: '=',
      description: '=',
      dueDate: '=',
      endDate: '=',
      startDate: '=',
      notifySchedule: '=',
      date: '='
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
            if(scope.model.data.dueDate !=null){
                scope.dueDate = new Date(scope.model.data.dueDate);
            }else{
                scope.dueDate = null;
            }
            scope.endDate = undefined;
            scope.startDate = undefined;
            scope.notifySchedule = false;
            scope.date = undefined;
        });
      });

      element.on('hidden.bs.modal', function() {
        scope.$evalAsync(function() {
            scope.model.visible = false;
            element.find('.modal').find('form').trigger('reset');
            scope.showSchedule = false;
            scope.$parent.error=false;
        });
      });

    },
    templateUrl:'editModal.html' ,
  };
}]);

cs480App.directive('addModal', [function() {
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
            scope.description = '';
            scope.dueDate = undefined;
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
}]);
