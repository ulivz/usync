
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
}

export interface IFunction {
    (): any;
}

export interface ILifecycleList {
    [key: string]: any;
    start: IFunction[];
    taskStart: IFunction[];
    taskEnd: IFunction[];
    end: IFunction[]
    // start: ((...fn: IFunction[]) => void)[];
    // end: (() => void)[];
}

export interface ILifeCycle {
    [key: string]: any;
    start?(): void;
    end?(): void;
}
