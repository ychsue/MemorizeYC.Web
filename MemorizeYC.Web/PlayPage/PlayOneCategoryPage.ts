/// <reference path="../scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../globalvariables/globalvariables.ts" />
/// <reference path="../usercontrols/wcard.ts" />

class PlayOneCategoryPageController{
    public Container: string;
    public CFolder: string;
    public selWCard: WCard;

    public topNavbarHeight: number;
    public bottomNavbarHeight: number;
    public defaultCardWidth: number;
    public defaultCardHeight: number;
    public defaultCardStyle: Object;

    public static Current: PlayOneCategoryPageController;
    public static scope;
    public static oneOverNWindow: number = 5;

    //#region numWCardShown
    public static numWCardShown: number;
    get numWCardShown():number {
        return PlayOneCategoryPageController.numWCardShown;
    }
    set numWCardShown(value: number) {
        PlayOneCategoryPageController.numWCardShown = value;
    }
    //#endregion numWCardShown
    //#region PickWCardsRandomly
    public static isPickWCardsRandomly: boolean;
    get isPickWCardsRandomly(): boolean {
        return PlayOneCategoryPageController.isPickWCardsRandomly;
    }
    set isPickWCardsRandomly(value: boolean) {
        PlayOneCategoryPageController.isPickWCardsRandomly = value;
    }
    //#endregion PickWCardsRandomly

    constructor($scope, $routeParams) {
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

        this.numWCardShown = 6;
        this.isPickWCardsRandomly = true;

        MyFileHelper.FeedTextFromTxtFileToACallBack(
            CardsHelper.GetTreatablePath(GlobalVariables.categoryListFileName, this.Container, this.CFolder),
            WCard.WCards,
            ShowWCardsAndEventsCallback);

        $(window).on("resize", function (ev) {
            CardsHelper.RearrangeCards(WCard.WCards, PlayOneCategoryPageController.oneOverNWindow);

            PlayOneCategoryPageController.scope.$apply(function () {
                if (WCard.WCards.length > 0) {
                    PlayOneCategoryPageController.Current.defaultCardHeight = WCard.WCards[0].viewCard.clientHeight;
                    PlayOneCategoryPageController.Current.defaultCardWidth = WCard.WCards[0].viewCard.clientWidth;
                    PlayOneCategoryPageController.Current.defaultCardStyle = {width : WCard.WCards[0].viewCard.clientWidth + "px", height: WCard.WCards[0].viewCard.clientHeight + "px"};
                }
            });
        });
    }
}
function ShowWCardsAndEventsCallback(jsonTxt: string, cards: WCard[]) {
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
    CardsHelper.RearrangeCards(cards, PlayOneCategoryPageController.oneOverNWindow);

    //* [2016-05-12 17:09] Set the default width and height of a card
    if (cards.length > 0) {
        PlayOneCategoryPageController.Current.defaultCardHeight = cards[0].viewCard.clientHeight;
        PlayOneCategoryPageController.Current.defaultCardWidth = cards[0].viewCard.clientWidth;
        PlayOneCategoryPageController.Current.defaultCardStyle = { width: cards[0].viewCard.clientWidth + "px", height: cards[0].viewCard.clientHeight + "px" };
    }
}
