/// <reference path="../scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../globalvariables/globalvariables.ts" />
/// <reference path="../usercontrols/wcard.ts" />

function PlayOneCategoryPageController($routeParams) {
    var Cards: WCard[] = new Array();

    if($routeParams["Container"] != undefined)
        GlobalVariables.currentMainFolder = $routeParams["Container"];
    if ($routeParams["CFolder"] != undefined)
        GlobalVariables.currentCategoryFolder = $routeParams["CFolder"];
    var mainFolder: string = GlobalVariables.currentMainFolder; 
    var categoryFolder: string = GlobalVariables.currentCategoryFolder;

    MyFileHelper.FeedTextFromTxtFileToACallBack(
        CardsHelper.GetTreatablePath(GlobalVariables.categoryListFileName, mainFolder, categoryFolder),
        Cards,
        ShowWCardsCallback);
}

function ShowWCardsCallback(jsonTxt: string, cards: WCard[]) {
    CardsHelper.GetWCardsCallback(jsonTxt, cards);
    for (var i0 = 0; i0 < cards.length; i0++)
        $(cards[i0].viewCard).appendTo(".cvMain");
    CardsHelper.RearrangeCards(cards);
}