/// <reference path="../scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../globalvariables/globalvariables.ts" />
/// <reference path="../usercontrols/wcard.ts" />
/// <reference path="../scripts/typings/jqueryui/jqueryui.d.ts" />

class PlayOneCategoryPageController{
    public Container: string;
    public CFolder: string;
    public selWCard: WCard;
    public hyperLink: string;

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
    //#region numRestWCards
    get numRestWCards(): number {
        return WCard.restWCards.length;
    }
    //public numRestWCards: number=8; //: TODO: 
    //#endregion numRestWCards
    //#region PlayType
    get playType(): string {
        return GlobalVariables.PlayType;
    }
    set playType(value: string) {
        GlobalVariables.PlayType = value;
    }
    //#endregion PlayType

    constructor($scope, $routeParams) {
        PlayOneCategoryPageController.Current = this;
        PlayOneCategoryPageController.scope = $scope;
        WCard.CleanWCards();
        GlobalVariables.currentDocumentSize = [$(document).innerWidth(), $(document).innerHeight()];

        if ($routeParams["Container"] != undefined)
            GlobalVariables.currentMainFolder = $routeParams["Container"];
        if ($routeParams["CFolder"] != undefined)
            GlobalVariables.currentCategoryFolder = $routeParams["CFolder"];
        this.Container = GlobalVariables.currentMainFolder;
        this.CFolder = GlobalVariables.currentCategoryFolder;

        this.topNavbarHeight = $("#topNavbar").height();
        this.bottomNavbarHeight = $("#bottomNavbar").height();

        this.numWCardShown = 8;
        this.isPickWCardsRandomly = true;

        MyFileHelper.FeedTextFromTxtFileToACallBack(
            CardsHelper.GetTreatablePath(GlobalVariables.categoryListFileName, this.Container, this.CFolder),
            WCard.restWCards,
            ShowWCardsAndEventsCallback);

        $(window).on("resize", function (ev) {
            //* [2016-05-20 11:40] Resize only when the document's size is changed.
            if (GlobalVariables.currentDocumentSize[0] === $(document).innerWidth() && GlobalVariables.currentDocumentSize[1] === $(document).innerHeight())
                return;
            GlobalVariables.currentDocumentSize[0] = $(document).innerWidth();
            GlobalVariables.currentDocumentSize[1] = $(document).innerHeight();

            var wcards = WCard.showedWCards;
            CardsHelper.RearrangeCards(wcards, PlayOneCategoryPageController.oneOverNWindow);

            PlayOneCategoryPageController.scope.$apply(function () {
                if (wcards.length > 0) {
                    PlayOneCategoryPageController.Current.defaultCardHeight = wcards[0].viewCard.clientHeight;
                    PlayOneCategoryPageController.Current.defaultCardWidth = wcards[0].viewCard.clientWidth;
                    PlayOneCategoryPageController.Current.defaultCardStyle = {width : wcards[0].viewCard.clientWidth + "px", height: wcards[0].viewCard.clientHeight + "px"};
                }
            });
        });
    }

    //#region *EVENTS
    public ShowNewWCards_Click = function () {
        //* [2016-05-17 15:55] Move them
        var bufWCards: WCard[] = new Array();
        var shWCards:WCard[]= WCard.showedWCards;
        var rtWCards: WCard[] = WCard.restWCards;
        //* [2016-05-17 15:47] Check how many WCards should be changed
        var N: number = PlayOneCategoryPageController.numWCardShown;
        var nShToRt = Math.max(0, shWCards.length + Math.min(rtWCards.length, N) - N);
        //** [2016-05-17 15:58] 1. Move them from showedWCards to bufWCards
        CardsHelper.MoveArrayElements(shWCards, bufWCards, nShToRt, PlayOneCategoryPageController.isPickWCardsRandomly);        
        //** [2016-05-17 16:14] 2. Move WCards from restWCards to showedWCards
        CardsHelper.MoveArrayElements(rtWCards, shWCards, N, PlayOneCategoryPageController.isPickWCardsRandomly,$(".cvMain"));    
        //** [2016-05-17 16:14] 3. Move WCards from bufWCards to restWCards
        CardsHelper.MoveArrayElements(bufWCards, rtWCards, nShToRt);

        PlayOneCategoryPageController.Current.numRestWCards;
        CardsHelper.RearrangeCards(shWCards, PlayOneCategoryPageController.oneOverNWindow);        
    };
    //#region **resize WCards
    public Smaller_Click = function () {
        PlayOneCategoryPageController.oneOverNWindow *= 1.2;
        CardsHelper.RearrangeCards(WCard.showedWCards, PlayOneCategoryPageController.oneOverNWindow);
    };
    public Larger_Click = function () {
        PlayOneCategoryPageController.oneOverNWindow /= 1.2;
        CardsHelper.RearrangeCards(WCard.showedWCards, PlayOneCategoryPageController.oneOverNWindow);
    };
    //#endregion **resize WCards
    public Arrange_Click = function (isRandomly: boolean) {
        CardsHelper.RearrangeCards(WCard.showedWCards, PlayOneCategoryPageController.oneOverNWindow, isRandomly, false);
    };

    public OpenHyperLink_Click = function () {
        if (PlayOneCategoryPageController.Current.hyperLink)
            window.open(PlayOneCategoryPageController.Current.hyperLink);
    }
    //#endregion *EVENTS
}
function ShowWCardsAndEventsCallback(jsonTxt: string, restWcards: WCard[]) {
    var showedWcards: WCard[] = WCard.showedWCards;
    var ith: number = 0;
    //* [2016-05-20 16:03] Initialize hyperLink & WCards
    CardsHelper.GetWCardsCallback(jsonTxt, restWcards);
    PlayOneCategoryPageController.Current.hyperLink = JSON.parse(jsonTxt)["Link"];


    for (var i0 = 0; i0 < restWcards.length; i0++) {

        //* [2016-05-10 17:23] For singleClick   :TODO:
        $(restWcards[i0]).on(GlobalVariables.onSingleClick, { thisWCard: restWcards[i0] }, function (ev) {
            PlayOneCategoryPageController.scope.$apply(function () {
                PlayOneCategoryPageController.Current.selWCard = ev.data.thisWCard;
            });
        });

        //* [2016-05-10 17:23] For doubleClick   :TODO:
        $(restWcards[i0]).on(GlobalVariables.onDoubleClick, { thisWCard: restWcards[i0] }, function (ev) {
            PlayOneCategoryPageController.scope.$apply(function () {
                PlayOneCategoryPageController.Current.selWCard = ev.data.thisWCard;
            });
        });

        //* [2016-05-19 20:02] Make it resizable
        $(restWcards[i0].viewCard).draggable();
        $(restWcards[i0].viewCard).resizable();
        $(restWcards[i0].viewCard).on("resize", function (ev, ui) {
            ev.bubbles = false;
            var thisWCard = WCard.FindWCardFromViewCard(this);
            thisWCard.viewSize = [ui.size.width, ui.size.height];
        });
        restWcards[i0].viewCard.style.msTouchAction = "none";
        restWcards[i0].viewCard.style.touchAction = "none";
    }

    //* [2016-05-17 15:35] Just show some wcards
    while (ith < PlayOneCategoryPageController.numWCardShown && restWcards.length > 0) {
        $(restWcards[0].viewCard).appendTo(".cvMain");
        showedWcards.push(restWcards[0]);
        restWcards.splice(0,1);
        ith++;
    }
    PlayOneCategoryPageController.scope.$apply(function () {
        PlayOneCategoryPageController.Current.numRestWCards
    });

    CardsHelper.RearrangeCards(showedWcards, PlayOneCategoryPageController.oneOverNWindow);

    //* [2016-05-12 17:09] Set the default width and height of a card
    if (showedWcards.length > 0) {
        PlayOneCategoryPageController.Current.defaultCardHeight = showedWcards[0].viewCard.clientHeight;
        PlayOneCategoryPageController.Current.defaultCardWidth = showedWcards[0].viewCard.clientWidth;
        PlayOneCategoryPageController.Current.defaultCardStyle = { width: showedWcards[0].viewCard.clientWidth + "px", height: showedWcards[0].viewCard.clientHeight + "px" };
    }
}
