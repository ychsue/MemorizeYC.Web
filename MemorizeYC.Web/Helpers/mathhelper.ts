/// <reference path="../scripts/typings/angularjs/angular.d.ts" />
class MathHelper{
    public static Permute =function (oldSet: Array<Object>): Array<Object> {
        var newSet = new Array<Object>();
        while (oldSet.length > 0) {
            var i0: number = MathHelper.MyRandomN(0, oldSet.length-1);
            newSet.push(oldSet[i0]);
            oldSet.splice(i0, 1);
        }

        for (var i0 :number = 0; i0 < newSet.length; i0++){
            oldSet.push(newSet[i0]);
        }
        return newSet;
    }

    /**
     * Return integer number
     *
     */
    public static MyRandomN (iStart: number, iEnd: number): number {
        var ith: number;
        ith = Math.floor((iEnd - iStart + 1 - 1e-10) * Math.random() + iStart);
        return ith;
    }

    /**
     * It is used to find the index of 'element' in 'theArray'. If it cannot find it, it will return -1.
     * @param theArray an array contains the 'element'
     * @param element the one you want to find its index.
     */
    public static FindIndex(theArray: Array<any>, element: any): number {
        if (!theArray || !element)
            return -1;

        for (var i0 = 0; i0 < theArray.length; i0++) {
            if (angular.equals(theArray[i0], element))
                return i0;
        }

        return -1; //If it cannot find the answer, it will sent back -1.
    }
}
