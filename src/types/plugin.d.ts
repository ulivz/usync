import {IObject} from './baseType'
import Usync from '../core'

declare namespace Plugin {

    export type IPluginFunction = ($Usync: typeof Usync, options?: IpluginOpts) => void;

    export interface IPluginObject {
        install: IPluginFunction;
        [key: string]: any;
    }
}

export type IPlugin = Plugin.IPluginFunction | Plugin.IPluginObject
export type IpluginOpts = IObject | string | number | boolean