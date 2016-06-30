/// <reference path="playpage/playonecategorypage.ts" />
/// <reference path="helpers/speechsynthesishelper.ts" />
/// <reference path="scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="scripts/typings/angularjs/angular.d.ts" />

$(window).one("load", () => {
    SpeechSynthesisHelper.getAllVoices(() => { });});
var app = angular.module('MYCWeb', ['ngRoute', 'ngAnimate']);

//Controllers
app.controller('PlayOneCategoryPageController', ['$scope','$routeParams', PlayOneCategoryPageController]);
app.controller('ChooseAContainerPageController', ['$scope','$routeParams',ChooseAContainerPageController]);

//Config
app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/Play', {
            templateUrl: GlobalVariables.playOneCategoryHtml,
            controller: 'PlayOneCategoryPageController',
            controllerAs: 'ctrl'
        })
        .when('/', {
            templateUrl: GlobalVariables.chooseAContainerHtml,
            controller: 'ChooseAContainerPageController',
            controllerAs: 'ctrl'
        });

    //$locationProvider.html5Mode(true);
});