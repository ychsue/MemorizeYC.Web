class MyFileHelper {
    public static ShowTextFromTxtFile = function(pathOrUrl:string, tbResult:HTMLTextAreaElement){
        var request = new XMLHttpRequest();
        request.open("GET", pathOrUrl, true);
        request.onloadend = function (ev) {
                tbResult.innerText = request.responseText;
        };
        request.send();
    }

    /**
     * The texts of 'pathOrUrl' file will be fed for the 'callback' by callback(responseText,thisCard);
     * @param pathOrUrl:string: pointed to the Text File
     * @param thisCard: any
     * @param callback: Function:   callback(request.responseText, thisCard)
     */
    public static FeedTextFromTxtFileToACallBack (pathOrUrl:string, thisCard, callback)
    {
        var request = new XMLHttpRequest();
        request.open("GET", pathOrUrl, true);
        request.onloadend = function (ev) {
            if (GlobalVariables.isLog) {
                console.log("FeedTextFromTxtFileToACallBack: "+request);
            }

            if((<XMLHttpRequest>(ev.target)).status!=404)
                callback(request.responseText, thisCard);
        }
        request.send();
    }
}