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
