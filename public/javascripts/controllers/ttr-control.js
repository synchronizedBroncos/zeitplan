var cs480App = angular.module('cs480App');
cs480App.controller('TTRCntrl',
 ['$scope', 'RestService', function ($scope, RestService) {
   $scope.editModal = new ShowDataToModal();
   $scope.addModal = new ShowDataToModal();

   $scope.user_id = "unresolved";
   RestService.getCurrentUserId()
       .then(function successCallback(response){
           $scope.user_id = response.data;
           $scope.getTTR();
       }, function errorCallback(response){
          console.log("Error in getting current user id");
       });
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
          console.log("Removed TTR From DB.");
          $scope.getTTR();
          $scope.editModal.close();
      }, function errorCallback(response){
          $log.log("Error");
      });
  };
}]);

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
cs480App.directive('editModal', [function() {
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
