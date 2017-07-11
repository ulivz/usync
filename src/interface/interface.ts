
// Random Object
export interface IObject {
    [propName: string]: any;
}

export interface IOptions {
    [key: string]: any;
}

export interface IBaseHandler {
    (): any;
    __state__: number;
    duration: number;
    startTime?: number;
    endTime?: number;
}

export interface IFunction {
    (param: any): any;
}

export interface ILifecycleMap {
    [key: string]: IFunction[];
}

export interface ILifeCycle {
    [key: string]: IFunction;
}
