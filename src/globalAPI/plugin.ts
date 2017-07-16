import {IPlugin, IpluginOpts} from '../types/plugin'
import Usync from '../core'

export default function initPlugin($Usync: typeof Usync) {

    $Usync.plugin = function (plugin: IPlugin, options?: IpluginOpts) {
        if (typeof plugin === 'function') {
            plugin($Usync, options)

        } else if (typeof plugin === 'object' && plugin.install) {
            plugin.install($Usync, options)
        }
    }

}