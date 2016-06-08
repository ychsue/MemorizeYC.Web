/// <reference path="../scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../globalvariables/globalvariables.ts" />
/// <reference path="../usercontrols/wcard.ts" />
/// <reference path="../scripts/typings/jqueryui/jqueryui.d.ts" />

class PlayOneCategoryPageController{
    public Container: string;
    public CFolder: string;
    public selWCard: WCard;
    public synAnsWCard: WCard;
    public hyperLink: string;
    public recInputSentence: string;
    public meCardsAudio: HTMLAudioElement = document.getElementById('meCardsAudio') as HTMLAudioElement;
    public meBackground: HTMLAudioElement = document.getElementById('meBackground') as HTMLAudioElement;
    public dlDblClickWCard: HTMLDivElement = document.getElementById('dlDblClickWCard') as HTMLDivElement;
    public dlFinish: HTMLDivElement = document.getElementById('dlFinish') as HTMLDivElement;
    public ddSettings: HTMLElement = document.getElementById('ddSettings') as HTMLElement;
    public imgBackground: HTMLDivElement = document.getElementById('imgBackground') as HTMLDivElement;
    public btSynPlay: HTMLButtonElement = document.getElementById('btSynPlay') as HTMLButtonElement;
    public isBackAudioStartLoad: boolean = false;

    public isBGAlsoChange: boolean = true;

    public topNavbarHeight: number;
    public bottomNavbarHeight: number;
    public defaultCardWidth: number;
    public defaultCardHeight: number;
    public defaultCardStyle: Object;
    public level: number;

    //* [2016-05-27 16:01] Timer for scores
    //#region totalScore
    public _totalScore: number;
    get totalScore(): number {
        return this._totalScore;
    }
    set totalScore(value: number) {
        this._totalScore = (value >= 0) ? value : 0;
        $(this.pgScore).css('width', Math.floor(value / this.glScore * 100).toString() + "%");
    }
    //#endregion totalScore

    public glScore: number;
    public localMinusScore: number;
    public scoreTimerId: number;
    public maxDelScore: number = 20;
    public pgScore: HTMLDivElement = document.getElementById('pgScore') as HTMLDivElement;

    public static Current: PlayOneCategoryPageController;
    public static scope;
    public static oneOverNWindow: number = 5;
    public static styleSelWCard: string = "selWCard";

    //#region rate2PowN
    private _rate2PowN: number = 0;
    get rate2PowN(): number {
        return this._rate2PowN;
    }
    set rate2PowN(value: number) {
        var meAud = this.meCardsAudio;
        meAud.defaultPlaybackRate = Math.pow(2, value);
        this._rate2PowN = value;
    }
    //#endregion rate2PowN
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
        if (GlobalVariables.PlayType != value) {
            if (value === PlayTypeEnum.rec) {
                if (PlayOneCategoryPageController.Current.scoreTimerId) {
                    clearInterval(PlayOneCategoryPageController.Current.scoreTimerId);
                    PlayOneCategoryPageController.Current.scoreTimerId = null;
                    PlayOneCategoryPageController.Current.localMinusScore = 0;
                }
            }
            else if (value === PlayTypeEnum.hint) {
                PlayOneCategoryPageController.Current.totalScore -= PlayOneCategoryPageController.Current.maxDelScore;
            }
            
            GlobalVariables.PlayType = value;
            //* [2016-05-27] Change the state of the card.
            if (PlayOneCategoryPageController.Current.selWCard) {
                $(PlayOneCategoryPageController.Current.selWCard.viewCard).removeClass(PlayOneCategoryPageController.styleSelWCard);
            }
        }
    }
    //#endregion PlayType

    public ClearBeforeLeavePage() {
        $(window).off('resize',PlayOneCategoryPageController.Current.onWindowResize);  
        $(document).off('click', PlayOneCategoryPageController.Current.onPlayBGSound);
        if (PlayOneCategoryPageController.Current.scoreTimerId)
            clearTimeout(PlayOneCategoryPageController.Current.scoreTimerId);
    }

    constructor($scope, $routeParams) {
        //* [2016-06-06 12:04] Reload the web page if needed.
        VersionHelper.ReloadIfNeeded();

        PlayOneCategoryPageController.Current = this;
        PlayOneCategoryPageController.scope = $scope;
        WCard.CleanWCards();

        //*[2016-06-07 14:27] Try to clear this Controller's actions
        $scope.$on('$routeChangeStart', function (ev, next, current) {
            PlayOneCategoryPageController.Current.ClearBeforeLeavePage();
        });

        if (GlobalVariables.isIOS)
            $(PlayOneCategoryPageController.Current.imgBackground).css('cursor', 'pointer');

        this.btSynPlay.addEventListener("click", this.synPlay_Click); // For iPhone

        GlobalVariables.currentDocumentSize = [$(document).innerWidth(), $(document).innerHeight()];
        $(this.dlDblClickWCard).dialog({ autoOpen: false, modal: true });
        $(this.dlFinish).dialog({
            autoOpen: false, modal: true, dialogClass: "no-close",
            buttons: [{
                text: "OK",
                click: function () {
                    history.back();
                    $(PlayOneCategoryPageController.Current.dlFinish).dialog('close');
                }
            }]
        });
        $(document).tooltip();

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
        var pathOrUri: string = CardsHelper.GetTreatablePath(GlobalVariables.categoryListFileName, this.Container, this.CFolder);
        if (GlobalVariables.isLog)
            console.log("PlayOneCategoryPage:constructor:pathOrUri= " + pathOrUri);
        MyFileHelper.FeedTextFromTxtFileToACallBack(
            pathOrUri,
            WCard.restWCards,
            ShowWCardsAndEventsCallback);

        $(window).on("resize", PlayOneCategoryPageController.Current.onWindowResize);
        //* [2016-06-08 09:44] Force it to rearrange all the cards after 2.5 second.
        setTimeout(function () {
            CardsHelper.RearrangeCards(WCard.showedWCards, PlayOneCategoryPageController.oneOverNWindow, false, true);
        }, 2500);
    }

    //#region *EVENTS
    public onPlayBGSound = function (ev) {
        PlayOneCategoryPageController.Current.meBackground.load();
        PlayOneCategoryPageController.Current.meBackground.play();
    };

    public onWindowResize = function (ev) {
        //* [2016-05-20 11:40] Resize only when the document's size is changed.
        if (GlobalVariables.currentDocumentSize[0] === $(document).innerWidth() && GlobalVariables.currentDocumentSize[1] === $(document).innerHeight())
            return;
        GlobalVariables.currentDocumentSize[0] = $(document).innerWidth();
        GlobalVariables.currentDocumentSize[1] = $(document).innerHeight();

        var wcards = WCard.showedWCards;
        CardsHelper.RearrangeCards(wcards, PlayOneCategoryPageController.oneOverNWindow);

        PlayOneCategoryPageController.scope.$apply(function () {
            if (wcards.length > 0) {
                PlayOneCategoryPageController.Current.defaultCardStyle = {
                    width: PlayOneCategoryPageController.Current.defaultCardWidth + "px",
                    height: PlayOneCategoryPageController.Current.defaultCardHeight + "px"
                };
            }
        });
    };
    public ShowNewWCards_Click = function () {
        //* [2016-05-24 14:46] Remove the style of animation
        if (PlayOneCategoryPageController.Current.selWCard)
            $(PlayOneCategoryPageController.Current.selWCard.viewCard).removeClass(PlayOneCategoryPageController.styleSelWCard);
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
    public Smaller_Click = function (ev:Event) {
        PlayOneCategoryPageController.oneOverNWindow *= 1.2;
        CardsHelper.RearrangeCards(WCard.showedWCards, PlayOneCategoryPageController.oneOverNWindow,false,true,1/1.2);
        PlayOneCategoryPageController.Current.defaultCardStyle = {
            width: PlayOneCategoryPageController.Current.defaultCardWidth + "px",
            height: PlayOneCategoryPageController.Current.defaultCardHeight + "px"
        };

        if (PlayOneCategoryPageController.Current.isBGAlsoChange) {
            var bGObj = PlayOneCategoryPageController.Current.imgBackground;
            $(bGObj).css(
                {
                    'width':Math.round(bGObj.clientWidth/1.2)+"px",
                    'height':Math.round(bGObj.clientHeight/1.2)+"px"
                });
        }

        ev.stopPropagation();
    };
    public Larger_Click = function (ev: Event) {
        PlayOneCategoryPageController.oneOverNWindow /= 1.2;
        CardsHelper.RearrangeCards(WCard.showedWCards, PlayOneCategoryPageController.oneOverNWindow,false,true,1.2);
        PlayOneCategoryPageController.Current.defaultCardStyle = {
            width: PlayOneCategoryPageController.Current.defaultCardWidth + "px",
            height: PlayOneCategoryPageController.Current.defaultCardHeight + "px"
        };

        if (PlayOneCategoryPageController.Current.isBGAlsoChange) {
            var bGObj = PlayOneCategoryPageController.Current.imgBackground;
            $(bGObj).css(
                {
                    'width': Math.round(bGObj.clientWidth * 1.2)+"px",
                    'height': Math.round(bGObj.clientHeight * 1.2)+"px"
                });
        }

        ev.stopPropagation();
    };
    //#endregion **resize WCards
    public Arrange_Click = function (isRandomly: boolean) {
        CardsHelper.RearrangeCards(WCard.showedWCards, PlayOneCategoryPageController.oneOverNWindow, isRandomly, false);
    };

    public OpenHyperLink_Click = function () {
        if (PlayOneCategoryPageController.Current.hyperLink)
            window.open(PlayOneCategoryPageController.Current.hyperLink);
    }

    /**
     * Play an audio
    **/
    public synPlay_Click = function (ev:Event) {
        //* [2016-05-25 14:29] If there is no synAnsWCard is selected, take one of them
        if (!PlayOneCategoryPageController.Current.synAnsWCard) {
            PlayOneCategoryPageController.Current.synPlayNext_Click(null);
        }
        //* [2016-05-25 14:30] After updating, it should have gotten one synAnsWCard
        if (PlayOneCategoryPageController.Current.synAnsWCard) {
            var synAnsWCard = PlayOneCategoryPageController.Current.synAnsWCard;
            if (synAnsWCard.cardInfo.AudioFilePathOrUri) {
                var meAud = PlayOneCategoryPageController.Current.meCardsAudio;
                meAud.src = CardsHelper.GetTreatablePath(synAnsWCard.cardInfo.AudioFilePathOrUri,
                    PlayOneCategoryPageController.Current.Container,
                    PlayOneCategoryPageController.Current.CFolder);
                meAud.load();
                meAud.play();
            }

            //* [2016-05-27 17:40] Update a timer
            if (!PlayOneCategoryPageController.Current.scoreTimerId) {
                PlayOneCategoryPageController.Current.localMinusScore = 0;
                PlayOneCategoryPageController.Current.scoreTimerId = setInterval(function () {
                    if ($(PlayOneCategoryPageController.Current.ddSettings).css('display') != 'none')
                        return;
                    PlayOneCategoryPageController.Current.localMinusScore++;
                    var score = PlayOneCategoryPageController.Current.localMinusScore;
                    if (score > PlayOneCategoryPageController.Current.maxDelScore) {
                        clearInterval(PlayOneCategoryPageController.Current.scoreTimerId);
                        PlayOneCategoryPageController.Current.scoreTimerId = null;
                    }
                    else {
                        PlayOneCategoryPageController.scope.$apply(function () {
                            PlayOneCategoryPageController.Current.totalScore--;
                        });
                    }
                }, 1000);
            }
        }
    };
    /**
     * Choose next one to play
    **/
    public synPlayNext_Click = function (ev:Event) {
        var wcards = WCard.showedWCards;
        //* [2016-05-23 14:57] If there is no WCard, renew it
        if (wcards.length === 0) {
            PlayOneCategoryPageController.Current.ShowNewWCards_Click();
            wcards = WCard.showedWCards;
        }
        //* [2016-05-23 14:57] After renewing, if there is still no WCard, back to previous page
        if (wcards.length === 0) {
            //history.back();
            PlayOneCategoryPageController.Current.ShowdlFinish();
            return;
        }
        //* [2016-05-23 14:59] Since wcards.length!=0, choose one WCard randomly.
        var ith: number = MathHelper.MyRandomN(0, wcards.length - 1);
        PlayOneCategoryPageController.Current.synAnsWCard = wcards[ith];
        PlayOneCategoryPageController.Current.synPlay_Click(ev);
    };

    public recCheckAnswer_Click = function () {
        if (PlayOneCategoryPageController.Current.selWCard && PlayOneCategoryPageController.Current.recInputSentence && PlayOneCategoryPageController.Current.selWCard.cardInfo.Dictate.trim().
            indexOf(PlayOneCategoryPageController.Current.recInputSentence.trim()) === 0) {
            $(PlayOneCategoryPageController.Current.selWCard.viewCard).animate({ opacity: 0.1 }, {
                duration: 100,
                step: function (now, fx) {
                    $(this).css('transform', 'scale(' + 1 / now + ',' + 1 / now + ')');
                },
                complete: function () {
                    if(PlayOneCategoryPageController.Current.selWCard)
                        PlayOneCategoryPageController.Current.selWCard.RemoveThisWCard();
                    PlayOneCategoryPageController.Current.selWCard = null;
                    if (WCard.showedWCards.length === 0)
                        PlayOneCategoryPageController.Current.ShowNewWCards_Click();
                    if (WCard.showedWCards.length === 0) {
                        //history.back();
                        PlayOneCategoryPageController.Current.ShowdlFinish();
                        return;
                    }
                }
            });
        }
        else {
            if (PlayOneCategoryPageController.Current.selWCard) {
                alert("Your answer is wrong.");
                PlayOneCategoryPageController.Current.totalScore -= 3;
            }
            else {
                alert("Click a card at first.");
            }
        }
    };
    //#endregion *EVENTS

    //#region For Score
    public SetGlobalScore(wcards: WCard[]) {
        this.glScore = this.maxDelScore * wcards.length;
        this.totalScore = this.glScore;
    }
    //#endregion For Score

    public ShowdlFinish() {
        var nFinal = PlayOneCategoryPageController.Current.totalScore;
        var nAll = PlayOneCategoryPageController.Current.glScore;
        PlayOneCategoryPageController.scope.$apply(function () {
            PlayOneCategoryPageController.Current.level = Math.max(0, Math.round(
                (nFinal / nAll - 0.5) * 20
            ));
        });
        $(PlayOneCategoryPageController.Current.dlFinish).dialog('open');
        PlayOneCategoryPageController.Current.meBackground.pause();
    }
}
function ShowWCardsAndEventsCallback(jsonTxt: string, restWcards: WCard[]) {
    var showedWcards: WCard[] = WCard.showedWCards;
    var ith: number = 0;
    //* [2016-05-20 16:03] Initialize hyperLink & WCards & Background
    var jObj = JSON.parse(jsonTxt);
    CardsHelper.GetWCardsCallback(jObj, restWcards); //Get WCards
    PlayOneCategoryPageController.Current.hyperLink = jObj["Link"]; //Get HyperLink
    if (jObj["Background"]) {
        if (jObj["Background"]["ImgStyle"]) {
            var myStyle = jObj["Background"]["ImgStyle"];
            myStyle = CardsHelper.CorrectBackgroundStyle(myStyle, PlayOneCategoryPageController.Current.Container, PlayOneCategoryPageController.Current.CFolder);
            $(PlayOneCategoryPageController.Current.imgBackground).css(myStyle); //Get Background Image
        }

        if (jObj["Background"]["AudioProperties"]) {
            $(PlayOneCategoryPageController.Current.meBackground).prop(jObj["Background"]["AudioProperties"]);
            //PlayOneCategoryPageController.Current.meBackground.load();
            //PlayOneCategoryPageController.Current.meBackground.play();
            //$(PlayOneCategoryPageController.Current.meBackground).one("loadstart", function () {
            //    PlayOneCategoryPageController.Current.isBackAudioStartLoad = true;
            //});
            $(document).one("click", PlayOneCategoryPageController.Current.onPlayBGSound);
        }
    }
    //* [2016-05-27 16:07] Set the global Score
    PlayOneCategoryPageController.Current.SetGlobalScore(restWcards);

    for (var i0 = 0; i0 < restWcards.length; i0++) {

        //* [2016-05-10 17:23] For singleClick   :TODO:
        $(restWcards[i0]).on(GlobalVariables.onSingleClick, { thisWCard: restWcards[i0] }, function (ev) {
            var prevWCard = PlayOneCategoryPageController.Current.selWCard;
            var selWCard = ev.data.thisWCard as WCard;
            PlayOneCategoryPageController.scope.$apply(function () {
                PlayOneCategoryPageController.Current.selWCard = selWCard;
            });
            //* [2016-05-23 15:45] If it is under synthesizer mode
            if (PlayOneCategoryPageController.Current.playType === PlayTypeEnum.syn) {
                if (selWCard === PlayOneCategoryPageController.Current.synAnsWCard) {
                    //** [2016-05-27 16:21] Stop the timer
                    if (PlayOneCategoryPageController.Current.scoreTimerId) {
                        clearInterval(PlayOneCategoryPageController.Current.scoreTimerId);
                        PlayOneCategoryPageController.Current.scoreTimerId = null;
                    }
                    //** [2016-05-23] Show animation to annihilate the card
                    $(selWCard.viewCard).animate({ opacity: 0.1 }, {
                        duration: 200,
                        step: function (now, fx) {
                            $(this).css('transform', 'scale(' + 1 / now + ',' + 1 / now + ')');
                        },
                        complete: function () {
                            PlayOneCategoryPageController.Current.selWCard.RemoveThisWCard();
                            PlayOneCategoryPageController.Current.synAnsWCard = null;
                            PlayOneCategoryPageController.Current.synPlayNext_Click(null);
                            PlayOneCategoryPageController.scope.$apply(function () {
                                PlayOneCategoryPageController.Current.synAnsWCard;
                            });
                        }
                    });
                }
                else {
                    //** [2016-05-27 16:35] If no synAnsWCard, show a popup to warn the user that they didn't click the play yet.
                    if (!PlayOneCategoryPageController.Current.synAnsWCard) {
                        $('#btSynPlay').tooltip({
                            content: "You need to click this button at first!"
                        })
                            .tooltip('open');

                        return;
                    }

                    //** [2016-05-27 16:25] Take some score if the user click the wrong wcard
                    if (PlayOneCategoryPageController.Current.scoreTimerId) {
                        var delScore = 2;
                        if (PlayOneCategoryPageController.Current.localMinusScore + 2 > PlayOneCategoryPageController.Current.maxDelScore) {
                            delScore = Math.max(0, PlayOneCategoryPageController.Current.maxDelScore - PlayOneCategoryPageController.Current.localMinusScore);
                        }
                        PlayOneCategoryPageController.Current.totalScore -= delScore;
                        PlayOneCategoryPageController.Current.localMinusScore += 2;
                    }
                    //** [2016-05-23] Show animation to show that the user choose a wrong answer
                    $(selWCard.viewCard).animate({ opacity: 0.5 }, {
                        duration: 100,
                        step: function (now, fx) {
                            $(this).css('transform', 'rotate(' + (1 - now) * 360 + 'deg)');
                        },
                        complete: function () {
                            $(this).animate({ opacity: 1 }, {
                                duration: 100,
                                step: function (now, fx) {
                                    $(this).css('transform', 'rotate(' + (1 - now) * 360 + 'deg)');
                                }
                            });
                        }
                    });
                }
            }
            //* [2016-05-24 10:51] else if it is under recognizer mode
            else if (PlayOneCategoryPageController.Current.playType === PlayTypeEnum.rec) {
                if (prevWCard)
                    $(prevWCard.viewCard).removeClass(PlayOneCategoryPageController.styleSelWCard);
                $(selWCard.viewCard).addClass(PlayOneCategoryPageController.styleSelWCard);
            }
            //* [2016-05-24 14:40] else if it is under hint mode
            else if (PlayOneCategoryPageController.Current.playType === PlayTypeEnum.hint) {
                if (prevWCard)
                    $(prevWCard.viewCard).removeClass(PlayOneCategoryPageController.styleSelWCard);
                $(selWCard.viewCard).addClass(PlayOneCategoryPageController.styleSelWCard);
            }
        });

        //* [2016-05-10 17:23] For doubleClick   :TODO:
        $(restWcards[i0]).on(GlobalVariables.onDoubleClick, { thisWCard: restWcards[i0] }, function (ev) {
            PlayOneCategoryPageController.scope.$apply(function () {
                PlayOneCategoryPageController.Current.selWCard = ev.data.thisWCard;
            });
            var selWCard = PlayOneCategoryPageController.Current.selWCard;

            CardsHelper.ShowHLinkAndDesDialog(selWCard, PlayOneCategoryPageController.Current.dlDblClickWCard);
        });

        //* [2016-05-19 20:02] Make it resizable
        if(!restWcards[i0].cardInfo.IsSizeFixed)
            $(restWcards[i0].viewCard).draggable();
        if(!restWcards[i0].cardInfo.IsXPosFixed || !restWcards[i0].cardInfo.IsYPosFixed)
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
        PlayOneCategoryPageController.Current.defaultCardStyle = {
            width: PlayOneCategoryPageController.Current.defaultCardWidth + "px",
            height: PlayOneCategoryPageController.Current.defaultCardHeight + "px"
        };
    }
}
