﻿/// <reference path="../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../helpers/myfilehelper.ts" />

function ChooseAContainerPageController($scope) {
    if (GlobalVariables.isDebug) {
        console.log("ChooseAContainerPageController in");
        console.log(location.origin);
    }
    var self = this;
    self.containers = [new AContainer(GlobalVariables.rootDir+"Samples/MYContainer"),
        new AContainer(GlobalVariables.rootDir+"Samples/健康操")];
    self.selContainer=self.containers[0];
    self.categories;
    self.selCategory;
    //* [2016-06-02 20:21] Get the path with protocol,hostname and port
    self.GetPath = function (): string {
        var pathOrUrl: string = self.selContainer.itsLocation + "/" + GlobalVariables.containerListFileName;
        if (GlobalVariables.isHostNameShown)
            pathOrUrl = location.origin + pathOrUrl;
        //if (GlobalVariables.isDebug) // For Debug
        //    alert(pathOrUrl);
        return pathOrUrl;
    }
    //* [2016-05-04 17:18] Update Categories when Container is selected
    self.onConChange = function onContainerChange() {
        MyFileHelper.FeedTextFromTxtFileToACallBack(self.GetPath(), self.categories, self.UpdateCategories);
    };
    self.UpdateCategories = function (jsonTxt: string, categories) {
        if (GlobalVariables.isDebug) {
            alert(jsonTxt);
        }
        var obj = JSON.parse(jsonTxt);
        self.categories = [];
        categories = [];
        for (var i0: number = 0; i0 < obj.Categories.length; i0++) {
            categories.push(obj.Categories[i0]);
        }
        $scope.$apply(function () {
            self.categories = categories;
            if (categories.length > 0)
                self.selCategory = categories[0];
        }); //For updating variables for AngularJS
    };
    //* [2016-05-04 17:23] Force it to update its Container
    self.onConChange();

}

    class AContainer {
    public itsLocation: string;

    public constructor(pos: string) {
        this.itsLocation = pos;
    }
}