/// <reference path="playpage/playonecategorypage.ts" />
/// <reference path="helpers/speechsynthesishelper.ts" />
/// <reference path="scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="scripts/typings/angularjs/angular.d.ts" />

var app = angular.module('MYCWeb', ['ngRoute', 'ngAnimate']);

//Controllers
app.controller('PlayOneCategoryPageController', ['$scope','$routeParams', PlayOneCategoryPageController]);
app.controller('ChooseAContainerPageController', ['$scope','$routeParams',ChooseAContainerPageController]);

//Config
app.config(function ($routeProvider, $locationProvider) {

    //* [2016-07-05 15:54] Preloading before any routings.
    SpeechSynthesisHelper.getAllVoices(() => { });
    GlobalVariables.gdTutorElements = {
        gdMain: document.getElementById("gdTutorial") as HTMLDivElement,
        gdBoard: $("#gdTutorial #gdBoard").get(0) as HTMLDivElement,
        gdContent: $("#gdTutorial #gdContent").get(0) as HTMLDivElement,
        btHide: $("#gdTutorial #btHide").get(0) as HTMLButtonElement,
        btStop: $("#gdTutorial #btStop").get(0) as HTMLButtonElement
    };

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