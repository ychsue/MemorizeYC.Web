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
                GlobalVariables.alert("Speech Recognition Error: " + ev.error);
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

    public static StartSpeechRecognition(refMetaData:SpeechRecgMetadata, Ans_Recog:Array<string>, Ans_KeyIn:Array<string>, lang:string, scope:ng.IScope) {
        if (refMetaData.isSpeechRecognitionRunning) {
            GlobalVariables.speechRecognizer.stop();
            refMetaData.isSpeechRecognitionRunning = false;
            return;
        } else {
            refMetaData.isSpeechRecognitionRunning = true;
            if (GlobalVariables.isHavingSpeechRecognier) {
                var SR = GlobalVariables.speechRecognizer;
                var grammar: string = "#JSGF V1.0; grammar sentences;";
                if (Ans_Recog && Ans_Recog.length > 0) {
                    grammar += " public <x> ="+Ans_Recog[0];
                    for (var i0: number = 1; i0 < Ans_Recog.length; i0++) {
                        grammar += "|" + Ans_Recog[i0];
                    }
                }
                grammar += ";";

                var sRList = new GlobalVariables.SpeechGrammarList() as SpeechGrammarList;
                sRList.addFromString(grammar, 1);
                SR.grammars = sRList;
                SR.lang = lang;
                SR.continuous = false;
                SR.interimResults = true;
                SR.maxAlternatives = 1;
                var hasGot = false;
                SR.onresult = (ev1: SpeechRecognitionEvent) => {
                    scope.$apply(() => {
                        if (ev1.results[0][0].confidence > 0.9)
                            hasGot = true;
                        refMetaData.recInputSentence = ev1.results[0][0].transcript;
                        refMetaData.confidence = ev1.results[0][0].confidence;
                    });
                    if (ev1.results[0].isFinal) {
                        scope.$apply(() => {
                            refMetaData.recInputSentence = ev1.results[0][0].transcript;
                            if (hasGot && Ans_KeyIn && Ans_KeyIn.length > 0)
                                refMetaData.recInputSentence = Ans_KeyIn[0];
                            refMetaData.isSpeechRecognitionRunning = false;
                        });
                    }
                };
                var onEnd = (ev) => {
                    scope.$apply(() => {
                        refMetaData.isSpeechRecognitionRunning = false;
                    });
                };
                $(SR).one("end", onEnd);

                SR.start();
            }
        }
    }
}

interface SpeechRecgMetadata {
    isSpeechRecognitionRunning: boolean;
    recInputSentence: string;
    confidence: number;
}