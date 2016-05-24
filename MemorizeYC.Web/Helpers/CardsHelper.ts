/// <reference path="mathhelper.ts" />
/// <reference path="../models/eachdescription.ts" />
/// <reference path="../usercontrols/wcard.ts" />
class CardsHelper {
    public static RearrangeCards(wcards: WCard[], nCol: number = 5, isRandom:boolean=false, isOptimizeSize:boolean = true) {
        if (!wcards || wcards.length === 0)
            return;
        var topOfTop: number = 50;
        var currentPosition: number[] = [0, topOfTop];
        var wWidth: number = window.innerWidth;
        var wHeight: number = window.innerHeight - topOfTop; //For bottom bar

        //* [2016-03-16 13:59] get the order of cards.
        if (isRandom)
            MathHelper.Permute(wcards);
        //* [2016-03-16 14:06] Rearrange the cards.
        var maxWidth: number = 0;
        for (var i1: number = 0; i1 < wcards.length; i1++) {
            var card: WCard = wcards[i1];
            var size = [wWidth / nCol, wHeight / nCol];
            //* [2016-05-05 20:05] Initialize card.viewWHRatio
            if (!card.viewWHRatio)
                card.viewWHRatio = new Array();
            if (card.cCards!=undefined && card.cCards[card.boxIndex] != undefined && isNaN(card.viewWHRatio[card.boxIndex])) {
                var nWidth = card.cCards[card.boxIndex]["naturalWidth"];
                var nHeight = card.cCards[card.boxIndex]["naturalHeight"];
                if (nWidth != undefined && nWidth > 0 && nHeight > 0)
                    card.viewWHRatio[card.boxIndex] = nWidth / nHeight;  
            }
            if (card.viewWHRatio && !isNaN(card.viewWHRatio[card.boxIndex])) {
                size[1] = size[0] / card.viewWHRatio[card.boxIndex];
            }
            if(isOptimizeSize)
                card.viewSize = size; //This step will reset its size.
            maxWidth = Math.max(maxWidth, card.viewSize[0]);
            var predictTop = currentPosition[1] + card.viewSize[1] + 20;
            if (predictTop > wHeight) {
                currentPosition = [currentPosition[0] + maxWidth + 20, topOfTop];
                maxWidth = 0;
            }
            card.viewPosition = currentPosition;
            //* [2016-03-16 14:52] Renew its position for next one
            if (predictTop < wHeight)
                currentPosition[1] = predictTop;
            else
                currentPosition[1] += card.viewSize[1] + 20;
        }
    }

    public static GetTreatablePath(cardPath: string, mainFolder: string = "", categoryFolder: string = ""):string {
        var newPath: string;

        if (cardPath.toLowerCase().indexOf("http://") === 0 || cardPath.toLowerCase().indexOf("https://")===0)
            newPath = cardPath;
        else if (cardPath.toLowerCase().indexOf("file://") === 0)
            newPath = cardPath;
        else if (cardPath.charAt(0) === '/' || cardPath.charAt(0) === '\\')
            newPath = mainFolder + "/" + cardPath.replace('\\', '/');
        else
            newPath = mainFolder + "/" + categoryFolder + "/" + cardPath.replace('\\', '/');

        return newPath;
    }

    public static GetWCardsCallback(jsonTxt: string, cards: WCard[]) {
        //* [2016-04-01 16:31] Decipher the jsonTxt
        var jObj = JSON.parse(jsonTxt);
        if (!jObj)
            return;

        var des: Array<EachDescription> = jObj["Cards"];
        for (var i0 = 0; i0 < des.length;i0++) {
            var eachDescription: EachDescription = des[i0] as EachDescription;
            CardsHelper.UpdateEachDescription(des[i0]);
            var card: WCard = new WCard(eachDescription, GlobalVariables.currentMainFolder, GlobalVariables.currentCategoryFolder);
            if (card)
                cards.push(card);
        }
    }

    public static UpdateEachDescription(des: EachDescription) {
        if (!des.Dictate && des.FileName) {
            var iDot: number = des.FileName.lastIndexOf('.');
            if (iDot > 0)
                des.Dictate = decodeURIComponent( des.FileName.substring(0, iDot));
        }
    }

    public static MoveArrayElements(from: Array<Object>, to: Array<Object>, numToMove: number, isRandomly: boolean = false, myAppendTo:JQuery = null) {
        var i0: number = 0;
        while (i0 < numToMove && from.length > 0) {
            i0++;
            var ith: number = (isRandomly) ?
                MathHelper.MyRandomN(0,from.length-1) :
                0;
            to.push(from[ith]);
            if (myAppendTo) { // Append it to a HTMLElement
                var shWCard: WCard = from[ith] as WCard;
                if(shWCard)
                    $(shWCard.viewCard).appendTo(myAppendTo); 
            }
            else {              // Take it off from a HTMLElement
                var wcard = from[ith] as WCard;
                if (wcard && wcard.viewCard.parentNode) {
                    wcard.viewCard.parentNode.removeChild(wcard.viewCard);
                }
            }
            from.splice(ith, 1);
        }
    }
}