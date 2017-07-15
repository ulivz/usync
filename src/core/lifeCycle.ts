import {ILifecycleMap} from '../types/baseType'

export enum LIFECYCLE {
    appStart = 1,
    taskStart = 2,
    taskEnd = 3,
    appEnd = 4,
    beforeUse = 5,
    init = 6,
}

/**
 * Check if a string only contains Number string
 * @param value
 * @returns {boolean}
 */
function isNumberStr(value: string): boolean {
    // Cannot to use the parseInt API
    // because parseInt will ignore the partial that aren't Number
    var n = Number(value)
    return !isNaN(n)
}

/**
 * Init the life cycle map
 * @returns {ILifecycleMap}
 */
export function init() {
    let list = <ILifecycleMap>{}
    for (let cycle of Object.keys(LIFECYCLE)) {
        if (!isNumberStr(cycle)) {
            list[`${cycle}Quene`] = []
        }
    }
    return <ILifecycleMap>list;
}
