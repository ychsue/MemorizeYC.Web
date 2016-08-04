class SpeechRecognizerHelper {
    /**
     * Initialize GlobalVariables.nameOfSpeechRecognizer; therefore, if the nameOfSpeechRecognizer is provided, it must have speech recognizer
     */
    public static iniSpeechRecognition() {
        var winSR;
        //* [2016-08-02 12:47] Update the name of Speech Recognition
        if (GlobalVariables.isHavingSpeechRecognier === undefined) {
            winSR = window["SpeechRecognition"] || window["msSpeechRecognition"] || window["webkitSpeechRecognition"] || window["mozSpeechRecognition"];
            GlobalVariables.isHavingSpeechRecognier = (winSR) ? true : false;
        }
        //* [2016-08-02 12:48] If it is existed in window, get it
        if (GlobalVariables.isHavingSpeechRecognier && winSR!==undefined) {
            GlobalVariables.speechRecognizer = new winSR() as SpeechRecognition;
            GlobalVariables.speechRecognizer.onerror = (ev: SpeechRecognitionError) => {
                alert("Speech Recognition Error: " + ev.error);
            }
            var SG = window["SpeechGrammarList"] || window["msSpeechGrammarList"] || window["webkitSpeechGrammarList"] || window["mosSpeechGrammarList"];
            if(SG)
                GlobalVariables.SpeechGrammarList = SG;
        }
    }

    public static SentenceToGrammarString(oldString: string): string {
        var newString: string = oldString.toLowerCase().replace(/[,\.\/;\'\":<>\`~!@#$%\^\&\*\(\)\-\_\+\=\[\]\{\}\\\|]/g, "");
        return newString;
    }
}