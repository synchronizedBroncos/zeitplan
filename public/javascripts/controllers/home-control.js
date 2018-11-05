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
