/// <reference path="../models/enums.ts" />

class GlobalVariables {
    public static categoryListFileName: string = "MYCategory.json";
    public static containerListFileName: string = "MYContainer.json";

    public static currentMainFolder: string = "/Samples/MYContainer";
    public static currentCategoryFolder: string = "ShapeAndColor";

    public static onSingleClick: string = "onSingleClick";
    public static onDoubleClick: string = "onDoubleClick";
    public static numCardClick: number = 0;
    public static timerCardClickId: number = Number.NaN;
    public static clickedViewCard: HTMLDivElement = null;
    public static PlayType = PlayTypeEnum.syn;

    public static currentDocumentSize: number[] = [0,0];
}