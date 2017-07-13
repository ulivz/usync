import {IObject} from '../types/baseType'


export function assign(target: IObject, ...restOb: IObject[]): IObject {

    if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object');
    }

    target = Object(target);

    for (var index = 0; index < restOb.length; index++) {
        var source = restOb[index]
        if (source != null) {
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key]
                }
            }
        }
    }

    return target;
};