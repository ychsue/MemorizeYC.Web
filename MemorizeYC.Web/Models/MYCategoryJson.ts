/// <reference path="eachdescription.ts" />
/// <reference path="backgroundobj.ts" />
interface MYCategoryJson {
    Cards: Array<EachDescription>;
    Background?: BackgroundObj;

    //* [2016-06-17 16:50] Settings in the dropdown
    numWCardShown?: number;
    isPickWCardsRandomly?: boolean;
    isBGAlsoChange?: boolean;
    isAudioInterruptable?: boolean;
    Link?: string;

    //* [2016-06-29 14:40] Added for Speech
    SynLang?: string;
    //* [2016-11-16 10:39] Added for list view of cards
    IsShownAsList?: boolean;
    IsDictateTextContentInHint?: boolean;
    IsDictateAnsInHint?: boolean;
}