import initPlugin from './plugin'
import initExtend from './extend'
import Usync from '../core'

export default function initGlobalAPI(_Usync: typeof Usync) {
    initPlugin(_Usync)
    initExtend(_Usync)
}