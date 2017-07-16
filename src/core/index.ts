// import {assign} from '../utils/index'
import {init as initlifeCycle, LIFECYCLE as LIFE} from './lifeCycle'
import {IPlugin, IpluginOpts} from '../types/plugin'
import {IObject, IState, IHandler, ILifeCycle, ILifecycleMap, IHookArgs} from '../types/baseType'

enum STATE {
    READY = 0,
    PENDING = 1,
    FULFILLED = 2,
    REJECTED = 3
}

export default class Usync {

    public root: IObject;
    public vessel: IObject = {};
    public defferd: IHandler[];
    public index: number;
    public state: number;
    public startTime: number;
    public endTime: number;
    public __name__: string;
    public __state__: number;
    public depth: number;
    public $parent: Usync;
    public fulfilledBroadcast() {}

    /**
     * Initialize a Usync APP
     * @param state
     * @param options
     */
    constructor(state: IState, options?: IObject) {

        this.root = Array.isArray(state) ? state :
                typeof state === 'string' ? ((this.setName(state)) && <IObject>{}) :
                typeof state === 'object' ? [state] : <IObject>{}

        // options = assign({}, options)

        if (<string>options.name) {
            this.setName(options.name)
        }

        this.root.$name = this.__name__

        this.defferd = []
        this.index = -1
        this.state = STATE.READY
        this.runHook(LIFE[LIFE.init], this)
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

    /**
     * Core method to add task
     * @param handler
     * @returns {Usync}
     */
    public use(handler: IHandler | IHandler[]) {

        // Supoort Array syntax
        if (Array.isArray(handler)) {
            for (let childHandler of handler) {
                this.use(childHandler)
            }
            return this;
        }

        handler.$parent = this
        this.runHook(LIFE[LIFE.beforeUse], this, handler)

        this.defferd.push(<IHandler>handler)

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

    /**
     * Run next task
     */
    then() {
        // Add Support for time record
        this.currentDefferd.startTime = new Date().getTime()

        let argues = [this.root].concat(this.done.bind(this))

        try {

            this.setRootProperty()
            this.runHook(LIFE[LIFE.taskStart], this.root)
            if (typeof this.currentDefferd === 'function') {
                let returnValue = this.currentDefferd.apply(this, argues)

                if (returnValue instanceof Promise) {
                    returnValue.then(() => {
                        this.done.call(this)
                    }).catch(err => {
                        throw err
                    })
                }

            } else if (this.currentDefferd instanceof Usync) {
                this.currentDefferd.fulfilledBroadcast = this.done.bind(this)
                this.currentDefferd.start()
            }

        } catch (err) {

            if (this.vessel.catch) {
                let errArgues = [err].concat([this.root], this.done.bind(this))
                this.vessel.catch.apply(this, errArgues)

            } else {
                throw new Error(err)
            }

        }
    }

    /**
     * Update root state
     */
    setRootProperty() {
        this.root.$current = this.currentDefferd
        this.root.$prev = this.prevDefferd
        this.root.$next = this.nextDefferd
    }

    /**
     * the next()
     */
    done() {

        this.currentDefferd.__state__ = STATE.FULFILLED
        this.currentDefferd.endTime = new Date().getTime()
        this.setRootProperty()

        this.runHook(LIFE[LIFE.taskEnd], this.root)
        this.index++
        // defferd running finished
        if (this.index === this.defferd.length) {
            this.state = STATE.FULFILLED
            this.defferd = []
            this.index = -1
            this.runHook(LIFE[LIFE.appEnd], this.root)

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

    /**
     * Error catch
     * @param fn
     * @returns {Usync}
     */
    public catch(fn: (err: any) => any) {
        this.vessel.catch = fn;
        return this;
    }

    /**
     * A Usync application does not run automatically, start() must be called
     */
    public start() {
        this.runHook(LIFE[LIFE.appStart], this.root)
        this.startTime = new Date().getTime()
        this.then()
    }

    /**
     * Run life cycle hook
     * @param {String} name
     * @param args
     */
    runHook(name: string, ...args: IHookArgs) {
        let hookQuene = `${name}Quene`
        this.lifecycleMap[hookQuene].forEach(hook => hook.apply(this, args))

        if (this.protoLifecycleMap) {
            this.protoLifecycleMap[hookQuene].forEach(hook => hook.apply(this, args))
        }
    }

    get protoLifecycleMap() {
        return <ILifecycleMap>Object.getPrototypeOf(this).lifecycleMap;
    }

    /**
     * Extend through life cycle
     * @param hooks
     */
    public extend(hooks: ILifeCycle) {
        for (let key of Object.keys(this.lifecycleMap)) {
            let _key = key.replace('Quene', '')
            if (hooks[_key]) {
                this.lifecycleMap[key].push(hooks[_key])
            }
        }
    }

    lifecycleMap = <ILifecycleMap>initlifeCycle();

    static plugin(plugin: IPlugin, options?: IpluginOpts) {
    }

    static app(state: IState, options?: IObject) {
        return new Usync(state, options)
    }

    static extend(hooks: ILifeCycle) {
    }
}

