/// <reference path="../helpers/pagetexthelper.ts" />
/// <reference path="../helpers/speechsynthesishelper.ts" />
/// <reference path="../models/enums.ts" />
/// <reference path="../mytpdefinitions/chrome.d.ts" />
/// <reference path="../scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../helpers/tutorialhelper.ts" />

class GlobalVariables {
    public static categoryListFileName: string = "MYCategory.json";
    public static containerListFileName: string = "MYContainer.json";
    public static isHostNameShown: boolean = true;
    public static isLog = false; //Turn it off when you published it.
    public static isIOS: boolean = /iP/i.test(navigator.userAgent);

    //public static rootDir: string = "/";
    //public static playOneCategoryHtml:string = GlobalVariables.rootDir + 'PlayPage/PlayOneCategoryPage.html';
    //public static chooseAContainerHtml:string = GlobalVariables.rootDir + 'GSPages/ChooseAContainerPage.html';
    public static rootDir: string;
    public static playOneCategoryHtml: string;
    public static chooseAContainerHtml: string;
    public static containers: Array<AContainer>;
    public static currentMainFolder: string;
    public static currentCategoryFolder: string;
    public static currentUser: string = "MYC";

    public static onSingleClick: string = "onSingleClick";
    public static onDoubleClick: string = "onDoubleClick";
    public static numCardClick: number = 0;
    public static timerCardClickId: number = Number.NaN;
    public static clickedViewCard: HTMLDivElement = null;
    public static PlayType = PlayTypeEnum.syn;

    public static currentDocumentSize: number[] = [0,0];

    public static version: string; //Change version.json, too
    public static versionFile: string;

    //* [2016-06-28 21:27] Added for Speech
    public static synthesis: SpeechSynthesis_Instance = window["speechSynthesis"];
    public static allVoices: Array<SpeechSynthesisVoice_Instance>=undefined;
    public static currentSynVoice: SpeechSynthesisVoice_Instance = undefined;
    public static synUtterance: SpeechSynthesisUtterance_Instance = undefined;

    public static isHavingSpeechRecognier: boolean;
    public static speechRecognizer: SpeechRecognition;
    public static SpeechGrammarList;

    //* [2016-07-05 13:16] Added for Tutorial
    public static isTutorMode: boolean = true;
    public static IsShownTutorKey = "IsShownTutor"; //For LocalStorage
    public static gdTutorElements: TutorialElements;
    public static tutorState: TutorState = {
        Main: TutorMainEnum.Begin,
        Step: 0
    };
    public static RemoveAWCardKey: string = "RemoveAWCard";
    public static SynVoiceChangeKey: string = "SynVoiceChange";
    public static TutorTypeChangeKey: string = "TutorTypeChange";
    public static PlayTypeChangeKey: string = "PlayTypeChange";
    public static AudioPauseKey: string = "AudioPause";

    //* [2016-07-10 16:23] PageTexts
    public static PageTextChangeKey = "PageTextChange";
    public static LangsInStrings: Array<LangInStrings>;
    public static SelPageTextLang: LangInStrings;
    public static PageTexts: PageTextsInterface;

    /**
     * This file is located at 'Strings/en-US/Resources.json' for English
     */
    public static PageTextsJSONFName: string = "Resources.json";

}