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
    public static MyRandomN = function (iStart: number, iEnd: number): number {
        var ith: number;
        ith = Math.floor((iEnd - iStart + 1 - 1e-10) * Math.random() + iStart);
        return ith;
    }
}
