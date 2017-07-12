(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Usync", [], factory);
	else if(typeof exports === 'object')
		exports["Usync"] = factory();
	else
		root["Usync"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="./index.d.ts" />
var Usync_1 = __webpack_require__(1);
module.exports = Usync_1.Usync;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(2);
var lifeCycle_1 = __webpack_require__(3);
var STATE;
(function (STATE) {
    STATE[STATE["READY"] = 0] = "READY";
    STATE[STATE["PENDING"] = 1] = "PENDING";
    STATE[STATE["FULFILLED"] = 2] = "FULFILLED";
    STATE[STATE["REJECTED"] = 3] = "REJECTED";
})(STATE || (STATE = {}));
var Usync = (function () {
    // Wait to reset value
    function Usync(state, options) {
        this.vessel = {};
        this.lifecycleList = lifeCycle_1.default.init();
        this.root = Array.isArray(state) ? state :
            typeof state === 'string' ? ((this.setName(state)) && {}) :
                typeof state === 'object' ? [state] : {};
        options = utils_1.assign({}, options);
        if (options.name) {
            this.setName(options.name);
        }
        this.root.$name = this.__name__;
        this.defferd = [];
        this.index = -1;
        this.state = STATE.READY;
    }
    Usync.prototype.fulfilledBroadcast = function () {
    };
    Object.defineProperty(Usync.prototype, "currentDefferd", {
        get: function () {
            return this.defferd[this.index];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Usync.prototype, "prevDefferd", {
        get: function () {
            return this.defferd[this.index - 1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Usync.prototype, "nextDefferd", {
        get: function () {
            return this.defferd[this.index + 1];
        },
        enumerable: true,
        configurable: true
    });
    Usync.prototype.setName = function (name) {
        this.__name__ = name;
        return this;
    };
    Object.defineProperty(Usync.prototype, "name", {
        get: function () {
            return this.__name__;
        },
        enumerable: true,
        configurable: true
    });
    Usync.prototype.use = function (handler) {
        // Supoort Array syntax
        if (Array.isArray(handler)) {
            for (var _i = 0, handler_1 = handler; _i < handler_1.length; _i++) {
                var childHandler = handler_1[_i];
                this.use(childHandler);
            }
            return this;
        }
        this.defferd.push(handler);
        if (this.defferd.length === 1) {
            this.state = STATE.PENDING;
            this.index = 0;
        }
        else {
            // Previous task has been FULFILLED, directly to the next task execution
            if (this.defferd[this.defferd.length - 2].__state__ === STATE.FULFILLED) {
                this.then();
            }
        }
        return this;
    };
    Usync.prototype.then = function () {
        var _this = this;
        // Add Support for time record
        this.currentDefferd.startTime = new Date().getTime();
        var argues = [this.root].concat(this.done.bind(this));
        try {
            this.setRootProperty();
            this.runHookByName('taskStart');
            if (typeof this.currentDefferd === 'function') {
                var returnValue = this.currentDefferd.apply(this, argues);
                if (returnValue instanceof Promise) {
                    returnValue.then(function () {
                        _this.done.call(_this);
                    }).catch(function (err) {
                        throw err;
                    });
                }
            }
            else if (this.currentDefferd instanceof Usync) {
                this.currentDefferd.fulfilledBroadcast = this.done.bind(this);
                this.currentDefferd.start();
            }
        }
        catch (err) {
            if (this.vessel.catch) {
                var errArgues = [err].concat([this.root], this.done.bind(this));
                this.vessel.catch.apply(this, errArgues);
            }
            else {
                throw new Error(err);
            }
        }
    };
    Usync.prototype.setRootProperty = function () {
        this.root.$current = this.currentDefferd;
        this.root.$prev = this.prevDefferd;
        this.root.$next = this.nextDefferd;
    };
    Usync.prototype.done = function () {
        this.currentDefferd.__state__ = STATE.FULFILLED;
        this.currentDefferd.endTime = new Date().getTime();
        this.setRootProperty();
        this.runHookByName('taskEnd');
        this.index++;
        // defferd running finished
        if (this.index === this.defferd.length) {
            this.state = STATE.FULFILLED;
            this.defferd = [];
            this.index = -1;
            this.runHookByName('appEnd');
            // When a Usync instance set as a child task for another Usync instance
            // fulfilledBroadcast() will tell the parent it was fulfilled
            if (typeof this.fulfilledBroadcast === 'function') {
                this.fulfilledBroadcast();
            }
            return;
        }
        // Synchronous task call next,
        // subsequent task at this time has not yet been push, return directly
        if (this.currentDefferd === undefined) {
            return;
        }
        else if (this.currentDefferd.__state__ === undefined) {
            this.then();
        }
    };
    Usync.prototype.catch = function (fn) {
        this.vessel.catch = fn;
        return this;
    };
    Usync.prototype.start = function () {
        this.runHookByName('appStart');
        this.startTime = new Date().getTime();
        this.then();
    };
    Usync.prototype.runHookByName = function (hookName) {
        var hook = new Function("this.lifecycleList." + hookName + "Quene.forEach(start => start.call(this, this.root))\n        if (this.proto.lifecycleList) {\n            var " + hookName + "Quene = this.proto.lifecycleList." + hookName + "Quene\n            " + hookName + "Quene.forEach(start => start.call(this, this.root))\n        }");
        hook.call(this);
    };
    Object.defineProperty(Usync.prototype, "proto", {
        get: function () {
            return Object.getPrototypeOf(this);
        },
        enumerable: true,
        configurable: true
    });
    Usync.prototype.extend = function (hooks) {
        for (var _i = 0, _a = Object.keys(this.lifecycleList); _i < _a.length; _i++) {
            var key = _a[_i];
            var _key = key.replace('Quene', '');
            if (hooks[_key]) {
                this.lifecycleList[key].push(hooks[_key]);
            }
        }
    };
    Usync.app = function (state) {
        return new Usync(state);
    };
    Usync.extend = function (hooks) {
        Usync.prototype.lifecycleList = lifeCycle_1.default.init();
        Usync.prototype.extend.call(Usync.prototype, hooks);
    };
    return Usync;
}());
exports.Usync = Usync;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function assign(target) {
    var restOb = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        restOb[_i - 1] = arguments[_i];
    }
    if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object');
    }
    target = Object(target);
    for (var index = 0; index < restOb.length; index++) {
        var source = restOb[index];
        if (source != null) {
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
    }
    return target;
}
exports.assign = assign;
;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var LIFE_CYCLE = {
    appStart: 1,
    taskStart: 2,
    taskEnd: 3,
    appEnd: 4
};
exports.default = {
    init: function () {
        var list = {};
        for (var _i = 0, _a = Object.keys(LIFE_CYCLE); _i < _a.length; _i++) {
            var cycle = _a[_i];
            list[cycle + 'Quene'] = [];
        }
        return list;
    }
};


/***/ })
/******/ ]);
});
//# sourceMappingURL=Usync.js.map