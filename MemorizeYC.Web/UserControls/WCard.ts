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
    //The view for HTML
    viewCard: HTMLDivElement = document.createElement("div"); 
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
    _viewPosition: number[] = [100, 100];
    get viewPosition() { return this._viewPosition; }
    set viewPosition(value: number[]) {
        this._viewPosition = value;
        this.viewCard.style.left = value[0].toString() + "px";
        this.viewCard.style.top = value[1].toString() + "px";
        if (this.cCards)
            for (var i0: number = 0; i0 < this.cCards.length; i0++) {
                if (this.cCards[i0]) {
                    this.cCards[i0].style.left = value[0].toString() + "px";
                    this.cCards[i0].style.top = value[1].toString() + "px";
                }
            }
    }
    //#endregion viewPosition Property
    viewWHRatio: number[];

    cCards: HTMLElement[];
    cardInfo: EachDescription;
    
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
            this.cCards[value] = this.GetcCardFromPath(this.cardsPath[value], true);
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
            tbIth.innerText = value.toString() + "/" + this.cCards.length.toString();
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
    cardsPath: string[];
    cardsHyperLink: string[];
    cardsDescription: string[];

    static cardMainKey: string = "cardMain";
    static btLeftClickKey: string = "btLeftClick";
    static btRightClickKey: string = "btRightClick";

    constructor(cardInfo: EachDescription, mainFolder: string = "", categoryFolder: string = "") {
        this.mainFolder = mainFolder;
        this.categoryFolder = categoryFolder;
        this.IniCard(cardInfo);
    }

    //#region   public IniCard(pathOrUrl: string). Initialize this Card
    public IniCard(cardInfo: EachDescription) {
        this.cardInfo = cardInfo;

        var fileName = cardInfo.FileName;
        var theCard: HTMLElement = this.GetcCardFromPath(fileName);
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
        thisWCard.boxIndex = Math.round((thisWCard.cardsPath.length - 2e-10) * Math.random() - 0.5 + 1e-10);

        //* [2016-03-21 15:17] Embeded in two buttons: btLeft & btRight
        if (thisWCard.cardsPath.length > 1 && document.getElementsByClassName("btLeft").length === 0) {
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
            });
            btRight.addEventListener('click', (ev) => {
                thisWCard.boxIndex = (thisWCard.boxIndex == (thisWCard.cCards.length - 1)) ? 0 : thisWCard.boxIndex + 1;
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
                if(!isInsideBox)
                    MyFileHelper.FeedTextFromTxtFileToACallBack(CardsHelper.GetTreatablePath(cardPath, this.mainFolder, this.categoryFolder)
                         , this, this.IniBox);
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
}