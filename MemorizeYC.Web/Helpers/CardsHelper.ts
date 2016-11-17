/// <reference path="mathhelper.ts" />
/// <reference path="../models/eachdescription.ts" />
/// <reference path="../models/mycategoryjson.ts" />
/// <reference path="../usercontrols/wcard.ts" />
class CardsHelper {
    public static RearrangeCards(wcards: WCard[], nCol: number = 5, isRandom: boolean = false,
        isOptimizeSize: boolean = true, expandRatio: number = 1, justFixed: boolean = false):void {

        if (!wcards || wcards.length === 0) {
            return;
        }
        // * [2016-11-17 11:09] To show cards as a list
        var isShownAsList: boolean = PlayOneCategoryPageController.Current.IsShownAsList;

        var topOfTop: number = 50;
        var wWidth: number = window.innerWidth;
        var wHeight: number = window.innerHeight - topOfTop; // for bottom bar
        var currentPosition: number[] = [wWidth*0.04, 0];

        // * [2016-03-16 13:59] get the order of cards.
        if (isRandom) {
            MathHelper.Permute(wcards);
        }
        // * [2016-03-16 14:06] Rearrange the cards.
        var maxWidth: number = 0;
        for (var i1: number = 0; i1 < wcards.length; i1++) {
            var card: WCard = wcards[i1];
            if (isShownAsList === true && $(card.cCards[card.boxIndex]).text() != "") {
                //'+' is used to change a string to be a number as mentioned in 
                // http://stackoverflow.com/questions/14667713/typescript-converting-a-string-to-a-number
                var fSize: number = +$(card.cCards[card.boxIndex]).css("font-size").replace("px", ""); 
                $(card.cCards[card.boxIndex]).css("font-size", Math.ceil(fSize * expandRatio));
            }
            if (!card.cardInfo.IsSizeFixed && !justFixed) { // recalculate its size if its size is changeable
                var size :number[] = [wWidth / nCol, wHeight / nCol];
                // * [2016-05-05 20:05] Initialize card.viewWHRatio
                if (!card.viewWHRatio) {
                    card.viewWHRatio = new Array();
                }
                if (card.cCards !== undefined && card.cCards[card.boxIndex] !== undefined && isNaN(card.viewWHRatio[card.boxIndex])) {
                    var nWidth:number = card.cCards[card.boxIndex]["naturalWidth"];
                    var nHeight:number = card.cCards[card.boxIndex]["naturalHeight"];
                    if (nWidth !== undefined && nWidth > 0 && nHeight > 0) {
                        card.viewWHRatio[card.boxIndex] = nWidth / nHeight;
                    }
                }
                if (card.viewWHRatio && !isNaN(card.viewWHRatio[card.boxIndex])) {
                    size[1] = size[0] / card.viewWHRatio[card.boxIndex];
                } else if (isShownAsList && $(card.cCards[card.boxIndex]).text()!=="") {
                    size[0] = wWidth * 0.92;
                }

                if (isOptimizeSize) {
                    card.viewSize = size; // this step will reset its size.
                }

                if (isShownAsList && $(card.cCards[card.boxIndex]).text()!=="") {
                    card.viewSize = [size[0], 0];   // if the height is larger than scrollHeight, 
                                                    // the scrollHeight will be changed to that height.
                    if (card.cCards[card.boxIndex].scrollHeight > 0) {
                        size[1] = card.cCards[card.boxIndex].scrollHeight + 4;
                        card.viewSize = size;
                    }
                }
            }
            else if (card.cardInfo.IsSizeFixed) {
                for (var i0: number = 0; i0 < card.viewSize.length; i0++) {
                    card.viewSize[i0] *= expandRatio;
                }
                card.viewSize = card.viewSize; //To update it
            }

            if ((!card.cardInfo.IsXPosFixed || !card.cardInfo.IsYPosFixed) && !justFixed) { //Update its position only if their positions are changeable.
                if (isShownAsList === true) {
                    ;
                } else {
                    var predictTop = currentPosition[1] + card.viewSize[1] + topOfTop;
                    if (predictTop > wHeight) {
                        currentPosition = [currentPosition[0] + maxWidth + 20, 0];
                        maxWidth = card.viewSize[0];
                    }
                    else {
                        maxWidth = Math.max(maxWidth, card.viewSize[0]);
                    }
                }
                card.viewPosition = currentPosition; // under this line, current position is for next card
                //* [2016-03-16 14:52] Renew its position for next one
                    currentPosition[1] += card.viewSize[1] + 20;
            }
            else if (card.cardInfo.IsXPosFixed && card.cardInfo.IsYPosFixed) {
                for (var i0: number = 0; i0 < card.viewPosition.length; i0++) {
                    card.viewPosition[i0] *= expandRatio;
                }
                card.viewPosition = card.viewPosition; //To update it
            }
        }

        PlayOneCategoryPageController.Current.defaultCardHeight = wcards[0].viewCard.clientHeight;
        PlayOneCategoryPageController.Current.defaultCardWidth = wcards[0].viewCard.clientWidth;
    }

    /**
     * Because I want to let the @mainFolder(Container) as the root directory / and @categoryFolder as its local directory, this function is used to do this translation
     * @param cardPath It is the path that you want to translate to the real address
     * @param mainFolder The folder of the container
     * @param categoryFolder The subFolder of the category
     */
    public static GetTreatablePath(cardPath: string, mainFolder: string = "", categoryFolder: string = ""):string {
        var newPath: string;
        var hasProtocol: boolean = true;

        if (!cardPath)
            return cardPath;

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

    public static GetWCardsCallback(jObj: MYCategoryJson, cards: WCard[]) {
        //* [2016-04-01 16:31] Decipher the jsonTxt
        if (!jObj)
            return;

        var des: Array<EachDescription> = jObj.Cards;
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
        var myDictate: string;
        if (!des.Dictate && des.FileName) {
            //* [2016-08-05 18:46] Drop out all subFolders' information
            var iSlash = des.FileName.lastIndexOf('/');
            if (iSlash >= 0)
                myDictate = des.FileName.substr(iSlash + 1);
            else
                myDictate = des.FileName;
            //* [2016-06-29] Take out file extension
            var iDot: number = myDictate.lastIndexOf('.');
            if (iDot > 0)
                des.Dictate = decodeURIComponent(myDictate.substring(0, iDot));
            //* [2016-06-29 17:05] Take out s??.
            if (des.Dictate[0].toLowerCase() === 's') {
                if (/^[s,S][0-9]+\./.test(des.Dictate)) {
                    iDot = des.Dictate.indexOf('.');
                    des.Dictate = des.Dictate.substring(iDot + 1).trim();
                }
            }
        }
        if (!des.Ans_KeyIn && des.Dictate) {
            des.Ans_KeyIn = [des.Dictate];
        }
        if (!des.Ans_Recog && des.Dictate) {
            des.Ans_Recog = [des.Dictate];
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
        var isRecMode = (PlayOneCategoryPageController.Current.playType===PlayTypeEnum.rec);
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
                text: PlayOneCategoryPageController.Current.thisPageTexts.stLink,
                icons: { primary: "ui-icon-link" },
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

        if (isRecMode) {
            btns.push({
                text: PlayOneCategoryPageController.Current.thisPageTexts.stAns,
                icons: { primary: "ui-icon-comment"},
                click: function () {
                    var answers = "\"" + wcard.cardInfo.Ans_KeyIn[0] + "\"";
                    for (var i0: number = 1; i0 < wcard.cardInfo.Ans_KeyIn.length; i0++) {
                        answers += "\n" + "\"" + wcard.cardInfo.Ans_KeyIn[i0] + "\"";
                    }
                    PlayOneCategoryPageController.scope.$apply(() => {
                        PlayOneCategoryPageController.Current.totalScore -= 15;
                    });
                    GlobalVariables.alert(PlayOneCategoryPageController.Current.thisPageTexts.stShowAns.replace('{0}',answers));
                    $(diEle).dialog('close');
                }
            });
        }

        //* [2016-05-26 10:23] Open the dialog
        if (isLinking || isDescripted ||isRecMode) {
            $(diEle).dialog({
                buttons: btns
            });
            //*[2016-07-08 11:39] Show the description directly on this dialog.
            if (isDescripted)
                $(diEle).html("Description:<br/>" + inStr2);
            else
                $(diEle).html("No Description but it has a link.");

            $(diEle).dialog('open');
        }
    }

    public static CorrectBackgroundStyle(myStyle: Object, stContainer:string, stCFolder:string):Object {
        var bgImgStyle: string = myStyle["background-image"] as string;
        if (bgImgStyle && bgImgStyle.indexOf("url(") < 0) {
            var newBgImgStyle = "url('" + CardsHelper.GetTreatablePath(bgImgStyle, stContainer, stCFolder) + "')";
            //newBgImgStyle = encodeURI(newBgImgStyle);
            myStyle["background-image"] = newBgImgStyle;
        }

        return myStyle;
    }
}