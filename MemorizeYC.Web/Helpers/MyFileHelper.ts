class MyFileHelper {
    public static ShowTextFromTxtFile = function(pathOrUrl:string, tbResult:HTMLTextAreaElement){
        var request = new XMLHttpRequest();
        request.open("GET", pathOrUrl, true);
        request.onloadend = function (ev) {
                tbResult.innerText = request.responseText;
        };
        request.send();
    }

    public static FeedTextFromTxtFileToACallBack = function (pathOrUrl:string, thisCard, callback)
    {
        var request = new XMLHttpRequest();
        request.open("GET", pathOrUrl, true);
        request.onloadend = function (ev) {
            callback(request.responseText, thisCard);
        }
        request.send();
    }
}