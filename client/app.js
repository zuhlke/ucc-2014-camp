'use strict';

var myapp = angular.module('myapp', []);

myapp.config(function($logProvider) {
  $logProvider.debugEnabled(true);
});
