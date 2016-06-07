interface EachDescription {
    FileName: string;
    Dictate?: string;
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