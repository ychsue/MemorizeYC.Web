﻿/// <reference path="../helpers/speechsynthesishelper.ts" />
/// <reference path="../models/enums.ts" />
/// <reference path="../mytpdefinitions/chrome.d.ts" />

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

}