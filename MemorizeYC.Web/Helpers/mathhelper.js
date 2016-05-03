var MathHelper = (function () {
    function MathHelper() {
    }
    MathHelper.Permute = function (oldSet) {
        var newSet = new Array();
        while (oldSet.length > 0) {
            var i0 = Math.round((oldSet.length - 10e-10) * Math.random() - 0.5);
            newSet.push(oldSet[i0]);
            oldSet.splice(i0, 1);
        }
        for (var i0 = 0; i0 < newSet.length; i0++) {
            oldSet.push(newSet[i0]);
        }
        return newSet;
    };
    return MathHelper;
}());
//# sourceMappingURL=mathhelper.js.map