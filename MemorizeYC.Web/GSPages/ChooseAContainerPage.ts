/// <reference path="../helpers/speechsynthesishelper.ts" />
/// <reference path="../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../helpers/myfilehelper.ts" />
/// <reference path="../helpers/versionhelper.ts" />
/// <reference path="../models/mycontainerjson.ts" />
/// <reference path="../helpers/pagetexthelper.ts" />

class ChooseAContainerPageController {
    public static Current: ChooseAContainerPageController;
    public static scope: any;
    public containers: Array<AContainer> = GlobalVariables.containers;
    public selContainer = this.containers[0];
    public categories;
    public selCategory;

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
        //* [2016-05-04 17:23] Force it to update its Container
        this.onConChange();
    }

    //* [2016-06-02 20:21] Get the path with protocol,hostname and port
    public GetPath(): string {
        var pathOrUrl: string = ChooseAContainerPageController.Current.selContainer.itsLocation + "/" + GlobalVariables.containerListFileName;
        if (GlobalVariables.isHostNameShown)
            pathOrUrl = location.origin + pathOrUrl;
        //if (GlobalVariables.isDebug) // For Debug
        //    alert(pathOrUrl);
        return pathOrUrl;
    }
    //* [2016-05-04 17:18] Update Categories when Container is selected
    public onConChange = function onContainerChange() {
        MyFileHelper.FeedTextFromTxtFileToACallBack(ChooseAContainerPageController.Current.GetPath(),
            ChooseAContainerPageController.Current.categories,
            ChooseAContainerPageController.Current.UpdateCategories);
    };
    public UpdateCategories(jsonTxt: string, categories) {
        if (GlobalVariables.isLog) {
            console.log("ChooseAContainerPage:UpdateCategories: " + jsonTxt);
        }
        var obj = JSON.parse(jsonTxt) as MYContainerJson;
        ChooseAContainerPageController.Current.categories = [];
        categories = [];
        for (var i0: number = 0; i0 < obj.Categories.length; i0++) {
            categories.push(obj.Categories[i0]);
        }
        ChooseAContainerPageController.scope.$apply(function () {
            ChooseAContainerPageController.Current.categories = categories;
            if (categories.length > 0)
                ChooseAContainerPageController.Current.selCategory = categories[0];
        }); //For updating variables for AngularJS
    };

}

    class AContainer {
    public itsLocation: string;

    public constructor(pos: string) {
        this.itsLocation = pos;
    }
}