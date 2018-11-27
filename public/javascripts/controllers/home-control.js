// check if safari
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
var cs480App = angular.module('cs480App');

cs480App.controller('HomeCtrl',
 ['$scope', 'RestService', function ($scope, RestService) {
   $scope.settingModal = new ShowDataToModal();

   // Initialize Firebase
   const config = {
     apiKey: "AIzaSyCYsihge4e9SO4rZS7DpSRgWN5NXkuBcIs",
     authDomain: "zeitplan-db277.firebaseapp.com",
     databaseURL: "https://zeitplan-db277.firebaseio.com",
     projectId: "zeitplan-db277",
     storageBucket: "zeitplan-db277.appspot.com",
     messagingSenderId: "1033109428637"
   };
   firebase.initializeApp(config);

   // if not safari, set up firebase push notifications
   if(!isSafari) {
     const messaging = firebase.messaging(); // initialize messaging

     // function needed to request permission for device token
     $scope.requestPermissionPushNotifications = function() {
       // request permission for push notifications
       messaging.requestPermission()
       .then(function() {
         console.log('Have permission firebase');
         return messaging.getToken();
       })
       .then(function(token) {
         RestService.addDeviceToken($scope.user_id, token)
         .then(function successCallback(response){
           console.log("Device token is in DB.");
         }, function errorCallback(response){
           console.log("Error in Pushing Device Token");
         });
       })
       .catch(function(err) {
         console.log("Push notifications permission denied");
       });
     }

     messaging.onMessage(function(payload) {
       console.log('onMessage: ', payload);
       const notification = new Notification(payload.notification.title, { body: payload.notification.body, icon: payload.notification.icon });
     });
   }

   $scope.user_id = "unresolved";
   RestService.getCurrentUserId()
   .then(function successCallback(response) {
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
           $scope.emailStatus = response.data.settings.notificationTypes.email;
           $scope.pushStatus = response.data.settings.notificationTypes.pushNotification;
         }, function errorCallback(response){
            console.log("Error in getting Settings");
         });
   };
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

      scope.$watch('pushStatus', function(newValue) {
        if(newValue === true) {
          if(!isSafari) {
            scope.$parent.requestPermissionPushNotifications();
          } else {
            console.log("Push notifications currently not working on Safari or iOS");
          }
        }
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
