/// <reference path="playpage/playonecategorypage.ts" />
/// <reference path="scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="scripts/typings/angularjs/angular.d.ts" />
var app = angular.module('MYCWeb', ['ngRoute']);
//Controller
app.controller('PlayOneCategoryPageController', ['$routeParams', PlayOneCategoryPageController]);
//Config
app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/Play', {
        templateUrl: '/PlayPage/PlayOneCategoryPage.html',
        controller: 'PlayOneCategoryPageController'
    });
    //$locationProvider.html5Mode(true);
});
//# sourceMappingURL=App.js.map