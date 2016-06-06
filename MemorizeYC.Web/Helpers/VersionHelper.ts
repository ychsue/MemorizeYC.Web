/// <reference path="../models/Version.ts" />

class VersionHelper {
    public static ReloadIfNeeded(){
        //Get JSON string from version.json and compare it with GlobalVariables.version
        MyFileHelper.FeedTextFromTxtFileToACallBack(GlobalVariables.versionFile+"?nocache="+Date.now(),
            null,
            function (stJSON: string, buf: Object) {
                //* [2016-06-06 11:42] Get the version from version.json
                try {
                    var jObj = JSON.parse(stJSON) as myVersion;
                }
                catch (exc) {
                    console.log("VersionHelper:JSON.parse error:" + exc.message);
                    return;
                }

                if (GlobalVariables.isLog)
                    console.log("old one:" + GlobalVariables.version + "  ,new one:" + jObj.version);
                //* [2016-06-06 11:48] Compare
                if (jObj.version && jObj.version != GlobalVariables.version) {
                    location.reload(true);
                }
            }
        );
        return ;
    };
}