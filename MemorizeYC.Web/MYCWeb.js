var PlayTypeEnum = (function () {
    function PlayTypeEnum() {
    }
    PlayTypeEnum.syn = "syn";
    PlayTypeEnum.rec = "rec";
    PlayTypeEnum.hint = "hint";
    return PlayTypeEnum;
}());
var GlobalVariables = (function () {
    function GlobalVariables() {
    }
    GlobalVariables.categoryListFileName = "MYCategory.json";
    GlobalVariables.containerListFileName = "MYContainer.json";
    GlobalVariables.isHostNameShown = true;
    GlobalVariables.isLog = false;
    GlobalVariables.isIOS = /iP/i.test(navigator.userAgent);
    GlobalVariables.rootDir = "/";
    GlobalVariables.currentMainFolder = GlobalVariables.rootDir + "Samples/MYContainer";
    GlobalVariables.currentCategoryFolder = "ShapeAndColor";
    GlobalVariables.onSingleClick = "onSingleClick";
    GlobalVariables.onDoubleClick = "onDoubleClick";
    GlobalVariables.numCardClick = 0;
    GlobalVariables.timerCardClickId = Number.NaN;
    GlobalVariables.clickedViewCard = null;
    GlobalVariables.PlayType = PlayTypeEnum.syn;
    GlobalVariables.currentDocumentSize = [0, 0];
    GlobalVariables.version = "2016.0606.1.3";
    GlobalVariables.versionFile = GlobalVariables.rootDir + "version.json";
    return GlobalVariables;
}());
var MyFileHelper = (function () {
    function MyFileHelper() {
    }
    MyFileHelper.ShowTextFromTxtFile = function (pathOrUrl, tbResult) {
        var request = new XMLHttpRequest();
        request.open("GET", pathOrUrl, true);
        request.onloadend = function (ev) {
            tbResult.innerText = request.responseText;
        };
        request.send();
    };
    MyFileHelper.FeedTextFromTxtFileToACallBack = function (pathOrUrl, thisCard, callback) {
        var request = new XMLHttpRequest();
        request.open("GET", pathOrUrl, true);
        request.onloadend = function (ev) {
            if (GlobalVariables.isLog) {
                console.log("FeedTextFromTxtFileToACallBack: " + request);
            }
            callback(request.responseText, thisCard);
        };
        request.send();
    };
    return MyFileHelper;
}());
var FileTypeEnum = (function () {
    function FileTypeEnum() {
    }
    FileTypeEnum.Image = 1;
    FileTypeEnum.Text = 2;
    FileTypeEnum.Box = 4;
    FileTypeEnum.Undefined = 8;
    return FileTypeEnum;
}());
var WCard = (function () {
    function WCard(cardInfo, mainFolder, categoryFolder) {
        if (mainFolder === void 0) { mainFolder = ""; }
        if (categoryFolder === void 0) { categoryFolder = ""; }
        this.viewCard = document.createElement("div");
        this._viewSize = [100, 100];
        this._viewPosition = [100, 100];
        this._boxIndex = 0;
        this._mainFolder = "";
        this._categoryFolder = "";
        this.mainFolder = mainFolder;
        this.categoryFolder = categoryFolder;
        this.IniCard(cardInfo);
        var viewCard = this.viewCard;
        $(viewCard).on('click', function (ev) {
            var mouseDownTime = WCard.mouseDownTime;
            WCard.mouseDownTime = Date.now();
            if (GlobalVariables.numCardClick === 0 && WCard.mouseDownTime - mouseDownTime > 200)
                return;
            GlobalVariables.numCardClick++;
            GlobalVariables.clickedViewCard = this;
            if (!isNaN(GlobalVariables.timerCardClickId))
                clearTimeout(GlobalVariables.timerCardClickId);
            GlobalVariables.timerCardClickId = setTimeout(function () {
                var num = GlobalVariables.numCardClick;
                var clickedViewCard = GlobalVariables.clickedViewCard;
                var thisWCard = WCard.FindWCardFromViewCard(clickedViewCard);
                if (num == 1) {
                    $(thisWCard).trigger(GlobalVariables.onSingleClick);
                }
                else if (num == 2) {
                    $(thisWCard).trigger(GlobalVariables.onDoubleClick);
                }
                else
                    ;
                GlobalVariables.numCardClick = 0;
                GlobalVariables.timerCardClickId = Number.NaN;
                console.log("Click num =" + num);
            }, 300);
        });
        $(viewCard).on('mousedown', function () {
            WCard.mouseDownTime = Date.now();
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
            var oldCards = this.viewCard.getElementsByClassName(WCard.cardMainKey);
            if (oldCards.length != 0)
                this.viewCard.removeChild(oldCards[0]);
            if (!this.cCards[value]) {
                this.cCards[value] = this.GetcCardFromPath.call(this, this.cardsPath[value], true);
                if (!this.cCards[value]) {
                    this.cCards[value] = this.CardForMessage(WCard.cardMainKey, this.cardsPath[value] + " cannot be opened.");
                }
            }
            if (isNaN(this.viewWHRatio[value]) && this.cCards[value]["naturalHeight"])
                this.viewWHRatio[value] = (this.cCards[value]["naturalWidth"]) / (this.cCards[value]["naturalHeight"]);
            var bufHeight = (isNaN(this.viewWHRatio[value])) ? this.viewSize[1] : (this.viewSize[0] / this.viewWHRatio[value]);
            this.viewSize = [this.viewSize[0], bufHeight];
            this.cCards[value].style.zIndex = "1";
            this.viewCard.appendChild(this.cCards[value]);
            var tbIth = this.viewCard.getElementsByClassName('tbIth')[0];
            if (tbIth)
                tbIth.innerText = (value + 1).toString() + "/" + this.cCards.length.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WCard.prototype, "mainFolder", {
        get: function () {
            return this._mainFolder;
        },
        set: function (value) {
            this._mainFolder = (value.length != 0 && value.charAt(value.length - 1) === '/') ? value.substr(0, value.length - 1) : value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WCard.prototype, "categoryFolder", {
        get: function () {
            return this._categoryFolder;
        },
        set: function (value) {
            this._categoryFolder = (value.length != 0 && value.charAt(value.length - 1) === '/') ? value.substr(0, value.length - 1) : value;
        },
        enumerable: true,
        configurable: true
    });
    WCard.prototype.IniCard = function (cardInfo) {
        this.cardInfo = cardInfo;
        var fileName = cardInfo.FileName;
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
    WCard.prototype.IniBox = function (stContent, thisWCard) {
        var sentences = stContent.split('\n');
        for (var i0 = 0; i0 < sentences.length; i0++) {
            var sentence = sentences[i0];
            if (sentence.length === 0)
                continue;
            var buf = sentence.split(/(\*\*\*\*\*|\+\+\+\+\+)/);
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
        thisWCard.boxIndex = MathHelper.MyRandomN(0, thisWCard.cardsPath.length - 1);
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
                ev.stopPropagation();
            });
            btRight.addEventListener('click', function (ev) {
                thisWCard.boxIndex = (thisWCard.boxIndex == (thisWCard.cCards.length - 1)) ? 0 : thisWCard.boxIndex + 1;
                ev.stopPropagation();
            });
            thisWCard.viewCard.appendChild(btLeft);
            thisWCard.viewCard.appendChild(btRight);
            thisWCard.viewCard.appendChild(tbIth);
        }
    };
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
                if (!isInsideBox) {
                    var pathOrUri = CardsHelper.GetTreatablePath(cardPath, this.mainFolder, this.categoryFolder);
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
    WCard.showedWCards = new Array();
    WCard.restWCards = new Array();
    WCard.cardMainKey = "cardMain";
    WCard.btLeftClickKey = "btLeftClick";
    WCard.btRightClickKey = "btRightClick";
    return WCard;
}());
var PlayOneCategoryPageController = (function () {
    function PlayOneCategoryPageController($scope, $routeParams) {
        this.meCardsAudio = document.getElementById('meCardsAudio');
        this.meBackground = document.getElementById('meBackground');
        this.dlDblClickWCard = document.getElementById('dlDblClickWCard');
        this.dlFinish = document.getElementById('dlFinish');
        this.ddSettings = document.getElementById('ddSettings');
        this.imgBackground = document.getElementById('imgBackground');
        this.btSynPlay = document.getElementById('btSynPlay');
        this.isBackAudioStartLoad = false;
        this.maxDelScore = 20;
        this.pgScore = document.getElementById('pgScore');
        this._rate2PowN = 0;
        this.ShowNewWCards_Click = function () {
            if (PlayOneCategoryPageController.Current.selWCard)
                $(PlayOneCategoryPageController.Current.selWCard.viewCard).removeClass(PlayOneCategoryPageController.styleSelWCard);
            var bufWCards = new Array();
            var shWCards = WCard.showedWCards;
            var rtWCards = WCard.restWCards;
            var N = PlayOneCategoryPageController.numWCardShown;
            var nShToRt = Math.max(0, shWCards.length + Math.min(rtWCards.length, N) - N);
            CardsHelper.MoveArrayElements(shWCards, bufWCards, nShToRt, PlayOneCategoryPageController.isPickWCardsRandomly);
            CardsHelper.MoveArrayElements(rtWCards, shWCards, N, PlayOneCategoryPageController.isPickWCardsRandomly, $(".cvMain"));
            CardsHelper.MoveArrayElements(bufWCards, rtWCards, nShToRt);
            PlayOneCategoryPageController.Current.numRestWCards;
            CardsHelper.RearrangeCards(shWCards, PlayOneCategoryPageController.oneOverNWindow);
        };
        this.Smaller_Click = function (ev) {
            PlayOneCategoryPageController.oneOverNWindow *= 1.2;
            CardsHelper.RearrangeCards(WCard.showedWCards, PlayOneCategoryPageController.oneOverNWindow);
            PlayOneCategoryPageController.Current.defaultCardStyle = {
                width: PlayOneCategoryPageController.Current.defaultCardWidth + "px",
                height: PlayOneCategoryPageController.Current.defaultCardHeight + "px"
            };
            ev.stopPropagation();
        };
        this.Larger_Click = function (ev) {
            PlayOneCategoryPageController.oneOverNWindow /= 1.2;
            CardsHelper.RearrangeCards(WCard.showedWCards, PlayOneCategoryPageController.oneOverNWindow);
            PlayOneCategoryPageController.Current.defaultCardStyle = {
                width: PlayOneCategoryPageController.Current.defaultCardWidth + "px",
                height: PlayOneCategoryPageController.Current.defaultCardHeight + "px"
            };
            ev.stopPropagation();
        };
        this.Arrange_Click = function (isRandomly) {
            CardsHelper.RearrangeCards(WCard.showedWCards, PlayOneCategoryPageController.oneOverNWindow, isRandomly, false);
        };
        this.OpenHyperLink_Click = function () {
            if (PlayOneCategoryPageController.Current.hyperLink)
                window.open(PlayOneCategoryPageController.Current.hyperLink);
        };
        this.synPlay_Click = function (ev) {
            if (!PlayOneCategoryPageController.Current.synAnsWCard) {
                PlayOneCategoryPageController.Current.synPlayNext_Click(null);
            }
            if (PlayOneCategoryPageController.Current.synAnsWCard) {
                var synAnsWCard = PlayOneCategoryPageController.Current.synAnsWCard;
                if (synAnsWCard.cardInfo.AudioFilePathOrUri) {
                    var meAud = PlayOneCategoryPageController.Current.meCardsAudio;
                    meAud.src = CardsHelper.GetTreatablePath(synAnsWCard.cardInfo.AudioFilePathOrUri, PlayOneCategoryPageController.Current.Container, PlayOneCategoryPageController.Current.CFolder);
                    meAud.load();
                    meAud.play();
                }
                if (!PlayOneCategoryPageController.Current.scoreTimerId) {
                    PlayOneCategoryPageController.Current.localMinusScore = 0;
                    PlayOneCategoryPageController.Current.scoreTimerId = setInterval(function () {
                        if ($(PlayOneCategoryPageController.Current.ddSettings).css('display') != 'none')
                            return;
                        PlayOneCategoryPageController.Current.localMinusScore++;
                        var score = PlayOneCategoryPageController.Current.localMinusScore;
                        if (score > PlayOneCategoryPageController.Current.maxDelScore) {
                            clearInterval(PlayOneCategoryPageController.Current.scoreTimerId);
                            PlayOneCategoryPageController.Current.scoreTimerId = null;
                        }
                        else {
                            PlayOneCategoryPageController.scope.$apply(function () {
                                PlayOneCategoryPageController.Current.totalScore--;
                            });
                        }
                    }, 1000);
                }
            }
        };
        this.synPlayNext_Click = function (ev) {
            var wcards = WCard.showedWCards;
            if (wcards.length === 0) {
                PlayOneCategoryPageController.Current.ShowNewWCards_Click();
                wcards = WCard.showedWCards;
            }
            if (wcards.length === 0) {
                PlayOneCategoryPageController.Current.ShowdlFinish();
                return;
            }
            var ith = MathHelper.MyRandomN(0, wcards.length - 1);
            PlayOneCategoryPageController.Current.synAnsWCard = wcards[ith];
            PlayOneCategoryPageController.Current.synPlay_Click(ev);
        };
        this.recCheckAnswer_Click = function () {
            if (PlayOneCategoryPageController.Current.selWCard && PlayOneCategoryPageController.Current.recInputSentence && PlayOneCategoryPageController.Current.selWCard.cardInfo.Dictate.trim().
                indexOf(PlayOneCategoryPageController.Current.recInputSentence.trim()) === 0) {
                $(PlayOneCategoryPageController.Current.selWCard.viewCard).animate({ opacity: 0.1 }, {
                    duration: 100,
                    step: function (now, fx) {
                        $(this).css('transform', 'scale(' + 1 / now + ',' + 1 / now + ')');
                    },
                    complete: function () {
                        if (PlayOneCategoryPageController.Current.selWCard)
                            PlayOneCategoryPageController.Current.selWCard.RemoveThisWCard();
                        PlayOneCategoryPageController.Current.selWCard = null;
                        if (WCard.showedWCards.length === 0)
                            PlayOneCategoryPageController.Current.ShowNewWCards_Click();
                        if (WCard.showedWCards.length === 0) {
                            PlayOneCategoryPageController.Current.ShowdlFinish();
                            return;
                        }
                    }
                });
            }
            else {
                if (PlayOneCategoryPageController.Current.selWCard) {
                    alert("Your answer is wrong.");
                    PlayOneCategoryPageController.Current.totalScore -= 3;
                }
                else {
                    alert("Click a card at first.");
                }
            }
        };
        VersionHelper.ReloadIfNeeded();
        PlayOneCategoryPageController.Current = this;
        PlayOneCategoryPageController.scope = $scope;
        WCard.CleanWCards();
        if (GlobalVariables.isIOS)
            $(PlayOneCategoryPageController.Current.imgBackground).css('cursor', 'pointer');
        this.btSynPlay.addEventListener("click", this.synPlay_Click);
        GlobalVariables.currentDocumentSize = [$(document).innerWidth(), $(document).innerHeight()];
        $(this.dlDblClickWCard).dialog({ autoOpen: false, modal: true });
        $(this.dlFinish).dialog({
            autoOpen: false, modal: true, dialogClass: "no-close",
            buttons: [{
                    text: "OK",
                    click: function () {
                        history.back();
                        $(PlayOneCategoryPageController.Current.dlFinish).dialog('close');
                    }
                }]
        });
        $(document).tooltip();
        if ($routeParams["Container"] != undefined)
            GlobalVariables.currentMainFolder = $routeParams["Container"];
        if ($routeParams["CFolder"] != undefined)
            GlobalVariables.currentCategoryFolder = $routeParams["CFolder"];
        this.Container = GlobalVariables.currentMainFolder;
        this.CFolder = GlobalVariables.currentCategoryFolder;
        this.topNavbarHeight = $("#topNavbar").height();
        this.bottomNavbarHeight = $("#bottomNavbar").height();
        this.numWCardShown = 8;
        this.isPickWCardsRandomly = true;
        var pathOrUri = CardsHelper.GetTreatablePath(GlobalVariables.categoryListFileName, this.Container, this.CFolder);
        if (GlobalVariables.isLog)
            console.log("PlayOneCategoryPage:constructor:pathOrUri= " + pathOrUri);
        MyFileHelper.FeedTextFromTxtFileToACallBack(pathOrUri, WCard.restWCards, ShowWCardsAndEventsCallback);
        $(window).on("resize", function (ev) {
            if (GlobalVariables.currentDocumentSize[0] === $(document).innerWidth() && GlobalVariables.currentDocumentSize[1] === $(document).innerHeight())
                return;
            GlobalVariables.currentDocumentSize[0] = $(document).innerWidth();
            GlobalVariables.currentDocumentSize[1] = $(document).innerHeight();
            var wcards = WCard.showedWCards;
            CardsHelper.RearrangeCards(wcards, PlayOneCategoryPageController.oneOverNWindow);
            PlayOneCategoryPageController.scope.$apply(function () {
                if (wcards.length > 0) {
                    PlayOneCategoryPageController.Current.defaultCardStyle = {
                        width: PlayOneCategoryPageController.Current.defaultCardWidth + "px",
                        height: PlayOneCategoryPageController.Current.defaultCardHeight + "px"
                    };
                }
            });
        });
    }
    Object.defineProperty(PlayOneCategoryPageController.prototype, "totalScore", {
        get: function () {
            return this._totalScore;
        },
        set: function (value) {
            this._totalScore = (value >= 0) ? value : 0;
            $(this.pgScore).css('width', Math.floor(value / this.glScore * 100).toString() + "%");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayOneCategoryPageController.prototype, "rate2PowN", {
        get: function () {
            return this._rate2PowN;
        },
        set: function (value) {
            var meAud = this.meCardsAudio;
            meAud.defaultPlaybackRate = Math.pow(2, value);
            this._rate2PowN = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayOneCategoryPageController.prototype, "numWCardShown", {
        get: function () {
            return PlayOneCategoryPageController.numWCardShown;
        },
        set: function (value) {
            PlayOneCategoryPageController.numWCardShown = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayOneCategoryPageController.prototype, "isPickWCardsRandomly", {
        get: function () {
            return PlayOneCategoryPageController.isPickWCardsRandomly;
        },
        set: function (value) {
            PlayOneCategoryPageController.isPickWCardsRandomly = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayOneCategoryPageController.prototype, "numRestWCards", {
        get: function () {
            return WCard.restWCards.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayOneCategoryPageController.prototype, "playType", {
        get: function () {
            return GlobalVariables.PlayType;
        },
        set: function (value) {
            if (GlobalVariables.PlayType != value) {
                if (value === PlayTypeEnum.rec) {
                    if (PlayOneCategoryPageController.Current.scoreTimerId) {
                        clearInterval(PlayOneCategoryPageController.Current.scoreTimerId);
                        PlayOneCategoryPageController.Current.scoreTimerId = null;
                        PlayOneCategoryPageController.Current.localMinusScore = 0;
                    }
                }
                else if (value === PlayTypeEnum.hint) {
                    PlayOneCategoryPageController.Current.totalScore -= PlayOneCategoryPageController.Current.maxDelScore;
                }
                GlobalVariables.PlayType = value;
                if (PlayOneCategoryPageController.Current.selWCard) {
                    $(PlayOneCategoryPageController.Current.selWCard.viewCard).removeClass(PlayOneCategoryPageController.styleSelWCard);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    PlayOneCategoryPageController.prototype.SetGlobalScore = function (wcards) {
        this.glScore = this.maxDelScore * wcards.length;
        this.totalScore = this.glScore;
    };
    PlayOneCategoryPageController.prototype.ShowdlFinish = function () {
        var nFinal = PlayOneCategoryPageController.Current.totalScore;
        var nAll = PlayOneCategoryPageController.Current.glScore;
        PlayOneCategoryPageController.scope.$apply(function () {
            PlayOneCategoryPageController.Current.level = Math.max(0, Math.round((nFinal / nAll - 0.5) * 20));
        });
        $(PlayOneCategoryPageController.Current.dlFinish).dialog('open');
        PlayOneCategoryPageController.Current.meBackground.pause();
    };
    PlayOneCategoryPageController.oneOverNWindow = 5;
    PlayOneCategoryPageController.styleSelWCard = "selWCard";
    return PlayOneCategoryPageController;
}());
function ShowWCardsAndEventsCallback(jsonTxt, restWcards) {
    var showedWcards = WCard.showedWCards;
    var ith = 0;
    var jObj = JSON.parse(jsonTxt);
    CardsHelper.GetWCardsCallback(jObj, restWcards);
    PlayOneCategoryPageController.Current.hyperLink = jObj["Link"];
    if (jObj["Background"]) {
        if (jObj["Background"]["ImgStyle"])
            $(PlayOneCategoryPageController.Current.imgBackground).css(jObj["Background"]["ImgStyle"]);
        if (jObj["Background"]["AudioProperties"]) {
            $(PlayOneCategoryPageController.Current.meBackground).prop(jObj["Background"]["AudioProperties"]);
            $(document).one("click", function (ev) {
                PlayOneCategoryPageController.Current.meBackground.load();
                PlayOneCategoryPageController.Current.meBackground.play();
            });
        }
    }
    PlayOneCategoryPageController.Current.SetGlobalScore(restWcards);
    for (var i0 = 0; i0 < restWcards.length; i0++) {
        $(restWcards[i0]).on(GlobalVariables.onSingleClick, { thisWCard: restWcards[i0] }, function (ev) {
            var prevWCard = PlayOneCategoryPageController.Current.selWCard;
            var selWCard = ev.data.thisWCard;
            PlayOneCategoryPageController.scope.$apply(function () {
                PlayOneCategoryPageController.Current.selWCard = selWCard;
            });
            if (PlayOneCategoryPageController.Current.playType === PlayTypeEnum.syn) {
                if (selWCard === PlayOneCategoryPageController.Current.synAnsWCard) {
                    if (PlayOneCategoryPageController.Current.scoreTimerId) {
                        clearInterval(PlayOneCategoryPageController.Current.scoreTimerId);
                        PlayOneCategoryPageController.Current.scoreTimerId = null;
                    }
                    $(selWCard.viewCard).animate({ opacity: 0.1 }, {
                        duration: 200,
                        step: function (now, fx) {
                            $(this).css('transform', 'scale(' + 1 / now + ',' + 1 / now + ')');
                        },
                        complete: function () {
                            PlayOneCategoryPageController.Current.selWCard.RemoveThisWCard();
                            PlayOneCategoryPageController.Current.synAnsWCard = null;
                            PlayOneCategoryPageController.Current.synPlayNext_Click(null);
                            PlayOneCategoryPageController.scope.$apply(function () {
                                PlayOneCategoryPageController.Current.synAnsWCard;
                            });
                        }
                    });
                }
                else {
                    if (!PlayOneCategoryPageController.Current.synAnsWCard) {
                        $('#btSynPlay').tooltip({
                            content: "You need to click this button at first!"
                        })
                            .tooltip('open');
                        return;
                    }
                    if (PlayOneCategoryPageController.Current.scoreTimerId) {
                        var delScore = 2;
                        if (PlayOneCategoryPageController.Current.localMinusScore + 2 > PlayOneCategoryPageController.Current.maxDelScore) {
                            delScore = Math.max(0, PlayOneCategoryPageController.Current.maxDelScore - PlayOneCategoryPageController.Current.localMinusScore);
                        }
                        PlayOneCategoryPageController.Current.totalScore -= delScore;
                        PlayOneCategoryPageController.Current.localMinusScore += 2;
                    }
                    $(selWCard.viewCard).animate({ opacity: 0.5 }, {
                        duration: 100,
                        step: function (now, fx) {
                            $(this).css('transform', 'rotate(' + (1 - now) * 360 + 'deg)');
                        },
                        complete: function () {
                            $(this).animate({ opacity: 1 }, {
                                duration: 100,
                                step: function (now, fx) {
                                    $(this).css('transform', 'rotate(' + (1 - now) * 360 + 'deg)');
                                }
                            });
                        }
                    });
                }
            }
            else if (PlayOneCategoryPageController.Current.playType === PlayTypeEnum.rec) {
                if (prevWCard)
                    $(prevWCard.viewCard).removeClass(PlayOneCategoryPageController.styleSelWCard);
                $(selWCard.viewCard).addClass(PlayOneCategoryPageController.styleSelWCard);
            }
            else if (PlayOneCategoryPageController.Current.playType === PlayTypeEnum.hint) {
                if (prevWCard)
                    $(prevWCard.viewCard).removeClass(PlayOneCategoryPageController.styleSelWCard);
                $(selWCard.viewCard).addClass(PlayOneCategoryPageController.styleSelWCard);
            }
        });
        $(restWcards[i0]).on(GlobalVariables.onDoubleClick, { thisWCard: restWcards[i0] }, function (ev) {
            PlayOneCategoryPageController.scope.$apply(function () {
                PlayOneCategoryPageController.Current.selWCard = ev.data.thisWCard;
            });
            var selWCard = PlayOneCategoryPageController.Current.selWCard;
            CardsHelper.ShowHLinkAndDesDialog(selWCard, PlayOneCategoryPageController.Current.dlDblClickWCard);
        });
        $(restWcards[i0].viewCard).draggable();
        $(restWcards[i0].viewCard).resizable();
        $(restWcards[i0].viewCard).on("resize", function (ev, ui) {
            ev.bubbles = false;
            var thisWCard = WCard.FindWCardFromViewCard(this);
            thisWCard.viewSize = [ui.size.width, ui.size.height];
        });
        restWcards[i0].viewCard.style.msTouchAction = "none";
        restWcards[i0].viewCard.style.touchAction = "none";
    }
    while (ith < PlayOneCategoryPageController.numWCardShown && restWcards.length > 0) {
        $(restWcards[0].viewCard).appendTo(".cvMain");
        showedWcards.push(restWcards[0]);
        restWcards.splice(0, 1);
        ith++;
    }
    PlayOneCategoryPageController.scope.$apply(function () {
        PlayOneCategoryPageController.Current.numRestWCards;
    });
    CardsHelper.RearrangeCards(showedWcards, PlayOneCategoryPageController.oneOverNWindow);
    if (showedWcards.length > 0) {
        PlayOneCategoryPageController.Current.defaultCardStyle = {
            width: PlayOneCategoryPageController.Current.defaultCardWidth + "px",
            height: PlayOneCategoryPageController.Current.defaultCardHeight + "px"
        };
    }
}
var app = angular.module('MYCWeb', ['ngRoute', 'ngAnimate']);
app.controller('PlayOneCategoryPageController', ['$scope', '$routeParams', PlayOneCategoryPageController]);
app.controller('ChooseAContainerPageController', ['$scope', ChooseAContainerPageController]);
app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/Play', {
        templateUrl: GlobalVariables.rootDir + 'PlayPage/PlayOneCategoryPage.html',
        controller: 'PlayOneCategoryPageController',
        controllerAs: 'ctrl'
    })
        .when('/', {
        templateUrl: GlobalVariables.rootDir + 'GSPages/ChooseAContainerPage.html',
        controller: 'ChooseAContainerPageController',
        controllerAs: 'ctrl'
    });
});
var myVersion = (function () {
    function myVersion() {
        this.version = GlobalVariables.version;
    }
    return myVersion;
}());
var VersionHelper = (function () {
    function VersionHelper() {
    }
    VersionHelper.ReloadIfNeeded = function () {
        MyFileHelper.FeedTextFromTxtFileToACallBack(GlobalVariables.versionFile + "?nocache=" + Date.now(), null, function (stJSON, buf) {
            try {
                var jObj = JSON.parse(stJSON);
            }
            catch (exc) {
                console.log("VersionHelper:JSON.parse error:" + exc.message);
                return;
            }
            if (GlobalVariables.isLog)
                console.log("old one:" + GlobalVariables.version + "  ,new one:" + jObj.version);
            if (jObj.version && jObj.version != GlobalVariables.version) {
                location.reload(true);
            }
        });
        return;
    };
    ;
    return VersionHelper;
}());
function ChooseAContainerPageController($scope) {
    VersionHelper.ReloadIfNeeded();
    if (GlobalVariables.isLog) {
        console.log("ChooseAContainerPageController in");
        console.log(location.origin);
    }
    var self = this;
    self.containers = [new AContainer(GlobalVariables.rootDir + "Samples/MYContainer"),
        new AContainer(GlobalVariables.rootDir + "Samples/健康操"),
        new AContainer(GlobalVariables.rootDir + "Samples/自然發音")
    ];
    self.selContainer = self.containers[0];
    self.categories;
    self.selCategory;
    self.GetPath = function () {
        var pathOrUrl = self.selContainer.itsLocation + "/" + GlobalVariables.containerListFileName;
        if (GlobalVariables.isHostNameShown)
            pathOrUrl = location.origin + pathOrUrl;
        return pathOrUrl;
    };
    self.onConChange = function onContainerChange() {
        MyFileHelper.FeedTextFromTxtFileToACallBack(self.GetPath(), self.categories, self.UpdateCategories);
    };
    self.UpdateCategories = function (jsonTxt, categories) {
        if (GlobalVariables.isLog) {
            console.log("ChooseAContainerPage:UpdateCategories: " + jsonTxt);
        }
        var obj = JSON.parse(jsonTxt);
        self.categories = [];
        categories = [];
        for (var i0 = 0; i0 < obj.Categories.length; i0++) {
            categories.push(obj.Categories[i0]);
        }
        $scope.$apply(function () {
            self.categories = categories;
            if (categories.length > 0)
                self.selCategory = categories[0];
        });
    };
    self.onConChange();
}
var AContainer = (function () {
    function AContainer(pos) {
        this.itsLocation = pos;
    }
    return AContainer;
}());
var MathHelper = (function () {
    function MathHelper() {
    }
    MathHelper.Permute = function (oldSet) {
        var newSet = new Array();
        while (oldSet.length > 0) {
            var i0 = MathHelper.MyRandomN(0, oldSet.length - 1);
            newSet.push(oldSet[i0]);
            oldSet.splice(i0, 1);
        }
        for (var i0 = 0; i0 < newSet.length; i0++) {
            oldSet.push(newSet[i0]);
        }
        return newSet;
    };
    MathHelper.MyRandomN = function (iStart, iEnd) {
        var ith;
        ith = Math.floor((iEnd - iStart + 1 - 1e-10) * Math.random() + iStart);
        return ith;
    };
    return MathHelper;
}());
var CardsHelper = (function () {
    function CardsHelper() {
    }
    CardsHelper.RearrangeCards = function (wcards, nCol, isRandom, isOptimizeSize) {
        if (nCol === void 0) { nCol = 5; }
        if (isRandom === void 0) { isRandom = false; }
        if (isOptimizeSize === void 0) { isOptimizeSize = true; }
        if (!wcards || wcards.length === 0)
            return;
        var topOfTop = 50;
        var currentPosition = [0, topOfTop];
        var wWidth = window.innerWidth;
        var wHeight = window.innerHeight - topOfTop;
        if (isRandom)
            MathHelper.Permute(wcards);
        var maxWidth = 0;
        for (var i1 = 0; i1 < wcards.length; i1++) {
            var card = wcards[i1];
            var size = [wWidth / nCol, wHeight / nCol];
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
                card.viewSize = size;
            var predictTop = currentPosition[1] + card.viewSize[1] + 20;
            if (predictTop > wHeight) {
                currentPosition = [currentPosition[0] + maxWidth + 20, topOfTop];
                maxWidth = card.viewSize[0];
            }
            else {
                maxWidth = Math.max(maxWidth, card.viewSize[0]);
            }
            card.viewPosition = currentPosition;
            if (predictTop < wHeight)
                currentPosition[1] = predictTop;
            else
                currentPosition[1] += card.viewSize[1] + 20;
        }
        PlayOneCategoryPageController.Current.defaultCardHeight = wcards[0].viewCard.clientHeight;
        PlayOneCategoryPageController.Current.defaultCardWidth = wcards[0].viewCard.clientWidth;
    };
    CardsHelper.GetTreatablePath = function (cardPath, mainFolder, categoryFolder) {
        if (mainFolder === void 0) { mainFolder = ""; }
        if (categoryFolder === void 0) { categoryFolder = ""; }
        var newPath;
        var hasProtocol = true;
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
    };
    CardsHelper.GetWCardsCallback = function (jObj, cards) {
        if (!jObj)
            return;
        var des = jObj["Cards"];
        if (!des)
            return;
        for (var i0 = 0; i0 < des.length; i0++) {
            var eachDescription = des[i0];
            CardsHelper.UpdateEachDescription(des[i0]);
            var card = new WCard(eachDescription, GlobalVariables.currentMainFolder, GlobalVariables.currentCategoryFolder);
            if (card)
                cards.push(card);
        }
    };
    CardsHelper.UpdateEachDescription = function (des) {
        if (!des.Dictate && des.FileName) {
            var iDot = des.FileName.lastIndexOf('.');
            if (iDot > 0)
                des.Dictate = decodeURIComponent(des.FileName.substring(0, iDot));
        }
    };
    CardsHelper.MoveArrayElements = function (from, to, numToMove, isRandomly, myAppendTo) {
        if (isRandomly === void 0) { isRandomly = false; }
        if (myAppendTo === void 0) { myAppendTo = null; }
        var i0 = 0;
        while (i0 < numToMove && from.length > 0) {
            i0++;
            var ith = (isRandomly) ?
                MathHelper.MyRandomN(0, from.length - 1) :
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
    CardsHelper.ShowHLinkAndDesDialog = function (wcard, diEle) {
        var btns = new Array();
        var isLinking = false;
        var isDescripted = false;
        var inStr1, inStr2;
        if (wcard.cardInfo.Link) {
            inStr1 = wcard.cardInfo.Link;
            isLinking = true;
        }
        else if (wcard.cardsHyperLink && wcard.boxIndex >= 0 && wcard.cardsHyperLink[wcard.boxIndex]) {
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
        if (wcard.cardInfo.Description) {
            inStr2 = wcard.cardInfo.Description;
            isDescripted = true;
        }
        else if (wcard.cardsDescription && wcard.boxIndex >= 0 && wcard.cardsDescription[wcard.boxIndex]) {
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
        if (isLinking || isDescripted) {
            $(diEle).dialog({
                buttons: btns
            });
            $(diEle).dialog('open');
        }
    };
    return CardsHelper;
}());
//# sourceMappingURL=MYCWeb.js.map