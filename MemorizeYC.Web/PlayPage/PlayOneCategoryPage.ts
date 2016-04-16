/// <reference path="../scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../globalvariables/globalvariables.ts" />
/// <reference path="../usercontrols/wcard.ts" />

window.onload = function PlayOneCategoryPageOnload (ev) {
    
    var mainFolder: string = "/Samples/MYContainer"; //: TODO: These two will be fed from outside this web page.
    var categoryFolder: string = "ShapeAndColor";
    var Cards: WCard[] = new Array();

    GlobalVariables.currentMainFolder = mainFolder;
    GlobalVariables.currentCategoryFolder = categoryFolder;
    
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