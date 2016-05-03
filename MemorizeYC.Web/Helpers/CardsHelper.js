/// <reference path="mathhelper.ts" />
/// <reference path="../models/eachdescription.ts" />
/// <reference path="../usercontrols/wcard.ts" />
var CardsHelper = (function () {
    function CardsHelper() {
    }
    CardsHelper.RearrangeCards = function (wcards, nCol, isRandom) {
        if (nCol === void 0) { nCol = 4; }
        if (isRandom === void 0) { isRandom = true; }
        if (!wcards || wcards.length === 0)
            return;
        var wWidth = window.innerWidth;
        var wHeight = window.innerHeight;
        var topOfTop = 50;
        var currentPosition = [0, topOfTop];
        //* [2016-03-16 13:59] get the order of cards.
        if (isRandom)
            MathHelper.Permute(wcards);
        //* [2016-03-16 14:06] Rearrange the cards.
        for (var i1 = 0; i1 < wcards.length; i1++) {
            var card = wcards[i1];
            var size = [wWidth / nCol, wHeight / nCol];
            if (card.viewWHRatio && !isNaN(card.viewWHRatio[card.boxIndex])) {
                size[1] = size[0] / card.viewWHRatio[card.boxIndex];
            }
            card.viewSize = size; //This step will reset its size.
            var predictTop = currentPosition[1] + size[1] + 20;
            if (predictTop > wHeight) {
                currentPosition = [currentPosition[0] + wWidth / nCol + 20, topOfTop];
            }
            card.viewPosition = currentPosition;
            //* [2016-03-16 14:52] Renew its position for next one
            if (predictTop < wHeight)
                currentPosition[1] = predictTop;
            else
                currentPosition[1] += size[1] + 20;
        }
    };
    CardsHelper.GetTreatablePath = function (cardPath, mainFolder, categoryFolder) {
        if (mainFolder === void 0) { mainFolder = ""; }
        if (categoryFolder === void 0) { categoryFolder = ""; }
        var newPath;
        if (cardPath.toLowerCase().indexOf("http://") === 0 || cardPath.toLowerCase().indexOf("https://") === 0)
            newPath = cardPath;
        else if (cardPath.toLowerCase().indexOf("file://") === 0)
            newPath = cardPath;
        else if (cardPath.charAt(0) === '/' || cardPath.charAt(0) === '\\')
            newPath = mainFolder + "/" + cardPath.replace('\\', '/');
        else
            newPath = mainFolder + "/" + categoryFolder + "/" + cardPath.replace('\\', '/');
        return newPath;
    };
    CardsHelper.GetWCardsCallback = function (jsonTxt, cards) {
        //* [2016-04-01 16:31] Decipher the jsonTxt
        var jObj = JSON.parse(jsonTxt);
        if (!jObj)
            return;
        var des = jObj["Cards"];
        for (var i0 = 0; i0 < des.length; i0++) {
            var eachDescription = des[i0];
            var card = new WCard(eachDescription, GlobalVariables.currentMainFolder, GlobalVariables.currentCategoryFolder);
            if (card)
                cards.push(card);
        }
    };
    return CardsHelper;
}());
//# sourceMappingURL=CardsHelper.js.map