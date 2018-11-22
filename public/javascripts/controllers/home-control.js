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

   $scope.changeSettings = function(){
     let data = {"textMessage": $scope.textStatus, "email": $scope.emailStatus, "pushNotification": $scope.pushStatus};
     RestService.editSettings($scope.user_id, data)
       .then(function successCallback(response){
           console.log("Changed User Settings in DB.");
           $scope.settingModal.close();
       }, function errorCallback(response){
           console.log("Error in Changing User Settings");
       });
   };

   $scope.getSettings = function () {
     RestService.getSettings($scope.user_id)
         .then(function successCallback(response){
           $scope.textStatus = response.data.settings.notificationTypes.textMessage;
           $scope.emailStatus =response.data.settings.notificationTypes.email;
           $scope.pushStatus =response.data.settings.notificationTypes.pushNotification;
         }, function errorCallback(response){
            console.log("Error in getting Settings");
         });
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
      user_id: '=',
      textStatus: '=',
      emailStatus: '=',
      pushStatus:'='
    },
    link: function(scope, element, attributes) {
      scope.$watch('model.visible', function(newValue) {
        var modalElement = element.find('.modal');
        modalElement.modal(newValue ? 'show' : 'hide');
      });

      element.on('shown.bs.modal', function() {
        scope.$evalAsync(function() {
            scope.model.visible = true;
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
