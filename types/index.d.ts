import {IObject, IState, IOptions, IHandler, IFunction, ILifeCycle} from './Usync'

export declare class Usync {

    constructor(state: IState, options?: IOptions)

    private root: IObject;
    private vessel: IObject;
    private index: number;
    public state: number;
    public startTime: number;
    public endTime: number;
    public __name__: string;
    public __state__: number;

    public fulfilledBroadcast(): void;

    public setName(name: string): Usync;

    public use(handler: IHandler | IHandler[]): Usync;

    private then(): void;

    private setRootProperty(): void;

    private done(): void;

    private runHookByName(hookName: string): void;

    public catch(fn: (err: any) => any): Usync;

    public extend(hooks: ILifeCycle): void;

    private lifecycleList

    static app(state: IState, options?: IOptions): Usync;

    static extend(hooks: ILifeCycle): void;
}




