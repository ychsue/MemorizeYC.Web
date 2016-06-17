﻿/// <reference path="eachdescription.ts" />
/// <reference path="backgroundobj.ts" />
interface MYCategoryJson {
    Cards: Array<EachDescription>;
    Background?: BackgroundObj;

    //* [2016-06-17 16:50] Settings in the dropdown
    numWCardShown?: number;
    isPickWCardsRandomly?: boolean;
    isBGAlsoChange?: boolean;
    Link?: string;
}