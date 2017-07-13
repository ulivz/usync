import Usync from '../core'

export type IState = string | IObject | IObject[];
export type IHandler = Usync | IBaseHandler;

export interface IObject {
    [key: string]: any;
}

export interface IFunction {
    (param: any): any;
}

export interface IBaseHandler extends IFunction {
    __state__: number;
    duration: number;
    startTime?: number;
    endTime?: number;
}

export interface ILifecycleMap {
    [key: string]: IFunction[];
}

export interface ILifeCycle {
    [key: string]: IFunction;
}

