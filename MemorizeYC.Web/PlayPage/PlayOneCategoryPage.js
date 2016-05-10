/// <reference path="../scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../globalvariables/globalvariables.ts" />
/// <reference path="../usercontrols/wcard.ts" />
var PlayOneCategoryPageController = (function () {
    function PlayOneCategoryPageController($scope, $routeParams) {
        this.Cards = new Array();
        PlayOneCategoryPageController.Current = this;
        PlayOneCategoryPageController.scope = $scope;
        if ($routeParams["Container"] != undefined)
            GlobalVariables.currentMainFolder = $routeParams["Container"];
        if ($routeParams["CFolder"] != undefined)
            GlobalVariables.currentCategoryFolder = $routeParams["CFolder"];
        this.Container = GlobalVariables.currentMainFolder;
        this.CFolder = GlobalVariables.currentCategoryFolder;
        MyFileHelper.FeedTextFromTxtFileToACallBack(CardsHelper.GetTreatablePath(GlobalVariables.categoryListFileName, this.Container, this.CFolder), this.Cards, ShowWCardsAndEventsCallback);
        $(window).on("resize", function (ev) {
            var cards = PlayOneCategoryPageController.Current.Cards;
            CardsHelper.RearrangeCards(cards);
        });
    }
    return PlayOneCategoryPageController;
}());
function ShowWCardsAndEventsCallback(jsonTxt, cards) {
    CardsHelper.GetWCardsCallback(jsonTxt, cards);
    for (var i0 = 0; i0 < cards.length; i0++) {
        $(cards[i0].viewCard).appendTo(".cvMain");
        $(cards[i0].viewCard).on('click', viewCard_Click);
    }
    CardsHelper.RearrangeCards(cards);
}
function viewCard_Click(ev) {
    var wCards = PlayOneCategoryPageController.Current.Cards;
    var wCard;
    for (var i0 = 0; i0 < wCards.length; i0++) {
        if (wCards[i0].viewCard == this) {
            wCard = wCards[i0];
            break;
        }
    }
    PlayOneCategoryPageController.scope.$apply(function () {
        PlayOneCategoryPageController.Current.selWCard = wCard;
    });
}
//# sourceMappingURL=playonecategorypage.js.map