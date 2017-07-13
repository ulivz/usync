import {ILifeCycle} from '../types/baseType'
import Usync from '../core'
import lifeCycle from '../core/lifeCycle'

export default function initExtend($Usync: typeof Usync) {
    $Usync.extend = function (hooks: ILifeCycle) {
        Usync.prototype.lifecycleList = lifeCycle.init();
        Usync.prototype.extend.call(Usync.prototype, hooks)
    }
}