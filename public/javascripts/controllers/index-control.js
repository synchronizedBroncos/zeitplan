var cs480App = angular.module('cs480App');

cs480App.controller('IndexCtrl',
 ['$scope', '$log', 'RestService', function ($scope, $log, RestService, sharedTasks, $routeParams) {

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

  //Return tasks and update page's tasks list
  $scope.getTasks = function () {
    RestService.getTasks()
        .then(function successCallback(response){
            $scope.tasks = response.data;
        }, function errorCallback(response){
           $log.log("Error"); 
        });
    };

  $scope.to_do = $scope.getTasks();

  //Add a task to DB, also updates page's task lisk
  $scope.addTask = function (){
      RestService.addTask({"name" : $scope.name, "description" : $scope.description, "isDone" : $scope.isDone})
      .then(function successCallback(response){
        console.log("Inserted Data in DB.");
      });
      RestService.getTasks()
        .then(function successCallback(response){
            $scope.tasks = response.data;
        }, function errorCallback(response){
           $log.log("Error"); 
        });
  };

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
