'use strict';

var myapp = angular.module('myapp', ['myapp.audio']);

myapp.config(function($logProvider) {
  $logProvider.debugEnabled(true);
});
