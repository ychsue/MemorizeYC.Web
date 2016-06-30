/// <reference path="../scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../models/eachdescription.ts" />
/// <reference path="../Helpers/MyFileHelper.ts"/>
//this is a wrap of UCCard because I cannot make a class inherit HTMLDivElement.

class FileTypeEnum {
    public static Image: number = 1;
    public static Text: number = 2;
    public static Box: number = 4;
    public static Undefined: number = 8;
}

// Wrap of a Card.
class WCard {
    //public static WCards: WCard[] = new Array();
    public static showedWCards: WCard[] = new Array();
    public static restWCards: WCard[] = new Array();
    public static mouseDownTime: number;
    //The view for HTML
    public viewCard: HTMLDivElement = document.createElement("div");

    //#region    viewSize Property
    _viewSize: number[]=[100,100];
    get viewSize() { return this._viewSize; }
    set viewSize(value: number[]) {
        this._viewSize = value;
        this.viewCard.style.width = value[0].toString()+"px";
        this.viewCard.style.height = value[1].toString() + "px";
        if (this.cCards)
            for (var i0: number = 0; i0 < this.cCards.length; i0++) {
                if (this.cCards[i0]) {
                    this.cCards[i0].style.width = value[0].toString() + "px";
                    this.cCards[i0].style.height = value[1].toString() + "px";
                }
            }
    }
    //#endregion viewSize Property
    //#region    viewPosition Property
    private _viewPosition: number[] = [100, 100];
    get viewPosition() { return this._viewPosition; }
    set viewPosition(value: number[]) {
        this._viewPosition = value;
        $(this.viewCard).animate({
            left: value[0].toString() + "px",
            top: value[1].toString()+"px"
        });

        if (this.cCards)
            for (var i0: number = 0; i0 < this.cCards.length; i0++) {
                if (this.cCards[i0]) {
                    this.cCards[i0].style.left = value[0].toString() + "px";
                    this.cCards[i0].style.top = value[1].toString() + "px";
                }
            }
    }
    //#endregion viewPosition Property
    public viewWHRatio: number[];

    public cCards: HTMLElement[];
    public cardInfo: EachDescription;
    
    //#region boxIndex. It will set a new Image or textarea
    _boxIndex: number = 0;
    get boxIndex() { return this._boxIndex; }
    set boxIndex(value: number) {
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
        var bufHeight = (isNaN(this.viewWHRatio[value])) ? this.viewSize[1] : (this.viewSize[0]/this.viewWHRatio[value]);
        this.viewSize = [this.viewSize[0], bufHeight];
        this.cCards[value].style.zIndex = "1";
        //** [2016-03-17 11:16] If this card exists, append the new one.
        this.viewCard.appendChild(this.cCards[value]);
        var tbIth: HTMLDivElement = this.viewCard.getElementsByClassName('tbIth')[0] as HTMLDivElement;
        if (tbIth)
            tbIth.innerText = (value+1).toString() + "/" + this.cCards.length.toString();
    }
    //#endregion boxIndex. It will set a new Image or textarea
    
    //#region mainFolder & categoryFolder property
    _mainFolder: string = "";
    get mainFolder() {
        return this._mainFolder;
    }
    set mainFolder(value: string) {
        this._mainFolder = (value.length != 0 && value.charAt(value.length - 1) === '/') ? value.substr(0, value.length - 1) : value; //Take out unnecessary '/'
    }

    _categoryFolder: string = "";
    get categoryFolder() {
        return this._categoryFolder;
    }
    set categoryFolder(value: string) {
        this._categoryFolder = (value.length != 0 && value.charAt(value.length - 1) === '/') ? value.substr(0, value.length - 1) : value; //Take out unnecessary '/'
    }
    //#endregion mainFolder & categoryFolder property
    public cardsPath: string[];
    public cardsHyperLink: string[];
    public cardsDescription: string[];

    static cardMainKey: string = "cardMain";
    static btLeftClickKey: string = "btLeftClick";
    static btRightClickKey: string = "btRightClick";

    constructor(cardInfo: EachDescription, mainFolder: string = "", categoryFolder: string = "") {
        this.mainFolder = mainFolder;
        this.categoryFolder = categoryFolder;
        this.IniCard(cardInfo);
        var viewCard = this.viewCard;
        //viewCard.WCard = this; // This one cannot pass the 'Build'.
        $(viewCard).on('click', function (ev) { 
            //* [2016-05-24 15:18] To exclude the case of dragging a card
            var mouseDownTime = WCard.mouseDownTime;
            WCard.mouseDownTime = Date.now();
            if (GlobalVariables.numCardClick === 0 && WCard.mouseDownTime - mouseDownTime > 200)
                return;
            //* [2016-05-24 15:03] Start to catch its clicking
            GlobalVariables.numCardClick++;
            GlobalVariables.clickedViewCard = this; // it is declared by $(viewCard)
            if (!isNaN(GlobalVariables.timerCardClickId))
                clearTimeout(GlobalVariables.timerCardClickId);

            GlobalVariables.timerCardClickId = setTimeout(function () {
                var num: number = GlobalVariables.numCardClick;
                var clickedViewCard: HTMLDivElement = GlobalVariables.clickedViewCard;
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
            },300);
        });
        $(viewCard).on('mousedown', function () {
            WCard.mouseDownTime = Date.now();
        });
    }

    //#region   public IniCard(pathOrUrl: string). Initialize this Card
    public IniCard(cardInfo: EachDescription) {
        this.cardInfo = cardInfo;

        var fileName = cardInfo.FileName;
        //var theCard: HTMLElement = this.GetcCardFromPath(fileName);
        var theCard: HTMLElement = this.GetcCardFromPath.call(this,fileName);
        if (theCard) {
            if (!this.cCards)
                this.cCards = new Array(1);
            this.cCards[0] = theCard;
            this.viewCard.appendChild(theCard);
        }   
        //* [2016-06-07 11:47] Settle its size             
        if (cardInfo.Size) {
            this.viewSize = cardInfo.Size;
            if (cardInfo.IsSizeFixed === undefined)
                cardInfo.IsSizeFixed = true;
        }
        else
            this.viewSize = [200, 200];
        //* [2016-06-07 11:47] Settle its position
        if (cardInfo.Position) {
            this.viewPosition = cardInfo.Position;
            if (cardInfo.IsXPosFixed === undefined)
                cardInfo.IsXPosFixed = true;
            if (cardInfo.IsYPosFixed === undefined)
                cardInfo.IsYPosFixed = true;

        }

        this.viewCard.style.position = "absolute";
        $(this.viewCard).addClass("WCard");
        if (!this.cardInfo.IsHideShadow)
            $(this.viewCard).addClass("hasShadow");
    }
    //#endregion   public IniCard(pathOrUrl: string). Initialize this Card
    
    //#region public IniBox(stContent:string). Initial box... fields
    public IniBox(stContent:string, thisWCard:WCard){
        var sentences: string[] = stContent.split('\n');
        for (var i0: number = 0; i0 < sentences.length; i0++) {
            var sentence = sentences[i0];
            if (sentence.length === 0)
                continue;
            var buf: string[] = sentence.split(/(\*\*\*\*\*|\+\+\+\+\+)/);
            //* [2016-03-17 10:12] Get each hyperlink, description & file directory
            if (buf[0] === "*****" || buf[0] === "+++++")
                continue;

            if (!thisWCard.cardsPath) {
                thisWCard.cardsPath = new Array();
                thisWCard.cardsHyperLink = new Array();
                thisWCard.cardsDescription = new Array();
            }   

            thisWCard.cardsPath.push(buf[0]);
            var ind: number = buf.indexOf("*****");
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
        thisWCard.boxIndex = (thisWCard.cardsPath)? MathHelper.MyRandomN(0, thisWCard.cardsPath.length-1):0;

        //* [2016-03-21 15:17] Embeded in two buttons: btLeft & btRight
        if (thisWCard.cardsPath.length > 1 && $(thisWCard.viewCard).children(".btLeft").length === 0) {
            var tbIth = document.createElement('div');
            var btLeft = document.createElement('button');
            var btRight = document.createElement('button');
            btLeft.className = "btLeft";
            btLeft.innerHTML = "<";
            btLeft.style.left = "0";
            btRight.style.top = btLeft.style.top="50%";
            btRight.style.opacity = btLeft.style.opacity = "0.3";
            btRight.style.position = btLeft.style.position = "absolute";
            btRight.className = "btRight";
            btRight.innerText = ">";
            btRight.style.right = "0";

            tbIth.className = "tbIth";
            tbIth.style.bottom = "0";
            tbIth.style.right = "0";
            tbIth.style.position = "absolute";

            btLeft.addEventListener('click', (ev) => {
                thisWCard.boxIndex = (thisWCard.boxIndex == 0) ? thisWCard.cCards.length - 1 : thisWCard.boxIndex - 1;
                ev.stopPropagation();
            });
            btRight.addEventListener('click', (ev) => {
                thisWCard.boxIndex = (thisWCard.boxIndex == (thisWCard.cCards.length - 1)) ? 0 : thisWCard.boxIndex + 1;
                ev.stopPropagation();
            });
            thisWCard.viewCard.appendChild(btLeft);
            thisWCard.viewCard.appendChild(btRight);
            thisWCard.viewCard.appendChild(tbIth);
        }
    }
    //#endregion public IniBox(stContent:string). Initial box... fields

    //#region public static function  GetFileType(pathOrUrl: string) :number. Get file type
    public static GetFileType(pathOrUrl: string): number {
        pathOrUrl = pathOrUrl.replace('\r', ""); pathOrUrl = pathOrUrl.replace('\n', " ");
        pathOrUrl = pathOrUrl.trim();
        var iDot : number = pathOrUrl.lastIndexOf('.') ;
        var extension: string = (iDot === 0 || iDot === pathOrUrl.length - 1 || iDot === -1) ? undefined : pathOrUrl.substr(iDot + 1, pathOrUrl.length - iDot - 1);
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
    }
    //#endregion function  GetFileType Get file type

    public GetcCardFromPath(cardPath: string, isInsideBox:boolean=false) :HTMLElement{
        var resObj: HTMLElement;

        var fileType = WCard.GetFileType(cardPath);
        var vWHRatio: number=Number.NaN;
        switch (fileType) {
            case (FileTypeEnum.Image):
                var img = new Image();
                img.className = WCard.cardMainKey;
                img.src = CardsHelper.GetTreatablePath(cardPath,this.mainFolder,this.categoryFolder);
                vWHRatio = img.naturalWidth / img.naturalHeight;
                resObj = img;
                break;
            case (FileTypeEnum.Text):
                var tbArea = document.createElement("textarea");
                tbArea.className = WCard.cardMainKey;
                MyFileHelper.ShowTextFromTxtFile(CardsHelper.GetTreatablePath(cardPath, this.mainFolder, this.categoryFolder)
                    , tbArea);
                resObj = tbArea;
                break;
            case (FileTypeEnum.Box):
                if (!isInsideBox) {
                    var pathOrUri: string = CardsHelper.GetTreatablePath(cardPath, this.mainFolder, this.categoryFolder);
                    MyFileHelper.FeedTextFromTxtFileToACallBack(pathOrUri, this, this.IniBox);
                }
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
    }

    public CardForMessage(className: string, stMsg: string): HTMLElement {
        var resObj: HTMLElement;

        return resObj;
    }

    public static CleanWCards() { //: TODO:
        while (WCard.showedWCards.length > 0) {
            WCard.showedWCards[0].RemoveThisWCard();
        }
        while (WCard.restWCards.length > 0) {
            WCard.restWCards[0].RemoveThisWCard();
        }
    }

    public RemoveThisWCard() {
        var isShown: boolean;
        var wcards: WCard[];
        var self = this as WCard;
        if (!self)
            return;
        
        isShown = (self.viewCard.parentNode != null) ? true : false;
        if (isShown) {
            self.viewCard.parentNode.removeChild(self.viewCard);
            wcards = WCard.showedWCards;
        }
        else
            wcards = WCard.restWCards;

        for (var i0: number = 0; i0 < wcards.length; i0++) {
            if (self === wcards[i0]) {
                wcards.splice(i0,1);
                break;
            }
        }
    }

    public static FindWCardFromViewCard(viewCard: HTMLDivElement): WCard {
        var wcards: WCard[] = WCard.showedWCards;
        for (var i0: number = 0; i0 < wcards.length; i0++) {
            if (viewCard === wcards[i0].viewCard) {
                return wcards[i0];
            }
        }
    }
}