const READY = 0
const PENDING = 1
const FULFILLED = 2
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
            // 上一个任务已经FULFILLED, 直接执行下一个任务
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
                console.log('Start Child Task')
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

        // 同步运行调用next，此时后续任务还未被push，直接return
        if (this.$curDefferd === undefined) {
            return

        // 异步任务，后续任务已经push了，但还未执行，执行下一个任务
        } else if (this.$curDefferd.__state__ === undefined) {
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
