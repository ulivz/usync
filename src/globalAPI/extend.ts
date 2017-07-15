import {ILifeCycle} from '../types/baseType'
import Usync from '../core'
import {init as initLifeCycle} from '../core/lifeCycle'

export default function initExtend($Usync: typeof Usync) {
    $Usync.extend = function (hooks: ILifeCycle) {
        if (!Usync.prototype.lifecycleMap) {
            Usync.prototype.lifecycleMap = initLifeCycle()
        }
        Usync.prototype.extend.call(Usync.prototype, hooks)
    }
}