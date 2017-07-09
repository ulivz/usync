import {assign} from './utils'
import {IObject, IOptions, IBaseHandler, IFunction, ILifecycleList, ILifeCycle} from './interface'

enum STATE {
    READY = 0,
    PENDING = 1,
    FULFILLED = 2,
    REJECTED = 3
}

const LIFE_CYCLE = {
    start: 1,
    taskStart: 2,
    taskEnd: 3,
    end: 4
}

type IHandler = Usync | IBaseHandler;
type IState = string | IObject | IObject[];

class Usync {

    private root: IObject;
    private vessel: IObject;
    private defferd: IHandler[];
    private index: number;

    public state: number;
    public startTime: number;
    public __name__: string;
    public __state__: number;

    // Wait to reset value
    private fulfilledBroadcast() {

    }

    constructor(state: IState, options?: IOptions) {

        this.root = Array.isArray(state) ? state :
                typeof state === 'string' ? ((this.name(state)) && <IObject>{}) :
                typeof state === 'object' ? [state] : <IObject>{}

        options = assign({}, options)

        if (<string>options.name) {
            this.name(options.name)
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

    public name(name: string) {
        this.__name__ = name
        return this
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
        let time = new Date().getTime()
        this.root.$time = time - this.startTime
        this.startTime = time

        let argues = [this.root].concat(this.done.bind(this))

        try {

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

    private done() {

        this.currentDefferd.__state__ = STATE.FULFILLED
        this.index++

        // defferd running finished
        if (this.index === this.defferd.length) {
            this.state = STATE.FULFILLED
            this.defferd = []
            this.index = -1
            this.HOOK_END()

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

    catch(fn: IFunction) {
        this.vessel.catch = fn;
        return this;
    }

    start() {
        this.HOOK_START()
        this.startTime = new Date().getTime()
        this.then()
    }

    HOOK_START() {
        this.lifecycleList.start.forEach(start => start.call(this, this.root))
    }

    HOOK_END() {
        this.lifecycleList.end.forEach(end => end.call(this, this.root))
    }

    private lifecycleList = (function () {
        let list = <ILifecycleList>{}
        for (let cycle of Object.keys(LIFE_CYCLE)) {
            list[cycle] = []
        }
        return <ILifecycleList>list;
    })();

    static createApp(state: IState) {
        return new Usync(state)
    }

    static lifecycleList: ILifecycleList = (function () {
        let list = <ILifecycleList>{}
        for (let cycle of Object.keys(LIFE_CYCLE)) {
            list[cycle] = []
        }
        return <ILifecycleList>list;
    })();

    lifecycle(hooks: ILifeCycle) {
        for (let key of Object.keys(this.lifecycleList)) {
            if (hooks[key]) {
                this.lifecycleList[key].push(hooks[key])
            }
        }
    }
}

export = Usync;

