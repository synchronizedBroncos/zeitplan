var cs480App = angular.module('cs480App');

cs480App.controller('HomeCtrl',
 ['$scope', 'RestService', function ($scope, RestService) {

   // initialize ng class for sidebar as active
   $scope.sidebarActive = '';
   // toggle sidebar class for active
   $scope.toggleSidebar = function() {
     $scope.sidebarActive = $scope.sidebarActive === '' ? 'active': '';
   }

   // initialize website to show ttr as first active tab
   $scope.activeTab = "ttr";
}]);

//Controller for TTR Page
cs480App.controller('TTRCntrl',
 ['$scope', 'RestService', function ($scope, RestService) {

  //Return ttr and update ttr page
  $scope.getTTR = function () {

    };

  //Add a ttr to DB
  $scope.addTTR = function (){

  };
  //remove ttr from DB
  $scope.deleteTTR = function (things){

  };
}]);
