interface EachDescription {
    FileName: string;
    Dictate?: string;
    Ans_KeyIn?: Array<string>;
    Ans_Recog?: Array<string>;
    Description?: string;
    Link?: string;
    Position?: number[];
    Size?: number[];
    IsSizeFixed?: boolean;
    IsXPosFixed?: boolean;
    IsYPosFixed?: boolean;
    IsHideShadow?: boolean;
    IsUsingAudioFileForDictating?: boolean;
    AudioFilePathOrUri?: string;
}