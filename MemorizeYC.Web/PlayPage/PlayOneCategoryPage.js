/// <reference path="../scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../globalvariables/globalvariables.ts" />
/// <reference path="../usercontrols/wcard.ts" />
var PlayOneCategoryPageController = (function () {
    function PlayOneCategoryPageController($scope, $routeParams) {
        this.oneOverNWindow = 5;
        PlayOneCategoryPageController.Current = this;
        PlayOneCategoryPageController.scope = $scope;
        WCard.CleanWCards();
        if ($routeParams["Container"] != undefined)
            GlobalVariables.currentMainFolder = $routeParams["Container"];
        if ($routeParams["CFolder"] != undefined)
            GlobalVariables.currentCategoryFolder = $routeParams["CFolder"];
        this.Container = GlobalVariables.currentMainFolder;
        this.CFolder = GlobalVariables.currentCategoryFolder;
        this.topNavbarHeight = $("#topNavbar").height();
        this.bottomNavbarHeight = $("#bottomNavbar").height();
        MyFileHelper.FeedTextFromTxtFileToACallBack(CardsHelper.GetTreatablePath(GlobalVariables.categoryListFileName, this.Container, this.CFolder), WCard.WCards, ShowWCardsAndEventsCallback);
        $(window).on("resize", function (ev) {
            CardsHelper.RearrangeCards(WCard.WCards, PlayOneCategoryPageController.Current.oneOverNWindow);
            PlayOneCategoryPageController.scope.$apply(function () {
                if (WCard.WCards.length > 0) {
                    PlayOneCategoryPageController.Current.defaultCardHeight = WCard.WCards[0].viewCard.clientHeight;
                    PlayOneCategoryPageController.Current.defaultCardWidth = WCard.WCards[0].viewCard.clientWidth;
                    PlayOneCategoryPageController.Current.defaultCardStyle = { width: WCard.WCards[0].viewCard.clientWidth + "px", height: WCard.WCards[0].viewCard.clientHeight + "px" };
                }
            });
        });
    }
    return PlayOneCategoryPageController;
}());
function ShowWCardsAndEventsCallback(jsonTxt, cards) {
    CardsHelper.GetWCardsCallback(jsonTxt, cards);
    for (var i0 = 0; i0 < cards.length; i0++) {
        $(cards[i0].viewCard).appendTo(".cvMain");
        //* [2016-05-10 17:23] For singleClick   :TODO:
        $(cards[i0]).on(GlobalVariables.onSingleClick, { thisWCard: cards[i0] }, function (ev) {
            PlayOneCategoryPageController.scope.$apply(function () {
                PlayOneCategoryPageController.Current.selWCard = ev.data.thisWCard;
            });
        });
        //* [2016-05-10 17:23] For doubleClick   :TODO:
        $(cards[i0]).on(GlobalVariables.onDoubleClick, { thisWCard: cards[i0] }, function (ev) {
            PlayOneCategoryPageController.scope.$apply(function () {
                PlayOneCategoryPageController.Current.selWCard = ev.data.thisWCard;
            });
        });
    }
    CardsHelper.RearrangeCards(cards);
    //* [2016-05-12 17:09] Set the default width and height of a card
    if (cards.length > 0) {
        PlayOneCategoryPageController.Current.defaultCardHeight = cards[0].viewCard.clientHeight;
        PlayOneCategoryPageController.Current.defaultCardWidth = cards[0].viewCard.clientWidth;
        PlayOneCategoryPageController.Current.defaultCardStyle = { width: cards[0].viewCard.clientWidth + "px", height: cards[0].viewCard.clientHeight + "px" };
    }
}
//# sourceMappingURL=playonecategorypage.js.map