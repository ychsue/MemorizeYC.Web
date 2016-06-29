﻿/// <reference path="../mytpdefinitions/chrome.d.ts" />
class SpeechSynthesisHelper {
    public static timerID: number;
    public static ith: number = 0;
    public static getAllVoices() {
        if (!GlobalVariables.synthesis || GlobalVariables.allVoices ) return;

        GlobalVariables.allVoices = GlobalVariables.synthesis.getVoices();
        SpeechSynthesisHelper.timerID = setInterval(() => {
            SpeechSynthesisHelper.ith++;
            if (GlobalVariables.allVoices ||SpeechSynthesisHelper.ith>10) {
                clearInterval(SpeechSynthesisHelper.timerID);
                SpeechSynthesisHelper.timerID = null;
                SpeechSynthesisHelper.ith = 0;
                GlobalVariables.synUtterance = new SpeechSynthesisUtterance("Welcome!");
            } else {
                GlobalVariables.allVoices = GlobalVariables.synthesis.getVoices();
            }
        }, 250);
    };

    public static getSynVoiceFromLang(lang: string): SpeechSynthesisVoice_Instance {
        if (!GlobalVariables.allVoices) return null;
        var vVoice: SpeechSynthesisVoice_Instance = null;
        for (var i0: number = 0; i0 < GlobalVariables.allVoices.length; i0++){
            var voice = GlobalVariables.allVoices[i0];
            if (voice.lang.toLowerCase() === lang.toLowerCase()) {
                vVoice = voice;
                break;
            }
        };
        return vVoice;
    }
}