const READY = 0
const PENDING = 1
const FULFILLED = 2

// TODO enhance the error trapping
const REJECTED = 3

export default class Usync {

    constructor() {

        this.$state = READY

        if (!arguments[0]) {
            this.$core = [{}]

        } else {
            this.$core = Array.isArray(arguments[0]) ? arguments[0] : [arguments[0]]
        }

        // Add next function to the first core object
        if (!this.$core[0].$done) {
            this.$core[0].next = this.$done.bind(this)
        }

        this.$Defferd = []
        this.$index = -1
    }

    get $curDefferd() {
        return this.$Defferd[this.$index]
    }

    use(handler) {

        this.$Defferd.push(handler)

        if (this.$Defferd.length === 1) {
            this.$state = PENDING
            this.$index = 0

        } else {
            // Previous task has been FULFILLED, directly to the next task execution
            if (this.$Defferd[this.$Defferd.length - 2].__state__ === FULFILLED) {
                this.then()
            }
        }
        return this
    }

    then() {

        let argues = this.$core.concat(this.$done.bind(this))

        try {

            if (typeof this.$curDefferd === 'function') {
                this.$curDefferd.apply(this, argues)

            } else if (this.$curDefferd instanceof Usync) {
                this.$curDefferd.FULFILLED_BROADCAST = this.$done.bind(this)
                this.$curDefferd.start()
            }

        } catch (err) {

            if (this._catch) {
                let errArgues = [err].concat(this.$core, this.$done.bind(this))
                this._catch.apply(this, errArgues)

            } else {
                throw new Error(err)
            }

        }
    }

    $done() {

        this.$curDefferd.__state__ = FULFILLED
        this.$index++


        if (this.$index === this.$Defferd.length) {
            this.$state = FULFILLED
            this.$Defferd = []
            this.$index = -1

            if (typeof this.FULFILLED_BROADCAST === 'function') {
                this.FULFILLED_BROADCAST()
            }

            return;
        }

        // Synchronous task call next,
        // subsequent task at this time has not yet been push, return directly
        if (this.$curDefferd === undefined) {
            return
        }
        // Asynchronous task, subsequent task was already pushed
        // but didn't execute
        else if (this.$curDefferd.__state__ === undefined) {
            this.then()
        }
    }

    catch(fn) {
        this._catch = fn;
        return this;
    }

    start() {
        this.then()
    }

    static app(opt) {
        return new Usync(opt)
    }

}
