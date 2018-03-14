var SpeechRecognizerHelper = (function () {
    function SpeechRecognizerHelper() {
    }
    SpeechRecognizerHelper.iniSpeechRecognition = function () {
        var winSR;
        if (GlobalVariables.isHavingSpeechRecognier === undefined) {
            winSR = window["SpeechRecognition"] || window["msSpeechRecognition"] || window["webkitSpeechRecognition"] || window["mozSpeechRecognition"];
            GlobalVariables.isHavingSpeechRecognier = (winSR) ? true : false;
        }
        if (GlobalVariables.isHavingSpeechRecognier && winSR !== undefined) {
            GlobalVariables.speechRecognizer = new winSR();
            GlobalVariables.speechRecognizer.onerror = function (ev) {
                GlobalVariables.alert("Speech Recognition Error: " + ev.error);
            };
            var SG = window["SpeechGrammarList"] || window["msSpeechGrammarList"] || window["webkitSpeechGrammarList"] || window["mosSpeechGrammarList"];
            if (SG)
                GlobalVariables.SpeechGrammarList = SG;
        }
    };
    SpeechRecognizerHelper.SentenceToGrammarString = function (oldString) {
        var newString = oldString.toLowerCase().replace(/[,\.\/;\'\":<>\`~!@#$%\^\&\*\(\)\-\_\+\=\[\]\{\}\\\|]/g, "");
        return newString;
    };
    SpeechRecognizerHelper.StartSpeechRecognition = function (refMetaData, Ans_Recog, Ans_KeyIn, lang, scope) {
        if (refMetaData.isSpeechRecognitionRunning) {
            GlobalVariables.speechRecognizer.stop();
            refMetaData.isSpeechRecognitionRunning = false;
            return;
        }
        else {
            refMetaData.isSpeechRecognitionRunning = true;
            if (GlobalVariables.isHavingSpeechRecognier) {
                var SR = GlobalVariables.speechRecognizer;
                var grammar = "#JSGF V1.0; grammar sentences;";
                if (Ans_Recog && Ans_Recog.length > 0) {
                    grammar += " public <x> =" + Ans_Recog[0];
                    for (var i0 = 1; i0 < Ans_Recog.length; i0++) {
                        grammar += "|" + Ans_Recog[i0];
                    }
                }
                grammar += ";";
                var sRList = new GlobalVariables.SpeechGrammarList();
                sRList.addFromString(grammar, 1);
                SR.grammars = sRList;
                SR.lang = lang;
                SR.continuous = false;
                SR.interimResults = true;
                SR.maxAlternatives = 1;
                var hasGot = false;
                SR.onresult = function (ev1) {
                    scope.$apply(function () {
                        if (ev1.results[0][0].confidence > 0.9)
                            hasGot = true;
                        refMetaData.recInputSentence = ev1.results[0][0].transcript;
                        refMetaData.confidence = ev1.results[0][0].confidence;
                    });
                    if (ev1.results[0].isFinal) {
                        scope.$apply(function () {
                            refMetaData.recInputSentence = ev1.results[0][0].transcript;
                            if (hasGot && Ans_KeyIn && Ans_KeyIn.length > 0)
                                refMetaData.recInputSentence = Ans_KeyIn[0];
                            refMetaData.isSpeechRecognitionRunning = false;
                        });
                    }
                };
                var onEnd = function (ev) {
                    scope.$apply(function () {
                        refMetaData.isSpeechRecognitionRunning = false;
                    });
                };
                $(SR).one("end", onEnd);
                SR.start();
            }
        }
    };
    return SpeechRecognizerHelper;
}());
var SpeechSynthesisHelper = (function () {
    function SpeechSynthesisHelper() {
    }
    SpeechSynthesisHelper.getAllVoices = function (callback) {
        if (!GlobalVariables.synthesis)
            return;
        SpeechSynthesisHelper.callbacks.push(callback);
        if (GlobalVariables.allVoices && GlobalVariables.allVoices.length > 0) {
            setTimeout(function () {
                while (SpeechSynthesisHelper.callbacks.length > 0) {
                    SpeechSynthesisHelper.callbacks.shift()();
                }
            }, 1);
            return;
        }
        SpeechSynthesisHelper.ith = 0;
        if (!GlobalVariables.allVoices || GlobalVariables.allVoices.length === 0)
            GlobalVariables.allVoices = GlobalVariables.synthesis.getVoices();
        if (!SpeechSynthesisHelper.timerID) {
            SpeechSynthesisHelper.timerID = setInterval(function () {
                SpeechSynthesisHelper.ith++;
                if ((GlobalVariables.allVoices && GlobalVariables.allVoices.length > 0) || SpeechSynthesisHelper.ith > 20) {
                    clearInterval(SpeechSynthesisHelper.timerID);
                    if (GlobalVariables.allVoices) {
                        GlobalVariables.synUtterance = new SpeechSynthesisUtterance("Welcome!");
                        while (SpeechSynthesisHelper.callbacks.length > 0) {
                            SpeechSynthesisHelper.callbacks.shift()();
                        }
                    }
                    SpeechSynthesisHelper.timerID = null;
                    SpeechSynthesisHelper.ith = 0;
                }
                else {
                    GlobalVariables.allVoices = GlobalVariables.synthesis.getVoices();
                }
            }, 250);
        }
        ;
    };
    SpeechSynthesisHelper.getSynVoiceFromLang = function (lang) {
        if (!GlobalVariables.allVoices)
            return null;
        var vVoice = null;
        for (var i0 = 0; i0 < GlobalVariables.allVoices.length; i0++) {
            var voice = GlobalVariables.allVoices[i0];
            if (lang != "" && voice.lang != "" && voice.lang.toLowerCase().replace(/_/g, '-').indexOf(lang.toLowerCase().replace(/_/g, '-'))
                >= 0) {
                vVoice = voice;
                break;
            }
        }
        ;
        if (!vVoice && lang != "" && voice.lang != "" && lang.match(/[-_]/i)) {
            var hLang = lang.split(/[-_]/g)[0];
            for (var i0 = 0; i0 < GlobalVariables.allVoices.length; i0++) {
                var voice = GlobalVariables.allVoices[i0];
                if (hLang.trim().indexOf(voice.lang.trim()) === 0) {
                    vVoice = voice;
                    break;
                }
            }
            ;
        }
        return vVoice;
    };
    SpeechSynthesisHelper.Speak = function (text, lang, voice, rate) {
        if (rate === void 0) { rate = 1; }
        if (!GlobalVariables.synthesis)
            return;
        if (!GlobalVariables.synUtterance)
            GlobalVariables.synUtterance = new SpeechSynthesisUtterance("Hello! New start.");
        GlobalVariables.synUtterance.text = text;
        GlobalVariables.synUtterance.lang = lang;
        GlobalVariables.synUtterance.voice = voice;
        GlobalVariables.synUtterance.rate = rate;
        GlobalVariables.synthesis.cancel();
        GlobalVariables.synthesis.speak(GlobalVariables.synUtterance);
    };
    return SpeechSynthesisHelper;
}());
SpeechSynthesisHelper.ith = 0;
SpeechSynthesisHelper.callbacks = [];
SpeechSynthesisHelper._iOS9Voices = [
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
var PageTextHelper = (function () {
    function PageTextHelper() {
    }
    PageTextHelper.InitPageTexts = function (callback, arg) {
        if (callback === void 0) { callback = null; }
        if (arg === void 0) { arg = null; }
        MyFileHelper.FeedTextFromTxtFileToACallBack(PageTextHelper.GetLocaleSubFolder(GlobalVariables.SelPageTextLang.lang, GlobalVariables.LangsInStrings), null, function (stJson) {
            GlobalVariables.PageTexts = JSON.parse(stJson);
            if (callback)
                callback(arg);
        });
    };
    ;
    PageTextHelper.GetLocaleSubFolder = function (lang, allLangs) {
        var bLang = PageTextHelper.GetPageTextLang(lang, allLangs).lang;
        var filePath = GlobalVariables.rootDir + 'Strings/' + bLang + '/' + GlobalVariables.PageTextsJSONFName;
        return filePath;
    };
    PageTextHelper.InitLangsInStrings = function () {
        var array = [];
        array.push({ lang: 'zh-TW', name: '中文' });
        array.push({ lang: 'en-US', name: 'English' });
        return array;
    };
    PageTextHelper.GetPageTextLang = function (lang, allLangs) {
        var bufLang = (lang && lang.match(/^zh/i)) ? 'zh-TW' : lang;
        bufLang = bufLang.replace(/_/g, '-').toLowerCase();
        for (var i0 = 0; i0 < allLangs.length; i0++) {
            var eachLang = allLangs[i0];
            if (bufLang && bufLang.length > 0 && bufLang.indexOf(eachLang.lang.toLowerCase().replace(/_/g, '-')) > -1)
                return eachLang;
        }
        for (var i0 = 0; i0 < allLangs.length; i0++) {
            var eachLang = allLangs[i0];
            if (eachLang.lang === 'en-US')
                return eachLang;
        }
    };
    return PageTextHelper;
}());
PageTextHelper.defaultPageTexts = {
    "PlayOneCategoryPageJSON": {
        "stShowAsList": "條列式顯示",
        "stHintModeOption": "提示模式專屬",
        "stDictateAnswer": "念答案(顯示於下方列)",
        "stDictateContent": "念卡片內容",
        "stAnswerFirst": "先念答案(顯示於下方列)",
        "stRepairSyn": "修復語音問題",
        "stBack": "回上頁",
        "stShowScore": "<h2>你的得分為{0}，而滿分為{1}</h2>",
        "stNewUpToOne": "<h3>恭喜！你的等級升到1了。明天再玩吧！</h3>",
        "stNewBackTo0": "<h3>看來你對這個部分沒啥概念，建議你切換到<b>提示</b>模式，等有點概念後再玩配對。</h3>",
        "stIncLVNotYet": "<h3>太棒了！請 {0} 天後再玩。</h3>",
        "stIncLV": "<h3>恭喜！升級了！請 {0} 天後再玩。</h3>",
        "stKeepLV": "<h3>雖然你有進步，可惜還不夠升級，請 {0} 天後再玩一次。</h3>",
        "stBackTo0": "<h3>很抱歉，你的等級要退回等級0然後明天再玩一次。</h3>",
        "stNoteForKeyIn": "<h4>注意：在<b>鍵入正解</b>模式下，你可以得更高分。</h4>",
        "stHandWriting": "<h4>要否用手寫輸入讓手指也參與記憶？</h4>",
        "stClickPlayAtFirst": "請先按左下角的'播放'({0})再來配對相應的圖卡。",
        "stAns": "看答案(-15)",
        "stLink": "超連結",
        "stShowAns": "允許的答案有：\n{0}",
        "stMarkForSpeech": "反白想要聽的字，再按Play就可以播放了：",
        "stHideTbSyn": "將語音模擬的文字列隱藏。",
        "stHighestScore": "最高分！",
        "stWaitUtterDone": "稍安勿躁，請等我唸完再點選。",
        "stSynVoice": "語音模擬的聲音：",
        "stContributor": "貢獻者",
        "stRest": "尚隱藏的卡數：",
        "stNumWCardShown": "張卡會被顯示",
        "stckTakeCardRandomly": "隨機取卡",
        "stCkResizeBg": "連同背景一起縮放",
        "stResize": "縮放：",
        "stPlayType": "使用類型",
        "stHint": "提示",
        "stPair": "配對",
        "stKeyIn": "鍵入正解",
        "stArrange": "排列卡片",
        "stAudioRate": "音效撥放速率",
        "stTutor": "互動教學",
        "stBasic": "基礎",
        "stStop": "停止",
        "stHyperLink": "超連結",
        "stMyLink": "本類別的連結",
        "stTut0_1_1": "你現在在教學模式下。",
        "stTut0_1_2": "先按{0}然後選<b>基礎</b>開始本教學。",
        "stTut0_1_3": "或按{0}來停止此互動教學。",
        "stTut0To1": "好了！讓我們開始吧！",
        "stTut1_1": "1.1基礎 - 放大所有卡片",
        "stTut1_1_1": "按{1}裏頭的{0}來放大所有卡片。",
        "stTut1_1To2": "太棒了！\n你做到了！",
        "stTut1_2": "1.2 基礎 - 縮小所有卡片",
        "stTut1_2_1": "按{1}裏頭的{0}來縮小所有卡片。",
        "stTut1_2To3": "做得好！",
        "stTut1_3": "1.3 基礎 - 配對",
        "stTut1_3_0": "請先按 {0}<sub>播放</sub> 或 {1}<sub>撥下個</sub>。",
        "stTut1_3_1": "1.3.1 配對 - 點相應的卡",
        "stTut1_3_1_1": "因為要點相應的卡好消掉該卡，請點 {0}<sub>Hide</sub> 來隱藏此教學。",
        "stTut1_3To4": "做得好！",
        "stTut1_4_Title": "1.4 基礎 - 換語音模擬的語音",
        "stTut1_4_Content": "按一下{1}鈕，然後選{0}鈕旁邊的下拉式選單選擇語音。",
        "stTut1_4_1_Title": "1.4.1 基礎 - 語音已經換了。",
        "stTut1_4_1_Content": "按{0}將用你新選的語音來撥放句子。",
        "stTut1_4To5": "現在你已經知道怎麼換語音了。",
        "stTut1_5_Title": "1.5 基礎 - 換卡",
        "stTut1_5_Content": "因為怕卡片一次顯示太多會不好找，所以限定一次只顯示'{0}'張卡，若要立刻顯示未顯示的，請按{2}中的{1}來換卡。此外，顯示卡數'{0}'是可以自己修改的喔！",
        "stTut1_5To6": "現在，你知道怎麼換卡了！",
        "stTut1_6_Title": "1.6 基礎 - 顯示額外訊息",
        "stTut1_6_Content": "首先，請先點{0}<sub>Hide</sub>鈕隱藏本教學。<br/> 然後對任何卡雙擊({1})就會跳出一個畫面顯示額外的訊息了。<br/>",
        "stTut1_6To7": "照理說，它會跳出一個Popup顯示額外訊息，如果沒有，那就是該卡片沒有額外訊息。",
        "stTut2_0_Title": "2.1 提示： 取得卡片的訊息",
        "stTut2_0_Content": "按{1}裡的{0}<sub>提示</sub>鈕來進入提示模式。",
        "stTut2_1_Title": "2.1 提示： 顯示單張卡的訊息",
        "stTut2_1_Content": "先按{0}後，然後請按任意一張卡片。它會顯示它的相應句子。",
        "stTut2_1To2": "等一下就會在下方的文字列看到相對應的句子。",
        "stTut2_2_Title": "2.2 提示：依序顯示卡片們相應訊息",
        "stTut2_2_Content": "首先，按{0}會依序由<b>2.1</b>所選的卡片開始撥放卡片訊息。<br/> 按{1}則會暫停依序播放。",
        "stTut2_2To3": "現在，你已經知道怎麼依序顯示卡片們相應的句子了。",
        "stTut3_0_Title": "3. 鍵入正解： 利用鍵入正解消除卡片",
        "stTut3_0_Content": "按{1}裡的{0}<sub>鍵入正解</sub>鈕來進入鍵入正解模式。",
        "stTut3_1_Title": "3.1 鍵入正解： 點選一張卡",
        "stTut3_1_Content": "先按{0}鈕，然後在選任一張卡片吧！",
        "stTut3_1_2_Title": "3.1.2 鍵入正解：將正確答案鍵入",
        "stTut3_1_2_Content": " 請將 <b>{0}</b> 鍵入下面的文字方塊裡，然後按Enter鍵送出答案。",
        "stTut3_1To2": "做得好！",
        "stTut_End_Title": "太棒了！全部完成！",
        "stTut_End_Content": "按{0}來停止本教學。謝謝。",
        "stContentSynVoice": "卡片內容語音模擬的聲音："
    },
    "ChooseAContainerPageJSON": {
        "stPlay": "玩",
        "stSelContainer": "1. 選個容器吧：",
        "stSelCategory": "2. 再選容器中的一個類別吧：",
        "stSelLang": "3. 設定用來顯示頁面的語言：",
        "stSpeechTest": "語音測試",
        "stUserGuide": "使用說明"
    },
    "SpeechTestPageJSON": {
        "stRecg": "語音辨識",
        "stSyn": "語音模擬",
        "stLang": "選語言：",
        "stRate": "調速率：",
        "stIsUseSentence": "用您輸入的句子當答案："
    }
};
var PlayTypeEnum = (function () {
    function PlayTypeEnum() {
    }
    return PlayTypeEnum;
}());
PlayTypeEnum.syn = "syn";
PlayTypeEnum.rec = "rec";
PlayTypeEnum.hint = "hint";
;
var TutorMainEnum;
(function (TutorMainEnum) {
    TutorMainEnum[TutorMainEnum["Begin"] = 0] = "Begin";
    TutorMainEnum[TutorMainEnum["Basic"] = 1] = "Basic";
    TutorMainEnum[TutorMainEnum["Hint"] = 2] = "Hint";
    TutorMainEnum[TutorMainEnum["KeyIn"] = 3] = "KeyIn";
    TutorMainEnum[TutorMainEnum["End"] = 4] = "End";
})(TutorMainEnum || (TutorMainEnum = {}));
;
var AudioSequenceStateEnum;
(function (AudioSequenceStateEnum) {
    AudioSequenceStateEnum[AudioSequenceStateEnum["End"] = 0] = "End";
    AudioSequenceStateEnum[AudioSequenceStateEnum["Pause"] = 1] = "Pause";
    AudioSequenceStateEnum[AudioSequenceStateEnum["Playing"] = 2] = "Playing";
})(AudioSequenceStateEnum || (AudioSequenceStateEnum = {}));
;
var TutorialHelper = (function () {
    function TutorialHelper() {
    }
    TutorialHelper.onBtHide = function (ev) {
        $(GlobalVariables.gdTutorElements.gdMain).hide('slow');
    };
    TutorialHelper.onBtStop = function (ev) {
        $(GlobalVariables.gdTutorElements.gdMain).hide('slow');
        PlayOneCategoryPageController.Current.TutorType = TutorMainEnum[TutorMainEnum.End];
    };
    TutorialHelper.Action = function (state) {
        $(GlobalVariables.gdTutorElements.btHide).off('click', TutorialHelper.onBtHide);
        $(GlobalVariables.gdTutorElements.btHide).on('click', TutorialHelper.onBtHide);
        $(GlobalVariables.gdTutorElements.btStop).off('click', TutorialHelper.onBtStop);
        $(GlobalVariables.gdTutorElements.btStop).on('click', TutorialHelper.onBtStop);
        if (!GlobalVariables.PageTexts)
            GlobalVariables.PageTexts = PageTextHelper.defaultPageTexts;
        var thisPageTexts = GlobalVariables.PageTexts.PlayOneCategoryPageJSON;
        switch (state.Main) {
            case TutorMainEnum.Begin:
                $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                $(GlobalVariables.gdTutorElements.gdContent).html("<div style='text-align:center; font-size:6vw;'>" +
                    thisPageTexts.stTutor +
                    "</div>" +
                    "<div style='text-align:center; font-size:3vh;'>" +
                    thisPageTexts.stTut0_1_1 +
                    "<br/>" +
                    thisPageTexts.stTut0_1_2.replace(/\{0\}/g, function (st) {
                        return "<span class='glyphicon glyphicon-cog' > </span>";
                    }) + "<br/>" +
                    thisPageTexts.stTut0_1_3.replace(/\{0\}/g, function (st) {
                        return "<span class='glyphicon glyphicon-remove-sign'></span><sub>Stop</sub>";
                    }) +
                    "</div>");
                $(".glyphicon-cog").addClass('blink');
                $(".glyphicon-remove-sign").addClass('blink');
                $(PlayOneCategoryPageController.Current.rdTutorType).addClass('blink');
                var onStateChange = function (ev) {
                    $(PlayOneCategoryPageController.Current.rdTutorType).off(GlobalVariables.TutorTypeChangeKey, onStateChange);
                    $(".glyphicon-cog").removeClass('blink');
                    $(".glyphicon-remove-sign").removeClass('blink');
                    $(PlayOneCategoryPageController.Current.rdTutorType).removeClass('blink');
                    $('#dpPlaySettings').removeClass('open');
                    GlobalVariables.alert(thisPageTexts.stTut0To1);
                    $(GlobalVariables.gdTutorElements.gdMain).hide(0);
                };
                $(PlayOneCategoryPageController.Current.rdTutorType).off(GlobalVariables.TutorTypeChangeKey, onStateChange);
                $(PlayOneCategoryPageController.Current.rdTutorType).on(GlobalVariables.TutorTypeChangeKey, onStateChange);
                break;
            case TutorMainEnum.Basic:
                switch (state.Step) {
                    case 0:
                        $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                        $(GlobalVariables.gdTutorElements.gdContent).html("<div style='text-align:center; font-size:5vh;'>" +
                            thisPageTexts.stTut1_1 +
                            "</div>" +
                            "<div style='text-align:center; font-size:3vh;'>" +
                            thisPageTexts.stTut1_1_1.replace('{0}', "<span class='glyphicon glyphicon-plus' style='color:red; font-size:4vw;'></span>").replace('{1}', "<span class='glyphicon glyphicon-cog' style='color:red; font-size:4vw;'></span>") + "</div>");
                        $(".glyphicon-cog").addClass('blink');
                        $(".glyphicon-plus").addClass('blink');
                        $("#ddSettings .glyphicon-plus").one('click', function (ev) {
                            setTimeout(function () {
                                $(GlobalVariables.gdTutorElements.gdMain).hide(0);
                                $('#dpPlaySettings').removeClass('open');
                                $(".glyphicon-cog").removeClass('blink');
                                $(".glyphicon-plus").removeClass('blink');
                                GlobalVariables.alert(thisPageTexts.stTut1_1To2);
                                if (GlobalVariables.isTutorMode) {
                                    GlobalVariables.tutorState.Step++;
                                    TutorialHelper.Action(GlobalVariables.tutorState);
                                }
                            }, 500);
                        });
                        break;
                    case 1:
                        $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                        $(GlobalVariables.gdTutorElements.gdContent).html("<div style='text-align:center; font-size:5vh;'>" +
                            thisPageTexts.stTut1_2 +
                            "</div>" +
                            "<div style='text-align:center; font-size:3vh;'>" + thisPageTexts.stTut1_2_1
                            .replace('{0}', "<span class='glyphicon glyphicon-minus' style='color:red; font-size:4vw;'></span>")
                            .replace('{1}', "<span class='glyphicon glyphicon-cog' style='color:red; font-size:4vw;'></span>")
                            + "</div>");
                        $(".glyphicon-cog").addClass('blink');
                        $(".glyphicon-minus").addClass('blink');
                        $("#ddSettings .glyphicon-minus").one('click', function (ev) {
                            setTimeout(function () {
                                $(GlobalVariables.gdTutorElements.gdMain).hide(0);
                                $('#dpPlaySettings').removeClass('open');
                                $(".glyphicon-cog").removeClass('blink');
                                $(".glyphicon-minus").removeClass('blink');
                                GlobalVariables.alert(thisPageTexts.stTut1_2To3);
                                if (GlobalVariables.isTutorMode) {
                                    GlobalVariables.tutorState.Step++;
                                    TutorialHelper.Action(GlobalVariables.tutorState);
                                }
                            }, 500);
                        });
                        break;
                    case 2:
                        $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                        $(GlobalVariables.gdTutorElements.gdContent).html("<div style='text-align:center; font-size:5vh;'>" + thisPageTexts.stTut1_3
                            + "</div>" +
                            "<div style='text-align:center; font-size:3vh;'>" + thisPageTexts.stTut1_3_0.replace('{0}', "<span class='glyphicon glyphicon-play' style='color:red;'></span>")
                            .replace('{1}', "<span class='glyphicon glyphicon-step-forward' style='color:red;'></span>")
                            + "</div>");
                        $(".glyphicon-play").addClass('blink');
                        $(".glyphicon-step-forward").addClass('blink');
                        var onPlay = function (ev) {
                            $(GlobalVariables.gdTutorElements.gdMain).hide(0);
                            $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                            $(GlobalVariables.gdTutorElements.gdContent).html("<div style='text-align:center; font-size:5vh;'>" + thisPageTexts.stTut1_3_1
                                + "</div>" +
                                "<div style='text-align:center; font-size:3vh;'>" + thisPageTexts.stTut1_3_1_1.replace('{0}', "<span class='glyphicon glyphicon-resize-small'></span>")
                                + "</div>");
                            $("#gdTutorial #btHide").addClass('blink');
                            $("#btSynPlay,#btSynNext").off('click', onPlay);
                            $(".glyphicon-play").removeClass('blink');
                            $(".glyphicon-step-forward").removeClass('blink');
                            var onRemove = function (ev) {
                                $(GlobalVariables.gdTutorElements.gdMain).hide(0);
                                GlobalVariables.alert(thisPageTexts.stTut1_3To4);
                                $("#btSynPlay").off(GlobalVariables.RemoveAWCardKey, onRemove);
                                $("#gdTutorial #btHide").removeClass('blink');
                                if (GlobalVariables.isTutorMode) {
                                    GlobalVariables.tutorState.Step++;
                                    TutorialHelper.Action(GlobalVariables.tutorState);
                                }
                            };
                            $("#btSynPlay").off(GlobalVariables.RemoveAWCardKey, onRemove);
                            $("#btSynPlay").on(GlobalVariables.RemoveAWCardKey, onRemove);
                        };
                        $("#btSynPlay,#btSynNext").off('click', onPlay);
                        $("#btSynPlay,#btSynNext").on('click', onPlay);
                        break;
                    case 3:
                        if (!GlobalVariables.allVoices || GlobalVariables.allVoices.length === 0) {
                            GlobalVariables.tutorState.Step++;
                            TutorialHelper.Action(GlobalVariables.tutorState);
                            break;
                        }
                        ;
                        $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                        $(GlobalVariables.gdTutorElements.gdContent).html("<div style='text-align:center; font-size:4vh;'>" + thisPageTexts.stTut1_4_Title
                            + "</div>" +
                            "<div style='text-align:left; font-size:2vh;'>" +
                            thisPageTexts.stTut1_4_Content.replace('{0}', "<span class='glyphicon glyphicon-refresh'></span>")
                                .replace('{1}', "<img src='http://memorizeyc.azurewebsites.net/Static/PlayPage/SpeechLang.png' alt='Choose a Language' style='width:32px'/>")
                            + "</div>");
                        $("#dropdownLangSettings").addClass('blink');
                        $("#cbSynAllVoices").addClass('blink');
                        var onChange = function (ev) {
                            $(PlayOneCategoryPageController.Current.btLangSettings).off(GlobalVariables.SynVoiceChangeKey, onChange);
                            $("#dropdownLangSettings").removeClass('blink');
                            $("#cbSynAllVoices").removeClass('blink');
                            $("#dpLangMain").removeClass('open');
                            $(GlobalVariables.gdTutorElements.gdMain).hide(0);
                            $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                            $(GlobalVariables.gdTutorElements.gdContent).html("<div style='text-align:center; font-size:5vh;'>" + thisPageTexts.stTut1_4_1_Title
                                + "</div>" +
                                "<div style='text-align:center; font-size:3vh;'>" + thisPageTexts.stTut1_4_1_Content.replace('{0}', "<span class='glyphicon glyphicon-play'></span>")
                                + "</div>");
                            $('.glyphicon-play').addClass('blink');
                            var onPlay = function (ev) {
                                $('.glyphicon-play').off('click', onPlay);
                                $('.glyphicon-play').removeClass('blink');
                                $(GlobalVariables.gdTutorElements.gdMain).hide(0);
                                GlobalVariables.alert(thisPageTexts.stTut1_4To5);
                                if (GlobalVariables.isTutorMode) {
                                    GlobalVariables.tutorState.Step++;
                                    TutorialHelper.Action(GlobalVariables.tutorState);
                                }
                            };
                            $('.glyphicon-play').off('click', onPlay);
                            $('.glyphicon-play').on('click', onPlay);
                        };
                        $(PlayOneCategoryPageController.Current.btLangSettings).off(GlobalVariables.SynVoiceChangeKey, onChange);
                        $(PlayOneCategoryPageController.Current.btLangSettings).on(GlobalVariables.SynVoiceChangeKey, onChange);
                        break;
                    case 4:
                        $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                        $(GlobalVariables.gdTutorElements.gdContent).html("<div style='text-align:center; font-size:4vh;'>" + thisPageTexts.stTut1_5_Title
                            + "</div>" +
                            "<div style='text-align:left; font-size:2vh;'>" +
                            thisPageTexts.stTut1_5_Content.replace(/\{0\}/g, PlayOneCategoryPageController.Current.numWCardShown.toString())
                                .replace('{1}', "<button>Rest:<br /><span class='badge'>" + PlayOneCategoryPageController.Current.numRestWCards + "</span></button>")
                                .replace('{2}', "<span class='glyphicon glyphicon-cog' style='color:red; font-size:3vh;'></span><br/>") +
                            "</div>");
                        $(".glyphicon-cog").addClass('blink');
                        $("#btChangeCards").addClass('blink');
                        $("#btChangeCards").one('click', function (ev) {
                            setTimeout(function () {
                                $(GlobalVariables.gdTutorElements.gdMain).hide(0);
                                $('#dpPlaySettings').removeClass('open');
                                $(".glyphicon-cog").removeClass('blink');
                                $("#btChangeCards").removeClass('blink');
                                GlobalVariables.alert(thisPageTexts.stTut1_5To6);
                                if (GlobalVariables.isTutorMode) {
                                    GlobalVariables.tutorState.Step++;
                                    TutorialHelper.Action(GlobalVariables.tutorState);
                                }
                            }, 500);
                        });
                        break;
                    case 5:
                        $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                        $(GlobalVariables.gdTutorElements.gdContent).html("<div style='text-align:center; font-size:4vh;'>" + thisPageTexts.stTut1_6_Title
                            + "</div>" +
                            "<div style='text-align:left; font-size:2vh;'>" +
                            thisPageTexts.stTut1_6_Content.replace('{0}', "<span class='glyphicon glyphicon-resize-small'></span>")
                                .replace('{1}', "<img src='http://files.channel9.msdn.com/thumbnail/5b5394ca-30b2-4880-99fb-89de81c8e46b.jpg' style='width:3vh'/>X2")
                            + " </div>");
                        $(GlobalVariables.gdTutorElements.btHide).addClass('blink');
                        var onShownInfo = function (ev) {
                            GlobalVariables.alert(thisPageTexts.stTut1_6To7);
                            $('.cvMain .WCard').off(GlobalVariables.onDoubleClick, onShownInfo);
                            $(GlobalVariables.gdTutorElements.btHide).removeClass('blink');
                            if (GlobalVariables.isTutorMode) {
                                GlobalVariables.tutorState.Step++;
                                TutorialHelper.Action(GlobalVariables.tutorState);
                            }
                        };
                        $('.cvMain .WCard').off(GlobalVariables.onDoubleClick, onShownInfo);
                        $('.cvMain .WCard').on(GlobalVariables.onDoubleClick, onShownInfo);
                        break;
                    default:
                        if (GlobalVariables.isTutorMode) {
                            GlobalVariables.tutorState = { Main: TutorMainEnum.Hint, Step: 0 };
                            TutorialHelper.Action(GlobalVariables.tutorState);
                        }
                        break;
                }
                ;
                break;
            case TutorMainEnum.Hint:
                switch (state.Step) {
                    case 0:
                        $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                        $(GlobalVariables.gdTutorElements.gdContent).html("<div style='text-align:center; font-size:5vh;'>" + thisPageTexts.stTut2_0_Title
                            + "</div>" +
                            "<div style='text-align:center; font-size:3vh;'>" + thisPageTexts.stTut2_0_Content.replace('{0}', "<input type='radio'/>")
                            .replace('{1}', "<span class='glyphicon glyphicon-cog' style='color:red; font-size:4vw;'></span>")
                            + "</div>");
                        $(".glyphicon-cog").addClass('blink');
                        $("#lbHint").addClass('blink');
                        var onChange = function (ev) {
                            if (PlayOneCategoryPageController.Current.playType != 'hint')
                                return;
                            $(".glyphicon-cog").removeClass('blink');
                            $("#lbHint").removeClass('blink');
                            $('#dpPlaySettings').removeClass('open');
                            $(GlobalVariables.gdTutorElements.gdMain).hide(0);
                            $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                            $(GlobalVariables.gdTutorElements.gdContent).html("<div style='text-align:center; font-size:5vh;'>" + thisPageTexts.stTut2_1_Title
                                + "</div>" +
                                "<div style='text-align:center; font-size:3vh;'>" +
                                thisPageTexts.stTut2_1_Content.replace('{0}', "<span class='glyphicon glyphicon-resize-small'></span><sub>Hide</sub>")
                                + "</div>");
                            $(PlayOneCategoryPageController.Current.ddSettings).off(GlobalVariables.PlayTypeChangeKey, onChange);
                            $(GlobalVariables.gdTutorElements.btHide).addClass('blink');
                            var onCardClicked = function (ev) {
                                GlobalVariables.alert(thisPageTexts.stTut2_1To2);
                                $(GlobalVariables.gdTutorElements.btHide).removeClass('blink');
                                $('.cvMain .WCard').off(GlobalVariables.onSingleClick, onCardClicked);
                                if (GlobalVariables.isTutorMode) {
                                    GlobalVariables.tutorState.Step++;
                                    TutorialHelper.Action(GlobalVariables.tutorState);
                                }
                            };
                            $('.cvMain .WCard').off(GlobalVariables.onSingleClick, onCardClicked);
                            $('.cvMain .WCard').on(GlobalVariables.onSingleClick, onCardClicked);
                        };
                        $(PlayOneCategoryPageController.Current.ddSettings).off(GlobalVariables.PlayTypeChangeKey, onChange);
                        $(PlayOneCategoryPageController.Current.ddSettings).on(GlobalVariables.PlayTypeChangeKey, onChange);
                        break;
                    case 1:
                        $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                        $(GlobalVariables.gdTutorElements.gdContent).html("<div style='text-align:center; font-size:4vh;'>" + thisPageTexts.stTut2_2_Title
                            + "</div>" +
                            "<div style='text-align:center; font-size:2vh;'>" + thisPageTexts.stTut2_2_Content.replace('{0}', "<button class='glyphicon glyphicon-exclamation-sign'/>")
                            .replace('{1}', "<button class='glyphicon glyphicon-pause'/>")
                            + "</div>");
                        $("button.glyphicon-pause,button.glyphicon-exclamation-sign").addClass('blink');
                        var onClickPlayAll = function (ev) {
                            $(GlobalVariables.gdTutorElements.gdMain).hide('slow');
                            $(PlayOneCategoryPageController.Current.btAudioAllPlay).off('click', onClickPlayAll);
                        };
                        $(PlayOneCategoryPageController.Current.btAudioAllPlay).off('click', onClickPlayAll);
                        $(PlayOneCategoryPageController.Current.btAudioAllPlay).on('click', onClickPlayAll);
                        var onAudioStop = function (ev, audioState) {
                            $(PlayOneCategoryPageController.Current.btPauseAudio).off(GlobalVariables.AudioPauseKey, onAudioStop);
                            $("button.glyphicon-pause,button.glyphicon-exclamation-sign").removeClass('blink');
                            if (audioState === AudioSequenceStateEnum.End || audioState === AudioSequenceStateEnum.Pause)
                                GlobalVariables.alert(thisPageTexts.stTut2_2To3);
                            if (GlobalVariables.isTutorMode) {
                                GlobalVariables.tutorState.Step++;
                                TutorialHelper.Action(GlobalVariables.tutorState);
                            }
                        };
                        $(PlayOneCategoryPageController.Current.btPauseAudio).off(GlobalVariables.AudioPauseKey, onAudioStop);
                        $(PlayOneCategoryPageController.Current.btPauseAudio).on(GlobalVariables.AudioPauseKey, onAudioStop);
                        break;
                    default:
                        if (GlobalVariables.isTutorMode) {
                            GlobalVariables.tutorState = { Main: TutorMainEnum.KeyIn, Step: 0 };
                            TutorialHelper.Action(GlobalVariables.tutorState);
                        }
                        break;
                }
                break;
            case TutorMainEnum.KeyIn:
                switch (state.Step) {
                    case 0:
                        $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                        $(GlobalVariables.gdTutorElements.gdContent).html("<div style='text-align:center; font-size:5vh;'>" + thisPageTexts.stTut3_0_Title
                            + "</div>" +
                            "<div style='text-align:center; font-size:3vh;'>" + thisPageTexts.stTut3_0_Content.replace('{0}', "<input type='radio'/>")
                            .replace('{1}', "<span class='glyphicon glyphicon-cog' style='color:red; font-size:4vw;'></span>")
                            + "</div>");
                        $(".glyphicon-cog").addClass('blink');
                        $("#lbKeyIn").addClass('blink');
                        var onChange = function (ev) {
                            if (PlayOneCategoryPageController.Current.playType != 'rec')
                                return;
                            $(".glyphicon-cog").removeClass('blink');
                            $("#lbKeyIn").removeClass('blink');
                            $('#dpPlaySettings').removeClass('open');
                            $(GlobalVariables.gdTutorElements.gdMain).hide(0);
                            $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                            $(GlobalVariables.gdTutorElements.gdContent).html("<div style='text-align:center; font-size:5vh;'>" + thisPageTexts.stTut3_1_Title
                                + "</div>" +
                                "<div style='text-align:center; font-size:3vh;'>" + thisPageTexts.stTut3_1_Content.replace('{0}', "<span class='glyphicon glyphicon-resize-small'></span><sub>Hide</sub>")
                                + "</div>");
                            $(PlayOneCategoryPageController.Current.ddSettings).off(GlobalVariables.PlayTypeChangeKey, onChange);
                            $(GlobalVariables.gdTutorElements.btHide).addClass('blink');
                            var onCardClicked = function (ev) {
                                $(GlobalVariables.gdTutorElements.btHide).removeClass('blink');
                                $('.cvMain .WCard').off(GlobalVariables.onSingleClick, onCardClicked);
                                $(GlobalVariables.gdTutorElements.gdMain).hide(0);
                                if (GlobalVariables.isTutorMode) {
                                    GlobalVariables.tutorState.Step++;
                                    TutorialHelper.Action(GlobalVariables.tutorState);
                                }
                            };
                            $('.cvMain .WCard').off(GlobalVariables.onSingleClick, onCardClicked);
                            $('.cvMain .WCard').on(GlobalVariables.onSingleClick, onCardClicked);
                        };
                        $(PlayOneCategoryPageController.Current.ddSettings).off(GlobalVariables.PlayTypeChangeKey, onChange);
                        $(PlayOneCategoryPageController.Current.ddSettings).on(GlobalVariables.PlayTypeChangeKey, onChange);
                        break;
                    case 1:
                        $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                        $(GlobalVariables.gdTutorElements.gdContent).html("<div style='text-align:center; font-size:5vh;'>" + thisPageTexts.stTut3_1_2_Title
                            + "</div>" +
                            "<div style='text-align:center; font-size:3vh;'>" + thisPageTexts.stTut3_1_2_Content.replace('{0}', "CORRECT ANSWER")
                            + "</div>");
                        setTimeout(function () {
                            $(GlobalVariables.gdTutorElements.gdContent).html("<div style='text-align:center; font-size:5vh;'>" + thisPageTexts.stTut3_1_2_Title
                                + "</div>" +
                                "<div style='text-align:center; font-size:3vh;'>" + thisPageTexts.stTut3_1_2_Content.replace('{0}', PlayOneCategoryPageController.Current.selWCard.cardInfo.Dictate)
                                + "</div>");
                        }, 1000);
                        $("#tbKeyIn").addClass('blink-background');
                        var onRemove = function (ev) {
                            $(GlobalVariables.gdTutorElements.gdMain).hide(0);
                            GlobalVariables.alert(thisPageTexts.stTut3_1To2);
                            $(PlayOneCategoryPageController.Current.cvMain).off(GlobalVariables.RemoveAWCardKey, onRemove);
                            $("#gdTutorial #btHide").removeClass('blink');
                            $("#tbKeyIn").removeClass('blink-background');
                            if (GlobalVariables.isTutorMode) {
                                GlobalVariables.tutorState.Step++;
                                TutorialHelper.Action(GlobalVariables.tutorState);
                            }
                        };
                        $(PlayOneCategoryPageController.Current.cvMain).off(GlobalVariables.RemoveAWCardKey, onRemove);
                        $(PlayOneCategoryPageController.Current.cvMain).on(GlobalVariables.RemoveAWCardKey, onRemove);
                        break;
                    default:
                        if (GlobalVariables.isTutorMode) {
                            PlayOneCategoryPageController.Current.TutorType = TutorMainEnum[TutorMainEnum.End];
                        }
                        break;
                }
                break;
            case TutorMainEnum.End:
                if (typeof (Storage) !== "undefined")
                    localStorage.setItem(GlobalVariables.IsShownTutorKey, String(GlobalVariables.isTutorMode));
                $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                $(GlobalVariables.gdTutorElements.gdContent).html("<div style='text-align:center; font-size:5vh;'>" + thisPageTexts.stTut_End_Title
                    + "</div>" +
                    "<div style='text-align:center; font-size:3vh;'>" + thisPageTexts.stTut_End_Content.replace('{0}', "<span class='glyphicon glyphicon-remove-sign'></span><sub>Stop</sub>")
                    + "</div>");
                PlayOneCategoryPageController.scope.$apply(function () { PlayOneCategoryPageController.Current.playType = PlayTypeEnum.syn; });
                break;
        }
    };
    return TutorialHelper;
}());
var GlobalVariables = (function () {
    function GlobalVariables() {
    }
    GlobalVariables.alert = function (msg) {
        var divAlert = $("#gdAlert");
        divAlert.text(msg)
            .dialog({ modal: true });
    };
    ;
    return GlobalVariables;
}());
GlobalVariables.categoryListFileName = "MYCategory.json";
GlobalVariables.containerListFileName = "MYContainer.json";
GlobalVariables.isHostNameShown = true;
GlobalVariables.isLog = false;
GlobalVariables.isIOS = /iP/i.test(navigator.userAgent);
GlobalVariables.currentUser = "MYC";
GlobalVariables.onSingleClick = "onSingleClick";
GlobalVariables.onDoubleClick = "onDoubleClick";
GlobalVariables.numCardClick = 0;
GlobalVariables.timerCardClickId = Number.NaN;
GlobalVariables.clickedViewCard = null;
GlobalVariables.PlayType = PlayTypeEnum.syn;
GlobalVariables.currentDocumentSize = [0, 0];
GlobalVariables.synthesis = window["speechSynthesis"];
GlobalVariables.allVoices = undefined;
GlobalVariables.currentSynVoice = undefined;
GlobalVariables.synUtterance = undefined;
GlobalVariables.isTutorMode = true;
GlobalVariables.IsShownTutorKey = "IsShownTutor";
GlobalVariables.tutorState = {
    Main: TutorMainEnum.Begin,
    Step: 0
};
GlobalVariables.RemoveAWCardKey = "RemoveAWCard";
GlobalVariables.SynVoiceChangeKey = "SynVoiceChange";
GlobalVariables.TutorTypeChangeKey = "TutorTypeChange";
GlobalVariables.PlayTypeChangeKey = "PlayTypeChange";
GlobalVariables.AudioPauseKey = "AudioPause";
GlobalVariables.PageTextChangeKey = "PageTextChange";
GlobalVariables.PageTextsJSONFName = "Resources.json";
GlobalVariables.AViewCardShownKey = "AViewCardShown";
var MyFileHelper = (function () {
    function MyFileHelper() {
    }
    MyFileHelper.FeedTextFromTxtFileToACallBack = function (pathOrUrl, thisCard, callback) {
        var request = new XMLHttpRequest();
        request.open("GET", pathOrUrl, true);
        request.onloadend = function (ev) {
            if (GlobalVariables.isLog) {
                console.log("FeedTextFromTxtFileToACallBack: " + request);
            }
            if ((ev.target).status != 404)
                callback(request.responseText, thisCard);
        };
        request.send();
    };
    return MyFileHelper;
}());
MyFileHelper.ShowTextFromTxtFile = function (pathOrUrl, tbResult) {
    var request = new XMLHttpRequest();
    request.open("GET", pathOrUrl, true);
    request.onloadend = function (ev) {
        tbResult.innerText = request.responseText;
    };
    request.send();
};
var FileTypeEnum = (function () {
    function FileTypeEnum() {
    }
    return FileTypeEnum;
}());
FileTypeEnum.Image = 1;
FileTypeEnum.Text = 2;
FileTypeEnum.Box = 4;
FileTypeEnum.Undefined = 8;
var WCard = (function () {
    function WCard(cardInfo, mainFolder, categoryFolder) {
        if (mainFolder === void 0) { mainFolder = ""; }
        if (categoryFolder === void 0) { categoryFolder = ""; }
        this.viewCard = document.createElement("div");
        this._viewSize = [100, 100];
        this._viewPosition = [100, 100];
        this._boxIndex = 0;
        this._mainFolder = "";
        this._categoryFolder = "";
        this.mainFolder = mainFolder;
        this.categoryFolder = categoryFolder;
        this.IniCard(cardInfo);
        var viewCard = this.viewCard;
        var divMove = document.createElement("span");
        $(divMove).addClass('wMove');
        viewCard.appendChild(divMove);
        $(viewCard).on('click', function (ev) {
            var mouseDownTime = WCard.mouseDownTime;
            WCard.mouseDownTime = Date.now();
            if (GlobalVariables.numCardClick === 0 && WCard.mouseDownTime - mouseDownTime > 200)
                return;
            GlobalVariables.numCardClick++;
            GlobalVariables.clickedViewCard = this;
            if (!isNaN(GlobalVariables.timerCardClickId))
                clearTimeout(GlobalVariables.timerCardClickId);
            GlobalVariables.timerCardClickId = setTimeout(function () {
                var num = GlobalVariables.numCardClick;
                var clickedViewCard = GlobalVariables.clickedViewCard;
                var thisWCard = WCard.FindWCardFromViewCard(clickedViewCard);
                if (num == 1) {
                    $(thisWCard.viewCard).trigger(GlobalVariables.onSingleClick);
                    $(thisWCard).trigger(GlobalVariables.onSingleClick);
                }
                else if (num == 2) {
                    $(thisWCard.viewCard).trigger(GlobalVariables.onDoubleClick);
                    $(thisWCard).trigger(GlobalVariables.onDoubleClick);
                }
                else
                    ;
                GlobalVariables.numCardClick = 0;
                GlobalVariables.timerCardClickId = Number.NaN;
                console.log("Click num =" + num);
            }, 300);
        });
        $(viewCard).on('mousedown', function () {
            WCard.mouseDownTime = Date.now();
        });
    }
    Object.defineProperty(WCard.prototype, "viewSize", {
        get: function () { return this._viewSize; },
        set: function (value) {
            this._viewSize = value;
            this.viewCard.style.width = value[0].toString() + "px";
            this.viewCard.style.height = value[1].toString() + "px";
            if (this.cCards)
                for (var i0 = 0; i0 < this.cCards.length; i0++) {
                    if (this.cCards[i0]) {
                        this.cCards[i0].style.width = value[0].toString() + "px";
                        this.cCards[i0].style.height = value[1].toString() + "px";
                    }
                }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WCard.prototype, "viewPosition", {
        get: function () { return this._viewPosition; },
        set: function (value) {
            this._viewPosition = value;
            $(this.viewCard).animate({
                left: value[0].toString() + "px",
                top: value[1].toString() + "px"
            });
            if (this.cCards)
                for (var i0 = 0; i0 < this.cCards.length; i0++) {
                    if (this.cCards[i0]) {
                        this.cCards[i0].style.left = value[0].toString() + "px";
                        this.cCards[i0].style.top = value[1].toString() + "px";
                    }
                }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WCard.prototype, "boxIndex", {
        get: function () { return this._boxIndex; },
        set: function (value) {
            this._boxIndex = value;
            if (!this.cCards)
                this.cCards = new Array(this.cardsPath.length);
            var oldCards = this.viewCard.getElementsByClassName(WCard.cardMainKey);
            if (oldCards.length != 0)
                this.viewCard.removeChild(oldCards[0]);
            var isNewCard = false;
            if (!this.cCards[value]) {
                isNewCard = true;
                this.cCards[value] = this.GetcCardFromPath.call(this, this.cardsPath[value], true);
                if (!this.cCards[value]) {
                    this.cCards[value] = this.CardForMessage(WCard.cardMainKey, this.cardsPath[value] + " cannot be opened.");
                }
            }
            if (isNaN(this.viewWHRatio[value]) && this.cCards[value]["naturalHeight"])
                this.viewWHRatio[value] = (this.cCards[value]["naturalWidth"]) / (this.cCards[value]["naturalHeight"]);
            var bufHeight = (isNaN(this.viewWHRatio[value])) ? this.viewSize[1] : (this.viewSize[0] / this.viewWHRatio[value]);
            if (!this.cardInfo.IsSizeFixed) {
                this.viewSize = [this.viewSize[0], bufHeight];
            }
            else
                this.viewSize = this.viewSize;
            this.cCards[value].style.zIndex = "1";
            this.viewCard.appendChild(this.cCards[value]);
            var tbIth = this.viewCard.getElementsByClassName('tbIth')[0];
            if (tbIth)
                tbIth.innerText = (value + 1).toString() + "/" + this.cCards.length.toString();
            if (!isNewCard)
                $(document).trigger(GlobalVariables.AViewCardShownKey, this.cCards[value]);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WCard.prototype, "mainFolder", {
        get: function () {
            return this._mainFolder;
        },
        set: function (value) {
            this._mainFolder = (value.length != 0 && value.charAt(value.length - 1) === '/') ? value.substr(0, value.length - 1) : value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WCard.prototype, "categoryFolder", {
        get: function () {
            return this._categoryFolder;
        },
        set: function (value) {
            this._categoryFolder = (value.length != 0 && value.charAt(value.length - 1) === '/') ? value.substr(0, value.length - 1) : value;
        },
        enumerable: true,
        configurable: true
    });
    WCard.prototype.IniCard = function (cardInfo) {
        this.cardInfo = cardInfo;
        var fileName = cardInfo.FileName;
        var theCard = this.GetcCardFromPath.call(this, fileName);
        if (theCard) {
            if (!this.cCards)
                this.cCards = new Array(1);
            this.cCards[0] = theCard;
            this.viewCard.appendChild(theCard);
        }
        if (cardInfo.Size) {
            this.viewSize = cardInfo.Size;
            if (cardInfo.IsSizeFixed === undefined)
                cardInfo.IsSizeFixed = true;
        }
        else
            this.viewSize = [200, 200];
        if (cardInfo.Position) {
            this.viewPosition = cardInfo.Position;
            if (cardInfo.IsXPosFixed === undefined)
                cardInfo.IsXPosFixed = true;
            if (cardInfo.IsYPosFixed === undefined)
                cardInfo.IsYPosFixed = true;
        }
        this.viewCard.style.position = "absolute";
        $(this.viewCard).addClass("WCard");
        if (!this.cardInfo.IsHideShadow)
            $(this.viewCard).addClass("hasShadow");
    };
    WCard.prototype.IniBox = function (stContent, thisWCard) {
        var sentences = stContent.split('\n');
        for (var i0 = 0; i0 < sentences.length; i0++) {
            var sentence = sentences[i0];
            if (sentence.length === 0)
                continue;
            var buf = sentence.split(/(\*\*\*\*\*|\+\+\+\+\+)/);
            if (buf[0] === "*****" || buf[0] === "+++++")
                continue;
            if (!thisWCard.cardsPath) {
                thisWCard.cardsPath = new Array();
                thisWCard.cardsHyperLink = new Array();
                thisWCard.cardsDescription = new Array();
            }
            thisWCard.cardsPath.push(buf[0]);
            var ind = buf.indexOf("*****");
            if (ind != -1 && (ind + 1) < buf.length && buf[ind + 1] != "+++++")
                thisWCard.cardsHyperLink.push(buf[ind + 1]);
            else
                thisWCard.cardsHyperLink.push("");
            ind = buf.indexOf("+++++");
            if (ind != -1 && (ind + 1) < buf.length && buf[ind + 1] != "*****")
                thisWCard.cardsDescription.push(buf[ind + 1]);
            else
                thisWCard.cardsDescription.push("");
        }
        thisWCard.boxIndex = (thisWCard.cardsPath) ? MathHelper.MyRandomN(0, thisWCard.cardsPath.length - 1) : 0;
        if (thisWCard.cardsPath.length > 1 && $(thisWCard.viewCard).children(".btLeft").length === 0) {
            var tbIth = document.createElement('div');
            var btLeft = document.createElement('button');
            var btRight = document.createElement('button');
            btLeft.className = "btLeft";
            btLeft.innerHTML = "<";
            btLeft.style.left = "0";
            btRight.style.top = btLeft.style.top = "50%";
            btRight.style.opacity = btLeft.style.opacity = "0.3";
            btRight.style.position = btLeft.style.position = "absolute";
            btRight.className = "btRight";
            btRight.innerText = ">";
            btRight.style.right = "0";
            tbIth.className = "tbIth";
            tbIth.style.bottom = "0";
            tbIth.style.right = "0";
            tbIth.style.position = "absolute";
            btLeft.addEventListener('click', function (ev) {
                thisWCard.boxIndex = (thisWCard.boxIndex == 0) ? thisWCard.cCards.length - 1 : thisWCard.boxIndex - 1;
                ev.stopPropagation();
            });
            btRight.addEventListener('click', function (ev) {
                thisWCard.boxIndex = (thisWCard.boxIndex == (thisWCard.cCards.length - 1)) ? 0 : thisWCard.boxIndex + 1;
                ev.stopPropagation();
            });
            thisWCard.viewCard.appendChild(btLeft);
            thisWCard.viewCard.appendChild(btRight);
            thisWCard.viewCard.appendChild(tbIth);
        }
    };
    WCard.GetFileType = function (pathOrUrl) {
        pathOrUrl = pathOrUrl.replace('\r', "");
        pathOrUrl = pathOrUrl.replace('\n', " ");
        pathOrUrl = pathOrUrl.trim();
        var iDot = pathOrUrl.lastIndexOf('.');
        var extension = (iDot === 0 || iDot === pathOrUrl.length - 1 || iDot === -1) ? undefined : pathOrUrl.substr(iDot + 1, pathOrUrl.length - iDot - 1);
        extension = extension.toLowerCase();
        if (extension === "txt" || extension === "text") {
            return FileTypeEnum.Text;
        }
        else if (extension === "jpg" || extension === "jpeg" || extension === "gif" || extension === "png" || extension === "bmp") {
            return FileTypeEnum.Image;
        }
        else if (extension === "box") {
            return FileTypeEnum.Box;
        }
        else
            return FileTypeEnum.Undefined;
    };
    WCard.prototype.GetcCardFromPath = function (cardPath, isInsideBox) {
        if (isInsideBox === void 0) { isInsideBox = false; }
        var resObj;
        var fileType = WCard.GetFileType(cardPath);
        var vWHRatio = Number.NaN;
        switch (fileType) {
            case (FileTypeEnum.Image):
                var img = new Image();
                $(img).one("load", function (ev) {
                    $(document).trigger(GlobalVariables.AViewCardShownKey, ev);
                });
                img.className = WCard.cardMainKey;
                img.src = CardsHelper.GetTreatablePath(cardPath, this.mainFolder, this.categoryFolder);
                vWHRatio = img.naturalWidth / img.naturalHeight;
                resObj = img;
                break;
            case (FileTypeEnum.Text):
                var tbArea = document.createElement("textarea");
                tbArea.className = WCard.cardMainKey;
                tbArea.readOnly = true;
                MyFileHelper.ShowTextFromTxtFile(CardsHelper.GetTreatablePath(cardPath, this.mainFolder, this.categoryFolder), tbArea);
                resObj = tbArea;
                $(document).trigger(GlobalVariables.AViewCardShownKey, tbArea);
                break;
            case (FileTypeEnum.Box):
                if (!isInsideBox) {
                    var pathOrUri = CardsHelper.GetTreatablePath(cardPath, this.mainFolder, this.categoryFolder);
                    MyFileHelper.FeedTextFromTxtFileToACallBack(pathOrUri, this, this.IniBox);
                }
                break;
            case (FileTypeEnum.Undefined):
                break;
        }
        if (fileType === FileTypeEnum.Image || fileType === FileTypeEnum.Text) {
            if (!this.viewWHRatio) {
                if (isInsideBox)
                    this.viewWHRatio = new Array(this.cardsPath.length);
                else
                    this.viewWHRatio = new Array(1);
            }
            this.viewWHRatio[this.boxIndex] = vWHRatio;
        }
        return resObj;
    };
    WCard.prototype.CardForMessage = function (className, stMsg) {
        var resObj;
        return resObj;
    };
    WCard.CleanWCards = function () {
        while (WCard.showedWCards.length > 0) {
            WCard.showedWCards[0].RemoveThisWCard();
        }
        while (WCard.restWCards.length > 0) {
            WCard.restWCards[0].RemoveThisWCard();
        }
    };
    WCard.prototype.RemoveThisWCard = function () {
        var isShown;
        var wcards;
        var self = this;
        if (!self)
            return;
        isShown = (self.viewCard.parentNode != null) ? true : false;
        if (isShown) {
            self.viewCard.parentNode.removeChild(self.viewCard);
            wcards = WCard.showedWCards;
        }
        else
            wcards = WCard.restWCards;
        for (var i0 = 0; i0 < wcards.length; i0++) {
            if (self === wcards[i0]) {
                wcards.splice(i0, 1);
                break;
            }
        }
    };
    WCard.FindWCardFromViewCard = function (viewCard) {
        var wcards = WCard.showedWCards;
        for (var i0 = 0; i0 < wcards.length; i0++) {
            if (viewCard === wcards[i0].viewCard) {
                return wcards[i0];
            }
        }
    };
    return WCard;
}());
WCard.showedWCards = new Array();
WCard.restWCards = new Array();
WCard.cardMainKey = "cardMain";
WCard.btLeftClickKey = "btLeftClick";
WCard.btRightClickKey = "btRightClick";
var IndexedDBHelper = (function () {
    function IndexedDBHelper() {
    }
    IndexedDBHelper.InitIDB = function () {
        IndexedDBHelper.myIDB = indexedDB || window["webkitIndexedDB"] || window["mozIndexedDB"];
        IndexedDBHelper.myIDBTransaction = window["IDBTransaction"] || window["webkitIDBTransaction"] || window["msIDBTransaction"];
        IndexedDBHelper.myIDBKeyRange = window["IDBKeyRange"] || window["webkitIDBKeyRange"] || window["msIDBKeyRange"];
    };
    IndexedDBHelper.OpenADBAsync = function (onSuccess) {
        if (onSuccess === void 0) { onSuccess = null; }
        if (!IndexedDBHelper.myIDB)
            IndexedDBHelper.InitIDB();
        if (!IndexedDBHelper.myIDB) {
            console.log("Does not support IndexedDB");
            return;
        }
        var request = IndexedDBHelper.myIDB.open(IndexedDBHelper.IDBDBKey, IndexedDBHelper.myVersion);
        request.onerror = function (ev) {
            console.log("Cannot open DataBase '" + IndexedDBHelper.IDBDBKey + "',   version:" + IndexedDBHelper.myVersion);
        };
        request.addEventListener("success", function (ev) {
            IndexedDBHelper.myDataBase = (ev.target).result;
            IndexedDBHelper.isReady = true;
            $(document).trigger(IndexedDBHelper.ReadyTriggerKey);
            if (onSuccess)
                onSuccess(ev);
        });
        request.onupgradeneeded = function (ev) {
            var db = ev.target.result;
            db.onerror = function (ev) {
                console.log("onupgradeneeded: Cannot open DataBase '" + IndexedDBHelper.IDBDBKey + "',   version:" + IndexedDBHelper.myVersion);
            };
            var myOS = db.createObjectStore(IndexedDBHelper.IDBUCCKey, { keyPath: "UCC" });
            var bufRecord = { SynLang: null, RecLang: "en-US", history: '[]', nextTime: 0, highestScore: 0 };
            for (var key in bufRecord) {
                myOS.createIndex(key, key, { unique: false });
            }
        };
    };
    IndexedDBHelper.DeleteADBAsync = function (onSuccess) {
        if (onSuccess === void 0) { onSuccess = null; }
        if (!IndexedDBHelper.myIDB)
            IndexedDBHelper.InitIDB();
        if (!IndexedDBHelper.myIDB) {
            console.log("Does not support IndexedDB");
            return;
        }
        var request = IndexedDBHelper.myIDB.deleteDatabase(IndexedDBHelper.IDBDBKey);
        request.addEventListener("success", function (ev) {
            IndexedDBHelper.myDataBase = null;
            if (onSuccess)
                onSuccess(ev);
        });
    };
    IndexedDBHelper.GetARecordAsync = function (refRecord, onSuccess) {
        if (onSuccess === void 0) { onSuccess = null; }
        var uccObj = { user: GlobalVariables.currentUser, Container: GlobalVariables.currentMainFolder, Category: GlobalVariables.currentCategoryFolder };
        var ucc = JSON.stringify(uccObj);
        var getRecord = function () {
            var transaction = IndexedDBHelper.myDataBase.transaction([IndexedDBHelper.IDBUCCKey], "readonly");
            var request = transaction
                .objectStore(IndexedDBHelper.IDBUCCKey)
                .get(ucc);
            request.addEventListener("success", function (ev) {
                if (request.result != undefined) {
                    for (var key in refRecord) {
                        refRecord[key] = request.result[key];
                    }
                }
                else {
                    console.log("success:: Cannot get this Record");
                    refRecord.UCC = ucc;
                }
                if (onSuccess)
                    onSuccess(ev);
            });
            request.addEventListener("error", function (ev) {
                console.log("Cannot get this Record");
                refRecord.UCC = ucc;
            });
            transaction.addEventListener("complete", function (ev) {
                $(document).trigger(IndexedDBHelper.GetIDBRecordKey);
            });
        };
        if (IndexedDBHelper.myDataBase)
            getRecord();
        else
            IndexedDBHelper.OpenADBAsync(getRecord);
    };
    IndexedDBHelper.PutARecordAsync = function (record, isAdd, onSuccess) {
        if (onSuccess === void 0) { onSuccess = null; }
        var putRecord = function () {
            var transaction = IndexedDBHelper.myDataBase.transaction([IndexedDBHelper.IDBUCCKey], 'readwrite');
            transaction.oncomplete = function (ev) {
            };
            var request;
            if (isAdd)
                request = transaction.objectStore(IndexedDBHelper.IDBUCCKey).add(record);
            else
                request = transaction.objectStore(IndexedDBHelper.IDBUCCKey).put(record);
            request.onerror = function (ev) {
                console.log("Fail to put data into the DataBase");
            };
            request.onsuccess = function (ev) {
                console.log("Succeed to put this Record into DataBase");
                if (onSuccess)
                    onSuccess(ev);
            };
        };
        if (IndexedDBHelper.myDataBase)
            putRecord();
        else
            IndexedDBHelper.OpenADBAsync(putRecord);
    };
    IndexedDBHelper.GetWholeCCFromIDBAsync = function (refCC, onFinish) {
        if (onFinish === void 0) { onFinish = null; }
        var getRefCC = function () {
            var transaction = IndexedDBHelper.myDataBase.transaction([IndexedDBHelper.IDBUCCKey], "readonly");
            var request = transaction
                .objectStore(IndexedDBHelper.IDBUCCKey)
                .openCursor();
            request.addEventListener("success", function (ev) {
                var cursor = (ev.target).result;
                if (cursor) {
                    var value = cursor.value;
                    var ucc = JSON.parse(value.UCC);
                    if (ucc.user === GlobalVariables.currentUser) {
                        var history = JSON.parse(value.history);
                        if (!refCC[ucc.Container])
                            refCC[ucc.Container] = { Categories: {}, lastNextTime: null };
                        var container = refCC[ucc.Container];
                        if (!container.Categories[ucc.Category])
                            container.Categories[ucc.Category] = { history: null, nextTime: null };
                        var category = container.Categories[ucc.Category];
                        category.history = history;
                        category.nextTime = value.nextTime;
                        container.lastNextTime = (container.lastNextTime) ? Math.min(container.lastNextTime, value.nextTime) : value.nextTime;
                    }
                    cursor.continue();
                }
                else {
                    if (onFinish)
                        onFinish(ev);
                }
            });
        };
        if (IndexedDBHelper.myDataBase)
            getRefCC();
        else
            IndexedDBHelper.OpenADBAsync(getRefCC);
    };
    ;
    return IndexedDBHelper;
}());
IndexedDBHelper.IDBDBKey = "MYCIDB";
IndexedDBHelper.IDBUCCKey = "UserConCategory";
IndexedDBHelper.ReadyTriggerKey = "IDBIsReady";
IndexedDBHelper.GetIDBRecordKey = "GetIDBRecord";
IndexedDBHelper.isReady = false;
IndexedDBHelper.myVersion = 1;
var PlayOneCategoryPageController = (function () {
    function PlayOneCategoryPageController($scope, $routeParams) {
        this.meCardsAudio = document.getElementById('meCardsAudio');
        this.meBackground = document.getElementById('meBackground');
        this.dlDblClickWCard = document.getElementById('dlDblClickWCard');
        this.dlFinish = document.getElementById('dlFinish');
        this.dlDictateSelected = document.getElementById('dlDictateSelected');
        this.ddSettings = document.getElementById('ddSettings');
        this.imgBackground = document.getElementById('imgBackground');
        this.btSynPlay = document.getElementById('btSynPlay');
        this.btLangSettings = document.getElementById('dropdownLangSettings');
        this.rdTutorType = document.getElementById('rdTutorType');
        this.cvMain = document.getElementsByClassName('cvMain')[0];
        this.btPauseAudio = document.getElementById('btPauseAudio');
        this.btAudioAllPlay = document.getElementById('btAudioAllPlay');
        this.topNavbar = document.getElementById('topNavbar');
        this.bottomNavbar = document.getElementById('bottomNavbar');
        this.barProgress = document.getElementById('barProgress');
        this.tbSyn = document.getElementById('tbSyn');
        this.tbHint = document.getElementById('tbHint');
        this.tbKeyIn = document.getElementById('tbKeyIn');
        this.isHiddingSynTB = false;
        this.selTextsForSyn = "";
        this.isBackAudioStartLoad = false;
        this.isAudioPlaying = false;
        this.isAudioInterruptable = false;
        this._IsShownAsList = false;
        this._IsDictateTextContentInHint = false;
        this._IsDictateAnsInHint = true;
        this._isAnsFirst = false;
        this.speechRecogMetadata = { confidence: 0, isSpeechRecognitionRunning: false, recInputSentence: "" };
        this.isBGAlsoChange = true;
        this.defaultCardStyle = { width: "16vw", height: "16vh" };
        this.nImgLoad = 0;
        this.maxDelScore = 20;
        this.pgScore = document.getElementById('pgScore');
        this.isHighest = false;
        this._rate2PowN = 0;
        this.eachRecord = { UCC: null, SynLang: "en-US", history: '[]', nextTime: 0, RecLang: "en-US", highestScore: 0 };
        this.onPlayBGSound = function (ev) {
            PlayOneCategoryPageController.Current.meBackground.load();
            PlayOneCategoryPageController.Current.meBackground.play();
        };
        this.onReloadSynVoices = function (ev) {
            SpeechSynthesisHelper.getAllVoices(PlayOneCategoryPageController.Current.GetCurrentSynVoice);
            SpeechSynthesisHelper.getAllVoices(function () {
                if (GlobalVariables.allVoices && GlobalVariables.allVoices.length > 0) {
                    var stVoice = "{";
                    for (var key in PlayOneCategoryPageController.Current.currentSynVoice) {
                        stVoice += key + ": " + PlayOneCategoryPageController.Current.currentSynVoice[key] + ";\n";
                    }
                    stVoice += "}";
                    GlobalVariables.alert("SynLang: " + PlayOneCategoryPageController.Current.SynLang + " ." + "Has allVoices." + "\n" +
                        "CurrentVoice: " + stVoice);
                }
                else
                    GlobalVariables.alert("No Voice." + " isIOS=" + GlobalVariables.isIOS);
            });
        };
        this.onWindowResize = function (ev) {
            updateLayout(undefined);
            console.log("window height:" + $(window).height());
            if (GlobalVariables.currentDocumentSize[0] === $(document).innerWidth() && GlobalVariables.currentDocumentSize[1] === $(document).innerHeight())
                return;
            GlobalVariables.currentDocumentSize[0] = $(document).innerWidth();
            GlobalVariables.currentDocumentSize[1] = $(document).innerHeight();
            var wcards = WCard.showedWCards;
            CardsHelper.RearrangeCards(wcards, PlayOneCategoryPageController.oneOverNWindow);
        };
        this.ShowNewWCards_Click = function () {
            if (PlayOneCategoryPageController.Current.selWCard)
                $(PlayOneCategoryPageController.Current.selWCard.viewCard).removeClass(PlayOneCategoryPageController.styleSelWCard);
            var bufWCards = new Array();
            var shWCards = WCard.showedWCards;
            var rtWCards = WCard.restWCards;
            var N = PlayOneCategoryPageController.numWCardShown;
            var nShToRt = Math.max(0, shWCards.length + Math.min(rtWCards.length, N) - N);
            CardsHelper.MoveArrayElements(shWCards, bufWCards, nShToRt, PlayOneCategoryPageController.isPickWCardsRandomly);
            CardsHelper.MoveArrayElements(rtWCards, shWCards, N, PlayOneCategoryPageController.isPickWCardsRandomly, $(".cvMain"));
            CardsHelper.MoveArrayElements(bufWCards, rtWCards, nShToRt);
            PlayOneCategoryPageController.Current.numRestWCards;
            CardsHelper.RearrangeCards(shWCards, PlayOneCategoryPageController.oneOverNWindow);
        };
        this.Smaller_Click = function (ev) {
            PlayOneCategoryPageController.oneOverNWindow *= 1.2;
            CardsHelper.RearrangeCards(WCard.restWCards, PlayOneCategoryPageController.oneOverNWindow, false, false, 1 / 1.2, true);
            CardsHelper.RearrangeCards(WCard.showedWCards, PlayOneCategoryPageController.oneOverNWindow, false, true, 1 / 1.2);
            if (PlayOneCategoryPageController.Current.isBGAlsoChange) {
                var bGObj = PlayOneCategoryPageController.Current.imgBackground;
                $(bGObj).css({
                    'width': Math.round(bGObj.clientWidth / 1.2) + "px",
                    'height': Math.round(bGObj.clientHeight / 1.2) + "px"
                });
            }
            ev.stopPropagation();
        };
        this.Larger_Click = function (ev) {
            PlayOneCategoryPageController.oneOverNWindow /= 1.2;
            CardsHelper.RearrangeCards(WCard.restWCards, PlayOneCategoryPageController.oneOverNWindow, false, false, 1.2, true);
            CardsHelper.RearrangeCards(WCard.showedWCards, PlayOneCategoryPageController.oneOverNWindow, false, true, 1.2);
            if (PlayOneCategoryPageController.Current.isBGAlsoChange) {
                var bGObj = PlayOneCategoryPageController.Current.imgBackground;
                $(bGObj).css({
                    'width': Math.round(bGObj.clientWidth * 1.2) + "px",
                    'height': Math.round(bGObj.clientHeight * 1.2) + "px"
                });
            }
            ev.stopPropagation();
        };
        this.Arrange_Click = function (isRandomly) {
            CardsHelper.RearrangeCards(WCard.showedWCards, PlayOneCategoryPageController.oneOverNWindow, isRandomly, false);
        };
        this.OpenHyperLink_Click = function () {
            if (PlayOneCategoryPageController.Current.hyperLink)
                window.open(PlayOneCategoryPageController.Current.hyperLink);
        };
        this.synPlay_Click = function (ev) {
            if (!PlayOneCategoryPageController.Current.synAnsWCard) {
                PlayOneCategoryPageController.Current.synPlayNext_Click(null);
            }
            if (PlayOneCategoryPageController.Current.synAnsWCard) {
                var synAnsWCard = PlayOneCategoryPageController.Current.synAnsWCard;
                PlayOneCategoryPageController.Current.PlayAudio(synAnsWCard);
                if (!PlayOneCategoryPageController.Current.scoreTimerId) {
                    PlayOneCategoryPageController.Current.localMinusScore = 0;
                    PlayOneCategoryPageController.Current.scoreTimerId = setInterval(function () {
                        if ($(PlayOneCategoryPageController.Current.ddSettings).css('display') != 'none')
                            return;
                        PlayOneCategoryPageController.Current.localMinusScore++;
                        var score = PlayOneCategoryPageController.Current.localMinusScore;
                        if (score > PlayOneCategoryPageController.Current.maxDelScore) {
                            clearInterval(PlayOneCategoryPageController.Current.scoreTimerId);
                            PlayOneCategoryPageController.Current.scoreTimerId = null;
                        }
                        else {
                            PlayOneCategoryPageController.scope.$apply(function () {
                                PlayOneCategoryPageController.Current.totalScore--;
                            });
                        }
                    }, 1000);
                }
            }
        };
        this.synPlayNext_Click = function (ev) {
            var wcards = WCard.showedWCards;
            if (wcards.length === 0) {
                PlayOneCategoryPageController.Current.ShowNewWCards_Click();
                wcards = WCard.showedWCards;
            }
            if (wcards.length === 0) {
                PlayOneCategoryPageController.Current.FinalStep();
                return;
            }
            var ith = MathHelper.MyRandomN(0, wcards.length - 1);
            var ithOld = wcards.indexOf(PlayOneCategoryPageController.Current.synAnsWCard);
            if (ithOld < 0)
                ith = MathHelper.MyRandomN(0, wcards.length - 1);
            else {
                ith = MathHelper.MyRandomN(0, wcards.length - 2);
                ith = (ith < ithOld) ? ith : ith + 1;
            }
            PlayOneCategoryPageController.Current.synAnsWCard = wcards[ith];
            PlayOneCategoryPageController.Current.synPlay_Click(ev);
        };
        this.recCheckAnswer_Click = function (ev) {
            if (ev.type === "keyup" && ev.key.toLowerCase() !== "enter")
                return;
            if (PlayOneCategoryPageController.Current.speechRecogMetadata.isSpeechRecognitionRunning)
                return;
            if (PlayOneCategoryPageController.Current.selWCard)
                PlayOneCategoryPageController.Current.PlayAudio(PlayOneCategoryPageController.Current.selWCard);
            var anniWCard = function () {
                $(PlayOneCategoryPageController.Current.selWCard.viewCard).animate({ opacity: 0.1 }, {
                    duration: 100,
                    step: function (now, fx) {
                        $(this).css('transform', 'scale(' + 1 / now + ',' + 1 / now + ')');
                    },
                    complete: function () {
                        if (GlobalVariables.isTutorMode)
                            $(PlayOneCategoryPageController.Current.cvMain).trigger(GlobalVariables.RemoveAWCardKey);
                        if (PlayOneCategoryPageController.Current.selWCard)
                            PlayOneCategoryPageController.Current.selWCard.RemoveThisWCard();
                        PlayOneCategoryPageController.Current.selWCard = null;
                        if (WCard.showedWCards.length === 0)
                            PlayOneCategoryPageController.Current.ShowNewWCards_Click();
                        if (WCard.showedWCards.length === 0) {
                            PlayOneCategoryPageController.Current.FinalStep();
                            return;
                        }
                    }
                });
            };
            if (PlayOneCategoryPageController.Current.selWCard && PlayOneCategoryPageController.Current.speechRecogMetadata.recInputSentence) {
                var Answers = PlayOneCategoryPageController.Current.selWCard.cardInfo.Ans_KeyIn;
                var stInput = PlayOneCategoryPageController.Current.speechRecogMetadata.recInputSentence.trim();
                var isCorrect = false;
                for (var i0 = 0; i0 < Answers.length; i0++) {
                    if (Answers[i0].trim() === stInput) {
                        anniWCard();
                        isCorrect = true;
                        break;
                    }
                }
                if (!isCorrect) {
                    GlobalVariables.alert("Your answer is wrong.");
                    PlayOneCategoryPageController.Current.totalScore -= 3;
                }
            }
            else {
                if (PlayOneCategoryPageController.Current.selWCard) {
                    GlobalVariables.alert("Please input the answer.");
                }
                else {
                    GlobalVariables.alert("Click a card at first.");
                }
            }
        };
        VersionHelper.ReloadIfNeeded();
        $(this.barProgress).on("dragstart", barProgress_onDragStart);
        $(this.barProgress).on("drag", barProgress_onDrag);
        $(this.barProgress).on("dragend", barProgress_onDragEnd);
        $(this.barProgress).on("touchstart", barProgress_onDragStart);
        $(this.barProgress).on("touchmove", barProgress_onDrag);
        $(this.barProgress).on("touchend", barProgress_onDragEnd);
        PlayOneCategoryPageController.oneOverNWindow = 5;
        $(document).on(GlobalVariables.AViewCardShownKey, this.onAViewCardShown);
        SpeechRecognizerHelper.iniSpeechRecognition();
        PlayOneCategoryPageController.Current = this;
        PlayOneCategoryPageController.scope = $scope;
        WCard.CleanWCards();
        $(PlayOneCategoryPageController.Current.cvMain).css({
            top: $(PlayOneCategoryPageController.Current.topNavbar).height() + "px",
            height: (window.innerHeight - $(PlayOneCategoryPageController.Current.bottomNavbar).height()
                - $(PlayOneCategoryPageController.Current.topNavbar).height()
                - $(PlayOneCategoryPageController.Current.barProgress).height()) + "px"
        });
        var renewPageTexts = function () {
            PlayOneCategoryPageController.scope.$apply(function () {
                PlayOneCategoryPageController.Current.thisPageTexts = null;
            });
            $(document).off(GlobalVariables.PageTextChangeKey, renewPageTexts);
        };
        $(document).off(GlobalVariables.PageTextChangeKey, renewPageTexts);
        $(document).on(GlobalVariables.PageTextChangeKey, renewPageTexts);
        if (typeof (Storage) !== "undefined")
            GlobalVariables.isTutorMode = (localStorage.getItem(GlobalVariables.IsShownTutorKey) != "false");
        if (GlobalVariables.isTutorMode) {
            this.TutorType = TutorMainEnum[TutorMainEnum.Begin];
            TutorialHelper.Action(GlobalVariables.tutorState);
        }
        $scope.$on('$routeChangeStart', function (ev, next, current) {
            PlayOneCategoryPageController.Current.ClearBeforeLeavePage();
        });
        if (GlobalVariables.isIOS)
            $(PlayOneCategoryPageController.Current.imgBackground).css('cursor', 'pointer');
        this.btSynPlay.addEventListener("click", this.synPlay_Click);
        GlobalVariables.currentDocumentSize = [$(document).innerWidth(), $(document).innerHeight()];
        $(this.dlDblClickWCard).dialog({ autoOpen: false, modal: true });
        $(this.dlFinish).dialog({
            autoOpen: false, modal: true, dialogClass: "no-close",
            buttons: [{
                    text: "OK",
                    icons: { primary: "ui-icon-check" },
                    click: function () {
                        PlayOneCategoryPageController.Current.onGoBack();
                        $(PlayOneCategoryPageController.Current.dlFinish).dialog('close');
                    }
                }, {
                    text: "Again",
                    icons: { primary: "ui-icon-arrowrefresh-1-e" },
                    click: function () {
                        $(PlayOneCategoryPageController.Current.dlFinish).dialog('close');
                        var pathOrUri = CardsHelper.GetTreatablePath(GlobalVariables.categoryListFileName, PlayOneCategoryPageController.Current.Container, PlayOneCategoryPageController.Current.CFolder);
                        PlayOneCategoryPageController.scope.$apply(function () { PlayOneCategoryPageController.Current.isHighest = false; });
                        MyFileHelper.FeedTextFromTxtFileToACallBack(pathOrUri, WCard.restWCards, ShowWCardsAndEventsCallback);
                    }
                }]
        });
        $(this.dlDictateSelected).dialog({
            autoOpen: false, modal: true,
            buttons: [{
                    icons: { primary: "ui-icon-triangle-1-e" },
                    text: "Play",
                    click: function () {
                        if (GlobalVariables.synthesis && GlobalVariables.synUtterance) {
                            if (GlobalVariables.synthesis.paused)
                                GlobalVariables.synthesis.resume();
                            SpeechSynthesisHelper.Speak(PlayOneCategoryPageController.Current.selTextsForSyn, PlayOneCategoryPageController.Current.SynLang, PlayOneCategoryPageController.Current.currentSynVoice, Math.pow(2, PlayOneCategoryPageController.Current.rate2PowN));
                        }
                    }
                }]
        });
        $(this.dlDictateSelected).children(".tbSentence").select(function (ev) {
            var target = ev.target;
            PlayOneCategoryPageController.Current.selTextsForSyn = $(target).text().substring(target.selectionStart, target.selectionEnd);
        });
        if ($routeParams["Container"] != undefined)
            GlobalVariables.currentMainFolder = $routeParams["Container"];
        if ($routeParams["CFolder"] != undefined)
            GlobalVariables.currentCategoryFolder = $routeParams["CFolder"];
        this.Container = GlobalVariables.currentMainFolder;
        this.CFolder = GlobalVariables.currentCategoryFolder;
        this.numWCardShown = 8;
        this.isPickWCardsRandomly = true;
        var pathOrUri = CardsHelper.GetTreatablePath(GlobalVariables.categoryListFileName, this.Container, this.CFolder);
        if (GlobalVariables.isLog)
            console.log("PlayOneCategoryPage:constructor:pathOrUri= " + pathOrUri);
        MyFileHelper.FeedTextFromTxtFileToACallBack(pathOrUri, WCard.restWCards, ShowWCardsAndEventsCallback);
        $(window).on("resize", PlayOneCategoryPageController.Current.onWindowResize);
        if ($(window).height() > $(window).width())
            PlayOneCategoryPageController.oneOverNWindow *= $(window).width() / $(window).height();
        IndexedDBHelper.GetARecordAsync(PlayOneCategoryPageController.Current.eachRecord, function () {
            var history = JSON.parse(PlayOneCategoryPageController.Current.eachRecord.history);
            var playType;
            if (history && history.length > 0 && history[history.length - 1].slv > 5) {
                playType = PlayTypeEnum.rec;
            }
            else
                playType = PlayTypeEnum.syn;
            PlayOneCategoryPageController.Current.playType = playType;
        });
    }
    Object.defineProperty(PlayOneCategoryPageController.prototype, "IsShownAsList", {
        get: function () {
            return PlayOneCategoryPageController.Current._IsShownAsList;
        },
        set: function (value) {
            PlayOneCategoryPageController.Current._IsShownAsList = value;
            if (WCard.showedWCards.length !== 0) {
                CardsHelper.RearrangeCards(WCard.showedWCards);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayOneCategoryPageController.prototype, "IsDictateTextContentInHint", {
        get: function () {
            return PlayOneCategoryPageController.Current._IsDictateTextContentInHint;
        },
        set: function (value) {
            if (value === false && PlayOneCategoryPageController.Current._IsDictateAnsInHint === false)
                PlayOneCategoryPageController.Current.IsDictateAnsInHint = true;
            PlayOneCategoryPageController.Current._IsDictateTextContentInHint = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayOneCategoryPageController.prototype, "IsDictateAnsInHint", {
        get: function () {
            return PlayOneCategoryPageController.Current._IsDictateAnsInHint;
        },
        set: function (value) {
            if (value === false && PlayOneCategoryPageController.Current._IsDictateTextContentInHint === false)
                PlayOneCategoryPageController.Current.IsDictateTextContentInHint = true;
            PlayOneCategoryPageController.Current._IsDictateAnsInHint = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayOneCategoryPageController.prototype, "isAnsFirst", {
        get: function () {
            return PlayOneCategoryPageController.Current._isAnsFirst;
        },
        set: function (v) {
            PlayOneCategoryPageController.Current._isAnsFirst = v;
            if (v == true)
                PlayOneCategoryPageController.Current.IsDictateAnsInHint = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayOneCategoryPageController.prototype, "totalScore", {
        get: function () {
            return this._totalScore;
        },
        set: function (value) {
            this._totalScore = (value >= 0) ? value : 0;
            $(this.pgScore).css('width', Math.floor(value / this.glScore * 100).toString() + "%");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayOneCategoryPageController.prototype, "rate2PowN", {
        get: function () {
            return this._rate2PowN;
        },
        set: function (value) {
            var meAud = this.meCardsAudio;
            meAud.defaultPlaybackRate = Math.pow(2, value);
            this._rate2PowN = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayOneCategoryPageController.prototype, "numWCardShown", {
        get: function () {
            return PlayOneCategoryPageController.numWCardShown;
        },
        set: function (value) {
            PlayOneCategoryPageController.numWCardShown = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayOneCategoryPageController.prototype, "isPickWCardsRandomly", {
        get: function () {
            return PlayOneCategoryPageController.isPickWCardsRandomly;
        },
        set: function (value) {
            PlayOneCategoryPageController.isPickWCardsRandomly = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayOneCategoryPageController.prototype, "numRestWCards", {
        get: function () {
            return WCard.restWCards.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayOneCategoryPageController.prototype, "playType", {
        get: function () {
            return GlobalVariables.PlayType;
        },
        set: function (value) {
            if (GlobalVariables.PlayType != value) {
                if (value === PlayTypeEnum.rec) {
                    if (PlayOneCategoryPageController.Current.scoreTimerId) {
                        clearInterval(PlayOneCategoryPageController.Current.scoreTimerId);
                        PlayOneCategoryPageController.Current.scoreTimerId = null;
                        PlayOneCategoryPageController.Current.localMinusScore = 0;
                    }
                }
                else if (value === PlayTypeEnum.hint) {
                    PlayOneCategoryPageController.Current.totalScore -= PlayOneCategoryPageController.Current.maxDelScore;
                }
                GlobalVariables.PlayType = value;
                if (PlayOneCategoryPageController.Current.selWCard) {
                    $(PlayOneCategoryPageController.Current.selWCard.viewCard).removeClass(PlayOneCategoryPageController.styleSelWCard);
                }
                $(PlayOneCategoryPageController.Current.ddSettings).trigger(GlobalVariables.PlayTypeChangeKey);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayOneCategoryPageController.prototype, "synAllVoices", {
        get: function () {
            return GlobalVariables.allVoices;
        },
        set: function (value) {
            GlobalVariables.allVoices = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayOneCategoryPageController.prototype, "currentSynVoice", {
        get: function () { return this._currentSynVoice; },
        set: function (value) {
            if (value != this._currentSynVoice) {
                this._currentSynVoice = value;
                this.SynLang = value.lang;
                if (GlobalVariables.isTutorMode) {
                    $(PlayOneCategoryPageController.Current.btLangSettings).trigger(GlobalVariables.SynVoiceChangeKey);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayOneCategoryPageController.prototype, "currentContentSynVoice", {
        get: function () { return this._currentContentSynVoice; },
        set: function (value) {
            if (value != this._currentContentSynVoice) {
                this._currentContentSynVoice = value;
                this.ContentSynLang = value.lang;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayOneCategoryPageController.prototype, "isHavingSpeechRecognier", {
        get: function () {
            return GlobalVariables.isHavingSpeechRecognier;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayOneCategoryPageController.prototype, "TutorType", {
        get: function () {
            return TutorMainEnum[GlobalVariables.tutorState.Main];
        },
        set: function (value) {
            if (value === TutorMainEnum[GlobalVariables.tutorState.Main])
                return;
            $(PlayOneCategoryPageController.Current.rdTutorType).trigger(GlobalVariables.TutorTypeChangeKey);
            GlobalVariables.isTutorMode = true;
            $(PlayOneCategoryPageController.Current.rdTutorType).prop('disabled', true);
            switch (value) {
                case TutorMainEnum[TutorMainEnum.Begin]:
                    GlobalVariables.isTutorMode = true;
                    $(PlayOneCategoryPageController.Current.rdTutorType).removeProp('disabled');
                    GlobalVariables.tutorState = { Main: TutorMainEnum.Begin, Step: 0 };
                    break;
                case TutorMainEnum[TutorMainEnum.Basic]:
                    GlobalVariables.tutorState = { Main: TutorMainEnum.Basic, Step: 0 };
                    break;
                case TutorMainEnum[TutorMainEnum.Hint]:
                    GlobalVariables.tutorState = { Main: TutorMainEnum.Hint, Step: 0 };
                    break;
                case TutorMainEnum[TutorMainEnum.KeyIn]:
                    GlobalVariables.tutorState = { Main: TutorMainEnum.KeyIn, Step: 0 };
                    break;
                case TutorMainEnum[TutorMainEnum.End]:
                    GlobalVariables.isTutorMode = false;
                    $("#dropdownMenuPlayPageSettings").removeClass('blink');
                    $(PlayOneCategoryPageController.Current.rdTutorType).removeAttr('disabled');
                    GlobalVariables.tutorState = { Main: TutorMainEnum.End, Step: 0 };
                    PlayOneCategoryPageController.Current.playType = PlayTypeEnum.syn;
                    break;
                default:
                    GlobalVariables.isTutorMode = false;
                    $(PlayOneCategoryPageController.Current.rdTutorType).removeProp('disabled');
                    break;
            }
            TutorialHelper.Action(GlobalVariables.tutorState);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayOneCategoryPageController.prototype, "thisPageTexts", {
        get: function () {
            if (!GlobalVariables.PageTexts)
                GlobalVariables.PageTexts = PageTextHelper.defaultPageTexts;
            return GlobalVariables.PageTexts.PlayOneCategoryPageJSON;
        },
        set: function (value) {
        },
        enumerable: true,
        configurable: true
    });
    PlayOneCategoryPageController.prototype.ClearBeforeLeavePage = function () {
        $(window).off('resize', PlayOneCategoryPageController.Current.onWindowResize);
        $(document).off('click', PlayOneCategoryPageController.Current.onPlayBGSound);
        if (PlayOneCategoryPageController.Current.scoreTimerId)
            clearTimeout(PlayOneCategoryPageController.Current.scoreTimerId);
        $(GlobalVariables.gdTutorElements.gdMain).hide(0);
        $(PlayOneCategoryPageController.Current.btPauseAudio).off('click');
        $(GlobalVariables.synUtterance).off('start error end pause');
        $(document).off(GlobalVariables.AViewCardShownKey, PlayOneCategoryPageController.Current.onAViewCardShown);
        $(PlayOneCategoryPageController.Current.dlDictateSelected).children(".tbSentence").off("select");
        $(this.barProgress).off("dragstart", barProgress_onDragStart);
        $(this.barProgress).off("drag", barProgress_onDrag);
        $(this.barProgress).off("dragend", barProgress_onDragEnd);
        $(this.barProgress).off("touchstart", barProgress_onDragStart);
        $(this.barProgress).off("touchmove", barProgress_onDrag);
        $(this.barProgress).off("touchend", barProgress_onDragEnd);
    };
    PlayOneCategoryPageController.prototype.onGoBack = function () {
        if (history.length > 1)
            history.back();
        else
            location.href = "/";
    };
    PlayOneCategoryPageController.prototype.onTB_Click = function () {
        var pPage = PlayOneCategoryPageController.Current;
        var tBJQuery = $(pPage.dlDictateSelected).children(".tbSentence");
        var texts;
        switch (pPage.playType) {
            case PlayTypeEnum.syn:
                texts = $("#tbSyn").text();
                if (!texts)
                    return;
                tBJQuery.text(texts);
                break;
            case PlayTypeEnum.hint:
                texts = $("#tbHint").text();
                if (!texts)
                    return;
                tBJQuery.text(texts);
                break;
            default:
                break;
        }
        ;
        $(pPage.dlDictateSelected).dialog("open");
        tBJQuery[0].selectionStart = 0;
        tBJQuery[0].selectionEnd = texts.length;
        tBJQuery.select();
    };
    ;
    PlayOneCategoryPageController.prototype.onAViewCardShown = function (ev) {
        PlayOneCategoryPageController.Current.nImgLoad++;
        if (PlayOneCategoryPageController.Current.nImgLoad === 1) {
            CardsHelper.RearrangeCards(WCard.showedWCards, PlayOneCategoryPageController.oneOverNWindow, false, true);
            setTimeout(function () {
                var nCurrent = PlayOneCategoryPageController.Current.nImgLoad;
                PlayOneCategoryPageController.Current.nImgLoad = 0;
                if (nCurrent <= 1)
                    return;
                else
                    PlayOneCategoryPageController.Current.onAViewCardShown(ev);
            }, 1000);
        }
    };
    ;
    Object.defineProperty(PlayOneCategoryPageController.prototype, "isWCardUtterPausing", {
        get: function () {
            return PlayOneCategoryPageController.Current._isWCardUtterPausing;
        },
        set: function (v) {
            PlayOneCategoryPageController.Current._isWCardUtterPausing = v;
        },
        enumerable: true,
        configurable: true
    });
    PlayOneCategoryPageController.prototype.onPlayAllViewableWCard = function (ev) {
        if (GlobalVariables.synthesis)
            GlobalVariables.synthesis.cancel();
        PlayOneCategoryPageController.Current.isWCardUtterPausing = false;
        var onClick = function (ev) {
            PlayOneCategoryPageController.Current.isWCardUtterPausing = true;
            PlayOneCategoryPageController.Current.PauseAudio();
            $('button.glyphicon-exclamation-sign, #dropdownMenuPlayPageSettings').prop('disabled', false);
            $(PlayOneCategoryPageController.Current.btPauseAudio).trigger(GlobalVariables.AudioPauseKey, AudioSequenceStateEnum.Pause);
        };
        $(PlayOneCategoryPageController.Current.btPauseAudio).off('click', onClick);
        $(PlayOneCategoryPageController.Current.btPauseAudio).on('click', onClick);
        var ith = MathHelper.FindIndex(WCard.showedWCards, PlayOneCategoryPageController.Current.selWCard);
        ith = (ith < 0) ? 0 : ith;
        var ith0 = ith;
        var nextPlay = function (ev) {
            console.log("Debug" + " nextPlay " + ith);
            $(WCard.showedWCards[ith].viewCard).removeClass('selWCard');
            if (PlayOneCategoryPageController.Current.isWCardUtterPausing) {
                $(WCard.showedWCards[ith].viewCard).addClass('selWCard');
                return;
            }
            ith++;
            if (ith < WCard.showedWCards.length) {
                PlayOneCategoryPageController.scope.$apply(function () {
                    PlayOneCategoryPageController.Current.selWCard = WCard.showedWCards[ith];
                });
                $(WCard.showedWCards[ith].viewCard).addClass('selWCard');
                PlayOneCategoryPageController.Current.PlayAudio(WCard.showedWCards[ith], nextPlay);
            }
            else {
                $(WCard.showedWCards[ith0].viewCard).addClass('selWCard');
                PlayOneCategoryPageController.scope.$apply(function () {
                    PlayOneCategoryPageController.Current.selWCard = WCard.showedWCards[ith0];
                });
                $('button.glyphicon-exclamation-sign, #dropdownMenuPlayPageSettings').prop('disabled', false);
                $(PlayOneCategoryPageController.Current.btPauseAudio).trigger(GlobalVariables.AudioPauseKey, AudioSequenceStateEnum.End);
                return;
            }
        };
        $('button.glyphicon-exclamation-sign, #dropdownMenuPlayPageSettings').prop('disabled', true);
        PlayOneCategoryPageController.Current.selWCard = WCard.showedWCards[ith];
        $(WCard.showedWCards[ith].viewCard).addClass('selWCard');
        PlayOneCategoryPageController.Current.PlayAudio(WCard.showedWCards[ith], nextPlay);
    };
    PlayOneCategoryPageController.prototype.StartSpeechRecognition_Click = function (ev) {
        ev.stopPropagation();
        if (!this.selWCard) {
            this.recCheckAnswer_Click(ev);
            return;
        }
        if (!GlobalVariables.isHavingSpeechRecognier)
            return;
        var selWCard = this.selWCard;
        if (selWCard)
            SpeechRecognizerHelper.StartSpeechRecognition(PlayOneCategoryPageController.Current.speechRecogMetadata, selWCard.cardInfo.Ans_Recog, selWCard.cardInfo.Ans_KeyIn, PlayOneCategoryPageController.Current.SynLang, PlayOneCategoryPageController.scope);
    };
    PlayOneCategoryPageController.prototype.SetGlobalScore = function (wcards) {
        this.glScore = this.maxDelScore * wcards.length;
        this.totalScore = this.glScore;
    };
    PlayOneCategoryPageController.prototype.GetCurrentSynVoice = function () {
        PlayOneCategoryPageController.scope.$apply(function () {
            if (GlobalVariables.currentSynVoice)
                PlayOneCategoryPageController.Current.currentSynVoice = GlobalVariables.currentSynVoice;
            else if (GlobalVariables.allVoices && GlobalVariables.allVoices.length > 0) {
                var allVoices = GlobalVariables.allVoices;
                PlayOneCategoryPageController.Current.synAllVoices = null;
                PlayOneCategoryPageController.Current.synAllVoices = allVoices;
                var vVoice;
                if (PlayOneCategoryPageController.Current.SynLang)
                    vVoice = SpeechSynthesisHelper.getSynVoiceFromLang(PlayOneCategoryPageController.Current.SynLang);
                PlayOneCategoryPageController.Current.currentSynVoice = (vVoice) ? vVoice : GlobalVariables.allVoices[0];
                if (PlayOneCategoryPageController.Current.ContentSynLang)
                    vVoice = SpeechSynthesisHelper.getSynVoiceFromLang(PlayOneCategoryPageController.Current.ContentSynLang);
                PlayOneCategoryPageController.Current.currentContentSynVoice = (vVoice) ? vVoice : PlayOneCategoryPageController.Current.currentSynVoice;
            }
        });
    };
    ;
    PlayOneCategoryPageController.prototype.FinalStep = function () {
        if (PlayOneCategoryPageController.Current.eachRecord.highestScore < PlayOneCategoryPageController.Current.totalScore) {
            PlayOneCategoryPageController.Current.eachRecord.highestScore = PlayOneCategoryPageController.Current.totalScore;
            PlayOneCategoryPageController.Current.isHighest = true;
            var iCount = 0;
            var iterateAnimateFun = function (index, elem1) {
                var angle = Math.PI * 2 * Math.random();
                var speed = 50 + 70 * Math.random();
                $(elem1).css({ top: "50vh", left: "50vw" });
                var dt = 1;
                $(elem1).animate({ top: Math.round(50 + speed * Math.cos(angle) * dt) + "vh", left: Math.round(50 + speed * Math.sin(angle) * dt) + "vw" }, 1000 + index * 10, function () {
                    if (iCount > 100)
                        return;
                    iCount++;
                    iterateAnimateFun(index, elem1);
                });
            };
            $(".imgStar").each(function (index, elem) {
                iterateAnimateFun(index, elem);
            });
            setTimeout(PlayOneCategoryPageController.Current.ShowdlFinish, 4000);
        }
        else
            PlayOneCategoryPageController.Current.ShowdlFinish();
    };
    PlayOneCategoryPageController.prototype.ShowdlFinish = function () {
        var nFinal = PlayOneCategoryPageController.Current.totalScore;
        var nAll = PlayOneCategoryPageController.Current.glScore;
        var trueLV = Math.max(0, Math.round((nFinal / nAll - 0.5) * 20));
        var history = JSON.parse(PlayOneCategoryPageController.Current.eachRecord.history);
        var stInnerHTML = PlayOneCategoryPageController.Current.thisPageTexts.stShowScore.replace("{0}", PlayOneCategoryPageController.Current.totalScore.toString())
            .replace("{1}", PlayOneCategoryPageController.Current.glScore.toString());
        if (history.length === 0) {
            if (trueLV >= 1) {
                stInnerHTML += PlayOneCategoryPageController.Current.thisPageTexts.stNewUpToOne;
                PlayOneCategoryPageController.Current.level = 1;
            }
            else {
                stInnerHTML += PlayOneCategoryPageController.Current.thisPageTexts.stNewBackTo0;
                PlayOneCategoryPageController.Current.level = 0;
            }
            PlayOneCategoryPageController.Current.eachRecord.nextTime = Date.now() + 86400000;
        }
        else {
            var cHistory = history.pop();
            var oldScore = cHistory.score;
            var oldLV = cHistory.slv;
            var increaseYourLevel = function () {
                if (PlayOneCategoryPageController.Current.eachRecord.nextTime > Date.now()) {
                    stInnerHTML += PlayOneCategoryPageController.Current.thisPageTexts.stIncLVNotYet.replace('{0}', (Math.floor((PlayOneCategoryPageController.Current.eachRecord.nextTime - Date.now()) / 8640000) / 10).toString());
                    PlayOneCategoryPageController.Current.level = oldLV;
                }
                else {
                    var newTime = PlayOneCategoryPageController.Current.eachRecord.nextTime + Math.pow(2, oldLV / 2) * 86400000;
                    if ((newTime - 43200000) < Date.now())
                        newTime = Date.now() + 86400000;
                    stInnerHTML += PlayOneCategoryPageController.Current.thisPageTexts.stIncLV.replace('{0}', (Math.floor((newTime - Date.now()) / 8640000) / 10).toString());
                    PlayOneCategoryPageController.Current.level = oldLV + 1;
                    PlayOneCategoryPageController.Current.eachRecord.nextTime = newTime;
                }
                ;
            };
            var keepLevel = function () {
                var newTime = ((PlayOneCategoryPageController.Current.eachRecord.nextTime - 43200000) > Date.now()) ? PlayOneCategoryPageController.Current.eachRecord.nextTime : (Date.now() + 86400000);
                stInnerHTML += PlayOneCategoryPageController.Current.thisPageTexts.stKeepLV.replace('{0}', (Math.floor((newTime - Date.now()) / 8640000) / 10).toString());
                PlayOneCategoryPageController.Current.level = oldLV;
                PlayOneCategoryPageController.Current.eachRecord.nextTime = newTime;
            };
            var backToLV0 = function () {
                stInnerHTML += PlayOneCategoryPageController.Current.thisPageTexts.stBackTo0;
                PlayOneCategoryPageController.Current.level = 0;
                PlayOneCategoryPageController.Current.eachRecord.nextTime = Date.now() + 86400000;
            };
            var NoteForKeyIn = function () {
                stInnerHTML += PlayOneCategoryPageController.Current.thisPageTexts.stNoteForKeyIn;
            };
            if (nFinal > oldScore) {
                if (trueLV > oldLV) {
                    increaseYourLevel();
                }
                else {
                    keepLevel();
                    NoteForKeyIn();
                }
            }
            else if (nFinal === oldScore) {
                if (oldScore === PlayOneCategoryPageController.Current.glScore || trueLV > oldLV) {
                    increaseYourLevel();
                    stInnerHTML += PlayOneCategoryPageController.Current.thisPageTexts.stHandWriting;
                }
                else {
                    keepLevel();
                }
            }
            else if (nFinal < oldScore) {
                if (trueLV > oldLV) {
                    increaseYourLevel();
                }
                else {
                    backToLV0();
                }
                ;
                NoteForKeyIn();
            }
            ;
        }
        ;
        stInnerHTML = "<h1 style='text-align:center;'>LV" + PlayOneCategoryPageController.Current.level + "(" + trueLV + ")" + "</h1>" + stInnerHTML;
        $(PlayOneCategoryPageController.Current.dlFinish).html(stInnerHTML);
        $(PlayOneCategoryPageController.Current.dlFinish).dialog('open');
        PlayOneCategoryPageController.Current.meBackground.pause();
        var isAdd = (PlayOneCategoryPageController.Current.eachRecord.history === '[]') ? true : false;
        var lv = {
            slv: PlayOneCategoryPageController.Current.level,
            score: PlayOneCategoryPageController.Current.totalScore,
            ts: Date.now()
        };
        var lvs = JSON.parse(PlayOneCategoryPageController.Current.eachRecord.history);
        lvs.push(lv);
        PlayOneCategoryPageController.Current.eachRecord.history = JSON.stringify(lvs);
        IndexedDBHelper.PutARecordAsync(PlayOneCategoryPageController.Current.eachRecord, isAdd);
    };
    PlayOneCategoryPageController.prototype.PlayAudio = function (wCard, callback) {
        if (callback === void 0) { callback = null; }
        if (wCard.cardInfo.AudioFilePathOrUri && (PlayOneCategoryPageController.Current.playType === "hint" && PlayOneCategoryPageController.Current.IsDictateTextContentInHint === true) === false) {
            var meAud = PlayOneCategoryPageController.Current.meCardsAudio;
            meAud.src = CardsHelper.GetTreatablePath(wCard.cardInfo.AudioFilePathOrUri, PlayOneCategoryPageController.Current.Container, PlayOneCategoryPageController.Current.CFolder);
            meAud.load();
            meAud.play();
            $(meAud).one('playing', function () {
                PlayOneCategoryPageController.Current.isAudioPlaying = true;
            });
            $(meAud).one('ended', function () {
                PlayOneCategoryPageController.Current.isAudioPlaying = false;
            });
            if (callback) {
                $(meAud).one("ended", callback);
            }
        }
        else if (GlobalVariables.synthesis && GlobalVariables.synUtterance) {
            if (GlobalVariables.synthesis.paused)
                GlobalVariables.synthesis.resume();
            var isHintMode = PlayOneCategoryPageController.Current.playType === "hint";
            var sentence = wCard.cardInfo.Dictate;
            var lang = PlayOneCategoryPageController.Current.SynLang;
            var voice = PlayOneCategoryPageController.Current.currentSynVoice;
            if (wCard.cardInfo.Ans_Lang) {
                lang = wCard.cardInfo.Ans_Lang;
                PlayOneCategoryPageController.Current.SynLang = lang;
                var bufVoice = SpeechSynthesisHelper.getSynVoiceFromLang(lang);
                if (bufVoice != null) {
                    voice = bufVoice;
                    try {
                        PlayOneCategoryPageController.scope.$apply(function () {
                            PlayOneCategoryPageController.Current.currentSynVoice = voice;
                        });
                    }
                    catch (error) {
                        PlayOneCategoryPageController.Current.currentSynVoice = voice;
                    }
                }
            }
            var sentences = [];
            var langs = [];
            var voices = [];
            if (isHintMode) {
                var contentSentence = $(wCard.cCards[wCard.boxIndex]).text();
                var contentLang = (PlayOneCategoryPageController.Current.ContentSynLang) ? PlayOneCategoryPageController.Current.ContentSynLang : PlayOneCategoryPageController.Current.SynLang;
                var contentVoice = (PlayOneCategoryPageController.Current.currentContentSynVoice) ? PlayOneCategoryPageController.Current.currentContentSynVoice : PlayOneCategoryPageController.Current.currentSynVoice;
                var isAns = PlayOneCategoryPageController.Current.IsDictateAnsInHint;
                var isContentSyn = PlayOneCategoryPageController.Current.IsDictateTextContentInHint;
                var isAns1st = PlayOneCategoryPageController.Current.isAnsFirst;
                if (isContentSyn == false || (isAns && (isAns1st == false))) {
                    langs.push(lang);
                    voices.push(voice);
                    sentences.push(sentence);
                    if (isContentSyn == true) {
                        langs.push(contentLang);
                        voices.push(contentVoice);
                        sentences.push(contentSentence);
                    }
                }
                else {
                    langs.push(contentLang);
                    voices.push(contentVoice);
                    sentences.push(contentSentence);
                    if (isAns == true) {
                        langs.push(lang);
                        voices.push(voice);
                        sentences.push(sentence);
                    }
                }
            }
            else {
                langs.push(lang);
                voices.push(voice);
                sentences.push(sentence);
            }
            PlayOneCategoryPageController.Current.speakRecursively(sentences, langs, voices, callback);
        }
        else {
            if (callback)
                setTimeout(callback, 2000);
        }
    };
    ;
    PlayOneCategoryPageController.prototype.speakRecursively = function (sentences, langs, voices, callback) {
        if (sentences.length <= 0) {
            if (callback != null) {
                callback();
                console.log("Debug " + "speakRecursively callback end");
            }
        }
        else {
            var sentence = sentences.pop();
            var lang = langs.pop();
            var voice = voices.pop();
            if (sentence != undefined) {
                var s_1 = sentences.slice(0);
                var l_1 = langs.slice(0);
                var v_1 = voices.slice(0);
                if (sentence == "") {
                    PlayOneCategoryPageController.Current.speakRecursively(s_1, l_1, v_1, callback);
                }
                else {
                    $(GlobalVariables.synUtterance).one("end", function () {
                        if (PlayOneCategoryPageController.Current.isWCardUtterPausing == true && callback != null) {
                            callback();
                        }
                        else {
                            PlayOneCategoryPageController.Current.speakRecursively(s_1, l_1, v_1, callback);
                        }
                    });
                    SpeechSynthesisHelper.Speak(sentence, lang, voice, Math.pow(2, PlayOneCategoryPageController.Current.rate2PowN));
                }
            }
        }
    };
    PlayOneCategoryPageController.prototype.PauseAudio = function () {
        if (PlayOneCategoryPageController.Current.meCardsAudio)
            PlayOneCategoryPageController.Current.meCardsAudio.pause();
        if (GlobalVariables.synthesis && GlobalVariables.synUtterance)
            GlobalVariables.synthesis.cancel();
    };
    ;
    return PlayOneCategoryPageController;
}());
PlayOneCategoryPageController.oneOverNWindow = 5;
PlayOneCategoryPageController.styleSelWCard = "selWCard";
function ShowWCardsAndEventsCallback(jsonTxt, restWcards) {
    var showedWcards = WCard.showedWCards;
    var ith = 0;
    var jObj = JSON.parse(jsonTxt);
    PlayOneCategoryPageController.scope.$apply(function () {
        if (jObj.numWCardShown)
            PlayOneCategoryPageController.numWCardShown = jObj.numWCardShown;
        if (jObj.isBGAlsoChange != undefined)
            PlayOneCategoryPageController.Current.isBGAlsoChange = jObj.isBGAlsoChange;
        if (jObj.isPickWCardsRandomly != undefined)
            PlayOneCategoryPageController.isPickWCardsRandomly = jObj.isPickWCardsRandomly;
        if (jObj.isAudioInterruptable != undefined)
            PlayOneCategoryPageController.Current.isAudioInterruptable = jObj.isAudioInterruptable;
        if (jObj.IsShownAsList != undefined)
            PlayOneCategoryPageController.Current.IsShownAsList = jObj.IsShownAsList;
        if (jObj.IsDictateTextContentInHint != undefined)
            PlayOneCategoryPageController.Current.IsDictateTextContentInHint = jObj.IsDictateTextContentInHint;
        if (jObj.IsDictateAnsInHint != undefined)
            PlayOneCategoryPageController.Current.IsDictateAnsInHint = jObj.IsDictateAnsInHint;
    });
    PlayOneCategoryPageController.Current.SynLang = jObj.SynLang;
    PlayOneCategoryPageController.Current.ContentSynLang = jObj.ContentSynLang;
    SpeechSynthesisHelper.getAllVoices(function () {
        PlayOneCategoryPageController.Current.GetCurrentSynVoice();
        $(GlobalVariables.synUtterance).on('start', function (ev) {
            console.log('synUtterance.' + ev.type);
            PlayOneCategoryPageController.Current.isAudioPlaying = true;
        });
        $(GlobalVariables.synUtterance).on('error end pause', function (ev) {
            console.log('synUtterance.' + ev.type);
            PlayOneCategoryPageController.Current.isAudioPlaying = false;
        });
    });
    CardsHelper.GetWCardsCallback(jObj, restWcards);
    PlayOneCategoryPageController.Current.hyperLink = CardsHelper.GetTreatablePath(jObj.Link, PlayOneCategoryPageController.Current.Container, PlayOneCategoryPageController.Current.CFolder);
    if (jObj["Background"]) {
        var bgSettings = jObj.Background;
        if (bgSettings.ImgStyle) {
            var myStyle = bgSettings.ImgStyle;
            myStyle = CardsHelper.CorrectBackgroundStyle(myStyle, PlayOneCategoryPageController.Current.Container, PlayOneCategoryPageController.Current.CFolder);
            $(PlayOneCategoryPageController.Current.imgBackground).css(myStyle);
        }
        if (bgSettings.AudioProperties) {
            $(PlayOneCategoryPageController.Current.meBackground).prop(bgSettings.AudioProperties);
            $(document).one("click", PlayOneCategoryPageController.Current.onPlayBGSound);
        }
    }
    PlayOneCategoryPageController.Current.SetGlobalScore(restWcards);
    for (var i0 = 0; i0 < restWcards.length; i0++) {
        $(restWcards[i0]).on(GlobalVariables.onSingleClick, { thisWCard: restWcards[i0] }, function (ev) {
            if (PlayOneCategoryPageController.Current.playType === PlayTypeEnum.hint) {
                if ($('button.glyphicon-exclamation-sign').prop('disabled') === true) {
                    $(PlayOneCategoryPageController.Current.btPauseAudio).trigger('click');
                    return;
                }
            }
            var prevWCard = PlayOneCategoryPageController.Current.selWCard;
            var selWCard = ev.data.thisWCard;
            PlayOneCategoryPageController.scope.$apply(function () {
                PlayOneCategoryPageController.Current.selWCard = selWCard;
            });
            if (PlayOneCategoryPageController.Current.playType === PlayTypeEnum.syn) {
                if (PlayOneCategoryPageController.Current.isAudioPlaying && PlayOneCategoryPageController.Current.isAudioInterruptable) {
                    GlobalVariables.alert(PlayOneCategoryPageController.Current.thisPageTexts.stWaitUtterDone);
                    return;
                }
                if (selWCard === PlayOneCategoryPageController.Current.synAnsWCard) {
                    if (PlayOneCategoryPageController.Current.scoreTimerId) {
                        clearInterval(PlayOneCategoryPageController.Current.scoreTimerId);
                        PlayOneCategoryPageController.Current.scoreTimerId = null;
                    }
                    $(selWCard.viewCard).animate({ opacity: 0.1 }, {
                        duration: 200,
                        step: function (now, fx) {
                            $(this).css('transform', 'scale(' + 1 / now + ',' + 1 / now + ')');
                        },
                        complete: function () {
                            PlayOneCategoryPageController.Current.selWCard.RemoveThisWCard();
                            PlayOneCategoryPageController.Current.synAnsWCard = null;
                            PlayOneCategoryPageController.Current.synPlayNext_Click(null);
                            PlayOneCategoryPageController.scope.$apply(function () {
                                PlayOneCategoryPageController.Current.synAnsWCard;
                            });
                            if (GlobalVariables.isTutorMode)
                                $(PlayOneCategoryPageController.Current.btSynPlay).trigger(GlobalVariables.RemoveAWCardKey);
                        }
                    });
                }
                else {
                    if (!PlayOneCategoryPageController.Current.synAnsWCard) {
                        GlobalVariables.alert(PlayOneCategoryPageController.Current.thisPageTexts.stClickPlayAtFirst
                            .replace('{0}', "\u25BA"));
                        return;
                    }
                    if (PlayOneCategoryPageController.Current.scoreTimerId) {
                        var delScore = 2;
                        if (PlayOneCategoryPageController.Current.localMinusScore + 2 > PlayOneCategoryPageController.Current.maxDelScore) {
                            delScore = Math.max(0, PlayOneCategoryPageController.Current.maxDelScore - PlayOneCategoryPageController.Current.localMinusScore);
                        }
                        PlayOneCategoryPageController.Current.totalScore -= delScore;
                        PlayOneCategoryPageController.Current.localMinusScore += 2;
                    }
                    $(selWCard.viewCard).animate({ opacity: 0.5 }, {
                        duration: 100,
                        step: function (now, fx) {
                            $(this).css('transform', 'rotate(' + (1 - now) * 360 + 'deg)');
                        },
                        complete: function () {
                            $(this).animate({ opacity: 1 }, {
                                duration: 100,
                                step: function (now, fx) {
                                    $(this).css('transform', 'rotate(' + (1 - now) * 360 + 'deg)');
                                }
                            });
                        }
                    });
                }
            }
            else if (PlayOneCategoryPageController.Current.playType === PlayTypeEnum.rec) {
                $(".WCard").removeClass(PlayOneCategoryPageController.styleSelWCard);
                $(selWCard.viewCard).addClass(PlayOneCategoryPageController.styleSelWCard);
            }
            else if (PlayOneCategoryPageController.Current.playType === PlayTypeEnum.hint) {
                $(".WCard").removeClass(PlayOneCategoryPageController.styleSelWCard);
                $(selWCard.viewCard).addClass(PlayOneCategoryPageController.styleSelWCard);
                PlayOneCategoryPageController.Current.PlayAudio(selWCard);
            }
        });
        $(restWcards[i0]).on(GlobalVariables.onDoubleClick, { thisWCard: restWcards[i0] }, function (ev) {
            PlayOneCategoryPageController.scope.$apply(function () {
                PlayOneCategoryPageController.Current.selWCard = ev.data.thisWCard;
            });
            var selWCard = PlayOneCategoryPageController.Current.selWCard;
            CardsHelper.ShowHLinkAndDesDialog(selWCard, PlayOneCategoryPageController.Current.dlDblClickWCard);
        });
        if (!restWcards[i0].cardInfo.IsXPosFixed || !restWcards[i0].cardInfo.IsYPosFixed)
            $(restWcards[i0].viewCard).draggable();
        if (!restWcards[i0].cardInfo.IsSizeFixed)
            $(restWcards[i0].viewCard).resizable();
        $(restWcards[i0].viewCard).on("resize", function (ev, ui) {
            ev.stopPropagation();
            var thisWCard = WCard.FindWCardFromViewCard(this);
            thisWCard.viewSize = [ui.size.width, ui.size.height];
        });
        restWcards[i0].viewCard.style.msTouchAction = "manipulation";
        restWcards[i0].viewCard.style.touchAction = "manipulation";
    }
    while (ith < PlayOneCategoryPageController.numWCardShown && restWcards.length > 0) {
        $(restWcards[0].viewCard).appendTo(".cvMain");
        showedWcards.push(restWcards[0]);
        restWcards.splice(0, 1);
        ith++;
    }
    PlayOneCategoryPageController.scope.$apply(function () {
        PlayOneCategoryPageController.Current.numRestWCards;
    });
    var newRate = 1;
    newRate = Math.min($(window).height() / ($(document).height() * 1), $(window).width() / ($(document).width() * 1));
    CardsHelper.RearrangeCards(showedWcards, PlayOneCategoryPageController.oneOverNWindow, false, true, newRate, false);
    CardsHelper.RearrangeCards(restWcards, PlayOneCategoryPageController.oneOverNWindow, false, true, newRate, false);
    if (PlayOneCategoryPageController.Current.isBGAlsoChange) {
        var bGObj = PlayOneCategoryPageController.Current.imgBackground;
        $(bGObj).css({
            'width': Math.round(bGObj.clientWidth * newRate) + "px",
            'height': Math.round(bGObj.clientHeight * newRate) + "px"
        });
    }
}
function barProgress_onDragStart(ev) {
}
function barProgress_onDrag(ev) {
    var bar = PlayOneCategoryPageController.Current.barProgress;
    var clientY = getClientY(ev);
    if (clientY > 100) {
        updateLayout(clientY);
    }
}
function barProgress_onDragEnd(ev) {
}
function getClientY(ev) {
    var isTouch = ev.originalEvent["changedTouches"] != undefined;
    var evBuf = (isTouch) ? ev.originalEvent["changedTouches"][0] : ev;
    return evBuf.clientY;
}
function posInfo(ev) {
    var isTouch = ev.originalEvent["changedTouches"] != undefined;
    var evBuf = (isTouch) ? ev.originalEvent["changedTouches"][0] : ev;
    return (isTouch) ? "Touch " : "Mouse " +
        "cx::" + evBuf.clientX + ":" + evBuf.clientY + "," +
        "ox::" + evBuf.offsetX + ":" + evBuf.offsetY + "," +
        "px::" + evBuf.pageX + ":" + evBuf.pageY + "," +
        "sx::" + evBuf.screenX + ":" + evBuf.screenY;
}
function updateLayout(clientY) {
    var bar = PlayOneCategoryPageController.Current.barProgress;
    var cvMain = PlayOneCategoryPageController.Current.cvMain;
    var topBar = PlayOneCategoryPageController.Current.topNavbar;
    var bottomBar = PlayOneCategoryPageController.Current.bottomNavbar;
    var tbSyn = PlayOneCategoryPageController.Current.tbSyn;
    var tbHint = PlayOneCategoryPageController.Current.tbHint;
    var tbKeyIn = PlayOneCategoryPageController.Current.tbKeyIn;
    var dHeight = $(window).innerHeight();
    var bHeight = $(bar).height();
    if (clientY == undefined) {
        clientY = dHeight - bHeight - $(bottomBar).height();
    }
    else
        $(bar).css({ bottom: dHeight - clientY - bHeight });
    $(cvMain).css("height", clientY - $(topBar).height());
    var tbHeight = dHeight - clientY - bHeight;
    $(bottomBar).height(tbHeight);
    $(tbSyn).height(tbHeight);
    $(tbHint).height(tbHeight);
    $(tbKeyIn).height(tbHeight);
}
var myVersion = (function () {
    function myVersion() {
        this.version = GlobalVariables.version;
    }
    return myVersion;
}());
var VersionHelper = (function () {
    function VersionHelper() {
    }
    VersionHelper.ReloadIfNeeded = function () {
        MyFileHelper.FeedTextFromTxtFileToACallBack(GlobalVariables.versionFile + "?nocache=" + Date.now(), null, function (stJSON, buf) {
            try {
                var jObj = JSON.parse(stJSON);
            }
            catch (exc) {
                console.log("VersionHelper:JSON.parse error:" + exc.message);
                return;
            }
            if (GlobalVariables.isLog)
                console.log("old one:" + GlobalVariables.version + "  ,new one:" + jObj.version);
            if (jObj.version && jObj.version != GlobalVariables.version) {
                location.reload(true);
            }
        });
        return;
    };
    ;
    return VersionHelper;
}());
var ChooseAContainerPageController = (function () {
    function ChooseAContainerPageController($scope, $routeParams) {
        this.containers = GlobalVariables.containers;
        this.CCFromIDB = {};
        this.restTimesForContainer = [];
        this.restTimesForCategory = [];
        this.onContainerClick = function (ev, id) {
            if ($("#divCategory").height() === 0)
                ChooseAContainerPageController.Current.onHowToShowWholeCC_Click(null, 1);
            $(".MyContainer.ImgOK").removeClass('Show');
            $(".MyContainer.Main").removeClass('Empty');
            ChooseAContainerPageController.Current.selContainerID = id;
            var prevContainer = ChooseAContainerPageController.Current.prevContainer;
            if (prevContainer && prevContainer.idTrigger != "") {
                $(document).off(prevContainer.idTrigger);
            }
            var thisContainer = ChooseAContainerPageController.Current.containers[ChooseAContainerPageController.Current.selContainerID];
            if (thisContainer.idTrigger === "") {
                ChooseAContainerPageController.Current.isShownCategories = true;
                ChooseAContainerPageController.Current.categories = thisContainer.categories;
                ChooseAContainerPageController.Current.selCategory = null;
            }
            else {
                ChooseAContainerPageController.Current.isShownCategories = false;
                $(document).one(thisContainer.idTrigger, function (ev) {
                    thisContainer.idTrigger = "";
                    ChooseAContainerPageController.scope.$apply(function () {
                        ChooseAContainerPageController.Current.isShownCategories = true;
                        ChooseAContainerPageController.Current.categories = thisContainer.categories;
                        ChooseAContainerPageController.Current.selCategory = null;
                    });
                });
            }
            ChooseAContainerPageController.Current.prevContainer = thisContainer;
            if (ev) {
                $(ev.target).addClass('Show');
                $((ev.target).parentElement).addClass('Empty');
            }
            ChooseAContainerPageController.Current.callbackRestTimesForCategory();
        };
        VersionHelper.ReloadIfNeeded();
        ChooseAContainerPageController.Current = this;
        ChooseAContainerPageController.scope = $scope;
        var renewPageTexts = function () {
            ChooseAContainerPageController.scope.$apply(function () {
                ChooseAContainerPageController.Current.thisPageTexts = null;
            });
            $(document).off(GlobalVariables.PageTextChangeKey, renewPageTexts);
        };
        $(document).off(GlobalVariables.PageTextChangeKey, renewPageTexts);
        $(document).on(GlobalVariables.PageTextChangeKey, renewPageTexts);
        if (GlobalVariables.isLog) {
            console.log("ChooseAContainerPageController in");
            console.log(location.origin);
        }
        IndexedDBHelper.GetWholeCCFromIDBAsync(this.CCFromIDB, this.callbackShowNextTimeForContainer);
    }
    Object.defineProperty(ChooseAContainerPageController.prototype, "selContainerID", {
        get: function () {
            return this._selContainerID;
        },
        set: function (value) {
            this._selContainerID = value;
            this.selContainer = this.containers[value];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChooseAContainerPageController.prototype, "thisPageTexts", {
        get: function () {
            if (!GlobalVariables.PageTexts)
                GlobalVariables.PageTexts = PageTextHelper.defaultPageTexts;
            return GlobalVariables.PageTexts.ChooseAContainerPageJSON;
        },
        set: function (value) {
        },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    Object.defineProperty(ChooseAContainerPageController.prototype, "LangsInString", {
        get: function () {
            return GlobalVariables.LangsInStrings;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChooseAContainerPageController.prototype, "SelPageTextLang", {
        get: function () {
            return GlobalVariables.SelPageTextLang;
        },
        set: function (value) {
            GlobalVariables.SelPageTextLang = value;
            PageTextHelper.InitPageTexts(function () {
                ChooseAContainerPageController.scope.$apply(function () {
                    ChooseAContainerPageController.Current.thisPageTexts = null;
                });
            });
        },
        enumerable: true,
        configurable: true
    });
    ChooseAContainerPageController.prototype.onHowToShowWholeCC_Click = function (ev, value) {
        var bothDivJQuery = $("#divContainer, #divCategory");
        if (value > 0) {
            var divCategoryHeight = $("#divCategory").height();
            bothDivJQuery.removeClass("WholeContainer WholeCategory Half");
            if (divCategoryHeight <= 0)
                bothDivJQuery.addClass("Half");
            else
                bothDivJQuery.addClass("WholeCategory");
        }
        else if (value < 0) {
            var divContainerHeight = $("#divContainer").height();
            bothDivJQuery.removeClass("WholeContainer WholeCategory Half");
            if (divContainerHeight <= 0)
                bothDivJQuery.addClass("Half");
            else
                bothDivJQuery.addClass("WholeContainer");
        }
    };
    ;
    ChooseAContainerPageController.prototype.onCategoryClick = function (ev, id) {
        $(".MyCategory.ImgOK").removeClass("Show");
        ChooseAContainerPageController.Current.selCategory = ChooseAContainerPageController.Current.categories[id];
        $(ev.target).addClass('Show');
    };
    ChooseAContainerPageController.prototype.onCopyCont2Clipboard = function () {
        var jInput = $("#bufForContainer");
        var inputValue = this.selContainer.itsLocation;
        if (/^http/.test(inputValue) === false) {
            inputValue = location.origin + inputValue;
        }
        jInput.val(inputValue);
        jInput.select();
        document.execCommand('copy');
        jInput.animate({ opacity: 1 }, 1000, function () {
            jInput.val("");
            jInput.css("opacity", 0);
        });
    };
    ChooseAContainerPageController.prototype.onCopyCat2Clipboard = function () {
        var jInput = $("#bufForCategory");
        var contLoc = this.selContainer.itsLocation;
        if (/^http/.test(contLoc) === false) {
            contLoc = location.origin + contLoc;
        }
        var inputValue = contLoc + "/" + this.selCategory.Folder;
        jInput.val(inputValue);
        jInput.select();
        document.execCommand('copy');
        jInput.animate({ opacity: 1 }, 1000, function () {
            jInput.val("");
            jInput.css("opacity", 0);
        });
    };
    ChooseAContainerPageController.prototype.callbackShowNextTimeForContainer = function () {
        var CCFromIDB = ChooseAContainerPageController.Current.CCFromIDB;
        var containers = ChooseAContainerPageController.Current.containers;
        for (var key0 in CCFromIDB) {
            var lastNTime = CCFromIDB[key0].lastNextTime;
            var restDays = Math.round((lastNTime - Date.now()) / 8640000) / 10;
            for (var i0 = 0; i0 < containers.length; i0++) {
                if (containers[i0].itsLocation === key0) {
                    ChooseAContainerPageController.scope.$apply(function () {
                        ChooseAContainerPageController.Current.restTimesForContainer[i0] = restDays;
                    });
                    break;
                }
            }
        }
    };
    ChooseAContainerPageController.prototype.callbackRestTimesForCategory = function () {
        ChooseAContainerPageController.Current.restTimesForCategory = [];
        var container = ChooseAContainerPageController.Current.CCFromIDB[ChooseAContainerPageController.Current.containers[ChooseAContainerPageController.Current.selContainerID].itsLocation];
        if (!container)
            return;
        var categoriesFromIDB = container.Categories;
        var categories = ChooseAContainerPageController.Current.categories;
        for (var key in categoriesFromIDB) {
            var restTime = Math.round((categoriesFromIDB[key].nextTime - Date.now()) / 8640000) / 10;
            for (var i0 = 0; i0 < categories.length; i0++) {
                if (key === categories[i0].Folder) {
                    ChooseAContainerPageController.Current.restTimesForCategory[i0] = restTime;
                    break;
                }
            }
        }
    };
    return ChooseAContainerPageController;
}());
var AContainer = (function () {
    function AContainer(pos) {
        this.idTrigger = "";
        this.itsLocation = pos;
        this.showedName = pos.substr(pos.lastIndexOf('/') + 1);
        this.idTrigger = Date.now().toString();
        MyFileHelper.FeedTextFromTxtFileToACallBack(pos + "/" + GlobalVariables.containerListFileName, this, this.UpdateCategories);
    }
    AContainer.prototype.UpdateCategories = function (jsonTxt, aContainer) {
        if (GlobalVariables.isLog) {
            console.log("AContainer: " + jsonTxt);
        }
        var obj = JSON.parse(jsonTxt);
        aContainer.categories = [];
        for (var i0 = 0; i0 < obj.Categories.length; i0++) {
            aContainer.categories.push(obj.Categories[i0]);
        }
        $(document).trigger(aContainer.idTrigger);
        aContainer.idTrigger = "";
    };
    ;
    return AContainer;
}());
var SpeechTestPageController = (function () {
    function SpeechTestPageController($scope, $routeParams) {
        this.rate2PowN = 0;
        this.sentence = "This is a test.";
        this.RecogMetaData = { confidence: 0, isSpeechRecognitionRunning: false, recInputSentence: "" };
        this.isUseSentenceForRecog = true;
        SpeechTestPageController.Current = this;
        SpeechTestPageController.scope = $scope;
        $scope["Math"] = window["Math"];
        if (GlobalVariables.synthesis)
            SpeechSynthesisHelper.getAllVoices(function () {
                SpeechTestPageController.scope.$apply(function () {
                    SpeechTestPageController.Current.allSynVoices = GlobalVariables.allVoices;
                    var voice;
                    if (GlobalVariables.allVoices && GlobalVariables.allVoices.length > 0)
                        voice = SpeechSynthesisHelper.getSynVoiceFromLang('en-US');
                    if (voice)
                        SpeechTestPageController.Current.currentSynVoice = voice;
                });
            });
        var renewPageTexts = function () {
            SpeechTestPageController.scope.$apply(function () {
                SpeechTestPageController.Current.thisPageTexts = null;
            });
            $(document).off(GlobalVariables.PageTextChangeKey, renewPageTexts);
        };
        $(document).off(GlobalVariables.PageTextChangeKey, renewPageTexts);
        $(document).on(GlobalVariables.PageTextChangeKey, renewPageTexts);
        SpeechRecognizerHelper.iniSpeechRecognition();
    }
    Object.defineProperty(SpeechTestPageController.prototype, "thisPageTexts", {
        get: function () {
            if (!GlobalVariables.PageTexts)
                GlobalVariables.PageTexts = PageTextHelper.defaultPageTexts;
            return GlobalVariables.PageTexts.SpeechTestPageJSON;
        },
        set: function (value) {
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpeechTestPageController.prototype, "isHavingSpeechRecognier", {
        get: function () {
            return GlobalVariables.isHavingSpeechRecognier;
        },
        enumerable: true,
        configurable: true
    });
    SpeechTestPageController.prototype.onSynPlay_Click = function () {
        if (GlobalVariables.synthesis && GlobalVariables.synUtterance) {
            if (!SpeechTestPageController.Current.sentence || SpeechTestPageController.Current.sentence.length === 0) {
                GlobalVariables.alert('Input something at first.');
                return;
            }
            if (GlobalVariables.synthesis.paused)
                GlobalVariables.synthesis.resume();
            SpeechSynthesisHelper.Speak(SpeechTestPageController.Current.sentence, SpeechTestPageController.Current.currentSynVoice.lang, SpeechTestPageController.Current.currentSynVoice, Math.pow(2, SpeechTestPageController.Current.rate2PowN));
        }
    };
    SpeechTestPageController.prototype.onRecog_Click = function () {
        var arrayForRecog = (SpeechTestPageController.Current.isUseSentenceForRecog) ? [SpeechTestPageController.Current.sentence] : [];
        SpeechRecognizerHelper.StartSpeechRecognition(SpeechTestPageController.Current.RecogMetaData, arrayForRecog, arrayForRecog, SpeechTestPageController.Current.currentSynVoice.lang, SpeechTestPageController.scope);
    };
    return SpeechTestPageController;
}());
var app = angular.module('MYCWeb', ['ngRoute', 'ngAnimate']);
app.controller('PlayOneCategoryPageController', ['$scope', '$routeParams', PlayOneCategoryPageController]);
app.controller('ChooseAContainerPageController', ['$scope', '$routeParams', ChooseAContainerPageController]);
app.controller('SpeechTestPageController', ['$scope', '$routeParams', SpeechTestPageController]);
app.config(function ($routeProvider, $locationProvider) {
    if (typeof (Storage) !== "undefined" && localStorage[GlobalVariables.IsShownTutorKey] === undefined) {
        localStorage[GlobalVariables.IsShownTutorKey] = GlobalVariables.isTutorMode;
    }
    IndexedDBHelper.OpenADBAsync();
    GlobalVariables.LangsInStrings = PageTextHelper.InitLangsInStrings();
    GlobalVariables.SelPageTextLang = PageTextHelper.GetPageTextLang(navigator.language, GlobalVariables.LangsInStrings);
    PageTextHelper.InitPageTexts(function () { $(document).trigger(GlobalVariables.PageTextChangeKey); });
    SpeechSynthesisHelper.getAllVoices(function () { });
    GlobalVariables.gdTutorElements = {
        gdMain: document.getElementById("gdTutorial"),
        gdBoard: $("#gdTutorial #gdBoard").get(0),
        gdContent: $("#gdTutorial #gdContent").get(0),
        btHide: $("#gdTutorial #btHide").get(0),
        btStop: $("#gdTutorial #btStop").get(0)
    };
    $routeProvider
        .when('/Play', {
        templateUrl: GlobalVariables.playOneCategoryHtml,
        controller: 'PlayOneCategoryPageController',
        controllerAs: 'ctrl'
    })
        .when('/', {
        templateUrl: GlobalVariables.chooseAContainerHtml,
        controller: 'ChooseAContainerPageController',
        controllerAs: 'ctrl'
    })
        .when('/SpeechTest', {
        templateUrl: GlobalVariables.speechTestHtml,
        controller: 'SpeechTestPageController',
        controllerAs: 'ctrl'
    })
        .when('/20180211', {
        redirectTo: function () { return "/Play?Container=" + encodeURI('/Samples/MYContainer') + "&CFolder=" + encodeURI('Animals'); }
    });
});
var MathHelper = (function () {
    function MathHelper() {
    }
    MathHelper.MyRandomN = function (iStart, iEnd) {
        var ith;
        ith = Math.floor((iEnd - iStart + 1 - 1e-10) * Math.random() + iStart);
        return ith;
    };
    MathHelper.FindIndex = function (theArray, element) {
        if (!theArray || !element)
            return -1;
        for (var i0 = 0; i0 < theArray.length; i0++) {
            if (angular.equals(theArray[i0], element))
                return i0;
        }
        return -1;
    };
    return MathHelper;
}());
MathHelper.Permute = function (oldSet) {
    var newSet = new Array();
    while (oldSet.length > 0) {
        var i0 = MathHelper.MyRandomN(0, oldSet.length - 1);
        newSet.push(oldSet[i0]);
        oldSet.splice(i0, 1);
    }
    for (var i0 = 0; i0 < newSet.length; i0++) {
        oldSet.push(newSet[i0]);
    }
    return newSet;
};
var CardsHelper = (function () {
    function CardsHelper() {
    }
    CardsHelper.RearrangeCards = function (wcards, nCol, isRandom, isOptimizeSize, expandRatio, justFixed) {
        if (nCol === void 0) { nCol = 5; }
        if (isRandom === void 0) { isRandom = false; }
        if (isOptimizeSize === void 0) { isOptimizeSize = true; }
        if (expandRatio === void 0) { expandRatio = 1; }
        if (justFixed === void 0) { justFixed = false; }
        if (!wcards || wcards.length === 0) {
            return;
        }
        var isShownAsList = PlayOneCategoryPageController.Current.IsShownAsList;
        var topOfTop = 50;
        var wWidth = window.innerWidth;
        var wHeight = window.innerHeight - topOfTop;
        var currentPosition = [wWidth * 0.04, 0];
        if (isRandom) {
            MathHelper.Permute(wcards);
        }
        var maxWidth = 0;
        for (var i1 = 0; i1 < wcards.length; i1++) {
            var card = wcards[i1];
            if (isShownAsList === true && $(card.cCards[card.boxIndex]).text() != "") {
                var fSize = +$(card.cCards[card.boxIndex]).css("font-size").replace("px", "");
                $(card.cCards[card.boxIndex]).css("font-size", Math.ceil(fSize * expandRatio));
            }
            if (!card.cardInfo.IsSizeFixed && !justFixed) {
                var size = [wWidth / nCol, wHeight / nCol];
                if (!card.viewWHRatio) {
                    card.viewWHRatio = new Array();
                }
                if (card.cCards !== undefined && card.cCards[card.boxIndex] !== undefined && isNaN(card.viewWHRatio[card.boxIndex])) {
                    var nWidth = card.cCards[card.boxIndex]["naturalWidth"];
                    var nHeight = card.cCards[card.boxIndex]["naturalHeight"];
                    if (nWidth !== undefined && nWidth > 0 && nHeight > 0) {
                        card.viewWHRatio[card.boxIndex] = nWidth / nHeight;
                    }
                }
                if (card.viewWHRatio && !isNaN(card.viewWHRatio[card.boxIndex])) {
                    size[1] = size[0] / card.viewWHRatio[card.boxIndex];
                }
                else if (isShownAsList && $(card.cCards[card.boxIndex]).text() !== "") {
                    size[0] = wWidth * 0.92;
                }
                if (isOptimizeSize) {
                    card.viewSize = size;
                }
                if (isShownAsList && $(card.cCards[card.boxIndex]).text() !== "") {
                    card.viewSize = [size[0], 0];
                    if (card.cCards[card.boxIndex].scrollHeight > 0) {
                        size[1] = card.cCards[card.boxIndex].scrollHeight + 4;
                        card.viewSize = size;
                    }
                }
            }
            else if (card.cardInfo.IsSizeFixed) {
                for (var i0 = 0; i0 < card.viewSize.length; i0++) {
                    card.viewSize[i0] *= expandRatio;
                }
                card.viewSize = card.viewSize;
            }
            if ((!card.cardInfo.IsXPosFixed || !card.cardInfo.IsYPosFixed) && !justFixed) {
                if (isShownAsList === true) {
                    ;
                }
                else {
                    var predictTop = currentPosition[1] + card.viewSize[1] + topOfTop;
                    if (predictTop > wHeight) {
                        currentPosition = [currentPosition[0] + maxWidth + 20, 0];
                        maxWidth = card.viewSize[0];
                    }
                    else {
                        maxWidth = Math.max(maxWidth, card.viewSize[0]);
                    }
                }
                card.viewPosition = currentPosition;
                currentPosition[1] += card.viewSize[1] + 20;
            }
            else if (card.cardInfo.IsXPosFixed && card.cardInfo.IsYPosFixed) {
                for (var i0 = 0; i0 < card.viewPosition.length; i0++) {
                    card.viewPosition[i0] *= expandRatio;
                }
                card.viewPosition = card.viewPosition;
            }
        }
        PlayOneCategoryPageController.Current.defaultCardHeight = wcards[0].viewCard.clientHeight;
        PlayOneCategoryPageController.Current.defaultCardWidth = wcards[0].viewCard.clientWidth;
    };
    CardsHelper.GetTreatablePath = function (cardPath, mainFolder, categoryFolder) {
        if (mainFolder === void 0) { mainFolder = ""; }
        if (categoryFolder === void 0) { categoryFolder = ""; }
        var newPath;
        var hasProtocol = true;
        if (!cardPath)
            return cardPath;
        if (cardPath.toLowerCase().indexOf("http://") === 0 || cardPath.toLowerCase().indexOf("https://") === 0)
            newPath = cardPath;
        else if (cardPath.toLowerCase().indexOf("file://") === 0)
            newPath = cardPath;
        else if (cardPath.charAt(0) === '/' || cardPath.charAt(0) === '\\') {
            newPath = mainFolder + cardPath.replace('\\', '/');
            hasProtocol = false;
        }
        else {
            newPath = mainFolder + "/" + categoryFolder + "/" + cardPath.replace('\\', '/');
            hasProtocol = false;
        }
        if (!hasProtocol && GlobalVariables.isHostNameShown) {
            newPath = location.origin + newPath;
        }
        return newPath;
    };
    CardsHelper.GetWCardsCallback = function (jObj, cards) {
        if (!jObj)
            return;
        var des = jObj.Cards;
        if (!des)
            return;
        for (var i0 = 0; i0 < des.length; i0++) {
            var eachDescription = des[i0];
            CardsHelper.UpdateEachDescription(des[i0]);
            var card = new WCard(eachDescription, GlobalVariables.currentMainFolder, GlobalVariables.currentCategoryFolder);
            if (card)
                cards.push(card);
        }
    };
    CardsHelper.UpdateEachDescription = function (des) {
        var myDictate;
        if (!des.Dictate && des.FileName) {
            var iSlash = des.FileName.lastIndexOf('/');
            if (iSlash >= 0)
                myDictate = des.FileName.substr(iSlash + 1);
            else
                myDictate = des.FileName;
            var iDot = myDictate.lastIndexOf('.');
            if (iDot > 0)
                des.Dictate = decodeURIComponent(myDictate.substring(0, iDot));
            if (des.Dictate[0].toLowerCase() === 's') {
                if (/^[s,S][0-9]+\./.test(des.Dictate)) {
                    iDot = des.Dictate.indexOf('.');
                    des.Dictate = des.Dictate.substring(iDot + 1).trim();
                }
            }
        }
        if (!des.Ans_KeyIn && des.Dictate) {
            des.Ans_KeyIn = [des.Dictate];
        }
        if (!des.Ans_Recog && des.Dictate) {
            des.Ans_Recog = [des.Dictate];
        }
    };
    CardsHelper.MoveArrayElements = function (from, to, numToMove, isRandomly, myAppendTo) {
        if (isRandomly === void 0) { isRandomly = false; }
        if (myAppendTo === void 0) { myAppendTo = null; }
        var i0 = 0;
        while (i0 < numToMove && from.length > 0) {
            i0++;
            var ith = (isRandomly) ?
                MathHelper.MyRandomN(0, from.length - 1) :
                0;
            to.push(from[ith]);
            if (myAppendTo) {
                var shWCard = from[ith];
                if (shWCard)
                    $(shWCard.viewCard).appendTo(myAppendTo);
            }
            else {
                var wcard = from[ith];
                if (wcard && wcard.viewCard.parentNode) {
                    wcard.viewCard.parentNode.removeChild(wcard.viewCard);
                }
            }
            from.splice(ith, 1);
        }
    };
    CardsHelper.ShowHLinkAndDesDialog = function (wcard, diEle) {
        var btns = new Array();
        var isLinking = false;
        var isDescripted = false;
        var isRecMode = (PlayOneCategoryPageController.Current.playType === PlayTypeEnum.rec);
        var inStr1, inStr2;
        if (wcard.cardInfo.Link) {
            inStr1 = wcard.cardInfo.Link;
            isLinking = true;
        }
        else if (wcard.cardsHyperLink && wcard.boxIndex >= 0 && wcard.cardsHyperLink[wcard.boxIndex]) {
            inStr1 = wcard.cardsHyperLink[wcard.boxIndex];
            isLinking = true;
        }
        else
            isLinking = false;
        if (isLinking) {
            btns.push({
                text: PlayOneCategoryPageController.Current.thisPageTexts.stLink,
                icons: { primary: "ui-icon-link" },
                click: function () {
                    window.open(inStr1);
                    $(diEle).dialog('close');
                }
            });
        }
        if (wcard.cardInfo.Description) {
            inStr2 = wcard.cardInfo.Description;
            isDescripted = true;
        }
        else if (wcard.cardsDescription && wcard.boxIndex >= 0 && wcard.cardsDescription[wcard.boxIndex]) {
            inStr2 = wcard.cardsDescription[wcard.boxIndex];
            isDescripted = true;
        }
        else
            isDescripted = false;
        if (isRecMode) {
            btns.push({
                text: PlayOneCategoryPageController.Current.thisPageTexts.stAns,
                icons: { primary: "ui-icon-comment" },
                click: function () {
                    var answers = "\"" + wcard.cardInfo.Ans_KeyIn[0] + "\"";
                    for (var i0 = 1; i0 < wcard.cardInfo.Ans_KeyIn.length; i0++) {
                        answers += "\n" + "\"" + wcard.cardInfo.Ans_KeyIn[i0] + "\"";
                    }
                    PlayOneCategoryPageController.scope.$apply(function () {
                        PlayOneCategoryPageController.Current.totalScore -= 15;
                    });
                    GlobalVariables.alert(PlayOneCategoryPageController.Current.thisPageTexts.stShowAns.replace('{0}', answers));
                    $(diEle).dialog('close');
                }
            });
        }
        if (isLinking || isDescripted || isRecMode) {
            $(diEle).dialog({
                buttons: btns
            });
            if (isDescripted)
                $(diEle).html("Description:<br/>" + inStr2);
            else
                $(diEle).html("No Description but it has a link.");
            $(diEle).dialog('open');
        }
    };
    CardsHelper.CorrectBackgroundStyle = function (myStyle, stContainer, stCFolder) {
        var bgImgStyle = myStyle["background-image"];
        if (bgImgStyle && bgImgStyle.indexOf("url(") < 0) {
            var newBgImgStyle = "url('" + CardsHelper.GetTreatablePath(bgImgStyle, stContainer, stCFolder) + "')";
            myStyle["background-image"] = newBgImgStyle;
        }
        return myStyle;
    };
    return CardsHelper;
}());
//# sourceMappingURL=MYCWeb.js.map