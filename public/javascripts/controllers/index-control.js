var cs480App = angular.module('cs480App', []);

cs480App.controller('IndexCtrl', function ($scope, $http) {

  $scope.getData = function() {
    // Simple GET request example:
    $http({method: 'GET', url: '/requestify'})
    .then(function successCallback(response) {
      $scope.sampleData = response;
    }, function errorCallback(response) {
        $scope.sampleData = response;
    });
  }

  $scope.getData();

});
