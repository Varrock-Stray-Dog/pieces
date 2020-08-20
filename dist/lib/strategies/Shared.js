"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classExtends = exports.isClass = void 0;
function isClass(value) {
    return typeof value === 'function' && typeof value.prototype === 'object';
}
exports.isClass = isClass;
function classExtends(value, base) {
    let ctor = value;
    while (ctor !== null) {
        if (ctor === base)
            return true;
        ctor = Object.getPrototypeOf(ctor);
    }
    return false;
}
exports.classExtends = classExtends;
//# sourceMappingURL=Shared.js.map