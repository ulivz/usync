(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.D = factory());
}(this, (function () { 'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var READY = 0;
var PENDING = 1;
var FULFILLED = 2;
var Usync = function () {
    function Usync() {
        classCallCheck(this, Usync);


        this.$state = READY;

        if (!arguments[0]) {
            this.$core = [{}];
        } else {
            this.$core = Array.isArray(arguments[0]) ? arguments[0] : [arguments[0]];
        }

        // Add next function to the first core object
        if (!this.$core[0].$done) {
            this.$core[0].next = this.$done.bind(this);
        }

        this.$Defferd = [];
        this.$index = -1;
    }

    createClass(Usync, [{
        key: 'use',
        value: function use(handler) {

            this.$Defferd.push(handler);

            if (this.$Defferd.length === 1) {
                this.$state = PENDING;
                this.$index = 0;
            } else {
                // 上一个任务已经FULFILLED, 直接执行下一个任务
                if (this.$Defferd[this.$Defferd.length - 2].__state__ === FULFILLED) {
                    this.then();
                }
            }
            return this;
        }
    }, {
        key: 'then',
        value: function then() {

            var argues = this.$core.concat(this.$done.bind(this));

            try {

                if (typeof this.$curDefferd === 'function') {
                    this.$curDefferd.apply(this, argues);
                } else if (this.$curDefferd instanceof Usync) {
                    this.$curDefferd.FULFILLED_BROADCAST = this.$done.bind(this);
                    console.log('Start Child Task');
                    this.$curDefferd.start();
                }
            } catch (err) {

                if (this._catch) {
                    var errArgues = [err].concat(this.$core, this.$done.bind(this));
                    this._catch.apply(this, errArgues);
                } else {
                    throw new Error(err);
                }
            }
        }
    }, {
        key: '$done',
        value: function $done() {

            this.$curDefferd.__state__ = FULFILLED;
            this.$index++;

            if (this.$index === this.$Defferd.length) {
                this.$state = FULFILLED;
                this.$Defferd = [];
                this.$index = -1;

                if (typeof this.FULFILLED_BROADCAST === 'function') {
                    this.FULFILLED_BROADCAST();
                }

                return;
            }

            // 同步运行调用next，此时后续任务还未被push，直接return
            if (this.$curDefferd === undefined) {
                return;

                // 异步任务，后续任务已经push了，但还未执行，执行下一个任务
            } else if (this.$curDefferd.__state__ === undefined) {
                this.then();
            }
        }
    }, {
        key: 'catch',
        value: function _catch(fn) {
            this._catch = fn;
            return this;
        }
    }, {
        key: 'start',
        value: function start() {
            this.then();
        }
    }, {
        key: '$curDefferd',
        get: function get$$1() {
            return this.$Defferd[this.$index];
        }
    }], [{
        key: 'app',
        value: function app(opt) {
            return new Usync(opt);
        }
    }]);
    return Usync;
}();

return Usync;

})));
