var cs480App = angular.module('cs480App', []);

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

  return service;

});
