/// <reference path="../helpers/speechrecognitionhelper.ts" />
/// <reference path="../models/eachrecord.ts" />
/// <reference path="../helpers/speechsynthesishelper.ts" />
/// <reference path="../scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../globalvariables/globalvariables.ts" />
/// <reference path="../usercontrols/wcard.ts" />
/// <reference path="../helpers/indexeddbhelper.ts" />
/// <reference path="../scripts/typings/jqueryui/jqueryui.d.ts" />
/// <reference path="../models/mycategoryjson.ts" />
/// <reference path="../mytpdefinitions/chrome.d.ts" />
/// <reference path="../helpers/tutorialhelper.ts" />

class PlayOneCategoryPageController{
    public Container: string;
    public CFolder: string;
    public selWCard: WCard;
    public synAnsWCard: WCard;
    public hyperLink: string;
    public meCardsAudio: HTMLAudioElement = document.getElementById('meCardsAudio') as HTMLAudioElement;
    public meBackground: HTMLAudioElement = document.getElementById('meBackground') as HTMLAudioElement;
    public dlDblClickWCard: HTMLDivElement = document.getElementById('dlDblClickWCard') as HTMLDivElement;
    public dlFinish: HTMLDivElement = document.getElementById('dlFinish') as HTMLDivElement;
    public dlDictateSelected: HTMLDivElement = document.getElementById('dlDictateSelected') as HTMLDivElement;
    public ddSettings: HTMLElement = document.getElementById('ddSettings') as HTMLElement;
    public imgBackground: HTMLDivElement = document.getElementById('imgBackground') as HTMLDivElement;
    public btSynPlay: HTMLButtonElement = document.getElementById('btSynPlay') as HTMLButtonElement;
    public btLangSettings: HTMLButtonElement = document.getElementById('dropdownLangSettings') as HTMLButtonElement;
    public rdTutorType: HTMLDivElement = document.getElementById('rdTutorType') as HTMLDivElement;
    public cvMain: HTMLDivElement = document.getElementsByClassName('cvMain')[0] as HTMLDivElement;
    public btPauseAudio: HTMLButtonElement = document.getElementById('btPauseAudio') as HTMLButtonElement;
    public btAudioAllPlay: HTMLButtonElement = document.getElementById('btAudioAllPlay') as HTMLButtonElement;
    public topNavbar: HTMLElement = document.getElementById('topNavbar') as HTMLElement;
    public bottomNavbar: HTMLElement = document.getElementById('bottomNavbar') as HTMLElement;

    public isHiddingSynTB: boolean = false;

    public selTextsForSyn: string = "";

    public isBackAudioStartLoad: boolean = false;
    public isAudioPlaying: boolean = false;

    //#region speechRecogMetadata
    private _speechRecogMetadata: SpeechRecgMetadata = {confidence:0, isSpeechRecognitionRunning:false, recInputSentence:""};
    get speechRecogMetadata(): SpeechRecgMetadata {
        return this._speechRecogMetadata;
    }
    set speechRecogMetadata(value: SpeechRecgMetadata) {
        this._speechRecogMetadata = value;
    }
    //#endregion speechRecogMetadata

    public isBGAlsoChange: boolean = true;

    public defaultCardWidth: number;
    public defaultCardHeight: number;
    public defaultCardStyle: Object = { width: "16vw", height: "16vh" };
    public level: number;

    public nImgLoad: number = 0;
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
    public isHighest: boolean = false;

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

            //* [2016-07-07 10:40] Added to trigger an event when PlayType is changed
            $(PlayOneCategoryPageController.Current.ddSettings).trigger(GlobalVariables.PlayTypeChangeKey);
        }
    }
    //#endregion PlayType

    //#region For SpeechSynthesis
    get synAllVoices(): Array<SpeechSynthesisVoice_Instance> {
        return GlobalVariables.allVoices;
    }
    set synAllVoices(value: Array<SpeechSynthesisVoice_Instance>) {
        GlobalVariables.allVoices = value;
    }

    private _currentSynVoice: SpeechSynthesisVoice_Instance;
    get currentSynVoice(): SpeechSynthesisVoice_Instance { return this._currentSynVoice; }
    set currentSynVoice(value: SpeechSynthesisVoice_Instance) {
        if (value != this._currentSynVoice) {
            this._currentSynVoice = value;
            this.SynLang = value.lang;
            if (GlobalVariables.isTutorMode) {
                $(PlayOneCategoryPageController.Current.btLangSettings).trigger(GlobalVariables.SynVoiceChangeKey);   
            }
        }
    }

    public SynLang: string;
    //#endregion For SpeechSynthesis
    //#region for SpeechRecognition
    get isHavingSpeechRecognier(): boolean {
        return GlobalVariables.isHavingSpeechRecognier;
    }
    //#endregion for SpeechRecognition
//#region TutorType
    get TutorType(): string {
        return TutorMainEnum[GlobalVariables.tutorState.Main];
    }
    set TutorType(value: string) {
        if (value === TutorMainEnum[GlobalVariables.tutorState.Main])
            return;
        $(PlayOneCategoryPageController.Current.rdTutorType).trigger(GlobalVariables.TutorTypeChangeKey);
        //* [2016-07-07 07:56] Default 
        GlobalVariables.isTutorMode = true;
        $(PlayOneCategoryPageController.Current.rdTutorType).prop('disabled', true);

        switch (value) {
            case TutorMainEnum[TutorMainEnum.Begin]:
                GlobalVariables.isTutorMode = true;
                $(PlayOneCategoryPageController.Current.rdTutorType).removeProp('disabled');
                GlobalVariables.tutorState = { Main: TutorMainEnum.Begin, Step: 0 };
                break;
            case TutorMainEnum[TutorMainEnum.Basic]:
                GlobalVariables.tutorState = { Main:TutorMainEnum.Basic, Step:0 };
                break;
            case TutorMainEnum[TutorMainEnum.Hint]:
                GlobalVariables.tutorState = { Main: TutorMainEnum.Hint, Step: 0 };
                break;
            case TutorMainEnum[TutorMainEnum.KeyIn]:
                GlobalVariables.tutorState = { Main: TutorMainEnum.KeyIn, Step: 0 };
                break;
            case TutorMainEnum[TutorMainEnum.End]:
                GlobalVariables.isTutorMode = false;
                $("#dropdownMenuPlayPageSettings").removeClass('blink');
                $(PlayOneCategoryPageController.Current.rdTutorType).removeAttr('disabled');
                GlobalVariables.tutorState = { Main: TutorMainEnum.End, Step: 0 };
                PlayOneCategoryPageController.Current.playType = PlayTypeEnum.syn;
                break;
            default:
                GlobalVariables.isTutorMode = false;
                $(PlayOneCategoryPageController.Current.rdTutorType).removeProp('disabled');
                break;
        }

        TutorialHelper.Action(GlobalVariables.tutorState);
    }
//#endregion TutorType
//#region thisPageTexts
    get thisPageTexts(): PlayOneCategoryPageJSON {
        if (!GlobalVariables.PageTexts)
            GlobalVariables.PageTexts = PageTextHelper.defaultPageTexts;
        return GlobalVariables.PageTexts.PlayOneCategoryPageJSON;
    }
    set thisPageTexts(value: PlayOneCategoryPageJSON) {
        //Do nothing. It is just for notifying this controller that it is changed.
    }
//#endregion thisPageTexts

    //#region for EachRecord
    public eachRecord: EachRecord = {UCC:null,SynLang:"en-US",history:'[]',nextTime:0,RecLang:"en-US",highestScore:0};
    //#endregion for EachRecord

    public ClearBeforeLeavePage() {
        $(window).off('resize',PlayOneCategoryPageController.Current.onWindowResize);  
        $(document).off('click', PlayOneCategoryPageController.Current.onPlayBGSound);
        if (PlayOneCategoryPageController.Current.scoreTimerId)
            clearTimeout(PlayOneCategoryPageController.Current.scoreTimerId);
        $(GlobalVariables.gdTutorElements.gdMain).hide(0);
        $(PlayOneCategoryPageController.Current.btPauseAudio).off('click');
        $(GlobalVariables.synUtterance).off('start error end pause');
        $(document).off(GlobalVariables.AViewCardShownKey, PlayOneCategoryPageController.Current.onAViewCardShown);
        $(PlayOneCategoryPageController.Current.dlDictateSelected).children(".tbSentence").off("select");
    }

    constructor($scope, $routeParams) {
        //* [2016-06-06 12:04] Reload the web page if needed.
        VersionHelper.ReloadIfNeeded();

        PlayOneCategoryPageController.oneOverNWindow = 5; //Initialize it to avoid the value gotten from other Category.
        //* [2016-08-01 11:12] RearrangeCards if some images are loaded
        $(document).on(GlobalVariables.AViewCardShownKey, this.onAViewCardShown);

        SpeechRecognizerHelper.iniSpeechRecognition();

        PlayOneCategoryPageController.Current = this;
        PlayOneCategoryPageController.scope = $scope;

        WCard.CleanWCards();

        //* [2016-07-16 13:57] Shift all the cards
        $(PlayOneCategoryPageController.Current.cvMain).css({
            top:
            $(PlayOneCategoryPageController.Current.topNavbar).height() + "px"
        });

        //* [2016-07-11 15:02] Because its language might not ready, I use a trigger to tell me that it is done
        var renewPageTexts = () => {
            PlayOneCategoryPageController.scope.$apply(() => {
                PlayOneCategoryPageController.Current.thisPageTexts = null;
            });
            $(document).off(GlobalVariables.PageTextChangeKey, renewPageTexts);
        };
        $(document).off(GlobalVariables.PageTextChangeKey, renewPageTexts);
        $(document).on(GlobalVariables.PageTextChangeKey, renewPageTexts);

        //* [2016-08-01 18:00] Get Tutorial Mode from LocalStorage
        if (typeof (Storage) !== "undefined")
            GlobalVariables.isTutorMode= (localStorage.getItem(GlobalVariables.IsShownTutorKey)!="false");
        //* [2016-07-05 15:16] Show tutorial
        if (GlobalVariables.isTutorMode) {
            this.TutorType = TutorMainEnum[TutorMainEnum.Begin];
            TutorialHelper.Action(GlobalVariables.tutorState);
        }

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
                icons: {primary: "ui-icon-check"},
                click: function () {
                    if (history.length > 1)
                        history.back();
                    else
                        location.href = "/";
                    $(PlayOneCategoryPageController.Current.dlFinish).dialog('close');
                }
            }, {
                    text: "Again",
                    icons: { primary: "ui-icon-arrowrefresh-1-e" },
                    click: function () {
                        $(PlayOneCategoryPageController.Current.dlFinish).dialog('close');
                        //location.reload(true);
                        //location.href = location.href;
                        var pathOrUri: string = CardsHelper.GetTreatablePath(GlobalVariables.categoryListFileName, PlayOneCategoryPageController.Current.Container, PlayOneCategoryPageController.Current.CFolder);
                        PlayOneCategoryPageController.scope.$apply(() => { PlayOneCategoryPageController.Current.isHighest = false;});
                        MyFileHelper.FeedTextFromTxtFileToACallBack(
                            pathOrUri,
                            WCard.restWCards,
                            ShowWCardsAndEventsCallback);
                    }
                }]
        });
        $(this.dlDictateSelected).dialog(<JQueryUI.DialogOptions>{
            autoOpen: false, modal: true,
            buttons: [{
                icons: { primary: "ui-icon-triangle-1-e" },
                text:"Play",
                click: () => {
                    if (GlobalVariables.synthesis && GlobalVariables.synUtterance) {
                        if (GlobalVariables.synthesis.paused)
                            GlobalVariables.synthesis.resume();
                        SpeechSynthesisHelper.Speak(PlayOneCategoryPageController.Current.selTextsForSyn,
                            PlayOneCategoryPageController.Current.SynLang,
                            PlayOneCategoryPageController.Current.currentSynVoice,
                            Math.pow(2, PlayOneCategoryPageController.Current.rate2PowN)
                        );
                    }
                }
            }]
        });
        $(this.dlDictateSelected).children(".tbSentence").select((ev) => {
            var target: HTMLTextAreaElement = ev.target as HTMLTextAreaElement;
            PlayOneCategoryPageController.Current.selTextsForSyn = $(target).text().substring(target.selectionStart, target.selectionEnd);
        });
        //$(document).tooltip();

        if ($routeParams["Container"] != undefined)
            GlobalVariables.currentMainFolder = $routeParams["Container"];
        if ($routeParams["CFolder"] != undefined)
            GlobalVariables.currentCategoryFolder = $routeParams["CFolder"];
        this.Container = GlobalVariables.currentMainFolder;
        this.CFolder = GlobalVariables.currentCategoryFolder;

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
        //* [2016-06-11 15:46] Show it in a suitable size
        if ($(window).height() > $(window).width())
            PlayOneCategoryPageController.oneOverNWindow *= $(window).width() / $(window).height();

        //* [2016-07-19 12:21] Get the record and recommand the user to use recode mode if their stage level is higher than 5.
        IndexedDBHelper.GetARecordAsync(PlayOneCategoryPageController.Current.eachRecord,
            () => {
                var history = JSON.parse(PlayOneCategoryPageController.Current.eachRecord.history) as Array<LVsTime>;
                var playType: string;
                if (history && history.length > 0 && history[history.length-1].slv > 5) {
                    playType = PlayTypeEnum.rec;
                } else
                    playType = PlayTypeEnum.syn;
                PlayOneCategoryPageController.Current.playType = playType;
            });
        
    }

    //#region *EVENTS
    public onTB_Click() {
        var pPage = PlayOneCategoryPageController.Current;
        var tBJQuery = $(pPage.dlDictateSelected).children(".tbSentence");
        var texts: string;
        switch (pPage.playType) {
            case PlayTypeEnum.syn:
                texts = $("#tbSyn").text();
                tBJQuery.text(texts);
                break;
            case PlayTypeEnum.hint:
                texts = $("#tbHint").text();
                tBJQuery.text(texts);
                break;
            default:
                break;
        };

        $(pPage.dlDictateSelected).dialog("open");
        (<HTMLTextAreaElement>tBJQuery[0]).selectionStart = 0;
        (<HTMLTextAreaElement>tBJQuery[0]).selectionEnd = texts.length;
        tBJQuery.select();
    };
    public onAViewCardShown(ev: Event) {
        PlayOneCategoryPageController.Current.nImgLoad++;
        if (PlayOneCategoryPageController.Current.nImgLoad === 1) {
            CardsHelper.RearrangeCards(WCard.showedWCards, PlayOneCategoryPageController.oneOverNWindow, false, true);
            //* [2016-08-11 13:16] Because almost all the cards will be loaded at the same time, I delayed the rearrangement to 1 second later to avoid useless Rearragement.
            setTimeout(() => {
                var nCurrent = PlayOneCategoryPageController.Current.nImgLoad;
                PlayOneCategoryPageController.Current.nImgLoad = 0;
                if (nCurrent <= 1)
                    return;
                else
                    PlayOneCategoryPageController.Current.onAViewCardShown(ev);
            }, 1000);
        }
    };

    public onPlayAllViewableWCard(ev) {
        if(GlobalVariables.synthesis)
            GlobalVariables.synthesis.cancel();

        var isPausing = false; //use to stop the recursive play
        var onClick = (ev) => {
            isPausing = true;
            PlayOneCategoryPageController.Current.PauseAudio();
            $('button.glyphicon-exclamation-sign, #dropdownMenuPlayPageSettings').prop('disabled', false);
            $(PlayOneCategoryPageController.Current.btPauseAudio).trigger(GlobalVariables.AudioPauseKey, AudioSequenceStateEnum.Pause);
        };
        $(PlayOneCategoryPageController.Current.btPauseAudio).off('click', onClick);
        $(PlayOneCategoryPageController.Current.btPauseAudio).on('click', onClick);
        //* [2016-07-12] 'ith' for the recursive calling to take the ith WCard
        var ith = MathHelper.FindIndex(WCard.showedWCards, PlayOneCategoryPageController.Current.selWCard);
        ith = (ith < 0) ? 0 : ith;
        var ith0 = ith;

        //* [2016-07-12] The callback for the recursive function
        var nextPlay = (ev) => {
            $(WCard.showedWCards[ith].viewCard).removeClass('selWCard');

            if (isPausing) {
                return;
            }

            ith++;
            if (ith < WCard.showedWCards.length) {
                PlayOneCategoryPageController.scope.$apply(() => {
                    PlayOneCategoryPageController.Current.selWCard = WCard.showedWCards[ith];
                });
                $(WCard.showedWCards[ith].viewCard).addClass('selWCard');
                PlayOneCategoryPageController.Current.PlayAudio(WCard.showedWCards[ith], nextPlay);
            } else {
                $(WCard.showedWCards[ith0].viewCard).addClass('selWCard');
                PlayOneCategoryPageController.scope.$apply(() => {
                    PlayOneCategoryPageController.Current.selWCard = WCard.showedWCards[ith0];
                });
                $('button.glyphicon-exclamation-sign, #dropdownMenuPlayPageSettings').prop('disabled', false);
                $(PlayOneCategoryPageController.Current.btPauseAudio).trigger(GlobalVariables.AudioPauseKey, AudioSequenceStateEnum.End);
                return;
            }
        };

        $('button.glyphicon-exclamation-sign, #dropdownMenuPlayPageSettings').prop('disabled', true);

        PlayOneCategoryPageController.Current.selWCard = WCard.showedWCards[ith];
        $(WCard.showedWCards[ith].viewCard).addClass('selWCard');
        PlayOneCategoryPageController.Current.PlayAudio(WCard.showedWCards[ith], nextPlay);
    }

    public onPlayBGSound = function (ev) {
        PlayOneCategoryPageController.Current.meBackground.load();
        PlayOneCategoryPageController.Current.meBackground.play();
    };

    public onReloadSynVoices= function (ev) {
        SpeechSynthesisHelper.getAllVoices(PlayOneCategoryPageController.Current.GetCurrentSynVoice);
        SpeechSynthesisHelper.getAllVoices(() => {
            if (GlobalVariables.allVoices && GlobalVariables.allVoices.length > 0) {
                var stVoice = "{";
                for (var key in PlayOneCategoryPageController.Current.currentSynVoice) {
                    stVoice += key +": "+ PlayOneCategoryPageController.Current.currentSynVoice[key] + ";\n";
                }
                stVoice += "}";
                alert("SynLang: " + PlayOneCategoryPageController.Current.SynLang + " ." + "Has allVoices." + "\n" +
                    "CurrentVoice: "+stVoice);
            } else
                alert("No Voice."+" isIOS="+GlobalVariables.isIOS);
        });
    }

    public onWindowResize = function (ev) {
        $(PlayOneCategoryPageController.Current.cvMain).css({
            top:
            $(PlayOneCategoryPageController.Current.topNavbar).height()+"px"
        });
        //* [2016-05-20 11:40] Resize only when the document's size is changed.
        if (GlobalVariables.currentDocumentSize[0] === $(document).innerWidth() && GlobalVariables.currentDocumentSize[1] === $(document).innerHeight())
            return;
        GlobalVariables.currentDocumentSize[0] = $(document).innerWidth();
        GlobalVariables.currentDocumentSize[1] = $(document).innerHeight();

        var wcards = WCard.showedWCards;
        CardsHelper.RearrangeCards(wcards, PlayOneCategoryPageController.oneOverNWindow);

        //PlayOneCategoryPageController.scope.$apply(function () {
        //    if (wcards.length > 0) {
        //        PlayOneCategoryPageController.Current.defaultCardStyle = {
        //            width: PlayOneCategoryPageController.Current.defaultCardWidth + "px",
        //            height: PlayOneCategoryPageController.Current.defaultCardHeight + "px"
        //        };
        //    }
        //});
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
        CardsHelper.RearrangeCards(WCard.restWCards, PlayOneCategoryPageController.oneOverNWindow, false, false, 1/1.2, true);
        CardsHelper.RearrangeCards(WCard.showedWCards, PlayOneCategoryPageController.oneOverNWindow,false,true,1/1.2);
        //PlayOneCategoryPageController.Current.defaultCardStyle = {
        //    width: PlayOneCategoryPageController.Current.defaultCardWidth + "px",
        //    height: PlayOneCategoryPageController.Current.defaultCardHeight + "px"
        //};

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
        CardsHelper.RearrangeCards(WCard.restWCards, PlayOneCategoryPageController.oneOverNWindow, false, false, 1.2, true);
        CardsHelper.RearrangeCards(WCard.showedWCards, PlayOneCategoryPageController.oneOverNWindow,false,true,1.2);
        //PlayOneCategoryPageController.Current.defaultCardStyle = {
        //    width: PlayOneCategoryPageController.Current.defaultCardWidth + "px",
        //    height: PlayOneCategoryPageController.Current.defaultCardHeight + "px"
        //};

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
            PlayOneCategoryPageController.Current.PlayAudio(synAnsWCard);

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
            PlayOneCategoryPageController.Current.FinalStep();
            return;
        }
        //* [2016-05-23 14:59] Since wcards.length!=0, choose one WCard randomly.
        var ith: number = MathHelper.MyRandomN(0, wcards.length - 1);
        var ithOld: number = wcards.indexOf(PlayOneCategoryPageController.Current.synAnsWCard);
        if (ithOld < 0)
            ith = MathHelper.MyRandomN(0, wcards.length - 1);
        else {
            ith = MathHelper.MyRandomN(0, wcards.length - 2);
            ith = (ith < ithOld) ? ith : ith+1;
        }
        PlayOneCategoryPageController.Current.synAnsWCard = wcards[ith];
        PlayOneCategoryPageController.Current.synPlay_Click(ev);
    };

    public recCheckAnswer_Click = function (ev: Event) {
        if (ev.type === "keyup" && (<KeyboardEvent>ev).key.toLowerCase() !== "enter")
            return;
        if (PlayOneCategoryPageController.Current.speechRecogMetadata.isSpeechRecognitionRunning)
            return;
        //* [2016-07-21 11:54] In order to make people easier to remember the stuff by their hearing, force it to pronounce it.
        if (PlayOneCategoryPageController.Current.selWCard)
            PlayOneCategoryPageController.Current.PlayAudio(PlayOneCategoryPageController.Current.selWCard);

        var anniWCard = () => {
            $(PlayOneCategoryPageController.Current.selWCard.viewCard).animate({ opacity: 0.1 }, {
                duration: 100,
                step: function (now, fx) {
                    $(this).css('transform', 'scale(' + 1 / now + ',' + 1 / now + ')');
                },
                complete: function () {
                    //* [2016-07-06 11:24] Triggered if it is in tutorial mode
                    if (GlobalVariables.isTutorMode)
                        $(PlayOneCategoryPageController.Current.cvMain).trigger(GlobalVariables.RemoveAWCardKey);

                    if (PlayOneCategoryPageController.Current.selWCard)
                        PlayOneCategoryPageController.Current.selWCard.RemoveThisWCard();
                    PlayOneCategoryPageController.Current.selWCard = null;
                    if (WCard.showedWCards.length === 0)
                        PlayOneCategoryPageController.Current.ShowNewWCards_Click();
                    if (WCard.showedWCards.length === 0) {
                        //history.back();
                        PlayOneCategoryPageController.Current.FinalStep();
                        return;
                    }
                }
            });
        };
        if (PlayOneCategoryPageController.Current.selWCard && PlayOneCategoryPageController.Current.speechRecogMetadata.recInputSentence) {
            var Answers = PlayOneCategoryPageController.Current.selWCard.cardInfo.Ans_KeyIn;
            var stInput = PlayOneCategoryPageController.Current.speechRecogMetadata.recInputSentence.trim();
            var isCorrect = false;
            for (var i0: number = 0; i0 < Answers.length; i0++) {
                if (Answers[i0].trim() === stInput) {
                    anniWCard();
                    isCorrect = true;
                    break;
                }
            }
            if (!isCorrect) {
                alert("Your answer is wrong.");
                PlayOneCategoryPageController.Current.totalScore -= 3;
            }
        }
        else {
            if (PlayOneCategoryPageController.Current.selWCard) {
                alert("Please input the answer.");
            }
            else {
                alert("Click a card at first.");
            }
        }
    };

    public StartSpeechRecognition_Click(ev: Event) {
        ev.stopPropagation();
        if (!this.selWCard) {
            this.recCheckAnswer_Click(null);
            return;
        }
        if (!GlobalVariables.isHavingSpeechRecognier)
            return;

        var selWCard = this.selWCard;
        if(selWCard)
            SpeechRecognizerHelper.StartSpeechRecognition(
                PlayOneCategoryPageController.Current.speechRecogMetadata,
                selWCard.cardInfo.Ans_Recog,
                selWCard.cardInfo.Ans_KeyIn,
                PlayOneCategoryPageController.Current.SynLang,
                PlayOneCategoryPageController.scope
            );
    }
    //#endregion *EVENTS

    //#region For Score
    public SetGlobalScore(wcards: WCard[]) {
        this.glScore = this.maxDelScore * wcards.length;
        this.totalScore = this.glScore;
    }
    //#endregion For Score

    public GetCurrentSynVoice() {
        //* [2016-06-29 15:16] Update SpeechSynthesis current voice
        PlayOneCategoryPageController.scope.$apply(() => {
            if (GlobalVariables.currentSynVoice)
                PlayOneCategoryPageController.Current.currentSynVoice = GlobalVariables.currentSynVoice;
            else if (GlobalVariables.allVoices && GlobalVariables.allVoices.length > 0) {
                var allVoices = GlobalVariables.allVoices;
                PlayOneCategoryPageController.Current.synAllVoices = null;
                PlayOneCategoryPageController.Current.synAllVoices = allVoices; //Try to force it to renew it
                var vVoice: SpeechSynthesisVoice_Instance;
                if (PlayOneCategoryPageController.Current.SynLang)
                    vVoice = SpeechSynthesisHelper.getSynVoiceFromLang(PlayOneCategoryPageController.Current.SynLang);
                PlayOneCategoryPageController.Current.currentSynVoice = (vVoice) ? vVoice : GlobalVariables.allVoices[0];
            }
        });
    };

    public FinalStep() {
        if (PlayOneCategoryPageController.Current.eachRecord.highestScore < PlayOneCategoryPageController.Current.totalScore) {
            PlayOneCategoryPageController.Current.eachRecord.highestScore = PlayOneCategoryPageController.Current.totalScore;
            //* [2016-08-04 09:38] Show animation to tell the user that he/she wins!
            PlayOneCategoryPageController.Current.isHighest = true;
            var iCount = 0;
            var iterateAnimateFun = (index, elem1) => {
                var angle: number = Math.PI * 2 * Math.random();
                var speed: number = 50 + 70 * Math.random(); //50% to 120%
                $(elem1).css({ top: "50vh", left: "50vw" });
                var dt: number = 1;
                $(elem1).animate({ top: Math.round(50 + speed * Math.cos(angle) * dt) + "vh", left: Math.round(50 + speed * Math.sin(angle) * dt) + "vw" }, 1000+index*10, () => {
                    if (iCount > 100)
                        return;
                    iCount++;
                    iterateAnimateFun(index, elem1);
                });
            };
            $(".imgStar").each((index, elem) => {
                iterateAnimateFun(index, elem);
            });
            setTimeout(PlayOneCategoryPageController.Current.ShowdlFinish, 4000);
        } else
            PlayOneCategoryPageController.Current.ShowdlFinish();
    }

    public ShowdlFinish() {
        var nFinal = PlayOneCategoryPageController.Current.totalScore;
        var nAll = PlayOneCategoryPageController.Current.glScore;
        var trueLV = Math.max(0, Math.round( (nFinal / nAll - 0.5) * 20 ));
        //* [2016-07-22 18:16] Let me update innerHTML
        var history = JSON.parse(PlayOneCategoryPageController.Current.eachRecord.history) as Array<LVsTime>;
        var stInnerHTML: string = PlayOneCategoryPageController.Current.thisPageTexts.stShowScore.replace("{0}", PlayOneCategoryPageController.Current.totalScore.toString())
        .replace("{1}",PlayOneCategoryPageController.Current.glScore.toString());
        if (history.length === 0) {
            if (trueLV >= 1) {
                stInnerHTML += PlayOneCategoryPageController.Current.thisPageTexts.stNewUpToOne;
                PlayOneCategoryPageController.Current.level = 1;
            }
            else {
                stInnerHTML += PlayOneCategoryPageController.Current.thisPageTexts.stNewBackTo0;
                PlayOneCategoryPageController.Current.level = 0;
            }
            PlayOneCategoryPageController.Current.eachRecord.nextTime = Date.now() + 86400000;
        } else {
            var cHistory: LVsTime = history.pop();
            var oldScore: number = cHistory.score;
            var oldLV: number = cHistory.slv;
            var increaseYourLevel = () => {
                if (PlayOneCategoryPageController.Current.eachRecord.nextTime > Date.now()) {
                    stInnerHTML +=PlayOneCategoryPageController.Current.thisPageTexts.stIncLVNotYet.replace('{0}',(Math.floor((PlayOneCategoryPageController.Current.eachRecord.nextTime - Date.now()) / 8640000)/10).toString() );
                    PlayOneCategoryPageController.Current.level = oldLV;
                } else {
                    var newTime = PlayOneCategoryPageController.Current.eachRecord.nextTime + Math.pow(2, oldLV / 2) * 86400000;
                    if ((newTime - 43200000) < Date.now())
                        newTime = Date.now() + 86400000;
                    stInnerHTML +=PlayOneCategoryPageController.Current.thisPageTexts.stIncLV.replace('{0}',( Math.floor((newTime - Date.now()) / 8640000)/10).toString());
                    PlayOneCategoryPageController.Current.level = oldLV + 1;
                    PlayOneCategoryPageController.Current.eachRecord.nextTime = newTime;
                };
            };
            var keepLevel = () => {
                var newTime = ((PlayOneCategoryPageController.Current.eachRecord.nextTime - 43200000) > Date.now()) ? PlayOneCategoryPageController.Current.eachRecord.nextTime : (Date.now() + 86400000);
                stInnerHTML += PlayOneCategoryPageController.Current.thisPageTexts.stKeepLV.replace('{0}',( Math.floor((newTime-Date.now()) / 8640000)/10).toString());
                PlayOneCategoryPageController.Current.level = oldLV;
                PlayOneCategoryPageController.Current.eachRecord.nextTime = newTime;
            };
            var backToLV0 = () => {
                stInnerHTML += PlayOneCategoryPageController.Current.thisPageTexts.stBackTo0;
                PlayOneCategoryPageController.Current.level = 0;
                PlayOneCategoryPageController.Current.eachRecord.nextTime = Date.now() + 86400000;
            };
            var NoteForKeyIn = () => {
                stInnerHTML += PlayOneCategoryPageController.Current.thisPageTexts.stNoteForKeyIn;
            };
            if (nFinal > oldScore) {
                if (trueLV > oldLV) {
                    increaseYourLevel();
                } else {
                    keepLevel();
                    NoteForKeyIn();
                }
            } else if (nFinal === oldScore) {
                if (oldScore === PlayOneCategoryPageController.Current.glScore || trueLV > oldLV) { //You have reach the highest score
                    increaseYourLevel();
                    stInnerHTML += PlayOneCategoryPageController.Current.thisPageTexts.stHandWriting;
                } else {
                    keepLevel();
                }
            } else if (nFinal < oldScore) {
                if (trueLV > oldLV) {
                    increaseYourLevel();
                } else {
                    backToLV0();
                };
                NoteForKeyIn();
            };
        };

        stInnerHTML = "<h1 style='text-align:center;'>LV" + PlayOneCategoryPageController.Current.level +"("+trueLV+")"+ "</h1>" + stInnerHTML;
        $(PlayOneCategoryPageController.Current.dlFinish).html(stInnerHTML);
        $(PlayOneCategoryPageController.Current.dlFinish).dialog('open');
        PlayOneCategoryPageController.Current.meBackground.pause();

        //* [2016-07-25 17:47] Unfortunately, event popstate is not triggered so that I move this code segment to this place to record the history
        var isAdd = (PlayOneCategoryPageController.Current.eachRecord.history === '[]') ? true : false;

        var lv: LVsTime = {
            slv: PlayOneCategoryPageController.Current.level,
            score: PlayOneCategoryPageController.Current.totalScore,
            ts: Date.now()
        };

        var lvs = JSON.parse(PlayOneCategoryPageController.Current.eachRecord.history) as Array<LVsTime>;
        lvs.push(lv);
        PlayOneCategoryPageController.Current.eachRecord.history = JSON.stringify(lvs);

        IndexedDBHelper.PutARecordAsync(PlayOneCategoryPageController.Current.eachRecord, isAdd);
    }

    /**
     * Use this function to utter a WCard's answer. The 'callback' will be called when it is complete
     * @param wCard Its type is WCard
     * @param callback handler: (JQueryEventObject)=>any. It will be called when the audio play is complete
     */
    public PlayAudio(wCard: WCard, callback:any=null) {
        if (wCard.cardInfo.AudioFilePathOrUri) {
            var meAud = PlayOneCategoryPageController.Current.meCardsAudio;
            meAud.src = CardsHelper.GetTreatablePath(wCard.cardInfo.AudioFilePathOrUri,
                PlayOneCategoryPageController.Current.Container,
                PlayOneCategoryPageController.Current.CFolder);
            meAud.load();
            meAud.play();
            //* [2016-07-21 12:17] To force user to listen the whole speech.
            $(meAud).one('playing', () => {
                PlayOneCategoryPageController.Current.isAudioPlaying = true;
            });
            $(meAud).one('ended', () => {
                PlayOneCategoryPageController.Current.isAudioPlaying = false;
            });
            //* [2016-07-12 22:03] If callback is provided, it will be excuted.
            if (callback) {
                $(meAud).one("ended", callback);
            }
        } else if (GlobalVariables.synthesis && GlobalVariables.synUtterance) {
            if (GlobalVariables.synthesis.paused)
                GlobalVariables.synthesis.resume();
            SpeechSynthesisHelper.Speak(wCard.cardInfo.Dictate,
                PlayOneCategoryPageController.Current.SynLang,
                PlayOneCategoryPageController.Current.currentSynVoice,
                Math.pow(2, PlayOneCategoryPageController.Current.rate2PowN)
            );
            //* [2016-07-12 22:17] If callback is provided, it will be executed.
            if (callback) {
                $(GlobalVariables.synUtterance).one("end", callback);
            }
        } else {
            if (callback)
                setTimeout(callback, 2000);
        }
    };

    public PauseAudio() {
        if (PlayOneCategoryPageController.Current.meCardsAudio)
            PlayOneCategoryPageController.Current.meCardsAudio.pause();
        if (GlobalVariables.synthesis && GlobalVariables.synUtterance)
            GlobalVariables.synthesis.cancel();
    };
}
function ShowWCardsAndEventsCallback(jsonTxt: string, restWcards: WCard[]) {
    var showedWcards: WCard[] = WCard.showedWCards;
    var ith: number = 0;
    //* [2016-05-20 16:03] Initialize hyperLink & WCards & Background
    var jObj = JSON.parse(jsonTxt) as MYCategoryJson;
    //* [2016-06-17 16:59] Initialize the settings inside the dropdown
    PlayOneCategoryPageController.scope.$apply(function () {
        if (jObj.numWCardShown) PlayOneCategoryPageController.numWCardShown = jObj.numWCardShown;
        if (jObj.isBGAlsoChange) PlayOneCategoryPageController.Current.isBGAlsoChange = jObj.isBGAlsoChange;
        if (jObj.isPickWCardsRandomly) PlayOneCategoryPageController.isPickWCardsRandomly = jObj.isPickWCardsRandomly;
    });
    PlayOneCategoryPageController.Current.SynLang = jObj.SynLang;
    SpeechSynthesisHelper.getAllVoices(() => {
        PlayOneCategoryPageController.Current.GetCurrentSynVoice();

        //* [2016-07-21 12:22] Force the user to listen up the whole sentence
        $(GlobalVariables.synUtterance).on('start', (ev) => {
            console.log('synUtterance.' + ev.type);
            PlayOneCategoryPageController.Current.isAudioPlaying = true;
        });
        $(GlobalVariables.synUtterance).on('error end pause', (ev) => {
            console.log('synUtterance.' + ev.type);
            PlayOneCategoryPageController.Current.isAudioPlaying = false;
        });
    });

    CardsHelper.GetWCardsCallback(jObj, restWcards); //Get WCards
    PlayOneCategoryPageController.Current.hyperLink = jObj.Link; //Get HyperLink
    if (jObj["Background"]) {
        var bgSettings = jObj.Background;
        if (bgSettings.ImgStyle) {
            var myStyle = bgSettings.ImgStyle;
            myStyle = CardsHelper.CorrectBackgroundStyle(myStyle, PlayOneCategoryPageController.Current.Container, PlayOneCategoryPageController.Current.CFolder);
            $(PlayOneCategoryPageController.Current.imgBackground).css(myStyle); //Get Background Image
        }

        if (bgSettings.AudioProperties) {
            $(PlayOneCategoryPageController.Current.meBackground).prop(bgSettings.AudioProperties);
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
                //* [2016-07-21 12:26] Force the user to listen up the whole sentence before they can select the correct card.
                if (PlayOneCategoryPageController.Current.isAudioPlaying) {
                    alert(PlayOneCategoryPageController.Current.thisPageTexts.stWaitUtterDone);
                    return;
                }
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

                            //* [2016-07-06 11:24] Triggered if it is in tutorial mode
                            if (GlobalVariables.isTutorMode)
                                $(PlayOneCategoryPageController.Current.btSynPlay).trigger(GlobalVariables.RemoveAWCardKey);
                        }
                    });
                }
                else {
                    //** [2016-05-27 16:35] If no synAnsWCard, show a popup to warn the user that they didn't click the play yet.
                    if (!PlayOneCategoryPageController.Current.synAnsWCard) {
                        //$('#btSynPlay').tooltip({
                        //    content: "You need to click this button at first!"
                        //})
                        //    .tooltip('open');

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
                PlayOneCategoryPageController.Current.PlayAudio(selWCard);
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
        if (!restWcards[i0].cardInfo.IsXPosFixed || !restWcards[i0].cardInfo.IsYPosFixed)
            $(restWcards[i0].viewCard).draggable();
        if (!restWcards[i0].cardInfo.IsSizeFixed)
            $(restWcards[i0].viewCard).resizable();

        $(restWcards[i0].viewCard).on("resize", function (ev, ui) {
            ev.bubbles = false;
            var thisWCard = WCard.FindWCardFromViewCard(this);
            thisWCard.viewSize = [ui.size.width, ui.size.height];
        });
        restWcards[i0].viewCard.style.msTouchAction = "manipulation";
        restWcards[i0].viewCard.style.touchAction = "manipulation";
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

    //* [2016-07-08 21:22] If the $(document).height() is larger than $(window).height(), it will be a little strange. I try to make the document's height is smaller than window's height
    var newRate = 1;
    //if ($(document).height() * 1.1 > $(window).height())
    //    newRate = $(window).height() / ($(document).height() * 1.1);
    newRate = Math.min($(window).height() / ($(document).height() * 1), $(window).width() / ($(document).width() * 1));
    CardsHelper.RearrangeCards(showedWcards, PlayOneCategoryPageController.oneOverNWindow,false,true,newRate,false);

    if (PlayOneCategoryPageController.Current.isBGAlsoChange) {
        var bGObj = PlayOneCategoryPageController.Current.imgBackground;
        $(bGObj).css(
            {
                'width': Math.round(bGObj.clientWidth*newRate) + "px",
                'height': Math.round(bGObj.clientHeight*newRate) + "px"
            });
    }

    //* [2016-05-12 17:09] Set the default width and height of a card
    //if (showedWcards.length > 0) {
    //    PlayOneCategoryPageController.Current.defaultCardStyle = {
    //        width: PlayOneCategoryPageController.Current.defaultCardWidth + "px",
    //        height: PlayOneCategoryPageController.Current.defaultCardHeight + "px"
    //    };
    //}
}
