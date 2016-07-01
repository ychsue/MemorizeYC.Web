/// <reference path="../mytpdefinitions/chrome.d.ts" />
class SpeechSynthesisHelper {
    public static timerID: number;
    public static ith: number = 0;
    public static callbacks: Array<Function>=[];

    public static _iOS9Voices: Array<SpeechSynthesisVoice_Instance> = [
        { name: "Maged", voiceURI: "com.apple.ttsbundle.Maged-compact", lang: "ar-SA", localService: true, "default": true },
        { name: "Zuzana", voiceURI: "com.apple.ttsbundle.Zuzana-compact", lang: "cs-CZ", localService: true, "default": true },
        { name: "Sara", voiceURI: "com.apple.ttsbundle.Sara-compact", lang: "da-DK", localService: true, "default": true },
        { name: "Anna", voiceURI: "com.apple.ttsbundle.Anna-compact", lang: "de-DE", localService: true, "default": true },
        { name: "Melina", voiceURI: "com.apple.ttsbundle.Melina-compact", lang: "el-GR", localService: true, "default": true },
        { name: "Karen", voiceURI: "com.apple.ttsbundle.Karen-compact", lang: "en-AU", localService: true, "default": true },
        { name: "Daniel", voiceURI: "com.apple.ttsbundle.Daniel-compact", lang: "en-GB", localService: true, "default": true },
        { name: "Moira", voiceURI: "com.apple.ttsbundle.Moira-compact", lang: "en-IE", localService: true, "default": true },
        { name: "Samantha (Enhanced)", voiceURI: "com.apple.ttsbundle.Samantha-premium", lang: "en-US", localService: true, "default": true },
        { name: "Samantha", voiceURI: "com.apple.ttsbundle.Samantha-compact", lang: "en-US", localService: true, "default": true },
        { name: "Tessa", voiceURI: "com.apple.ttsbundle.Tessa-compact", lang: "en-ZA", localService: true, "default": true },
        { name: "Monica", voiceURI: "com.apple.ttsbundle.Monica-compact", lang: "es-ES", localService: true, "default": true },
        { name: "Paulina", voiceURI: "com.apple.ttsbundle.Paulina-compact", lang: "es-MX", localService: true, "default": true },
        { name: "Satu", voiceURI: "com.apple.ttsbundle.Satu-compact", lang: "fi-FI", localService: true, "default": true },
        { name: "Amelie", voiceURI: "com.apple.ttsbundle.Amelie-compact", lang: "fr-CA", localService: true, "default": true },
        { name: "Thomas", voiceURI: "com.apple.ttsbundle.Thomas-compact", lang: "fr-FR", localService: true, "default": true },
        { name: "Carmit", voiceURI: "com.apple.ttsbundle.Carmit-compact", lang: "he-IL", localService: true, "default": true },
        { name: "Lekha", voiceURI: "com.apple.ttsbundle.Lekha-compact", lang: "hi-IN", localService: true, "default": true },
        { name: "Mariska", voiceURI: "com.apple.ttsbundle.Mariska-compact", lang: "hu-HU", localService: true, "default": true },
        { name: "Damayanti", voiceURI: "com.apple.ttsbundle.Damayanti-compact", lang: "id-ID", localService: true, "default": true },
        { name: "Alice", voiceURI: "com.apple.ttsbundle.Alice-compact", lang: "it-IT", localService: true, "default": true },
        { name: "Kyoko", voiceURI: "com.apple.ttsbundle.Kyoko-compact", lang: "ja-JP", localService: true, "default": true },
        { name: "Yuna", voiceURI: "com.apple.ttsbundle.Yuna-compact", lang: "ko-KR", localService: true, "default": true },
        { name: "Ellen", voiceURI: "com.apple.ttsbundle.Ellen-compact", lang: "nl-BE", localService: true, "default": true },
        { name: "Xander", voiceURI: "com.apple.ttsbundle.Xander-compact", lang: "nl-NL", localService: true, "default": true },
        { name: "Nora", voiceURI: "com.apple.ttsbundle.Nora-compact", lang: "no-NO", localService: true, "default": true },
        { name: "Zosia", voiceURI: "com.apple.ttsbundle.Zosia-compact", lang: "pl-PL", localService: true, "default": true },
        { name: "Luciana", voiceURI: "com.apple.ttsbundle.Luciana-compact", lang: "pt-BR", localService: true, "default": true },
        { name: "Joana", voiceURI: "com.apple.ttsbundle.Joana-compact", lang: "pt-PT", localService: true, "default": true },
        { name: "Ioana", voiceURI: "com.apple.ttsbundle.Ioana-compact", lang: "ro-RO", localService: true, "default": true },
        { name: "Milena", voiceURI: "com.apple.ttsbundle.Milena-compact", lang: "ru-RU", localService: true, "default": true },
        { name: "Laura", voiceURI: "com.apple.ttsbundle.Laura-compact", lang: "sk-SK", localService: true, "default": true },
        { name: "Alva", voiceURI: "com.apple.ttsbundle.Alva-compact", lang: "sv-SE", localService: true, "default": true },
        { name: "Kanya", voiceURI: "com.apple.ttsbundle.Kanya-compact", lang: "th-TH", localService: true, "default": true },
        { name: "Yelda", voiceURI: "com.apple.ttsbundle.Yelda-compact", lang: "tr-TR", localService: true, "default": true },
        { name: "Ting-Ting", voiceURI: "com.apple.ttsbundle.Ting-Ting-compact", lang: "zh-CN", localService: true, "default": true },
        { name: "Sin-Ji", voiceURI: "com.apple.ttsbundle.Sin-Ji-compact", lang: "zh-HK", localService: true, "default": true },
        { name: "Mei-Jia", voiceURI: "com.apple.ttsbundle.Mei-Jia-compact", lang: "zh-TW", localService: true, "default": true }
    ];

    public static getAllVoices(callback: Function) {
        if (!GlobalVariables.synthesis) return;

        SpeechSynthesisHelper.callbacks.push(callback);
        if (GlobalVariables.allVoices && GlobalVariables.allVoices.length > 0) {
            setTimeout(() => {
                while (SpeechSynthesisHelper.callbacks.length > 0) {
                    SpeechSynthesisHelper.callbacks.shift()();
                }
            }, 1);
            return;
        }

        SpeechSynthesisHelper.ith = 0;
        if(!GlobalVariables.allVoices ||GlobalVariables.allVoices.length===0)
            GlobalVariables.allVoices = GlobalVariables.synthesis.getVoices();

        if (!SpeechSynthesisHelper.timerID) {
            SpeechSynthesisHelper.timerID = setInterval(() => {
                SpeechSynthesisHelper.ith++;
                if ((GlobalVariables.allVoices && GlobalVariables.allVoices.length>0) || SpeechSynthesisHelper.ith > 20) {
                    clearInterval(SpeechSynthesisHelper.timerID);
                    if (SpeechSynthesisHelper.ith > 20 && GlobalVariables.isIOS) {
                        GlobalVariables.allVoices = SpeechSynthesisHelper._iOS9Voices;
                    }
                    if (GlobalVariables.allVoices) {
                        GlobalVariables.synUtterance = new SpeechSynthesisUtterance("Welcome!");
                        while (SpeechSynthesisHelper.callbacks.length > 0) {
                            SpeechSynthesisHelper.callbacks.shift()();
                        }
                    }
                    SpeechSynthesisHelper.timerID = null;
                    SpeechSynthesisHelper.ith = 0;
                } else {
                    GlobalVariables.allVoices = GlobalVariables.synthesis.getVoices();
                }
            }, 250);
        };
    }

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