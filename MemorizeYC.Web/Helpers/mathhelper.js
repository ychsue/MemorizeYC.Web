var MathHelper = (function () {
    function MathHelper() {
    }
    MathHelper.Permute = function (oldSet) {
        var newSet = new Array();
        while (oldSet.length > 0) {
            var i0 = MathHelper.MyRandomN(0, oldSet.length - 1);
            newSet.push(oldSet[i0]);
            oldSet.splice(i0, 1);
        }
        for (var i0 = 0; i0 < newSet.length; i0++) {
            oldSet.push(newSet[i0]);
        }
        return newSet;
    };
    /**
     * Return integer number
     *
     */
    MathHelper.MyRandomN = function (iStart, iEnd) {
        var ith;
        ith = Math.floor((iEnd - iStart + 1 - 1e-10) * Math.random() + iStart);
        return ith;
    };
    return MathHelper;
}());
//# sourceMappingURL=mathhelper.js.map