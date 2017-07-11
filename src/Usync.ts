import {assign} from './utils'
import {IObject, IOptions, IBaseHandler, IFunction, ILifecycleMap, ILifeCycle} from './interface'

enum STATE {
    READY = 0,
    PENDING = 1,
    FULFILLED = 2,
    REJECTED = 3
}

const LIFE_CYCLE = {
    appStart: 1,
    taskStart: 2,
    taskEnd: 3,
    appEnd: 4
}

type IHandler = Usync | IBaseHandler;
type IState = string | IObject | IObject[];

function initLifecycle() {
    let list = <ILifecycleMap>{}
    for (let cycle of Object.keys(LIFE_CYCLE)) {
        list[cycle + 'Quene'] = []
    }
    return <ILifecycleMap>list;
}

class Usync {

    private root: IObject;
    // private vessel: IObject = {};
    private defferd: IHandler[];
    private index: number;

    public state: number;
    public startTime: number;
    public endTime: number;
    public __name__: string;
    public __state__: number;

    // Wait to reset value
    private fulfilledBroadcast() {

    }

    constructor(state: IState, options?: IOptions) {

        this.root = Array.isArray(state) ? state :
                typeof state === 'string' ? ((this.setName(state)) && <IObject>{}) :
                typeof state === 'object' ? [state] : <IObject>{}

        options = assign({}, options)

        if (<string>options.name) {
            this.setName(options.name)
        }

        this.root.$name = this.__name__

        this.defferd = []
        this.index = -1
        this.state = STATE.READY
    }

    get currentDefferd() {
        return <IHandler>this.defferd[this.index]
    }

    get prevDefferd() {
        return <IHandler>this.defferd[this.index - 1]
    }

    get nextDefferd() {
        return <IHandler>this.defferd[this.index + 1]
    }

    public setName(name: string) {
        this.__name__ = name
        return this
    }

    get name() {
        return this.__name__
    }

    public use(handler: IHandler | IHandler[]) {

        if (Array.isArray(handler)) {
            for (let childHandler of handler) {
                this.use(childHandler)
            }
            return;
        }

        this.defferd.push(handler)

        if (this.defferd.length === 1) {
            this.state = STATE.PENDING
            this.index = 0

        } else {
            // Previous task has been FULFILLED, directly to the next task execution
            if (this.defferd[this.defferd.length - 2].__state__ === STATE.FULFILLED) {
                this.then()
            }
        }

        return this
    }

    private then() {
        // Add Support for time record
        this.currentDefferd.startTime = new Date().getTime()

        let argues = [this.root].concat(this.done.bind(this))

        try {

            this.setRootProperty()
            this.runHookByName('taskStart')

            if (typeof this.currentDefferd === 'function') {
                this.currentDefferd.apply(this, argues)

            } else if (this.currentDefferd instanceof Usync) {
                this.currentDefferd.fulfilledBroadcast = this.done.bind(this)
                this.currentDefferd.start()
            }

        } catch (err) {

            if (this.catch) {
                let errArgues = [err].concat([this.root], this.done.bind(this))
                this.catch.apply(this, errArgues)

            } else {
                throw new Error(err)
            }

        }
    }

    private setRootProperty() {
        this.root.$current = this.currentDefferd
        this.root.$prev = this.prevDefferd
        this.root.$next = this.nextDefferd
    }

    private done() {

        this.currentDefferd.__state__ = STATE.FULFILLED
        this.currentDefferd.endTime = new Date().getTime()
        this.setRootProperty()

        this.runHookByName('taskEnd')
        this.index++

        // defferd running finished
        if (this.index === this.defferd.length) {
            this.state = STATE.FULFILLED
            this.defferd = []
            this.index = -1
            this.runHookByName('appEnd')

            // When a Usync instance set as a child task for another Usync instance
            // fulfilledBroadcast() will tell the parent it was fulfilled
            if (typeof this.fulfilledBroadcast === 'function') {
                this.fulfilledBroadcast()
            }

            return;
        }

        // Synchronous task call next,
        // subsequent task at this time has not yet been push, return directly
        if (this.currentDefferd === undefined) {
            return;
        }
        // Asynchronous task, subsequent task was already pushed
        // but didn't execute
        else if (this.currentDefferd.__state__ === undefined) {
            this.then()
        }
    }

    // catch(fn: IFunction) {
    //     this.vessel.catch = fn;
    //     return this;
    // }

    start() {
        this.runHookByName('appStart')
        this.startTime = new Date().getTime()
        this.then()
    }

    runHookByName(hookName: string) {

        let hook = new Function(`this.lifecycleList.${hookName}Quene.forEach(start => start.call(this, this.root))
        if (this.proto.lifecycleList) {
            var ${hookName}Quene = this.proto.lifecycleList.${hookName}Quene
            ${hookName}Quene.forEach(start => start.call(this, this.root))
        }`)

        hook.call(this)
    }

    get proto() {
        return Object.getPrototypeOf(this);
    }

    extend(hooks: ILifeCycle) {
        for (let key of Object.keys(this.lifecycleList)) {
            let _key = key.replace('Quene', '')
            if (hooks[_key]) {
                this.lifecycleList[key].push(hooks[_key])
            }
        }
    }

    private lifecycleList = initLifecycle();

    static createApp(state: IState) {
        return new Usync(state)
    }

    static extend(hooks: ILifeCycle) {
        Usync.prototype.lifecycleList = initLifecycle();
        Usync.prototype.extend.call(Usync.prototype, hooks)
    }

}

export = Usync;

