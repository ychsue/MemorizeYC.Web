/// <reference path="eachrecord.ts" />
interface CCFromIDB {
    [ContainerLocation: string]: ContainerFromIDB;
}

interface ContainerFromIDB {
    Categories: { [CategoryFolder: string]: CategoryInfoFromIDB };
    lastNextTime: number;
}

interface CategoryInfoFromIDB {
    history: Array<LVsTime>;
    nextTime: number;
}