/// <reference path="../mytpdefinitions/chrome.d.ts" />
/// <reference path="../helpers/speechsynthesishelper.ts" />
class SpeechTestPageController {
    //#region thisPageTexts
    get thisPageTexts(): SpeechTestPageJSON {
        if (!GlobalVariables.PageTexts)
            GlobalVariables.PageTexts = PageTextHelper.defaultPageTexts;
        return GlobalVariables.PageTexts.SpeechTestPageJSON;
    }
    set thisPageTexts(value: SpeechTestPageJSON) {
        //Do nothing. It is just for notifying this controller that it is changed.
    }
    //#endregion thisPageTexts
    //#region for SpeechRecognition
    get isHavingSpeechRecognier(): boolean {
        return GlobalVariables.isHavingSpeechRecognier;
    }
    //#endregion for SpeechRecognition
    public rate2PowN: number=0;
    public allSynVoices: Array<SpeechSynthesisVoice_Instance>;
    public currentSynVoice: SpeechSynthesisVoice_Instance;
    public sentence: string = "This is a test.";
    public RecogMetaData: SpeechRecgMetadata = {confidence:0,isSpeechRecognitionRunning:false,recInputSentence:""};
    public isUseSentenceForRecog:boolean = false;

    public static Current:SpeechTestPageController;
    public static scope:angular.IScope;

    constructor($scope:ng.IScope, $routeParams) {
        SpeechTestPageController.Current = this;
        SpeechTestPageController.scope = $scope;
        $scope["Math"] = window["Math"]; //Gotten idea from http://stackoverflow.com/questions/12740329/math-functions-in-angular-bindings
        //* [2016-08-17 11:27] Get all voices and set en-US as default.
        if(GlobalVariables.synthesis)
            SpeechSynthesisHelper.getAllVoices(() => {
                SpeechTestPageController.scope.$apply(() => {
                    SpeechTestPageController.Current.allSynVoices = GlobalVariables.allVoices;
                    var voice: SpeechSynthesisVoice_Instance;
                    if (GlobalVariables.allVoices && GlobalVariables.allVoices.length > 0)
                        voice = SpeechSynthesisHelper.getSynVoiceFromLang('en-US');
                    if (voice)
                        SpeechTestPageController.Current.currentSynVoice = voice;
                });
        });
        //* [2016-07-11 15:02] Because its language might not ready, I use a trigger to tell me that it is done
        var renewPageTexts = () => {
            SpeechTestPageController.scope.$apply(() => {
                SpeechTestPageController.Current.thisPageTexts = null;
            });
            $(document).off(GlobalVariables.PageTextChangeKey, renewPageTexts);
        };
        $(document).off(GlobalVariables.PageTextChangeKey, renewPageTexts);
        $(document).on(GlobalVariables.PageTextChangeKey, renewPageTexts);

        //* [2016-08-17 14:20] Initialize SpeechRecognizer
        SpeechRecognizerHelper.iniSpeechRecognition();

    }

    //#region EVENT
    public onSynPlay_Click() {
        if (GlobalVariables.synthesis && GlobalVariables.synUtterance) {
            if (!SpeechTestPageController.Current.sentence || SpeechTestPageController.Current.sentence.length === 0) {
                GlobalVariables.alert('Input something at first.');
                return;
            }
            
            if (GlobalVariables.synthesis.paused)
                GlobalVariables.synthesis.resume();
            SpeechSynthesisHelper.Speak(
                SpeechTestPageController.Current.sentence,
                SpeechTestPageController.Current.currentSynVoice.lang,
                SpeechTestPageController.Current.currentSynVoice,
                Math.pow(2, SpeechTestPageController.Current.rate2PowN)
            );
        }
    }

    public onRecog_Click() {
        var arrayForRecog = (SpeechTestPageController.Current.isUseSentenceForRecog)?[SpeechTestPageController.Current.sentence]:[];
        SpeechRecognizerHelper.StartSpeechRecognition(
            SpeechTestPageController.Current.RecogMetaData,
            arrayForRecog,
            arrayForRecog,
            SpeechTestPageController.Current.currentSynVoice.lang,
            SpeechTestPageController.scope
        );

    }
    //#endregion EVENT
}