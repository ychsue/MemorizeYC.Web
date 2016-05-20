/// <reference path="../models/enums.ts" />
var GlobalVariables = (function () {
    function GlobalVariables() {
    }
    GlobalVariables.categoryListFileName = "MYCategory.json";
    GlobalVariables.containerListFileName = "MYContainer.json";
    GlobalVariables.currentMainFolder = "/Samples/MYContainer";
    GlobalVariables.currentCategoryFolder = "ShapeAndColor";
    GlobalVariables.onSingleClick = "onSingleClick";
    GlobalVariables.onDoubleClick = "onDoubleClick";
    GlobalVariables.numCardClick = 0;
    GlobalVariables.timerCardClickId = Number.NaN;
    GlobalVariables.clickedViewCard = null;
    GlobalVariables.PlayType = PlayTypeEnum.syn;
    GlobalVariables.currentDocumentSize = [0, 0];
    return GlobalVariables;
}());
//# sourceMappingURL=globalvariables.js.map