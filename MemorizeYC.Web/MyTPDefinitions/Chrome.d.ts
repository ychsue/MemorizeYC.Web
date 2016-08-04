interface SpeechSynthesisUtterance_Static {
    new (st: string): SpeechSynthesisUtterance_Instance;
}
interface SpeechSynthesisUtterance_Instance {
    lang: string;
    pitch: number;
    rate: number;
    text: string;
    voice: SpeechSynthesisVoice_Instance;
    volume: number;
}
declare let SpeechSynthesisUtterance: SpeechSynthesisUtterance_Static;

interface SpeechSynthesis_Instance {
    getVoices(): Array<SpeechSynthesisVoice_Instance>;
    speak(utter: SpeechSynthesisUtterance_Instance): void;
    cancel(): void;
    pause(): void;
    resume(): void;
    paused: boolean;
}

interface SpeechSynthesisVoice_Instance {
    default: boolean;
    lang: string;
    localService: boolean;
    name: string;
    voiceURI: string;
}

//#region SpeechRecognition

/**
  * Gotten from https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html
 **/
interface SpeechRecognition extends EventTarget {
    // recognintion parameters
    grammars: SpeechGrammarList;
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    maxAlternatives: number;
    serviceURI: string;
    // methods
    start(): void;
    stop(): void;
    abort(): void;
    // events
    onstart();
    onresult(ev: Event);
    onerror(ev: Event);
    onend();
    onspeechstart(ev: Event);
    onspeechend(ev: Event);
    onnomatch(ev: Event);
}

interface SpeechRecognitionEvent extends Event {
    resultIndex: number;
    results: SpeechRecognitionResultList;
    interpretation: any;
    emma: Document;
}

interface SpeechRecognitionResultList extends Array<SpeechRecognitionResult>{
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

interface SpeechRecognitionResult extends Array<SpeechRecognitionAlternative > {
    isFinal: boolean;
}

interface SpeechRecognitionError extends Event {
    error: ErrorCodeForSpeechRecognition;
    message: string;
}
declare enum ErrorCodeForSpeechRecognition {
    "no-speech",
    "aborted",
    "audio-capture",
    "network",
    "not-allowed",
    "service-not-allowed",
    "bad-grammar",
    "language-not-supported"
}

interface SpeechGrammarList {
    length: number;
    addFromString(string:string,weight?:number): void;
}
//#endregion SpeechRecognition
