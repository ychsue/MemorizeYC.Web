/// <reference path="mathhelper.ts" />
/// <reference path="../models/eachdescription.ts" />
/// <reference path="../usercontrols/wcard.ts" />
class CardsHelper {
    public static RearrangeCards(wcards: WCard[], nCol: number = 4, isRandom:boolean=true) {
        if (!wcards || wcards.length === 0)
            return;
        var wWidth: number = window.innerWidth;
        var wHeight: number = window.innerHeight;
        var topOfTop: number = 50;
        var currentPosition: number[] = [0, topOfTop];

        //* [2016-03-16 13:59] get the order of cards.
        if (isRandom)
            MathHelper.Permute(wcards);
        //* [2016-03-16 14:06] Rearrange the cards.
        for (var i1: number = 0; i1 < wcards.length; i1++) {
            var card: WCard = wcards[i1];
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
            var card: WCard = new WCard(eachDescription, GlobalVariables.currentMainFolder, GlobalVariables.currentCategoryFolder);
            if (card)
                cards.push(card);
        }
    }

}