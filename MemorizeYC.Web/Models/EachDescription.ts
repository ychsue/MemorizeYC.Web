interface EachDescription {
    FileName: string;
    Dictate?: string;
    Description?: string;
    Position?: number[];
    Size?: number[];
    IsXPosSet?: boolean;
    IsYPosSet?: boolean;
    IsUsingAudioFileForDictating?: boolean;
    AudioFilePathOrUri?: string;
}