var cs480App = angular.module('cs480App', []);

cs480App.factory('RestService', function($http) {
  var service = {};
  var urlBase = '';
  // var urlBase = '/api/v1';

  service.getRequestify = function() {
      return $http.get(urlBase + '/requestify');
  };

  service.getCurrentUserId = function() {
      return $http.get(urlBase + '/api/currentUserId');
  };

  /* service.postUser = function(id){
      return $http.get(urlBase + '/user/' + id);
  }; */

  service.postUser = function(userInfo){
    return $http.post('https://reqres.in/api/users', userInfo);
  };

  service.getTTR = function(user_id){
    return $http.get(urlBase + '/api/ttrs/' + user_id);
  }

  service.getLogs = function(user_id){
    return $http.get(urlBase + '/api/logs/' + user_id);
  }


  service.editTTR = function(user_id, data){
    return $http({
        url: urlBase + 'api/editTTR/' + user_id,
        method: "POST",
        data: data,
      }).then(function successCallback(response) {
        return response;
    }, function errorCallback(response) {
        return response;
    });
  }

  service.addTTR = function(user_id, data){
    return $http({
        url: urlBase + 'api/addTTR/' + user_id,
        method: "POST",
        data: data,
      }).then(function successCallback(response) {
        return response;
    }, function errorCallback(response) {
        return response;
    });
  }

  service.deleteTTR = function(user_id, task_id){
    return $http({
        url: urlBase + 'api/removeTTR/' + user_id +"/" + task_id,
        method: "DELETE",
      }).then(function successCallback(response) {
        return response;
    }, function errorCallback(response) {
        return response;
    });

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
