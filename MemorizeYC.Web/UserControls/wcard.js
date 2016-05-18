/// <reference path="../scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../models/eachdescription.ts" />
/// <reference path="../Helpers/MyFileHelper.ts"/>
//this is a wrap of UCCard because I cannot make a class inherit HTMLDivElement.
var FileTypeEnum = (function () {
    function FileTypeEnum() {
    }
    FileTypeEnum.Image = 1;
    FileTypeEnum.Text = 2;
    FileTypeEnum.Box = 4;
    FileTypeEnum.Undefined = 8;
    return FileTypeEnum;
}());
// Wrap of a Card.
var WCard = (function () {
    function WCard(cardInfo, mainFolder, categoryFolder) {
        if (mainFolder === void 0) { mainFolder = ""; }
        if (categoryFolder === void 0) { categoryFolder = ""; }
        //The view for HTML
        this.viewCard = document.createElement("div");
        //#region    viewSize Property
        this._viewSize = [100, 100];
        //#endregion viewSize Property
        //#region    viewPosition Property
        this._viewPosition = [100, 100];
        //#region boxIndex. It will set a new Image or textarea
        this._boxIndex = 0;
        //#endregion boxIndex. It will set a new Image or textarea
        //#region mainFolder & categoryFolder property
        this._mainFolder = "";
        this._categoryFolder = "";
        this.mainFolder = mainFolder;
        this.categoryFolder = categoryFolder;
        this.IniCard(cardInfo);
        var viewCard = this.viewCard;
        //viewCard.WCard = this; // This one cannot pass the 'Build'.
        $(viewCard).on('click', function (ev) {
            GlobalVariables.numCardClick++;
            GlobalVariables.clickedViewCard = this; // it is declared by $(viewCard)
            if (!isNaN(GlobalVariables.timerCardClickId))
                clearTimeout(GlobalVariables.timerCardClickId);
            GlobalVariables.timerCardClickId = setTimeout(function () {
                var num = GlobalVariables.numCardClick;
                var clickedViewCard = GlobalVariables.clickedViewCard;
                var thisWCard = WCard.FindWCardFromViewCard(clickedViewCard);
                if (num == 1) {
                    //* [2016-05-10 11:46] for single click
                    $(thisWCard).trigger(GlobalVariables.onSingleClick); //TODO: What I really want is triggering its parent, WCard.
                }
                else if (num == 2) {
                    //* [2016-05-10 11:53] for double click
                    $(thisWCard).trigger(GlobalVariables.onDoubleClick); //TODO: What I really want is triggering its parent, WCard.
                }
                else
                    ;
                //* [2016-05-10 11:56] Initialize them
                GlobalVariables.numCardClick = 0;
                GlobalVariables.timerCardClickId = Number.NaN;
                console.log("Click num =" + num);
            }, 300);
        });
    }
    Object.defineProperty(WCard.prototype, "viewSize", {
        get: function () { return this._viewSize; },
        set: function (value) {
            this._viewSize = value;
            this.viewCard.style.width = value[0].toString() + "px";
            this.viewCard.style.height = value[1].toString() + "px";
            if (this.cCards)
                for (var i0 = 0; i0 < this.cCards.length; i0++) {
                    if (this.cCards[i0]) {
                        this.cCards[i0].style.width = value[0].toString() + "px";
                        this.cCards[i0].style.height = value[1].toString() + "px";
                    }
                }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WCard.prototype, "viewPosition", {
        get: function () { return this._viewPosition; },
        set: function (value) {
            this._viewPosition = value;
            $(this.viewCard).animate({
                left: value[0].toString() + "px",
                top: value[1].toString() + "px"
            });
            if (this.cCards)
                for (var i0 = 0; i0 < this.cCards.length; i0++) {
                    if (this.cCards[i0]) {
                        this.cCards[i0].style.left = value[0].toString() + "px";
                        this.cCards[i0].style.top = value[1].toString() + "px";
                    }
                }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WCard.prototype, "boxIndex", {
        get: function () { return this._boxIndex; },
        set: function (value) {
            this._boxIndex = value;
            if (!this.cCards)
                this.cCards = new Array(this.cardsPath.length);
            //* [2016-03-17 11:25] Remove the old one at first.
            var oldCards = this.viewCard.getElementsByClassName(WCard.cardMainKey);
            if (oldCards.length != 0)
                this.viewCard.removeChild(oldCards[0]);
            if (!this.cCards[value]) {
                //** [2016-03-17 11:23] If this card does not exist, create it.
                this.cCards[value] = this.GetcCardFromPath.call(this, this.cardsPath[value], true);
                if (!this.cCards[value]) {
                    this.cCards[value] = this.CardForMessage(WCard.cardMainKey, this.cardsPath[value] + " cannot be opened.");
                }
            }
            //** [2016-03-18 15:32] fix its size
            if (isNaN(this.viewWHRatio[value]) && this.cCards[value]["naturalHeight"])
                this.viewWHRatio[value] = (this.cCards[value]["naturalWidth"]) / (this.cCards[value]["naturalHeight"]);
            var bufHeight = (isNaN(this.viewWHRatio[value])) ? this.viewSize[1] : (this.viewSize[0] / this.viewWHRatio[value]);
            this.viewSize = [this.viewSize[0], bufHeight];
            this.cCards[value].style.zIndex = "1";
            //** [2016-03-17 11:16] If this card exists, append the new one.
            this.viewCard.appendChild(this.cCards[value]);
            var tbIth = this.viewCard.getElementsByClassName('tbIth')[0];
            if (tbIth)
                tbIth.innerText = value.toString() + "/" + this.cCards.length.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WCard.prototype, "mainFolder", {
        get: function () {
            return this._mainFolder;
        },
        set: function (value) {
            this._mainFolder = (value.length != 0 && value.charAt(value.length - 1) === '/') ? value.substr(0, value.length - 1) : value; //Take out unnecessary '/'
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WCard.prototype, "categoryFolder", {
        get: function () {
            return this._categoryFolder;
        },
        set: function (value) {
            this._categoryFolder = (value.length != 0 && value.charAt(value.length - 1) === '/') ? value.substr(0, value.length - 1) : value; //Take out unnecessary '/'
        },
        enumerable: true,
        configurable: true
    });
    //#region   public IniCard(pathOrUrl: string). Initialize this Card
    WCard.prototype.IniCard = function (cardInfo) {
        this.cardInfo = cardInfo;
        var fileName = cardInfo.FileName;
        //var theCard: HTMLElement = this.GetcCardFromPath(fileName);
        var theCard = this.GetcCardFromPath.call(this, fileName);
        if (theCard) {
            if (!this.cCards)
                this.cCards = new Array(1);
            this.cCards[0] = theCard;
            this.viewCard.appendChild(theCard);
        }
        if (cardInfo.Size)
            this.viewSize = cardInfo.Size;
        else
            this.viewSize = [200, 200];
        this.viewCard.style.position = "absolute";
        $(this.viewCard).addClass("WCard");
    };
    //#endregion   public IniCard(pathOrUrl: string). Initialize this Card
    //#region public IniBox(stContent:string). Initial box... fields
    WCard.prototype.IniBox = function (stContent, thisWCard) {
        var sentences = stContent.split('\n');
        for (var i0 = 0; i0 < sentences.length; i0++) {
            var sentence = sentences[i0];
            if (sentence.length === 0)
                continue;
            var buf = sentence.split(/(\*\*\*\*\*|\+\+\+\+\+)/);
            //* [2016-03-17 10:12] Get each hyperlink, description & file directory
            if (buf[0] === "*****" || buf[0] === "+++++")
                continue;
            if (!thisWCard.cardsPath) {
                thisWCard.cardsPath = new Array();
                thisWCard.cardsHyperLink = new Array();
                thisWCard.cardsDescription = new Array();
            }
            thisWCard.cardsPath.push(buf[0]);
            var ind = buf.indexOf("*****");
            if (ind != -1 && (ind + 1) < buf.length && buf[ind + 1] != "+++++")
                thisWCard.cardsHyperLink.push(buf[ind + 1]);
            else
                thisWCard.cardsHyperLink.push("");
            ind = buf.indexOf("+++++");
            if (ind != -1 && (ind + 1) < buf.length && buf[ind + 1] != "*****")
                thisWCard.cardsDescription.push(buf[ind + 1]);
            else
                thisWCard.cardsDescription.push("");
        }
        //* [2016-03-17 10:39] Show a card randomly
        thisWCard.boxIndex = Math.round((thisWCard.cardsPath.length - 2e-10) * Math.random() - 0.5 + 1e-10);
        //* [2016-03-21 15:17] Embeded in two buttons: btLeft & btRight
        if (thisWCard.cardsPath.length > 1 && document.getElementsByClassName("btLeft").length === 0) {
            var tbIth = document.createElement('div');
            var btLeft = document.createElement('button');
            var btRight = document.createElement('button');
            btLeft.className = "btLeft";
            btLeft.innerHTML = "<";
            btLeft.style.left = "0";
            btRight.style.top = btLeft.style.top = "50%";
            btRight.style.opacity = btLeft.style.opacity = "0.3";
            btRight.style.position = btLeft.style.position = "absolute";
            btRight.className = "btRight";
            btRight.innerText = ">";
            btRight.style.right = "0";
            tbIth.className = "tbIth";
            tbIth.style.bottom = "0";
            tbIth.style.right = "0";
            tbIth.style.position = "absolute";
            btLeft.addEventListener('click', function (ev) {
                thisWCard.boxIndex = (thisWCard.boxIndex == 0) ? thisWCard.cCards.length - 1 : thisWCard.boxIndex - 1;
            });
            btRight.addEventListener('click', function (ev) {
                thisWCard.boxIndex = (thisWCard.boxIndex == (thisWCard.cCards.length - 1)) ? 0 : thisWCard.boxIndex + 1;
            });
            thisWCard.viewCard.appendChild(btLeft);
            thisWCard.viewCard.appendChild(btRight);
            thisWCard.viewCard.appendChild(tbIth);
        }
    };
    //#endregion public IniBox(stContent:string). Initial box... fields
    //#region public static function  GetFileType(pathOrUrl: string) :number. Get file type
    WCard.GetFileType = function (pathOrUrl) {
        pathOrUrl = pathOrUrl.replace('\r', "");
        pathOrUrl = pathOrUrl.replace('\n', " ");
        pathOrUrl = pathOrUrl.trim();
        var iDot = pathOrUrl.lastIndexOf('.');
        var extension = (iDot === 0 || iDot === pathOrUrl.length - 1 || iDot === -1) ? undefined : pathOrUrl.substr(iDot + 1, pathOrUrl.length - iDot - 1);
        extension = extension.toLowerCase();
        if (extension === "txt" || extension === "text") {
            return FileTypeEnum.Text;
        }
        else if (extension === "jpg" || extension === "jpeg" || extension === "gif" || extension === "png" || extension === "bmp") {
            return FileTypeEnum.Image;
        }
        else if (extension === "box") {
            return FileTypeEnum.Box;
        }
        else
            return FileTypeEnum.Undefined;
    };
    //#endregion function  GetFileType Get file type
    WCard.prototype.GetcCardFromPath = function (cardPath, isInsideBox) {
        if (isInsideBox === void 0) { isInsideBox = false; }
        var resObj;
        var fileType = WCard.GetFileType(cardPath);
        var vWHRatio = Number.NaN;
        switch (fileType) {
            case (FileTypeEnum.Image):
                var img = new Image();
                img.className = WCard.cardMainKey;
                img.src = CardsHelper.GetTreatablePath(cardPath, this.mainFolder, this.categoryFolder);
                vWHRatio = img.naturalWidth / img.naturalHeight;
                resObj = img;
                break;
            case (FileTypeEnum.Text):
                var tbArea = document.createElement("textarea");
                tbArea.className = WCard.cardMainKey;
                MyFileHelper.ShowTextFromTxtFile(CardsHelper.GetTreatablePath(cardPath, this.mainFolder, this.categoryFolder), tbArea);
                resObj = tbArea;
                break;
            case (FileTypeEnum.Box):
                if (!isInsideBox)
                    MyFileHelper.FeedTextFromTxtFileToACallBack(CardsHelper.GetTreatablePath(cardPath, this.mainFolder, this.categoryFolder), this, this.IniBox);
                break;
            case (FileTypeEnum.Undefined):
                break;
        }
        if (fileType === FileTypeEnum.Image || fileType === FileTypeEnum.Text) {
            if (!this.viewWHRatio) {
                if (isInsideBox)
                    this.viewWHRatio = new Array(this.cardsPath.length);
                else
                    this.viewWHRatio = new Array(1);
            }
            this.viewWHRatio[this.boxIndex] = vWHRatio;
        }
        return resObj;
    };
    WCard.prototype.CardForMessage = function (className, stMsg) {
        var resObj;
        return resObj;
    };
    WCard.CleanWCards = function () {
        while (WCard.showedWCards.length > 0) {
            WCard.showedWCards[0].RemoveThisWCard();
        }
        while (WCard.restWCards.length > 0) {
            WCard.restWCards[0].RemoveThisWCard();
        }
    };
    WCard.prototype.RemoveThisWCard = function () {
        var isShown;
        var wcards;
        var self = this;
        if (!self)
            return;
        isShown = (self.viewCard.parentNode != null) ? true : false;
        if (isShown) {
            self.viewCard.parentNode.removeChild(self.viewCard);
            wcards = WCard.showedWCards;
        }
        else
            wcards = WCard.restWCards;
        for (var i0 = 0; i0 < wcards.length; i0++) {
            if (self === wcards[i0]) {
                wcards.splice(i0, 1);
                break;
            }
        }
    };
    WCard.FindWCardFromViewCard = function (viewCard) {
        var wcards = WCard.showedWCards;
        for (var i0 = 0; i0 < wcards.length; i0++) {
            if (viewCard === wcards[i0].viewCard) {
                return wcards[i0];
            }
        }
    };
    //public static WCards: WCard[] = new Array();
    WCard.showedWCards = new Array();
    WCard.restWCards = new Array();
    WCard.cardMainKey = "cardMain";
    WCard.btLeftClickKey = "btLeftClick";
    WCard.btRightClickKey = "btRightClick";
    return WCard;
}());
//# sourceMappingURL=wcard.js.map