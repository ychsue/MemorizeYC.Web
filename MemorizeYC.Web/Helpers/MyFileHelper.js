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
            callback(request.responseText, thisCard);
        };
        request.send();
    };
    return MyFileHelper;
}());
//# sourceMappingURL=MyFileHelper.js.map