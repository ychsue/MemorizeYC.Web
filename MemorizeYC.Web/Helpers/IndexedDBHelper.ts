/// <reference path="../models/ccfromidb.ts" />
/// <reference path="../models/eachrecord.ts" />
class IndexedDBHelper {
    public static IDBDBKey = "MYCIDB";
    public static IDBUCCKey = "UserConCategory";
    public static ReadyTriggerKey = "IDBIsReady";
    public static GetIDBRecordKey = "GetIDBRecord";

    public static isReady = false;

    public static myIDB: IDBFactory;
    public static myIDBTransaction: IDBTransaction; 
    public static myIDBKeyRange: IDBKeyRange;
    public static myVersion: number = 1; // This variable is used when data structure is changed.
    public static myDataBase: IDBDatabase;

    public static InitIDB() {
        IndexedDBHelper.myIDB = indexedDB || window["webkitIndexedDB"] || window["mozIndexedDB"];
        IndexedDBHelper.myIDBTransaction = window["IDBTransaction"] || window["webkitIDBTransaction"] || window["msIDBTransaction"];
        IndexedDBHelper.myIDBKeyRange = window["IDBKeyRange"] || window["webkitIDBKeyRange"] || window["msIDBKeyRange"];
    }

    /**
     * Use this method to intialize a database and create an object store inside it.
     * When it is success, it will send out an IndexedDBHelper.ReadyTriggerKey trigger.
     */
    public static OpenADBAsync(onSuccess:EventListener = null) {
        //* [2016-07-18 16:43] Check whether it supports indexedDB
        if (!IndexedDBHelper.myIDB)
            IndexedDBHelper.InitIDB();
        if (!IndexedDBHelper.myIDB) {
            console.log("Does not support IndexedDB");
            return;
        }

        //* [2016-07-18 16:44] 
        var request = IndexedDBHelper.myIDB.open(IndexedDBHelper.IDBDBKey, IndexedDBHelper.myVersion);
        request.onerror = (ev) => {
            console.log("Cannot open DataBase '" + IndexedDBHelper.IDBDBKey + "',   version:" + IndexedDBHelper.myVersion);
        };

        request.addEventListener("success", (ev) => {
            IndexedDBHelper.myDataBase = (<IDBOpenDBRequest>(ev.target)).result as IDBDatabase;
            IndexedDBHelper.isReady = true;
            $(document).trigger(IndexedDBHelper.ReadyTriggerKey);

            if (onSuccess)
                onSuccess(ev);
        });

        request.onupgradeneeded = (ev) => {
            var db = (<IDBOpenDBRequest>ev.target).result as IDBDatabase;
            db.onerror = (ev) => {
                console.log("onupgradeneeded: Cannot open DataBase '" + IndexedDBHelper.IDBDBKey + "',   version:" + IndexedDBHelper.myVersion);
            }
            //#region //*[2016-07-19 11:34] Create an object store for this DataBase and create needed indices
            //* [2016-07-18 21:47] Create an ObjectStore
            var myOS = db.createObjectStore(IndexedDBHelper.IDBUCCKey, { keyPath: "UCC" });
            //* [2016-07-19 11:26] Add index for it
            var bufRecord: EachRecord = { SynLang: null, RecLang: "en-US", history: '[]', nextTime: 0, highestScore:0 };
            for (var key in bufRecord) {
                myOS.createIndex(key, key, { unique: false });
            }
            //#endregion //*[2016-07-19 11:34] Create an object store for this DataBase and create needed indices
        }
    }

    public static DeleteADBAsync( onSuccess:EventListener=null ) {
        //* [2016-07-18 16:43] Check whether it supports indexedDB
        if (!IndexedDBHelper.myIDB)
            IndexedDBHelper.InitIDB();
        if (!IndexedDBHelper.myIDB) {
            console.log("Does not support IndexedDB");
            return;
        }

        var request = IndexedDBHelper.myIDB.deleteDatabase(IndexedDBHelper.IDBDBKey);
        request.addEventListener("success", (ev) => {
            IndexedDBHelper.myDataBase = null;
            if (onSuccess)
                onSuccess(ev);
        });
    }

    /**
     * This method will return value through refRecord; however, you need to provide refRecord an initial value as described in http://stackoverflow.com/questions/518000/is-javascript-a-pass-by-reference-or-pass-by-value-language
     * @param refRecord Type: EachRecord, Remember that, you need to provide it an initial value
     * @param onSuccess Type: EventListener.
     */
    public static GetARecordAsync(refRecord: EachRecord, onSuccess: EventListener = null) {
        var uccObj: UCC = { user: GlobalVariables.currentUser, Container: GlobalVariables.currentMainFolder, Category: GlobalVariables.currentCategoryFolder };
        var ucc: string = JSON.stringify(uccObj);
        var getRecord = () => {
            var transaction = IndexedDBHelper.myDataBase.transaction([IndexedDBHelper.IDBUCCKey], "readonly");
            var request = transaction
                .objectStore(IndexedDBHelper.IDBUCCKey)
                .get(ucc);
            request.addEventListener("success", (ev) => {
                if (request.result!=undefined) {
                    for (var key in refRecord) {
                        refRecord[key] = request.result[key];
                    }
                } else {
                    console.log("success:: Cannot get this Record");
                    refRecord.UCC = ucc;
                }

                if (onSuccess)
                    onSuccess(ev);
            });
            request.addEventListener("error", (ev) => {
                console.log("Cannot get this Record");
                refRecord.UCC = ucc;
            });

            transaction.addEventListener("complete", (ev) => {
                $(document).trigger(IndexedDBHelper.GetIDBRecordKey);
            });
        };

        if (IndexedDBHelper.myDataBase)
            getRecord();
        else
            IndexedDBHelper.OpenADBAsync(getRecord);
    }

    public static PutARecordAsync(record: EachRecord, isAdd: boolean, onSuccess: EventListener = null) {
        var putRecord = () => {
            var transaction = IndexedDBHelper.myDataBase.transaction([IndexedDBHelper.IDBUCCKey], 'readwrite');
            transaction.oncomplete = (ev) => {
            //****************** Not Yet!
            }
            var request: IDBRequest;
            if(isAdd)
                request = transaction.objectStore(IndexedDBHelper.IDBUCCKey).add(record);
            else
                request = transaction.objectStore(IndexedDBHelper.IDBUCCKey).put(record);

            request.onerror = (ev) => {
                console.log("Fail to put data into the DataBase");
            };
            request.onsuccess = (ev) => {
                console.log("Succeed to put this Record into DataBase");
                if (onSuccess)
                    onSuccess(ev);
            };
        };

        if (IndexedDBHelper.myDataBase)
            putRecord();
        else
            IndexedDBHelper.OpenADBAsync(putRecord);
    }

    public static GetWholeCCFromIDBAsync(refCC:CCFromIDB,onFinish: EventListener = null) {
        var getRefCC = () => {
            var transaction = IndexedDBHelper.myDataBase.transaction([IndexedDBHelper.IDBUCCKey], "readonly");
            var request = transaction
                .objectStore(IndexedDBHelper.IDBUCCKey)
                .openCursor();
            request.addEventListener("success", (ev) => {
                var cursor = (<IDBRequest>(ev.target)).result as IDBCursorWithValue;
                if (cursor) {
                    var value = cursor.value as EachRecord;
                    var ucc = JSON.parse(value.UCC) as UCC;
                    if (ucc.user === GlobalVariables.currentUser) {
                        var history = JSON.parse(value.history) as Array<LVsTime>;
                        if (!refCC[ucc.Container])
                            refCC[ucc.Container] = { Categories: {}, lastNextTime:null };
                        var container = refCC[ucc.Container];
                        if (!container.Categories[ucc.Category])
                            container.Categories[ucc.Category] = {history:null, nextTime:null};
                        var category = container.Categories[ucc.Category];
                        category.history = history;
                        category.nextTime = value.nextTime;
                        container.lastNextTime = (container.lastNextTime) ? Math.min(container.lastNextTime, value.nextTime) : value.nextTime;
                    }
                    cursor.continue();
                } else {
                    if (onFinish) onFinish(ev);
                }
            });
        };

        if (IndexedDBHelper.myDataBase)
            getRefCC();
        else
            IndexedDBHelper.OpenADBAsync(getRefCC);
    };
}