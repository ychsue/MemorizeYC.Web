/// <reference path="../globalvariables/globalvariables.ts" />
//#region PageTextsInterface
interface PageTextsInterface {
    PlayOneCategoryPageJSON: PlayOneCategoryPageJSON;
    ChooseAContainerPageJSON: ChooseAContainerPageJSON;
    SpeechTestPageJSON: SpeechTestPageJSON;
}

interface SpeechTestPageJSON {
    stSyn: string;
    stRecg: string;
    stLang: string;
    stRate: string;
    stIsUseSentence: string;
}

interface PlayOneCategoryPageJSON {
    stShowAsList:    string;
    stHintModeOption: string;
    stDictateAnswer: string;
    stDictateContent: string;
    stAnswerFirst:   string;
    stRepairSyn: string;

    stBack: string;
    stShowScore: string;
    stNewUpToOne: string;
    stNewBackTo0: string;
    stIncLVNotYet: string;
    stIncLV: string;
    stKeepLV: string;
    stBackTo0: string;
    stNoteForKeyIn: string;
    stHandWriting: string;

    stClickPlayAtFirst: string;

    stAns: string;
    stLink: string;
    stShowAns: string;

    stMarkForSpeech: string;
    stHideTbSyn: string;

    stHighestScore: string;

    stWaitUtterDone: string;
    stSynVoice: string;
    stContributor: string;
    stRest: string;
    stNumWCardShown: string;
    stckTakeCardRandomly: string;
    stCkResizeBg: string;
    stResize: string;
    stPlayType: string;
    stHint: string;
    stPair: string;
    stKeyIn: string;
    stArrange: string;
    stAudioRate: string;
    stTutor: string;
    stBasic: string;
    stStop: string;
    stHyperLink: string;
    stMyLink: string;
    stTut0_1_1: string;
    stTut0_1_2: string;
    stTut0_1_3: string;
    stTut0To1: string;
    stTut1_1: string;
    stTut1_1_1: string;
    stTut1_1To2: string;
    stTut1_2: string;
    stTut1_2_1: string;
    stTut1_2To3: string;
    stTut1_3: string;
    stTut1_3_0: string;
    stTut1_3_1: string;
    stTut1_3_1_1: string;
    stTut1_3To4: string;
    stTut1_4_Title: string;
    stTut1_4_Content: string;
    stTut1_4_1_Title: string;
    stTut1_4_1_Content: string;
    stTut1_4To5: string;
    stTut1_5_Title: string;
    stTut1_5_Content: string;
    stTut1_5To6: string;
    stTut1_6_Title: string;
    stTut1_6_Content: string;
    stTut1_6To7: string;
    stTut2_0_Title: string;
    stTut2_0_Content: string;
    stTut2_1_Title: string;
    stTut2_1_Content: string;
    stTut2_1To2: string;
    stTut2_2_Title: string;
    stTut2_2_Content: string;
    stTut2_2To3: string;
    stTut3_0_Title:   string;
    stTut3_0_Content: string;
    stTut3_1_Title: string;
    stTut3_1_Content: string;
    stTut3_1_2_Title: string;
    stTut3_1_2_Content: string;
    stTut3_1To2: string;
    stTut_End_Title: string;
    stTut_End_Content: string;
    
    stContentSynVoice: string;
}

interface ChooseAContainerPageJSON {
    stPlay: string;
    stSelContainer: string;
    stSelCategory: string;
    stSelLang: string;
    stSpeechTest: string;
    stUserGuide: string;
}
//#endregion PageTextsInterface
//#region LangInStrings
interface LangInStrings {
    lang: string;
    name: string;
}
//#endregion LangInStrings

class PageTextHelper {

    /**
     * Before initialize it, you need provide it the 'GlobalVariables.SelPageTextLang'.
     * @param callback : The function of callback
     * @param arg : The arguments for this callback
     */
    public static InitPageTexts(callback: Function=null,arg:any=null) {

        MyFileHelper.FeedTextFromTxtFileToACallBack(PageTextHelper.GetLocaleSubFolder(GlobalVariables.SelPageTextLang.lang,GlobalVariables.LangsInStrings), null,
            (stJson: string) => {
                GlobalVariables.PageTexts = JSON.parse(stJson) as PageTextsInterface;
                if (callback)
                    callback(arg);
            });
    };

    /**
     * Because the texts for each page is located in 'rootDir/Strings/LOCALE/Resources.json', this function is used to get its related subfolder
     */
    public static GetLocaleSubFolder(lang:string,allLangs:Array<LangInStrings>): string {
        var bLang: string = PageTextHelper.GetPageTextLang(lang,allLangs).lang;
        var filePath = GlobalVariables.rootDir +'Strings/' + bLang + '/' + GlobalVariables.PageTextsJSONFName;
        return filePath;
    }

    public static InitLangsInStrings(): Array<LangInStrings> {
        var array: Array<LangInStrings>=[];
        array.push({ lang: 'zh-TW', name: '中文' });
        array.push({ lang: 'en-US', name: 'English' });
        return array;
    }

    public static GetPageTextLang(lang: string,allLangs:Array<LangInStrings>): LangInStrings {
        //* [2016-07-11 09:57] For chinese user, let them use zh-TW.
        var bufLang = (lang && lang.match(/^zh/i)) ? 'zh-TW' : lang;
        bufLang = bufLang.replace(/_/g, '-').toLowerCase();
        for (var i0: number = 0; i0 < allLangs.length;i0++) {
            var eachLang = allLangs[i0];
            if (bufLang && bufLang.length > 0 && bufLang.indexOf(eachLang.lang.toLowerCase().replace(/_/g, '-'))>-1)
                return eachLang;
        }
        //* [2016-07-11 10:13] If it cannot find that language, just return 'en-US'
        for (var i0: number = 0; i0 < allLangs.length; i0++) {
            var eachLang = allLangs[i0];
            if (eachLang.lang==='en-US')
                return eachLang;
        }
    }

    public static defaultPageTexts: PageTextsInterface = {
        "PlayOneCategoryPageJSON": {
            "stShowAsList": "條列式顯示",
            "stHintModeOption":"提示模式專屬",
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
            "stKeepLV":"<h3>雖然你有進步，可惜還不夠升級，請 {0} 天後再玩一次。</h3>",
            "stBackTo0":"<h3>很抱歉，你的等級要退回等級0然後明天再玩一次。</h3>",
            "stNoteForKeyIn":"<h4>注意：在<b>鍵入正解</b>模式下，你可以得更高分。</h4>",
            "stHandWriting": "<h4>要否用手寫輸入讓手指也參與記憶？</h4>",

            "stClickPlayAtFirst": "請先按左下角的'播放'({0})再來配對相應的圖卡。",

            "stAns": "看答案(-15)",
            "stLink":"超連結",
            "stShowAns": "允許的答案有：\n{0}",

            "stMarkForSpeech": "反白想要聽的字，再按Play就可以播放了：",
            "stHideTbSyn": "將語音模擬的文字列隱藏。",

            "stHighestScore":"最高分！",

            "stWaitUtterDone":"稍安勿躁，請等我唸完再點選。",
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
}