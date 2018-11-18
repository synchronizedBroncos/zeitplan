var cs480App = angular.module('cs480App');

cs480App.controller('HomeCtrl',
 ['$scope', 'RestService', function ($scope, RestService) {
   $scope.settingModal = new ShowDataToModal();
   $scope.user_id = "unresolved";

   RestService.getCurrentUserId()
       .then(function successCallback(response){
           $scope.user_id = response.data;
       }, function errorCallback(response){
          console.log("Error in getting current user id");
       });

   $scope.changeSettings = function(userId){
     console.log(userId);
   };
   // initialize ng class for sidebar as active
   $scope.sidebarActive = '';
   // toggle sidebar class for active
   $scope.toggleSidebar = function() {
     $scope.sidebarActive = $scope.sidebarActive === '' ? 'active': '';
   }

   // initialize website to show ttr as first active tab
   $scope.activeTab = "ttr";
}]);

var ShowDataToModal = function () {
  this.visible = false;
};
ShowDataToModal.prototype.open = function(data) {
  this.data = data;
  this.visible = true;
};
ShowDataToModal.prototype.openAdd = function() {
  this.visible = true;
};
ShowDataToModal.prototype.close = function() {
  this.visible = false;
};
ShowDataToModal.prototype.openSettings = function(user_id) {
  this.user_id = user_id;
  this.visible = true;
};

cs480App.directive('settingModal', [function() {
  return {
    restrict: 'E',
    scope: {
      model: '=',
      user_id: '='
    },
    link: function(scope, element, attributes) {
      scope.$watch('model.visible', function(newValue) {
        var modalElement = element.find('.modal');
        modalElement.modal(newValue ? 'show' : 'hide');
      });

      element.on('shown.bs.modal', function() {
        scope.$evalAsync(function() {
            scope.model.visible = true;
            //Use scope.$parent.user_id to get user_id
        });
      });

      element.on('hidden.bs.modal', function() {
        scope.$evalAsync(function() {
            scope.model.visible = false;
        });
      });

    },
    templateUrl:'setting.html',
  };
}]);
