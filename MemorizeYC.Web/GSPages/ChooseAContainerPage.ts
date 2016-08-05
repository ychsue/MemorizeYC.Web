/// <reference path="../models/eachcategory.ts" />
/// <reference path="../helpers/speechsynthesishelper.ts" />
/// <reference path="../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../helpers/myfilehelper.ts" />
/// <reference path="../helpers/versionhelper.ts" />
/// <reference path="../models/mycontainerjson.ts" />
/// <reference path="../helpers/pagetexthelper.ts" />
/// <reference path="../models/ccfromidb.ts" />
/// <reference path="../helpers/indexeddbhelper.ts" />

class ChooseAContainerPageController {
    public static Current: ChooseAContainerPageController;
    public static scope: any;
    public containers: Array<AContainer> = GlobalVariables.containers;
    public prevContainer: AContainer;
    public isShownCategories: boolean;
    //#region selContainer
    public selContainer: AContainer;
    private _selContainerID: number;
    get selContainerID():number {
        return this._selContainerID;
    }
    set selContainerID(value: number) {
        this._selContainerID = value;
        this.selContainer = this.containers[value];
    }
    //#endregion selContainer
    public categories: Array<EachCategory>;
    public selCategory: EachCategory;
    public CCFromIDB: CCFromIDB = {};
    public restTimesForContainer: Array<number> = [];
    public restTimesForCategory: Array<number> = [];

    //#region thisPageTexts
    get thisPageTexts(): ChooseAContainerPageJSON {
        if (!GlobalVariables.PageTexts)
            GlobalVariables.PageTexts = PageTextHelper.defaultPageTexts;
        return GlobalVariables.PageTexts.ChooseAContainerPageJSON;
    };
    set thisPageTexts(value: ChooseAContainerPageJSON) {
        //Do nothing
    };
    //#endregion thisPageTexts
    //#region LangsInString & SelPageTextLang
    get LangsInString(): Array<LangInStrings> {
        return GlobalVariables.LangsInStrings;
    }

    get SelPageTextLang():LangInStrings {
        return GlobalVariables.SelPageTextLang;
    }
    set SelPageTextLang(value: LangInStrings) {
        GlobalVariables.SelPageTextLang = value;
        PageTextHelper.InitPageTexts(() => {
            ChooseAContainerPageController.scope.$apply(() => {
                ChooseAContainerPageController.Current.thisPageTexts = null; //Just to notify it to renew the data so that any value is OK.
            });
        });
    }
    //#endregion LangsInString & SelPageTextLang

    constructor($scope, $routeParams) {
        //* [2016-06-06 12:04] Reload the web page if needed.
        VersionHelper.ReloadIfNeeded();

        ChooseAContainerPageController.Current = this;
        ChooseAContainerPageController.scope = $scope;

        //* [2016-07-11 15:02] Because its language might not ready, I use a trigger to tell me that it is done
        var renewPageTexts = () => {
            ChooseAContainerPageController.scope.$apply(() => {
                ChooseAContainerPageController.Current.thisPageTexts = null;
            });
            $(document).off(GlobalVariables.PageTextChangeKey, renewPageTexts);
        };
        $(document).off(GlobalVariables.PageTextChangeKey,renewPageTexts);
        $(document).on(GlobalVariables.PageTextChangeKey, renewPageTexts);

        if (GlobalVariables.isLog) {
            console.log("ChooseAContainerPageController in");
            console.log(location.origin);
        }

        IndexedDBHelper.GetWholeCCFromIDBAsync(this.CCFromIDB, this.callbackShowNextTimeForContainer);
    }

    //#region EVENTS
    public onHowToShowWholeCC_Click(ev: Event,value:number) {
        //var value: number = 1;
        var bothDivJQuery:JQuery = $("#divContainer, #divCategory");
        if (value > 0) {
            var divCategoryHeight: number = $("#divCategory").height();
            bothDivJQuery.removeClass("WholeContainer WholeCategory Half");
            if (divCategoryHeight <= 0)
                bothDivJQuery.addClass("Half");
            else
                bothDivJQuery.addClass("WholeCategory");
        } else if (value < 0) {
            var divContainerHeight: number = $("#divContainer").height();
            bothDivJQuery.removeClass("WholeContainer WholeCategory Half");
            if (divContainerHeight <= 0)
                bothDivJQuery.addClass("Half");
            else
                bothDivJQuery.addClass("WholeContainer");
        }
    };
    public onContainerClick = (ev: Event, id: number) => {
        if($("#divCategory").height()===0)
            ChooseAContainerPageController.Current.onHowToShowWholeCC_Click(null, 1);
        $(".MyContainer.ImgOK").removeClass('Show');
        $(".MyContainer.Main").removeClass('Empty');
        ChooseAContainerPageController.Current.selContainerID = id;

        //* [2016-07-28 16:58] release the trigger upon the previous Container
        var prevContainer = ChooseAContainerPageController.Current.prevContainer;
        if (prevContainer && prevContainer.idTrigger != "") {
            $(document).off(prevContainer.idTrigger);
        }
        //* [2016-07-28 17:00] Decide whether to show Categories
        var thisContainer = ChooseAContainerPageController.Current.containers[ChooseAContainerPageController.Current.selContainerID];
        if (thisContainer.idTrigger === "") {
            ChooseAContainerPageController.Current.isShownCategories = true;
            ChooseAContainerPageController.Current.categories = thisContainer.categories;
            ChooseAContainerPageController.Current.selCategory = null;
        } else {
            ChooseAContainerPageController.Current.isShownCategories = false;
            $(document).one(thisContainer.idTrigger, (ev) => {
                thisContainer.idTrigger = "";
                ChooseAContainerPageController.scope.$apply(() => {
                    ChooseAContainerPageController.Current.isShownCategories = true;
                    ChooseAContainerPageController.Current.categories = thisContainer.categories;
                    ChooseAContainerPageController.Current.selCategory = null;
                });
            });
        }

        ChooseAContainerPageController.Current.prevContainer = thisContainer;

        if (ev) {
            $(ev.target).addClass('Show');
            $((<HTMLElement>(ev.target)).parentElement).addClass('Empty');
        }

        //* [2016-07-31 14:53] Show restTime for each category
        ChooseAContainerPageController.Current.callbackRestTimesForCategory();

    };

    public onCategoryClick(ev: Event,id: number) {
        $(".MyCategory.ImgOK").removeClass("Show");
        ChooseAContainerPageController.Current.selCategory = ChooseAContainerPageController.Current.categories[id];
        $(ev.target).addClass('Show');
    }
    //#endregion EVENTS
    //#region CALLBACKS
    public callbackShowNextTimeForContainer() {
        var CCFromIDB = ChooseAContainerPageController.Current.CCFromIDB;
        var containers = ChooseAContainerPageController.Current.containers;
        for (var key0 in CCFromIDB) {
            var lastNTime: number = CCFromIDB[key0].lastNextTime;
            var restDays: number = Math.round((lastNTime - Date.now()) / 8640000) / 10;
            //* [2016-07-31 14:02] Show NextTime for Container
            for (var i0 = 0; i0 < containers.length; i0++) {
                if (containers[i0].itsLocation === key0) {
                    ChooseAContainerPageController.scope.$apply(() => {
                        ChooseAContainerPageController.Current.restTimesForContainer[i0] = restDays;
                    });
                    break;
                }
            }
        }
    }

    public callbackRestTimesForCategory() {
        ChooseAContainerPageController.Current.restTimesForCategory = [];
        var container = ChooseAContainerPageController.Current.CCFromIDB[
            ChooseAContainerPageController.Current.containers[ChooseAContainerPageController.Current.selContainerID].itsLocation];
        if (!container)
            return;
        var categoriesFromIDB = container.Categories;
        var categories = ChooseAContainerPageController.Current.categories;
        for (var key in categoriesFromIDB) {
            var restTime: number = Math.round((categoriesFromIDB[key].nextTime - Date.now()) / 8640000) / 10;
            for (var i0 = 0; i0 < categories.length; i0++) {
                if (key === categories[i0].Folder) {
                    ChooseAContainerPageController.Current.restTimesForCategory[i0] = restTime;
                    break;
                }
            }
        }
    }
    //#endregion CALLBACKS
}

class AContainer {
    public itsLocation: string;
    public showedName: string;
    public categories:Array<EachCategory>;
    public idTrigger: string = ""; //Its value will be Date.now() when it is getting data from the server.

    public constructor(pos: string) {
        this.itsLocation = pos;
        this.showedName = pos.substr(pos.lastIndexOf('/') + 1);
        this.idTrigger = Date.now().toString(); //It will be set as "" when the categories are gotten.

        MyFileHelper.FeedTextFromTxtFileToACallBack(pos+"/"+GlobalVariables.containerListFileName,
            this,
            this.UpdateCategories);
    }

    public UpdateCategories(jsonTxt: string, aContainer: AContainer) {
        //* [2016-07-28 16:33] Update a Container's categories
        if (GlobalVariables.isLog) {
            console.log("AContainer: " + jsonTxt);
        }
        var obj = JSON.parse(jsonTxt) as MYContainerJson;
        aContainer.categories = [];
        for (var i0: number = 0; i0 < obj.Categories.length; i0++) {
            aContainer.categories.push(obj.Categories[i0]);
        }
        //* [2016-07-28 16:34] Trigger the event
        $(document).trigger(aContainer.idTrigger);
        aContainer.idTrigger = "";
    };
}