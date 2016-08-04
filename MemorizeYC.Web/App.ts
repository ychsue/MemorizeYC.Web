/// <reference path="playpage/playonecategorypage.ts" />
/// <reference path="helpers/speechsynthesishelper.ts" />
/// <reference path="helpers/pagetexthelper.ts" />
/// <reference path="scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="gspages/chooseacontainerpage.ts" />
/// <reference path="scripts/typings/angularjs/angular.d.ts" />
/// <reference path="helpers/indexeddbhelper.ts" />

var app = angular.module('MYCWeb', ['ngRoute', 'ngAnimate']);

//Controllers
app.controller('PlayOneCategoryPageController', ['$scope','$routeParams', PlayOneCategoryPageController]);
app.controller('ChooseAContainerPageController', ['$scope','$routeParams',ChooseAContainerPageController]);

//Config
app.config(function ($routeProvider, $locationProvider) {
    //* [2016-08-01 17:29] Set LocalStorage["IsShownTutor"]=true if it is undefined
    if (typeof (Storage) !== "undefined" && localStorage[GlobalVariables.IsShownTutorKey] === undefined) {
        localStorage[GlobalVariables.IsShownTutorKey] = GlobalVariables.isTutorMode;
    }

    //* [2016-07-19 11:47] Initialize the DataBase and the ObjectStore
    //IndexedDBHelper.DeleteADBAsync((ev) => { IndexedDBHelper.OpenADBAsync });
    IndexedDBHelper.OpenADBAsync();

    //* [2016-07-10 20:45] Get the related PageTexts
    GlobalVariables.LangsInStrings = PageTextHelper.InitLangsInStrings();
    GlobalVariables.SelPageTextLang = PageTextHelper.GetPageTextLang(navigator.language, GlobalVariables.LangsInStrings);
    PageTextHelper.InitPageTexts(() => { $(document).trigger(GlobalVariables.PageTextChangeKey); });

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