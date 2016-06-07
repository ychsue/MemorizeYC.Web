/// <reference path="mathhelper.ts" />
/// <reference path="../models/eachdescription.ts" />
/// <reference path="../usercontrols/wcard.ts" />
class CardsHelper {
    public static RearrangeCards(wcards: WCard[], nCol: number = 5, isRandom:boolean=false, isOptimizeSize:boolean = true, expandRatio:number = 1) {
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
            if (!card.cardInfo.IsSizeFixed) { //Recalculate its size if its size is changeable
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
                if (isOptimizeSize)
                    card.viewSize = size; //This step will reset its size.
            } else {
                for (var i0: number = 0; i0 < card.viewSize.length; i0++) {
                    card.viewSize[i0] *= expandRatio;
                }
                card.viewSize = card.viewSize; //To update it
            }

            if (!card.cardInfo.IsXPosFixed || !card.cardInfo.IsYPosFixed) { //Update its position only if their positions are changeable.
                var predictTop = currentPosition[1] + card.viewSize[1] + 20;
                if (predictTop > wHeight) {
                    currentPosition = [currentPosition[0] + maxWidth + 20, topOfTop];
                    maxWidth = card.viewSize[0];
                }
                else {
                    maxWidth = Math.max(maxWidth, card.viewSize[0]);
                }
                card.viewPosition = currentPosition;
                //* [2016-03-16 14:52] Renew its position for next one
                if (predictTop < wHeight)
                    currentPosition[1] = predictTop;
                else
                    currentPosition[1] += card.viewSize[1] + 20;
            } else {
                for (var i0: number = 0; i0 < card.viewPosition.length; i0++) {
                    card.viewPosition[i0] *= expandRatio;
                }
                card.viewPosition = card.viewPosition; //To update it
            }
        }

        PlayOneCategoryPageController.Current.defaultCardHeight = wcards[0].viewCard.clientHeight;
        PlayOneCategoryPageController.Current.defaultCardWidth = wcards[0].viewCard.clientWidth;
    }

    public static GetTreatablePath(cardPath: string, mainFolder: string = "", categoryFolder: string = ""):string {
        var newPath: string;
        var hasProtocol: boolean = true;

        if (cardPath.toLowerCase().indexOf("http://") === 0 || cardPath.toLowerCase().indexOf("https://") === 0)
            newPath = cardPath;
        else if (cardPath.toLowerCase().indexOf("file://") === 0)
            newPath = cardPath;
        else if (cardPath.charAt(0) === '/' || cardPath.charAt(0) === '\\') {
            newPath = mainFolder + cardPath.replace('\\', '/');
            hasProtocol = false;
        }
        else {
            newPath = mainFolder + "/" + categoryFolder + "/" + cardPath.replace('\\', '/');
            hasProtocol = false;
        }

        if (!hasProtocol && GlobalVariables.isHostNameShown) {
            newPath = location.origin + newPath;
        }

        return newPath;
    }

    public static GetWCardsCallback(jObj: Object, cards: WCard[]) {
        //* [2016-04-01 16:31] Decipher the jsonTxt
        if (!jObj)
            return;

        var des: Array<EachDescription> = jObj["Cards"];
        if (!des)
            return;

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

    public static ShowHLinkAndDesDialog(wcard: WCard, diEle: HTMLDivElement) {
        var btns = new Array();
        var isLinking = false;
        var isDescripted = false;
        var inStr1, inStr2: string;
        //* [2016-05-26 10:18] Check whether it has a link
        if (wcard.cardInfo.Link) {
            inStr1 = wcard.cardInfo.Link;
            isLinking = true;
        }
        else if (wcard.cardsHyperLink && wcard.boxIndex>=0 && wcard.cardsHyperLink[wcard.boxIndex]) {
            inStr1 = wcard.cardsHyperLink[wcard.boxIndex];
            isLinking = true;
        }
        else
            isLinking = false;

        if (isLinking) {
            btns.push({
                text: 'Link',
                click: function () {
                    window.open(inStr1);
                    $(diEle).dialog('close');
                }
            });
        }

        //* [2016-05-26 10:23] Check whether it has a description
        if (wcard.cardInfo.Description) {
            inStr2 = wcard.cardInfo.Description;
            isDescripted = true;
        }
        else if (wcard.cardsDescription && wcard.boxIndex>=0 && wcard.cardsDescription[wcard.boxIndex]) {
            inStr2 = wcard.cardsDescription[wcard.boxIndex];
            isDescripted = true;
        }
        else
            isDescripted = false;

        if (isDescripted) {
            btns.push({
                text: 'Description',
                click: function () {
                    window.alert(inStr2);
                    $(diEle).dialog('close');
                }
            });
        }

        //* [2016-05-26 10:23] Open the dialog
        if (isLinking || isDescripted) {
            $(diEle).dialog({
                buttons: btns
            });
            $(diEle).dialog('open');
        }
    }

    public static CorrectBackgroundStyle(myStyle: Object, stContainer:string, stCFolder:string):Object {
        var bgImgStyle: string = myStyle["background-image"] as string;
        if (bgImgStyle && bgImgStyle.indexOf("url(") < 0) {
            var newBgImgStyle = "url(" + CardsHelper.GetTreatablePath(bgImgStyle, stContainer, stCFolder) + ")";
            newBgImgStyle = encodeURI(newBgImgStyle);
            myStyle["background-image"] = newBgImgStyle;
        }

        return myStyle;
    }
}