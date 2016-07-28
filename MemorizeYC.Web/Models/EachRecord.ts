/// <reference path="../mytpdefinitions/chrome.d.ts" />
interface EachRecord {
    UCC?: string;    //JSON.stringify(value:UCC)
    SynLang: string; //"en-US"
    RecLang: string;
    history: string; //JSON.stringify(value:Array<LVsTime>)
    nextTime: number; //Get its time by Date(nextTime).
}

interface LVsTime {
    score: number;    //Score
    slv: number;    //Stage Level for forgotten curve
    ts: number;     //TimeStamp. Use Date(timeStamp) to get its time
}

interface UCC {
    user: string;
    Container: string;
    Category: string;
 }