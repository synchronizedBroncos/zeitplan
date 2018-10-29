var cs480App = angular.module('cs480App', ['ngAnimate']);

cs480App.factory('RestService', function($http) {
  var service = {};
  var urlBase = '';
  // var urlBase = '/api/v1';

  service.getRequestify = function() {
      return $http.get(urlBase + '/requestify');
  };

  /* service.postUser = function(id){
      return $http.get(urlBase + '/user/' + id);
  }; */

  service.postUser = function(userInfo){
    return $http.post('https://reqres.in/api/users', userInfo);
  };

  service.getTasks = function() {
    return $http.get(urlBase + '/api/tasks');
  };

  service.getTask = function(id){
    return $http.get(urlBase + '/api/tasks/' + id);
  };

  service.addTask = function(data){
    return $http({
        //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: urlBase + 'api/tasks',
        method: "POST",
        data: data,
      }).then(function successCallback(response) {
        return response;
    }, function errorCallback(response) {
        return response;
    });

  };

  service.deleteTask = function(id){
    return $http({
        url: urlBase + 'api/tasks/' + id,
        method: "DELETE",
      }).then(function successCallback(response) {
        return response;
    }, function errorCallback(response) {
        return response;
    });

  };

  return service;

});
