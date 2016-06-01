﻿/// <reference path="playpage/playonecategorypage.ts" />
/// <reference path="scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="scripts/typings/angularjs/angular.d.ts" />

var app = angular.module('MYCWeb', ['ngRoute', 'ngAnimate']);

//Controllers
app.controller('PlayOneCategoryPageController', ['$scope','$routeParams', PlayOneCategoryPageController]);
app.controller('ChooseAContainerPageController', ['$scope',ChooseAContainerPageController]);

//Config
app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/Play', {
            templateUrl: GlobalVariables.rootDir + 'PlayPage/PlayOneCategoryPage.html',
            controller: 'PlayOneCategoryPageController',
            controllerAs: 'ctrl'
        })
        .when('/', {
            templateUrl: GlobalVariables.rootDir + 'GSPages/ChooseAContainerPage.html',
            controller: 'ChooseAContainerPageController',
            controllerAs: 'ctrl'
        });

    //$locationProvider.html5Mode(true);
});