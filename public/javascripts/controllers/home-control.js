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
   $scope.user_id = "5bac44330012b8166ef76f04";
  //Return ttr and update ttr page
  $scope.getTTR = function ( ) {
    RestService.getTTR($scope.user_id)
        .then(function successCallback(response){
            $scope.ttrs = response.data[0].ttr;
        }, function errorCallback(response){
           console.log("Error in getting TTR");
        });
  };

  $scope.getTTR();

  //Add a ttr to DB
  $scope.addTTR = function (){
    var ttr = {"description" : $scope.description, "dueDate" : $scope.dueDate};
      RestService.addTTR($scope.user_id, ttr)
        .then(function successCallback(response){
            console.log("Inserted Data in DB.");
            $scope.getTTR();
        }, function errorCallback(response){
            console.log("Error in adding TTR");
        });
  };

  //remove ttr from DB
  $scope.deleteTTR = function (ttr){
    console.log(ttr);
    RestService.deleteTTR($scope.user_id, ttr._id)
      .then(function successCallback(response){
          console.log("Removed TTR From DB.");
          $scope.getTTR();
      }, function errorCallback(response){
          $log.log("Error");
      });
  };
}]);
