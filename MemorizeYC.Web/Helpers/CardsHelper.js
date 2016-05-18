/// <reference path="mathhelper.ts" />
/// <reference path="../models/eachdescription.ts" />
/// <reference path="../usercontrols/wcard.ts" />
var CardsHelper = (function () {
    function CardsHelper() {
    }
    CardsHelper.RearrangeCards = function (wcards, nCol, isRandom) {
        if (nCol === void 0) { nCol = 5; }
        if (isRandom === void 0) { isRandom = false; }
        if (!wcards || wcards.length === 0)
            return;
        var topOfTop = 50;
        var currentPosition = [0, topOfTop];
        var wWidth = window.innerWidth;
        var wHeight = window.innerHeight - topOfTop; //For bottom bar
        //* [2016-03-16 13:59] get the order of cards.
        if (isRandom)
            MathHelper.Permute(wcards);
        //* [2016-03-16 14:06] Rearrange the cards.
        for (var i1 = 0; i1 < wcards.length; i1++) {
            var card = wcards[i1];
            var size = [wWidth / nCol, wHeight / nCol];
            //* [2016-05-05 20:05] Initialize card.viewWHRatio
            if (!card.viewWHRatio)
                card.viewWHRatio = new Array();
            if (card.cCards != undefined && card.cCards[card.boxIndex] != undefined && isNaN(card.viewWHRatio[card.boxIndex])) {
                var nWidth = card.cCards[card.boxIndex]["naturalWidth"];
                var nHeight = card.cCards[card.boxIndex]["naturalHeight"];
                if (nWidth != undefined && nWidth > 0 && nHeight > 0)
                    card.viewWHRatio[card.boxIndex] = nWidth / nHeight;
            }
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
    CardsHelper.MoveArrayElements = function (from, to, numToMove, isRandomly, myAppendTo) {
        if (isRandomly === void 0) { isRandomly = false; }
        if (myAppendTo === void 0) { myAppendTo = null; }
        var i0 = 0;
        while (i0 < numToMove && from.length > 0) {
            i0++;
            var ith = (isRandomly) ?
                Math.round(Math.random() * (from.length - 0.1) - 0.49) :
                0;
            to.push(from[ith]);
            if (myAppendTo) {
                var shWCard = from[ith];
                if (shWCard)
                    $(shWCard.viewCard).appendTo(myAppendTo);
            }
            else {
                var wcard = from[ith];
                if (wcard && wcard.viewCard.parentNode) {
                    wcard.viewCard.parentNode.removeChild(wcard.viewCard);
                }
            }
            from.splice(ith, 1);
        }
    };
    return CardsHelper;
}());
//# sourceMappingURL=CardsHelper.js.map