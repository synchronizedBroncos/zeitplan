var cs480App = angular.module('cs480App');

cs480App.controller('IndexCtrl',
 ['$scope', 'RestService', function ($scope, RestService) {

  $scope.getRequestify = function () {
        RestService.getRequestify()
            .then(function successCallback(response){
                console.log("Success");
                $scope.sampleGet = response;
            }, function errorCallback(response){
               console.log("Error");
               $scope.sampleGet = response;
            });
    };

  $scope.getRequestify();

  $scope.userInfo= {name:'Abraham',job:'Leader'};

  $scope.postUser = function () {
        RestService.postUser($scope.userInfo)
            .then(function successCallback(response){
                console.log("Success");
                $scope.samplePost = response;
            }, function errorCallback(response){
               console.log("Error");
               $scope.samplePost = response;
            });
    };

  $scope.postUser();
}]);
