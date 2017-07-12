"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function assign(target) {
    var restOb = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        restOb[_i - 1] = arguments[_i];
    }
    if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object');
    }
    target = Object(target);
    for (var index = 0; index < restOb.length; index++) {
        var source = restOb[index];
        if (source != null) {
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
    }
    return target;
}
exports.assign = assign;
;
//# sourceMappingURL=utils.js.map