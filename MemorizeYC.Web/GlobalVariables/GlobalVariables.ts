/// <reference path="../models/enums.ts" />

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

    public static version: string = "2016.0606.1.5"; //Change version.json, too
    public static versionFile: string = GlobalVariables.rootDir + "version.json";

}