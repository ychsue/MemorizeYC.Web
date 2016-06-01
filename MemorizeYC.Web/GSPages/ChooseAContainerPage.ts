/// <reference path="../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../helpers/myfilehelper.ts" />

function ChooseAContainerPageController($scope) {
    var self = this;
    self.containers = [new AContainer(GlobalVariables.rootDir+"Samples/MYContainer"),
        new AContainer(GlobalVariables.rootDir+"Samples/健康操")];
    self.selContainer=self.containers[0];
    self.categories;
    self.selCategory;
    //* [2016-05-04 17:18] Update Categories when Container is selected
    self.onConChange = function onContainerChange() {
        MyFileHelper.FeedTextFromTxtFileToACallBack(self.selContainer.itsLocation+"/"+GlobalVariables.containerListFileName, self.categories, self.UpdateCategories);
    };
    self.UpdateCategories = function (jsonTxt: string, categories) {
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